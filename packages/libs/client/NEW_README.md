---
title: kadena client
description:
  The @kadena/client library provides a TypeScript-based API for interacting
  with smart contracts and Chainweb nodes on the Kadena network. The library includes modules in
  three categories: creating transactions, signing transactions, and submitting transactions
  to the network.
menu: Reference
label: Kadena client
order: 4
layout: full
tags: ['TypeScript', 'Kadena', 'Kadena client', 'frontend']
---

# Kadena Client

The `@kadena/client` library provides a TypeScript-based API for interacting
with smart contracts and Chainweb nodes on the Kadena network. 
The library includes modules to help you with three types of common tasks:

- Create commands
- Sign transactions
- Interact with the network

If you only need to interact with the `coin` contract, see ["@kadena/client-utils/coin"](../client-utils/README.md) for a simpler API.

In a nutshell, the Kadena client library helps you create **command** objects with the following structure that you can send to the network, then listen for the results returned:

```typescript
interface ICommand {
  cmd: string; // stringified command <IPactCommand> type
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

**Note**: If your use case is simple enough that you can create the JSON
directly, you don't have to use the library. Alternatively, you can just use
some parts of it, not everything.

If you prefer to learn from code, check out the
[client-examples](../client-examples/).

See the following sections for more information:

- [Install](#install)
- [Pact modules](#pact-modules)
- [Command builder](#command-builder)
- [Signing transactions](#signing-transactions)
- [Communicate with the network](#communicate-with-network)
- [FP compose Pact command](#fp-compose-pact-command)
- [Examples](#complete-and-runnable-examples)

## Install

You can install the library with the following command:

```bash
npm install @kadena/client
```

You can import `@kadena/client` functions into a TypeScript/JavaScript program
with the following statement:

```typescript
import { createClient, Pact } from '@kadena/client';
```

The library also exports functional programming utilities under
`@kadena/client/fp`, which offers more flexibility in the FP paradigm.

```typescript
import { composePactCommand } from '@kadena/client/fp';
```

## Pact modules

Interacting with the Kadena blockchain network and Chainweb nodes i mostly a matter of calling smart
contract functions. From the client perspective, you need to write Pact code in a string and pass it to the `IPactCommand.payload.exec.code` interface. 
Without code completion and validation, writing the Pact code string manually is error-prone and vulnerable to code injection.
To simplify the process, you can use `Pact.modules`  to help you:

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

| Parameter | Type        | Description       |
| --------- | ----------- | ----------------- |
| ...args   | PactValue[] | list of arguments |

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

To create the code for the `free.my-module.my-function` that converts a list, objects, and date to valid Pact code:

```typescript
import { Pact } from `@kadena/client`;

const code = Pact.modules["free.my-module"].["my-function"](["first", { time: new Date() }]);
// code === '(free.my-module.my-function ["first" {"time" : (time "2023-07-20T14:55:11Z")} ])'

```

### Create type definition for Pact modules

You can use [@kadena/pactjs-cli](../../tools/pactjs-cli/README.md) to
create the type for the module you use, then the TS provides code completion for
the functions and capabilities.

To create a type definition file for the `coin` contract:

```bash
npx @kadena/pactjs-cli contract-generate --contract coin --api https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/0/pact;
```

## Command builder

A command is a JSON object with three keys: `cmd`, `hash`, and `sig`. 
There are two types of commands.

- [Execution](#execution)
- [Continuation](#continuation)

You can create the JSON object without using the Kadena client library.
However, using the library and `Pact.builder` to create the command object simplifies the process.

### Execution

You can use `Pact.builder` to create an execution command object, `IPactCommand.payload.exec.code`, which is the most common type of transaction and the first step of `defpact` multi-step transactions.

```typescript
Pact.builder.execution(...codes): IBuilder
```

| Parameter | Type     | Description   |
| --------- | -------- | ------------- |
| ...codes   | string[] | List of codes. |

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

### Continuation

You can use `Pact.builder` to create a continuation command object, `IPactCommand.payload.cont`, which is the type of transaction used for additional steps of `defpact` multi-step transactions.
```typescript
Pact.builder.continuation(contData): IBuilder
```

| Parameter | Type                                                                                                    | Description                                                                                       |
| --------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| contData  | { pactId: string, rollback: boolean, step: number, data?: Record<string, any>, proof?: null \| string } | continuation data; step starts from 0; proof is SPV proof that can be generated by calling `/spv` |

#### Example

The `coin.cross-chain` function is a `defpact` multi-step transaction that burns tokens in
the source chain and mints tokens in the destination chain. After the first
step completes successfully, you can call the second step by using the continuation command object.

```TS

