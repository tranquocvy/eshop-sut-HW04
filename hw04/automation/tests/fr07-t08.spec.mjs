import { expect, test } from '@playwright/test';
import {
  cartRow, checkCart, loadCases, prepareCart, quantityButton, respondToConfirmation, validStep
} from './fr07-support.mjs';

const cases = loadCases('fr07-t08.json', row =>
  Array.isArray(row.changes) && row.changes.length > 0 &&
  row.changes.every(step => validStep(step, [1, -1].includes(step.delta)))
);

for (const row of cases) {
  test(`[${row.id}] ${row.title}`, async ({ page }) => {
    await prepareCart(page, row.initial);
    for (const { product, delta, after } of row.changes) {
      const changed = await test.step(`Change the quantity of ${product} by ${delta}`, async () => {
        const button = quantityButton(cartRow(page, product), delta);
        await expect.soft(button, 'FR-07 requires a visible quantity control for the selected item').toBeVisible({ timeout: 1500 });
        if (!await button.isVisible()) {
          await checkCart(page, row.initial);
          return false;
        }
        if (!row.minimum) {
          await button.click();
        } else if (await button.isEnabled()) {
          await respondToConfirmation(page, button, false, () => checkCart(page, row.initial));
        }
        await checkCart(page, after);
        return true;
      });
      if (!changed) break;
    }
  });
}
