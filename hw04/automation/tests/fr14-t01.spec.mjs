import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { api, assertList, categoryRows, credentials, login, openCategories, prepareCategories } from './fr14-support.mjs';

const cases = JSON.parse(readFileSync(new URL('../data/fr14-t01.json', import.meta.url), 'utf8'));
async function userToken(request) {
  const response = await request.post(api + '/login', { data: credentials('user') });
  if (!response.ok()) throw new Error('Could not obtain a valid seeded user session.');
  const { user, token } = await response.json();
  if (user?.role !== 'user' || !token) throw new Error('Fixture account is not a normal user.');
  return token;
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
    const before = await prepareCategories(request, row.names);

    if (row.flow === 'list') {
      await openCategories(page, before);
      await assertList(page, before, () => page.reload());
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
