import type { ChainwebChainId } from '@kadena/chainweb-node-client';
import { createClient, isSignedTransaction, Pact } from '@kadena/client';

import { ADMIN, DOMAIN, NETWORK_ID } from './constants';

import { sign } from '@kadena/cryptography-utils';
import fs from 'fs';
import path from 'path';

export const deployFaucet = async ({
  chainId,
  upgrade,
  namespace,
}: {
  chainId: ChainwebChainId;
  upgrade: boolean;
  namespace: string;
}) => {
  const faucetContract = fs.readFileSync(
    path.resolve(__dirname, './../../contract/testnet-faucet.pact'),
    'utf-8',
  );

  const deployFaucetTx = Pact.builder
    .execution(faucetContract)
    .addData('init', !upgrade)
    .addData('coin-faucet-namespace', namespace)
    .addData('coin-faucet-admin-keyset-name', `${namespace}.admin-keyset`)
    .addSigner(ADMIN.publicKey)
    .setMeta({
      chainId,
      gasPrice: 0.000001,
      gasLimit: 70000,
      ttl: 28800,
      senderAccount: ADMIN.accountName,
    })
    .setNetworkId(NETWORK_ID)
    .createTransaction();

  const signature = sign(deployFaucetTx.cmd, {
    publicKey: ADMIN.publicKey,
    secretKey: ADMIN.privateKey,
  });

  if (signature.sig === undefined) {
    throw new Error('Failed to sign transaction');
  }

  deployFaucetTx.sigs = [{ sig: signature.sig }];

  console.log(deployFaucetTx);

  const { submit, pollStatus } = createClient(({ chainId, networkId }) => {
    return `${DOMAIN}/chainweb/0.0/${networkId}/chain/${chainId}/pact`;
  });

  if (!isSignedTransaction(deployFaucetTx)) {
    throw new Error('Transaction is not signed');
  }

  const requestKeys = await submit(deployFaucetTx);

  console.log('deployFaucet', requestKeys);

  return await pollStatus(requestKeys);
};
