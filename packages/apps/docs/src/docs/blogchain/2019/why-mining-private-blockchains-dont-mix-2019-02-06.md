---
title: Why Mining & Private Blockchains Don’t Mix
description:
  On the difference between public and private blockchains. Bitcoin’s mining
  mechanism is a masterstroke of algorithmic design, enabling a scalable
  Byzantine Fault Tolerant (BFT) consensus by achieving a specific balance of
  incentives. As a reminder, mining-based blockchains like Bitcoin are public
  anyone can become a miner simply by downloading the software and firing it up.
menu: Why Mining & Private Blockchains Don’t Mix
label: Why Mining & Private Blockchains Don’t Mix
publishDate: 2019-02-06
author: Will Martino
authorId: will.martino
layout: blog
---

# Why Mining & Private Blockchains Don’t Mix

### On the difference between public and private blockchains

Bitcoin’s mining mechanism is a masterstroke of algorithmic design, enabling a
scalable Byzantine Fault Tolerant (BFT) consensus by achieving a specific
balance of incentives. As a reminder, mining-based blockchains like Bitcoin are
_public_: anyone can become a miner simply by downloading the software and
firing it up.

By contrast, p*ermissioned*, or private, blockchains seek to replicate the
trustworthiness and robustness of public blockchains but with restricted
memberships of known, approved participants, for regulatory reasons, for
confidentiality, and for potentially improved throughput and latency.

It is often assumed that if mining works for public blockchains then surely it
must also work for permissioned ones, perhaps even more robustly since access is
locked down, reducing attack vectors. **Mining, however, is not public by
accident, and indeed is incompatible with permissioned settings. **It is public
by design, which is critical to the functioning of its incentive model.

## Incentives in Mining

The role of incentivization in mining is as follows:

> _Incentives must ensure that the act of mining the “latest block” and
> publishing it without delay is more profitable than mining a “fork” from a
> prior block, or delaying publication of the newly-mined block._

In Bitcoin, we see that this holds: the value (in new coin and in transaction
fees) for mining and publishing the latest block exceeds the value of mining a
fork or delaying the new block’s publication for even a second. However, in some
alt-coins, we’ve seen this incentive fail, leading to majority-mining attacks
that result in large swaths of the ledger being rewritten. In small mining
pools, attackers are incentivized to mine long forks and only publish them when
they could supersede the primary blockchain’s history of transactions; these
attacks can perform double-spends by invalidating transactions previously made
for physical assets.

The need for incentivization at all is related to public blockchains’
scalability and anonymity requirements. By creating a consensus mechanism where
participants are incentivized to behave in a non-Byzantine way, we remove the
need for the mechanism to be auditable as well as the need for users to message
every participant. Participants do the right thing because their interests are
aligned with the interests of the system. As a result, the addition of a new
pool of miners or a new group of users has effectively no impact on network load
and in fact enhances fault-tolerance.

Mining is thus private and non-auditable by design. It is only when a new latest
block is mined that miners need to talk, so they may publish the block and claim
their reward. However, this implies that the system must correctly incentivize
miners to behave in non-Byzantine ways as it has no ability to verify their
actions (beyond validating a newly mined block).

Another form of fault-tolerance is the network’s ability to increase mining
difficulty as the hash rate increases. However, this can only take place when
miners are incentivized to win the next block as often as they can. If the
incentives fail, and securing that block yields little inherent value, then
miners have little incentive to publish that block to the network once found.
This is not much of an issue for public chains but is a huge issue for
permissioned blockchains.

## Permissioned Blockchains

Permissioned chains can take many forms, but overall they can be thought of as a
Bitcoin-like utility where only known participants can gain access and interact
with the system. It can be seen as a database shared amongst potentially
adversarial firms.

The motivations for firms to agree to use such a system are:

- Decrease mutual costs: resources and risk required to settle assets,
  operational efficiencies in high availability and disaster recovery, etc.

- Gain new capabilities: automated workflow via smart contracts, a shared
  standard library of business logic, etc.

An important distinction between public and permissioned chains is that while
every participant in a public chain can choose to participate or not in
consensus (by mining), every participant in a permissioned chain necessarily
participates in consensus. Permissioned blockchains exist to serve essential
business functionality for the firms themselves, tracking ownership, providing
audit trails, and so forth. Since the consensus mechanism decides what and when
things get written to the blockchain, no firm will be willing to let others “run
consensus” for them: each firm will necessarily participate in consensus. Thus,
if mining is used for consensus then every business will participate in mining.

## A Tale of Three Banks: Sneaky, Virtuous, and Unaware

The issues associated with mining permissioned chains are easiest to demonstrate
through a thought experiment. Imagine a permissioned blockchain that uses mining
for consensus, which three banks are using to trade high-value assets. The
mining difficulty is set to target 10 minutes. We’ll call the banks Sneaky,
Virtuous and Unaware and these banks are the only miners of the permissioned
chain.

At 9am Virtuous asks if Sneaky will sell an asset for $90M. Sneaky only has one
of these assets in stock and, finding the price to be fair, agrees. The
transaction is signed and submitted to the blockchain for consensus at 9:01am.
At 9:02am, Unaware asks Sneaky to sell the same asset for $100M.

