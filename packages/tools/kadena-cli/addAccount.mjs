/* SCENARIO 1 */
// alias
// account-name
// optional: fungible module (default: coin)
// optional: network (default: mainnet01)

import { createPrincipal } from "@kadena/client-utils/built-in";
import { details } from "@kadena/client-utils/coin";

const SCENARIO1_CONFIG = {
  alias: 'mi_devnet',
  // accountName: 'k:09ab52dfa37b9a0076cbcd4114e1e20975f23bead3471fae23b0ee8414ea782d',
  networkId: 'fast-development',
  publicKeys: [
    'dd610a19bdc169e863eab9973e8105e48de4c93eee026be8b43801b8ecb3f856',
    'c0233825c9ef620d6fb8877460941b6d0d4e42924f8c906adf97ea8de10865f5',
  ],
  // pred: 'key-any',
};

const hostByNetworkId = {
  'testnet04': 'https://api.testnet.chainweb.com',
  'mainnet01': 'https://api.chainweb.com',
  'fast-development': 'http://localhost:8080',
}

async function scenario1() {
  const result = await createAccount({
    ...SCENARIO1_CONFIG
  });
  console.log(result);
}

async function getDetails(accountName, networkId, chainId, host) {
  return details(
    accountName,
    networkId,
    chainId,
    host,
  );
}

async function createAccount({
  alias,
  accountName,
  publicKeys = [],
  chainId = '1',
  module = 'coin',
  networkId = 'mainnet01',
  pred = 'keys-all',
}) {

  if(!accountName) {
    if(publicKeys.length === 0) {
      throw new Error('No public keys provided');
    }

    if(publicKeys.length === 1) {
      accountName = `k:${publicKeys[0]}`;
    } else {
      accountName = await createPrincipal(
        {
          keyset: {
            pred,
            keys: publicKeys,
          },
        },
        {
          host: hostByNetworkId[networkId],
          defaults: {
            networkId,
            meta: {
              chainId,
            },
          },
        },
      );
    }
  }

  console.log({ accountName });

  const accDetails = await getDetails(
    accountName,
    networkId,
    chainId,
    hostByNetworkId[networkId],
  );

  const { guard: { keys, pred: storedPred } } = accDetails;

  const isSameKeys = keys.every((key) => publicKeys.includes(key));

  if (!isSameKeys || pred !== storedPred) {
    throw new Error('Public keys or predicate do not match');
  }

  return accDetails;
}

await scenario1();
