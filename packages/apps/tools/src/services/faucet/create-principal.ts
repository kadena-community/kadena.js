import { kadenaDefaultNetworks } from '@/constants/kadena';
import type {
  ChainwebChainId,
  ChainwebNetworkId,
} from '@kadena/chainweb-node-client';
import type { ICreatePrincipalInput } from '@kadena/client-utils/built-in';
import { createPrincipal as createPrincipalUtil } from '@kadena/client-utils/built-in';
import Debug from 'debug';

const NETWORK_ID: ChainwebNetworkId = 'testnet04';

const debug = Debug('kadena-transfer:services:faucet');

export const createPrincipal = async (
  keys: string[],
  chainId: ChainwebChainId,
  pred = 'keys-all',
): Promise<string | Error> => {
  debug(createPrincipal.name);

  if (keys.length === 1) return Promise.resolve(`k:${keys[0]}`);

  return createPrincipalUtil(
    {
      keyset: {
        keys,
        pred: pred as ICreatePrincipalInput['keyset']['pred'],
      },
    },
    {
      host: `https://${kadenaDefaultNetworks.testnet04.API}`,
      defaults: {
        networkId: NETWORK_ID,
        meta: { chainId },
      },
    },
  );
};
