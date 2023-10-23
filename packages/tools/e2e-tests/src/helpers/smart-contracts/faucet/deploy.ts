import { ChainwebChainId } from '@kadena/chainweb-node-client';
import { createAdmin } from './deploy/createAdmin';
import { deployFaucet } from './deploy/deployFaucet';

import { expect } from '@playwright/test';
import { fundFaucet } from './deploy/fundFaucet';

export class FaucetContract {
  public constructor() {}

  async deployInOrder(chain: ChainwebChainId): Promise<void> {
    await createAdmin({ chainId: chain, upgrade: false });
    expect(await deployFaucet({ chainId: chain, upgrade: true })).toBe(
      'success',
    );

    expect(await fundFaucet({ chainId: chain })).toBe('success');
  }
}
