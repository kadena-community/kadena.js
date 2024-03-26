---
title: kadena client
description:
  The @kadena/client library provides a TypeScript-based API for interacting
  with smart contracts and the chainweb network. The library includes modules in
  three categories creating transactions, signing transactions, and submitting
  to the network.
menu: Reference
label: Kadena client
order: 4
layout: full
tags: ['TypeScript', 'Kadena', 'Kadena client', 'frontend']
---

# Kadena client

The `@kadena/client` library provides a TypeScript-based API for interacting
with smart contracts and the Kadena network. The library includes modules in
three categories: creating commands, signing transactions, and interacting with
the network.

Do you only need to interact with the `coin` contract? Then check out
["@kadena/client-utils/coin"](../client-utils/README.md) for a simpler API.

In a nutshell, this library helps you to create the command object with the
following structure and also send it to the network and listen for the result of
that.

```TS
interface ICommand {
  cmd: string; // stringified command <IPactCommand> type
  hash: string; // cmd-hash
  sigs: Array<{ sig: string } | undefined> // array of signatures
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

Do you prefer to learn from code? Then check out
[client-examples](../client-examples/).

Checkout different sections:

- [install](#install)
- [Pact Modules](#pact-modules)
- [Command Builder](#command-builder)
- [Sign methods](#sign-methodes)
- [Network Methods](#network-methods)
- [FP helpers](#fp-helpers)

## Install

You cam install the library with the following command:

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

## Pact Modules

**Goal**: creating pact code for `IPactCommand.payload.exec.code`; skip this
part if your code is just a simple **constant** string.

Interacting with Chainweb - Kadena's blockchain - mostly means calling smart
contract functions. From the client perspective, you need to write Pact code in
a string and set it in the command. Writing the string directly is error-prone
and also more vulnerable to code injection, since there isn't any code
completion and validation. Therefore, we have created `Pact.modules` that offers
three features:

- Type-safe functions
- Pact type conversion
- Avoidance of code injection

You can utilize the function with the following format:

```TS
import { Pact } from `@kadena/client`

Pact.modules[`${namespace}.${moduleName}`][functionName](...args)
```

| Parameter | Type        | Description       |
| --------- | ----------- | ----------------- |
| ...args   | PactValue[] | list of arguments |

```TS
// the pseudo code of PactValue type
type PactValue =
  | string
  | number
  | boolean
  | Date
  | { int: string}
  | { decimal : string }
  | PactValue[]
  | Record<string, PactValue>
```

### examples

Creating the code for `coin.transfer`

```TS
import { Pact } from `@kadena/client`

const code = Pact.modules.coin.transfer("alice", "bob", { decimal : '1.1' })
// code === '(coin.transfer "alice" "bob" 1.1)'

```

Creating the code for `free.my-module.my-function` which converts
list/objects/date to valid pact code.

```TS
import { Pact } from `@kadena/client`

const code = Pact.modules["free.my-module"].["my-function"](["first", { time: new Date() }])
// code === '(free.my-module.my-function ["first" {"time" : (time "2023-07-20T14:55:11Z")} ])'

```

### Create type definition for Pact modules

You can use [@kadena/pactjs-cli](../../tools/pactjs-cli/README.md) tool to
create the type for the module you use, then the TS provides code completion for
the functions and capabilities.

Create type definition file for `coin` contract

```Bash
npx @kadena/pactjs-cli contract-generate --contract coin --api https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/0/pact;
```

## Command builder

A command object is a JSON with three keys `cmd`, `hash`, `sig`. Though you can
create the JSON without using this library, using the lib makes the process
easier and more robust for you.

You can use `Pact.builder` in order to create the command object.

There are two types of commands.

- [execution](#execution)
- [continuation](#continuation)

### Execution

**Goal**: creating `IPactCommand.payload.exec.code`.

This includes typical Pact code and also the first step of defpact functions.

```TS
Pact.builder.execution(...codes): IBuilder
```

| Parameter | Type     | Description   |
| --------- | -------- | ------------- |
| ...code   | string[] | list of codes |

example:

use string code

```TS

const builder: IBuilder = Pact.builder.execution(
  `(coin.transfer "alice" "bob" 1.1)`
)

```

using `Pact.modules` for code

```TS

const builder: IBuilder = Pact.builder.execution(
  Pact.modules.coin.transfer("alice", "bob", { decimal : '1.1' })
)

```

### Continuation

**Goal**: creating `IPactCommand.payload.cont`.

This includes a command for the next steps of a defpact (multi-step) function.

```TS
Pact.builder.continuation(contData): IBuilder
```

| Parameter | Type                                                                                                    | Description                                                                                       |
| --------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| contData  | { pactId: string, rollback: boolean, step: number, data?: Record<string, any>, proof?: null \| string } | continuation data; step starts from 0; proof is SPV proof that can be generated by calling `/spv` |

#### Example:

`coin.cross-chain` is a multi-step function (defpact) that burns the token in
the source chain and mints the amount in the target chain. After doing the first
step successfully, you can call the second step by using continuation.

```TS

const builder: IBuilder = Pact.builder.continuation({
  pactId,
  rollback: false,
  step:1,
  proof: spvProof
})

