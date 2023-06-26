import {
  ChainwebNetworkId,
  ICommandResult, IPollResponse,
} from '@kadena/chainweb-node-client';
import { PactCommand } from '@kadena/client';
import { ChainId, IPactExec } from '@kadena/types';

import {
  convertIntToChainId,
  generateApiHost,
  validateRequestKey,
} from '../utils/utils';

import { Translate } from 'next-translate';
interface ITransactionData {
  sender: { chain: ChainId; account: string };
  receiver: { chain: ChainId; account: string };
  amount: number;
  receiverGuard: {
    pred: string;
    keys: [string];
  };
  step: number;
  pactId: string;
  rollback: boolean;
}
export interface ITransferDataResult {
  tx?: ITransactionData | undefined;
  error?: string;
}

export async function getTransferData({
  requestKey,
  server,
  networkId,
  t,
}: {
  requestKey: string;
  server: string;
  networkId: ChainwebNetworkId;
  t: Translate;
}): Promise<ITransferDataResult> {
  const validatedRequestKey = validateRequestKey(requestKey);

  if (validatedRequestKey === undefined) {
    return { error: t('Invalid length of request key') };
  }

  const pactCommand = new PactCommand();

  pactCommand.requestKey = requestKey;

  try {
    const chainInfoPromises = Array.from(new Array(20)).map((item, chainId) => {
      const host = generateApiHost(
        server,
        networkId,
        convertIntToChainId(chainId),
      );
      return pactCommand.poll(host);
    });
    const chainInfos = await Promise.all(chainInfoPromises);

    const found : { chainId: number; tx: ICommandResult } | undefined = chainInfos.reduce((acc: { chainId: number; tx: ICommandResult } | undefined, curr: IPollResponse, chain: number, array: IPollResponse[]) => {
      array.splice(chain - 1);
      if (curr[requestKey] !== undefined) {
        return { chainId: chain, tx: curr[validatedRequestKey] };
      }
    }, undefined);

    if (found === undefined) {
      return { error: t('No request key found') };
    }

    const [senderAccount, receiverAccount, guard, targetChain, amount] = found
      .tx?.continuation?.continuation.args as Array<any>;
    const { step, stepHasRollback, pactId } = found.tx
      ?.continuation as IPactExec;

    return {
      tx: {
        sender: {
          chain: found.chainId.toString() as ChainId,
          account: senderAccount,
        },
        receiver: {
          chain: targetChain as ChainId,
          account: receiverAccount,
        },
        amount: amount,
        receiverGuard: guard,
        step: step,
        pactId: pactId,
        rollback: stepHasRollback,
      },
    };
  } catch (e) {
    console.log(e);
    return { error: e.message };
  }
}
