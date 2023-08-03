import { IPactCommand, Pact, getClient } from '@kadena/client';

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
    .execution((Pact.modules as any).coin['get-balance'](account))
    .setMeta({ sender: account, chainId })
    .setNetworkId(network)
    .createTransaction();

  const { dirtyRead } = getClient();

  const response = await dirtyRead(transaction);

  return {
    network,
    account,
    chain: chainId,
    balance: (response.result as any).data,
  };
}
