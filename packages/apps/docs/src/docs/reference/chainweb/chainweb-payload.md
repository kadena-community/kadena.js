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

Raw literal block payloads in the same form as they are stored on the chain. 
By default, only the payload data is returned.
This data is sufficient for validating the blockchain Merkle tree. 
The payload data is also sufficient as input to Pact for executing the Pact transactions of the block and recomputing the outputs.

It is also possible to query the transaction outputs along with the payload data.

## Get block payload

Use `GET /chain/{chain}/payload/{payloadHash}` to get the payload data.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain (required) | integer >= 0 | Specifies the chain identifier of the chain you want to send the payload request to. Valid values are 0 to 19. For example, to get block payload for the first chain (0), the request is `GET /chain/0/payload`.
| payloadHash (required) | string | The block payload hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the [a-zA-Z0-9_-] character set. For example: `GpaWbHkHrCjRhY8hKE0qZ1WsBBaG3Y_zkFLV2sYumQA`.

### Query parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| height | integer >= 0 | Height of a block. For example: `height=3000000`.

### Responses

Requests to `/chain/{chain}/payload/{payloadhash}` can return the following response codes:

- **200 OK** indicates that the request succeeded and returns the payload data for the specified payload hash. 
- **404 Not Found** indicates that the payload hash wasn't found.

#### Response header

The response header parameters are the same for successful and unsuccessful requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr	| string | Specifies the host address and port number of the client as observed by the remote chainweb node in the format ^\d{4}.\d{4}.\d{4}.\d{4}:\d+$. For example: `"10.36.1.3:42988"`.
| x-server-timestamp | integer >= 0 | Specifies the clock time of the remote chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x-chainweb-node-version	| string | Specifies the version of the remote chainweb node. For example: `"2.23"`.

#### Successful response schema

If the request is successful, the response returns `application/json` content with the following:

| Parameter | Type | Description
| --------- | ---- | -----------
| transactions (required) | Array of strings | An array of Base64Url-encoded strings—without padding—that describe signed Pact transactions in JSON format.
| minerData (required) | string | Miner information is a Base64Url-encoded string—without padding—that consists of characters from the [a-zA-Z0-9_-] character set.This information is included as part of the payload JSON object.
| transactionsHash (required) | string | The transaction hash is a SHA256 hash. The hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the [a-zA-Z0-9_-] character set.
| outputsHash (required) | string | The output hash is a SHA256 hash. The hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the [a-zA-Z0-9_-] character set.
| payloadHash (required) | string | The block payload hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the [a-zA-Z0-9_-] character set.

For example, a payload with one transaction looks similar to the following:

```json
{
  "transactions": [
    "eyJoYXNoIjoiMi16Q3dmRFZZR010WHljd2pTLXRlNzh5U3l3T3JXcjNSdUhiQlJnNDdhRSIsInNpZ3MiOlt7InNpZyI6ImZiMTVkNzkyYTNkNDM1MDI5ODJmOGQ1MGUyMzA1NTI5OWEwZjdhMWRmMWE4YjUyMmE5NTMxNWUyZDljY2MyNmE1MzI4M2I5YTNhNDM5ZWE0ZGY4MGM1ZTIwMjg4NDhjNjFhMWY0MGM5OWIyOTYzOWM0NGNkYTgwMzBmYmViYjBjIn1dLCJjbWQiOiJ7XCJuZXR3b3JrSWRcIjpcIm1haW5uZXQwMVwiLFwicGF5bG9hZFwiOntcImV4ZWNcIjp7XCJkYXRhXCI6e30sXCJjb2RlXCI6XCIoY29pbi50cmFuc2ZlciBcXFwiZTc1NzU4ZGQyYTFjNTk2NDRjMjJlMDQyYzZlYzA3NTI2ZWE0ZTU3MTU0ZjlkYmMyMDc2ZThhODRhYzE5NGYzMlxcXCIgXFxcIjQ2NzdhMDllYTE2MDJlNGUwOWZlMDFlYjExOTZjZjQ3YzBmNDRhYTQ0YWFjOTAzZDVmNjFiZTdkYTM0MjUxMjhcXFwiIDMuNzc2KVwifX0sXCJzaWduZXJzXCI6W3tcInB1YktleVwiOlwiZTc1NzU4ZGQyYTFjNTk2NDRjMjJlMDQyYzZlYzA3NTI2ZWE0ZTU3MTU0ZjlkYmMyMDc2ZThhODRhYzE5NGYzMlwiLFwiY2xpc3RcIjpbe1wiYXJnc1wiOltdLFwibmFtZVwiOlwiY29pbi5HQVNcIn0se1wiYXJnc1wiOltcImU3NTc1OGRkMmExYzU5NjQ0YzIyZTA0MmM2ZWMwNzUyNmVhNGU1NzE1NGY5ZGJjMjA3NmU4YTg0YWMxOTRmMzJcIixcIjQ2NzdhMDllYTE2MDJlNGUwOWZlMDFlYjExOTZjZjQ3YzBmNDRhYTQ0YWFjOTAzZDVmNjFiZTdkYTM0MjUxMjhcIiwzLjc3Nl0sXCJuYW1lXCI6XCJjb2luLlRSQU5TRkVSXCJ9XX1dLFwibWV0YVwiOntcImNyZWF0aW9uVGltZVwiOjE2MDIzODI4MTQsXCJ0dGxcIjoyODgwMCxcImdhc0xpbWl0XCI6NjAwLFwiY2hhaW5JZFwiOlwiMFwiLFwiZ2FzUHJpY2VcIjoxLjBlLTUsXCJzZW5kZXJcIjpcImU3NTc1OGRkMmExYzU5NjQ0YzIyZTA0MmM2ZWMwNzUyNmVhNGU1NzE1NGY5ZGJjMjA3NmU4YTg0YWMxOTRmMzJcIn0sXCJub25jZVwiOlwiXFxcIjIwMjAtMTAtMTFUMDI6MjE6MTQuMTk0WlxcXCJcIn0ifQ"
  ],
  "minerData": "eyJhY2NvdW50IjoiYTFiMzE0MGNiN2NjODk1YzBlMDkxNzAyZWQwNTU3OWZiZTA1YzZlNjc0NWY4MmNlNjAzNzQ2YjQwMGM4MTU0OCIsInByZWRpY2F0ZSI6ImtleXMtYWxsIiwicHVibGljLWtleXMiOlsiYTFiMzE0MGNiN2NjODk1YzBlMDkxNzAyZWQwNTU3OWZiZTA1YzZlNjc0NWY4MmNlNjAzNzQ2YjQwMGM4MTU0OCJdfQ",
  "transactionsHash": "lWcQRlj3MV7FSem8P4G-8GMRf1-O7zQqi_AwmWnk-N0",
  "outputsHash": "9BzXZbhjSSevp4K0bYFqi1GdLjeX_DB-4u1T5Em8abs",
  "payloadHash": "jcQOWz7K9qKnkUv4Z883D2ZjkFFGgccoSroWGaoogLM"
}
```

The following is an example of an empty block payload:

```json
{
  "transactions": [],
  "minerData": "eyJhY2NvdW50IjoiYTFiMzE0MGNiN2NjODk1YzBlMDkxNzAyZWQwNTU3OWZiZTA1YzZlNjc0NWY4MmNlNjAzNzQ2YjQwMGM4MTU0OCIsInByZWRpY2F0ZSI6ImtleXMtYWxsIiwicHVibGljLWtleXMiOlsiYTFiMzE0MGNiN2NjODk1YzBlMDkxNzAyZWQwNTU3OWZiZTA1YzZlNjc0NWY4MmNlNjAzNzQ2YjQwMGM4MTU0OCJdfQ",
  "transactionsHash": "nT0j4xw2woMkdXXaopdurXIn24OG-jNMqQzUGfxV_MA",
  "outputsHash": "4pXRrZ2K0_V0iGAxQCKrKdLjQTBZHBOQS7P-47kdnhY",
  "payloadHash": "GpaWbHkHrCjRhY8hKE0qZ1WsBBaG3Y_zkFLV2sYumQA"
}
```