```

### Add Signer

**Goal**: adding `IPactCommand.signers` list

You can use the `addSigner` method to add signer's public keys and capability
list to the command. Later, the Chainweb node can check if all signers signed
the transaction or not.

**Note**: You can call `addSigner` as many times as you want if the transaction
has more signers.

```TS
Pact.builder.execution(...codes).addSigner(signerOrSignersList, capabilityCallback): IBuilder
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

```TS
// ED25519 key
const alicePublicKey = "e7f4da07b1d200f6e45aa6492afed6819297a97563859a5f0df9c54f5abd4aab";

Pact.builder
  .execution(Pact.modules.coin.transfer('alice', 'bob', { decimal: '1.1' }))
  .addSigner(alicePublicKey, (signFor) => [
    signFor('coin.TRANSFER', 'alice', 'bob', { decimal: '1.1' }),
  ]);
```

Add a signer with `WebAuthn` scheme

```TS
Pact.builder
  .execution(Pact.modules.coin.transfer('alice', 'bob', { decimal: '1.1' }))
  .addSigner({ pubKey: webAuthnPublicKey, scheme: "WebAuthn" }, (signFor) => [
    signFor('coin.TRANSFER', 'alice', 'bob', { decimal: '1.1' }),
  ]);
```

Add a list of signers with no capabilities

```TS
Pact.builder
  .execution("(free.my-module.my-function)")
  .addSigner(["ED25519_publicKey", { pubKey: "WebAuthn_publicKey", scheme:"WebAuthn" }]);
```

Add a list of signers with similar capabilities

```TS
Pact.builder
  .execution(Pact.modules.coin.transfer('alice', 'bob', { decimal: '1.1' }))
  // e.g., Alice's account is guarded by two keys
  .addSigner(["first_publicKey", "second_publicKey"], (signFor) => [
    signFor('coin.TRANSFER', 'alice', 'bob', { decimal: '1.1' }),
  ]);


const equivalentPactCommand = {
  payload: {
    exec: {
      code : '(coin.transfer "alice" "bob" 1.1 )',
      data : {}
    }
  },
  signers : [
    {
      pubKey: 'first_publicKey',
      scheme: 'ED25519',
      clist:[{name: 'coin.TRANSFER', args: ['alice','bob', { decimal: '1.1' }]}]
    },
    {
      pubKey: 'second_publicKey',
      scheme: 'ED25519',
      clist:[{name: 'coin.TRANSFER', args: ['alice','bob', { decimal: '1.1' }]}]
    }
  ]
}
```

### Add Data

**Goal**: adding `IPactCommand.payload.exec.data` or
`IPactCommand.payload.cont.data` based on the transaction type

You can use this method to add data to the command, this data is readable in the
smart contract later. you can also use this data in the code you set in the
command.

```TS
Pact.builder
  .execution(...codes)
  .addData(key, value): IBuilder
```

| Parameter | Type      | Description                  |
| --------- | --------- | ---------------------------- |
| key       | string    | the key associated with data |
| value     | PactValue | data you want to send        |

#### Examples

transfer with parameters in data

```TS
Pact.builder
  .execution('(coin.transfer (read-string "sender") (read-string "receiver") 1.1)')
  .addData("sender", sender)
  .addData("receiver", sender): IBuilder
```

use transfer create and send the receiver guard

```TS
Pact.builder
  .execution('(coin.transfer-create "alice" "bob" (read-keyset "bob-guard") 1.1)')
  .addData("bob-guard", {
    keys:["bob-public-key"],
    pred:"keys-all"
  })
```

### Add Keyset

Since keyset are a common data you can set in command we wrote addKeyset as
alternative for addData when you add keysets.

```TS
Pact.builder
  .execution(...codes)
  .addKeyset(name, pred, ...keys): IBuilder
```

| Parameter | Type                                        | Description                                                                |
| --------- | ------------------------------------------- | -------------------------------------------------------------------------- |
| name      | string                                      | the name associated with the keyset                                        |
| pred      | "keys-all"\|"keys-2"\| "keys-any" \| string | on on the built-in predicate function or a user defined predicate function |
| ...keys   | ...string[]                                 | List of public keys in the keyset                                          |

#### Examples

transfer create using readKeyset helper function

```TS
Pact.builder
  .execution(
    Pact.modules.coin["transfer-create"](
      "alice",
      "bob",
      readKeyset("bob-guard"),
      {decimal: "1.1"}
    )
  ).addKeyset("bob-guard","keys-all", "bob-public-key")
```

transfer create as string code

```TS
Pact.builder
  .execution('(coin.transfer-create "alice" "bob" (readKeyset "bob-guard") 1.1)')
  .addKeyset("bob-guard","keys-all", "bob-public-key")
```

### Set Meta

**Goal**: adding `IPactCommand.meta`

you can use `setMeta` to add meta data to a command.

```TS
Pact.builder
  .execution(...codes)
  .setMeta(meta): IBuilder
```

