---
title: Marmalade client-utils
description:
  The @kadena/client-utils library provides a TypeScript-based API for interacting
  with marmalade smart contracts on the Kadena network.
menu: Reference
label: Marmalade client utilities
order: 5
layout: full
tags: ['TypeScript', 'Kadena', 'Kadena client utils', 'frontend', 'backend', 'marmalade', 'client-utils', 'utils']
---

# Marmalade client utilities

The `@kadena/client-utils/marmalade` library provides a TypeScript-based API for interacting with marmalade smart contracts on the Kadena network. This library is designed to facilitate the creation, management, and utilization of NFTs, leveraging Marmalade’s advanced features such as enforceable royalties, secure escrow accounts, and flexible token policies.

Whether you're building applications for minting, transferring, or auctioning NFTs, `@kadena/client-utils/maramlade` provides the necessary tools to create and send commands to the Kadena network efficiently. This guide will help you get started with installing the library, using its various functions, and integrating it into your projects.

See the following sections for more information:

- [Install](#install)
- [Common Things](#common-things)
  - [CommonProps](#commonprops)
  - [IClientConfig](#iclientconfig)
- [Functions](#functions)
  - [Burn Token](#burn-token)
  - [Buy Token](#buy-token)
  - [Create Auction](#create-auction)
  - [Update Auction](#update-auction)
  - [Create Bid Id](#create-bid-id)
  - [Create Collection Id](#create-collection-id)
  - [Create Collection](#create-collection)
  - [Create Token Id](#create-token-id)
  - [Create Token](#create-token)
  - [Escrow Account](#escrow-account)
  - [Get Account Details](#get-account-details)
  - [Get Auction Details](#get-auction-details)
  - [Get Bid](#get-bid)
  - [Get Collection Token](#get-collection-token)
  - [Get Collection](#get-collection)
  - [Get Current Price](#get-current-price)
  - [Get Escrow Account](#get-escrow-account)
  - [Get Quote Info](#get-quote-info)
  - [Get Token Balance](#get-token-balance)
  - [Get Token Info](#get-token-info)
  - [Get URI](#get-uri)
  - [Mint Token](#mint-token)
  - [Offer Token](#offer-token)
  - [Place Bid](#place-bid)
  - [Transfer Create Token](#transfer-create-token)
  - [Transfer Token](#transfer-token)
  - [Update URI](#update-uri)
  - [Withdraw Token](#withdraw-token)

## Install

You can install the library with the following command:

```bash
npm install @kadena/client-utils
```

You can import Marmalade functions into TypeScript program with the following statement:

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

Use the `IClientConfig` interface to specify the network location to send the transactions to.

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

| Parameter    | Type         | Description                  |
| ------------ | ------------ | ---------------------------- |
| policyConfig | object       | Concrete policies used when the token was created. |
| tokenId      | string       | Token identifier for the token you want to burn. |
| accountName  | string       | Owner of the token you want to burn. |
| chainId      | ChainId      | Chain identifier for the chain where the token was created. Valid values are 0 to 19. |
| guard        | object       | Token owner or the burn guard, if applicable. |
| amount       | IPactDecimal | Amount to burn. |

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

Use `buyToken` to enable the purchase of a specified token within a defined sale configuration. This function handles the transaction between the seller and buyer, including any applicable auction logic.
```typescript
buyToken(inputs, config): IEmitterWrapper
```

### Inputs

| Parameter             | Type                   | Description                                  |
| --------------------- | ---------------------- | -------------------------------------------- |
| auctionConfig         | IAuctionPurchaseConfig | type of auction                              |
| policyConfig          | object                 | concrete policies used                       |
| tokenId               | string                 | token to buy                                 |
| saleId                | string                 | token sale                                   |
| amount                | IPactDecimal           | amount to buy                                |
| chainId               | ChainId                | token origin                                 |
| seller                | object                 | seller account                               |
| buyer                 | object                 | buyer account with guard                     |
| buyerFungibleAccount? | string                 | if sale is with different fungible than coin |

#### Additional inputs for conventional auction (IConventionalAuctionPurchaseInput)

| Parameter    | Type         | Description           |
| ------------ | ------------ | --------------------- |
| updatedPrice | IPactDecimal | current auction price |
| escrow       | object       | escrow sale account   |

#### Additional inputs for dutch auction (IDutchAuctionPurchaseInput)

| Parameter    | Type         | Description           |
| ------------ | ------------ | --------------------- |
| updatedPrice | IPactDecimal | current auction price |
| escrow       | object       | escrow sale account   |

### Output
```typescript
string // sale-id
```

#### Example

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

Use `createAuction` to create an auction for a specified token. This function supports both conventional and dutch auction types, allowing the seller to define start and end dates, prices, and other relevant parameters.

```typescript
createAuction(inputs, config): IEmitterWrapper
```

### Common inputs

| Parameter              | Type                   | Description                                  |
| ---------------------- | ---------------------- | -------------------------------------------- |
| auctionConfig          | IAuctionPurchaseConfig | type of auction                              |
| chainId                | ChainId                | token origin                                 |
| seller                 | object                 | seller account                               |

#### Conventional auction specific inputs

| Parameter              | Type                   | Description                                  |
| ---------------------- | ---------------------- | -------------------------------------------- |
| saleId                 | string                 | token sale                                   |
| tokenId                | string                 | token to list                                |
| startDate              | IPactInt               | when auction starts                          |
| endDate                | IPactInt               | when auction ends                            |
| reservedPrice          | IPactDecimal           | reserved price of the sale                   |

#### Dutch auction specific inputs

| Parameter              | Type                   | Description                                  |
| ---------------------- | ---------------------- | -------------------------------------------- |
| saleId                 | string                 | token sale                                   |
| tokenId                | string                 | token to list                                |
| startDate              | IPactInt               | when auction starts                          |
| endDate                | IPactInt               | when auction ends                            |
| startPrice             | IPactDecimal           | initial price of the sale                    |
| reservedPrice          | IPactDecimal           | reserved price of the sale                   |
| priceIntervalInSeconds | IPactInt               | price change interval                        |

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

Use `updateAuction` to modify an existing auction's details. This function supports updates to both conventional and dutch auction types, enabling changes to start and end dates, prices, and other relevant parameters.

```typescript
updateAuction(inputs, config): IEmitterWrapper
```

### Common inputs

| Parameter              | Type                   | Description                                  |
| ---------------------- | ---------------------- | -------------------------------------------- |
| auctionConfig          | IAuctionPurchaseConfig | type of auction                              |
| chainId                | ChainId                | token origin                                 |
| seller                 | object                 | seller account                               |

#### Conventional auction specific inputs

| Parameter              | Type                   | Description                                  |
| ---------------------- | ---------------------- | -------------------------------------------- |
| saleId                 | string                 | token sale                                   |
| tokenId                | string                 | token to list                                |
| startDate              | IPactInt               | when auction starts                          |
| endDate                | IPactInt               | when auction ends                            |
| reservedPrice          | IPactDecimal           | reserved price of the sale                   |

#### Dutch auction specific inputs

| Parameter              | Type                   | Description                                  |
| ---------------------- | ---------------------- | -------------------------------------------- |
| saleId                 | string                 | token sale                                   |
| tokenId                | string                 | token to list                                |
| startDate              | IPactInt               | when auction starts                          |
| endDate                | IPactInt               | when auction ends                            |
| startPrice             | IPactDecimal           | initial price of the sale                    |
| reservedPrice          | IPactDecimal           | reserved price of the sale                   |
| priceIntervalInSeconds | IPactInt               | price change interval                        |

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

| Parameter              | Type                   | Description                                  |
| ---------------------- | ---------------------- | -------------------------------------------- |
| saleId                 | string                 | token sale                                   |
| bidderAccount          | string                 | bidder account                               |
| chainId                | ChainId                | token origin                                 |
| networkId              | NetworkId              | target network                               |
| host                   | IClientConfig['host']  | target node                                  |

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

| Parameter              | Type           | Description            |
| -------------- | ---------------------- | ---------------------- |
| collectionName | string                 | name of the collection |
| operator       | string                 | collection operator    |
| chainId        | ChainId                | origin                 |
| networkId      | NetworkId              | target network         |
| host           | IClientConfig['host']  | target node            |

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

### Common inputs

| Parameter              | Type                      | Description                 |
| ---------------------- | ------------------------- | --------------------------- |
| id                     | string                    | collection id               |
| name                   | string                    | collection name             |
| size                   | IPactInt or PactReference | collection name             |
| chainId                | ChainId                   | token origin                |
| operator               | object                    | operator account with guard |
| meta                   | object                    | transaction metadata        |

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

| Parameter      | Type                      | Description            |
| -------------- | ------------------------- | ---------------------- |
| policyConfig   | object                    | concrete policies used |
| policies       | Array<string>             | policies used          |
| uri            | string                    | token metadata URI     |
| precision      | IPactInt or PactReference | token precision        |
| collectionName | string                    | name of the collection |
| creator        | string                    | token creator          |
| chainId        | ChainId                   | origin                 |
| networkId      | NetworkId                 | target network         |
| host           | IClientConfig['host']     | target node            |

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

| Parameter      | Type                      | Description                |
| -------------- | ------------------------- | -------------------------- |
| policyConfig   | object                    | concrete policies used     |
| policies       | Array<string>             | policies used              |
| uri            | string                    | token metadata URI         |
| precision      | IPactInt or PactReference | token metadata URI         |
| collectionName | string                    | name of the collection     |
| creator        | string                    | token creator              |
| chainId        | ChainId                   | origin                     |
| guards         | IGuardInfoInput           | if using guard policy      |
| royalty        | IRoyaltyInfoInput         | if using royalty policy    |
| collection     | ICollectionInfoInput      | if using collection policy |

#### Additional inputs for guard policy (IGuardInfoInput)

| Parameter      | Type                         | Description             |
| -------------- | ---------------------------- | ----------------------- |
| mintGuard      | KeysetGuard or FunctionGuard | guard for minting       |
| uriGuard       | KeysetGuard or FunctionGuard | guard for updating uri  |
| saleGuard      | KeysetGuard or FunctionGuard | guard for selling token |
| burnGuard      | KeysetGuard or FunctionGuard | guard for burning       |
| transferGuard  | KeysetGuard or FunctionGuard | guard for transferring  |

#### Additional inputs for royalty policy (IRoyaltyInfoInput)

| Parameter      | Type         | Description                 |
| -------------- | ------------ | --------------------------- |
| fungible       | object       | reference to fungible token |
| creator        | object       | creator account with guard  |
| royaltyRate    | IPactDecimal | creators cut when selling   |

#### Additional inputs for collection policy (ICollectionInfoInput)

| Parameter      | Type         | Description                    |
| -------------- | ------------ | ------------------------------ |
| collectionId   | string       | collection to add the token to |

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

| Parameter      | Type                      | Description            |
| -------------- | ------------------------- | ---------------------- |
| saleId         | string                    | origin sale for escrow |
| chainId        | ChainId                   | origin                 |
| networkId      | NetworkId                 | target network         |
| host           | IClientConfig['host']     | target node            |

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

| Parameter      | Type                      | Description    |
| -------------- | ------------------------- | -------------- |
| tokenId        | string                    | target token   |
| accountName    | string                    | target account |
| chainId        | ChainId                   | origin         |
| networkId      | NetworkId                 | target network |
| host           | IClientConfig['host']     | target node    |

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

| Parameter      | Type                      | Description         |
| -------------- | ------------------------- | ------------------- |
| auctionConfig  | IAuctionConfig            | type of the auction |
| saleId         | string                    | target sale         |
| chainId        | ChainId                   | origin              |
| networkId      | NetworkId                 | target network      |
| host           | IClientConfig['host']     | target node         |

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

| Parameter      | Type                      | Description    |
| -------------- | ------------------------- | -------------- |
| bidId          | string                    | target bid     |
| chainId        | ChainId                   | origin         |
| networkId      | NetworkId                 | target network |
| host           | IClientConfig['host']     | target node    |

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

| Parameter      | Type                      | Description    |
| -------------- | ------------------------- | -------------- |
| tokenId        | string                    | target token   |
| chainId        | ChainId                   | origin         |
| networkId      | NetworkId                 | target network |
| host           | IClientConfig['host']     | target node    |

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

| Parameter      | Type                      | Description       |
| -------------- | ------------------------- | ----------------- |
| collectionId   | string                    | target collection |
| chainId        | ChainId                   | origin            |
| networkId      | NetworkId                 | target network    |
| host           | IClientConfig['host']     | target node       |

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

Use `getCurrentPrice` to retrieve the current price of a token in auction, reflecting any price adjustments due to auction rules.

```typescript
getCurrentPrice(inputs): IPactDecimal
```

### Inputs

| Parameter | Type                  | Description    |
| --------- | --------------------- | -------------- |
| saleId    | string                | target sale    |
| chainId   | ChainId               | origin         |
| networkId | NetworkId             | target network |
| host      | IClientConfig['host'] | target node    |

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
| saleId    | string                | target sale    |
| chainId   | ChainId               | origin         |
| networkId | NetworkId             | target network |
| host      | IClientConfig['host'] | target node    |

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
| saleId    | string                | target sale    |
| chainId   | ChainId               | origin         |
| networkId | NetworkId             | target network |
| host      | IClientConfig['host'] | target node    |

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

Use `getTokenBalance` to retrieve the balance recorded in the ledger for a specified token within a specified account.

```typescript
getTokenBalance(inputs): IPactDecimal
```

### Inputs

| Parameter   | Type                  | Description        |
| ----------- | --------------------- | ------------------ |
| tokenId     | string                | target token       |
| accountName | string                | owner of the token |
| chainId     | ChainId               | origin             |
| networkId   | NetworkId             | target network     |
| host        | IClientConfig['host'] | target node        |

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

| Parameter   | Type                  | Description        |
| ----------- | --------------------- | ------------------ |
| tokenId     | string                | target token       |
| chainId     | ChainId               | origin             |
| networkId   | NetworkId             | target network     |
| host        | IClientConfig['host'] | target node        |

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

| Parameter   | Type                  | Description        |
| ----------- | --------------------- | ------------------ |
| tokenId     | string                | target token       |
| chainId     | ChainId               | origin             |
| networkId   | NetworkId             | target network     |
| host        | IClientConfig['host'] | target node        |

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
Minting a token increases its total supply and assigns ownerhip of the token to a target account.

```typescript
mintToken(inputs, config): IEmitterWrapper
```

### Inputs

| Parameter      | Type                      | Description               |
| -------------- | ------------------------- | ------------------------- |
| policyConfig   | object                    | concrete policies used    |
| tokenId        | string                    | token to mint             |
| accountName    | string                    | account to mint to        |
| amount         | IPactDecimal              | amount to mint            |
| guard          | string                    | minter account with guard |
| chainId        | ChainId                   | origin                    |

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


## Offer Token

Use `offerToken` to put a specified token up for sale.
Note that you must be the token owner to offer the specified token for sale.

```typescript
offerToken(inputs, config): IEmitterWrapper
```

### Inputs

| Parameter      | Type                      | Description               |
| -------------- | ------------------------- | ------------------------- |
| policyConfig   | object                    | concrete policies used    |
| tokenId        | string                    | token to put on sale      |
| amount         | IPactDecimal              | token metadata URI        |
| timeout        | IPactInt                  | withdraw timeout          |
| chainId        | ChainId                   | origin                    |
| seller         | object                    | seller account with guard |
| auction        | ISaleAuctionInfoInput     | if using auction contract |
| guards         | ISaleGuardInfoInput       | if using guard policy     |
| royalty        | IRoyaltyInfoInput         | if using royalty policy   |

#### Additional inputs for auction contract (ISaleAuctionInfoInput)

| Parameter             | Type         | Description                     |
| --------------------- | ------------ | ------------------------------- |
| fungible              | object       | reference to fungible token     |
| price                 | IPactDecimal | sale price                      |
| sellerFungibleAccount | IPactDecimal | account if custom fungible used |
| saleType              | string       | auction contract used           |

#### Additional inputs for guard policy (ISaleGuardInfoInput)

| Parameter      | Type                         | Description             |
| -------------- | ---------------------------- | ----------------------- |
| saleGuard      | KeysetGuard or FunctionGuard | guard for selling token |

#### Additional inputs for royalty policy (IRoyaltyInfoInput)

| Parameter      | Type         | Description                 |
| -------------- | ------------ | --------------------------- |
| fungible       | object       | reference to fungible token |
| creator        | object       | creator account with guard  |
| royaltyRate    | IPactDecimal | creators cut when selling   |

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

| Parameter         | Type                      | Description               |
| ----------------- | ------------------------- | ------------------------- |
| marketplaceConfig | object                    | enable marketplace fee    |
| saleId            | string                    | target sale               |
| bid               | IPactDecimal              | amount to bid             |
| bidder            | object                    | bidder account with guard |
| escrowAccount     | string                    | escrow account of the bid |
| chainId           | ChainId                   | origin                    |
| marketplaceFee    | IRoyaltyInfoInput         | if using marketplace fees |

#### Additional inputs for guard policy (IPlaceBidInput)

| Parameter       | Type         | Description             |
| --------------- | ------------ | ----------------------- |
| mkAccount       | string       | guard for selling token |
| mkFeePercentage | IPactDecimal | guard for selling token |

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

| Parameter    | Type                      | Description                 |
| ------------ | ------------------------- | --------------------------- |
| policyConfig | object                    | concrete policies used      |
| tokenId      | string                    | target token                |
| sender       | object                    | sender account with guard   |
| receiver     | object                    | receiver account with guard |
| amount       | IPactDecimal              | amount to send              |
| chainId      | ChainId                   | origin                      |

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

| Parameter    | Type                      | Description                 |
| ------------ | ------------------------- | --------------------------- |
| policyConfig | object                    | concrete policies used      |
| tokenId      | string                    | target token                |
| sender       | object                    | sender account with guard   |
| receiver     | object                    | receiver account            |
| amount       | IPactDecimal              | amount to send              |
| chainId      | ChainId                   | origin                      |

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

| Parameter    | Type                      | Description                 |
| ------------ | ------------------------- | --------------------------- |
| policyConfig | object                    | concrete policies used      |
| tokenId      | string                    | target token                |
| uri          | string                    | sender account with guard   |
| guard        | object                    | uriGuard account and guard  |
| chainId      | ChainId                   | origin                      |

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

| Parameter    | Type         | Description                 |
| ------------ | ------------ | --------------------------- |
| policyConfig | object       | concrete policies used      |
| tokenId      | string       | target token                |
| saleId       | string       | target sale                 |
| amount       | IPactDecimal | amount to withdraw          |
| timeout      | IPactInt     | sale timeout                |
| seller       | object       | seller account with guard   |
| chainId      | ChainId      | origin                      |

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
