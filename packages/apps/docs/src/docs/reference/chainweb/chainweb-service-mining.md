---
title: Mining endpoints
description:
  Provides reference information for the chainweb-node block endpoints.
menu: Chainweb API
label: Mining endpoints
order: 2
layout: full
tags: ['chainweb', 'node api', 'chainweb api', 'api reference']
---

# Mining endpoints

The Chainweb node mining API is disabled by default. 
You must enable and configure the mining API in the node configuration file before you can use any of the mining endpoints.

## Get mining work

Use `GET https://{baseURL}/mining/work` to request a new block header to work on.

### Request body schema

Use the following parameters to specify the miner information.

| Parameter | Type | Description
| --------- | ---- | -----------
| account	| string | Specifies the miner account name. Usually, this is the same as the public key.
| predicate	| key&nbsp;predicate | Specifies the number of keys required from the enumerated values of the "keys-all", "keys-any", and "keys-2" key predicate options. For accounts with a single key, the predicate is usually "keys-all".
| public&#8209;keys	| Array&nbsp;of&nbsp;strings | Lists one or more miner public keys.

### Responses

Requests to `GET https://{baseURL}/minig/work` return the following response codes:

- **200 OK** indicates that the request was successful and the response is an encoded stream of data.

#### Response header

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr | string | Specifies the host address and port number of the client as observed by the remote Chainweb node. The host address can be a domain name or an IP address in IPv4 or IPv6 format. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

#### Successful response schema

If the request is successful, the response returns `application/octet-stream` content with the following:

| Parameter | Type | Description
| --------- | ---- | -----------
| chainBytes | string&nbsp;binary | Identifies the chain selected by the node with four chain identifier bytes. This is informational. Generally, miners shouldn't care about the chain.
| targetBytes	| string&nbsp;binary | Specifies the proof-of-work target for the current block in 32 proof-of-work target bytes. The proof-of-work hash of a valid block must not be larger than this value. For arithmetic comparisons, the hash-target and the proof-of-work hash are interpreted as unsigned 256-bit integral number in little endian encoding.
| headerBytes	| string&nbsp;binary | Specifies the proof-of-work in 286 work header bytes. The last 8 bytes are the nonce. The creation time is encoded in bytes 44-52. Miners must not change or make any assumption about the other bytes. The creation time is encoded as little endian two complement integral number that counts SI microseconds since the start of the UNIX epoch (leap seconds are ignored). It always positive (highest bit is 0). Miners are free but not required to update the creation time. The value must be strictly larger than the creation time of the parent block and must not be in the future.

### Examples

If you have enabled mining, you can send a request for work like this:

```Postman
GET https://us-e1.chainweb.com/chainweb/0.0/mainnet01/mining/work
```

The request body should contain parameters similar to the following:

```json
{
    "account": "miner",
    "predicate": "keys-all",
    "public-keys": [
        "f880a433d6e2a13a32b6169030f56245efdd8c1b8a5027e9ce98a88e886bef27"
    ]
}
```

If the request is successful, the response is an octet stream with:

Work bytes - (ChainBytes4 + TargetBytes32 + HeaderBytes286)

This is the minimum information required to perform proof-of-work validation. 
No knowledge of Chainweb internals is necessary.
For information about the encoding of work bytes, see [Binary encoding](/reference/chainweb-api/binary-encoding#work-header-binary-encodingh861308059).

## Solved mining work

Use `POST https://{basseURL}/mining/solved` to submit a solution for a new block.

### Request body schema

The request body should be `application/octet-stream` content with the solved proof-of-work work header bytes.

The solved proof-of-work binary string of 286 bytes should consist of the original work received from the `/mining/work` endpoint with updated nonce value such that it satisfies the proof-of-work puzzle. 
The nonce is defined in the last 8 bytes of the work header bytes.

The proof-of-work hash of a valid block is computed using blake2s. 
It must not be larger than the proof-of-work target for the current block. 
The target was received along with the work header bytes from the `/mining/work` endpoint. 
For arithmetic comparisons, the hash-target and the proof-of-work hash are interpreted as an unsigned 256-bit integral number in little endian encoding.

Miners can also update the creation time.
However, the value must be strictly larger than the creation time of the parent block and must not be in the future.

### Responses

Requests to `POST https://{baseURL}/mining/solved` return the following response codes:

- **204 No Content** indicates that the request was successful and the proof-of-work solution is valid.

#### Response header

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr | string | Specifies the host address and port number of the client as observed by the remote Chainweb node. The host address can be a domain name or an IP address in IPv4 or IPv6 format. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

### Examples

If you have enabled mining, you can submit a proof-of-work solution like this:

```Postman
POST https://us-e1.chainweb.com/chainweb/0.0/mainnet01/mining/solved
```

The request body should be 286 bytes from the original work received from the `/mining/work` endpoint with updated the nonce.
If the request is successful, you'll see the **204 No Content** response returned.

## Notification of updated work

Use `GET https://{baseURL}/mining/updates` to receive notifications from a server when new mining work becomes available.

This server-sent event stream is terminated by the server in regular intervals.
It's the responsibility of the miner to periodically request a new stream.

### Request body

The request body should be `application/octet-stream` content with the first four bytes—the chain identifier bytes—received from a call to the `/mining/work` endpoint. 
With this request body, Node only informs the miner of a new cut when the chain identified by the first four bytes has updated.

### Responses

Requests to `GET https://{baseURL}/mining/updates` return the following response code:

- **200 OK** for each update event. 
  Each event consists of a single line with the message **event:New Cut**. 
  Events are separated by empty lines.

#### Response header

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr | string | Specifies the host address and port number of the client as observed by the remote Chainweb node. The host address can be a domain name or an IP address in IPv4 or IPv6 format. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

#### Successful response schema

If the request is successful, the response returns `text/event-stream` content with the following:

| Parameter | Type | Description
| --------- | ---- | -----------
| event | string | Indicates a chain update with the message event:New Cut on a single line.

### Examples

If you have enabled mining, you can request notification for chain updates like this:

```Postman
GET https://us-e1.chainweb.com/chainweb/0.0/mainnet01/mining/updates
```

The request body should be `application/octet-stream` content with the first four chain identifier bytes from a work header. 

The server-send events look like this:
```text
[
  event:New Cut

  event:New Cut

  event:New Cut
]
```
