---
title: Payload endpoints
description:
  Provides reference information for the chainweb-node block payload endpoints.
menu: Chainweb API
label: Payload endpoints
order: 2
layout: full
tags: ['chainweb', 'node api', 'chainweb api', 'api reference']
---

# Payload endpoints

You can use `/payload` endpoints to return raw block payloads in the same form as they are stored on the chain. 
By default, only the payload data is returned.
The raw payload data is sufficient for validating the blockchain Merkle tree and to use as input to Pact for executing the Pact transactions of the block and recomputing the outputs.

You can also send requests to query the transaction outputs along with the payload data.

## Get block payload

Use `GET https://{baseURL}/chain/{chain}/payload/{payloadHash}` to get the raw payload data for the specified payload hash.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain&nbsp;(required) | integer >= 0 | Specifies the chain identifier of the chain you want to send the payload request to. Valid values are 0 to 19. For example, to get block payload for the first chain (0), the request is `GET https://{baseURL}/chain/0/payload`.
| payloadHash (required) | string | Specifies the payload hash for the request. The block payload hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the `a-zA-Z0-9_-` character set. For example: `GpaWbHkHrCjRhY8hKE0qZ1WsBBaG3Y_zkFLV2sYumQA`.

### Query parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| height | integer >= 0 | Height of a block. For example: `height=3000000`.

### Responses

Requests to `GET https://{baseURL}/chain/{chain}/payload/{payloadhash}` return the following response codes:

- **200 OK** indicates that the request succeeded and the response body returns the payload data for the specified payload hash. 
- **404 Not Found** indicates that the payload hash wasn't found.

#### Response header

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr	| string | Specifies the host address and port number of the client as observed by the remote Chainweb node. The host address can be a domain name or an IP address in IPv4 or IPv6 format. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

#### Successful response schema

If the request is successful, the response returns `application/json` content with the following:

| Parameter | Type | Description
| --------- | ---- | -----------
| transactions&nbsp;(required) | Array of strings | An array of Base64Url-encoded strings—without padding—that describe signed Pact transactions in JSON format.
| minerData (required) | string | Miner information is a Base64Url-encoded string—without padding—that consists of characters from the `a-zA-Z0-9_-` character set. This information is included as part of the payload JSON object.
| transactionsHash&nbsp;(required) | string | The transaction hash is a SHA256 hash. The hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the `a-zA-Z0-9_-` character set.
| outputsHash (required) | string | The output hash is a SHA256 hash. The hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the `a-zA-Z0-9_-` character set.
| payloadHash (required) | string | The block payload hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the `a-zA-Z0-9_-` character set.

#### Not found response schema

If there are no results matching the request criteria, the response returns the following:

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| key | string | Specifies the base64Url-encoded block hash without padding. The block hash consists of 43 characters from the `a-zA-Z0-9_-` character set. |
| reason | string | Provides a placeholder for specifying the reason that no block hashes were found. |

### Examples

You can send a payload request to a bootstrap node for the Kadena test network and chain id 18 with a call like this:

```Postman
GET https://us1.testnet.chainweb.com/chainweb/0.0/testnet04/chain/18/payload/BKFz8a2AZGtZQPlp2xPRfe7ohlnOuzV2NbIEB3cFwI8
```

The response header for this request looks like this:

```text
X-Server-Timestamp: 1720805685
X-Peer-Addr: 54.86.50.139:16853
X-Chainweb-Node-Version: 2.24.1
Content-Type: application/json;charset=utf-8
```

The response body for this request returns the payload data.
In this example, the payload data includes three transactions:

```json
{
    "transactions": [
        "eyJoYXNoIjoicXl1UE00V0F3UFEyeHUtTmxZYVVNcVhzLTBmNG5mR2oyOE12YjFvclN4ayIsInNpZ3MiOlt7InNpZyI6ImMwNWI0NjU5ZTAyOWM2ZTcwNzAwNGFiZjNjMDE1OTY4YjZlMDgzZWI1YzU5YTIyMWUyYWMzMThkYTljZDlmMjdhOTliNzIwYjZkMmNjMDE1M2JkODYxYmZlY2RkZTY2YzcyNmQzOTZhNWQ4MTRiMWQ0YmZhYWNjMzdjYWQzNjBmIn1dLCJjbWQiOiJ7XCJuZXR3b3JrSWRcIjpcInRlc3RuZXQwNFwiLFwicGF5bG9hZFwiOntcImV4ZWNcIjp7XCJkYXRhXCI6e30sXCJjb2RlXCI6XCIobl9jNTE3NTY4Yjg5ZWViNWI2ZTZhYjE0NTYwZTcxMGYyODcwMzJlNjcyLmJyby1sb3R0ZXJ5LWhlbHBlcnMuYnV5LXRpY2tldC1pbi1rZGEgXFxcIms6MDQ4Y2E3MzgzYjIyNjdhMGZmZTc2OGI5N2I5NjEwNGQwZmI4MmU1NzZjNTNlMzVhNmE0NGUwYmI2NzVjNTNjZVxcXCIgMi40MTAxMzcwODY4MTEzIDQpXCJ9fSxcInNpZ25lcnNcIjpbe1wiY2xpc3RcIjpbe1wiYXJnc1wiOltcIms6MDQ4Y2E3MzgzYjIyNjdhMGZmZTc2OGI5N2I5NjEwNGQwZmI4MmU1NzZjNTNlMzVhNmE0NGUwYmI2NzVjNTNjZVwiLFwiMGVXemUwX2I3YkMxVDQ2YXoxM1kxU2FKU3daSTNNTzA2cDVReEs5b2RnOFwiLHtcImRlY2ltYWxcIjpcIjIuNDEwMTM3MDg2ODExXCJ9XSxcIm5hbWVcIjpcImNvaW4uVFJBTlNGRVJcIn0se1wiYXJnc1wiOltdLFwibmFtZVwiOlwiY29pbi5HQVNcIn1dLFwicHViS2V5XCI6XCIwNDhjYTczODNiMjI2N2EwZmZlNzY4Yjk3Yjk2MTA0ZDBmYjgyZTU3NmM1M2UzNWE2YTQ0ZTBiYjY3NWM1M2NlXCJ9XSxcIm1ldGFcIjp7XCJjcmVhdGlvblRpbWVcIjoxNzIwODAyMTA2LFwidHRsXCI6Mjg4MDAsXCJnYXNMaW1pdFwiOjgwMDAsXCJjaGFpbklkXCI6XCIxOFwiLFwiZ2FzUHJpY2VcIjoxZS04LFwic2VuZGVyXCI6XCJrOjA0OGNhNzM4M2IyMjY3YTBmZmU3NjhiOTdiOTYxMDRkMGZiODJlNTc2YzUzZTM1YTZhNDRlMGJiNjc1YzUzY2VcIn0sXCJub25jZVwiOlwiXFxcIlhFRFMtXFxcXFxcXCIyMDI0LTA3LTEyVDE2OjM2OjM2LjQzOVpcXFxcXFxcIlxcXCJcIn0ifQ",
        "eyJoYXNoIjoidFVTVHB0SlYyRWhfMXVZdUpaV0R6V0dObU02anhmQ1BsRWVGQVkwTUhzayIsInNpZ3MiOlt7InNpZyI6IjI1NDZkY2NiZDRlMzQ1MWRlODdkYjIzZTY3MDUxMmYzY2ZmYzhkNjk4ODI5NmY1NDA4ZTgxZWY0NzE4OWYyYjVkNDM2MWQzYWMwOTlkZDJkYjYyYTI5ZGE0MjU1MTAwOWJlZWVmOTNkMjUwMmQzOGJiNDgwYmMyODAzZTY2YzA5In1dLCJjbWQiOiJ7XCJuZXR3b3JrSWRcIjpcInRlc3RuZXQwNFwiLFwicGF5bG9hZFwiOntcImV4ZWNcIjp7XCJkYXRhXCI6e30sXCJjb2RlXCI6XCIobl9jNTE3NTY4Yjg5ZWViNWI2ZTZhYjE0NTYwZTcxMGYyODcwMzJlNjcyLmJyby1sb3R0ZXJ5LWhlbHBlcnMuYnV5LXRpY2tldC1pbi1icm8gXFxcIms6MDQ4Y2E3MzgzYjIyNjdhMGZmZTc2OGI5N2I5NjEwNGQwZmI4MmU1NzZjNTNlMzVhNmE0NGUwYmI2NzVjNTNjZVxcXCIgOSlcIn19LFwic2lnbmVyc1wiOlt7XCJjbGlzdFwiOlt7XCJhcmdzXCI6W1wiazowNDhjYTczODNiMjI2N2EwZmZlNzY4Yjk3Yjk2MTA0ZDBmYjgyZTU3NmM1M2UzNWE2YTQ0ZTBiYjY3NWM1M2NlXCIsXCJjOm1qRmw4TGk4UXYzOG13Rm5xeXRua0RWeUpXcGozc0JSRFBuRGZ2M0xIX2dcIix7XCJkZWNpbWFsXCI6XCIwLjAxXCJ9XSxcIm5hbWVcIjpcIm5fNWQxMTljYzA3ZmZkNWVmYWVmNWM3ZmVlZjllODc4ZjM0ZTNkNDY1Mi5icm8uVFJBTlNGRVJcIn0se1wiYXJnc1wiOltdLFwibmFtZVwiOlwiY29pbi5HQVNcIn1dLFwicHViS2V5XCI6XCIwNDhjYTczODNiMjI2N2EwZmZlNzY4Yjk3Yjk2MTA0ZDBmYjgyZTU3NmM1M2UzNWE2YTQ0ZTBiYjY3NWM1M2NlXCJ9XSxcIm1ldGFcIjp7XCJjcmVhdGlvblRpbWVcIjoxNzIwODAyMTE4LFwidHRsXCI6Mjg4MDAsXCJnYXNMaW1pdFwiOjMwMDAsXCJjaGFpbklkXCI6XCIxOFwiLFwiZ2FzUHJpY2VcIjoxZS04LFwic2VuZGVyXCI6XCJrOjA0OGNhNzM4M2IyMjY3YTBmZmU3NjhiOTdiOTYxMDRkMGZiODJlNTc2YzUzZTM1YTZhNDRlMGJiNjc1YzUzY2VcIn0sXCJub25jZVwiOlwiXFxcIlhFRFMtXFxcXFxcXCIyMDI0LTA3LTEyVDE2OjM2OjQ4Ljg0MlpcXFxcXFxcIlxcXCJcIn0ifQ",
        "eyJoYXNoIjoiell6YTFLWlJfbXM4U1BwNFc0SGxfcExRdVZINWxpX1NralJZaW1tazlGdyIsInNpZ3MiOlt7InNpZyI6IjAwZGMxOTUyZTJmZTFhZjI3NzFjNTE2MDAyZjJhOTk2ZWVmYjFkZWM5ZmExNDQwNDIyYzYzMmIzNDIyYTNlZjI4MGZlMDczNjAwYWYwM2RlNmVmNzljNDRiMDRjODcyZjJmMWM0NzEyZjgwNTgxMjlhYmJhOWZkYTcxMmUwOTA5In1dLCJjbWQiOiJ7XCJuZXR3b3JrSWRcIjpcInRlc3RuZXQwNFwiLFwicGF5bG9hZFwiOntcImV4ZWNcIjp7XCJkYXRhXCI6e30sXCJjb2RlXCI6XCIobl9jNTE3NTY4Yjg5ZWViNWI2ZTZhYjE0NTYwZTcxMGYyODcwMzJlNjcyLmJyby1sb3R0ZXJ5LWhlbHBlcnMuYnV5LXRpY2tldC1pbi1rZGEgXFxcIms6MDQ4Y2E3MzgzYjIyNjdhMGZmZTc2OGI5N2I5NjEwNGQwZmI4MmU1NzZjNTNlMzVhNmE0NGUwYmI2NzVjNTNjZVxcXCIgMi40MTAxMzcwODY4MTEzIDcpXCJ9fSxcInNpZ25lcnNcIjpbe1wiY2xpc3RcIjpbe1wiYXJnc1wiOltcIms6MDQ4Y2E3MzgzYjIyNjdhMGZmZTc2OGI5N2I5NjEwNGQwZmI4MmU1NzZjNTNlMzVhNmE0NGUwYmI2NzVjNTNjZVwiLFwiMGVXemUwX2I3YkMxVDQ2YXoxM1kxU2FKU3daSTNNTzA2cDVReEs5b2RnOFwiLHtcImRlY2ltYWxcIjpcIjIuNDEwMTM3MDg2ODExXCJ9XSxcIm5hbWVcIjpcImNvaW4uVFJBTlNGRVJcIn0se1wiYXJnc1wiOltdLFwibmFtZVwiOlwiY29pbi5HQVNcIn1dLFwicHViS2V5XCI6XCIwNDhjYTczODNiMjI2N2EwZmZlNzY4Yjk3Yjk2MTA0ZDBmYjgyZTU3NmM1M2UzNWE2YTQ0ZTBiYjY3NWM1M2NlXCJ9XSxcIm1ldGFcIjp7XCJjcmVhdGlvblRpbWVcIjoxNzIwODAyMTEzLFwidHRsXCI6Mjg4MDAsXCJnYXNMaW1pdFwiOjgwMDAsXCJjaGFpbklkXCI6XCIxOFwiLFwiZ2FzUHJpY2VcIjoxZS04LFwic2VuZGVyXCI6XCJrOjA0OGNhNzM4M2IyMjY3YTBmZmU3NjhiOTdiOTYxMDRkMGZiODJlNTc2YzUzZTM1YTZhNDRlMGJiNjc1YzUzY2VcIn0sXCJub25jZVwiOlwiXFxcIlhFRFMtXFxcXFxcXCIyMDI0LTA3LTEyVDE2OjM2OjQzLjI5N1pcXFxcXFxcIlxcXCJcIn0ifQ"
    ],
    "minerData": "eyJhY2NvdW50IjoiazpkYjc3Njc5M2JlMGZjZjhlNzZjNzViZGIzNWEzNmU2N2YyOTgxMTFkYzYxNDVjNjY2OTNiMDEzMzE5MmUyNjE2IiwicHJlZGljYXRlIjoia2V5cy1hbGwiLCJwdWJsaWMta2V5cyI6WyJkYjc3Njc5M2JlMGZjZjhlNzZjNzViZGIzNWEzNmU2N2YyOTgxMTFkYzYxNDVjNjY2OTNiMDEzMzE5MmUyNjE2Il19",
    "transactionsHash": "T5-33Qu1748HUok8fDVd21iPgh5_ErN27ann7Xg67P8",
    "outputsHash": "ACzFnsi7kdSgS5bxhjO7qQaHfbk1kw9V4P4xoV1_zf8",
    "payloadHash": "BKFz8a2AZGtZQPlp2xPRfe7ohlnOuzV2NbIEB3cFwI8"
}
```

