# kadena.js - Client

Core library for building Pact expressions to send to the blockchain in js.
Makes use of .kadena/pactjs-generated

<p align="center">

<picture>

<source srcset="https://github.com/kadena-community/kadena.js/raw/master/common/images/Kadena.JS_logo-white.png" media="(prefers-color-scheme: dark)"/>

<img src="https://github.com/kadena-community/kadena.js/raw/master/common/images/Kadena.JS_logo-black.png" width="200" alt="kadena.js logo" />

</picture>

</p>

<hr>

API Reference can be found here
[client.api.md](https://github.com/kadena-community/kadena.js/tree/master/packages/libs/client/etc/client.api.md)

<hr>

## Release @kadena/client

We've created a library that allows Javascript/Typescript users to easily
interact with the Kadena Blockchain. Creating contracts is explicitly left out
as it's a lot more complicated to transpile Javascript to Pact.

Interaction with the Kadena Blockchain works in multiple ways. With
@kadena/client there are two ways you will be able to interact with the Kadena
Blockchain. The two ways are:

[**1. contract based**](#contract-based-interaction-using-kadenaclient), and
[**2. template based**](#template-based-interaction-using-kadenaclient), and
[**3. modular pact command**](#using-the-pactcommand-class).

There's also information on an
[**Integrated way of signing using Chainweaver**](#integrated-sign-request-to-chainweaver-desktop).
With @kadena/client you can also
[**Send a request to the blockchain**](#send-a-request-to-the-blockchain). They
will be covered in this article. We will also be exploring the concepts and
rationale of @kadena/client.

- [kadena.js - Client](#kadenajs---client)
  - [Release @kadena/client](#release-kadenaclient)
- [Prerequisites](#prerequisites)
- [Contract based interaction using @kadena/client](#contract-based-interaction-using-kadenaclient)
  - [Load contracts from the blockchain](#load-contracts-from-the-blockchain)
  - [Generate interfaces](#generate-interfaces)
- [Building a simple transaction from the contract](#building-a-simple-transaction-from-the-contract)
  - [Manually singing the transaction](#manually-singing-the-transaction)
- [Integrated sign request to **Chainweaver desktop**](#integrated-sign-request-to-chainweaver-desktop)
- [Template based interaction using @kadena/client](#template-based-interaction-using-kadenaclient)
  - [Load the contract repository](#load-the-contract-repository)
  - [Generate code from templates](#generate-code-from-templates)
  - [A function is generated from a template](#a-function-is-generated-from-a-template)
  - [Using the generated code](#using-the-generated-code)
- [Send a request to the blockchain](#send-a-request-to-the-blockchain)
- [Further development](#further-development)
- [Contact the team](#contact-the-team)

# Prerequisites

Please note that we are not going over installation of nodejs and package
management as this information is widely available on the internet. We will,
however, provide the bare minimum of the information and details you will need
in order to start using @kadena/client, which are:

- install nodejs version 14.x or 16.x
- create a directory, bootstrap a `package.json` by running `npm init` or
  `npm init -y` to use defaults
- install typescript `npm install -g typescript`
- install the client `npm install @kadena/client`
- install the commandline tool `npm install @kadena/pactjs-cli`
- install the optional typescript runner for nodejs `npm install ts-node`

```sh
mkdir my-dapp-with-kadena-client
cd my-dapp-with-kadena-client
npm init -y
npm install -g typescript
tsc --init
npm install --save @kadena/client
npm install -g --save-dev @kadena/pactjs-cli ts-node
```

# Contract based interaction using @kadena/client

We wanted `@kadena/client` to be independent of anything so this is just a tool
that can be used with arbitrary contracts. That is also the reason why you have
to _generate_ the interfaces that are used by `@kadena/client`. You can use the
smart-contracts from the blockchain or from your own local smart-contracts.

For the **template based interaction** we will provide a repository with
templates that can be used.

## Load contracts from the blockchain

Using the commandline tool `@kadena/pactjs-cli`, download the contracts you want
to create Typescript interfaces for.

```sh
mkdir contracts
npx pactjs retrieve-contract --out "./contracts/coin.module.pact" --module "coin"
```

There are several options to retrieve contracts from another network or chain.

<details>
  <summary>Help information on retrieve-contract (click to open)
  
  `pactjs retrieve-contract --help`</summary>
  
  ```txt
  > pactjs retrieve-contract --help
  Usage: index retrieve-contract [options]

Retrieve contract from api.chainweb.com in a /local call

Options:  
 -m, --module <module>  
 The module you want to retrieve (e.g. "coin")

-o, --out <file> File to write the contract

-n, --network <network> Network to retrieve from (default "mainnet") (default:
"mainnet")

-c, --chain <number> Chain to retrieve from (default 1) (default: 1)

-h, --help display help for command

````

</details>

## Generate interfaces

Using the contract we'll now generate all the functions (`defun`s) with their
(typed) arguments and the capabilities (`defcap`s).

```bash
pactjs contract-generate --file "./contracts/coin.module.pact"
````

The log shows what has happened. Inside the `node_modules` directory, a new
package has been created: `.kadena/pactjs-generated`. This package is referenced by
`@kadena/client` to give you type information.

> **NOTE:** do not forget to add this `"types": [".kadena/pactjs-generated"],` to `compilerOptions`
> in `tsconfig.json`. Otherwise this will not work

# Building a simple transaction from the contract

> Take a look at
> https://github.com/kadena-community/kadena.js/blob/master/packages/libs/pactjs-test-project/src/example-contract/simple-transfer.ts
> for the full example

Now that everything is bootstrapped, we can start building transactions.

Create a new file and name it `transfer.ts` (or `.js`).

```ts
import { Pact } from '@kadena/client';

// store the builder in a variable
const transactionBuilder =
  // basic call results in Pact code `(coin.transfer "k:your-pubkey" "k:receiver-pubkey" 231.0)`
  Pact.modules.coin
    .transfer('k:your-pubkey', 'k:receiver-pubkey', 231)

    // add necessary coin.GAS capability (this defines who pays the gas)
    .addCap('coin.GAS', 'your-pubkey')

    // add necessary coin.TRANSFER capability
    .addCap(
      'coin.TRANSFER',
      'your-pubkey',
      'k:your-pubkey',
      'k:receiver-pubkey',
      231,
    )

    // the minimum you NEED to add is the sender of this transaction
    .setMeta({
      sender: 'your-pubkey',
    });
```

**Note**

Take note of the following:

- namespaced arguments (`k:`, `w:` etc) are account-names, where non-namespaced
  arguments are assumed to be public-keys
- the contract doesn't specify whether you need to pass an **account-name** or
  **public-key**. This is knowledge that can be obtained by inspecting the
  contract downloaded earlier or consulting the documentation for the contract.
- `addCap` function accepts a `capability` and a `public-key` of the signer of
  the capability. The other arguments are defined by the contract. `coin.GAS`
  doesn't have any arguments, `coin.TRANSFER` does.
- `setMeta`s object has a `sender` property, which is a `public-key`.

## Manually singing the transaction

To sign the transaction, you can use the builder to output the `command`. This
can be pasted into the `SigData` of Chainweaver.

```ts
// createTransaction() will calculate hashes and finalizes the unsigned transaction
const unsignedTransaction = transactionBuilder.createCommand();

console.log(JSON.stringify(unsignedTransaction.cmd));
```

Take note of the following:

- `createCommand()` will **finalize** the transaction. The hash will be
  calculated. In further versions we will invalidate the hash and the command
  that's been generated on the transaction when `addCap`, `setMeta` or other
  changes are made to the transaction

# Integrated sign request to **Chainweaver desktop**

Using the `transaction` we can send a sign-request to Chainweaver. **(NB: this
can only with the desktop version, not the web-version, as it's
[exposing port 9467](https://kadena-io.github.io/signing-api/)**

> **Note**  
> In the future we will provide an interface with WalletConnect. This is not yet
> finalized. Once it is, we'll update the `@kadena/client` accordingly

```ts
import { signWithChainweaver } from '@kadena/client';

// use the finalized transaction, and sign it with Chainweaver
const signedTransaction = signWithChainweaver(unsignedTransaction)
  .then(console.log)
  .catch(console.error);
```

> To **send** the transaction to the blockchain, continue with
> [**Send a request to the blockchain**](#send-a-request-to-the-blockchain)

# Template based interaction using @kadena/client

To provide contract-developers a way to communicate how their contracts should
be used, we added a way to get autocompletion for templates. Contract-developers
can now provide their contracts that consumers of their smart-contract can use
in Javascript.

## Load the contract repository

For now we have not added a way to directly generate the code from a remote git
repository. Cloning the template repository as a submodule is a great option.
This gives you a way to version the source of the templates.

```sh
git submodule add \
  git@github.com:kadena-community/kadena-coin-templates.git \
  ./templates/
```

<details>
  <summary>Useful `git submodule` commands (click to open)</summary>
  
- Add a Git repository as a submodule:  
  `git submodule add repository_url`

- Add a Git repository as a submodule at the specified directory:  
  `git submodule add repository_url path/to/directory`

- Update every submodule to its latest commit:  
  `git submodule foreach git pull`

- Install a repository's specified submodules (after cloning the repo):  
  `git submodule update --init --recursive`

</details>

## Generate code from templates

Usually a template directory/repository contains multiple templates, but they're
all from the same source. So we're grouping them per directory/repository. This
is done by selecting the directory as input for the command.

This command will result in one file containing all the templates.

```sh
pactjs template-generate --file ./templates/kadena-coin-templates/ --out ./generated/kadena-coin-templates.ts
```

Notes on the input (`--file`) and output (`--out`):

- `-f, --file`
  - selecting a file as input will create ONLY code for that file
  - selecting a directory as input will create code for ALL the templates in the
    directory
- `-o, --out`
  - when the output is a file, the code for the templates will end up in that
    file
  - when the output is a directory, an `index.ts` will be created in that
    directory, containing the code for the templates

## A function is generated from a template

Each file in the repository is converted to a function that can be called. The
function has one argument; an object that contains named key-value pairs for
each variable in the template.

For example, a bogus template that looks like this

```txt
# ./hello.txt
This is a Hello, {{name}}!
```

Will have it's function call:

```ts
import myTemplates from './myTemplates';

myTemplates.hello({ name: 'alber70g' });
```

Of course this isn't a valid template to be used as a transaction, so this won't
work. This outlines the general idea of how templates are used.

## Using the generated code

Let's say we're using this template. Templates **aren't** valid `yaml`. They are
however checked to be valid transactions when used as templates.

```txt
code: |-
  (coin.transfer "{{fromAcct}}" "{{toAcct}}" {{amount}})
data:
publicMeta:
  chainId: '{{chain}}'
  sender: {{fromAcct}}
  gasLimit: 2500
  gasPrice: 1.0e-8
  ttl: 600
networkId: {{network}}
signers:
  - pubKey: {{fromKey}}
    caps:
      - name: 'coin.TRANSFER'
        args: [{{fromAcct}}, {{toAcct}}, {{amount}}]
      - name: 'coin.GAS'
        args: []
type: exec
```

Each of the `{{name}}`s are variables that can be passed to the template
function.

The function returns a `CommandBuilder`, this can be used to add metadata to the
transaction and to `signWithChainweaver(unsignedTx)`
[as shown here](#integrated-sign-request-to-chainweaver-desktop)

```ts
import kadenaCoinTemplates from './templates/kadena-coin-templates';

// this returns a commandBuilder
const commandBuilder = kadenaCoinTemplates['safe-transfer']({
  fromAcct: 'k:sender-pubkey',
  toAcct: 'k:receiver-pubkey',
  fromKey: 'sender-pubkey',
  amount: '231',
  chain: '1',
  network: 'mainnet01',
});

const unsignedTransaction = commandBuilder.createTransaction();
```

# Using the PactCommand class

If you don't wish to generate JS code for your contracts, or use templates, you can use the PactCommand class directly to build a command modularly, and then easily send it.

```ts
import { PactCommand } from '@kadena/client';

var pactCommandBuilder = new PactCommand();

pactCommandBuilder.code = '(format "Hello {}!" [(read-msg "person")])';

// Add environment data to the transaction
pactCommandBuilder.addData({
  person: "Randy",
});

// Update the metadata to include a sender, and set the chain
pactCommandBuilder.setMeta({
  publicMeta: {
    chainId: '8',
    gasLimit: 2500,
    gasPrice: 1.0e-8,
    sender: 'k:abc',
    ttl: 8 * 60 * 60, // 8 hours,
  },
  networkId: 'testnet04',
});

// Update the capabilities
pactCommandBuilder.addCap({
  signer: 'k:abc'
  capability:'coin.GAS'
});

// Add signatures
pactCommandBuilder.addSignatures([{
  pubkey: 'k:abc',
  sig: 'xyz',
}]);

// Send it or local it
pactCommandBuilder.local('https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/8/pact');
pactCommandBuilder.send('https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/8/pact');

```

# Send a request to the blockchain

The `ICommandBuilder` has a few utility functions. They're taken from the
[Pactjs API](https://api.chainweb.com/openapi/pact.html).

- `local`,
- `send` and
- `poll`.

Probably the simplest call you can make is `describe-module`, but as this is not
on the `coin` contract, we have to trick Typescript a little:

> See:
> https://github.com/kadena-community/kadena.js/blob/master/packages/libs/pactjs-test-project/src/example-contract/get-balance.ts

```ts
const res = await Pact.modules.coin['get-balance']('albert').local(
  'https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact/',
);
console.log(JSON.stringify(res, null, 2));
```

> **A more elaborate example** that includes signing, sending, **and polling**
> can be found here:
> https://github.com/kadena-community/kadena.js/blob/master/packages/libs/pactjs-test-project/src/example-contract/transfer.ts

# Further development

This is the launch post of `@kadena/client`. Next steps will be to see what the
community thinks of this approach. We'd love to hear your feedback and use
cases, especially when the current `@kadena/client` and `@kadena/pactjs-cli`
isn't sufficient.

# Contact the team

We try to be available via Discord and Github issues:

- [Github Issues](https://github.com/kadena-community/kadena.js/issues)
- Discord in the
  [#kadena-js channel](https://github.com/kadena-community/kadena.js/issues)
