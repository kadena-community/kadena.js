---
title: Marmalade client utilities
description:
  The @kadena/client-utils library includes a TypeScript-based API for interacting with Marmalade smart contracts on the Kadena network.
menu: NFT marketplace reference
label: Marmalade client utilities
order: 5
layout: full
tags: ['TypeScript', 'Kadena', 'Kadena client utils', 'frontend', 'backend', 'marmalade', 'client-utils', 'utils']
---

# Marmalade client utilities

The `@kadena/client-utils/marmalade` library provides a TypeScript-based API for interacting with marmalade smart contracts on the Kadena network. This library is designed to facilitate the creation, management, and utilization of NFTs, leveraging Marmalade’s advanced features such as enforceable royalties, secure escrow accounts, and flexible token policies.

Whether you're building applications for minting, transferring, or auctioning NFTs, `@kadena/client-utils/maramlade` provides the necessary tools to create and send commands to the Kadena network efficiently. This guide will help you get started with installing the library, using its various functions, and integrating it into your projects.

## Install

You can install the `@kadena/client-utils` library with the following command:

```bash
npm install @kadena/client-utils
```

You can import Marmalade functions into TypeScript programs with statements similar to the following example:

```typescript
import { mintToken } from '@kadena/client-utils/marmalade';
```

## CommonProps

Use the `CommomProps` interface to access common properties—including metadata for transaction control, additional capabilities, or additional signers—that are used by other functions.

```typescript
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
```

## IClientConfig

Use the `IClientConfig` interface to specify the network location to send transactions to when connecting to the Kadena network.

```typescript
export interface IClientConfig {
  host?: string | ((options: INetworkOptions) => string);
  defaults?: Partial<IPactCommand>;
  sign: ISignFunction;
}

// Example using key-pair:
const config: IClientConfig = {
  host: 'http://127.0.0.1:8080',
  defaults: {
    networkId: 'development',
  },
  sign: createSignWithKeypair([targetAccount])
};
```

## burnToken

Use `burnToken` function to eliminate a specified amount of a token. 
This operation reduces the total supply of the token.

```typescript
burnToken(inputs, config): IEmitterWrapper
```

### Inputs

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| policyConfig | object | Specifies which types of policies are configured for the specified token. This object is used to validate that you have expected types defined for the all of the policies you have selected for a token.|
| tokenId | string | Specifies the token identifier for the token you want to burn. |
| accountName | string | Specifies the account that owns the token you want to burn. |
| chainId | ChainId | Specifies the chain identifier for the chain where you want to burn the specified token. Valid values are 0 to 19. |
| guard | object | Specifies the token owner or the burn guard, if you've configured a burn guard. |
| amount | IPactDecimal | Specifies the amount to burn. |

#### Policy configuration object

The `ICreateTokenPolicyConfig` interface identifies the types of policies that are configured for a token as boolean values.
The resulting `policyConfig` object contains properties similar to the following:

```json
{
  "customPolicies": false,
  "nonUpdatableURI": false,
  "guarded": true,
  "nonFungible": true,
  "hasRoyalty": true,
  "collection": true
}
```

#### Guard object

Depending on whether a token has the guard policy applied and a burn guard defined, the `guard` object account information might be required to be the token owner or the account specified for the burn guard.
For either account, the `guard` object contains properties similar to the following:

```json
{
  "account": "k:5a2afbc4564b76b2c27ce5a644cab643c43663835ea0be22433b209d3351f937",
  "keyset": {
     "keys": ["5a2afbc4564b76b2c27ce5a644cab643c43663835ea0be22433b209d3351f937"],
     "pred": "keys-all"
  }
}
```

### Return value

This function returns a `boolean` value to indicate whether the burn operation was successful or failed.

### Example

```typescript
const result = await burnToken({
    chainId,
    tokenId,
    accountName: "k:5a2afbc4564b76b2c27ce5a644cab643c43663835ea0be22433b209d3351f937",
    guard: {
      account: "k:5a2afbc4564b76b2c27ce5a644cab643c43663835ea0be22433b209d3351f937",
      keyset: {
        keys: ["5a2afbc4564b76b2c27ce5a644cab643c43663835ea0be22433b209d3351f937"],
        pred: 'keys-all'
      }
    },
    amount: new PactNumber(1).toPactDecimal()
  },
  config
).execute();
```

## buyToken

Use `buyToken` to enable the purchase of a specified token within a defined sale configuration. 
This function handles the transaction between the seller and buyer, including any applicable auction logic.

```typescript
buyToken(inputs, config): IEmitterWrapper
```

### Inputs

| Parameter | Type | Description |
| ----------| ---- | ----------- |
| auctionConfig | IAuctionPurchaseConfig | Specifies the type of auction if the token is offered for sale using a conventional or dutch auction.|
| policyConfig | object | Specifies which types of policies are configured for the specified token. This object is used to validate that you have expected types defined for the all of the policies you have selected for a token.|
| tokenId | string | Specifies the token identifier for the token you want to buy. |
| saleId | string | Specifies the Pact identifier for the token sale. |
| amount | IPactDecimal | Specifies the number of tokens you want to buy. |
| chainId | ChainId | Specifies the chain identifier for the chain where the token is offered for sale. Valid values are 0 to 19. |
| seller | object | Specifies account information for the token seller. |
| buyer | object| Specifies the buyer account information and guard. |
| buyerFungibleAccount? | string | Specifies the fungible name if the fungible for the sale is not using the coin contract. |

