import { test } from '@playwright/test';
import { addWithSecondClick, checkAddedProduct, loadCases, prepareCart, validStep } from './fr07-support.mjs';

const cases = loadCases('fr07-t07.json', row =>
  Array.isArray(row.additions) &&
  row.additions.every(step => validStep(step, Number.isSafeInteger(step.quantity) && step.quantity > 0) &&
    Object.keys(step.after).length === 1 && Object.hasOwn(step.after, step.product))
);

if (process.env.HW04_FR07_DIAGNOSTIC === '1') {
  for (const row of cases.filter(entry => entry.additions.length > 0)) {
    test(`[${row.id}] Diagnostic after two clicks — ${row.title}`, async ({ page }, info) => {
      await prepareCart(page, row.initial);
      for (const [index, { product, quantity, after }] of row.additions.entries()) {
        await test.step(`Visit ${index + 1}: apply the workaround and inspect cart contents`, async () => {
          await addWithSecondClick(page, product, quantity, info, index + 1);
          const observed = await checkAddedProduct(page, product, after[product]);
          await info.attach(`step-${index + 1}-cart-observation`, {
            body: JSON.stringify(observed), contentType: 'application/json'
          });
          await info.attach(`step-${index + 1}-cart-after-second-click`, {
            body: await page.screenshot(), contentType: 'image/png'
          });
        });
      }
    });
  }
}
