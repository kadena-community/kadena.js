import type { IPactModules, PactReturnType } from '@kadena/client';
import { Pact, readKeyset } from '@kadena/client';
import {
  addKeyset,
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';
import type { ChainId, IPactDecimal } from '@kadena/types';
import { submitClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';
import type { CommonProps } from './config';
import {
  formatAdditionalSigners,
  formatCapabilities,
  formatWebAuthnSigner,
} from './helpers';

interface ITransferCreateTokenInput extends CommonProps {
  policyConfig?: {
    guarded?: boolean;
    hasRoyalty?: boolean;
  };
  tokenId: string;
  chainId: ChainId;
  sender: {
    account: string;
    guard: {
      keys: string[];
      pred: 'keys-all' | 'keys-2' | 'keys-any';
    };
  };
  receiver: {
    account: string;
    guard: {
      keys: string[];
      pred: 'keys-all' | 'keys-2' | 'keys-any';
    };
  };
  amount: IPactDecimal;
}

const createTransferTokenCommand = ({
  tokenId,
  chainId,
  sender,
  receiver,
  amount,
  policyConfig,
  meta,
  capabilities,
  additionalSigners,
}: ITransferCreateTokenInput) => {
  if (policyConfig?.hasRoyalty) {
    throw new Error('Royalty tokens cannot be transferred.');
  }

  return composePactCommand(
    execution(
      Pact.modules['marmalade-v2.ledger']['transfer-create'](
        tokenId,
        sender.account,
        receiver.account,
        readKeyset('receiver-guard'),
        amount,
      ),
    ),
    addKeyset('receiver-guard', receiver.guard.pred, ...receiver.guard.keys),
    addSigner(formatWebAuthnSigner(sender.guard.keys), (signFor) => [
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
      ...formatCapabilities(capabilities, signFor),
    ]),
    ...formatAdditionalSigners(additionalSigners),
    setMeta({ senderAccount: sender.account, chainId, ...meta }),
  );
};

export const transferCreateToken = (
  inputs: ITransferCreateTokenInput,
  config: IClientConfig,
) =>
  submitClient<
    PactReturnType<IPactModules['marmalade-v2.ledger']['transfer-create']>
  >(config)(createTransferTokenCommand(inputs));
