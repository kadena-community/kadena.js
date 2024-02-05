import type { ChainwebChainId } from '@kadena/chainweb-node-client';
import type { ITransactionDescriptor } from '@kadena/client';
import {
  createClient,
  isSignedTransaction,
  Pact,
  readKeyset,
} from '@kadena/client';
import { genKeyPair, sign } from '@kadena/cryptography-utils';
import { PactNumber } from '@kadena/pactjs';

import Debug from 'debug';

import type { Network } from '@/constants/kadena';
import { env } from '@/utils/env';
import type { INetworkData } from '@/utils/network';
import { getApiHost } from '@/utils/network';

const FAUCET_ACCOUNT = env(
  'FAUCET_USER',
  'c:Ecwy85aCW3eogZUnIQxknH8tG8uXHM5QiC__jeI0nWA',
);
const debug = Debug('kadena-transfer:services:faucet');

const NAMESPACE = env(
  'FAUCET_NAMESPACE',
  'n_d8cbb935f9cd9d2399a5886bb08caed71f9bad49',
);
const CONTRACT_NAME = env('FAUCET_CONTRACT', 'coin-faucet');
// Helps with TS
const DEFAULT_MODULE_NAME =
  'n_d8cbb935f9cd9d2399a5886bb08caed71f9bad49.coin-faucet';

export const fundCreateNewAccount = async (
  account: string,
  keys: string[],
  chainId: ChainwebChainId,
  network: Network,
  networksData: INetworkData[],
  amount = 100,
  pred = 'keys-all',
): Promise<ITransactionDescriptor> => {
  debug(fundCreateNewAccount.name);

  const networkDto = networksData.find((item) => item.networkId === network);

  if (!networkDto) {
    throw new Error('Network not found');
  }

  const keyPair = genKeyPair();
  const KEYSET_NAME = 'new_keyset';

  const transaction = Pact.builder
    .execution(
      Pact.modules[
        `${NAMESPACE}.${CONTRACT_NAME}` as typeof DEFAULT_MODULE_NAME
      ]['create-and-request-coin'](
        account,
        readKeyset(KEYSET_NAME),
        new PactNumber(amount).toPactDecimal(),
      ),
    )
    .addSigner(keyPair.publicKey, (withCapability) => [
      withCapability(
        // @ts-ignore
        `${NAMESPACE}.${CONTRACT_NAME}.GAS_PAYER`,
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
    .setNetworkId(networkDto.networkId)
    .createTransaction();

  const signature = sign(transaction.cmd, keyPair);

  if (signature.sig === undefined) {
    throw new Error('Failed to sign transaction');
  }

  const apiHost = getApiHost({
    api: networkDto.API,
    networkId: networkDto.networkId,
    chainId,
  });

  transaction.sigs = [{ sig: signature.sig }];

  const { submit } = createClient(apiHost);

  if (!isSignedTransaction(transaction)) {
    throw new Error('Transaction is not signed');
  }

  return await submit(transaction);
};