#### Policy configuration object

The `ICreateTokenPolicyConfig` interface identifies the types of policies that are configured for a token as boolean values.
The resulting `policyConfig` object contains properties similar to the following:

```json
{
  "customPolicies": false,
  "nonUpdatableURI": false,
  "guarded": true,
  "nonFungible": true,
  "hasRoyalty": true,
  "collection": true
}
```

#### Account information objects

Depending on the function, account information objects might consist of different properties.
For example, in the context of the `buyToken` function, the `seller` object only contains the account name, but the `buyer` object includes the account information and a keyset guard.

#### Auction-specific parameters

There are additional inputs for auctions. 
The interface for conventional auctions (IConventionalAuctionPurchaseInput) and the interface for dutch auctions (IDutchAuctionPurchaseInput) have the following additional inputs:

| Parameter    | Type         | Description           |
| ------------ | ------------ | --------------------- |
| updatedPrice | IPactDecimal | Specifies the current auction price. |
| escrow       | object       | Specifies the escrow sale account in the Marmalade ledger. |

### Return value

This function returns the `sale-id` as a `string` value.

### Example

```typescript
const result = await buyToken({
    chainId,
    tokenId,
    saleId,
    seller: {
      account: "k:5a2afbc4564b76b2c27ce5a644cab643c43663835ea0be22433b209d3351f937",
    },
    buyer: {
      account: "k:368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca",
      keyset: {
        keys: ["368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca"],
        pred: 'keys-all'
      }
    },
    amount: new PactNumber(1).toPactDecimal(),
    timeout
  },
  config
)
```

## createAuction

Use `createAuction` to create an auction for a specified token. 
This function supports both conventional and dutch auction types, allowing the seller to define start and end dates, prices, and other relevant parameters.

```typescript
createAuction(inputs, config): IEmitterWrapper
```

### Inputs

Both conventional auctions and dutch auctions use the following parameters:

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| auctionConfig | IAuctionPurchaseConfig | Specifies the type of auction to create. Valid vales are conventional and dutch.|
| chainId | ChainId | Specifies the chain identifier for the chain where where you want to create the auction. Valid values are 0 to 19. |
| seller | object | Specifies the account information for the token seller. |
| saleId | string | Specifies the Pact identifier for the token sale. |
| tokenId | string | Specifies the token identifier for the token you want to list. |
| startDate | IPactInt | Specifies the time when auction starts. |
| endDate | IPactInt | Specifies the time when auction ends. |
| reservedPrice | IPactDecimal | Specifies the reserved price for the sale.|

The following parameters are only used for creating a dutch auction:

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| startPrice | IPactDecimal | Specifies the initial asking price for the token auction. |
| priceIntervalInSeconds | IPactInt | Specifies the interval for lowering the asking price for the token. |

### Return value

This function returns a `boolean` value to indicate whether creating the auction was successful or failed.

### Example

```typescript
const result = await createAuction({
    auctionConfig: {
      conventional: true,
    },
    saleId: "",
    tokenId: "t:...",
    startDate: { int: "" },
    endDate: { int: "" },
    reservedPrice: new PactNumber(1).toPactDecimal(),
    chainId,
    seller: {
      account: "k:5a2afbc4564b76b2c27ce5a644cab643c43663835ea0be22433b209d3351f937",
      keyset: {
        keys: ["5a2afbc4564b76b2c27ce5a644cab643c43663835ea0be22433b209d3351f937"],
        pred: 'keys-all',
      },
    },
  },
  config,
)
```

## createBidId

Use `createBidId` to generate a unique bid identifier for a specified auction.

```typescript
createBidId(inputs): string
```

### Inputs

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| saleId | string | Specifies the Pact identifier for the token sale. |
| bidderAccount | string | Specifies the bidder account information. |
| chainId | ChainId | Specifies the chain identifier for the chain where where you want to create a bid identifier. Valid values are 0 to 19.|
| networkId | NetworkId | Specifies the target network for the bid. Valid values are development, testnet04, and mainnet01. |
| host | IClientConfig['host'] | Specifies the target node for the bid. |

### Return value

This function returns the `bid-id` as a `string` value.

### Example

```typescript
const result = await createBidId({
  saleId: "",
  bidderAccount: "k:5a2afbc4564b76b2c27ce5a644cab643c43663835ea0be22433b209d3351f937",
  chainId: "0",
  networkId: "development",
  host: "http://127.0.0.1:8080"
});
```

## createCollectionId

Use `createCollectionId` to generate a unique collection identifier.

```typescript
createCollectionId(inputs): string
```

