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

Pact.modules[`${namespace}.${moduleName}`][functionName](<arguments>)
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

# TODO: ADD OTHER PARTS

## Complete and Runnable Examples

Check out [Client Examples](../client-examples/)
