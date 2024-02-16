import { DocsAppIndex } from '@page-objects/docs/docsApp.index';
import { test as baseTest } from '@playwright/test';
import type { I18nPlaywrightFixture } from 'playwright-i18next-fixture';
import { PouAppIndex } from '../../page-objects/proof-of-us/pou.index';
import { SpirekeyAppIndex } from '../../page-objects/spirekey/spirekey.index';
import { ToolsAppIndex } from '../../page-objects/tools-app/toolsApp.index';

export const test = baseTest.extend<{
  toolsApp: ToolsAppIndex;
  docsApp: DocsAppIndex;
  pouApp: PouAppIndex;
  spirekeyApp: SpirekeyAppIndex;
  i18nFixture: I18nPlaywrightFixture;
}>({
  toolsApp: async ({ page }, use) => {
    await use(new ToolsAppIndex(page));
  },
  docsApp: async ({ page }, use) => {
    await use(new DocsAppIndex(page));
  },
  pouApp: async ({ page }, use) => {
    await use(new PouAppIndex(page));
  },
  spirekeyApp: async ({ page }, use) => {
    await use(new SpirekeyAppIndex(page));
  },
});