### Inputs

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| collectionName | string | Specifies the name of the collection. |
| operator | string | Specifies the collection operator. |
| chainId | ChainId | Specifies the chain identifier for the chain where where you want to create the collection identifier. Valid values are 0 to 19.|
| networkId | NetworkId | Specifies the target network for the collection identifier. Valid values are development, testnet04, and mainnet01. |
| host | IClientConfig['host'] | Specifies the target node for the collection identifier. |

### Return value

This function returns the `collection-id` as a `string` value.

### Example

```typescript
const result = await createCollectionId({
  collectionName: "docs",
  chainId: "0",
  operator: {
    keyset: {
      keys: [sourceAccount.publicKey],
      pred: 'keys-all',
    },
  },
  networkId: "development",
  host: "http://127.0.0.1:8080",
});
```

## createCollection

Use `createCollection` to initiate the creation of a new collection, specifying its name, size, operator, and other relevant metadata.

```typescript
createCollection(inputs, config): IEmitterWrapper
```

### Inputs

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| id | string | Specifies the collection identifier. |
| name | string | Specifies the collection name. |
| size | IPactInt or PactReference | Specifies the number of tokens in the collection. |
| chainId | ChainId | Specifies the chain identifier for the chain where where you want to create the collection. Valid values are 0 to 19. |
| operator | object | Specifies the operator account and guard. |
| meta | object | Specifies the transaction metadata. |

### Return value

This function returns a `boolean` value to indicate whether creating the collection was successful or failed.

### Example

```typescript
const result = await createCollection({
    id: "collection:...",
    name: "Docs",
    size: new PactNumber(0).toPactInteger(),
    operator: {
      account: "k:5a2afbc4564b76b2c27ce5a644cab643c43663835ea0be22433b209d3351f937",
      keyset: {
        keys: ["5a2afbc4564b76b2c27ce5a644cab643c43663835ea0be22433b209d3351f937"],
        pred: 'keys-all'
      }
    },
    chainId: "0"
  },
  config
)
```

## createTokenId

Use `createTokenId` to generate a unique token identifier.
```typescript
createTokenId(inputs): string
```

### Inputs

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| policyConfig | object | Specifies which types of policies are configured for the specified token. This object is used to validate that you have expected types defined for the all of the policies you have selected for a token.|
| policies | Array<string> | Specifies the list of policy names applied to the token.|
| uri | string | Specifies the location of the token metadata JSON file in the form of uniform resource identifier (URI). |
| precision | IPactInt or PactReference | Specifies the token precision.        |
| collectionName | string | Specifies the name of the token collection, if applicable. |
| creator | string | Specifies the token creator account information.|
| chainId | ChainId | Specifies the chain identifier for the chain where where you want to create the token identifier. Valid values are 0 to 19.|
| networkId | NetworkId | Specifies the target network for the token identifier. Valid values are development, testnet04, and mainnet01. |
| host | IClientConfig['host'] | Specifies the target node for the token identifier. |

#### Policy configuration object

The `ICreateTokenPolicyConfig` interface identifies the types of policies that are configured for a token as boolean values.
The resulting `policyConfig` object contains properties similar to the following:

```json
{
  "customPolicies": false,
  "nonUpdatableURI": false,
  "guarded": true,
  "nonFungible": true,
  "hasRoyalty": true,
  "collection": true
}
```

### Return value

This function returns the `token-id` as a `string` value.

### Example

```typescript
const result = await createTokenId({
  uri: "ipfs://...",
  precision: { int: '0' },
  policies: [],
  creator: {
    keyset: {
      keys: ["5a2afbc4564b76b2c27ce5a644cab643c43663835ea0be22433b209d3351f937"],
      pred: 'keys-all'
    }
  },
  chainId: "0",
  networkId: "development",
  host: "http://127.0.0.1:8080"
});
```

## createToken

Use `createToken` to create a new token with all relevant policies applied.

```typescript
createToken(inputs, config): IEmitterWrapper
```

### Inputs

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| policyConfig | object | Specifies which types of policies are configured for the specified token. This object is used to validate that you have expected types defined for the all of the policies you have selected for a token.|
| policies | Array<string> | Specifies the list of policy names applied to the token. |
| uri | string | Specifies the location of the token metadata JSON file in the form of uniform resource identifier (URI). |
| precision | IPactInt or PactReference | Specifies the token precision.        |
| collectionName | string | Specifies the name of the token collection, if applicable. |
| creator | string | Specifies the token creator account information.|
| chainId | ChainId | Specifies the chain identifier for the chain where where you want to create the token. Valid values are 0 to 19. |
| guards | IGuardInfoInput | Specifies the parameters for the guard policy, if applicable. |
| royalty | IRoyaltyInfoInput | Specifies the parameters for the royalty policy, if applicable. |
| collection | ICollectionInfoInput | Specifies the parameters for the collection policy, if applicable. |

#### Additional inputs for guard policy (IGuardInfoInput)

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| mintGuard | KeysetGuard or FunctionGuard | Specifies the guard for minting tokens.|
| uriGuard | KeysetGuard or FunctionGuard | Specifies the guard for updating the token metadata and uri. |
| saleGuard | KeysetGuard or FunctionGuard | Specifies the guard for selling tokens. |
| burnGuard | KeysetGuard or FunctionGuard | Specifies the guard for burning tokens.|
| transferGuard | KeysetGuard or FunctionGuard | Specifies the guard for transferring tokens. |

