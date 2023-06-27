import { ChainwebNetworkId } from '@kadena/chainweb-node-client';
import { ContCommand, getContCommand } from '@kadena/client';
import { ChainId } from '@kadena/types';

import {
  getKadenaConstantByNetwork,
  kadenaConstants,
  Network,
} from '@/constants/kadena';
import { chainNetwork } from '@/constants/network';
import Debug from 'debug';

interface ITransactionData {
  sender: { chain: ChainId; account: string };
  receiver: { chain: ChainId; account: string };
  amount: number;
  receiverGuard: {
    pred: string;
    keys: [string];
  };
}
export interface ITransferDataResult {
  tx?: ITransactionData | undefined;
  error?: string;
}

export interface ITransferResult {
  requestKey?: string;
  status?: string;
}

const debug = Debug('transfer-finisher');
const gasLimit: number = kadenaConstants.GAS_LIMIT;
const gasPrice: number = kadenaConstants.GAS_PRICE;

export async function finishXChainTransfer(
  requestKey: string,
  step: number,
  rollback: boolean,
  network: Network,
  chainId: ChainId,
  sender: string,
): Promise<ContCommand | { error: string }> {
  const host = getKadenaConstantByNetwork(network).apiHost({
    networkId: chainNetwork[network].network,
    chainId,
  });
  const hostSPV = `${getKadenaConstantByNetwork(network).apiHost({
    networkId: chainNetwork[network].network,
    chainId: '1',
  })}/spv`;

  try {
    const contCommand = await getContCommand(
      requestKey,
      chainId,
      hostSPV,
      step + 1,
      rollback,
    );

    contCommand.setMeta(
      {
        chainId,
        sender,
        gasLimit,
        gasPrice,
      },
      chainNetwork[network].network as ChainwebNetworkId,
    );

    contCommand.createCommand();

    const localResult = await contCommand.local(host, {
      preflight: false,
      signatureVerification: false,
    });

    if (localResult.result.status !== 'success') {
      debug(localResult.result.error.message);
      return { error: localResult.result.error.message };
    }

    await contCommand.send(host);

    return contCommand;
  } catch (e) {
    debug(e.message);
    return { error: e.message };
  }
}