In the following example, the payload hash doesn't include any transactions:

```Postman
GET https://us1.testnet.chainweb.com/chainweb/0.0/testnet04/chain/18/payload/PB4yVhQo7vosXUH9Pik2z_OyJzn_fH0ChH-WOygOKuw
```

The response body indicates the empty block payload like this:

```json
{
    "transactions": [],
    "minerData": "eyJhY2NvdW50IjoidGVzdG4zdCIsInByZWRpY2F0ZSI6ImtleXMtYWxsIiwicHVibGljLWtleXMiOlsiZGI3NzY3OTNiZTBmY2Y4ZTc2Yzc1YmRiMzVhMzZlNjdmMjk4MTExZGM2MTQ1YzY2NjkzYjAxMzMxOTJlMjYxNiJdfQ",
    "transactionsHash": "v0-mUfeOoSLCuFyKMMwoTW7-4JZHBqjqS2NNPOYBbWg",
    "outputsHash": "-afV95__tCPIrMvk2yGoOxcjS4DAX0moG6gURByqf6Y",
    "payloadHash": "PB4yVhQo7vosXUH9Pik2z_OyJzn_fH0ChH-WOygOKuw"
}
```

If there are no results matching the request criteria, the response body indicates the reason no results were found. 
For example:

```json
{
  "key": "k1H3DsInAPvJ0W_zPxnrpkeSNdPUT0S9U8bqDLG739w",
  "reason": "key not found"
}
```

## Request multiple block payloads

Use `POST https://{baseURL}/chain/{chain}/payload/batch` to request multiple block payloads in a batch.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain&nbsp;(required) | integer >= 0 | Specifies the chain identifier of the chain you want to get the payload from. Valid values are 0 to 19. For example, to get block payload for the first chain (0), the request is `POST https://{baseURL}/chain/0/payload/batch`.

### Request body schema

Use an array of payload hash strings and an array of block heights in a JSON object to specify the payloads you want to include in your batch request.

| Parameter | Type | Description
| --------- | ---- | -----------
| hashes | Array of strings | Specifies the block payload hashes to include in the query request. Each block payload hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the `a-zA-Z0-9_-` character set. For example: `GpaWbHkHrCjRhY8hKE0qZ1WsBBaG3Y_zkFLV2sYumQA`.
| heights | Array of integers | Specifies the block heights to include in the request.

### Responses

Requests to `POST https://{baseURL}/chain/{chain}/payload/batch` return the following response codes:

- **200 OK** indicates that the request succeeded and the response body returns some or all of the requested block payloads. The payloads are returned in any order.
- **404 Not Found** indicates that the no payloads matching the request criteria were found.

#### Response header

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr	| string | Specifies the host address and port number of the client as observed by the remote Chainweb node. The host address can be a domain name or an IP address in IPv4 or IPv6 format. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

#### Successful response schema

If the request is successful, the response returns `application/json` content with the following:

| Parameter | Type | Description
| --------- | ---- | -----------
| transactions&nbsp;(required) | Array of strings | An array of Base64Url-encoded strings—without padding—that describe signed Pact transactions in JSON format.
| minerData (required) | string | Miner information is a Base64Url-encoded string—without padding—that consists of characters from the `a-zA-Z0-9_-` character set.This information is included as part of the payload JSON object.
| transactionsHash&nbsp;(required) | string | The transaction hash is a SHA256 hash. The hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the `a-zA-Z0-9_-` character set.
| outputsHash (required) | string | The output hash is a SHA256 hash. The hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the `a-zA-Z0-9_-` character set.
| payloadHash (required) | string | The block payload hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the `a-zA-Z0-9_-` character set.

### Examples

You can send a request to a bootstrap node for the Kadena test network and chain id 18 with a call like this:

```Postman
POST https://us1.chainweb.com/chainweb/0.0/testnet04/chain/18/payload/batch
```

In this example, the request body includes a payload hash array for two payloads and three blook heights like this:

```json
{
    "hashes": ["KBs8f6_ZK2UKDQRpEwNcm5I5c1HHW1SfOmwzOVVU9ic","vVNA0B3LmES4gOP5iLE4e4R2eslwQvBzAmhFhuThZRs"],
    "heights" : [4460669,4460682,4460694]
}
```

If there are no payoads matching your query request, the endpoint returns an empty array.

A successful response with two payloads looks similar to the following:

```json
[
  {
    "transactions": [
      "eyJoYXNoIjoiZjE0cW9vRTNxbDFUT2U0cmFyNzBlZVRScWs1MjMtQi1VeDh4MnV5MWNGSSIsInNpZ3MiOlt7InNpZyI6Ijc1OWRlOGY4OTc2NjgxMmRmNzQ4YjQxYjY4MDBmOWNhZWI4OGUwYTU5MDQzZTQxN2I4YjBiNWU1ZDVkZGEwMWNjMDhkYTg3MTM0NjRiYTdmZTVmOTE0OTU5MDY0NjQxZDc0NjVlZmZkNGNlYjBhNDk0MDBjMWQ3ZTYwYTA0YzA2In1dLCJjbWQiOiJ7XCJuZXR3b3JrSWRcIjpcIm1haW5uZXQwMVwiLFwicGF5bG9hZFwiOntcImV4ZWNcIjp7XCJkYXRhXCI6e1wia2V5c2V0XCI6e1wicHJlZFwiOlwia2V5cy1hbGxcIixcImtleXNcIjpbXCJkYmUwNWY4YWQ3OTYzMjc3YjYwZWQ3Y2E1NDhhNDRiN2I0ZDBmY2Y0OWMyMzE5YzU1YTAyZTBjM2EzZTgzNzU4XCJdfX0sXCJjb2RlXCI6XCIoZnJlZS5yYWRpbzAyLmRpcmVjdC10by1zZW5kIFxcXCJrOmMzZjA3YTBiMjYxMjQ0ODA3ZmNmYWEzMGI1YmQ3MWIwZTQzNjljN2NhNDQ0MDEwYTU5ZWRhNmE0ZDFhMmM1ZTZcXFwiIClcIn19LFwic2lnbmVyc1wiOlt7XCJwdWJLZXlcIjpcImRiZTA1ZjhhZDc5NjMyNzdiNjBlZDdjYTU0OGE0NGI3YjRkMGZjZjQ5YzIzMTljNTVhMDJlMGMzYTNlODM3NThcIn1dLFwibWV0YVwiOntcImNyZWF0aW9uVGltZVwiOjE3MjEwNzE3OTksXCJ0dGxcIjoyODgwMCxcImdhc0xpbWl0XCI6MTAwMCxcImNoYWluSWRcIjpcIjBcIixcImdhc1ByaWNlXCI6MC4wMDAwMDEsXCJzZW5kZXJcIjpcIms6ZGJlMDVmOGFkNzk2MzI3N2I2MGVkN2NhNTQ4YTQ0YjdiNGQwZmNmNDljMjMxOWM1NWEwMmUwYzNhM2U4Mzc1OFwifSxcIm5vbmNlXCI6XCJcXFwiMjAyNC0wNy0xNVQxOTozMDoxNS4wNTBaXFxcIlwifSJ9",
      ],
    "minerData": "eyJhY2NvdW50IjoiazplN2Y3MTMwZjM1OWZiMWY4Yzg3ODczYmY4NThhMGU5Y2JjM2MxMDU5ZjYyYWU3MTVlYzcyZTc2MGIwNTVlOWYzIiwicHJlZGljYXRlIjoia2V5cy1hbGwiLCJwdWJsaWMta2V5cyI6WyJlN2Y3MTMwZjM1OWZiMWY4Yzg3ODczYmY4NThhMGU5Y2JjM2MxMDU5ZjYyYWU3MTVlYzcyZTc2MGIwNTVlOWYzIl19",
    "transactionsHash": "v8H4sipeJ0nT8PTn6Gk5XQjroxT2k9MxmqWKDCzAO2I",
    "outputsHash": "fdhib91BzkURhgeRnrQyEqdupp9IxeTU3_R7mDyRB_A",
    "payloadHash": "WH4VCap-n1RuqjBDqBzekgJgaeKa8zfL50r18BJKV9E"
  },
  {
    "transactions": [
      "eyJoYXNoIjoic0YwbFA5SFZLbWJ0QXJoY0x1Q3A3ZFpzZExYY1JFc1k1NTVKMjJjZnlWZyIsInNpZ3MiOlt7InNpZyI6IjU1YTZkYTA4ZWY5YTg1MjU1ZjRmNWEyMWNjNjJiMzJhMDdhOWUxZDEyMTgzNzRiNGY4ZTkxNjg1NWIyYjM4MTRmZjE2MmNiODBhOGJkNWZiNDgwZmMxNWU4MTNmNDUwMjU1NGRmMjA3MWMyODY4ZWNjYjQ2ZDIxMmE2Yzk2ZjBlIn1dLCJjbWQiOiJ7XCJuZXR3b3JrSWRcIjpcIm1haW5uZXQwMVwiLFwicGF5bG9hZFwiOntcImV4ZWNcIjp7XCJkYXRhXCI6e1wia2V5c2V0XCI6e1wicHJlZFwiOlwia2V5cy1hbGxcIixcImtleXNcIjpbXCI0ZDRkNjRmMTA1YjgzOGJlZmUzODFkYmFiMTJjYzM5M2E2MjM0YmRhYTlhNWY1ZDk4MDNiZTNiZTZhODMwNTZlXCJdfX0sXCJjb2RlXCI6XCIoZnJlZS5yYWRpbzAyLmFkZC1yZWNlaXZlZC13aXRoLWNoYWluIFxcXCIyNGUxMjRmZmZlZjM4NDM3XFxcIiBcXFwiVTJGc2RHVmtYMTllZml1eW1LTk9aYUl3ZDJVamswRk82WEJVbWxIck5qMD07Ozs7O29WY3RwbFNYZ1NaZm0yejdQMHF4SElveHBPTFloRlFoelZpQ3AxM1gzMStDMk5jQ0M0bkhUZ3l1bXlvWTFDSHhaMjRrcFVpakgvSnQxTFdUWkJNMGpEZlNBODZDTkJtU3FGRHJjdGpoMGJWQklnK1ZhR29DaXpBS0pPaU9LQlVUYXNkTUU3L3g0SHpOaVFXTHJmZDNXdWJ3QTdiQURoZ3JvZ0Fvdlpwb0RWVT1cXFwiIFxcXCIwXFxcIiApXCJ9fSxcInNpZ25lcnNcIjpbe1wicHViS2V5XCI6XCI0ZDRkNjRmMTA1YjgzOGJlZmUzODFkYmFiMTJjYzM5M2E2MjM0YmRhYTlhNWY1ZDk4MDNiZTNiZTZhODMwNTZlXCJ9XSxcIm1ldGFcIjp7XCJjcmVhdGlvblRpbWVcIjoxNzIxMDcxOTA2LFwidHRsXCI6Mjg4MDAsXCJnYXNMaW1pdFwiOjEwMDAsXCJjaGFpbklkXCI6XCIwXCIsXCJnYXNQcmljZVwiOjAuMDAwMDAxLFwic2VuZGVyXCI6XCJrOjRkNGQ2NGYxMDViODM4YmVmZTM4MWRiYWIxMmNjMzkzYTYyMzRiZGFhOWE1ZjVkOTgwM2JlM2JlNmE4MzA1NmVcIn0sXCJub25jZVwiOlwiXFxcIjIwMjQtMDctMTVUMTk6MzI6MDEuMDczWlxcXCJcIn0ifQ",
      ],
    "minerData": "eyJhY2NvdW50IjoiazplN2Y3MTMwZjM1OWZiMWY4Yzg3ODczYmY4NThhMGU5Y2JjM2MxMDU5ZjYyYWU3MTVlYzcyZTc2MGIwNTVlOWYzIiwicHJlZGljYXRlIjoia2V5cy1hbGwiLCJwdWJsaWMta2V5cyI6WyJlN2Y3MTMwZjM1OWZiMWY4Yzg3ODczYmY4NThhMGU5Y2JjM2MxMDU5ZjYyYWU3MTVlYzcyZTc2MGIwNTVlOWYzIl19",
    "transactionsHash": "d0H-xMffO8eRtNYmIHtwc1Sw7Eg5-LP0Ht_yNvBkYRw",
    "outputsHash": "xk-xn-6VIpn38qmtWH8gdP1o2D3Jgr4bjfb6sV0hgWA",
    "payloadHash": "oVwaIAsRNWFRnO1WVdNu4cm_yrew0iijO2KiL5v5_2s"
  }
]
```

## Get block payload with outputs

Use `GET https://{baseURL}/chain/{chain}/payload/{payloadHash}/outputs` to get payload data with output.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain&nbsp;(required) | integer >= 0 | Specifies the chain identifier of the chain you want to send the payload request to. Valid values are 0 to 19. For example, to get block payload for the first chain (0), the request is `GET https://{baseURL}/chain/0/payload/{payloadHash}/outputs`.
| payloadHash (required) | string | The block payload hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the `a-zA-Z0-9_-` character set. For example: `GpaWbHkHrCjRhY8hKE0qZ1WsBBaG3Y_zkFLV2sYumQA`.

