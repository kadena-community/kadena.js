import {
  ChainwebNetworkId,
  ICommandResult,
} from '@kadena/chainweb-node-client';
import { PactCommand } from '@kadena/client';
import { ChainId, IPactExec, PactValue } from '@kadena/types';

import { validateRequestKey } from '../utils/utils';

import { Translate } from 'next-translate';
interface ITransactionData {
  sender: { chain: ChainId; account?: string };
  receiver: { chain: ChainId; account: string };
  amount: number;
  receiverGuard: {
    pred: string;
    keys: [string];
  };
  events?: IEventData[];
  step?: number;
  pactId?: string;
  rollback?: boolean;
}

interface IEventData {
  name: string;
  params: PactValue[];
  moduleName: string;
}
export interface ITransferDataResult {
  tx?: ITransactionData | undefined;
  error?: string;
}

export interface ISpvProofResult {
  proof?: string;
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
  const keyValid = validateRequestKey(requestKey);

  if (!keyValid) {
    return { error: t('Invalid length of request key') };
  }

  const pactCommand = new PactCommand();

  pactCommand.requestKey = requestKey;

  try {
    const chainInfoPromises = Array.from(new Array(20)).map((item, chainId) => {
      const host = `https://${server}/chainweb/0.0/${networkId}/chain/${chainId}/pact`;
      return pactCommand.poll(host);
    });
    const chainInfos = await Promise.all(chainInfoPromises);

    let found: { chainId: number; tx: ICommandResult } | undefined;
    chainInfos.map(async (pactInfo, chainId) => {
      if (pactInfo[requestKey] !== undefined) {
        console.log('FOUND2', pactInfo[requestKey]);
        found = { chainId: chainId, tx: pactInfo[requestKey] };
      }
    });

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
