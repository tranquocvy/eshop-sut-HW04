import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const products = readData('fr07-products.json');
const detailButton = 'Thêm vào giỏ hàng';
const cartPath = url => url.pathname === '/cart';
const homePath = url => url.pathname === '/';

function readData(file) {
  return JSON.parse(readFileSync(new URL(`../data/${file}`, import.meta.url), 'utf8'));
}

function validCart(cart) {
  return cart && typeof cart === 'object' && !Array.isArray(cart) &&
    Object.entries(cart).every(([code, quantity]) =>
      Object.hasOwn(products, code) && Number.isSafeInteger(quantity) && quantity > 0
    );
}

export function loadCases(file, validSteps) {
  const rows = readData(file);
  const ids = new Set();
  for (const row of rows) {
    if (!/^CART-W\d{2}$/.test(row.id) || ids.has(row.id) || !row.title ||
        !row.source || !validCart(row.initial) || !validSteps(row)) {
      throw new Error(`Invalid FR-07 data in ${file}: ${row.id}`);
    }
    ids.add(row.id);
  }
  return rows;
}

export function validStep(step, validInput) {
  return Object.hasOwn(products, step.product) && validInput && validCart(step.after);
}

export function validOutcome(cart) {
  return validCart(cart);
}

function cartLink(page) {
  return page.getByRole('link', { name: /^Giỏ hàng(?:\s|$)/i });
}

export async function openCart(page) {
  await cartLink(page).click();
  await expect(page).toHaveURL(cartPath);
}

async function openHome(page) {
  await page.getByRole('link', { name: 'EShop', exact: true }).click();
  await expect(page).toHaveURL(homePath);
}

function productCard(page, code) {
  return page.getByRole('heading', { name: products[code].name, exact: true }).locator('..');
}

async function productDetail(page, code, quantity) {
  await openHome(page);
  const detail = productCard(page, code).getByRole('link', { name: 'Xem chi tiết', exact: true });
  const href = await detail.getAttribute('href');
  expect(href, 'Seed product has a detail link with an ID').toMatch(/^\/product\/\d+$/);
  await detail.click();
  await expect(page).toHaveURL(url => url.pathname === href);
  await expect(page.getByRole('heading', { level: 1, name: products[code].name, exact: true })).toBeVisible();
  const field = page.getByRole('spinbutton');
  await field.fill(String(quantity));
  await expect(field).toHaveValue(String(quantity));
  return page.getByRole('button', { name: detailButton, exact: true });
}

export function cartRow(page, code) {
  return page.locator('main tbody tr').filter({
    has: page.getByRole('cell', { name: products[code].name, exact: true })
  });
}

function totalLine(page) {
  return page.getByRole('main').getByText(/^Tổng (?:cộng|tạm tính)\s*:/);
}

function money(text) {
  const match = /^\s*(\d+(?:[.,\s]\d{3})*)\s*₫\s*$/u.exec(text);
  return match ? Number(match[1].replace(/[^\d]/g, '')) : null;
}

export async function checkCart(page, expected) {
  await expect(page).toHaveURL(cartPath);
  const entries = Object.entries(expected);
  await expect(page.locator('main tbody tr'), 'Exact cart row count').toHaveCount(entries.length, { timeout: 2000 });

  if (!entries.length) {
    await expect(page.getByRole('main').getByRole('table')).toHaveCount(0);
    await expect(totalLine(page)).toHaveCount(0);
    return;
  }

  let expectedTotal = 0;
  for (const [code, quantity] of entries) {
    const product = products[code];
    const lineTotal = product.price * quantity;
    const row = cartRow(page, code);
    await expect(row, `Unique row for ${product.name}`).toHaveCount(1);
    const cells = row.getByRole('cell');
    const amount = cells.nth(2);
    const input = amount.locator('input');
    const displayedQuantity = await input.count()
      ? await input.inputValue()
      : (await amount.innerText()).replace(/[+−–-]/g, '').trim();

    expect(money(await cells.nth(1).innerText()), `Unit price for ${code}`).toBe(product.price);
    expect(displayedQuantity, `Quantity for ${code}`).toBe(String(quantity));
    expect(money(await cells.nth(3).innerText()), `Line total for ${code}`).toBe(lineTotal);
    expectedTotal += lineTotal;
  }
  await expect(totalLine(page)).toBeVisible();
  const total = (await totalLine(page).innerText()).replace(/^[^:]+:\s*/, '');
  expect(money(total), 'Cart total equals the sum of expected line totals').toBe(expectedTotal);
}

