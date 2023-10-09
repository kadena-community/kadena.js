---
title: Using FP approach
description: Kadena makes blockchain work for everyone.
menu: Using FP approach
label: Using FP approach
order: 6
editLink: https://github.com/kadena-community/kadena.js/edit/main/packages/libs/client/README.md
layout: full
tags: [javascript,typescript,signing,transaction,typescript client]
lastModifiedDate: Tue, 19 Sep 2023 09:58:38 GMT
---
# Using FP approach

This library uses a couple of utility functions in order to create pactCommand
you can import those function from `@kadena/client/fp` if you need more
flexibility on crating command like composing command or lazy loading.

Here are two examples to demonstrate this:

*   [example-contract/functional/transfer-fp.ts ](https://github.com/kadena-community/kadena.js/blob/main/packages/libs/client-examples/src/example-contract/functional/transfer-fp.ts)
*   [example-contract/functional/compose-commands.ts ](https://github.com/kadena-community/kadena.js/blob/main/packages/libs/client-examples/src/example-contract/functional/compose-commands.ts)
