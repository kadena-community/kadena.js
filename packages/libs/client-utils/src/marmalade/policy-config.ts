import type { BuiltInPredicate } from '@kadena/client';
import type { IPactDecimal } from '@kadena/types';

export interface IRoyaltyInfoInput {
  fungible: string;
  creator: string;
  creatorGuard: {
    keys: string[];
    pred: BuiltInPredicate;
  };
  royaltyRate: IPactDecimal;
}

export interface IGuardInfoInput {
  mintGuard?: {
    keys: string[];
    pred: BuiltInPredicate;
  };
  uriGuard?: {
    keys: string[];
    pred: BuiltInPredicate;
  };
  saleGuard?: {
    keys: string[];
    pred: BuiltInPredicate;
  };
  burnGuard?: {
    keys: string[];
    pred: BuiltInPredicate;
  };
  transferGuard?: {
    keys: string[];
    pred: BuiltInPredicate;
  };
}

export interface ICollectionInfoInput {
  collectionId: string;
}

export interface ICreateTokenPolicyConfig {
  customPolicies?: boolean;
  updatableURI?: boolean;
  guarded?: boolean;
  nonFungible?: boolean;
  hasRoyalty?: boolean;
  collection?: boolean;
}

export const GUARD_POLICY = 'guard-policy-v1';
export const NON_FUNGIBLE_POLICY = 'non-fungible-policy-v1';
export const ROYALTY_POLICY = 'royalty-policy-v1';
export const COLLECTION_POLICY = 'collection-policy-v1';

interface ConfigToDataMap {
  customPolicies: { customPolicyData: Record<string, any> };
  updatableURI: {};
  guarded: { guards: IGuardInfoInput };
  nonFungible: {};
  hasRoyalty: { royalty: IRoyaltyInfoInput };
  collection: { collection: ICollectionInfoInput };
}

export interface PolicyProps {
  customPolicyData: Record<string, any>;
  guards: IGuardInfoInput;
  royalty: IRoyaltyInfoInput;
  collection: ICollectionInfoInput;
}

type PolicyDataForConfig<C extends ICreateTokenPolicyConfig> =
  (C['customPolicies'] extends true ? ConfigToDataMap['customPolicies'] : {}) &
    (C['updatableURI'] extends true ? ConfigToDataMap['updatableURI'] : {}) &
    (C['guarded'] extends true ? ConfigToDataMap['guarded'] : {}) &
    (C['nonFungible'] extends true ? ConfigToDataMap['nonFungible'] : {}) &
    (C['hasRoyalty'] extends true ? ConfigToDataMap['hasRoyalty'] : {}) &
    (C['collection'] extends true ? ConfigToDataMap['collection'] : {});

export type WithCreateTokenPolicy<
  C extends ICreateTokenPolicyConfig,
  Base,
> = Base &
  (PolicyDataForConfig<C> | undefined) & {
    policyConfig?: C;
  };

export const validatePolicies = (
  policyConfig?: ICreateTokenPolicyConfig,
  policies: string[] = [],
) => {
  if (policyConfig?.collection) {
    if (!policies.includes(COLLECTION_POLICY)) {
      throw new Error('Collection policy is required');
    }
  }

  if (policyConfig?.guarded || policyConfig?.updatableURI) {
    if (!policies.includes(GUARD_POLICY)) {
      throw new Error('Guard policy is required');
    }
  }

  if (policyConfig?.hasRoyalty) {
    if (!policies.includes(ROYALTY_POLICY)) {
      throw new Error('Royalty policy is required');
    }
  }

  if (policyConfig?.nonFungible) {
    if (!policies.includes(NON_FUNGIBLE_POLICY)) {
      throw new Error('Non-fungible policy is required');
    }
  }

  if (new Set(policies).size !== policies.length) {
    throw new Error('Duplicate policies are not allowed');
  }
};
