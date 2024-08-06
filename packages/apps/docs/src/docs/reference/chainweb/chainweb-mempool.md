---
title: Mempool endpoints
description:
  Provides reference information for the chainweb-node mempool endpoints.
menu: Chainweb API
label: Mempool endpoints
order: 2
layout: full
tags: ['chainweb', 'node api', 'chainweb api', 'api reference']
---

# Mempool endpoints

The memory pool peer-to-peer endpoints enable communication between mempools on different nodes. 
These API endpoints are included for reference but are not intended to be used directly. 
Instead, you should use the appropriate Pact endpoints to submit transactions to the network.

## Request pending transactions from the mempool

Use `POST https://{baseURL}/chain/{chain}/mempool/getPending` to retrieve pending transactions from the memory pool.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the chain identifier of the chain you want to send the payload request to. Valid values are 0 to 19. For example, to get block payload for the first chain (0), the request is `POST https://{baseURL}/chain/0/mempool/getPending`.

### Query parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| nonce | integer&nbsp;>=&nbsp;0 | Specifies the server nonce value.
| since | integer&nbsp;64&#8209;bit | Specifies the transaction identifier value to use as a starting point for retrieving pending transactions from the memory pool.

### Responses

Requests to `POST https://{baseURL}/chain/{chain}/mempool/getPending` return the following response code:

- **200 OK** indicates that the request succeeded and the response body returns the pending transactions matching the request criteria. 

#### Response header

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr | string | Specifies the host address and port number of the client as observed by the remote Chainweb node. The host address can be a domain name or an IP address in IPv4 or IPv6 format. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

#### Successful response schema

If the request is successful, the response returns `application/json` content with the following:

| Parameter | Type | Description
| --------- | ---- | -----------
| hashes | Array&nbsp;of&nbsp;strings | Lists the transaction hashes for pending transactions in the memory pool. The hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the `a-zA-Z0-9_-` character set.
| highwaterMark	| Array&nbsp;of&nbsp;integers | Specifies a two-element array with the server nonce value and the transaction identifier representing the last transaction mined out of the memory pool.

### Examples

You can send a request to a bootstrap node for the Kadena main network and chain id 0 with a call like this:

```Postman
POST https://us-e1.chainweb.com/chainweb/0.0/mainnet01/chain/0/mempool/getPending
```

The response body for this request returns information about the pending transactions similar to the following:

```json
{
    "hashes": [
        "a1VnNruJpIbwatGwHlZXtNYqPiani1UuM5l87NDQ-Hs",
        "akUQgcIGR2mi4StuiAMLtYgr9tTVg2_Z0Oni4Mbm_lQ",
        "Ck-ltmAS7M0e1OFfzIHRSVRtV-zRP81Vw_7gFcu3pCk",
        "LUU1i0dtHZHjY3BBcFcyZaxmwWL7E6eiAMH4TVisdT8"
    ],
    "highwaterMark": [
        8354532306934176444,
        1218762
    ]
}
```

## Check for pending transactions in the mempool

Use `POST https://{baseURL}/chain/{chain}/mempool/member` to check the whether specific transactions are in the memory pool using their transaction request keys.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the chain identifier of the chain you want to send the payload request to. Valid values are 0 to 19. For example, to get block payload for the first chain (0), the request is `POST https://{baseURL}/chain/0/mempool/member`.

### Request body schema

The request body consists of an array of transaction request keys to check for in the memory pool. Each request key for a Pact transaction is a Base64Url-encoded string—without padding—that consists of 43 characters from the `a-zA-Z0-9_-` character set.
The request body is an array of these strings.

### Responses

Requests to `POST https://{baseURL}/chain/{chain}/mempool/member` return the following response code:

- **200 OK** indicates that the request succeeded and the response body returns an array of boolean values that indicate whether each specified transaction is in the memory pool. The array has the same size as the request body.

#### Response header

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr | string | Specifies the host address and port number of the client as observed by the remote Chainweb node. The host address can be a domain name or an IP address in IPv4 or IPv6 format. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

### Successful response schema

If the request is successful, the response returns `application/json` content with an array of boolean values for each request key in the request body. 

### Examples

