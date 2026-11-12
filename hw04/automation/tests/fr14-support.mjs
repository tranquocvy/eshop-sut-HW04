import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { expect, test } from '@playwright/test';

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
  await assertRows(page, expectedRows);
}

async function assertRows(page, expectedRows) {
  const rows = page.locator('tbody').getByRole('row');
  await expect(rows).toHaveCount(expectedRows.length);
  const expected = expectedRows.map(row => JSON.stringify(['#' + row.id, row.name])).sort();
  await expect.poll(async () => {
    const texts = await rows.evaluateAll(elements => elements.map(row =>
      JSON.stringify([row.cells[0].textContent, row.cells[1].textContent])));
    return texts.sort();
  }).toEqual(expected);
}

export async function openCategories(page, expectedRows) {
  await assertList(page, expectedRows, async () => {
    expect((await login(page, 'admin')).ok(), 'Admin login succeeded').toBe(true);
  });
}

export async function prepareCategories(request, names) {
  const expectedRows = fixture(names);
  const before = await categoryRows(request);
  if (JSON.stringify(before) !== JSON.stringify(expectedRows)) {
    throw new Error('Runtime categories do not match the isolated fixture.');
  }
  return before;
}

export { api, assertList, assertRows, categoryRows, credentials, login };
