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

Use `burnToken` function to eliminate a specified amount of a token. This operation reduces the total supply of the token.

```typescript
burnToken(inputs, config): IEmitterWrapper
```

### Inputs

| Parameter | Type | Description |
| ------------ | ------------ | ---------------------------- |
| policyConfig | object | Concrete policies used when the token was created, if applicable. |
| tokenId | string | Token identifier for the token you want to burn. |
| accountName | string | Account that owns the token you want to burn. |
| chainId | ChainId | Chain identifier for the chain where the token was created. Valid values are 0 to 19. |
| guard | object | Token owner or the burn guard, if applicable. |
| amount | IPactDecimal | Amount to burn. |

### Output
```typescript
boolean
```

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
| auctionConfig | IAuctionPurchaseConfig | Type of auction if the token is offered for sale using a conventional or dutch auction.|
| policyConfig | object | Concrete policies used when the token was created, if applicable. |
| tokenId | string | Token identifier for the token you want to buy. |
| saleId | string | Pact identifier for the token sale. |
| amount | IPactDecimal | Number of tokens you want to buy. |
| timeout | IPactDecimal | Time the sale is set to expire. |
| chainId | ChainId | Chain identifier for the chain where the token is offered for sale. Valid values are 0 to 19. |
| seller | object | Account information for the token seller. |
| buyer | object| Buyer account information and guard. |
| buyerFungibleAccount? | string | Fungible name if the fungible for the sale is not using the coin contract. |

There are additional inputs for auctions. 
The interface for conventional auctions (IConventionalAuctionPurchaseInput) and the interface for dutch auctions (IDutchAuctionPurchaseInput) have the following additional inputs:

| Parameter    | Type         | Description           |
| ------------ | ------------ | --------------------- |
| updatedPrice | IPactDecimal | Current auction price. |
| escrow       | object       | Escrow sale account. |

### Output

```typescript
string // sale-id
```

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
| auctionConfig | IAuctionPurchaseConfig | Type of auction to create. Valid vales are conventional and dutch.|
| chainId | ChainId | Chain identifier for the chain where where you want to create the auction. Valid values are 0 to 19. |
| seller | object | Account information for the token seller. |
| saleId | string | Pact identifier for the token sale. |
| tokenId | string | Token identifier for the token you want to list. |
| startDate | IPactInt | Time when auction starts. |
| endDate | IPactInt | Time when auction ends. |
| reservedPrice | IPactDecimal | Reserved price for the sale.|

The following parameters are only used for creating a dutch auction:

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| startPrice | IPactDecimal | Initial asking price for the token auction. |
| priceIntervalInSeconds | IPactInt | Interval for lowering the asking price for the token. |

### Output

```typescript
boolean
```

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
| auctionConfig | IAuctionPurchaseConfig | Type of auction to update. Valid vales are conventional and dutch.|
| chainId | ChainId | Chain identifier for the chain where where you want to create the auction. Valid values are 0 to 19. |
| seller | object | Account information for the token seller. |
| saleId | string | Pact identifier for the token sale. |
| tokenId | string | Token identifier for the token you want to list. |
| startDate | IPactInt | Time when auction starts. |
| endDate | IPactInt | Time when auction ends. |
| reservedPrice | IPactDecimal | Reserved price for the sale.|

The following parameters are only used for updating a dutch auction:

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| startPrice | IPactDecimal | Initial asking price for the token auction. |
| priceIntervalInSeconds | IPactInt | Interval for lowering the asking price for the token. |

### Output

```typescript
boolean
```

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

## createBidId

Use `createBidId` to generate a unique bid identifier for a specified auction.

```typescript
createBidId(inputs): string
```

### Inputs

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| saleId | string | Pact identifier for the token sale. |
| bidderAccount | string | Bidder account information. |
| chainId | ChainId | Chain identifier for the chain where where you want to create a bid identifier. Valid values are 0 to 19.|
| networkId | NetworkId | Target network for the bid. Valid values are development, testnet04, and mainnet01. |
| host | IClientConfig['host'] | Target node for the bid. |

### Output

```typescript
string // bid-id
```

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
| collectionName | string | Name of the collection. |
| operator | string | Collection operator. |
| chainId | ChainId | Chain identifier for the chain where where you want to create the collection identifier. Valid values are 0 to 19.|
| networkId | NetworkId | Target network for the collection identifier. Valid values are development, testnet04, and mainnet01. |
| host | IClientConfig['host'] | Target node for the collection identifier. |

