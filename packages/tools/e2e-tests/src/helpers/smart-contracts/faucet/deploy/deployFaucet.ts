import { ChainwebChainId } from '@kadena/chainweb-node-client';
import { createClient, Pact } from '@kadena/client';

import { DOMAIN, GAS_PROVIDER, NETWORK_ID } from './constants';
import { signTransaction } from './utils';

import fs from 'fs';
import path from 'path';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const deployFaucet = async ({
  chainId,
  upgrade,
}: {
  chainId: ChainwebChainId;
  upgrade: boolean;
}) => {
  const faucetContract = fs.readFileSync(
    path.resolve(__dirname, './../testnet-faucet.pact'),
    'utf-8',
  );

  const deployFaucetTx = Pact.builder
    .execution(faucetContract)
    .addData('upgrade', upgrade)
    .addSigner(GAS_PROVIDER.publicKey, (withCap: any) => [])
    .setMeta({
      chainId,
      gasPrice: 0.000001,
      gasLimit: 70000,
      ttl: 28800,
      creationTime: Math.round(new Date().getTime() / 1000) - 15,
      senderAccount: GAS_PROVIDER.accountName,
    })
    .setNonce('Deploy Coin Faucet')
    .setNetworkId(NETWORK_ID)
    .createTransaction();

  const signedTx = signTransaction(deployFaucetTx, {
    publicKey: GAS_PROVIDER.publicKey,
    secretKey: GAS_PROVIDER.privateKey,
  });

  console.log(signedTx);

  const { submit, listen } = createClient(({ chainId, networkId }) => {
    return `${DOMAIN}/chainweb/0.0/${networkId}/chain/${chainId}/pact`;
  });

  const requestKeys = await submit(signedTx);

  console.log('deployFaucet', requestKeys);

  const response = await listen(requestKeys);
  console.log(response);
  return response.result.status;
};
