---
title: Block endpoints
description:
  Provides reference information for the chainweb-node service API block endpoints.
menu: Chainweb API
label: Block service endpoints
order: 2
layout: full
tags: ['chainweb', 'node api', 'chainweb api', 'api reference']
---

# Block service endpoints

Block service API endpoints return whole blocks—headers and payloads—from the chain database.
Generally, blocks are returned in **ascending** order and include orphaned blocks.

If you only want to query blocks that are included in the winning branch of the chain, you can call the `branch` endpoints.
Branch endpoints return blocks in **descending** order starting from the leafs of branches of the block chain.

Blocks are returned in only one format, with block headers and payloads in JSON encoding.

## Get whole blocks

Use GET The blocks are returned in ascending order.
All blocks that match the criteria are returned from the chain database, including orphaned blocks.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the chain identifier of the chain you want to send the request to. Valid values are 0 to 19. For example, to get block hashes for the first chain (0), the request is `GET http://{baseURL}/chain/0/block`.

### Query parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| limit | integer&nbsp;>=&nbsp;0 | Specifies the maximum number of records that should be returned. The actual number of records returned might be lower than the value you specify. For example: `limit=3`.
| next | string | Specifies the cursor value to retrieve the next page of results. You can find the value to specify in the `next` property returned by the previous page in a successful response. For example: `"inclusive:qgsxD1G5m8dGZ4W9nMKBotU2I10ilURkRIE3_UKHlLM"`.
| minheight	| integer&nbsp;>=&nbsp;0 | Specifies the minimum block height for the blocks to return. For example: `minheight=4471908`.
| maxheight | integer&nbsp;>=&nbsp;0 | Specifies the maximum block height for the blocks to return. For example: `maxheight=4953816`.

### Responses

Requests to `GET http://{baseURL}/chain/{chain}/block` can return the following response codes:

- **200 OK** indicates that the request succeeded. The response body includes all of the blocks matching the criteria specified, including any orphaned blocks.
- **404 Not Found** indicates that no blocks matching the request criteria were found or that the `next` or `maxheight` parameter wasn't valid.

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
| items&nbsp;(required) | Array&nbsp;of&nbsp;objects | Returns an array of JSON-encoded objects representing full blocks. 
| limit&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the maximum number of items in the page. This number can be smaller but never larger than the number of requested items.
| next&nbsp;(required) | string&nbsp;or&nbsp;null | Returns a value that can be used to query the next page. You can use this value for the `next` parameter in a follow-up request. The format for this parameter consists of two parts. The first part of the string can be `inclusive`, `exclusive` or null. The second part is the value that calls the next page of results or null if there are no more results to query.

### Examples

You can send a request to the Kadena main network—mainnet01—and chain 19 by calling the main network service endpoint like this:

```Postman
GET http://api.chainweb.com/chainweb/0.0/mainnet01/chain/19/block?limit=1
```

This request returns one whole block in the response body:

