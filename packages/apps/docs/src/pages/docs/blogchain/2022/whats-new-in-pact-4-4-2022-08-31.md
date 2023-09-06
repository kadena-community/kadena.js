---
title: What’s New in Pact 4.4
description:
  Every growing decentralized community needs builders. With the new cohorts of
  grantees selected by Kadena Eco being announced every week, the Pact
  engineering team has been hard at work soliciting feedback and developing
  features for dApp developers to build their projects with more security,
  robustness, and confidence than ever before. Pact 4.4 brings major
  improvements in functionality, auditability, and transparency — primitives for
  building the decentralized economies and marketplaces that continue to
  dominate crypto.
menu: What’s New in Pact 4.4
label: What’s New in Pact 4.4
publishDate: 2022-08-31
author: Emily Pillmore
authorId: emily.pillmore
layout: blog
---

![Check out the newest changes to Pact 4.4](/assets/blog/1_IW4RipwJLD_0U4n4O6_MlA.webp)

# What’s New in Pact 4.4

Every growing decentralized community needs builders. With the new cohorts of
grantees selected by Kadena Eco being announced every week, the Pact engineering
team has been hard at work soliciting feedback and developing features for dApp
developers to build their projects with more security, robustness, and
confidence than ever before. Pact 4.4 brings major improvements in
functionality, auditability, and transparency — primitives for building the
decentralized economies and marketplaces that continue to dominate crypto.

Among the changes Pact 4.4 will bring to the ecosystem is a general move towards
namespacing and principal account protocols becoming the norm. This is in
response to several improvements identified over the course of the Kadena
Improvement Process for `k:` account protocols that enable more robust
methodologies for working with on-chain governance. Kadena is introducing the
following as features for the language and network:

### Namespaced Keysets

Keyset names have historically been un-namespaced, living in a global keyset
registry on each chain. Due to the growing network contention for keyset names,
as of Pact 4.4, all newly defined keysets will be required to be namespaced
going forward. While in most cases, users never interact with keyset names, this
will affect dApp developers and builders using Pact who wish to define smart
contracts using their own custom governance, defined within their chosen
namespace.

As an example, in code:

![](/assets/blog/0_M7ORsEza4hJkfG9A.png)

There are few times when a keyset name is of importance, and are limited to a
few use cases:

- enforce-keyset/enforce-guard

- keyset-ref-guard

- define-keyset

- keyset name module governance

This change applies almost exclusively to builders and power users who are
writing their own smart contracts or engaging in more sophisticated governance
methods. This should make things less ambiguous for everyone!

Adding this feature also allows Kadena to lay the foundation for
principal-namespaces — a feature that will be introduced to the community in the
upcoming weeks.

Note: legacy keysets _are not required to migrate_. This change only applies to
newly defined keysets. That is, legacy keysets will still work, and still be
rotatable.

### Gas adjustments for Format and Try

Gas was previously too lenient for both `format` and `try`, and has been
adjusted to be more accurate with respect to its actual computational cost. This
results in contracts that make use of either function to cost slightly more gas.

_Most notably, KDA transfers via **coin.transfer**, **coin.transfer-create** and
**coin.transfer-crosschain** will use more gas. Tool and dApp developers (such
as wallets and exchanges) should adjust their gas limits appropriately._

These continuous improvements to our gas-model will eventually lead to
adjustments in blocksize, but because of large effects that small lowlevel
changes can have on network health, prudence dictates a conservative timeline
for the rollout of these changes.

### MUSL-based mathematical primitives

All the transcendental math functions in Pact (log, ln, exp, sqrt and pow) now
rely on implementations of these functions from the MUSL library
([https://www.musl-libc.org/](https://www.musl-libc.org/)). With this change,
the implementation of these functions is now in high-precision plain C, allowing
more consistent behavior across platforms, compilers, operating systems and
processors. Previously, differences in how these functions were realized by the
Haskell compiler could lead to scenarios in which values differed ever so
slightly — enough to result in hash mismatches causing block validation failures
and an inability to advance the chain for some nodes.

Please share your feedback with us on our
[Discord channel](http://discord.io/kadena) to help us improve tooling for our
builders.
