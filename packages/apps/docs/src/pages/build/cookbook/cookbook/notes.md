---
title: Notes
description: Kadena makes blockchain work for everyone.
menu: Notes
label: Notes
order: 2
editLink: https://github.com/kadena-community/kadena.js/edit/main/packages/tools/cookbook/README.md
layout: full
tags: [javascript,typescript,pact,reference,api]
lastModifiedDate: Mon, 31 Jul 2023 09:47:29 GMT
---
# Notes

*   These scripts assume that accounts follow the recommended convention:
    `k:publicKey`. If your account name does not follow this convention, you will
    need to manually update it in the script.
*   All scripts are integrated with sign requests to Chainweaver desktop (this
    will not work on the web client). If you would like to manually paste the
    sigData into the Chainweaver application, you can use the `printSigData`
    function provided in the utils directory.
*   If you would like to test a transaction without sending it to the blockchain
    to be mined, you can use the `printLocal` function provided in the utils
    directory to print the response for a non-transactional command execution.

[1]: https://github.com/kadena-community/kadena.js/tree/main/packages/libs/client#kadenajs---client

[2]: https://github.com/kadena-community/kadena.js/tree/main/packages/tools/cookbook/src/accounts/create-account.ts

[3]: https://github.com/kadena-community/kadena.js/tree/main/packages/tools/cookbook/src/accounts/transfer-create.ts

[4]: https://github.com/kadena-community/kadena.js/tree/main/packages/tools/cookbook/src/accounts/get-balance.ts

[5]: https://github.com/kadena-community/kadena.js/tree/main/packages/libs/client#load-contracts-from-the-blockchain