### Output

```typescript
string // collection-id
```

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
| id | string | Collection identifier. |
| name | string | Collection name. |
| size | IPactInt or PactReference | Number of tokens in the collection. |
| chainId | ChainId | Chain identifier for the chain where where you want to create the collection. Valid values are 0 to 19. |
| operator | object | Operator account and guard. |
| meta | object | Transaction metadata. |

### Output

```typescript
boolean
```

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
| policyConfig | object | Concrete policies used to create the token identifier, if applicable. |
| policies | Array<string> | List of policies applied to the token.|
| uri | string | Location of the token metadata JSON file in the form of uniform resource identifier (URI). |
| precision | IPactInt or PactReference | Token precision.        |
| collectionName | string | Name of the token collection, if applicable. |
| creator | string | Token creator account information.|
| chainId | ChainId | Chain identifier for the chain where where you want to create the token identifier. Valid values are 0 to 19.|
| networkId | NetworkId | Target network for the token identifier. Valid values are development, testnet04, and mainnet01. |
| host | IClientConfig['host'] | Target node for the token identifier. |

### Output

```typescript
string // token-id
```

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
| policyConfig | object | Concrete policies used to create the token, if applicable. |
| policies | Array<string> | List of policies applied to the token. |
| uri | string | Location of the token metadata JSON file in the form of uniform resource identifier (URI). |
| precision | IPactInt or PactReference | Token precision.        |
| collectionName | string | Name of the token collection, if applicable. |
| creator | string | Token creator account information.|
| chainId | ChainId | Chain identifier for the chain where where you want to create the token identifier. Valid values are 0 to 19. |
| guards | IGuardInfoInput | Parameters for the guard policy, if applicable. |
| royalty | IRoyaltyInfoInput | Parameters for the royalty policy, if applicable. |
| collection | ICollectionInfoInput | Parameters for the collection policy, if applicable. |

#### Additional inputs for guard policy (IGuardInfoInput)

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| mintGuard | KeysetGuard or FunctionGuard | Guard for minting tokens.|
| uriGuard | KeysetGuard or FunctionGuard | Guard for updating the token metadata and uri. |
| saleGuard | KeysetGuard or FunctionGuard | Guard for selling tokens. |
| burnGuard | KeysetGuard or FunctionGuard | Guard for burning tokens.|
| transferGuard | KeysetGuard or FunctionGuard | Guard for transferring tokens. |

#### Additional inputs for royalty policy (IRoyaltyInfoInput)

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| fungible | object | Reference to a fungible token. |
| creator | object | Creator account information and guard. |
| royaltyRate | IPactDecimal | Royalty percentage to be paid to the creator's account each time a token with this policy applied is sold. |

#### Additional inputs for collection policy (ICollectionInfoInput)

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| collectionId | string | Collection to add the token to. |

### Output

```typescript
boolean
```

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
| saleId | string | Pact identifier for the token sale. |
| chainId | ChainId | Chain identifier for the chain where the escrow account is created. Valid values are 0 to 19.|
| networkId | NetworkId | Target network for the escrow account. Valid values are development, testnet04, and mainnet01. |
| host | IClientConfig['host'] | Target node for the escrow account. |

### Output

```typescript
string // escrow-account
```

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
| tokenId | string | Token identifier for the token that you want to retrieve information for. |
| accountName | string | Account name that you want to retrieve information for. |
| chainId | ChainId | Chain identifier for the chain from which you want to get account details. Valid values are 0 to 19.|
| networkId | NetworkId | Target network for retrieving account details. Valid values are development, testnet04, and mainnet01. |
| host | IClientConfig['host'] | Target node for retrieving account details.|

### Output

```typescript
object // account details
```

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
| auctionConfig | IAuctionConfig | type of the auction |
| saleId | string | Pact identifier for the sale you want to retrieve information for. |
| chainId | ChainId | Chain identifier for the chain from which you want to get auction details. Valid values are 0 to 19.|
| networkId | NetworkId | Target network for retrieving auction details. Valid values are development, testnet04, and mainnet01. |
| host | IClientConfig['host'] | Target node for retrieving auction details.|

### Output

