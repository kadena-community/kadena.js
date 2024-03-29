---
title: Announcing the Kadena Chain Relay
description:
  Today, we deployed the beta smart contract of the Kadena Chain Relay into
  testnet. The chain relay provides economic security through bonded KDA for our
  Ethereum, Celo and Terra decentralized bridges. In this post, we describe how
  participants can bond KDA to operate and validate the Chain Relay.
menu: Announcing the Kadena Chain Relay
label: Announcing the Kadena Chain Relay
publishDate: 2021-03-25
headerImage: /assets/blog/1_hFmZHqA2HYLgPUAQgVxlog.webp
tags: [kda]
author: Stuart Popejoy
authorId: stuart.popejoy
layout: blog
---

# Announcing the Kadena Chain Relay

Today, we deployed the beta smart contract of the Kadena Chain Relay into
testnet. The chain relay provides economic security through bonded KDA for our
Ethereum, Celo and Terra decentralized bridges. In this post, we describe how
participants can bond KDA to operate and validate the Chain Relay.

## Securing a Decentralized Bridge

The Kadena bridge accepts and _validates_ block headers from other blockchain
platforms like Ethereum, Celo or Terra. To do so, it needs a way to accumulate
assurance around the headers in the form of endorsements from actors that have
something to lose if the data is faulty.

Consider a DAI token on Ethereum. To wrap it onto the Kadena platform, DAI is
deposited in a smart wallet on Ethereum. This deposit is captured in a
cryptographic proof and presented to a smart contract on Kadena, which must
verify that the deposit occurred in order to issue the matching amount of
wrapped DAI onto Kadena. To do this, the smart contract relies on the Chain
Relay to validate that the block header referenced in the supplied proof exists
on Ethereum. Thus, the Chain Relay provides a critical service as an attesting
authority for block headers from the bridged chain.

## Security through Bonding KDA

To validate headers, participants lock up KDA to become _bonders_. Bonders
_propose_ headers from the bridged chain, after which a random selection of
bonders can _endorse_ the proposed header. With enough endorsements, a header is
valid and can be used to validate proofs.

By supplying the bond, bonders assume risk, because if a particular header is
inaccurate or fraudulent, it can be _denounced_ or “slashed”. Denouncing follows
a similar process as a proposal but demands more endorsements to proceed. Once
denounced, the proposer and all endorsers of the inaccurate header will forfeit
1/2 of their bond.

At launch, relay bonds are purchased for a fixed amount of KDA. To become a
bonder, a participant must put up 50,000 KDA to be locked up for 30 days. During
this time, the bonder participates in the chain relay, proposing and endorsing
headers using the relay software. In return, they accrue fees both for endorsing
headers (_activity fees_) as well as a fee for locking up the bond (_risk
fees_).

Once the lockup expires, an unlock period of 20 days commences. During this
time, the bonder can _renew_ their bond in order to continue participating in
the relay for another 30 days, and receive all accrued fees. Otherwise, after
the unlock period, the bonder can unbond, collecting the bond amount with all
accrued fees.

## Activity and Risk Fees for Bonders

As an incentive for early participants, **active participants who bond in the 30
days after launch will be entitled to a risk fee of 30% per annum of the bond
amount (that is, 2.46% for each bond period)**. For these participants, they can
renew to maintain these fee rates for up to one year (360 days). For endorsing
headers, bonders will receive 5 KDA each as the activity fee. Note that a
minimum average amount of activity of 10 endorsements/day over the bonding
period will be required to receive the risk fee, to incentivize robust
participation in the relay.

Fees are paid from a reserve pool of up to 5 million KDA at launch, sourced from
Kadena
[platform share](/blogchain/2021/update-to-the-kadena-token-economic-model-2021-01-29)
tokens. The size of the reserve limits the bonding by twice the risk fee rate,
which means that in the initial launch, up to 8.3MM KDA in total can be bonded
over the course of 1 year. With full participation, the total value locked up
(reserve + bonds) can exceed 13MM KDA. This provides a robust amount of security
for the relay.

In the future, the relay will be able to use other non-KDA tokens for bonding,
including the possibility of a governance token as well. Kadena reserves the
right to increase or decrease the KDA reserve at any time while maintaining
guarantees for active bonders. Fee rates and amounts, lockup and unlock periods,
and activity requirements can be changed at any time. Any details in this
article are subject to change without notice before full production launch of
the Chain Relay.

## Launching the Relay with CoinMetro and Zelcore

We’re excited to be working with our partners **Zelcore** and **CoinMetro** to
make the Chain Relay program a success: CoinMetro will be offering bonding and
delegation services, and ZelCore will provide services to help operators run the
relay software through Flux. Bonding will open for participation in early April
2021, and the bridge will launch alongside Kadenaswap in early Q2 2021. Get
involved with the relay, and help build the future of value on Kadena!
