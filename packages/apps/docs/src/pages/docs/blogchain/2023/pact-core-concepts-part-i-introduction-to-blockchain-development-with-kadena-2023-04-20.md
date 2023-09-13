---
title:
  Pact Core Concepts Part I — Introduction to Blockchain Development with Kadena
description:
  The Pact Core concepts series is a companion guide to the Real World Pact
  teaching repository. Written by Thomas Honeyman, a senior engineer at Awake
  Security, the series provides a first look at the essential concepts needed to
  write and test Pact programs on the scalable Chainweb blockchain. The series
  is a wonderful way to begin your Pact journey; after you’ve finished reading
  it, you are well-equipped to dive into the projects in the Real World Pact
  repository.
menu: Pact Core Concepts Part I
label: Pact Core Concepts Part I
publishDate: 2023-04-20
headerImage: /assets/blog/1_HTwgnXLGl8yViDoeTNcGAQ.webp
tags: [pact]
author: Kadena
authorId: kadena
layout: blog
---

# Pact Core Concepts Part I — Introduction to Blockchain Development with Kadena

The Pact Core concepts series is a companion guide to the
[Real World Pact teaching repository](https://github.com/thomashoneyman/real-world-pact).
Written by Thomas Honeyman, a senior engineer at Awake Security, the series
provides a first look at the essential concepts needed to write and test Pact
programs on the scalable Chainweb blockchain. The series is a wonderful way to
begin your Pact journey; after you’ve finished reading it, you are well-equipped
to dive into the projects in the Real World Pact repository.

The Pact Core Concepts series is made up of three parts. The first part was
released today, and the next two will be released each week for the next two
weeks. Each week we’ll share a short summary of the series installment on Medium
— so stay tuned! Here’s the full series:

1.  Introduction to Blockchain Development with Kad

2.  Learn Pact in 20 Minutes

3.  Testing and the Pact REPL

Part I,
[_Introduction to Blockchain Development with Kadena_](https://github.com/thomashoneyman/real-world-pact/blob/main/00-core-concepts/01-Introduction.md),
introduces readers to the major concepts, technologies, and existing smart
contracts they need to know to build decentralized apps on Chainweb. It’s a
rapid introduction to the Kadena ecosystem.

Here’s a brief overview of the topics covered in Part I:

### Web3 & Blockchain Technology

Blockchains combine various technologies and techniques that provide
decentralization, scalability, and security. Not all applications require all
three of these properties, but certain applications do — like digital
currencies, decentralized finance, and NFTs — and blockchain technology makes
these applications possible.

There are many blockchain platforms available, each one making different
tradeoffs in pursuit of decentralization, scalability, and security. Chainweb is
a particularly advanced blockchain platform known for its scalability and low
gas fees (the payment rendered to the network for processing computations.)

### Chainweb: Kadena’s Public Proof-of-Work Blockchain

Chainweb is Kadena’s public blockchain offering. It’s known for its extremely
low gas fees and high transaction throughput. Its most unique feature is that it
isn’t a single blockchain — it is instead many independent blockchains which run
in parallel and possess mechanisms for communicating with one another. This
pioneering architecture is why Chainweb is able to scale transaction throughput
far beyond single chains like Ethereum. You can learn more about it in the
[Chainweb white paper](https://d31d887a-c1e0-47c2-aa51-c69f9f998b07.filesusr.com/ugd/86a16f_029c9991469e4565a7c334dd716345f4.pdf).

### Pact: Kadena’s Secure Smart Contract Language

Pact is Kadena’s smart contract language, and it makes a wonderful set of design
decisions that sets it apart from other blockchain smart contract languages,
such as Ethereum’s Solidity. Some of these features include:

- Human readable

- Turing-incomplete

- Built-in formal verification

- Atomic execution

- Built-in data storage

- Multi-sig public-key authorization

- Zero-knowledge primitives

- Scoped access control

- Cross-chain computation (pacts)

### Kadena.js: Kadena’s JavaScript ToolKit

Kadena.js is a mono-repository where the team stores all their JavaScript/
TypeScript solutions for its blockchain, including but not limited to libraries,
tooling, and dApps. Essentially, Kadena.js is a software developer kit for
JavaScript, whereas Chianweb and Pact are the backbone of applications built on
the Kadena platform. Once builders are familiar with Chainweb and Pact, they can
then build frontend against the Kadena blockchain backend with Kadena.js.

### Fundamental Kadena Contracts

The Pact language comes with plenty of built-in features. Even so, builders
sometimes need to rely on code written in an existing smart contract to
implement their own smart contract, the same way one might rely on a library in
another programming language. Some examples of contracts that builders should be
familiar with are:

- coin

- fungible

- fungible-xchain

- poly-fungible

- marmalade.ledger

- util.guards, util.guards1

### Conclusion

We hope you enjoy the overview of blockchain technology and the Kadena ecosystem
in particular in
[_Introduction to Blockchain Development with Kadena_](https://github.com/thomashoneyman/real-world-pact/blob/main/00-core-concepts/01-Introduction.md).
\*\*If you are interested in smart contract development, continue on through the
series to learn how to write smart contracts with Pact!
