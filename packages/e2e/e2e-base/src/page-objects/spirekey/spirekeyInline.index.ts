import type { CDPSession, Page } from '@playwright/test';
import { WebAuthNHelper } from '../../helpers/spirekey/webauthn.helper';

const webAuthNHelper = new WebAuthNHelper();

export class SpireKeyIndex {
  public constructor() {}

  public async createSpireKeyAccountFor(
    actor: Page,
    wait = false,
    virtualAuthenticator: { authenticatorId: string; cdpSession: CDPSession },
  ): Promise<object> {
    await actor.getByRole('button', { name: 'Register' }).click();
    await actor.getByRole('button', { name: 'Continue' }).click();

    await actor.getByRole('heading', { name: 'Register' }).waitFor();
    if (wait) {
      await actor.waitForTimeout(45000);
    }
    const credential = await webAuthNHelper.getCredential(
      virtualAuthenticator.authenticatorId,
      virtualAuthenticator.cdpSession,
    );
    await actor.getByRole('button', { name: 'Complete' }).click();

    return credential.credentials[0];
  }

  public async signTransaction(actor: Page): Promise<void> {
    await actor.getByRole('heading', { name: 'Permissions' }).waitFor();
    await actor.getByRole('button', { name: 'Sign' }).click();
  }
}
