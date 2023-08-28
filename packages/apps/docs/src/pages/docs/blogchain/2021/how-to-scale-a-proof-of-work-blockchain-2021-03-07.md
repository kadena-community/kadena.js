---
title: How to Scale a Proof of Work Blockchain
description:
  Let’s start with the classic Computer Science parallelization and work from
  there. If one Bitcoin blockchain can do 5 transactions per second (using round
  number approximations for simplicity), two Bitcoin blockchains can do 10
  transactions per second, ten blockchains can do 50 tps, etc. But this approach
  has two major problems
menu: How to Scale a Proof of Work Blockchain
label: How to Scale a Proof of Work Blockchain
publishDate: 2021-03-07
author: Doug Beardsley
layout: blog
---

![Background image originally from [https://www.setzeus.com/](https://www.setzeus.com/)](/assets/blog/1_3eyrU5ECYCprl5r08ilvlg.webp)

## How to Scale a Proof of Work Blockchain

This post is a compilation of
[tweets](https://twitter.com/KadenaDirEng/status/1361075151912247298) from my
Twitter account @KadenaDirEng

//TODO: twitter https://medium.com/media/408ce840eee4f9b095ec6537e9fc1e67

## Introduction to scaling

Let’s start with the classic Computer Science parallelization and work from
there.

If one Bitcoin blockchain can do 5 transactions per second (using round number
approximations for simplicity), two Bitcoin blockchains can do 10 transactions
per second, ten blockchains can do 50 tps, etc. But this approach has two major
problems:

**1.** Each of these completely standalone blockchains has a completely
different currency. Ten separate currencies…not so great.

**2.** A 51% attack becomes a 5.1% attack…not good.

Kadena’s Chainweb protocol solves both of these problems by braiding the chains
together. For 2 chains, in addition to making each block include the hash of the
previous block on the same chain, **you also have it include the hash of the
previous block on the other chain**. This means each Chainweb block in a 2-chain
network contains one additional hash — i.e. 256 additional bits of
information…not bad! But what benefits do we get in exchange?

Well, if you wait one block after your transaction, it will require the full
hash power of both chains to do a 51% attack on that block. And the hash
braiding gives us the Merkle Tree structure needed to do cross-chain SPV proofs,
yielding a single currency across both chains. So now we’ve solved the two major
problems, and the cost is only 256 bits (32 bytes) of additional storage per
block. But if we scale this up to, say 10 chains, that starts to add up.

If each block in a 10-chain web contains the hashes of the previous block on all
other 9 chains, that’s an additional 288 bytes of overhead per block or 2880
bytes per block height — it gets out of hand fast. But there’s hope! It turns
out there’s a brilliant result from an obscure branch of math that can save us
and solve the Proof of Work scalability problem! Back in Undergraduate Computer
Science, we learned a little bit of this arcane branch of math called graph
theory. If you didn’t think it was all that interesting, you’re in good company.
I didn’t either. But as it turns out it’s just the thing we need to scale
blockchains

## Enter Graph Theory

Earlier I mentioned that with two chains, where each chain has the hash of the
other chain, we solve both the multiple currency problem and the 5.1% attack
problem. If we visualize the way these two chains are connected, it looks like
this.

![](/assets/blog/0_kin4LiW4GiMh57Kw.png)

We need to scale this up to hundreds or potentially thousands of chains. But
first we need to figure out a strategy for how the chains should be connected
together. Let’s start with 10 chains and explore a few different strategies. The
naïve approach would be to have every chain be connected to every other chain.
That would look like the image below.

![Assume a line means that there’s an arrow in each direction.](/assets/blog/0_y6MuNgjxULNr5TWM.png)

As we calculated before this would use way too much space because we have to
store an extra 32 bytes for every line attached to a node. It might be doable
with 10 chains but it definitely would be too much with more chains. We need to
reduce the number of edges each node has. We could drop down to just two edges
for each node. This reduces our storage requirements but it has a different
problem. It takes 5 hops to get from any chain to the chain that is farthest
away. If we scale this up to 100 chains, that would be **50 hops**.

![](/assets/blog/0_xji9DoXJ3VIU0fQk.png)

This means that with 100 chains you would have to wait 50 blocks before it would
require 51% of the whole network hash power to attack that block. Even in
blockchains like Ethereum with a relatively fast block time, that’s still a long
time to wait. That’s also how long it would take to transfer coins from one
chain to the farthest chain. So we have a dilemma. We want to minimize **1)**
the number of hops it takes to get to the farthest chain, and **2)** the number
of chains each chain is connected to.

Here’s where graph theory saves the day. The number of hops is called the
diameter of the graph. And the number of edges each node has is called the
degree (assuming they all have the same number which is fine in this case). This
is a well-known problem in graph theory called the **degree diameter problem**!
That is the brilliant result that Kadena uses to scale proof of work in what we
call the Chainweb protocol.

## How Chainweb Works

Graph theory researchers have been studying the degree diameter problem for a
long time. Optimal solutions are very difficult to find for large graphs. But it
turns out that we know how to construct solutions that are quite good. Here’s
the 10-chain graph that [](https://twitter.com/kadena_io)Kadena used at launch.
If you examine it closely you’ll see that every node has three edges (in graph
theory parlance, it’s degree 3) and you can get from any node to any other node
in at most two hops (diameter 2).

![Kadena’s 10-chain graph configuration](/assets/blog/0_blIqKovqB_iRxEVL.png)

This means that we only have to store 3 additional hashes per block and after
two blocks you can transfer coins from any chain to any other chain and you have
to have 51% of the entire network hash power to attack any single chain!

On August 20, 2020, the Kadena network forked from 10 chains to 20 chains. The
first 10 chains kept all the same coins and smart contracts that they had before
and 10 new chains came into existence. The graph had a new structure though.
Here’s the 20 chain graph.

![](/assets/blog/0_ENeEIWeIyndIkQNS.png)

The 20-chain Chainweb graph still has degree three, but it now has diameter 3,
so we have to wait 3 blocks after a transaction before the whole network’s hash
power is protecting it. The most amazing thing is how much growth potential the
degree diameter problem research gives us as we expand beyond 20 chains. Here’s
a table that shows the largest known graph size for graphs of **degree d** and
**diameter k**.

![](/assets/blog/0_DWzCvd3Syvazne4g.png)

The above table means that using a chain graph with a degree and diameter of 7
Kadena’s blockchain can scale to more than 50,000 chains! And if we increase the
degree and diameter one more to 8, we can get well into the **hundreds of
thousands**!!!

## Conclusion

To recap what we’ve learned**, Kadena’s Chainweb protocol leverages graph theory
research into the degree diameter problem to scale tried and true proof of work
blockchain easily into the realm that we need for the scale of the global
financial system**. As Vitalik Buterin has pointed out in the past, “the only
solution to high tx fees is scaling”. As we have learned above, Kadena has
solved the scaling problem. Join us in building the future of #DeFi!

//TODO: twitter https://medium.com/media/5d055f2f1e4c1f7573ae9e89dc5f91bb

Credits to [@_wjmartino_](https://twitter.com/_wjmartino_) who came up with this
idea originally. It’s pure genius.
