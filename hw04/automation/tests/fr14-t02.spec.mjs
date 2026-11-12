import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { api, assertList, assertRows, categoryRows, openCategories, prepareCategories } from './fr14-support.mjs';

const cases = JSON.parse(readFileSync(new URL('../data/fr14-t02.json', import.meta.url), 'utf8'));

for (const row of cases) {
  test(`[${row.id}] add category with name length ${row.name.length}`, async ({ page, request }, info) => {
    const before = await prepareCategories(request, row.names);
    expect(before.some(category => category.name === row.name)).toBe(false);
    await openCategories(page, before);

    const dialogs = [];
    const statuses = [];
    page.on('dialog', async dialog => {
      dialogs.push(dialog.message());
      await dialog.dismiss();
    });
    page.on('response', response => {
      if (response.url() === api + '/categories' && response.request().method() === 'POST') {
        statuses.push(response.status());
      }
    });

    const input = page.getByPlaceholder('Tên danh mục mới', { exact: true });
    await input.fill(row.name);
    await page.getByRole('button', { name: 'Thêm mới', exact: true }).click();
    await expect.poll(async () => statuses.length > 0 || dialogs.length > 0 ||
      await input.evaluate(element => !element.validity.valid)).toBe(true);
    const invalid = await input.evaluate(element => !element.validity.valid);
    const after = await categoryRows(request);
    await assertRows(page, after);
    await assertList(page, after, () => page.reload());
    const afterReload = await categoryRows(request);
    await info.attach('observations', {
      body: JSON.stringify({ input: row.name, statuses, dialogs, invalid, before, after, afterReload }, null, 2),
      contentType: 'application/json'
    });

    if (row.expected === 'reject') {
      if (after.some(category => category.name === '')) {
        await info.attach('empty-name-after-reload', { body: await page.screenshot(), contentType: 'image/png' });
      }
      expect.soft(invalid || dialogs.length > 0 || statuses.some(status => status >= 400),
        'An empty name must trigger rejection feedback').toBe(true);
      expect.soft(after, 'An empty name must not change the category list').toEqual(before);
      expect(afterReload, 'The original list must persist after reload').toEqual(before);
    } else {
      const originalIds = new Set(before.map(category => category.id));
      const added = after.filter(category => !originalIds.has(category.id));
      expect(added.map(category => category.name), 'Exactly one category was added with the submitted name').toEqual([row.name]);
      expect(after.filter(category => originalIds.has(category.id))).toEqual(before);
      expect(afterReload).toEqual(after);
    }
  });
}
