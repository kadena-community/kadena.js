import type {
  ChainwebChainId,
  ILocalCommandResult,
} from '@kadena/chainweb-node-client';
import { createClient, Pact } from '@kadena/client';

import type { Network } from '@/constants/kadena';
import { kadenaConstants } from '@/constants/kadena';
import type { INetworkData } from '@/utils/network';
import { getApiHost } from '@/utils/network';
import Debug from 'debug';

const debug = Debug('kadena-transfer:services:describe-module');

export const describeModule = async (
  moduleName: string,
  chainId: ChainwebChainId,
  network: Network,
  networksData: INetworkData[],
  senderAccount: string = kadenaConstants.DEFAULT_SENDER,
  gasPrice: number = kadenaConstants.GAS_PRICE,
  gasLimit: number = kadenaConstants.GAS_LIMIT,
  ttl: number = kadenaConstants.API_TTL,
): Promise<ILocalCommandResult | null> => {
  debug(describeModule.name);

  const networkDto = networksData.find((item) => item.networkId === network);

  if (!networkDto) {
    return null;
  }

  const { local } = createClient(
    getApiHost({
      api: networkDto.API,
      networkId: networkDto.networkId,
      chainId,
    }),
  );

  const transaction = Pact.builder
    .execution(`(describe-module "${moduleName}")`)
    .setMeta({ gasLimit, gasPrice, ttl, senderAccount, chainId })
    .setNetworkId(networkDto.networkId)
    .createTransaction();

  return await local(transaction, {
    preflight: false,
    signatureVerification: false,
  });
};
