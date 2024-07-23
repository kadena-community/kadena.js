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

Use `GET https://{baseURL}/chain/{chain}/block` to return a collection of blocks in ascending order that match the query parameters you specify for the request. 
All blocks that match the criteria are returned from the chain database, including orphaned blocks.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain (required) | integer >= 0 | Specifies the chain identifier of the chain you want to send the request to. Valid values are 0 to 19. For example, to get block hashes for the first chain (0), the request is `GET https://{baseURL}/chain/0/block`.

### Query parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| limit | integer >= 0 | Specifies the maximum number of records that should be returned. The actual number of records returned might be lower than the value you specify. For example: `limit=3`.
| next | string | Specifies the cursor value to retrieve the next page of results. You can find the value to specify in the `next` property returned by the previous page in a successful response. For example: `"inclusive:qgsxD1G5m8dGZ4W9nMKBotU2I10ilURkRIE3_UKHlLM"`.
| minheight	| integer >= 0 | Specifies the minimum block height for the blocks to return. For example: `minheight=4471908`.
| maxheight | integer >= 0 | Specifies the maximum block height for the blocks to return. For example: `maxheight=4953816`.

### Responses

Requests to `GET https://{baseURL}/chain/{chain}/block` can return the following response codes:

- **200 OK** indicates that the request succeeded. The response body includes all of the blocks matching the criteria specified, including any orphaned blocks.
- **404 Not Found** indicates that no blocks matching the request criteria were found or that the `next` or `maxheight` parameter wasn't valid.

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
| items (required) | Array of objects | Returns an array of JSON-encoded objects representing full blocks. 
| limit (required) | integer >= 0 | Specifies the maximum number of items in the page. This number can be smaller but never larger than the number of requested items.
| next (required) | string or null | Returns a value that can be used to query the next page. You can use this value for the `next` parameter in a follow-up request. The format for this parameter consists of two parts. The first part of the string can be `inclusive`, `exclusive` or null. The second part is the value that calls the next page of results or null if there are no more results to query.

## Get block branches

POST
/chain/{chain}/block/branch





A page of blocks from branches of the block chain in descending order.

Blocks are returned that are ancestors of the block in the set of upper bounds and are not ancestors of any block in the set of lower bounds.

PATH PARAMETERS
chain
required
integer >= 0
Example: 0
the id of the chain to which the request is sent

QUERY PARAMETERS
limit	
integer >= 0
Maximum number of records that may be returned. The actual number may be lower.

next	
string
The cursor for the next page. This value can be found as value of the next property of the previous page.

minheight	
integer >= 0
Example: minheight=500000
Minimum block height of the returned headers

maxheight	
integer >= 0
Example: maxheight=`maxheight=4953816`
Maximum block height of the returned headers

REQUEST BODY SCHEMA: application/json
Upper and lower bounds of the queried branches

lower	
Array of strings (Block Hash) [ items = 43 characters ^[a-zA-Z0-9_-]{43}$ ]
No blocks are returned that are predecessors of any block with an hash from this array.

upper	
Array of strings (Block Hash) [ items = 43 characters ^[a-zA-Z0-9_-]{43}$ ]
Returned block headers are predecessors of a block with an hash from this array. This includes blocks with hashes from this array.

Responses
200 The blocks that were found
RESPONSE HEADERS
x-peer-addr	
string (Host Address) ^\d{4}.\d{4}.\d{4}.\d{4}:\d+$
Example: "10.36.1.3:42988"
Host and port of the client as observed by the remote node

x-server-timestamp	
integer (POSIX Timestamp) >= 0
Example: 1618597601
The time of the clock of the remote node

x-chainweb-node-version	
string
Example: "2.6"
The version of the remote chainweb node

RESPONSE SCHEMA: application/json
items
required
Array of objects (Full block)
Array of JSON encoded blocks

limit
required
integer >= 0
The number of items in the page. This number can be smaller but never be larger than the number of requested items.

next
required
(null or null) or (string or null)^(inclusive|exclusive):.*$
A cursor that can be used to query the next page. It should be used literally as value for the next parameter in a follow-up request.

400 The branch bounds were exceeded.
404 A block indicated by a required parameter was not found.
406 The value of the Accept header is not supported.
Request samples
Payload
Content type
application/json
Example

Ancestors of block that are not ancestors of another block
Ancestors of block that are not ancestors of another block

Copy
Expand allCollapse all
{
"lower": [
"RClyuyZAacwvPpmLXKbTwrIRXWeUSjiNhJVP2esH8KM"
],
"upper": [
"QxGCAz5AY1Y41nh1yWtgqhKhZ9pPiPRagFdIKNqBH74"
]
}
Response samples
200404
Content type
application/json

Copy
Expand allCollapse all
{
"value": {
"next": "inclusive:o1S4NNFhKWg8T1HEkmDvsTH9Ut9l3_qHRpp00yRKZIk",
"items": [],
"limit": 2
}
}
