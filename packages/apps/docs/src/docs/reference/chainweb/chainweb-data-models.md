---
title: Data models
description:
  Summarizes the data models used for different elements and attributes in Chainweb nodes.
menu: Chainweb API
label: Data models
order: 2
layout: full
tags: ['chainweb', 'node api', 'chainweb api', 'api reference']
---

# Data models

Data models summarize the parameters that define important Chainweb node elements.
The information in the data models is the same as the information covered in the endpoint documentation.
It's duplicated here as a quick reference.

## Cut model

| Parameter | Type | Description
| --------- | ---- | -----------
| origin | object | Defines a peer information object that consists of an `id` string and an `address` object. The `origin` parameter is required to use the `PUT /cut` endpoint. For more information, see the [Peer information](#peer-information-modelh-1716301923) data model.
| height&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Defines the cut height. The cut height is the sum of the height of all blocks of the cut. You should avoid using this value in any applications or tools because its semantics might change.
| weight&nbsp;(required) | string | Defines the cut weight. The cut weight is the sum of the weights from all of the blocks included in the cut. The weight string consists of 43 characters from the [a-zA-Z0-9_-] character set.
| hashes&nbsp;(required) | object | Defines an object that maps chain identifiers to their respective block `hash` and block `height`. The block `hash` property is a required string value with characters from the [a-zA-Z0-9_-] character set. The block `height` property is a required integer value >= 0. The `hashes` object includes the `height` and `hash` properties for each chain, as illustrated for chains 0 and 1 in the truncated JSON example.
| instance | string | Defines the network identifier for the cut.
| id | string | Defines a cut identifier.

```json
{
  "origin": null,
  "height": 30798466,
  "weight": "b0wYplmNiTBXCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  "hashes": {
    "0": {
      "height": 1539923,
      "hash": "qEaSmWt_tDcJC9AGbgWY9x12LW5VED7hGgfyz9x_S3w"
    },
    "1": {
      "height": 1539923,
      "hash": "TJuC6nfhamfD517gspAZmqD9umR71nAgttDOi1JbBHw"
    },
  },
  "id": "BBz7KeurYTeQ0hMGbwUbQC84cRbVcacoDQTye-3qkXI",
  "instance": "mainnet01"
}
```

## Block header model

| Parameter | Type | Description
| --------- | ---- | -----------
| creationTime&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Records the time the block was created. This timestamp is in microseconds since the start of the UNIX epoch.
| parent (required) | string | Records the parent block hash. The block hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the [a-zA-Z0-9_-] character set.
| height (required) | integer >= 0 | Identifies the block height for the block. The height of a block is the number of its predecessors in the block chain.
| hash (required) | string | Block hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the [a-zA-Z0-9_-] character set.
| chainId (required) | integer >= 0 | Specifies the Chainweb chain identifier. In Kadena, Chainweb chains are named by numbers starting from 0. Valid values depend on the current graph at the respective block height of the Chainweb version.
| weight (required) | string | Specifies the block weight for the block. Block weight is a Base64Url-encoded string—without padding—that consists of 43 characters from the [a-zA-Z0-9_-] character set. The weight of a block is the sum of the difficulties of the block and of all of its ancestors. The difficulty of a block is the maximum difficulty divided by the target. The string is a 256-bit little endian encoding of the numerical value.
| featureFlags (required) | integer | Specifies a reserved value that must be 0.
| epochStart (required) | integer >= 0 | Specifies a timestamp in microseconds since the start of the UNIX epoch.
| adjacents (required) | object | Records the block hashes of the adjacent parents of the block. This is represented as an associative array that maps the adjacent chain ids to the respective block hash. Each block hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the [a-zA-Z0-9_-] character set.
| payloadHash (required) | string | Specifies the block payload hash. The payload hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the [a-zA-Z0-9_-] character set.
| chainwebVersion&nbsp;(required) | enum | Specifies the Chainweb network version identifier for the Kadena network. The valid values are "test-singleton", "development", "mainnet01", and "testnet04".
| target (required) | string | Specifies the proof-of-work target for the block. The proof-of-work target for a block is a Base64Url-encoded string—without padding—that consists of 43 characters from the [a-zA-Z0-9_-] character set. The string is a 256-bit little endian encoding of the numerical value.
| nonce (required) | string | Specifies the proof-of-work nonce for the block. This value is computed by the miner such that the block hash is smaller than the target.

```json
{
  "creationTime": 1721071750065287,
  "nonce": "16462985723698616006",
  "parent": "g-N8bZuyno0rkPyJZShFQzU5Den2rey1qlflnJuizzQ",
  "adjacents": {
      "19": "YlpdztdOQ-ChRklldcC2oHbZlAMIiYAGRgzTZBXvRgY",
      "14": "VosxlCQP8q0cPi3zd_yD_099Untb69bnIgIFlAioj9I",
      "9": "GXv0fxVXgDQTtRTxMjWfr6JXXrSscoaCaxEDPC93QIg"
  },
  "target": "ikpunXJe5dbyqNaNMDhOWhBtJeLpVENWFQAAAAAAAAA",
  "payloadHash": "bVqvJPaU98NLqPCMmaBy2v67XnzFi6c1Ei6NLZjZVvI",
  "chainId": 4,
  "weight": "FahB1Biuxv0BSQEAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  "height": 4953816,
  "chainwebVersion": "mainnet01",
  "epochStart": 1721068523032689,
  "featureFlags": 0,
  "hash": "tsFkxqNHy_WbdnDDTumV_2MFjMQTyJrzb8--dO3kjjM"
},
```

## Payload model

| Parameter | Type | Description
| --------- | ---- | -----------
| transactions&nbsp;(required) | Array&nbsp;of&nbsp;strings | Array of Base64Url encoded strings without padding that represent signed Pact transactions in JSON format.
| minerData&nbsp;(required) | string | Miner information is a Base64Url-encoded string—without padding—that consists of 43 characters from the `a-zA-Z0-9_-` character set. This information is included as part of the payload in the JSON object.
| transactionsHash&nbsp;(required) | string | The transaction hash is a SHA256 hash. The hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the [a-zA-Z0-9_-] character set.
| outputsHash&nbsp;(required) | string | The output hash is a SHA256 hash. The hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the [a-zA-Z0-9_-] character set.
| payloadHash&nbsp;(required) | string | The block payload hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the [a-zA-Z0-9_-] character set.

```json
{
  "transactions": [
    "eyJoYXNoIjoiMi16Q3dmRFZZR010WHljd2pTLXRlNzh5U3l3T3JXcjNSdUhiQlJnNDdhRSIsInNpZ3MiOlt7InNpZyI6ImZiMTVkNzkyYTNkNDM1MDI5ODJmOGQ1MGUyMzA1NTI5OWEwZjdhMWRmMWE4YjUyMmE5NTMxNWUyZDljY2MyNmE1MzI4M2I5YTNhNDM5ZWE0ZGY4MGM1ZTIwMjg4NDhjNjFhMWY0MGM5OWIyOTYzOWM0NGNkYTgwMzBmYmViYjBjIn1dLCJjbWQiOiJ7XCJuZXR3b3JrSWRcIjpcIm1haW5uZXQwMVwiLFwicGF5bG9hZFwiOntcImV4ZWNcIjp7XCJkYXRhXCI6e30sXCJjb2RlXCI6XCIoY29pbi50cmFuc2ZlciBcXFwiZTc1NzU4ZGQyYTFjNTk2NDRjMjJlMDQyYzZlYzA3NTI2ZWE0ZTU3MTU0ZjlkYmMyMDc2ZThhODRhYzE5NGYzMlxcXCIgXFxcIjQ2NzdhMDllYTE2MDJlNGUwOWZlMDFlYjExOTZjZjQ3YzBmNDRhYTQ0YWFjOTAzZDVmNjFiZTdkYTM0MjUxMjhcXFwiIDMuNzc2KVwifX0sXCJzaWduZXJzXCI6W3tcInB1YktleVwiOlwiZTc1NzU4ZGQyYTFjNTk2NDRjMjJlMDQyYzZlYzA3NTI2ZWE0ZTU3MTU0ZjlkYmMyMDc2ZThhODRhYzE5NGYzMlwiLFwiY2xpc3RcIjpbe1wiYXJnc1wiOltdLFwibmFtZVwiOlwiY29pbi5HQVNcIn0se1wiYXJnc1wiOltcImU3NTc1OGRkMmExYzU5NjQ0YzIyZTA0MmM2ZWMwNzUyNmVhNGU1NzE1NGY5ZGJjMjA3NmU4YTg0YWMxOTRmMzJcIixcIjQ2NzdhMDllYTE2MDJlNGUwOWZlMDFlYjExOTZjZjQ3YzBmNDRhYTQ0YWFjOTAzZDVmNjFiZTdkYTM0MjUxMjhcIiwzLjc3Nl0sXCJuYW1lXCI6XCJjb2luLlRSQU5TRkVSXCJ9XX1dLFwibWV0YVwiOntcImNyZWF0aW9uVGltZVwiOjE2MDIzODI4MTQsXCJ0dGxcIjoyODgwMCxcImdhc0xpbWl0XCI6NjAwLFwiY2hhaW5JZFwiOlwiMFwiLFwiZ2FzUHJpY2VcIjoxLjBlLTUsXCJzZW5kZXJcIjpcImU3NTc1OGRkMmExYzU5NjQ0YzIyZTA0MmM2ZWMwNzUyNmVhNGU1NzE1NGY5ZGJjMjA3NmU4YTg0YWMxOTRmMzJcIn0sXCJub25jZVwiOlwiXFxcIjIwMjAtMTAtMTFUMDI6MjE6MTQuMTk0WlxcXCJcIn0ifQ"
  ],
  "minerData": "eyJhY2NvdW50IjoiYTFiMzE0MGNiN2NjODk1YzBlMDkxNzAyZWQwNTU3OWZiZTA1YzZlNjc0NWY4MmNlNjAzNzQ2YjQwMGM4MTU0OCIsInByZWRpY2F0ZSI6ImtleXMtYWxsIiwicHVibGljLWtleXMiOlsiYTFiMzE0MGNiN2NjODk1YzBlMDkxNzAyZWQwNTU3OWZiZTA1YzZlNjc0NWY4MmNlNjAzNzQ2YjQwMGM4MTU0OCJdfQ",
  "transactionsHash": "lWcQRlj3MV7FSem8P4G-8GMRf1-O7zQqi_AwmWnk-N0",
  "outputsHash": "9BzXZbhjSSevp4K0bYFqi1GdLjeX_DB-4u1T5Em8abs",
  "payloadHash": "jcQOWz7K9qKnkUv4Z883D2ZjkFFGgccoSroWGaoogLM"
}
```

## Payload with outputs model

| Parameter | Type | Description
| --------- | ---- | -----------
| transactions&nbsp;(required) | Array&nbsp;of&nbsp;strings | Array with pairs of strings that represent transactions and their outputs. Signed Pact transactions and their outputs are both Base64Url-encoded strings—without padding—that represent signed Pact transactions in JSON format.
| minerData (required) | string | Miner information is a Base64Url-encoded string—without padding—that consists of characters from the [a-zA-Z0-9_-] character set. This information is included as part of the payload JSON object.
| transactionsHash&nbsp;(required) | string | The transaction hash is a SHA256 hash. The hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the [a-zA-Z0-9_-] character set.
| outputsHash (required) | string | The output hash is a SHA256 hash. The hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the [a-zA-Z0-9_-] character set.
| payloadHash (required) | string | The block payload hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the [a-zA-Z0-9_-] character set.
| coinbase (required) | string | Coinbase output is a Base64Url-encoded string—without padding—that consists of characters from the [a-zA-Z0-9_-] character set. This information is included as part of the payload output JSON object.


```json
{
  "transactions": [],
  "minerData": "eyJhY2NvdW50IjoiYTFiMzE0MGNiN2NjODk1YzBlMDkxNzAyZWQwNTU3OWZiZTA1YzZlNjc0NWY4MmNlNjAzNzQ2YjQwMGM4MTU0OCIsInByZWRpY2F0ZSI6ImtleXMtYWxsIiwicHVibGljLWtleXMiOlsiYTFiMzE0MGNiN2NjODk1YzBlMDkxNzAyZWQwNTU3OWZiZTA1YzZlNjc0NWY4MmNlNjAzNzQ2YjQwMGM4MTU0OCJdfQ",
  "transactionsHash": "nT0j4xw2woMkdXXaopdurXIn24OG-jNMqQzUGfxV_MA",
  "outputsHash": "4pXRrZ2K0_V0iGAxQCKrKdLjQTBZHBOQS7P-47kdnhY",
  "payloadHash": "GpaWbHkHrCjRhY8hKE0qZ1WsBBaG3Y_zkFLV2sYumQA",
  "coinbase": "eyJnYXMiOjAsInJlc3VsdCI6eyJzdGF0dXMiOiJzdWNjZXNzIiwiZGF0YSI6IldyaXRlIHN1Y2NlZWRlZCJ9LCJyZXFLZXkiOiJJa2hoV0VGQ2NURlFTMU5MYkdodVkwcHJNRjlOZERjMVgyeE1OMDVUTTNkSk5qSTNVV1pZV2w4NE5Xc2kiLCJsb2dzIjoiZ3Noak1kWFJrVGxKYmIxalZkQWJ6SVVDcGpQb1JBQ2pEbExzRzBXNkJEMCIsIm1ldGFEYXRhIjpudWxsLCJjb250aW51YXRpb24iOm51bGwsInR4SWQiOjEyNzIzNTB9"
}
```

## Peer information model

| Parameter | Type | Description
| --------- | ---- | -----------
| id (required) | string&nbsp;or&nbsp;null | The `id` is a Base64Url-encoded string—without padding—that consists of characters from the `a-zA-Z0-9_-` character set. This string represents the SHA256 fingerprint of the SSL certificate of the node. The field can be null only if the node uses an official CA-signed certificate.
| address&nbsp;(required) | object | The `address` contains a `hostname` and `port` number. The `hostname` is a required string value in the form of a domain name, IPv4 IP address, or IPv6 IP address. The hostname must be a domain name only if the node uses a valid CA-signed SSL certificate. The `port` is a required integer value [1 .. 65535] that hosts the peer node.

```json
{
  "address": {
    "hostname": "85.238.99.91",
    "port": 30004
  },
  "id": "PRLmVUcc9AH3fyfMYiWeC4nV2i1iHwc0-aM7iAO8h18"
}
```

Note that it is generally easier to query the peer information for a node using a GET query for the peer database. 
To get the Base64Url-encoded SHA256 fingerprint peer `id` for peers with self-signed certificates, run a command like this for the specified chainweb-node NODE:

```bash
echo |
openssl s_client -showcerts -servername ${NODE} -connect ${NODE}:443 2>/dev/null |
openssl x509 -fingerprint -noout -sha256 |
sed 's/://g' |
tail -c 65 |
xxd -r -p |
base64 |
tr -d '=' |
tr '/+' '_-'
```

For example, to get the peer id for a testnet bootstrap server:

```bash
echo |
openssl s_client -showcerts -servername us-e1.chainweb.com  -connect us-e1.chainweb.com:443 2>/dev/null |
openssl x509 -fingerprint -noout -sha256 |
sed 's/://g' |
tail -c 65 |
xxd -r -p |
base64 |
tr -d '=' |
tr '/+' '_-'
```

The output from running this command is the peer id:

```bash
vPELrRZEn3km96owfL0ANJbOBeeUGnEBOx0AGCTZsdA
```

## Chainweb node information model

| Parameter | Type | Description
| --------- | ---- | -----------
| nodeNumberOfChains&nbsp;(required) | integer&nbsp;>=&nbsp;10 | Number of chains in the network the node is part of.
| nodeApiVersion (required) | string | Chainweb API version information for the node.
| nodeChains (required) | Array&nbsp;of&nbsp;strings | Chain identifiers for the chains in the network the node is part of.
| nodeVersion (required) | string | Network identifier for the network the node is part of. The valid values are  "test-singleton", "development", "mainnet01", and "testnet04".
| nodeGraphHistory&nbsp;(required) | Array&nbsp;of&nbsp;integers | Array of all chain graphs indexed by the height of the first block with the respective graph. Graphs are encoded as adjacency lists.

```json
{
  "nodeNumberOfChains": 20,
  "nodeApiVersion": "0.0",
  "nodeChains": [ "12", "13", "..."],
  "nodeVersion": "mainnet01",
  "nodeGraphHistory": [
    [ 0,
      [ ]
    ],
    [
      852054,
      [ ]
    ]
  ]
}
```

## Collection page model

| Parameter | Type | Description
| --------- | ---- | -----------
| limit&nbsp;(required) | integer&nbsp;>=&nbsp;0 | The maximum number of items in the page. This number can be smaller but never be larger than the number of requested items.
| next&nbsp;(required) | string&nbsp;or&nbsp;null | A cursor that can be used to query the next page. It should be used literally as the value for the `next` parameter in a follow-up request.
| items&nbsp;(required) | any | The items in the page.

```json
{
  "next": "inclusive:o1S4NNFhKWg8T1HEkmDvsTH9Ut9l3_qHRpp00yRKZIk",
  "items": [
    "AAAAAAAAAABRoiLHW7EFAB2lwAatTykipYZ3CZNPzLe-f5S-zUt8COtu0H12f_OZAwAFAAAAMpic85rur2MYf3zli8s8bHxTFjriFoMPTr6ZPs8sjxMKAAAAVBKuhU_hQmuvKlx88A5o-FH0rzNo59NsdxmOGNBQ-ycPAAAAMItdqgHZxf7j6l0oE8X-G9-VyMbnQmZrtSniuRe_EJ9CtyxsSb7daPIIYAaXMgSEsQ3dkxY5GjJjLwAAAAAAABqWlmx5B6wo0YWPIShNKmdVrAQWht2P85BS1drGLpkAAAAAADUJ-ARn7blgHgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEIPAAAAAAAFAAAA-na5gFuxBQAFL-3CY4YuAJNGp9KhDkbrKkIPWYyq8WvtAaNPoUFWC16louSx8YN5",
    "AAAAAAAAAAA0slHKW7EFAJNGp9KhDkbrKkIPWYyq8WvtAaNPoUFWC16louSx8YN5AwAFAAAAALcxv1ZiwwQ_QX9eOBZMbzIop6n7XtveS1FqOFwyvGMKAAAAC76ElC60qXSJQCHePpzzJxsCYvvrqvmkoHPyZnex-4QPAAAAKv0sz_rTANjoiJwMrdZFCJNFwdH0U_M5ouwMr3BXBfpCtyxsSb7daPIIYAaXMgSEsQ3dkxY5GjJjLwAAAAAAALJlIg1vY3w_9L63bePn1yk_5agvdEbIBBjm3adxc5xWAAAAAGzpBzdiVL9gHgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQUIPAAAAAAAFAAAA-na5gFuxBQALiBhXgqaHAb4VWug3oddEVy0X9y_jEkE2Kmi_vyGP5ovr-fDIz_Uf"
    ],
  "limit": 2
}
```

## Miner information model

| Parameter | Type | Description
| --------- | ---- | -----------
| account	| string | Account name is the miner account name. In most cases, the account name is the public key with the `k:` prefix.
| predicate	| enum | The key predicate guard for the account. For accounts with a single key, this is usually `keys-all`.
| public&#8209;keys	| Array&nbsp;of&nbsp;strings | Miner public key.

```json
{
  "account": "miner",
  "predicate": "keys-all",
  "public-keys": [
    "f880a433d6e2a13a32b6169030f56245efdd8c1b8a5027e9ce98a88e886bef27"
  ]
}
```

## Mining update event stream model

The update event stream model describes the server-sent events that notify miners when new mining work becomes available. 
The stream is terminated by the server in regular intervals and it is up to the client to request a new stream.

Each event consists of a single line. 
Events are separated by empty lines.

| Parameter | Type | Description
| --------- | ---- | -----------
| events | Array | Each event	consists of the string value "event:New Cut".

```text
event:New Cut

event:New Cut

event:New Cut
```
