import { signWithChainweaver } from '@kadena/client';

import { createAccount } from '../coin/create-account';

export async function consumer() {
  createAccount(
    {
      account: 'javad',
      keyset: {
        pred: 'keys-all',
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
    .on('data', (data) => console.log(data))
    .execute();
}
