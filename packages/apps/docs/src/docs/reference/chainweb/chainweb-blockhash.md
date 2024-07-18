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
Generally, block hashes are returned in **ascending** order and include hashes from orphaned blocks.

If you only want to query for blocks that are included in the canonical version of the chain, you can use the `/branch` endpoint.
The `/branch` endpoint returns blocks in descending order starting from the leafs of branches of the block chain.

## Get block hashes

Use `GET http://{baseURL}/chain/{chain}/hash` to get block hashes for the specified chain.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain (required) | integer >= 0 | Specifies the chain identifier of the chain you want to send the request to. Valid values are 0 to 19. For example, to get block hashes for the first chain (0), the request is `GET http://{baseURL}/chain/0/hash`.

### Query parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| limit | integer >= 0 | Specifies the maximum number of records that should be returned. The actual number of records returned might be lower than the value you specify.
| next | string | Specifies the cursor value to retrieve the next page of results. You can find the value to specify in the `next` property returned by the previous page in a successful response. For example: `"inclusive:qgsxD1G5m8dGZ4W9nMKBotU2I10ilURkRIE3_UKHlLM"`.
| minheight	| integer >= 0 | Specifies the minimum block height for the returned hashes. For example: `minheight=4471908`.
| maxheight | integer >= 0 | Specifies the maximum block height for the returned hashes. For example: `maxheight=4953816`.

### Responses

Requests to `GET http://{baseURL}/chain/{chain}/hash` return the following response codes:

- **200 OK** indicates that the request succeeded and the response body includes the collection of block hashes matching the request criteria in **ascending** order. 
  All block hashes that match the specified criteria are returned from the chain database, including hashes for orphaned blocks.
- **404 Not Found** indicates that the request failed to find any block hashes matching the request criteria. For example, if you specify a Chainweb node version or chain identifier that doesn't exist, you'll see this response code.

#### Response header

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr	| string | Specifies the host address and port number of the client as observed by the remote chainweb node in the format ^\d{4}.\d{4}.\d{4}.\d{4}:\d+$. For example: `"10.36.1.3:42988"`.
| x-server-timestamp | integer >= 0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x-chainweb-node-version	| string | Specifies the version of the remote chainweb node. For example: `"2.23"`.

#### Successful response schema

If the request is successful, the response returns `application/json` content with the following information:

| Parameter | Type | Description
| --------- | ---- | -----------
| items (required) | Array of strings | Lists the block hashes matching the request criteria. Each block hash string consists of 43 characters from the [`a-zA-Z0-9_-`] character set.
| limit (required) | integer >= 0 | Specifies the maximum number of items to include in the page of results. This number can be smaller but never larger than the number of requested items.
| next (required) | string or null | Returns a value that can be used to query the next page. You can use this value for the `next` parameter in a follow-up request. The format for this parameter consists of two parts. The first part of the string can be `inclusive`, `exclusive` or `null`. The second part is the value that calls the next page of results or `null` if there are no more results to query.

### Examples

You can send a request to the Kadena main network and chain 19 by calling the service endpoint like this:

```Postman
GET http://api.chainweb.com/chainweb/0.0/mainnet01/chain/19/hash?limit=3
```

This request returns a maximum of three items in the response body like this:

```json
{
    "limit": 3,
    "items": [
        "y76dr78dPJlFDMPzCc-aEz97iRyimv5Ij3psdVlC64c",
        "1ETD2LKF_gmJ92-q1fqAJY2eZerhhZA2kLxM1BC5hKE",
        "1B3UJuYNx0LHqtgbJ_sSpJl5h-77pMfvjBBy85e2K8w"
    ],
    "next": "inclusive:qgsxD1G5m8dGZ4W9nMKBotU2I10ilURkRIE3_UKHlLM"
}
```

To send a follow-up request to get block hashes for the next three blocks, you can add the `next` parameter to the request.
In this example, the follow-up request is `GET http://api.chainweb.com/chainweb/0.0/mainnet01/chain/19/hash?limit=3&next=inclusive:qgsxD1G5m8dGZ4W9nMKBotU2I10ilURkRIE3_UKHlLM` that returns three more hashes and a new `next` value:

```json
{
    "limit": 3,
    "items": [
        "qgsxD1G5m8dGZ4W9nMKBotU2I10ilURkRIE3_UKHlLM",
        "nN3fl9FaF2sD3zJSa1fY2rtoJMw33bFfzxK-25qKtT4",
        "2lqldW8MEeOzvApgJnmSIUaUT4CihoL9OMpdYbBAm_g"
    ],
    "next": "inclusive:01Dhx9c9mfbP7t0k0CztGi8IrE81u4ljd2NQ0UvXSZM"
}
```

## Get block hash branches

Use `POST http://{baseURL}/chain/{chain}/hash/branch` to get block hashes from the branches of the block chain in descending order.
This call only returns blocks that are ancestors of the same block in the set of upper bounds and that are not ancestors of any block in the set of lower bounds.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain (required) | integer >= 0 | Specifies the chain identifier of the chain you want to send the request to. Valid values are 0 to 19. For example, to get block hashes for the first chain (0), the request is `POST http://{baseURL}/chain/0/hash/branch`.

