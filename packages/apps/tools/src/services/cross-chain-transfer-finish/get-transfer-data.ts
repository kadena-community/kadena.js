import type { Network } from '@/constants/kadena';
import { chainNetwork } from '@/constants/network';
import { convertIntToChainId, validateRequestKey } from '@/services/utils/utils';
import type { INetworkData } from '@/utils/network';
import { getApiHost } from '@/utils/network';
import type { ChainwebChainId, ICommandResult } from '@kadena/chainweb-node-client';
import { createClient } from '@kadena/client';
import type { IPactEvent, IPactExec, PactValue } from '@kadena/types';
import Debug from 'debug';
import type { Translate } from 'next-translate';

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
  networksData,
}: {
  requestKey: string;
  network: Network;
  t: Translate;
  networksData: INetworkData[];
}): Promise<ITransferDataResult> {
  debug(getTransferData.name);
  const validatedRequestKey = validateRequestKey(requestKey);

  if (validatedRequestKey === undefined) {
    return { error: t('Invalid length of request key') };
  }

  try {
    const chainInfoPromises = Array.from(new Array(20)).map((item, chainId) => {
      const networkDto = networksData.find((item) => item.networkId === network);

      if (!networkDto) {
        return;
      }

      const host = getApiHost({
        api: networkDto.API,
        networkId: networkDto.networkId,
        chainId: convertIntToChainId(chainId),
      });

      const { getStatus } = createClient(host);
      return getStatus({
        requestKey,
        chainId: convertIntToChainId(chainId),
        networkId: chainNetwork[network].network,
      });
    });
    const chainInfos = await Promise.all(chainInfoPromises);

    const request = chainInfos.find((chainInfo) => chainInfo && requestKey in chainInfo);

    if (!request) {
      return { error: t('No request key found') };
    }

    const found = request[requestKey];

    const { events, result } = found;

    if ('error' in result) {
      return result.error;
      // return { error: ('message' in result.error ? (result.error.message as string) : 'An error occurred.' };
    }

    const [senderAccount, receiverAccount, guard, targetChain, amount] =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      found?.continuation?.continuation.args as Array<any>;

    const { step, stepHasRollback, pactId } = found?.continuation as IPactExec;

    return {
      tx: {
        sender: {
          chain: '1', // todo: fix typing. // found.chainId.toString() as ChainwebChainId,
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
