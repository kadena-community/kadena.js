---
title: What’s new in Chainweb 2.17
description:
  Kadena is releasing a new version of Chainweb Node, version 2.17 which will
  have a service date in effect as of 2022–12–01T00:00:00Z. In addition to
  various bug fixes and performance optimizations, this release will change the
  current Pact and Chainweb Node experience for some dApp developers and users.
  In this article, we will explain the UX/DX-relevant changes in depth, and
  provide a migration path.
menu: What’s new in Chainweb 2.17
label: What’s new in Chainweb 2.17
publishDate: 2022-11-30
author: Emily Pillmore
layout: blog
---

## What’s new in Chainweb 2.17

![](/assets/blog/1_ZKcQU0DnPml7EiRCvMoxGg.webp)

Kadena is releasing a new version of Chainweb Node, version 2.17 which will have
a service date in effect as of **2022–12–01T00:00:00Z**. In addition to various
bug fixes and performance optimizations, this release will change the current
Pact and Chainweb Node experience for some dApp developers and users. In this
article, we will explain the UX/DX-relevant changes in depth, and provide a
migration path.

### Namespaced Keysets

As of Pact 4.4, we’ve introduced the concept of Namespaced Keysets, which
changed the Pact developer experience in favor of more flexibility and security.
As of Chainweb 2.17, Pact 4.4 will become the new node standard. For a more
detailed explanation of how this will affect users and developers, we wrote
about this in a previous [post](./whats-new-in-pact-4-4-2022-08-31).

### Removing Error Details from /send endpoint

Pact features rich error messages to help builders debug problems and handle
failures in production. However, this has caused problems for recording
transactions on the Kadena blockchain, which has to preserve bit-for-bit
behavior for every block. For example, if a miner builds a binary with a
slightly different library version, an unexpected error can result in different
hashes for blocks. To resolve this, error details and stack traces will no
longer appear in failed transactions sent to the **/send** endpoint, but the
error type is still available. This also gives some performance gains by not
computing code to assemble the message.

Full error messages are still available using the **/local** endpoint, and
builders are recommended to use **/local** to execute pre-flight simulation,
which is the best practice anyway, and can detect errors before submitting to
the blockchain and spending gas.

### Fine Tuning the Gas Model

In previous Chainweb node versions, our work centered on fixing various security
threat vectors, which affected the gas model. As we work to fine tune the gas
model, we’ve actually found a way to make operations such as transferring coins
cheaper than ever before. Developers will want to recalibrate the gas limits
they use for transactions. You can see how much a gas a particular transaction
takes using the **/local** endpoint for pre-flight simulation.

### Node Performance and Bug Fixes

In addition to the above changes, Chainweb 2.17 features the following
performance improvements:

- Improved performance during catchup

- Improved P2P protocol performance

- Improved TLS session management

- Faster and safer binary serialization across the board

Along with the following bug fixes:

- We now protect against possible race conditions in SQLite interface code

- Chainweb 2.17 features a per-tx timeout during creation of new blocks to
  prevent mining nodes from stalling when block creation takes too long

### Summary

The Kadena public blockchain is constantly evolving to meet the demands of dApp
developers and bring innovative technology to the forefront of the crypto
industry. We are listening and addressing feedback as it comes to us, and
providing bull-market solutions in a bear-market winter. We welcome your
feedback, and hope to hear more from builders.
