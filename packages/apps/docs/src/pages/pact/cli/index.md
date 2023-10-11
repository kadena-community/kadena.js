---
title: generate
description: Kadena makes blockchain work for everyone.
menu: CLI tool
label: generate
order: 6
editLink: https://github.com/kadena-community/kadena.js/edit/main/packages/tools/pactjs-cli/README.md
layout: full
tags: [pactjs,cli,client,contracts]
lastModifiedDate: Thu, 06 Jul 2023 12:02:09 GMT
---
# generate

Generate client based on a contract

| **Parameter**        | **Description**                                                                                                        | **Required**                | **Default value** |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------- | --------------------------- | ----------------- |
| -c, --clean          | Clean existing generated files                                                                                         | No                          |                   |
| -i, --caps-interface | Custom name for the interface of the caps. Can be used to create a type definition with a limited set of capabilities. | No                          |                   |
| -f, --file           | Generate d.ts from Pact contract file                                                                                  | If --contract is ommitted   |                   |
| --contract           | Generate d.ts from Pact contract from the blockchain                                                                   | If --file is ommitted       |                   |
| --api                | The API to use for retrieving the contract (e.g. [https://api.chainweb.com/chainweb/0.0/mainnet01/chain/8/pact ](https://api.chainweb.com/chainweb/0.0/mainnet01/chain/8/pact))    | When --contract is provided |                   |
| --chain              | The chainId to retrieve the contract from                                                                              | When --contract is provided | 0                 |
| --network            | The networkId to retrieve the contract from (e.g. testnet)                                                             | When --contract is provided | mainnet           |

**Generate from file**

```sh
pactjs contract-generate --file ./myContract.pact
```

**Generate from chain**

```sh
pactjs contract-generate --contract free.coin --api https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact --chain 1 --network testnet
```
