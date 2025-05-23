# @kadena/wallet-sdk

# Kadena Wallet SDK Documentation

The Kadena Wallet SDK provides a simple and unified interface to integrate
Kadena blockchain functionalities into your wallet applications. It abstracts
the complexities of interacting with the Kadena network, allowing you to focus
on building feature-rich wallet experiences without re-implementing common
integrations.

**Important Note on Key Generation and Signing**

For key generation and signing functionalities, you will need the Kadena HD
Wallet package. Please refer to the
[Kadena HD Wallet documentation](https://github.com/kadena-community/kadena.js/tree/main/packages/libs/hd-wallet)
for detailed instructions on how to generate keys and sign transactions
securely.

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

console.log(
  'Transaction sent with request key:',
  transactionDescriptor.requestKey,
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

console.log(
  'Transaction sent with request key:',
  transactionDescriptor.requestKey,
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

console.log(
  'Cross-chain transaction sent with request key:',
  transactionDescriptor.requestKey,
);
```

#### `createFinishCrossChainTransfer`

Creates the finishing step for a cross-chain transfer. This step is necessary to
complete the transfer on the target chain.

**Method Signature:**

```typescript
createFinishCrossChainTransfer(
  transfer: ICreateCrossChainFinishInput,
  gasPayer: { account: string; publicKeys: ISigner[] },
): Promise<IUnsignedCommand>;
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
- `gasPayer`: An object containing:
  - `account`: `string` - The account that will pay for the gas fees.
  - `publicKeys`: `ISigner[]` - The public keys associated with the gas payer's
    account.

**Returns:**

- `Promise<IUnsignedCommand>`: An unsigned transaction command ready to be
  signed and sent.

**Example:**

```typescript
const unsignedTransaction = await walletSdk.createFinishCrossChainTransfer(
  {
    proof: 'spvProofString',
    requestKey: 'initialRequestKey',
    fromChainId: '0',
    toChainId: '1',
    networkId: 'testnet04',
    receiver: 'receiverAccount',
    // Optional receiver guard
    // receiverGuard: { keys: ['receiverPublicKey'], pred: 'keys-all' },
  },
  {
    account: 'gasPayerAccount',
    publicKeys: ['gasPayerPublicKey1', 'gasPayerPublicKey2'],
  },
);

// Sign the transaction
// const signedTransaction = signTransaction(unsignedTransaction);

// Send the signed transaction
const transactionDescriptor = await walletSdk.sendTransaction(
  signedTransaction,
  'testnet04',
  '1', // Target chain ID
);

console.log(
  'Finishing cross-chain transaction sent with request key:',
  transactionDescriptor.requestKey,
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
  chainId?: ChainId,
): Promise<Transfer[]>;
```

**Parameters:**

- `accountName`: `string` - The account name to query (e.g.,
  `'k:accountPublicKey'`).
- `networkId`: `string` - The network ID.
- `fungible?`: `string` - Optional fungible token name (defaults to `'coin'`).
- `chainId?`: `ChainId` - Optional chain ID to filter transfers.

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
  accountName: string,
  transfers: ICrossChainTransfer[],
  callback: (transfer: ICrossChainTransfer) => void,
  options?: { signal?: AbortSignal },
): void;
```

**Parameters:**

- `accountName`: `string` - The account name associated with the transfers.
- `transfers`: `ICrossChainTransfer[]` - An array of cross-chain transfer
  objects to monitor.
- `callback`: `(transfer: ICrossChainTransfer) => void` - A function to call
  when a transfer completes.
- `options?`: `{ signal?: AbortSignal }` - Optional settings, including an
  `AbortSignal` to cancel the subscription.

**Example:**

```typescript
walletSdk.subscribeOnCrossChainComplete(
  'senderAccount',
  [crossChainTransfer1, crossChainTransfer2],
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
  options?: {
    signal?: AbortSignal;
    confirmationDepth?: number;
    timeoutSeconds?: number;
    intervalMs?: number;
  },
): void;
```

**Parameters:**

- `transactions`: `ITransactionDescriptor[]` - An array of transaction
  descriptors representing the transactions to monitor.
- `callback`:
  `(transaction: ITransactionDescriptor, result: ResponseResult) => void` - A
  function to call when a transaction status updates.
- `options?`:
  - `signal?: AbortSignal` - Optional signal to abort the subscription.
  - `confirmationDepth?: number` - Optional number of confirmations to wait for
    (default is `1`).
  - `timeoutSeconds?: number` - Optional timeout in seconds (default is `60` or
    based on `confirmationDepth`).
  - `intervalMs?: number` - Optional polling interval in milliseconds (default
    is `1000`).

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
  {
    confirmationDepth: 2,
    timeoutSeconds: 300,
    intervalMs: 2000,
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

Retrieves network information.

**Method Signature:**

```typescript
getNetworkInfo(networkHost: string): Promise<NodeNetworkInfo>;
```

**Parameters:**

- `networkHost`: `string` - The network host URL.

**Returns:**

- `Promise<NodeNetworkInfo>`: A promise that resolves to network information.

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

### **Introduction Text for Wallet SDK Documentation**

To explore the capabilities of the Kadena Wallet SDK in action, check out the
[Wallet SDK Example App](https://github.com/kadena-community/kadena.js/tree/main/packages/apps/wallet-sdk-example).
This example app demonstrates every function available in the SDK. It
highlights:

- **Usage Examples**: See how each function is implemented with real-time code
  execution.
- **Code Previews**: A code highlighter showcases the function being called, the
  code executed, and its response.
- **Interactive Learning**: Learn the SDK features step-by-step while seeing the
  immediate effects.

---

## Happy Coding!

With the Kadena Wallet SDK and Kadena HD Wallet, you're well-equipped to build
powerful and secure wallet applications on the Kadena blockchain. Dive into the
documentation, explore the features, and start building today!

---

## Additional Resources

- [Kadena Official Website](https://kadena.io/)
- [Kadena Documentation](https://docs.kadena.io/)
- [Kadena GitHub Repository](https://github.com/kadena-io/)

---
