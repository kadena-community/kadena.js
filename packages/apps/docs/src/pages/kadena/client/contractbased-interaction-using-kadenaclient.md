---
title: Contract-based interaction using @kadena/client
description: Kadena makes blockchain work for everyone.
menu: Contract-based interaction using @kadena/client
label: Contract-based interaction using @kadena/client
order: 2
editLink: https://github.com/kadena-community/kadena.js/edit/main/packages/libs/client/README.md
layout: full
tags: [javascript, typescript, signing, transaction, typescript client]
lastModifiedDate: Tue, 19 Sep 2023 09:58:38 GMT
---

# Contract-based interaction using @kadena/client

We wanted `@kadena/client` to be independent so this is a tool that can be used
with arbitrary contracts. That is also why you have to _generate_ the interfaces
used by `@kadena/client`. You can use smart contracts from the blockchain or
your own local ones.

For the **template based interaction** we will provide a repository with
templates that can be used.

### Generate interfaces from the blockchain

Generate types directly from a contract on the blockchain:

```sh
pactjs contract-generate --contract "coin" --api "https://api.chainweb.com/chainweb/0.0/mainnet01/chain/1/pact"
```

The log shows what has happened. Inside the `node_modules` directory, a new
package has been created: `.kadena/pactjs-generated`. This package is referenced
by `@kadena/client` to give you type information.

Now you can use this by
[creating a transaction that calls a smart contract function ]().

**NOTE:** Make sure to add the new `types` to `compilerOptions` in
`tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": [".kadena/pactjs-generated"]
  }
}
```

#### Generate interfaces locally

You can create your own smart contract or
[download it from the blockchain ](/kadena/client/contractbased-interaction-using-kadenaclient#downloading-contracts-from-the-blockchain)
using `pactjs`.

Using the contract we'll now generate all the functions (`defun`) with their
(typed) arguments and capabilities (`defcap`).

```sh
pactjs contract-generate --file "./contracts/coin.module.pact"
```

### Downloading contracts from the blockchain

Let's download the contracts you want to create Typescript interfaces for:

```sh
mkdir contracts
npx pactjs retrieve-contract --out "./contracts/coin.module.pact" --module "coin"
```

There are several options to retrieve contracts from another network or chain.

Use `--help` to get information on `retrieve-contract`:

```txt
> pactjs retrieve-contract --help

Usage: pactjs retrieve-contract [options]

Retrieve contract from a chainweb-api in a /local call (see also: https://github.com/kadena-io/chainweb-node#configuring-running-and-monitoring-the-health-of-a-chainweb-node).

Options:
  -m, --module <module>    The module you want to retrieve (e.g. "coin")
  -o, --out <file>         File to write the contract to
  --api <url>              API to retrieve from (e.g. "https://api.chainweb.com/chainweb/0.0/mainnet01/chain/8/pact")
  -n, --network <network>  Network to retrieve from (default "mainnet") (default: "mainnet")
  -c, --chain <number>     Chain to retrieve from (default 1) (default: 1)
  -h, --help               display help for command
```
