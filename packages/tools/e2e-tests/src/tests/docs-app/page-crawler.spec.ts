/* eslint-disable @kadena-dev/no-eslint-disable */
/* eslint-disable playwright/expect-expect */
// The expect is performed by validateTree(), so the test does not need one.
import { test } from '@playwright/test';
import CookieHelper from '../../helpers/docs/cookie.helper';
import TreeHelper from '../../helpers/docs/tree.helper';

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