### Query parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| limit | integer >= 0 | Specifies the maximum number of records that should be returned. The actual number of records returned might be lower than the limit you set.
| next | string | Specifies the cursor value to retrieve the next page of results. You can find the value to specify in the `next` property returned by the previous page in a successful response. For example: `"inclusive:qgsxD1G5m8dGZ4W9nMKBotU2I10ilURkRIE3_UKHlLM"`.
| minheight	| integer >= 0 | Specifies the minimum block height for the returned hashes. For example: `minheight=4471908`.
| maxheight | integer >= 0 | Specifies the maximum block height for the returned hashes. For example: `maxheight=4953816`.

### Request body schema

Use the following parameters to specify the upper and lower bounds for the queried branches.

| Parameter | Type | Description
| --------- | ---- | -----------
| lower	| Array of strings (Block Hash) | Specifies the lower bound for the query. No block hashes are returned that are predecessors of any block with a hash from this array. Each block hash consists of 43 characters from the [`a-zA-Z0-9_-`] character set.
| upper | Array of strings (Block Hash) | Specifies the upper bound for the query. All returned block hashes are predecessors of a block with an hash from this array. Each block hash consists of 43 characters from the [`a-zA-Z0-9_-`] character set.

The following examples illustrate setting lower and upper bounds for the query parameters. 

To return all of the ancestors of the `"w5pM1MLEpJcBdMS5KT3tcxEj86hCO4Qv-q-xMysGmOw"` block:

```json
{
    "upper": ["w5pM1MLEpJcBdMS5KT3tcxEj86hCO4Qv-q-xMysGmOw"]
}
```

To return all of the ancestors of the `"QxGCAz5AY1Y41nh1yWtgqhKhZ9pPiPRagFdIKNqBH74"` block that are not ancestors of the `"RClyuyZAacwvPpmLXKbTwrIRXWeUSjiNhJVP2esH8KM"` block, you might specify bounds similar to the following:

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

Requests to `/chain/{chain}/hash/branch` can return the following response codes:

- **200 OK** indicates that the request succeeded and returns the requested block hashes. 
  All block hashes that match the specified criteria are returned from the chain database, including hashes for orphaned blocks.
- **404 Not Found** indicates that the requested block hashes could not be found.

#### Response headers

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr	| string | Specifies the host address and port number of the client as observed by the remote Chainweb node in the format ^\d{4}.\d{4}.\d{4}.\d{4}:\d+$. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x-chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

#### Successful response schema

If the request is successful, the response returns application/json content with the following:

| Parameter | Type | Description
| --------- | ---- | -----------
| items (required) | Array of strings (Block Hash) | Returns an array of block hashes. Each block hash consists of 43 characters from the [`a-zA-Z0-9_-`] character set.
| limit (required) | integer >= 0 | Specifies the maximum number of items in the page. This number can be smaller but never larger than the number of requested items.
| next (required) | string or null | Returns a value that can be used to query the next page. You can use this values for the `next` parameter in a follow-up request. The format for this parameter consists of two parts. The first part of the string can be `inclusive`, `exclusive` or null. The second part is the value that calls the next page of results or null if there are no more results to query.

#### Not found response schema

If there are no results matching the request criteria, the response returns the following:

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| key | string | Specifies the base64Url-encoded block hash (without padding). The block hash consists of 43 characters from the [`a-zA-Z0-9_-`] character set. |
| reason | string | Provides a placeholder for specifying the reason that no block hashes were found. |

### Examples

You can send a request to the Kadena main network—mainnet01—and chain 0 by calling the main network service endpoint:

```Postman
POST http://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/hash/branch
```

The request body for this query is:

```json
{
    "lower" :["RClyuyZAacwvPpmLXKbTwrIRXWeUSjiNhJVP2esH8KM"],
    "upper" : ["QxGCAz5AY1Y41nh1yWtgqhKhZ9pPiPRagFdIKNqBH74"]
}
```

This request returns one item in the response body:

```json
{
    "limit": 1,
    "items": [
        "QxGCAz5AY1Y41nh1yWtgqhKhZ9pPiPRagFdIKNqBH74"
    ],
    "next": null
}
```

You can send a request to the Kadena test network—testnet04—and chain 18 by calling the testnet service endpoint like this:

```Postman
POST http://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/18/hash/branch
```

The request body for this query is:

```json
{
    "lower": ["egzXuuj9EWIadpIQipb59N1DFPgDE6Gdlo2LmReGAfI"],
    "upper": ["w5pM1MLEpJcBdMS5KT3tcxEj86hCO4Qv-q-xMysGmOw"]
}
```

This request returns four items in the response body:

```json
{
    "limit": 4,
    "items": [
        "w5pM1MLEpJcBdMS5KT3tcxEj86hCO4Qv-q-xMysGmOw",
        "LfjtkAgRa6jt6al0VACE4Gylu8McHf34233qZjqETuo",
        "DRKyE0T_42ajfqC7kmBEn07pTMZbshFBWGzWT27cqwg",
        "5o4nH_H_mcDnfmXDnp9XqRU5qWcpaKGdfECMZB0CQ8s"
    ],
    "next": null
}
```

If you specify an upper or lower bound doesn't exist on the chain where you're sending the request, the response body indicates the reason the no results matching the request criteria were found. 
For example:

```json
{
    "key": "w5pM1MLEpJcBdMS5KT3tcxEj86hCO4Qv-q-xMysGmOw",
    "reason": "key not found"
}
```