### Query parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| height | integer >= 0 | Height of a block. For example: `height=3000000`.

### Responses

Requests to `GET https://{baseURL}/chain/{chain}/payload/{payloadhash}/outputs` return the following response codes:

- **200 OK** indicates that the request succeeded and the response body returns the payload data and output for the specified payload hash. 
- **404 Not Found** indicates that the payload hash wasn't found.

#### Response header

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr	| string | Specifies the host address and port number of the client as observed by the remote Chainweb node. The host address can be a domain name or an IP address in IPv4 or IPv6 format. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

#### Successful response schema

If the request is successful, the response returns `application/json` content with the following:

| Parameter | Type | Description
| --------- | ---- | -----------
| transactions&nbsp;(required) | Array of strings | An array of Base64Url-encoded strings—without padding—that describe signed Pact transactions in JSON format.
| minerData (required) | string | Miner information is a Base64Url-encoded string—without padding—that consists of characters from the `a-zA-Z0-9_-` character set.This information is included as part of the payload JSON object.
| transactionsHash&nbsp;(required) | string | The transaction hash is a SHA256 hash. The hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the `a-zA-Z0-9_-` character set.
| outputsHash (required) | string | The output hash is a SHA256 hash. The hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the `a-zA-Z0-9_-` character set.
| payloadHash (required) | string | The block payload hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the `a-zA-Z0-9_-` character set.
| coinbase (required) | string | Coinbase output is a Base64Url-encoded string—without padding—that consists of characters from the `a-zA-Z0-9_-` character set. This information is included as part of the payload output JSON object.

#### Not found response schema

If there are no results matching the request criteria, the response returns the following:

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| key | string | Specifies the base64Url-encoded block hash without padding. The block hash consists of 43 characters from the `a-zA-Z0-9_-` character set. |
| reason | string | Provides a placeholder for specifying the reason that no block hashes were found. |

### Examples

You can send a request to a bootstrap node for the Kadena main network and chain id 4 with a call like this:

```Postman
GET https://us-e1.chainweb.com/chainweb/0.0/mainnet01/chain/4/payload/jafDpAgMCYnAqh-hweSjA6sWCAp-ADSDzIcUKyRwkq8/outputs
```

This request returns a response body that looks like this:

```json
{
    "transactions": [
        [
            "eyJoYXNoIjoiQXFtNTRlRWNmMkQtVGJQR3FYLURIYWFkdUF0VXp5dEVqVzhLaDJ6bWlRSSIsInNpZ3MiOlt7InNpZyI6IjY5MzYwYTlhZjZmOTVkMmQ4NjhiNDA4NmQ0ZTU1NjQ3NzRhOGU5NWY0ZDZmMGM0ZGI2MmE4YTgwMmI5YWNkODczOTRmNjNkN2FiMTFkNjA2NWU1MjEzYmYwMGRkNmVhYjliMWI0MzUwODU1MTFmYmRkNmE1ZDcxMzI1YjhmZTBiIn1dLCJjbWQiOiJ7XCJwYXlsb2FkXCI6e1wiZXhlY1wiOntcImNvZGVcIjpcIihuX2JmYjc2ZWFiMzdiZjhjODQzNTlkNjU1MmExZDk2YTMwOWUwMzBiNzEuZGlhLW9yYWNsZS5zZXQtbXVsdGlwbGUtdmFsdWVzIFtcXFwiR05PL1VTRFxcXCJdIFsodGltZSBcXFwiMjAyNC0wNy0xOFQxNTozMDo0N1pcXFwiKV0gWzI1Ny41NV0pXCIsXCJkYXRhXCI6e319fSxcIm5vbmNlXCI6XCJranM6bm9uY2U6MTcyMTMxNjY0NzM0N1wiLFwic2lnbmVyc1wiOlt7XCJwdWJLZXlcIjpcIjhmOTE5NzRkMDU0M2Q4YzEzMmJjNDc5NmE2NGQ4M2VhZjgwOGE2YzNmY2QyZWYyZDY2YWNhYTU5M2U4YjQ0ZTZcIixcInNjaGVtZVwiOlwiRUQyNTUxOVwifV0sXCJtZXRhXCI6e1wiZ2FzTGltaXRcIjoyNTAwLFwiZ2FzUHJpY2VcIjoxZS04LFwic2VuZGVyXCI6XCJrOjhmOTE5NzRkMDU0M2Q4YzEzMmJjNDc5NmE2NGQ4M2VhZjgwOGE2YzNmY2QyZWYyZDY2YWNhYTU5M2U4YjQ0ZTZcIixcInR0bFwiOjI4ODAwLFwiY3JlYXRpb25UaW1lXCI6MTcyMTMxNjY0NyxcImNoYWluSWRcIjpcIjRcIn0sXCJuZXR3b3JrSWRcIjpcIm1haW5uZXQwMVwifSJ9",
            "eyJnYXMiOjQzNSwicmVzdWx0Ijp7InN0YXR1cyI6InN1Y2Nlc3MiLCJkYXRhIjpbdHJ1ZV19LCJyZXFLZXkiOiJBcW01NGVFY2YyRC1UYlBHcVgtREhhYWR1QXRVenl0RWpXOEtoMnptaVFJIiwibG9ncyI6Ik1zenliLXRBZ3dOOEtWeGg5a3FZWTMyVkZlbGx2ZzBsT2lBV3NGWUR3dFkiLCJldmVudHMiOlt7InBhcmFtcyI6WyJrOjhmOTE5NzRkMDU0M2Q4YzEzMmJjNDc5NmE2NGQ4M2VhZjgwOGE2YzNmY2QyZWYyZDY2YWNhYTU5M2U4YjQ0ZTYiLCJrOjI1MWVmYjA2ZjNiNzk4ZGJlN2JiM2Y1OGY1MzViNjdiMGE5ZWQyZGE5YWE0ZTIzNjdiZTRhYmMwN2NjOTI3ZmEiLDQuMzVlLTZdLCJuYW1lIjoiVFJBTlNGRVIiLCJtb2R1bGUiOnsibmFtZXNwYWNlIjpudWxsLCJuYW1lIjoiY29pbiJ9LCJtb2R1bGVIYXNoIjoia2xGa3JMZnB5TFctTTN4alZQU2RxWEVNZ3hQUEppYlJ0X0Q2cWlCd3M2cyJ9LHsicGFyYW1zIjpbIkdOTy9VU0QiLHsidGltZSI6IjIwMjQtMDctMThUMTU6MzA6NDdaIn0sMjU3LjU1XSwibmFtZSI6IlVQREFURSIsIm1vZHVsZSI6eyJuYW1lc3BhY2UiOiJuX2JmYjc2ZWFiMzdiZjhjODQzNTlkNjU1MmExZDk2YTMwOWUwMzBiNzEiLCJuYW1lIjoiZGlhLW9yYWNsZSJ9LCJtb2R1bGVIYXNoIjoiN1FWOTlvcGVDMHRZSTE4NHdzOWJNdDRvcnk0bF9qX0F1WXMtTEpUMmJWNCJ9XSwibWV0YURhdGEiOm51bGwsImNvbnRpbnVhdGlvbiI6bnVsbCwidHhJZCI6NTUyMzQ4Mn0"
        ]
    ],
    "minerData": "eyJhY2NvdW50IjoiazoyNTFlZmIwNmYzYjc5OGRiZTdiYjNmNThmNTM1YjY3YjBhOWVkMmRhOWFhNGUyMzY3YmU0YWJjMDdjYzkyN2ZhIiwicHJlZGljYXRlIjoia2V5cy1hbGwiLCJwdWJsaWMta2V5cyI6WyIyNTFlZmIwNmYzYjc5OGRiZTdiYjNmNThmNTM1YjY3YjBhOWVkMmRhOWFhNGUyMzY3YmU0YWJjMDdjYzkyN2ZhIl19",
    "transactionsHash": "lyjQiTyx8SqozBYkbOxQ5BFBMiK8x7-TA7Ce--fkjNw",
    "outputsHash": "4hSo0VAUzsuROnt0WfX8vytqQ8lQq3xrvt9EHJA_NhI",
    "payloadHash": "jafDpAgMCYnAqh-hweSjA6sWCAp-ADSDzIcUKyRwkq8",
    "coinbase": "eyJnYXMiOjAsInJlc3VsdCI6eyJzdGF0dXMiOiJzdWNjZXNzIiwiZGF0YSI6IldyaXRlIHN1Y2NlZWRlZCJ9LCJyZXFLZXkiOiJJalZ5Wmt4cVEwOUlVbE4wU1RNNE0wbEZVVE5OVlhkemFIcHFSVmxpTjFKaE4zUlhiMnhvVVROU05HOGkiLCJsb2dzIjoieGhlOEREb0VqUEtpQU1GOUs3NXVZalBiTDkzeWlFY3Y0OHZBQnZvaGpZWSIsImV2ZW50cyI6W3sicGFyYW1zIjpbIiIsIms6MjUxZWZiMDZmM2I3OThkYmU3YmIzZjU4ZjUzNWI2N2IwYTllZDJkYTlhYTRlMjM2N2JlNGFiYzA3Y2M5MjdmYSIsMC45ODAxOTFdLCJuYW1lIjoiVFJBTlNGRVIiLCJtb2R1bGUiOnsibmFtZXNwYWNlIjpudWxsLCJuYW1lIjoiY29pbiJ9LCJtb2R1bGVIYXNoIjoia2xGa3JMZnB5TFctTTN4alZQU2RxWEVNZ3hQUEppYlJ0X0Q2cWlCd3M2cyJ9XSwibWV0YURhdGEiOm51bGwsImNvbnRpbnVhdGlvbiI6bnVsbCwidHhJZCI6NTUyMzQ4MH0"
}
```

