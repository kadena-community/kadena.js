import type {
  ChainwebChainId,
  ChainwebNetworkId,
} from '@kadena/chainweb-node-client';
import {
  createClient,
  isSignedTransaction,
  Pact,
} from '@kadena/client';

import { getKadenaConstantByNetwork } from '@/constants/kadena';
import Debug from 'debug';

const NETWORK_ID: ChainwebNetworkId = 'testnet04';

const debug = Debug('kadena-transfer:services:faucet');

export const createPrincipal = async (
  keys: string[],
  chainId: ChainwebChainId,
  pred = 'keys-all',
): Promise<string | Error> => {
  debug(createPrincipal.name);

  const KEYSET_NAME = 'account_keyset';

  const transaction = Pact.builder
    .execution(`(create-principal (read-keyset '${KEYSET_NAME}))`)
    .addKeyset(KEYSET_NAME, pred, ...keys)
    .setMeta({ chainId })
    .setNetworkId(NETWORK_ID)
    .createTransaction();

  const apiHost = getKadenaConstantByNetwork('testnet04').apiHost({
    networkId: NETWORK_ID,
    chainId,
  });

  const { dirtyRead } = createClient(apiHost);

  if (!isSignedTransaction(transaction)) {
    throw new Error('Transaction is not signed');
  }

  const response = await dirtyRead(transaction);
  console.log(response)

  if (response.result.status === "success") {
    return response.result.data as string;
  }

  console.log(response.result.error, 'error')

  throw new Error((response.result.error as any)?.message || "Unknown error");
};
