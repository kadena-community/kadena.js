---
title: Chainweb REST API
description:
  The Chainweb node API consists of two distinct sets of API endpoints. The peer-to-peer (P2P) API provides endpoints for nodes to communicate with each other. The Chainweb service API provides endpoints for clients interacting with nodes.
menu: Chainweb API
label: Introduction
order: 2
layout: full
tags: ['chainweb-node', 'rest api', 'chainweb api', 'node operators']
---

# Chainweb node API

As discussed in [Chainweb simplified](/learn/chainweb), Chainweb is a scalable proof-of-work (PoW) consensus algorithm. 
Chainweb extends the Bitcoin Nakamoto consensus algorithm, a protocol designed for a single chain, to handle consensus with transactions coming from multiple parallel chains. 
Because Chainweb scales horizontally by using multiple chains, the Kadena network provides better transaction throughput with lower transaction fees than other proof-of-work blockchains.

The Chainweb node API consists of two distinct APIs: the peer-to-peer (P2P) API and the service API. 

- The **peer-to-peer API** contains the RPC endpoints that nodes must expose to support consensus and the queueing and processing of transactions. The peer-to-peer endpoints are intended primarily for communication between Chainweb nodes and are typically more efficient than the service API endpoints for most use cases. 

- The **service API** contains endpoints that can be used to connect to Chainweb nodes from clients outside of the blockchain network.
How you connect to the endpoints in these two APIs depends on the configuration of the Chainweb node.

