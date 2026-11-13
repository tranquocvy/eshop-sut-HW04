import { expect } from '@playwright/test';
import { clientToken, expectDenied, fillLogin, isLogin, loadCases, readAfterFailure, submitLogin, test } from './fr02-support.mjs';

const cases = loadCases('fr02-t05.json', row => {
  switch (row.check) {
    case 'counter': return Boolean(row.wrongPassword) && Number.isInteger(row.expectedAttempts);
    case 'generic-error': return Boolean(row.wrongPassword);
    case 'validation': return ['email', 'password'].includes(row.invalidField) &&
      ['typeMismatch', 'valueMissing'].includes(row.validityFlag) && typeof row[row.invalidField] === 'string';
    default: return false;
  }
});

async function checkValidation(page, account, row) {
  const fields = await fillLogin(page, row.email ?? account.email, row.password ?? account.password);
  const requests = [];
  page.on('request', request => { if (isLogin(request)) requests.push(request); });
  await fields.form.evaluate(form => {
    form.addEventListener('submit', () => { form.dataset.hw04Submitted = 'yes'; }, { capture: true });
  });
  await fields.submit.click();

  if (row.expectedType) await expect.soft(fields.email).toHaveAttribute('type', row.expectedType);
  expect.soft(await fields[row.invalidField].evaluate((input, flag) => input.validity[flag], row.validityFlag),
    `Native constraint validation reports ${row.validityFlag}`).toBe(true);
  expect.soft(await fields.form.getAttribute('data-hw04-submitted'), 'No submit event reached the form').toBeNull();
  expect.soft(requests, 'No login request left the browser').toHaveLength(0);
  await expect.soft(page).toHaveURL(/\/login$/);
  expect.soft(await clientToken(page) === null, 'Client has no JWT').toBe(true);
  expect.soft(account.state()).toEqual({ attempts: 0, deadline: null });
}

for (const row of cases) {
  test(`[${row.id}] ${row.title}`, async ({ page, accounts }) => {
    const account = accounts.create();
    await page.goto('/login');
    if (row.check === 'validation') {
      await checkValidation(page, account, row);
      return;
    }

    const before = account.state();
    const message = await expectDenied(page, await submitLogin(page, account.email, row.wrongPassword));
    if (row.check === 'counter') {
      const after = await readAfterFailure(account, before);
      expect(after).toEqual({ attempts: row.expectedAttempts, deadline: null });
      return;
    }

    await page.goto('/login');
    const unknownMessage = await expectDenied(page, await submitLogin(page, accounts.absentEmail(), account.password));
    expect(unknownMessage, 'Public error text is the same for both failures').toBe(message);
  });
}
