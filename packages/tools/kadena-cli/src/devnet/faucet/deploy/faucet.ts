import type { ICommandResult } from '@kadena/client';
import {
  Pact,
  createClient,
  createSignWithKeypair,
  isSignedTransaction,
} from '@kadena/client';
import type { ChainId } from '@kadena/types';

import { faucetContract } from '../contract/devnet-faucet.js';
import { DOMAIN, NETWORK_ID, SENDER_00 } from './constants.js';

export const deployFaucet = async ({
  chainId,
  upgrade,
  namespace,
}: {
  chainId: ChainId;
  upgrade: boolean;
  namespace: string;
}): Promise<Record<string, ICommandResult>> => {
  const transaction = Pact.builder
    .execution(faucetContract)
    .addData('init', !upgrade)
    .addData('coin-faucet-namespace', namespace)
    .addData('coin-faucet-admin-keyset-name', `${namespace}.admin-keyset`)
    .addSigner(SENDER_00.publicKey)
    .setMeta({
      chainId,
      gasPrice: 0.000001,
      gasLimit: 70000,
      ttl: 28800,
      senderAccount: SENDER_00.accountName,
    })
    .setNetworkId(NETWORK_ID)
    .createTransaction();

  const signWithKeyPair = createSignWithKeypair([
    {
      publicKey: SENDER_00.publicKey,
      secretKey: SENDER_00.secretKey,
    },
  ]);

  const signedTx = await signWithKeyPair(transaction);

  if (!isSignedTransaction(signedTx)) {
    throw new Error('Transaction is not signed');
  }

  const { submit, pollStatus } = createClient(({ chainId, networkId }) => {
    return `${DOMAIN}/chainweb/0.0/${networkId}/chain/${chainId}/pact`;
  });

  const requestKeys = await submit(signedTx);

  const result = await pollStatus(requestKeys);

  return result;
};
