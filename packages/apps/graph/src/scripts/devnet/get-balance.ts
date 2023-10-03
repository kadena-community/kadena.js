import { Pact } from '@kadena/client';
import type { IPactDecimal } from '@kadena/types';

import { devnetConfig } from './config';
import type { IAccount } from './helper';
import { dirtyRead } from './helper';

export async function getBalance(account: IAccount): Promise<IPactDecimal> {
  console.log(`Getting balance for ${account.account}`);
  const transaction = Pact.builder
    .execution(Pact.modules.coin['get-balance'](account.account))
    .setMeta({
      chainId: account.chainId || devnetConfig.CHAIN_ID,
    })
    .setNetworkId('fast-development')
    .createTransaction();

  const response = await dirtyRead(transaction);
  console.log('Result', response);

  if (response.result.status === 'success') {
    return (
      (
        await Promise.resolve(
          response.result.data as { decimal?: IPactDecimal },
        )
      )?.decimal || { decimal: '0' }
    );
  } else {
    throw new Error(
      (response.result.error as { message?: string; type?: string })?.message ||
        'Unknown error',
    );
  }
}
