import type {
  BuiltInPredicate,
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
import type { ICreateTokenPolicyConfig } from './config';
import { validatePolicies } from './helpers';

interface ICreateTokenIdInput {
  policyConfig?: ICreateTokenPolicyConfig;
  policies?: string[];
  uri: string;
  precision: IPactInt | PactReference;
  creator: {
    keyset: {
      keys: string[];
      pred: BuiltInPredicate;
    };
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
    addKeyset('creation-guard', creator.keyset.pred, ...creator.keyset.keys),
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
};
