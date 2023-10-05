import { test as baseTest } from '@playwright/test';
import ToolsAppIndex from './tools/tools.app.index';

export const test = baseTest.extend<{
    tools: ToolsAppIndex;
}>({
    tools: async ({ page }, use) => {
        await use(new ToolsAppIndex(page));
    },
});