#### Additional inputs for royalty policy (IRoyaltyInfoInput)

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| fungible | object | Specifies the module reference where a fungible token is defined, for example, in the `coin` contract for KDA. |
| creator | object | Specifies the creator account information and guard. |
| royaltyRate | IPactDecimal | Specifies the royalty percentage to be paid to the creator's account each time a token with this policy applied is sold. |

The fungible module object identifies the contracts where specified fungible tokens are defined.
For Marmalade and KDA tokens, the fungible object contains the following reference specifications:

```json
{
  "refSpec":[
    {
      "namespace":null,
      "name":"fungible-xchain-v1"
    },
    {
      "namespace":null,
      "name":"fungible-v2"
    }],
  "refName":
    {
      "namespace":null,
      "name":"coin"
    }
},
```

#### Additional inputs for collection policy (ICollectionInfoInput)

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| collectionId | string | Specifies the collection to add the token to. |

### Return value

This function returns a `boolean` value to indicate whether creating the token was successful or failed.

### Example

```typescript
const result = await createToken({
    uri: "ipfs://...",
    precision: { int: '0' },
    policies: [],
    creator: {
      keyset: {
        keys: ["5a2afbc4564b76b2c27ce5a644cab643c43663835ea0be22433b209d3351f937"],
        pred: 'keys-all'
      }
    },
    chainId: "0",
  },
  config
);
```

## escrowAccount

Use `escrowAccount` to retrieve the details for a specified escrow account.

```typescript
escrowAccount(inputs): string
```

### Inputs

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| saleId | string | Specifies the Pact identifier for the token sale. |
| chainId | ChainId | Specifies the chain identifier for the chain where the escrow account is created. Valid values are 0 to 19.|
| networkId | NetworkId | Specifies the target network for the escrow account. Valid values are development, testnet04, and mainnet01. |
| host | IClientConfig['host'] | Specifies the target node for the escrow account. |

### Return value

This function returns the `escrow-account` as a `string` value.

### Example

```typescript
const result = await escrowAccount({
  saleId: "",
  chainId: "0",
  networkId: "development",
  host: "http://127.0.0.1:8080"
});
```

## getAccountDetails

Use `getAccountDetails` to retrieve detailed information, including the token balance, for a specified account.

```typescript
getAccountDetails(inputs): object
```

### Inputs

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| tokenId | string | Specifies the token identifier for the token that you want to retrieve information for. |
| accountName | string | Specifies the account name that you want to retrieve information for. |
| chainId | ChainId | Specifies the chain identifier for the chain from which you want to get account details. Valid values are 0 to 19.|
| networkId | NetworkId | Specifies the target network for retrieving account details. Valid values are development, testnet04, and mainnet01. |
| host | IClientConfig['host'] | Specifies the target node for retrieving account details.|

### Return value

This functions returns an object with account details.

### Example

```typescript
const result = await getAccountDetails({
  tokenId: "t:...",
  accountName: "k:5a2afbc4564b76b2c27ce5a644cab643c43663835ea0be22433b209d3351f937"
  chainId: "0",
  networkId: "development",
  host: "http://127.0.0.1:8080"
});
```

## getAuctionDetails

Use `getAuctionDetails` to retrieve detailed information for a specified auction.

```typescript
getAuctionDetails(inputs): object
```

### Inputs

| Parameter | Type | Description |
| ----------| ---- | ----------- |
| auctionConfig | IAuctionConfig | Specifies the type of the auction. |
| saleId | string | Specifies the Pact identifier for the sale you want to retrieve information for. |
| chainId | ChainId | Specifies the chain identifier for the chain from which you want to get auction details. Valid values are 0 to 19.|
| networkId | NetworkId | Specifies the target network for retrieving auction details. Valid values are development, testnet04, and mainnet01. |
| host | IClientConfig['host'] | Specifies the target node for retrieving auction details.|

### Return value

This functions returns an object with auction details.

### Example

```typescript
const result = await getAuctionDetails({
  saleId: "",
  chainId: "0",
  networkId: "development",
  host: "http://127.0.0.1:8080"
});
```

## getBid

Use `getBid` to retrieve detailed information, including the bidder and bid amount, for a specific bid placed in the context of a specific auction.

```typescript
getBid(inputs): object
```

### Inputs

| Parameter | Type | Description |
| --------- | ---- | ------------|
| bidId | string | Specifies the identifier for the bid you want to retrieve information for. |
| chainId | ChainId | Specifies the chain identifier for the chain from which you want to get bid details. Valid values are 0 to 19.|
| networkId | NetworkId | Specifies the target network for retrieving bid details. Valid values are development, testnet04, and mainnet01. |
| host | IClientConfig['host'] | Specifies the target node for retrieving bid details.|

### Return value

This functions returns an object with bid details.

### Example

```typescript
const result = await getBid({
  bidId: "",
  chainId: "0",
  networkId: "development",
  host: "http://127.0.0.1:8080"
});
```

