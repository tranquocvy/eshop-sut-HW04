import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { expect, test } from '@playwright/test';

const cases = JSON.parse(readFileSync(new URL('../data/fr14-t01.json', import.meta.url), 'utf8'));
const api = 'http://localhost:3000/api';

function fixture(names) {
  const database = new DatabaseSync(join(process.env.HW04_SUT_ROOT, 'backend', 'database.sqlite'));
  try {
    database.exec('BEGIN IMMEDIATE');
    database.exec('DELETE FROM products; DELETE FROM categories');
    const insert = database.prepare('INSERT INTO categories (name) VALUES (?)');
    const rows = names.map(name => ({ id: Number(insert.run(name).lastInsertRowid), name }));
    database.exec('COMMIT');
    return rows;
  } finally {
    database.close();
  }
}

function credentials(role) {
  const prefix = role === 'admin' ? 'HW04_ADMIN' : 'HW04_USER';
  const email = process.env[prefix + '_EMAIL'];
  const password = process.env[prefix + '_PASSWORD'];
  if (!email || !password) throw new Error('Missing seeded test credentials: ' + prefix);
  return { email, password };
}

async function login(page, role) {
  const { email, password } = credentials(role);
  await page.goto('/');
  await page.getByPlaceholder('Email', { exact: true }).fill(email);
  await page.getByPlaceholder('Password', { exact: true }).fill(password);
  const response = page.waitForResponse(r => r.url() === api + '/login' && r.request().method() === 'POST');
  await page.getByRole('button', { name: 'Login', exact: true }).click();
  return response;
}

async function userToken(request) {
  const response = await request.post(api + '/login', { data: credentials('user') });
  if (!response.ok()) throw new Error('Could not obtain a valid seeded user session.');
  const { user, token } = await response.json();
  if (user?.role !== 'user' || !token) throw new Error('Fixture account is not a normal user.');
  return token;
}

function sortedRows(rows) {
  return [...rows].sort((a, b) => a.id - b.id);
}

async function categoryRows(request) {
  const response = await request.get(api + '/categories');
  if (!response.ok()) throw new Error('Could not read categories to verify the fixture.');
  return sortedRows(await response.json());
}

async function assertList(page, expectedRows, navigate) {
  const loaded = page.waitForResponse(r => r.url() === api + '/categories' && r.request().method() === 'GET');
  await navigate();
  const status = (await loaded).status();
  test.info().annotations.push({ type: 'Category HTTP status', description: String(status) });
  expect([200, 304], 'Category request returned data or revalidated the cache').toContain(status);
  await page.getByText('Danh mục', { exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Quản lý Danh mục', exact: true })).toBeVisible();
  const rows = page.locator('tbody').getByRole('row');
  await expect(rows).toHaveCount(expectedRows.length);
  const expected = expectedRows.map(row => JSON.stringify(['#' + row.id, row.name])).sort();
  await expect.poll(async () => {
    const texts = await rows.evaluateAll(elements => elements.map(row =>
      JSON.stringify([row.cells[0].textContent, row.cells[1].textContent])));
    return texts.sort();
  }).toEqual(expected);
}

async function accessState(page, info, label) {
  const menu = page.getByText('Danh mục', { exact: true });
  const loginHeading = page.getByRole('heading', { name: 'Admin Login', exact: true });
  await expect(menu.or(loginHeading)).toBeVisible();
  if (await menu.isVisible()) await menu.click();
  const state = {
    menu: await menu.isVisible(),
    panel: await page.getByRole('heading', { name: 'Quản lý Danh mục', exact: true }).isVisible(),
    create: await page.getByRole('button', { name: 'Thêm mới', exact: true }).isVisible(),
    login: await loginHeading.isVisible()
  };
  if (state.menu || state.panel || state.create) {
    await info.attach(label + '-access', { body: await page.screenshot(), contentType: 'image/png' });
  }
  return state;
}

async function openRestoredSession(page, navigate) {
  // Wait for the protected request before observing the resolved UI.
  const sessionCheck = page.waitForResponse(r =>
    r.url() === api + '/admin/users' && r.request().method() === 'GET');
  const loaded = page.waitForResponse(r =>
    r.url() === api + '/categories' && r.request().method() === 'GET').catch(() => null);
  await navigate();
  const response = await sessionCheck;
  if (response.ok() || response.status() === 304) {
    const categories = await loaded;
    expect([200, 304], 'Category data loaded for the restored session').toContain(categories?.status());
  }
}

for (const row of cases) {
  test(`[${row.id}] ${row.flow}`, async ({ page, context, request }, info) => {
    const expectedRows = fixture(row.names);
    const before = await categoryRows(request);
    if (JSON.stringify(before) !== JSON.stringify(expectedRows)) {
      throw new Error('Runtime categories do not match the isolated fixture.');
    }

    if (row.flow === 'list') {
      await assertList(page, expectedRows, async () => {
        expect((await login(page, 'admin')).ok(), 'Admin login succeeded').toBe(true);
      });
      await assertList(page, expectedRows, () => page.reload());
      return;
    }

    let current = page;
    const dialogs = [];
    if (row.flow === 'user-login') {
      await userToken(request);
      page.on('dialog', async dialog => {
        dialogs.push(dialog.message());
        await dialog.dismiss();
      });
      expect((await login(page, 'user')).ok(), 'Valid user credentials accepted by login API').toBe(true);
      await expect.poll(async () => dialogs.length > 0 ||
        await page.getByText('Danh mục', { exact: true }).isVisible()).toBe(true);
    } else {
      await page.goto('/');
      if (row.flow === 'user-token') {
        const token = await userToken(request);
        await page.evaluate(value => localStorage.setItem('adminToken', value), token);
        await page.close();
        current = await context.newPage();
        await openRestoredSession(current, () => current.goto('/'));
      }
    }

    const beforeReload = await accessState(current, info, 'before-reload');
    if (row.flow === 'user-token') {
      await openRestoredSession(current, () => current.reload());
    } else {
      await current.reload();
    }
    const afterReload = await accessState(current, info, 'after-reload');
    const after = await categoryRows(request);
    await info.attach('observations', {
      body: JSON.stringify({ beforeReload, afterReload, dialogs, before, after }, null, 2),
      contentType: 'application/json'
    });
    expect(after, 'Access checks must leave category data unchanged').toEqual(before);
    for (const [label, state] of Object.entries({ beforeReload, afterReload })) {
      expect.soft(state.menu || state.panel || state.create, label + ': non-admin management access').toBe(false);
      expect.soft(state.login || dialogs.length > 0, label + ': authentication or denial feedback').toBe(true);
    }
  });
}
