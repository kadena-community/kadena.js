import {
  ChainwebNetworkId,
  ICommandResult,
} from '@kadena/chainweb-node-client';
import { PactCommand } from '@kadena/client';
import { ChainId, IPactEvent, PactValue } from '@kadena/types';

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
  proof: string;
  events?: IEventData[];
  step?: number;
  pactId?: string;
  rollback?: boolean;
  result: ICommandResult['result'];
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

    console.log('FOUND', found);

    return {
      tx: {
        sender: {
          chain: found.chainId.toString() as ChainId,
          account:
            found.tx?.continuation?.continuation?.args[0 as keyof PactValue],
        },
        receiver: {
          chain: found.tx?.continuation?.yield?.provenance
            ?.targetChainId as ChainId,
          account: found.tx?.continuation?.yield?.data.receiver,
        },
        amount: parseFloat(found.tx?.continuation?.yield?.data.amount),
        receiverGuard: {
          pred: found?.tx?.continuation?.yield?.data['receiver-guard'].pred,
          keys: found?.tx?.continuation?.yield?.data['receiver-guard'].keys,
        },
        events: found.tx?.events?.map((event: IPactEvent) => {
          return {
            name: event.name,
            params: event.params,
            moduleName: event.module.name,
          };
        }),
        result: found.tx.result,
        step: found.tx?.continuation?.step,
        pactId: found.tx?.continuation?.pactId,
        rollback: found.tx?.continuation?.stepHasRollback,
      },
    };
  } catch (e) {
    console.log(e);
    return { error: e.message };
  }
}

export async function getSpvProof({
  requestKey,
  server,
  networkId,
  chainId,
  t,
}: {
  requestKey: string;
  server: string;
  networkId: ChainwebNetworkId;
  chainId: ChainId;
  t: Translate;
}): Promise<ISpvProofResult> {
  const keyValid = validateRequestKey(requestKey);

  if (!keyValid) {
    return { error: t('Invalid length of request key') };
  }

  const pactCommand = new PactCommand();

  pactCommand.requestKey = requestKey;

  try {
    const host = `https://${server}/chainweb/0.0/${networkId}/chain/${chainId}/pact/spv`;
    const result = await fetch(host, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ targetChainId: '3', requestKey: requestKey }),
    });

    if (result.ok) {
      return { proof: await result.json() };
    } else {
      const proofError = await result.text();
      //Initial Step is not confirmed yet.
      return {
        error:
          'Initial transfer is not confirmed yet. Please wait and try again.',
      };
    }
  } catch (e) {
    console.log(e);
    return {
      error:
        'Initial transfer is not confirmed yet. Please wait and try again.',
    };
  }
}
