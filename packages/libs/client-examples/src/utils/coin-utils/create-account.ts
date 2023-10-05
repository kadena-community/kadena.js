/* eslint-disable @kadena-dev/no-eslint-disable */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @rushstack/typedef-var */

import type { ChainId } from '@kadena/client';
import { Pact, readKeyset } from '@kadena/client';
import {
  addKeyset,
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';

import type { IClientConfig } from '../rich-client';
import { submitAndListen } from '../rich-client';

interface ICreateAccountCommandInput {
  account: string;
  keyset: {
    keys: string[];
    pred: 'keys-all' | 'keys-two' | 'keys-one';
  };
  gasPayer: { account: string; publicKeys: string[] };
  chainId: ChainId;
}

const createAccountCommand = ({
  account,
  keyset,
  gasPayer,
  chainId,
}: ICreateAccountCommandInput) =>
  composePactCommand(
    execution(
      Pact.modules.coin['create-account'](account, readKeyset('account-guard')),
    ),
    addKeyset('account-guard', keyset.pred, ...keyset.keys),
    addSigner(gasPayer.publicKeys, (withCapability) => [
      withCapability('coin.GAS'),
    ]),
    setMeta({ senderAccount: gasPayer.account, chainId }),
  );

export const createAccount = (
  inputs: ICreateAccountCommandInput,
  config: IClientConfig,
) => submitAndListen(config)(createAccountCommand(inputs));
