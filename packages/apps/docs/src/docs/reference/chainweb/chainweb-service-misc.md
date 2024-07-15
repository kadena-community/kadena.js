---
title: Miscellaneous endpoints
description:
  Provides reference information for the chainweb-node block endpoints.
menu: Chainweb API
label: Block endpoints
order: 2
layout: full
tags: ['chainweb', 'node api', 'chainweb api', 'api reference']
---

# Miscellaneous endpoints
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
Start a backup job

POST
/make-backup





Backup jobs are identified by the Unix timestamp when they're begun.

If a backup job is already in progress, this endpoint will return its identifier instead of starting a new one.

The RocksDB portion of the database is always backed up; if backupPact is set, the Sqlite (Pact) portion is backed up as well, taking much longer.

There is no automatic backup retention policy - users need to delete old backups.

This API is enabled by configuring the node thus:

backup:
  api:
    enabled: true
  directory: {some file path to put backups in}
The backup directory ideally will be located in the same partition as the RocksDB portion of the node database.

RocksDB backups to the same partition as holds the active RocksDB database will have almost zero space overhead immediately, but over time as the active database diverges from the backup the space overhead will increase. If the backup is to another partition, it will take longer and take as much disk space as the active RocksDB database.

Pact database backups always require about as much space as the active Pact database does.

QUERY PARAMETERS
backupPact	
any
Flag, if present back up the Pact databases too. Extra disk space and time required

Responses
200 A backup job has been created
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

RESPONSE SCHEMA: text/plain
string (Backup job identifier) [a-zA-Z0-9_-]+
Textual backup job identifier

Check the status of a backup job

GET
/check-backup/{backupId}





PATH PARAMETERS
backupId
required
string (Backup job identifier) [a-zA-Z0-9_-]+
Example: 1648665437000
The identifier of the backup being checked

Responses
200 A backup job with that identifier exists, here is its status
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

RESPONSE SCHEMA: text/plain
string (Backup job status) backup-done|backup-in-progress|backup-failed
404 There is no backup job with that identifier
Health Check

GET
/health-check



Checks whether the chainweb-node is up and running and responding to API requests. In order to check the state of consensus the /cut/get endpoint should be used instead.

Responses
200 The node is healthy
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

RESPONSE SCHEMA: text/plain
string
Response samples
200
Content type
text/plain

Copy
Health check OK.
General Node Info

GET
/info



Provides general information about the node and the chainweb version

Responses
200 General information about the node and the chainweb version
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
nodeNumberOfChains
required
integer >= 10
nodeApiVersion
required
string
nodeChains
required
Array of strings >= 0 items
nodeVersion
required
string
Enum: "test-singleton" "development" "mainnet01" "testnet04"
nodeGraphHistory
required
Array of integers or (Array of integers or Array of integers) non-empty unique [ items = 2 items ]
Array of all chain graphs indexed by the height of the first block with the repective graph. Graphs are encoded as adjacency lists.

Response samples
200
Content type
application/json

Copy
Expand allCollapse all
{
"value": {
"nodeNumberOfChains": 20,
"nodeApiVersion": "0.0",
"nodeChains": [],
"nodeVersion": "mainnet01",
"nodeGraphHistory": []
}
}
Blocks Event Stream

GET
/header/updates





A source of server events that emits a BlockHeader event for each new block header that is added to the chain database of the remote node.

The stream contains blocks that may later become orphaned. It is therefor recommended to buffer events on the client side for the most recent block heights until the desired confirmation depth is reached.

The server may terminate this stream from time to time and it is up to the client to reinitiate the stream.

Responses
200 A stream of BlockHeader events. This is not a JSON array. Events are separated by empty lines. Each event consists of an event property and a data property which are separated by newlines.
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

RESPONSE SCHEMA: text/event-stream
Array 
event	
string
Value: "BlockHeader"
data	
object
Response samples
200
Content type
text/event-stream

