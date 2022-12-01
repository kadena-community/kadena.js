# Kadena.js Cookbook

This project demonstrates common use cases for `@kadena/client` and
`@kadena/pact-cli` for _smart contracts_

<p align="center">

  <picture>

    <source srcset="https://github.com/kadena-community/kadena.js/raw/master/common/images/Kadena.JS_logo-white.png" media="(prefers-color-scheme: dark)"/>

    <img src="https://github.com/kadena-community/kadena.js/raw/master/common/images/Kadena.JS_logo-black.png" width="200" alt="kadena.js logo" />

  </picture>

</p>

<hr>

In depth documentation for setting up and using @kadena/client can be found at
[@kadena/client](https://github.com/kadena-community/kadena.js/tree/master/packages/libs/client#kadenajs---client)

<hr>

## Overview

| Name                                                     | Description                    |
| -------------------------------------------------------- | ------------------------------ |
| **Accounts**                                             |                                |
| [Create And Fund Account](./accounts/transfer-create.js) | Create and fund a KDA account. |

## Setup

1. [Install dependencies](https://github.com/kadena-community/kadena.js/tree/master/packages/libs/client#load-contracts-from-the-blockchain)
2. [Load contracts from blockchain](https://github.com/kadena-community/kadena.js/tree/master/packages/libs/client#load-contracts-from-the-blockchain)
3. [Generate Interfaces](https://github.com/kadena-community/kadena.js/tree/master/packages/libs/client#load-contracts-from-the-blockchain)
4. Execute commands

Example: Running the transfer-create script:

```bash
ts-node src/accounts/transfer-create.ts senderAccount recieverAccount 1
```

> **NOTE:** These scripts assume that accounts follow the recommended
> convention: k:publicKey `tsconfig.json`. Otherwise this will not work
