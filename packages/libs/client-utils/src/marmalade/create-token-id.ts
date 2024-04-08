import type {
  BuiltInPredicate,
  ChainId,
  IPactModules,
  PactReference,
  PactReturnType,
} from '@kadena/client';
import { Pact, readKeyset } from '@kadena/client';
import {
  addKeyset,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';
import type { IPactInt } from '@kadena/types';
import { dirtyReadClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';
import type { ICreateTokenPolicyConfig } from './policy-config';
import { validatePolicies } from './policy-config';

interface ICreateTokenIdInput {
  policyConfig?: ICreateTokenPolicyConfig;
  policies?: string[];
  uri: string;
  precision: IPactInt | PactReference;
  chainId: ChainId;
  creator: {
    account: string;
    keyset: {
      keys: string[];
      pred: BuiltInPredicate;
    };
  };
}

const createTokenIdCommand = ({
  policies = [],
  uri,
  precision,
  creator,
  chainId,
  policyConfig,
}: ICreateTokenIdInput) => {
  validatePolicies(policyConfig, policies);

  return composePactCommand(
    execution(
      Pact.modules['marmalade-v2.ledger']['create-token-id'](
        { precision, uri, policies },
        readKeyset('creation-guard'),
      ),
    ),
    addKeyset('creation-guard', creator.keyset.pred, ...creator.keyset.keys),
    setMeta({ senderAccount: creator.account, chainId }),
  );
};

export const createTokenId = (
  inputs: ICreateTokenIdInput,
  config: Omit<IClientConfig, 'sign'>,
) =>
  dirtyReadClient<
    PactReturnType<IPactModules['marmalade-v2.ledger']['create-token-id']>
  >(config)(createTokenIdCommand(inputs));
