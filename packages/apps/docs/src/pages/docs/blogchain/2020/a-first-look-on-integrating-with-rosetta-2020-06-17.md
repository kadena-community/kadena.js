---
title: A First Look on Integrating With Rosetta, Launched by Coinbase
description:
  Kadena is a live, full-service smart contract platform and the world’s first
  scalable, sharded, layer-1 Proof of Work public blockchain. Here at Kadena,
  we’ve finished the initial cut of our integration with Rosetta, a new
  open-source technical framework that has just been launched by Coinbase. As
  one of the first projects to work on Rosetta, we’re taking this opportunity to
  share what we learned from the experience.
menu: A First Look on Integrating With Rosetta, Launched by Coinbase
label: A First Look on Integrating With Rosetta, Launched by Coinbase
publishDate: 2020-06-17
author: Linda Ortega
layout: blog
---

![](/assets/blog/2020/1_b97oiC8M_ePx83B-PW0Cfg.webp)

# A First Look on Integrating With Rosetta, Launched by Coinbase

_Kadena is a live, full-service smart contract platform and the world’s first
scalable, sharded, layer-1 Proof of Work public blockchain._

Here at Kadena, we’ve finished the initial cut of our integration with Rosetta,
a new open-source technical framework that has just been launched by Coinbase.
As one of the first projects to work on [Rosetta](https://www.rosetta-api.org),
we’re taking this opportunity to share what we learned from the experience. The
Rosetta project is quite new, and our team wanted to leave some bread crumbs for
those who may follow us in looking to make a similar integration happen with one
of the world’s most popular and respected exchanges. You can find Kadena’s
Haskell-based implementation of Rosetta
[here](https://github.com/kadena-io/rosetta).

Rosetta is a standardized API for interacting with financial data on
blockchains. The goal of Rosetta is to allow blockchain projects to complete the
lion’s share of the integration work necessary to connect to an exchange,
allowing a smoother exchange listing process for both issuers and exchanges.

Similar to the way that the
[Stratum Mining Protocol](https://en.bitcoin.it/wiki/Stratum_mining_protocol)
allowed for standardization of pooled mining, Rosetta is aimed at creating a
common set of well-understood calls and responses from blockchain nodes that can
be used by anyone adhering to the API standard.

## Choose Your Own Integration Adventure

One of the most appealing facets of how Coinbase has developed Rosetta is that
we could choose our own path for figuring out how to satisfy the spec. Kadena’s
software for the Chainweb protocol is written in Haskell, and we decided that
rather than make a new and separate package for Rosetta, we would expand our
existing node package
([Chainweb Node](https://github.com/kadena-io/chainweb-node)) to fully support
Rosetta. This way, an exchange that expects information from our blockchain in
the shape of Rosetta calls can run a regular Chainweb full node and know they
will receive data to spec. In the future, Rosetta may graduate to being a
separate process from the node, but for now, this approach simplifies deployment
tremendously.

The [Rosetta spec](https://djr6hkgq2tjcs.cloudfront.net/docs/Introduction.html)
has a rigid, standardized JSON structure as part of its API definitions, so
using a strongly-typed language like Haskell made it simple for us to natively
represent the data and ensure that we would always return the correct format of
payload.

## Lost in Translation

One of the more challenging opportunities we faced with Rosetta was the
interpretation of the documentation, rather than implementation. Because Rosetta
is aimed at being blockchain-agnostic, we often had to translate between varying
styles of terminology, which either didn’t seem to apply to Kadena or used
different labels than we expected.

Kadena uses an account-based model for tracking tokens rather than a UTXO-based
model like Bitcoin. Also, unlike Ethereum for example, Kadena has abstraction
between the name of an account and the keys associated with an account.
Functionally, this feature allows users on Kadena to protect their accounts with
what we call “guards.” Guards can be everything from a function to a “keyset” (a
list of multiple keys) or even a single key. Guards can represent multiple
signatures required, or may have time expirations and conditions. For more
information on Kadena’s guard system, see
[this article](https://medium.com/kadena-io/beginners-guide-to-kadena-accounts-keysets-fb7f32104291).

Naturally, Rosetta doesn’t have specific provisions in the spec for Kadena’s
account-keyset-guard paradigm, so sometimes we had to get creative in turning
the words in the documentation into what we thought the intent was before
determining how we would integrate with Rosetta given our unique architecture.

For example, Rosetta uses the
[AccountIdentifier](https://djr6hkgq2tjcs.cloudfront.net/docs/models/AccountIdentifier.html)
model in order to associate the account of a user on an exchange to the
equivalent account on the blockchain. It has three properties, “address”,
“sub_account”, and “metadata.”

![](/assets/blog/2020/0_tl-c2db-uvN8MOXf.png)

For Kadena, “address” is a username, which we call an account name. The
instructions for “metadata” therefore suggest that, since we’re using a username
model, we would provide in metadata an Object blob that contains all public keys
associated with the address field. (Note that the spec presumes that the address
“owns” a public key, but Kadena doesn’t have a paradigm in which an address has
exclusive control of a key. For Kadena, a user can sign many different accounts
with the same key, keysets, key guards, etc.)

This “metadata” field caused us a bit of a conundrum. Not only is it possible to
have multiple keysets associated with an address and many addresses associated
with the same keysets, but under the “guard” paradigm, you can also have
multiple different time locks or other functions protecting an account.

In the end, we solved this issue in the most verbose way possible — in the
AccountIdentifier metadata object, we return a blob of all keysets and guards
associated with the account and assume that the requestor knows enough about the
Kadena guard paradigm to know what they’re getting.

## Exposing Hidden Operations

The heaviest lifting we had to do in implementing Rosetta was fleshing out the
Block request. The expectation with the
[Block request](https://djr6hkgq2tjcs.cloudfront.net/docs/BlockApi.html) is that
it will return every single balance-changing operation in a block. At first
glance that expectation seems trivial, but for a blockchain transaction, the
number of balance-changing operations start to explode quite quickly.

Consider a smart contract in which you want to execute a simple operation, like
adding the numbers 1 and 2. There is only one transaction here: the smart
contract containing “(+ 1 2)”. No transfer of tokens occurs, but because of gas
fees, the response to the Block request gets represented as three separate
operations: 1) The sender’s account is debited tokens to execute the
transaction, 2) The miner is credited the gas fee, and 3) The sender is credited
for any unused gas fee since gas is estimated on the front end and reconciled on
the back end of every transaction.

Now imagine the complexity involved in a “transfer-create” transaction, in which
the sender is creating a new account and transferring funds to that new account
all in one transaction — the level of complexity is quite high. The interface
also needs to account for not only the operations made using the pre-made smart
contracts included in Kadena’s Coin Contract, but also any arbitrary smart
contracts written by users with the Pact smart contract language.

## One Key for Many Doors

For our team, implementing Rosetta was a useful way to examine our existing data
endpoints from the perspective of an exchange — the Rosetta spec is a proxy for
knowing what exchanges care about when they ask for data from a blockchain. We
discovered that data that we had thought would be useful wasn’t being requested
at all and saw that we were limited in several areas that we hadn’t anticipated.
Implementing Rosetta felt like a health check for our API, and our Chainweb Node
endpoints definitely came out tighter with the work completed.

It will be interesting to see which other projects and exchanges adopt Rosetta
over time, how their experiences mirror and differ from ours, and how the spec
will evolve. As an industry, we’ve generally placed a premium on innovation and
divergence, but Rosetta seems like an opportunity for all of us to benefit from
some standardization that may result in greater adoption.
