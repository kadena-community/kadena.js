import type { ChainId, ICommandResult } from '@kadena/client';
import { createSignWithKeypair } from '@kadena/client';
import { transferCreate } from '@kadena/client-utils/coin';
import type {
  IAccount,
  IAccountWithSecretKey,
} from '../testdata/constants/accounts';
import { sender00 } from '../testdata/constants/accounts';
import { devnetHost, networkId } from '../testdata/constants/network';
import { waitForEvent } from '@kadena/client-utils/core';
import type { IKeyPair } from '@kadena/types';

export async function generateAccount(keyPair: IKeyPair, chain: ChainId): Promise<IAccountWithSecretKey> {
  return {
    account: `k:${keyPair.publicKey}`,
    publicKey: keyPair.publicKey,
    chainId: chain,
    guard: keyPair.publicKey,
    secretKey: keyPair.secretKey as string,
  };
}

export async function createAccount(input: IAccount): Promise<ICommandResult> {

  return waitForEvent(
    'listen',
    transferCreate(
      {
        sender: {
          account: sender00.account,
          publicKeys: [sender00.publicKey],
        },
        receiver: {
          account: input.account,
          keyset: {
            keys: [input.publicKey],
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
        sign: createSignWithKeypair([sender00]),
      },
    ),
  );
}
