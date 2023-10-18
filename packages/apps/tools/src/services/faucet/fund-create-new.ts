import type {
  ChainwebChainId,
  ChainwebNetworkId,
} from '@kadena/chainweb-node-client';
import {
  createClient,
  isSignedTransaction,
  Pact,
  readKeyset,
} from '@kadena/client';
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

export const fundCreateNewAccount = async (
  account: string,
  keys: string[],
  chainId: ChainwebChainId,
  amount = 100,
  pred = 'keys-all',
): Promise<unknown> => {
  debug(fundCreateNewAccount.name);
  const keyPair = genKeyPair();
  const KEYSET_NAME = 'new_keyset';

  const transaction = Pact.builder
    .execution(
      Pact.modules['user.coin-faucet']['create-and-request-coin'](
        // @ts-ignore
        () => `(create-principal (read-keyset "${KEYSET_NAME}"))`,
        readKeyset(KEYSET_NAME),
        new PactNumber(amount).toPactDecimal(),
      ),
    )
    .addSigner(FAUCET_PUBLIC_KEY, (withCap: any) => [withCap('coin.GAS')])
    .addSigner(keyPair.publicKey, (withCap: any) => [
      withCap(
        'coin.TRANSFER',
        SENDER_ACCOUNT,
        account,
        new PactNumber(amount).toPactDecimal(),
      ),
    ])
    .addKeyset(KEYSET_NAME, pred, ...keys)
    .setMeta({ senderAccount: SENDER_OPERATION_ACCOUNT, chainId })
    .setNetworkId(NETWORK_ID)
    .createTransaction();

  const signature1 = sign(transaction.cmd, {
    publicKey: FAUCET_PUBLIC_KEY,
    secretKey: FAUCET_PRIVATE_KEY,
  });

  if (signature1.sig === undefined) {
    throw new Error('Failed to sign transaction');
  }

  const signature2 = sign(transaction.cmd, keyPair);

  if (signature2.sig === undefined) {
    throw new Error('Failed to sign transaction');
  }

  const apiHost = getKadenaConstantByNetwork('testnet04').apiHost({
    networkId: NETWORK_ID,
    chainId,
  });

  transaction.sigs = [{ sig: signature1.sig }, { sig: signature2.sig }];

  const { submit, pollStatus } = createClient(apiHost);

  if (!isSignedTransaction(transaction)) {
    throw new Error('Transaction is not signed');
  }

  const requestKeys = await submit(transaction);

  return await pollStatus(requestKeys);
};