const builder: IBuilder = Pact.builder.continuation({
  pactId,
  rollback: false,
  step:1,
  proof: spvProof
})

```

### addSigner

You can use the `addSigner` method to add  public keys and capabilities for a transaction signer to the command. 
You can call `addSigner` multiple times to add more signers to the transaction.
Later, the Chainweb node checks whether all required signers have signed the transaction or not.

```typescript
Pact.builder.execution(...codes).addSigner(signerOrSignersList, capabilityCallback): IBuilder
```

| Parameter          | Type                                                                                                   | Description                                                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| signer             | string \| { pubKey: string; scheme?: 'ED25519' \| 'ETH' \| 'WebAuthn'; address?: string;} \| ISigner[] | Public key of the signer or the signer object (this can also be a list of signers if all of the signers sign for the same capabilities). |
| capabilityCallback | (signFor) => ReturnType<signFor>[]    | Allows you to scope what the signer is signing for to a specific list of capabilities.   |

Chainweb supports the following signature schemes for public keys:

- `ED25519`
- `WebAuthn`
- `ETH`

The default signature scheme is `ED25519`. 
You can pass just the public key if the signature scheme is `ED25519`.
If the scheme is not `ED25519`, you must pass a signer object that includes the pubic key and the signature scheme.

#### Examples

To add a signer for a coin transfer:

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

Here are the corrected sections:

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

Transfer create as string code

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

#### Metadata object properties

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

**Goal**: set `IPactCommand.network`

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

### createTransaction

After you set all parts of the command, you can create the transaction object by
calling the `createTransaction` method. 
This method adds all of the default values to the command, converts `cmd` to a string, and adds the hash. 
You must add signatures to the transaction object using a wallet to submit the transaction to the blockchain.
For information about adding signatures from a wallet, see [wallet-providers](#wallet-providers).

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

## Signing Transactions

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

#### Single Transaction

| Parameter | Type             | Description     |
| --------- | ---------------- | --------------- |
| tx        | IUnsignedCommand | The transaction to be signed. |

#### List of Transactions

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

## Communicate with the network

Kadena exposes endpoints for communicating with Chainweb nodes through the [Pact REST API}(https://api.chainweb.com/openapi/pact.html). 
You can use any REST client to call these endpoints.
However, the Kadena client library also provides functions to make these call more convenient for frontend frameworks.

### createClient

To use the helper functions for communicating with Chainweb nodes, you must first use the `createClient` function to return the `IClient` interface.

```TS
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

**Note**: You can use object destructuring to extract specific functions.

```TS
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

```TS
const client = createClient("http://127.0.0.1:8080/chainweb/0.0/development/chain/1/pact");
```

To create a client for the development network that covers multi-chain and uses
 the URL generator function for more flexibility:

```TS
const devNetClient = createClient(({chainId, networkId})=>
   `http://127.0.0.1:8080/chainweb/0.0/${networkId}/chain/${chainId ?? '1'}/pact`
);
```

To create a client that uses `mainnet` but not Kadena main network nodes:

```TS
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

```TS
const { submit, pollStatus } = createClient(undefined, { confirmationDepth: 5 });
```

### Submit Data to Blockchain

You can use the `submit` or `submitOne` functions to submit data to the blockchain. 
These functions use the Pact `/send` endpoint.

The client `send` function is a deprecated alias for the `submit` function with the same interface.
To submit one transaction using the `submit` function:

```TS
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

```TS
const { submit } = createClient();

submit(txList): Promise<ITransactionDescriptor[]>;
```

| Parameter | Type       | Description                         |
| --------- | ---------- | ----------------------------------- |
| txList    | ICommand[] | List of command objects ready to submit. |

In most cases, you should store the result of this function so you can fetch the result of the request.

The `submitOne` function is the same as submitting one transaction using the `submit` function.
For example:

```TS
const { submitOne } = createClient();

submitOne(tx): Promise<ITransactionDescriptor>;
```

| Parameter | Type     | Description                        |
| --------- | -------- | ---------------------------------- |
| tx        | ICommand | The command object ready to submit. |

### Get the Status of Transactions

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

```TS
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

