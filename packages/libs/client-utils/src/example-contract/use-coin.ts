import { signWithChainweaver } from '@kadena/client';

import { Predicate } from '@kadena/types';
import { createAccount } from '../coin/create-account';

export async function consumer() {
  const result = await createAccount(
    {
      account: 'javad',
      keyset: {
        pred: Predicate.keysAll,
        keys: ['key-a', 'key-b'],
      },
      gasPayer: { account: 'gasPayer', publicKeys: [''] },
      chainId: '0',
    },
    {
      host: 'https://api.testnet.chainweb.com',
      defaults: {
        networkId: 'testnet04',
      },
      sign: signWithChainweaver,
    },
  )
    .on('sign', (data) => console.log(data))
    .on('preflight', (data) => console.log(data))
    .on('submit', (data) => console.log(data))
    .on('listen', (data) => console.log(data))
    .execute();

  console.log(result);
}
