# Migration Guide: @kadena/client v0.x to v1.0.0

This guide will help you migrate from @kadena/client v0.x to v1.0.0. The new version introduces several breaking changes that improve type safety, flexibility, and developer experience.

## Table of Contents

- [Overview of Changes](#overview-of-changes)
- [Breaking Changes](#breaking-changes)
- [Step-by-Step Migration](#step-by-step-migration)
  - [Transaction Building](#transaction-building)
  - [Client Creation](#client-creation)
  - [Signing](#signing)
  - [Sending Transactions](#sending-transactions)
  - [Reading from Blockchain](#reading-from-blockchain)
- [New Features](#new-features)
- [Migration Examples](#migration-examples)
- [Common Pitfalls](#common-pitfalls)
- [Getting Help](#getting-help)

## Overview of Changes

The major architectural changes in v1.0.0:

1. **Separation of Concerns**: Expression generation is now separate from transaction building
2. **Standalone Client**: Client is no longer part of the transaction object
3. **Immutable Signing**: Signing operations work on plain JavaScript objects
4. **Builder Pattern**: Improved builder pattern with better type inference
5. **Multiple Expressions**: Support for multiple Pact expressions per transaction
6. **Network Flexibility**: Better support for multi-chain and multi-network scenarios

## Breaking Changes

### 1. Transaction Builder API

**Old (v0.x)**:
```ts
const transaction = Pact.modules.coin
  .transfer(sender, receiver, amount)
  .addCap('coin.GAS', senderPublicKey)
  .addCap('coin.TRANSFER', senderPublicKey, sender, receiver, amount)
  .setMeta({ senderAccount: sender }, 'testnet04');
```

**New (v1.0.0)**:
```ts
const transaction = Pact.builder
  .execution(
    Pact.modules.coin.transfer(sender, receiver, amount)
  )
  .addSigner(senderPublicKey, (withCapability) => [
    withCapability('coin.GAS'),
    withCapability('coin.TRANSFER', sender, receiver, amount)
  ])
  .setMeta({ chainId: '1', senderAccount: sender })
  .setNetworkId('testnet05')
  .createTransaction();
```

### 2. Client API

**Old (v0.x)**:
```ts
// Client was part of the transaction
const res = await transaction.local('http://host.com/chain/0/pact');
await transaction.send('http://host.com/chain/0/pact');
```

**New (v1.0.0)**:
```ts
// Client is separate and reusable
const client = createClient('http://host.com/chain/0/pact');
const res = await client.dirtyRead(transaction);
await client.submit(transaction);
```

### 3. Signing API

**Old (v0.x)**:
```ts
const signedTxs = await signWithChainweaver(transaction);
// Returns array of signed transactions
signedTxs.map(tx => tx.send(apiHost));
```

**New (v1.0.0)**:
```ts
const signedTx = await signWithChainweaver(transaction);
// Returns single signed transaction
await client.submit(signedTx);
```

### 4. Polling API

**Old (v0.x)**:
```ts
async function pollMain(...requestKeys: string[]): Promise<void> {
  // Custom polling implementation required
}
```

**New (v1.0.0)**:
```ts
// Built-in polling with options
const result = await client.pollStatus(descriptor, {
  timeout: 180000,
  interval: 5000,
  onPoll: (res) => console.log('Polling...', res)
});
```

### 5. Network Configuration

**Old (v0.x)**:
```ts
.setMeta({ senderAccount: sender }, 'testnet04')
```

**New (v1.0.0)**:
```ts
.setMeta({ chainId: '1', senderAccount: sender })
.setNetworkId('testnet05')
```

Note: Testnet has been updated from `testnet04` to `testnet05`.

## Step-by-Step Migration

### Transaction Building

#### Old Pattern (v0.x)

```ts
const transaction = Pact.modules.coin
  .transfer('k:sender', 'k:receiver', { decimal: '10.0' })
  .addCap('coin.GAS', senderPublicKey)
  .addCap('coin.TRANSFER', senderPublicKey, 'k:sender', 'k:receiver', { decimal: '10.0' })
  .setMeta({ senderAccount: 'k:sender' }, 'testnet04');
```

#### New Pattern (v1.0.0)

```ts
const transaction = Pact.builder
  .execution(
    Pact.modules.coin.transfer('k:sender', 'k:receiver', { decimal: '10.0' })
  )
  .addSigner(senderPublicKey, (withCapability) => [
    withCapability('coin.GAS'),
    withCapability('coin.TRANSFER', 'k:sender', 'k:receiver', { decimal: '10.0' })
  ])
  .setMeta({ chainId: '1', senderAccount: 'k:sender' })
  .setNetworkId('testnet05')
  .createTransaction();
```

**Key Changes**:
- Use `Pact.builder.execution()` to wrap contract calls
- Replace `.addCap()` with `.addSigner()` using capability callbacks
- Split network configuration: `chainId` in `setMeta()`, `networkId` in `setNetworkId()`
- Call `.createTransaction()` to finalize

### Client Creation

#### Old Pattern (v0.x)

```ts
// No separate client; each transaction had its own methods
await transaction.send('http://api.example.com/pact');
await transaction.local('http://api.example.com/pact');
```

#### New Pattern (v1.0.0)

```ts
// Create reusable client
const client = createClient('http://api.example.com/pact');

// Or with dynamic URL generation
const client = createClient(({ networkId, chainId }) =>
  `https://api.chainweb.com/chainweb/0.0/${networkId}/chain/${chainId}/pact`
);

// Use client methods
await client.submit(signedTransaction);
await client.dirtyRead(transaction);
```

**Key Changes**:
- Create client once and reuse it
- Client is separate from transactions
- Support for dynamic URL generation based on networkId and chainId

### Signing

#### Old Pattern (v0.x)

```ts
const signedTxs = await signWithChainweaver(transaction);
// Returns array of signed transactions

const sendRequests = signedTxs.map(tx => tx.send(apiHost));
const sendResponses = await Promise.all(sendRequests);
```

#### New Pattern (v1.0.0)

```ts
const signedTx = await signWithChainweaver(transaction);
// Returns single signed transaction

// Validate signatures
if (isSignedTransaction(signedTx)) {
  const descriptor = await client.submit(signedTx);
}
```

**Key Changes**:
- Signing now returns a single transaction (not an array)
- Use `isSignedTransaction()` to validate before submission
- Signing is now a pure function that doesn't modify the original transaction

### Sending Transactions

#### Old Pattern (v0.x)

```ts
async function transfer(sender: string, receiver: string, amount: IPactDecimal) {
  const unsignedTransaction = Pact.modules.coin
    .transfer(sender, receiver, amount)
    .addCap('coin.GAS', senderPublicKey)
    .addCap('coin.TRANSFER', senderPublicKey, sender, receiver, amount)
    .setMeta({ senderAccount: sender }, 'testnet04');

  const signedTxs = await signWithChainweaver(unsignedTransaction);

  const sendRequests = signedTxs.map(tx => {
    console.log('sending transaction', tx.code);
    return tx.send(apiHost);
  });

  const sendResponses = await Promise.all(sendRequests);
  const requestKey = (await sendRequests[0]).requestKeys[0];

  await pollMain(requestKey);
  console.log(`Transaction '${requestKey}' finished`);
}

async function pollMain(...requestKeys: string[]): Promise<void> {
  // Custom polling implementation
}
```

#### New Pattern (v1.0.0)

```ts
async function transfer(
  sender: string,
  senderPublicKey: string,
  receiver: string,
  amount: IPactDecimal
) {
  // 1. Build transaction
  const transaction = Pact.builder
    .execution(Pact.modules.coin.transfer(sender, receiver, amount))
    .addSigner(senderPublicKey, (withCapability) => [
      withCapability('coin.GAS'),
      withCapability('coin.TRANSFER', sender, receiver, amount)
    ])
    .setMeta({ chainId: '0', senderAccount: sender })
    .setNetworkId('testnet05')
    .createTransaction();

  // 2. Sign transaction
  const signedTx = await signWithChainweaver(transaction);

  // 3. Create client
  const client = createClient(apiHostGenerator);

  // 4. Validate and submit
  if (isSignedTransaction(signedTx)) {
    const descriptor = await client.submit(signedTx);

    // 5. Poll for result (built-in)
    const response = await client.listen(descriptor);

    if (response.result.status === 'failure') {
      throw response.result.error;
    } else {
      console.log('Success:', response.result);
    }
  }
}
```

**Key Changes**:
- Client is created separately and reused
- Built-in `listen()` or `pollStatus()` methods replace custom polling
- Better error handling with typed responses
- Clearer separation of build, sign, submit, and poll steps

### Reading from Blockchain

#### Old Pattern (v0.x)

```ts
async function getBalance(account: string): Promise<void> {
  const res = await Pact.modules.coin['get-balance'](account)
    .local('http://host.com/chain/0/pact');
  console.log(res);
}
```

#### New Pattern (v1.0.0)

```ts
async function getBalance(account: string): Promise<void> {
  // Build transaction
  const transaction = Pact.builder
    .execution(Pact.modules.coin['get-balance'](account))
    .setMeta({ chainId: '1' })
    .setNetworkId('testnet05')
    .createTransaction();

  // Create client
  const client = createClient('http://host.com/chain/0/pact');

  // Execute locally (no gas required)
  const res = await client.dirtyRead(transaction);

  console.log(res);
}
```

**Key Changes**:
- Use `Pact.builder.execution()` to wrap the contract call
- Create a client instance
- Use `dirtyRead()` for fast, non-validated reads
- Or use `local()` with options for validated reads

## New Features

### 1. Multiple Expressions Per Transaction

v1.0.0 supports multiple Pact expressions in a single transaction:

```ts
const transaction = Pact.builder
  .execution(
    Pact.modules.coin.transfer('sender', 'receiver1', { decimal: '10' }),
    Pact.modules.coin.transfer('sender', 'receiver2', { decimal: '5' })
  )
  .addSigner(senderPublicKey, (withCapability) => [
    withCapability('coin.GAS'),
    withCapability('coin.TRANSFER', 'sender', 'receiver1', { decimal: '10' }),
    withCapability('coin.TRANSFER', 'sender', 'receiver2', { decimal: '5' })
  ])
  .setMeta({ chainId: '1', senderAccount: 'sender' })
  .setNetworkId('testnet05')
  .createTransaction();
```

### 2. Functional Programming Approach

Import functional utilities for advanced composition:

```ts
import { composePactCommand, execution, addSigner } from '@kadena/client/fp';

const buildTransfer = composePactCommand(
  execution(Pact.modules.coin.transfer('sender', 'receiver', { decimal: '10' })),
  addSigner(publicKey, (withCapability) => [
    withCapability('coin.GAS')
  ])
);
```

### 3. Transaction Descriptors

All submissions now return transaction descriptors:

```ts
interface ITransactionDescriptor {
  requestKey: string;
  chainId: ChainId;
  networkId: string;
}

const descriptor = await client.submit(signedTx);
// Use descriptor to poll, listen, or create SPV proofs
```

### 4. Better Type Inference

The new builder pattern provides better TypeScript type inference:

```ts
// TypeScript knows the exact shape of capabilities
.addSigner(publicKey, (withCapability) => [
  // Auto-complete and type checking for capability names and arguments
  withCapability('coin.TRANSFER', 'sender', 'receiver', { decimal: '10' })
])
```

### 5. Flexible Client Configuration

```ts
// Static URL
const client = createClient('http://api.example.com/pact');

// Dynamic URL generator
const client = createClient(({ networkId, chainId, type }) => {
  // type can be 'local' | 'send' | 'poll' | 'listen' | 'spv'
  return `http://api.example.com/${networkId}/chain/${chainId}/pact`;
});

// With confirmation depth
const client = createClient(url, { confirmationDepth: 3 });
```

### 6. Built-in Polling Options

```ts
const result = await client.pollStatus(descriptor, {
  timeout: 180000,        // Maximum time to poll
  interval: 5000,         // Time between polls
  confirmationDepth: 3,   // Wait for confirmations
  onPoll: (result) => {   // Callback on each poll
    console.log('Current status:', result);
  }
});
```

## Migration Examples

### Example 1: Complete Transfer Migration

**Old (v0.x)**:

```ts
async function transferKDA(
  sender: string,
  senderPublicKey: string,
  receiver: string,
  amount: IPactDecimal
): Promise<void> {
  const unsignedTransaction = Pact.modules.coin
    .transfer(sender, receiver, amount)
    .addCap('coin.GAS', senderPublicKey)
    .addCap('coin.TRANSFER', senderPublicKey, sender, receiver, amount)
    .setMeta({ senderAccount: sender }, 'testnet04');

  const res = await signWithChainweaver(unsignedTransaction);

  const sendRequests = res.map((tx) => {
    console.log('sending transaction', tx.code);
    return tx.send(testnetChain1ApiHost);
  });

  const sendResponses = await Promise.all(sendRequests);
  const requestKey = (await sendRequests[0]).requestKeys[0];

  await pollMain(requestKey);
  console.log(`Transaction '${requestKey}' finished`);
}
```

**New (v1.0.0)**:

```ts
async function transferKDA(
  sender: string,
  senderPublicKey: string,
  receiver: string,
  amount: IPactDecimal
): Promise<void> {
  // Build transaction
  const transaction = Pact.builder
    .execution(Pact.modules.coin.transfer(sender, receiver, amount))
    .addSigner(senderPublicKey, (withCapability) => [
      withCapability('coin.GAS'),
      withCapability('coin.TRANSFER', sender, receiver, amount)
    ])
    .setMeta({ chainId: '0', senderAccount: sender })
    .setNetworkId('testnet05')
    .createTransaction();

  // Sign transaction
  const signedTx = await signWithChainweaver(transaction);

  // Create client
  const client = createClient(
    'https://api.testnet.chainweb.com/chainweb/0.0/testnet05/chain/0/pact'
  );

  // Submit and listen
  if (isSignedTransaction(signedTx)) {
    const descriptor = await client.submit(signedTx);
    console.log('Transaction submitted:', descriptor.requestKey);

    const response = await client.listen(descriptor);

    if (response.result.status === 'failure') {
      throw response.result.error;
    } else {
      console.log('Transaction finished:', descriptor.requestKey);
      console.log('Result:', response.result.data);
    }
  }
}
```

### Example 2: Read Balance Migration

**Old (v0.x)**:

```ts
async function getBalance(account: string): Promise<void> {
  const res = await Pact.modules.coin['get-balance'](account)
    .local('http://host.com/chain/0/pact');
  console.log(res);
}

const myAccount = 'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94';
getBalance(myAccount).catch(console.error);
```

**New (v1.0.0)**:

```ts
async function getBalance(account: string): Promise<string> {
  // Build transaction
  const transaction = Pact.builder
    .execution(Pact.modules.coin['get-balance'](account))
    .setMeta({ chainId: '1' })
    .setNetworkId('testnet05')
    .createTransaction();

  // Create client (can be reused)
  const client = createClient(
    'https://api.testnet.chainweb.com/chainweb/0.0/testnet05/chain/1/pact'
  );

  // Execute locally
  const res = await client.dirtyRead(transaction);

  if (res.result.status === 'success') {
    console.log('Balance:', res.result.data);
    return res.result.data as string;
  } else {
    throw new Error(`Failed to get balance: ${res.result.error.message}`);
  }
}

const myAccount = 'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94';
getBalance(myAccount).catch(console.error);
```

### Example 3: Multi-Chain Client Migration

**Old (v0.x)**:

```ts
// Had to construct URLs manually for each call
const chain0Url = 'http://host.com/chain/0/pact';
const chain1Url = 'http://host.com/chain/1/pact';

await tx1.send(chain0Url);
await tx2.send(chain1Url);
```

**New (v1.0.0)**:

```ts
// Client automatically routes to correct chain based on transaction
const client = createClient(({ networkId, chainId }) =>
  `http://host.com/chainweb/0.0/${networkId}/chain/${chainId}/pact`
);

// Transactions specify their chain
const tx1 = Pact.builder
  .execution(/* ... */)
  .setMeta({ chainId: '0' })
  .setNetworkId('testnet05')
  .createTransaction();

const tx2 = Pact.builder
  .execution(/* ... */)
  .setMeta({ chainId: '1' })
  .setNetworkId('testnet05')
  .createTransaction();

// Client routes automatically
await client.submit(signedTx1); // Goes to chain 0
await client.submit(signedTx2); // Goes to chain 1
```

## Common Pitfalls

### 1. Forgetting to Call `.createTransaction()`

**Wrong**:
```ts
const transaction = Pact.builder
  .execution(/* ... */)
  .setMeta({ chainId: '1' })
  .setNetworkId('testnet05');
// Missing .createTransaction()!
```

**Correct**:
```ts
const transaction = Pact.builder
  .execution(/* ... */)
  .setMeta({ chainId: '1' })
  .setNetworkId('testnet05')
  .createTransaction(); // Don't forget this!
```

### 2. Using Old Network Names

**Wrong**:
```ts
.setNetworkId('testnet04') // Old testnet
```

**Correct**:
```ts
.setNetworkId('testnet05') // Current testnet
```

### 3. Mixing Old and New API Patterns

**Wrong**:
```ts
const transaction = Pact.modules.coin.transfer(/* ... */)
  .addSigner(/* ... */) // New API
  .setMeta({ senderAccount: sender }, 'testnet04'); // Old API
```

**Correct**:
```ts
const transaction = Pact.builder
  .execution(Pact.modules.coin.transfer(/* ... */))
  .addSigner(/* ... */)
  .setMeta({ chainId: '1', senderAccount: sender })
  .setNetworkId('testnet05')
  .createTransaction();
```

### 4. Not Validating Signatures

**Risky**:
```ts
const signedTx = await signWithChainweaver(transaction);
await client.submit(signedTx); // May fail if not fully signed
```

**Better**:
```ts
const signedTx = await signWithChainweaver(transaction);

if (isSignedTransaction(signedTx)) {
  await client.submit(signedTx);
} else {
  throw new Error('Transaction not fully signed');
}
```

### 5. Recreating Client for Each Request

**Inefficient**:
```ts
async function transfer() {
  const client = createClient(url); // Don't do this in a loop!
  await client.submit(tx);
}
```

**Better**:
```ts
// Create client once
const client = createClient(url);

async function transfer() {
  await client.submit(tx);
}
```

### 6. Wrong Capability Callback Pattern

**Wrong**:
```ts
.addSigner(publicKey, [
  'coin.GAS',
  'coin.TRANSFER'
]) // This won't work!
```

**Correct**:
```ts
.addSigner(publicKey, (withCapability) => [
  withCapability('coin.GAS'),
  withCapability('coin.TRANSFER', sender, receiver, amount)
])
```

## Getting Help

If you encounter issues during migration:

1. **Review the examples** in this guide
2. **Check the README** for detailed API documentation
3. **Look at example code** in the [client-examples](https://github.com/kadena-community/kadena.js/tree/main/packages/libs/client-examples) package
4. **Search GitHub Issues** for similar problems: https://github.com/kadena-community/kadena.js/issues
5. **Ask on Discord** in the #kadena-js channel: https://discord.com/channels/502858632178958377/1001088816859336724
6. **Consult the API Reference**: [client.api.md](https://github.com/kadena-community/kadena.js/tree/main/packages/libs/client/etc/client.api.md)

## Quick Reference

| Feature | v0.x | v1.0.0 |
|---------|------|--------|
| Build Transaction | `Pact.modules.coin.transfer()` | `Pact.builder.execution(Pact.modules.coin.transfer())` |
| Add Capabilities | `.addCap('coin.GAS', pubKey)` | `.addSigner(pubKey, (withCapability) => [withCapability('coin.GAS')])` |
| Set Network | `.setMeta({...}, 'testnet04')` | `.setMeta({chainId: '1'}).setNetworkId('testnet05')` |
| Finalize | Implicit | `.createTransaction()` |
| Client | Part of transaction | `createClient(url)` |
| Submit | `tx.send(url)` | `client.submit(tx)` |
| Read | `tx.local(url)` | `client.dirtyRead(tx)` or `client.local(tx)` |
| Poll | Custom implementation | `client.pollStatus(descriptor, options)` |
| Listen | Custom implementation | `client.listen(descriptor)` |
| Signing | Returns array | Returns single transaction |

---

**Need more help?** Feel free to reach out to the community or review the updated documentation!
