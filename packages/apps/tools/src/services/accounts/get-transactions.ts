import type { ChainwebChainId } from '@kadena/chainweb-node-client';

import type { Network } from '@/constants/kadena';
import { getKadenaConstantByNetwork } from '@/constants/kadena';
import { useWalletConnectClient } from '@/context/connect-wallet-context';
import Debug from 'debug';

export interface ITransaction {
  fromAccount: string;
  height: number;
  amount: string;
  crossChainId?: ChainwebChainId;
  toAccount: string;
  blockTime: string;
  requestKey: string;
  token: string;
  blockHash: string;
  idx: number;
  chain: ChainwebChainId;
  crossChainAccount?: string;
}
const debug = Debug('kadena-transfer:services:get-transactions');

export async function getTransactions(options: {
  network: Network;
  chain: ChainwebChainId;
  account: string;
}): Promise<ITransaction[]> {
  debug(getTransactions.name);
  const { networksData } = useWalletConnectClient();

  const networkDto = networksData.find((item) => item.networkId == network);

  if (!networkDto) {
    // @ts-ignore
    return;
  }

  const { network, chain, account } = options;

  try {
    // @ts-ignore
    const result: ITransaction[] = await fetch(
      `https://${networkDto.API}/txs/account/${account}?token=coin&chain=${chain}&limit=10`,
    ).then((res) => res.json());

    return result;
  } catch (error) {
    debug(error);
  }

  return [];
}
