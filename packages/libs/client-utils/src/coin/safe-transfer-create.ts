import type { ChainId, ISigner } from '@kadena/client';
import { Pact, readKeyset } from '@kadena/client';
import {
  addKeyset,
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';

import { PactNumber } from '@kadena/pactjs';
import { submitClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';
import { partialTransferCommand } from './safe-transfer';
import { transferCreateCommand } from './transfer-create';

interface ISafeTransferCreateInput {
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

const partialTransferCreateCommand = ({
  sender,
  amount,
  receiver,
  contract = 'coin',
}: Omit<ISafeTransferCreateInput, 'gasPayer' | 'chainId'>) =>
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
  );

/**
 * @alpha
 */
export const safeTransferCreateCommand = ({
  sender,
  receiver,
  amount,
  gasPayer = sender,
  chainId,
  contract = 'coin',
}: ISafeTransferCreateInput) => {
  if (receiver.account === gasPayer.account) {
    return transferCreateCommand({
      sender,
      receiver,
      amount,
      gasPayer,
      chainId,
      contract,
    });
  }
  const smallAmount = '0.0000001';
  const amountPlusSmall = new PactNumber(amount).plus(smallAmount).toDecimal();
  return composePactCommand(
    partialTransferCreateCommand({
      sender,
      amount: amountPlusSmall,
      receiver,
      contract,
    }),
    partialTransferCommand({
      sender: { account: receiver.account, publicKeys: receiver.keyset.keys },
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
export const safeTransferCreate = (
  inputs: ISafeTransferCreateInput,
  config: IClientConfig,
) => submitClient(config)(safeTransferCreateCommand(inputs));