You can send a request to a bootstrap node for the Kadena main network and chain id 0 with a call like this:

```Postman
POST https://us-e1.chainweb.com/chainweb/0.0/mainnet01/chain/0/mempool/member
```

For this example, the request body consists of one request key:

```request
["FCy9X1X7bVY-ls971GehpEh5kFwMVEZEfWYnPKKGxJg"]
```

If the transaction isn't found in the memory pool, the response body returns false:

```response
[
    false
]
```

You can send a request to a bootstrap node for the Kadena test network and chain id 1 with a call like this:

```postman
POST https://us1.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/mempool/member
```

For this example, the request body consists of two request keys:

```request
["Qp4hyjjzCBgjCoOvncCLsTMsw-G0kM6LSM9XSxOVhU4","Gc17hqzSZinUt-JCPvH6k_GJFXEJtRwU1Bx4OtSnxWU"]
```

In this example, the second transaction was found in the memory pool:

```response
[
    false,
    true
]
```

## Look up pending transactions in the mempool

Use `POST https://{baseURL}/chain/{chain}/mempool/lookup` to look up pending transactions in the memory pool.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the chain identifier of the chain you want to send the payload request to. Valid values are 0 to 19. For example, to get block payload for the first chain (0), the request is `POST https://{baseURL}/chain/0/mempool/lookup`.

### Request body schema

The request body consists of an array of transaction request keys to check for in the memory pool. Each request key for a Pact transaction is a Base64Url-encoded string—without padding—that consists of 43 characters from the `a-zA-Z0-9_-` character set.
The request body is an array of these strings.

### Responses

Requests to `POST https://{baseURL}/chain/{chain}/mempool/lookup` return the following response code:

- **200 OK** indicates that the request succeeded and the response body returns an array of lookup results for each specified transaction. The array has the same size as the request body.

#### Response header

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr | string | Specifies the host address and port number of the client as observed by the remote Chainweb node. The host address can be a domain name or an IP address in IPv4 or IPv6 format. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

### Successful response schema

If the request is successful, the response returns `application/json` content with an array of lookup results for each request key in the request body.

| Parameter | Type | Description
| --------- | ---- | -----------
| tag | string | Specifies the lookup result. The valid return values are "Missing" or "Pending".
| contents | string | Specifies the JSON-encoded text for a signed Pact transaction.

### Examples

You can send a request to a bootstrap node for the Kadena test network and chain id 1 with a call like this:

```postman
POST https://us1.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/mempool/lookup
```

For this example, the request body consists of two request keys:

```request
["ptI7wQeOmOt-BER2KQGVd0o6axBpqbhMPQVkkq5YAyE","Gc17hqzSZinUt-JCPvH6k_GJFXEJtRwU1Bx4OtSnxWU"]
```

In this example, the first transaction is "Pending" and the second transaction is "Missing" in the memory pool:

```response
[
    {
        "tag": "Pending",
        "contents": "{\"hash\":\"ptI7wQeOmOt-BER2KQGVd0o6axBpqbhMPQVkkq5YAyE\",\"sigs\":[{\"sig\":\"1569af1b56cddd4b853b7d49249c4c52d55e59e04910bfeb8aacbd02bfa0637bbe81b0f4b48ba8eb101fa0e8a276023fbfa57fa5a835741b346d574897052201\"}],\"cmd\":\"{\\\"signers\\\":[{\\\"pubKey\\\":\\\"1d5a5e10eb15355422ad66b6c12167bdbb23b1e1ef674ea032175d220b242ed4\\\",\\\"clist\\\":[{\\\"name\\\":\\\"coin.TRANSFER\\\",\\\"args\\\":[\\\"k:1d5a5e10eb15355422ad66b6c12167bdbb23b1e1ef674ea032175d220b242ed4\\\",\\\"k:58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c\\\",10]},{\\\"name\\\":\\\"coin.GAS\\\",\\\"args\\\":[]}]}],\\\"meta\\\":{\\\"creationTime\\\":1721947429,\\\"ttl\\\":32441,\\\"chainId\\\":\\\"1\\\",\\\"gasPrice\\\":1.9981e-7,\\\"gasLimit\\\":2320,\\\"sender\\\":\\\"k:1d5a5e10eb15355422ad66b6c12167bdbb23b1e1ef674ea032175d220b242ed4\\\"},\\\"nonce\\\":\\\"chainweaver\\\",\\\"networkId\\\":\\\"testnet04\\\",\\\"payload\\\":{\\\"exec\\\":{\\\"code\\\":\\\"(coin.transfer \\\\\\\"k:1d5a5e10eb15355422ad66b6c12167bdbb23b1e1ef674ea032175d220b242ed4\\\\\\\" \\\\\\\"k:58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c\\\\\\\" 10.0)\\\",\\\"data\\\":null}}}\"}"
    },
    {
        "tag": "Missing"
    }
]
```

