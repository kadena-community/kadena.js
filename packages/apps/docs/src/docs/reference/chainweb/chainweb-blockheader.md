---
title: Block header endpoints
description:
  Provides reference information for the chainweb-node block header endpoints.
menu: Chainweb API
label: Block header endpoints
order: 2
layout: full
tags: ['chainweb', 'node api', 'chainweb api', 'api reference', 'block header']
---

# Block header endpoints

Block header endpoints return block headers from the chain database.
Similar to the block service and block hash endpoints, block headers are generally returned in ascending order and include headers of orphaned blocks.

If you only want to query for blocks that are included in the canonical branch of the chain, you can use the `/branch` endpoint.
The `/branch` endpoint returns blocks in descending order starting from the leafs of branches of the block chain.

Block headers are returned in three different formats depending on the content type specified in the Accept header of the request:

- `application/json` returns block headers in as a base64Url-encoded strings without padding.
- `application/json;blockheader-encoding=object` returns block headers as JSON-encoded objects.
- `application/octet-stream` returns block headers as binary data if supported by the endpoint.

## Get block headers

Use `GET http://{baseURL}/chain/{chain}/header` to get block headers for the specified chain.
This call returns a collection of block headers in ascending order that satisfies the query parameters. 
All block headers that match the query criteria are returned from the chain database, including headers for orphaned blocks.

### Path parameters

| Parameter | Type | Description
| :--------- | :---- | :-----------
| chain&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the chain identifier of the chain you want to send the request to. Valid values are 0 to 19. For example, to get block headers for the first chain (0), the request is `GET http://{baseURL}/chain/0/header`.

### Query parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| limit | integer&nbsp;>=&nbsp;0 | Specifies the maximum number of records that should be returned. The actual number of records returned might be lower than the limit you set. For example: `limit=3`.
| next | string | Specifies the cursor to retrieve the next page of results. This value can be found as the value of the next property of the previous page. For example: `"inclusive:qgsxD1G5m8dGZ4W9nMKBotU2I10ilURkRIE3_UKHlLM"`.
| minheight	| integer&nbsp;>=&nbsp;0 | Specifies the minimum block height for the returned headers. For example: `minheight=4471908`.
| maxheight | integer&nbsp;>=&nbsp;0 | Specifies the maximum block height for the returned headers. For example: `maxheight=4953816`.

### Responses

Requests to `http://{baseURL}/chain/{chain}/header` return the following response codes:

- **200 OK** indicates that the request succeeded and returns a collection of block headers in **ascending** order. 
  All block headers that match the specified criteria are returned from the chain database, including headers for orphaned blocks.
- **404 Not Found** indicates that the `next` or `maxheight` parameter specifies a nonexistent block height.
- **406 Not Acceptable** indicates that the endpoint can't generate content in the format specified by the Accept header.

#### Response headers

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr | string | Specifies the host address and port number of the client as observed by the remote Chainweb node. The host address can be a domain name or an IP address in IPv4 or IPv6 format. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

#### Successful response schemas

The format of the information returned in the response depends on the content type specified in the Accept header of the request.

| Parameter | Type | Description
| --------- | ---- | -----------
| items&nbsp;(required) | Array&nbsp;of&nbsp;block&nbsp;headers | Returns an array of block headers as base64Url-encoded strings (`application/json`), JSON-encoded objects (`application/json;blockheader-encoding=object`), or a binary data stream (`application/octet-stream`, if supported).
| limit&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the number of items in the page. This number can be smaller but never be larger than the number of requested items.
| next&nbsp;(required) | string&nbsp;or&nbsp;null | Returns a cursor that can be used in a follow up request to query the next page. It should be used literally as the value for the `next` parameter in the follow-up request. It can be specified as inclusive or exclusive.

#### Not found response schema

