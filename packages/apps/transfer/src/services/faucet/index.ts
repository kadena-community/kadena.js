import {
  ChainwebChainId,
  ChainwebNetworkId,
  IPollResponse,
} from '@kadena/chainweb-node-client';
import { ICommandBuilder, IPactCommand, Pact } from '@kadena/client';
import { genKeyPair, sign } from '@kadena/cryptography-utils';
import { PactNumber } from '@kadena/pactjs';

import { getKadenaConstantByNetwork } from '@/constants/kadena';
import { env } from '@/utils/env';
import Debug from 'debug';

const NETWORK_ID: ChainwebNetworkId = 'testnet04';
const SENDER_ACCOUNT: string = 'coin-faucet';
const SENDER_OPERATION_ACCOUNT: string = 'faucet-operation';
const FAUCET_PUBLIC_KEY = env(
  'FAUCET_PUBLIC_KEY',
  '<PROVIDE_FAUCET_PUBLICKEY_HERE>',
);
const FAUCET_PRIVATE_KEY = env(
  'FAUCET_PRIVATE_KEY',
  '<PROVIDE_FAUCET_PRIVATEKEY_HERE>',
);

const debug = Debug('kadena-transfer:services:faucet');

export const fundExistingAccount = async (
  account: string,
  chainId: ChainwebChainId,
  amount = 100,
  onPoll?: (
    transaction: IPactCommand & ICommandBuilder<Record<string, unknown>>,
    pollRequest: Promise<IPollResponse>,
  ) => void,
): Promise<unknown> => {
  debug(fundExistingAccount.name);
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
    .setMeta({ sender: SENDER_OPERATION_ACCOUNT, chainId }, NETWORK_ID);

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

  const apiHost = getKadenaConstantByNetwork('TESTNET').apiHost({
    networkId: NETWORK_ID,
    chainId,
  });

  await transactionBuilder.send(apiHost);

  return await transactionBuilder.pollUntil(apiHost, {
    onPoll,
  });
};
