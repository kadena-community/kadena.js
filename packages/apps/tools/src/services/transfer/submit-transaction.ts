import client from '@/constants/client';
import type { Network } from '@/constants/kadena';
import type { INetworkData } from '@/utils/network';
import { getApiHost } from '@/utils/network';
import type { ChainwebChainId } from '@kadena/chainweb-node-client';
import type { ChainId, ICommand, ITransactionDescriptor } from '@kadena/client';
import { createClient } from '@kadena/client';
import Debug from 'debug';

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
  commands: ICommand[],
  chainId: ChainId,
  networkId: string,
  networksData: INetworkData[],
  targetChainId?: ChainId,
): Promise<any> {
  debug(submitTx.name);

  const networkData: INetworkData | undefined = networksData.find(
    (item) => (networkId as Network) === item.networkId,
  );

  if (!networkData) return { error: 'No network found' };

  const apiHost = getApiHost({
    api: networkData.API,
    chainId,
    networkId,
  });
  const { submit } = client(apiHost);

  try {
    return await submit(commands);
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

  return await pollStatus(requestKeys);
};

export const listenResult = async (
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
  const { listen } = createClient(apiHost);

  return await listen(requestKeys);
};
