---
title: Pact 4.6 is In (pre)Flight
description:
  Kadena is hard at work offering new and improved visions of the blockchain
  industry and its tooling. In particular, the Pact team is happy to announce
  improvements to the Kadena public blockchain Pact API in conjunction with
  developments and new additions to the language itself. As Kadena matures, we
  are bringing a new focus to the User Experience/Developer Experience of the
  platform and its tools, which includes envisioning future L2 solutions in the
  ecosystem. To initiate these efforts, Kadena presents the following new
  features
menu: Pact 4.6 is In (pre)Flight
label: Pact 4.6 is In (pre)Flight
publishDate: 2023-02-22
author: Emily Pillmore
layout: blog
---

# Pact 4.6 is In (pre)Flight

![Announcing the release of new smart contract features with Pact 4.6!](/assets/blog/1_BkKdH9y8UNpl4U5agsOesg.webp)

Kadena is hard at work offering new and improved visions of the blockchain
industry and its tooling. In particular, the Pact team is happy to announce
improvements to the Kadena public blockchain Pact API in conjunction with
developments and new additions to the language itself. As Kadena matures, we are
bringing a new focus to the User Experience/Developer Experience of the platform
and its tools, which includes envisioning future L2 solutions in the ecosystem.
To initiate these efforts, Kadena presents the following new features:

## Zero Knowledge Primitives

As a result of the new collaboration between Kadena and Electron Labs, Pact has
included several new built-in functions that allow users to build zero-knowledge
solutions.

- `pairing-check`: performs the pairing and final exponentiation points in BN254
  curve pairs.

- `point-add`: adds two points together that lie on the curve BN254. Point
  addition is either in F_q or in F_q^2.

- `scalar-mult`: multiplies a point that lies on the curve BN254 by a scalar
  integer value.

Together, these natives provide the basis for Zero-Knowledge proof construction
and verification. While proof generation is still something the user would need
to supply in the meantime, this allows at least the point calculation and proof
verification to exist on-chain, providing a strong cryptographic witness to ZK
proofs in a decentralized execution environment.

## Improvements to Formal Verification

The Pact team recently welcomed Robert Soeldner to the team as a Haskell
developer and as the point person on Pact’s built-in formal verification engine.
Within a relatively short period of time, Pact has ended up with many upgrades
to outstanding bugs in the FV system, as well as a wealth of UX advancements to
the surrounding instrumentation. Among the fixes are enhancements to the
typechecker and various outstanding warnings for known issues with certain
built-ins like `select`, in addition to the ability for users to study SMTLib
output on a per-module basis using the `verify` debug flag overload.

## Bringing Errors Back to the Blockchain

One of the sorely missed features that went away in the most current iteration
of the Kadena public blockchain was error output from the `/send` endpoint. This
created a lapse in error coverage, where the `/local` endpoint, Kadena’s
node-local transaction simulation endpoint, was not robust enough to provide
accurate error messages. `/send`, the previous means by which transaction errors
were generated, now failed to do so. Hence, we decided to improve the `/local`
endpoint to the point where it would all but subsume transaction simulation
using `/send`. While we at Kadena understand that this was a rather difficult
period for users, we are offering a two part solution in two separate
installments:

1.  `/local` now features a pre-flight simulation api, which brings `/local`
    transaction simulations as close to `/send` as possible: all transaction
    metadata is validated as it would be in `/send`, transaction execution
    covers the full breadth of gas costs from transaction size to the cost of
    gas purchase in addition to the cost of running the function, and the new
    API is _fully backwards compatible with existing `/local`-based workflows!_
    Read more about it here:
    [https://github.com/kadena-io/chainweb-node/pull/1585](https://github.com/kadena-io/chainweb-node/pull/1585)

2.  `/send` in future node upgrades, will default to an error code API that will
    allow users to query for transaction errors on chain using our Chainweb Data
    offering. This offers two benefits that are important to consider for the
    scalability of the system as more and more users pour in: we don’t have to
    store brittle error messages on-chain, and error codes are much less prone
    to exploits that lock in error formats as they currently exist in Pact,
    allowing us to change internal representations in Pact without affecting
    on-chain semantics.

We want to hear from you as we improve the UX/DX surrounding errors in Pact and
its APIs. User feedback is taken into consideration at all steps of the
improvement process.

Please make your voice heard on our issues!

![](/assets/blog/1_R5aPOgbndA0IadxYyN23ew.webp)

## A warning system for Deprecations

As Pact gears up for its eventual Pact Core migration, some features are being
deprecated in the lead-up to the release. In order to make these deprecations
known, rather than writing an article for each deprecation in the cycle, Pact
now features a system that provides a warning when certain constructs that are
going to be deprecated are in use. Additionally, when one goes to use the
`/local` preflight simulator, the endpoint delivers any relevant warnings in the
transaction execution workflow as a message returned along with the result of
execution.

## Conclusion

Kadena continues to improve the existing Pact story for both users and
developers while Pact shapes up for its migration to Pact Core. As we charge
forward with new improvements at our current blistering pace, we also can’t
forget how incredible it is to see community involvement in both the design
process (in issues, on pull requests), and actually submitting content to the
language. In particular, we’d like to thank new contributors @qooboodoop and
@omahs, who provided great progression to the Pact service defaults and
documentation, respectively. We hope to see more from the community as we grow
and see more adoption.

Visit us on GitHub to read the full Pact 4.6 release:
[https://github.com/kadena-io/pact/releases/tag/v4.6.0](https://github.com/kadena-io/pact/releases/tag/v4.6.0)
