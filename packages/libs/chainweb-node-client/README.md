# kadena.js - Chainweb Node Client

<p align="center">
  <picture>
    <source srcset="https://github.com/kadena-community/kadena.js/raw/master/common/images/Kadena.JS_logo-white.png" media="(prefers-color-scheme: dark)"/>
    <img src="https://github.com/kadena-community/kadena.js/raw/master/common/images/Kadena.JS_logo-black.png" width="200" alt="kadena.js logo" />
  </picture>
</p>
<hr>

API Reference can be found here [chainweb-node-client.api.md](https://github.com/kadena-community/kadena.js/tree/master/packages/libs/chainweb-node-client/etc/chainweb-node-client.api.md)
<hr>

## Chainweb Node Client

Chainweb Node Client is a typed JavaScript wrapper with fetch to call chainweb-node API endpoints.
These endpoints are broken down into three categories:
1. blockchain - wrapper around chainweb-node p2p api endpoints
2. pact - https://api.chainweb.com/openapi/pact.html
3. rosetta - https://api.chainweb.com/openapi/#tag/rosetta



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

<hr>

## Pact

### listen
```ts
const requestKey: IListenRequestBody = {
  listen: 'ATGCYPWRzdGcFh9Iik73KfMkgURIxaF91Ze4sHFsH8Q',
};

const response: (ICommandResult | Response) = await listen(requestKey, '');
```

### local
```ts
const signedCommand: LocalRequestBody = {
  cmd,
  hash,
  sigs: [
    { sig }
  ],
};

const response: (ICommandResult | Response) = await local(signedCommand, '');
```


### mkCap
```ts
mkCap('coin.TRANSFER', ['fromAcctName', 'toAcctName', 0.1]);
```

### parseResponse

```ts
const parsedResponse = await parseResponse(response as Response);
```


### parseResponseTEXT
```ts
const parsedResponse = await parseResponseTEXT(response as Response);

```

### poll
```ts
const signedCommand: IPollRequestBody = {
  requestKeys: ['ATGCYPMNzdGcFh9Iik73KfMkgURIxaF91Ze4sHFsH8Q'],
};

const response: (Response | IPollResponse) = await poll(signedCommand, '');

```

### send 
```ts
const signedCommand1: ICommand = {
  cmd,
  hash,
  sigs: [
    { sig }
  ]
  ,
};

// A tx created for chain 0 of devnet using `pact -a`.
const signedCommand2: ICommand = {
  cmd,
  hash,
  sigs: [
    { sig }
  ]
};

const sendRequest: IISendRequestBody = {
  cmds: [
    signedCommand1, 
    signedCommand2
  ],
};

const response: (Response | ISendResponse) = await send(sendRequest, '');
```

### spv
```ts
const spvResponse: (string | Response) = await spv(spv_request, '');
```

### stringifyAndMakePOSTRequest
```ts
const body: object = { 
  name: 'hello', 
  val: 'Kadenians' 
};

stringifyAndMakePOSTRequest(body);
```

<hr>
