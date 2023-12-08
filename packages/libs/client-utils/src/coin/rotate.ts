import type { ChainId } from '@kadena/client';
import { Pact, readKeyset } from '@kadena/client';
import {
  addKeyset,
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';

import type { TPredicate } from '@kadena/types';
import { submitClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

interface IRotateCommandInput {
  account: { account: string; publicKeys: string[] };
  newguard: {
    keys: string[];
    pred: TPredicate;
  };
  gasPayer: { account: string; publicKeys: string[] };
  chainId: ChainId;
  /**
   * compatible contract with fungible-v2; default is "coin"
   */
  contract?: string;
}

/**
 * @alpha
 */
export const rotateCommand = ({
  account,
  newguard,
  gasPayer = account,
  chainId,
  contract = 'coin',
}: IRotateCommandInput) =>
  composePactCommand(
    execution(
      Pact.modules[contract as 'coin'].rotate(
        account.account,
        readKeyset('new-guard'),
      ),
    ),
    addKeyset('new-guard', newguard.pred, ...newguard.keys),
    addSigner(account.publicKeys, (signFor) => [
      signFor(`${contract as 'coin'}.ROTATE`, account.account),
    ]),
    addSigner(gasPayer.publicKeys, (signFor) => [signFor('coin.GAS')]),
    setMeta({ senderAccount: gasPayer.account, chainId }),
  );

/**
 * @alpha
 */
export const rotate = (inputs: IRotateCommandInput, config: IClientConfig) =>
  submitClient(config)(rotateCommand(inputs));