If you specified `application/json` in the Accept header of the request and there are no results matching the request criteria, the response returns the following:

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| key | string | Specifies the base64Url-encoded block hash (without padding). The block hash consists of 43 characters from the `^[a-zA-Z0-9_-]{43}$` character set. |
| reason | string | Provides a placeholder for specifying the reason that no block headers were found. |

### Examples

You can send a request to the Kadena test network—testnet04—and chain 18 by calling the testnet service endpoint like this:

```Postman
GET http://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/18/header?limit=5
```

With the Accept header set to `application/json`, this request returns five items in the response body and each item is a base64Url-encoded string like this:

```json
{
    "limit": 5,
    "items": [
        "AAAAAAAAAAAIfWWp5I0FACxINuh5jyNOJ9Ty5BpWjH7nOcJNC4ascVq1RHEaS5T1AwADAAAA_rvcGOcdozdWaDSgaRFc_fK1n5v41BFIHF4Ji0RCGs4RAAAAb5qGjOICdYykrSpEbBSgAQDqJFEliNDBN-Bp9eyZw5kTAAAAdJruo-NqQ_vbBAP-sMWPuZNC3ehk2BIMawncfRFFdXc1kiSWlbrG6NI-tfeDKFcid_HE5LokOORb8ZsbAAAAAB1PmYXX7EAok638Y7W5K-TB5o6LpDreiDagdr7mIhd4EgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPBMFAAAAAAAHAAAACH1lqeSNBQAAAAAAAAAAAFbA3wN38oaSnT0filswQEZoeYbbgS50Hu2V3CyKYUms",
        "AAAAAAAAAACnVe9fhKsFAFbA3wN38oaSnT0filswQEZoeYbbgS50Hu2V3CyKYUmsAwADAAAA-nw1FP5zeHNTfxRXb4U7Z_IiExcRKgefyvIVhEBEF3ARAAAAtOerMVBv5NcJjh4c40W22FZ89poibtBlz-yQl4NM7lwTAAAAScaDZyeTNseqh6bdbG0bu_2BT83afeMrR9pxf68T8rw1kiSWlbrG6NI-tfeDKFcid_HE5LokOORb8ZsbAAAAANoTQUjcrRtfjAK0a8hc_oRTV1lvahJao40s6dnbmrR1EgAAAImntEUJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPRMFAAAAAAAHAAAACH1lqeSNBQAXGvYWMKPbAZPdgSp72jVyf9n9IawNW_JStBvp8LmEbQKa86PTswSj",
        "AAAAAAAAAACeppxmhKsFAJPdgSp72jVyf9n9IawNW_JStBvp8LmEbQKa86PTswSjAwADAAAAGfiTtZIOPkAZfgk9SF6Ri5Mty3ymlnbpxguTInfwuyERAAAAPLMckdi4615Uc-5qnL-uI_9QHrrDvkqP5vtGL3SnfGwTAAAARLK7tXaFwXh9JC_qMRSLQlUiLYV781yNQNYBhz1cGfI1kiSWlbrG6NI-tfeDKFcid_HE5LokOORb8ZsbAAAAAHxcyWdHz5kWWtGO3cUDYihBW1qFxrxgoNH1W0sBwZ8AEgAAABJPaYsSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPhMFAAAAAAAHAAAAp1XvX4SrBQCkvcyyiYdKAwdPQ5YCRqIO84OtNU6YWI2dybKXPASclW6PYATjBzpg",
        "AAAAAAAAAADgcapnhKsFAAdPQ5YCRqIO84OtNU6YWI2dybKXPASclW6PYATjBzpgAwADAAAAIvi7WXbV6o5HlKPSNWgNN3CdSaeYIgP23BAoSBucT_gRAAAATAJAFT7ZYf1ol4nIznTnhoQdG9PwKo5ZfhnAxbxPgqATAAAAvZfSTL7OYc912dvEAhpCBjQ7IGP74za9IHHmLgD49Y01kiSWlbrG6NI-tfeDKFcid_HE5LokOORb8ZsbAAAAAHesXvpjWbiPH_MwqlCOtihcQVcSdvLOdutoSuEQFCr5EgAAAJv2HdEbAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPxMFAAAAAAAHAAAAp1XvX4SrBQAy7ocBFa4RAGX0L4EevnQdIKnSPxZZYfFecQiw7cS7YdP8fqU58nyh",
        "AAAAAAAAAABqJjNrhKsFAGX0L4EevnQdIKnSPxZZYfFecQiw7cS7YdP8fqU58nyhAwADAAAADGVzBBRQHue9CWN2zwsfTR5t6qn2s64Ew9RA6eQy7vIRAAAASUBHlEIk97kFTiHDyS1upRDi2VAe-tgpKh3_bfK0boYTAAAAk9Oei1NEPxkvZoJUqhfrXqAE66QUdmw0uZ5SzYVdaSM1kiSWlbrG6NI-tfeDKFcid_HE5LokOORb8ZsbAAAAAE02n0jPaODQLeBQfN5ntrOw-oVAjJcx_wqtrrFDciDeEgAAACSe0hYlAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQBMFAAAAAAAHAAAAp1XvX4SrBQC_AS9h_w0AgGKAeHC4PMYNKXwiIHa7zV4NXA88HqdtEemDTfocbETG"
    ],
    "next": "inclusive:WHNaP_33KC47YeYCdwidTtc7qspkihlEikqT9_7TqAA"
}
```

