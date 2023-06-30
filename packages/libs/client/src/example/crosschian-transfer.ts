/* istanbul ignore file */
// this module is just a code snippet for the cross chain transfer

import { ICommandResult } from '@kadena/chainweb-node-client';

import { getClient } from '../client/client';
import {
  commandBuilder,
  ICommand,
  IContinuationPayload,
  payload,
  setMeta,
  setProp,
  setSigner,
} from '../index';
import { Pact } from '../pact';
import { quicksign } from '../sign';

const { coin } = Pact.modules;

interface IAccount {
  account: string;
  chainId: string;
  guard: string;
}

function debitInTheFirstChain(
  from: IAccount,
  to: IAccount,
  amount: string,
): Partial<ICommand> {
  return commandBuilder(
    payload.exec([
      coin['transfer-crosschain'](from.account, to.account, to.guard, '01', {
        decimal: amount.toString(),
      }),
    ]),
    setSigner('javad', (withCapability) => [
      withCapability('coin.TRANSFER_XCHAIN', from.account, to.account, {
        decimal: '1',
      }),
    ]),
    setMeta({ chainId: from.chainId }),
    setProp('networkId', 'testnet04'),
  );
}

function creditInTheTargetChain(
  continuation: IContinuationPayload,
  targetChainId: string,
): Partial<ICommand> {
  return commandBuilder(
    payload.cont(continuation),
    setSigner('test', (withCapability) => [withCapability('test')]),
    setMeta({ chainId: targetChainId }),
    setProp('networkId', 'testnet04'),
  );
}

const { submit, pollSpv: pollCreateSpv } = getClient();

// TODO: find a way to send some signal about the step to the consumer of this function
// it could be a generator function of a event emitter.
// with a generator approach we can even received some signals from the user.
// for example when timeout happens but user what to try it one more time

export async function doCrossChianTransfer(
  from: IAccount,
  to: IAccount,
  amount: string,
): Promise<[boolean, ICommandResult, ICommandResult | undefined]> {
  await Promise.resolve(debitInTheFirstChain(from, to, amount) as ICommand)
    .then(quicksign)
    .then(submit)
    .then(([[requestKey], poll]) => Promise.all([requestKey, poll()]))
    .then(([requestKey, result]) => result[requestKey])
    .then((status) =>
      status.result.status === 'failure'
        ? Promise.reject('DEBIT REJECTED')
        : status,
    )
    .then((status) =>
      Promise.all([status, pollCreateSpv(status.reqKey, to.chainId)]),
    )
    .then(
      ([status, proof]) =>
        creditInTheTargetChain(
          {
            pactId: status.continuation?.pactId,
            proof,
            rollback: false,
            step: '1',
          },
          to.chainId,
        ) as ICommand,
    )
    .then(quicksign)
    .then(submit)
    .then(([, poll]) => poll());

  // or we can use async/await

  const command = debitInTheFirstChain(from, to, amount) as ICommand;

  const transaction = await quicksign(command);
  const [[sendRequestKey], pollSendResult] = await submit(transaction);

  const { [sendRequestKey]: debitResult } = await pollSendResult();
  if (debitResult.result.status === 'failure') {
    // TODO: return a signal to show failure or throw an exception
    return [false, debitResult, undefined];
  }
  const proof = await pollCreateSpv(sendRequestKey, to.chainId);
  const continuation = creditInTheTargetChain(
    {
      pactId: debitResult.continuation?.pactId,
      proof,
      rollback: false,
      step: '1',
    },
    to.chainId,
  ) as ICommand;

  const continuationTr = await quicksign(continuation);
  const [[contRequestKey], pollContResult] = await submit(continuationTr);

  const { [contRequestKey]: creditResult } = await pollContResult();
  if (creditResult.result.status === 'failure') {
    // TODO: return a signal to show failure or throw an exception
    return [false, debitResult, creditResult];
  }
  return [true, debitResult, creditResult];
}
