import type { CDPSession, Page } from '@playwright/test';

export class WebAuthNHelper {
  public async enableWebAuthN(
    actor: Page,
  ): Promise<{ id: string; cdp: CDPSession }> {
    console.log(99999999);
    const cdpSession = await actor.context().newCDPSession(actor);
    await cdpSession.send('WebAuthn.enable');
    const id = await cdpSession.send('WebAuthn.addVirtualAuthenticator', {
      options: {
        protocol: 'ctap2',
        ctap2Version: 'ctap2_1',
        transport: 'internal',
        hasUserVerification: true,
        isUserVerified: true,
        hasResidentKey: true,
      },
    });

    return {
      id: id.authenticatorId,
      cdp: cdpSession,
    };
  }
}
