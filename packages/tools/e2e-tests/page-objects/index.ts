import MockHelper from '../helpers/mock.helper';

import ToolsAppIndex from './tools-app/toolsApp.index';

import { test as baseTest } from '@playwright/test';

export const test = baseTest.extend<{
  toolsApp: ToolsAppIndex;
  mockHelper: MockHelper;
}>({
  toolsApp: async ({ page }, use) => {
    await use(new ToolsAppIndex(page));
  },
  mockHelper: async ({ page }, use) => {
    await use(new MockHelper(page));
  },
});
