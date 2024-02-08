// Account creation testnet and devnet

import { createEckoWalletSign, createSignWithChainweaver, createSignWithKeypair, signWithChainweaver } from "@kadena/client";
import { createPrincipal } from '@kadena/client-utils/built-in';
import { createAccount, getBalance } from '@kadena/client-utils/coin';

const testNetDetails = {
    account: 'k:1287bc9c7a71046f196cf0c0b2cf57dd282ea0203e7c5078d7828dcc259bb101',
    keyset: {
      pred: 'keys-all',
      keys: [
        '1287bc9c7a71046f196cf0c0b2cf57dd282ea0203e7c5078d7828dcc259bb101',
      ],
    },
    gasPayer: { account: 'k:b781fd05af4a87936ce75510c7ebadf3f758b48d35b8db5deb17bd6aa544bc8f', publicKeys: ['b781fd05af4a87936ce75510c7ebadf3f758b48d35b8db5deb17bd6aa544bc8f'] },
    chainId: '1',
    contract: 'n_3b878bdca18974c33dec88e791dd974107edc861.kdx',
  };

const testNetDetails2 = {
  host: 'https://api.testnet.chainweb.com',
  defaults: {
    networkId: 'testnet04',
  },
  sign: signWithChainweaver,
};

async function accountCreation() {
  const result = await createAccount(
    testNetDetails,
    testNetDetails2,
  )
  // const principal = await createPrincipal(
  //   {
  //     keyset: {
  //       pred: 'key-any',
  //       keys: [
  //         '7fe38f1c80423993e90ba46297ae8066a1a69d54e6f5ee2af5ff33c418746c8d'
  //       ],
  //     },
  //   },
  //   {
  //     // host: 'http://localhost:8080/',
  //     // defaults: {
  //     //   networkId: 'fast-development',
  //     //   meta: {
  //     //     chainId: '1',
  //     //   },
  //     // },
  //     host: 'https://api.chainweb.com',
  //     defaults: {
  //       networkId: 'mainnet01',
  //       meta: {
  //         chainId: '1',
  //       },
  //     },
  //   },
  // );

  // console.log({
  //   principal,
  // });

  // const signWithKeyPair = createSignWithKeypair({
  //   publicKey:
  //     '6be2f485a7af75fedb4b7f153a903f7e6000ca4aa501179c91a2450b777bd2a7',
  //   secretKey:
  //     '2beae45b29e850e6b1882ae245b0bab7d0689ebdd0cd777d4314d24d7024b4f7',
  // });

  // const result = await createAccount(
  //   {
  //     account: principal,
  //     keyset: {
  //       pred: 'key-any',
  //       keys: [
  //         '7fe38f1c80423993e90ba46297ae8066a1a69d54e6f5ee2af5ff33c418746c8d'
  //       ],
  //     },
  //     gasPayer: {
  //       account: 'k:7fe38f1c80423993e90ba46297ae8066a1a69d54e6f5ee2af5ff33c418746c8d',
  //       publicKeys: [
  //         '7fe38f1c80423993e90ba46297ae8066a1a69d54e6f5ee2af5ff33c418746c8d',
  //       ],
  //     },
  //     chainId: '1',
  //     contract: 'coin',
  //   },
  //   {
  //     host: 'https://api.chainweb.com',
  //     defaults: {
  //       networkId: 'mainnet01',
  //       meta: {
  //         chainId: '1',
  //       },
  //     },
  //     sign: createEckoWalletSign(),
  //   },
  // )

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

