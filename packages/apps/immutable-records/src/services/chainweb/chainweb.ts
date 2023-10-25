import type { IPactCommand } from '@kadena/client';
import { createClient, Pact } from '@kadena/client';

export interface BalanceItem {
  network: IPactCommand['networkId'];
  account: string;
  chain: IPactCommand['meta']['chainId'];
  balance: string;
}

export async function getBalance(
  account: string,
  network: IPactCommand['networkId'],
  chainId: IPactCommand['meta']['chainId'],
): Promise<BalanceItem> {
  const transaction = Pact.builder
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .execution((Pact.modules as any).coin['get-balance'](account))
    .setMeta({ senderAccount: account, chainId })
    .setNetworkId(network)
    .createTransaction();

  const { dirtyRead } = createClient();

  const response = await dirtyRead(transaction);

  return {
    network,
    account,
    chain: chainId,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    balance: (response.result as any).data,
  };
}
