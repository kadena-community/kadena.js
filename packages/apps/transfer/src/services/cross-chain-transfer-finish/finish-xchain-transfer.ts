import { ChainwebNetworkId } from '@kadena/chainweb-node-client';
import { ContCommand, getContCommand } from '@kadena/client';
import { ChainId } from '@kadena/types';

import { kadenaConstants } from '../../constants/kadena';
import { generateApiHost } from '../utils/utils';

export interface ITransferResult {
  requestKey?: string;
  status?: string;
}

const gasLimit: number = kadenaConstants.GAS_LIMIT;
const gasPrice: number = kadenaConstants.GAS_PRICE;

export async function finishXChainTransfer(
  requestKey: string,
  step: number,
  pactID: string,
  rollback: boolean,
  server: string,
  network: ChainwebNetworkId,
  chainId: ChainId,
  sender: string,
): Promise<ContCommand | { error: string }> {
  const host = generateApiHost(server, network, chainId);
  const hostSPV = `${generateApiHost(server, network, '1')}/spv`;

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
      network,
    );

    contCommand.createCommand();

    const localResult = await contCommand.local(host, {
      preflight: false,
      signatureVerification: false,
    });

    if (localResult.result.status !== 'success') {
      return { error: localResult.result.error.message };
    }

    await contCommand.send(host);

    return contCommand;
  } catch (e) {
    console.log(e.message);
    return { error: e.message };
  }
}
