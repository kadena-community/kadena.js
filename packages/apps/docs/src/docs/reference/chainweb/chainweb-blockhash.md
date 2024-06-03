---
title: Block hash endpoints
description:
  Provides reference information for the chainweb-node block hash endpoints.
menu: Chainweb API
label: Block hash endpoints
order: 2
layout: full
tags: ['chainweb', 'node api', 'chainweb api', 'api reference']
---

# Block hash endpoints

Block hash endpoints return block hashes from the chain database.
Generally, block hashes are returned in ascending order and include hashes from orphaned blocks.

If you only want to query for blocks that are included in the winning branch of the chain, you can use the branch endpoint.
The branch endpoint returns blocks in descending order starting from the leafs of branches of the block chain.

## Get block hashes

Use `GET /chain/{chain}/hash` to get block hashes for the specified chain.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain (required) | integer >= 0 | Specifies the chain identifier of the chain you want to send the request to. Valid values are 0 to 19. For example, to get block hashes for the first chain (0), the request is `GET /chain/0/hash`.

### Query parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| limit | integer >= 0 | Specifies the maximum number of records that should be returned. The actual number records returned might be lower than the value you specify.
| next | string | Specifies the cursor value to retrieve the next page of results. You can find the value to specify in the `next` property returned by the previous page in a successful response.
| minheight	| integer >= 0 | Specifies the minimum block height for the returned hashes. For example: minheight=500000
| maxheight | integer >= 0 | Specifies the maximum block height for the returned hashes. For example: maxheight=500000

### Responses

Requests to `/chain/{chain}/hash` can return the following response codes:

- **200 OK** indicates that the request succeeded and returns a collection of block hashed in **ascending** order. 
  All block hashes that match the specified criteria are returned from the chain database, including hashes for orphaned blocks.
- **404 Not Found** indicates that a query parameter value specifies a nonexistent block height.

#### Response header

The response header parameters are the same for successful and unsuccessful requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr	| string | Specifies the host address and port number of the client as observed by the remote chainweb node in the format ^\d{4}.\d{4}.\d{4}.\d{4}:\d+$. For example: "10.36.1.3:42988"
| x-server-timestamp | integer >= 0 | Specifies the clock time of the remote chainweb node using the UNIX epoch timestamp. For example: 1618597601
| x-chainweb-node-version	| string | Specifies the version of the remote chainweb node. For example: "2.23"

#### Successful response schema

If the request is successful, the response returns `application/json` content with the following:

| Parameter | Type | Description
| --------- | ---- | -----------
| items (required) | Array of strings (Block Hash) | Returns an array of block hashes. Each block hash string consists of 43 characters from the [`a-zA-Z0-9_-`] character set.
| limit (required) | integer >= 0 | Specifies the maximum number of items in the page. This number can be smaller but never larger than the number of requested items.
| next (required) | string or null | Returns a value that can be used to query the next page. You can use this values for the `next` parameter in a follow-up request. The format for this parameter consists of two parts. The first part of the string can be `inclusive`, `exclusive` or null. The second part is the value that calls the next page of results or null if there are no more results to query.

For example:

```json
{
  "value": {
    "next": "inclusive:o1S4NNFhKWg8T1HEkmDvsTH9Ut9l3_qHRpp00yRKZIk",
    "items": [],
    "limit": 2
    }
}
```

#### Not found response schema

If there are no results matching the request criteria, the response returns the following:

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| reason | string | Provides a placeholder for specifying the reason that no block hashes were found. |
| key | string | Specifies the base64Url-encoded block hash (without padding). The block hash consists of 43 characters from the [`a-zA-Z0-9_-`] character set. |

For example:

```json
{
  "reason": "string",
  "key": "QxGCAz5AY1Y41nh1yWtgqhKhZ9pPiPRagFdIKNqBH7"
}
```

## Get block hash branches

Use `POST /chain/{chain}/hash/branch` to get block hashes from the branches of the block chain in descending order.
This call only returns blocks that are ancestors of the same block in the set of upper bounds and that are not ancestors of any block in the set of lower bounds.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain (required) | integer >= 0 | Specifies the chain identifier of the chain you want to send the request to. Valid values are 0 to 19. For example, to get block hashes for the first chain (0), the request is `POST /chain/0/hash/branch`.

### Query parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| limit | integer >= 0 | Specifies the maximum number of records that should be returned. The actual number records might be lower.
| next | string | Specifies the cursor for the next page. This value can be found as the value of the `next` property of the previous page.
| minheight	| integer >= 0 | Specifies the minimum block height for the returned hashes. For example: minheight=500000
| maxheight | integer >= 0 | Specifies the maximum block height for the returned hashes. For example: maxheight=500000

