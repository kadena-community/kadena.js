/* eslint-disable @kadena-dev/no-eslint-disable */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @rushstack/typedef-var */

import { createTransaction, Pact, readKeyset } from '@kadena/client';
import {
  addKeyset,
  addSigner,
  asyncPipe,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';

import { listen, preflight, submitOne } from '../util/client';
import { checkSuccess, safeSigned, throwIfFailed } from '../util/fp-helpers';

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
  checkSuccess(preflight),
  submitOne,
  listen,
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
