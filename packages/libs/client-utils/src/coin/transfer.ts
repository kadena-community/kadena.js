import type {
  ChainId,
  IPactModules,
  ISigner,
  PactReturnType,
} from '@kadena/client';
import { Pact } from '@kadena/client';
import {
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';

import { submitClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

interface ITransferInput {
  sender: {
    account: string;
    publicKeys: ISigner[];
  };
  receiver: string;
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
export const transferCommand = ({
  sender,
  receiver,
  amount,
  gasPayer = sender,
  chainId,
  contract = 'coin',
}: ITransferInput) =>
  composePactCommand(
    execution(
      Pact.modules[contract as 'coin'].transfer(sender.account, receiver, {
        decimal: amount,
      }),
    ),
    addSigner(sender.publicKeys, (signFor) => [
      signFor(`${contract as 'coin'}.TRANSFER`, sender.account, receiver, {
        decimal: amount,
      }),
    ]),
    addSigner(gasPayer.publicKeys, (signFor) => [signFor('coin.GAS')]),
    setMeta({ senderAccount: gasPayer.account, chainId }),
  );

/**
 * @alpha
 */
export const transfer = (inputs: ITransferInput, config: IClientConfig) =>
  submitClient<PactReturnType<IPactModules['coin']['transfer']>>(config)(
    transferCommand(inputs),
  );