### Request body schema

Use the following parameters to specify the upper and lower bounds for the queried branches.

| Parameter | Type | Description
| --------- | ---- | -----------
| lower	| Array of strings (Block Hash) | Specifies the lower bound for the query. No block hashes are returned that are predecessors of any block with a hash from this array. Each block hash consists of 43 characters from the [`a-zA-Z0-9_-`] character set.
| upper | Array of strings (Block Hash) | Specifies the upper bound for the query. All returned block hashes are predecessors of a block with an hash from this array. Each block hash consists of 43 characters from the [`a-zA-Z0-9_-`] character set.

The following examples illustrate setting lower and upper bounds for a quesry parameters. 
For example, to return all of the ancestors of the "QxGCAz5AY1Y41nh1yWtgqhKhZ9pPiPRagFdIKNqBH74" block that are not ancestors of the "RClyuyZAacwvPpmLXKbTwrIRXWeUSjiNhJVP2esH8KM" block, you might specify bounds similar to the following:

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

To return all of the ancestors of the "QxGCAz5AY1Y41nh1yWtgqhKhZ9pPiPRagFdIKNqBH74" block:

```json
{
  "lower": [ ],
  "upper": [
    "QxGCAz5AY1Y41nh1yWtgqhKhZ9pPiPRagFdIKNqBH74"
    ]
}
```

To return an empty branch:

```json
{
  "lower": [],
  "upper": []
}
```

To return an empty page:

```json
{
  "lower": [
    "QxGCAz5AY1Y41nh1yWtgqhKhZ9pPiPRagFdIKNqBH74"
  ],
  "upper": [
    "QxGCAz5AY1Y41nh1yWtgqhKhZ9pPiPRagFdIKNqBH74"
  ]
}
```

### Responses

Requests to `/chain/{chain}/hash/branch` can return the following response codes:

- **200 OK** indicates that the request succeeded and returns the requested block hashes. 
  All block hashes that match the specified criteria are returned from the chain database, including hashes for orphaned blocks.
- **404 Not Found** indicates that the requested block hashes could not be found.

#### Response headers

The response header parameters are the same for successful and unsuccessful requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr	| string | Specifies the host address and port number of the client as observed by the remote chainweb node in the format ^\d{4}.\d{4}.\d{4}.\d{4}:\d+$. For example: "10.36.1.3:42988"
| x-server-timestamp | integer >= 0 | Specifies the clock time of the remote chainweb node using the UNIX epoch timestamp. For example: 1618597601
| x-chainweb-node-version	| string | Specifies the version of the remote chainweb node. For example: "2.23"

#### Successful response schema

If the request is successful, the response returns application/json content with the following:

| Parameter | Type | Description
| --------- | ---- | -----------
| items (required) | Array of strings (Block Hash) | Returns an array of block hashes. Each block hash consists of 43 characters from the [`a-zA-Z0-9_-`] character set.
| limit (required) | integer >= 0 | Specifies the maximum number of items in the page. This number can be smaller but never larger than the number of requested items.
| next (required) | string or null | Returns a value that can be used to query the next page. You can use this values for the `next` parameter in a follow-up request. The format for this parameter consists of two parts. The first part of the string can be `inclusive`, `exclusive` or null. The second part is the value that calls the next page of results or null if there are no more results to query.

#### Example

Send a request to the Kadena main network:

POST https://us-e1.chainweb.com/chainweb/0.0/mainnet/chain/0/hash/branch?limit=2

##### Request body

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

##### Response body

```json
{
  "value": {
    "next": "inclusive:o1S4NNFhKWg8T1HEkmDvsTH9Ut9l3_qHRpp00yRKZIk",
    "items": [
      "QxGCAz5AY1Y41nh1yWtgqhKhZ9pPiPRagFdIKNqBH74",
      "RClyuyZAacwvPpmLXKbTwrIRXWeUSjiNhJVP2esH8KM"
    ],
    "limit": 2
  }
}
```

#### Not found response (404)

If there are no results matching the request criteria, the response returns the following:

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| reason | string | Provides a placeholder for specifying the reason that no block hashes were found. |
| key | string | Specifies the base64Url-encoded block hash (without padding). The block hash consists of 43 characters from the [`a-zA-Z0-9_-`] character set. |

For example:

```json
{
  "reason": "string",
  "key": "QxGCAz5AY1Y41nh1yWtgqhKhZ9pPiPRagFdIKNqBH7"
}
```