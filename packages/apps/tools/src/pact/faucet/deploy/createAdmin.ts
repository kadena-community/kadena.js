import type { ChainwebChainId } from '@kadena/chainweb-node-client';
import { createSignWithKeypair } from '@kadena/client';

import { transferCreate } from '@kadena/client-utils/coin';

import { ADMIN, DEVNET_GENESIS, DOMAIN, NETWORK_ID } from './constants';

export const createAdmin = async ({
  chainId,
  upgrade,
}: {
  chainId: ChainwebChainId;
  upgrade: boolean;
}) => {
  if (NETWORK_ID !== 'fast-development') {
    return 'Only needs to happen on Devnet, user already exist on Testnet.';
  }

  if (upgrade) {
    return 'The step "createAdmins" is skipped for upgrades';
  }

  const result = transferCreate(
    {
      sender: {
        account: DEVNET_GENESIS.accountName,
        publicKeys: [DEVNET_GENESIS.publicKey],
      },
      receiver: {
        account: ADMIN.accountName,
        keyset: {
          keys: [ADMIN.publicKey],
          pred: 'keys-all',
        },
      },
      amount: '1',
      // gasPayer?: { account: string; publicKeys: string[] };
      chainId,
    },
    {
      host: ({ networkId, chainId }) =>
        `${DOMAIN}/chainweb/0.0/${networkId}/chain/${chainId}/pact`,
      defaults: { networkId: NETWORK_ID },
      sign: createSignWithKeypair([
        {
          publicKey: DEVNET_GENESIS.publicKey,
          secretKey: DEVNET_GENESIS.privateKey,
        },
      ]),
    },
  )
    .on('sign', (data) => console.log(data))
    .on('preflight', (data) => console.log(data))
    .on('submit', (data) => console.log(data))
    .on('listen', (data) => console.log(data))
    .execute();

  console.log(result);
  return result;
};
