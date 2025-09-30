const { test, expect } = require('@playwright/test');

test('example test', async ({ page }) => {
  await page.goto('https://example.com');
  await page.screenshot({ path: 'screenshots/example1111.png' });
  await page.screenshot({ path: 'screenshots/example1.png' });
  expect(await page.title()).toBe('Example Domain');
});
