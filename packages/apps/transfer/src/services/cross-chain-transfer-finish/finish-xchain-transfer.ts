import { ChainwebNetworkId } from '@kadena/chainweb-node-client';
import {
  ContCommand,
  getContCommand,
  PactCommand,
  pollSpvProof,
} from '@kadena/client';
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

export interface ISpvProofResult {
  proof?: string;
  error?: string;
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
  chain: ChainId,
  gasPayer: string,
): Promise<ContCommand | undefined> {
  const host = generateApiHost(server, network, chain);
  const hostSPV = `${generateApiHost(server, network, '1')}/spv`;

  try {
    const contCommand = await getContCommand(
      requestKey,
      chain,
      hostSPV,
      1,
      rollback,
    );

    contCommand.setMeta(
      {
        chainId: chain,
        sender: gasPayer,
        gasLimit,
        gasPrice,
      },
      network,
    );

    const createResult = contCommand.createCommand();

    const localResult = await contCommand.local(host);

    if (localResult.result.status !== 'success') {
      return undefined;
    }

    const result = await contCommand.send(host);

    return contCommand;
  } catch (e) {
    console.log(e.message);
    return undefined;
  }
}
