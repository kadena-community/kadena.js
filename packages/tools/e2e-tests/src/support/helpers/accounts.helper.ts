import {createSignWithKeypair} from '@kadena/client';
import type { ICommandResult, ChainId} from '@kadena/client';
import { createPrincipal } from '@kadena/client-utils/built-in';
import { genKeyPair } from '@kadena/cryptography-utils';
import * as constants from '../fixtures/constants';
import type { IAccount } from '../types/types';
import { transferCreate } from '@kadena/client-utils/coin';
import { sender00Account } from '../fixtures/accounts.fixture';

export const generateAccount = async (
  keys: number = 1,
  chainId: ChainId,
): Promise<IAccount> => {
  const keyPairs = Array.from({ length: keys }, () => genKeyPair());
  const account = await createPrincipal(
    {
      keyset: {
        keys: keyPairs.map((keyPair) => keyPair.publicKey),
      },
    },
    {
      host: constants.devnetHost,
      defaults: {
        networkId: constants.networkId,
        meta: { chainId },
      },
    },
  );

  return {
    keys: keyPairs,
    account,
    chainId,
  };
};

export const createAccount = async (
  account: IAccount
): Promise<ICommandResult> => {
  const transferCreateTask = transferCreate(
    {
      sender: {
        account: sender00Account.account,
        publicKeys: sender00Account.keys.map((keyPair) => keyPair.publicKey),
      },
      receiver: {
        account: account.account,
        keyset: {
          keys: account.keys.map((keyPair) => keyPair.publicKey),
          pred: 'keys-all',
        },
      },
      amount: '100',
      chainId: account.chainId,
    },
    {
      host: constants.devnetHost,
      defaults: {
        networkId: constants.networkId,
      },
      sign: createSignWithKeypair(sender00Account.keys),
    },
  );

  const listen = await transferCreateTask.executeTo('listen');
  await transferCreateTask.executeTo();
  return listen;
};


