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
Mempool P2P endpoints for communication between mempools. End users are not supposed to use these endpoints directly. Instead, the respective Pact endpoints should be used for submitting transactions into the network.

Get Pending Transactions from the Mempool

POST
/chain/{chain}/mempool/getPending

PATH PARAMETERS
chain
required
integer >= 0
Example: 0
the id of the chain to which the request is sent

QUERY PARAMETERS
nonce	
integer
Server nonce value

since	
integer <int64>
Mempool tx id value

Responses
200 recent state of pending transactions in the mempool
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
hashes	
Array of strings
highwaterMark	
Array of integers
two-element array: [nonce (integer), since (int64)]

Response samples
200
Content type
application/json
Example

Result with one transaction
Result with one transaction

Copy
Expand allCollapse all
{
"hashes": [
"qx346ILpakzgbNZbE8oHqF5TZQghp-HPcV-0Ptc_n2s"
],
"highwaterMark": [
7530864100535969000,
399
]
}
Check for Pending Transactions in the Mempool

POST
/chain/{chain}/mempool/member





PATH PARAMETERS
chain
required
integer >= 0
Example: 0
the id of the chain to which the request is sent

REQUEST BODY SCHEMA: application/json
Array of request keys

Array 
string (Request Key) = 43 characters ^[a-zA-Z0-9_-]{43}$
Base64Url-encoded, request key of a Pact transaction

Responses
200 Array of boolean values that indicate whether the respective transaction is in the mempool. The array has the same size as the request body.
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
Array 
boolean
Request samples
Payload
Content type
application/json
Example

empty request body
empty request body

Copy
[ ]
Response samples
200
Content type
application/json
Example

result for existing transaction
result for existing transaction

Copy
[
true
]
Lookup Pending Transactions in the Mempool

POST
/chain/{chain}/mempool/lookup





PATH PARAMETERS
chain
required
integer >= 0
Example: 0
the id of the chain to which the request is sent

REQUEST BODY SCHEMA: application/json
Array of request keys

Array 
string (Request Key) = 43 characters ^[a-zA-Z0-9_-]{43}$
Base64Url-encoded, request key of a Pact transaction

Responses
200 Array of lookup results for the respective transactions
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
Array 
tag	
string
Enum: "Missing" "Pending"
contents	
string (Signed Transaction Text)
Text of a JSON encoded signed Pact transaction

Request samples
Payload
Content type
application/json
Example

empty request body
empty request body

Copy
[ ]
Response samples
200
Content type
application/json
Example

result for existing transaction
result for existing transaction

Copy
Expand allCollapse all
[
{
"tag": "Pending",
"contents": "{\"hash\":\"y3aWL72-3wAy7vL9wcegGXnstH0lHi-q-cfxkhD5JCw\",\"sigs\":[{\"sig\":\"8ddc06b37c496f2cadc4f7412405a80faf3ab07482ff5553b9b5fcc73d1b4121275ad5948d9b4078e553b71f8b42eaf6b24135bf2fb4d5840c16bcdde0e35e0f\"}],\"cmd\":\"{\\\"networkId\\\":\\\"mainnet01\\\",\\\"payload\\\":{\\\"exec\\\":{\\\"data\\\":{\\\"account-keyset\\\":{\\\"pred\\\":\\\"keys-all\\\",\\\"keys\\\":[\\\"acc28032a1bb725b7ba0a3593ab86f393894fa6659281f3dfdfee0afe48559a2\\\"]}},\\\"code\\\":\\\"(coin.transfer-create \\\\\\\"60241f51ea34e05c61fbea9d\\\\\\\" \\\\\\\"acc28032a1bb725b7ba0a3593ab86f393894fa6659281f3dfdfee0afe48559a2\\\\\\\" (read-keyset \\\\\\\"account-keyset\\\\\\\") 5007.0000)\\\"}},\\\"signers\\\":[{\\\"pubKey\\\":\\\"acc28032a1bb725b7ba0a3593ab86f393894fa6659281f3dfdfee0afe48559a2\\\",\\\"clist\\\":[{\\\"args\\\":[\\\"60241f51ea34e05c61fbea9d\\\",\\\"acc28032a1bb725b7ba0a3593ab86f393894fa6659281f3dfdfee0afe48559a2\\\",5007],\\\"name\\\":\\\"coin.TRANSFER\\\"},{\\\"args\\\":[],\\\"name\\\":\\\"coin.GAS\\\"}]}],\\\"meta\\\":{\\\"creationTime\\\":1618949714,\\\"ttl\\\":300,\\\"gasLimit\\\":600,\\\"chainId\\\":\\\"0\\\",\\\"gasPrice\\\":1.0e-7,\\\"sender\\\":\\\"acc28032a1bb725b7ba0a3593ab86f393894fa6659281f3dfdfee0afe48559a2\\\"},\\\"nonce\\\":\\\"\\\\\\\"2021-04-20T20:16:13.645Z\\\\\\\"\\\"}\"}"
}
]
Insert Transactions into the Mempool

