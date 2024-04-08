import type {
  BuiltInPredicate,
  IPactModules,
  PactReturnType,
} from '@kadena/client';
import { Pact } from '@kadena/client';
import {
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';
import type { ChainId, IPactDecimal } from '@kadena/types';
import { submitClient } from '../core';
import type { IClientConfig } from '../core/utils/helpers';

interface IBurnTokenInput {
  policyConfig?: {
    guarded?: boolean;
    nonFungible?: boolean;
    hasRoyalty?: boolean;
  };
  tokenId: string;
  accountName: string;
  chainId: ChainId;
  guard: {
    account: string;
    keyset: {
      keys: string[];
      pred: BuiltInPredicate;
    };
  };
  amount: IPactDecimal;
}

const burnTokenCommand = ({
  tokenId,
  accountName,
  chainId,
  guard,
  amount,
  policyConfig,
}: IBurnTokenInput) => {
  if (policyConfig?.nonFungible) {
    throw new Error('Non-fungible tokens cannot be burned');
  }

  if (policyConfig?.hasRoyalty) {
    throw new Error('Royalty tokens cannot be burned');
  }

  return composePactCommand(
    execution(
      Pact.modules['marmalade-v2.ledger'].burn(tokenId, accountName, amount),
    ),
    addSigner(guard.keyset.keys, (signFor) => [
      signFor('coin.GAS'),
      signFor('marmalade-v2.ledger.BURN', tokenId, accountName, amount),
      ...(!!policyConfig?.guarded
        ? [
            signFor(
              'marmalade-v2.guard-policy-v1.BURN',
              tokenId,
              accountName,
              amount,
            ),
          ]
        : []),
    ]),
    setMeta({ senderAccount: guard.account, chainId }),
  );
};

export const burnToken = (inputs: IBurnTokenInput, config: IClientConfig) =>
  submitClient<PactReturnType<IPactModules['marmalade-v2.ledger']['burn']>>(
    config,
  )(burnTokenCommand(inputs));
