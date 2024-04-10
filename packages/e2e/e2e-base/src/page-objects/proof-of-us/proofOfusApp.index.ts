import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { WebAuthNHelper } from '../../helpers/spirekey/webauthn.helper';

export class ProofOfUsAppIndex {
  public constructor() {}

  public async createProofWith(actor: Page, title: string): Promise<string> {
    // Navigate to the dashboard
    await actor.getByRole('button', { name: 'GO TO DASHBOARD' }).click();
    await actor.getByRole('link', { name: 'Go check it out!' }).click();

    // Make a photo
    await actor.getByRole('button', { name: 'capture' }).click();

    // add title and generate QR code
    await actor.getByRole('textbox', { name: 'Title' }).fill(title);
    await actor.getByRole('button', { name: 'SHARE' }).click();

    // copy QR code
    await actor.locator('#react-qrcode-logo').click();
    const shareUrl: string = await actor.evaluate(
      'navigator.clipboard.readText()',
    );

    return shareUrl;
  }

  public async startSigningProcessWith(actor: Page) {
    await actor.getByRole('button', { name: 'START SIGNING' }).click();
  }

  public async signProofWith(actor: Page) {
  await actor.getByRole('button', { name: 'SIGN' }).click();
  }

  public async uploadProofWith(actor: Page) {
  await actor.getByRole('button', { name: 'SIGN & UPLOAD' }).waitFor();
  await actor.getByRole('button', { name: 'SIGN & UPLOAD' }).click()
  }
}
