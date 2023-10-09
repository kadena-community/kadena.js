---
title: Pact
description: Kadena makes blockchain work for everyone.
menu: Pact
label: Pact
order: 1
editLink: https://github.com/kadena-community/kadena.js/edit/main/packages/libs/chainweb-node-client/README.md
layout: full
tags: [chainweb,pact,reference]
lastModifiedDate: Mon, 10 Jul 2023 09:00:36 GMT
---
# Pact

### listen

Listen for result of Pact command on a Pact server and retrieves raw response.

```ts
const requestKey: IListenRequestBody = {
  listen: 'ATGCYPWRzdGcFh9Iik73KfMkgURIxaF91Ze4sHFsH8Q',
};

const response: ICommandResult | Response = await listen(requestKey, '');
```

### local

Blocking/sync call to submit a command for non-transactional execution. In a
blockchain environment this would be a node-local “dirty read”. Any database
writes or changes to the environment are rolled back.

```ts
const signedCommand: LocalRequestBody = {
  cmd,
  hash,
  sigs: [{ sig }],
};

const response: ICommandResult | Response = await local(signedCommand, '');
```

### mkCap

Helper function for creating a pact capability object. Output can be used with
the `mkSignerCList` function.

```ts
mkCap('coin.TRANSFER', ['fromAcctName', 'toAcctName', 0.1]);
```

### parseResponse

Parses raw `fetch` response into a typed JSON value.

```ts
const parsedResponse = await parseResponse(response as Response);
```

### parseResponseTEXT

```ts
const parsedResponse = await parseResponseTEXT(response as Response);
```

### poll

Allows polling for one or more transaction results by request key.

```ts
const signedCommand: IPollRequestBody = {
  requestKeys: ['ATGCYPMNzdGcFh9Iik73KfMkgURIxaF91Ze4sHFsH8Q'],
};

const response: Response | IPollResponse = await poll(signedCommand, '');
```

### send

Asynchronous submission of one or more public (unencrypted) commands to the
blockchain for execution.

```ts
const signedCommand1: ICommand = {
  cmd,
  hash,
  sigs: [{ sig }],
};

// A tx created for chain 0 of devnet using `pact -a`.
const signedCommand2: ICommand = {
  cmd,
  hash,
  sigs: [{ sig }],
};

const sendRequest: IISendRequestBody = {
  cmds: [signedCommand1, signedCommand2],
};

const response: Response | ISendResponse = await send(sendRequest, '');
```

### spv

Sends request to /spv and retrieves spv proof of a cross chain transaction.

```ts
const spvResponse: string | Response = await spv(spv_request, '');
```

### stringifyAndMakePOSTRequest

Formats API request body to use with `fetch` function.

```ts
const body: object = {
  name: 'hello',
  val: 'Kadenians',
};

stringifyAndMakePOSTRequest(body);
```

[1]: https://github.com/kadena-community/kadena.js/tree/main/packages/libs/chainweb-node-client/etc/chainweb-node-client.api.md

[2]: https://api.chainweb.com/openapi/pact.html

[3]: https://api.chainweb.com/openapi/#tag/rosetta