```typescript
object // auction details
```

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
| bidId | string | Identifier for the bid you want to retrieve information for. |
| chainId | ChainId | Chain identifier for the chain from which you want to get bid details. Valid values are 0 to 19.|
| networkId | NetworkId | Target network for retrieving bid details. Valid values are development, testnet04, and mainnet01. |
| host | IClientConfig['host'] | Target node for retrieving bid details.|

### Output

```typescript
object // bid details
```

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
| tokenId | string | Token identifier for the token that you want to retrieve information for. |
| chainId | ChainId | Chain identifier for the chain from which you want to get information about a token in a collection. Valid values are 0 to 19.|
| networkId | NetworkId | Target network for retrieving information about a token in a collection. Valid values are development, testnet04, and mainnet01. |
| host | IClientConfig['host'] | Target node for retrieving information about a token in a collection.|

### Output

```typescript
object // collection token details
```

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
| collectionId | string | Collection identifier for the collection that you want to retrieve information for. |
| chainId | ChainId | Chain identifier for the chain from which you want to get information about a collection. Valid values are 0 to 19.|
| networkId | NetworkId | Target network for retrieving information about a collection. Valid values are development, testnet04, and mainnet01. |
| host | IClientConfig['host'] | Target node for retrieving information about a collection.|

### Output

```typescript
object // collection details
```

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
| saleId | string | Pact identifier for the sale you want to retrieve information for. |
| chainId | ChainId | Chain identifier for the chain from which you want to get information about the current price for a token. Valid values are 0 to 19.|
| networkId | NetworkId | Target network for retrieving information about the current price for a token. Valid values are development, testnet04, and mainnet01. |
| host | IClientConfig['host'] | Target node for retrieving information about the current price for a token.|

### Output

```typescript
IPactDecimal // current price
```

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
| saleId | string | Pact identifier for the sale you want to retrieve information for. |
| chainId | ChainId | Chain identifier for the chain from which you want to get information about an escrow account. Valid values are 0 to 19.|
| networkId | NetworkId | Target network for retrieving information about an escrow account. Valid values are development, testnet04, and mainnet01. |
| host | IClientConfig['host'] | Target node for retrieving information about an escrow account.|

### Output

```typescript
object // escrow account
```

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
| saleId | string | Pact identifier for the sale you want to retrieve information for. |
| chainId | ChainId | Chain identifier for the chain from which you want to get information about a quote. Valid values are 0 to 19.|
| networkId | NetworkId | Target network for retrieving information about a quote. Valid values are development, testnet04, and mainnet01. |
| host | IClientConfig['host'] | Target node for retrieving information about a quote.|

### Output

```typescript
object // quote info
```

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
| tokenId | string | Token identifier for the token that you want to retrieve information for. |
| accountName | string | Account name that you want to retrieve information for. |
| chainId | ChainId | Chain identifier for the chain from which you want to get balance information for a token. Valid values are 0 to 19.|
| networkId | NetworkId | Target network for retrieving information about the balance for a token. Valid values are development, testnet04, and mainnet01. |
| host | IClientConfig['host'] | Target node for retrieving information about the balance for a token.|

### Output

```typescript
IPactDecimal // balance
```

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
| tokenId | string | Token identifier for the token that you want to retrieve information for. |
| chainId | ChainId | Chain identifier for the chain from which you want to get information for the token. Valid values are 0 to 19.|
| networkId | NetworkId | Target network for retrieving information about the token. Valid values are development, testnet04, and mainnet01. |
| host | IClientConfig['host'] | Target node for retrieving information about the token.|

### Output

```typescript
object // token info
```

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
| tokenId | string | Token identifier for the token that you want to retrieve information for. |
| chainId | ChainId | Chain identifier for the chain from which you want to get the URI for the token. Valid values are 0 to 19.|
| networkId | NetworkId | Target network for retrieving the URI for the token. Valid values are development, testnet04, and mainnet01. |
| host | IClientConfig['host'] | Target node for retrieving the URI for the token.|

### Output

```typescript
string // token URI
```

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
| policyConfig | object | Concrete policies specified when the token was created, if applicable. |
| tokenId | string | Token identifier for the token you want to mint. |
| accountName | string | Account that you want to assign ownership of the token to. |
| chainId | ChainId | Chain identifier for the chain where the token is being minted. Valid values are 0 to 19. |
| guard | object | Token owner or the mint guard, if applicable. |
| amount | IPactDecimal | Amount to mint. |

### Output