#### Client: getStatus

This function calls `/poll` and returns the result of requests.

```TS
const { getStatus } = createClient();

getStatus(transactionDescriptor: TransactionDescriptor[] | ITransactionDescriptor): Promise<{
    [requestKey: IBase64Url]: { [requestKey:string] ICommandResult};
}>
```

| Parameter             | Type                                             | Description                           |
| --------------------- | ------------------------------------------------ | ------------------------------------- |
| transactionDescriptor | TransactionDescriptor \| TransactionDescriptor[] | One or list of requests to be queried |

#### Client: pollStatus

This function calls `/poll` in intervals and returns the result of all requests
when all are ready.

```TS
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

| Parameter             | Type                                                                                                            | Description                                                                                                                                                                                                                                                                                                                                                                                               |
| --------------------- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| transactionDescriptor | TransactionDescriptor \| TransactionDescriptor[]                                                                | One or list of requests to be queried                                                                                                                                                                                                                                                                                                                                                                     |
| pollOptions           | { onPoll?: (id: string) => void; timeout?: Milliseconds; interval?: Milliseconds; confirmationDepth?: number; } | onPoll: Callback is called when the request is polling; this might be called several times if the request is not ready yet. Timeout: Timeout if the result is not ready (default `180000` // 3 minutes). Interval: Delay between retries (default is `5000` // 5 seconds). ConfirmationDepth: Set the confirmationDepth for getting the response; this overrides the one you set in createClient function |

**Return value:** The return value is a special type of promise. Though you can
just await for the result just like a normal promise - which is the case for
most of the typical use cases - you can still listen for each individual request
via the `requests` property.

##### Examples

Poll the status of a request:

```TS
const result = await pollStatus(request, {});
```

Poll the status of several requests and get the result for each one immediately:

```TS
const resultPromise = pollStatus([firstRequest, secondRequest, thirdRequest]);
// Notify the UI from the result of each request as soon as it's available
resultPromise.requests["first-request-key"].then(res => {UI.notify(res)});
resultPromise.requests["second-request-key"].then(res => {UI.notify(res)});
resultPromise.requests["third-request-key"].then(res => {UI.notify(res)});
// The final result object
const finalResult = await resultPromise;
```

#### Client: listen

`listen` is another function for fetching the result of one request. It uses the
`/listen` endpoint, which is a blocking endpoint. **Note**: If your
network/firewall configuration doesn't allow keeping HTTP connections open for a
long time, then it's better to use `pollOne` which has the same interface but
uses `/poll` under the hood.

```TS
const { listen } = createClient();

listen(transactionDescriptor: TransactionDescriptor[] | ITransactionDescriptor): Promise<ICommandResult>
```

| Parameter             | Type                  | Description                                                       |
| --------------------- | --------------------- | ----------------------------------------------------------------- |
| transactionDescriptor | TransactionDescriptor | The request object including `requestKet`, `networkId`, `chainId` |

#### Client: pollOne

The `pollOne` function fetches the result of only one request via the `/poll`
endpoint.

```TS
const { pollOne } = createClient();

pollOne(transactionDescriptor: TransactionDescriptor[] | ITransactionDescriptor): Promise<ICommandResult>
```

| Parameter             | Type                  | Description                                                       |
| --------------------- | --------------------- | ----------------------------------------------------------------- |
| transactionDescriptor | TransactionDescriptor | The request object including `requestKet`, `networkId`, `chainId` |

### Read Data from Node

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

#### Client: local

The `local` function is the most generic function that utilizes the `/local`
endpoint.

```TS
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

##### Examples

Use local call to avoid submitting an incorrect transaction:

```TS
// Check if the transaction and signatures are correct
const response = await client.local(signedTx);

if (response.result.status === 'failure') {
  // Throw if the transaction fails to avoid paying gas for a failed transaction
  throw response.result.error;
}
const request = await client.submit(signedTx);
```

Use local call for gas estimation:

```TS
// We don't need to send signatures to check gas estimation;
const response = await client.local(unsignedTx, { preflight:true , signatureVerification: false });

if (response.result.status === 'failure') {
  throw response.result.error;
}

const gasEstimation =  response.gas;
```

#### Client: dirtyRead

Alias for local where both preflight and signatureVerification are false; useful
when your code only includes reading data from the node.

```TS
dirtyRead(transaction: ICommand | IUnsignedCommand): Promise<ICommandResult>;
```

