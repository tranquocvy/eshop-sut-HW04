import { expect, test } from '@playwright/test';
import {
  cartRow, checkCart, checkEmptyState, continueShopping, loadCases, prepareCart,
  respondToConfirmation, validOutcome, validStep
} from './fr07-support.mjs';

const cases = loadCases('fr07-t09.json', row =>
  validOutcome(row.after) && (
    row.action === 'empty' ||
    (row.action === 'continue' && validOutcome(row.secondInitial)) ||
    (['cancel', 'confirm'].includes(row.action) && validStep(row, Object.hasOwn(row.initial, row.product)))
  )
);

for (const row of cases) {
  test(`[${row.id}] ${row.title}`, async ({ page, browser }) => {
    await prepareCart(page, row.initial);
    if (row.action === 'empty') {
      await checkCart(page, row.after);
      await checkEmptyState(page);
      return;
    }

    if (row.action === 'continue') {
      await checkEmptyState(page);
      await continueShopping(page, row.after);
      const second = await browser.newPage({ baseURL: new URL(page.url()).origin });
      try {
        await prepareCart(second, row.secondInitial);
        await continueShopping(second, row.secondInitial);
      } finally {
        await second.close();
      }
      return;
    }

    const button = cartRow(page, row.product).getByRole('button', { name: /^Xóa(?: sản phẩm)?$/i });
    const prompted = await respondToConfirmation(page, button, row.action === 'confirm',
      () => checkCart(page, row.initial));
    expect.soft(prompted, 'FR-07 requires confirmation before removing an item').toBe(true);
    await checkCart(page, row.after);
    if (!Object.keys(row.after).length) await checkEmptyState(page);
  });
}
