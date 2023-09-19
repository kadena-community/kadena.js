import type { ChainId, ICommandResult } from '@kadena/client';
import { Pact } from '@kadena/client';

import { dirtyRead } from '../utils/client';

export function getBalance(
  accountName: string,
  chainId: ChainId,
  networkId: string,
): Promise<ICommandResult> {
  const transaction = Pact.builder
    .execution(Pact.modules.coin['get-balance'](accountName))
    .setMeta({
      chainId,
    })
    .setNetworkId(networkId)
    .createTransaction();

  return dirtyRead(transaction);
}

export async function accountExists(
  accountName: string,
  chainId: ChainId,
  networkId: string,
): Promise<boolean> {
  const { result } = await getBalance(accountName, chainId, networkId);
  return !(
    result.status === 'failure' &&
    (result.error as { message: string }).message.includes('row not found')
  );
}

