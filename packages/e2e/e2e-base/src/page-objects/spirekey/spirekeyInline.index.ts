import type { Browser, CDPSession, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import type { WebAuthNHelper } from '../../helpers/spirekey/webauthn.helper';

export class SpireKeyIndex {
  public constructor() {}

  public async createSpireKeyAccountFor(
    webAuthNHelper: WebAuthNHelper,
    actor: Page,
    alias: string,
    wait = false,
  ): Promise<void> {
    await webAuthNHelper.enableWebAuthN(actor);
    await actor.getByRole('button', { name: 'Register' }).click();
    await actor.getByRole('button', { name: 'Continue' }).click();

    // We should now be on the card overview
    await expect(actor.locator('h2')).toHaveText('Register');
    if (wait) {
      await actor.waitForTimeout(10000);
    }
    await actor.getByRole('button', { name: 'Complete' }).click();
    // Create Spirekey Account

    // return session;
  }

  public async signTransaction(
    webAuthNHelper: WebAuthNHelper,
    actor: Page,
  ): Promise<void> {
    await webAuthNHelper.enableWebAuthN(actor);
    await actor.getByRole('button', { name: 'Sign' }).click();
    //return session;
  }
}
