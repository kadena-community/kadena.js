import {
  ChainwebChainId,
  ChainwebNetworkId,
} from '@kadena/chainweb-node-client';
import { Pact } from '@kadena/client';
import { genKeyPair, sign } from '@kadena/cryptography-utils';
import { PactNumber } from '@kadena/pactjs';

import { generateApiHost } from '../utils/utils';

const networkId: ChainwebNetworkId = 'testnet04';
const keyset = 'ks';
const SENDER_ACCOUNT = 'coin-faucet';
const SENDER_X = 'faucet-operation';

const FAUCET_KEY = {
  PUBLIC: 'dc28d70fceb519b61b4a797876a3dee07de78cebd6eddc171aef92f9a95d706e',
  SECRET: '49a1e8f8ef0a8ca6bd1d5f3a3e45f10aa1dd987f2cfb94e248a457c178f347b4',
};

export const fundNewAccount = async (
  account: string,
  amount: number,
  chainId: ChainwebChainId,
  keys: string[],
) => {
  const keyPair = genKeyPair();

  const transactionBuilder = Pact.modules['user.coin-faucet']
    ['create-and-request-coin'](
      account,
      () => `(read-keyset '${keyset})`,
      new PactNumber(amount).toPactDecimal(),
    )
    .addCap('coin.GAS', FAUCET_KEY.PUBLIC)
    .addCap(
      'coin.TRANSFER',
      keyPair.publicKey,
      SENDER_ACCOUNT,
      account,
      new PactNumber(amount).toPactDecimal(),
    )
    .addData({
      [keyset]: {
        keys,
        pred: 'keys-all',
      },
    })
    .setMeta({ sender: SENDER_X }, networkId);

  const command = transactionBuilder.createCommand();

  const signature1 = sign(command.cmd, {
    publicKey: FAUCET_KEY.PUBLIC,
    secretKey: FAUCET_KEY.SECRET,
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
      pubKey: FAUCET_KEY.PUBLIC,
      sig: signature1.sig,
    },
    { pubKey: keyPair.publicKey, sig: signature2.sig },
  );

  const response = await transactionBuilder.send(
    generateApiHost('testnet04', chainId),
  );

  console.log('fundNewAccount', { response });
};

export const fundExistingAccount = async (
  account: string,
  amount: number,
  chainId: ChainwebChainId,
) => {
  const keyPair = genKeyPair();

  const transactionBuilder = Pact.modules['user.coin-faucet']
    ['request-coin'](account, new PactNumber(amount).toPactDecimal())
    .addCap('coin.GAS', FAUCET_KEY.PUBLIC)
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
    publicKey: FAUCET_KEY.PUBLIC,
    secretKey: FAUCET_KEY.SECRET,
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
      pubKey: FAUCET_KEY.PUBLIC,
      sig: signature1.sig,
    },
    { pubKey: keyPair.publicKey, sig: signature2.sig },
  );

  const response = await transactionBuilder.send(
    generateApiHost(networkId, chainId),
  );

  console.log('fundExistingAccount', { response });
};
