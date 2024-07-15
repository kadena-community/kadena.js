---
title: Peer endpoints
description:
  Provides reference information for the chainweb-node peer endpoints.
menu: Chainweb API
label: Peer endpoints
order: 2
layout: full
tags: ['chainweb', 'node api', 'chainweb api', 'api reference']
---

# Peer endpoints
The P2P communication between chainweb-nodes is sharded into several independent P2P network. The cut network is exchanging consensus state. There is also one mempool P2P network for each chain.

Get Cut-Network Peer Info

GET
/cut/peer

QUERY PARAMETERS
limit	
integer >= 0
Maximum number of records that may be returned. The actual number may be lower.

next	
string
The cursor for the next page. This value can be found as value of the next property of the previous page.

Responses
200 Peers from the peer database of the remote node
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
Array of objects (Peer)
Array of peers

limit
required
integer >= 0
The number of items in the page. This number can be smaller but never be larger than the number of requested items.

next
required
(null or null) or (string or null)^(inclusive|exclusive):.*$
A cursor that can be used to query the next page. It should be used literally as value for the next parameter in a follow-up request.

Response samples
200
Content type
application/json

Copy
Expand allCollapse all
{
"value": {
"next": "inclusive:3",
"items": [],
"limit": 3
}
}
Put Cut-Network Peer Info

PUT
/cut/peer





REQUEST BODY SCHEMA: application/json
The peer that is added to the peer database of the cut P2P network of the remote host.

id
required
string or null[a-zA-Z0-9_-]{43}
The base64Url (without padding) encoded SHA256 fingerprint of the SSL certificate of the node. This can be null only if the node uses an official CA signed certificate

address
required
object
Responses
204 The peer got added to the peer database of the remote node.
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

400 The request is invalid. It is either malformed or the provided peer is not reachable. Before the remote node adds a peer to its peer database it checks whether the peer can be reached via the provided address. If this check fails an error is returned.
Request samples
Payload
Content type
application/json

Copy
Expand allCollapse all
{
"address": {
"hostname": "85.238.99.91",
"port": 30004
},
"id": null
}
Response samples
400
Content type
text/plain

Copy
Invalid hostaddress: IsNotReachable (PeerInfo {_peerId = Nothing, _peerAddr = HostAddress {_hostAddressHost = us-w1.chainweb.com, _hostAddressPort = 444}}) "\"HttpExceptionRequest Request {\\n  host                 = \\\"us-w1.chainweb.com\\\"\\n  port                 = 444\\n  secure               = True\\n  requestHeaders       = [(\\\"X-Chainweb-Node-Version\\\",\\\"2.6\\\")]\\n  path                 = \\\"/chainweb/0.0/mainnet01/cut/peer\\\"\\n  queryString          = \\\"\\\"\\n  method               = \\\"GET\\\"\\n  proxy                = Nothing\\n  rawBody              = False\\n  redirectCount        = 10\\n  responseTimeout      = ResponseTimeoutMicro 2000000\\n  requestVersion       = HTTP/1.1\\n}\\n ConnectionTimeout\""
Get Chain Mempool-Network Peer Info

GET
/chain/{chain}/mempool/peer





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

Responses
200 Peer information
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
Array of objects (Peer)
Array of peers

limit
required
integer >= 0
The number of items in the page. This number can be smaller but never be larger than the number of requested items.

next
required
(null or null) or (string or null)^(inclusive|exclusive):.*$
A cursor that can be used to query the next page. It should be used literally as value for the next parameter in a follow-up request.

Response samples
200
Content type
application/json

Copy
Expand allCollapse all
{
"value": {
"next": "inclusive:3",
"items": [],
"limit": 3
}
}
Put Chain Mempool-Network Peer Info

PUT
/chain/{chain}/mempool/peer





PATH PARAMETERS
chain
required
integer >= 0
Example: 0
the id of the chain to which the request is sent

REQUEST BODY SCHEMA: application/json
The peer that is added to the peer database of the mempoo P2P network of the chain {chain} of remote host.

id
required
string or null[a-zA-Z0-9_-]{43}
The base64Url (without padding) encoded SHA256 fingerprint of the SSL certificate of the node. This can be null only if the node uses an official CA signed certificate

address
required
object
Responses
204 The peer got added to the peer database of the remote node.
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

400 Bad Request. The request is invalid. It is either malformed or the provided peer is not reachable. Before the remote node addes a peer to its peer database it checks whether the peer can be reached via the provided address. If this check fails an error is returned.
Request samples
Payload
Content type
application/json

Copy
Expand allCollapse all
{
"address": {
"hostname": "85.238.99.91",
"port": 30004
},
"id": null
}
Response samples
400
Content type
text/plain

Copy
Invalid hostaddress: IsNotReachable (PeerInfo {_peerId = Nothing, _peerAddr = HostAddress {_hostAddressHost = us-w1.chainweb.com, _hostAddressPort = 444}}) "\"HttpExceptionRequest Request {\\n  host                 = \\\"us-w1.chainweb.com\\\"\\n  port                 = 444\\n  secure               = True\\n  requestHeaders       = [(\\\"X-Chainweb-Node-Version\\\",\\\"2.6\\\")]\\n  path                 = \\\"/chainweb/0.0/mainnet01/cut/peer\\\"\\n  queryString          = \\\"\\\"\\n  method               = \\\"GET\\\"\\n  proxy                = Nothing\\n  rawBody              = False\\n  redirectCount        = 10\\n  responseTimeout      = ResponseTimeoutMicro 2000000\\n  requestVersion       = HTTP/1.1\\n}\\n ConnectionTimeout\""
