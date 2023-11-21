import type {
  ChainwebChainId,
  ChainwebNetworkId,
} from '@kadena/chainweb-node-client';
import {
  Pact,
  createClient,
  isSignedTransaction,
  readKeyset,
} from '@kadena/client';
import { genKeyPair, sign } from '@kadena/cryptography-utils';
import { PactNumber } from '@kadena/pactjs';

import { getKadenaConstantByNetwork } from '@/constants/kadena';
import Debug from 'debug';

const NETWORK_ID: ChainwebNetworkId = 'testnet04';
const FAUCET_ACCOUNT = 'c:Ecwy85aCW3eogZUnIQxknH8tG8uXHM5QiC__jeI0nWA';
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
      Pact.modules['n_d8cbb935f9cd9d2399a5886bb08caed71f9bad49.coin-faucet'][
        'create-and-request-coin'
      ](
        account,
        readKeyset(KEYSET_NAME),
        new PactNumber(amount).toPactDecimal(),
      ),
    )
    .addSigner(keyPair.publicKey, (withCapability) => [
      withCapability(
        'n_d8cbb935f9cd9d2399a5886bb08caed71f9bad49.coin-faucet.GAS_PAYER',
        account,
        { int: 1 },
        { decimal: '1.0' },
      ),
      withCapability(
        'coin.TRANSFER',
        FAUCET_ACCOUNT,
        account,
        new PactNumber(amount).toPactDecimal(),
      ),
    ])
    .addKeyset(KEYSET_NAME, pred, ...keys)
    .setMeta({ senderAccount: FAUCET_ACCOUNT, chainId })
    .setNetworkId(NETWORK_ID)
    .createTransaction();

  const signature = sign(transaction.cmd, keyPair);

  if (signature.sig === undefined) {
    throw new Error('Failed to sign transaction');
  }

  const apiHost = getKadenaConstantByNetwork('testnet04').apiHost({
    networkId: NETWORK_ID,
    chainId,
  });

  transaction.sigs = [{ sig: signature.sig }];

  const { submit, pollStatus } = createClient(apiHost);

  if (!isSignedTransaction(transaction)) {
    throw new Error('Transaction is not signed');
  }

  const requestKeys = await submit(transaction);

  return await pollStatus(requestKeys);
};
