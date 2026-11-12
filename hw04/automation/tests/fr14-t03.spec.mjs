import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { api, assertList, assertRows, categoryRows, openCategories, prepareCategories } from './fr14-support.mjs';

const cases = JSON.parse(readFileSync(new URL('../data/fr14-t03.json', import.meta.url), 'utf8'));

for (const row of cases) {
  test(`[${row.id}] delete category and verify persistence`, async ({ page, request }, info) => {
    const before = await prepareCategories(request, row.names);
    const target = before.find(category => category.name === row.target);
    if (!target) throw new Error('Missing target category in the isolated fixture.');
    const expected = before.filter(category => category.id !== target.id);
    await openCategories(page, before);

    page.on('dialog', async dialog => {
      if (dialog.type() === 'confirm') await dialog.accept();
      else await dialog.dismiss();
    });
    const deleted = page.waitForResponse(response => response.url() === api + '/categories/' + target.id &&
      response.request().method() === 'DELETE');
    const targetRow = page.getByRole('row').filter({
      has: page.getByRole('cell', { name: '#' + target.id, exact: true })
    });
    await targetRow.getByRole('button', { name: 'Xóa', exact: true }).click();
    const status = (await deleted).status();
    const after = await categoryRows(request);
    await assertRows(page, expected);
    await assertList(page, expected, () => page.reload());
    const afterReload = await categoryRows(request);
    await info.attach('observations', {
      body: JSON.stringify({ target, status, before, after, afterReload }, null, 2),
      contentType: 'application/json'
    });
    expect(after, 'Only the target category should be removed').toEqual(expected);
    expect(afterReload, 'Deletion should persist after reload').toEqual(expected);
  });
}
