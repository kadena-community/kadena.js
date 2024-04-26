---
title: Chainweb, simplified
id: chainweb
description: Learn about the Chainweb consensus protocol and the multi-chain network in this simplified overview.
menu: Learn
label: Chainweb, simplified
order: 4
layout: full
tags: [consensus, nodes, chainweb, braided chain, network]
---

# Chainweb simplified

The core of the Kadena network is defined in its **Chainweb** protocol.
The Chainweb architecture is based on a proof-of-work consensus model.
In the proof-of-work consensus model, computers in a decentralized, distributed network solve complex mathematical problems to validate transactions submitted to the network.
Traditionally, networks that rely on the proof-of-work consensus model have been successful in delivering secure and trustless interactions, but limited by scalability issues, including:

- The number of transactions they can process.
- The speed at which they can process transactions.
- The energy consumption required to validate transactions.
- The high cost of transaction fees when the network in busy.
  
These factors have limited the effectiveness of blockchain networks to handle modern economic activity. 

## Parallel chains

The Chainweb protocol addresses these limitations and improves on the underlying consensus model by introducing **parallel blockchains** to maximize network throughput.
The parallel chains are connected in a way that optimizes network throughput and minimizes the number of cross-chain hops required for transactions.
These optimized network connections enable the chains to operate simultaneously and increase transaction processing capacity.

Each parallel chain includes block hashes (Merkle roots) from blocks on peer chains into their headers.
By referencing block hashes from peer chains, each chain can validate the consistency of its peer chains and provide a trustless oracle for cross-chain transfers of funds.
With this mechanism, the chains are braided together into a single canonical chain that offers an effective hash power that is the sum of the hash rate of each individual chain. 

Each chain in the network mints its own coin, but all of the chains use same cryptocurrency.
Because the chains share a common currency, coins can be transferred cross-chain using a trustless, two-step simple payment verification (SPV) at the smart contract level.