```typescript
boolean
```

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
| policyConfig | object | Concrete policies specified when the token was created, if applicable. |
| tokenId | string | Token identifier for the token that you want to offer for sale. |
| amount | IPactDecimal | Amount that you want to offer for sale. |
| timeout | IPactInt | Timeout for when the offer can be withdrawn. You can set this value using the number of seconds from the start of the UNIX epoch or set the timeout to zero (0) to allow an offer to be withdrawn at any time.|
| chainId | ChainId | Chain identifier for the chain where the token is being offered. Valid values are 0 to 19. |
| seller | object | Seller account information and guard. |
| auction | ISaleAuctionInfoInput | Additional parameters if you are offering the token using an auction contract. |
| guards | ISaleGuardInfoInput | Additional parameters if you are offering a token that has the guard policy applied. |
| royalty | IRoyaltyInfoInput | Additional parameters if you are offering a token that has the royalty policy applied. |

#### Additional inputs for auction contract (ISaleAuctionInfoInput)

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| fungible | object | Identifier to specify a fungible token, such as coin or a custom fungible token. |
| price | IPactDecimal | Price that the token is being offered at. For auction contracts, this setting should be zero (0).|
| sellerFungibleAccount | IPactDecimal | Seller account information if you are using a custom fungible. |
| saleType | string | Auction contract type. Valid values are conventional and dutch. |

#### Additional inputs for guard policy (ISaleGuardInfoInput)

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| saleGuard | KeysetGuard or FunctionGuard | Guard for selling tokens. |

#### Additional inputs for royalty policy (IRoyaltyInfoInput)

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| fungible | object | Identifier to specify a fungible token, such as coin or a custom fungible token.  |
| creator | object | Creator account information and guard. |
| royaltyRate | IPactDecimal | Royalty percentage to be paid to the creator's account each time a token with this policy applied is sold. |

### Output

```typescript
boolean
```

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
| marketplaceConfig | object | Configuration to collect marketplace fees. |
| saleId | string | Pact identifier for the sale. |
| bid | IPactDecimal | Amount to bid on the token. |
| bidder | object | Bidder account information and guard. |
| escrowAccount | string | Escrow account for the bid. |
| chainId | ChainId | | chainId | ChainId | Chain identifier for the chain where the token is being offered. Valid values are 0 to 19. |
| marketplaceFee | IPlaceBidInput | Additional parameters if using marketplace fees. |

#### Additional inputs for marketplace policy (IPlaceBidInput)

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| mkAccount | string | Marketplace account information. |
| mkFeePercentage | IPactDecimal | Marketplace fee percentage.|

### Output

```typescript
boolean
```

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
| policyConfig | object | Concrete policies specified when the token was created, if applicable. |
| tokenId | string | Token identifier for the token that you want to transfer. |
| amount | IPactDecimal | Amount that you want to transfer. |
| sender | object | Sender account information and guard. |
| receiver | object | Receiver account information and guard. |
| chainId | ChainId | Chain identifier for the chain where the transfer takes place. Valid values are 0 to 19. |

### Output

```typescript
boolean
```

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
| policyConfig | object | Concrete policies specified when the token was created, if applicable. |
| tokenId | string | Token identifier for the token that you want to transfer. |
| amount | IPactDecimal | Amount that you want to transfer. |
| sender | object | Sender account information and guard. |
| receiver | object | Receiver account information and guard. |
| chainId | ChainId | Chain identifier for the chain where the transfer takes place. Valid values are 0 to 19. |

### Output

```typescript
boolean
```

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
| policyConfig | object | Concrete policies specified when the token was created, if applicable. |
| tokenId | string | Token identifier for the token that you want to update. |
| uri | string |  Location of the token metadata JSON file in the form of uniform resource identifier (URI) that you want to update. |
| guard | object | Update URI (uriGuard) account information and guard. |
| chainId | ChainId | Chain identifier for the chain where the token is being updated. Valid values are 0 to 19. |

### Output

```typescript
boolean
```

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
| policyConfig | object | Concrete policies specified when the token was created, if applicable. |
| tokenId | string | Token identifier for the token that you want to transfer. |
| saleId | string | Pact identifier for the sale. |
| amount | IPactDecimal | Amount to withdraw. |
| timeout | IPactInt | Timeout for when the offer can be withdrawn. |
| seller | object | Seller account information and guard. |
| chainId | ChainId | Chain identifier for the chain where the token is being withdrawn. Valid values are 0 to 19. |

### Output

```typescript
boolean
```

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