With the Accept header set to `application/json;blockheader-encoding=object`, each item in the response body is a JSON-encoded object like this:

```json
{
    "limit": 1,
    "items": [
        {
            "nonce": "0",
            "creationTime": 1563388117613832,
            "parent": "LEg26HmPI04n1PLkGlaMfuc5wk0LhqxxWrVEcRpLlPU",
            "adjacents": {
                "17": "b5qGjOICdYykrSpEbBSgAQDqJFEliNDBN-Bp9eyZw5k",
                "19": "dJruo-NqQ_vbBAP-sMWPuZNC3ehk2BIMawncfRFFdXc",
                "3": "_rvcGOcdozdWaDSgaRFc_fK1n5v41BFIHF4Ji0RCGs4"
            },
            "target": "NZIklpW6xujSPrX3gyhXInfxxOS6JDjkW_GbGwAAAAA",
            "payloadHash": "HU-ZhdfsQCiTrfxjtbkr5MHmjoukOt6INqB2vuYiF3g",
            "chainId": 18,
            "weight": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "height": 332604,
            "chainwebVersion": "testnet04",
            "epochStart": 1563388117613832,
            "featureFlags": 0,
            "hash": "VsDfA3fyhpKdPR-KWzBARmh5htuBLnQe7ZXcLIphSaw"
        }
    ],
    "next": "inclusive:k92BKnvaNXJ_2f0hrA1b8lK0G-nwuYRtAprzo9OzBKM"
}
```

If there are no results matching the request criteria, the response body indicates the reason no results matching the request criteria were found. 
For example:

```json
{
  "key": "QxGCAz5AY1Y41nh1yWtgqhKhZ9pPiPRagFdIKNqBH7",
  "reason": "key not found"

}
```

## Get block header by hash

Use `GET http://{baseURL}/chain/{chain}/header/{blockHash}` to get a block header by using its hash.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the chain identifier of the chain you want to send the request to. Valid values are 0 to 19. For example, to get block headers for the first chain (0), the request is `GET http://{baseURL}/chain/0/header/{blockHash}`.
| blockHash&nbsp;(required) | string | Specifies the block hash of a block. The block hash consists of 43 characters from the `^[a-zA-Z0-9_-]{43}$` character set. For example: `k0an0qEORusqQg9ZjKrxa-0Bo0-hQVYLXqWi5LHxg3k`.

### Responses

Requests to `http://{baseURL}/chain/{chain}/header/{blockHash}` return the following response codes:

