/* eslint-disable @kadena-dev/no-eslint-disable */
/* eslint-disable playwright/expect-expect */
import { test } from '@kadena-dev/e2e-base/src/fixtures/shared/test.fixture';

const pages = ['learn', 'build', 'deploy', 'participate', 'reference'];
for (const pageToCheck of pages) {
  test(`Validate menu structure for: ${pageToCheck}`, async ({
    page,
    docsApp,
  }) => {
    await test.step('Validate "Kadena" menu and subpages', async () => {
      await page.goto(`/${pageToCheck}`);
      await docsApp.treeHelper.validateTree(pageToCheck);
    });
  });
}
