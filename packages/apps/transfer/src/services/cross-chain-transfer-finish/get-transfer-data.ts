import {
  ChainwebNetworkId,
  ICommandResult,
} from '@kadena/chainweb-node-client';
import { PactCommand } from '@kadena/client';
import { ChainId, IPactEvent, IPactExec, PactValue } from '@kadena/types';

import {
  convertIntToChainId,
  generateApiHost,
  validateRequestKey,
} from '../utils/utils';

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
  result?: ICommandResult['result'];
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

    let found: { chainId: number; tx: ICommandResult } | undefined;
    chainInfos.map(async (pactInfo, chainId) => {
      if (pactInfo[validatedRequestKey] !== undefined) {
        console.log('pactInfo', pactInfo[validatedRequestKey]);
        found = { chainId: chainId, tx: pactInfo[validatedRequestKey] };
      }
    });

    if (found === undefined) {
      return { error: t('No request key found') };
    }

    const [senderAccount, receiverAccount, guard, targetChain, amount] = found
      .tx?.continuation?.continuation.args as Array<any>;
    const { step, stepHasRollback, pactId } = found.tx
      ?.continuation as IPactExec;
    const { events, result } = found.tx;

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
        result: result,
        events: events?.map((event: IPactEvent) => {
          return {
            name: event.name,
            params: event.params,
            moduleName: event.module.name,
          };
        }),
      },
    };
  } catch (e) {
    console.log(e);
    return { error: e.message };
  }
}
