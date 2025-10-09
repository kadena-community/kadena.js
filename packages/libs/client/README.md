<!-- genericHeader start -->

# @kadena/client

Core library for building Pact expressions to send to the blockchain in JavaScript and TypeScript.

<picture>
  <source srcset="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-white.png" media="(prefers-color-scheme: dark)"/>
  <img src="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-black.png" width="200" alt="kadena.js logo" />
</picture>

<!-- genericHeader end -->

[![npm version](https://img.shields.io/npm/v/@kadena/client.svg)](https://www.npmjs.com/package/@kadena/client)
[![API Reference](https://img.shields.io/badge/API-Reference-blue.svg)](https://github.com/kadena-community/kadena.js/tree/main/packages/libs/client/etc/client.api.md)

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Prerequisites](#prerequisites)
- [Contract-based Interaction](#contract-based-interaction-using-kadenaclient)
- [Building Transactions](#building-a-simple-transaction-from-the-contract)
- [Signing](#signing)
- [API Reference](#api-reference)
  - [Client Functions](#client-functions)
  - [Transaction Builder](#transaction-builder)
  - [Signing Functions](#signing-functions)
- [Error Handling](#error-handling)
- [Network Configuration](#network-configuration)
- [Troubleshooting](#troubleshooting)
- [Migration Guide](#migration-guide)
- [Examples](#examples)
- [Support](#support)

## Overview

`@kadena/client` allows JavaScript/TypeScript developers to easily interact with the Kadena blockchain. It provides:

- **Type-safe transaction building** with builder and functional patterns
- **Multiple signing methods** (WalletConnect, Chainweaver, keypair)
- **Comprehensive client API** for blockchain interactions
- **Contract code generation** from blockchain or local contracts
- **Error handling** and retry mechanisms
- **Network flexibility** across mainnet, testnet, and devnet

## Installation

```sh
npm install @kadena/client
```

For TypeScript projects with contract type generation:

```sh
npm install @kadena/client
npm install --save-dev @kadena/pactjs-cli typescript
```

## Quick Start

Here's a minimal example to get started:

```ts
import { Pact, createClient } from '@kadena/client';

// Create a client
const client = createClient(
  'https://api.testnet.chainweb.com/chainweb/0.0/testnet05/chain/1/pact'
);

// Read account balance
const transaction = Pact.builder
  .execution(Pact.modules.coin['get-balance']('k:your-public-key'))
  .setMeta({ chainId: '1' })
  .setNetworkId('testnet05')
  .createTransaction();

const result = await client.dirtyRead(transaction);
console.log('Balance:', result.result.data);
```

## Prerequisites

To use `@kadena/client`, Node.js v14 or higher is required. Let's install the bare minimum you need to get started:

```sh
mkdir my-dapp-with-kadena-client
cd my-dapp-with-kadena-client
npm init -y
npm install @kadena/client
npm install --save-dev @kadena/pactjs-cli typescript ts-node
npx tsc --init
```

## Contract-based interaction using @kadena/client

We wanted `@kadena/client` to be independent so this is a tool that can be used with arbitrary contracts. That is also why you have to _generate_ the interfaces used by `@kadena/client`. You can use smart contracts from the blockchain or your own local ones.

### Generate interfaces from the blockchain

Generate types directly from a contract on the blockchain:

```sh
# For mainnet
pactjs contract-generate --contract "coin" --api "https://api.chainweb.com/chainweb/0.0/mainnet01/chain/1/pact"

# For testnet
pactjs contract-generate --contract "coin" --api "https://api.testnet.chainweb.com/chainweb/0.0/testnet05/chain/1/pact"
```

The log shows what has happened. Inside the `node_modules` directory, a new package has been created: `.kadena/pactjs-generated`. This package is referenced by `@kadena/client` to give you type information.

**NOTE:** Make sure to add the new `types` to `compilerOptions` in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": [".kadena/pactjs-generated"]
  }
}
```

#### Generate interfaces locally

You can create your own smart contract or download it from the blockchain using `pactjs`.

Using the contract we'll now generate all the functions (`defun`) with their (typed) arguments and capabilities (`defcap`).

```sh
pactjs contract-generate --file "./contracts/coin.module.pact"
```

### Downloading contracts from the blockchain

Let's download the contracts you want to create TypeScript interfaces for:

```sh
mkdir contracts
npx pactjs retrieve-contract --out "./contracts/coin.module.pact" --module "coin" --network "testnet" --chain 1
```

There are several options to retrieve contracts from another network or chain. Use `--help` to get information on `retrieve-contract`:

```txt
> pactjs retrieve-contract --help

Usage: pactjs retrieve-contract [options]

Retrieve contract from a chainweb-api in a /local call.

Options:
  -m, --module <module>    The module you want to retrieve (e.g. "coin")
  -o, --out <file>         File to write the contract to
  --api <url>              API to retrieve from (e.g. "https://api.chainweb.com/chainweb/0.0/mainnet01/chain/8/pact")
  -n, --network <network>  Network to retrieve from (default "mainnet") (default: "mainnet")
  -c, --chain <number>     Chain to retrieve from (default 1) (default: 1)
  -h, --help               display help for command
```

## Building a simple transaction from the contract

Take a look at [the example-contract/simple-transfer.ts](https://github.com/kadena-community/kadena.js/blob/main/packages/libs/client-examples/src/example-contract/simple-transfer.ts) for a complete example.

Now that everything is bootstrapped, we can start building transactions.

Create a new file and name it `transfer.ts` (or `.js`):

```ts
import { Pact } from '@kadena/client';

const unsignedTransaction = Pact.builder
  .execution(
    Pact.modules.coin.transfer('k:your-pubkey', 'k:receiver-pubkey', {
      decimal: '231',
    }),
  )
  .addSigner('your-pubkey', (withCapability) => [
    // add necessary coin.GAS capability (this defines who pays the gas)
    withCapability('coin.GAS'),
    // add necessary coin.TRANSFER capability
    withCapability('coin.TRANSFER', 'k:your-pubkey', 'k:receiver-pubkey', {
      decimal: '231',
    }),
  ])
  .setMeta({ chainId: '1', senderAccount: 'k:your-pubkey' })
  .setNetworkId('testnet05')
  .createTransaction();
```

### Notes

- Namespaced arguments (`k:`, `w:` etc) are account names, where non-namespaced arguments are assumed to be public keys.
- The contract doesn't specify whether you need to pass an **account name** or **public key**. This is knowledge that can be obtained by inspecting the contract downloaded earlier or consulting the documentation for the contract.
- The `addSigner` function accepts the `public-key` of the signer and lets the signer add the capabilities they want to sign for. Note that `coin.GAS` doesn't have any arguments, but `coin.TRANSFER` does.
- The `setMeta` argument object has a `senderAccount` property. This is an `account` and could be a `gas station` account in some scenarios.
- To add an **Unrestricted Signer** ([Unscoped Signature](https://docs.kadena.io/pact/reference/concepts#signature-capabilitiesh289463870)), call `addSigner` without extra arguments

## Signing

Signing can be done in various ways. Either manually, by signing the hash of the transaction or with a wallet. There are currently two options in `@kadena/client` to sign with a wallet:

1. [WalletConnect (preferred)](#signing-with-a-walletconnect-compatible-wallet)
2. [Chainweaver](#integrated-sign-request-to-chainweaver-desktop)
3. [Manual signing with keypair](#manually-signing-the-transaction)

### Manually signing the transaction

The unsignedTransaction can be pasted into the `SigData` of Chainweaver, or you can sign it programmatically if you have access to the private key:

```ts
import { createSignWithKeypair } from '@kadena/client';

const keyPair = {
  publicKey: 'your-public-key',
  secretKey: 'your-secret-key'
};

const signWithKeypair = createSignWithKeypair(keyPair);
const signedTransaction = await signWithKeypair(unsignedTransaction);
```

**WARNING:** Never expose private keys in client-side code or commit them to version control.

### Integrated sign request to Chainweaver desktop

Using the `transaction`, we can send a sign request to Chainweaver.

**Note:** This can only be done using the desktop version, not the web version, as it's [exposing port 9467](https://kadena-io.github.io/signing-api/).

```ts
import { signWithChainweaver } from '@kadena/client';

// use the transaction, and sign it with Chainweaver
const signedTransaction = await signWithChainweaver(unsignedTransaction);
```

> To **send** the transaction to the blockchain, continue with [**Send a request to the blockchain**](#send-a-request-to-the-blockchain)

### Signing with a WalletConnect compatible wallet

There are several steps to setup a WalletConnect connection and sign with WalletConnect.

1. Setting up the connection using [`ClientContextProvider.tsx`](https://github.com/kadena-io/wallet-connect-example/blob/main/src/providers/ClientContextProvider.tsx#L69C6-L69C6)
2. Use `signWithWalletConnect` to request a signature from the wallet ([Transaction.tsx](https://github.com/kadena-io/wallet-connect-example/blob/2efc34296f845aea75f37ab401a5c49081f75b47/src/components/Transaction.tsx#L104))

## Verifier

Kadena supports `verifier` as another way of gaining authority in Pact, as well as the normal signature flow. In this way, a `verifier`, `proof`, and the `capability list` will be sent to the blockchain, and if the proof satisfies the verifier function, the capabilities will be granted. It's useful, for example, for ZK (Zero Knowledge Proof) or bridging between networks.

### Add verifier to the transaction

```ts
import { Pact } from '@kadena/client';

const transaction = Pact.builder
  .execution(
    Pact.modules.coin.transfer('sender-account', 'receiver-account', {
      decimal: '231',
    }),
  )
  .addVerifier({ name: 'ZK', proof: 'zk-proof-data' }, (withCapability) => [
    // add necessary coin.GAS capability (this defines who pays the gas)
    withCapability('coin.GAS'),
    // add necessary coin.TRANSFER capability
    withCapability('coin.TRANSFER', 'sender-account', 'receiver-account', {
      decimal: '231',
    }),
  ])
  .setMeta({ chainId: '1', senderAccount: 'sender-account' })
  .setNetworkId('testnet05')
  .createTransaction();
```

## Using the commandBuilder

You may prefer to not generate JavaScript code for your contracts or use templates. In that case, you can use the `commandBuilder` function to build a command and submit the transaction yourself:

```ts
import { Pact, createClient } from '@kadena/client';

const client = createClient(
  'https://api.testnet.chainweb.com/chainweb/0.0/testnet05/chain/8/pact',
);

const unsignedTransaction = Pact.builder
  .execution('(format "Hello {}!" [(read-msg "person")])')
  // add signer(s) if required
  .addSigner('your-pubkey')
  // set chain id and sender
  .setMeta({
    chainId: '8',
    senderAccount: 'your-k-or-w-account-or-gas-station',
  })
  // set networkId
  .setNetworkId('testnet05')
  // create transaction with hash
  .createTransaction();

// Send it or local it
client.dirtyRead(unsignedTransaction);
client.submit(unsignedTransaction);
```

## Using FP approach

This library uses a couple of utility functions in order to create pactCommand. You can import those functions from `@kadena/client/fp` if you need more flexibility on creating commands like composing commands or lazy loading.

Here are two examples to demonstrate this:

- [example-contract/functional/transfer-fp.ts](https://github.com/kadena-community/kadena.js/blob/main/packages/libs/client-examples/src/example-contract/functional/transfer-fp.ts)
- [example-contract/functional/compose-commands.ts](https://github.com/kadena-community/kadena.js/blob/main/packages/libs/client-examples/src/example-contract/functional/compose-commands.ts)

## API Reference

### Client Functions

The `@kadena/client` provides a `createClient` function with utility functions that call the Pact API under the hood ([Pact API Reference](https://api.chainweb.com/openapi/pact.html)).

#### createClient

Creates a client instance for interacting with the Kadena blockchain.

```ts
import { createClient } from '@kadena/client';

// Static host URL (single chain/network)
const client = createClient('https://api.chainweb.com/chainweb/0.0/mainnet01/chain/1/pact');

// Dynamic host URL generator (multiple chains/networks)
const client = createClient(({ networkId, chainId }) =>
  `https://api.chainweb.com/chainweb/0.0/${networkId}/chain/${chainId}/pact`
);

// With custom confirmation depth
const client = createClient(hostUrl, { confirmationDepth: 3 });
```

**Parameters:**
- `hostUrl` (string | function): Static URL or a function that generates URLs based on `networkId` and `chainId`
- `options` (optional): Configuration object
  - `confirmationDepth` (number): Number of block confirmations to wait for (default: 0)

**Returns:** `IClient` - Client instance with all API methods

---

#### local

Executes a transaction locally without submitting it to the blockchain. Database writes are rolled back. No gas payment required.

```ts
const result = await client.local(transaction, {
  preflight: true,
  signatureVerification: true
});
```

**Parameters:**
- `transaction`: The transaction to execute
- `options` (optional):
  - `preflight` (boolean): Run preflight checks
  - `signatureVerification` (boolean): Verify signatures

**Returns:** `Promise<LocalResponse>` - Local execution result

**Use Cases:**
- Testing transactions before submission
- Reading blockchain data
- Validating transaction structure

---

#### submit

Submits one or more signed transactions to the blockchain for execution. This is the only function that requires gas payment.

```ts
// Submit single transaction
const descriptor = await client.submit(signedTransaction);

// Submit multiple transactions
const descriptors = await client.submit([tx1, tx2, tx3]);
```

**Parameters:**
- `transaction` (ICommand | ICommand[]): Single or multiple signed transactions

**Returns:** `Promise<ITransactionDescriptor | ITransactionDescriptor[]>` - Transaction descriptor(s) containing:
- `requestKey`: Unique identifier for the transaction
- `chainId`: Chain where the transaction was submitted
- `networkId`: Network identifier

**Error Handling:**
```ts
try {
  const descriptor = await client.submit(signedTransaction);
} catch (error) {
  if (error.message === 'EMPTY_COMMAND_LIST') {
    console.error('No transactions provided');
  } else {
    console.error('Submission failed:', error);
  }
}
```

---

#### pollStatus

Polls the blockchain for transaction results with automatic retries until completion or timeout.

```ts
const result = await client.pollStatus(descriptor, {
  timeout: 180000,      // 3 minutes
  interval: 5000,       // poll every 5 seconds
  onPoll: (result) => {
    console.log('Polling...', result);
  },
  confirmationDepth: 3  // wait for 3 block confirmations
});
```

**Parameters:**
- `transactionDescriptors` (ITransactionDescriptor | ITransactionDescriptor[]): One or more transaction descriptors
- `options` (optional):
  - `timeout` (number): Maximum polling time in milliseconds (default: 180000)
  - `interval` (number): Time between polls in milliseconds (default: 5000)
  - `onPoll` (function): Callback invoked on each poll
  - `confirmationDepth` (number): Number of block confirmations to wait for

**Returns:** `Promise<IPollRequestPromise<ICommandResult>>` - Poll result object with request keys mapped to results

**Example with error handling:**
```ts
const pollResult = await client.pollStatus(descriptor, {
  timeout: 60000,
  interval: 3000,
  onPoll: (res) => console.log('Status:', Object.keys(res).length, 'results')
});

const result = pollResult[descriptor.requestKey];
if (result.result.status === 'failure') {
  console.error('Transaction failed:', result.result.error);
} else {
  console.log('Transaction succeeded:', result.result.data);
}
```

---

#### getStatus

Gets the current status of one or more transactions with a single poll (no retries).

```ts
const status = await client.getStatus(descriptor);
```

**Parameters:**
- `transactionDescriptors` (ITransactionDescriptor | ITransactionDescriptor[]): Transaction descriptor(s)

**Returns:** `Promise<IPollResponse>` - Current status. Returns empty object if transaction not yet mined.

**Use Cases:**
- Quick status check without waiting
- Checking multiple transactions at once
- Building custom polling logic

---

#### listen

Long-polls for a transaction result. Blocks until the transaction is mined.

```ts
const result = await client.listen(descriptor);
```

**Parameters:**
- `transactionDescriptor` (ITransactionDescriptor): Single transaction descriptor

**Returns:** `Promise<ICommandResult>` - Transaction result

**Use Cases:**
- Waiting for a single critical transaction
- Simpler alternative to pollStatus for single transactions

**Note:** The listen endpoint may timeout after several minutes. Consider using `pollStatus` for more control.

---

#### pollCreateSpv

Creates an SPV (Simple Payment Verification) proof for cross-chain transactions with automatic retries.

```ts
const spvProof = await client.pollCreateSpv(
  descriptor,
  '2', // target chain
  {
    timeout: 180000,
    interval: 5000,
    onPoll: () => console.log('Creating SPV proof...')
  }
);
```

**Parameters:**
- `transactionDescriptor` (ITransactionDescriptor): Source transaction descriptor
- `targetChainId` (ChainId): Target chain ID for the proof
- `options` (optional): Polling options (timeout, interval, onPoll)

**Returns:** `Promise<string>` - SPV proof string

**Use Cases:**
- Cross-chain transfers
- Multi-step transactions across chains
- Bridge operations

---

#### createSpv

Creates an SPV proof with a single request (no retries).

```ts
const spvProof = await client.createSpv(descriptor, '2');
```

**Parameters:**
- `transactionDescriptor` (ITransactionDescriptor): Source transaction descriptor
- `targetChainId` (ChainId): Target chain ID

**Returns:** `Promise<string>` - SPV proof or error if not ready

---

#### preflight

Alias for `local` with both `preflight` and `signatureVerification` set to `true`. Validates transaction before submission.

```ts
const preflightResult = await client.preflight(signedTransaction);
```

**Use Cases:**
- Validating signed transactions before submission
- Checking for execution errors
- Gas estimation

---

#### dirtyRead

Alias for `local` with both `preflight` and `signatureVerification` set to `false`. Fastest way to read data from the blockchain.

```ts
const balance = await client.dirtyRead(transaction);
```

**Use Cases:**
- Reading account balances
- Querying contract data
- Fast data retrieval without validation

---

#### signatureVerification

Alias for `local` with `preflight` false and `signatureVerification` true. Verifies signatures without full preflight checks.

```ts
const result = await client.signatureVerification(signedTransaction);
```

---

#### runPact

Generates and executes a simple Pact command from code and data.

```ts
const result = await client.runPact(
  '(coin.get-balance "k:account")',
  {},
  { networkId: 'testnet05', chainId: '1' }
);
```

**Parameters:**
- `code` (string): Pact code to execute
- `data` (Record<string, unknown>): Data object available to the code
- `options`: Network and chain configuration

**Returns:** `Promise<ICommandResult>` - Execution result

---

### Transaction Builder

#### Pact.builder

The builder pattern for constructing transactions.

```ts
import { Pact } from '@kadena/client';

const transaction = Pact.builder
  .execution(
    // Pact code or generated function calls
    Pact.modules.coin.transfer('sender', 'receiver', { decimal: '10.0' })
  )
  .addSigner('public-key', (withCapability) => [
    withCapability('coin.GAS'),
    withCapability('coin.TRANSFER', 'sender', 'receiver', { decimal: '10.0' })
  ])
  .setMeta({
    chainId: '1',
    senderAccount: 'sender',
    gasLimit: 2500,
    gasPrice: 0.00000001,
    ttl: 600
  })
  .setNetworkId('testnet05')
  .createTransaction();
```

**Methods:**

- **execution(code: string | PactExpression)**: Sets the Pact code to execute
- **addSigner(publicKey: string, capabilityCallback?)**: Adds a signer with optional capabilities
- **addVerifier(verifier, capabilityCallback)**: Adds a verifier for ZK proofs or custom verification
- **setMeta(options)**: Sets transaction metadata
  - `chainId` (required): Target chain (0-19 for mainnet)
  - `senderAccount` (required): Account that pays gas
  - `gasLimit` (optional): Maximum gas (default: 2500)
  - `gasPrice` (optional): Gas price (default: 0.00000001)
  - `ttl` (optional): Time to live in seconds (default: 600)
  - `creationTime` (optional): Unix timestamp (default: current time)
- **setNetworkId(networkId: string)**: Sets the network ('mainnet01', 'testnet05', or custom)
- **createTransaction()**: Finalizes and returns the transaction object

---

### Signing Functions

#### signWithChainweaver

Signs a transaction using Chainweaver desktop wallet.

```ts
import { signWithChainweaver } from '@kadena/client';

const signedTx = await signWithChainweaver(unsignedTransaction);
```

**Requirements:**
- Chainweaver desktop must be running
- Port 9467 must be accessible

---

#### signWithWalletConnect

Signs a transaction using WalletConnect.

```ts
import { signWithWalletConnect } from '@kadena/client';

const signedTx = await signWithWalletConnect(
  unsignedTransaction,
  walletConnectClient
);
```

See [WalletConnect example](https://github.com/kadena-io/wallet-connect-example) for full setup.

---

#### createSignWithKeypair

Creates a signing function from a keypair. **Use only in secure server environments.**

```ts
import { createSignWithKeypair } from '@kadena/client';

const signWithKeypair = createSignWithKeypair({
  publicKey: 'public-key',
  secretKey: 'secret-key'
});

const signedTx = await signWithKeypair(unsignedTransaction);
```

**Security Warning:** Never use this in client-side applications or expose private keys.

---

## Error Handling

### Common Error Types

#### Network Errors

```ts
try {
  const result = await client.submit(transaction);
} catch (error) {
  if (error.message.includes('fetch')) {
    // Network connectivity issue
    console.error('Network error:', error);
  }
}
```

#### Transaction Failures

```ts
const result = await client.pollStatus(descriptor);
const commandResult = result[descriptor.requestKey];

if (commandResult.result.status === 'failure') {
  const error = commandResult.result.error;
  console.error('Transaction failed:', error.message);

  // Common failure reasons:
  // - Insufficient funds
  // - Missing capabilities
  // - Pact execution errors
  // - Gas limit exceeded
}
```

#### Gas Errors

```ts
// Gas limit too low
{
  "result": {
    "status": "failure",
    "error": {
      "message": "Gas limit exceeded"
    }
  }
}

// Insufficient funds for gas
{
  "result": {
    "status": "failure",
    "error": {
      "message": "Insufficient funds"
    }
  }
}
```

### Retry Patterns

#### Exponential Backoff

```ts
async function submitWithRetry(
  client: IClient,
  transaction: ICommand,
  maxRetries = 3
): Promise<ITransactionDescriptor> {
  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await client.submit(transaction);
    } catch (error) {
      lastError = error as Error;

      if (attempt < maxRetries - 1) {
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`Retry attempt ${attempt + 1} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}
```

#### Polling with Timeout

```ts
async function pollWithTimeout(
  client: IClient,
  descriptor: ITransactionDescriptor,
  timeoutMs = 180000
): Promise<ICommandResult> {
  const result = await Promise.race([
    client.pollStatus(descriptor, {
      timeout: timeoutMs,
      interval: 5000,
    }),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Polling timeout')), timeoutMs)
    ),
  ]);

  return result[descriptor.requestKey];
}
```

### Network Failure Recovery

```ts
async function resilientSubmit(
  transaction: ICommand,
  networks: string[]
): Promise<ITransactionDescriptor> {
  for (const network of networks) {
    try {
      const client = createClient(network);
      return await client.submit(transaction);
    } catch (error) {
      console.warn(`Failed on ${network}, trying next...`);
    }
  }

  throw new Error('All networks failed');
}

// Usage
const descriptor = await resilientSubmit(signedTx, [
  'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/1/pact',
  'https://api.backup-node.example/chainweb/0.0/mainnet01/chain/1/pact',
]);
```

### Validation Errors

```ts
import { isSignedTransaction } from '@kadena/client';

// Always validate before submitting
if (!isSignedTransaction(transaction)) {
  throw new Error('Transaction must be signed before submission');
}

// Validate transaction structure
function validateTransaction(tx: ICommand): void {
  const cmd = JSON.parse(tx.cmd);

  if (!cmd.networkId) {
    throw new Error('Missing networkId');
  }

  if (!cmd.meta.chainId) {
    throw new Error('Missing chainId');
  }

  if (!cmd.signers || cmd.signers.length === 0) {
    throw new Error('At least one signer required');
  }
}
```

## Network Configuration

### Mainnet

```ts
// Single chain
const client = createClient(
  'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/1/pact'
);

// Multi-chain
const client = createClient(({ chainId }) =>
  `https://api.chainweb.com/chainweb/0.0/mainnet01/chain/${chainId}/pact`
);

// Transaction configuration
const transaction = Pact.builder
  .execution(/* ... */)
  .setMeta({ chainId: '1' })
  .setNetworkId('mainnet01')
  .createTransaction();
```

### Testnet

```ts
// Testnet (current: testnet05)
const client = createClient(
  'https://api.testnet.chainweb.com/chainweb/0.0/testnet05/chain/1/pact'
);

// Transaction for testnet
const transaction = Pact.builder
  .execution(/* ... */)
  .setMeta({ chainId: '1' })
  .setNetworkId('testnet05')
  .createTransaction();
```

### Devnet (Local Development)

```ts
// Local devnet (typically via Docker)
const client = createClient('http://localhost:8080/chainweb/0.0/development/chain/0/pact');

// Devnet transaction
const transaction = Pact.builder
  .execution(/* ... */)
  .setMeta({ chainId: '0' })
  .setNetworkId('development')
  .createTransaction();
```

**Devnet Setup:**

```sh
# Using kadena-cli
kadena devnet start

# Or with Docker
docker run -p 8080:8080 kadena/devnet
```

### Custom Network

```ts
const client = createClient(({ networkId, chainId }) =>
  `https://custom-node.example.com/chainweb/0.0/${networkId}/chain/${chainId}/pact`
);

const transaction = Pact.builder
  .execution(/* ... */)
  .setMeta({ chainId: '1' })
  .setNetworkId('custom-network-id')
  .createTransaction();
```

### Network Best Practices

1. **Use environment variables** for network configuration
2. **Implement fallback nodes** for resilience
3. **Test on testnet** before deploying to mainnet
4. **Monitor network health** before critical operations
5. **Use appropriate gas settings** per network

```ts
// Environment-based configuration
const NETWORK = process.env.KADENA_NETWORK || 'testnet05';
const CHAIN_ID = process.env.KADENA_CHAIN_ID || '1';

const client = createClient(({ networkId, chainId }) => {
  const baseUrls = {
    mainnet01: 'https://api.chainweb.com/chainweb/0.0',
    testnet05: 'https://api.testnet.chainweb.com/chainweb/0.0',
    development: 'http://localhost:8080/chainweb/0.0',
  };

  return `${baseUrls[networkId]}/${networkId}/chain/${chainId}/pact`;
});
```

## Troubleshooting

### Common Issues

#### 1. TypeScript Type Errors with Generated Contracts

**Problem:** Generated contract types not recognized.

**Solution:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "types": [".kadena/pactjs-generated"]
  }
}
```

Then regenerate types:
```sh
pactjs contract-generate --contract "coin" --api "https://api.testnet.chainweb.com/chainweb/0.0/testnet05/chain/1/pact"
```

---

#### 2. Transaction Fails with "Gas Limit Exceeded"

**Problem:** Transaction runs out of gas during execution.

**Solution:**
```ts
// Increase gas limit
const transaction = Pact.builder
  .execution(/* ... */)
  .setMeta({
    chainId: '1',
    senderAccount: 'account',
    gasLimit: 10000, // Increase from default 2500
  })
  .createTransaction();

// Or estimate gas first using preflight
const preflightResult = await client.preflight(unsignedTransaction);
console.log('Gas used:', preflightResult.gas);
```

---

#### 3. "Missing Capability" Errors

**Problem:** Transaction fails due to missing required capabilities.

**Solution:**
```ts
// Ensure all required capabilities are added
const transaction = Pact.builder
  .execution(Pact.modules.coin.transfer('sender', 'receiver', { decimal: '10' }))
  .addSigner('public-key', (withCapability) => [
    withCapability('coin.GAS'), // Required for gas payment
    withCapability('coin.TRANSFER', 'sender', 'receiver', { decimal: '10' }), // Required for transfer
  ])
  .createTransaction();

// Check contract documentation for required capabilities
```

---

#### 4. Network Timeouts

**Problem:** Requests timeout when connecting to the blockchain.

**Solution:**
```ts
// Increase polling timeout
const result = await client.pollStatus(descriptor, {
  timeout: 300000, // 5 minutes
  interval: 10000,  // 10 seconds between polls
});

// Or implement retry logic
async function submitWithRetry(tx: ICommand, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await client.submit(tx);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(r => setTimeout(r, 2000 * (i + 1)));
    }
  }
}
```

---

#### 5. "Invalid Transaction Hash" Errors

**Problem:** Transaction hash doesn't match expected format.

**Solution:**
```ts
// Ensure transaction is properly created before signing
const transaction = Pact.builder
  .execution(/* ... */)
  .addSigner(/* ... */)
  .setMeta(/* ... */)
  .setNetworkId('testnet05')
  .createTransaction(); // This calculates the hash

// Verify transaction structure
console.log('Transaction hash:', transaction.hash);
console.log('Command:', JSON.parse(transaction.cmd));
```

---

#### 6. Chainweaver Connection Issues

**Problem:** Cannot connect to Chainweaver for signing.

**Solution:**
- Ensure Chainweaver desktop is running
- Check that port 9467 is not blocked
- Use WalletConnect as an alternative

```ts
// Test Chainweaver availability
try {
  const response = await fetch('http://127.0.0.1:9467/v1/version');
  console.log('Chainweaver available:', await response.json());
} catch (error) {
  console.error('Chainweaver not running');
}
```

---

#### 7. Account Name vs Public Key Confusion

**Problem:** Using public key where account name is required (or vice versa).

**Solution:**
```ts
// Account names are prefixed (k:, w:, c:, etc.)
const accountName = 'k:abc123...';

// Public keys are raw hex strings
const publicKey = 'abc123...';

// For coin.transfer, use account names
Pact.modules.coin.transfer('k:sender-pubkey', 'k:receiver-pubkey', amount);

// For signers, use public key (no prefix)
.addSigner('sender-pubkey', (withCapability) => [...])
```

---

### Performance Optimization

#### 1. Batch Requests

```ts
// Submit multiple transactions at once
const descriptors = await client.submit([tx1, tx2, tx3]);

// Poll multiple transactions
const results = await client.pollStatus(descriptors, {
  timeout: 180000,
  interval: 5000,
});
```

#### 2. Use dirtyRead for Data Queries

```ts
// Faster than preflight for read-only operations
const balance = await client.dirtyRead(
  Pact.builder
    .execution(Pact.modules.coin['get-balance']('account'))
    .setMeta({ chainId: '1' })
    .setNetworkId('testnet05')
    .createTransaction()
);
```

#### 3. Optimize Gas Settings

```ts
// Set gas price appropriately
const transaction = Pact.builder
  .execution(/* ... */)
  .setMeta({
    chainId: '1',
    senderAccount: 'account',
    gasLimit: 2500,      // Don't over-allocate
    gasPrice: 0.00000001, // Standard gas price
  })
  .createTransaction();
```

### Debugging Tips

#### Enable Debug Logging

```ts
// Log transaction details before submission
console.log('Transaction:', JSON.stringify(transaction, null, 2));
console.log('Hash:', transaction.hash);
console.log('Signers:', JSON.parse(transaction.cmd).signers);
```

#### Verify Transaction Before Submission

```ts
// Use preflight to catch errors before submitting
const preflightResult = await client.preflight(signedTransaction);

if (preflightResult.result.status === 'failure') {
  console.error('Preflight failed:', preflightResult.result.error);
  // Fix the transaction before submitting
} else {
  console.log('Preflight succeeded:', preflightResult.result.data);
  const descriptor = await client.submit(signedTransaction);
}
```

#### Check Transaction Status

```ts
// Get detailed status information
const status = await client.getStatus(descriptor);
console.log('Status:', status);

// If empty, transaction not yet mined
if (Object.keys(status).length === 0) {
  console.log('Transaction not yet mined, waiting...');
}
```

### Getting Help

If you encounter issues not covered here:

1. Check the [API Reference](https://github.com/kadena-community/kadena.js/tree/main/packages/libs/client/etc/client.api.md)
2. Search [GitHub Issues](https://github.com/kadena-community/kadena.js/issues)
3. Ask in the [#kadena-js Discord channel](https://discord.com/channels/502858632178958377/1001088816859336724)
4. Review [example code](https://github.com/kadena-community/kadena.js/tree/main/packages/libs/client-examples)

## Migration Guide

Upgrading from v0.x to v1.0.0? See the comprehensive [MIGRATION.md](./MIGRATION.md) guide.

**Quick Summary of Breaking Changes:**

- Expression generation is now separate from transaction building
- Client is a separate entity from transactions
- Signing is applied to plain JavaScript objects
- New builder pattern with improved type safety
- Updated signing workflow

## Examples

### Complete Transfer Example

```ts
import { Pact, createClient, isSignedTransaction } from '@kadena/client';
import { signWithChainweaver } from '@kadena/client';

async function transferKDA(
  senderAccount: string,
  senderPublicKey: string,
  receiverAccount: string,
  amount: string
) {
  // 1. Build the transaction
  const transaction = Pact.builder
    .execution(
      Pact.modules.coin.transfer(senderAccount, receiverAccount, {
        decimal: amount,
      })
    )
    .addSigner(senderPublicKey, (withCapability) => [
      withCapability('coin.GAS'),
      withCapability('coin.TRANSFER', senderAccount, receiverAccount, {
        decimal: amount,
      }),
    ])
    .setMeta({ chainId: '1', senderAccount })
    .setNetworkId('testnet05')
    .createTransaction();

  // 2. Sign the transaction
  const signedTx = await signWithChainweaver(transaction);

  // 3. Validate signatures
  if (!isSignedTransaction(signedTx)) {
    throw new Error('Transaction not properly signed');
  }

  // 4. Create client
  const client = createClient(
    'https://api.testnet.chainweb.com/chainweb/0.0/testnet05/chain/1/pact'
  );

  // 5. Submit transaction
  const descriptor = await client.submit(signedTx);
  console.log('Transaction submitted:', descriptor.requestKey);

  // 6. Poll for result
  const result = await client.pollStatus(descriptor, {
    timeout: 180000,
    interval: 5000,
    onPoll: () => console.log('Polling...'),
  });

  // 7. Check result
  const commandResult = result[descriptor.requestKey];
  if (commandResult.result.status === 'success') {
    console.log('Transfer successful!', commandResult.result.data);
  } else {
    console.error('Transfer failed:', commandResult.result.error);
  }

  return commandResult;
}
```

### Read Account Balance

```ts
import { Pact, createClient } from '@kadena/client';

async function getBalance(account: string): Promise<string> {
  const client = createClient(
    'https://api.testnet.chainweb.com/chainweb/0.0/testnet05/chain/1/pact'
  );

  const transaction = Pact.builder
    .execution(Pact.modules.coin['get-balance'](account))
    .setMeta({ chainId: '1' })
    .setNetworkId('testnet05')
    .createTransaction();

  const result = await client.dirtyRead(transaction);

  if (result.result.status === 'success') {
    return result.result.data as string;
  } else {
    throw new Error(`Failed to get balance: ${result.result.error.message}`);
  }
}
```

### Cross-Chain Transfer

```ts
async function crossChainTransfer(
  senderAccount: string,
  senderPublicKey: string,
  receiverAccount: string,
  amount: string,
  sourceChain: string,
  targetChain: string
) {
  const client = createClient(({ chainId, networkId }) =>
    `https://api.testnet.chainweb.com/chainweb/0.0/${networkId}/chain/${chainId}/pact`
  );

  // Step 1: Initiate transfer on source chain
  const initTx = Pact.builder
    .execution(
      Pact.modules.coin['transfer-crosschain'](
        senderAccount,
        receiverAccount,
        { decimal: amount },
        targetChain
      )
    )
    .addSigner(senderPublicKey, (withCapability) => [
      withCapability('coin.GAS'),
      withCapability(
        'coin.TRANSFER_XCHAIN',
        senderAccount,
        receiverAccount,
        { decimal: amount },
        targetChain
      ),
    ])
    .setMeta({ chainId: sourceChain, senderAccount })
    .setNetworkId('testnet05')
    .createTransaction();

  const signedInitTx = await signWithChainweaver(initTx);
  const initDescriptor = await client.submit(signedInitTx);

  // Wait for completion on source chain
  const initResult = await client.pollStatus(initDescriptor);

  // Step 2: Get SPV proof
  const spvProof = await client.pollCreateSpv(initDescriptor, targetChain);

  // Step 3: Continue transfer on target chain
  const continueTx = Pact.builder
    .continuation({
      pactId: initResult[initDescriptor.requestKey].continuation.pactId,
      step: 1,
      rollback: false,
      data: {},
      proof: spvProof,
    })
    .setMeta({ chainId: targetChain, senderAccount })
    .setNetworkId('testnet05')
    .createTransaction();

  const continueDescriptor = await client.submit(continueTx);
  const continueResult = await client.pollStatus(continueDescriptor);

  return continueResult[continueDescriptor.requestKey];
}
```

### More Examples

For additional examples, see:

- [client-examples](https://github.com/kadena-community/kadena.js/tree/main/packages/libs/client-examples)
- [WalletConnect example app](https://github.com/kadena-io/wallet-connect-example)
- [Kadena documentation](https://docs.kadena.io)

## Support

- [Kadena Documentation](https://docs.kadena.io)
- [Kadena Discord (#kadena-js channel)](https://discord.com/channels/502858632178958377/1001088816859336724)
- [GitHub Issues](https://github.com/kadena-community/kadena.js/issues)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/kadena)

## Further development

The `@kadena/client` is continuously evolving. We welcome feedback and use cases from the community. If the current `@kadena/client` and `@kadena/pactjs-cli` don't meet your needs, please let us know through:

- [GitHub Issues](https://github.com/kadena-community/kadena.js/issues)
- [Discord (#kadena-js channel)](https://discord.com/channels/502858632178958377/1001088816859336724)