For more information about the peer-to-peer API and its endpoints, see [Peer-to-peer API](#peer-to-peer-api).
For more information about the service API and its endpoints, see [Service API](#service-api).

## Getting documentation

This part of the documentation summarizes the key endpoints you can use to query and update Chainweb nodes and the data models you should be familiar with when interacting with Chainweb nodes and the blockchain network.

For full documentation of the Chainweb node API, including sample requests and responses, see the generated [Kadena Chainweb Node OpenAPI](https://api.chainweb.com/openapi/).
You can also build and serve the OpenAPI documentation locally from a Docker container.

To build a local copy of the documentation:

1. Open a terminal shell on your computer.

2. Clone the `chainweb-openapi` repository by running the following command:

   ```code
   git clone https://github.com/kadena-io/chainweb-openapi.git
   ```

3. Change to the root of the `chainweb-openapi` repository by running the following
   command:

   ```code
   cd chainweb-openapi
   ```

3. Build the documentation from the Dockerfile by running the following command:

   ```bash
   docker build . --tag chainweb.openapi
   ```

1. Serve the API documentation locally using http://localhost:8080/openapi/ by running the following command:
   
   ```bash
   docker run --rm --publish 8080:80 chainweb.openapi
   ```

To provide feedback or report bugs for the API documentation, open an issue in the [chainweb-openapi](https://github.com/kadena-io/chainweb-openapi/issues) repository.

To provide feedback or report bugs for the `chainweb-node` software, open an issue in the [chainweb-node](https://github.com/kadena-io/chainweb-node/issues) repository.

## Peer-to-peer API

The Chainweb P2P API is used for inter-node communication to establish blockchain consensus. 
Each computer running `chainweb-node` serves these endpoints using the secure Hypertext Transfer Protocol (HTTPS) on a network interface and port that is available directly on the public internet.

You can also make P2P API endpoints available for other clients by exposing the endpoints using reverse proxies, load balancers, authentication frameworks, or similar web technologies.

### Endpoints

The Chainweb peer-to-peer API includes the following endpoints:

- [Cut endpoints](/reference/chainweb-api/cut)
- [Block payload endpoints](/reference/chainweb-api/payload)
- [Mempool endpoints](/reference/chainweb-api/mempool)
- [Peer endpoints](/reference/chainweb-api/peer)
- [Configuration endpoint](/reference/chainweb-api/config)

### Base URL

The base URL for peer-to-peer API endpoints typically take the form of `<hostname>/chainweb/0.0/mainnet01` where the `<hostname>` is the IP address or domain name of a Chainweb node in the Kadena public blockchain network. 
Similarly, the base URL for peer-to-peer endpoints in the Kadena test network is typically `<hostname>/chainweb/0.0/testnet04` where the `<hostname>` is the IP address or domain name of a Chainweb node in the Kadena test network.
If you're running a local development environment, you can typically replace `<hostname>` with `localhost:8080` to connect to the API and specify `development` as the network name.

## Service API

The Chainweb service API includes endpoints that expose functionality of the Chainweb node to clients other than computers running the `chainweb-node` software.
For example, other clients might include mining pools, decentralized services, web applications, exchanges, wallets, and so on.

If you're a node operator, you can enable service API endpoints using configuration settings for the Chainweb node. 
The endpoints are served on a separate port over the unencrypted Hypertext Transfer Protocol (HTTP). 
As a node operator, you can also choose to expose the endpoints locally or through reverse proxies, load balancers, authentication frameworks, and other similar web technologies.

### Endpoints

The Chainweb service API includes the following endpoints:

- [Block service endpoints](/reference/chainweb-api/service-block)
- [Block hash endpoints](/reference/chainweb-api/blockhash)
- [Block header endpoints](/reference/chainweb-api/blockheader)
- [Mining service endpoints](/reference/chainweb-api/mining)
- [Pact REST API endpoints](/reference/rest-api)
- [Rosetta endpoints](/reference/chainweb-api/rosetta)
- [Maintenance and other services endpoints](/reference/chainweb-api/misc)

### Base URL

Because the service API is configurable for individual nodes, the base URL for service API endpoints can vary.
For bootstrap nodes, service API endpoints typically take the form of `api.<hostname>/chainweb/0.0/mainnet01` where the `<hostname>` is the IP address or domain name of a Chainweb node in the Kadena public blockchain network. 
Similarly, the base URL for service API endpoints in the Kadena test network is typically `api.testnet.<hostname>/chainweb/0.0/testnet04` where the `<hostname>` is the IP address or domain name of a Chainweb node in the Kadena test network.
If you're running a local development environment, you can typically replace `<hostname>` with `localhost:8080` to connect to the API and, if necessary, specify `development` as the network name.

Note that the Pact endpoints for any given chain identifier use the route prefix `/chain/{chainId}/pact/` in addition to the base URL.
For more information about Pact endpoints, see the [Pact REST API](/reference/rest-api) or the [Pact OpenAPI](https://api.chainweb.com/openapi/pact.html) specification.

### Resource consumption and vulnerability

Some of the endpoints of the service API can require considerable resources on the server side and administrators should be careful when exposing those publicly. 
Generally, endpoints of the service API are more vulnerable to DOS attacks.

## Data models

Data models summarize the parameters that define important Chainweb node elements.
You can view the [data models](/reference/chainweb-api/data-models) for the following Chainweb node features.

- [Cut data](/reference/chainweb-api/data-models#cut-modelh464607198)
- [Block header](/reference/chainweb-api/data-models#block-header-modelh1621557545)
- [Payload](/reference/chainweb-api/data-models#payload-modelh1436683818)
- [Payload with outputs](/reference/chainweb-api/data-models#payload-with-outputs-modelh509052678)
- [Peer information](/reference/chainweb-api/data-models#peer-information-modelh-1716301923)
- [Chainweb node information](/reference/chainweb-api/data-models#chainweb-node-information-modelh-1581301161)
- [Collection page](/reference/chainweb-api/data-models#collection-page-modelh1516574970)
- [Miner information](/reference/chainweb-api/data-models#miner-information-modelh-192276614)
- [Mining update event stream](/reference/chainweb-api/data-models#mining-update-event-stream-modelh-1942514890)

## Binary encoding

For technical details about binary encoding and calculated values, see [Binary encoding](/reference/chainweb-api/binary-encoding).
