import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { expect, test as base } from '@playwright/test';

export const api = 'http://localhost:3000/api';

export function loadCases(file, validate) {
  const rows = JSON.parse(readFileSync(new URL(`../data/${file}`, import.meta.url), 'utf8'));
  const ids = new Set();
  for (const row of rows) {
    if (!/^FR02-W\d{2}$/.test(row.id) || ids.has(row.id) || !row.title || !validate(row)) {
      throw new Error(`Invalid or duplicate FR-02 data in ${file}: ${row.id}`);
    }
    ids.add(row.id);
  }
  return rows;
}

function freshEmail() {
  return `hw04-${randomUUID()}@example.test`;
}

export const test = base.extend({
  accounts: async ({}, use) => {
    if (process.env.HW04_FRONTEND !== 'web') {
      throw new Error('FR-02 requires HW04_FRONTEND=web and an isolated runtime.');
    }
    const db = new DatabaseSync(join(process.env.HW04_SUT_ROOT, 'backend', 'database.sqlite'), {
      allowExtension: false
    });
    db.exec('PRAGMA busy_timeout = 2000');
    const read = db.prepare('SELECT login_attempts AS attempts, locked_until AS deadline FROM users WHERE id = ?');
    const insert = db.prepare(`INSERT INTO users (name, email, password, role, login_attempts, locked_until)
      VALUES (?, ?, ?, ?, ?, ?)`);
    const remove = db.prepare('DELETE FROM users WHERE id = ?');
    const created = [];

    try {
      await use({
        create({ role = 'user', password = `Pw!${randomUUID()}`, attempts = 0, lockMs } = {}) {
          const email = freshEmail();
          const startedAt = Date.now();
          const deadline = lockMs ? new Date(startedAt + lockMs).toISOString() : null;
          const { lastInsertRowid: id } = insert.run('HW04 Login Fixture', email, password, role, attempts, deadline);
          created.push(id);
          expect(read.get(id), 'Fixture has the requested initial state').toEqual({ attempts, deadline });
          return { email, password, startedAt, state: () => read.get(id) };
        },
        absentEmail() {
          const email = freshEmail();
          expect(db.prepare('SELECT id FROM users WHERE email = ?').get(email)).toBeUndefined();
          return email;
        }
      });
    } finally {
      try {
        for (const id of created) remove.run(id);
      } finally {
        db.close();
      }
    }
  }
});

export function loginForm(page) {
  const form = page.locator('form').filter({ has: page.getByRole('button', { name: 'Sign In', exact: true }) });
  const password = form.locator('input[type="text"]');
  return {
    form,
    email: form.locator('input:not([type="text"])'),
    password,
    submit: form.getByRole('button', { name: 'Sign In', exact: true })
  };
}

export function isLogin(request) {
  return request.method() === 'POST' && request.url() === `${api}/login`;
}

export async function fillLogin(page, email, password) {
  const fields = loginForm(page);
  await fields.email.fill(email);
  await fields.password.fill(password);
  return fields;
}

export async function submitLogin(page, email, password) {
  const fields = await fillLogin(page, email, password);
  const submittedAt = Date.now();
  const [response] = await Promise.all([
    page.waitForResponse(response => isLogin(response.request()), { timeout: 7000 }),
    fields.submit.click()
  ]);
  return { response, submittedAt, receivedAt: Date.now() };
}

export function clientToken(page) {
  return page.evaluate(() => localStorage.getItem('token'));
}

export async function expectDenied(page, { response }) {
  expect.soft(response.status(), 'Server denies the login').toBeGreaterThanOrEqual(400);
  expect.soft(response.status(), 'Denial is a handled client error').toBeLessThan(500);
  expect.soft((await response.json()).token === undefined, 'Response has no JWT').toBe(true);
  const message = page.getByText(/đăng nhập thất bại|không thể đăng nhập|thông tin đăng nhập không hợp lệ/i);
  await expect(message, 'User sees a login error').toBeVisible();
  await expect.soft(page).toHaveURL(/\/login$/);
  expect.soft(await clientToken(page) === null, 'Client has no JWT').toBe(true);
  return (await message.innerText()).trim();
}

export async function expectAccepted(page, { response }) {
  expect(response.ok(), 'Login response is successful').toBe(true);
  const { token } = await response.json();
  expect(typeof token === 'string' && /^[\w-]+\.[\w-]+\.[\w-]+$/.test(token), 'Response has a JWT').toBe(true);
  await expect(page).toHaveURL(url => url.pathname === '/');
  await expect(page.locator('a[href="/profile"]')).toBeVisible();
  expect((await clientToken(page)) === token, 'Client stores the response JWT').toBe(true);
  return token;
}

export async function readAfterFailure(account, before) {
  if (!before.deadline || Date.parse(before.deadline) <= Date.now()) {
    await expect.poll(() => account.state().attempts, {
      timeout: 2000,
      message: 'Observe a persisted counter change after the failed login'
    }).not.toBe(before.attempts);
  }
  return account.state();
}