| Parameter   | Type                         | Description                           |
| ----------- | ---------------------------- | ------------------------------------- |
| transaction | ICommand \| IUnsignedCommand | The signed or unsigned command object |

##### Examples

Get account balance

```TS
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

#### Client: preflight

Alias for local where preflight is true but signatureVerification is false.

```TS
preflight(transaction: ICommand | IUnsignedCommand): Promise<ICommandResult>;
```

| Parameter   | Type                         | Description                           |
| ----------- | ---------------------------- | ------------------------------------- |
| transaction | ICommand \| IUnsignedCommand | The signed or unsigned command object |

#### Client: signatureVerification

Alias for local where preflight is false but signatureVerification is true.

```TS
signatureVerification(transaction: ICommand | IUnsignedCommand): Promise<ICommandResult & { preflightWarnings?: string[] }>;
```

| Parameter   | Type                         | Description                           |
| ----------- | ---------------------------- | ------------------------------------- |
| transaction | ICommand \| IUnsignedCommand | The signed or unsigned command object |

#### Client: runPact

If you just want to see the result of a pact code and don't want to create a
command object, you can use the `runPact` function. This function creates a
command object internally.

```TS
runPact(code: string, data?: Record<string, unknown>, options?: { chainId: ChainId; networkId: string }): Promise<ICommandResult>;
```

| Parameter | Type                                    | Description                                                    |
| --------- | --------------------------------------- | -------------------------------------------------------------- |
| code      | string                                  | Pact code                                                      |
| data      | Record<string, unknown>                 | Data to be sent with the transaction                           |
| options   | { chainId: ChainId; networkId: string } | ChainId and networkId that you want to send the transaction to |

##### Examples

```TS
const { runPact } = createClient()

const result = await runPact(`(coin.getBalance "alice")`, { }, { networkId:"mainnet01", chainId:"1" })

```

### Request SPV (Simple Payment Verification) Proof

You need SPV proof mainly for cross-chain transactions - but it's not limited to
this, and you can request SPV proof for all kinds of transactions.

There are two functions for this purpose, both of which use the `/spv` endpoint:

- `createSPV`
- `pollCreateSPV`

#### Client: createSPV

Request SPV proof if it's ready.

```TS
createSpv(transactionDescriptor: ITransactionDescriptor, targetChainId: ChainId): Promise<string>;
```

| Parameter             | Type                                                        | Description                                               |
| --------------------- | ----------------------------------------------------------- | --------------------------------------------------------- |
| transactionDescriptor | { requestKey: string; networkId: string; chainId: ChainId } | The transaction for which you want to create an SPV proof |
| targetChainId         | ChainId                                                     | The chain that consumes this proof                        |

#### Client: pollCreateSPV

Poll for the SPV proof and await until it's ready.

```TS
pollCreateSpv(
  transactionDescriptor: ITransactionDescriptor,
  targetChainId: ChainId,
  pollOptions?: { onPoll?: (id: string) => void; timeout?: Milliseconds; interval?: Milliseconds; }
): Promise<string>;
```

| Parameter             | Type                                                                                | Description                                                                                                                                                                                                                                                               |
| --------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| transactionDescriptor | { requestKey: string; networkId: string; chainId: ChainId }                         | The transaction for which you want to create an SPV proof                                                                                                                                                                                                                 |
| targetChainId         | ChainId                                                                             | The chain that consumes this proof                                                                                                                                                                                                                                        |
| pollOptions           | { onPoll?: (id: string) => void; timeout?: Milliseconds; interval?: Milliseconds; } | onPoll: Callback is called when the request is polling; this might be called several times if the request is not ready yet. Timeout: Timeout if the result is not ready (default `180000` // 3 minutes). Interval: Delay between retries (default is `5000` // 5 seconds) |

##### Examples

```TS
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

## FP Compose Pact Command

Apart from CommandBuilder api you can use the FP api to create pact command. it
gives you more flexibility. Actually the command builder api uses the fp api
under the hood

you need to import functions from `@kadena/client/fp` package.

```typescript
import { composePactCommand, execution } from '@kadena/client/fp';
```

### composePactCommand

This function let you compose parts of the command and create the final one, the
function accepts pure json as well as reducer functions. this function
eventfully returns `IPartialPactCommand` which will be stringified as `cmd` part
in the command JSON.

