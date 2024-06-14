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
