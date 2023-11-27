import { createSignWithKeypair } from '@kadena/client';
import { transferCreate } from '@kadena/client-utils/coin';
import { accountOne, sender00Account } from '../constants/accounts';
import { devnetHost, networkId } from '../constants/network';

export async function createAccounts(): Promise<void> {
  await transferCreate(
    {
      sender: {
        account: sender00Account.account,
        publicKeys: [sender00Account.publicKey],
      },
      receiver: {
        account: accountOne.account,
        keyset: {
          keys: [accountOne.publicKey],
          pred: 'keys-all',
        },
      },
      amount: '100',
      chainId: '0',
    },
    {
      host: devnetHost,
      defaults: {
        networkId: networkId,
      },
      sign: createSignWithKeypair([sender00Account]),
    },
  ) // signed Tx
    .on('sign', (data) => console.log(data))
    // preflight result
    .on('preflight', (data) => console.log(data))
    // submit result
    .on('submit', (data) => console.log(data))
    // listen result
    .on('listen', (data) => console.log(data))
    .execute();
}
