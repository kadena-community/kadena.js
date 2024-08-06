import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class ProofOfUsAppIndex {
  public constructor() {}

  public async createProofWith(actor: Page, title: string): Promise<string> {
    // Navigate to the dashboard
    await actor
      .getByRole('button', { name: 'GO TO DASHBOARD' })
      .first()
      .click();
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

  public async disableSigningFor(
    actor: Page,
    targetSignee: string,
  ): Promise<void> {
    await actor
      .locator(`span:text-is("${targetSignee}")`)
      .dragTo(actor.locator(`span:text-is("${targetSignee}") + span`));
    const listItem = actor
      .locator(`.swipeable-list-item`)
      .filter({ has: actor.locator(`span:text-is("${targetSignee}")`) });
    await actor.waitForTimeout(1000);
    //await listItem.locator('data-testid="leading-actions" > span > div > svg').click()
    await listItem.getByTestId('leading-actions').locator('span > div').click();
  }
  public async startSigningProcessWith(actor: Page): Promise<void> {
    await actor.getByRole('button', { name: 'START SIGNING' }).click();
  }

  public async signProofWith(actor: Page): Promise<void> {
    await actor.waitForTimeout(1000);
    await actor.getByRole('button', { name: 'SIGN' }).first().click();
  }

  public async uploadProofWith(actor: Page): Promise<void> {
    await actor.getByRole('button', { name: 'SIGN & MINT' }).waitFor();
    await actor.getByRole('button', { name: 'SIGN & MINT' }).first().click();
  }
  public async countallSigners(
    actor: Page,
    expectedSigneeCount: number,
  ): Promise<void> {
    await expect(actor.locator('.swipeable-list-item')).toHaveCount(
      expectedSigneeCount,
    );
  }
}
