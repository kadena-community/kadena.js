import { WebAuthNHelper } from '../../helpers/chainweaver/webauthn.helper';
import { expect  } from '@playwright/test';
import type {Page} from '@playwright/test';

export class RWADemoAppIndex {
  private _webAuthNHelper: WebAuthNHelper = new WebAuthNHelper();
  private _PROFILENAME: string = 'He-man';
  public constructor() {}

  public async login(actor: Page): Promise<boolean> {
    await expect(actor.getByRole('heading' {
      name: 'Login',
    })).toBeVisible();

    return true;
  }
}
