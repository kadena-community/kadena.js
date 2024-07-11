import type { IPactModules, PactReturnType } from '@kadena/client';
import { Pact, readKeyset } from '@kadena/client';
import {
  addKeyset,
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';
import { PactNumber } from '@kadena/pactjs';
import type { ChainId, IPactDecimal } from '@kadena/types';
import { submitClient } from '../core';
import type { IClientConfig } from '../core/utils/helpers';
import type { CommonProps } from './config';
import {
  formatAdditionalSigners,
  formatCapabilities,
  formatWebAuthnSigner,
} from './helpers';

interface IMintTokenInput extends CommonProps {
  policyConfig?: {
    guarded?: boolean;
    nonFungible?: boolean;
  };
  tokenId: string;
  signer: string;
  accountName: string;
  chainId: ChainId;
  guard: {
    account: string;
    keyset: {
      keys: string[];
      pred: 'keys-all' | 'keys-2' | 'keys-any';
    };
  };
  amount: IPactDecimal;
}

const mintTokenCommand = ({
  tokenId,
  accountName,
  chainId,
  guard,
  amount,
  policyConfig,
  meta,
  capabilities,
  additionalSigners,
}: IMintTokenInput) => {
  if (
    policyConfig?.nonFungible &&
    amount.decimal !== new PactNumber(1).toDecimal()
  ) {
    throw new Error(
      'Non-fungible tokens can only be minted with an amount of 1.0',
    );
  }

  return composePactCommand(
    execution(
      Pact.modules['marmalade-v2.ledger'].mint(
        tokenId,
        accountName,
        readKeyset('guard'),
        amount,
      ),
    ),
    addKeyset('guard', guard.keyset.pred, ...guard.keyset.keys),
    addSigner(formatWebAuthnSigner(guard.keyset.keys), (signFor) => [
      signFor('coin.GAS'),
      signFor('marmalade-v2.ledger.MINT', tokenId, accountName, amount),
      ...(policyConfig?.guarded
        ? [
            signFor(
              'marmalade-v2.guard-policy-v1.MINT',
              tokenId,
              accountName,
              amount,
            ),
          ]
        : []),
      ...formatCapabilities(capabilities, signFor),
    ]),
    ...formatAdditionalSigners(additionalSigners),
    setMeta({ senderAccount: guard.account, chainId, ...meta }),
  );
};

export const mintToken = (inputs: IMintTokenInput, config: IClientConfig) =>
  submitClient<PactReturnType<IPactModules['marmalade-v2.ledger']['mint']>>(
    config,
  )(mintTokenCommand(inputs));