- **200 OK** indicates that the request succeeded and returns the block header matching the specified hash.
- **404 Not Found** indicates that no block header with the specified block hash was found.
- **406 Not Acceptable** indicates the endpoint can't generate content in the format specified by the Accept header.

#### Response headers

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr | string | Specifies the host address and port number of the client as observed by the remote Chainweb node. The host address can be a domain name or an IP address in IPv4 or IPv6 format. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

#### Successful response schemas

The format of the information returned in the response depends on the content type specified in the Accept header of the request.

#### Not found response schema

If you specified `application/json` in the Accept header of the request and there are no results matching the request criteria, the response returns the following:

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| key | string | Specifies the base64Url-encoded block hash (without padding). The block hash consists of 43 characters from the `^[a-zA-Z0-9_-]{43}$` character set. |
| reason | string | Provides a placeholder for specifying the reason that no block headers were found. |

### Examples

You can send a request to the Kadena main network—mainnet01—and chain 4 by calling the service endpoint like this:

```Postman
GET http://api.chainweb.com/chainweb/0.0/mainnet01/chain/4/header/tsFkxqNHy_WbdnDDTumV_2MFjMQTyJrzb8--dO3kjjM
```

With the Accept header set to `application/json`, this request returns the block header as a base64Url-encoded string without padding:

```text
"AAAAAAAAAACHrEs-Th0GAIPjfG2bsp6NK5D8iWUoRUM1OQ3p9q3stapX5Zybos80AwAJAAAAGXv0fxVXgDQTtRTxMjWfr6JXXrSscoaCaxEDPC93QIgOAAAAVosxlCQP8q0cPi3zd_yD_099Untb69bnIgIFlAioj9ITAAAAYlpdztdOQ-ChRklldcC2oHbZlAMIiYAGRgzTZBXvRgaKSm6dcl7l1vKo1o0wOE5aEG0l4ulUQ1YVAAAAAAAAAG1aryT2lPfDS6jwjJmgctr-u158xYunNRIujS2Y2VbyBAAAABWoQdQYrsb9AUkBAAAAAAAAAAAAAAAAAAAAAAAAAAAA2JZLAAAAAAAFAAAAcRDzfU0dBgDGFmKDSkZ45LbBZMajR8v1m3Zww07plf9jBYzEE8ia82_PvnTt5I4z"
```

With the Accept header set to `application/json;blockheader-encoding=object`, the request returns the block header as a JSON-encoded object like this:

```json
{
    "nonce": "16462985723698616006",
    "creationTime": 1721071750065287,
    "parent": "g-N8bZuyno0rkPyJZShFQzU5Den2rey1qlflnJuizzQ",
    "adjacents": {
        "19": "YlpdztdOQ-ChRklldcC2oHbZlAMIiYAGRgzTZBXvRgY",
        "14": "VosxlCQP8q0cPi3zd_yD_099Untb69bnIgIFlAioj9I",
        "9": "GXv0fxVXgDQTtRTxMjWfr6JXXrSscoaCaxEDPC93QIg"
    },
    "target": "ikpunXJe5dbyqNaNMDhOWhBtJeLpVENWFQAAAAAAAAA",
    "payloadHash": "bVqvJPaU98NLqPCMmaBy2v67XnzFi6c1Ei6NLZjZVvI",
    "chainId": 4,
    "weight": "FahB1Biuxv0BSQEAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "height": 4953816,
    "chainwebVersion": "mainnet01",
    "epochStart": 1721068523032689,
    "featureFlags": 0,
    "hash": "tsFkxqNHy_WbdnDDTumV_2MFjMQTyJrzb8--dO3kjjM"
}
```

If you set the Accept header to `application/octet-stream` and the content type is supported, the request returns a binary representation of the block header.
If the content type isn't support, the reguest fails with a **406 Not Acceptable** response code.

If there are no results matching the request criter, the response body indicates the reason no results matching the request criteria were found. 
For example:

```json
{
    "key": "WjPVpdhdS9NFU1rPHV_DiLI74a-wKs1g4CZSN6z5gHY",
    "reason": "key not found"
}
```

## Get block header branches

Use `POST http://{baseURL}/chain/{chain}/header/branch` to return a page of block headers from branches of the block chain in **descending** order.
Only blocks that are ancestors of the same block in the set of upper bounds and are not ancestors of any block in the set of lower bounds are returned.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the chain identifier of the chain you want to send the request to. Valid values are 0 to 19. For example, to get block headers for the first chain (0), the request is `POST http://{baseURL}/chain/0/header/branch`.

### Query parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| limit | integer&nbsp;>=&nbsp;0 | Specifies the maximum number of records that should be returned. The actual number of records might be lower. For example: `limit=3`.
| next | string | Specifies the cursor to retrieve the next page of results. This value can be found as the value of the next property of the previous page. For example: `"inclusive:qgsxD1G5m8dGZ4W9nMKBotU2I10ilURkRIE3_UKHlLM"`.
| minheight	| integer&nbsp;>=&nbsp;0 | Specifies the minimum block height for the returned headers. For example: `minheight=4471908`.
| maxheight | integer&nbsp;>=&nbsp;0 | Specifies the maximum block height for the returned headers. For example: `maxheight=4953816`.

### Request schema

These parameters specify the upper and lower bounds for the queried branches.

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| lower	| Array&nbsp;of&nbsp;strings | Specifies the lower bound block header hash for the query. No block headers are returned that are predecessors of any block with a hash from this array. The block hash consists of 43 characters from the `^[a-zA-Z0-9_-]{43}$` character set. |
| upper | Array of strings | Specifies the upper bound block header for the query. All block hashes returned are predecessors of a block with a hash from this array. The block hash consists of 43 characters from the `^[a-zA-Z0-9_-]{43}$` character set. |

The following examples illustrate the results to expect based on setting the lower and upper bound parameters. 

To return all ancestors of one block:

```json
{
  "lower": [],
  "upper": [
    "QxGCAz5AY1Y41nh1yWtgqhKhZ9pPiPRagFdIKNqBH74"
  ]
}
```

For example, to return all of the ancestors of a block that are not ancestors of another block, you might specify bounds similar to the following:

```json
{
  "lower": [
    "RClyuyZAacwvPpmLXKbTwrIRXWeUSjiNhJVP2esH8KM"
  ],
  "upper": [
    "QxGCAz5AY1Y41nh1yWtgqhKhZ9pPiPRagFdIKNqBH74"
  ]
}
```

### Responses

Requests to `http://{baseURL}/chain/{chain}/header/branch` return the following response codes:

- **200 OK** indicates that the request succeeded and returns the block headers matching the specified criteria as base64Url-encoded or JSON-encoded.
- **400 Bad Request** indicates that the branch bounds were exceeded.
- **404 Not Found** indicates that the block header indicated by a required parameter was not found.
- **406 Not Acceptable** indicates that the value of the Accept header is not supported.

#### Response headers

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr | string | Specifies the host address and port number of the client as observed by the remote Chainweb node. The host address can be a domain name or an IP address in IPv4 or IPv6 format. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

#### Successful response schemas

The format of the information returned in the response depends on the content type specified in the Accept header of the request.

| Parameter | Type | Description
| --------- | ---- | -----------
| items&nbsp;(required) | Array&nbsp;of&nbsp;block&nbsp;headers | Returns an array of block headers as base64Url-encoded strings (`application/json`), JSON-encoded objects (`application/json;blockheader-encoding=object`), or a binary data stream (`application/octet-stream`, if supported)
| limit&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the number of items in the page. This number can be smaller but never be larger than the number of requested items.
| next (required) | string&nbsp;or&nbsp;null | Returns a cursor that can be used in a follow up request to query the next page. It should be used literally as the value for the `next` parameter in the follow-up request. It can be specified as inclusive or exclusive.

