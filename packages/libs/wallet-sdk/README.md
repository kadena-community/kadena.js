<!-- genericHeader start -->

# @kadena/wallet-sdk

# Kadena Wallet SDK Documentation

The Kadena Wallet SDK provides a simple and unified interface to integrate
Kadena blockchain functionalities into your wallet applications. It abstracts
the complexities of interacting with the Kadena network, allowing you to focus
on building feature-rich wallet experiences without re-implementing common
integrations.

---

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [Core Features](#core-features)
  - [Creating and Sending Transactions](#creating-and-sending-transactions)
    - [`createSimpleTransfer`](#createsimpletransfer)
    - [`createTransfer`](#createtransfer)
    - [`createCrossChainTransfer`](#createcrosschaintransfer)
    - [`createFinishCrossChainTransfer`](#createfinishcrosschaintransfer)
    - [`sendTransaction`](#sendtransaction)
  - [Retrieving History and Updates](#retrieving-history-and-updates)
    - [`getTransfers`](#gettransfers)
    - [`subscribeOnCrossChainComplete`](#subscribeoncrosschaincomplete)
    - [`waitForPendingTransaction`](#waitforpendingtransaction)
    - [`subscribePendingTransactions`](#subscribependingtransactions)
- [Account Information](#account-information)
  - [`getAccountDetails`](#getaccountdetails)
- [Miscellaneous Functions](#miscellaneous-functions)
  - [`getChains`](#getchains)
  - [`getNetworkInfo`](#getnetworkinfo)
  - [`getGasLimitEstimate`](#getgaslimitestimate)
- [Extras](#extras)
  - [Exchange Helper](#exchange-helper)
    - [`getEthvmDevTokenInfo`](#getethvmdevtokeninfo)
  - [Kadena Names Service](#kadena-names-service)
    - [`nameToAddress`](#nametoaddress)
    - [`addressToName`](#addresstoname)
- [Conclusion](#conclusion)
- [Additional Resources](#additional-resources)

---

## Introduction

Building wallets on the Kadena blockchain has never been easier. The Kadena
Wallet SDK is designed to be intuitive and straightforward, enabling developers
of all levels—even those with intermediate experience—to seamlessly integrate
Kadena functionalities into their wallet applications. With this SDK, you can
quickly add essential features like transaction management, account querying,
and cross-chain transfers without getting bogged down by the underlying
complexities.

### Key Benefits

- **Ease of Use**: Designed with simplicity in mind, allowing developers to get
  started quickly.
- **Time-saving**: Eliminates the need to re-implement common functionalities,
  accelerating development.
- **Comprehensive**: Offers a wide range of features to cover most wallet
  integration needs.
- **Flexible**: Provides detailed control when needed, with clear parameters and
  options.

---

## Getting Started

### Installation

To install the Kadena Wallet SDK, you can use npm or yarn:

```bash
# Using npm
npm install @kadena/wallet-sdk

# Using yarn
yarn add @kadena/wallet-sdk
```

### Basic Usage

Import the `WalletSDK` class and create an instance:

```typescript
import { WalletSDK } from '@kadena/wallet-sdk';

const walletSdk = new WalletSDK();
```

---

## Core Features

### Creating and Sending Transactions

#### `createSimpleTransfer`

Creates a simple transfer transaction that only accepts `k:` accounts (accounts
identified by public keys).

**Method Signature:**

```typescript
createSimpleTransfer(transfer: SimpleCreateTransfer & { networkId: string }): IUnsignedCommand;
```

**Parameters:**

- `transfer`: An object containing:
  - `sender`: `string` - Sender's public key or `k:` account (e.g.,
    `'k:senderPublicKey'` or `'senderPublicKey'`).
  - `receiver`: `string` - Receiver's public key or `k:` account (e.g.,
    `'k:receiverPublicKey'` or `'receiverPublicKey'`).
  - `amount`: `string` - Amount to transfer (e.g., `'10'`).
  - `chainId`: `ChainId` - The chain ID where the transaction will be executed
    (e.g., `'1'`).
  - `networkId`: `string` - The network ID (e.g., `'mainnet01'`, `'testnet04'`).

**Returns:**

- `IUnsignedCommand`: An unsigned transaction command ready to be signed and
  sent.

**Example:**

```typescript
const unsignedTransaction = walletSdk.createSimpleTransfer({
  sender: 'k:senderPublicKey',
  receiver: 'k:receiverPublicKey',
  amount: '10',
  chainId: '1',
  networkId: 'testnet04',
});

// Sign the transaction (implementation depends on your signing method)
// For example, using a signing function:
// const signedTransaction = signTransaction(unsignedTransaction);

// Send the signed transaction
const transactionDescriptor = await walletSdk.sendTransaction(
  signedTransaction,
  'testnet04',
  '1',
);
```

#### `createTransfer`

Creates a transfer transaction that accepts any kind of account, including those
requiring custom keysets or predicates.

**Method Signature:**

```typescript
createTransfer(transfer: CreateTransfer & { networkId: string }): IUnsignedCommand;
```

**Parameters:**

- `transfer`: An object containing:
  - `sender`: `string` - Sender's account name (e.g., `'senderAccount'`).
  - `receiver`: `string` - Receiver's account name (e.g., `'receiverAccount'`).
  - `amount`: `string` - Amount to transfer (e.g., `'50'`).
  - `senderGuard`: `IGuard` - Optional guard (keyset) for the sender's account.
  - `receiverGuard`: `IGuard` - Optional guard for the receiver's account.
  - `chainId`: `ChainId` - The chain ID where the transaction will be executed
    (e.g., `'1'`).
  - `networkId`: `string` - The network ID.

**Returns:**

- `IUnsignedCommand`: An unsigned transaction command ready to be signed and
  sent.

**Example:**

```typescript
const unsignedTransaction = walletSdk.createTransfer({
  sender: 'senderAccount',
  receiver: 'receiverAccount',
  amount: '50',
  chainId: '1',
  networkId: 'testnet04',
  // Optional guards
  // senderGuard: { keys: ['senderPublicKey'], pred: 'keys-all' },
  // receiverGuard: { keys: ['receiverPublicKey'], pred: 'keys-all' },
});

// Sign the transaction
// const signedTransaction = signTransaction(unsignedTransaction);

// Send the signed transaction
const transactionDescriptor = await walletSdk.sendTransaction(
  signedTransaction,
  'testnet04',
  '1',
);
```

#### `createCrossChainTransfer`

Creates a cross-chain transfer transaction to move assets from one chain to
another within the Kadena network.

**Method Signature:**

```typescript
createCrossChainTransfer(transfer: CreateCrossChainTransfer & { networkId: string }): IUnsignedCommand;
```

**Parameters:**

- `transfer`: An object containing:
  - `sender`: `string` - Sender's account name (e.g., `'senderAccount'`).
  - `receiver`: `string` - Receiver's account name (e.g., `'receiverAccount'`).
  - `amount`: `string` - Amount to transfer (e.g., `'25'`).
  - `fromChainId`: `ChainId` - The source chain ID (e.g., `'0'`).
  - `toChainId`: `ChainId` - The target chain ID (e.g., `'1'`).
  - `networkId`: `string` - The network ID.
  - `senderGuard`: `IGuard` - Optional guard for the sender's account.
  - `receiverGuard`: `IGuard` - Optional guard for the receiver's account.

**Returns:**

- `IUnsignedCommand`: An unsigned transaction command ready to be signed and
  sent.

**Example:**

```typescript
const unsignedTransaction = walletSdk.createCrossChainTransfer({
  sender: 'senderAccount',
  receiver: 'receiverAccount',
  amount: '25',
  fromChainId: '0',
  toChainId: '1',
  networkId: 'testnet04',
  // Optional guards
  // senderGuard: { keys: ['senderPublicKey'], pred: 'keys-all' },
  // receiverGuard: { keys: ['receiverPublicKey'], pred: 'keys-all' },
});

// Sign the transaction
// const signedTransaction = signTransaction(unsignedTransaction);

// Send the signed transaction
const transactionDescriptor = await walletSdk.sendTransaction(
  signedTransaction,
  'testnet04',
  '0', // Source chain ID
);
```

#### `createFinishCrossChainTransfer`

Creates the finishing step for a cross-chain transfer. This step is necessary to
complete the transfer on the target chain.

**Method Signature:**

```typescript
createFinishCrossChainTransfer(transfer: CreateFinishCrossChainTransfer): IUnsignedCommand;
```

**Parameters:**

- `transfer`: An object containing:
  - `proof`: `string` - The SPV proof obtained from the source chain.
  - `requestKey`: `string` - The request key of the initial cross-chain
    transfer.
  - `fromChainId`: `ChainId` - The source chain ID.
  - `toChainId`: `ChainId` - The target chain ID.
  - `networkId`: `string` - The network ID.
  - `receiver`: `string` - Receiver's account name.
  - `receiverGuard`: `IGuard` - Optional guard for the receiver's account.

**Returns:**

- `IUnsignedCommand`: An unsigned transaction command ready to be signed and
  sent.

**Example:**

```typescript
const unsignedTransaction = walletSdk.createFinishCrossChainTransfer({
  proof: 'spvProofString',
  requestKey: 'initialRequestKey',
  fromChainId: '0',
  toChainId: '1',
  networkId: 'testnet04',
  receiver: 'receiverAccount',
  // Optional receiver guard
  // receiverGuard: { keys: ['receiverPublicKey'], pred: 'keys-all' },
});

// Sign the transaction
// const signedTransaction = signTransaction(unsignedTransaction);

// Send the signed transaction
const transactionDescriptor = await walletSdk.sendTransaction(
  signedTransaction,
  'testnet04',
  '1', // Target chain ID
);
```

#### `sendTransaction`

Sends a signed transaction to the Kadena network.

**Method Signature:**

```typescript
sendTransaction(
  transaction: ICommand,
  networkId: string,
  chainId: ChainId,
): Promise<ITransactionDescriptor>;
```

**Parameters:**

- `transaction`: `ICommand` - The signed transaction command.
- `networkId`: `string` - The network ID (e.g., `'mainnet01'`, `'testnet04'`).
- `chainId`: `ChainId` - The chain ID where the transaction will be executed.

**Returns:**

- `Promise<ITransactionDescriptor>`: An object containing the request key, chain
  ID, and network ID of the transaction.

**Example:**

```typescript
const transactionDescriptor = await walletSdk.sendTransaction(
  signedTransaction,
  'testnet04',
  '1',
);

console.log(
  'Transaction sent with request key:',
  transactionDescriptor.requestKey,
);
```

---

### Retrieving History and Updates

#### `getTransfers`

Retrieves a list of transfers associated with an account.

**Method Signature:**

```typescript
getTransfers(
  accountName: string,
  networkId: string,
  fungible?: string,
  chainsIds?: ChainId[],
): Promise<Transfer[]>;
```

**Parameters:**

- `accountName`: `string` - The account name to query (e.g.,
  `'k:accountPublicKey'`).
- `networkId`: `string` - The network ID.
- `fungible?`: `string` - Optional fungible token name (defaults to `'coin'`).
- `chainsIds?`: `ChainId[]` - Optional list of chain IDs to query.

**Returns:**

- `Promise<Transfer[]>`: A promise that resolves to an array of transfer
  objects.

**Example:**

```typescript
const transfers = await walletSdk.getTransfers(
  'k:accountPublicKey',
  'testnet04',
);

transfers.forEach((transfer) => {
  console.log(
    `Transfer of ${transfer.amount} from ${transfer.senderAccount} to ${transfer.receiverAccount}`,
  );
});
```

#### `subscribeOnCrossChainComplete`

Subscribes to cross-chain transfer completion events.

**Method Signature:**

```typescript
subscribeOnCrossChainComplete(
  transfers: ITransactionDescriptor[],
  callback: (transfer: Transfer) => void,
  options?: { signal?: AbortSignal },
): void;
```

**Parameters:**

- `transfers`: `ITransactionDescriptor[]` - An array of transaction descriptors
  representing the cross-chain transfers to monitor.
- `callback`: `(transfer: Transfer) => void` - A function to call when a
  transfer completes.
- `options?`: `{ signal?: AbortSignal }` - Optional settings, including an
  `AbortSignal` to cancel the subscription.

**Example:**

```typescript
walletSdk.subscribeOnCrossChainComplete(
  [crossChainTransactionDescriptor],
  (transfer) => {
    console.log('Cross-chain transfer completed:', transfer);
  },
);
```

#### `waitForPendingTransaction`

Waits for a pending transaction to be confirmed on the network.

**Method Signature:**

```typescript
waitForPendingTransaction(
  transaction: ITransactionDescriptor,
  options?: { signal?: AbortSignal },
): Promise<ResponseResult>;
```

**Parameters:**

- `transaction`: `ITransactionDescriptor` - The transaction descriptor to wait
  for.
- `options?`: `{ signal?: AbortSignal }` - Optional settings, including an
  `AbortSignal` to cancel the waiting.

**Returns:**

- `Promise<ResponseResult>`: A promise that resolves to the transaction result.

**Example:**

```typescript
const result = await walletSdk.waitForPendingTransaction(transactionDescriptor);

if (result.status === 'success') {
  console.log('Transaction confirmed:', result.data);
} else {
  console.error('Transaction failed:', result.error);
}
```

#### `subscribePendingTransactions`

Subscribes to updates for multiple pending transactions.

**Method Signature:**

```typescript
subscribePendingTransactions(
  transactions: ITransactionDescriptor[],
  callback: (
    transaction: ITransactionDescriptor,
    result: ResponseResult,
  ) => void,
  options?: { signal?: AbortSignal },
): void;
```

**Parameters:**

- `transactions`: `ITransactionDescriptor[]` - An array of transaction
  descriptors representing the transactions to monitor.
- `callback`:
  `(transaction: ITransactionDescriptor, result: ResponseResult) => void` - A
  function to call when a transaction status updates.
- `options?`: `{ signal?: AbortSignal }` - Optional settings, including an
  `AbortSignal`.

**Example:**

```typescript
walletSdk.subscribePendingTransactions(
  [transactionDescriptor1, transactionDescriptor2],
  (transaction, result) => {
    if (result.status === 'success') {
      console.log(`Transaction ${transaction.requestKey} confirmed`);
    } else {
      console.error(
        `Transaction ${transaction.requestKey} failed`,
        result.error,
      );
    }
  },
);
```

---

## Account Information

### `getAccountDetails`

Retrieves detailed information about an account across multiple chains.

**Method Signature:**

```typescript
getAccountDetails(
  accountName: string,
  networkId: string,
  fungible: string,
  chainIds?: ChainId[],
): Promise<IAccountDetails[]>;
```

**Parameters:**

- `accountName`: `string` - The account name to query (e.g.,
  `'k:accountPublicKey'`).
- `networkId`: `string` - The network ID.
- `fungible`: `string` - The fungible token name (e.g., `'coin'`).
- `chainIds?`: `ChainId[]` - Optional list of chain IDs to query.

**Returns:**

- `Promise<IAccountDetails[]>`: A promise that resolves to an array of account
  details for each chain.

**Example:**

```typescript
const accountDetails = await walletSdk.getAccountDetails(
  'k:accountPublicKey',
  'testnet04',
  'coin',
);

accountDetails.forEach((detail) => {
  if (detail.accountDetails) {
    console.log(
      `Chain ${detail.chainId} balance:`,
      detail.accountDetails.balance,
    );
  } else {
    console.log(`Chain ${detail.chainId} has no account details.`);
  }
});
```

---

## Miscellaneous Functions

### `getChains`

Retrieves the list of chains available on a network.

**Method Signature:**

```typescript
getChains(networkHost: string): Promise<IChain[]>;
```

**Parameters:**

- `networkHost`: `string` - The network host URL (e.g.,
  `'https://api.testnet.chainweb.com'`).

**Returns:**

- `Promise<IChain[]>`: A promise that resolves to an array of chain objects,
  each with an `id` property.

**Example:**

```typescript
const chains = await walletSdk.getChains('https://api.testnet.chainweb.com');

chains.forEach((chain) => {
  console.log('Available chain ID:', chain.id);
});
```

### `getNetworkInfo`

Retrieves network information. _(Note: Currently returns `null` as this method
is a placeholder for future implementation.)_

**Method Signature:**

```typescript
getNetworkInfo(networkHost: string): Promise<unknown>;
```

**Parameters:**

- `networkHost`: `string` - The network host URL.

**Returns:**

- `Promise<unknown>`: A promise that resolves to network information.

**Example:**

```typescript
const networkInfo = await walletSdk.getNetworkInfo(
  'https://api.testnet.chainweb.com',
);

console.log('Network Info:', networkInfo);
```

### `getGasLimitEstimate`

Estimates the gas limit required for a transaction.

**Method Signature:**

```typescript
getGasLimitEstimate(
  transaction: ICommand,
  networkId: string,
  chainId: ChainId,
): Promise<number>;
```

**Parameters:**

- `transaction`: `ICommand` - The unsigned or signed transaction command to
  estimate gas for.
- `networkId`: `string` - The network ID.
- `chainId`: `ChainId` - The chain ID where the transaction will be executed.

**Returns:**

- `Promise<number>`: A promise that resolves to the estimated gas limit.

**Example:**

```typescript
const gasLimit = await walletSdk.getGasLimitEstimate(
  unsignedTransaction,
  'testnet04',
  '1',
);

console.log('Estimated Gas Limit:', gasLimit);
```

---

## Extras

### Exchange Helper

Provides functionality to retrieve token information from the ETHVM Dev API.

#### `getEthvmDevTokenInfo`

Fetches token information such as current price, supply, and 24-hour high/low
values.

**Method Signature:**

```typescript
getEthvmDevTokenInfo<T extends string>(
  tokens?: T[],
): Promise<Record<T, IEthvmDevTokenInfo | undefined>>;
```

**Parameters:**

- `tokens?`: `T[]` - An array of token names as strings (default is
  `['kadena']`).

**Returns:**

- `Promise<Record<T, IEthvmDevTokenInfo | undefined>>`: A promise that resolves
  to a record mapping token names to their information.

**Example:**

```typescript
const tokenInfo = await walletSdk.exchange.getEthvmDevTokenInfo(['kadena']);

console.log('Kadena Token Info:', tokenInfo.kadena);
```

### Kadena Names Service

Provides functions to resolve Kadena names to addresses and vice versa.

#### `nameToAddress`

Resolves a Kadena name (e.g., a human-readable name) to a Kadena address.

**Method Signature:**

```typescript
nameToAddress(name: string, networkId: string): Promise<string | null>;
```

**Parameters:**

- `name`: `string` - The Kadena name to resolve (e.g., `'example.kda'`).
- `networkId`: `string` - The network ID.

**Returns:**

- `Promise<string | null>`: A promise that resolves to the address or `null` if
  not found.

**Example:**

```typescript
const address = await walletSdk.kadenaNames.nameToAddress(
  'example.kda',
  'testnet04',
);

if (address) {
  console.log('Resolved address:', address);
} else {
  console.log('No address found for the given name.');
}
```

#### `addressToName`

Resolves a Kadena address to a Kadena name.

**Method Signature:**

```typescript
addressToName(address: string, networkId: string): Promise<string | null>;
```

**Parameters:**

- `address`: `string` - The Kadena address to resolve (e.g.,
  `'k:accountPublicKey'`).
- `networkId`: `string` - The network ID.

**Returns:**

- `Promise<string | null>`: A promise that resolves to the name or `null` if not
  found.

**Example:**

```typescript
const name = await walletSdk.kadenaNames.addressToName(
  'k:accountPublicKey',
  'testnet04',
);

if (name) {
  console.log('Resolved name:', name);
} else {
  console.log('No name found for the given address.');
}
```

---

## Conclusion

The Kadena Wallet SDK offers a comprehensive set of tools to integrate Kadena
blockchain functionalities into your wallet applications easily. Designed with
developers in mind, it ensures that even those with intermediate experience can
build robust wallets without delving into the complexities of blockchain
interactions.

By providing clear methods with well-defined parameters, the SDK simplifies
tasks such as transaction creation, account querying, and handling cross-chain
transfers. With the Kadena Wallet SDK, building wallets on Kadena is as clear as
day.

For more information and advanced usage, please refer to the SDK documentation
and explore the various classes and methods provided.

---

## Additional Resources

- [Kadena Official Website](https://kadena.io/)
- [Kadena Documentation](https://docs.kadena.io/)
- [Kadena GitHub Repository](https://github.com/kadena-io/)

---

# @kadena/hd-wallet

Important Note on Key Generation and Signing While the @kadena/wallet-sdk
provides a comprehensive set of tools for building wallet applications and
interacting with the Kadena blockchain, we have intentionally excluded key
generation and signing functionalities from this SDK. This deliberate design
choice is made to enhance security and flexibility, allowing developers to
implement key management and signing according to their specific needs and best
practices.

For this reason, we have added detailed documentation on generating keys and
signing transactions using the @kadena/hd-wallet package. This separate module
focuses on key derivation based on Hierarchical Deterministic (HD) wallets and
BIP32 standards for Kadena. It provides all the necessary functions to securely
generate mnemonic phrases, derive seeds, create key pairs, and sign
transactions.

We encourage you to refer to the Key Generation and Signing section in this
documentation to integrate secure key handling in your wallet applications
effectively.

# Kadena HD Wallet Key Generation and Signing Documentation

## Introduction

Welcome to the Kadena HD Wallet key generation and signing guide! This
documentation is designed to help you understand how to generate keys and sign
transactions using Kadena’s HD wallet system. Whether you’re a developer looking
to integrate Kadena into your wallet or a user looking to understand how
Kadena’s key management works, this guide will walk you through every step of
the process.

## Overview

Kadena’s wallet SDK provides a robust set of functions to handle various
blockchain-related tasks, but for security reasons, it leaves key generation and
signing outside the core functionality. The goal of this guide is to explain how
to generate and manage keys using an external HD wallet system and incorporate
these keys into your wallet application.

## Key Concepts

- **Mnemonic Phrase**: A human-readable set of words used to generate a seed.
- **Seed**: A binary representation of the mnemonic, which can be used to derive
  private and public keys.
- **Derivation Path**: A structured way to derive multiple key pairs from a
  single master seed.
- **SLIP-0010**: The standard used for key derivation, ensuring compatibility
  with other systems.

## High-Level Steps

1. **Generate a Mnemonic Phrase**
2. **Convert Mnemonic to Seed**
3. **Generate Key Pairs from Seed**
4. **Sign Transactions with Keys**

## Key Generation and Management

### 1. Generating a Mnemonic Phrase

A mnemonic phrase is the starting point for creating your wallet. It is a
sequence of words that encodes the seed for generating keys. You can generate a
12-word mnemonic phrase using the following function:

```javascript
import { kadenaGenMnemonic } from '@kadena/hd-wallet';

const mnemonic = kadenaGenMnemonic();
console.log(mnemonic); // Outputs a 12-word mnemonic phrase
```

### 2. Convert Entropy to Mnemonic

You can also generate a mnemonic phrase from a specific entropy value using the
following function:

```javascript
import { kadenaEntropyToMnemonic } from '@kadena/hd-wallet';

const entropy = Uint8Array.from([0x00, 0x01, 0x02, 0x03]);
const mnemonic = kadenaEntropyToMnemonic(entropy);
console.log(mnemonic); // Outputs a mnemonic based on the provided entropy
```

### 3. Mnemonic to Seed Conversion

Once a mnemonic is generated, you can convert it into a seed. The seed can then
be used to derive keys. This example shows how to encrypt the seed with a
password.

```javascript
import { kadenaMnemonicToSeed } from '@kadena/hd-wallet';

const mnemonic = 'your_mnemonic_here';
const password = 'your_password';

const seed = await kadenaMnemonicToSeed(password, mnemonic);
console.log(seed); // Outputs the encrypted seed
```

### 4. Key Pair Generation from Seed

The `kadenaGenKeypairFromSeed` function generates a public-private key pair from
a seed. You can specify an index or range of indices to generate multiple key
pairs.

```javascript
import { kadenaGenKeypairFromSeed } from '@kadena/hd-wallet';

const password = 'your_password';
const [publicKey, privateKey] = await kadenaGenKeypairFromSeed(
  password,
  seed,
  0,
);

console.log(publicKey, privateKey); // Outputs the generated key pair
```

You can also generate a range of key pairs:

```javascript
const keyPairs = await kadenaGenKeypairFromSeed(password, seed, [0, 3]);
console.log(keyPairs); // Outputs an array of key pairs
```

### 5. Generate Random Key Pairs

In some cases, you may want to generate key pairs randomly without deriving them
from a seed. Use the `kadenaKeyPairsFromRandom` function to generate a specified
number of random key pairs:

```javascript
import { kadenaKeyPairsFromRandom } from '@kadena/hd-wallet';

const keyPairs = kadenaKeyPairsFromRandom(2); // Generates two random key pairs
console.log(keyPairs); // Outputs an array of random key pairs
```

### 6. Public Key Retrieval

You can retrieve the public key directly from the encrypted seed without needing
to access the private key. This is useful for read-only operations.

```javascript
import { kadenaGetPublic } from '@kadena/hd-wallet';

const publicKey = await kadenaGetPublic(password, seed, 0);
console.log(publicKey); // Outputs the public key for the specified index
```

### 7. Signing Transactions

To sign a transaction, you can either use a key pair or the encrypted seed with
an index. The following example demonstrates signing a transaction with a key
pair.

```javascript
import { kadenaSignWithKeyPair } from '@kadena/hd-wallet';

const signature = await kadenaSignWithKeyPair(
  password,
  publicKey,
  privateKey,
)(txHash);
console.log(signature); // Outputs the transaction signature
```

Alternatively, you can sign using a seed and index:

```javascript
import { kadenaSignWithSeed } from '@kadena/hd-wallet';

const signature = await kadenaSignWithSeed(password, seed, 0)(txHash);
console.log(signature); // Outputs the transaction signature
```

### 8. Verifying Signatures

After signing a transaction, you may need to verify its signature. The
`kadenaVerify` function allows you to verify that a given signature matches the
public key and message.

```javascript
import { kadenaVerify } from '@kadena/hd-wallet';

const isValid = kadenaVerify(txHash, publicKey, signature.sig);
console.log(isValid); // Outputs true if the signature is valid
```

## Legacy Chainweaver Support

For backward compatibility with the legacy Chainweaver wallet, use the following
functions. These functions allow integration with older systems while
maintaining compatibility with the new Kadena SDK.

### Mnemonic Generation (Legacy)

The `kadenaGenMnemonic` function from the legacy Chainweaver wallet generates a
mnemonic phrase, which is similar to modern HD wallets but follows older
practices.

```javascript
import { kadenaGenMnemonic } from '@kadena/hd-wallet/chainweaver';

const mnemonic = kadenaGenMnemonic();
console.log(mnemonic); // Outputs a 12-word mnemonic phrase
```

### Mnemonic Validation (Legacy)

To validate a mnemonic, use the `kadenaCheckMnemonic` function to ensure the
mnemonic is correct before proceeding with key generation.

```javascript
import { kadenaCheckMnemonic } from '@kadena/hd-wallet/chainweaver';

const isValid = kadenaCheckMnemonic(mnemonic);
console.log(isValid); // Outputs true if the mnemonic is valid
```

### Key Pair Generation (Legacy)

The legacy function `kadenaGenKeypair` allows generating a key pair using a seed
phrase. This method follows the older Chainweaver key derivation process.

```javascript
import { kadenaGenKeypair } from '@kadena/hd-wallet/chainweaver';

const [publicKey, privateKey] = await kadenaGenKeypair(seed, password, 0);
console.log(publicKey, privateKey); // Outputs the key pair generated using Chainweaver's method
```

### Password Change for Seed (Legacy)

If you need to change the password used to encrypt a seed in the legacy system,
the `kadenaChangePassword` function handles the re-encryption.

```javascript
import { kadenaChangePassword } from '@kadena/hd-wallet/chainweaver';

const newSeed = await kadenaChangePassword(oldPassword, newPassword, seed);
console.log(newSeed); // Outputs the seed encrypted with the new password
```

### Signing with a Key Pair (Legacy)

To sign a transaction with a key pair in the legacy Chainweaver wallet, use the
`kadenaSign` function.

```javascript
import { kadenaSign } from '@kadena/hd-wallet/chainweaver';

const signature = await kadenaSign(publicKey, privateKey, txHash);
console.log(signature); // Outputs the transaction signature using the legacy key pair
```

### Public Key Retrieval from Root Key (Legacy)

To retrieve the public key from the root key, use the
`kadenaGetPublicFromRootKey` function. This function derives the public key from
the legacy Chainweaver’s root key.

```javascript
import { kadenaGetPublicFromRootKey } from '@kadena/hd-wallet/chainweaver';

const publicKey = await kadenaGetPublicFromRootKey(password, seed, index);
console.log(publicKey); // Outputs the public key for the specified index using the root key
```

### Key Pair Generation from Root Key (Legacy)

If you need to generate a key pair from the root key in the legacy system, use
the `kadenaMnemonicToRootKeypair` function.

```javascript
import { kadenaMnemonicToRootKeypair } from '@kadena/hd-wallet/chainweaver';

const [publicKey, privateKey] = await kadenaMnemonicToRootKeypair(
  mnemonic,
  password,
  index,
);
console.log(publicKey, privateKey); // Outputs the key pair derived from the root key in the legacy system
```

### Signing from Root Key (Legacy)

To sign a transaction using a root key, the `kadenaSignFromRootKey` function can
be used to derive the signature from the root key.

```javascript
import { kadenaSignFromRootKey } from '@kadena/hd-wallet/chainweaver';

const signature = await kadenaSignFromRootKey(password, seed, index, txHash);
console.log(signature); // Outputs the transaction signature using the root key
```

## Integration Guide for Developers

### How to Use in Your Wallet Application

If you’re building a wallet application, you can integrate these key generation
and signing functionalities directly. Here’s a simple flow for implementation:

1. **Generate a mnemonic phrase** and store it securely (e.g., show the user
   their backup phrase).
2. **Convert the mnemonic to a seed** and encrypt it with a password before
   storing.
3. **Generate key pairs as needed** using indices (e.g., index 0 for the primary
   account, index 1 for a secondary account).
4. **Sign transactions** with the private key or directly with the seed.
5. **Retrieve public keys** when you need to display addresses or verify
   signatures.

### Key Derivation Path

The Kadena wallet uses the standard derivation path:

```
m'/44'/626'/<index>'
```

<!-- genericHeader end -->

### Architectural decisions

Check [ADRs][1] documents for more information

# Getting started

## Installation

To install the library, you can use npm or yarn:

```sh
npm install @kadena/wallet-sdk
```

or

```sh
yarn add @kadena/wallet-sdk
```

[1]: ./docs/decisions/
