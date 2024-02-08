// Account creation testnet and devnet

import { createEckoWalletQuicksign, signWithChainweaver } from "@kadena/client";
import { createPrincipal } from '@kadena/client-utils/built-in';
import { createAccount, getBalance } from '@kadena/client-utils/coin';

async function accountCreation() {
  const principal = await createPrincipal(
    {
      keyset: {
        pred: 'key-any',
        keys: [
          '7e9f970a16e48aff6a8e019320a4e5b7b0d5075dbb5259aa87dfa98016dba463'
        ],
      },
    },
    {
      host: 'https://api.chainweb.com',
      defaults: {
        networkId: 'mainnet01',
        meta: {
          chainId: '1',
        },
      },
    },
  );
  const result = await createAccount(
    {
      account: principal,
      keyset: {
        pred: 'key-any',
        keys: [
          '7e9f970a16e48aff6a8e019320a4e5b7b0d5075dbb5259aa87dfa98016dba463'
        ],
      },
      gasPayer: {
        account: 'k:7e9f970a16e48aff6a8e019320a4e5b7b0d5075dbb5259aa87dfa98016dba463',
        publicKeys: [
          '7e9f970a16e48aff6a8e019320a4e5b7b0d5075dbb5259aa87dfa98016dba463',
        ],
      },
      chainId: '1',
      contract: 'coin',
    },
    {
      host: 'https://api.chainweb.com',
      defaults: {
        networkId: 'mainnet01',
        meta: {
          chainId: '1',
        },
      },
      sign: signWithChainweaver,
    },
  )

   // signed Tx
  .on('sign', (data) => console.log(data))
  // preflight result
  .on('preflight', (data) => console.log(data))
  // submit result
  .on('submit', (data) => console.log(data))
  // listen result
  .on('listen', (data) => console.log(data))
  .execute();
  console.log(result);
}

await accountCreation();