export async function prepareCart(page, initial) {
  await test.step('Verify seed and build an independent cart through the Web UI', async () => {
    if (process.env.HW04_FRONTEND !== 'web') {
      throw new Error('FR-07 requires HW04_FRONTEND=web and the isolated runtime.');
    }
    const response = await page.request.get('http://localhost:3000/api/products');
    expect(response.ok(), 'Seed catalog is available').toBe(true);
    const catalog = await response.json();
    for (const { name, price } of Object.values(products)) {
      const matches = catalog.filter(item => item.name === name);
      expect(matches, `Unique seed product ${name}`).toHaveLength(1);
      expect(Number(matches[0].price), `Seed price for ${name}`).toBe(price);
    }

    await page.goto('/cart');
    await checkCart(page, {});
    for (const [code, quantity] of Object.entries(initial)) {
      if (quantity === 1) {
        await openHome(page);
        await productCard(page, code).getByRole('button', { name: 'Thêm vào giỏ', exact: true }).click();
      } else {
        const button = await productDetail(page, code, quantity);
        // Setup only: the first detail click is ignored by the baseline.
        await button.click();
        await openCart(page);
        if (await cartRow(page, code).count() === 0) {
          // Leave the detail page mounted between clicks so the UI can add the fixture.
          const retry = await productDetail(page, code, quantity);
          await retry.click();
          await retry.click();
        }
      }
    }
    await openCart(page);
    await checkCart(page, initial);
  });
}

export async function addFromDetail(page, product, quantity) {
  const button = await productDetail(page, product, quantity);
  const badge = cartLink(page);
  const before = (await badge.innerText()).trim();
  await button.click();
  const feedback = page.getByRole('main').getByText(/^(Đã thêm|Đã thêm vào giỏ hàng)[.!]?$/i);
  const observed = async () =>
    await feedback.first().isVisible() || (await badge.innerText()).trim() !== before;
  let hasFeedback = false;
  await expect.soft.poll(async () => {
    hasFeedback = await observed();
    return hasFeedback;
  }, { timeout: 1000, message: 'One click gives visible feedback via confirmation or cart badge' }).toBe(true);
  if (!hasFeedback) {
    await test.info().attach('detail-after-single-click', { body: await page.screenshot(), contentType: 'image/png' });
  }
  await openCart(page);
}

export async function addWithSecondClick(page, product, quantity, info, step) {
  const button = await productDetail(page, product, quantity);
  const before = (await cartLink(page).innerText()).trim();
  const feedback = page.getByRole('main').getByText(/^(Đã thêm|Đã thêm vào giỏ hàng)[.!]?$/i);
  await button.click();
  const afterFirst = {
    feedbackVisible: await feedback.first().isVisible(),
    cartLinkChanged: (await cartLink(page).innerText()).trim() !== before
  };
  await info.attach(`step-${step}-after-first-click`, { body: await page.screenshot(), contentType: 'image/png' });
  await info.attach(`step-${step}-first-click-observation`, {
    body: JSON.stringify(afterFirst), contentType: 'application/json'
  });
  // Continue only while the original Add control remains available and no success is visible.
  expect(afterFirst, 'Workaround requires no visible success on the first click').toEqual({
    feedbackVisible: false, cartLinkChanged: false
  });
  await button.click();
  await expect.poll(async () =>
    await feedback.first().isVisible() || (await cartLink(page).innerText()).trim() !== before,
  { message: 'Second click produces visible feedback' }).toBe(true);
  await openCart(page);
}

