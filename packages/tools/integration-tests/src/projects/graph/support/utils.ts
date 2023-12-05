import type {
  ChainId,
  ICommandResult,
} from '@kadena/client';
import { createSignWithKeypair } from '@kadena/client';
import { transfer, transferCreate } from '@kadena/client-utils/coin';
import { genKeyPair } from '@kadena/cryptography-utils';
import { expect } from 'vitest';
import type {
  IAccount,
  IAccountWithSecretKey,
} from '../testdata/constants/accounts';
import { sender00 } from '../testdata/constants/accounts';
import { devnetHost, networkId } from '../testdata/constants/network';

export async function generateAccount(): Promise<IAccountWithSecretKey> {
  const keyPair = genKeyPair();
  return {
    account: `k:${keyPair.publicKey}`,
    publicKey: keyPair.publicKey,
    chainId: '0',
    guard: keyPair.publicKey,
    secretKey: keyPair.secretKey as string,
  };
}

export async function createAccount(input: IAccount): Promise<ICommandResult> {
  return new Promise<ICommandResult>((resolve, reject) => {
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
    )
      .on('listen', resolve)
      .execute()
      .catch(reject);
  });
}

export async function transferFunds(
  source: IAccountWithSecretKey,
  target: IAccountWithSecretKey,
  amount: string,
  chainId: ChainId,
) {
  const result = await transfer(
    {
      sender: { account: source.account, publicKeys: [source.publicKey] },
      receiver: target.account,
      amount: amount,
      gasPayer: { account: source.account, publicKeys: [source.publicKey] },
      chainId: chainId,
    },
    {
      host: devnetHost,
      defaults: {
        networkId: networkId,
      },
      sign: createSignWithKeypair([source]),
    },
  ).execute();
  expect(result).toBe('Write succeeded');
}
