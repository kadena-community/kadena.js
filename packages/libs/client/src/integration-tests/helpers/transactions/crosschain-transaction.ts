import { ICommandResult } from '@kadena/chainweb-node-client';
import { ChainId, ICommand, IUnsignedCommand } from '@kadena/types';

import {
  IContinuationPayloadObject,
  isSignedTransaction,
  Pact,
  readKeyset,
} from '../../../index';
import { listen, pollCreateSpv, pollStatus, submit } from '../client';
import { NetworkId } from '../enums';
import { inspect } from '../fp-helpers';
import { IAccount } from '../interfaces';

import { signByKeyPair } from './sign-transaction';

function startCrossChainTransfer(
  from: IAccount,
  to: IAccount,
  amount: string,
): IUnsignedCommand {
  console.log('Start Cross Chain Transfer');
  return (
    Pact.builder
      .execution(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (Pact.modules as any).coin.defpact['transfer-crosschain'](
          from.account,
          to.account,
          readKeyset('receiver-guard'),
          to.chainId,
          {
            decimal: amount.toString(),
          },
        ),
      )
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .addSigner(from.publicKey, (withCapability: any) => [
        withCapability('coin.GAS'),
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
      .addKeyset('receiver-guard', 'keys-all', to.publicKey)
      .setMeta({ chainId: from.chainId, senderAccount: from.account })
      .setNetworkId(NetworkId.fast_development)
      .createTransaction()
  );
}

function finishInTheTargetChain(
  continuation: IContinuationPayloadObject['cont'],
  targetChainId: ChainId,
  gasPayer: string = 'kadena-xchain-gas',
): IUnsignedCommand {
  console.log('Starting Continuation');
  const builder = Pact.builder
    .continuation(continuation)
    .setNetworkId(NetworkId.fast_development)
    .setMeta({
      chainId: targetChainId,
      senderAccount: gasPayer,
      // this need to be less than or equal to 850 if you want to use gas-station, otherwise the gas-station does not pay the gas
      gasLimit: 850,
    });

  return builder.createTransaction();
}

export async function executeCrossChainTransfer(
  from: IAccount,
  to: IAccount,
  amount: string,
): Promise<Record<string, ICommandResult>> {
  return (
    Promise.resolve(startCrossChainTransfer(from, to, amount))
      .then(inspect('command'))
      .then((command) => signByKeyPair(command))
      .then(inspect('command'))
      .then((command) =>
        isSignedTransaction(command)
          ? command
          : Promise.reject('CMD_NOT_SIGNED'),
      )
      // inspect is only for development you can remove them
      .then(inspect('EXEC_SIGNED'))
      .then((cmd) => submit(cmd))
      .then(inspect('SUBMIT_RESULT'))
      .then(listen)
      .then(inspect('LISTEN_RESULT'))
      .then((status) =>
        status.result.status === 'failure'
          ? Promise.reject(new Error('DEBIT REJECTED'))
          : status,
      )
      .then((status) =>
        Promise.all([
          status,
          pollCreateSpv(
            {
              requestKey: status.reqKey,
              networkId: NetworkId.fast_development,
              chainId: from.chainId,
            },
            to.chainId,
          ),
        ]),
      )
      .then(
        ([status, proof]) =>
          finishInTheTargetChain(
            {
              pactId: status.continuation?.pactId,
              proof,
              rollback: false,
              step: 1,
            },
            to.chainId,
          ) as ICommand,
      )
      .then((cmd) => submit(cmd))
      .then(pollStatus)
  );
}
