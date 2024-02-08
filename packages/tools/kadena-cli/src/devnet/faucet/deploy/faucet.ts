import type { ICommandResult } from '@kadena/client';
import {
  Pact,
  createClient,
  createSignWithKeypair,
  isSignedTransaction,
} from '@kadena/client';
import type { ChainId } from '@kadena/types';

import { DOMAIN, NETWORK_ID, SENDER_00 } from './constants.js';

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const deployFaucet = async ({
  chainId,
  upgrade,
  namespace,
}: {
  chainId: ChainId;
  upgrade: boolean;
  namespace: string;
}): Promise<Record<string, ICommandResult>> => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const __filename = fileURLToPath(import.meta.url);
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const __dirname = path.dirname(__filename);
  const faucetContract = fs.readFileSync(
    path.resolve(__dirname, './../contract/devnet-faucet.pact'),
    'utf-8',
  );

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
