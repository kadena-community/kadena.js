---
title: Kadena’s Public Blockchain 101 and FAQs
description:
  Learn more about Kadena’s public, proof-of-work blockchain protocol designed
  for scalability and security.
menu: Kadena’s Public Blockchain 101 and FAQs
label: Kadena’s Public Blockchain 101 and FAQs
publishDate: 2019-02-01
headerImage: /assets/blog/1_7spjR-a_pYCJmQLt2qEamg.webp
tags: [kadena, pow]
author: Vivienne Chen
authorId: vivienne.chen
layout: blog
---

# Kadena’s Public Blockchain: 101 and FAQs

### Learn more about Kadena’s public, proof-of-work blockchain protocol designed for scalability and security.

## What is Kadena’s public blockchain?

[Kadena](http://kadena.io)’s public blockchain platform, originally conceived by
Kadena founder Will Martino, is a braided, parallelized **proof-of-work
consensus mechanism** that improves throughput and scalability while maintaining
the security and integrity found in Bitcoin. In short, Kadena is a blockchain
that is faster, more secure, and more scalable.

### What is a consensus mechanism?

A consensus mechanism is how a computer network comes to agreement about what
information is true or false. In a centralized system, such as a bank, a
designated authority (the bank) is trusted to determine that information stays
true. In a decentralized system, like a blockchain, a consensus mechanism
becomes a set of foundational rules for how a network agrees upon and verifies
valid transactions, preventing double-spending and fraud.

### What does Proof of Work mean? How is it different from “Proof of \_\_\_\_”?

Proof of Work (PoW) refers to the consensus mechanism that was first realized
with Bitcoin’s launch in 2008. It differs from other consensus mechanisms (e.g.
“proof of stake”/PoS) in that it uses computational mining and cryptographic
hashing to elect a leader who will add the next piece of information to the
ledger. In proof of work, transactions are bundled into “blocks” and confirmed
to the ledger through an energy consuming, probabilistic process that requires
miners (those who own computers capable of) solving a cryptographic hash. Miners
are rewarded newly created virtual coins (and sometimes network transactions
fees) for their work.

### How does Kadena work?

Kadena’s public blockchain works by taking the foundation of a Bitcoin mining
chain and parallelizing this work across multiple chains — each referencing
their peer’s headers — in specific configurations (see below “Is Kadena a DAG?”)
that allow for efficiency and better throughput.

_For an in-depth explanation of the technical foundations of Kadena, start by
reviewing the [whitepaper](https://kadena.io/docs/chainweb-v15.pdf)._

_For some recent (Oct 2018) follow-ups on security and addressing assumptions
and misunderstandings about Kadena’s public blockchain, check out our
[post](/docs/blogchain/2018/security-kadena-chainweb-blockchain-2018-11-01)._

## Frequently Asked Tech Questions

### Why does Kadena’s public blockchain use proof of work?

Kadena uses proof of work for a few key reasons:

1.  Evidence: PoW is the only “battle-tested” consensus protocol primitive.

2.  Economic incentive alignment: PoW creates an economic incentive for the
    majority of the hashpower to validate and honestly support the entire
    network. It is an open research question if a non-PoW approach can
    reasonably achieve the same.

3.  Regulation: In the eyes of certain financial regulators, proof of work
    miners are
    [not considered money transmitters](https://www.fincen.gov/resources/statutes-regulations/administrative-rulings/application-fincens-regulations-virtual-0),
    making a probabilistic PoW mining system safer from a US regulatory
    perspective than a system with more “finality” like PoS.

### How does Kadena ensure security?

Braiding chains together was first proposed for security purposes. By having
multiple mined blocks at the same height each referencing each other’s past, the
protocol decreases the duration of time where an attacker could get “lucky”
against an honest network. Think of an attacker needing to flip 6 coins and get
all heads (mine 6 blocks) vs needing to flip 12 coins and get all heads (mine 6
blocks from two related chains). The latter is harder. This same intuition
applies to Kadena’s multi-chain configuration.

### How does Kadena scale?

Kadena’s public blockchain scales by providing a mechanism to asynchronously
produce many blocks on different peer chains all at the same height, with each
block requiring a fraction of the hash power of the total network. This
configuration drastically increases the number of transactions per second over
the total network.

### What are the main limitations to scaling ?

Kadena can scale to meet the needs of its users, but the scaling isn’t
automatic. Initially, the main limitation to scaling is adoption. The public
blockchain will \*\*hard-fork to higher throughput configurations, but each
hard-fork needs to be motivated by alleviating congestion as the upgrade to a
larger network requires miners to procure more replicating servers. To upgrade
from a 50-chain to 100-chain network, the 50-chain network needs to be congested
and demonstrating continued adoption. Long-term, bandwidth becomes the main
resource that is constrained.

### Is Kadena a DAG (Directed Acyclic Graph)?

All blockchains are technically DAGs. Kadena, like Bitcoin or Ethereum, is not
an arbitrary DAG, as compared to a structure like that of Hashgraph, for
example. Unlike Bitcoin or Ethereum, Kadena’s DAG structure is fixed and
multi-channel. By fixing the DAG structure, Kadena limits the worst-case (e.g.
real-world) performance. Arbitrary DAGs have known performance problems under
adoption — they initially have many more execution channels, because
transactions are largely unrelated, but as adoption picks up and killer apps
appear on the platform the overall performance decreases because transactions
become increasingly related.

### Is Kadena like Lightning?

Kadena’s public blockchain is a base-layer/layer-one architecture. Lightning
network is a layer-two solution and can run on top of Kadena as an even greater
force multiplier than it does on existing Proof of Work blockchains. Pact,
Kadena’s smart contract language, has baked-in support for integrations of
layer-2 scaling solutions (e.g. lightning, state channels and side-chains),
ready to experiment with at testnet.

### What are side-chains? Does Kadena use them?

Sides chains are separate blockchains (with their own consensus ledger) that run
outside of a “main chain.” While this may sound similar to Kadena’s public
blockchain, our chains are NOT side-chains because (a) there is no “main” chain
as all chains are peers and (b) every chain is advanced under the same consensus
umbrella as its peers.

### What is sharding? Is Kadena “sharding”?

“Sharding” most commonly refers to splitting the network up into distinct
partitions called shards, each falling under its own consensus region. Kadena’s
partitioning differs from other methods of sharding because Kadena’s public
blockchain maintains a global consensus umbrella.

Under sharding in Proof of Stake, each shard has its own ledger and subset of
transactions that are independent from transactions that have been allocated to
different shards within the same network. In PoS sharding, nodes and validators
are only required to process transactions that are local to their respective
shards. This allows for greater throughput as each node is only required to
validate a small subset of transactions from the total that have been sent
throughout the network. While funds can be moved between shards, the is no
enforceable protocol-level requirement that the validators of shards overlap.

Forcing validators to validate every shard is untenable. Kadena differs from PoS
sharding by using the economics of PoW. In Kadena’s public blockchain, it’s
economically dominant for miners to mine/replicate/validate each chain (“shard”)
in the Chainweb network.

### What are tokens used for on Kadena’s network?

Tokens are used to pay for computing power, known on other platforms as “gas,”
on the blockchain.

### \*\*How does Kadena deal with congestion?

Transaction costs will rise as the number of transactions rise on one chain. You
can set up an account on a less congested chain, where transaction costs are
cheaper, and move your tokens through a simple burn-receipt using on-chain SPV.
Miners have economic incentive to cooperate with reconfiguring the network to a
larger size when the entire network starts to become congested.

### How would you move tokens between different Kadena chains?

Tokens are moved across chains using a Simple Payment Verification (SPV) smart
contract.

### Have more questions about Kadena?

Join our [Discord](https://discordapp.com/invite/bsUcWmX) community chat.

You can also find us on: [Twitter](http://twitter.com/kadena_io) |
[Linkedin](https://www.linkedin.com/company/kadena-llc/) |
[Facebook](https://www.facebook.com/pg/Kadena-194125367992879)|
[Github](https://github.com/kadena-io)| [Reddit](http://reddit.com/r/kadena) |