PUT
/chain/{chain}/mempool/insert





PATH PARAMETERS
chain
required
integer >= 0
Example: 0
the id of the chain to which the request is sent

REQUEST BODY SCHEMA: application/json
Array of strings of JSON encoded signed transactions

Array 
string (Signed Transaction Text)
Text of a JSON encoded signed Pact transaction

Responses
200 Transactions were inserted
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

Request samples
Payload
Content type
application/json
Example

Singleton request body
Singleton request body

Copy
[
"{\"hash\":\"y3aWL72-3wAy7vL9wcegGXnstH0lHi-q-cfxkhD5JCw\",\"sigs\":[{\"sig\":\"8ddc06b37c496f2cadc4f7412405a80faf3ab07482ff5553b9b5fcc73d1b4121275ad5948d9b4078e553b71f8b42eaf6b24135bf2fb4d5840c16bcdde0e35e0f\"}],\"cmd\":\"{\\\"networkId\\\":\\\"mainnet01\\\",\\\"payload\\\":{\\\"exec\\\":{\\\"data\\\":{\\\"account-keyset\\\":{\\\"pred\\\":\\\"keys-all\\\",\\\"keys\\\":[\\\"acc28032a1bb725b7ba0a3593ab86f393894fa6659281f3dfdfee0afe48559a2\\\"]}},\\\"code\\\":\\\"(coin.transfer-create \\\\\\\"60241f51ea34e05c61fbea9d\\\\\\\" \\\\\\\"acc28032a1bb725b7ba0a3593ab86f393894fa6659281f3dfdfee0afe48559a2\\\\\\\" (read-keyset \\\\\\\"account-keyset\\\\\\\") 5007.0000)\\\"}},\\\"signers\\\":[{\\\"pubKey\\\":\\\"acc28032a1bb725b7ba0a3593ab86f393894fa6659281f3dfdfee0afe48559a2\\\",\\\"clist\\\":[{\\\"args\\\":[\\\"60241f51ea34e05c61fbea9d\\\",\\\"acc28032a1bb725b7ba0a3593ab86f393894fa6659281f3dfdfee0afe48559a2\\\",5007],\\\"name\\\":\\\"coin.TRANSFER\\\"},{\\\"args\\\":[],\\\"name\\\":\\\"coin.GAS\\\"}]}],\\\"meta\\\":{\\\"creationTime\\\":1618949714,\\\"ttl\\\":300,\\\"gasLimit\\\":600,\\\"chainId\\\":\\\"0\\\",\\\"gasPrice\\\":1.0e-7,\\\"sender\\\":\\\"acc28032a1bb725b7ba0a3593ab86f393894fa6659281f3dfdfee0afe48559a2\\\"},\\\"nonce\\\":\\\"\\\\\\\"2021-04-20T20:16:13.645Z\\\\\\\"\\\"}\"}"
]