```json
{
    "limit": 1,
    "items": [
        {
            "header": {
                "nonce": "0",
                "creationTime": 1572393660000000,
                "parent": "az5Y9U7gziz1nghnTMCR9pqZHApM5bqoqoU-PhWdrCU",
                "adjacents": {
                    "18": "uNzV6l3JEfRSbG8xI-W7dexgUR3RRbdpDzdfrJKyaZ8",
                    "4": "Ou6kxMXpuwpm9uiIVhiEFHSbTdhanjHyiEh2G0EZV_w",
                    "10": "QGPuG9FMAW15eqGOWSGcDna32l8oBnYFmvVBwHFNrg4"
                },
                "target": "MKiv2H1xBe7jlMF0WdiNF7m1HaJb6Uvec8sAAAAAAAA",
                "payloadHash": "i-MN4AoxsaPds4M_MzwNSUygAkGnPZoCDvahfckowt4",
                "chainId": 19,
                "weight": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                "height": 852054,
                "chainwebVersion": "mainnet01",
                "epochStart": 1572393660000000,
                "featureFlags": 0,
                "hash": "y76dr78dPJlFDMPzCc-aEz97iRyimv5Ij3psdVlC64c"
            },
            "payloadWithOutputs": {
                "transactions": [
                    [
                        "eyJnYXMiOjAsInJlc3VsdCI6eyJzdGF0dXMiOiJzdWNjZXNzIiwiZGF0YSI6IkxvYWRlZCBpbnRlcmZhY2UgZnVuZ2libGUtdjEifSwicmVxS2V5IjoiNDhUMExqQW5TRnBGV3h2dmFQVi1fNkUtQ2pEQVBoV1lVRldidnlmMmxGcyIsImxvZ3MiOiJRRmEyOHRuOXkydFdMVzdUc3lHdzNOTkhpYzhxYjJ6UGtudXRpWWhnQXc4IiwibWV0YURhdGEiOm51bGwsImNvbnRpbnVhdGlvbiI6bnVsbCwidHhJZCI6MH0"
                    ],
                    [
                        "eyJoYXNoIjoiQnVWLWZGSjRtMTAtWHYxMjZKcDlCaGtBenpCS3RBZFNjTU5PRjBQZDZxYyIsInNpZ3MiOltdLCJjbWQiOiJ7XCJuZXR3b3JrSWRcIjpudWxsLFwicGF5bG9hZFwiOntcImV4ZWNcIjp7XCJkYXRhXCI6e1wia2FkLW9wcy0yMFwiOntcInByZWRcIjpcImtleXMtYW55XCIsXCJrZXlzXCI6W1wiZTdmNzYzNGU5MjU1NDFmMzY4YjgyN2FkNWM3MjQyMTkwNTEwMGY2MjA1Mjg1YTc4YzE5ZDdiNGEzODcxMTgwNVwiLFwiYmUyMjlmNGE5NzVlNDQxZGM2OTRkZWQwZTkyNjBkOTkzMjcwMTI4NzAyZmY1YTVhZjdiZWQyZTQyYzk1Y2UwOVwiLFwiOWE0ODQ5Njg3Y2JjZmViMWY3YzY1MTA1Mzk2MzhkYTU3NjI4OTUwOGFlZGNjNzVmNGQ2YWQzZWQyNjIzNjM1Y1wiXX19LFwiY29kZVwiOlwiKGNvaW4uY29pbmJhc2UgXFxcIktBRF9PUFNfMjBcXFwiIChyZWFkLWtleXNldCBcXFwia2FkLW9wcy0yMFxcXCIpIDEwLjApXCJ9fSxcInNpZ25lcnNcIjpbXSxcIm1ldGFcIjp7XCJjcmVhdGlvblRpbWVcIjowLFwidHRsXCI6MTcyODAwLFwiZ2FzTGltaXRcIjowLFwiY2hhaW5JZFwiOlwiXCIsXCJnYXNQcmljZVwiOjAsXCJzZW5kZXJcIjpcIlwifSxcIm5vbmNlXCI6XCJtYWlubmV0LWdyYW50cy1rYWRvcHNcIn0ifQ",
                        "eyJnYXMiOjAsInJlc3VsdCI6eyJzdGF0dXMiOiJzdWNjZXNzIiwiZGF0YSI6IldyaXRlIHN1Y2NlZWRlZCJ9LCJyZXFLZXkiOiJCdVYtZkZKNG0xMC1YdjEyNkpwOUJoa0F6ekJLdEFkU2NNTk9GMFBkNnFjIiwibG9ncyI6IkxmMXlYSzdBVmd0VkJBOTlneWg2YWZYaU02dWVyZm9pcG8tYWZHZ3hmeUkiLCJtZXRhRGF0YSI6bnVsbCwiY29udGludWF0aW9uIjpudWxsLCJ0eElkIjo1fQ"
                    ]
                ],
                "minerData": "eyJhY2NvdW50IjoiTm9NaW5lciIsInByZWRpY2F0ZSI6IjwiLCJwdWJsaWMta2V5cyI6W119",
                "transactionsHash": "OKUjjXOvSUsmlOvBb_xfcJz_1zssIMFjFi8zktn4V5E",
                "outputsHash": "pfAZtwPF48paINSddff1ISBIlBeDyYBueknw9osHX4A",
                "payloadHash": "i-MN4AoxsaPds4M_MzwNSUygAkGnPZoCDvahfckowt4",
                "coinbase": "eyJnYXMiOjAsInJlc3VsdCI6eyJzdGF0dXMiOiJzdWNjZXNzIiwiZGF0YSI6Ik5PX0NPSU5CQVNFIn0sInJlcUtleSI6IkRsZFJ3Q2JsUTdMb3F5NndZSm5hb2RIbDMwZDNqM2VILXF0RnpmRXY0NmciLCJsb2dzIjpudWxsLCJtZXRhRGF0YSI6bnVsbCwiY29udGludWF0aW9uIjpudWxsLCJ0eElkIjpudWxsfQ"
            }
        }
    ],
    "next": "inclusive:1ETD2LKF_gmJ92-q1fqAJY2eZerhhZA2kLxM1BC5hKE"
}
```

