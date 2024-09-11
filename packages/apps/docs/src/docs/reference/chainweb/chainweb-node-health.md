---
title: Node health and information
description:
  Provides reference information for the endpoints you can use to check the current availability and general information for a node.
menu: Chainweb API
label: Node health and information
order: 2
layout: full
tags: ['chainweb', 'node api', 'chainweb api', 'api reference']
---

# Node health and information endpoints

The node health and general information endpoints enable you to check the current availability and general information for a node.

## Check node health

Use `GET http://{baseURL}/health-check` to check whether `chainweb-node` is running and responding to API requests. 
To check the state of consensus, you should use the `GET https://{baseURL}/cut` endpoint instead of this endpoint.

### Responses

Requests to the `/health-check` endpoint return the following response code:

- **200 OK** indicates that the node is running and responding to API requests.

#### Response header

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
| check | string | Health check OK.

### Examples

You can send a health check request to a node like this:

```Postman
GET http://api.chainweb.com/health-check
```

This request returns a plain text message like this:

```text
Health check OK.
```

## Get general node information

Use `GET http://{baseURL}/info` to return general information about the node and the Chainweb version.

### Responses

Requests to the `GET http://{baseURL}/info` endpoint return the following response code:

- **200 OK** indicates that the request succeeded and the response body returns general information about the node and the chains in the network.

#### Response header

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr | string | Specifies the host address and port number of the client as observed by the remote Chainweb node. The host address can be a domain name or an IP address in IPv4 or IPv6 format. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

#### Response schema

If the request is successful, the response returns `application/json` content with the following:

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| nodeApiVersion&nbsp;(required) | string | Specifies the Chainweb API version information for the node.|
| nodeBlockDelay&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the number of seconds to delay between blocks. |
| nodeChains&nbsp;(required) | Array&nbsp;of&nbsp;strings| Specifies the chain identifiers for the chains in the network the node is part of. |
| nodeGenesisHeights&nbsp;(required) | Array&nbsp;of&nbsp;integers | Specifies the block height for the first block of each chain in the network.|
| nodeGraphHistory&nbsp;(required) | Array&nbsp;of&nbsp;integers | Specifies the block height and adjacent chains for all chain graphs indexed by the height of the first block with the respective graph. Graphs are encoded as adjacency lists.
| nodeHistoricalChains&nbsp;(required) | Array&nbsp;of&nbsp;integers | Specifies the block height and adjacent chains for all chain graphs indexed by the height of the first block for the graph. Graphs are encoded as adjacency lists.|
| nodeLatestBehaviorHeight&nbsp;(required) | integer | Specifies the latest block height for the node. |
| nodeNumberOfChains&nbsp;(required) | integer&nbsp;>=&nbsp;10 | Specifies the number of chains in the network the node is part of. |
| nodePackageVersion&nbsp;(required) | string | Specifies the release package version for the `chainweb-node` software package running on the node. |
| nodeServiceDate&nbsp;(required) | string | Specifies the next service date for updating the `chainweb-node` software package running on the node. |
| nodeVersion&nbsp;(required) | string | Specifies the network identifier for the network the node is part of. The valid values are  "test-singleton", "development", "mainnet01", and "testnet04".|

### Examples

You can send a request for general information to a node like this:

```Postman
GET http://api.chainweb.com/info
```

This request returns information similar to the following truncated excerpt:

```json
{
    "nodeApiVersion": "0.0",
    "nodeBlockDelay": 30000000,
    "nodeChains": [
        "17",
        "16",
        "19",
    ],
    "nodeGenesisHeights": [
        [
            "17",
            852054
        ],
        [
            "16",
            852054
        ],
        [
            "19",
            852054
        ],
    ],
    "nodeGraphHistory": [
        [
            852054,
            [
                [
                    17,
                    [
                        16,
                        18,
                        2
                    ]
                ],
            ],
        ],
    ],
    "nodeHistoricalChains": [
        [
            852054,
            [
                [
                    17,
                    [
                        16,
                        18,
                        2
                    ]
                ],
            ],
         ],
      ],
    "nodeLatestBehaviorHeight": 4819247,
    "nodeNumberOfChains": 20,
    "nodePackageVersion": "2.24.1",
    "nodeServiceDate": "2024-08-21T00:00:00Z",
    "nodeVersion": "mainnet01"
}
```
