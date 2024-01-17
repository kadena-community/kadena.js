import type { ChainId, ICommandResult } from '@kadena/client';
import { createSignWithKeypair } from '@kadena/client';
import { transferCreate } from '@kadena/client-utils/coin';
import type { IKeyPair } from '@kadena/types';
import type { IAccount } from 'src/support/types/types';
import { sender00 } from '../../fixtures/graph/testdata/constants/accounts';
import {
  devnetHost,
  networkId,
} from '../../fixtures/graph/testdata/constants/network';

export async function generateAccount(
  keyPair: IKeyPair,
  chain: ChainId,
): Promise<IAccount> {
  return {
    account: `k:${keyPair.publicKey}`,
    chainId: chain,
    keys: [{ publicKey: keyPair.publicKey, secretKey: keyPair.secretKey }],
  };
}

export async function createAccount(input: IAccount): Promise<ICommandResult> {
  const transferCreateTask = transferCreate(
    {
      sender: {
        account: sender00.account,
        publicKeys: [sender00.keys[0].publicKey],
      },
      receiver: {
        account: input.account,
        keyset: {
          keys: [input.keys[0].publicKey],
          pred: 'keys-all',
        },
      },
      amount: '100',
      chainId: input.chainId,
    },
    {
      host: devnetHost,
      defaults: {
        networkId: networkId,
      },
      sign: createSignWithKeypair([sender00.keys[0]]),
    },
  );

  const listen = await transferCreateTask.executeTo('listen');
  await transferCreateTask.executeTo();
  return listen;
}
