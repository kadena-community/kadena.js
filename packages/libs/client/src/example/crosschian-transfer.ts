/* istanbul ignore file */
// this module is just a code snippet for the cross chain transfer

import { ICommandResult } from '@kadena/chainweb-node-client';
import { ChainId } from '@kadena/types';

import { getClient } from '../client/client';
import { ICoin } from '../commandBuilder/test/coin-contract';
import {
  addSigner,
  commandBuilder,
  IContinuationPayload,
  IPactCommand,
  payload,
  setMeta,
  setProp,
} from '../index';
import { getModule } from '../pact';
import { quicksign } from '../sign';
import { createTransaction } from '../utils/createTransaction';

const coin: ICoin = getModule('coin');

interface IAccount {
  account: string;
  publicKey: string;
  chainId: ChainId;
  guard: string;
}

function debitInTheFirstChain(
  from: IAccount,
  to: IAccount,
  amount: string,
): IPactCommand {
  return commandBuilder(
    payload.exec(
      coin['transfer-crosschain'](from.account, to.account, to.guard, '01', {
        decimal: amount.toString(),
      }),
    ),
    addSigner(from.publicKey, (withCapability) => [
      withCapability('coin.TRANSFER_XCHAIN', from.account, to.account, {
        decimal: '1',
      }),
    ]),
    setMeta({ chainId: from.chainId }),
    setProp('networkId', 'testnet04'),
  ) as IPactCommand;
}

function creditInTheTargetChain(
  continuation: IContinuationPayload['cont'],
  targetChainId: ChainId,
): IPactCommand {
  return commandBuilder(
    payload.cont(continuation),
    addSigner('test', (withCapability) => [withCapability('test')]),
    setMeta({ chainId: targetChainId }),
    setProp('networkId', 'testnet04'),
  ) as IPactCommand;
}

const { submit, pollSpv, pollStatus } = getClient();

// TODO: find a way to send some signal about the step to the consumer of this function
// it could be a generator function of a event emitter.
// with a generator approach we can even received some signals from the user.
// for example when timeout happens but user what to try it one more time

export async function doCrossChianTransfer(
  from: IAccount,
  to: IAccount,
  amount: string,
): Promise<[boolean, ICommandResult, ICommandResult | undefined]> {
  await Promise.resolve(debitInTheFirstChain(from, to, amount))
    .then(createTransaction)
    .then(quicksign)
    .then(submit)
    .then(pollStatus)
    .then((result) => Object.values(result)[0])
    .then((status) =>
      status.result.status === 'failure'
        ? Promise.reject('DEBIT REJECTED')
        : status,
    )
    .then((status) => Promise.all([status, pollSpv(status.reqKey, to.chainId)]))
    .then(([status, proof]) =>
      creditInTheTargetChain(
        {
          pactId: status.continuation?.pactId,
          proof,
          rollback: false,
          step: '1',
        },
        to.chainId,
      ),
    )
    .then(createTransaction)
    .then(quicksign)
    .then(submit)
    .then(pollStatus);

  // or we can use async/await

  const unsignedTr = createTransaction(debitInTheFirstChain(from, to, amount));

  const transaction = await quicksign(unsignedTr);
  const [sendRequestKey] = await submit(transaction);

  const { [sendRequestKey]: debitResult } = await pollStatus(sendRequestKey);
  if (debitResult.result.status === 'failure') {
    // TODO: return a signal to show failure or throw an exception
    return [false, debitResult, undefined];
  }
  const proof = await pollSpv(sendRequestKey, to.chainId);
  const continuation = creditInTheTargetChain(
    {
      pactId: debitResult.continuation?.pactId,
      proof,
      rollback: false,
      step: '1',
    },
    to.chainId,
  );

  const unsignedContinuationTr = await quicksign(
    createTransaction(continuation),
  );
  const [contRequestKey] = await submit(unsignedContinuationTr);

  const { [contRequestKey]: creditResult } = await pollStatus(contRequestKey);
  if (creditResult.result.status === 'failure') {
    // TODO: return a signal to show failure or throw an exception
    return [false, debitResult, creditResult];
  }
  return [true, debitResult, creditResult];
}