If there are no results matching the request criteria, the response body indicates the reason no results were found. 
For example:

```json
{
    "key": "i3lwc38zLkSrHDn5wj_LMFfA4VdofhTZ3crqZZ-5WJs",
    "reason": "key not found"
}
```

## Request multiple block payloads with outputs

Use `POST https://{baseURL}/chain/{chain}/payload/outputs/batch` to request multiple block payloads with output in a batch.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain&nbsp;(required) | integer >= 0 | Specifies the chain identifier of the chain you want to get the payload from. Valid values are 0 to 19. For example, to get block payload for the first chain (0), the request is `POST https://{baseURL}/chain/0/payload/outputs/batch`.

### Request body schema

Use an array of payload hash strings in a JSON object to specify the payloads you want to include in your batch request, with or without heights.

| Parameter | Type | Description
| --------- | ---- | -----------
| hashes&nbsp;(required) | Array of strings | Each block payload hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the `a-zA-Z0-9_-` character set. For example: `GpaWbHkHrCjRhY8hKE0qZ1WsBBaG3Y_zkFLV2sYumQA`.
| heights&nbsp;(required) | Array of integers | Specifies the block heights to include in the request.

### Responses

Requests to `POST https://{baseURL}/chain/{chain}/payload/outputs/batch` return the following response codes:

- **200 OK** indicates that the request succeeded and the response body includes some or all of the requested block payloads. The payloads are returned in any order.
- **404 Not Found** indicates that no payloads mateching the request criteris were found.

#### Response header

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr	| string | Specifies the host address and port number of the client as observed by the remote Chainweb node. The host address can be a domain name or an IP address in IPv4 or IPv6 format. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

#### Successful response schema

If the request is successful, the response returns `application/json` content with the following:

| Parameter | Type | Description
| --------- | ---- | -----------
| transactions&nbsp;(required) | Array of strings | An array of Base64Url-encoded strings—without padding—that describe signed Pact transactions in JSON format.
| minerData (required) | string | Miner information is a Base64Url-encoded string—without padding—that consists of characters from the `a-zA-Z0-9_-` character set.This information is included as part of the payload JSON object.
| transactionsHash&nbsp;(required) | string | The transaction hash is a SHA256 hash. The hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the `a-zA-Z0-9_-` character set.
| outputsHash (required) | string | The output hash is a SHA256 hash. The hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the `a-zA-Z0-9_-` character set.
| payloadHash (required) | string | The block payload hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the `a-zA-Z0-9_-` character set.
| coinbase (required) | string | Coinbase output is a Base64Url-encoded string—without padding—that consists of characters from the `a-zA-Z0-9_-` character set. This information is included as part of the payload output JSON object.

### Examples

You can send a request to a bootstrap node for the Kadena main public blockchain network and chain id 4 with a call like this:

```Postman
POST https://us-e1.chainweb.com/chainweb/0.0/mainnet01/chain/4/payload/outputs/batch
```

In this example, the batch request includes three payload hashes and two block heights like this:

```json
{
    "hashes":["R464YmQdiNCakRluZb2oJDG_uJBqUSAZpANNktJRQko","nrPYG6PSkE40eYuf4LLrPFRADp2Uq7EI9d4OOIqeOMs","JerYnYUPUWavDKO1plBuVTi62PHcAsgICIA0IRSGA8s"],
    "heights":[4953820,4953821]
}
```

The request returns the results matching the request criteria like this:

