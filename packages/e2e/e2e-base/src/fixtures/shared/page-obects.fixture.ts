import { test as baseTest } from '@playwright/test';
import { DocsAppIndex } from '../../page-objects/docs-app/docsApp.index';
import { ProofOfUsAppIndex } from '../../page-objects/proof-of-us/proofOfusApp.index';
import { SpireKeyIndex } from '../../page-objects/spirekey/spirekeyInline.index';
import { ToolsAppIndex } from '../../page-objects/tools-app/toolsApp.index';

export const test = baseTest.extend<{
  toolsApp: ToolsAppIndex;
  docsApp: DocsAppIndex;
  proofOfusApp: ProofOfUsAppIndex;
  spirekeyApp: SpireKeyIndex;
}>({
  toolsApp: async ({ page }, use) => {
    await use(new ToolsAppIndex(page));
  },
  docsApp: async ({ page }, use) => {
    await use(new DocsAppIndex(page));
  },
  proofOfusApp: async ({}, use) => {
    await use(new ProofOfUsAppIndex());
  },
  spirekeyApp: async ({}, use) => {
    await use(new SpireKeyIndex());
  },
});
