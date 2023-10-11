---
title: Users Shouldn’t Pay for Gas
description:
  The biggest impediment to the broad adoption of decentralized applications
  (dApps) is the requirement that participants onboard to a cryptocurrency
  first. As a consequence, interested parties often do not adopt because the
  ‘sign up’ or ‘create an account’ flow involves learning about wallets and
  keys. Then, participants find that they need to purchase tokens to pay for
  gas, which leads them to try to understand exchanges. By this point, it is
  understandable why the average participant already wants to give up. Overall,
  the contemporary dApp user journey is closer to about as painful as opening a
  bank account when it needs to be as simple as signing up for Instagram.
menu: Users Shouldn’t Pay for Gas
label: Users Shouldn’t Pay for Gas
publishDate: 2019-12-19
headerImage: /assets/blog/2019/1_2tCoP7nddaQefAs0TVlygg.webp
tags: [pact]
author: Will Martino
authorId: will.martino
layout: blog
---

# Users Shouldn’t Pay for Gas

## Fixing the dApp Antipattern

The biggest impediment to the broad adoption of decentralized applications
(dApps) is the requirement that participants onboard to a cryptocurrency first.
As a consequence, interested parties often do not adopt because the ‘sign up’ or
‘create an account’ flow involves learning about wallets and keys. Then,
participants find that they need to purchase tokens to pay for gas, which leads
them to try to understand exchanges. By this point, it is understandable why the
average participant already wants to give up. Overall, the contemporary dApp
user journey is closer to _about as painful as opening a bank account_ when it
needs to be _as simple as signing up for Instagram._

This issue is well-documented for many platforms. For example, there are several
issues filed for the Ethereum Improvement Process (EIP) discussing
[workarounds and solutions for this issue](https://eips.ethereum.org/EIPS/eip-1613):

**“\***Alternatively, a 3rd party may wish to subsidize the gas costs of certain
contracts. Solutions such as those described in EIP-1077 could allow
transactions from addresses that hold no ETH. The gas station network is an
EIP-1077 compliant effort to solve the problem by creating an incentive for
nodes to run gas stations, where gasless transactions can be ‘fueled up.’”\*

Ethereum’s EIPs and the broader dApp developer community have known of this
issue for some time. The community has identified potential ways to address the
problem, but all of the solutions remain either centralized or speculative.

## Solving the Onboarding Problem

Kadena’s
[smart contract language Pact](/docs/blogchain/2019/safer-smarter-contracts-with-pact-2019-02-20)
presents a novel approach to overcoming the impediments associated with
onboarding to cryptocurrency. Pact has always supported general multi-sig, and
its signing system is the first smart contract language to bring a generalized
capability-based security model to market. This allows both protocol and app
developers to go much further than previously possible. To solve the onboarding
problem, Pact uses something closer to co-signing transactions.

Through co-signing, dApp operators can have participants locally create their
first wallet keys and use them to construct pre-determined transactions (e.g., a
transaction that creates the user’s Kadena account and establishes the user’s
dApp account simultaneously). These keys can even be made in the user’s secure
enclave, making the experience seamless. The user then sends the transaction to
the dApp operators. This transaction specifies the dApp operator’s wallet as
being the gas payer. Before co-signing, the operator verifies that the user’s
transaction is correct.

While this is a technically simplified example, it does require an identified
dApp operator to co-sign transactions. The upside is that dApp users don’t need
to be made aware of any of the implementation details done by the dApp devs. All
users see is a frontend and user experience that they are used to: “_I get an
app and use it.”_ For a more decentralized approach, we need gas stations.

## Gas Stations: A New and Trustless Way to Pay

We recently upgraded Pact’s capabilities implementation to allow for the
creation of accounts that can _only_ be used to fund gas payments. Gas stations
are the logical conclusion of this ability: an immutable resource, in the form
of an account that exists solely to pay for gas fees encountered during smart
contract execution involved with a specific contract.

The technical specification of gas stations can get complex and will be the
topic of a separate post, but the high-level summary is that once a gas station
is created, it is a non-transferable resource. A gas station can only be used to
redeem gas fees encountered by specific contract logic. The refund occurs only
when a transaction is successful. The participants would pre-pay the gas, which
gets entirely consumed only if the transaction fails. Otherwise, the gas station
keeps the used gas while refunding the remainder.

## More Decentralization: Pairing Co-Signing With Gas Stations

Up until now, we’ve been discussing this concept with the assumption that dApp
developers would be co-signing transactions for those using the dApps, fronting
the gas fees, and getting refunded through gas station accounts. However, our
approach is general enough to permit incentivized anonymous co-signing of
transactions. This could function similarly to how mining rewards work, except
that the dApp itself would fund the rewards for anonymous co-signers.
Experimentation on the economic side will be needed to see what works here.

With Pact’s capability system, dApp developers could potentially allow these
anonymous co-signers to consume, verify, co-sign, and submit a transaction that
will refund their fronted gas, as well as give them a small bonus for helping
facilitate the transaction execution on-chain. The co-signer only co-signs the
transaction, making the decision point simple. Is co-signing in the co-signer’s
economic interest? What’s happening under the hood matters only in that the
co-signer would want to check that the transaction is valid and will succeed.

This mechanism makes it feasible that by mid-2020, we may start seeing the first
mempools that gather not yet co-signed transactions specific to a given dApp.
There will be anonymous parties tapping into these mempools and taking
transactions that they are willing to co-sign.

## Economic Experiments Needed

The first gas stations will be built on Kadena in 2020, and deployed in a very
limited way as the economic impact of them is still unclear — we’ll need to
build a few, put them on mainnet, and see what happens. The key takeaway is that
we’ll be able to test this approach for the first time and experiment to figure
out what works best.

Most of the data we have on “how gas works in practice” comes from Ethereum and
this data differs significantly from how it was “supposed to work in theory.”
ETH gas prices should _theoretically_ fluctuate like fees in BTC, but in
practice, there is little evidence to suggest that ETH’s gas prices are
determined by market forces most of the time. Instead, it seems that ETH miners
view smart contracts (and thus gas) much the same way that BTC miners view
transactions: most miners would rather mine empty blocks most of the time, but
doing so undercuts the value proposition of the network.

We need to do some experiments and determine if gas stations are seen as
honey-pots or something closer to a take-a-penny-leave-a-penny cup. Miners could
pad a block with gas-station funded fees, but if we’re to use ETH’s data as a
guide, then the overall mining rewards on Kadena will likely dominate even a
block padded with coins from a gas station. So, it is possible that gas stations
are seen as part of the value proposition of Kadena. Or, perhaps, an open gas
station is seen as a take-a-penny cup and not something worth plundering.

Gas station creation will be demand-driven, and 100% of gas station tokens will
go toward paying for the fees associated with dApp transactions. We are devoting
tokens that other projects would have burned toward the gas station concept,
encouraging usage in a transparent and decentralized way. No one has ever tried
to just pay for smart contract fees across an entire network before; we’re
excited to see what happens.
