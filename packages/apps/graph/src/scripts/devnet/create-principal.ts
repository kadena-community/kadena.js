import { Pact, isSignedTransaction } from '@kadena/client';
import { ChainId } from '@kadena/types';
import { devnetConfig } from './config';
import { dirtyRead } from './helper';

export async function createPrincipal({
  keys,
  chainId = devnetConfig.CHAIN_ID,
  pred = 'keys-all',
  keysetName = 'account_keyset',
}: {
  keys: string[];
  chainId?: ChainId;
  pred?: string;
  keysetName?: string;
}): Promise<string> {
  const transaction = Pact.builder
    .execution(`(create-principal (read-keyset '${keysetName}))`)
    .addKeyset(keysetName, pred, ...keys)
    .setMeta({ chainId })
    .setNetworkId(devnetConfig.NETWORK_ID)
    .createTransaction();

  if (!isSignedTransaction(transaction)) {
    throw new Error('Transaction is not signed');
  }

  const response = await dirtyRead(transaction);

  if (response.result.status === 'success') {
    return response.result.data as string;
  }

  throw new Error((response.result.error as any)?.message || 'Unknown error');
}