export async function checkAddedProduct(page, code, quantity) {
  const productRows = cartRow(page, code);
  await expect(productRows.first(), 'At least one row for the added product').toBeVisible();
  await expect.soft(page.locator('main tbody tr'), 'Cart should contain one merged row').toHaveCount(1, { timeout: 1000 });
  const price = products[code].price;
  const observedRows = [];
  let observedQuantity = 0;
  let observedAmount = 0;
  for (const row of await productRows.all()) {
    const cells = row.getByRole('cell');
    const amount = cells.nth(2);
    const input = amount.locator('input');
    const quantityText = await input.count()
      ? await input.inputValue()
      : (await amount.innerText()).replace(/[+−–-]/g, '').trim();
    const units = Number(quantityText);
    const lineAmount = money(await cells.nth(3).innerText());
    expect.soft(Number.isSafeInteger(units) && units > 0, 'Positive integer row quantity').toBe(true);
    expect.soft(money(await cells.nth(1).innerText()), 'Unit price').toBe(price);
    expect.soft(lineAmount, 'Line amount matches displayed quantity').toBe(price * units);
    observedRows.push({ quantity: units, lineAmount });
    observedQuantity += units;
    observedAmount += lineAmount;
  }
  expect.soft(observedQuantity, 'Quantity summed across matching rows').toBe(quantity);
  expect.soft(observedAmount, 'Sum of line amounts').toBe(price * quantity);
  const total = money((await totalLine(page).innerText()).replace(/^[^:]+:\s*/, ''));
  expect.soft(total, 'Displayed cart total').toBe(price * quantity);
  return { rows: observedRows, quantity: observedQuantity, lineAmount: observedAmount, total };
}

export function quantityButton(row, delta) {
  return row.getByRole('button', { name: delta > 0 ? /^(\+|Tăng(?: số lượng)?)$/i : /^([-−–]|Giảm(?: số lượng)?)$/i });
}

export async function checkLayout(page) {
  const headers = page.getByRole('columnheader');
  await expect.soft(headers).toHaveText(['Sản phẩm', 'Đơn giá', 'Số lượng', 'Thành tiền', 'Thao tác'], { timeout: 1500 });
  const rows = page.locator('main tbody tr');
  for (const row of await rows.all()) {
    for (const delta of [1, -1]) {
      await expect.soft(quantityButton(row, delta), `Quantity control ${delta}`).toBeVisible({ timeout: 1000 });
    }
  }
  await expect.soft(page.getByRole('main').getByText(/^Tổng cộng\s*:/), 'Exact total label').toBeVisible({ timeout: 1000 });
}

export async function checkEmptyState(page) {
  await expect.soft(page.getByRole('main').getByText(/giỏ hàng.*trống/i), 'Clear empty-cart message').toBeVisible();
  const illustration = page.locator('main :is(img, svg, canvas, [role="img"]):visible').first();
  await expect.soft(illustration,
    'Visible empty-cart illustration').toBeVisible({ timeout: 1500 });
  if (!await illustration.isVisible()) {
    await test.info().attach('empty-cart-state', { body: await page.screenshot(), contentType: 'image/png' });
  }
}

export async function respondToConfirmation(page, button, accept, checkBefore) {
  let nativePrompt;
  const handleDialog = async dialog => {
    nativePrompt = { type: dialog.type(), message: dialog.message() };
    await (accept && dialog.type() === 'confirm' ? dialog.accept() : dialog.dismiss());
  };
  page.on('dialog', handleDialog);
  try {
    await button.click();
    if (nativePrompt?.type === 'confirm') return true;

    const dialog = page.getByRole('alertdialog').or(page.getByRole('dialog'));
    if (!await dialog.isVisible()) return false;
    await checkBefore();
    const choice = accept ? /^(Xác nhận|Đồng ý|Xóa|OK)$/i : /^(Hủy|Huỷ|Cancel)$/i;
    await dialog.getByRole('button', { name: choice }).click();
    return true;
  } finally {
    page.off('dialog', handleDialog);
  }
}

export async function continueShopping(page, expected) {
  const link = page.getByRole('main').getByRole('link', { name: /^(?:←\s*)?(Tiếp tục mua sắm|Mua tiếp)$/i });
  await link.click();
  await expect(page).toHaveURL(homePath);
  await expect(page.getByRole('heading', { name: 'Danh sách sản phẩm', exact: true })).toBeVisible();
  await openCart(page);
  await checkCart(page, expected);
}
