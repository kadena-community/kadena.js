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

interface ISafeTransferInput {
  sender: { account: string; publicKeys: string[] };
  receiver: {
    account: string;
    keyset: {
      keys: string[];
      pred: 'keys-all' | 'keys-2' | 'keys-any';
    };
  };
  amount: string;
  gasPayer?: { account: string; publicKeys: string[] };
  chainId: ChainId;
  /**
   * compatible contract with fungible-v2; default is "coin"
   */
  contract?: string;
}
/**
 * @alpha
 */
export const safeTransferCommand = ({
  sender,
  receiver,
  amount,
  gasPayer = sender,
  chainId,
  contract = 'coin',
}: ISafeTransferInput) =>
  composePactCommand(
    execution(
      `(enforce-keyset (read-keyset 'account-guard))`,
      Pact.modules[contract as 'coin']['transfer-create'](
        sender.account,
        receiver.account,
        readKeyset('account-guard'),
        {
          decimal: amount,
        },
      ),
    ),
    addKeyset('account-guard', receiver.keyset.pred, ...receiver.keyset.keys),
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
    addSigner(receiver.keyset.keys),
    addSigner(gasPayer.publicKeys, (signFor) => [signFor('coin.GAS')]),
    setMeta({ senderAccount: gasPayer.account, chainId }),
  );

/**
 * @alpha
 */
export const safeTransfer = (
  inputs: ISafeTransferInput,
  config: IClientConfig,
) => submitClient(config)(safeTransferCommand(inputs));
