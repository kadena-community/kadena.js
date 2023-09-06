---
title:
  Kadena Public Blockchain Releases Fully Public Testnet (v3), Hashing
  Algorithm, and Mining API
description:
  September 18, 2019 — Kadena’s public blockchain testnet is now fully open to
  the public! The latest version of our testnet (v3) includes important updates
  for miners and interested participants, including the announcement of our
  mainnet hash function (Blake2s) and the release of our Mining Client. In this
  post, we’ll explain what these new testnet features mean for the community.
menu: Fully Public Testnet (v3), Hashing Algorithm, and Mining API
label: Fully Public Testnet (v3), Hashing Algorithm, and Mining API
publishDate: 2019-09-18
author: Miguel Angel Romero Jr.
authorId: miguel.angel
layout: blog
---

![](/assets/blog/1_j-19orafTNN7mVB6M4V3Qg.webp)

# Kadena Public Blockchain Releases Fully Public Testnet (v3), Hashing Algorithm, and Mining API

**September 18, 2019 —** Kadena’s public blockchain testnet is now fully open to
the public! The latest version of our
[testnet](https://github.com/kadena-io/chainweb-node/releases/tag/testnet-v3)
(v3) includes important updates for miners and interested participants,
including the announcement of our mainnet hash function
([Blake2s](https://blake2.net/)) and the release of our Mining Client. In this
post, we’ll explain what these new testnet features mean for the community.

## Why Blake2s as Kadena’s Mining Algorithm?

We considered many factors and listened to our community when making our choice
of a mining algorithm. We wanted a hash function that was GPU mineable and not
immediately ASIC mineable (but for which an ASIC can be made), to encourage the
steady growth of the network over time.

Blake2s is also a well understood and tested hash function. We determined that
Blake2s fit our goals for Kadena’s public blockchain and, from talking to
miners, the needs of our mining community.

## How do I test-mine the Kadena public blockchain?

While we are in testnet v3, miners can use our new mining client and/or run
nodes connected to our network to begin test-mining Kadena’s public blockchain.
_Note: this is not “pre-mining” the network._ Any Kadena coins that miners
receive _will be reset upon launch_. However, test-miners _do_ gain a headstart
in setting up their mining configurations ahead of our mainnet launch in
Winter 2019.

Start with the main
[README](https://github.com/kadena-io/chainweb-node/blob/master/README.md) file
and follow the instructions for installing Chainweb-node based on your operating
system. The simplest way to test-mine is to run the mining client, while more
experienced miners can run a node and connect it to our public testnet. Detailed
instructions can be found
[here](https://github.com/kadena-io/chainweb-node/blob/master/miner/README.org).

*Questions? *Head over to our [Discord](http://discord.io/kadena) and chat with
the Kadena team.\* \*We’re here to answer questions, as well as give updates to
any network resets that may occur with testing.

## How else can I participate in Kadena’s testnet?

[Try out our web wallet](http://pact.kadena.io/) and smart contracts in the Pact
browser. With Pact testnet in your browser, you can write your own smart
contracts that deploy to the Kadena testnet.

_What’s next?_ Stay tuned for a desktop wallet, token economics, gas pricing
model, and the launch of mining our public blockchain!