```json
[
    {
        "transactions": [
            [
                "eyJoYXNoIjoiQmJHc0J6RTNhcW9ObmstOUt6U3FwSnFDc3duSEFuWHFJa21JUFV4RjVidyIsInNpZ3MiOlt7InNpZyI6Ijc2NjU1NjM0N2MzYzY1YzMwMmM0OTYwMWVlY2E2Yzk3ZTg1ODdmMDk3M2E5ZjlkOWY0N2YyM2NhZjJhMGZiMTMwN2Y1OGNhM2FiYzNlNjEyZTM3NTE3NWMyNWQ3ZjViY2FjZmEwOTQzN2NkZDI1MjU1YTM2ZmQwOGEzYjI0ZTA2In1dLCJjbWQiOiJ7XCJwYXlsb2FkXCI6e1wiZXhlY1wiOntcImNvZGVcIjpcIihuX2JmYjc2ZWFiMzdiZjhjODQzNTlkNjU1MmExZDk2YTMwOWUwMzBiNzEuZGlhLW9yYWNsZS5zZXQtbXVsdGlwbGUtdmFsdWVzIFtcXFwiQlRDL1VTRFxcXCIsXFxcIkVUSC9VU0RcXFwiLFxcXCJXRVRIL1VTRFxcXCIsXFxcIkdMTVIvVVNEXFxcIixcXFwiT1AvVVNEXFxcIixcXFwiQVJCL1VTRFxcXCIsXFxcIkFWQVgvVVNEXFxcIixcXFwiS0RBL1VTRFxcXCJdIFsodGltZSBcXFwiMjAyNC0wNy0xNVQxOTozMDozNlpcXFwiKSwgKHRpbWUgXFxcIjIwMjQtMDctMTVUMTk6MzA6MzZaXFxcIiksICh0aW1lIFxcXCIyMDI0LTA3LTE1VDE5OjMwOjM2WlxcXCIpLCAodGltZSBcXFwiMjAyNC0wNy0xNVQxOTozMDozNlpcXFwiKSwgKHRpbWUgXFxcIjIwMjQtMDctMTVUMTk6MzA6MzZaXFxcIiksICh0aW1lIFxcXCIyMDI0LTA3LTE1VDE5OjMwOjM2WlxcXCIpLCAodGltZSBcXFwiMjAyNC0wNy0xNVQxOTozMDozNlpcXFwiKSwgKHRpbWUgXFxcIjIwMjQtMDctMTVUMTk6MzA6MzZaXFxcIildIFs2MzM4Ny4zOTczNzQwNjUyNywzMzkwLjI0NTAxNDM2NjE1MSwzMzkyLjQ1MzQzNDMzMDA3MywwLjIxNTc3OTQyOTUwMDgzOTEsMS43OTY5MTQwODA1ODkyMzg3LDAuNzM3ODY2MDk2NzE1NzI5MSwyNy4xMjM2MjM2NjcyNjQ5NDgsMC42MDk1NDkzMDk0NDYwNjM2XSlcIixcImRhdGFcIjp7fX19LFwibm9uY2VcIjpcImtqczpub25jZToxNzIxMDcxODM2OTE5XCIsXCJzaWduZXJzXCI6W3tcInB1YktleVwiOlwiOGY5MTk3NGQwNTQzZDhjMTMyYmM0Nzk2YTY0ZDgzZWFmODA4YTZjM2ZjZDJlZjJkNjZhY2FhNTkzZThiNDRlNlwiLFwic2NoZW1lXCI6XCJFRDI1NTE5XCJ9XSxcIm1ldGFcIjp7XCJnYXNMaW1pdFwiOjI1MDAsXCJnYXNQcmljZVwiOjFlLTgsXCJzZW5kZXJcIjpcIms6OGY5MTk3NGQwNTQzZDhjMTMyYmM0Nzk2YTY0ZDgzZWFmODA4YTZjM2ZjZDJlZjJkNjZhY2FhNTkzZThiNDRlNlwiLFwidHRsXCI6Mjg4MDAsXCJjcmVhdGlvblRpbWVcIjoxNzIxMDcxODM2LFwiY2hhaW5JZFwiOlwiNFwifSxcIm5ldHdvcmtJZFwiOlwibWFpbm5ldDAxXCJ9In0",
                "eyJnYXMiOjE2MTQsInJlc3VsdCI6eyJzdGF0dXMiOiJzdWNjZXNzIiwiZGF0YSI6W3RydWUsdHJ1ZSx0cnVlLHRydWUsdHJ1ZSx0cnVlLHRydWUsdHJ1ZV19LCJyZXFLZXkiOiJCYkdzQnpFM2Fxb05uay05S3pTcXBKcUNzd25IQW5YcUlrbUlQVXhGNWJ3IiwibG9ncyI6IjlwUUNvZWZNSEpKNllYS0pLUVVGMkVOTmItMW9XMXRsQ2ZnSUx6a3hMdW8iLCJldmVudHMiOlt7InBhcmFtcyI6WyJrOjhmOTE5NzRkMDU0M2Q4YzEzMmJjNDc5NmE2NGQ4M2VhZjgwOGE2YzNmY2QyZWYyZDY2YWNhYTU5M2U4YjQ0ZTYiLCJrOjI1MWVmYjA2ZjNiNzk4ZGJlN2JiM2Y1OGY1MzViNjdiMGE5ZWQyZGE5YWE0ZTIzNjdiZTRhYmMwN2NjOTI3ZmEiLDEuNjE0ZS01XSwibmFtZSI6IlRSQU5TRkVSIiwibW9kdWxlIjp7Im5hbWVzcGFjZSI6bnVsbCwibmFtZSI6ImNvaW4ifSwibW9kdWxlSGFzaCI6ImtsRmtyTGZweUxXLU0zeGpWUFNkcVhFTWd4UFBKaWJSdF9ENnFpQndzNnMifSx7InBhcmFtcyI6WyJCVEMvVVNEIix7InRpbWUiOiIyMDI0LTA3LTE1VDE5OjMwOjM2WiJ9LDYzMzg3LjM5NzM3NDA2NTI3XSwibmFtZSI6IlVQREFURSIsIm1vZHVsZSI6eyJuYW1lc3BhY2UiOiJuX2JmYjc2ZWFiMzdiZjhjODQzNTlkNjU1MmExZDk2YTMwOWUwMzBiNzEiLCJuYW1lIjoiZGlhLW9yYWNsZSJ9LCJtb2R1bGVIYXNoIjoiN1FWOTlvcGVDMHRZSTE4NHdzOWJNdDRvcnk0bF9qX0F1WXMtTEpUMmJWNCJ9LHsicGFyYW1zIjpbIkVUSC9VU0QiLHsidGltZSI6IjIwMjQtMDctMTVUMTk6MzA6MzZaIn0sMzM5MC4yNDUwMTQzNjYxNTFdLCJuYW1lIjoiVVBEQVRFIiwibW9kdWxlIjp7Im5hbWVzcGFjZSI6Im5fYmZiNzZlYWIzN2JmOGM4NDM1OWQ2NTUyYTFkOTZhMzA5ZTAzMGI3MSIsIm5hbWUiOiJkaWEtb3JhY2xlIn0sIm1vZHVsZUhhc2giOiI3UVY5OW9wZUMwdFlJMTg0d3M5Yk10NG9yeTRsX2pfQXVZcy1MSlQyYlY0In0seyJwYXJhbXMiOlsiV0VUSC9VU0QiLHsidGltZSI6IjIwMjQtMDctMTVUMTk6MzA6MzZaIn0sMzM5Mi40NTM0MzQzMzAwNzNdLCJuYW1lIjoiVVBEQVRFIiwibW9kdWxlIjp7Im5hbWVzcGFjZSI6Im5fYmZiNzZlYWIzN2JmOGM4NDM1OWQ2NTUyYTFkOTZhMzA5ZTAzMGI3MSIsIm5hbWUiOiJkaWEtb3JhY2xlIn0sIm1vZHVsZUhhc2giOiI3UVY5OW9wZUMwdFlJMTg0d3M5Yk10NG9yeTRsX2pfQXVZcy1MSlQyYlY0In0seyJwYXJhbXMiOlsiR0xNUi9VU0QiLHsidGltZSI6IjIwMjQtMDctMTVUMTk6MzA6MzZaIn0sMC4yMTU3Nzk0Mjk1MDA4MzkxXSwibmFtZSI6IlVQREFURSIsIm1vZHVsZSI6eyJuYW1lc3BhY2UiOiJuX2JmYjc2ZWFiMzdiZjhjODQzNTlkNjU1MmExZDk2YTMwOWUwMzBiNzEiLCJuYW1lIjoiZGlhLW9yYWNsZSJ9LCJtb2R1bGVIYXNoIjoiN1FWOTlvcGVDMHRZSTE4NHdzOWJNdDRvcnk0bF9qX0F1WXMtTEpUMmJWNCJ9LHsicGFyYW1zIjpbIk9QL1VTRCIseyJ0aW1lIjoiMjAyNC0wNy0xNVQxOTozMDozNloifSx7ImRlY2ltYWwiOiIxLjc5NjkxNDA4MDU4OTIzODcifV0sIm5hbWUiOiJVUERBVEUiLCJtb2R1bGUiOnsibmFtZXNwYWNlIjoibl9iZmI3NmVhYjM3YmY4Yzg0MzU5ZDY1NTJhMWQ5NmEzMDllMDMwYjcxIiwibmFtZSI6ImRpYS1vcmFjbGUifSwibW9kdWxlSGFzaCI6IjdRVjk5b3BlQzB0WUkxODR3czliTXQ0b3J5NGxfal9BdVlzLUxKVDJiVjQifSx7InBhcmFtcyI6WyJBUkIvVVNEIix7InRpbWUiOiIyMDI0LTA3LTE1VDE5OjMwOjM2WiJ9LDAuNzM3ODY2MDk2NzE1NzI5MV0sIm5hbWUiOiJVUERBVEUiLCJtb2R1bGUiOnsibmFtZXNwYWNlIjoibl9iZmI3NmVhYjM3YmY4Yzg0MzU5ZDY1NTJhMWQ5NmEzMDllMDMwYjcxIiwibmFtZSI6ImRpYS1vcmFjbGUifSwibW9kdWxlSGFzaCI6IjdRVjk5b3BlQzB0WUkxODR3czliTXQ0b3J5NGxfal9BdVlzLUxKVDJiVjQifSx7InBhcmFtcyI6WyJBVkFYL1VTRCIseyJ0aW1lIjoiMjAyNC0wNy0xNVQxOTozMDozNloifSx7ImRlY2ltYWwiOiIyNy4xMjM2MjM2NjcyNjQ5NDgifV0sIm5hbWUiOiJVUERBVEUiLCJtb2R1bGUiOnsibmFtZXNwYWNlIjoibl9iZmI3NmVhYjM3YmY4Yzg0MzU5ZDY1NTJhMWQ5NmEzMDllMDMwYjcxIiwibmFtZSI6ImRpYS1vcmFjbGUifSwibW9kdWxlSGFzaCI6IjdRVjk5b3BlQzB0WUkxODR3czliTXQ0b3J5NGxfal9BdVlzLUxKVDJiVjQifSx7InBhcmFtcyI6WyJLREEvVVNEIix7InRpbWUiOiIyMDI0LTA3LTE1VDE5OjMwOjM2WiJ9LDAuNjA5NTQ5MzA5NDQ2MDYzNl0sIm5hbWUiOiJVUERBVEUiLCJtb2R1bGUiOnsibmFtZXNwYWNlIjoibl9iZmI3NmVhYjM3YmY4Yzg0MzU5ZDY1NTJhMWQ5NmEzMDllMDMwYjcxIiwibmFtZSI6ImRpYS1vcmFjbGUifSwibW9kdWxlSGFzaCI6IjdRVjk5b3BlQzB0WUkxODR3czliTXQ0b3J5NGxfal9BdVlzLUxKVDJiVjQifV0sIm1ldGFEYXRhIjpudWxsLCJjb250aW51YXRpb24iOm51bGwsInR4SWQiOjU1MTIwNjV9"
            ]
        ],
        "minerData": "eyJhY2NvdW50IjoiazoyNTFlZmIwNmYzYjc5OGRiZTdiYjNmNThmNTM1YjY3YjBhOWVkMmRhOWFhNGUyMzY3YmU0YWJjMDdjYzkyN2ZhIiwicHJlZGljYXRlIjoia2V5cy1hbGwiLCJwdWJsaWMta2V5cyI6WyIyNTFlZmIwNmYzYjc5OGRiZTdiYjNmNThmNTM1YjY3YjBhOWVkMmRhOWFhNGUyMzY3YmU0YWJjMDdjYzkyN2ZhIl19",
        "transactionsHash": "18splwzqG5qFgIm9EY9em0PS6OGT7pME9pyOYsmFsgA",
        "outputsHash": "et4kTB87lv7VFx1dmyzzqnVRg7QUNFBcE02zU5wD44c",
        "payloadHash": "R464YmQdiNCakRluZb2oJDG_uJBqUSAZpANNktJRQko",
        "coinbase": "eyJnYXMiOjAsInJlc3VsdCI6eyJzdGF0dXMiOiJzdWNjZXNzIiwiZGF0YSI6IldyaXRlIHN1Y2NlZWRlZCJ9LCJyZXFLZXkiOiJJakJEYnpCcFozaDFjRkJTUjBSSGVESTNibmRUYUd4RmVIcFNPVUZ6TFhCdE9EbG1OSFZJUjFsQmFXc2kiLCJsb2dzIjoiSEFHZjhtUkZNQ09MWVVsR1V3Q28xSVJ3akY1MzRDd1FDZ2xHaHIydURrbyIsImV2ZW50cyI6W3sicGFyYW1zIjpbIiIsIms6MjUxZWZiMDZmM2I3OThkYmU3YmIzZjU4ZjUzNWI2N2IwYTllZDJkYTlhYTRlMjM2N2JlNGFiYzA3Y2M5MjdmYSIsMC45ODAxOTFdLCJuYW1lIjoiVFJBTlNGRVIiLCJtb2R1bGUiOnsibmFtZXNwYWNlIjpudWxsLCJuYW1lIjoiY29pbiJ9LCJtb2R1bGVIYXNoIjoia2xGa3JMZnB5TFctTTN4alZQU2RxWEVNZ3hQUEppYlJ0X0Q2cWlCd3M2cyJ9XSwibWV0YURhdGEiOm51bGwsImNvbnRpbnVhdGlvbiI6bnVsbCwidHhJZCI6NTUxMjA2M30"
    }
]
```