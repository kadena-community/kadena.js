import type { ChainId, ICommandResult } from '@kadena/client';
import { createSignWithKeypair } from '@kadena/client';
import { transferCreate } from '@kadena/client-utils/coin';
import { genKeyPair } from '@kadena/cryptography-utils';
import type {
  IAccount,
  IAccountWithSecretKey,
} from '../testdata/constants/accounts';
import { sender00 } from '../testdata/constants/accounts';
import { devnetHost, networkId } from '../testdata/constants/network';

export async function generateAccount(chain: ChainId): Promise<IAccountWithSecretKey> {
  const keyPair = genKeyPair();
  return {
    account: `k:${keyPair.publicKey}`,
    publicKey: keyPair.publicKey,
    chainId: chain,
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
