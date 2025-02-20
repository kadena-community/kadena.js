import client from '@/constants/client';
import type { NetworkIds } from '@/constants/kadena';
import type { INetworkData } from '@/utils/network';
import { getApiHost } from '@/utils/network';
import type {
  ChainId,
  ICommand,
  IContinuationPayloadObject,
} from '@kadena/client';
import { Pact } from '@kadena/client';
import Debug from 'debug';

export interface ITransferResult {
  requestKey?: string;
  status?: string;
}

const debug = Debug('kadena-transfer:services:finish-xchain-transfer');

export async function finishXChainTransfer(
  continuation: IContinuationPayloadObject['cont'],
  targetChainId: ChainId,
  networkId: string,
  networskData: INetworkData[],
  gasLimit: number = 850,
  gasPayer: string = 'kadena-xchain-gas',
): Promise<string | { error: string }> {
  debug(finishXChainTransfer.name);

  const networkData: INetworkData | undefined = networskData.find(
    (item) => (networkId as NetworkIds) === item.networkId,
  );

  if (!networkData) return { error: 'No network found' };

  const apiHost = getApiHost({
    api: networkData.API,
    chainId: targetChainId,
    networkId,
  });
  const { submit } = client(apiHost);

  try {
    const continuationTransaction = Pact.builder
      .continuation(continuation)
      .setNetworkId(networkId)
      .setMeta({
        chainId: targetChainId,
        senderAccount: gasPayer,
        // this needs to be below 850 if you want to use gas-station otherwise the gas-station does
        gasLimit,
      })
      .createTransaction();
    return (await submit(continuationTransaction as ICommand)).requestKey;
  } catch (e) {
    debug(e.message);
    return { error: e.message };
  }
}
