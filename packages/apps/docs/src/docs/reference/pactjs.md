---
title: PactJS
description:
  PactJS is a TypeScript library of API functions for interacting with the Kadena blockchain.
menu: PactJS
label: PactJS
order: 1
layout: full
tags: ['pact', 'language reference']
---

# PactJS

PactJS is a TypeScript library of API functions and utilities for front-end development and interacting with the Kadena blockchain.
The documentation for PactJS is generated automatically from the source code.

## Core API functions

You can find the generated documentation for the PactJS API in the PactJS repository [API report](https://github.com/kadena-community/kadena.js/blob/main/packages/libs/pactjs/etc/pactjs.api.md).

## Utilities

You can find the generated documentation for the PactJS utility functions in the PactJS repository [Utilities API report](https://github.com/kadena-community/kadena.js/blob/main/packages/libs/pactjs/etc/pactjs-utils.api.md).

## PactJS type generator

The `@kadena/pactjs-generator` package generates TypeScript definitions for Pact contracts that you can use in PactJS programs.
You can find the generated documentation for the `pactjs-generator` package in the PactJS repository [PactJS Generator API report](https://github.com/kadena-community/kadena.js/blob/main/packages/libs/pactjs-generator/etc/pactjs-generator.api.md).

## PactJS command-line interface

The `@kadena/pactjs-cli` package works with the `@kadena/pactjs-core` and `@kadena/pactjs-client` packages to generate TypeScript definitions and a client for Pact contracts.

### generate

Use this command to generate a client based on a contract.

#### Options

| **Parameter** | **Description** | **Required** | **Default value** |
| :------------- | :--------------- | :------------ | :----------------- |
| -c, --clean | Clean existing generated files. | No | |
| -i, --caps-interface | Custom name for the interface of the caps. Can be used to create a type definition with a limited set of capabilities. | No | |
| -f, --file | Generate d.ts from Pact contract file. | Required if --contract is omitted. | |
| --contract | Generate d.ts from Pact contract from the blockchain. | If --file is omitted | |
| --api | The API to use for retrieving the contract (for example, [https://api.chainweb.com/chainweb/0.0/mainnet01/chain/8/pact][1]) | When --contract is provided. | |
| --chain | The chainId to retrieve the contract from. | When --contract is provided. | 0 |
| --network | The networkId to retrieve the contract from (for example, testnet). | When --contract is provided. | mainnet |

#### Examples

To generate a client from a file:

```sh
pactjs contract-generate --file ./myContract.pact
```

To generate a client from a chain:

```sh
pactjs contract-generate --contract free.coin --api https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact --chain 1 --network testnet
```

### retrieve-contract

Use this command to retrieve a contract from an API using a /local call.

#### Options

| **Parameter** | **Description** | **Required** | **Default value** |
| :------------- | :--------------- | :------------ | :----------------- |
| -m --module | The module you want to retrieve (for example, "coin"). | Yes | |
| -o, --out | File to write the contract to (for example, ./myContractpact). | Yes | |
| -a, --api | API to fetch the contract from (for example, [https://api.chainweb.com/chainweb/0.0/mainnet01/chain/8/pact][1]). | Yes | [https://api.chainweb.com][2] |
| -n, --network | Network to retrieve from (for example,testnet) | No | mainnet |

#### Examples

To retrieve a contract from chain:

```sh
pactjs retrieve-contract --out ./myContract.pact --module coin --api https://api.chainweb.com/chainweb/0.0/mainnet01/chain/8/pact
```

### template-generate

Use this command to generate statically typed generators for templates.

| **Parameter** | **Description** | **Required** | **Default value** |
| :------------- | :--------------- | :------------ | :------------- |
| -c, clean | Clean existing template. | No | |
| -f, --file | File or directory to use to generate the client. | Yes | |
| -o, --out | Output file/directory to place the generated client. | Yes | |

#### Examples

To generate a client from a template:

```sh
pactjs template-generate --file ./contractDir --out ./myContract.pact
```

[1]: https://api.chainweb.com/chainweb/0.0/mainnet01/chain/8/pact
[2]: https://api.chainweb.com
