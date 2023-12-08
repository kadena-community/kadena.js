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
import { crossChainClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

interface ICrossChainInput {
  sender: { account: string; publicKeys: string[] };
  receiver: {
    account: string;
    keyset: {
      keys: string[];
      pred: TPredicate;
    };
  };
  amount: string;
  targetChainId: ChainId;
  targetChainGasPayer?: { account: string; publicKeys: string[] };
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
export const createCrossChainCommand = ({
  sender,
  receiver,
  amount,
  targetChainId,
  gasPayer = sender,
  chainId,
  contract = 'coin',
}: Omit<ICrossChainInput, 'targetChainGasPayer'>) =>
  composePactCommand(
    execution(
      Pact.modules[contract as 'coin'].defpact['transfer-crosschain'](
        sender.account,
        receiver.account,
        readKeyset('account-guard'),
        targetChainId,
        {
          decimal: amount,
        },
      ),
    ),
    addKeyset('account-guard', receiver.keyset.pred, ...receiver.keyset.keys),
    addSigner(sender.publicKeys, (signFor) => [
      signFor(
        `${contract as 'coin'}.TRANSFER_XCHAIN`,
        sender.account,
        receiver.account,
        { decimal: amount },
        targetChainId,
      ),
    ]),
    addSigner(gasPayer.publicKeys, (signFor) => [signFor('coin.GAS')]),
    setMeta({ senderAccount: gasPayer.account, chainId }),
  );

/**
 * @alpha
 */
export const transferCrossChain = (
  inputs: ICrossChainInput,
  config: IClientConfig,
) =>
  crossChainClient(config)(
    inputs.targetChainId,
    inputs.targetChainGasPayer ?? inputs.sender,
  )(createCrossChainCommand(inputs));
