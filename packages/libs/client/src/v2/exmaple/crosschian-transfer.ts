import { getClient } from '../client/client';
import {
  commandBuilder,
  ICommand,
  IContinuationPayload,
  meta,
  payload,
  set,
  signer,
} from '../pact';
import { sign } from '../sing';

import { coin } from './coin-contract';

interface IAccount {
  account: string;
  chainId: string;
  guard: string;
}

function debitInTheFirstChain(from: IAccount, to: IAccount, amount: string) {
  return commandBuilder(
    payload.exec([
      coin['transfer-crosschain'](from.account, to.account, to.guard, '01', {
        decimal: amount.toString(),
      }),
    ]),
    signer('javad', (withCapability) => [
      withCapability('coin.TRANSFER_XCHAIN', from.account, to.account, {
        decimal: '1',
      }),
    ]),
    meta({ chainId: from.chainId }),
    set('networkId', 'testnet04'),
  );
}

function creditInTheTargetChain(
  continuation: IContinuationPayload,
  targetChainId: string,
) {
  return commandBuilder(
    payload.cont(continuation),
    signer('test', (withCapability) => [withCapability('test')]),
    meta({ chainId: targetChainId }),
    set('networkId', 'testnet04'),
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
) {
  await Promise.resolve(
    debitInTheFirstChain(from, to, amount).command as ICommand,
  )
    .then(sign)
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
        ).command as ICommand,
    )
    .then(sign)
    .then(submit)
    .then(([, poll]) => poll());

  const command = debitInTheFirstChain(from, to, amount).command as ICommand;

  const transaction = await sign(command);
  const [[sendRequestKey], pollSendResult] = await submit(transaction);

  const { [sendRequestKey]: debitResult } = await pollSendResult();
  if (debitResult.result.status === 'failure') {
    // TODO: return a signal to show failure or throw an exception
    return [false, debitResult, null] as const;
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
  ).command as ICommand;

  const continuationTr = await sign(continuation);
  const [[contRequestKey], pollContResult] = await submit(continuationTr);

  const { [contRequestKey]: creditResult } = await pollContResult();
  if (creditResult.result.status === 'failure') {
    // TODO: return a signal to show failure or throw an exception
    return [false, debitResult, creditResult] as const;
  }
  return [true, debitResult, creditResult] as const;
}
