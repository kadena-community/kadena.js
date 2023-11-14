import type { ChainId } from '@kadena/client';
import { Pact, readKeyset } from '@kadena/client';
import {
  addData,
  addKeyset,
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';
import { pipe } from 'ramda';
import { dirtyReadClient, submitClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

interface ICreateAccountCommandInput {
  account: string;
  keyset: {
    keys: string[];
    pred: 'keys-all' | 'keys-two' | 'keys-one';
  };
  gasPayer: { account: string; publicKeys: string[] };
  chainId: ChainId;
}

type TCreatePrincipalAccountCommandInput = Omit<ICreateAccountCommandInput, 'account'>;

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
    addSigner(gasPayer.publicKeys, (signFor) => [signFor('coin.GAS')]),
    setMeta({ senderAccount: gasPayer.account, chainId }),
  );

/**
 * @alpha
 */
export const createAccount = (
  inputs: ICreateAccountCommandInput,
  config: IClientConfig,
) => submitClient(config)(createAccountCommand(inputs));

/**
 * @alpha
 */
export const createPrincipalAccount = async (
  inputs: TCreatePrincipalAccountCommandInput,
  config: IClientConfig,
) => {
  const getPrincipal = pipe(
    () => '(create-principal (read-keyset "ks"))',
    execution,
    addData('ks', inputs.keyset),
    dirtyReadClient(config),
  );

  const account = await getPrincipal().execute();
  return submitClient(config)(createAccountCommand({
    account: account as string,
    ...inputs
  }));
}
