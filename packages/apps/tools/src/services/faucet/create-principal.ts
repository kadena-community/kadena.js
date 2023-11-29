import { getApiHost } from '@/utils/network';
import type { ChainwebChainId } from '@kadena/chainweb-node-client';
import { Pact, createClient, isSignedTransaction } from '@kadena/client';
import Debug from 'debug';

import type { Network } from '@/constants/kadena';
import type { INetworkData } from '@/utils/network';

const debug = Debug('kadena-transfer:services:faucet');

export const createPrincipal = async (
  keys: string[],
  chainId: ChainwebChainId,
  network: Network,
  networksData: INetworkData[],
  pred = 'keys-all',
): Promise<string | Error> => {
  debug(createPrincipal.name);

  const networkDto = networksData.find((item) => item.networkId === network);

  if (!networkDto) {
    throw new Error('Network not found');
  }

  const KEYSET_NAME = 'account_keyset';

  const transaction = Pact.builder
    .execution(`(create-principal (read-keyset '${KEYSET_NAME}))`)
    .addKeyset(KEYSET_NAME, pred, ...keys)
    .setMeta({ chainId })
    .setNetworkId(networkDto.networkId)
    .createTransaction();

  const apiHost = getApiHost({
    api: networkDto.API,
    networkId: networkDto.networkId,
    chainId,
  });

  const { dirtyRead } = createClient(apiHost);

  if (!isSignedTransaction(transaction)) {
    throw new Error('Transaction is not signed');
  }

  const response = await dirtyRead(transaction);

  if (response.result.status === 'success') {
    return response.result.data as string;
  }

  throw new Error((response.result.error as any)?.message || 'Unknown error');
};
