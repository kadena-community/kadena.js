/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { ICommandResult } from '@kadena/chainweb-node-client';
import {
  createTransaction,
  Pact,
  readKeyset,
  signWithChainweaver,
} from '@kadena/client';
import {
  addKeyset,
  addSigner,
  composePactCommand,
  continuation,
  execution,
  setMeta,
  setNetworkId,
} from '@kadena/client/fp';
import { isSignedCommand } from '@kadena/pactjs';
import { ChainId } from '@kadena/types';

import { listen, pollCreateSpv, pollStatus, submit } from '../util/client';
import { asyncPipe, inspect } from '../util/fp-helpers';
import { keyFromAccount } from '../util/keyFromAccount';

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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function startInTheFirstChain(from: IAccount, to: IAccount, amount: string) {
  return composePactCommand(
    execution(
      Pact.modules.coin.defpact['transfer-crosschain'](
        from.account,
        to.account,
        readKeyset('receiver-guard'),
        to.chainId,
        {
          decimal: amount.toString(),
        },
      ),
    ),
    addSigner(from.publicKey, (withCapability) => [
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
    ]),
    addKeyset('receiver-guard', 'keys-all', to.publicKey),
    setMeta({ chainId: from.chainId, senderAccount: from.account }),
    setNetworkId(NETWORK_ID),
  );
}

const finishInTheTargetChain = (
  targetChainId: ChainId,
  gasPayer: string = 'kadena-xchain-gas',
) => {
  return ([pactId, proof]: [string, string]) =>
    composePactCommand(
      setNetworkId(NETWORK_ID),
      // uncomment this if you want to pay gas yourself
      // addSigner(gasPayer.publicKey, (withCapability) => [
      //   withCapability('coin.GAS'),
      // ]),
      setMeta({
        chainId: targetChainId,
        senderAccount: gasPayer,
        // this need to be less than or equal to 850 if you want to use gas-station, otherwise the gas-station does not pay the gas
        gasLimit: 850,
      }),
    )(
      continuation({
        pactId,
        proof,
        rollback: false,
        step: 1,
      }),
    );
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const rejectIfFailed = (message: string) => (response: ICommandResult) =>
  response.result.status === 'failure'
    ? Promise.reject(new Error(message))
    : response;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function doCrossChainTransfer(
  from: IAccount,
  to: IAccount,
  amount: string,
) {
  return asyncPipe(
    startInTheFirstChain(from, to, amount),
    createTransaction,
    inspect('TX_CREATED'),
    signWithChainweaver,
    inspect('TX_SIGNED'),
    (command) =>
      isSignedCommand(command) ? command : Promise.reject('CMD_NOT_SIGNED'),
    submit,
    inspect('TX_SUBMITTED'),
    listen,
    inspect('TX_RESULT'),
    rejectIfFailed('DEBIT_REJECTED'),
    (status: ICommandResult) =>
      Promise.all([
        status.continuation?.pactId,
        pollCreateSpv(
          {
            requestKey: status.reqKey,
            chainId: from.chainId,
            networkId: NETWORK_ID,
          },
          to.chainId,
        ),
      ]),
    inspect('SPV_CREATED'),
    finishInTheTargetChain(to.chainId),
    createTransaction,
    inspect('CONT_CREATED'),
    submit,
    inspect('CONT_SUBMITTED'),
    listen,
    inspect('CONT_RESULT'),
    rejectIfFailed('CREDIT REJECTED'),
  )({});
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
