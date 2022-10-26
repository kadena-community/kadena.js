Title: Release @kadena/client

We've created a library that allows Javascript/Typescript users to easily
interact with the Kadena Blockchain. We've explicitly kept out creating
contracts as it's way more complicated to transpile Javascript to Pact, as
contracts need to be Pact lang in the end anyway.

Interaction with the Kadena Blockchain works in multiple ways, and they're
described in this article. We'll also go into the concepts and rationale of
@kadena/client.

- [Prerequisites](#prerequisites)
- [Bootstrapping @kadena/client](#bootstrapping-kadenaclient)
  - [Load contracts from the blockchain](#load-contracts-from-the-blockchain)
  - [Manually singing the transaction](#manually-singing-the-transaction)
  - [Automated sign request to **Chainweaver desktop**](#automated-sign-request-to-chainweaver-desktop)
- [Building a simple transaction using a template](#building-a-simple-transaction-using-a-template)
  - [Load the contract repository](#load-the-contract-repository)
  - [Generate code from templates](#generate-code-from-templates)
  - [A function is generated from a template](#a-function-is-generated-from-a-template)
  - [Using the generated code](#using-the-generated-code)
- [Further development](#further-development)
- [Contact the team](#contact-the-team)

# Prerequisites

We're not going over installation of nodejs and package management, this
information is widely available on the internet. We will provide the bare
minimum of the things you need to do in order to start using @kadena/client:

- install nodejs version 14.x or 16.x
- create a directory, bootstrap a `package.json` by running `npm init` or
  `npm init -y` to use defaults
- install the client `npm install @kadena/client`
- install the commandline tool `npm install @kadena/pactjs-cli`

# Bootstrapping @kadena/client

We wanted @kadena/client to be self sufficient even when you're not using
default contracts like `coin` or `marmalade`. That's why you have to generate
the interfaces that are used by `@kadena/client` from information on the
blockchain or from your own smart contracts.

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
package has been created: `@kadena/generated`. This package is referenced by
`@kadena/client` to give you type information.

# Building a simple transaction from the contract

Now that everything is bootstrapped, we can start building transactions.

Create a new file and name it `transfer.ts` (or `.js`).

```ts
import { Pactjs } from '@kadena/client';

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

Take note of the following:

- namespaced arguments (`k:`, `w:` etc) are account-names, where non-namespaced
  arguments are public-keys
- the contract doesn't specify whether you need to pass an **account-name** or
  **public-key**. This is knowledge that can be obtained by inspecting the
  contract downloaded earlier or consulting the documentation for the contract.
- `addCap` function accepts a `capability` and a `public-key` of the signer of
  the capability. The other arguments are defined by the contract. `coin.GAS`
  doesn't have any arguments, `coin.TRANSFER` does.
- `setMeta`s object has a `sender` property, which is a `public-key`.

## Manually singing the transaction

To sign the transaction, you can use the builder to output something that can be
pasted into the `SigData` of Chainweaver.

```ts
// createTransaction() will calculate hashes and finalizes the unsigned transaction
const unsignedTransaction = transactionBuilder.createTransaction();

console.log(JSON.stringify(unsignedTransaction));
```

## Automated sign request to **Chainweaver desktop**

This is not very user friendly. Using the `transaction` we can send a
sign-request to Chainweaver. **(NB: this can only with the desktop version, not
the web-version, as it's
[exposing port 9467](https://kadena-io.github.io/signing-api/)**

> In the future we will provide an interface with WalletConnect. This is not yet
> finalized. Once it is, we'll update the `@kadena/client` accordingly

```ts
import {
  signAndSubmitWithChainweaver,
  signWithChainweaver,
} from '@kadena/client';

// pass the transactionBuilder object, as metadata can still be changed
const submitResult = signAndSubmitWithChainweaver(transactionBuilder);

// use the finalized transaction, and sign it with Chainweaver
cont signedTransaction = signWithChainweaver(unsignedTransaction)
  .then(console.log)
  .catch(console.error);
```

Take note of the following:

- `createTransaction()` will **finalize** the transaction. The hash will be
  calculated. Things like `sender`, `gasPrice` or `gasLimit` **CANNOT be
  changed** anymore.
- `signWithChainweaver` needs the finalized transaction
- `signAndSubmitWithChainweaver` needs the "open" transaction, as it needs to
  calculate the hash for the metadata (sender, gas-parameters)

# Building a simple transaction using a template

To provide contract-developers a way to communicate how their contracts should
be used, we added a way to get intelliSense for templates. Contract-developers
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
work. But this outlines the general idea of how templates are used.

## Using the generated code

Let's say we're using this template. Templates **aren't** valid `yaml`. They are
however checked to be valid transactions when used as templates.

```
code: |-
  (coin.transfer "{{fromAcct}}" "{{toAcct}}" {{amount}})
data:
publicMeta:
  chainId: "{{chain}}"
  sender: {{fromAcct}}
  gasLimit: 2500
  gasPrice: 1.0e-8
  ttl: 600
networkId: {{network}}
signers:
  - pubKey: {{fromKey}}
    caps:
      - name: "coin.TRANSFER"
        args: [{{fromAcct}}, {{toAcct}}, {{amount}}]
      - name: "coin.GAS"
        args: []
type: exec
```

Each of the `{{name}}`s are variables that can be passed to the template
function.

The function returns a `CommandBuilder`, this can be used in the
`signAndSubmitWithChainweaver(cmd)` or to `.createTransaction()` and use in
`signWithChainweaver(unsignedTx)`
[as shown here](#automated-sign-request-to-chainweaver-desktop)

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
