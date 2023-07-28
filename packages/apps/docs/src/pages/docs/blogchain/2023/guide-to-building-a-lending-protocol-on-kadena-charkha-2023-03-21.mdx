---
title: Guide to Building a Lending Protocol on Kadena — Charkha
description:
  Decentralized finance (DeFi) emerged as a standout application of blockchain
  technology in late 2017 and broke into the mainstream in 2020. Decentralized
  finance represents a vision of a financial system that operates without
  intermediaries such as banks and other third-party entities. It instead relies
  on the power of smart contracts to facilitate transactions.
menu: Guide to Building a Lending Protocol on Kadena — Charkha
label: Guide to Building a Lending Protocol on Kadena — Charkha
publishDate: 2023-03-21
author: Kadena
layout: blog
---

## Guide to Building a Lending Protocol on Kadena — Charkha

Decentralized finance (**DeFi**) emerged as a standout application of blockchain
technology in late 2017 and broke into the mainstream in 2020. Decentralized
finance represents a vision of a financial system that operates without
intermediaries such as banks and other third-party entities. It instead relies
on the power of smart contracts to facilitate transactions.

DeFi applies the transparency and security of distributed financial technologies
to traditional finance use cases like borrowing, lending, and trading. In short,
it seeks to revolutionize how we think about finance and promote a more
accessible, democratized financial system.

