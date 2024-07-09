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

interface ICreateTransferInput {
  sender: { account: string; publicKeys: ISigner[] };
  receiver: {
    account: string;
    keyset: {
      keys: ISigner[];
      pred: 'keys-all' | 'keys-2' | 'keys-any';
    };
  };
  amount: string;
  gasPayer?: { account: string; publicKeys: ISigner[] };
  chainId: ChainId;
  /**
   * compatible contract with fungible-v2; default is "coin"
   */
  contract?: string;
}
/**
 * @alpha
 */
export const transferCreateCommand = ({
  sender,
  receiver,
  amount,
  gasPayer = sender,
  chainId,
  contract = 'coin',
}: ICreateTransferInput) =>
  composePactCommand(
    execution(
      Pact.modules[contract as 'coin']['transfer-create'](
        sender.account,
        receiver.account,
        readKeyset('account-guard'),
        {
          decimal: amount,
        },
      ),
    ),
    addKeyset(
      'account-guard',
      receiver.keyset.pred,
      ...receiver.keyset.keys.map((key) =>
        typeof key === 'object' ? key.pubKey : key,
      ),
    ),
    addSigner(sender.publicKeys, (signFor) => [
      signFor(
        `${contract as 'coin'}.TRANSFER`,
        sender.account,
        receiver.account,
        {
          decimal: amount,
        },
      ),
    ]),
    addSigner(gasPayer.publicKeys, (signFor) => [signFor('coin.GAS')]),
    setMeta({ senderAccount: gasPayer.account, chainId }),
  );

/**
 * @alpha
 */
export const transferCreate = (
  inputs: ICreateTransferInput,
  config: IClientConfig,
) =>
  submitClient<PactReturnType<IPactModules['coin']['transfer-create']>>(config)(
    transferCreateCommand(inputs),
  );
