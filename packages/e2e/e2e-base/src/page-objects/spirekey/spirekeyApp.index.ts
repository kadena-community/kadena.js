import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { WebAuthNHelper } from '../../helpers/spirekey/webauthn.helper';

export class SpireKeyIndex {
  public constructor() {}

  public async createSpireKeyAccountFor(
    actor: Page,
    alias: string,
    wait = false,
  ): Promise<void> {
    const webAuthNHelper = new WebAuthNHelper();
    await webAuthNHelper.enableWebAuthN(actor);
    // Create Spirekey Account
    await actor.getByRole('button', { name: 'Register' }).click();
    await actor.getByRole('button', { name: 'Continue' }).click();

    // We should now be on the card overview
    await expect(actor.locator('h2')).toHaveText('Register');
    if (wait) {
      await actor.waitForTimeout(45000);
    }
    await actor.getByRole('button', { name: 'Complete' }).click();
  }

  public async signTransaction(actor: Page): Promise<void> {
    // await expect(
    //   actor.getByRole('heading', { name: 'Sign', exact: true }),
    // ).toBeVisible();
    await actor.getByRole('button', { name: 'Sign' }).click();
  }
}
