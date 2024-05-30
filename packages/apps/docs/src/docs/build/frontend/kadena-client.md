---
title: Kadena client
description:
  The @kadena/client library provides a TypeScript-based API for interacting
  with smart contracts and Chainweb nodes on the Kadena network.
menu: Frontend frameworks
label: Kadena client
order: 3

layout: full
tags: ['TypeScript', 'Kadena', 'Kadena client', 'frontend']
---

# Kadena client

The `@kadena/client` library provides a TypeScript-based API for interacting
with smart contracts and Chainweb nodes on the Kadena network. 
The library includes modules to help you perform the following types of common tasks:

- Create commands
- Sign transactions
- Submit transactions
- Query transaction results

If you only need to interact with the `coin` contract, you can use the functions in the `@kadena/client-utils/coin` library instead of the `@kadena/client` library for a simpler API.

## Get started with Kadena client

One of the most important features of the Kadena client library is that helps you create **command** objects with the correct structure.
You can then construct and sign transactions to send the command to the blockchain network.
After you submit a transaction for processing, you can use the Kadena client to listen for the transaction results.

The following example illustrates the structure of a command object:

```typescript
interface ICommand {
  cmd: string; // stringified command of <IPactCommand> type
  hash: string; // cmd-hash
  sigs: Array<{ sig: string } | undefined>; // array of signatures
}

interface IPactCommand {
  payload:
    | {
        exec: {
          code: string;
          data: Record<string, unknown>;
        };
      }
    | {
        cont: {
          pactId: string;
          step: number;
          rollback: boolean;
          data?: Record<string, unknown>;
          proof?: string | null;
        };
      };
  meta: {
    chainId: ChainId; // "0" to  "19"
    sender: string;
    gasLimit: number;
    gasPrice: number;
    ttl: number;
    creationTime: number;
  };
  signers: Array<{
    pubKey: string;
    address?: string;
    scheme?: SignerScheme;
    clist?: ICap[];
  }>;
  verifiers?: Array<{
    name: string;
    proof: PactValue;
    clist?: ICap[];
  }>;
  networkId: string;
  nonce: string;
}
```

