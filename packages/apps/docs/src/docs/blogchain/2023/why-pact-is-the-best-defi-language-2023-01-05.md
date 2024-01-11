---
title: Why Pact is the Best DeFi Language
description:
  To say that 2022 has been a wild roller coaster ride for the Web3 and crypto
  industry as a whole is an understatement. Kadena has been pushing forward and
  growing beyond our expectations from hiring to engineering to business
  development. With our actively expanding team, Kadena strives to deliver a
  robust foundation of resources, content, and environment to support our
  expanding ecosystem of builders, projects, and users.
menu: Why Pact is the Best DeFi Language
label: Why Pact is the Best DeFi Language
publishDate: 2023-01-05
headerImage: /assets/blog/1_LodIVJU_PvliNLDGsRZShQ.webp
tags: [pact]
author: Kadena
authorId: kadena
layout: blog
---

# Why Pact is the Best DeFi Language

2022 has seen over $3 billion worth of hacks in the Ethereum space. Each one was
a tragedy for users, but also potentially ruinous for the developers behind the
projects. Ethereum’s smart contract language, Solidity, is so expressive that
developers have to foresee every undesirable state of the ledger and write
specific code to prevent it. As decentralized finance (DeFi) has grown more
complex, developers are spending 90% of their time looking for and patching
vulnerabilities rather than shipping products. If DeFi is to fulfill its
potential as an open-source alternative to centralized finance, then it first
has to address this expensive waste of talent.

Since 2017, the [Kadena](https://kadena.io) team has been building Pact — a
smart contract language designed notably for DeFi. Pact combines best practices
of Bitcoin script and modern interpreters like the Javascript Virtual Machine
(JVM) while retaining basic concepts like token contracts that are familiar to
Solidity developers.

Pact has been in constant development since 2017 and is currently on release
[4.4.1](https://github.com/kadena-io/pact/releases). The team is responsive to
the developer community and regularly collaborates on new built-in functionality
and other optimizations. The result is a smart-contract language that offers the
best of functionality, auditability and transparency.

Here are a few reasons why Pact is the future of safe, performant smart
contracts:

### 1. Human Readable Code

Smart contracts on Kadena are interpreted and directly executed on-chain,
without needing to be compiled into an opaque, low-level bytecode. This
institutes a much safer developer and user experience where smart contracts can
be easily read on-chain and debugged, and users can read a simple manifest of
every transaction, explaining what they are signing, which contracts they are
interacting with, and exactly how much will be withdrawn from their account.

### 2. Safe Transfers

Being ‘Turing-complete’ is a badge of honor for some blockchains, but the
reality is that unconstrained computation and infinite recursion is constrained
by and relies on the robustness of the gas model in order to enforce
restrictions that could and should be derived from the base computational model.
This leads to inefficiencies in transaction costs that can be detrimental to
both users and developers. In addition, a Turing-complete system opens up the
possibility of bugs by widening the surface area of the programming landscape
unnecessarily and for no benefit.

Pact deliberately imposes restrictions on the ledger state to ensure that many
of the hacks we’ve seen over the past year are simply not possible. All
transactions on Kadena are either atomic or provably correct by construction. A
failure at any step rolls back the entire operation so that funds can’t be
stranded somewhere unexpected.

### 3. Native Multisig Support

Crypto is a new paradigm in personal responsibility because losing a private key
means losing access to its funds forever, with no recourse. Pact mitigates this
danger by natively enabling users to attach multiple keys to accounts. Even if
one is lost, the remaining keys can still recover the account.

### 4. Dependency Management

Because most code relies on external libraries, safety and reliability
challenges can arise if they are accidentally or maliciously altered. To guard
against this, Pact uses inlined dependencies by importing arguments directly
rather than calling them from unreliable sources. If a Pact developer does want
to take advantage of an upgraded dependency, they can simply upgrade the
contract.

### Conclusion

While Pact has too many optimizations to list comprehensively, developers can
lean into Pact’s functionality through its offer of LISP-like syntax. This
ensures that the code can be parsed into syntax trees and executed as fast as
possible. For auditability, Pact supports formal verification, unit tests, and
blockchain simulations. And finally, in terms of transparency, Pact only allows
static variables and doesn’t support null values, macros, or the evaluation of
arbitrary strings. This is why Pact is becoming the first choice for web3
developers wanting to build safely and efficiently!

For more information about Pact, check out
[https://kadena.io/build/](https://kadena.io/build/) and our
[Github](https://github.com/kadena-io/pact#instructions-for-linux-users). Pact
is available from Homebrew on macOS with the following command line:

    brew install kadena-io/pact/pact
