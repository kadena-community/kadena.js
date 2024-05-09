---
title: Pact 3.1 is Unleashed!
description:
  After a lot of hard work by the team at Kadena, we are pleased to announce the
  release of Pact 3.1! This new version of Pact brings significant additions to
  the language, including expanded Formal Verification coverage for our
  interfaces and governance, and our new cross-chain features in defpact, which
  makes it dead simple to write cross-chain multi-step transactions.
menu: Pact 3.1 is Unleashed!
label: Pact 3.1 is Unleashed!
publishDate: 2019-08-22
headerImage: /assets/blog/1_Pcj9Zf_irC35TwEGJlpz1Q.webp
tags: [pact, formal verification]
author: Emily Pillmore
authorId: emily.pillmore
layout: blog
---

# Pact 3.1 is Unleashed!

After a lot of hard work by the team at [Kadena](http://kadena.io), we are
pleased to announce the release of **Pact 3.1!** This new version of Pact brings
significant additions to the language, including expanded
[Formal Verification](/blogchain/2018/pact-formal-verification-for-blockchain-smart-contracts-done-right-2018-05-11)
coverage for our interfaces and governance, and our new cross-chain features in
defpact, which makes it dead simple to write cross-chain multi-step
transactions.

These features continue to reinforce Pact as the premier standard for smart
contract authoring in both public and private blockchains. You can try the
latest version of Pact out by
**[downloading from our Github](https://github.com/kadena-io/pact#installing-pact-with-homebrew-osx-only).**

## Formal Verification

Pact 3.1 pioneers new features that make the more complex parts of writing smart
contracts as easy as possible. Along with these features, we’ve continued
expanding our **Formal Verification** coverage.

### Pact Interfaces

Interfaces were introduced into [Pact in 3.0](./announcing-pact-3-0-2019-06-06)
as a way to allow users greater flexibility when layering behaviors in module
code. These constructs act similarly to the interfaces in Java, or traits in
Rust and Scala, with one big difference. In Pact 3.1, users can now write Formal
Verification properties and even define their own custom models in the bodies of
interfaces and their function signatures!

When a module implements an interface containing these properties, those
properties are inherited by the module. If a module implements more than one
interface, every interface’s properties are imported together, to provide the
module with that much extra security. This allows users to write the
specifications and laws for a module. Interfaces can thus provide robust
hierarchies of safe, secure, and _reusable_ smart contract behaviors with the
help of Formal Verification. You can read more about interfaces and see example
code [here](/build/pact/advanced#interfacesh394925690).

### Verified Governance

For the [Pact 3.0 release](./announcing-pact-3-0-2019-06-06), we debuted an
exciting new set of features in Pact: **guards** and **capabilities**. These
primitives allow you to create robust and flexible security metaphors as a
native feature of the language. With Pact 3.1, we are proud to announce that we
have Formal Verification analysis for guards and capabilities, allowing you to
not just write secure and flexible code, but _prove_ that it is secure and
flexible code.

When writing formal verification properties for a function, users can combine a
security predicate for a guard or capability such as(authorized-by
‘my-keyset)with the new governance-passes property to enforce their
requirements. You can even analyze governance over database operations guarded
by security protocol.

### Defpact step signatures

One of the killer features in Pact is its ability to support generalized,
multi-step transactions (e.g. escrow transactions) built directly into the core
of the language via the defpactconstruct. Formal Verification in Pact now allows
you to specify properties for each step in a defpact so that users can make each
step sound and secure.

This is just one aspect of some of the updates we’ve made to defpacts this
release. On top of this, we’ve added an incredible new feature: cross-chain
transactions.

## Cross-chain Multi-step Transactions

One of the boldest new features in this version of Pact comes as part of our
ongoing work on the testnet for
[our public blockchain](./announcement-kadena-public-blockchain-testnet-live-2019-03-26).

Blockchains like Bitcoin and Ethereum are traditionally single-chain, so their
currencies naturally live on one chain. But what happens when you have a whole
bunch of chains working in consensus, like in our Chainweb protocol? A currency
is defined on a per-chain basis, so there would be as many currencies in the
network as there would be chains. However, at Kadena, we have solved the problem
of unifying disparate currencies in a multi-chain network with the power of two
pre-existing standards in both Pact and the blockchain ecosystem: **simple
payment verification (SPV)** and **multi-step defpact transactions.**

The Kadena
[coin contract](https://github.com/kadena-io/chainweb-node/blob/master/pact/coin-contract/coin.pact#L195)
allows users to transfer any number of tokens from an account on one chain to an
account on another chain using the power of SPV. In fact, it looks the same as
your standard single-chain transfer, except now users can specify an extra
parameter: the _target chain_ to which they want their tokens sent.

Defpacts already had yieldand resume to securely forward data between steps. As
of Pact 3.1, cross-chain transactions are as simple as specifying a target chain
you’d like to yield some data to in the following step. For a user to perform
the second step on the target chain, they simply provide the correct SPV proof
data as part of a continuation request, and theresume call in that step will
perform the proof and retrieve the data automatically.

Coin transfers are a simple example of the more general concept of cross-chain
multi-step transactions: the ability to execute multi-step transactions, of
which each step can occur on a _different chain_. Pact now supports this by
default!

### Conclusion

To learn more about writing safe smart contracts in Pact, visit our educational
resources:

- [PactLang.org](http://pactlang.org/) — find videos, tutorials, and example
  code.

- [Try Pact ](http://pact.kadena.io)— start exploring Pact (3.0) in your
  browser, no downloads necessary!

- [Beta test smart contracts](http://discord.io/kadena) — get in touch with the
  team via Discord if you want to participate in our public blockchain testnet.

- [AWS Marketplace](http://kadena.io/aws) — take our private blockchain for a
  (free) spin and try out some of these cool new features for yourself.