### Examples

You can send a request to the Kadena main network—mainnet01—and chain 4 with a limit of three items per request and a minimum block height of 4953300 by calling the service endpoint like this:

```Postman
POST http://api.chainweb.com/chainweb/0.0/mainnet01/chain/4/header/branch?limit=3&minheight=4953300
```

With the Accept header set to `application/json`, this request returns the block headers as a base64Url-encoded strings without padding:

```json
{
    "limit": 3,
    "items": [
        "AAAAAAAAAACHrEs-Th0GAIPjfG2bsp6NK5D8iWUoRUM1OQ3p9q3stapX5Zybos80AwAJAAAAGXv0fxVXgDQTtRTxMjWfr6JXXrSscoaCaxEDPC93QIgOAAAAVosxlCQP8q0cPi3zd_yD_099Untb69bnIgIFlAioj9ITAAAAYlpdztdOQ-ChRklldcC2oHbZlAMIiYAGRgzTZBXvRgaKSm6dcl7l1vKo1o0wOE5aEG0l4ulUQ1YVAAAAAAAAAG1aryT2lPfDS6jwjJmgctr-u158xYunNRIujS2Y2VbyBAAAABWoQdQYrsb9AUkBAAAAAAAAAAAAAAAAAAAAAAAAAAAA2JZLAAAAAAAFAAAAcRDzfU0dBgDGFmKDSkZ45LbBZMajR8v1m3Zww07plf9jBYzEE8ia82_PvnTt5I4z",
        "AAAAAAAAAAA_lIk6Th0GAKw2xvazH-9PUpO1fCT45HbD8uU5Nsu51AAI0uD75S98AwAJAAAAptV1M_F1lYvTgMuC8g17ltHfA3SPsypQtiPWT8CTOW8OAAAAd_4KONk9zhF-yXHzShOookNJq9wV67K7jKxcZjcTtVETAAAAqp2F3-wGndQygNovYEYmrCygvvagdZRqHCi8Rml3C_qKSm6dcl7l1vKo1o0wOE5aEG0l4ulUQ1YVAAAAAAAAAJ1YNbk1mDHy9fXRpWr5RtcQNyMdcV6Wrc7l1yeb14WvBAAAAN80jMLyM8fxAUkBAAAAAAAAAAAAAAAAAAAAAAAAAAAA15ZLAAAAAAAFAAAAcRDzfU0dBgD-CxOF2XaGNoPjfG2bsp6NK5D8iWUoRUM1OQ3p9q3stapX5Zybos80",
        "AAAAAAAAAAAu1Hc3Th0GANsQ9KLq4IMMIXs1kWe-AeOqxJtuuLxO3iruSl3AmktlAwAJAAAAMmRRH-P_WCcG8UNu-NS4iWCmT4Godwm0ScV7MJXxNuUOAAAAH6HdmZhFzniidoeZTFUa4CKnMa-5e0INX8vhvhezAPcTAAAA82lUdaVunS05mRdpWeSSb0vixsVpYISDRLX0BE2lySeKSm6dcl7l1vKo1o0wOE5aEG0l4ulUQ1YVAAAAAAAAAAHTXM_ZAusmXzCBgSx7u8opHkC8kkNCDX7KS8ywVI60BAAAAKnB1rDMucflAUkBAAAAAAAAAAAAAAAAAAAAAAAAAAAA1pZLAAAAAAAFAAAAcRDzfU0dBgBxACkcRTx3HKw2xvazH-9PUpO1fCT45HbD8uU5Nsu51AAI0uD75S98"
    ],
    "next": "inclusive:2xD0ourggwwhezWRZ74B46rEm264vE7eKu5KXcCaS2U"
}
```

With the Accept header set to `application/json;blockheader-encoding=object`, the request returns the block headers as JSON-encoded objects like this:

```json
{
    "limit": 3,
    "items": [
        {
            "nonce": "16462985723698616006",
            "creationTime": 1721071750065287,
            "parent": "g-N8bZuyno0rkPyJZShFQzU5Den2rey1qlflnJuizzQ",
            "adjacents": {
                "19": "YlpdztdOQ-ChRklldcC2oHbZlAMIiYAGRgzTZBXvRgY",
                "14": "VosxlCQP8q0cPi3zd_yD_099Untb69bnIgIFlAioj9I",
                "9": "GXv0fxVXgDQTtRTxMjWfr6JXXrSscoaCaxEDPC93QIg"
            },
            "target": "ikpunXJe5dbyqNaNMDhOWhBtJeLpVENWFQAAAAAAAAA",
            "payloadHash": "bVqvJPaU98NLqPCMmaBy2v67XnzFi6c1Ei6NLZjZVvI",
            "chainId": 4,
            "weight": "FahB1Biuxv0BSQEAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "height": 4953816,
            "chainwebVersion": "mainnet01",
            "epochStart": 1721068523032689,
            "featureFlags": 0,
            "hash": "tsFkxqNHy_WbdnDDTumV_2MFjMQTyJrzb8--dO3kjjM"
        },
        {
            "nonce": "3928958401539935230",
            "creationTime": 1721071687013439,
            "parent": "rDbG9rMf709Sk7V8JPjkdsPy5Tk2y7nUAAjS4PvlL3w",
            "adjacents": {
                "19": "qp2F3-wGndQygNovYEYmrCygvvagdZRqHCi8Rml3C_o",
                "14": "d_4KONk9zhF-yXHzShOookNJq9wV67K7jKxcZjcTtVE",
                "9": "ptV1M_F1lYvTgMuC8g17ltHfA3SPsypQtiPWT8CTOW8"
            },
            "target": "ikpunXJe5dbyqNaNMDhOWhBtJeLpVENWFQAAAAAAAAA",
            "payloadHash": "nVg1uTWYMfL19dGlavlG1xA3Ix1xXpatzuXXJ5vXha8",
            "chainId": 4,
            "weight": "3zSMwvIzx_EBSQEAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "height": 4953815,
            "chainwebVersion": "mainnet01",
            "epochStart": 1721068523032689,
            "featureFlags": 0,
            "hash": "g-N8bZuyno0rkPyJZShFQzU5Den2rey1qlflnJuizzQ"
        },
        {
            "nonce": "2051174422813409393",
            "creationTime": 1721071635518510,
            "parent": "2xD0ourggwwhezWRZ74B46rEm264vE7eKu5KXcCaS2U",
            "adjacents": {
                "19": "82lUdaVunS05mRdpWeSSb0vixsVpYISDRLX0BE2lySc",
                "14": "H6HdmZhFzniidoeZTFUa4CKnMa-5e0INX8vhvhezAPc",
                "9": "MmRRH-P_WCcG8UNu-NS4iWCmT4Godwm0ScV7MJXxNuU"
            },
            "target": "ikpunXJe5dbyqNaNMDhOWhBtJeLpVENWFQAAAAAAAAA",
            "payloadHash": "AdNcz9kC6yZfMIGBLHu7yikeQLySQ0INfspLzLBUjrQ",
            "chainId": 4,
            "weight": "qcHWsMy5x-UBSQEAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "height": 4953814,
            "chainwebVersion": "mainnet01",
            "epochStart": 1721068523032689,
            "featureFlags": 0,
            "hash": "rDbG9rMf709Sk7V8JPjkdsPy5Tk2y7nUAAjS4PvlL3w"
        }
    ],
    "next": "inclusive:2xD0ourggwwhezWRZ74B46rEm264vE7eKu5KXcCaS2U"
}
```

If you set the Accept header to `application/octet-stream` and the content type is supported, the request returns a binary representation of the block header.
If the content type isn't support, the reguest fails with a **406 Not Acceptable** response code.
