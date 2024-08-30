import type {
  ChainId,
  IPactModules,
  PactReference,
  PactReturnType,
} from '@kadena/client';
import { Pact, readKeyset } from '@kadena/client';
import { addKeyset, execution } from '@kadena/client/fp';
import type { IPactInt, NetworkId } from '@kadena/types';
import { pipe } from 'ramda';
import { dirtyReadClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';
import type { Guard, ICreateTokenPolicyConfig, RefKeyset } from './config';
import {
  isKeysetGuard,
  isRefKeysetGuard,
  readRefKeyset,
  validatePolicies,
} from './helpers';

interface ICreateTokenIdInput {
  policyConfig?: ICreateTokenPolicyConfig;
  policies?: string[];
  uri: string;
  precision: IPactInt | PactReference;
  creator: {
    guard: Guard;
  };
  chainId: ChainId;
  networkId: NetworkId;
  host?: IClientConfig['host'];
}

export const createTokenId = ({
  policies = [],
  uri,
  precision,
  creator,
  policyConfig,
  chainId,
  networkId,
  host,
}: ICreateTokenIdInput) => {
  validatePolicies(policyConfig, policies);

  if (isKeysetGuard(creator.guard)) {
    return pipe(
      () =>
        Pact.modules['marmalade-v2.ledger']['create-token-id'](
          {
            precision,
            uri,
            policies: () =>
              policies.length > 0 ? `[${policies.join(' ')}]` : '[]',
          },
          readKeyset('creation-guard'),
        ),
      execution,
      addKeyset('creation-guard', creator.guard.pred, ...creator.guard.keys),
      dirtyReadClient<
        PactReturnType<IPactModules['marmalade-v2.ledger']['create-token-id']>
      >({
        host,
        defaults: {
          networkId,
          meta: { chainId },
        },
      }),
    )().execute();
  } else if (isRefKeysetGuard(creator.guard)) {
    return pipe(
      () =>
        Pact.modules['marmalade-v2.ledger']['create-token-id'](
          {
            precision,
            uri,
            policies: () =>
              policies.length > 0 ? `[${policies.join(' ')}]` : '[]',
          },
          readRefKeyset(creator.guard as RefKeyset),
        ),
      execution,
      dirtyReadClient<
        PactReturnType<IPactModules['marmalade-v2.ledger']['create-token-id']>
      >({
        host,
        defaults: {
          networkId,
          meta: { chainId },
        },
      }),
    )().execute();
  } else {
    throw new Error('Guard type is not supported');
  }
};
