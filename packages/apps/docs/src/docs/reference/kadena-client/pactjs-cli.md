---
title: pactjs-cli
description:
  The `@kadena/pactjs-cli` library provides a TypeScript based application programming interface API for interacting with smart contracts and the Kadena network.
menu: Frontend libraries
label: Pactjs-cli
order: 4
layout: full
tags: ['TypeScript', 'Kadena client', 'frontend']
---

# @kadena/pactjs-cli

CThe `@kadena/pactjs-cli` library provides a TypeScript-based API for the `@kadena/pactjs-core` and `@kadena/pactjs-client` packages to generate TypeScript definitions for Pact modules and Kadena client libraries.

## contract-generate

Use `contract-generate` to generate type definitions for a client based on a specified contract.

| **Parameter** | **Description** | 
| :------------- | :--------------- |
| -c, --clean | Removes all existing generated files. | 
| -i, --caps-interface | Specifies a custom name for the interface of the capabilities. You can use this option to create a type definition with a limited set of capabilities. |
| -f, --file | Generates a type definition file (`d.ts`) from a Pact contract file. This option is required if you don't specify the `--contract` option. |
| --contract | Generates a type definition file (`d.ts`) from Pact contract on the blockchain. This option is required if you don't specify the `--file` option. |
| --api | Specifies the API to use to retrieve the contract from a specific network and chain. For example, to retrieve a contract from the Kadena main network and chain eight (8), you would specify `--api https://api.chainweb.com/chainweb/0.0/mainnet01/chain/8/pact` for this option. This option is required if you use the `--contract` option. |
| --chain | Specifies the chain identifier to retrieve the contract from. This option is required if you use the `--contract` option. The default chain identifier is `0`. |
| --network | Specifies the network identifier to retrieve the contract from, for example, `testnet`. This option is required if you use the `--contract` option. The default value is `mainnet`. |

To generate the type definitions from a Pact file:
```sh
pactjs contract-generate --file ./myContract.pact
```

To generate the type definitions from a contract on the Kadena test network:

```sh
pactjs contract-generate --contract free.coin --api https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact --chain 1 --network testnet
```

## retrieve-contract

Use retrieve-contract to retrieve a contract from a node using a `/local` call.

| **Parameter** | **Description** |
| :------------- | :--------------- |
| -m --module | Specifies the module you want to retrieve, for example, the `coin` contract. This parameter is required. |
| -o, --out | Specifies the file name to write the contract to, for example, `./myContract.pact`. This parameter is required. |
| -a, --api |  Specifies the API to use to fetch the contract from. For example, to get a contract from the Kadena main network and chain eight (8), you would specify `--api https://api.chainweb.com/chainweb/0.0/mainnet01/chain/8/pact`. This parameter is required. The default is https://api.chainweb.com. |
| -n, --network | Specifies the network to retrieve the contract from, for example, `testnet`. The default is `mainnet`. |

To retrieve the `coin` contract from the Kadena main network and chain eight (8):

```sh
pactjs retrieve-contract --out ./myContract.pact --module coin --api https://api.chainweb.com/chainweb/0.0/mainnet01/chain/8/pact
```

## template-generate

Use `template-generate` to generate statically-typed generators for templates.

| **Parameter** | **Description** | 
| ------------- | --------------- |
| -c, clean | Removes existing templates. |
| -f, --file | Specifies the file or directory to use to generate the client. This parameter is required. |
| -o, --out | Specifies the output file or directory to place the generated client. This parameter is required. 

To generate a client from a template:

```sh
pactjs template-generate --file ./contractDir --out ./myContract.pact
```
