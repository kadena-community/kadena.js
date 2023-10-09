---
title: Send a request to the blockchain
description: Kadena makes blockchain work for everyone.
menu: Send a request to the blockchain
label: Send a request to the blockchain
order: 7
editLink: https://github.com/kadena-community/kadena.js/edit/main/packages/libs/client/README.md
layout: full
tags: [javascript,typescript,signing,transaction,typescript client]
lastModifiedDate: Tue, 19 Sep 2023 09:58:38 GMT
---
# Send a request to the blockchain

The `@kadena/client` provides a `createClient` function with some utility
functions. these helpers call the Pact API under the hood [Pactjs API ](https://api.chainweb.com/openapi/pact.html).

*   `submit`
*   `pollStatus`
*   `getStatus`
*   `pollSpv`
*   `getSpv`
*   `local`,
*   `preflight`
*   `dirtyRead`
*   `signatureVerification`

`createClient` accepts the host url or the host url generator function that
handles url generating as pact is a multi chain network we need to change the
url based on that.

```ts
// we only want to send request to the chain 1 one the mainnet
const hostUrl = 'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/1/pact';
const client = createClient(hostUrl);
// we need more flexibility to call different chains or even networks, then functions
// extract networkId and chainId from the cmd part of the transaction and use the hostUrlGenerator to generate the url
const hostUrlGenerator = ({ networkId, chainId }) =>
  `https://api.chainweb.com/chainweb/0.0/${networkId}/chain/${chainId}/pact`;
const { local, submit, getStatus, pollStatus, getSpv, pollSpv } =
  createClient(hostUrlGenerator);
```

Probably the simplest call you can make is `describe-module`, but as this is not
on the `coin` contract, we have to trick Typescript a little:

Also see [example-contract/get-balance.ts ](https://github.com/kadena-community/kadena.js/blob/main/packages/libs/client-examples/src/example-contract/get-balance.ts).

```ts
const res = await local({
  payload: {
    exec: {
      code: Pact.modules.coin['get-balance']('albert'),
    },
  },
});
console.log(JSON.stringify(res, null, 2));
```

A more elaborate example that includes signing, sending **and polling** can be
found in [example-contract/transfer.ts ](https://github.com/kadena-community/kadena.js/blob/main/packages/libs/client-examples/src/example-contract/transfer.ts)
