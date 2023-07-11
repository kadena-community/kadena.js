import { getKadenaConstantByNetwork, Network } from '@/constants/kadena';
import Debug from 'debug';

export interface ITransaction {
  fromAccount: string;
  height: number;
  amount: string;
  crossChainId?: number;
  toAccount: string;
  blockTime: string;
  requestKey: string;
  token: string;
  blockHash: string;
  idx: number;
  chain: number;
  crossChainAccount?: string;
}
const debug = Debug('kadena-transfer:services:get-transactions');

export async function getTransactions(options: {
  network: Network;
  chain: string;
  account: string;
}): Promise<ITransaction[]> {
  debug(getTransactions.name);

  const { network, chain, account } = options;

  try {
    const result: ITransaction[] = await fetch(
      `https://${getKadenaConstantByNetwork(
        network,
      ).estatsHost()}/txs/account/${account}?token=coin&chain=${chain}&limit=10`,
    ).then((res) => res.json());

    return result;
  } catch (error) {
    debug(error);
  }

  return [];
}
