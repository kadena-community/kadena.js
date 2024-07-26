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
    await actor.getByRole('button', { name: 'Register' }).click();
    await actor.getByRole('button', { name: 'Continue' }).click();

    // We should now be on the card overview
    await expect(actor.locator('h2')).toHaveText('Register');
    if (wait) {
      await actor.waitForTimeout(45000);
    }
    await actor.getByRole('button', { name: 'Complete' }).click();
    // Create Spirekey Account
  }

  public async signTransaction(actor: Page): Promise<void> {
    const webAuthNHelper = new WebAuthNHelper();
    await webAuthNHelper.enableWebAuthN(actor);
    await expect(actor.locator('h2')).toHaveText('Permissions');
    console.log(5555);
    await actor.getByRole('button', { name: 'Sign' }).click();
    console.log(42342);
  }
}
