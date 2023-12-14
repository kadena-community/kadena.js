import type { ChainwebChainId } from '@kadena/chainweb-node-client';
import { createSignWithKeypair } from '@kadena/client';
import { transfer } from '@kadena/client-utils/coin';
import {
  DEVNET_GENESIS,
  DOMAIN,
  GAS_STATION,
  InitialFunding,
  NETWORK_ID,
} from './constants';

export const fundGasStation = async ({
  chainId,
  upgrade,
}: {
  chainId: ChainwebChainId;
  upgrade: boolean;
}): Promise<string | undefined> => {
  if (NETWORK_ID !== 'fast-development') {
    return 'Only needs to happen on Devnet, funding happens differently on Testnet.';
  }

  if (upgrade) {
    return 'The step "fundGasStation" is skipped for upgrades';
  }

  const result = await transfer(
    {
      sender: {
        account: DEVNET_GENESIS.accountName,
        publicKeys: [DEVNET_GENESIS.publicKey],
      },
      receiver: GAS_STATION,
      amount: `${InitialFunding}`,
      gasPayer: {
        account: DEVNET_GENESIS.accountName,
        publicKeys: [DEVNET_GENESIS.publicKey],
      },
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
  ).execute();
  return result as string;
};
