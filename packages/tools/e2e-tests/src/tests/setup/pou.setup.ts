import { test as setup } from '@fixtures/shared/test.fixture';
import { expect } from '@playwright/test';
import path from 'path';

const aliases = [
  { name: 'Persona A', storageState: 'usera' },
  { name: 'Persona B', storageState: 'userb' },
];

for (const alias of aliases) {
  const storageStatePath = path.join(
    __dirname,
    '.storagestate',
    `spirekey-${alias.storageState}.json`,
  );
  setup(
    `Create WebAuthN/SpireKey Account for ${alias.name}`,
    async ({ page, spirekeyApp }) => {
      await setup.step('Navigate to Spirekey', async () => {
        await page.goto('https://webauthn-webshop.vercel.app/');
      });

      await setup.step(`Register new account for ${alias.name}`, async () => {
        await spirekeyApp.welcomePage.clickRegister();
        const result = await spirekeyApp.registerPage.register(alias.name);
        expect(result.status).toBe('success');
      });
      await page.context().storageState({ path: storageStatePath });
    },
  );
}