#### Not found response schema

If there are no results matching the request criteria, the response returns the 404 response code with content similar to the following:

```json
{
  "reason": "key not found",
  "key": "k1H3DsInAPvJ0W_zPxnrpkeSNdPUT0S9U8bqDLG739w"
}
```
### Example

To send a payload request to the Kadena test network and chain id 18:

```postman
GET https://us1.testnet.chainweb.com/chainweb/0.0/testnet04/chain/18/payload/BKFz8a2AZGtZQPlp2xPRfe7ohlnOuzV2NbIEB3cFwI8
```

```Response
X-Server-Timestamp: 1720805685
X-Peer-Addr: 54.86.50.139:16853
X-Chainweb-Node-Version: 2.24.1
Content-Type: application/json;charset=utf-8
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

## Get batch of block payload

Use `POST /chain/{chain}/payload/batch` to request multiple block payloads in a batch.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain (required) | integer >= 0 | Specifies the chain identifier of the chain you want to get the payload from. Valid values are 0 to 19. For example, to get block payload for the first chain (0), the request is `GET /chain/0/payload/batch`.

### Request body schema

Use an array of payload hash strings and an array of block heights in a JSON object to specify the payloads you want to include in your batch request.

| Parameter | Type | Description
| --------- | ---- | -----------
| hashes | Array of strings | Specifies the block payload hashes to include in the query request. Each block payload hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the [a-zA-Z0-9_-] character set. For example: `GpaWbHkHrCjRhY8hKE0qZ1WsBBaG3Y_zkFLV2sYumQA`.
| heights | Array of integers | Specifies the block heights to include in the request.

For example, a batch query request with a payload hash array for two payloads would look similar to the following::

```json
{
    "hashes": [
        "KBs8f6_ZK2UKDQRpEwNcm5I5c1HHW1SfOmwzOVVU9ic","vVNA0B3LmES4gOP5iLE4e4R2eslwQvBzAmhFhuThZRs"],
    "heights" : [4460669,4460682,4460694]
}
```

### Responses

Requests to `/chain/{chain}/payload` can return the following response codes:

- **200 OK** indicates that the request succeeded and returns some or all of the requested block payloads. The payloads may be returned in any order.
- **404 Not Found** indicates that the payload hash wasn't found.

#### Response header

The response header parameters are the same for successful and unsuccessful requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr	| string | Specifies the host address and port number of the client as observed by the remote chainweb node in the format ^\d{4}.\d{4}.\d{4}.\d{4}:\d+$. For example: `"10.36.1.3:42988"`.
| x-server-timestamp | integer >= 0 | Specifies the clock time of the remote chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x-chainweb-node-version	| string | Specifies the version of the remote chainweb node. For example: `"2.23"`.

#### Successful response schema

If the request is successful, the response returns `application/json` content with the following:

| Parameter | Type | Description
| --------- | ---- | -----------
| transactions (required) | Array of strings | An array of Base64Url-encoded strings—without padding—that describe signed Pact transactions in JSON format.
| minerData (required) | string | Miner information is a Base64Url-encoded string—without padding—that consists of characters from the [a-zA-Z0-9_-] character set.This information is included as part of the payload JSON object.
| transactionsHash (required) | string | The transaction hash is a SHA256 hash. The hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the [a-zA-Z0-9_-] character set.
| outputsHash (required) | string | The output hash is a SHA256 hash. The hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the [a-zA-Z0-9_-] character set.
| payloadHash (required) | string | The block payload hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the [a-zA-Z0-9_-] character set.

For example, a successful response with two payloads looks similar to the following:

```json
{
  "value": [
    {
      "transactions": [],
      "minerData": "eyJhY2NvdW50IjoiYTFiMzE0MGNiN2NjODk1YzBlMDkxNzAyZWQwNTU3OWZiZTA1YzZlNjc0NWY4MmNlNjAzNzQ2YjQwMGM4MTU0OCIsInByZWRpY2F0ZSI6ImtleXMtYWxsIiwicHVibGljLWtleXMiOlsiYTFiMzE0MGNiN2NjODk1YzBlMDkxNzAyZWQwNTU3OWZiZTA1YzZlNjc0NWY4MmNlNjAzNzQ2YjQwMGM4MTU0OCJdfQ",
      "transactionsHash": "nT0j4xw2woMkdXXaopdurXIn24OG-jNMqQzUGfxV_MA",
      "outputsHash": "4pXRrZ2K0_V0iGAxQCKrKdLjQTBZHBOQS7P-47kdnhY",
      "payloadHash": "GpaWbHkHrCjRhY8hKE0qZ1WsBBaG3Y_zkFLV2sYumQA"
    },
    {
      "transactions": [
        "eyJoYXNoIjoiMi16Q3dmRFZZR010WHljd2pTLXRlNzh5U3l3T3JXcjNSdUhiQlJnNDdhRSIsInNpZ3MiOlt7InNpZyI6ImZiMTVkNzkyYTNkNDM1MDI5ODJmOGQ1MGUyMzA1NTI5OWEwZjdhMWRmMWE4YjUyMmE5NTMxNWUyZDljY2MyNmE1MzI4M2I5YTNhNDM5ZWE0ZGY4MGM1ZTIwMjg4NDhjNjFhMWY0MGM5OWIyOTYzOWM0NGNkYTgwMzBmYmViYjBjIn1dLCJjbWQiOiJ7XCJuZXR3b3JrSWRcIjpcIm1haW5uZXQwMVwiLFwicGF5bG9hZFwiOntcImV4ZWNcIjp7XCJkYXRhXCI6e30sXCJjb2RlXCI6XCIoY29pbi50cmFuc2ZlciBcXFwiZTc1NzU4ZGQyYTFjNTk2NDRjMjJlMDQyYzZlYzA3NTI2ZWE0ZTU3MTU0ZjlkYmMyMDc2ZThhODRhYzE5NGYzMlxcXCIgXFxcIjQ2NzdhMDllYTE2MDJlNGUwOWZlMDFlYjExOTZjZjQ3YzBmNDRhYTQ0YWFjOTAzZDVmNjFiZTdkYTM0MjUxMjhcXFwiIDMuNzc2KVwifX0sXCJzaWduZXJzXCI6W3tcInB1YktleVwiOlwiZTc1NzU4ZGQyYTFjNTk2NDRjMjJlMDQyYzZlYzA3NTI2ZWE0ZTU3MTU0ZjlkYmMyMDc2ZThhODRhYzE5NGYzMlwiLFwiY2xpc3RcIjpbe1wiYXJnc1wiOltdLFwibmFtZVwiOlwiY29pbi5HQVNcIn0se1wiYXJnc1wiOltcImU3NTc1OGRkMmExYzU5NjQ0YzIyZTA0MmM2ZWMwNzUyNmVhNGU1NzE1NGY5ZGJjMjA3NmU4YTg0YWMxOTRmMzJcIixcIjQ2NzdhMDllYTE2MDJlNGUwOWZlMDFlYjExOTZjZjQ3YzBmNDRhYTQ0YWFjOTAzZDVmNjFiZTdkYTM0MjUxMjhcIiwzLjc3Nl0sXCJuYW1lXCI6XCJjb2luLlRSQU5TRkVSXCJ9XX1dLFwibWV0YVwiOntcImNyZWF0aW9uVGltZVwiOjE2MDIzODI4MTQsXCJ0dGxcIjoyODgwMCxcImdhc0xpbWl0XCI6NjAwLFwiY2hhaW5JZFwiOlwiMFwiLFwiZ2FzUHJpY2VcIjoxLjBlLTUsXCJzZW5kZXJcIjpcImU3NTc1OGRkMmExYzU5NjQ0YzIyZTA0MmM2ZWMwNzUyNmVhNGU1NzE1NGY5ZGJjMjA3NmU4YTg0YWMxOTRmMzJcIn0sXCJub25jZVwiOlwiXFxcIjIwMjAtMTAtMTFUMDI6MjE6MTQuMTk0WlxcXCJcIn0ifQ"
      ],
      "minerData": "eyJhY2NvdW50IjoiYTFiMzE0MGNiN2NjODk1YzBlMDkxNzAyZWQwNTU3OWZiZTA1YzZlNjc0NWY4MmNlNjAzNzQ2YjQwMGM4MTU0OCIsInByZWRpY2F0ZSI6ImtleXMtYWxsIiwicHVibGljLWtleXMiOlsiYTFiMzE0MGNiN2NjODk1YzBlMDkxNzAyZWQwNTU3OWZiZTA1YzZlNjc0NWY4MmNlNjAzNzQ2YjQwMGM4MTU0OCJdfQ",
      "transactionsHash": "lWcQRlj3MV7FSem8P4G-8GMRf1-O7zQqi_AwmWnk-N0",
      "outputsHash": "9BzXZbhjSSevp4K0bYFqi1GdLjeX_DB-4u1T5Em8abs",
      "payloadHash": "jcQOWz7K9qKnkUv4Z883D2ZjkFFGgccoSroWGaoogLM"
    }
  ]
}
```

If there are no payoads matching your query request, the endpoint returns an empty array.

## Get block payload with outputs

Use `GET /chain/{chain}/payload/{payloadHash}/outputs` to get payload data with output.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain (required) | integer >= 0 | Specifies the chain identifier of the chain you want to send the payload request to. Valid values are 0 to 19. For example, to get block payload for the first chain (0), the request is `GET /chain/0/payload/{payloadHash}/outputs`.
| payloadHash (required) | string | The block payload hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the [a-zA-Z0-9_-] character set. For example: `GpaWbHkHrCjRhY8hKE0qZ1WsBBaG3Y_zkFLV2sYumQA`.

### Query parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| height | integer >= 0 | Height of a block. For example: `height=3000000`.

### Responses

Requests to `/chain/{chain}/payload/{payloadhash}/outputs` can return the following response codes:

- **200 OK** indicates that the request succeeded and returns the payload data and output for the specified payload hash. 
- **404 Not Found** indicates that the payload hash wasn't found.

#### Response header

The response header parameters are the same for successful and unsuccessful requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr	| string | Specifies the host address and port number of the client as observed by the remote chainweb node in the format ^\d{4}.\d{4}.\d{4}.\d{4}:\d+$. For example: `"10.36.1.3:42988"`.
| x-server-timestamp | integer >= 0 | Specifies the clock time of the remote chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x-chainweb-node-version	| string | Specifies the version of the remote chainweb node. For example: `"2.23"`.

#### Successful response schema

If the request is successful, the response returns `application/json` content with the following:

| Parameter | Type | Description
| --------- | ---- | -----------
| transactions (required) | Array of strings | An array of Base64Url-encoded strings—without padding—that describe signed Pact transactions in JSON format.
| minerData (required) | string | Miner information is a Base64Url-encoded string—without padding—that consists of characters from the [a-zA-Z0-9_-] character set.This information is included as part of the payload JSON object.
| transactionsHash (required) | string | The transaction hash is a SHA256 hash. The hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the [a-zA-Z0-9_-] character set.
| outputsHash (required) | string | The output hash is a SHA256 hash. The hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the [a-zA-Z0-9_-] character set.
| payloadHash (required) | string | The block payload hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the [a-zA-Z0-9_-] character set.
| coinbase (required) | string | Coinbase output is a Base64Url-encoded string—without padding—that consists of characters from the [a-zA-Z0-9_-] character set. This information is included as part of the payload output JSON object.

For example, a successful response looks similar to the following::

```json
{
  "value": {
    "transactions": [
      [
        "eyJoYXNoIjoiMi16Q3dmRFZZR010WHljd2pTLXRlNzh5U3l3T3JXcjNSdUhiQlJnNDdhRSIsInNpZ3MiOlt7InNpZyI6ImZiMTVkNzkyYTNkNDM1MDI5ODJmOGQ1MGUyMzA1NTI5OWEwZjdhMWRmMWE4YjUyMmE5NTMxNWUyZDljY2MyNmE1MzI4M2I5YTNhNDM5ZWE0ZGY4MGM1ZTIwMjg4NDhjNjFhMWY0MGM5OWIyOTYzOWM0NGNkYTgwMzBmYmViYjBjIn1dLCJjbWQiOiJ7XCJuZXR3b3JrSWRcIjpcIm1haW5uZXQwMVwiLFwicGF5bG9hZFwiOntcImV4ZWNcIjp7XCJkYXRhXCI6e30sXCJjb2RlXCI6XCIoY29pbi50cmFuc2ZlciBcXFwiZTc1NzU4ZGQyYTFjNTk2NDRjMjJlMDQyYzZlYzA3NTI2ZWE0ZTU3MTU0ZjlkYmMyMDc2ZThhODRhYzE5NGYzMlxcXCIgXFxcIjQ2NzdhMDllYTE2MDJlNGUwOWZlMDFlYjExOTZjZjQ3YzBmNDRhYTQ0YWFjOTAzZDVmNjFiZTdkYTM0MjUxMjhcXFwiIDMuNzc2KVwifX0sXCJzaWduZXJzXCI6W3tcInB1YktleVwiOlwiZTc1NzU4ZGQyYTFjNTk2NDRjMjJlMDQyYzZlYzA3NTI2ZWE0ZTU3MTU0ZjlkYmMyMDc2ZThhODRhYzE5NGYzMlwiLFwiY2xpc3RcIjpbe1wiYXJnc1wiOltdLFwibmFtZVwiOlwiY29pbi5HQVNcIn0se1wiYXJnc1wiOltcImU3NTc1OGRkMmExYzU5NjQ0YzIyZTA0MmM2ZWMwNzUyNmVhNGU1NzE1NGY5ZGJjMjA3NmU4YTg0YWMxOTRmMzJcIixcIjQ2NzdhMDllYTE2MDJlNGUwOWZlMDFlYjExOTZjZjQ3YzBmNDRhYTQ0YWFjOTAzZDVmNjFiZTdkYTM0MjUxMjhcIiwzLjc3Nl0sXCJuYW1lXCI6XCJjb2luLlRSQU5TRkVSXCJ9XX1dLFwibWV0YVwiOntcImNyZWF0aW9uVGltZVwiOjE2MDIzODI4MTQsXCJ0dGxcIjoyODgwMCxcImdhc0xpbWl0XCI6NjAwLFwiY2hhaW5JZFwiOlwiMFwiLFwiZ2FzUHJpY2VcIjoxLjBlLTUsXCJzZW5kZXJcIjpcImU3NTc1OGRkMmExYzU5NjQ0YzIyZTA0MmM2ZWMwNzUyNmVhNGU1NzE1NGY5ZGJjMjA3NmU4YTg0YWMxOTRmMzJcIn0sXCJub25jZVwiOlwiXFxcIjIwMjAtMTAtMTFUMDI6MjE6MTQuMTk0WlxcXCJcIn0ifQ",
        "eyJnYXMiOjU3MiwicmVzdWx0Ijp7InN0YXR1cyI6InN1Y2Nlc3MiLCJkYXRhIjoiV3JpdGUgc3VjY2VlZGVkIn0sInJlcUtleSI6IjItekN3ZkRWWUdNdFh5Y3dqUy10ZTc4eVN5d09yV3IzUnVIYkJSZzQ3YUUiLCJsb2dzIjoiSU1ra1VFZmVGak45bFQxZ0gtX2ZNT1dDRklrU1d6aVNTZHF2eEo4dS16RSIsIm1ldGFEYXRhIjpudWxsLCJjb250aW51YXRpb24iOm51bGwsInR4SWQiOjEyNzIzNzJ9"
      ]
    ],
    "minerData": "eyJhY2NvdW50IjoiYTFiMzE0MGNiN2NjODk1YzBlMDkxNzAyZWQwNTU3OWZiZTA1YzZlNjc0NWY4MmNlNjAzNzQ2YjQwMGM4MTU0OCIsInByZWRpY2F0ZSI6ImtleXMtYWxsIiwicHVibGljLWtleXMiOlsiYTFiMzE0MGNiN2NjODk1YzBlMDkxNzAyZWQwNTU3OWZiZTA1YzZlNjc0NWY4MmNlNjAzNzQ2YjQwMGM4MTU0OCJdfQ",
    "transactionsHash": "lWcQRlj3MV7FSem8P4G-8GMRf1-O7zQqi_AwmWnk-N0",
    "outputsHash": "9BzXZbhjSSevp4K0bYFqi1GdLjeX_DB-4u1T5Em8abs",
    "payloadHash": "jcQOWz7K9qKnkUv4Z883D2ZjkFFGgccoSroWGaoogLM",
    "coinbase": "eyJnYXMiOjAsInJlc3VsdCI6eyJzdGF0dXMiOiJzdWNjZXNzIiwiZGF0YSI6IldyaXRlIHN1Y2NlZWRlZCJ9LCJyZXFLZXkiOiJJbkV4WDFkUk16SnliRmhCWW1KcU9WTnZkMXB2YmtabmNHRXdlRnBXUWtKdmNUWTJiRk0xY0RSQ1ZVVWkiLCJsb2dzIjoiSVc0N0QxTXFMVW9mRnNKbWpoWGdDZnhnb2Fzb0xTc05YZUFiOFRPb2NCNCIsIm1ldGFEYXRhIjpudWxsLCJjb250aW51YXRpb24iOm51bGwsInR4SWQiOjEyNzIzNzB9"
  }
}
```


{
    "transactions": [],
    "minerData": "eyJhY2NvdW50IjoiazpkYjc3Njc5M2JlMGZjZjhlNzZjNzViZGIzNWEzNmU2N2YyOTgxMTFkYzYxNDVjNjY2OTNiMDEzMzE5MmUyNjE2IiwicHJlZGljYXRlIjoia2V5cy1hbGwiLCJwdWJsaWMta2V5cyI6WyJkYjc3Njc5M2JlMGZjZjhlNzZjNzViZGIzNWEzNmU2N2YyOTgxMTFkYzYxNDVjNjY2OTNiMDEzMzE5MmUyNjE2Il19",
    "transactionsHash": "I_-6b6EVBALcY9dXb-i0h3Lv8r9W6C9BRhPBZ0tAcrs",
    "outputsHash": "5PMfYwhC8k3jkKVvbhDp5FbjvUgJh9vu1cSZO6hprMk",
    "payloadHash": "RjfmLEPJ-WScakB-c7GX6nib919OgG72rZHEJcryIlU",
    "coinbase": "eyJnYXMiOjAsInJlc3VsdCI6eyJzdGF0dXMiOiJzdWNjZXNzIiwiZGF0YSI6IldyaXRlIHN1Y2NlZWRlZCJ9LCJyZXFLZXkiOiJJbVEyU213Mk0zRXdZV05CV1UwM2VtVkhPVFpLUlVOM2NVcHNXSGRtVW5ORFRWRTNiRkJqUmxsTVNqUWkiLCJsb2dzIjoiMlZnUDBTMjRSaXlGTDZWeDl3TW03MzZFUmswRFA0bXVaQkRnY0VtdmYxRSIsImV2ZW50cyI6W3sicGFyYW1zIjpbIiIsIms6ZGI3NzY3OTNiZTBmY2Y4ZTc2Yzc1YmRiMzVhMzZlNjdmMjk4MTExZGM2MTQ1YzY2NjkzYjAxMzMxOTJlMjYxNiIsMC45OTczMjRdLCJuYW1lIjoiVFJBTlNGRVIiLCJtb2R1bGUiOnsibmFtZXNwYWNlIjpudWxsLCJuYW1lIjoiY29pbiJ9LCJtb2R1bGVIYXNoIjoia2xGa3JMZnB5TFctTTN4alZQU2RxWEVNZ3hQUEppYlJ0X0Q2cWlCd3M2cyJ9XSwibWV0YURhdGEiOm51bGwsImNvbnRpbnVhdGlvbiI6bnVsbCwidHhJZCI6NDM1NzI4MX0"
}

#### Not found response schema

If there are no results matching the request criteria, the response returns the 404 response code with content similar to the following:

```json
{
  "reason": "key not found",
  "key": "k1H3DsInAPvJ0W_zPxnrpkeSNdPUT0S9U8bqDLG739w"
}
```

## Get batch of block payload with outputs

Use `POST /chain/{chain}/payload/outputs/batch` to request multiple block payloads with output in a batch.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain (required) | integer >= 0 | Specifies the chain identifier of the chain you want to get the payload from. Valid values are 0 to 19. For example, to get block payload for the first chain (0), the request is `GET /chain/0/payload/outputs/batch`.

### Request body schema

Use an array of payload hash strings in a JSON object to specify the payloads you want to include in your batch request, with or without heights.

| Parameter | Type | Description
| --------- | ---- | -----------
| hashes (required) | Array of strings | Each block payload hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the [a-zA-Z0-9_-] character set. For example: `GpaWbHkHrCjRhY8hKE0qZ1WsBBaG3Y_zkFLV2sYumQA`.
| heights (required) | Array of integers | Specifies the block heights to include in the request.

For example, a batch query request with a payload hash array for two payloads would look similar to the following::

```json
{
    "hashes": ["nrPYG6PSkE40eYuf4LLrPFRADp2Uq7EI9d4OOIqeOMs", "OnnBJzL7-m8jvhofERC2EVa6awCuJYGNZwvNaVZuv68"],
    "heights": [4953900, 4953901, 4953902, 4953903, 4953904]
}
```

### Responses

Requests to `/chain/{chain}/payload/outputs/batch` can return the following response codes:

- **200 OK** indicates that the request succeeded and returns some or all of the requested block payloads. The payloads may be returned in any order.
- **404 Not Found** indicates that the payload hash wasn't found.

#### Response header

The response header parameters are the same for successful and unsuccessful requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr	| string | Specifies the host address and port number of the client as observed by the remote chainweb node in the format ^\d{4}.\d{4}.\d{4}.\d{4}:\d+$. For example: `"10.36.1.3:42988"`.
| x-server-timestamp | integer >= 0 | Specifies the clock time of the remote chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x-chainweb-node-version	| string | Specifies the version of the remote chainweb node. For example: `"2.23"`.

#### Successful response schema

If the request is successful, the response returns `application/json` content with the following:

| Parameter | Type | Description
| --------- | ---- | -----------
| transactions (required) | Array of strings | An array of Base64Url-encoded strings—without padding—that describe signed Pact transactions in JSON format.
| minerData (required) | string | Miner information is a Base64Url-encoded string—without padding—that consists of characters from the [a-zA-Z0-9_-] character set.This information is included as part of the payload JSON object.
| transactionsHash (required) | string | The transaction hash is a SHA256 hash. The hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the [a-zA-Z0-9_-] character set.
| outputsHash (required) | string | The output hash is a SHA256 hash. The hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the [a-zA-Z0-9_-] character set.
| payloadHash (required) | string | The block payload hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the [a-zA-Z0-9_-] character set.
| coinbase (required) | string | Coinbase output is a Base64Url-encoded string—without padding—that consists of characters from the [a-zA-Z0-9_-] character set. This information is included as part of the payload output JSON object.
<!--
For example, a successful response looks similar to the following::

```json
{
  "value": [
    {
      "$ref": "#/components/examples/emptyPayload"
    },
    {
      "$ref": "#/components/examples/payloadWithTransactions"
    }
  ]
}
```
-->