Copy
event:BlockHeader
data:{"txCount":0,"powHash":"00000000000006e0b164858ee0fcbfd112f4242d5010ff33d3a43d2cc3c15177","header":{"creationTime":1619037443761924,"parent":"qaUtvtXk75nXsWM9l6vkeGkQilZfE_YgzWkZm-7tLyE","height":1554652,"hash":"okI4V9Pez5-UPw4nys2Nk9iIPz3-n30HCag5_NQptlo","chainId":6,"weight":"d8mOCoZeFpajAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","featureFlags":0,"epochStart":1619035890499046,"adjacents":{"1":"OTcNZsNMA-TZ9RTlfWqegFiE0ZkBYcy3JCzh23gmm9Y","8":"nznrNdU8RWatTVlS8yTaVaxk8CT1ZjR4ZWta7GAaMDk","9":"CanRK_wW8RjyA1X9xSEQCXymsnk3VERAJtAB2abrY_M"},"payloadHash":"cT86RaKJUyCZXKB3gYqX9A9SNway-lUBrHSvNr7_SaM","chainwebVersion":"mainnet01","target":"zklwTetkWv91YxYIRmXCt6kUHpEBpiN8gwcAAAAAAAA","nonce":"3399765038640884059"},"target":"00000000000007837c23a601911e14a9b7c2654608166375ff5a64eb4d7049ce"}

event:BlockHeader
data:{"txCount":0,"powHash":"00000000000001c40ddfd6574f9962a443714f3817bbea773a55fec63c7d95c8","header":{"creationTime":1619037446256086,"parent":"usmNftUR_mHpXOm8gCvtbZ50_9VaefaIVvcMdrKwc5A","height":1554652,"hash":"SOfbK_kI_9BtgLemWmb3FWOgDCTxf1tPulKCq1ndmWA","chainId":18,"weight":"i7XsQnkhY9yLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","featureFlags":0,"epochStart":1619035885828397,"adjacents":{"19":"fQJ5JKQLdGEwZIoC5HrhJstk3Iibj_a2dfmJl9osG-o","17":"L-GeIWZE4fMCICSpPptsfYpsLj3oO5eCiyJimclYJiY","3":"V7m9ROQmJs2i1UI05t8J6rjkfg7m795esdsIjhqyqfc"},"payloadHash":"Ji7WisfH5IulPMcFglexGcVDnA59aS5k1YSE2_6L4t8","chainwebVersion":"mainnet01","target":"tvH4nBuGx3opw-50T8-i6ECi68IgpFLOjAcAAAAAAAA","nonce":"9499180874660840183"},"target":"000000000000078cce52a420c2eba240e8a2cf4f74eec3297ac7861b9cf8f1b6"}
Blocks Event Stream

GET
/block/updates





A source of server events that emits a Block event for each new block that is added to the chain database of the remote node.

The stream contains blocks that may later become orphaned. It is therefor recommended to buffer events on the client side for the most recent block heights until the desired confirmation depth is reached.

The server may terminate this stream from time to time and it is up to the client to reinitiate the stream.

Responses
200 A stream of Block events. This is not a JSON array. Events are separated by empty lines. Each event consists of an event property and a data property which are separated by newlines.
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

RESPONSE SCHEMA: text/event-stream
Array 
event	
string
Value: "Block"
data	
object
Response samples
200
Content type
text/event-stream

Copy
event:Block
data:{"txCount":0,"powHash":"00000000000006e0b164858ee0fcbfd112f4242d5010ff33d3a43d2cc3c15177","header":{"creationTime":1619037443761924,"parent":"qaUtvtXk75nXsWM9l6vkeGkQilZfE_YgzWkZm-7tLyE","height":1554652,"hash":"okI4V9Pez5-UPw4nys2Nk9iIPz3-n30HCag5_NQptlo","chainId":6,"weight":"d8mOCoZeFpajAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","featureFlags":0,"epochStart":1619035890499046,"adjacents":{"1":"OTcNZsNMA-TZ9RTlfWqegFiE0ZkBYcy3JCzh23gmm9Y","8":"nznrNdU8RWatTVlS8yTaVaxk8CT1ZjR4ZWta7GAaMDk","9":"CanRK_wW8RjyA1X9xSEQCXymsnk3VERAJtAB2abrY_M"},"payloadHash":"cT86RaKJUyCZXKB3gYqX9A9SNway-lUBrHSvNr7_SaM","chainwebVersion":"mainnet01","target":"zklwTetkWv91YxYIRmXCt6kUHpEBpiN8gwcAAAAAAAA","nonce":"3399765038640884059"},"payloadWithOutputs":{"transactions":[],"minerData":"eyJhY2NvdW50IjoiOTljYjcwMDhkN2Q3MGM5NGYxMzhjYzM2NmE4MjVmMGQ5YzgzYThhMmY0YmE4MmM4NmM2NjZlMGFiNmZlY2YzYSIsInByZWRpY2F0ZSI6ImtleXMtYWxsIiwicHVibGljLWtleXMiOlsiOTljYjcwMDhkN2Q3MGM5NGYxMzhjYzM2NmE4MjVmMGQ5YzgzYThhMmY0YmE4MmM4NmM2NjZlMGFiNmZlY2YzYSJdfQ","transactionsHash":"g5dDASOa4cK0nAVmwkvXg-neTRAKG1hwfwRfbQyqpxU","outputsHash":"ZZV9pS034mPB5M0CT7IcoPhscy3lqI4Tyvx0BlPbR9k","payloadHash":"cT86RaKJUyCZXKB3gYqX9A9SNway-lUBrHSvNr7_SaM","coinbase":"eyJnYXMiOjAsInJlc3VsdCI6eyJzdGF0dXMiOiJzdWNjZXNzIiwiZGF0YSI6IldyaXRlIHN1Y2NlZWRlZCJ9LCJyZXFLZXkiOiJJbkZoVlhSMmRGaHJOelZ1V0hOWFRUbHNOblpyWlVkclVXbHNXbVpGWDFsbmVsZHJXbTB0TjNSTWVVVWkiLCJsb2dzIjoiMFZoS2xvckJNc3h6YlJxZWV0M2t1d2hYSk1HZDdFSXl1NEthNllJOG5pRSIsIm1ldGFEYXRhIjpudWxsLCJjb250aW51YXRpb24iOm51bGwsInR4SWQiOjE2MDc0MDN9"},"target":"00000000000007837c23a601911e14a9b7c2654608166375ff5a64eb4d7049ce"}

