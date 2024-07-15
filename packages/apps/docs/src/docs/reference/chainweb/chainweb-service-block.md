---
title: Block endpoints
description:
  Provides reference information for the chainweb-node block endpoints.
menu: Chainweb API
label: Block endpoints
order: 2
layout: full
tags: ['chainweb', 'node api', 'chainweb api', 'api reference']
---

# Block endpoints

Block endpoints return whole blocks—headers and payloads—from the chain database.
Generally, blocks are returned in ascending order and include orphaned blocks.

If you only want to query blocks that are included in the winning branch of the chain, you can call the branch endpoints.
Branch endpoints return blocks in descending order starting from the leafs of branches of the block chain.

Blocks are returned in only one format, with block headers and payloads in JSON encoding.

## Get Block

GET
/chain/{chain}/block





A page of a collection of blocks in ascending order that satisfies query parameters. Any block from the chain database is returned. This includes orphaned blocks.

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
Example: maxheight=500000
Maximum block height of the returned headers

Responses
200 The requested blocks
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

404 The next or maxheight parameter indicated a nonexistent block height.
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
Get Block Branches

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
Example: maxheight=500000
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
