import client from '@/constants/client';
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
  gasPayer: string = 'kadena-xchain-gas',
): Promise<string | { error: string }> {
  debug(finishXChainTransfer.name);

  const { submit } = client(networkId, targetChainId);

  try {
    const continuationTransaction = Pact.builder
      .continuation(continuation)
      .setNetworkId(networkId)
      .setMeta({
        chainId: targetChainId,
        senderAccount: gasPayer,
        // this needs to be below 850 if you want to use gas-station otherwise the gas-station does
        gasLimit: 850,
      })
      .createTransaction();
    return (await submit(continuationTransaction as ICommand)).requestKey;
  } catch (e) {
    debug(e.message);
    return { error: e.message };
  }
}
