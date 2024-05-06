import type { IPactModules, PactReturnType } from '@kadena/client';
import { Pact } from '@kadena/client';
import {
  addKeyset,
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';
import type { ChainId } from '@kadena/types';
import { submitClient } from '../core';
import type { IClientConfig } from '../core/utils/helpers';

interface IMintTokenInput {
  policyConfig?: {
    guarded?: boolean;
  };
  tokenId: string;
  uri: string;
  chainId: ChainId;
  guard: {
    account: string;
    keyset: {
      keys: string[];
      pred: 'keys-all' | 'keys-2' | 'keys-any';
    };
  };
}

const updateUriCommand = ({
  tokenId,
  uri,
  chainId,
  guard,
  policyConfig,
}: IMintTokenInput) =>
  composePactCommand(
    execution(Pact.modules['marmalade-v2.ledger']['update-uri'](tokenId, uri)),
    addKeyset('guard', guard.keyset.pred, ...guard.keyset.keys),
    addSigner(guard.keyset.keys, (signFor) => [
      signFor('coin.GAS'),
      signFor('marmalade-v2.ledger.UPDATE-URI', tokenId, uri),
      ...(policyConfig?.guarded
        ? [signFor('marmalade-v2.guard-policy-v1.UPDATE-URI', tokenId, uri)]
        : []),
    ]),
    setMeta({ senderAccount: guard.account, chainId }),
  );

export const updateUri = (inputs: IMintTokenInput, config: IClientConfig) =>
  submitClient<
    PactReturnType<IPactModules['marmalade-v2.ledger']['update-uri']>
  >(config)(updateUriCommand(inputs));
