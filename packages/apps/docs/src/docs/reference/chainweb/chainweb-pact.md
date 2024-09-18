---
title: Pact endpoints
description:
  This document is a reference for the Pact smart-contract language, designed
  for correct, transactional execution on a high-performance blockchain.
menu: Pact REST API
label: Pact REST API
order: 2
layout: full
tags: ['pact', 'rest api', 'pact api', 'pact api reference']
---

# Pact endpoints

These are two sets of Pact REST API endpoints:

- Pact API endpoints that are exposed by Chainweb nodes through the Chainweb service API.
- Pact API endpoints that are exposed locally through the Pact built-in HTTP server.

Both sets of endpoints provide similar functionality.
However, the URLs you use to route API requests to each set of endpoints are different.
This section describes the Pact API endpoints that are exposed through the Chainweb service API.
You can also find documentation for these Pact endpoints, including sample requests and responses, in the [Pact OpenAPI](https://api.chainweb.com/openapi/pact.html) specification.
For documentation about the Pact API endpoints that are exposed through the Pact built-in HTTP server, see [Pact REST API](/reference/rest-api).

## Simulate a transaction

Use the `POST http://{baseUrl}/chain/{chain}/pact/api/v1/local/` endpoint to submit a command to simulate the execution of a transaction. 
Requests sent to the `/local` endpoint don't change the blockchain state. 
Any database writes or changes to the environment are rolled back.
You can use this type of call to perform a node-local “dirty read” for testing purposes or as a dry-run to validate a transaction. 
The request body must contain a properly-formatted Pact command. 
In response to the request, the endpoint returns the command result and hash. 

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the chain identifier of the chain you want to send the request to. Valid values are 0 to 19. For example, to submit the command on the first chain (0), the request is `POST http://{baseURL}/chain/0/pact/api/v1/local/`.

### Query parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| `preflight`	| boolean | Trigger fully-gassed mainnet transaction execution simulation and transaction metadata validation.
| `rewindDepth`	| integer >= 0 | Rewind transaction execution environment by a specified number of block heights.
| `signatureVerification`	| boolean | Require user signature verification when validating the transaction metadata.

### Request body schema

| Parameter | Type | Description
| --------- | ---- | -----------
| `cmd` (required) | string | Stringified JSON payload object. Canonic non-malleable signed transaction data.
| `hash` (required) | string <base64url> | Unpadded Base64URL of Blake2s-256 hash of the `cmd` field value. Serves as a command requestKey since each transaction must be unique.
| `sigs` (required) | Array of objects | List of signatures corresponding one-to-one with the signers array in the payload.

### Responses

Requests to `POST http://{baseURL}/chain/{chain}/pact/api/v1/local` return the following response codes:

- **200 OK** indicates that the request succeeded and the response body includes either the command results or the preflight results. 
- **400 Bad Request** indicates that the request failed. The response returns `text/plain` content with information about why the command couldn't be executed. For example, the response might indicate that the command wasn't executed because the request body specified an invalid gas payer, was missing required metadata, or there were other environment issues.

If the request is successful, the response returns `application/json` content with the following information:

| Parameter | Type | Description
| --------- | ---- | -----------
| `reqKey` (required) | string | Unique identifier for the Pact transaction. The transaction hash is a base64Url-encoded string that consists of 43 characters from the [`a-zA-Z0-9_-`] character set.
| `result` (required) | object | Success (object) or Failure (object).
| `txId`	| number | Database-internal transaction tracking identifier.
| `logs` (required) | string | Backend-specific value providing an image of database logs.
| `metaData` (required) | object | Metadata included with the transaction.
| `events` | Array of object | Array of event objects.
| `continuation`	| object | Describes result of a `defpact` execution.
| `gas` (required) | number | Gas required to execute the transaction.

If you specify the preflight query parameter, the command results include the following additional parameters:

| Parameter | Type | Description
| --------- | ---- | -----------
| `preflightResult` (required) | object | The result of attempting to execute a single well-formed Pact command.
| `preflightWarnings` (required) | Array of strings | A list of warnings associated with deprecated features in upcoming Pact releases. 

### Examples

You can send a request to the Kadena test network and chain 1 by calling the `/local` endpoint like this:

```Postman
POST http://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact/api/v1/local/
```

The request body for this example looks like this:

```json
{"cmd":"{\"signers\":[{\"pubKey\":\"1d5a5e10eb15355422ad66b6c12167bdbb23b1e1ef674ea032175d220b242ed4\",\"clist\":[{\"name\":\"coin.TRANSFER\",\"args\":[\"k:1d5a5e10eb15355422ad66b6c12167bdbb23b1e1ef674ea032175d220b242ed4\",\"k:4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0\",3]},{\"name\":\"coin.GAS\",\"args\":[]}]}],\"meta\":{\"creationTime\":1726525836,\"ttl\":32441,\"chainId\":\"1\",\"gasPrice\":1.9981e-7,\"gasLimit\":2320,\"sender\":\"k:1d5a5e10eb15355422ad66b6c12167bdbb23b1e1ef674ea032175d220b242ed4\"},\"nonce\":\"chainweaver\",\"networkId\":\"testnet04\",\"payload\":{\"exec\":{\"code\":\"(coin.transfer \\\"k:1d5a5e10eb15355422ad66b6c12167bdbb23b1e1ef674ea032175d220b242ed4\\\" \\\"k:4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0\\\" 3.0)\",\"data\":null}}}","hash":"SLiinT5fAv8eCixT9qwbBHZgO4HxVB-p5rYyt_AxG94","sigs":[{"sig":"34de39e545f03116e7c8c1150e62be29874e0efd0e24ea906cb6cbd5adef28b137c01a85ac883489c7757f9335276ec360734ff74d98e195079d391a9105020d"}]}
```

The request returns command results similar to the following:

```json
{
    "gas": 509,
    "result": {
        "status": "success",
        "data": "Write succeeded"
    },
    "reqKey": "SLiinT5fAv8eCixT9qwbBHZgO4HxVB-p5rYyt_AxG94",
    "logs": "wsATyGqckuIvlm89hhd2j4t6RMkCrcwJe_oeCYr7Th8",
    "events": [
        {
            "params": [
                "k:1d5a5e10eb15355422ad66b6c12167bdbb23b1e1ef674ea032175d220b242ed4",
                "k:4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0",
                3
            ],
            "name": "TRANSFER",
            "module": {
                "namespace": null,
                "name": "coin"
            },
            "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"
        }
    ],
    "metaData": {
        "publicMeta": {
            "creationTime": 1726525836,
            "ttl": 32441,
            "gasLimit": 2320,
            "chainId": "1",
            "gasPrice": 1.9981e-7,
            "sender": "k:1d5a5e10eb15355422ad66b6c12167bdbb23b1e1ef674ea032175d220b242ed4"
        },
        "blockTime": 1726526473352615,
        "prevBlockHash": "ubbt1utj-jVkNwAVCbqYduESQVlJwWwSipJOrRlXJJg",
        "blockHeight": 4651215
    },
    "continuation": null,
    "txId": null
}
```

You can specify the `preflight` query parameter in the API request like this:

```Postman
http://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact/api/v1/local/?preflight=true
```

The request returns preflight results similar to the following:

```json
{
    "preflightResult": {
        "gas": 734,
        "result": {
            "status": "success",
            "data": "Write succeeded"
        },
        "reqKey": "SLiinT5fAv8eCixT9qwbBHZgO4HxVB-p5rYyt_AxG94",
        "logs": "aN6GME-Oea_smnQOrTozgww0Z81WFu_u3env3k8ksEc",
        "events": [
            {
                "params": [
                    "k:1d5a5e10eb15355422ad66b6c12167bdbb23b1e1ef674ea032175d220b242ed4",
                    "NoMiner",
                    1.4666054e-4
                ],
                "name": "TRANSFER",
                "module": {
                    "namespace": null,
                    "name": "coin"
                },
                "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"
            },
            {
                "params": [
                    "k:1d5a5e10eb15355422ad66b6c12167bdbb23b1e1ef674ea032175d220b242ed4",
                    "k:4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0",
                    3
                ],
                "name": "TRANSFER",
                "module": {
                    "namespace": null,
                    "name": "coin"
                },
                "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"
            }
        ],
        "metaData": {
            "publicMeta": {
                "creationTime": 1726525836,
                "ttl": 32441,
                "gasLimit": 2320,
                "chainId": "1",
                "gasPrice": 1.9981e-7,
                "sender": "k:1d5a5e10eb15355422ad66b6c12167bdbb23b1e1ef674ea032175d220b242ed4"
            },
            "blockTime": 1726526253258103,
            "prevBlockHash": "jQi8HNy73w1JxjdqTkkJnFZW7_lGYo2eHEmqxKNUBsM",
            "blockHeight": 4651209
        },
        "continuation": null,
        "txId": 6476127
    },
    "preflightWarnings": []
}
```

## Send commands to be executed

Use the `POST http://{baseUrl}/chain/{chain}/pact/api/v1/send` endpoint to submit one or more public unencrypted Pact commands to the blockchain for execution.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the chain identifier of the chain you want to send the request to. Valid values are 0 to 19. For example, to submit the command on the first chain (0), the request is `POST http://{baseURL}/chain/0/pact/api/v1/send/`.

### Request body schema

Content type: application/json

| Parameter | Type | Description
| --------- | ---- | -----------
| `cmds` (required) | Array of objects | Specifies an array of individual Pact command objects.

### Responses

Requests to `POST http://{baseURL}/chain/{chain}/pact/api/v1/send` return the following response codes:

- **200 OK** indicates that the request succeeded and the response body includes the request keys for each command successfully submitted.
- **400 Bad Request** indicates that the request failed. The response returns `text/plain` content with information about why the command couldn't be submitted for execution. For example, the response might indicate that the command wasn't executed because the request body specified an invalid gas payer, was missing required metadata, or there were other environment issues.

If the request is successful, the response returns `application/json` content with the following information:

| Parameter | Type | Description
| --------- | ---- | -----------
| `requestKeys` (required) | Array of strings | Each request key is a base64Url-encoded string that consists of 43 characters from the [`a-zA-Z0-9_-`] character set. You can use these request keys with the `poll` or `listen` endpoints to retrieve transaction results.

### Examples

You can send a request to the Kadena test network and chain 1 by calling the `/send` endpoint like this:

```Postman
POST http://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact/api/v1/send/
```

The request body for this example looks like this:

```bash

```

## Poll for transaction results

Use the `POST http://{baseURL}/chain/0/pact/api/v1/poll` endpoint to check for one or more command results by request key.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the chain identifier of the chain you want to send the request to. Valid values are 0 to 19. For example, to submit the command on the first chain (0), the request is `POST http://{baseURL}/chain/0/pact/api/v1/poll/`.

### Query parameters

Content type: application/json

| Parameter | Type | Description
| --------- | ---- | -----------
| `confirmationDepth`	| integer >= 0 | Configures how many blocks should be mined until the requested transaction is ready.

### Request body schema

Content type: application/json

| Parameter | Type | Description
| --------- | ---- | -----------
| `requestKeys` (required) | Array of strings | Each request key is a base64Url-encoded string that consists of 43 characters from the [`a-zA-Z0-9_-`] character set. 

#### Request example

```json
{
  "requestKeys": [
    "y3aWL72-3wAy7vL9wcegGXnstH0lHi-q-cfxkhD5JCw"
  ]
}
```

### Responses

Content type: application/json

The command results for some of the request keys included in the `/poll` request.

| Parameter | Type | Description
| --------- | ---- | -----------
| `property-name*` | object (Command Result) | The result of attempting to execute a single well-formed Pact command.
| `reqKey` (required) | string <base64url> | Unique ID of a pact transaction consisting of its hash. Request key = 43 characters ^[a-zA-Z0-9_-]{43}$.
| `result` (required) | object | Success (object) or Failure (object).
| `txId` | number | Database-internal transaction tracking ID.
| `logs` (required) | string | Backend-specific value providing image of database logs.
| `metaData` (required) | object | Metadata included with the transaction.
| `events` | Array of object | Array of event objects.
| `continuation` | object | Describes result of a `defpact` execution.
| `gas` (required) | number | Gas consumed by the transaction.
| `events`

### Examples

```json
{
  "property1": {
    "gas": 123,
    "result": {},
    "reqKey": "cQ-guhschk0wTvMBtrqc92M7iYm4S2MYhipQ2vNKxoI",
    "logs": "wsATyGqckuIvlm89hhd2j4t6RMkCrcwJe_oeCYr7Th8",
    "metaData": null,
    "continuation": null,
    "txId": "456",
    "events": []
  },
  "property2": {
    "gas": 123,
    "result": {},
    "reqKey": "cQ-guhschk0wTvMBtrqc92M7iYm4S2MYhipQ2vNKxoI",
    "logs": "wsATyGqckuIvlm89hhd2j4t6RMkCrcwJe_oeCYr7Th8",
    "metaData": null,
    "continuation": null,
    "txId": "456",
    "events": []
  }
}
```
## Listen for transaction results

Use the `/listen` endpoint to submit a blocking request for single transaction result.

`POST /listen`

### Request body schema

Content type: application/json

| Parameter | Type | Description
| --------- | ---- | -----------
| `listen` (required) | string <base64url>| Unique ID of a Pact transaction consisting of its hash. Request key = 43 characters ^[a-zA-Z0-9_-]{43}$.

### Successful response (200) 

Content type: application/json

The transaction result for the request key was found.

| Parameter | Type | Description
| --------- | ---- | -----------
| `reqKey` (required) | string <base64url> | Unique ID of a pact transaction consisting of its hash. Request key = 43 characters ^[a-zA-Z0-9_-]{43}$.
| `result` (required) | object | Success (object) or Failure (object).
| `txId`	| number | Database-internal transaction tracking ID.
| `logs` (required) | string | Backend-specific value providing image of database logs.
| `metaData` (required) | object | Metadata included with the transaction.
| `events` | Array of objects | Array of event objects.
| `continuation` | object | Describes result of a `defpact` execution.
| `gas` (required) | number | Gas consumed by the transaction.

## private

Use the /private endpoint for asynchronous submission of a single command transmitted with end-to-end encryption between addressed entity nodes. 
Private payload metadata is required.

`POST /private`

### Request body schema

Content type: application/json

| Parameter | Type | Description
| --------- | ---- | -----------
| `cmd` (required) | string | Stringified JSON payload object. Canonic non-malleable signed transaction data.
| `hash` (required) | string <base64url> | Unpadded Base64URL of Blake2s-256 hash of the cmd field value. Serves as a command requestKey since each transaction must be unique.
| `sigs` (required) | Array of objects >= 0 | List of signatures corresponding one-to-one with the signers array in the payload.

### Successful response (200) 

Content type: application/json

The command was accepted.

| Parameter | Type | Description
| --------- | ---- | -----------
| `requestKeys` (required) | Array of strings | Request keys you can use with `poll` or `listen` to retrieve results. Request key = 43 characters ^[a-zA-Z0-9_-]{43}$.

## spv

Use the `/spv` endpoint to issue a blocking request to fetch a simple payment verificiation (spv) proof of a cross-chain transaction. 
The request must be sent to the chain where the transaction initiated.

`POST /spv`

### Request body schema

Content type: application/json

| Parameter | Type | Description
| --------- | ---- | -----------
| `requestKey` (required) | string | Request Key of an initiated cross-chain transaction at the source chain.
| `targetChainId` (required) | string | Target chain ID of the cross-chain transaction.

### Successful response (200) 

Content type: application/json

The requested spv proof.

| Parameter | Type | Description
| --------- | ---- | -----------
| | string | Backend-specific data for continuing a cross-chain proof.

### Invalid command response (400) 

Content type: text/plain

The requested spv proof could not be found.

| Parameter | Type | Description
| --------- | ---- | -----------
| | string (Validation Failure) | Error message with the description of failed proof requests.

## Pact commands

Pact commands in an API request consist of the following parameters:

| Parameter | Type | Description
| --------- | ---- | -----------
| `cmd` (required) | string | Stringified JSON payload object. Canonic non-malleable signed transaction data.
| `hash` (required) | string <base64url> | Unpadded Base64URL of Blake2s-256 hash of the cmd field value. Serves as a command requestKey since each transaction must be unique.
| `sigs` (required) | Array of objects >= 0 | List of signatures corresponding one-to-one with the signers array in the payload.

## Pact results

Pact response results consist of the following parameters:

 Parameter | Type | Description
| --------- | ---- | -----------
| `reqKey` (required) | string <base64url> | Unique identifier for a Pact transaction consisting of its hash. Request key = 43 characters ^[a-zA-Z0-9_-]{43}$.
| `result` (required) | object | Success (object) or Failure (object).
| `txId`	| number | Database-internal transaction tracking ID.
| `logs` (required) | string | Backend-specific value providing image of database logs.
| `metaData` (required) | object | Metadata included with the transaction.
| `events` | Array of object | Array of event objects.
| `continuation` | object | Describes result of a `defpact` execution.
| `gas` (required) | number | Gas consumed by the transaction.

## Pact payloads

Pact command payloads consist of the following parameters:

 Parameter | Type | Description
| --------- | ---- | -----------
| `payload` (required) | object | The `exec` message object or `continuation` message object.
| `meta` (required) | object | Public Chainweb metadata object or private metadata object.
| `signers` (required) | Array of objects | List of signers, corresponding with list of signatures in outer command.
| `networkId` (required) | string | Backend-specific identifier of the target network such as "mainnet01" or "testnet04".
| `nonce` (required) | string | Arbitrary user-supplied value.