## getCollectionToken

Use `getCollectionToken` to retrieve information about a specific token within a collection.

```typescript
getCollectionToken(inputs): object
```

### Inputs

| Parameter | Type | Description |
| ----------| ---- | ----------- |
| tokenId | string | Specifies the token identifier for the token that you want to retrieve information for. |
| chainId | ChainId | Specifies the chain identifier for the chain from which you want to get information about a token in a collection. Valid values are 0 to 19.|
| networkId | NetworkId | Specifies the target network for retrieving information about a token in a collection. Valid values are development, testnet04, and mainnet01. |
| host | IClientConfig['host'] | Specifies the target node for retrieving information about a token in a collection.|

### Return value

This functions returns an object with details about a token in a collection.

### Example

```typescript
const result = await getCollectionToken({
  tokenId: "t:...",
  chainId: "0",
  networkId: "development",
  host: "http://127.0.0.1:8080"
});
```

## getCollection

Use `getCollection` to retrieve detailed information about a specified collection.

```typescript
getCollection(inputs): object
```

### Inputs

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| collectionId | string | Specifies the collection identifier for the collection that you want to retrieve information for. |
| chainId | ChainId | Specifies the chain identifier for the chain from which you want to get information about a collection. Valid values are 0 to 19.|
| networkId | NetworkId | Specifies the target network for retrieving information about a collection. Valid values are development, testnet04, and mainnet01. |
| host | IClientConfig['host'] | Specifies the target node for retrieving information about a collection.|

### Return value

This functions returns an object with collection details.

### Example

```typescript
const result = await getCollection({
  collectionId: "collection:...",
  chainId: "0",
  networkId: "development",
  host: "http://127.0.0.1:8080"
});
```

## getCurrentPrice

Use `getCurrentPrice` to retrieve the current price of a token in an auction, reflecting any price adjustments due to auction rules.

```typescript
getCurrentPrice(inputs): IPactDecimal
```

### Inputs

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| saleId | string | Specifies the Pact identifier for the sale you want to retrieve information for. |
| chainId | ChainId | Specifies the chain identifier for the chain from which you want to get information about the current price for a token. Valid values are 0 to 19.|
| networkId | NetworkId | Specifies the target network for retrieving information about the current price for a token. Valid values are development, testnet04, and mainnet01. |
| host | IClientConfig['host'] | Specifies the target node for retrieving information about the current price for a token.|

### Return value

This functions returns an object with the current price.

### Example

```typescript
const result = await getCurrentPrice({
  saleId: "",
  chainId: "0",
  networkId: "development",
  host: "http://127.0.0.1:8080"
});
```

## getEscrowAccount

Use `getEscrowAccount` to retrieve information about an escrow account.

```typescript
getEscrowAccount(inputs): object
```

### Inputs

| Parameter | Type                  | Description    |
| --------- | --------------------- | -------------- |
| saleId | string | Specifies the Pact identifier for the sale you want to retrieve information for. |
| chainId | ChainId | Specifies the chain identifier for the chain from which you want to get information about an escrow account. Valid values are 0 to 19.|
| networkId | NetworkId | Specifies the target network for retrieving information about an escrow account. Valid values are development, testnet04, and mainnet01. |
| host | IClientConfig['host'] | Specifies the target node for retrieving information about an escrow account.|

### Return value

This functions returns an object with details about an escrow account.

### Example

```typescript
const result = await getEscrowAccount({
  saleId: "",
  chainId: "0",
  networkId: "development",
  host: "http://127.0.0.1:8080"
});
```

## getQuoteInfo

Use `getQuoteInfo` to retrieve information about a specific sale quote.

```typescript
getQuoteInfo(inputs): object
```

### Inputs

| Parameter | Type                  | Description    |
| --------- | --------------------- | -------------- |
| saleId | string | Specifies the Pact identifier for the sale you want to retrieve information for. |
| chainId | ChainId | Specifies the chain identifier for the chain from which you want to get information about a quote. Valid values are 0 to 19.|
| networkId | NetworkId | Specifies the target network for retrieving information about a quote. Valid values are development, testnet04, and mainnet01. |
| host | IClientConfig['host'] | Specifies the target node for retrieving information about a quote.|

### Return value

This functions returns an object with quote details.

### Example

```typescript
const result = await getQuoteInfo({
  saleId: "",
  chainId: "0",
  networkId: "development",
  host: "http://127.0.0.1:8080"
});
```

## getTokenBalance

Use `getTokenBalance` to retrieve the balance recorded in the ledger for a specified token and a specified account.

```typescript
getTokenBalance(inputs): IPactDecimal
```

### Inputs

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| tokenId | string | Specifies the token identifier for the token that you want to retrieve information for. |
| accountName | string | Specifies the account name that you want to retrieve information for. |
| chainId | ChainId | Specifies the chain identifier for the chain from which you want to get balance information for a token. Valid values are 0 to 19.|
| networkId | NetworkId | Specifies the target network for retrieving information about the balance for a token. Valid values are development, testnet04, and mainnet01. |
| host | IClientConfig['host'] | Specifies the target node for retrieving information about the balance for a token.|

