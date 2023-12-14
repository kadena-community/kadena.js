import { listen, type ChainwebChainId, type ICommandResult } from '@kadena/chainweb-node-client';
import { createSignWithKeypair } from '@kadena/client';

import { transferCreate } from '@kadena/client-utils/coin';

import { ADMIN, DEVNET_GENESIS, DOMAIN, NETWORK_ID } from './constants';

export const createAdmin = async ({
  chainId,
  upgrade,
}: {
  chainId: ChainwebChainId;
  upgrade: boolean;
}): Promise<ICommandResult | string | undefined> => {
  if (NETWORK_ID !== 'fast-development') {
    return 'Only needs to happen on Devnet, user already exist on Testnet.';
  }

  if (upgrade) {
    return 'The step "createAdmins" is skipped for upgrades';
  }

  const transferCreateTask = await transferCreate(
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
const listenResult = await transferCreateTask.executeTo("listen")
await transferCreateTask.executeTo()
return listenResult
};