```typescript
type CommandReducer = (cmd?: IPartialPactCommand | (() => IPartialPactCommand)) => IPartialPactCommand;

composePactCommand(
  ...reducersOrPartialCommands: Array<IPartialPactCommand | CommandReducer>
  ): CommandReducer
```

**Note**: the return value is also a CommandReducer function which you can pass
to another composePactCommand; eventually when you call the function it also
adds the default values

| Parameter                    | Type                                         | Description                                       |
| ---------------------------- | -------------------------------------------- | ------------------------------------------------- |
| ...reducersOrPartialCommands | Array<IPartialPactCommand \| CommandReducer> | list of command reducers or partial pact commands |

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

We developed some common reducers

### execution

**Goal**: creating `IPactCommand.payload.exec.code`.

This includes typical Pact code and also the first step of defpact functions.

```typescript
execution(...codes): { payload: { exec : { code: string, data: {} } }}
```

| Parameter | Type     | Description   |
| --------- | -------- | ------------- |
| ...code   | string[] | list of codes |

example:

use string code

```typescript
const command: IPactCommand = composePactCommand(
  execution(`(coin.transfer "alice" "bob" 1.1)`),
)();
```

using `Pact.modules` for code

```typescript
const command: IPactCommand = composePactCommand(
  execution(Pact.modules.coin.transfer('alice', 'bob', { decimal: '1.1' })),
)();
```

### Continuation

**Goal**: creating `IPactCommand.payload.cont`.

This includes a command for the next steps of a defpact (multi-step) function.

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

| Parameter | Type                                                                                                    | Description                                                                                       |
| --------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| contData  | { pactId: string, rollback: boolean, step: number, data?: Record<string, any>, proof?: null \| string } | continuation data; step starts from 0; proof is SPV proof that can be generated by calling `/spv` |

#### Example:

`coin.cross-chain` is a multi-step function (defpact) that burns the token in
the source chain and mints the amount in the target chain. After doing the first
step successfully, you can call the second step by using continuation.

```TS

const command: IPactCommand = composePactCommand(
  continuation({
    pactId,
    rollback: false,
    step:1,
    proof: spvProof
  })
)()

```

### Add Signer

**Goal**: adding `IPactCommand.signers` list

You can use the `addSigner` method to add signer's public keys and capability
list to the command. Later, the Chainweb node can check if all signers signed
the transaction or not.

**Note**: You can call `addSigner` as many times as you want if the transaction
has more signers.

```typescript
addSigner(signerOrSignersList, capabilityCallback): CommandReducer;
```

| Parameter          | Type                                                                                                   | Description                                                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| signer             | string \| { pubKey: string; scheme?: 'ED25519' \| 'ETH' \| 'WebAuthn'; address?: string;} \| ISigner[] | Public key of the signer or the signer object (this can also be a list of signers if all sign for the same capabilities) |
| capabilityCallback | (signFor) => ReturnType<signFor>[]                                                                     | Allows you to scope the sign to a specific list of capabilities                                                          |

Chainweb supports three schemes of public keys `ED25519`, `WebAuthn`, `ETH`; the
default value is `ED25519`. You can pass just the public key if the scheme is
`ED25519`, otherwise, you need to pass a signer object including pubKey and
scheme.

#### Examples

Adding a signer for coin transfer

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

Add a signer with `WebAuthn` scheme

```typescript
composePactCommand(
  execution(Pact.modules.coin.transfer('alice', 'bob', { decimal: '1.1' })),
  addSigner({ pubKey: webAuthnPublicKey, scheme: 'WebAuthn' }, (signFor) => [
    signFor('coin.TRANSFER', 'alice', 'bob', { decimal: '1.1' }),
  ]),
);
```

Add a list of signers with no capabilities

```typescript
composePactCommand(
  execution('(free.my-module.my-function)'),
  addSigner([
    'ED25519_publicKey',
    { pubKey: 'WebAuthn_publicKey', scheme: 'WebAuthn' },
  ]),
);
```

Add a list of signers with similar capabilities

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

### Add Data

**Goal**: adding `IPactCommand.payload.exec.data` or
`IPactCommand.payload.cont.data` based on the transaction type

You can use this method to add data to the command, this data is readable in the
smart contract later. you can also use this data in the code you set in the
command.

```typescript
addData(key, value): CommandReducer
```

| Parameter | Type      | Description                  |
| --------- | --------- | ---------------------------- |
| key       | string    | the key associated with data |
| value     | PactValue | data you want to send        |

