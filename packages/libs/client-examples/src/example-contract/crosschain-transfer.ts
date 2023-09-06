import type { ICommandResult } from '@kadena/chainweb-node-client';
import type { IContinuationPayloadObject } from '@kadena/client';
import {
  isSignedTransaction,
  Pact,
  readKeyset,
  signWithChainweaver,
} from '@kadena/client';
import type { ChainId, ICommand, IUnsignedCommand } from '@kadena/types';

import { listen, pollCreateSpv, pollStatus, submit } from './util/client';
import { inspect } from './util/fp-helpers';
import { keyFromAccount } from './util/keyFromAccount';

interface IAccount {
  account: string;
  publicKey: string;
  chainId: ChainId;
  guard: string;
}

// npx ts-node crosschain-transfer.ts

const amount: string = '1';
// change these two accounts with your accounts
const senderAccount: string =
  'k:dc20ab800b0420be9b1075c97e80b104b073b0405b5e2b78afd29dd74aaf5e46';
const receiverAccount: string =
  'k:2f48080efe54e6eb670487f664bcaac7684b4ebfcfc8a3330ef080c9c97f7e11';

const NETWORK_ID: string = 'testnet04';

function startInTheFirstChain(
  from: IAccount,
  to: IAccount,
  amount: string,
): IUnsignedCommand {
  return Pact.builder
    .execution(
      Pact.modules.coin.defpact['transfer-crosschain'](
        from.account,
        to.account,
        readKeyset('receiver-guard'),
        to.chainId,
        {
          decimal: amount.toString(),
        },
      ),
    )
    .addSigner(from.publicKey, (withCapability) => [
      // in typescript this function suggests you only relevant capabilities
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
    .createTransaction();
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

async function doCrossChainTransfer(
  from: IAccount,
  to: IAccount,
  amount: string,
): Promise<Record<string, ICommandResult>> {
  return (
    Promise.resolve(startInTheFirstChain(from, to, amount))
      .then((command) => signWithChainweaver(command))
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
              networkId: NETWORK_ID,
              chainId: from.chainId,
            },
            to.chainId,
          ),
        ]),
      )
      .then(inspect('POLL_SPV_RESULT'))
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
      .then(inspect('CONT_TR'))
      // // uncomment the following lines if you want to pay gas from your account not the gas-station
      // .then((command) => signWithChainweaver(command))
      // .then((command) =>
      //   isSignedTransaction(command) ? command : Promise.reject('CMD_NOT_SIGNED'),
      // )
      // .then(inspect('CONT_SIGNED'))
      .then((cmd) => submit(cmd))
      .then(inspect('SUBMIT_RESULT'))
      .then(pollStatus)
      .then(inspect('FINAL_RESULT'))
  );
}

const from: IAccount = {
  account: senderAccount,
  chainId: '1',
  publicKey: keyFromAccount(senderAccount),
  // use keyset guard
  guard: keyFromAccount(senderAccount),
};

const to: IAccount = {
  account: receiverAccount, // k:account of sender
  chainId: '0',
  publicKey: keyFromAccount(receiverAccount),
  // use keyset guard
  guard: keyFromAccount(receiverAccount),
};

doCrossChainTransfer(from, to, amount)
  .then((result) => console.log('success', result))
  .catch((error) => console.error('error', error));
