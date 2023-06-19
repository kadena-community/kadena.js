import {
  ChainwebChainId,
  ChainwebNetworkId,
} from '@kadena/chainweb-node-client';
import { Pact } from '@kadena/client';
import { genKeyPair, sign } from '@kadena/cryptography-utils';
import { PactNumber } from '@kadena/pactjs';

import { generateApiHost } from '../utils/utils';

import { env } from '@/utils/env';

const networkId: ChainwebNetworkId = 'testnet04';
const KEYSET_NAME: string = 'ks';
const SENDER_ACCOUNT: string = 'coin-faucet';
const SENDER_X: string = 'faucet-operation';

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
    .addCap('coin.GAS', env('FAUCET_PUBLIC_KEY'))
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
    publicKey: env('FAUCET_PUBLIC_KEY'),
    secretKey: env('FAUCET_PRIVATE_KEY'),
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
      pubKey: env('FAUCET_PUBLIC_KEY'),
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

export const fundExistingAccount = async (
  account: string,
  chainId: ChainwebChainId,
  amount = 100,
) => {
  const keyPair = genKeyPair();

  const transactionBuilder = Pact.modules['user.coin-faucet']
    ['request-coin'](account, new PactNumber(amount).toPactDecimal())
    .addCap('coin.GAS', env('FAUCET_PUBLIC_KEY'))
    .addCap(
      'coin.TRANSFER',
      keyPair.publicKey,
      SENDER_ACCOUNT,
      account,
      new PactNumber(amount).toPactDecimal(),
    )
    .setMeta({ sender: SENDER_X }, networkId);

  const command = transactionBuilder.createCommand();

  const signature1 = sign(command.cmd, {
    publicKey: env('FAUCET_PUBLIC_KEY'),
    secretKey: env('FAUCET_PRIVATE_KEY'),
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
      pubKey: env('FAUCET_PUBLIC_KEY'),
      sig: signature1.sig,
    },
    { pubKey: keyPair.publicKey, sig: signature2.sig },
  );

  const response = await transactionBuilder.send(
    generateApiHost(networkId, chainId),
  );

  console.log('fundExistingAccount', { response });

  return response;
};
