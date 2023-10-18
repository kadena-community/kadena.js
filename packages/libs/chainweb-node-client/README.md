<!-- genericHeader start -->

# @kadena/chainweb-node-client

Typed JavaScript wrapper with fetch to call chainweb-node API endpoints

<picture>
  <source srcset="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-white.png" media="(prefers-color-scheme: dark)"/>
  <img src="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-black.png" width="200" alt="kadena.js logo" />
</picture>

<!-- genericHeader end -->

API Reference can be found here [chainweb-node-client.api.md][1]

## Chainweb Node Client

Chainweb Node Client is a typed JavaScript wrapper with fetch to call
chainweb-node API endpoints. These endpoints are broken down into three
categories:

1. blockchain - wrapper around chainweb-node p2p api endpoints
2. pact - [https://api.chainweb.com/openapi/pact.html][2]
3. rosetta - [https://api.chainweb.com/openapi/#tag/rosetta][3]

The Pact API will contain the following functions:

- `listen`
- `local`
- `mkCap`
- `parseResponse`
- `parseResponseTEXT`
- `poll`
- `send`
- `spv`
- `stringifyAndMakePOSTRequest`

## Pact

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

[1]:
  https://github.com/kadena-community/kadena.js/tree/main/packages/libs/chainweb-node-client/etc/chainweb-node-client.api.md
[2]: https://api.chainweb.com/openapi/pact.html
[3]: https://api.chainweb.com/openapi/#tag/rosetta
