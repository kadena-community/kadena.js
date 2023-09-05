import { ICommandResult } from '@kadena/chainweb-node-client';
import { ChainId, IUnsignedCommand } from '@kadena/types';

import {
  IContinuationPayloadObject,
  isSignedTransaction,
  Pact,
  readKeyset,
} from '../../../index';
import { NetworkId } from '../../support/enums';
import { IAccount, IAccountWithSecretKey } from '../../support/interfaces';
import { keyFromAccount } from '../account/keyFromAccount';
import { listen, pollCreateSpv, pollStatus, submit } from '../client';

import { signByKeyPair } from './sign-transaction';

function startCrossChainTransfer(
  from: IAccountWithSecretKey,
  to: IAccount,
  amount: string,
): IUnsignedCommand {
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
  gasPayer: string,
): IUnsignedCommand {
  const builder = Pact.builder
    .continuation(continuation)
    .setNetworkId(NetworkId.fast_development)
    // uncomment this if you want to pay gas yourself
    .addSigner(keyFromAccount(gasPayer), (withCapability) => [
      withCapability('coin.GAS'),
    ])
    .setMeta({
      chainId: targetChainId,
      senderAccount: gasPayer,
      // this need to be less than or equal to 850 if you want to use gas-station, otherwise the gas-station does not pay the gas
      gasLimit: 850,
    });

  return builder.createTransaction();
}

export async function executeCrossChainTransfer(
  from: IAccount & { secretKey: string },
  to: IAccount,
  amount: string,
): Promise<Record<string, ICommandResult>> {
  return (
    Promise.resolve(startCrossChainTransfer(from, to, amount))
      //    .then(inspect('command'))
      .then((command) => signByKeyPair(command, from))
      //     .then(inspect('command'))
      .then((command) =>
        isSignedTransaction(command)
          ? command
          : Promise.reject('CMD_NOT_SIGNED'),
      )
      // inspect is only for development you can remove them
      //    .then(inspect('EXEC_SIGNED'))
      .then((cmd) => submit(cmd))
      //  .then(inspect('SUBMIT_RESULT'))
      .then(listen)
      //  .then(inspect('LISTEN_RESULT'))
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
      .then(([status, proof]) =>
        finishInTheTargetChain(
          {
            pactId: status.continuation?.pactId,
            proof,
            rollback: false,
            step: 1,
          },
          to.chainId,
          to.account,
        ),
      )
      .then((command) => signByKeyPair(command, from))
      .then((command) =>
        isSignedTransaction(command)
          ? command
          : Promise.reject('CMD_NOT_SIGNED'),
      )
      .then((cmd) => submit(cmd))
      .then(pollStatus)
  );
}
