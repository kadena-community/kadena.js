---
title: Announcing Pact 3.0
description:
  At Kadena, smart contract technology is something we’re very passionate about
  — so we’re excited to announce the release of Pact 3.0. It’s our biggest Pact
  release in over a year and delivers significant new features designed to make
  Pact the premier standard for smart contract authoring in both public and
  private blockchains.
menu: Announcing Pact 3.0
label: Announcing Pact 3.0
publishDate: 2019-06-06
headerImage: /assets/blog/1_jD9StZRQL8Gxw-J4z1Lc9Q.webp
tags: [pact]
author: Stuart Popejoy
authorId: stuart.popejoy
layout: blog
---

# Announcing Pact 3.0

> _UPDATE: Pact 3.1 is now released! Read more on the
> [latest updates here](/blogchain/2019/pact-3-1-is-unleashed-2019-08-22)._

At Kadena, smart contract technology is something we’re very passionate about —
so we’re excited to
**[announce the release of Pact 3.0](https://www.coindesk.com/kadena-releases-updated-smart-contract-language-for-hybrid-blockchains)**.
It’s our biggest Pact release in over a year and delivers significant new
features designed to make Pact the premier standard for smart contract authoring
in both public and private blockchains.

In this post, we’re going to focus on three new and related features we’ve
shipped with Pact 3.0: **Capabilities**, **Module Governance**, and **Guards**,
and how our
**[Formal Verification](/blogchain/2018/pact-formal-verification-for-blockchain-smart-contracts-done-right-2018-05-11)**
system can help you eliminate bugs. Other major enhancements, like _integrated
SPV support_ and \*namespaces\*, will be covered in future posts.

The features discussed in this post are all available for you to try out — no
downloads necessary — in our **[web editor](http://pact.kadena.io)** today!

![Try Pact right in your browser at pact.kadena.io](/assets/blog/1_WpQQ1qagwvVuN8c0q4iw-w.webp)

## Capabilities

Smart contracts are all about **securing operations on the blockchain**, and the
details matter. In the secure computing world, _capability-based security_ has
emerged as the way forward for programmers to “get security right” the first
time, in everything from networking libraries to entire operating systems like
Fuscia from Google.

In the larger world of secure computing, capabilities offer a huge improvement
over the current state of affairs in operating systems like Windows and even
Unix, where _privilege escalation_ can result in a situation where total
administrative control is granted in an insecure fashion. The very notion of a
“[root user](http://www.linfo.org/root.html)” is an example, whereby simply
typing in a password can you get access to every sensitive function in a system.
This is a model most of us are familiar with, but it isn’t the most secure path
forward.

In a capability system, any resource or function _can only_ be accessed by
presenting some token that was specifically granted for that particular purpose,
and will be likewise managed or revoked according to the specific requirements
of the resource or function. That means a user called “root” can no longer
simply do whatever they want, but would instead be required to provide
particular unique credentials to install a device driver, or launch a new
process.

### Capabilities in Pact Smart Contracts

Capabilities in smart contracts have a long history. In fact, the
[first “smart contract language”](http://erights.org/smart-contracts/index.html)
precedes blockchain systems and uses capability-based logic! Even in a system
like Bitcoin, the similarities to capabilities are evident: Bitcoin has no “root
user” that can spend all the money. UTXOs require the presentation of a specific
credential or hashed secret to release funds, which expires immediately (thanks
to the UTXO system).

Kadena’s Pact allows the programmer to specify and parameterize a “capability”
that is then used to “bless” a particular body of code to be able to perform
sensitive tasks. Once that code section exits, the capability is released. As
such, Pact is a unique capability system, in that the capabilities are not
“handed around,” but are instead _invoked over a limited body of code_ to ensure
that this code can only be accessed by passing the right “test.”

Meanwhile, those “tests” can be whatever the programmer desires: checking a
keyset, examining the database state, enforcing some timeout (see “Guards”
section below for how these tests can be themselves modeled as data objects).
Finally, you can “label” functions to require certain capabilities in a way that
won’t _actually_ try to acquire it, which is an important way to protect
functions from improper access.

For a deeper dive, check out the
[Pact Reference Docs for Capabilities](/build/pact/advanced#guards-vs-capabilitiesh100483783).

## Generalized Module Governance

Another new feature in Pact turns something that was already awesome —
upgradeable smart contracts controlled by keysets —into a game changer:
**generalized module governance**. Now you can implement any governance scheme
imaginable, right in your smart contract code, and leverage
[Formal Verification](/blogchain/2018/pact-formal-verification-for-blockchain-smart-contracts-done-right-2018-05-11)
to ensure it does what you want.

Before Pact 3.0, defining a module required the definition of a keyset, which is
a very flexible scheme in its own right. The keyset can be single or
multi-signature. This means that even if one of your dev or devops leads is
unavailable, another can sign to allow for a bug fix or upgrade. This
authorization also allows you to directly upgrade the smart-contract data, not
just the code, so you really have the power to respond to any exploit, bug or
migration scenario.

### Decentralized Governance

There are other governance models that can’t be expressed with keysets. An
important one is _decentralized governance:_ keysets are centralized in that
only the parties declared in the keyset definition can obtain “module admin.”
While keysets can be rotated (we strongly recommend this), even that rotation
requires the credentials of the original keyset, and still just introduces a new
authority based on the identities in the new keyset.

With Pact 3.0, you can choose to specify a _governance capability_ instead of a
keyset, to enforce whatever scenario you can express in code. You can, of
course, simply enforce a keyset in the capability definition, to replicate the
old keyset logic. But you can do much more than that now.

For example, you can craft a governance scheme in which you tally a vote on an
upgrade to the smart contract itself. The proposer would submit the hash of the
upgrade transaction, and stakeholders would vote on it, perhaps weighted by
their relative stake. The governance function then simply tallies and enforces
some majority.

Clearly, this becomes an important feature to test and prevent bugs. A bad
governance function can make your contract unable to upgrade. This is where
**Formal Verification** really shines, now with the full support of our
capability logic: you can really cover all your bases and craft a truly secure
governance function (along with the rest of your smart contract).

## Guards

Keysets are one of Pact’s flagship features, making multi-signature, key
rotation and other sophisticated security practices easy and safe. However,
there are other schemes that can fulfill the same goal — that is, the goal to
_specify a test that a transaction must pass_ _to access a resource or perform a
function_.

We’ve already seen this kind of flexibility in Bitcoin and Litecoin: while P2PKH
and related single-signature scripts dominate, layer-two solutions like the
Lightning Network are powered by **atomic swaps**, which use special scripts to
reveal a hash secret and enforce a timeout while _also_ checking a public key.

Pact 3.0 introduces **Guards**, which generalize the keyset concept to include
powerful new tests, like allowing access to a resource to only one particular
smart contract, or even just a multi-step process (a “pact”) defined in that
smart contract. You can even define your own guards (“user guards”) to implement
functionality like atomic swaps.

Like everything else in Pact, the Guards concept means that you can use all of
these techniques easily and safely. Guards can be stored in the database and
shared among smart contracts. And of course, all of this can be verified in our
Formal Verification system.

## And More!

Pact 3.0 is full of compelling new features that will make writing smart
contracts a breeze on a public or private blockchain (or both, in the new hybrid
blockchain world):

**Namespaces:** group your smart contract modules under a single namespace.

**SPV support:** verify an SPV proof inside your smart contract code. In
Kadena’s public blockchain Chainweb, this is the central mechanism for managing
the single currency across multiple chains. But it’s also the way to massively
scale your smart contract logic over any number of chains! Support for
effortless interoperation with external private and non-Chainweb public
blockchains is on the roadmap.

**Multiple Signature Curves:** with Pact 3.0, support for Ethereum ECDSA keys
arrives, which can be used alongside our native (and technically superior)
ED25519 keys. Support for quantum-resistant ED448 curves as well as other
formats like BLS are on the way.

To learn more about writing safe smart contracts in Pact, check out
[PactLang.org](http://pactlang.org), which has numerous videos and help
resources. You can start trying out Pact 3.0 on our
[web repl](http://pact.kadena.io), and if you’re interested in beta-testing
contracts on our Chainweb Testnet, [get in touch](mailto:info@kadena.io). Don’t
forget you can also take our private blockchain for a spin, for free, on the
**[AWS Marketplace](http://kadena.io/aws).**
