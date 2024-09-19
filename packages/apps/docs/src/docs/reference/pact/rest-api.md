--
title: Pact REST API
description:
  Reference information for Pact REST API endpoints that are exposed by Chainweb nodes through the Chainweb service API.
menu: Pact REST API
label: Pact REST API
order: 2
layout: full
tags: ['pact', 'rest api', 'pact api', 'pact api reference']
---

# Pact REST API

There are two sets of Pact REST API endpoints:

- Pact API endpoints that are exposed by Chainweb nodes through the Chainweb service API.
- Pact API endpoints that are exposed locally through the Pact built-in HTTP server.

Both sets of endpoints provide similar functionality.
However, the URLs you use to route API requests to each set of endpoints are different.
This section describes the Pact API endpoints that are exposed through the Chainweb service API.
You can also find documentation for these Pact endpoints, including sample requests and responses, in the [Pact OpenAPI](https://api.chainweb.com/openapi/pact.html) specification.
For documentation about the Pact API endpoints that are exposed through the Pact built-in HTTP server, see [Pact command-line interpreter](/reference/pact-repl).

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
| chain&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the chain identifier of the chain you want to send the request to. Valid values are 0 to 19. For example, to submit the command on the first chain (0), the request is `POST http://{baseURL}/chain/0/pact/api/v1/local`.

### Query parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| `preflight`	| boolean | Trigger a fully-gassed mainnet transaction execution simulation and transaction metadata validation.
| `rewindDepth`	| integer >= 0 | Rewind transaction execution environment by a specified number of block heights.
| `signatureVerification`	| boolean | Require user signature verification when validating the transaction metadata.

### Request body schema

| Parameter | Type | Description
| --------- | ---- | -----------
| `cmd` (required) | string | Stringified JSON payload object with signed transaction data that can't be modified.
| `hash` (required) | string | An unpadded base64Url-encoded string created using the Blake2s-256 hash function for the `cmd` field value. Serves as a command request key because each transaction must be unique.
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
| `events` | Array of objects | Array of event objects.
| `continuation`	| object | Describes the result of a `defpact` execution.
| `gas` (required) | number | Gas required to execute the transaction.

If you specify the `preflight` query parameter, the command results include the following additional parameters:

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
| chain&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the chain identifier of the chain you want to send the request to. Valid values are 0 to 19. For example, to submit the command on the first chain (0), the request is `POST http://{baseURL}/chain/0/pact/api/v1/send`.

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
POST http://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact/api/v1/send
```

The request body for this example looks like this:

```json
{
    "cmds": [
        {
          "cmd":"{\"signers\":[{\"pubKey\":\"58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c\",\"clist\":[{\"name\":\"coin.TRANSFER\",\"args\":[\"k:58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c\",\"k:4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0\",2]},{\"name\":\"coin.GAS\",\"args\":[]}]}],\"meta\":{\"creationTime\":1726775463,\"ttl\":35628,\"chainId\":\"1\",\"gasPrice\":7.993e-8,\"gasLimit\":2320,\"sender\":\"k:58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c\"},\"nonce\":\"chainweaver\",\"networkId\":\"testnet04\",\"payload\":{\"exec\":{\"code\":\"(coin.transfer \\\"k:58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c\\\" \\\"k:4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0\\\" 2.0)\",\"data\":null}}}","hash":"vnelRuUfVvSGOu7Lczv1MluELMICdPrBaevJzKOj-oo","sigs":[
            {"sig":"cf0c345d06c251a34082ac95d06e34e9e96593799f18e743c8094de063c297bfbab5ec40a074e9ba257a32692cb6e7edf055f5abe8861c3b51150117736c5d0c"}
          ]
        }
    ]
}
```

This API request returns the request key for the transaction:

```json
{
    "requestKeys": [
        "vnelRuUfVvSGOu7Lczv1MluELMICdPrBaevJzKOj-oo"
    ]
}
```

You can use the request key returned to poll or listen for the transaction results.

## Poll for transaction results

Use the `POST http://{baseURL}/chain/{chain}/pact/api/v1/poll` endpoint to check for one or more command results by request key.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the chain identifier of the chain you want to send the request to. Valid values are 0 to 19. For example, to submit the command on the first chain (0), the request is `POST http://{baseURL}/chain/0/pact/api/v1/poll`.

### Query parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| `confirmationDepth`	| integer >= 0 | Configures how many blocks should be mined before the requested transaction results should be considered to be confirmed.

### Request body schema

| Parameter | Type | Description
| --------- | ---- | -----------
| `requestKeys` (required) | Array of strings | Each request key is a base64Url-encoded string that consists of 43 characters from the [`a-zA-Z0-9_-`] character set. 


### Responses

Requests to `POST http://{baseURL}/chain/{chain}/pact/api/v1/poll` return the following response codes:

- **200 OK** indicates that the request succeeded and the response body includes the transaction results.
- **400 Bad Request** indicates that the request failed. The response returns `text/plain` content with information about why the request failed. For example, the response might indicate that the command wasn't executed because the request body specified an invalid gas payer, was missing required metadata, or there were other environment issues.

If the request is successful, the response returns `application/json` content with the following information for one or more of the request keys included in the request.

| Parameter | Type | Description
| --------- | ---- | -----------
| `gas` (required) | number | Gas consumed by the transaction.
| `result` (required) | object | Success (object) or Failure (object).
| `reqKey` (required) | string | Unique identifier for the Pact transaction. The transaction hash is a base64Url-encoded string that consists of 43 characters from the [`a-zA-Z0-9_-`] character set.
| `logs` (required) | string | Backend-specific value providing image of database logs.
| `events` | Array of object | Array of event objects.
| `metaData` (required) | object | Metadata included with the transaction.
| `continuation` | object | Describes the result of a `defpact` execution.
| `txId` | number | Database-internal transaction tracking identifier.

### Examples

You can send a request to the Kadena test network and chain 1 by calling the `/poll` endpoint like this:

```Postman
POST http://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact/api/v1/poll?confirmationDepth=6
```

For this example, the request body specifies one request key:

```json
{
    "requestKeys": [
        "vnelRuUfVvSGOu7Lczv1MluELMICdPrBaevJzKOj-oo"
    ]
}   
```

This request returns the following results:

```json
{
    "vnelRuUfVvSGOu7Lczv1MluELMICdPrBaevJzKOj-oo": {
        "gas": 734,
        "result": {
            "status": "success",
            "data": "Write succeeded"
        },
        "reqKey": "vnelRuUfVvSGOu7Lczv1MluELMICdPrBaevJzKOj-oo",
        "logs": "TtlN_14Khzk6GhEx6JeeQsyPgeJ9ksGtFiA8-_DxGiA",
        "events": [
            {
                "params": [
                    "k:58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c",
                    "k:db776793be0fcf8e76c75bdb35a36e67f298111dc6145c66693b0133192e2616",
                    5.866862e-5
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
                    "k:58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c",
                    "k:4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0",
                    2
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
            "blockTime": 1726775907743891,
            "prevBlockHash": "svYRszu1KyeVIWNZOdPNoVBrU6w6-ETm_xXwx4YiHmk",
            "blockHash": "RgFXHrn4NESENpvwG1zWqJu_UloVLg6FAsdDK-oev-I",
            "blockHeight": 4659524
        },
        "continuation": null,
        "txId": 6485407
    }
}
```

## Listen for transaction results

Use the `POST http://{baseURL}/chain/{chain}/pact/api/v1/listen` endpoint to submit a blocking request for the results of a single transaction.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the chain identifier of the chain you want to send the request to. Valid values are 0 to 19. For example, to submit the command on the first chain (0), the request is `POST http://{baseURL}/chain/0/pact/api/v1/listen`.

### Request body schema

| Parameter | Type | Description
| --------- | ---- | -----------
| `listen` (required) | string | Unique identifier for the Pact transaction. The transaction hash is a base64Url-encoded string that consists of 43 characters from the [`a-zA-Z0-9_-`] character set.

### Responses 

Requests to `POST http://{baseURL}/chain/{chain}/pact/api/v1/listen` return the following response codes:

- **200 OK** indicates that the request succeeded and the response body includes the transaction results.
- **400 Bad Request** indicates that the request failed. The response returns `text/plain` content with information about why the request failed. For example, the response might indicate that the command wasn't executed because the request body specified an invalid gas payer, was missing required metadata, or there were other environment issues.

If the request is successful, the response returns `application/json` content with the following information for one or more of the request keys included in the request.

| Parameter | Type | Description
| --------- | ---- | -----------
| `gas` (required) | number | Gas consumed by the transaction.
| `result` (required) | object | Success (object) or Failure (object).
| `reqKey` (required) | string | Unique identifier for the Pact transaction. The transaction hash is a base64Url-encoded string that consists of 43 characters from the [`a-zA-Z0-9_-`] character set.
| `logs` (required) | string | Backend-specific value providing image of database logs.
| `events` | Array of object | Array of event objects.
| `metaData` (required) | object | Metadata included with the transaction.
| `continuation` | object | Describes the result of a `defpact` execution.
| `txId` | number | Database-internal transaction tracking identifier.

### Examples

You can send a request to the Kadena test network and chain 1 by calling the `/listen` endpoint like this:

```Postman
POST http://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact/api/v1/listen
```

For this example, the request body specifies one request key to listen for:

```json
{
    "listen": "qTDh3o3Gp3rQI2XVzptSA5BwvT6w28B1RvSuHmNXtN4"
}
```

This request returns the following results:

```json
{
    "gas": 710,
    "result": {
        "status": "success",
        "data": "Write succeeded"
    },
    "reqKey": "qTDh3o3Gp3rQI2XVzptSA5BwvT6w28B1RvSuHmNXtN4",
    "logs": "9BUxMgwkYJFU7fVAEfJKLYLEqx1gXdpwd-tSZhJRh3A",
    "events": [
        {
            "params": [
                "LG-testnet",
                "k:db776793be0fcf8e76c75bdb35a36e67f298111dc6145c66693b0133192e2616",
                5.67503e-5
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
                "LG-testnet",
                "k:4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0",
                2
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
        "blockTime": 1726778344125192,
        "prevBlockHash": "zCvrrJrucuPgd9vY8cXbVn7GMjO9j-SsupGUMZ8gpoI",
        "blockHash": "TpmPSutW06KQ5_0kdrvbIAFdFZQSRlUYWnNBjt1mOGc",
        "blockHeight": 4659605
    },
    "continuation": null,
    "txId": 6485506
}
```

## Send a private Pact command

Use the `POST http://{baseURL}/chain/{chain}/pact/api/v1/private` endpoint for asynchronous submission of a single command transmitted with end-to-end encryption between addressed entity nodes. 
Private payload metadata is required.

### Request body schema

| Parameter | Type | Description
| --------- | ---- | -----------
| `cmd` (required) | string | Stringified JSON payload object with signed transaction data that can't be modified.
| `hash` (required) | string | An unpadded base64Url-encoded string created using the Blake2s-256 hash function for the `cmd` field value. Serves as a command request key because each transaction must be unique.
| `sigs` (required) | Array of objects | List of signatures corresponding one-to-one with the signers array in the payload.

### Responses

Requests to `POST http://{baseURL}/chain/{chain}/pact/api/v1/private` return the following response codes:

- **200 OK** indicates that the request succeeded and the response body includes the command results.
- **400 Bad Request** indicates that the request failed. The response returns `text/plain` content with information about why the request failed. For example, the response might indicate that the command wasn't executed because the request body specified an invalid gas payer, was missing required metadata, or there were other environment issues.

If the request is successful and the command is accepted, the response returns `application/json` content with the following information:

| Parameter | Type | Description
| --------- | ---- | -----------
| `requestKeys` (required) | Array of strings | Unique identifier for the Pact transaction. The transaction hash is a base64Url-encoded string that consists of 43 characters from the [`a-zA-Z0-9_-`] character set. You can use the request key to call the `poll` or `listen` endpoint to retrieve results.

## Fetch a simple payment verification (spv)

Use the `POST http://{baseURL}/chain/{chain}/pact/api/v1/spv` endpoint to issue a blocking request to fetch a simple payment verification (spv) proof of a cross-chain transaction. 
The request must be sent to the chain where the transaction initiated.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the chain identifier of the chain you want to send the request to. Valid values are 0 to 19. For example, to submit the command on the first chain (0), the request is `POST http://{baseURL}/chain/0/pact/api/v1/spv`.

### Request body schema

| Parameter | Type | Description
| --------- | ---- | -----------
| `requestKey` (required) | string | Request key for the first step in a cross-chain transaction. This request key is the transaction hash generated on the source chain.
| `targetChainId` (required) | string | Target chain identifier for the second step in the cross-chain transaction.

### Response 

Requests to `POST http://{baseURL}/chain/{chain}/pact/api/v1/spv` return the following response codes:

- **200 OK** indicates that the request succeeded and the response body includes the requested payment verification proof.
- **400 Bad Request** indicates that the request failed. The response returns `text/plain` content with information about why the request failed.

If the request is successful and the command is accepted, the response returns `application/json` content with the following information:

| Parameter | Type | Description
| --------- | ---- | -----------
| `spv` | string | Backend-specific data for continuing a cross-chain proof.

## Pact commands

Pact commands in an API request consist of the following parameters:

| Parameter | Type | Description
| --------- | ---- | -----------
| `cmd` (required) | string | Stringified JSON payload object with signed transaction data that can't be modified.
| `hash` (required) | string | An unpadded base64Url-encoded string created using the Blake2s-256 hash function for the `cmd` field value. Serves as a command request key because each transaction must be unique.
| `sigs` (required) | Array of objects | List of signatures corresponding one-to-one with the signers array in the payload.

## Pact results

Pact response results consist of the following parameters:

| Parameter | Type | Description
| --------- | ---- | -----------
| `gas` (required) | number | Gas consumed by the transaction.
| `result` (required) | object | Success (object) or Failure (object).
| `reqKey` (required) | string | Unique identifier for the Pact transaction. The transaction hash is a base64Url-encoded string that consists of 43 characters from the [`a-zA-Z0-9_-`] character set.
| `logs` (required) | string | Backend-specific value providing image of database logs.
| `events` | Array of object | Array of event objects.
| `metaData` (required) | object | Metadata included with the transaction.
| `continuation` | object | Describes the result of a `defpact` execution.
| `txId` | number | Database-internal transaction tracking identifier.

## Pact payloads

Pact command payloads consist of the following parameters:

 Parameter | Type | Description
| --------- | ---- | -----------
| `payload` (required) | object | The `exec` message object or `continuation` message object.
| `meta` (required) | object | Public Chainweb metadata object or private metadata object.
| `signers` (required) | Array of objects | List of signers, corresponding with the list of signatures in the outer command.
| `networkId` (required) | string | Backend-specific identifier of the target network such as "mainnet01" or "testnet04".

## Formatting API requests in YAML

Chainweb nodes expect Pact commands and transaction requests to be formatted as stringified JSON payload objects with signed transaction data.
However, you can also create transaction requests using YAML files.
You can create two types of transactions using the YAML API request format:

- Single step transactions that provide the `exec` payload can use the _execution_ request format.
- Transactions that have more than one step that provide the `cont` payload can use the _continuation_ request format.

### Exec request format

The execution request format supports the following keys:

```yaml
code: Transaction code
codeFile: Transaction code file
data: JSON transaction data
dataFile: JSON transaction data file
keyPairs: list of key pairs for signing (use pact -g to generate): 
  [
    public: base 16 public key
    secret: base 16 secret key
    caps: 
    [
      optional managed capabilities
    ]
  ]
nonce: optional request nonce, will use current time if not provided
networkId: string identifier for a blockchain network
publicMeta:
    chainId: string chain id of the chain of execution
    sender: string denoting the sender of the transaction
    gasLimit: integer gas limit
    gasPrice: decimal gas price
    ttl: integer time-to-live value
    creationTime: optional integer tx execution time after offset
type: exec
```

### Cont request format

The execution request format supports the following keys:

```yaml
pactTxHash: integer transaction id of pact
step: integer next step of a pact
rollback: boolean for rollingback a pact
proof: string spv proof of continuation (optional, cross-chain only)
data: JSON transaction data
dataFile: JSON transaction data file
keyPairs: list of key pairs for signing (use pact -g to generate): 
  [
    public: string base 16 public key
    secret: string base 16 secret key
    caps: 
    [
      optional managed capabilities
    ]
  ]
networkId: string identifier for a blockchain network
publicMeta:
    chainId: string chain id of the chain of execution
    sender: string denoting the sender of the transaction
    gasLimit: integer gas limit
    gasPrice: decimal gas price
    ttl: integer time-to-live value
    creationTime: optional integer tx execution time after offset
nonce: optional request nonce, will use current time if not provided
type: cont
```
