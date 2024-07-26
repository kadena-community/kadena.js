import type {
  Browser,
  BrowserContext,
  CDPSession,
  Page,
} from '@playwright/test';

export class WebAuthNHelper {
  private context: BrowserContext;
  public async enableWebAuthN(
    actor: Page,
    browser?: Browser,
  ): Promise<CDPSession> {
    if (!this.context) {
      const contexts = await browser!.contexts();
      this.context = await contexts[contexts.length - 1];
    }
    const cdpSession = await this.context.newCDPSession(actor);
    await cdpSession.send('WebAuthn.enable');
    await cdpSession.send('WebAuthn.addVirtualAuthenticator', {
      options: {
        protocol: 'ctap2',
        ctap2Version: 'ctap2_1',
        transport: 'internal',
        hasUserVerification: true,
        isUserVerified: true,
        hasResidentKey: true,
      },
    });

    return cdpSession;
  }
}
