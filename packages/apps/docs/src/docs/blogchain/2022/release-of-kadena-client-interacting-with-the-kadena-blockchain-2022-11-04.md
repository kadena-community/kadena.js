---
title: Release of @kadena/client - Interacting with the Kadena Blockchain
description:
  The Kadena.js team has created a library that allows Javascript/Typescript
  users to easily interact with the Kadena Blockchain. Creating contracts is
  explicitly left out of the library as it is much morecomplicated to transpile
  Javascript to Pact.
menu: Release of @kadena/client - Interacting with the Kadena Blockchain
label: Release of @kadena/client - Interacting with the Kadena Blockchain
publishDate: 2022-11-04
headerImage: /assets/blog/1_dAoWAzGntfMI0pKJbVSEhw.webp
tags: [pact]
author: Albert Groothedde
authorId: albert.g
layout: blog
---

# Release of @kadena/client Interacting with the Kadena Blockchain

```ts
    // the blogpost is compatible with the following versions of
    "@kadena/client": "0.0.5",
    "@kadena/chainweb-node-client": "0.0.4",
    "@kadena/pactjs-cli": "0.0.4"
```

> We’ve released a new version of @kadena/client. Head over to Github
> [@kadena/client/README.md](https://github.com/kadena-community/kadena.js/blob/master/packages/libs/client/README.md)
> for the updated docs.

The Kadena.js team has created a library that allows Javascript/Typescript users
to easily interact with the Kadena Blockchain. Creating contracts is explicitly
left out of the library as it is much morecomplicated to transpile Javascript to
Pact.

Interaction with the Kadena Blockchain works in multiple ways. With the
@kadena/client tool, there are two ways you will be able to interact with the
Kadena Blockchain. The two ways are:

1.  [Contract based](https://github.com/kadena-community/kadena.js/blob/main/packages/libs/client/README.md#contract-based-interaction-using-kadenaclient);
    and

2.  [Template based](https://github.com/kadena-community/kadena.js/blob/main/packages/libs/client/README.md#template-based-interaction-using-kadenaclient).

There’s also information on an
[Automated Way of Signing using Chainweaver](https://github.com/kadena-community/kadena.js/blob/main/packages/libs/client/README.md#automated-sign-request-to-chainweaver-desktop),
which will be later detailed in this article. We will also be exploring the
concepts and rationale of @kadena/client.

Please note that we are not going over installation of nodejs and package
management as this information is widely available on the internet. We will,
however, be providing the bare minimum of the information and details you will
need in order to start using @kadena/client, which are:

- install nodejs, version 14.x or 16.x

- create a directory, bootstrap a `package.json` by running `npm init` or
  `npm init -y` to use defaults

- install typescript `npm install -g typescript`

- install the client `npm install @kadena/client`

- install the commandline tool `npm install @kadena/pactjs-cli`

```shell
  npm init -y # creates a package.json npm install @kadena/client
  @kadena/pactjs-cli tsc --init # creates a tsconfig.json
```

### Contract based interaction using @kadena/client

We wanted `@kadena/client` to be independent of anything so this is just a tool
that can be used with arbitrary contracts. In addition, there exists another
reason why you have to generate the interfaces that are used by
`@kadena/client`. You can use information from the blockchain or from your own
smart contracts, locally.

As you will see, we are providing a repository with templates to use with the
template side of this tool.

### Load contracts from the blockchain

Using the commandline tool `@kadena/pactjs-cli`, download the contracts you want
to create Typescript interfaces for.

```shell
    mkdir contracts && npx @kadena/pactjs-cli retrieve-contract --out "./contracts/coin.module.pact" --module "coin"
```

There are several options to retrieve contracts from another network or chain.

Help information on retrieve-contract

```shell
pactjs retrieve-contract --help
```

```shell
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
```

### Generate interfaces

Using the contract we will now generate all the functions (`defun`s) with their
(typed) arguments and the capabilities (`defcap`s).

```shell
    pactjs contract-generate --file "./contracts/coin.module.pact"
```

The log shows what has happened. Inside the `node_modules` directory, a new
package has been created: `.kadena/generated`. This package is extending the
`@kadena/client` types to give you type information. Make sure to add
`"types": [".kadena/client"]` to your `tsconfig.json`.

### Building a simple transaction from the contract

Now that everything is bootstrapped, we can start building transactions.

Create a new file and name it `transfer.ts` (or `.js`).

```typescript
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

- the contract doesn’t specify whether you need to pass an account-name or
  public-key. This is knowledge that can be obtained by inspecting the contract
  downloaded earlier or consulting the documentation for the contract.

- `addCap` function accepts a `capability` and a `public-key` of the signer of
  the capability. The other arguments are defined by the contract. `coin.GAS`
  doesn't have any arguments, coin.TRANSFER does.

- `setMeta`s object has a `sender` property, which is a `public-key`.

## Manually singing the transaction

To sign the transaction, you can use the builder to output something that can be
pasted into the `SigData` of Chainweaver.

```typescript
// createTransaction() will calculate hashes and
// finalizes the unsigned transaction
const unsignedTransaction = transactionBuilder.createTransaction();

console.log(JSON.stringify(unsignedTransaction));
```

## Automated sign request to Chainweaver desktop

Using the transaction we can send a sign-request to Chainweaver. (NB: this can
only with the desktop version, not the web-version, as it's
[exposing port 9467](https://kadena-io.github.io/signing-api/)

In the future we will provide an interface with WalletConnect. This is not yet
finalized. Once it is, we’ll update the `@kadena/client` accordingly

```typescript
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

- `createTransaction()` will finalize the transaction. The hash will be
  calculated. Things like `sender`, `gasPrice` or `gasLimit` CANNOT be changed
  anymore.

- `signWithChainweaver` needs the finalized transaction

- `signAndSubmitWithChainweaver` needs the "open" transaction, as it needs to
  calculate the hash for the metadata (sender, gas-parameters)

## Template based interaction using @kadena/client

To provide contract-developers a way to communicate how their contracts should
be used, we added a way to get autocompletion for templates. Contract-developers
can now provide their contracts that consumers of their smart-contract can use
in Javascript.

## Load the contract repository

For now we have not added a way to directly generate the code from a remote git
repository. Cloning the template repository as a submodule is a great option.
This gives you a way to version the source of the templates.

```shell
    git submodule add \
      git@github.com:kadena-community/kadena-coin-templates.git \
      ./templates/
```

Useful `git submodule` commands (click to open)

- Add a Git repository as a submodule: `git submodule add repository_url`

- Add a Git repository as a submodule at the specified directory:
  `git submodule add repository_url path/to/directory`

- Update every submodule to its latest commit: `git submodule foreach git pull`

- Install a repository’s specified submodules (after cloning the repo):
  `git submodule update --init --recursive`

## Generate code from templates

Usually a template directory/repository contains multiple templates, but they’re
all from the same source. So we’re grouping them per directory/repository. This
is done by selecting the directory as input for the command.

This command will result in one file containing all the templates.

```shell
    pactjs template-generate --file ./templates/kadena-coin-templates/ --out ./generated/kadena-coin-templates.ts
```

Notes on the input (`--file`) and output (`--out`):

`-f, --file`

- selecting a file as input will create ONLY code for that file

- selecting a directory as input will create code for ALL the templates in the
  directory

`-o, --out`

- when the output is a file, the code for the templates will end up in that file

- when the output is a directory, an `index.ts` will be created in that
  directory, containing the code for the templates

## A function is generated from a template

Each file in the repository is converted to a function that can be called. The
function has one argument; an object that contains named key-value pairs for
each variable in the template.

For example, a bogus template that looks like this

```shell
    # ./hello.txt
    This is a Hello, {{name}}!
```

Will have it’s function call

```typescript
import myTemplates from './myTemplates';

myTemplates.hello({ name: 'Albert' });
```

Of course this isn’t a valid template to be used as a transaction, so this won’t
work. But this outlines the general idea of how templates are used.

## Using the generated code

Let’s say we’re using this template. Templates aren’t valid `yaml`. They are
however checked to be valid transactions when used as templates.

```yaml
code: |-
  (coin.transfer "{{fromAcct}}" "{{toAcct}}" {{amount}})
data:
publicMeta:
  chainId: '{{chain}}'
  sender: { { fromAcct } }
  gasLimit: 2500
  gasPrice: 1.0e-8
  ttl: 600
networkId: { { network } }
signers:
  - pubKey: { { fromKey } }
    caps:
      - name: 'coin.TRANSFER'
        args: [{ { fromAcct } }, { { toAcct } }, { { amount } }]
      - name: 'coin.GAS'
        args: []
type: exec
```

Each of the `{{name}}`s are variables that can be passed to the template
function.

The function returns a `CommandBuilder`, this can be used in the
`signAndSubmitWithChainweaver(cmd)` or to `.createTransaction()` and use in
`signWithChainweaver(unsignedTx)`
[as shown here](https://github.com/kadena-community/kadena.js/blob/master/packages/libs/client/docs/launch-post.md#automated-sign-request-to-chainweaver-desktop)

```typescript
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

## Further development

This is the launch post of `@kadena/client`. Next steps will be to see what the
community thinks of this approach. We'd love to hear your feedback and use
cases, especially when the current `@kadena/client` and `@kadena/pactjs-cli`
isn't sufficient.

We hope that you found this article helpful and informative!

## Contact the team

We monitor our Discord channel and Github issues:

- [Github Issues](https://github.com/kadena-community/kadena.js/issues)

- Discord in the
  [#kadena-js channel](https://github.com/kadena-community/kadena.js/issues)
