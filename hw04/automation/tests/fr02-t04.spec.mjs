import { expect } from '@playwright/test';
import { api, expectAccepted, loadCases, submitLogin, test } from './fr02-support.mjs';

const cases = loadCases('fr02-t04.json', row =>
  ['user', 'admin'].includes(row.role) && typeof row.password === 'string' &&
  typeof row.checkProfile === 'boolean'
);

for (const row of cases) {
  test(`[${row.id}] ${row.title}`, async ({ page, accounts }) => {
    const account = accounts.create(row);
    await page.goto('/login');
    const token = await expectAccepted(page, await submitLogin(page, account.email, account.password));
    if (!row.checkProfile) return;

    const profileLink = page.locator('a[href="/profile"]');
    await profileLink.click();
    await expect(page.getByRole('heading', { name: 'Hồ sơ của bạn' })).toBeVisible();
    const [profile] = await Promise.all([
      page.waitForResponse(response => response.url() === `${api}/users/me` &&
        response.request().method() === 'GET'),
      page.reload()
    ]);
    expect(profile.ok(), 'Authenticated profile request succeeded').toBe(true);
    expect((await profile.request().headerValue('authorization')) === `Bearer ${token}`,
      'Authenticated profile request uses the same JWT').toBe(true);
    expect((await profile.json()).email).toBe(account.email);
    await expect(page.getByRole('heading', { name: 'Hồ sơ của bạn' })).toBeVisible();
    await expect(page.locator('form input[disabled]')).toHaveValue(account.email);
  });
}