| Parameter | Type                                                                                                          | Description          |
| --------- | ------------------------------------------------------------------------------------------------------------- | -------------------- |
| meta      | { chainId:ChianId, senderAccount:string, gasLimit:number, gasPrice:number, ttl:number , creationTime:number } | add meta data object |

#### Meta data

| Property      | Type            | Default value       | description                                                          |
| ------------- | --------------- | ------------------- | -------------------------------------------------------------------- |
| chianId       | `"0"` to `"19"` | `undefined`         | id of chian from "0" to "19"                                         |
| senderAccount | `string`        | `undefined`         | the account address that you want to pay gas from that               |
| gasLimit      | `number`        | `2500`              | maximum amount of gas you allow to be deducted during running the tx |
| gasPrice      | `number`        | `1.0e-8`            | price of each gas unit based on kda (e.g 0.0000001)                  |
| ttl           | `number`        | `28800`             | ttl (time-to-live) of the tx in secondsl default value is 8 hours    |
| creationTime  | `number`        | `Date.now() / 1000` | transaction creation time in second                                  |

#### Examples

```TS
Pact.builder
  .execution('(coin.transfer "alice" "bob" 1.1)')
  // "bob is paying gas fee"
  .setMeta({ chainId: "02", senderAccount: "bob" }): IBuilder
```

### Set Nonce

**Goal**: set `IPactCommand.nonce` with your custom nonce otherwise it will be
set with `kjs:${timestamp}`

You can use this function to set nonce for the transaction;

```TS
Pact.builder.execution(code).setNonce(nonce): IBuilder
```

| Parameter | Type   | Description     |
| --------- | ------ | --------------- |
| nonce     | string | nonce fo the tx |

#### Examples

```TS
Pact.builder
  .execution('(coin.transfer "alice" "bob" 1.1)')
  // "bob is paying gas fee"
  .setNonce("a-custom-nonce"): IBuilder
```

### Set Network Id

**Goal**: set `IPactCommand.network`

You can use this function to set network for the transaction;

```TS
Pact.builder.execution(code).setNetworkId(networkId): IBuilder
```

| Parameter | Type   | Description                                |
| --------- | ------ | ------------------------------------------ |
| networkId | string | network Id (e.g. "mainnet01", "testnet04") |

#### Examples

```TS
Pact.builder
  .execution('(coin.transfer "alice" "bob" 1.1)')
  // "bob is paying gas fee"
  .setNetworkId("testnet04"): IBuilder
```

### Create Transaction

after setting all part of the command you can create the transaction object by
calling `createTransaction` method, this will also add all default values to the
command; stringified cmd and add the hash as well. you need to add signatures to
this object via a wallet - check out [wallet-providers](#wallet-providers) - in
order to submit it to the blockchain

```TS
const transaction: IUnsignedCommand = Pact.builder.execution(code)
    .createTransaction() // : { cmd:"stringified-command" , hash:"command-hash" , sig: [] };
```

### Examples

```TS
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
  sigs: [ undefined ]
}
```

### Create Pact Command

if you prefer to have the none stringified version of command you can use
`getCommand`;

```TS
const transaction: IPactCommand = Pact.builder.execution(code).getCommand()
```

#### Examples

```TS
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

### Initial value

if you might find yourself repeating certain parts of methods for different
commands. You can create your command builder by using
`createTransactionBuilder`. This allows you to set all default values once and
then reuse the builder.

| Parameter | Type                  | Description              |
| --------- | --------------------- | ------------------------ |
| initial   | Partial<IPactCommand> | the initial pact command |

```TS
const builder: ITransactionBuilder = createTransactionBuilder(initialPactCommand)
```

#### Examples

create a builder with network and chain already set.

```TS
// pre configure the builder
export const txBuilder = createTransactionBuilder({ networkId: "mainnet01", meta: {chainId: "1"} });

// then somewhere in the code

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
    // default value
    chainId: '1',
  },
  // default value
  networkId: 'mainnet01',
};

```

## Signing Transactions

After creating the command, you need to sign it using the related private keys.
This process is usually managed with a wallet. Kadena has two protocols for
signing transactions, each serving different purposes:

- **Sign API**: This API allows users to send their sign requests to the wallet.
  The wallet is then responsible for creating and signing the transaction
  simultaneously. With this approach, the wallet has more freedom, making it
  more suitable for simple transactions.

- **Quicksign**: This API is designed to give dApps full control over the
  command, with the wallet only responsible for adding signatures. This is the
  recommended method if you are using the command builder from this library.

Wallets typically have their own API for communicating with dApps. While you can
directly use the wallet API, we've also developed wrapper functions for certain
wallets to provide more convenience.

### Chainweaver

you can use `createSignWithChainweaver` to sign tx via Chainweaver.

```TS
createSignWithChainweaver(options:{ host?: string }): (txList:IUnsignedCommand[]) =>Promise<(ICommand | IUnsignedCommand)[]>
```

| Parameter | Type              | Description                                                           |
| --------- | ----------------- | --------------------------------------------------------------------- |
| option    | { host?: string } | option including host url default `{ host: 'http://127.0.0.1:9467' }` |

## TODO: ADD OTHER PARTS

## Complete and Runnable Examples

Check out [Client Examples](../client-examples/)

```

```
