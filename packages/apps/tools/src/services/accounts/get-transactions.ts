import type { ChainwebChainId } from '@kadena/chainweb-node-client';

import type { Network } from '@/constants/kadena';
import type { INetworkData } from '@/utils/network';
import { getEstatsHost } from '@/utils/network';
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
  networksData: INetworkData[];
}): Promise<ITransaction[] | null> {
  debug(getTransactions.name);
  const { network, chain, account, networksData } = options;

  const networkDto = networksData.find((item) => item.networkId === network);

  if (!networkDto) {
    return null;
  }

  try {
    return await fetch(
      getEstatsHost({ api: networkDto.ESTATS, account, chain}),
    ).then((res) => res.json() as unknown as ITransaction[]);
  } catch (error) {
    debug(error);
  }

  return [];
}
