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

import { crossChainClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

interface ICrossChainInput {
  sender: { account: string; publicKeys: ISigner[] };
  receiver: {
    account: string;
    keyset: {
      keys: string[];
      pred: 'keys-all' | 'keys-2' | 'keys-any';
    };
  };
  amount: string;
  targetChainId: ChainId;
  targetChainGasPayer?: { account: string; publicKeys: ISigner[] };
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
  crossChainClient<
    PactReturnType<IPactModules['coin']['defpact']['transfer-crosschain']>
  >(config)(
    inputs.targetChainId,
    inputs.targetChainGasPayer ?? inputs.sender,
  )(createCrossChainCommand(inputs));
