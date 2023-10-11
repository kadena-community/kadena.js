---
title: FAQ for Kadena’s Public Blockchain
description:
  Kadena has released mainnet mining to the public, inviting the mining
  community to begin solving blocks on the Kadena public blockchain. Kadena’s
  network has come alive with activity as miners from all over the world
  participate on the Kadena network.
menu: FAQ for Kadena’s Public Blockchain
label: FAQ for Kadena’s Public Blockchain
publishDate: 2019-12-02
headerImage: /assets/blog/2019/1_ssB8LvGuMvA270XnoZWHBQ.webp
tags: [kadena]
author: Rebecca Rodriguez
authorId: rebecca.rodriguez
layout: blog
---

# FAQ for Kadena’s Public Blockchain

[Kadena has released mainnet mining](/docs/blogchain/2019/kadena-releases-mainnet-mining-and-announces-token-sale-2019-11-04)
to the public, inviting the mining community to begin solving blocks on the
Kadena public blockchain. Kadena’s network has come alive with activity as
miners from all over the world participate on the Kadena network.

In addition to mainnet mining, Kadena also announced
[Block Explorer](https://explorer.chainweb.com/), a tool that allows for
real-time monitoring of Kadena’s parallel chains. View the propagation and
braiding of blocks, or dive into any block for key details such as block height,
PoW hash, neighbors, and payload.

The Kadena network has experienced significant growth in its first few weeks:

- Before the end of week one, the hash rate grew to over 500 GH/s through CPU
  mining alone.

- Before the end of week three, the network achieved a hash rate of over 4.0
  TH/s with the introduction of GPU mining.

Kadena will continue to listen to the community and make improvements that
benefit the network’s health and accessibility.

For those with general questions about participating in Kadena’s mainnet, read
on for more information.

## Where can I find more information about Kadena tokens?

Read the
[token economics breakdown](/docs/blogchain/2019/the-kadena-token-economic-model-2019-10-30)
for more information on the Kadena token model.

**What hashing algorithm does Kadena use?**

Blake2s_256

**Where can I find the latest release of binaries?**

Our latest releases are always open-sourced on GitHub. Chainweb Node is
[here](https://github.com/kadena-io/chainweb-node/releases) and Chainweb Miner
is [here](https://github.com/kadena-io/chainweb-miner/releases). Make sure you
are on the most up-to-date releases, or else it’s possible that your
_miner/node_ will not work properly.

**What kind of computer is required to run a Kadena public blockchain node?**

As of publication, the minimum requirements are 2 cores and 2 GB RAM. However,
our recommendation is to use 4 cores and 4 GB RAM.

Currently, disk space is rarely an issue and a few gigs should be more than
enough. Note that the amount of data in the blockchain will continually grow and
will eventually consume a more significant amount of disk space. Please plan
accordingly.

**What is the target block time?**

The target is to reach a new block height every 30 seconds and there are 10
blocks (i.e. 10 chains) at every height.

**How can I check my account details, including balance?**

You can check your account details by sending a Pact local API request calling
*coin.details *on any node.

For more on how to do this, see:
[Pact Local Queries](https://github.com/kadena-io/chainweb-node/wiki/Pact-Local-Queries)

**How can I tell if a node is minable?**

We recommend that you connect to our bootstrap nodes that are closest to your
geography and turn on mining. You can find our list of bootstrap nodes
[here](https://github.com/kadena-io/chainweb-node/wiki).

You can also test if public nodes are minable by pointing your miner at any of
the available nodes and see if it starts mining. This is easiest if you set the
default log level to debug. For example:

```shell
_./chainweb-miner cpu — cores 2 — node us-w2.chainweb.com:443 — miner-account
<some account> — miner-key <some key> — log-level debug_
```

**How come my balance doesn’t exist on all chains?**

Kadena’s public blockchain architecture is unique in the fact that account names
are not global entities. Account names, as a result, only exist for the chain(s)
on which you create them. Consequently, you will also have a distinct balance on
each chain. The easiest way to get your account on all chains right now is to
mine.

**Can my account name be different from my public key?**

Our public blockchain supports
[cross-chain transfers](https://github.com/kadena-io/chainweb-node/blob/5ba732d8d003d00afb68053bab6b2f549d6157bc/pact/coin-contract/coin.pact#L408)
which allow you to unify your accounts across all chains, but there is always
the possibility that if you wait, you will not be able to reserve the account
name you want. We recommend reserving an account name at your earliest
convenience.

**Need more support?**

For a more extensive FAQ about participating in Kadena’s public blockchain, head
over to our
[GitHub](https://github.com/kadena-io/chainweb-node/wiki/Chainweb-FAQ). Keep in
touch with Kadena through
[Discord](https://discordapp.com/invite/bsUcWmX?utm_source=tropyc) or by
following announcements shared on [Twitter](https://twitter.com/kadena_io) and
[Medium](/docs/blogchain).
