---
title: Get to know Pact 4!
description:
  Smart contracts are all about making things happen — every transaction on the
  blockchain records assets changing hands, or community members committing to
  support a project. With Pact 4 the safest and easiest smart contract language
  gains powerful new features to ensure apps ship with the most security,
  transparency and kickass functionality possible. With new community-driven
  primitive ops, better cross-chain and event support, and code coverage, Pact 4
  is the most productive smart contract language ever.
menu: Get to know Pact 4!
label: Get to know Pact 4!
publishDate: 2021-06-17
headerImage: /assets/blog/1_qYmdUAxT3iqFnIlJSQ_YYw.webp
tags: [pact]
author: Emily Pillmore
authorId: emily.pillmore
layout: blog
---

# Get to know Pact 4!

_Learn all the ways Pact 4 accelerates safe smart contract development_

Smart contracts are all about making things happen — every transaction on the
blockchain records assets changing hands, or community members committing to
support a project. With Pact 4 the safest and easiest smart contract language
gains powerful new features to ensure apps ship with the most security,
transparency and kickass functionality possible. With **new community-driven
primitive ops, better cross-chain and event support, and** code coverage,
\*\*Pact 4 is the most productive smart contract language ever.

## What’s new in Pact 4?

Pact 4 brings major improvements in **functionality, auditability, and
transparency,** things that are more important than even as decentralized
economies and marketplaces continue to dominate crypto.

## Great new community-demanded primitive ops

There are more Pact developers than ever before and with that comes positive
pressure on the language to grow new powerful features that continue the Pact
philosophy of “safer doesn’t mean weaker”: indeed Pact 3.x already ships with
more built-in functionality than any smart contract language around. Still, devs
will be devs and find new itches to scratch as well as corners where Pact could
be even better:

**String abstractions:** while Pact already ships with a full toolset for
manipulating strings, some more advanced concepts were hard and gas-expensive to
implement, and as Pact devs get more sophisticated they have identified some
gaps: namely, the ability to treat a String as an array, or list of characters,
as well as more list manipulation tools.

With the new **str-to-list** builtin, Pact devs can cheaply convert in order to
use Pact’s powerful functional list operations like **map, filter** and **fold**
on a list of single-character strings. Of course, it would be unsporting to not
be able to convert back, which exposed the need for the common **concat**
operation — while already easily achieved with _(fold (+) “” …)_, familiarity
with concatenation makes it a good pair for **str-to-list** as a bidirectional
transformation — a pair of functions devs can keep in mind when needing to
perform advanced operations on strings.

**More list operations:** Pact, as a LISP, is all about lists, and in its full
generality allows for every operation imaginable if you can express it, all
within a Turing-incomplete language. However, like **concat**, some operations
are just better handled as built-ins, which again the community noticed. Things
like de-duplicating list entries with **dedupe**, or emitting series of numbers
with **enumerate**, offer gas-cheap ways to do these useful things and focus
more on business logic.

## More support for blockchain “Events”

**More ways to emit events:** Pact already has a great mechanism for **events,**
which form crypto-verifiable “facts” that are critical for indexers and for
cross-chain operations on Kadena and EVM chains alike. The new **emit-event**
built-in makes event firing “free” as opposed to using **with-capability** which
invokes the capability even if it’s an empty event. However, **emit-event** also
allows managed capabilities to have arbitrary parameter values when used as
events. For example, the fungible TRANSFER capability emits the TRANSFER event,
but only for valid “balance-conserving” transfers like “Bob gives Alice 10.0
tokens”. With **emit-event**, TRANSFER can also be used for “burns” and
“creates” using the empty account (“”), which would never form a valid TRANSFER
capability, but follows ERC-20 and related standards for burn and create event
emission in a way that indexers and exchanges expect.

## Cross-chain Improvements

**Built-in cross-chain events and upgrade back-compatibility:** Pact has the
best cross-chain story of any smart contract language thanks to **defpact**s,
which automatically handle cross-chain transfers for any asset imaginable with
zero developer effort. However, it was hard for indexers to be aware of these
occurrences; and worse, if a smart contract was upgraded, it could mean that a
cross-chain initiated beforehand could become permanently “orphaned”, as the
security check for cross-chain demands that code hashes match on both sides;
after an upgrade this would fail.

In Pact 4, the already existing **bless** mechanism, which allows old versions
of smart contract code to continue to support old users, now also supports
cross-chain transfers that span an upgrade with the inescapable hash change.
Plus, Pact now automatically emits **X_YIELD** and **X_RESUME** events for every
cross chain, meaning that devs no longer have to worry about indexers tracking
their cross-chain events.

## KDA coin contract v3!

**KDA support for more events:** version 3 of the **coin** contract for KDA
takes full advantage of new Pact 4 features to emit TRANSFER events for every
event on the blockchain, whether that’s miner rewards, gas payments, or
cross-chain burns and creates. It blesses the previous hash to ensure that
midstream cross-chains succeed that occur during the upgrade. Finally it
leverages the X_YIELD and X_RESUME events to be **the most transparent and
indexable platform coin ever.** It’s important to remember that unlike any other
blockchain, KDA’s economics are implemented by smart contract: so at Kadena,
we’re as much Pact **users** as we are its designers. **coin** acts as a great
cookbook for new developers to study and v3, with Pact 4, is no exception.

## Code Coverage

With Formal Verification support and excellent support for unit tests and
blockchain simulation, Pact is already the best language for correct, bug-free
smart contracts. However, as Pact becomes responsible for more and more value,
things like auditing code become critical. Pact 4 addresses a major need by
providing **code coverage** so that devs can immediately see if their code is
being fully exercised by their unit tests.

![Code-coverage support in Pact 4 with Atom editor support. The red means **read-account-admin** lacks code coverage and needs tests.](/assets/blog/0_Bvt7cXRlG9P5u75A.png)

This is of course fully supported in the **pact** tool by simply adding “-c” to
the pact call. In the Atom editor, a quick upgrade to version 2.6.4 of
**language-pact,** plus adding the **lcov-info** plugin, gives quick access to
coverage results. Coverage in Github CI can quickly be enabled with the standard
[code-coverage-report](https://github.com/marketplace/actions/code-coverage-report)
action.

## Start using Pact 4 today!

It’s never been a better time to start learning Pact than now as the Kadena
blockchain continues its rapid growth as the “home of DeFi” with every major
use-case on its way to production before 2021 is out. Check out
[docs.kadena.io](https://docs.kadena.io), and upgrade by
[downloading it](https://github.com/kadena-io/pact/releases/tag/v4.0.1) or using
brew upgrade kadena-io/pact/pact.

Get on the inside track and start writing successful, safe and profitable smart
contracts in Pact! Check out our developer quickstart at
[https://quickstart.chainweb.com/](https://quickstart.chainweb.com/) , join our
[Discord](http://discord.io/kadena) and get hacking!
