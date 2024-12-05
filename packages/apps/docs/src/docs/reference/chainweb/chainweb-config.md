---
title: Configuration endpoint
description:
  Provides reference information for the chainweb-node config endpoint.
menu: Chainweb API
label: Config endpoint
order: 2
layout: full
tags: ['chainweb', 'node api', 'chainweb api', 'api reference']
---

# Configuration endpoint

Use `GET https://{hostname}/config` to return configuration information for a Chainweb node.
The configuration details are returned as a JSON object with sensitive information removed from the result. 
The JSON schema depends on the version of the `chainweb-node` software running on the node and is not part of the stable `chainweb-node` API.

### Responses

Requests to the `/config` endpoint return the following response code:

- **200 OK** returns the configuration details for the Chainweb node.

### Response header

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr | string | Specifies the host address and port number of the client as observed by the remote Chainweb node. The host address can be a domain name or an IP address in IPv4 or IPv6 format. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

#### Response schema

The content of the JSON schema depends on the version of the `chainweb-node` software running on the node and is not part of the stable `chainweb-node` API.

### Examples

You can send a request to a Kadena main network bootstrap node by calling the `/config` endpoint.
For example:

```Postman
GET https://us-e1.chainweb.com/config
```

You can send a request to a Kadena test network bootstrap node like this:

```Postman
GET https://us1.testnet.chainweb.com/config
```

These sample requests return the schema for `chainweb-node` version 2.24.1. 

For the bootstrap node, the response looks similar to the following:

```json
{
    "allowReadsInLocal": false,
    "backup": {
        "api": {
            "configuration": {},
            "enabled": false
        },
        "directory": null
    },
    "chainwebVersion": "mainnet01",
    "cuts": {
        "fastForwardBlockHeightLimit": null,
        "fetchTimeout": 3000000,
        "initialBlockHeightLimit": null,
        "pruneChainDatabase": "none"
    },
    "enableLocalTimeout": false,
    "fullHistoricPactState": true,
    "gasLimitOfBlock": 150000,
    "headerStream": false,
    "logGas": false,
    "mempoolP2p": {
        "configuration": {
            "maxSessionCount": 6,
            "pollInterval": 30,
            "sessionTimeout": 300
        },
        "enabled": false
    },
    "minGasPrice": 1.0e-8,
    "mining": {
        "coordination": {
            "enabled": false,
            "limit": 1200,
            "miners": [],
            "payloadRefreshDelay": 15000000,
            "updateStreamLimit": 2000,
            "updateStreamTimeout": 240
        },
        "nodeMining": {
            "enabled": false,
            "miner": {
                "account": "",
                "predicate": "keys-all",
                "public-keys": []
            }
        }
    },
    "moduleCacheLimit": 62914560,
    "onlySyncPact": false,
    "p2p": {
        "bootstrapReachability": 0,
        "ignoreBootstrapNodes": false,
        "maxPeerCount": 1000,
        "maxSessionCount": 10,
        "peer": {
            "certificateChain": null,
            "certificateChainFile": null,
            "hostaddress": {
                "hostname": "us-e1.chainweb.com",
                "port": 443
            },
            "interface": "*",
            "key": null,
            "keyFile": null
        },
        "peers": [
            {
                "address": {
                    "hostname": "us-e1.chainweb.com",
                    "port": 443
                },
                "id": null
            },
            {
                "address": {
                    "hostname": "fr1.chainweb.com",
                    "port": 443
                },
                "id": null
            },
        ],
        "private": false,
        "sessionTimeout": 240
    },
    "pactQueueSize": 2000,
    "preInsertCheckTimeout": 1000000,
    "readOnlyReplay": false,
    "reintroTxs": true,
    "reorgLimit": 480,
    "rosetta": false,
    "serviceApi": {
        "interface": "invalid",
        "payloadBatchLimit": 1000,
        "port": 0,
        "validateSpec": false
    },
    "syncPactChains": null,
    "throttling": {
        "global": 50,
        "mempool": 20,
        "putPeer": 11
    }
}
```

To get configuration for a local development network, you can call the `/config` endpoint like this:

```Postman
GET https://us-e1.chainweb.com/config
```