#### Examples

transfer with parameters in data

```typescript
composePactCommand(
  execution(
    '(coin.transfer (read-string "sender") (read-string "receiver") 1.1)',
  ),
  addData('sender', sender),
  addData('receiver', sender),
);
```

use transfer create and send the receiver guard

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

Here are the corrected sections:

### Add Keyset

Since keysets are commonly used data in commands, we provide `addKeyset` as an
alternative to `addData` specifically for adding keysets.

```typescript
addKeyset(name, pred, ...keys): CommandReducer
```

| Parameter | Type                                        | Description                                                                  |
| --------- | ------------------------------------------- | ---------------------------------------------------------------------------- |
| name      | string                                      | the name associated with the keyset                                          |
| pred      | "keys-all"\|"keys-2"\| "keys-any" \| string | one of the built-in predicate functions or a user-defined predicate function |
| ...keys   | ...string[]                                 | List of public keys in the keyset                                            |

#### Examples

Transfer create using `readKeyset` helper function

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

Transfer create as string code

```typescript
composePactCommand(
  execution(
    '(coin.transfer-create "alice" "bob" (readKeyset "bob-guard") 1.1)',
  ),
  addKeyset('bob-guard', 'keys-all', 'bob-public-key'),
);
```

### Set Meta

**Goal**: adding `IPactCommand.meta`

You can use `setMeta` to add metadata to a command.

```typescript
setMeta(meta): CommandReducer
```

| Parameter | Type                                                                                                               | Description         |
| --------- | ------------------------------------------------------------------------------------------------------------------ | ------------------- |
| meta      | { chainId: ChainId, senderAccount: string, gasLimit: number, gasPrice: number, ttl: number, creationTime: number } | add metadata object |

#### Metadata

| Property      | Type            | Default value       | description                                                          |
| ------------- | --------------- | ------------------- | -------------------------------------------------------------------- |
| chainId       | `"0"` to `"19"` | `undefined`         | id of chain from "0" to "19"                                         |
| senderAccount | `string`        | `undefined`         | the account address that you want to pay gas from that               |
| gasLimit      | `number`        | `2500`              | maximum amount of gas you allow to be deducted during running the tx |
| gasPrice      | `number`        | `1.0e-8`            | price of each gas unit based on KDA (e.g., 0.0000001)                |
| ttl           | `number`        | `28800`             | ttl (time-to-live) of the tx in seconds; default value is 8 hours    |
| creationTime  | `number`        | `Date.now() / 1000` | transaction creation time in seconds                                 |

#### Examples

```typescript
composePactCommand(
  execution('(coin.transfer "alice" "bob" 1.1)'),
  // "bob is paying gas fee"
  setMeta({ chainId: '02', senderAccount: 'bob' }),
);
```

### Set Nonce

**Goal**: set `IPactCommand.nonce` with your custom nonce; otherwise, it will be
set with `kjs:${timestamp}`

You can use this function to set the nonce for the transaction.

```typescript
setNonce(nonce): { nonce: string };
```

| Parameter | Type   | Description      |
| --------- | ------ | ---------------- |
| nonce     | string | nonce for the tx |

#### Examples

```typescript
composePactCommand(
  execution('(coin.transfer "alice" "bob" 1.1)'),
  // "bob is paying gas fee"
  setNonce('a-custom-nonce'),
);
```

### Set Network Id

**Goal**: set `IPactCommand.network`

You can use this function to set the network for the transaction.

```typescript
setNetworkId(networkId): { networkId : string }
```

| Parameter | Type   | Description                                 |
| --------- | ------ | ------------------------------------------- |
| networkId | string | network Id (e.g., "mainnet01", "testnet04") |

#### Examples

```typescript
composePactCommand(
  execution('(coin.transfer "alice" "bob" 1.1)'),
  // "bob is paying gas fee"
  setNetworkId('testnet04'),
);
```

### Create Transaction

After setting all parts of the command, you can create the transaction object by
calling `createTransaction` function. This will stringify `cmd`, and add the
hash as well. You need to add signatures to this object via a wallet - check out
[wallet-providers](#wallet-providers) - in order to submit it to the blockchain.

```typescript
createTransaction(pactCommand:IPactCommand): IUnsignedCommand
```

### Examples

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

## Complete and Runnable Examples

Check out [Client Examples](../client-examples/)
