import type { CDPSession, Page } from '@playwright/test';

export class WebAuthNHelper {
  public async enableVirtualAuthenticator(
    actor: Page,
    credentials?,
  ): Promise<{ authenticatorId: string; cdpSession: CDPSession }> {
    const cdpSession = await actor.context().newCDPSession(actor);
    await cdpSession.send('WebAuthn.enable');
    const result = await cdpSession.send('WebAuthn.addVirtualAuthenticator', {
      options: {
        protocol: 'ctap2',
        ctap2Version: 'ctap2_1',
        transport: 'internal',
        hasUserVerification: true,
        isUserVerified: true,
        hasResidentKey: true,
      },
    });

    if (credentials !== undefined) {
      await this.addCredential(result.authenticatorId, credentials, cdpSession);
    }
    return {
      authenticatorId: result.authenticatorId,
      cdpSession: cdpSession,
    };
  }

  public async getCredential(authenticatorId: string, cdpSession: CDPSession) {
    return cdpSession.send('WebAuthn.getCredentials', {
      authenticatorId,
    });
  }

  public async addCredential(authenticatorId, credential, cdpSession) {
    cdpSession.send('WebAuthn.addCredential', { authenticatorId, credential });
  }
}
