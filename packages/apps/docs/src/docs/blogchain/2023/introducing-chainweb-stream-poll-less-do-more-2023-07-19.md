---
title: Introducing Chainweb-stream - poll less, do more
description: We are delighted to present the first experimental versions of the chainweb-stream server and client, a new system that enables persistent streaming of transactions and their confirmation status.
menu: Introducing Chainweb-stream - poll less, do more
label: Introducing Chainweb-stream - poll less, do more
publishDate: 2023-07-19
headerImage: /assets/blog/1_ITDZBMILfIYTkDa-djT-8g.webp
tags: [chainweb]
author: Kadena
authorId: kadena
layout: blog
---

# Introducing Chainweb-stream: poll less, do more

We are delighted to present the first experimental versions of the chainweb-stream server and client, a new system that enables persistent streaming of transactions and their confirmation status.

## 0) Why

The chainweb-stream pair aims to alleviate some of your polling pains. If you have developed a dApp, you might have encountered the necessity of polling a blockchain node repeatedly. For instance, a wallet may want to display the user’s balances, a decentralized exchange (DEX) may want to display the last few trades that have taken place on a specific token pair, or an NFT marketplace may require real-time activity updates. Furthermore, in probabilistic-finality blockchains that experience forks or reorganizations, a transaction is only considered final after it has remained in the canonical chain for a certain number of blocks. This necessitates additional polling until that confirmation depth is reached.

Chainweb weaves 20 chains together harmoniously. However, in certain scenarios, this multiplies the polling burden for our developers by a factor of twenty. Currently, obtaining a single chainweb-wide state “snapshot”, such as a user’s overall KDA balance, requires 20 requests to a chainweb-node. In a future with more chainweb chains, this issue will become even more pronounced.

## 1) What

[Chainweb-stream-server](https://github.com/kadena-io/chainweb-stream-server) acts as a “middleware” server, performing all the polling tasks on your behalf and exposing streams of transactions to clients.

[Chainweb-stream-client](https://github.com/kadena-community/kadena.js/tree/main/packages/libs/chainweb-stream-client) is the client-side companion to the server that provides a uniform experience across different browsers & environments, detects stale connections, gracefully resumes when disconnected, and more.

Currently, the chainweb-stream system supports subscriptions to both contract-level transactions (such as modules or module events) and account-level transactions across all Chainweb chains.

Additionally, it provides streaming of confirmation depth updates for transactions, allowing you to utilize it from a single confirmation up to your desired finality confirmation depth.

![](/assets/blog/0_lbJnogNX3-Yi8PIk.png)

## 2) How

### Server

Chainweb-stream-server sources data from chainweb-node and chainweb-data and utilizes [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) to stream certain classes of transactions along with their confirmation depth.

For the unidirectional nature of transaction streaming, server-sent events are expected to serve as a more robust transport mechanism than alternatives such as WebSockets. Essentially, it is a long-standing HTTP request. We anticipate this to be reliable even in restricted or unconventional network environments.

The payload data structures closely aligns with the source, chainweb-data, eliminating the need to adapt your application to yet another new schema. Account transactions will match the chainweb-data[/txs/accounts endpoint structure](https://github.com/kadena-io/chainweb-api/blob/master/lib/ChainwebData/TransferDetail.hs#L14) ([permalink](https://github.com/kadena-io/chainweb-api/blob/b3e28d62c622ebda0d84e136ea6c995d5f97e46f/lib/ChainwebData/TransferDetail.hs#LL13C1-L13C1)) and contract transactions will match the [/txs/events/ endpoint structure](https://github.com/kadena-io/chainweb-api/blob/master/lib/ChainwebData/EventDetail.hs#L11) ([permalink](https://github.com/kadena-io/chainweb-api/blob/b3e28d62c622ebda0d84e136ea6c995d5f97e46f/lib/ChainwebData/EventDetail.hs#L11)). Additionally, a [.meta field](https://github.com/kadena-io/chainweb-stream-server/blob/main/src/sse/types.ts#L25) ([permalink](https://github.com/kadena-io/chainweb-stream-server/blob/4afce23bf68f60fc0c32b6b357f0e51afb028986/src/sse/types.ts#L25)) will be included to carry confirmation depth information and an identifier used for deduplication purposes.

### Client

Chainweb-stream-client is designed to be used in both browser and nodejs environments. We opted to create this consumer library to address several significant concerns:

When changing from a polling model to a persistent/streaming model, we must account for the shift in failure modes. In a polling model, developers can easily ignore and retry a single failure. However, with a persistent model, we must be cautious not to mislead the developer into believing they have up-to-date data when they do not. Chainweb-stream-client addresses the issue by automatically managing the connection to chainweb-stream-server. It handles automatic reconnection and resumes from the last received checkpoint if the connection is terminated or heartbeat events are not received from chainweb-stream-server.

Another advantage of using the official chainweb-stream client is the uniform experience it provides across browsers and other environments. The behavior of the default server-sent events consumer (EventSource) varies between browsers, such as the reconnection interval being set to 1 second in Chrome while Firefox browsers do not automatically reconnect. Furthermore, Node.js does not include a native EventSource consumer. By utilizing the chain-web stream client, these discrepancies and limitations are overcome, ensuring a standardized experience regardless of the environment.

![](/assets/blog/0_pIPVC7rN1qo3PFdu.png)

## 3) Experimental/alpha state

**This software is experimental and should be considered an alpha release.**

We chose to build this as a separate package owned by the Kadena Development Experience team in order to:

1. validate with builders that there is demand for this model of consumption, and
2. iterate quickly to deliver the most value possible based on your feedback.

We have taken some precautions to future-proof certain aspects (e.g. versioned wire protocol for client-server compatibility checks), but we can not know what the future holds!

Please treat this as an experimental release and let us know whether it fits your use cases, what features you would like to see, and any other feedback you may have.

## Github repositories:

[Chainweb-stream-server](https://github.com/kadena-io/chainweb-stream-server)

[Chainweb-stream-client](https://github.com/kadena-community/kadena.js/tree/main/packages/libs/chainweb-stream-client)
