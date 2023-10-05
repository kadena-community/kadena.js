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
  sender: { account: string; publicKeys: string[] };
  receiver: {
    account: string;
    keyset: {
      keys: string[];
      pred: 'keys-all' | 'keys-two' | 'keys-one';
    };
  };
  amount: string;
  gasPayer?: { account: string; publicKeys: string[] };
  chainId: ChainId;
}

const createAccountCommand = ({
  sender,
  receiver,
  amount,
  gasPayer = sender,
  chainId,
}: ICreateAccountCommandInput) =>
  composePactCommand(
    execution(
      Pact.modules.coin['transfer-create'](
        sender.account,
        amount,
        readKeyset('account-guard'),
        {
          decimal: amount,
        },
      ),
    ),
    addKeyset('account-guard', receiver.keyset.pred, ...receiver.keyset.keys),
    addSigner(sender.publicKeys, (withCapability) => [
      withCapability('coin.TRANSFER', sender.account, receiver.account, {
        decimal: amount,
      }),
    ]),
    addSigner(gasPayer.publicKeys, (withCapability) => [
      withCapability('coin.GAS'),
    ]),
    setMeta({ senderAccount: gasPayer.account, chainId }),
  );

export const createAccount = (
  inputs: ICreateAccountCommandInput,
  config: IClientConfig,
) => submitAndListen(config)(createAccountCommand(inputs));
