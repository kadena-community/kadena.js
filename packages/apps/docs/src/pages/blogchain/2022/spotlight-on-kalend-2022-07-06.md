---
title: Spotlight On Kalend
description:
  Today, we’re profiling Kalend Finance, a next-gen lending protocol. Kalend
  creates properly functioning lending and borrowing pools for Kadena assets,
  and each pool has interest rates that are determined by the supply and demand
  of the underlying asset. The result is a unique, two-sided approach to lending
  that dynamically calculates a borrower’s borrowing capacity.
menu: Spotlight On Kalend
label: Spotlight On Kalend
publishDate: 2022-07-06
tags: [kadena]
author: Kadena
authorId: kadena
layout: blog
---

# Spotlight On: Kalend

Welcome to Kadena Eco’s Project Spotlight Series, where we’ll highlight the
groundbreaking work of organizations currently building on Kadena!

Today, we’re profiling [Kalend Finance](http://kalend.finance/), a next-gen
lending protocol. Kalend creates properly functioning lending and borrowing
pools for Kadena assets, and each pool has interest rates that are determined by
the supply and demand of the underlying asset. The result is a unique, two-sided
approach to lending that dynamically calculates a borrower’s borrowing capacity.

We recently chatted with the Kalend team about their cutting-edge approach to
lending.

### 1. How do you explain Kalend in simple terms? Give us your elevator pitch.

Kalend is a decentralized lending/borrowing protocol with algorithmically set
interest rates based on supply and demand, allowing users to exchange the time
value of assets on Kadena frictionlessly with instant liquidation and insurance
pools. In addition, Kalend protocol has several innovative features including
dynamically adjusted close factor, risk-adjusted borrowing capacity, stability
pool that increase capital efficiency and lower frictions for liquidations. The
protocol is based on proven protocol designs with adaptations to the specific
technical requirements of Kadena.

### 2. Share with us your background on how you got started in this space.

The founding team has more than 10 years of engineering and blockchain
experience combined with working experience and education backgrounds from top
institutions like Google, Apple, Stanford. Our team has a lot of startup
experience and our co-founders are serial entrepreneurs.

### 3. Kalend utilizes dynamically adjusted factors in its lending practices. What are these, and how does this approach differentiate Kalend from other lenders in this space?

The dynamically adjusted close factor is used to liquidate borrowers.
Specifically, we allow liquidators to repay up to the amount needed to bring the
underwater position back plus an additional safety factor. As a result,
borrowers who are only slightly in violation will have less than half their
debts repaid during a liquidation, while borrowers who are heavily in violation
will often have more than half their debts repaid during a liquidation. This
approach is more capital efficient than the fixed 50% close factor approach that
traditional lending protocols like Compound use.

### 4. What attracted you to build on Kadena?

We are impressed by Kadena’s innovative chainweb technical architecture coupled
with a new expressive programming paradigm (Pact), which is significantly
different from other L1 chains. The Kadena ecosystem is fairly new and presents
an immense opportunity for builders like us. We also spoke to the ecosystem and
tech teams at Kadena and were impressed by the quality of team members.

### 5. What are Kalend’s stability pools, and how do they reduce friction for liquidations?

To alleviate the risk of extreme price volatility and slippage caused by low
liquidity, Kalend enables lenders to support liquidations by providing liquidity
to a stability pool associated with each lending pool. Liquidity providers in
the stability pool deposit kTokens and earn interest while they wait for
liquidations to be processed. An unstaking period prevents them from moving
assets in and out of the pool to try to game the system.

When liquidation is processed, the liquidator uses liquidity from the stability
pool to cancel a borrower’s debts, and they return discounted collateral to the
stability pool in return (minus a fee, which they keep for themselves).
Stability pool liquidity providers essentially end up swapping their kTokens for
discounted collateral assets.

### 6. What trend in DeFi currently excites you the most?

We are excited for cross-chain DeFi. Ethereum has suffered from scalability
issues for a long time. We believe that the development and maturity of
cross-chain bridge solutions will unlock huge potentials for DeFi.

### 7. What can we expect from Kalend in the next 6 months? Where will you be in 3 years?

In the next 6 months, we are targeting to launch our lending dapp on the testnet
and start to create our community. In addition, we plan to have the production
version ready within a 6 month time frame.

In 3 years, we believe that we will be the leading lending protocol of Kadena
and form the foundation layer of Kadena DeFi ecosystem.

**8. What advice would you give to entrepreneurs looking to innovate in
blockchain?**

We are still in the early days of web 3. There are plenty of dapps and tools to
build. It is never too late to join the web 3 revolution.

Many thanks to Kalend Finance for sharing their work and their views about the
future of DeFi! Keep an eye on our blog in the coming weeks for future Project
Spotlights, as we’ll continue to highlight innovative organizations that are
currently building on Kadena.
