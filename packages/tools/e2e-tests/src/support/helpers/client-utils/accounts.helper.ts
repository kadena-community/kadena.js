import { sender00Account } from '@constants/accounts.constants';
import { devnetHost, networkId } from '@constants/network.constants';
import type { ChainId, ICommandResult, IKeyPair } from '@kadena/client';
import { createSignWithKeypair } from '@kadena/client';
import { createPrincipal } from '@kadena/client-utils/built-in';
import { transferCreate } from '@kadena/client-utils/coin';
import { genKeyPair } from '@kadena/cryptography-utils';
import type { IAccount } from '@test-types/account.types';

export const generateAccount = async (
  keys: number = 1,
  chains: ChainId[],
): Promise<IAccount> => {
  const keyPairs = Array.from({ length: keys }, () => genKeyPair());
  const createdAccount: IAccount = {
    account: '',
    chains: [],
    keys: [],
  };

  for (const chain of chains) {
    const account = await createPrincipal(
      {
        keyset: {
          keys: keyPairs.map((keyPair: IKeyPair) => keyPair.publicKey),
        },
      },
      {
        host: devnetHost,
        defaults: {
          networkId: networkId,
          meta: { chainId: chain },
        },
      },
    );

    createdAccount.keys = keyPairs;
    createdAccount.account = account;
    createdAccount.chains.push(chain);
  }

  return createdAccount;
};

export const createAccount = async (
  account: IAccount,
  chainId: ChainId,
): Promise<ICommandResult> => {
  const transferCreateTask = transferCreate(
    {
      sender: {
        account: sender00Account.account,
        publicKeys: sender00Account.keys.map(
          (keyPair: IKeyPair) => keyPair.publicKey,
        ),
      },
      receiver: {
        account: account.account,
        keyset: {
          keys: account.keys.map((keyPair) => keyPair.publicKey),
          pred: 'keys-all',
        },
      },
      amount: '100',
      chainId: chainId,
    },
    {
      host: devnetHost,
      defaults: {
        networkId: networkId,
      },
      sign: createSignWithKeypair(sender00Account.keys),
    },
  );

  const listen = await transferCreateTask.executeTo('listen');
  await transferCreateTask.executeTo();
  return listen;
};
