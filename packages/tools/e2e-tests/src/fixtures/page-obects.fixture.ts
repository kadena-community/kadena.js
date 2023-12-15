import { test as baseTest } from '@playwright/test';
import { MockHelper } from '../helpers/mock.helper';
import { ToolsAppIndex } from '../page-objects/tools-app/toolsApp.index';
import type { I18nPlaywrightFixture } from 'playwright-i18next-fixture';

export const test = baseTest.extend<{
  toolsApp: ToolsAppIndex;
  mockHelper: MockHelper;
  i18nFixture: I18nPlaywrightFixture
}>({
  toolsApp: async ({ page }, use) => {
    await use(new ToolsAppIndex(page));
  },
  mockHelper: async ({ page }, use) => {
    await use(new MockHelper(page));
  },
});