### Return value

This functions returns an IPactDecimal value representing the token balance.

### Example

```typescript
const result = await getTokenBalance({
  tokenId: "t:...",
  accountName: "k:5a2afbc4564b76b2c27ce5a644cab643c43663835ea0be22433b209d3351f937",
  chainId: "0",
  networkId: "development",
  host: "http://127.0.0.1:8080"
});
```

## getTokenInfo

Use `getTokenInfo` to retrieve detailed information about a specific token.

```typescript
getTokenInfo(inputs): object
```

### Inputs

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| tokenId | string | Specifies the token identifier for the token that you want to retrieve information for. |
| chainId | ChainId | Specifies the chain identifier for the chain from which you want to get information for the token. Valid values are 0 to 19.|
| networkId | NetworkId | Specifies the target network for retrieving information about the token. Valid values are development, testnet04, and mainnet01. |
| host | IClientConfig['host'] | Specifies the target node for retrieving information about the token.|

### Return value

This functions returns an object with token details.

### Example

```typescript
const result = await getTokenInfo({
  tokenId: "t:...",
  chainId: "0",
  networkId: "development",
  host: "http://127.0.0.1:8080"
});
```

## getUri

Use `getUri` to retrieve the URI associated with a specific token.

```typescript
getUri(inputs): string
```

### Inputs

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| tokenId | string | Specifies the token identifier for the token that you want to retrieve information for. |
| chainId | ChainId | Specifies the chain identifier for the chain from which you want to get the URI for the token. Valid values are 0 to 19.|
| networkId | NetworkId | Specifies the target network for retrieving the URI for the token. Valid values are development, testnet04, and mainnet01. |
| host | IClientConfig['host'] | Specifies the target node for retrieving the URI for the token.|

### Return value

This function returns the token uRI as a `string` value.

### Example

```typescript
const result = await getUri({
  tokenId: "t:...",
  chainId: "0",
  networkId: "development",
  host: "http://127.0.0.1:8080"
});
```

## mintToken

Use `mintToken` function to mint a specified amount of a specified token.
Minting a token increases its total supply and assigns ownership of the token to a target account.

```typescript
mintToken(inputs, config): IEmitterWrapper
```

### Inputs

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| policyConfig | object | Specifies which types of policies are configured for the specified token. This object is used to validate that you have expected types defined for the all of the policies you have selected for a token.|
| tokenId | string | Specifies the token identifier for the token you want to mint. |
| accountName | string | Specifies the account that you want to assign ownership of the token to. |
| chainId | ChainId | Specifies the chain identifier for the chain where the token is being minted. Valid values are 0 to 19. |
| guard | object | Specifies the token owner or the mint guard, if applicable. |
| amount | IPactDecimal | Specifies the amount to mint. |

### Return value

This function returns a `boolean` value to indicate whether minting the token was successful or failed.

### Example

```typescript
const result = await mintToken({
    tokenId: "t:...",
    accountName: "k:368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca",
    amount: new PactNumber(1).toPactDecimal(),
    guard: {
      account: "k:5a2afbc4564b76b2c27ce5a644cab643c43663835ea0be22433b209d3351f937"
      keyset: {
        keys: ["5a2afbc4564b76b2c27ce5a644cab643c43663835ea0be22433b209d3351f937"],
        pred: 'keys-all'
      }
    },
    chainId: "0",
  },
  config
);
```

## offerToken

Use `offerToken` to put a specified token up for sale.
Note that you must be the token owner to offer the specified token for sale.

```typescript
offerToken(inputs, config): IEmitterWrapper
```

### Inputs

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| policyConfig | object | Specifies which types of policies are configured for the specified token. This object is used to validate that you have expected types defined for the all of the policies you have selected for a token.|
| tokenId | string | Specifies the token identifier for the token that you want to offer for sale. |
| amount | IPactDecimal | Specifies the amount that you want to offer for sale. |
| timeout | IPactInt | Specifies the timeout for when the offer can be withdrawn. You can set this value using the number of seconds from the start of the UNIX epoch or set the timeout to zero (0) to allow an offer to be withdrawn at any time.|
| chainId | ChainId | Specifies the chain identifier for the chain where the token is being offered. Valid values are 0 to 19. |
| seller | object | Specifies the seller account information and guard. |
| auction | ISaleAuctionInfoInput | Additional parameters if you are offering the token using an auction contract. |
| guards | ISaleGuardInfoInput | Additional parameters if you are offering a token that has the guard policy applied. |
| royalty | IRoyaltyInfoInput | Additional parameters if you are offering a token that has the royalty policy applied. |

#### Additional inputs for auction contract (ISaleAuctionInfoInput)

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| fungible | object | Specifies the identifier to specify a fungible token, such as coin or a custom fungible token. |
| price | IPactDecimal | Specifies the price that the token is being offered at. For auction contracts, this setting should be zero (0).|
| sellerFungibleAccount | IPactDecimal | Specifies the seller account information if you are using a custom fungible. |
| saleType | string | Specifies the auction contract type. Valid values are conventional and dutch. |

