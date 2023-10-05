import { signWithChainweaver } from '@kadena/client';

import { createAccount } from '../../utils/coin-utils/create-account';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function consumer() {
  createAccount(
    {
      account: 'javad',
      publicKey: 'test',
      gasPayer: { account: 'gasPayer', publicKey: '' },
      chainId: '1',
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
    .on('submit', (data) => console.log(data))
    .on('listen', (data) => console.log(data))
    .on('data', (data) => console.log(data))
    .on('preflight', (data) => console.log(data))
    .execute();
}
