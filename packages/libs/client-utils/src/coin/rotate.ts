import type { ChainId } from '@kadena/client';
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

interface IRotateCommandInput {
  account: { account: string; publicKeys: string[] };
  newguard: {
    keys: string[];
    pred: 'keys-all' | 'keys-2' | 'keys-any';
  };
  gasPayer: { account: string; publicKeys: string[] };
  chainId: ChainId;
}

const rotateCommand = ({
  account,
  newguard,
  gasPayer = account,
  chainId,
}: IRotateCommandInput) =>
  composePactCommand(
    execution(
      Pact.modules.coin.rotate(account.account, readKeyset('new-guard')),
    ),
    addKeyset('new-guard', newguard.pred, ...newguard.keys),
    addSigner(account.publicKeys, (signFor) => [
      signFor('coin.ROTATE', account.account),
    ]),
    addSigner(gasPayer.publicKeys, (signFor) => [signFor('coin.GAS')]),
    setMeta({ senderAccount: gasPayer.account, chainId }),
  );

/**
 * @alpha
 */
export const rotate = (inputs: IRotateCommandInput, config: IClientConfig) =>
  submitClient(config)(rotateCommand(inputs));
