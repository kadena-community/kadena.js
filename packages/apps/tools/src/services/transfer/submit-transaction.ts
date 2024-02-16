import client from '@/constants/client';
import type { Network } from '@/constants/kadena';
import type { INetworkData } from '@/utils/network';
import { getApiHost } from '@/utils/network';
import type { ChainwebChainId } from '@kadena/chainweb-node-client';
import type { ChainId, ICommand, ITransactionDescriptor } from '@kadena/client';
import { createClient } from '@kadena/client';
import Debug from 'debug';

export interface ITransferResult {
  requestKey?: string;
  status?: string;
}

export interface ISubmitTxResponseBody {
  result: {
    status: string;
    error:
      | undefined
      | {
          message: string;
        };
  };
}

const debug = Debug('kadena-transfer:services:finish-xchain-transfer');

export async function submitTx(
  pactCommand: ICommand,
  targetChainId: ChainId,
  networkId: string,
  networskData: INetworkData[],
): Promise<ITransferResult | { error: string }> {
  debug(submitTx.name);

  const networkData: INetworkData | undefined = networskData.find(
    (item) => (networkId as Network) === item.networkId,
  );

  if (!networkData) return { error: 'No network found' };

  const apiHost = getApiHost({
    api: networkData.API,
    chainId: targetChainId,
    networkId,
  });
  const { submit } = client(apiHost);

  try {
    return await submit(pactCommand);
  } catch (e) {
    debug(e.message);
    return { error: e.message };
  }
}

export const pollResult = async (
  chainId: ChainwebChainId,
  network: Network,
  networksData: INetworkData[],
  requestKeys: ITransactionDescriptor,
) => {
  const networkDto = networksData.find((item) => item.networkId === network);

  if (!networkDto) {
    throw new Error('Network not found');
  }

  const apiHost = getApiHost({
    api: networkDto.API,
    networkId: networkDto.networkId,
    chainId,
  });
  const { pollStatus } = createClient(apiHost);

  return pollStatus(requestKeys);
};
