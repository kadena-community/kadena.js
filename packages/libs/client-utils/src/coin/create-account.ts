import type {
  ChainId,
  IPactModules,
  ISigner,
  PactReturnType,
} from '@kadena/client';
import { Pact, readKeyset } from '@kadena/client';
import {
  addKeyset,
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';

import { submitClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

interface ICreateAccountCommandInput {
  account: string;
  keyset: {
    keys: string[];
    pred: 'keys-all' | 'keys-2' | 'keys-any';
  };
  gasPayer: { account: string; publicKeys: ISigner[] };
  chainId: ChainId;
  /**
   * compatible contract with fungible-v2; default is "coin"
   */
  contract?: string;
}

/**
 * @alpha
 */
export const createAccountCommand = ({
  account,
  keyset,
  gasPayer,
  chainId,
  contract = 'coin',
}: ICreateAccountCommandInput) =>
  composePactCommand(
    execution(
      Pact.modules[contract as 'coin']['create-account'](
        account,
        readKeyset('account-guard'),
      ),
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
) =>
  submitClient<PactReturnType<IPactModules['coin']['create-account']>>(config)(
    createAccountCommand(inputs),
  );
