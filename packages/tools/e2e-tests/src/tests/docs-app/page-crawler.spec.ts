/* eslint-disable @kadena-dev/no-eslint-disable */
/* eslint-disable playwright/expect-expect */
// The expect is performed by validateTree(), so the test does not need one.
import { test } from '@fixtures/shared/test.fixture';

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
    docsApp,
  }) => {
    await page.goto(pageToCheck);
    await docsApp.cookieConsentComponent.acceptCookies();
    await docsApp.menuComponent.validateTree(pageToCheck);
  });
}
