import { ICommandResult } from '@kadena/chainweb-node-client';
import {
  IContinuationPayloadObject,
  isSignedCommand,
  Pact,
  signWithChainweaver,
} from '@kadena/client';
import { ChainId, IUnsignedCommand } from '@kadena/types';

import { pollCreateSpv, pollStatus, submit } from './util/client';

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
): IUnsignedCommand {
  return Pact.builder
    .execute(
      Pact.modules.coin.defpact['transfer-crosschain'](
        from.account,
        to.account,
        to.guard,
        '01',
        {
          decimal: amount.toString(),
        },
      ),
    )
    .addSigner(from.publicKey, (withCapability) => [
      // in typescript this function suggests you only relevant capabilities
      withCapability(
        'coin.TRANSFER_XCHAIN',
        from.account,
        to.account,
        {
          decimal: amount,
        },
        to.chainId,
      ),
    ])
    .setMeta({ chainId: from.chainId })
    .setNetworkId('testnet04')
    .createTransaction();
}

function creditInTheTargetChain(
  continuation: IContinuationPayloadObject['cont'],
  targetChainId: ChainId,
): IUnsignedCommand {
  return Pact.builder
    .continuation(continuation)
    .addSigner('test', (withCapability) => [withCapability('test')])
    .setMeta({ chainId: targetChainId })
    .setNetworkId('testnet04')
    .createTransaction();
}

export async function doCrossChianTransfer(
  from: IAccount,
  to: IAccount,
  amount: string,
): Promise<Record<string, ICommandResult>> {
  return Promise.resolve(debitInTheFirstChain(from, to, amount))
    .then(signWithChainweaver)
    .then(([command]) =>
      isSignedCommand(command) ? command : Promise.reject('CMD_NOT_SIGNED'),
    )
    .then(submit)
    .then(pollStatus)
    .then((result) => Object.values(result)[0])
    .then((status) =>
      status.result.status === 'failure'
        ? Promise.reject('DEBIT REJECTED')
        : status,
    )
    .then((status) =>
      Promise.all([status, pollCreateSpv(status.reqKey, to.chainId)]),
    )
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
    .then(signWithChainweaver)
    .then(([command]) =>
      isSignedCommand(command) ? command : Promise.reject('CMD_NOT_SIGNED'),
    )
    .then(submit)
    .then(pollStatus);
}
