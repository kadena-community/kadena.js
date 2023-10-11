---
title: retrieve-contract
description: Kadena makes blockchain work for everyone.
menu: retrieve-contract
label: retrieve-contract
order: 1
editLink: https://github.com/kadena-community/kadena.js/edit/main/packages/tools/pactjs-cli/README.md
layout: full
tags: [pactjs,cli,client,contracts]
lastModifiedDate: Thu, 06 Jul 2023 12:02:09 GMT
---
# retrieve-contract

Retrieve a contract from an API using a /local call

| **Parameter** | **Description**                                                                                         | **Required** | **Default value**             |
| ------------- | ------------------------------------------------------------------------------------------------------- | ------------ | ----------------------------- |
| -m --module   | The module you want to retrieve (e.g. "coin")                                                           | Yes          |                               |
| -o, --out     | File to write the contract to (e.g. ./myContract.pact)                                                  | Yes          |                               |
| -a, --api     | API to fetch the contract from (e.g. [https://api.chainweb.com/chainweb/0.0/mainnet01/chain/8/pact ](https://api.chainweb.com/chainweb/0.0/mainnet01/chain/8/pact)) | Yes          | [https://api.chainweb.com ](https://api.chainweb.com) |
| -n, --network | Network to retrieve from (e.g. testnet)                                                                 | No           | mainnet                       |

Retrieve a contract from chain

```sh
pactjs retrieve-contract --out ./myContract.pact --module coin --api https://api.chainweb.com/chainweb/0.0/mainnet01/chain/8/pact
```
