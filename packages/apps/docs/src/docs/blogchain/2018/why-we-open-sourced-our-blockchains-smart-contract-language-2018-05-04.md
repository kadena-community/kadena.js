---
title: Why We Open-Sourced Our Blockchain’s Smart Contract Language
description:
  Back in November 2016, Kadena open-sourced our smart contract language,
  Pact™. Open-sourcing is all about empowering users, and that’s also what
  motivated us to make Pact in the first place––to empower people to enact
  meaningful events on a blockchain, safely and quickly. We believe open-source
  initiatives provide transparency and benefits to everyone
menu: Why We Open-Sourced Our Blockchain’s Smart Contract Language
label: Why We Open-Sourced Our Blockchain’s Smart Contract Language
publishDate: 2018-05-04
tags: [smart contract, pact, oracles]
author: Vivienne Chen
authorId: vivienne.chen
layout: blog
---

# Why We Open-Sourced Our Blockchain’s Smart Contract Language

Back in November 2016, [Kadena](http://kadena.io) open-sourced our smart
contract language, Pact™. Open-sourcing is all about empowering users, and
that’s also what motivated us to make Pact in the first place––to empower people
to enact meaningful events on a blockchain, safely and quickly.

We believe open-source initiatives provide transparency and benefits to
everyone, including:

### Developers

If you are a developer writing smart contracts, an open-source language means
you’re not dependent on out-of-date docs to educate you since you can always
look at the code, and if there’s a problem you want to fix now, you simply fork
and fix it.

### Business users

If you are a business user, open-source means you can develop your business
logic in Pact to run on a
[fast private blockchain like \*\*ScalableBFT](http://kadena.io/#/enterprise)\*\*,
knowing that your code is your own and it’s not encumbered by NDAs or licenses.

And soon, users will be able to run projects in Pact on
[\*\*Chainweb](http://kadena.io/#/public)\*\*, Kadena’s public blockchain,
running on a fully distributed open network with the power of a scalable, proof
of work protocol at its consensus layer.

### Us!

Open-source also empowers us at Kadena, by leveraging the amazing ecosystem for
software development. Pact is hosted on
[Github](https://github.com/kadena-io/pact), is automatically built on every
commit by [Travis-CI](http://travis-ci.org/), which we further leverage to make
builds for multiple OSs on our
[downloads page](http://kadena.io/pact/downloads.html).

All of these amazing resources work together seamlessly and for free — if your
project is open-source. It’s an excellent example of alternate incentivization
schemes to encourage contributions to the public. And of course, we couldn’t
even develop the technology without the peerless open-source language
[Haskell](http://haskell.org/) and all of the unbelievable community libraries
available for it.

## Current Pact Features

Headline features of Pact are:

### Easy-to-use database metaphor

Pact puts the power of a flexible, fast key-value versioned database in your
hands, making it easy to quickly model assets or other entities.

### Simple module system

Pact allows for great factoring of smart-contract solutions. _Modules_ hold
related functions and constants, and also have the ability to “guard” tables.
Re-using and factoring code is safe and easy.

### Durable, safe code

Pact code is Turing-incomplete — unbounded looping is impossible, and recursion
is detected when smart-contract modules are loaded into the blockchain. This
also allows any referenced code to be inlined at load time, making for blazing
performance, but also insuring that your code will not be harmed if an imported
module is later re-defined.

### Public-key authorization schemes, with external verification

Inspired by Bitcoin scripts, Pact is designed with access control in mind from
the ground-up. The concept of _keysets_ ensures that any resource can be
controlled by one or more public keys. Modules, tables and even rows in the
database can all be governed by separate keyset rules. The key verification
itself is handled by the blockchain running the contract: a developer never need
worry about faulty crypto.

### Oracles, escrow and multi-phase transactions with “pacts”

_Pacts_ are special multi-step functions in Pact that make authoring oracle
processes and escrow transactions easy, trustless and safe. Pacts can “own”
money to safely lock funds during the course of a multi-step transaction, and
make workflow automation simple and safe. Our private blockchain,
[ScalableBFT](http://kadena.io/#/enterprise), also allows for confidential
message channels, in which pacts serialize execution between parties to ensure
referential transparency and correctness.

## Go forth and transact!

Finally there’s an alternative for creating smart contracts. We’re very excited
to see what developers and business users can create with this technology. Once
you’re ready to run them on the fastest blockchain,
[send us a note](mailto:info@kadena.io).

## About Pact

**Pact** is an innovative way to write smart contracts on a blockchain, with a
level of assurance not possible with other smart-contract languages. Pact is an
expressive, easy-to-learn, and productive language to code in, with excellent
tooling. **[Try it today](http://kadena.io/try-pact),
[download a build](http://kadena.io/pact/downloads.html) or
[build and hack on it yourself](https://github.com/kadena-io/pact).**

_Portions of this post were
[originally published](http://kadena.io/blog/OSPact.html) by Stuart Popejoy,
Kadena founder, in 2016 and have been updated and reprinted with permission
here._
