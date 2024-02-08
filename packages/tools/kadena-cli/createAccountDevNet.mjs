// Account creation testnet and devnet

import { createSignWithKeypair } from "@kadena/client";
import { createPrincipal } from '@kadena/client-utils/built-in';
import { createAccount, getBalance } from '@kadena/client-utils/coin';

async function accountCreation() {
  const principal = await createPrincipal(
    {
      keyset: {
        pred: 'keys-all',
        keys: [
          'f092d630fececf5c412815bc08831904bf36a5f034e6c99f548026eb447cf01f',
        ],
      },
    },
    {
      host: 'http://localhost:8080/',
      defaults: {
        networkId: 'fast-development',
        meta: {
          chainId: '12',
        },
      },
    },
  );

  console.log({
    principal,
  });

  const signWithKeyPair = createSignWithKeypair({
    publicKey:
      '6be2f485a7af75fedb4b7f153a903f7e6000ca4aa501179c91a2450b777bd2a7',
    secretKey:
      '2beae45b29e850e6b1882ae245b0bab7d0689ebdd0cd777d4314d24d7024b4f7',
  });

  const result = await createAccount(
    {
      account: principal,
      keyset: {
        pred: 'keys-all',
        keys: [
          'f092d630fececf5c412815bc08831904bf36a5f034e6c99f548026eb447cf01f',
        ],
      },
      gasPayer: {
        account: 'sender01',
        publicKeys: [
          '6be2f485a7af75fedb4b7f153a903f7e6000ca4aa501179c91a2450b777bd2a7',
        ],
      },
      chainId: '12',
      contract: 'coin',
    },
    {
      host: 'http://localhost:8080/',
      defaults: {
        networkId: 'fast-development',
        meta: {
          chainId: '12',
        },
      },
      sign: signWithKeyPair,
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


async function getBalanceOfAccount() {
  const result = await getBalance(
    'mi_ca',
    'testnet04',
    '1',
    'https://api.testnet.chainweb.com',
  );

  console.log(result);

  // const result = await getBalance(
  //   {
  //     account: 'k:34235be97f7aad50bbc1e35935c90e08648b2f0a0d6833fe24627c976dae5d81',
  //     chainId: '1',
  //   },
  //   {
  //     host: 'https://api.testnet.chainweb.com',
  //     defaults: {
  //       networkId: 'testnet04',
  //     },
  //   },
  // );
  console.log(result);
}

// getBalanceOfAccount();

