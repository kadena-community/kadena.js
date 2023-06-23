import {
  ChainwebChainId,
  ChainwebNetworkId,
  IPollResponse,
} from '@kadena/chainweb-node-client';
import { ICommandBuilder, IPactCommand, Pact } from '@kadena/client';
import { genKeyPair, sign } from '@kadena/cryptography-utils';
import { PactNumber } from '@kadena/pactjs';

import { generateApiHost } from '../utils/utils';

import { env } from '@/utils/env';

const networkId: ChainwebNetworkId = 'testnet04';
const KEYSET_NAME: string = 'ks';
const SENDER_ACCOUNT: string = 'coin-faucet';
const SENDER_X: string = 'faucet-operation';
const FAUCET_PUBLIC_KEY = env(
  'FAUCET_PUBLIC_KEY',
  '<PROVIDE_FAUCET_PUBLICKEY_HERE>',
);
const FAUCET_PRIVATE_KEY = env(
  'FAUCET_PRIVATE_KEY',
  '<PROVIDE_FAUCET_PRIVATEKEY_HERE>',
);

export const fundNewAccount = async (
  account: string,
  chainId: ChainwebChainId,
  keys: string[],
  amount = 100,
) => {
  const keyPair = genKeyPair();

  const transactionBuilder = Pact.modules['user.coin-faucet']
    ['create-and-request-coin'](
      account,
      () => `(read-keyset '${KEYSET_NAME})`,
      new PactNumber(amount).toPactDecimal(),
    )
    .addCap('coin.GAS', FAUCET_PUBLIC_KEY)
    .addCap(
      'coin.TRANSFER',
      keyPair.publicKey,
      SENDER_ACCOUNT,
      account,
      new PactNumber(amount).toPactDecimal(),
    )
    .addData({
      [KEYSET_NAME]: {
        keys,
        pred: 'keys-all',
      },
    })
    .setMeta({ sender: SENDER_X }, networkId);

  const command = transactionBuilder.createCommand();

  const signature1 = sign(command.cmd, {
    publicKey: FAUCET_PUBLIC_KEY,
    secretKey: FAUCET_PRIVATE_KEY,
  });

  if (signature1.sig === undefined) {
    throw new Error('Failed to sign transaction');
  }

  const signature2 = sign(command.cmd, keyPair);

  if (signature2.sig === undefined) {
    throw new Error('Failed to sign transaction');
  }

  transactionBuilder.addSignatures(
    {
      pubKey: FAUCET_PUBLIC_KEY,
      sig: signature1.sig,
    },
    { pubKey: keyPair.publicKey, sig: signature2.sig },
  );

  const response = await transactionBuilder.send(
    generateApiHost('testnet04', chainId),
  );

  console.log('fundNewAccount', { response });

  return response;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const fundExistingAccount = async (
  account: string,
  chainId: ChainwebChainId,
  onPoll?: (
    transaction: IPactCommand & ICommandBuilder<Record<string, unknown>>,
    pollRequest: Promise<IPollResponse>,
  ) => void,
  amount = 100,
) => {
  const keyPair = genKeyPair();

  const transactionBuilder = Pact.modules['user.coin-faucet']
    ['request-coin'](account, new PactNumber(amount).toPactDecimal())
    .addCap('coin.GAS', FAUCET_PUBLIC_KEY)
    .addCap(
      'coin.TRANSFER',
      keyPair.publicKey,
      SENDER_ACCOUNT,
      account,
      new PactNumber(amount).toPactDecimal(),
    )
    .setMeta({ sender: SENDER_X, chainId }, networkId);

  const command = transactionBuilder.createCommand();

  const signature1 = sign(command.cmd, {
    publicKey: FAUCET_PUBLIC_KEY,
    secretKey: FAUCET_PRIVATE_KEY,
  });

  if (signature1.sig === undefined) {
    throw new Error('Failed to sign transaction');
  }

  const signature2 = sign(command.cmd, keyPair);

  if (signature2.sig === undefined) {
    throw new Error('Failed to sign transaction');
  }

  transactionBuilder.addSignatures(
    {
      pubKey: FAUCET_PUBLIC_KEY,
      sig: signature1.sig,
    },
    { pubKey: keyPair.publicKey, sig: signature2.sig },
  );

  const apiHost = generateApiHost(networkId, chainId);

  await transactionBuilder.send(apiHost);

  return await transactionBuilder.pollUntil(apiHost, {
    onPoll,
  });
};
