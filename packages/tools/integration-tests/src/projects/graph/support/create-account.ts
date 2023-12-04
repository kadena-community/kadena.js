import type { ICommandResult } from '@kadena/client';
import { createSignWithKeypair } from '@kadena/client';
import { transferCreate } from '@kadena/client-utils/coin';
import type { IAccount } from '../testdata/constants/accounts';
import { sender00Account } from '../testdata/constants/accounts';
import { devnetHost, networkId } from '../testdata/constants/network';

export async function createAccount(input: IAccount): Promise<ICommandResult> {
  return new Promise<ICommandResult>((resolve, reject) => {
    transferCreate(
      {
        sender: {
          account: sender00Account.account,
          publicKeys: [sender00Account.publicKey],
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
        sign: createSignWithKeypair([sender00Account]),
      },
    )
      .on('listen', resolve)
      .execute()
      .catch(reject);
  });
}
