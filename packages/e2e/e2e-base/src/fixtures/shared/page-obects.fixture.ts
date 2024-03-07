import { test as baseTest } from '@playwright/test';
import type { I18nPlaywrightFixture } from 'playwright-i18next-fixture';
import { ToolsAppIndex } from '../../page-objects/tools-app/toolsApp.index';

export const test = baseTest.extend<{
  toolsApp: ToolsAppIndex;
  i18nFixture: I18nPlaywrightFixture;
}>({
  toolsApp: async ({ page }, use) => {
    await use(new ToolsAppIndex(page));
  },
});