#### Additional inputs for guard policy (ISaleGuardInfoInput)

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| saleGuard | KeysetGuard or FunctionGuard | Specifies the guard for selling tokens. |

#### Additional inputs for royalty policy (IRoyaltyInfoInput)

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| fungible | object | Specifies the identifier to specify a fungible token, such as coin or a custom fungible token.  |
| creator | object | Specifies the creator account information and guard. |
| royaltyRate | IPactDecimal | Specifies the royalty percentage to be paid to the creator's account each time a token with this policy applied is sold. |

### Return value

This function returns a `boolean` value to indicate whether creating the offer was successful or failed.

### Example

```typescript
const result = await offerToken({
    tokenId: "t:...",
    amount: new PactNumber(1).toPactDecimal(),
    timeout: new PactNumber(1).toPactInteger(),
    seller: {
      account: "k:5a2afbc4564b76b2c27ce5a644cab643c43663835ea0be22433b209d3351f937",
      keyset: {
        keys: ["5a2afbc4564b76b2c27ce5a644cab643c43663835ea0be22433b209d3351f937"],
        pred: 'keys-all'
      }
    },
    chainId: "0",
  },
  config
);
```

## placeBid

Use `placeBid` to place a bid on a specified token in an active auction.

```typescript
placeBid(inputs, config): IEmitterWrapper
```

### Inputs

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| marketplaceConfig | object | Specifies the configuration to collect marketplace fees. |
| saleId | string | Specifies the Pact identifier for the sale. |
| bid | IPactDecimal | Specifies the amount to bid on the token. |
| bidder | object | Specifies the bidder account information and guard. |
| escrowAccount | string | Specifies the escrow account for the bid. |
| chainId | ChainId | | chainId | ChainId | Specifies the chain identifier for the chain where the token is being offered. Valid values are 0 to 19. |
| marketplaceFee | IPlaceBidInput | Additional parameters, if using marketplace fees. |

#### Marketplace object

The `marketplaceConfig` object specifies whether a marketplace charges fees.
For example:

```json
{
  "marketplaceFee": true
}
```

If true, the IPlaceBidInput interface requires the following additional parameters:

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| mkAccount | string | Specifies the marketplace account information. |
| mkFeePercentage | IPactDecimal | Specifies the marketplace fee percentage.|

### Return value

This function returns a `boolean` value to indicate whether placing the bid was successful or failed.

### Example

```typescript
const result = await placeBid({
    saleId: "",
    bid: new PactNumber(1).toPactDecimal(),
    bidder: {
      account: "k:5a2afbc4564b76b2c27ce5a644cab643c43663835ea0be22433b209d3351f937",
      keyset: {
        keys: ["5a2afbc4564b76b2c27ce5a644cab643c43663835ea0be22433b209d3351f937"],
        pred: 'keys-all'
      }
    },
    escrowAccount: "",
    chainId: "0",
  },
  config
);
```

## transferCreateToken

Use `transferCreateToken` to transfer a specified amount of a specified token from one account to another.

```typescript
transferCreateToken(inputs, config): IEmitterWrapper
```

### Inputs

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| policyConfig | object | Specifies which types of policies are configured for the specified token. This object is used to validate that you have expected types defined for the all of the policies you have selected for a token.|
| tokenId | string | Specifies the token identifier for the token that you want to transfer. |
| amount | IPactDecimal | Specifies the amount that you want to transfer. |
| sender | object | Specifies the sender account information and guard. |
| receiver | object | Specifies the receiver account information and guard. |
| chainId | ChainId | Specifies the chain identifier for the chain where the transfer takes place. Valid values are 0 to 19. |

### Return value

This function returns a `boolean` value to indicate whether transferring the token was successful or failed.

### Example

```typescript
const result = await transferCreateToken({
    tokenId: "t:...",
    amount: new PactNumber(1).toPactDecimal(),
    sender: {
      account: "k:368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca",
      keyset: {
        keys: ["368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca"],
        pred: 'keys-all'
      }
    },
    receiver: {
      account: "k:5a2afbc4564b76b2c27ce5a644cab643c43663835ea0be22433b209d3351f937",
      keyset: {
        keys: ["5a2afbc4564b76b2c27ce5a644cab643c43663835ea0be22433b209d3351f937"],
        pred: 'keys-all'
      }
    },
    chainId: "0",
  },
  config
);
```

## transferToken

Use `transferToken` to transfer a specified amount of a specified token from one account to another.

```typescript
transferToken(inputs, config): IEmitterWrapper
```

### Inputs

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| policyConfig | object | Specifies which types of policies are configured for the specified token. This object is used to validate that you have expected types defined for the all of the policies you have selected for a token.|
| tokenId | string | token identifier for the token that you want to transfer. |
| amount | IPactDecimal | Specifies the amount that you want to transfer. |
| sender | object | Specifies the sender account information and guard. |
| receiver | object | Specifies the receiver account information and guard. |
| chainId | ChainId | Specifies the chain identifier for the chain where the transfer takes place. Valid values are 0 to 19. |

