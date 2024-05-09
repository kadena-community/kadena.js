---
title: Safer, Smarter Contracts with Pact
description:
  Smart contracts are the key to realizing the full potential of blockchain
  technology; a smart contract may one day secure your house on a blockchain,
  assure your digital identity, enable easy international payments, and much
  more.
menu: Safer, Smarter Contracts with Pact
label: Safer, Smarter Contracts with Pact
publishDate: 2019-02-20
headerImage: /assets/blog/1_F3EjRcDtfBjShCP0qszVLg.webp
tags: [pact, smart contract, formal verification]
author: Vivienne Chen
authorId: vivienne.chen
layout: blog
---

# Safer, Smarter Contracts with Pact

### How Kadena’s smart contract language supports blockchain adoption

Smart contracts are the key to realizing the full potential of blockchain
technology; a smart contract may one day secure your house on a blockchain,
assure your digital identity, enable easy international payments, and much more.

But for blockchain as an industry to truly build useful and valuable systems,
smart contracts need to be trustworthy to the point where they can be assumed to
be always correct — and until we reach that point, the industry will struggle to
reliably represent anything of value using blockchain technology.

Smart contracts have evolved over the years into a core technology that holds
significant potential. Here at Kadena, we built our smart contract language
[Pact](http://pact.kadena.io) and platform from the ground up to be a system
that users can trust.

## The State of Smart Contracts

The term ‘smart contracts’ was first introduced by
[Nick Szabo](https://en.wikipedia.org/wiki/Nick_Szabo) in the late 1990’s where
he defined them as:

> _“a computerized transaction protocol that executes the terms of a contract.
> The general objectives are to **satisfy common contractual conditions **(such
> as payment terms, liens, confidentiality, and even enforcement), minimize
> exceptions both malicious and accidental, and minimize the need for trusted
> intermediaries.”_
>
> _- Nick Szabo, “Smart Contracts”_

Bitcoin, as the first decentralized cryptocurrency, offers _scripts_ written in
a minimal, non-Turing complete bytecode language. These scripts cannot function
as complete smart contracts — their primary usage is allowing a custody check to
succeed or fail on a given Bitcoin amount (an “output”). Programmers are able to
timestamp other transactions using extra data fields in the transaction with
infinitesimal amounts of Bitcoin, but these were considered “hacks” and indeed,
custom scripts are prohibited by production Bitcoin systems. These limitations
motivated the eventual creation of Ethereum.

Ethereum sought to expand the power of Bitcoin scripts to allow users to create
arbitrary smart contracts. Bitcoin expresses scripts in _bytecode_, a low-level
encoded format that was intended to be small, safe, fast and deliberately
limited to keep transactions safe. Ethereum enlarges this bytecode significantly
into a “virtual machine” that resembles the machine code that runs on a
primitive computer, and indeed early marketing for Ethereum called it a “World
Computer.” Contracts coded in Solidity (Ethereum’s smart contract language) are
compiled into long streams of bytecode that are installed and executed on the
Ethereum Virtual Machine (EVM). Solidity (and the EVM) is
[Turing-complete](./turing-completeness-and-smart-contract-security-2019-02-11),
meaning it has the potential to compute any computer algorithm given
availability of sufficient time and resources. Thus, Ethereum smart contracts
opened up greater potential use cases for blockchain technology beyond what
Bitcoin scripts could offer. These use cases included initial coin offerings,
tokenized securities and assets, prediction markets, and immutable voting, to
name a few.

However, the added versatility offered by Solidity smart contracts c**_omes at a
great cost in safety and complexity_**, jeopardizing the security and
reliability seen in Bitcoin. Some pressing issues faced by Ethereum’s Turing
complete smart contracts include:

- An explosion of attack vectors:
  [the EVM’s general purpose nature and complexity mean that hackers can find malicious openings to attack and capitalize on smart contract bugs and vulnerabilities](/blogchain/2018/the-evm-is-fundamentally-unsafe-2018-12-13).
  These vulnerabilities have occurred or been exploited in the past resulting in
  the loss of hundreds of millions of dollars, as seen in the
  [DAO hack](https://www.coindesk.com/understanding-dao-hack-journalists/),
  [Parity Wallet multisig bug](https://cointelegraph.com/news/parity-multisig-wallet-hacked-or-how-come),
  and other high profile
  [smart contract failures](https://applicature.com/blog/history-of-ethereum-security-vulnerabilities-hacks-and-their-fixes).

- Impenetrable bytecode on chain: Because Solidity compiles down to the EVM’s
  lower-level bytecode language, it is no longer able to be read or inspected by
  humans, resulting in no reliable means for users to verify the code that is
  actually executed on the blockchain.

Furthermore, Ethereum smart contracts face great difficulties when it comes to
extracting data out of smart contracts and general usability of the system. In
order for smart contracts to achieve widespread adoption, data held in smart
contracts will need to be able to interact and integrate with existing database
systems and be significantly easier to read, write, and understand.

To make matters worse, the high level of human interaction required to create an
Ethereum smart contract greatly increases the possibility of human error, and
therefore critical bugs. The risks and issues faced in Ethereum smart contracts,
coupled with
[scalability](https://cointelegraph.com/explained/blockchains-scaling-problem-explained)
issues, will stifle blockchain’s long term potential.

At Kadena, we believe the following key principles are required to achieve wider
adoption of smart contracts:

1.  **Correctness for smart contracts is crucial**. Significant stakes are on
    the line when smart contracts handle transactions dealing in millions of
    dollars worth of value.

2.  If smart contracts face great risk and vulnerabilities, then **blockchain
    adoption will stall** as businesses will hesitate to adopt, test, and
    experiment with new, unproven, and risky technologies.

3.  Human error is an inevitable point of vulnerability in all smart contracts
    and **needs to be accounted for** in any programming language designed to
    serve humans.

## Smart Contracts in Pact

[Pact](http://pact.kadena.io) is an open-source Turing-incomplete smart contract
language that has been purpose-built with blockchains first in mind. Pact
focuses on facilitating transactional logic with the optimal mix of
functionality in authorization, data management, and workflow.

We strongly believe smart contracts **should only execute on the intent of the
programmer**. Therefore, we have designed a Pact smart contract to execute only
on what it has been programmed to do, which offers a much safer environment for
conducting business.

![A snapshot of a payments contract from pact.kadena.io](/assets/blog/1_j9I9GRBJqGvdOGTh9tfbEg.webp)

### Interpreted Code

Pact code is executed directly on the ledger and is stored in a human-readable
format as an immutable transaction. This means Pact smart contracts can be
openly verified by anyone.

Smart contracts are more than just code, they also serve as core business
processes, and making smart contract code human-readable is critical for
accessibility from non-developers. This includes technical executives, lawyers,
and other business professionals that are required to read, review, and verify
the intent and execution of a smart contract.

### Turing Incomplete

We consider Pact a spiritual successor to Bitcoin scripts — Bitcoin scripts
served as inspiration for Pact and they share several similarities, one of which
is that they are both Turing incomplete, meaning they do not allow recursion or
infinite loops. In Pact, any recursion that is detected will cause an immediate
failure and terminate all running code. This feature significantly
[reduces any potential attack vectors](/blogchain/2019/turing-completeness-and-smart-contract-security-2019-02-11)
that may be present in smart contracts.

### Blockchain Governance

Unlike Solidity-based contracts, Pact smart contracts can be updated, changed,
or fixed through an update mechanism to declare new versions of a smart contract
that are applied only once the new code has been successfully executed. Any
errors will automatically roll back the smart contracts to their previous state
and abort making any new changes. This feature allows developers to fix
potential errors and for contracts with multiple parties to update their
agreements to represent evolutions in business logic.

### Pact APIs

Similarly to how understanding smart contract code should not be confined to
only developers, we also believe smart contract data should not be stored only
on-chain. This tenet is why Pact has API functionality so that data stored in
smart contracts can be extracted into external databases via SQL.

### Formal Verification

Pact also comes equipped with a powerful validation tool suite in the form of
[formal verification](/blogchain/2018/pact-formal-verification-for-blockchain-smart-contracts-done-right-2018-05-11).
Pact uses Z3, an open source tool developed by Microsoft, to mathematically
verify and test for bugs present in code.

The formal mathematical verification system analyzes code with the use of proofs
to test an intention that has been programmed into a smart contract. The feature
allows developers to prove whether certain conditions can or cannot be met for a
smart contract given all possible inputs that are available.

Formal verification greatly reduces vulnerabilities due to human error by
ensuring that unintended outcomes and consequences cannot happen in Pact smart
contracts which significantly reduces the potential attack vectors for malicious
entities to exploit in a trustless environment.

## The Future of Smart Contracts

For blockchain to truly realize its transformative potential, we need to commit
to providing developers and users with smart contracts that they know they can
trust. Pact has been designed from the ground up to offer developers a simple
way to implement secure and bug-free smart contracts. Pact ships with a
feature-rich REPL which allows for rapid, iterative development, incremental
transaction execution, and environment and database inspection. Developing with
Pact code is meant to be fun and productive; please visit our
[Github](http://Github.com/kadena-io) and [docs.kadena.io](https://docs.kadena.io)
to learn more.

Developers can now create next-generation smart contracts that open the door for
tangible uses that require representing real value and assets on a blockchain.
We will see new projects using Pact to disrupt incumbent industries, forever
changing in unforeseen ways how we conduct business.
