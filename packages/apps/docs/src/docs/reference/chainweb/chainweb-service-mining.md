---
title: Mining endpoints
description:
  Provides reference information for the chainweb-node block endpoints.
menu: Chainweb API
label: Mining endpoints
order: 2
layout: full
tags: ['chainweb', 'node api', 'chainweb api', 'api reference']
---

# Mining endpoints

Mining Endpoints
The Mining API of Chainweb node is disabled by default. It can be enabled and configured in the configuration file.

The mining API consists of the following endpoints that are described in detail on the Chainweb mining wiki page

GET mining/work
POST mining/solved
GET mining/updates
Get Mining Work

GET
/mining/work

A new BlockHeader to mine on

REQUEST BODY SCHEMA: application/json
Miner Info

account	
string (Account Name)
Miner account name. Usually this is the same as the public key.

predicate	
any (Key Predicate)
Enum: "keys-all" "keys-any"
key predicate. For a single key this is usually keys-all.

public-keys	
Array of strings (Miner Public Key)
Responses
200 A mining work item
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

RESPONSE SCHEMA: application/octet-stream
chainBytes	
string <binary> (4 Chain ID Bytes)
The chain selection made by the Node. This is informational. Generally, miner should not care about the chain.

targetBytes	
string <binary> (32 PoW Target Bytes)
The PoW target for the current block. The PoW hash of a valid block must not be larger than this value.

For arithmetic comparisons the hash-target and the PoW hash are interpreted as unsigned 256 bit integral number in little endian encoding.

headerBytes	
string <binary> (286 Work Header Bytes)
PoW Work Header Bytes. The last 8 bytes are the nonce. The creation time is encoded in bytes 44-52. Miners must not change or make any assumption about the other bytes.

The creation time is encoded as little endian twoth complement integral number that counts SI microseconds since POSIX epoch (leap seconds are ignored). It always positive (highest bit is 0). Miners are free but not required to update the creation time. The value must be strictly larger than the creation time of the parent block and must not be in the future.

Request samples
Payload
Content type
application/json

Copy
Expand allCollapse all
{
"account": "miner",
"predicate": "keys-all",
"public-keys": [
"f880a433d6e2a13a32b6169030f56245efdd8c1b8a5027e9ce98a88e886bef27"
]
}
Solved Mining Work

POST
/chainweb/0.0/mainnet01/mining/solved

Submit a solution for a new block

REQUEST BODY SCHEMA: application/octet-stream
The solved PoW work header bytes

string <binary> (286 Solved PoW Work Header Bytes)
The original work received that was received from /mining/work with updated nonce value such that it satisfies the Proof-of-Work. The nonce are last 8 bytes of the work header bytes.

The PoW hash of a valid block is computed using blake2s. It must not be larger than the PoW target for the current block. The target was received along with the work header bytes from the /mining/work endpoint. For arithmetic comparisons the hash-target and the PoW hash are interpreted as unsigned 256 bit integral number in little endian encoding.

Miners are free but not required to also update the creation time. The value must be strictly larger than the creation time of the parent block and must not be in the future.

Responses
204 Solved mining work is valid
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

Notification of Updated Work

GET
/mining/updates

An server-sent event sources that notifies miners when new mining work becomes available.

The stream is terminated by the server in regular intervals and it is up to the client to request a new stream.

REQUEST BODY SCHEMA: application/octet-stream
The first 4 bytes received from a call to /mining/work. This tells the Node to only inform the Miner of a new Cut when the specific chain in question has updated.

string <binary> (4 Chain ID bytes)
Responses
200 Each events consists of a single line: event:New Cut. Events are separated by empty lines.
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
Value: "New Cut"
Response samples
200
Content type
text/event-stream

Copy
event:New Cut

event:New Cut

event:New Cut