Unaware has no idea that Sneaky just signed a transaction with Virtuous, and
Sneaky has no reason to inform him. Seeing an opportunity, Sneaky agrees to the
transaction with Unaware, signs the transaction but makes sure that the new
transaction references the same asset Sneaky used with Virtuous, and submits it
to the blockchain at 9:03am. There are now two conflicting transactions out for
consensus.

Sneaky now has a $10M incentive to invalidate the Sneaky-Virtuous transaction by
making sure the Sneaky-Unaware transaction is mined first. Sneaky already knew
that any coins and/or fees received from mining are insignificant in comparison
to the value of the transactions Sneaky would be conducting. Moreover, Sneaky
knows that so long as they publish mined blocks with the expected frequency
distribution their cluster size will appear to be in line with the chain’s 10min
difficulty level.

For just these scenarios, Sneaky has a large, on-demand mining cluster hidden in
reserve. It is leased from a bitcoin mining farm at the rate of $1M for two
blocks and is over several thousand times larger than the size of the cluster
the permissioned blockchain is tuned for. Sneaky, in effect, can win any block
for $1M, which is easily covered by the $10M potential profit. Sneaky switches
it on and mines a block with the Sneaky-Unaware transaction in it. The block
invalidating the Sneaky-Virtuous transaction is mined by 9:04am and a subsequent
block is built off of it is mined at 9:05am. The 9:04am block is not published
until 9:09am so as to keep up the appearance of a smaller cluster and the 9:05am
block is kept in reserve, only to be published if a fork occurs when the 9:04am
block is published. Sneaky has the incentive to run an 18 block long fork before
the cost of forking matches the $10M incentive.

![](/assets/blog/0_Of10Tuy3yrTEqodk.webp)

It is interesting to consider what possible equilibrium would result from this
type of system, something like each bank continually generating a portfolio of
possible next blocks on large, hidden clusters, allocating mining resources
based on risk. However, no matter what the equilibrium is, it is clear that
mining in a permissioned context has substantially different incentives than
those of a public chain. Without proper incentive alignment, mining fails to
fulfill its purpose of providing BFT consensus.

That equilibrium could look much like mining’s equilibrium today, just on a much
larger scale — imagine the mining cluster size if every new block was worth
$10M. The thought experiment suggests a direct relationship between the value of
transactions on a private blockchain and the mining cluster size used for it. It
seems that mining will always be inventive based, even if you remove its primary
incentives. Furthermore, mining works because of incentives and it seems that
the larger the incentives, the more resources are used to mine.

If it is the case that mined permissioned chains require very large clusters,
then mined permissioned chains will never take off. They will simply be too
expensive to operate when compared to traditional systems.

The question becomes: how to fix mining in such a way that we keep mining
clusters small?

## Imperfect Solutions

One solution to the issues described is to register all transactions with some
central authority, so that the order of transactions is not determined by the
miners. This centralizes the blockchain, at which point why bother with mining
and a blockchain at all; the central registration authority is more than capable
of ordering and replicating transactions with more familiar technologies.
Indeed, this is how many of current systems work, with public-private
institutions handling the settlement synchronization.

Another solution is a legal agreement that limits mining resources and bans
invalidating transactions. This solution, however, misses the point.
Permissioned blockchains are meant to enable adversaries to work together
without trusting each other, and instead trusting the system. If we have to rely
on the courts for a BFT algorithm to function, then the algorithm is not BFT.

## A bit of market research

Luckily, most large enterprise institutions do not want a permissioned
blockchain that requires mining for other reasons:

- Mining is wasteful: cycles must be burned to mine the next block which
  enterprise users see as inefficient.

- Mining is probabilistic in nature: enterprise adopters tend to dislike that a
  transaction’s success is a probability, worrying about the rare but possible
  event of informing a client of a successful transaction only to have the
  transaction later be invalidated.

- Mining is slow: being partly a function of time, mining is necessarily slow
  and cannot be sped up. For most enterprise applications, 7–14 transactions per
  second with 1–10 minute latencies is far too slow.

NB: the costs of mining mentioned above are well worth the mechanism’s utility
when it comes to public chains — in return you get anonymous participation,
massive robustness, and near infinite scalability.

## Conclusion

Public blockchains herald a fundamentally new approach to solving many
real-world problems, and the ideas they illustrate hold substantial benefits for
industrial settings. Adoption by industry demands a robust, performant and
fault-tolerant design that can provide BFT consensus in a private, permissioned
context. As we have shown, mining cannot provide this, as it needs the public
context for its incentives to function, and would be inefficient and slow.

Providing a solution to this challenge is a core reason we founded Kadena. Our
first project was an enterprise, permissioned blockchain called
[\*\*ScalableBFT](http://kadena.io/docs/Kadena-ConsensusWhitePaper-Aug2016.pdf).
\*\*It remains one of the only scalable high-performance permissioned BFT
consensus mechanism in the market, and now it’s available for
[free on AWS Marketplace](http://kadena.io/aws)!

_This piece was originally published on Nov 1, 2016 on Kadena’s old blog. It has
adapted and been republished here._
