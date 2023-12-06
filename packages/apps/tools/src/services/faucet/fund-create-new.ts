import type { ChainwebChainId } from '@kadena/chainweb-node-client';
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
import type { INetworkData } from '@/utils/network';
import { getApiHost } from '@/utils/network';

const FAUCET_ACCOUNT = 'c:Ecwy85aCW3eogZUnIQxknH8tG8uXHM5QiC__jeI0nWA';
const debug = Debug('kadena-transfer:services:faucet');

export const fundCreateNewAccount = async (
  account: string,
  keys: string[],
  chainId: ChainwebChainId,
  network: Network,
  networksData: INetworkData[],
  amount = 100,
  pred = 'keys-all',
): Promise<unknown> => {
  debug(fundCreateNewAccount.name);

  const networkDto = networksData.find((item) => item.networkId === network);

  if (!networkDto) {
    throw new Error('Network not found');
  }

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
        // @ts-ignore
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

  const { submit, pollStatus } = createClient(apiHost);

  if (!isSignedTransaction(transaction)) {
    throw new Error('Transaction is not signed');
  }

  const requestKeys = await submit(transaction);

  return await pollStatus(requestKeys);
};
