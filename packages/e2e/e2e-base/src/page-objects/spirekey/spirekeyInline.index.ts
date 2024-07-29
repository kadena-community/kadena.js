import type { Page } from '@playwright/test';
import { WebAuthNHelper } from '../../helpers/spirekey/webauthn.helper';

const webAuthNHelper = new WebAuthNHelper();

export class SpireKeyIndex {
  public constructor() {}

  public async createSpireKeyAccountFor(
    actor: Page,
    wait = false,
  ): Promise<object> {
    const authenticator =
      await webAuthNHelper.enableVirtualAuthenticator(actor);

    await actor.getByRole('button', { name: 'Register' }).click();
    await actor.getByRole('button', { name: 'Continue' }).click();

    await actor.getByRole('heading', { name: 'Register' }).waitFor();
    if (wait) {
      await actor.waitForTimeout(45000);
    }
    const credential = await webAuthNHelper.getCredential(
      authenticator.authenticatorId,
      authenticator.cdpSession,
    );
    await actor.getByRole('button', { name: 'Complete' }).click();

    return credential.credentials[0];
  }

  public async signTransaction(actor: Page, credential): Promise<void> {
    await webAuthNHelper.enableVirtualAuthenticator(actor, credential);
    await actor.getByRole('heading', { name: 'Permissions' }).waitFor();
    await actor.getByRole('button', { name: 'Sign' }).click();
  }
}
