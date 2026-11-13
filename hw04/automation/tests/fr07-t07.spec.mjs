import { test } from '@playwright/test';
import { addFromDetail, checkCart, checkLayout, loadCases, prepareCart, validStep } from './fr07-support.mjs';

const cases = loadCases('fr07-t07.json', row =>
  Array.isArray(row.additions) && (row.additions.length > 0 || row.checkLayout === true) &&
  row.additions.every(step => validStep(step, Number.isSafeInteger(step.quantity) && step.quantity > 0))
);

for (const row of cases) {
  test(`[${row.id}] ${row.title}`, async ({ page }) => {
    await prepareCart(page, row.initial);
    for (const { product, quantity, after } of row.additions) {
      await test.step(`Click Add once for ${product} × ${quantity} and verify the cart`, async () => {
        await addFromDetail(page, product, quantity);
        await checkCart(page, after);
      });
    }
    if (row.checkLayout) await checkLayout(page);
  });
}
