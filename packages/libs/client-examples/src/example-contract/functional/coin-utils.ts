/* eslint-disable @kadena-dev/no-eslint-disable */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @rushstack/typedef-var */

import type { ChainId } from '@kadena/client';
import { Pact, readKeyset, signWithChainweaver } from '@kadena/client';
import {
  addKeyset,
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';

import type { IClientConfig } from '../../utils/rich-client';
import { dirtyRead, submitAndListen } from '../../utils/rich-client';

import { pipe } from 'ramda';

interface ICreateAccountCommandInput {
  account: string;
  publicKey: string;
  sender: { account: string; publicKey: string };
  chainId: ChainId;
}

const createAccountCommand = ({
  account,
  publicKey,
  sender,
  chainId,
}: ICreateAccountCommandInput) =>
  composePactCommand(
    execution(
      Pact.modules.coin['create-account'](account, readKeyset('account-guard')),
    ),
    addKeyset('account-guard', 'keys-all', publicKey),
    addSigner(sender.publicKey, (withCapability) => [
      withCapability('coin.GAS'),
    ]),
    setMeta({ senderAccount: sender.account, chainId }),
  );

export const createAccount = (
  inputs: ICreateAccountCommandInput,
  config: IClientConfig,
) => submitAndListen(config)(createAccountCommand(inputs));

export async function consumer() {
  createAccount(
    {
      account: 'javad',
      publicKey: 'test',
      sender: { account: 'gasPayer', publicKey: '' },
      chainId: '1',
    },
    {
      host: 'https://api.testnet.chainweb.com',
      defaults: {
        networkId: 'testnet04',
      },
      sign: signWithChainweaver,
    },
  )
    .on('sign', (data) => console.log(data))
    .on('preflight', (data) => console.log(data))
    .on('submit', (data) => console.log(data))
    .on('listen', (data) => console.log(data))
    .on('data', (data) => console.log(data))
    .execute();
}

export const getBalance = (
  account: string,
  networkId: string,
  chainId: ChainId,
) => {
  const exec = pipe(
    Pact.modules.coin['get-balance'],
    execution,
    dirtyRead({
      defaults: {
        networkId,
        meta: { chainId },
      },
    }),
  );
  return exec(account).execute();
};
