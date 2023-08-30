---
title: Security in Kadena’s Public Blockchain
description:
  As awareness of Kadena and our blockchain protocol Chainweb grows, I see the
  same misunderstandings about how braided Proof of Work (PoW) functions,
  leading to repeated earnest but incorrect critiques. This issue is
  understandable as scalability research and analysis is still in its infancy,
  and we are still inventing a shared language for describing Byzantine Fault
  Tolerant (BFT) at scale systems.
menu: Security in Kadena’s Public Blockchain
label: Security in Kadena’s Public Blockchain
publishDate: 2018-11-01
author: Monica Quaintance
layout: blog
---

# Security in Kadena’s Public Blockchain

![Example of simple blockchain vs. two-chain configuration from Chainweb 2018 whitepaper (Martino, Quaintance)](/assets/blog/1_Cm0blm2TztfEkRFW1fkbGA.webp)

As awareness of [Kadena](https://kadena.io) and our blockchain protocol
[Chainweb](http://kadena.io/docs/chainweb-v15.pdf) grows, I see the same
misunderstandings about how braided Proof of Work (PoW) functions, leading to
repeated earnest but incorrect critiques. This issue is understandable as
scalability research and analysis is still in its infancy, and we are still
inventing a shared language for describing Byzantine Fault Tolerant (BFT) at
scale systems.

People commonly raise one or more security issues from a set of scenarios that
on the face seem different, but underneath share a core property. Examples I’ll
discuss in this post include:

- It’s easy for me as a miner to dedicate all my hash power to one chain,
  overwhelm / make all the blocks on a single chain, and thereby corrupt the
  network with censorship / bad blocks / etc.

- It’s easy for me with control of one chain to censor that chain and thereby
  halt the network

Both of these scenarios start with the same primary assumption: that by
dedicating hash power, an adversary can “take control” of a Chainweb chain, as
if the chain were a voting node in a deterministic (e.g. PBFT) or non-POW (e.g.
POS) Byzantine Fault Tolerant system.

These scenarios attempt to view Chainweb through the lens of a staked sharding
system, in which there is some game theoretic or information theoretic model
under which you trust ledger states that you didn’t generate. However, these
issues do not apply to Chainweb, and arise from a fundamental misunderstanding
in how Chainweb functions, and I’ll address and provide additional clarity on
these attacks below.

## Proof-of-Work in a culture of Proof-of-Stake

It’s important to not forget that when Bitcoin was first proposed, PoW was still
unproven. Once economics are injected into a consensus algorithm setting, it’s
very difficult to show that a formal proof of the theoretical behavior of an
algorithm will apply when it is set loose upon the real world. Game theory is
our best tool for modeling human behavior at the required granularity and yet it
makes assumptions about the rationality of people’s behavior. Only after Bitcoin
was released into the wild and behaved as expected for years did many begin to
believe that PoW-based trustless consensus actually works. It has proven to
truly be a master stroke of design.

The _work_ in Proof of Work, i.e. exchanging energy for hashes, has been proven
by the test of time to be a valid primitive for securing the consensus protocol
of a network. We have no evidence so far that staking, or securing a network
using its own internal currency, will be a valid alternative to underpin a
consensus protocol, and the field of trustless consensus is still too new to
know how to test the strengths of its foundations at this time. This isn’t to
say that staking cannot function as a consensus primitive, just that we don’t
yet know if it is a viable alternative to work.

## Chainweb is an evolution of Nakamoto Consensus

Much of discussion around scaling has been shaped by Jae Kwon, Dominic Williams,
and Vlad Zamfir’s work to apply traditional academic BFT research to
blockchains. Chainweb is explicitly not part of that paradigm; Chainweb is
unique in its status as a purely-POW-based scaling solution.

People quite commonly misinterpret the way our consensus mechanism functions,
generally when they are using a perspective based on PoS, but these systems use
fundamentally different models for replication of a ledger. To properly consider
replication in Chainweb, we must emphasize a core principle of the network:

_Chainweb is analogous to a braided Bitcoin. Miners mine the network, which in
Chainweb means mining multiple chains simultaneously. When we say nodes, we mean
parallel chains, NOT validator nodes in a voting system. We use the word “chain”
for a reason: each node in the Chainweb base graph is its own complete
blockchain. Under this architecture, miners have an opportunity to mine blocks
on all chains all at the same time._

Miners are free to select which chains they mine and are not sorted via
allotment (e.g. sortition in PoS) to specific chains. Moreover, they have an
incentive to efficiently allocate their hash power to different chains on the
braid in ad hoc manner so that they maximize their chances of finding as many
blocks as possible. The biggest difference between Chainweb and sortation-based
solutions is that in a sortation-based solution only the members of the
committee have an incentive to monitor and validate a shard. In Chainweb, there
might be a profitable mining opportunity on any chain at any time, so all miners
have incentives to watch and validate all chains.

Sharding in PoS is fundamentally different from the partitioning of ledger state
seen in Chainweb (e.g. peer/parallel chains). In PoS, sharding consensus
participants are not watching (replicating and validating) every shard looking
for opportunities to create/validate the next block. In contrast, Chainweb has
an incentive for every consensus participant to watch for opportunities
everywhere across the network. This structure is how Chainweb allows for local
(single chain) transactions that fall under a global consensus umbrella.

We repeat in many materials, talks, and posts that we expect most miners for
Chainweb will mine the entire Chainweb network in large pools because of the
economies of scale. Large mining pools will validate headers and peer blocks
internally (i.e. cross-check and execute previous/new blocks) and mine (i.e.
create new “latest” blocks) for every chain in Chainweb. The benefits of scale
for electricity, hardware, and direct trusted message propagation in pools are
too critical to ignore in an attempt to design a world in which all mining is
performed by single-GPU miners. Mining a network _should_ be a profitable
business in which a miner will invest significant resources–this participation
aligns the interests of miners, users, and token holders. Invested miners will
want a correctly-aligned network to succeed as designed.

In Chainweb, consensus infrastructure (servers, fiber, memory pools, etc.) is
parallelized without sacrificing security or decentralized block production in
the pursuit of throughput. Ultimately, this leaves network bandwidth (required
for global replication) the resource that becomes the most costly for scale. As
such, the maximum size of a Chainweb network looks to be capable of 10K-100K
transactions per second (TPS), though the limit of the network is still
theoretical. This throughput is still a massive improvement over existing
technology. Second layer scaling solutions on Chainweb will provide additional
TPS, because any second-layer scaling approach can be applied to any base layer
protocol. With Chainweb, however, the base layer will have enough bandwidth to
ensure low fees for moving between layer-two channels and the base layer.

A single mining pool will always be able to mine the entire Chainweb network.
Even in the most extreme case, e.g. a 100K TPS configuration, anyone would be
able to replicate the entire network so long as they are willing to pay for the
servers and bandwidth required, and for large mining conglomerates this
infrastructure requirement will still be profitable. Chainweb provides a
practical roadmap for solving scaling through the use of infrastructure.

Mining a single new block in Bitcoin today is very expensive in terms of hash
power. Chainweb provides a mechanism to produce many simultaneous blocks on
different peer chains all at the same height, with each block requiring a
fraction of the hash power of a single Bitcoin block. This configuration
drastically increases the number of transactions per second over the total
network.

At its core, Chainweb is a spiritual successor to Bitcoin in its consensus
mechanism. Miners behaving in a selfish, opportunistic, and greedy fashion will
mine the next block for every chain, all the time, and will thereby safely
propagate the network.

## Dominate Hash Power on One Chain to Submit Bad Blocks

When we approach Chainweb with the lens that the majority of miners will want to
mine all the chains in Chainweb, we can begin to see how the network will react
to attacks. One common issue raised about Chainweb is the idea that an adversary
could dominate the hash power on one chain and thereby insert bad blocks into
the system.

This scenario hinges on the false assumption that any miners who receive a proof
of a finished block will include that proof in the header of their peer chain’s
next block _without_ checking its validity. On the contrary, most of the hash
power comes from miners mining the entirety of the network, and therefore miners
will be performing spot validation on proofs from peer chains. Miners will not
accept a bad block from a supposedly dominated chain because they will validate
the block before including its Merkle root in their peer chains.

In the _false_ scenario, a miner will:

1.  Start mining on Chain “**α**”

2.  Go to the network for **α**’s peers’ blocks which are 1 layer back

3.  Not validate those blocks

4.  Find a block on **α**, broadcast it, and thus implicitly add validity to any
    forged blocks that were in that set the node didn’t validate

But, this doesn’t make sense, because Step 2 in the false scenario doesn’t
actually take place. Rather, a miner will:

1.  Start mining on **α**

2.  Go to the node’s own internal state for **α**’s peers blocks which are 1
    layer back. Because these are blocks that the node has “accepted” for the
    chain that the block is on, the node has already validated the block.
    There’s no need to do another re-validation of the neighbors.

3.  Find a block on **α** and broadcast it.

## Halt Communication from One Chain

This scenario is one in which people assume that dominating all the hash power
on one chain will allow an adversary to censor that chain, which would
eventually halt the network.

Recall that Chainweb is essentially a multiplied Bitcoin. If we think of mining
from this perspective, censoring a Chainweb chain would be like trying to censor
Bitcoin. You can dedicate all your hash power to one chain and create blocks
faster than other miners, but you cannot keep other miners from attempting to
mine a Chainweb chain. In fact, a slow chain is attractive to miners, and
resources will be reallocated to any temporarily slow chain. If an attacker
mines a Chainweb chain in secret but doesn’t tell anyone, then the rest of the
network will mine that chain without them. The block production of any one chain
in Chainweb cannot be slowed or halted.

## Conclusions and Follow Up

It is absolutely accurate to say that the full security analysis of Chainweb has
proven to be more complicated than a traditional single-chain approach. The
difficulty in describing the interwoven dependence of the probabilities is why
we have moved from a closed-form analysis to a simulator-based approach. Thus,
we’ve been working with Tarun Chitra’s research consultancy Gauntlet to simulate
multiple different attacks.

We definitely have a lot more work to do on formally proving the defense to
various attack vectors, which is why we are running simulations of Chainweb and
have an updated security paper in progress. Considerations and critiques of the
network are always welcome, which is why we’re so transparent and open about how
the system will function. Rigorous work arises from open collaboration, and it
will continue to guide our progress as our development continues.
