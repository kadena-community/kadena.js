---
title: Chainweb REST API
description:
  This document summarizes the key parts of the chainweb-node API.
menu: Chainweb API
label: Introduction
order: 2
layout: full
tags: ['pact', 'rest api', 'pact api', 'pact api reference']
---

# Kadena Chainweb node API

As discussed in [Chainweb simplified](/learn/chainweb), Chainweb is a scalable Proof-of-Work (PoW) consensus algorithm. 
Chainweb extends the Bitcoin Nakamoto consensus algorithm, a protocol designed for a single chain, to handle consensus with transactions coming from multiple parallel chains. 
Because Chainweb scales horizontally by using multiple chains, the Kadena network provides better transaction throughput with lower transaction fees than other Proof-of-Work (PoW) blockchains.

## Getting documentation

This part of the documentation summarizes the key parts of the chainweb-node API, including the following topics:

For full documentation of the Chainweb node API, including sample requests and responses, see the [Kadena Chainweb Node OpenAPI](https://api.chainweb.com/openapi/).

You can also build and serve the documentation locally from a Docker container.

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

To provide feedback or report bugs for `chainweb-node`, open an issue in the [chainweb-node](https://github.com/kadena-io/chainweb-node/issues) repository.

## Peer-to-peer API

The Chainweb P2P API is used for inter-node communication to establish blockchain consensus. 
Each computer running `chainweb-node` serves these endpoints using HTTPS on a network interface and port that is available directly on the public internet.

You can also make P2P API endpoints available for other clients by exposing the endpoints using reverse proxies, load balancers, authentication frameworks, or similar web technologies.

The Chainweb peer-to-peer API includes the following endpoints:

- [Cut endpoints](/reference/chainweb-api/cut)
- [Block hashes endpoints](/reference/chainweb-api/blockhash)
- [Block header endpoints](/reference/chainweb-api/blockheader)
- [Block payload endpoints](/reference/chainweb-api/payload)
- [Mempool endpoints](/reference/chainweb-api/mempool)
- [Peer endpoints](/reference/chainweb-api/peer)
- [Config endpoint](/reference/chainweb-api/config)

## Service API

The Chainweb service API includes endpoints that expose functionality of chainweb-node to clients other than chainweb-nodes, such as mining pools, decentralized services, web applications, exchanges, wallets, and so on.

You can enable service API endpoints using configuration settings. 
The endpoints are served on a separate port over plain HTTP. 
Node operators can expose the endpoints locally or through reverse proxies, load balancers, authentication frameworks, and similar web technologies.

Some of the endpoints of the service API can require considerable resources on the server side and administrators should be careful when exposing those publicly. 
Generally, endpoints of the service API are more vulnerable to DOS attacks.

The Chainweb service API includes the following endpoints:

- [Block endpoints](/reference/chainweb-api/service-block)
- [Mining endpoints](/reference/chainweb-api/mining)
- [Pact endpoints](/reference/rest-api)
- [Rosetta endpoints](/reference/chainweb-api/rosetta)
- [Miscellaneous endpoints](/reference/chainweb-api/misc)

Note that the Pact endpoints for any given chain identifier use the route prefix `/chain/{chainId}/pact/` in addition to the base URL.
For more information about Pact endpoints, see the [Pact REST API](/reference/pact/rest-api) or the [Pact OpenAPI](https://api.chainweb.com/openapi/pact.html) specification.

## Data models

Data models summarize the parameters that define important Chainweb node elements.
You can view data models for the following Chainweb node features.

- [Cut](/reference/chainweb-api/data-models#cut)
- [Block header](/reference/chainweb-api/data-models#block-header)
- [Payload](/reference/chainweb-api/data-models#payload)
- [Payload with outputs](/reference/chainweb-api/data-models#payload-with-outputs)
- [Peer information](/reference/chainweb-api/data-models#peer-information)
- [Chainweb node information](/reference/chainweb-api/data-models#chainweb-node-information)
- [Collection page](/reference/chainweb-api/data-models#collection-page)
- [Miner information](/reference/chainweb-api/data-models#miner-information)
- [Mining update event stream](/reference/chainweb-api/data-models#mining-update-event-stream)

## Binary encoding

For technical details about binary encoding and calculated values, see [Binary encoding](/reference/chainweb-api/binary-encoding).
