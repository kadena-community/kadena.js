<!-- genericHeader start -->

# @kadena/cookbook 2

Demonstrates common use cases for @kadena/client and @kadena/pact-cli for smart
contracts

<picture>
  <source srcset="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-white.png" media="(prefers-color-scheme: dark)"/>
  <img src="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-black.png" width="200" alt="kadena.js logo" />
</picture>

<!-- genericHeader end -->

This project demonstrates common use cases for `@kadena/client` and
`@kadena/pact-cli` for _smart contracts_

<p align="center">

<picture>

<source srcset="https://github.com/kadena-community/kadena.js/raw/main/common/images/Kadena.JS_logo-white.png" media="(prefers-color-scheme: dark)"/>

<img src="https://github.com/kadena-community/kadena.js/raw/main/common/images/Kadena.JS_logo-black.png" width="200" alt="kadena.js logo" />

</picture>

</p>

In depth documentation for setting up and using @kadena/client can be found at
[@kadena/client][1]

<hr>

## Overview

| Name                         | Description                    |
| ---------------------------- | ------------------------------ |
| **Accounts**                 |                                |
| [Create Account][2]          | Create a KDA account.          |
| [Create And Fund Account][3] | Create and fund a KDA account. |
| [Get Balance][4]             | Check KDA account balance.     |

## Setup

1. [Install dependencies][5]
2. [Load contracts from blockchain][5]
3. [Generate Interfaces][5]
4. Execute commands

Example: Running the transfer-create script:

```sh
ts-node src/accounts/transfer-create-with-chainweaver.ts senderAccount receiverAccount 1
```

## Notes

- These scripts assume that accounts follow the recommended convention:
  `k:publicKey`. If your account name does not follow this convention, you will
  need to manually update it in the script.
- All scripts are integrated with sign requests to Chainweaver desktop (this
  will not work on the web client). If you would like to manually paste the
  sigData into the Chainweaver application, you can use the `printSigData`
  function provided in the utils directory.
- If you would like to test a transaction without sending it to the blockchain
  to be mined, you can use the `printLocal` function provided in the utils
  directory to print the response for a non-transactional command execution.

[1]:
  https://github.com/kadena-community/kadena.js/tree/main/packages/libs/client#kadenajs---client
[2]:
  https://github.com/kadena-community/kadena.js/tree/main/packages/tools/cookbook/src/accounts/create-account.ts
[3]:
  https://github.com/kadena-community/kadena.js/tree/main/packages/tools/cookbook/src/accounts/transfer-create.ts
[4]:
  https://github.com/kadena-community/kadena.js/tree/main/packages/tools/cookbook/src/accounts/get-balance.ts
[5]:
  https://github.com/kadena-community/kadena.js/tree/main/packages/libs/client#load-contracts-from-the-blockchain
