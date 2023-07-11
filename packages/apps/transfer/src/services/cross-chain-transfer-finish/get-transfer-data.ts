import {
  ChainwebChainId,
  ICommandResult,
  IPollResponse,
} from '@kadena/chainweb-node-client';
import { PactCommand } from '@kadena/client';
import { IPactEvent, IPactExec, PactValue } from '@kadena/types';

import { getKadenaConstantByNetwork, Network } from '@/constants/kadena';
import { chainNetwork } from '@/constants/network';
import {
  convertIntToChainId,
  validateRequestKey,
} from '@/services/utils/utils';
import Debug from 'debug';
import { Translate } from 'next-translate';

interface ITransactionData {
  sender: { chain: ChainwebChainId; account: string };
  receiver: { chain: ChainwebChainId; account: string };
  amount: number;
  receiverGuard: {
    pred: string;
    keys: [string];
  };
  step: number;
  pactId: string;
  rollback: boolean;
  events?: IEventData[];
  result?: ICommandResult['result'];
}
export interface ITransferDataResult {
  tx?: ITransactionData | undefined;
  error?: string;
}

export interface ISpvProofResult {
  proof?: string;
  error?: string;
}

interface IEventData {
  name: string;
  params: PactValue[];
  moduleName: string;
}

const debug = Debug('kadena-transfer:services:get-transfer-data');

export async function getTransferData({
  requestKey,
  network,
  t,
}: {
  requestKey: string;
  network: Network;
  t: Translate;
}): Promise<ITransferDataResult> {
  debug(getTransferData.name);
  const validatedRequestKey = validateRequestKey(requestKey);

  if (validatedRequestKey === undefined) {
    return { error: t('Invalid length of request key') };
  }

  const pactCommand = new PactCommand();

  pactCommand.requestKey = requestKey;

  try {
    const chainInfoPromises = Array.from(new Array(20)).map((item, chainId) => {
      const host = getKadenaConstantByNetwork(network).apiHost({
        networkId: chainNetwork[network].network,
        chainId: convertIntToChainId(chainId),
      });
      return pactCommand.poll(host);
    });
    const chainInfos = await Promise.all(chainInfoPromises);

    const found: { chainId: number; tx: ICommandResult } | undefined =
      chainInfos.reduce(
        (
          acc: { chainId: number; tx: ICommandResult } | undefined,
          curr: IPollResponse,
          chain: number,
          array: IPollResponse[],
        ) => {
          array.splice(chain - 1);
          if (curr[requestKey] !== undefined) {
            return { chainId: chain, tx: curr[validatedRequestKey] };
          }
        },
        undefined,
      );

    if (found === undefined) {
      return { error: t('No request key found') };
    }

    const [senderAccount, receiverAccount, guard, targetChain, amount] =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      found.tx?.continuation?.continuation.args as Array<any>;

    const { step, stepHasRollback, pactId } = found.tx
      ?.continuation as IPactExec;
    const { events, result } = found.tx;

    return {
      tx: {
        sender: {
          chain: found.chainId.toString() as ChainwebChainId,
          account: senderAccount,
        },
        receiver: {
          chain: targetChain as ChainwebChainId,
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
    debug(e);
    return { error: e.message };
  }
}