If your use case is simple enough that you can create the JSON directly, you don't need to use the functions in the Kadena client library. 
You can also use some parts of the library, without using everything.
If you prefer to learn from code, check out the [client-examples](https://github.com/kadena-community/kadena.js/tree/main/packages/libs/client-examples).

### Install

You can download and install the `@kadena/client` library with the following command:

```bash
npm install @kadena/client
```

### Import

After you install the library, you can import `@kadena/client` functions into a TypeScript or JavaScript program with the following statement:

```typescript
import { createClient, Pact } from '@kadena/client';
```

The library also exports functional programming utilities under `@kadena/client/fp` for more flexibility when using a functional programming approach.
To import functional programming utilities, include the following statement in your TypeScript or JavaScript program.

```typescript
import { composePactCommand } from '@kadena/client/fp';
```

## Calling Pact modules

Interacting with the Kadena blockchain network and Chainweb nodes is mostly a matter of calling smart contract functions. 
From the client perspective, you need to write Pact code in a string and pass it to the `IPactCommand.payload.exec.code` interface. 
Without code completion and validation, writing the Pact code string manually is error-prone and vulnerable to code injection.

To simplify the process, you can use `Pact.modules` to help you:

- Write type-safe functions.
- Perform Pact type conversion.
- Avoid code injection.

You can skip this part of the client library if your code is just a simple **constant** string.

### Basic usage

Use `Pact.modules` with the following format:


```typescript
import { Pact } from `@kadena/client`;

Pact.modules[`${namespace}.${moduleName}`][functionName](...args);
```

### Parameters

| Parameter | Type        | Description       |
| --------- | ----------- | ----------------- |
| ...args   | PactValue[] | List of arguments. |

```typescript
// the pseudo code of PactValue type
type PactValue =
  | string
  | number
  | boolean
  | Date
  | { int: string }
  | { decimal: string }
  | PactValue[]
  | Record<string, PactValue>;
```

### Examples

To create the code for the `coin.transfer` function:

```typescript
import { Pact } from `@kadena/client`;

const code = Pact.modules.coin.transfer("alice", "bob", { decimal: '1.1' });
// code === '(coin.transfer "alice" "bob" 1.1)'

```

To create the code for the `free.my-module.my-function` function that converts a list, objects, and date to valid Pact code:

```typescript
import { Pact } from `@kadena/client`;

const code = Pact.modules["free.my-module"].["my-function"](["first", { time: new Date() }]);
// code === '(free.my-module.my-function ["first" {"time" : (time "2023-07-20T14:55:11Z")} ])'

```

### Create type definitions

You can use [@kadena/pactjs-cli](/reference/kadena-client/pactjs-cli) to create the type definitions for the Pact module you use.
After you generate the type definitions file, the code editor in your development environment should provide code completion for functions and capabilities.

To create a type definition file for the `coin` contract:

```bash
npx @kadena/pactjs-cli contract-generate --contract coin --api https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/0/pact;
```

## Creating commands

As illustrated in [Get started with Kadena client](#get-started-with-kadena-client), a command is a JSON object with three keys: `cmd`, `hash`, and `sig`. 
There are two types of commands:

- [Execution](#execution) commands
- [Continuation](#continuation) commands

You can create the JSON object without using the Kadena client library.
However, using the library and `Pact.builder` to create the command object simplifies the process.

### Pact.builder.execution

You can use `Pact.builder` to create an execution command object, `IPactCommand.payload.exec.code`.
Most transactions are execution (exec) commands that complete in a single step.
Execution commands are also be used for the first step in transactions that are `defpact` multi-step transactions.

```typescript
Pact.builder.execution(...codes): IBuilder
```

| Parameter | Type     | Description   |
| --------- | -------- | ------------- |
| ...codes   | string[] | List of input for a function. |

#### Examples

To use strings for the command code:

```typescript
const builder: IBuilder = Pact.builder.execution(
  `(coin.transfer "alice" "bob" 1.1)`,
);
```

To use `Pact.modules` for the command code:

```typescript
const builder: IBuilder = Pact.builder.execution(
  Pact.modules.coin.transfer('alice', 'bob', { decimal: '1.1' }),
);
```

### Pact.builder.continuation

You can use `Pact.builder` to create a continuation command object, `IPactCommand.payload.cont`, which is the type of transaction used for additional steps of `defpact` multi-step transactions.

```typescript
Pact.builder.continuation(contData): IBuilder
```

| Parameter | Type | Description |
| --------- | ---- |------------ |
| contData  | object | Continuation data includes a unique `defpact` identifier, whether the transactions rolls back a previous transaction, the transaction step that the continuation represents with the first step being step 0, and a simple payment verification proof if one is generated by calling the `/spv` endpoint. |

The `contData` object consists of the following properties:

```json
{ 
    pactId: string, 
    rollback: boolean, 
    step: number, 
    data?: Record<string, any>, 
    proof?: null \| string
} 
```

#### Example

The `coin.cross-chain` function is a `defpact` multi-step transaction that burns tokens in
the source chain and mints tokens in the destination chain. 
After the first step completes successfully, you can call the second step by using the `continuation` command object.

```typescript

const builder: IBuilder = Pact.builder.continuation({
  pactId,
  rollback: false,
  step:1,
  proof: spvProof
})

```

### addSigner

You can use the `addSigner` method to add public keys and capabilities for a transaction signer to the command. 
You can call `addSigner` multiple times to add multiple signers to the transaction.
Later, the Chainweb node checks whether all required signers have signed the transaction or not.

```typescript
Pact.builder.execution(...codes).addSigner(signerOrSignersList, capabilityCallback): IBuilder
```

| Parameter | Type | Description  |
| --------- | ---- | ------------ |
| signer | string or object\| { pubKey: string; scheme?: 'ED25519' \| 'ETH' \| 'WebAuthn'; address?: string;} \| ISigner[] | Public key of the signer or the signer object (this can also be a list of signers if all of the signers sign for the same capabilities). |
| capabilityCallback | (signFor) => ReturnType<signFor>[]    | Allows you to scope what the signer is signing for to a specific list of capabilities.   |

Chainweb supports the following signature schemes for public keys:

- `ED25519`
- `WebAuthn`
- `ETH`

The default signature scheme is `ED25519`. 
You can pass just the public key if the signature scheme is `ED25519`.
If the scheme is not `ED25519`, you must pass a signer object that includes the pubic key and the signature scheme.

#### Examples

To add a signer public key for a `coin` contract transfer:

```typescript
// ED25519 key
const alicePublicKey =
  'e7f4da07b1d200f6e45aa6492afed6819297a97563859a5f0df9c54f5abd4aab';

Pact.builder
  .execution(Pact.modules.coin.transfer('alice', 'bob', { decimal: '1.1' }))
  .addSigner(alicePublicKey, (signFor) => [
    signFor('coin.TRANSFER', 'alice', 'bob', { decimal: '1.1' }),
  ]);
```

To add a signer that uses the `WebAuthn` scheme:

```typescript
Pact.builder
  .execution(Pact.modules.coin.transfer('alice', 'bob', { decimal: '1.1' }))
  .addSigner({ pubKey: webAuthnPublicKey, scheme: 'WebAuthn' }, (signFor) => [
    signFor('coin.TRANSFER', 'alice', 'bob', { decimal: '1.1' }),
  ]);
```

To add a list of signers with no capabilities:

```typescript
Pact.builder
  .execution('(free.my-module.my-function)')
  .addSigner([
    'ED25519_publicKey',
    { pubKey: 'WebAuthn_publicKey', scheme: 'WebAuthn' },
  ]);
```

To add a list of signers with similar capabilities:

```typescript
Pact.builder
  .execution(Pact.modules.coin.transfer('alice', 'bob', { decimal: '1.1' }))
  // e.g., Alice's account is guarded by two keys
  .addSigner(['first_publicKey', 'second_publicKey'], (signFor) => [
    signFor('coin.TRANSFER', 'alice', 'bob', { decimal: '1.1' }),
  ]);

const equivalentPactCommand = {
  payload: {
    exec: {
      code: '(coin.transfer "alice" "bob" 1.1 )',
      data: {},
    },
  },
  signers: [
    {
      pubKey: 'first_publicKey',
      scheme: 'ED25519',
      clist: [
        { name: 'coin.TRANSFER', args: ['alice', 'bob', { decimal: '1.1' }] },
      ],
    },
    {
      pubKey: 'second_publicKey',
      scheme: 'ED25519',
      clist: [
        { name: 'coin.TRANSFER', args: ['alice', 'bob', { decimal: '1.1' }] },
      ],
    },
  ],
};
```

### addData

You can use `addData` to add data to the `IPactCommand.payload.exec.data` or
`IPactCommand.payload.cont.data` command.
This data is readable in the smart contract later. 
You can also use this data in the code you set in the command.

```typescript
Pact.builder
  .execution(...codes)
  .addData(key, value): IBuilder
```

| Parameter | Type      | Description                  |
| --------- | --------- | ---------------------------- |
| key       | string    | The key associated with the data you're sending. |
| value     | PactValue | Data that you want to send.       |

#### Examples

To transfer with parameters in data:

```typescript
Pact.builder
  .execution('(coin.transfer (read-string "sender") (read-string "receiver") 1.1)')
  .addData("sender", sender)
  .addData("receiver", sender): IBuilder
```

To use `transfer-create` and send the receiver guard:

```typescript
Pact.builder
  .execution(
    '(coin.transfer-create "alice" "bob" (read-keyset "bob-guard") 1.1)',
  )
  .addData('bob-guard', {
    keys: ['bob-public-key'],
    pred: 'keys-all',
  });
```

### addKeyset

Because keysets are often included as data in commands, you can use the `addKeyset` method as an
alternative to the `addData` method to add a keyset to a command.

```typescript
Pact.builder
  .execution(...codes)
  .addKeyset(name, pred, ...keys): IBuilder
```

| Parameter | Type                                        | Description                                                                  |
| --------- | ------------------------------------------- | ---------------------------------------------------------------------------- |
| name      | string                                      | The name associated with the keyset.                                       |
| pred      | "keys-all"\|"keys-2"\| "keys-any" \| string | One of the built-in predicate functions or a user-defined predicate function. |
| ...keys   | ...string[]                                 | List of public keys in the keyset.                                        |

#### Examples

To use `readKeyset` and `addKeyset` helper functions with transfer-create: 

```typescript
Pact.builder
  .execution(
    Pact.modules.coin['transfer-create'](
      'alice',
      'bob',
      readKeyset('bob-guard'),
      { decimal: '1.1' },
    ),
  )
  .addKeyset('bob-guard', 'keys-all', 'bob-public-key');
```

To use transfer-create as string code:

```typescript
Pact.builder
  .execution(
    '(coin.transfer-create "alice" "bob" (readKeyset "bob-guard") 1.1)',
  )
  .addKeyset('bob-guard', 'keys-all', 'bob-public-key');
```

### setMeta

You can use `setMeta` to add metadata to a command.

```typescript
Pact.builder
  .execution(...codes)
  .setMeta(meta): IBuilder
```

| Parameter | Type                                                                                                               | Description         |
| --------- | ------------------------------------------------------------------------------------------------------------------ | ------------------- |
| meta      | { chainId: ChainId, senderAccount: string, gasLimit: number, gasPrice: number, ttl: number, creationTime: number } | Add a metadata object to the command. |

The `meta` object consists of the following properties:

| Property      | Type            | Default value       | Description                                                          |
| ------------- | --------------- | ------------------- | -------------------------------------------------------------------- |
| chainId       | `"0"` to `"19"` | `undefined`         | Chain identifier for the chain. Valid values are from 0 to 19.                                         |
| senderAccount | `string`        | `undefined`         | The account address that you want to pay transaction fees from.|
| gasLimit      | `number`        | `2500`              | Maximum units of gas that you want to allow to be deducted when running the transaction. |
| gasPrice      | `number`        | `1.0e-8`            | Price of each gas unit based on KDA (e.g., 0.0000001).               |
| ttl           | `number`        | `28800`             | Time-to-live (ttl) for the transaction to be valid in seconds. The default value is 8 hours.    |
| creationTime  | `number`        | `Date.now() / 1000` | Transaction creation time in seconds.                                |

#### Examples

```typescript
Pact.builder
  .execution('(coin.transfer "alice" "bob" 1.1)')
  // "bob is paying gas fee"
  .setMeta({ chainId: "02", senderAccount: "bob" }): IBuilder;
```

### setNonce

You can use `setNonce` function to set `IPactCommand.nonce` to a custom nonce for the transaction. Otherwise, the nonce is set using the `kjs:${timestamp}` function.

```typescript
Pact.builder.execution(code).setNonce(nonce): IBuilder
```

| Parameter | Type   | Description      |
| --------- | ------ | ---------------- |
| nonce     | string | Custom nonce for the transaction. |

#### Examples

```typescript
Pact.builder
  .execution('(coin.transfer "alice" "bob" 1.1)')
  // "bob is paying gas fee"
  .setNonce("a-custom-nonce"): IBuilder;
```

### setNetworkId

You can use `setNetworkId` to set `IPactCommand.network` to specify the network for the transaction.

```typescript
Pact.builder.execution(code).setNetworkId(networkId): IBuilder
```

| Parameter | Type   | Description                                 |
| --------- | ------ | ------------------------------------------- |
| networkId | string | Network identifier, for example, "mainnet01" or "testnet04". |

#### Examples

```typescript
Pact.builder
  .execution('(coin.transfer "alice" "bob" 1.1)')
  // "bob is paying gas fee"
  .setNetworkId("testnet04"): IBuilder;
```

## Creating transactions

After you set all parts of the command, you can create the transaction object by
calling the `createTransaction` method. 
This method adds all of the default values to the command, converts `cmd` to a string, and adds the hash. 
You must add signatures to the transaction object using a wallet to submit the transaction to the blockchain.
For information about adding signatures from a wallet, see [Signing transactions](#signing-transactions).

```typescript
const transaction: IUnsignedCommand = Pact.builder
  .execution(code)
  .createTransaction(); // : { cmd:"stringified-command" , hash:"command-hash" , sig: [] };
```

### Examples

```typescript
const transaction = Pact.builder
  .execution(Pact.modules.coin.transfer(senderAccount, receiverAccount, amount))
  .addSigner(senderKey, (signFor) => [
    signFor('coin.GAS'),
    signFor('coin.TRANSFER', senderAccount, receiverAccount, amount),
  ])
  .setMeta({ chainId: '0', senderAccount })
  .setNetworkId(NETWORK_ID)
  .createTransaction();

const output = {
  cmd: '{"payload":{"exec":{"code":"(coin.transfer \\"k:dc20ab800b0420be9b1075c97e80b104b073b0405b5e2b78afd29dd74aaf5e46\\" \\"k:2f48080efe54e6eb670487f664bcaac7684b4ebfcfc8a3330ef080c9c97f7e11\\" 1.0)","data":{}}},"nonce":"kjs:nonce:1711376792115","signers":[{"pubKey":"dc20ab800b0420be9b1075c97e80b104b073b0405b5e2b78afd29dd74aaf5e46","scheme":"ED25519","clist":[{"name":"coin.GAS","args":[]},{"name":"coin.TRANSFER","args":["k:dc20ab800b0420be9b1075c97e80b104b073b0405b5e2b78afd29dd74aaf5e46","k:2f48080efe54e6eb670487f664bcaac7684b4ebfcfc8a3330ef080c9c97f7e11",{"decimal":"1"}]}]}],"meta":{"gasLimit":2500,"gasPrice":1e-8,"sender":"k:dc20ab800b0420be9b1075c97e80b104b073b0405b5e2b78afd29dd74aaf5e46","ttl":28800,"creationTime":1711376792,"chainId":"0"},"networkId":"testnet04"}',
  hash: 'xYePm_YgO6-T9yIlCZWzOt2s4CkZcQwqWx9Iu5tVSLI',
  sigs: [undefined],
};
```

### getCommand

If you prefer to have the non-stringified version of the command, you can use
`getCommand`.

```typescript
const transaction: IPactCommand = Pact.builder.execution(code).getCommand();
```

#### Examples

```typescript
const command = Pact.builder
  .execution(Pact.modules.coin.transfer(senderAccount, receiverAccount, amount))
  .addSigner(senderKey, (signFor) => [
    signFor('coin.GAS'),
    signFor('coin.TRANSFER', senderAccount, receiverAccount, amount),
  ])
  .setMeta({ chainId: '0', senderAccount })
  .setNetworkId(NETWORK_ID)
  .getCommand();

const output = {
  payload: {
    exec: {
      code: '(coin.transfer "k:dc20ab800b0420be9b1075c97e80b104b073b0405b5e2b78afd29dd74aaf5e46" "k:2f48080efe54e6eb670487f664bcaac7684b4ebfcfc8a3330ef080c9c97f7e11" 1.0)',
      data: {},
    },
  },
  nonce: 'kjs:nonce:1711448853909',
  signers: [
    {
      pubKey:
        'dc20ab800b0420be9b1075c97e80b104b073b0405b5e2b78afd29dd74aaf5e46',
      scheme: 'ED25519',
      clist: [
        { name: 'coin.GAS', args: [] },
        {
          name: 'coin.TRANSFER',
          args: [
            'k:dc20ab800b0420be9b1075c97e80b104b073b0405b5e2b78afd29dd74aaf5e46',
            'k:2f48080efe54e6eb670487f664bcaac7684b4ebfcfc8a3330ef080c9c97f7e11',
            { decimal: '1' },
          ],
        },
      ],
    },
  ],
  meta: {
    gasLimit: 2500,
    gasPrice: 1e-8,
    sender:
      'k:dc20ab800b0420be9b1075c97e80b104b073b0405b5e2b78afd29dd74aaf5e46',
    ttl: 28800,
    creationTime: 1711448853,
    chainId: '0',
  },
  networkId: 'testnet04',
};
```

### initialPactCommand

If you find yourself repeating certain parts of methods for different commands,
you can create your own command builder by using the `createTransactionBuilder` function. This function
allows you to set all of the default values once and then reuse them in `createTransaction`.

| Parameter | Type                  | Description              |
| --------- | --------------------- | ------------------------ |
| initial   | Partial<IPactCommand> | The initial Pact command values that you want to reuse. |

```typescript
const builder: ITransactionBuilder =
  createTransactionBuilder(initialPactCommand);
```

#### Examples

To create a transaction builder with network and chain already set:

```typescript
// Pre-configure the builder
export const txBuilder = createTransactionBuilder({ networkId: "mainnet01", meta: { chainId: "1" } });

// Then somewhere in the code

const command = txBuilder
    .execution(Pact.modules.coin.transfer(senderAccount, receiverAccount, amount))
    .addSigner(senderKey, (signFor) => [
      signFor('coin.GAS'),
      signFor('coin.TRANSFER', senderAccount, receiverAccount, amount),
    ])
    .setMeta({ senderAccount })

const output = const output = {
  payload: {
    exec: {
      code: '(coin.transfer "k:dc20ab800b0420be9b1075c97e80b104b073b0405b5e2b78afd29dd74aaf5e46" "k:2f48080efe54e6eb670487f664bcaac7684b4ebfcfc8a3330ef080c9c97f7e11" 1.0)',
      data: {},
    },
  },
  nonce: 'kjs:nonce:1711448853909',
  signers: [
    {
      pubKey:
        'dc20ab800b0420be9b1075c97e80b104b073b0405b5e2b78afd29dd74aaf5e46',
      scheme: 'ED25519',
      clist: [
        { name: 'coin.GAS', args: [] },
        {
          name: 'coin.TRANSFER',
          args: [
            'k:dc20ab800b0420be9b1075c97e80b104b073b0405b5e2b78afd29dd74aaf5e46',
            'k:2f48080efe54e6eb670487f664bcaac7684b4ebfcfc8a3330ef080c9c97f7e11',
            { decimal: '1' },
          ],
        },
      ],
    },
  ],
  meta: {
    gasLimit: 2500,
    gasPrice: 1e-8,
    sender:
      'k:dc20ab800b0420be9b1075c97e80b104b073b0405b5e2b78afd29dd74aaf5e46',
    ttl: 28800,
    creationTime: 1711448853,
    // Default value
    chainId: '1',
  },
  // Default value
  networkId: 'mainnet01',
};

```

## Signing transactions

After creating the command, you need to sign it using the appropriate private keys.
The signing process is usually managed with a wallet. Kadena has two protocols for
signing transactions, each serving different purposes:

- **Sign API**: This API allows users to send their sign requests to the wallet.
  The wallet is then responsible for creating and signing the transaction
  simultaneously. With this approach, the wallet has more freedom, making it
  more suitable for simple transactions.

- **Quicksign**: This API is designed to give dApps full control over the
  command, with the wallet only responsible for adding signatures. This is the
  recommended method if you are using the command builder from this library.

Wallets typically have their own API for communicating with applications. 
You can use the API provided by the wallet, or, depending on the wallet, use one of the wallet-specific wrapper functions for convenience.

### Sign function interface

The `sign` function can be used two ways: 
If you pass a single transaction to the function, it returns the single signed (or partially signed) transaction.
If you pass a list of transactions to the function, it returns the list of signed (or partially signed) transactions.

```typescript
interface ISignFunction {
  (transaction: IUnsignedCommand): Promise<ICommand | IUnsignedCommand>;
  (
    transactionList: IUnsignedCommand[],
  ): Promise<Array<ICommand | IUnsignedCommand>>;
}
```

#### Single transaction

| Parameter | Type             | Description     |
| --------- | ---------------- | --------------- |
| tx        | IUnsignedCommand | The transaction to be signed. |

#### List of transactions

| Parameter | Type               | Description                                |
| --------- | ------------------ | ------------------------------------------ |
| tsList    | IUnsignedCommand[] | List of the transactions to be signed. |

### Chainweaver

You can use `createSignWithChainweaver` to sign a transaction using Chainweaver. 
It's a factory function that returns the actual sign function.

This function uses the `quicksign` protocol.

```typescript
createSignWithChainweaver(options:{ host?: string }): ISignFunction
```

| Parameter | Type              | Description                                                           |
| --------- | ----------------- | --------------------------------------------------------------------- |
| option    | { host?: string } | option including host URL default `{ host: 'http://127.0.0.1:9467' }` |

#### Examples

To sign one transaction using Chainweaver:

```typescript
const signWithChainweaver = createSignWithChainweaver();

const transaction = Pact.builder
  .execution(Pact.modules.coin.transfer(senderAccount, receiverAccount, amount))
  .addSigner(senderKey, (signFor) => [
    signFor('coin.GAS'),
    signFor('coin.TRANSFER', senderAccount, receiverAccount, amount),
  ])
  .setMeta({ chainId: '0', senderAccount })
  .setNetworkId(NETWORK_ID)
  .createTransaction();

const signedTx = signWithChainweaver(transaction);
```

To sign two transactions using Chainweaver:

```typescript
const signWithChainweaver = createSignWithChainweaver();

const [txOneSigned, txTwoSigned] = signWithChainweaver([txOne, txTwo]);
```

### WalletConnect

The WalletConnect protocol and helper functions are based on [KIP-017](https://github.com/kadena-io/KIPs/blob/master/kip-0017.md).
You must use the WalletConnect protocol to create a walletConnect client and session before you can use the helper functions to sign transactions.

#### Wallet Connect sign method

The `createWalletConnectSign` function returns the `sign` function using the `sign` protocol.

The return object might contain different data than what you would pass from the transaction builder because the `sign` protocol lets the wallet create the transaction.

```typescript
createWalletConnectSign(client, session, walletConnectChainId): (transaction: IUnsignedCommand): Promise<ICommand | IUnsignedCommand>
```

| Parameter | Type | Description | 
| --------- - | ---- | ----------- | 
| client | Client | The `wallet-connect` client object. | 
| session | SessionTypes.Struct | The wallet-connect session object. |
| networkId | string | The network identifier, for example, `mainnet01` or `testnet04`. The identifier can include the `kadena:` prefix, for example, `kadena:mainnet01`. |

##### Examples

```typescript
const signWithWalletConnect = createWalletConnectSign(
  client,
  session,
  'mainnet01',
);

const signedTx = signWithWalletConnect(tx);
```

#### Wallet Connect quicksign method

The `createWalletConnectQuicksign` function returns the `sign` function using the`quicksign` protocol.

```typescript
createWalletConnectQuicksign(client, session, walletConnectChainId): ISignFunction
```

| Parameter | Type                | Description                                                                                                    |
| --------- | ------------------- | -------------------------------------------------------------------------------------------------------------- |
| client | Client | The `wallet-connect` client object. | 
| session | SessionTypes.Struct | The wallet-connect session object. |
| networkId | string | The network identifier, for example, `mainnet01` or `testnet04`. The identifier can include the `kadena:` prefix, for example, `kadena:mainnet01`. |

##### Examples

```typescript
const quicksignWithWalletConnect = createWalletConnectQuicksign(
  client,
  session,
  'mainnet01',
);

const signedTx = quicksignWithWalletConnect(tx);
```

### EckoWallet

The following functions provide the `sign` and `quicksign` protocols for EckoWallet to return a `sign` function and other properties:

```typescript
const { isInstalled, isConnected, connect } = createEckoWalletSign();
const { isInstalled, isConnected, connect } = createEckoWalletQuicksign();
```

#### isInstalled

You can use `isInstalled` to check if the EckoWallet extension is installed in the browser.

```typescript
isInstalled(): boolean
```

#### isConnected

You can use `isConnected` to check if the application is already connected to EckoWallet.

```typescript
isConnected(): Promise<boolean>
```

#### connect

You can use `connect` to send a connection request to EckoWallet.

```typescript
connect(networkId: string): Promise<boolean>
```

#### createEckoWalletSign

The `createEckoWalletSign` function uses the `sign` protocol to communicate with EckoWallet.
The return object might contain different data than what you would pass from the transaction builder because the `sign` protocol lets the wallet create the transaction.

```typescript
createEckoWalletSign(options:{ host?: string }): (transaction: IUnsignedCommand): Promise<ICommand | IUnsignedCommand>
```

##### Examples
To sign a transaction using EckoWallet:
```typescript
const signWithEckoWallet = createEckoWalletSign();

// the wallet will create the completed one
const partialTx = Pact.builder
  .execution(Pact.modules.coin.transfer(senderAccount, receiverAccount, amount))
  .addSigner(senderKey, (signFor) => [
    signFor('coin.GAS'),
    signFor('coin.TRANSFER', senderAccount, receiverAccount, amount),
  ])
  .setMeta({ chainId: '0' })
  .setNetworkId(NETWORK_ID)
  .createTransaction();

const signedTx = signWithEckoWallet(partialTx);
```

#### createEckoWalletQuicksign

The `createEckoWalletQuicksign` function uses the `quicksign` protocol to communicate with EckoWallet.

```typescript
createEckoWalletQuicksign(options:{ host?: string }): ISignFunction
```

##### Examples

To sign one transaction using the `quicksign` protocol and EckoWallet:

```typescript
const quicksignWithEckoWallet = createEckoWalletQuicksign();

const tx = Pact.builder
  .execution(Pact.modules.coin.transfer(senderAccount, receiverAccount, amount))
  .addSigner(senderKey, (signFor) => [
    signFor('coin.GAS'),
    signFor('coin.TRANSFER', senderAccount, receiverAccount, amount),
  ])
  .setMeta({ chainId: '0', senderAccount })
  .setNetworkId(NETWORK_ID)
  .createTransaction();

const signedTx = quicksignWithEckoWallet(partialTx);
```

To sign two transactions using the `quicksign` protocol and EckoWallet:

```typescript
const quicksignWithEckoWallet = createEckoWalletQuicksign();

const [txOneSigned, txTwoSigned] = quicksignWithEckoWallet([txOne, txTwo]);
```

### Sign with a public and secret key pair

If you have a secret key in a safe environment—for example, a server environment or CI test pipeline—you can sign transactions with the `createSignWithKeypair` function to returns the `sign` function.

The `IKeyPair` interface is defined as followis:

```typescript
interface IKeyPair {
  publicKey: string;
  secretKey: string;
}
```

```typescript
createSignWithKeypair(keyOrKeys:IKeyPair | IKeyPair[]): ISignFunction
```

#### Examples

To sign with one key pair:

```typescript
const signWithKeypair = createSignWithKeypair({ publicKey, secretKey });

const signedTx = signWithKeypair(tx);
```

To sign with several key pairs:

```typescript
const signWithKeypair = createSignWithKeypair([firstKeyPair, secondKeyPair]);

const signedTx = signWithKeypair(tx);
```

### addSignatures

If you already have the signature for a transaction, you can use the `addSignatures` function to add the signature to the transaction.

All signatures you add should either include a public key, or none of them should. 
If the signatures don't include the public keys, then the number of signatures must match the number of signers, and the signatures are matched based on their order.

```typescript
addSignatures(transaction, ...signatures): IUnsignedCommand | ICommand
```

| Parameter     | Type      | Description                                                 |
| ------------- | ------- | ---------------------------------------- |
| transaction   | IUnsignedCommand  | The partially signed or unsigned transaction.   |
| ...signatures | Array<{ sig: string; pubKey: string }> \| Array<{ sig: string }> | List of signatures to be added to the transaction. |

#### Examples

To add a signature manually with a public key:

```typescript
const signedTx = addSignatures(partiallySignedTx, {
  sig: 'signature-str',
  pubKey: 'publicKey',
});
```

To add a signature based on the signer order:

```typescript
const signedTx = addSignatures(
  twoSignersTx,
  { sigOne: 'signature-str' },
  { sigTwo: 'signature-str' },
);
```

## Communicating with the network

Kadena exposes endpoints for communicating with Chainweb nodes through the [Pact REST API}(https://api.chainweb.com/openapi/pact.html). 
You can use any REST client to call these endpoints.
However, the Kadena client library also provides functions to make these call more convenient for frontend frameworks.

### createClient

To use the helper functions for communicating with Chainweb nodes, you must first use the `createClient` function to return the `IClient` interface.

```typescript
createClient(
  host?: string | (options: {chainId: ChainId; networkId: string}) => string,
  options?: { confirmationDepth?: number }
): IClient

interface IClient {
  getStatus: (transactionDescriptors: ITransactionDescriptor[] | ITransactionDescriptor) => Promise<IPollResponse>;
  submit: {
    (transaction: ICommand): Promise<ITransactionDescriptor>;
    (transactionList: ICommand[]): Promise<ITransactionDescriptor[]>;
  }
  send: {
    (transaction: ICommand): Promise<ITransactionDescriptor>;
    (transactionList: ICommand[]): Promise<ITransactionDescriptor[]>;
  }
  submitOne: (transaction: ICommand) => Promise<ITransactionDescriptor>;
  listen: (transactionDescriptor: ITransactionDescriptor) => Promise<ICommandResult>;
  pollOne: (transactionDescriptor: ITransactionDescriptor) => Promise<ICommandResult>;
  pollStatus: (transactionDescriptors: ITransactionDescriptor[] | ITransactionDescriptor, options?: IPollOptions) => IPollRequestPromise<ICommandResult>;
  getPoll: (transactionDescriptors: ITransactionDescriptor[] | ITransactionDescriptor) => Promise<IPollResponse>;
  local: <T extends ILocalOptions>(transaction: LocalRequestBody, options?: T) => Promise<LocalResponse<T>>;
  dirtyRead: (transaction: IUnsignedCommand) => Promise<ICommandResult>;
  preflight: (transaction: ICommand | IUnsignedCommand) => Promise<ILocalCommandResult>;
  signatureVerification: (transaction: ICommand) => Promise<ICommandResult>;
  runPact: (code: string, data: Record<string, unknown>, option: INetworkOptions) => Promise<ICommandResult>;
  createSpv: (transactionDescriptor: ITransactionDescriptor, targetChainId: ChainId) => Promise<string>;
  pollCreateSpv: (transactionDescriptor: ITransactionDescriptor, targetChainId: ChainId, options?: IPollOptions) => Promise<string>;
}
```

You can use object destructuring to extract specific functions.

```typescript
const { submit, local, pollCreateSpv } = createClient();
```

| Parameter | Type                                                                 | Description                                                                                                                                         |
| --------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| host      | string \| (options: {chainId: ChainId; networkId: string}) => string | The Pact service URL as a string or the function that returns the URL.                                                                              |
| options   | { confirmationDepth?: number }                                       | Additional options for the client. It has only one property now: `confirmationDepth`, which can be used in the poll endpoint. Default value is `0`. |

Both `host` and `options` are optional. 
The default value of `host` is a function that returns the Chainweb node URLs for mainnet and testnet. 
If you want to use different URLs, you must specify the `host` parameter.

The `networkId` and `chainId` parameters are read from the command object and passed to the URL generator function.

#### Examples

To create a client for the development network and a specific chain identifier (1):

```typescript
const client = createClient("http://127.0.0.1:8080/chainweb/0.0/development/chain/1/pact");
```

To create a client for the development network that covers multi-chain and uses
 the URL generator function for more flexibility:

```typescript
const devNetClient = createClient(({chainId, networkId})=>
   `http://127.0.0.1:8080/chainweb/0.0/${networkId}/chain/${chainId ?? '1'}/pact`
);
```

To create a client that uses `mainnet` but not Kadena main network nodes:

```typescript
const client = createClient(({ chainId, networkId }) => {
  switch (networkId) {
    case 'mainnet01':
      return `http://my-node-url/chainweb/0.0/${networkId}/chain/{${chainId}}/pact`;
    case 'testnet04':
      return `http://my-test-node-url/chainweb/0.0/${networkId}/chain/{${chainId}}/pact`;
    default:
      throw new Error('UNKNOWN_NETWORK');
  }
});
```

To create a client with a `confirmationDepth` of `5` that waits for five new blocks to be added to the chain before reading the result of a transaction:

```typescript
const { submit, pollStatus } = createClient(undefined, { confirmationDepth: 5 });
```

## Submitting transactions

You can use the `submit` or `submitOne` functions to submit data to the blockchain. 
These functions use the Pact `/send` endpoint.

The client `send` function is a deprecated alias for the `submit` function with the same interface.
To submit one transaction using the `submit` function:

```typescript
const { submit } = createClient();

submit(tx): Promise<ITransactionDescriptor>;

interface ITransactionDescriptor {
  networkId: string;
  chainId: ChainId;
  requestKey: string
}

```

| Parameter | Type     | Description                        |
| --------- | -------- | ---------------------------------- |
| tx        | ICommand | The command object ready to submit. |

To submit a list of transactions using the `submit` function:

```typescript
const { submit } = createClient();

submit(txList): Promise<ITransactionDescriptor[]>;
```

| Parameter | Type       | Description                         |
| --------- | ---------- | ----------------------------------- |
| txList    | ICommand[] | List of command objects ready to submit. |

In most cases, you should store the result of this function so you can fetch the result of the request.

The `submitOne` function is the same as submitting one transaction using the `submit` function.
For example:

```typescript
const { submitOne } = createClient();

submitOne(tx): Promise<ITransactionDescriptor>;
```

| Parameter | Type     | Description                        |
| --------- | -------- | ---------------------------------- |
| tx        | ICommand | The command object ready to submit. |

## Getting transaction results

After you submit a transaction, you need to query for the result using a request key.
You can query transaction results by calling the `/listen` or `/poll` endpoint. 
- The `/listen` endpoint is a blocking request. It only accepts one request key and returns the results when the transaction result is ready. If you use this endpoint, the HTTP request remains open for a while. 
- The`/poll` endpoint accepts a list of request keys and responds immediately with the current status of the request key.

The Kadena client library exposes the following functions to use the /listen or /poll endpoint in different scenarios:

- `getStatus`
- `pollStatus`
- `listen`
- `pollOne`

These functions all return the result of a transaction with the following `ICommandResult` interface:

```typescript
interface ICommandResult {
  reqKey: string;
  txId: number | null;
  result:
    | {
        status: 'success';
        data: PactValue;
      }
    | {
        status: 'failure';
        error: object;
      };
  gas: number;
  logs: string | null;
  // for defpact functions
  continuation: null | {
    pactId: PactTransactionHash;
    step: Step;
    stepCount: number;
    executed: boolean | null;
    stepHasRollback: boolean;
    continuation: {
      def: string;
      args: PactValue;
    };
    yield: {
      data: Array<[string, PactValue]>;
      provenance: {
          targetChainId: ChainId;
          moduleHash: string;
      } | null;
    };
  };
  metaData: null | {
    blockHash: string;
    blockTime: number;
    blockHeight: number;
    prevBlockHash: string;
    publicMeta?: IPactCommand['meta']
  };
  events: Array<{
    name: string;
    module: {
      name: string;
      namespace: string | null;
    };
    params: Array<PactValue>;
    moduleHash: string;
  }>;
}
```

### getStatus

This function calls `/poll` and returns the result of requests.

```typescript
const { getStatus } = createClient();

getStatus(transactionDescriptor: TransactionDescriptor[] | ITransactionDescriptor): Promise<{
    [requestKey: IBase64Url]: { [requestKey:string] ICommandResult};
}>
```

| Parameter             | Type                                             | Description                           |
| --------------------- | ------------------------------------------------ | ------------------------------------- |
| transactionDescriptor | TransactionDescriptor \| TransactionDescriptor[] | One or list of requests to be queried |

### pollStatus

This function calls `/poll` in intervals and returns the result of all requests
when all are ready.

```typescript
const { pollStatus } = createClient();

pollStatus(
  transactionDescriptor: TransactionDescriptor[] | ITransactionDescriptor,
  pollOptions: {
    onPoll?: (id: string) => void;
    timeout?: Milliseconds;
    interval?: Milliseconds;
    confirmationDepth?: number;
  }
): IPollRequestPromise<{
    [requestKey: IBase64Url]: { [requestKey:string] ICommandResult};
}>

interface IPollRequestPromise extends Promise {
  [requestKey: IBase64Url]: Promise<ICommandResult>
}
```

| Parameter | Type  | Description   |
| --------- | ----- | ------------- |
| transactionDescriptor | TransactionDescriptor \| TransactionDescriptor[] | One or list of requests to be queried  |
| pollOptions           | { onPoll?: (id: string) => void; timeout?: Milliseconds; interval?: Milliseconds; confirmationDepth?: number; } | onPoll: Callback is called when the request is polling; this might be called several times if the request is not ready yet. Timeout: Timeout if the result is not ready (default `180000` // 3 minutes). Interval: Delay between retries (default is `5000` // 5 seconds). ConfirmationDepth: Set the confirmationDepth for getting the response; this overrides the one you set in createClient function |

**Return value:** The return value is a special type of promise. Though you can
just await for the result just like a normal promise - which is the case for
most of the typical use cases - you can still listen for each individual request
via the `requests` property.

#### Examples

Poll the status of a request:

```typescript
const result = await pollStatus(request, {});
```

Poll the status of several requests and get the result for each one immediately:

```typescript
const resultPromise = pollStatus([firstRequest, secondRequest, thirdRequest]);
// Notify the UI from the result of each request as soon as it's available
resultPromise.requests["first-request-key"].then(res => {UI.notify(res)});
resultPromise.requests["second-request-key"].then(res => {UI.notify(res)});
resultPromise.requests["third-request-key"].then(res => {UI.notify(res)});
// The final result object
const finalResult = await resultPromise;
```

### listen

`listen` is another function for fetching the result of one request. It uses the
`/listen` endpoint, which is a blocking endpoint. **Note**: If your
network/firewall configuration doesn't allow keeping HTTP connections open for a
long time, then it's better to use `pollOne` which has the same interface but
uses `/poll` under the hood.

```typescript
const { listen } = createClient();

listen(transactionDescriptor: TransactionDescriptor[] | ITransactionDescriptor): Promise<ICommandResult>
```

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| transactionDescriptor | TransactionDescriptor | The request object including `requestKet`, `networkId`, `chainId` |

### pollOne

The `pollOne` function fetches the result of only one request via the `/poll`
endpoint.

```typescript
const { pollOne } = createClient();

pollOne(transactionDescriptor: TransactionDescriptor[] | ITransactionDescriptor): Promise<ICommandResult>
```

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| transactionDescriptor | TransactionDescriptor | The request object including `requestKet`, `networkId`, `chainId` |

## Reading data

Apart from transactions, you can also send read requests to the node. This
mainly utilizes the `/local` endpoint. These kinds of requests return the result
immediately since you don't need to submit data. You can also use these
functions to validate your transaction before calling the `/send` endpoint to
avoid transaction failure, as in some scenarios you need to pay gas even for
failed transactions.

The following functions all utilize the `/local` endpoint:

- `local`
- `dirtyRead`
- `preflight`
- `signatureVerification`
- `runPact`

### local

The `local` function is the most generic function that utilizes the `/local`
endpoint.

```typescript
local(
  transaction: ICommand | IUnsignedCommand,
  options?: { preflight?: boolean; signatureVerification?: boolean; }
): Promise<ICommandResult & { preflightWarnings?: string[] }>;
```

The return type is `ICommandResult` with `preflightWarnings` when it is set to
true.

| Parameter   | Type                                                      | Description                                                                                                                                                                                                                                                                                                            |
| ----------- | --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| transaction | ICommand \| IUnsignedCommand                              | The signed or unsigned command object                                                                                                                                                                                                                                                                                  |
| option      | { preflight?: boolean; signatureVerification?: boolean; } | preflight: Runs the code in the preflight mode which simulates submitting the transaction so you can also have the gas consumption result (default = `true`). SignatureVerification: Run the signature verification in the node as well; then the transaction should have the transactions as well (default = `true`). |

#### Examples

Use local call to avoid submitting an incorrect transaction:

```typescript
// Check if the transaction and signatures are correct
const response = await client.local(signedTx);

if (response.result.status === 'failure') {
  // Throw if the transaction fails to avoid paying gas for a failed transaction
  throw response.result.error;
}
const request = await client.submit(signedTx);
```

Use local call for gas estimation:

```typescript
// We don't need to send signatures to check gas estimation;
const response = await client.local(unsignedTx, { preflight:true , signatureVerification: false });

if (response.result.status === 'failure') {
  throw response.result.error;
}

const gasEstimation =  response.gas;
```

### dirtyRead

Alias for local where both preflight and signatureVerification are false; useful
when your code only includes reading data from the node.

```typescript
dirtyRead(transaction: ICommand | IUnsignedCommand): Promise<ICommandResult>;
```

| Parameter   | Type                         | Description                           |
| ----------- | ---------------------------- | ------------------------------------- |
| transaction | ICommand \| IUnsignedCommand | The signed or unsigned command object |

#### Examples

Get account balance

```typescript
const tr = Pact.builder
  .execution(Pact.modules.coin['get-balance'](account))
  .setMeta({ chainId: '0' })
  .setNetworkId("mainnet04")
  .createTransaction();

// We don't need to submit a transaction for just reading data,
// so instead we just read the value from the local data of the blockchain node
const res = await dirtyRead(tr);

if (res.result.status === 'failure') {
  throw res.result.error;
}

const balance = res.result.data;
```

### preflight

Alias for local where preflight is true but signatureVerification is false.

```typescript
preflight(transaction: ICommand | IUnsignedCommand): Promise<ICommandResult>;
```

| Parameter   | Type                         | Description                           |
| ----------- | ---------------------------- | ------------------------------------- |
| transaction | ICommand \| IUnsignedCommand | The signed or unsigned command object |

### signatureVerification

Alias for local where preflight is false but signatureVerification is true.

```typescript
signatureVerification(transaction: ICommand | IUnsignedCommand): Promise<ICommandResult & { preflightWarnings?: string[] }>;
```

| Parameter   | Type                         | Description                           |
| ----------- | ---------------------------- | ------------------------------------- |
| transaction | ICommand \| IUnsignedCommand | The signed or unsigned command object |

### runPact

If you just want to see the result of a pact code and don't want to create a
command object, you can use the `runPact` function. This function creates a
command object internally.

```typescript
runPact(code: string, data?: Record<string, unknown>, options?: { chainId: ChainId; networkId: string }): Promise<ICommandResult>;
```

| Parameter | Type | Description                                                    |
| --------- | -----| -------------------------------------------------------------- |
| code      | string                                  | Pact code                                                      |
| data      | Record<string, unknown>                 | Data to be sent with the transaction                           |
| options   | { chainId: ChainId; networkId: string } | ChainId and networkId that you want to send the transaction to |

#### Examples

```typescript
const { runPact } = createClient()

const result = await runPact(`(coin.getBalance "alice")`, { }, { networkId:"mainnet01", chainId:"1" })

```

### Requesting simple payment verification (spv)

You need SPV proof mainly for cross-chain transactions - but it's not limited to
this, and you can request SPV proof for all kinds of transactions.

There are two functions for this purpose, both of which use the `/spv` endpoint:

- `createSPV`
- `pollCreateSPV`

### createSPV

Request SPV proof if it's ready.

```typescript
createSpv(transactionDescriptor: ITransactionDescriptor, targetChainId: ChainId): Promise<string>;
```

| Parameter             | Type                                                        | Description                                               |
| --------------------- | ----------------------------------------------------------- | --------------------------------------------------------- |
| transactionDescriptor | { requestKey: string; networkId: string; chainId: ChainId } | The transaction for which you want to create an SPV proof |
| targetChainId         | ChainId                                                     | The chain that consumes this proof                        |

### pollCreateSPV

Poll for the SPV proof and await until it's ready.

```typescript
pollCreateSpv(
  transactionDescriptor: ITransactionDescriptor,
  targetChainId: ChainId,
  pollOptions?: { onPoll?: (id: string) => void; timeout?: Milliseconds; interval?: Milliseconds; }
): Promise<string>;
```

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| transactionDescriptor | { requestKey: string; networkId: string; chainId: ChainId } | The transaction for which you want to create an SPV proof. |
| targetChainId | ChainId | The chain that consumes this proof. |
| pollOptions | { onPoll?: (id: string) => void; timeout?: Milliseconds; interval?: Milliseconds; } | onPoll: Callback is called when the request is polling; this might be called several times if the request is not ready yet. Timeout: Timeout if the result is not ready (default `180000` // 3 minutes). Interval: Delay between retries (default is `5000` // 5 seconds) |

#### Examples

```typescript
const request = await submit(crossChainTx)
const response = await pollOne(request)
// create spv proof for the transaction
const spvProof = await pollSpvProof(request)

const continuationTx = Pact.builder.continuation({
  pactId: response.continuation.pactId,
  rollback: false,
  step:1,
  proof: spvProof
}).addMeta({
  chainId: targetChainId,
  // using gas station for paying gas fee
  senderAccount : 'kadena-xchain-gas'
}).createTransaction()

const contRequest = await submit(continuationTx)
const finalResult = await pollOne(contRequest)
```

## Functional programming to compose Pact commands

For additional flexibility, you can use the functional programming (FP) API to create Pact commands.
The functional programming (FP) API supports the same functions as the command builder API.
In fact, the command builder API uses the functional programming (FP) API under the hood.
To reduce redundancy, this section lists the common functions with examples for using the `composePactCommand` function rather than repeating the full function descriptions and parameter tables.

### Importing functions

To use the functional programming (FP) API, import functions from the `@kadena/client/fp` package.
For example:

```typescript
import { composePactCommand, execution } from '@kadena/client/fp';
```

### composePactCommand

The `composePactCommand` function let you compose parts of the Pact command and create the final command objects.
The function accepts pure JSON as well as reducer functions. 
This function eventfully returns the `IPartialPactCommand` interface that is converted to a string for the `cmd` key in the JSON command object.

```typescript
type CommandReducer = (cmd?: IPartialPactCommand | (() => IPartialPactCommand)) => IPartialPactCommand;

composePactCommand(
  ...reducersOrPartialCommands: Array<IPartialPactCommand | CommandReducer>
  ): CommandReducer
```

The return value is also a `CommandReducer` function that you can pass to another `composePactCommand` call. 
Eventually, when you call the function, it also adds the default values.

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| ...reducersOrPartialCommands | Array<IPartialPactCommand \| CommandReducer> | List of command reducers or partial Pact commands. |

#### Examples

```typescript
const pactCommand = composePactCommand(
  { payload: { exec: { code: '(+ 1 1)' } } },
  (cmd) => ({ ...cmd, meta: { chainId: '1' } }),
  { networkId: 'testnet04' },
)();

const pactCommand = {
  payload: { exec: { code: '(+ 1 1)' } },
  meta: {
    gasLimit: 2500,
    gasPrice: 1e-8,
    sender: '',
    ttl: 28800,
    creationTime: 1690416000,
    chainId: '1',
  },
  networkId: 'testnet04',
  nonce: 'kjs:nonce:1690416000000',
  signers: [],
};
```

### execution

To create `IPactCommand.payload.exec.code`:

```typescript
execution(...codes): { payload: { exec : { code: string, data: {} } }}
```

For example, using strings:

```typescript
const command: IPactCommand = composePactCommand(
  execution(`(coin.transfer "alice" "bob" 1.1)`),
)();
```

For example, using `Pact.modules`:

```typescript
const command: IPactCommand = composePactCommand(
  execution(Pact.modules.coin.transfer('alice', 'bob', { decimal: '1.1' })),
)();
```

### continuation

To create `IPactCommand.payload.cont`:

```typescript
continuation(contData: {
  pactId?: string;
  step?: number;
  rollback?: boolean;
  data?: Record<string, unknown>;
  proof?: string | null;
}): {
  payload: {
    cont: {
      pactId?: string;
      step?: number;
      rollback?: boolean;
      data?: Record<string, unknown>;
      proof?: string | null;
    };
  };
};
```

For example:

```typescript
const command: IPactCommand = composePactCommand(
  continuation({
    pactId,
    rollback: false,
    step:1,
    proof: spvProof
  })
)()
```

### addSigner

To add `IPactCommand.signers`:

```typescript
addSigner(signerOrSignersList, capabilityCallback): CommandReducer;
```

For example, add a signer:

```typescript
// ED25519 key
const alicePublicKey =
  'e7f4da07b1d200f6e45aa6492afed6819297a97563859a5f0df9c54f5abd4aab';

composePactCommand(
  execution(Pact.modules.coin.transfer('alice', 'bob', { decimal: '1.1' })),
  addSigner(alicePublicKey, (signFor) => [
    signFor('coin.TRANSFER', 'alice', 'bob', { decimal: '1.1' }),
  ]),
);
```

Add a signer with `WebAuthn` scheme:

```typescript
composePactCommand(
  execution(Pact.modules.coin.transfer('alice', 'bob', { decimal: '1.1' })),
  addSigner({ pubKey: webAuthnPublicKey, scheme: 'WebAuthn' }, (signFor) => [
    signFor('coin.TRANSFER', 'alice', 'bob', { decimal: '1.1' }),
  ]),
);
```

Add a list of signers with no capabilities:

```typescript
composePactCommand(
  execution('(free.my-module.my-function)'),
  addSigner([
    'ED25519_publicKey',
    { pubKey: 'WebAuthn_publicKey', scheme: 'WebAuthn' },
  ]),
);
```

Add a list of signers with similar capabilities:

```typescript
const pactCommand = composePactCommand(
  execution(Pact.modules.coin.transfer('alice', 'bob', { decimal: '1.1' })),
  // e.g., Alice's account is guarded by two keys
  addSigner(['first_publicKey', 'second_publicKey'], (signFor) => [
    signFor('coin.TRANSFER', 'alice', 'bob', { decimal: '1.1' }),
  ]),
)();

const equivalentPactCommand = {
  payload: {
    exec: {
      code: '(coin.transfer "alice" "bob" 1.1 )',
      data: {},
    },
  },
  signers: [
    {
      pubKey: 'first_publicKey',
      scheme: 'ED25519',
      clist: [
        { name: 'coin.TRANSFER', args: ['alice', 'bob', { decimal: '1.1' }] },
      ],
    },
    {
      pubKey: 'second_publicKey',
      scheme: 'ED25519',
      clist: [
        { name: 'coin.TRANSFER', args: ['alice', 'bob', { decimal: '1.1' }] },
      ],
    },
  ],
};
```

### addData

To add data to `IPactCommand.payload.exec.data` or `IPactCommand.payload.cont.data`:

```typescript
addData(key, value): CommandReducer
```
For example, to transfer with parameters in data:

```typescript
composePactCommand(
  execution(
    '(coin.transfer (read-string "sender") (read-string "receiver") 1.1)',
  ),
  addData('sender', sender),
  addData('receiver', sender),
);
```

Send the receiver guard:

```typescript
composePactCommand(
  execution(
    '(coin.transfer-create "alice" "bob" (read-keyset "bob-guard") 1.1)',
  ),
  addData('bob-guard', {
    keys: ['bob-public-key'],
    pred: 'keys-all',
  }),
);
```

### addKeyset

To add a keyset:

```typescript
addKeyset(name, pred, ...keys): CommandReducer
```

For example, to add a keyset using the `readKeyset` helper function:

```typescript
composePactCommand(
  execution(
    Pact.modules.coin['transfer-create'](
      'alice',
      'bob',
      readKeyset('bob-guard'),
      { decimal: '1.1' },
    ),
  ),
  addKeyset('bob-guard', 'keys-all', 'bob-public-key'),
);
```

### setMeta

To add `IPactCommand.meta` metadata properties to a command:

```typescript
setMeta(meta): CommandReducer
```

For example:

```typescript
composePactCommand(
  execution('(coin.transfer "alice" "bob" 1.1)'),
  // "bob is paying gas fee"
  setMeta({ chainId: '02', senderAccount: 'bob' }),
);
```

### etNonce

To manually set `IPactCommand.nonce`:

```typescript
setNonce(nonce): { nonce: string };
```

For example:

```typescript
composePactCommand(
  execution('(coin.transfer "alice" "bob" 1.1)'),
  // "bob is paying gas fee"
  setNonce('a-custom-nonce'),
);
```

### setNetworkId

To set `IPactCommand.network`:

```typescript
setNetworkId(networkId): { networkId : string }
```
For example:

```typescript
composePactCommand(
  execution('(coin.transfer "alice" "bob" 1.1)'),
  // "bob is paying gas fee"
  setNetworkId('testnet04'),
);
```

### createTransaction

To create the transaction object:

```typescript
createTransaction(pactCommand:IPactCommand): IUnsignedCommand
```

For example:

```typescript
const pactCommand = composePactCommand(
  execution(Pact.modules.coin.transfer(senderAccount, receiverAccount, amount)),
  addSigner(senderKey, (signFor) => [
    signFor('coin.GAS'),
    signFor('coin.TRANSFER', senderAccount, receiverAccount, amount),
  ]),
  setMeta({ chainId: '0', senderAccount }),
  setNetworkId(NETWORK_ID),
  createTransaction(),
);

const transaction = createTransaction(pactCommand);

const output = {
  cmd: '{"payload":{"exec":{"code":"(coin.transfer \\"k:dc20ab800b0420be9b1075c97e80b104b073b0405b5e2b78afd29dd74aaf5e46\\" \\"k:2f48080efe54e6eb670487f664bcaac7684b4ebfcfc8a3330ef080c9c97f7e11\\" 1.0)","data":{}}},"nonce":"kjs:nonce:1711376792115","signers":[{"pubKey":"dc20ab800b0420be9b1075c97e80b104b073b0405b5e2b78afd29dd74aaf5e46","scheme":"ED25519","clist":[{"name":"coin.GAS","args":[]},{"name":"coin.TRANSFER","args":["k:dc20ab800b0420be9b1075c97e80b104b073b0405b5e2b78afd29dd74aaf5e46","k:2f48080efe54e6eb670487f664bcaac7684b4ebfcfc8a3330ef080c9c97f7e11",{"decimal":"1"}]}]}],"meta":{"gasLimit":2500,"gasPrice":1e-8,"sender":"k:dc20ab800b0420be9b1075c97e80b104b073b0405b5e2b78afd29dd74aaf5e46","ttl":28800,"creationTime":1711376792,"chainId":"0"},"networkId":"testnet04"}',
  hash: 'xYePm_YgO6-T9yIlCZWzOt2s4CkZcQwqWx9Iu5tVSLI',
  sigs: [undefined],
};
```
