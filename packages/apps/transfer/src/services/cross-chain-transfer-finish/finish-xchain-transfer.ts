import { ChainwebNetworkId } from '@kadena/chainweb-node-client';
import { ContCommand, getContCommand } from '@kadena/client';
import { ChainId } from '@kadena/types';

import { generateApiHost } from '../utils/utils';

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

export interface TransferResult {
  requestKey?: string;
  status?: string;
}

const gasLimit: number = 850;
const gasPrice: number = 0.00000001;

export async function finishXChainTransfer(
  requestKey: string,
  step: number,
  pactID: string,
  rollback: boolean,
  server: string,
  network: ChainwebNetworkId,
  targetChain: ChainId,
  gasPayer: string,
): Promise<ContCommand | { error: string }> {
  const host = generateApiHost(server, network, targetChain);
  const hostSPV = `${generateApiHost(server, network, '1')}/spv`;

  try {
    const contCommand = await getContCommand(
      requestKey,
      targetChain,
      hostSPV,
      step + 1,
      rollback,
    );

    contCommand.setMeta(
      {
        chainId: targetChain,
        sender: gasPayer,
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
