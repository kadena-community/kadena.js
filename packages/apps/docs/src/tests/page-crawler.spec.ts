import { test } from '@playwright/test';
import CookieHelper from './helpers/cookie.helper';
import TreeHelper from './helpers/tree.helper';

const pages = [
  'kadena',
  'build',
  'pact',
  'chainweb',
  'marmalade',
  'contribute',
];

for (const pageToCheck of pages) {
  test(`Page: ${pageToCheck} - All Markdown files should be present in the menu`, async ({
    page,
  }) => {
    const treeHelper = new TreeHelper(page);
    const cookieHelper = new CookieHelper(page);

    await page.goto(pageToCheck);
    await cookieHelper.acceptCookies();
    await treeHelper.validateTree(pageToCheck);
  });
}
