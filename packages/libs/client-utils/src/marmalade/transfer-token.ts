import type { IPactModules, PactReturnType } from '@kadena/client';
import { Pact } from '@kadena/client';
import {
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';
import type { ChainId, IPactDecimal } from '@kadena/types';
import { submitClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

interface ITransferTokenInput {
  policyConfig?: {
    guarded?: boolean;
    hasRoyalty?: boolean;
  };
  tokenId: string;
  chainId: ChainId;
  sender: {
    account: string;
    keyset: {
      keys: string[];
      pred: 'keys-all' | 'keys-2' | 'keys-any';
    };
  };
  receiver: {
    account: string;
  };
  amount: IPactDecimal;
}

const transferTokenCommand = ({
  tokenId,
  chainId,
  sender,
  receiver,
  amount,
  policyConfig,
}: ITransferTokenInput) => {
  if (policyConfig?.hasRoyalty) {
    throw new Error('Royalty tokens cannot be transferred.');
  }

  return composePactCommand(
    execution(
      Pact.modules['marmalade-v2.ledger'].transfer(
        tokenId,
        sender.account,
        receiver.account,
        amount,
      ),
    ),
    addSigner(sender.keyset.keys, (signFor) => [
      signFor('coin.GAS'),
      signFor(
        'marmalade-v2.ledger.TRANSFER',
        tokenId,
        sender.account,
        receiver.account,
        amount,
      ),
      ...(policyConfig?.guarded
        ? [
            signFor(
              'marmalade-v2.guard-policy-v1.TRANSFER',
              tokenId,
              sender.account,
              receiver.account,
              amount,
            ),
          ]
        : []),
    ]),
    setMeta({ senderAccount: sender.account, chainId }),
  );
};

export const transferToken = (
  inputs: ITransferTokenInput,
  config: IClientConfig,
) =>
  submitClient<
    PactReturnType<IPactModules['marmalade-v2.ledger']['transfer-create']>
  >(config)(transferTokenCommand(inputs));
