/**
 * this is a client configuration file, it provides the client with the necessary configuration to interact with the chain.
 * we basically configured readClient and submitClient from @kadena/client-utils/core.
 */

import { readClient, submitClient } from '@kadena/client-utils/core';

import { GAS_PAYER, signMethod } from './wallet-helpers';

const NETWORK_ID = 'testnet04';
const DEFAULT_CHAIN_ID = '0';

export const read = readClient({
  defaults: {
    networkId: NETWORK_ID,
    meta: { chainId: DEFAULT_CHAIN_ID },
  },
});

export const defaultGasPayer = {
  meta: { sender: `k:${GAS_PAYER.publicKey}` },
  signers: [
    {
      pubKey: GAS_PAYER.publicKey,
      clist: [{ name: 'coin.GAS', args: [] }],
    },
  ],
};

export const transaction = submitClient({
  // the sign method is provided by the wallet; you can replace it with your own sign method
  sign: signMethod,
  defaults: {
    networkId: NETWORK_ID,
    meta: { chainId: DEFAULT_CHAIN_ID },
  },
});
