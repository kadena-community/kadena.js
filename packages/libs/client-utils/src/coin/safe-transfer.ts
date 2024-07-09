import type { ChainId, ISigner } from '@kadena/client';
import { Pact } from '@kadena/client';
import {
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';

import { PactNumber } from '@kadena/pactjs';
import { submitClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';
import { transferCommand } from './transfer';

interface ISafeTransferInput {
  sender: { account: string; publicKeys: ISigner[] };
  receiver: { account: string; publicKeys: ISigner[] };
  amount: string;
  gasPayer?: { account: string; publicKeys: ISigner[] };
  chainId: ChainId;
  /**
   * compatible contract with fungible-v2; default is "coin"
   */
  contract?: string;
}

/**
 *
 * @alpha
 */
export const partialTransferCommand = ({
  sender,
  amount,
  receiver,
  contract = 'coin',
}: Omit<ISafeTransferInput, 'gasPayer' | 'chainId'>) =>
  composePactCommand(
    execution(
      Pact.modules[contract as 'coin'].transfer(
        sender.account,
        receiver.account,
        {
          decimal: amount,
        },
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
  );

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
}: ISafeTransferInput) => {
  if (receiver.account === gasPayer.account) {
    return transferCommand({
      sender,
      receiver: receiver.account,
      amount,
      gasPayer,
      chainId,
      contract,
    });
  }
  const smallAmount = '0.0000001';
  const amountPlusSmall = new PactNumber(amount).plus(smallAmount).toDecimal();
  return composePactCommand(
    partialTransferCommand({
      sender,
      amount: amountPlusSmall,
      receiver,
      contract,
    }),
    partialTransferCommand({
      sender: receiver,
      amount: smallAmount,
      receiver: sender,
      contract,
    }),
    addSigner(gasPayer.publicKeys, (signFor) => [signFor('coin.GAS')]),
    setMeta({ senderAccount: gasPayer.account, chainId }),
  );
};

/**
 * @alpha
 */
export const safeTransfer = (
  inputs: ISafeTransferInput,
  config: IClientConfig,
) => submitClient(config)(safeTransferCommand(inputs));
