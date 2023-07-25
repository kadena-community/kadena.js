import {
  ChainId,
  ICommand,
  IContinuationPayloadObject,
  Pact,
} from '@kadena/client';

import client from '@/constants/client';
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
  gasPayer: string = 'kadena-xchain-gas',
): Promise<string | { error: string }> {
  debug(finishXChainTransfer.name);

  try {
    const continuationTransaction = Pact.builder
      .continuation(continuation)
      .setNetworkId(networkId)
      .setMeta({
        chainId: targetChainId,
        sender: gasPayer,
        // this needs to be below 850 if you want to use gas-station otherwise the gas-station does
        gasLimit: 850,
      })
      .createTransaction();
    return await client.submit(continuationTransaction as ICommand);
  } catch (e) {
    debug(e.message);
    return { error: e.message };
  }
}
