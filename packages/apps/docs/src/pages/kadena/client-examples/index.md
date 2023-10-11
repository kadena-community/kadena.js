---
title: Preparation
description: Kadena makes blockchain work for everyone.
menu: Client examples
label: Preparation
order: 8
editLink: https://github.com/kadena-community/kadena.js/edit/main/packages/libs/client-examples/README.md
layout: full
tags: [javascript,typescript,examples,transfer]
lastModifiedDate: Thu, 14 Sep 2023 08:08:10 GMT
---
# Preparation

In the following examples, we will interact with the `coin` contract. To have
better type support, we strongly recommend generating the type definition from
the contract using `@kadena/pactjs-cli`.

To install `@kadena/pactjs-cli` as a dev dependency for your project, run the
following command in the terminal:

```sh
npm install @kadena/pactjs-cli --save-dev
```

You can generate type definitions from either a local file or directly from the
chain.

### Creating a type definition from a contract deployed on the chain

```sh
npx pactjs contract-generate --contract="coin" --api https://api.chainweb.com/chainweb/0.0/mainnet01/chain/1/pact
```

### Creating a type definition from a pact file

```sh
npx pactjs contract-generate --file=./coin.pact --api https://api.chainweb.com/chainweb/0.0/mainnet01/chain/1/pact
```

if your contract has dependency to other modules you should either pass those
modules with `--file` or if they are already deployed on the chain you can use
`--api` to let the script fetch them from the chain. So for the coin example you
can alternatively use the following command if you have all of the files
locally.

```sh
npx pactjs contract-generate --file=./coin.pact --file=./fungible-v2.pact --file=./fungible-xchain-v1.pact
```

Note: You can use `--file` and `--contract` several times, and even together.

*Tip: Remember to persist the generated types by adding the command as a npm
scripts.*
