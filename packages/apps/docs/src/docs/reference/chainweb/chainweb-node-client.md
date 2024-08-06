---
title: Node clients
description:
  The Chainweb client libraries provide TypeScript-based application programming interfaces (API) for calling Chainweb node endpoints.
menu: Chainweb clients
label: Node client
order: 1
layout: full
tags: ['TypeScript', 'Kadena client', 'frontend']
---

# Chainweb node client

The `@kadena/chainweb-node-client` library provides typed JavaScript wrapper functions that enable you to call `chainweb-node` API [peer-to-peer](/reference/chainweb-api) and [Pact](/reference/rest-api) endpoints.

Most of the functions in this library are replaced by functions provided in the `@kadena/client` library.
However, this package provides the following functions for connecting to Pact endpoints to perform the most common tasks:

- createListenRequest
- createPollRequest
- createSendRequest
- listen
- local
- mkCap
- parseResponse
- parseResponseTEXT
- poll
- send
- spv
- stringifyAndMakePOSTRequest

## Install

You can install this package with `npm` or `yarn`.

To install using `npm`, run the following command:

```sh
npm install @kadena/chainweb-node-client
```

To install using `yarn`, run the following command:

```sh
yarn add @kadena/chainweb-node-client
```

## Usage

```js
import { ChainwebNodeClient } from '@kadena/chainweb-node-client';
```

## createListenRequest

Use `createListenRequest` to prepare a message for the `/listen` endpoint.
This function create a JSON request using the `cmds` field to return an object with the request key to use in listening for the successful execution of a pending transaction.

```typescript
import { expect, test } from 'vitest';
import { createListenRequest } from '../createListenRequest';
import { createSendRequest } from '../createSendRequest';
import { command } from './mockdata/execCommand';

test('Takes in command formatted for /send endpoint and outputs request for /listen endpoint', () => {
  const actual = createListenRequest(createSendRequest(command));
  const expected = {
    listen: command.hash,
  };

  expect(expected).toEqual(actual);
});
```

## createPollRequest

Use `createPollRequest` to prepare a message for the `/poll` endpoint.
This function create a JSON request using the `cmds` field to return an object with the request key to use in polling to determine the status of a pending transaction.

```typescript
import { expect, test } from 'vitest';
import { createPollRequest } from '../createPollRequest';
import { createSendRequest } from '../createSendRequest';
import { command } from './mockdata/execCommand';

test('Takes in command formatted for /send endpoint and outputs request for /poll endpoint', () => {
  const actual = createPollRequest(createSendRequest(command));
  const expected = {
    requestKeys: [command.hash],
  };

  expect(expected).toEqual(actual);
});
```
## createSendRequest

Use `creatSendRequest` to create an outer wrapper for a request to the `/send` endpoint.
This function takes a single command or an array of commands to be executed and returns the command or list of commands in the format required for the `/send` endpoint.

```typescript
import { expect, test } from 'vitest';
import { createSendRequest } from '../createSendRequest';
import { command } from './mockdata/execCommand';

test('Takes in Pact command object and outputs command formatted specifically for a send request', () => {
  const actual = createSendRequest(command);
  const expected = {
    cmds: [command],
  };

  expect(expected).toEqual(actual);
});
```

## listen

Use `listen` to listen for the result of a Pact command on a Chainweb node server and retrieve a raw response.

```ts
const requestKey: IListenRequestBody = {
  listen: 'ATGCYPWRzdGcFh9Iik73KfMkgURIxaF91Ze4sHFsH8Q',
};

const response: ICommandResult | Response = await listen(requestKey, '');
```

## local

Use `local` to call the `/local` endpoint on a Chainweb node to submit a synchronous command for non-transactional execution. 
In a blockchain environment, this would be a node-local “dirty read”. 
Any database writes or changes to the environment are rolled back.

```ts
const signedCommand: LocalRequestBody = {
  cmd,
  hash,
  sigs: [{ sig }],
};

const response: ICommandResult | Response = await local(signedCommand, '');
```

## mkCap

Use `mkCap` to create a Pact capability object. 
You can use the output from this helper function with the `mkSignerCList` function.

```ts
mkCap('coin.TRANSFER', ['fromAcctName', 'toAcctName', 0.1]);
```

## parseResponse

Use `parseResponse` to parse a raw `fetch` response into a typed JSON value.

```ts
const parsedResponse = await parseResponse(response as Response);
```

## parseResponseTEXT

Use `parseResponseTEXT` to parse a raw `fetch` response into a typed JSON value.

```ts
const parsedResponse = await parseResponseTEXT(response as Response);
```

## poll

Use `poll` to poll for one or more transaction results by request key.

```ts
const signedCommand: IPollRequestBody = {
  requestKeys: ['ATGCYPMNzdGcFh9Iik73KfMkgURIxaF91Ze4sHFsH8Q'],
};

const response: Response | IPollResponse = await poll(signedCommand, '');
```

## send

Use `send` to submit asynchronous transactions with one or more public (unencrypted) commands to the
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

## spv

Use `spv` to send a request to the `/spv` endpoint and retrieves a simple payment verification proof of a cross chain transaction.

```ts
const spvResponse: string | Response = await spv(spv_request, '');
```

## stringifyAndMakePOSTRequest

Use `stringifyAndMakePOSTRequest` to format the API request body to use with `fetch` function.

```ts
const body: object = {
  name: 'hello',
  val: 'Kadenians',
};

stringifyAndMakePOSTRequest(body);
```