event:Block
data:{"txCount":0,"powHash":"00000000000001c40ddfd6574f9962a443714f3817bbea773a55fec63c7d95c8","header":{"creationTime":1619037446256086,"parent":"usmNftUR_mHpXOm8gCvtbZ50_9VaefaIVvcMdrKwc5A","height":1554652,"hash":"SOfbK_kI_9BtgLemWmb3FWOgDCTxf1tPulKCq1ndmWA","chainId":18,"weight":"i7XsQnkhY9yLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","featureFlags":0,"epochStart":1619035885828397,"adjacents":{"19":"fQJ5JKQLdGEwZIoC5HrhJstk3Iibj_a2dfmJl9osG-o","17":"L-GeIWZE4fMCICSpPptsfYpsLj3oO5eCiyJimclYJiY","3":"V7m9ROQmJs2i1UI05t8J6rjkfg7m795esdsIjhqyqfc"},"payloadHash":"Ji7WisfH5IulPMcFglexGcVDnA59aS5k1YSE2_6L4t8","chainwebVersion":"mainnet01","target":"tvH4nBuGx3opw-50T8-i6ECi68IgpFLOjAcAAAAAAAA","nonce":"9499180874660840183"},"payloadWithOutputs":{"transactions":[],"minerData":"eyJhY2NvdW50IjoiNmQ4N2ZkNmU1ZTQ3MTg1Y2I0MjE0NTlkMjg4OGJkZGJhN2E2YzBmMmM0YWU1MjQ2ZDVmMzhmOTkzODE4YmI4OSIsInByZWRpY2F0ZSI6ImtleXMtYWxsIiwicHVibGljLWtleXMiOlsiNmQ4N2ZkNmU1ZTQ3MTg1Y2I0MjE0NTlkMjg4OGJkZGJhN2E2YzBmMmM0YWU1MjQ2ZDVmMzhmOTkzODE4YmI4OSJdfQ","transactionsHash":"PZA7NIdgDatkTRZ8AOSI7dOOJzhGAhe7JkovnMp1xks","outputsHash":"YqWnNd_gQLasM2N-dFuT3FndTJCBRAznQyCwb0ttj2M","payloadHash":"Ji7WisfH5IulPMcFglexGcVDnA59aS5k1YSE2_6L4t8","coinbase":"eyJnYXMiOjAsInJlc3VsdCI6eyJzdGF0dXMiOiJzdWNjZXNzIiwiZGF0YSI6IldyaXRlIHN1Y2NlZWRlZCJ9LCJyZXFLZXkiOiJJblZ6YlU1bWRGVlNYMjFJY0ZoUGJUaG5RM1owWWxvMU1GODVWbUZsWm1GSlZuWmpUV1J5UzNkak5VRWkiLCJsb2dzIjoieFVreFdxMFloYW5waUxLR2dZaFhaYjB2QU9WRTJ1d1ZZQnBjRzZpdDVjZyIsIm1ldGFEYXRhIjpudWxsLCJjb250aW51YXRpb24iOm51bGwsInR4SWQiOjcxODI1N30"},"target":"000000000000078cce52a420c2eba240e8a2cf4f74eec3297ac7861b9cf8f1b6"}