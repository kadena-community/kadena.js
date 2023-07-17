import {
  ChainwebChainId,
  ChainwebNetworkId,
} from '@kadena/chainweb-node-client';
import { ContCommand, getContCommand } from '@kadena/client';

import {
  getKadenaConstantByNetwork,
  kadenaConstants,
  Network,
} from '@/constants/kadena';
import { chainNetwork } from '@/constants/network';
import Debug from 'debug';

export interface ITransferResult {
  requestKey?: string;
  status?: string;
}

const debug = Debug('kadena-transfer:services:finish-xchain-transfer');
const gasLimit: number = kadenaConstants.GAS_LIMIT;
const gasPrice: number = kadenaConstants.GAS_PRICE;

export async function finishXChainTransfer(
  requestKey: string,
  step: number,
  rollback: boolean,
  network: Network,
  chainId: ChainwebChainId,
  sender: string,
): Promise<ContCommand | { error: string }> {
  debug(finishXChainTransfer.name);
  const host = getKadenaConstantByNetwork(network).apiHost({
    networkId: chainNetwork[network].network,
    chainId,
  });

  try {
    const contCommand = await getContCommand(
      requestKey,
      chainId,
      host,
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
