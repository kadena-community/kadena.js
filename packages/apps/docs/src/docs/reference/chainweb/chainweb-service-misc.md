---
title: Maintenance and other services endpoints
description:
  Provides reference information for the endpoints you can use to query or update information about the chainweb-node configuration, backups, health check, and other services.
menu: Chainweb API
label: Maintenance endpoints
order: 2
layout: full
tags: ['chainweb', 'node api', 'chainweb api', 'api reference']
---

# Maintenance and other services endpoints

There are several endpoints you can use to query or update information about a Chainweb node, including its current configuration and availability.

## Start a backup job

Use `POST https://{basaeURL}/make-backup` to start a backup job for a Chainweb node.
Starting a backup job creates a UNIX timestamp for the job that can then be used to identify and  determine if it is still in progress or the backup has been completed.

If a backup job is already in progress, this endpoint returns the in-progress backup job identifier instead of starting a new backup job.

The RocksDB portion of the Chainweb database is always backed up.
If you set the `backupPact` option, the backup job includes the Pact Sqlite portion of the Chainweb database in the backup.
Backing up both databases takes much longer than only backing up the RockDB database.

There is no automatic backup retention policy.
You should define your own policy and delete old backup copies, as appropriate.

You can enable the backup API for a node by adding the following lines to the node configuration:

```yaml
backup:
  api:
    enabled: true
  directory: path-to-backups-directory
```

Ideally, you should locate the backup directory in the same partition as the RocksDB portion of the Chainweb node database.

Storing RocksDB backups in the same partition as the active RocksDB database minimizes the space required and the time it takes to complete backups initially.
Over time—as the active database diverges from the backup copy—the space required will increase. 
If you store the backup on another partition, the backup operation takes longer and the backup copy requires as much disk space as the active RocksDB database.

Pact database backups always require about as much space as the active Pact database does.

### Query parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| backupPact | any | Indicates that you want to back up both the RockDB database and the Pact database. This option requires additional disk space and increases the time required to complete the backup.

### Responses

Requests to the `POST https://{basaeURL}/make-backup` endpoint return the following response code:

- **200 OK** indicates that a backup job has been created.

### Response header

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr | string | Specifies the host address and port number of the client as observed by the remote Chainweb node. The host address can be a domain name or an IP address in IPv4 or IPv6 format. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

#### Response schema

The response returns `text/plain` content with the following information:

| Parameter | Type | Description
| --------- | ---- | -----------
| backupId | string | Specifies the backup job identifier with a UNIX timestamp from the `a-zA-Z0-9_-` character set.

## Check the status of a backup job

Use `GET https://{baseURL}/check-backup/{backupId}` to check the status of a backup job.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| backupId (required) | string | Specifies the backup job identifier with a UNIX timestamp from the `a-zA-Z0-9_-` character set. For example: 1648665437000

### Responses

Requests to the `GET https://{baseURL}/check-backup` endpoint can return the following response codes:

- **200 OK** indicates that a backup job with the specified identifier exists and returns its current status.
- **404 Not Found** indicates that there were no backup jobs matching the specified identifier.

#### Response header

The response header consists of the following parameters:

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr	| string | Specifies the host address and port number of the client as observed by the remote chainweb node in the format ^\d{4}.\d{4}.\d{4}.\d{4}:\d+$. For example: "10.36.1.3:42988"
| x-server-timestamp | integer >= 0 | Specifies the clock time of the remote chainweb node using the UNIX epoch timestamp. For example: 1618597601
| x-chainweb-node-version	| string | Specifies the version of the remote chainweb node. For example: "2.23"

#### Response schema

The response returns `text/plain` content with the following information:

| Parameter | Type | Description
| --------- | ---- | -----------
| status | string | Specifies the status of the backup job with the specified identifier. There are three possible status messages: `backup-done`, `backup-in-progress`, and `backup-failed`.

## Check node health

Use `GET https://{baseURL}/health-check` to check whether `chainweb-node` is running and responding to API requests. 
To check the state of consensus, you should use the `GET /cut` endpoint instead of this endpoint.

### Responses

Requests to the `/health-check` endpoint return the following response code:

- **200 OK** indicates that the node is running and responding to API requests.

#### Response header

The response header consists of the following parameters:

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr	| string | Specifies the host address and port number of the client as observed by the remote chainweb node in the format ^\d{4}.\d{4}.\d{4}.\d{4}:\d+$. For example: "10.36.1.3:42988"
| x-server-timestamp | integer >= 0 | Specifies the clock time of the remote chainweb node using the UNIX epoch timestamp. For example: 1618597601
| x-chainweb-node-version	| string | Specifies the version of the remote chainweb node. For example: "2.23"

#### Response schema

The response returns `text/plain` content with the following information:

| Parameter | Type | Description
| --------- | ---- | -----------
| check | string | Health check OK.

## Get general node information

Use `GET https://{baseURL}/info` to return general information about the node and the Chainweb version.

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
## Blocks event stream

Use `GET https://{baseURL}/header/updates` to connect to a source of server events that emits a BlockHeader event for each new block header that is added to the chain database of the remote node.

The stream contains blocks that may later become orphaned. 
It is therefor recommended to buffer events on the client side for the most recent block heights until the desired confirmation depth is reached.

The server may terminate this stream from time to time and it is up to the client to reinitiate the stream.

Responses

- **200 OK** A stream of BlockHeader events. This is not a JSON array. Events are separated by empty lines. Each event consists of an event property and a data property which are separated by newlines.

RESPONSE HEADERS

!!!include(chainweb-response-headers.md)!!!

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

## Blocks Event Stream

GET /block/updates





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