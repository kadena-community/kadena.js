import type { Page } from '@playwright/test';

export class WebAuthNHelper {
  private readonly _page: Page;

  public constructor(page: Page) {
    this._page = page;
  }

  public async enableWebAuthN(): Promise<void> {
    const cdpSession = await this._page.context().newCDPSession(this._page);
    await cdpSession.send('WebAuthn.enable');
    await cdpSession.send('WebAuthn.addVirtualAuthenticator', {
      options: {
        protocol: 'ctap2',
        transport: 'internal',
        hasUserVerification: true,
        isUserVerified: true,
        hasResidentKey: true,
      },
    });
  }
}