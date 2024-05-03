import type { BuiltInPredicate } from '@kadena/client';
import type { IPactDecimal, IPactInt } from '@kadena/types';

/** -----------COMMON----------- */

export interface CommonProps {
  meta?: {
    senderAccount?: string;
    gasLimit?: number;
    gasPrice?: number;
  };
  capabilities?: {
    name: string;
    props: any[];
  }[];
  additionalSigners?: {
    keyset: {
      keys: string[];
      pred: BuiltInPredicate;
    };
    capabilities: {
      name: string;
      props: any[];
    }[];
  }[];
}

/** -----------COMMON----------- */

/** -----------CREATE----------- */

export interface IRoyaltyInfoInput {
  fungible: {
    refName: {
      name: string;
      namespace: string | null;
    };
    refSpec: [
      {
        name: string;
        namespace: string | null;
      },
    ];
  };
  creator: {
    account: string;
    keyset: {
      keys: string[];
      pred: BuiltInPredicate;
    };
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
  upgradeableURI?: boolean;
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
  upgradeableURI: {};
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
    (C['upgradeableURI'] extends true
      ? ConfigToDataMap['upgradeableURI']
      : {}) &
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

/** -----------CREATE----------- */

/** -----------SALE----------- */

export interface ISaleAuctionInfoInput {
  fungible: {
    refName: {
      name: string;
      namespace: string | null;
    };
    refSpec: [
      {
        name: string;
        namespace: string | null;
      },
    ];
  };
  price: IPactDecimal;
  sellerFungibleAccount: {
    account: string;
    keyset: {
      keys: string[];
      pred: BuiltInPredicate;
    };
  };
  saleType?:
    | 'marmalade-sale.conventional-auction'
    | 'marmalade-sale.dutch-auction';
}

export interface ISaleGuardInfoInput {
  saleGuard?: {
    keys: string[];
    pred: BuiltInPredicate;
  };
}

export interface ISaleTokenPolicyConfig {
  auction?: boolean;
  guarded?: boolean;
  hasRoyalty?: boolean;
}

export interface SalePolicyProps {
  auction: ISaleAuctionInfoInput;
  guards: ISaleGuardInfoInput;
  royalty: IRoyaltyInfoInput;
}

interface SaleConfigToDataMap {
  auction: { auction: ISaleAuctionInfoInput };
  guarded: { guards: ISaleGuardInfoInput };
  hasRoyalty: { royalty: IRoyaltyInfoInput };
}

type PolicySaleDataForConfig<C extends ISaleTokenPolicyConfig> =
  (C['auction'] extends true ? SaleConfigToDataMap['auction'] : {}) &
    (C['guarded'] extends true ? SaleConfigToDataMap['guarded'] : {}) &
    (C['hasRoyalty'] extends true ? SaleConfigToDataMap['hasRoyalty'] : {});

export type WithSaleTokenPolicy<C extends ISaleTokenPolicyConfig, Base> = Base &
  (PolicySaleDataForConfig<C> | undefined) & {
    policyConfig?: C;
  };

/** -----------SALE----------- */

/** -----------WITHDRAW----------- */

export interface IWithdrawSaleGuardInfoInput {
  saleGuard?: {
    keys: string[];
    pred: BuiltInPredicate;
  };
}

export interface IWithdrawSaleTokenPolicyConfig {
  guarded?: boolean;
}

export interface WithdrawSalePolicyProps {
  guards: IWithdrawSaleGuardInfoInput;
}

interface WithdrawSaleConfigToDataMap {
  guarded: { guards: IWithdrawSaleGuardInfoInput };
}

type PolicyWithdrawSaleDataForConfig<C extends ICreateTokenPolicyConfig> =
  C['guarded'] extends true ? WithdrawSaleConfigToDataMap['guarded'] : {};

export type WithWithdrawSaleTokenPolicy<
  C extends ICreateTokenPolicyConfig,
  Base,
> = Base &
  (PolicyWithdrawSaleDataForConfig<C> | undefined) & {
    policyConfig?: C;
  };

/** -----------WITHDRAW----------- */

/** -----------AUCTION----------- */

export interface IConventionalAuctionInput {
  saleId: string;
  tokenId: string;
  startDate: IPactInt;
  endDate: IPactInt;
  reservedPrice: IPactDecimal;
}

export interface IDutchAuctionInput {
  saleId: string;
  tokenId: string;
  startDate: IPactInt;
  endDate: IPactInt;
  startPrice: IPactDecimal;
  reservedPrice: IPactDecimal;
  priceIntervalInSeconds: IPactInt;
}

export interface IAuctionConfig {
  conventional?: boolean;
  dutch?: boolean;
}

export interface AuctionProps {
  conventional: IConventionalAuctionInput;
  dutch: IDutchAuctionInput;
}

type AuctionDataForConfig<C extends IAuctionConfig> =
  (C['conventional'] extends true ? AuctionProps['conventional'] : {}) &
    (C['dutch'] extends true ? AuctionProps['dutch'] : {});

export type WithAuction<C extends IAuctionConfig, Base> = Base &
  (AuctionDataForConfig<C> | undefined) & {
    auctionConfig: C;
  };

/** -----------AUCTION----------- */

/** -----------AUCTION-PURCHASE----------- */

export interface IConventionalAuctionPurchaseInput {
  updatedPrice: IPactDecimal;
  escrow: {
    account: string;
  };
}

export interface IDutchAuctionPurchaseInput {
  updatedPrice: IPactDecimal;
  escrow: {
    account: string;
  };
}

export interface IAuctionPurchaseConfig {
  conventional?: boolean;
  dutch?: boolean;
}

export interface AuctionPurchaseProps {
  conventional: IConventionalAuctionPurchaseInput;
  dutch: IDutchAuctionPurchaseInput;
}

type AuctionPurchaseDataForConfig<C extends IAuctionPurchaseConfig> =
  C['conventional'] extends true
    ? AuctionPurchaseProps['conventional']
    : {} & C['dutch'] extends true
      ? AuctionPurchaseProps['dutch']
      : {};

export type WithAuctionPurchase<C extends IAuctionPurchaseConfig, Base> = Base &
  (AuctionPurchaseDataForConfig<C> | undefined) & {
    auctionConfig?: C;
  };

/** -----------AUCTION-PURCHASE----------- */

/** -----------PLACE-BID----------- */

export interface IPlaceBidInput {
  mkAccount: string;
  mkFeePercentage: IPactDecimal;
}

export interface IPlaceBidConfig {
  marketplaceFee?: boolean;
}

export interface PlaceBidProps {
  marketplaceFee: IPlaceBidInput;
}

type PlaceBidDataForConfig<C extends IPlaceBidConfig> =
  C['marketplaceFee'] extends true ? IPlaceBidInput : {};

export type WithPlaceBid<C extends IPlaceBidConfig, Base> = Base &
  (PlaceBidDataForConfig<C> | undefined) & {
    marketplaceConfig?: C;
  };

/** -----------PLACE-BID----------- */