## Insert transactions into the mempool

Nodes can use the `PUT https://{baseURL}/chain/{chain}/mempool/insert` endpoint to move transactions into the memory pool.
Information about this endpoint is included for reference. 
You shouldn't use this endpoint directly. 
Instead, you should use the appropriate Pact endpoints to submit transactions to the network.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the chain identifier of the chain you want to send the payload request to. Valid values are 0 to 19. For example, to get block payload for the first chain (0), the request is `POST https://{baseURL}/chain/0/mempool/insert`.

### Request body schema

The request body consists of an array of JSON-encoded strings representing signed Pact transactions.

### Responses

Requests to `PUT https://{baseURL}/chain/{chain}/mempool/insert` return the following response code:

- **200 OK** indicates that the request succeeded and that transactions were inserted into the memory pool.

#### Response header

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr | string | Specifies the host address and port number of the client as observed by the remote Chainweb node. The host address can be a domain name or an IP address in IPv4 or IPv6 format. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

### Examples

The following example illustrates the content of the request body with an array that only contains one transaction:

```request
[
"{\"hash\":\"y3aWL72-3wAy7vL9wcegGXnstH0lHi-q-cfxkhD5JCw\",\"sigs\":[{\"sig\":\"8ddc06b37c496f2cadc4f7412405a80faf3ab07482ff5553b9b5fcc73d1b4121275ad5948d9b4078e553b71f8b42eaf6b24135bf2fb4d5840c16bcdde0e35e0f\"}],\"cmd\":\"{\\\"networkId\\\":\\\"mainnet01\\\",\\\"payload\\\":{\\\"exec\\\":{\\\"data\\\":{\\\"account-keyset\\\":{\\\"pred\\\":\\\"keys-all\\\",\\\"keys\\\":[\\\"acc28032a1bb725b7ba0a3593ab86f393894fa6659281f3dfdfee0afe48559a2\\\"]}},\\\"code\\\":\\\"(coin.transfer-create \\\\\\\"60241f51ea34e05c61fbea9d\\\\\\\" \\\\\\\"acc28032a1bb725b7ba0a3593ab86f393894fa6659281f3dfdfee0afe48559a2\\\\\\\" (read-keyset \\\\\\\"account-keyset\\\\\\\") 5007.0000)\\\"}},\\\"signers\\\":[{\\\"pubKey\\\":\\\"acc28032a1bb725b7ba0a3593ab86f393894fa6659281f3dfdfee0afe48559a2\\\",\\\"clist\\\":[{\\\"args\\\":[\\\"60241f51ea34e05c61fbea9d\\\",\\\"acc28032a1bb725b7ba0a3593ab86f393894fa6659281f3dfdfee0afe48559a2\\\",5007],\\\"name\\\":\\\"coin.TRANSFER\\\"},{\\\"args\\\":[],\\\"name\\\":\\\"coin.GAS\\\"}]}],\\\"meta\\\":{\\\"creationTime\\\":1618949714,\\\"ttl\\\":300,\\\"gasLimit\\\":600,\\\"chainId\\\":\\\"0\\\",\\\"gasPrice\\\":1.0e-7,\\\"sender\\\":\\\"acc28032a1bb725b7ba0a3593ab86f393894fa6659281f3dfdfee0afe48559a2\\\"},\\\"nonce\\\":\\\"\\\\\\\"2021-04-20T20:16:13.645Z\\\\\\\"\\\"}\"}"
]
```