/* eslint-disable @kadena-dev/no-eslint-disable */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @rushstack/typedef-var */
import type {
  ICommand,
  ICommandResult,
  IUnsignedCommand,
} from '@kadena/client';
import {
  createClient,
  createTransaction,
  isSignedTransaction,
  Pact,
  readKeyset,
  signWithChainweaver,
} from '@kadena/client';
import {
  addKeyset,
  addSigner,
  asyncPipe,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';

const client = createClient();

const submitOne = (transaction: ICommand) => client.submit(transaction);

// throw if the result is failed ; we might introduce another api for error handling
const throwIfFailed = (response: ICommandResult) => {
  if (response.result.status === 'success') {
    return response;
  }
  throw response.result.error;
};

// run preflight and return the tx if its successful
const testPreflight = (tx: ICommand) =>
  asyncPipe(client.preflight, throwIfFailed, () => tx)(tx);

const validateSign = (
  tx: IUnsignedCommand,
  signedTx: ICommand | IUnsignedCommand,
) => {
  const { sigs, hash } = signedTx;
  const txWidthSigs = { ...tx, sigs };
  if (txWidthSigs.hash !== hash) {
    throw new Error('Hash mismatch');
  }
  if (!isSignedTransaction(txWidthSigs)) {
    throw new Error('Signing failed');
  }
  return txWidthSigs;
};

const safeSigned = async (tx: IUnsignedCommand) => {
  const signedTx = await signWithChainweaver(tx);
  return validateSign(tx, signedTx);
};

const createAccountCommand = (
  account: string,
  publicKey: string,
  sender: { account: string; publicKey: string },
) =>
  composePactCommand(
    execution(
      Pact.modules.coin['create-account'](account, readKeyset('account-guard')),
    ),
    addKeyset('account-guard', 'keys-all', publicKey),
    addSigner(sender.publicKey, (withCapability) => [
      withCapability('coin.GAS'),
    ]),
    setMeta({ senderAccount: sender.account }),
  )();

const submitAndListen = asyncPipe(
  createTransaction,
  safeSigned,
  testPreflight,
  submitOne,
  client.listen,
  throwIfFailed,
);

const createAccount = asyncPipe(createAccountCommand, submitAndListen);

// create account for "bob"
export async function test() {
  const result = await createAccount('bob', 'bob-key', {
    account: 'gasPayer',
    publicKey: 'gasPayer-publicKey',
  });

  console.log(result);
}