## Get block branches

Use `POST http://{baseURL}/chain/{chain}/block/branch` to return blocks from branches of the block chain in descending order.
A request sent to this endpoint returns blocks that are ancestors of any block specified for the upper bounds and that are not ancestors of any block specified for the lower bounds.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the chain identifier of the chain you want to send the request to. Valid values are 0 to 19. For example, to get block hashes for the first chain (0), the request is `GET http://{baseURL}/chain/0/block/branch`.

### Query parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| limit | integer&nbsp;>=&nbsp;0 | Specifies the maximum number of records that should be returned. The actual number of records returned might be lower than the value you specify. For example: `limit=3`.
| next | string | Specifies the cursor value to retrieve the next page of results. You can find the value to specify in the `next` property returned by the previous page in a successful response. For example: `"inclusive:qgsxD1G5m8dGZ4W9nMKBotU2I10ilURkRIE3_UKHlLM"`.
| minheight	| integer&nbsp;>=&nbsp;0 | Specifies the minimum block height for the blocks to return. For example: `minheight=4471908`.
| maxheight | integer&nbsp;>=&nbsp;0 | Specifies the maximum block height for the blocks to return. For example: `maxheight=4953816`.

### Request body schema

Use the following parameters to specify the upper and lower bounds for the queried branches.

| Parameter | Type | Description
| --------- | ---- | -----------
| lower	| Array&nbsp;of&nbsp;strings | Specifies the lower bound for the query. No block hashes are returned that are predecessors of any block with a hash from this array. Each block hash consists of 43 characters from the `a-zA-Z0-9_-` character set.
| upper | Array of strings | Specifies the upper bound for the query. All returned block hashes are predecessors of a block with an hash from this array. Each block hash consists of 43 characters from the `a-zA-Z0-9_-` character set.

### Responses

Requests to `GET http://{baseURL}/chain/{chain}/block/branch` can return the following response codes:

- **200 OK** indicates that the request succeeded. The response body includes all of the blocks matching the criteria specified.
- **400 Bad Request** indicates that the branch bounds were exceeded.
- **404 Not Found** indicates that no blocks matching the request criteria were found or that the `next` or `maxheight` parameter wasn't valid.
- **406 Not Acceptable** indicates that the endpoint can't generate content in the format specified by the Accept header.

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
| items&nbsp;(required) | Array&nbsp;of&nbsp;objects | Returns an array of JSON-encoded objects representing full blocks. 
| limit&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the maximum number of items in the page. This number can be smaller but never larger than the number of requested items.
| next&nbsp;(required) | string&nbsp;or&nbsp;null | Returns a value that can be used to query the next page. You can use this value for the `next` parameter in a follow-up request. The format for this parameter consists of two parts. The first part of the string can be `inclusive`, `exclusive` or null. The second part is the value that calls the next page of results or null if there are no more results to query.

### Examples

You can send a request to the Kadena main network—mainnet01—and chain 19 by calling the main network service endpoint like this:

```Postman
POST http://api.chainweb.com/chainweb/0.0/mainnet01/chain/19/block/branch?limit=1
```

In this example, the request returns the ancestors for a specific upper bound:

```json
{
    "lower": [ ],
    "upper": ["y76dr78dPJlFDMPzCc-aEz97iRyimv5Ij3psdVlC64c"]
}
```

This request returns a whole block similar to the following excerpt:

```json
{
    "limit": 1,
    "items": [
        {
            "header": {
                "nonce": "0",
                "creationTime": 1572393660000000,
                "parent": "az5Y9U7gziz1nghnTMCR9pqZHApM5bqoqoU-PhWdrCU",
                "adjacents": {
                    "18": "uNzV6l3JEfRSbG8xI-W7dexgUR3RRbdpDzdfrJKyaZ8",
                    "4": "Ou6kxMXpuwpm9uiIVhiEFHSbTdhanjHyiEh2G0EZV_w",
                    "10": "QGPuG9FMAW15eqGOWSGcDna32l8oBnYFmvVBwHFNrg4"
                },
                "target": "MKiv2H1xBe7jlMF0WdiNF7m1HaJb6Uvec8sAAAAAAAA",
                "payloadHash": "i-MN4AoxsaPds4M_MzwNSUygAkGnPZoCDvahfckowt4",
                "chainId": 19,
                "weight": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                "height": 852054,
                "chainwebVersion": "mainnet01",
                "epochStart": 1572393660000000,
                "featureFlags": 0,
                "hash": "y76dr78dPJlFDMPzCc-aEz97iRyimv5Ij3psdVlC64c"
            },
            "payloadWithOutputs": {
                "transactions": [
                    [
                        "eyJoYXNoIjoiQnVWLWZGSjRtMTAtWHYxMjZKcDlCaGtBenpCS3RBZFNjTU5PRjBQZDZxYyIsInNpZ3MiOltdLCJjbWQiOiJ7XCJuZXR3b3JrSWRcIjpudWxsLFwicGF5bG9hZFwiOntcImV4ZWNcIjp7XCJkYXRhXCI6e1wia2FkLW9wcy0yMFwiOntcInByZWRcIjpcImtleXMtYW55XCIsXCJrZXlzXCI6W1wiZTdmNzYzNGU5MjU1NDFmMzY4YjgyN2FkNWM3MjQyMTkwNTEwMGY2MjA1Mjg1YTc4YzE5ZDdiNGEzODcxMTgwNVwiLFwiYmUyMjlmNGE5NzVlNDQxZGM2OTRkZWQwZTkyNjBkOTkzMjcwMTI4NzAyZmY1YTVhZjdiZWQyZTQyYzk1Y2UwOVwiLFwiOWE0ODQ5Njg3Y2JjZmViMWY3YzY1MTA1Mzk2MzhkYTU3NjI4OTUwOGFlZGNjNzVmNGQ2YWQzZWQyNjIzNjM1Y1wiXX19LFwiY29kZVwiOlwiKGNvaW4uY29pbmJhc2UgXFxcIktBRF9PUFNfMjBcXFwiIChyZWFkLWtleXNldCBcXFwia2FkLW9wcy0yMFxcXCIpIDEwLjApXCJ9fSxcInNpZ25lcnNcIjpbXSxcIm1ldGFcIjp7XCJjcmVhdGlvblRpbWVcIjowLFwidHRsXCI6MTcyODAwLFwiZ2FzTGltaXRcIjowLFwiY2hhaW5JZFwiOlwiXCIsXCJnYXNQcmljZVwiOjAsXCJzZW5kZXJcIjpcIlwifSxcIm5vbmNlXCI6XCJtYWlubmV0LWdyYW50cy1rYWRvcHNcIn0ifQ",
                        "eyJnYXMiOjAsInJlc3VsdCI6eyJzdGF0dXMiOiJzdWNjZXNzIiwiZGF0YSI6IldyaXRlIHN1Y2NlZWRlZCJ9LCJyZXFLZXkiOiJCdVYtZkZKNG0xMC1YdjEyNkpwOUJoa0F6ekJLdEFkU2NNTk9GMFBkNnFjIiwibG9ncyI6IkxmMXlYSzdBVmd0VkJBOTlneWg2YWZYaU02dWVyZm9pcG8tYWZHZ3hmeUkiLCJtZXRhRGF0YSI6bnVsbCwiY29udGludWF0aW9uIjpudWxsLCJ0eElkIjo1fQ"
                    ]
                ],
                "minerData": "eyJhY2NvdW50IjoiTm9NaW5lciIsInByZWRpY2F0ZSI6IjwiLCJwdWJsaWMta2V5cyI6W119",
                "transactionsHash": "OKUjjXOvSUsmlOvBb_xfcJz_1zssIMFjFi8zktn4V5E",
                "outputsHash": "pfAZtwPF48paINSddff1ISBIlBeDyYBueknw9osHX4A",
                "payloadHash": "i-MN4AoxsaPds4M_MzwNSUygAkGnPZoCDvahfckowt4",
                "coinbase": "eyJnYXMiOjAsInJlc3VsdCI6eyJzdGF0dXMiOiJzdWNjZXNzIiwiZGF0YSI6Ik5PX0NPSU5CQVNFIn0sInJlcUtleSI6IkRsZFJ3Q2JsUTdMb3F5NndZSm5hb2RIbDMwZDNqM2VILXF0RnpmRXY0NmciLCJsb2dzIjpudWxsLCJtZXRhRGF0YSI6bnVsbCwiY29udGludWF0aW9uIjpudWxsLCJ0eElkIjpudWxsfQ"
            }
        }
    ],
    "next": null
}
```
