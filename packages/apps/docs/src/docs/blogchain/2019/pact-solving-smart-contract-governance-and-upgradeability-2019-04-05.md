---
title: Pact - Solving Smart Contract Governance and Upgradeability
description:
  The blockchain industry undeniably spends a great deal of energy discussing
  governance, but sometimes the focus of governance gets confused. Usually, the
  focus is on the blockchain protocol layer, arguing about hard forks and the
  like. However, a major underexplored topic to consider is governance at the
  smart contract layer, especially since, for Ethereum at least, certain hard
  forks were motivated by bugs and exploits in smart contracts, not the protocol
  itself.
menu: Pact - Solving Smart Contract Governance and Upgradeability
label: Pact - Solving Smart Contract Governance and Upgradeability
publishDate: 2019-04-05
headerImage: /assets/blog/1_NOwRG03NfMqyaqGrmdPfKg.webp
tags: [pact]
author: Marie Leaf
authorId: marie.leaf
layout: blog
---

# Pact: Solving Smart Contract Governance and Upgradeability

The blockchain industry undeniably spends a great deal of energy discussing
_governance_, but sometimes the focus of governance gets confused. Usually, the
focus is on the blockchain protocol layer, arguing about hard forks and the
like. However, a major underexplored topic to consider is governance at _the
smart contract layer_, especially since, for Ethereum at least, certain hard
forks were motivated by bugs and exploits in smart contracts, not the protocol
itself. Many of the largest (i.e. highest monetary impact) bugs in blockchain’s
history were library dependency or multi-signature issues. In smart contracts,
we feel it is crucial to specify the details of upgrading — _how_ and *who *can
update the terms and conditions of existing contracts and sign transactions —
_in the smart contract itself_.

**Governance is a method or procedure for the upgrading of smart contracts
already running on the blockchain.** Governance comes in two distinct forms:

**\* Centralized Governance** where a set of individuals, as identified by their
public key signatures, are able to update the live contract at will. This is
easiest to model as a simple multi-signature scheme.

**\* Distributed Governance** where a weighted vote, generally cast by current
stakeholders, is held on a specific upgrade. This is a multi-stage process that
involves writing code to orchestrate the upgrade process.

Governance problems arise in current public blockchains like Ethereum because of
their immutable nature. In most environments, once a smart contract is deployed,
it cannot be changed without a large-scale network fork or completely abandoning
the entire contract application, moving all users’ funds to a reinstated
deployment. This is far from ideal, leaving behind valuable data about users’
history that makes blockchain secure. But in the day-to-day flow of normal
business operations — things change all the time and contracts and workflows
need to change to reflect those alterations. These changes should ideally NOT
disrupt related workflows or dependencies. Immutability can seem attractive for
code on a distributed ledger, making the difficulty seem worth the bother. _We’d
like to show how our solution is just as secure but still simple and elegant for
the smart contract developer._

**_Kadena’s blockchain smart contract language Pact offers a simpler and safer
solution for deploying smart contracts, with built-in governance functions and
support for updates at any point during the lifecycle of the smart contract,
without the need for hard forks._**

These features will allow developers to resolve critical issues and deploy
strategic improvements easily to existing smart contracts and enable individual
or enterprise parties to conduct business safely in a trustless and secure
environment.

## Total Governance

In Pact, when a smart contract is deployed, governance is directly specified
before any code is presented. _A keyset_ (a single or multiple-key signer
requirement) can be provided to administrate the smart contract, or a
_governance function_ can be referenced (in the body of the smart contract).
Keysets provide for simple, centralized governance, e.g. by requiring 2 out of 3
signers to sign off on an upgrade. A governance function opens the full power of
the smart contract language to orchestrate an upgrade, allowing for fully
democratic or distributed governance, where you gather votes on an upgrade hash
and enforce quorum at upgrade time. The point is **_you have the power to choose
how your contract is governed, and others using your contract can’t break your
code._**

Pact offers _atomic execution_, common for blockchain platforms, ensuring that
an individual transaction succeeds or fails as a unit — and in failure, the
contract is rolled back to its previous state. Applied to governance, this means
that upgrades performed in a single transaction cannot be “partially applied,”
further ensuring safety. The combination of atomic execution protecting the
upgrade and the power of keysets and governance functions to control the upgrade
process makes for a highly robust scheme we like to call _“Total Governance.”_

### Example: Pact fixes Parity Multi-sig Hacks

Updating Pact smart contracts occurs inside of a transaction that only commits
changes upon successful execution of the new code. This mechanism allows smart
contracts to be upgraded to newer versions, even after the smart contract is
live and running. Total Governance ensures that changes in upstream dependencies
will not break the contract itself. Developers can be assured that their code
will maintain its integrity, and fulfill its intended purpose. Pact protects
against upstream code breaking downstream code, avoiding instances like the
infamous [“Leftpad” case](/blogchain/2018/pact-2-4-is-out-2018-06-04) that broke
the internet, or the case of blockchain, the
[Parity multi-sig wallet bug](https://www.ccn.com/i-accidentally-killed-it-parity-wallet-bug-locks-150-million-in-ether/).

![](/assets/blog/0_NwHvTACo-YPamdsJ.png)

Pact protects users from a single person “accidentally” breaking your code from
afar; Pact solves for central library dependency attacks and allows contracts to
be truly and securely upgradeable. What’s more, to fix a problem like Parity
multi-sig, you wouldn’t need to ask for a hard fork vote from the community if
you chose a more reasonable governance model.

## Contracts as “Cryptocharters”

One way to understand what it means to have total governance is to look at a
smart contract application as more than just code, but as the governing model
for an entire distributed company — a _cryptocharter_. The term “cryptocharter”
is meant to reflect the idea that smart contracts are more than just code — they
should represent your business logic or organization workflow. Pact
cryptocharters are smart contracts that have governance options built-in to make
them “smarter” and safer.

This essentially means that for the first time ever, smart contract developers
can easily model governance structures according to their preferences, without
needing to resort to backdoor mechanisms, hard forks, or risky data structures.

Some other examples of features in Pact that support its ease of use and
cryptocharters:

- Pact cryptocharters have plain **text names and associated hashes**: importing
  a payments module is as simple as `(use ‘payments)`. For added security, the
  hash of the module can be added to the import like so
  `(use ‘payments <hash>)`. During import, if the latest version of `’payments`
  doesn’t have the correct hash, the load transaction fails harmlessly.

- Pact is a **Turing Incomplete** language. This means your contracts and code
  can’t run itself into unbounded loops. Even our non-technical team
  [discovered the importance of this feature](./turing-completeness-and-smart-contract-security-2019-02-11)
  when questioning what Turing completeness means in the context of blockchain.

You’ll be hard pressed to find another blockchain platform and smart contract
language that solves the problems that Pact can.

## Conclusion: What You Can Do With Pact Now

- [Try Pact](http://pact.kadena.io) out in your browser, no downloads required!

- Want to become a Pact developer? Check out
  [Pactlang.org](https://pactlang.org/)’s Tutorial Curriculum

- Check out our [Github](https://github.com/kadena-io/pact) — Pact is fully
  [open source](/blogchain/2018/why-we-open-sourced-our-blockchains-smart-contract-language-2018-05-04)
  with
  [Formal Verification](/blogchain/2018/pact-formal-verification-for-blockchain-smart-contracts-done-right-2018-05-11)
  tools baked-in