### Return value

This function returns a `boolean` value to indicate whether transferring the token was successful or failed.

### Example

```typescript
const result = await transferToken({
    tokenId: "t:...",
    amount: new PactNumber(1).toPactDecimal(),
    sender: {
      account: "k:368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca",
      keyset: {
        keys: ["368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca"],
        pred: 'keys-all'
      }
    },
    receiver: {
      account: "k:5a2afbc4564b76b2c27ce5a644cab643c43663835ea0be22433b209d3351f937",
    },
    chainId: "0",
  },
  config
);
```

## updateAuction

Use `updateAuction` to modify an existing auction's details. 
This function supports updates to both conventional and dutch auction types, enabling changes to start and end dates, prices, and other relevant parameters.

```typescript
updateAuction(inputs, config): IEmitterWrapper
```

### Inputs

Both conventional auctions and dutch auctions use the following parameters:

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| auctionConfig | IAuctionPurchaseConfig | Specifies the type of auction to update. Valid vales are conventional and dutch.|
| chainId | ChainId | Specifies the chain identifier for the chain where where you want to update the auction. Valid values are 0 to 19. |
| seller | object | Specifies the account information for the token seller. |
| saleId | string | Specifies the Pact identifier for the token sale. |
| tokenId | string | Specifies the token identifier for the token you want to list. |
| startDate | IPactInt | Specifies the time when auction starts. |
| endDate | IPactInt | Specifies the time when auction ends. |
| reservedPrice | IPactDecimal | Specifies the reserved price for the sale.|

The following parameters are only used for updating a dutch auction:

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| startPrice | IPactDecimal | Specifies the initial asking price for the token auction. |
| priceIntervalInSeconds | IPactInt | Specifies the interval for lowering the asking price for the token. |

### Return value

This function returns a `boolean` value to indicate whether the update to the auction was successful or failed.

#### Example

```typescript
const result = await updateAuction({
    auctionConfig: {
      conventional: true,
    },
    saleId: "",
    tokenId: "t:...",
    startDate: { int: "" },
    endDate: { int: "" },
    reservedPrice: new PactNumber(1).toPactDecimal(),
    chainId,
    seller: {
      account: "k:5a2afbc4564b76b2c27ce5a644cab643c43663835ea0be22433b209d3351f937",
      keyset: {
        keys: ["5a2afbc4564b76b2c27ce5a644cab643c43663835ea0be22433b209d3351f937"],
        pred: 'keys-all',
      },
    },
  },
  config,
)
```

## updateUri

Use `updateUri` to update the URI associated with a specified token.
You can use this function to modify the metadata associated with the specified token. 
Note that modifying the metadata for a token also updates the token identifier.
You can prevent a token from being upgradeable by applying the `non-updatable-uri-policy` to the token.

```typescript
updateUri(inputs, config): IEmitterWrapper
```

### Inputs

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| policyConfig | object | Specifies which types of policies are configured for the specified token. This object is used to validate that you have expected types defined for the all of the policies you have selected for a token.|
| tokenId | string | Specifies the token identifier for the token that you want to update. |
| uri | string |  Specifies the location of the token metadata JSON file in the form of uniform resource identifier (URI) that you want to update. |
| guard | object | Specifies the update URI (uriGuard) account information and guard. |
| chainId | ChainId | Specifies the chain identifier for the chain where the token is being updated. Valid values are 0 to 19. |

### Return value

This function returns a `boolean` value to indicate whether updating the token URI was successful or failed.

### Example

```typescript
const result = await updateUri({
    tokenId: "t:...",
    uri: "ipfs://new-uri",
    guard: {
      account: "k:368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca",
      keyset: {
        keys: ["368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca"],
        pred: 'keys-all'
      }
    },
    chainId: "0",
  },
  config
);
```

## withdrawToken

Use `withdrawToken` to withdraw a specified token from a sale.

```typescript
withdrawToken(inputs, config): IEmitterWrapper
```

### Inputs

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| policyConfig | object | Specifies which types of policies are configured for the specified token. This object is used to validate that you have expected types defined for the all of the policies you have selected for a token.|
| tokenId | string | Specifies the token identifier for the token that you want to transfer. |
| saleId | string | Specifies the Pact identifier for the sale. |
| amount | IPactDecimal | Specifies the amount to withdraw. |
| timeout | IPactInt | Specifies the timeout for when the offer can be withdrawn. |
| seller | object | Specifies the seller account information and guard. |
| chainId | ChainId | Specifies the chain identifier for the chain where the token is being withdrawn. Valid values are 0 to 19. |

### Return value

This function returns a `boolean` value to indicate whether withdrawing the token was successful or failed.

### Example

```typescript
const result = await withdrawToken({
    tokenId: "t:...",
    saleId: "",
    amount: new PactNumber(1).toPactDecimal(),
    timeout: new PactNumber(1).toPactInteger(),
    seller: {
      account: "k:368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca",
      keyset: {
        keys: ["368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca"],
        pred: 'keys-all'
      }
    },
    chainId: "0",
  },
  config
);
```
