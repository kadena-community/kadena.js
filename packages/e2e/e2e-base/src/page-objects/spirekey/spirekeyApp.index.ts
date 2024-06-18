import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { WebAuthNHelper } from '../../helpers/spirekey/webauthn.helper';

export class SpireKeyIndex {
  public constructor() {}

  public async createSpireKeyAccountFor(
    actor: Page,
    alias: string,
    wait = true,
  ): Promise<void> {
    const webAuthNHelper = new WebAuthNHelper();
    await webAuthNHelper.enableWebAuthN(actor);
    // Create Spirekey Account
    await actor.getByRole('link', { name: 'Create' }).click();

    // //Enter Alias and Continue
    // await expect(actor.getByRole('heading', { name: 'Alias' })).toBeVisible();
    // await actor.getByPlaceholder('Your alias').fill(alias);
    // await actor.getByRole('button', { name: 'Next' }).click();

    //Enter Passkey and Continue
    await expect(actor.getByRole('heading', { name: 'Passkey' })).toBeVisible();
    await actor.getByAltText('fingerprint icon').click();

    // //set device type
    // await expect(
    //   actor.getByRole('heading', { name: 'Device Type' }),
    // ).toBeVisible();
    // // eslint-disable-next-line playwright/no-wait-for-timeout
    // await actor.waitForTimeout(2000);
    // await actor.getByRole('button', { name: 'Next' }).click();

    // // set color and continue
    // await expect(actor.getByRole('heading', { name: 'Color' })).toBeVisible();
    // await actor.getByRole('button', { name: 'Complete' }).click();
    // //await actor.goBack()

    // We should now be on the card overview
    await expect(actor.locator('h4')).toHaveText('Connect');
    await actor.getByTestId('card').click();
    await actor.getByRole('button', { name: 'Connect' }).click();
    if (wait) {
      await actor.waitForTimeout(45000);
    }
  }

  public async signTransaction(actor: Page): Promise<void> {
    await expect(
      actor.getByRole('heading', { name: 'Sign', exact: true }),
    ).toBeVisible();
    await actor.getByRole('button', { name: 'Sign' }).click();
  }
}
