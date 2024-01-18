---
title: Introducing KIPs - Kadena Improvement Proposals
description:
  Similar to other improvement proposals that you may be familiar with from
  Bitcoin and Ethereum, Kadena Improvement Proposals (KIPs) allow participants
  to introduce new changes to the blockchain in a transparent manner.
menu: Introducing KIPs
label: Introducing KIPs
publishDate: 2019-08-14
headerImage: /assets/blog/1_CkkM7zCahsGSNluuOQ0w3w.webp
tags: [kadena]
author: Stuart Popejoy
authorId: stuart.popejoy
layout: blog
---

# Introducing KIPs: Kadena Improvement Proposals

_Learn more about the process for submitting suggestions for Kadena’s public
blockchain, Chainweb._

Similar to other improvement proposals that you may be familiar with from
[Bitcoin](https://github.com/bitcoin/bips) and
[Ethereum](http://eips.ethereum.org),
**[Kadena Improvement Proposals](https://github.com/kadena-io/KIPs/blob/propose/kip-0001/kip-0001.md)**
(KIPs) allow participants to introduce new changes to the blockchain in a
transparent manner.

**What are KIPs?** KIPs are open source requests to support technical
development. They also crowdsource features for different technologies developed
by Kadena. A KIP describes a potential improvement to the Kadena public
blockchain ([Chainweb](https://github.com/kadena-io/chainweb-node), our Proof of
Work blockchain), and the open source smart contract language
[Pact](https://github.com/kadena-io/pact).

**A Brief History of Improvement Proposals**

We are building upon previously established processes in the developer
community. The original
“[Bitcoin Improvement Proposal](https://en.bitcoinwiki.org/wiki/Bitcoin_Improvement_Proposals)”
(BIP) system drew heavy inspiration from Python’s enhancement proposals and a
collection of open source principles from the Internet Engineering Task Force,
“[On Consensus and Humming in the IETF](https://tools.ietf.org/html/rfc7282#section-1).”
The goal of these systems is to find a way to democratically collaborate on a
piece of public digital infrastructure, but also to
“[thoroughly vet ideas for security and feasibility, before implementing any code that could threaten the stability of the network](https://blog.sfox.com/bitcoin-governance-what-are-bips-and-how-do-they-work-276cbaebb068).”

The spirit of the Internet (and public blockchain) is to be an ownerless
utility. Therefore, its creators and earliest developers, despite their
influence, should never solely control it. At the same time, we need a structure
for collaborating and examining proposed changes for the public good. The goal
is to make improvements that will hopefully benefit everyone using the network.
Chainweb’s KIPs are modeled after the same principles that motivated Bitcoin and
other engineering communities to set up their respective improvement proposals.

While we are using industry language, there are some small differences in our
terminology for KIPs:

## Kadena Improvement Proposal Life Cycle

![The Lifecycle of a KIP Draft](/assets/blog/1_FYVtRmcYtUxa3foxfs93-A.webp)

## KIP Terms Explained

### Draft

A new KIP, in Pull Request (PR), or an accepted PR that is still being debated.

### Deferred, Rejected or Withdrawn

Statuses that indicate a KIP has stopped for being too soon (**Deferred**),
unacceptable (**Rejected**), or removed by the author (**Withdrawn**).

### Final or Active

**Final** indicates KIP is at completion but not necessarily released.

**Active** indicates KIP does not need to be finalized (i.e. an ongoing
discussion).

### Replaced or Obsolete

Indicators that a previously final KIP has been superseded by a more recent KIP
(**Replaced**) or no longer applies (**Obsolete**).

## KIP Types

## 1) Standard

A “standards track” KIP indicating some kind of concrete implementation with a
specification.

### KIP Categories

“Category” is borrowed from EIPs and corresponds to a
“[Layer](https://github.com/bitcoin/bips/blob/master/bip-0123.mediawiki)” in
BIP. A **category** is only for Standard types.

### • Chainweb (Soft or Hard Fork)

Core change to public blockchain consensus

### • P2P/Networking

Core change to peer-to-peer or networking services

### • API

API/interface layer for interoperating with Kadena’s public blockchain

### • Pact

Changes to the Pact smart contract language that particularly impact a protocol

### • Interfaces

Changes to, or new interfaces in, Pact for defining smart contract
interoperability.

## 2) Process

Describes a series of actions or steps, like
[this KIP](https://github.com/kadena-io/KIPs/blob/master/kip-0001.md).

## 3) Informational

Guidelines, general issues or information for the community.

For more details on our KIPs process,
[visit our Github](https://github.com/kadena-io/KIPs/blob/master/kip-0001.md).

## What can I do now?

View the [latest KIPs](https://github.com/kadena-io/KIPs/issues). Consider
introducing a KIP as you explore the Pact smart contract language and Kadena’s
public blockchain testnet with these resources:

- **Getting Started:**
  [Pact Smart Contract Beginner Tutorials](http://pactlang.org)

- **Try Pact** in your [web browser](http://pact.kadena.io).

- **Kadena Public Blockchain on Github**: See the
  [latest version](https://github.com/kadena-io/chainweb-node) of our testnet,
  and spin up your own node with our
  [public binary](http://kadena.io/testnetbinary).

- **Making a KIP**: Propose a new issue on our
  [Github KIPs page](https://github.com/kadena-io/KIPs/issues), describing the
  proposal in the suggested format.

We’re also on: [Twitter](http://twitter.com/kadena_io) |
[Linkedin](https://www.linkedin.com/company/kadena-llc/) |
[Discord](https://discord.gg/bsUcWmX) | [Github](https://github.com/kadena-io)
