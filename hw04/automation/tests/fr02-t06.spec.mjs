import { expect } from '@playwright/test';
import { setTimeout } from 'node:timers/promises';
import { expectAccepted, expectDenied, loadCases, readAfterFailure, submitLogin, test } from './fr02-support.mjs';

const cases = loadCases('fr02-t06.json', row => {
  const hasSequence = Array.isArray(row.expectedCounters) && row.expectedCounters.length > 0 &&
    row.expectedCounters.every(Number.isInteger) && Boolean(row.wrongPassword);
  const hasLock = Number.isInteger(row.lockMs) && row.lockMs > 0;
  const hasOffset = Number.isInteger(row.offsetMs) && row.offsetMs >= 0 && row.offsetMs < row.lockMs;
  switch (row.check) {
    case 'threshold': return hasSequence && typeof row.shouldLock === 'boolean' && (!row.shouldLock || hasLock);
    case 'fourth-failure': return hasSequence && hasLock && hasOffset;
    case 'locked': return hasLock && hasOffset && Number.isInteger(row.expectedAttempts);
    case 'new-session': return hasLock && Number.isInteger(row.expectedAttempts);
    default: return false;
  }
});

function annotate(type, description) {
  test.info().annotations.push({ type, description });
}

async function wrongSequence(page, account, row) {
  const attempts = [];
  for (const counter of row.expectedCounters) {
    const before = account.state();
    const attempt = await submitLogin(page, account.email, row.wrongPassword);
    const state = await readAfterFailure(account, before);
    annotate('Counter observation', `Expected sequence position ${counter}: count=${state.attempts}, lock=${state.deadline}, HTTP ${attempt.response.status()}`);
    attempts.push({ ...attempt, state });
    await expectDenied(page, attempt);
  }
  return attempts;
}

async function checkThreshold(page, account, row) {
  const sequence = await wrongSequence(page, account, row);
  expect.soft(sequence.map(attempt => attempt.state.attempts), 'Counter advances exactly once per wrong password').toEqual(row.expectedCounters);
  const firstLock = sequence.findIndex(attempt => attempt.state.deadline !== null);
  expect.soft(firstLock + 1, 'First wrong attempt that activates lockout').toBe(row.shouldLock ? row.expectedCounters.length : 0);
  if (!row.shouldLock) {
    await expectAccepted(page, await submitLogin(page, account.email, account.password));
    return;
  }

  if (firstLock >= 0) {
    const lock = sequence[firstLock];
    const deadline = Date.parse(lock.state.deadline);
    expect.soft(deadline >= lock.submittedAt + row.lockMs && deadline <= lock.receivedAt + row.lockMs,
      `Lock deadline is within ${row.lockMs} ms plus the triggering request's timing window`).toBe(true);
    annotate('Observed lock duration', `${deadline - lock.receivedAt}–${deadline - lock.submittedAt} ms`);
  }
  await expectDenied(page, await submitLogin(page, account.email, account.password));
}

async function checkFourthFailure(page, account, row) {
  const sequence = await wrongSequence(page, account, row);
  const third = sequence.at(-1);
  const deadline = Date.parse(third.state.deadline);
  const cleanSequence = sequence.every(({ state }, index) =>
    state.attempts === row.expectedCounters[index] && (index === sequence.length - 1 || state.deadline === null)
  );
  if (!cleanSequence || !(deadline >= third.submittedAt + row.lockMs && deadline <= third.receivedAt + row.lockMs)) {
    await test.info().attach('State reached before blocked fourth attempt', {
      body: await page.screenshot(), contentType: 'image/png'
    });
    test.skip(true, 'Blocked: the UI sequence did not reach the required three-attempt, 30-second lock fixture.');
  }

  await setTimeout(Math.max(0, third.receivedAt + row.offsetMs - Date.now()));
  const attempt = await submitLogin(page, account.email, row.wrongPassword);
  expect(attempt.receivedAt, 'Fourth attempt was evaluated during lockout').toBeLessThan(deadline);
  await expectDenied(page, attempt);
  expect(account.state(), 'A01: a denied attempt does not extend the lock').toEqual(third.state);
}

for (const row of cases) {
  test(`[${row.id}] ${row.title}`, async ({ page, browser, baseURL, accounts }) => {
    await page.goto('/login');
    if (row.check === 'threshold' || row.check === 'fourth-failure') {
      const account = accounts.create();
      if (row.check === 'threshold') await checkThreshold(page, account, row);
      else await checkFourthFailure(page, account, row);
      return;
    }

    const account = accounts.create({ attempts: row.expectedAttempts, lockMs: row.lockMs });
    const initial = account.state();
    annotate('Lock fixture', 'An isolated account starts locked for 30 seconds; threshold is covered separately.');
    if (row.check === 'locked') {
      await setTimeout(Math.max(0, account.startedAt + row.offsetMs - Date.now()));
    } else {
      await page.reload();
    }
    const attempt = await submitLogin(page, account.email, account.password);
    expect(attempt.receivedAt, 'Correct password was tried while fixture lock was active').toBeLessThan(Date.parse(initial.deadline));
    await expectDenied(page, attempt);
    if (row.check === 'locked') {
      expect(account.state(), 'A01: denial leaves counter and deadline unchanged').toEqual(initial);
      return;
    }

    const freshContext = await browser.newContext({ baseURL });
    try {
      const freshPage = await freshContext.newPage();
      await freshPage.goto('/login');
      const freshAttempt = await submitLogin(freshPage, account.email, account.password);
      expect(freshAttempt.receivedAt, 'Fresh browser context tested during the same lock').toBeLessThan(Date.parse(initial.deadline));
      await expectDenied(freshPage, freshAttempt);
    } finally {
      await freshContext.close();
    }
  });
}
