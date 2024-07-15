---
title: Config endpoints
description:
  Provides reference information for the chainweb-node config endpoints.
menu: Chainweb API
label: Config endpoint
order: 2
layout: full
tags: ['chainweb', 'node api', 'chainweb api', 'api reference']
---

# Config endpoint

Configuration of Chainweb Node

GET
/config





Returns the configuration of chainweb-node as a JSON structure. Sensitive information is removed from the result. The JSON schema depends on the chainweb node version and is not part of the stable chainweb-node API.

Responses
200 Configuration of the chainweb node
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
Schema not provided
Response samples
200
Content type
application/json

Copy
Expand allCollapse all
{
"value": {
"allowReadsInLocal": false,
"rosetta": true,
"throttling": {},
"serviceApi": {},
"validateHashesOnReplay": false,
"chainwebVersion": "mainnet01",
"pactQueueSize": 2000,
"mining": {},
"p2p": {},
"transactionIndex": {},
"gasLimitOfBlock": 150000,
"reorgLimit": 480,
"headerStream": true,
"mempoolP2p": {},
"reintroTxs": true,
"cuts": {}
}
}