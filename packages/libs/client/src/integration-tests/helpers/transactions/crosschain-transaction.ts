import { ICommandResult } from '@kadena/chainweb-node-client';
import { ChainId, ICommand, IUnsignedCommand } from '@kadena/types';

import { signWithChainweaver } from '../../../../lib';
import {
  IContinuationPayloadObject,
  isSignedTransaction,
  Pact,
  readKeyset,
} from '../../../index';
import { listen, pollCreateSpv, pollStatus, submit } from '../client';
import { inspect } from '../fp-helpers';
import { IAccount } from '../interfaces';

import { signByKeyPair } from './sign-transaction';

const NETWORK_ID: string = 'testnet04';

function startCrossChainTransfer(
  from: IAccount,
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
      .setNetworkId(NETWORK_ID)
      .createTransaction()
  );
}

function finishInTheTargetChain(
  continuation: IContinuationPayloadObject['cont'],
  targetChainId: ChainId,
  gasPayer: string = 'kadena-xchain-gas',
): IUnsignedCommand {
  const builder = Pact.builder
    .continuation(continuation)
    .setNetworkId(NETWORK_ID)
    // uncomment this if you want to pay gas yourself
    // .addSigner(gasPayer.publicKey, (withCapability) => [
    //   withCapability('coin.GAS'),
    // ])
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
  return Promise.resolve(startCrossChainTransfer(from, to, amount))
    .then((command) => signByKeyPair(command))
    .then((command) =>
      isSignedTransaction(command) ? command : Promise.reject('CMD_NOT_SIGNED'),
    )
    .then((cmd) => submit(cmd))
    .then(listen)
    .then((status) =>
      status.result.status === 'failure'
        ? Promise.reject(new Error('DEBIT REJECTED'))
        : status,
    )
    .then((status) =>
      Promise.all([status, pollCreateSpv(status.reqKey, to.chainId)]),
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
    .then(pollStatus);
}

// const from: IAccount = {
//   account: senderAccount,
//   chainId: '1',
//   publicKey: keyFromAccount(senderAccount),
//   // use keyset guard
//   guard: keyFromAccount(senderAccount),
// };
//
// const to: IAccount = {
//   account: receiverAccount, // k:account of sender
//   chainId: '0',
//   publicKey: keyFromAccount(receiverAccount),
//   // use keyset guard
//   guard: keyFromAccount(receiverAccount),
// };

// doCrossChainTransfer(from, to, amount);
//   .then((result) => console.log('success', result))
//   .catch((error) => console.error('error', error));
