import type { ICommandResult } from '@kadena/chainweb-node-client';
// import { send } from '@kadena/chainweb-node-client';
import type { IContinuationPayloadObject } from '@kadena/client';
import { isSignedTransaction, Pact, readKeyset } from '@kadena/client';

import type { ChainId, ICommand, IUnsignedCommand } from '@kadena/types';

import config from './config';
import type { IAccount } from './helper';
import {
  inspect,
  listen,
  pollCreateSpv,
  pollStatus,
  signTransaction,
  submit,
  asyncPipe,
} from './helper';

function startInTheFirstChain(
  from: IAccount,
  to: IAccount,
  amount: string,
): IUnsignedCommand {
  console.log('startInTheFirstChain');
  return Pact.builder
    .execution(
      Pact.modules.coin.defpact['transfer-crosschain'](
        from.account,
        to.account,
        readKeyset('receiver-guard'),
        to.chainId || config.CHAIN_ID,
        {
          decimal: amount.toString(),
        },
      ),
    )
    .addSigner(from.publicKey, (withCapability) => [
      withCapability('coin.GAS'),
      withCapability(
        'coin.TRANSFER_XCHAIN',
        from.account,
        to.account,
        {
          decimal: amount,
        },
        to.chainId || config.CHAIN_ID,
      ),
    ])
    .addKeyset('receiver-guard', 'keys-all', to.publicKey)
    .setMeta({ chainId: from.chainId, senderAccount: from.account })
    .setNetworkId(config.NETWORK_ID)
    .createTransaction();
}

function finishInTheTargetChain(
  continuation: IContinuationPayloadObject['cont'],
  targetChainId: ChainId,
  gasPayer: string = 'kadena-xchain-gas',
): IUnsignedCommand {
  const builder = Pact.builder
    .continuation(continuation)
    .setNetworkId(config.NETWORK_ID)
    // uncomment this if you want to pay gas yourself
    .addSigner(gasPayer, (withCapability) => [withCapability('coin.GAS')])
    .setMeta({
      chainId: targetChainId,
      senderAccount: gasPayer,
      // this need to be less than or equal to 850 if you want to use gas-station, otherwise the gas-station does not pay the gas
      gasLimit: 850,
    });

  return builder.createTransaction();
}

export async function doCrossChainTransfer(
  from: IAccount,
  to: IAccount,
  amount: string,
): Promise<Record<string, ICommandResult>> {
  console.log(
    `Transfering from ${from.account} to ${to.account}\nAmount: ${amount}`,
  );

  return (
    Promise.resolve(startInTheFirstChain(from, to, amount))
      .then((command) =>
        signTransaction({
          publicKey: from.publicKey,
          secretKey: from.secretKey || '',
        })(command),
      )
      .then((command) =>
        isSignedTransaction(command)
          ? command
          : Promise.reject('CMD_NOT_SIGNED'),
      )
      // .then(inspect('EXEC_SIGNED'))
      .then((cmd) => submit(cmd))
      .then(inspect('submit'))
      .then(listen)
      .then(inspect('listen'))
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
              networkId: config.NETWORK_ID,
              chainId: from.chainId || config.CHAIN_ID,
            },
            to.chainId || config.CHAIN_ID,
          ),
        ]),
      )
      // .then(inspect('POLL_SPV_RESULT'))
      .then(
        ([status, proof]) =>
          finishInTheTargetChain(
            {
              pactId: status.continuation?.pactId,
              proof,
              rollback: false,
              step: 1,
            },
            to.chainId || config.CHAIN_ID,
            from.publicKey,
          ) as ICommand,
      )
      // .then(inspect('CONT_TR'))
      // uncomment the following lines if you want to pay gas from your account not the gas-station
      .then((command) =>
        signTransaction({
          publicKey: from.publicKey,
          secretKey: from.secretKey || '',
        })(command),
      )
      .then((command) =>
        isSignedTransaction(command)
          ? command
          : Promise.reject('CMD_NOT_SIGNED'),
      )
      // .then(inspect('CONT_SIGNED'))
      .then((cmd) => submit(cmd))
      .then(inspect('submit'))
      .then(pollStatus)
      .then(inspect('final result'))
  );
}