Charkha is a decentralized lending protocol built on Kadena’s Chainweb
blockchain. The protocol was developed by Thomas Honeyman, a senior engineer at
Awake Security, as the final project in a Pact tutorial series titled
[Real World Pact](https://github.com/thomashoneyman/real-world-pact).

We’ll be catching up with Thomas today for an insightful and engaging discussion
on the Charkha lending protocol and what he likes about building with Pact and
Chainweb!

## What is Charkha?

Charkha is a minimal decentralized lending protocol inspired by
[Compound Finance](https://compound.finance/), which runs on Ethereum and, as of
March 2023, has roughly $1.5 billion in total value locked. Charkha demonstrates
a mixture of intermediate DeFi and Pact language concepts, as well as how to
build a frontend for a real-world blockchain backend.

It’s got all the features of a real-world lending protocol: you can borrow or
supply funds, earn rewards in the CHRK token for participating, use your CHRK
holdings to create and vote on proposals to change the protocol, and liquidate a
user’s holdings when they’ve exceeded their borrowing capacity and become risky.
These are concepts you’ll see all over the DeFi world.

On the development side, Charkha contains all the components of a real-world
DeFi project, including:

1.  The
    [Charkha white paper](https://github.com/thomashoneyman/real-world-pact/blob/main/03-charkha-lending/Charkha-Protocol-Whitepaper.pdf)
    which describes the protocol in depth, and which you should read first (it
    also has
    [a collection of examples](https://github.com/thomashoneyman/real-world-pact/blob/main/03-charkha-lending/Charkha-Protocol-Examples.pdf)).

2.  A
    [development guide](https://github.com/thomashoneyman/real-world-pact/blob/main/03-charkha-lending/guide),
    which explains how we translated the white paper into smart contract
    implementations.

3.  A collection of
    [commented smart contracts](https://github.com/thomashoneyman/real-world-pact/blob/main/03-charkha-lending/contracts)
    that implement the protocol and tests.

4.  A
    [TypeScript + React frontend](https://github.com/thomashoneyman/real-world-pact/blob/main/03-charkha-lending/frontend)
    that shows the current markets and their interest rates and allows you to
    lend and borrow assets, submit governance proposals, liquidate
    under-collateralized accounts, and more.

There are also helper scripts so you can deploy Charkha to your own local
version of Chainweb and interact with the protocol — it’s fully functioning.
That said, this is a teaching project only! Don’t try to use any of the code in
the real world, as it’s never been audited or stress-tested and is just for
example’s sake.

## What makes Charkha unique?

The biggest difference between Charkha and other lending protocols is that it’s
a teaching project. That means I’ve kept it simple — there’s not much to do
beyond lend, borrow, withdraw, repay loans, earn rewards, create and vote on
proposals, and liquidate user borrows when they have exceeded their borrowing
capacity. It’s also thoroughly commented, includes a white paper and development
guide, and has plenty of tests and some formal verification; this should help
intermediate Pact developers see concrete examples of how to write their own
DeFi applications.

However, there are other differences, too. Charkha is built with Pact, a Kadena
smart contract language specifically designed for writing secure smart
contracts. It can’t save you from all bugs, but it’s much harder to make common
mistakes with Pact, especially with a built-in formal verification system (which
Charkha uses.)

Also, Charkha can be deployed to Chainweb, a scalable, multi-chain blockchain
with super low gas fees and enormous throughput capacity. As part of the
project, we deploy Charkha to devnet, which is a development version of Chainweb
that mirrors how the real blockchain works.

## What inspired you to create Charkha?

Blockchain technology is fascinating, but when I learned about it I struggled to
see how it improved on existing technologies except for the narrow use case of a
digital currency. It wasn’t until I saw some of the work being done on
decentralized finance that things clicked for me. Of course, DeFi is still
nascent and there have been serious missteps so far, but it represents a
meaningful innovation in the financial industry.

Lending is a critical, high-trust activity in a community or economy. We have
all sorts of mechanisms in society to reinforce this trust — from the law and
regulation to collateral requirements to the strength of personal relationships.
It’s incredible that you can facilitate lending via a blockchain and do so
transparently, without trusted intermediaries — and most importantly, it works.
I think that lending, borrowing, trading, and stablecoins together provide a
prototype for an alternative financial system, albeit a limited one.

I wanted to build a meaningful teaching project on Chainweb, and a lending
application felt like the right choice.

## What are some special features of Charkha?

Some of my favorite features of Charkha include the community governance process
and the decentralized lending and borrowing.

In Charkha, one CHRK token per market is divided amongst the market participants
on every block; the higher your share of a market, the higher your share of that
block’s CHRK. What’s interesting about CHRK is that it’s a fungible token we
implement in Charkha according to Pact’s fungible token interface (KIP-0005),
and it’s used to create and vote on community proposals that change the protocol
itself.

Since CHRK is a fungible token, it can be traded just like any other token.
Charkha even supports a money market in CHRK, which means users can take out
loans for the sake of voting (for example), paying potentially high interest
rates for the privilege.

The protocol is decentralized, so there is no administrator who mints CHRK. The
rewards go straight to user accounts, so protocol developers can’t withhold
rewards or mint CHRK to manipulate a vote. Plus, when the vote closes, the
protocol change takes effect immediately, without the intervention of the
protocol developers. It’s autonomous.

There are all kinds of design decisions in Charkha that ensure that the protocol
can work with zero intervention from an administrator. When you lend funds to
Charkha, they go into an account owned by the protocol — but Charkha is designed
so that the only access to these funds is via the API explicitly supported by
the protocol. No developer can just swoop in and transfer funds elsewhere. Pact
makes this kind of fine-grained access control very easy with its capabilities
feature.

## During the development of Charkha, what did you like about Chainweb and Pact?

I appreciate the thoughtful restrictions that Pact places on smart contract
development. It’s Turing-incomplete, so it disallows recursion and loops, which
is a source of many bugs in Solidity. It’s immutable, so variables can’t be
reassigned. If you want mutation, you can use a database and perform updates via
normal database interactions, which cannot be done from outside your Pact
module. There’s an explicit system for access control called capabilities, which
makes it trivial to require that 2 of 3 keys were used to sign a transaction and
they allow a _specific_ block of code to be called (rather than allowing the
transaction to do anything it wants with their signatures.)

It can be strange to describe a language in terms of its restrictions instead of
its abilities, but these restrictions don’t meaningfully reduce _what_ you can
develop with Pact. They just change your development approach and help you avoid
shooting yourself in the foot. Smart contract mistakes
[can be extremely costly](https://savedby.kadena.network/)! They also enable
some incredible features that set Pact apart, such as its ability to formally
verify properties about your smart contracts. In Charkha, I’m able to verify
that the total market borrows never exceeds the total market supply.

I haven’t spent much time with Chainweb directly — it’s the infrastructure below
my smart contracts — but the most visible part of it is the gas fees paid on
each transaction, and I certainly like seeing my transactions cost a fraction of
a cent instead of the absurd fees seen on other blockchains.

We hope you enjoyed learning about Charkha! Many thanks to Thomas for sharing
his work on a truly phenomenal DeFi lending app in Pact.

You can see the full project on GitHub:

[https://github.com/thomashoneyman/real-world-pact/tree/main/03-charkha-lending](https://github.com/thomashoneyman/real-world-pact/tree/main/03-charkha-lending)

For the full Real World Pact series, please visit:
[**GitHub - thomashoneyman/real-world-pact: Real-world smart contracts and apps built with Pact &…** *Real World Pact is a collection of thoroughly-commented, fully-functioning example projects that demonstrate building…*github.com](https://github.com/thomashoneyman/real-world-pact)
