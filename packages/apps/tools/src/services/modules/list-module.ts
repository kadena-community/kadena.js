import type { Network } from '@/constants/kadena';
import { kadenaConstants } from '@/constants/kadena';
import type { INetworkData } from '@/utils/network';
import { getApiHost } from '@/utils/network';
import type { ChainwebChainId } from '@kadena/chainweb-node-client';
import { createClient, Pact } from '@kadena/client';
import Debug from 'debug';

const debug = Debug('kadena-transfer:services:list-module');

export interface IModulesResult {
  status?: string;
  data?: string[];
  chainId: ChainwebChainId;
  network: Network;
}

export const listModules = async (
  chainId: ChainwebChainId,
  network: Network,
  networksData: INetworkData[],
  senderAccount: string = kadenaConstants.DEFAULT_SENDER,
  gasPrice: number = kadenaConstants.GAS_PRICE,
  gasLimit: number = kadenaConstants.GAS_LIMIT,
  ttl: number = kadenaConstants.API_TTL,
): Promise<IModulesResult | null> => {
  debug(listModules.name);

  if (!networksData.length) {
    return null;
  }

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
    .execution('(list-modules)')
    .setMeta({ gasLimit, gasPrice, ttl, senderAccount, chainId })
    .setNetworkId(networkDto.networkId)
    .createTransaction();

  const response = await local(transaction, {
    preflight: false,
    signatureVerification: false,
  });

  const { result } = response;

  return {
    status: result.status,
    data: 'data' in result ? (result.data as string[]) : [],
    chainId,
    network,
  };
};
