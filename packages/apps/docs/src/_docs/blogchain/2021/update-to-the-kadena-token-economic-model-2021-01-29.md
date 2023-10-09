---
title: Update to the Kadena Token Economic Model
description:
  On January 15 2021, Kadena celebrated its one-year anniversary of the public
  launch of the Kadena Public blockchain platform, the only sharded, scalable
  Proof-of-Work smart contract platform that can meet the demand of true
  industrial-scale operations on a blockchain. It’s a good time to review the
  token economic model that drives the network, and we’re happy to announce that
  we’ve revised our platform emissions schedule to address inflation while still
  enabling us to provide economic infrastructure to drive growth.
menu: Update to the Kadena Token Economic Model
label: Update to the Kadena Token Economic Model
publishDate: 2021-01-29
headerImage: /assets/blog/1_8VJm1-4VH7yGxvZRSl8zjA.webp
tags: [kda]
author: Will Martino
authorId: will.martino
layout: blog
---

# Update to the Kadena Token Economic Model

On January 15 2021, Kadena celebrated its one-year anniversary of the public
launch of the Kadena Public blockchain platform, the only sharded, scalable
Proof-of-Work smart contract platform that can meet the demand of true
industrial-scale operations on a blockchain. It’s a good time to review the
token economic model that drives the network, and we’re happy to announce that
we’ve revised our platform emissions schedule to address inflation while still
enabling us to provide economic infrastructure to drive growth.

## Token Emissions

The overall emission of the Kadena platform happens through two processes:
mining and release of allocated tokens. The vast majority of the overall
emission is through **mining.** It’s important to understand the time-scale:
mining is incentivized by rewards for each new block that slowly decrease over
time.

- At Mining Launch (November 2019): **2.018M** tokens/month

- Today (January 2021): **1.94M** tokens/month

- In 5 years (January 2025): **1.69M** tokens/month

This decay continues over a period that lasts over 100 years. So, while Kadena’s
total emission of 1 billion tokens sounds like a lot, it’s more important to
focus on the **total emission rate** to grasp how the economy really functions
in terms that are relevant to today. Here’s what mining-based growth looks like
from now (January 2021) until 2040:

![Kadena Mining Emissions 2021–2040](/assets/blog/1_jRXl8dvEydNDe-xOVMbl2g.webp)

**Platform emissions**

The other source of tokens on Kadena Public come from _pre-allocated tokens_
defined in the “genesis blocks”, the first block on each Kadena chain that all
subsequent blocks are mined from. A significant tranche of the token economic
model is the **platform share**. Examples of uses of the platform share include:

- Developer and economic grants, as seen in our
  [Technical Grant Program](/blogchain/2020/announcing-kadena-technical-grants.2020-11-25)

- Community-growing initiatives like our upcoming “Community Ambassador” program

- Ecosystem initiatives to power the Public network, such as the
  [Zel Tech Flux + Kadena node operator program](https://zel.network/kadena-zel-tech-partner-to-host-100-full-nodes-on-flux-network)

- Major ecosystem improvements like the
  [Core Pact web3 initiative](/blogchain/2020/polkadot-collaboration-update-researching-pact-core-for-wasm-and-exploring-kadenadot-2020-08-12)
  to run Pact programs on other networks like Polkadot

Even larger initiatives will be announced soon that could involve Decentralized
Autonomous Organizations (DAOs) or other community-led programs to fund major
projects and economic initiatives. The platform reserve is unconnected to hash
power and confers no governance or control over the network.

**Changing the Platform Emission schedule**

The platform share emits 20% of the total emissions of the network, totaling
200M tokens in the end. As specified in the genesis blocks, this emission starts
on January 1, 2021 and finishes by 2025, five years after network launch.

![Previous Total emissions (Mining + unmodified Platform), 2021–2029](/assets/blog/1_Tl2rwVUw6oLieu3q3J3abQ.webp)

The genesis platform emission rate was designed to balance the need for strong
economic support of major initiatives while recognizing that a slow emission
rate is important for token economics, as well as to build trust in the overall
project. The Kadena token model was designed and finalized in late 2017 and
reflects best practices for layer-1 platforms at the time. Indeed, as
[Messari noted in their Q3 2020 Layer-1 review](https://messari.io/pdf/smartcontracts-q3-2020.pdf),
Kadena has the second most community-favorable token distribution amongst the
top 12 layer-1 projects.

Crypto, however, has come a long way since then, and in 2021 the understanding
of crypto economies is considerably more sophisticated. As such, and with a lot
of help from our incredible communities on Telegram, Discord, Twitter and
elsewhere, we’ve recognized that we need to change this emission rate for the
best interests of the ecosystem.

**Why Change the Platform Emission Rate?**

Token economics are a relatively new field, but they can be analyzed using tools
from existing currencies and commodities. A token like KDA is emitted over time
through mining and allocation release, and this can be compared to drilling for
oil, mining for gold or minting new currency. All of these increase the _supply_
of the product, which can interact with _demand_ such that “oversupply” can
reduce the value of the product, and vice versa. In the case of something like
oil, this can be a dominant factor, whereas with something like gold, supply
versus demand is but one factor amongst many determining value. Nonetheless, all
other factors being equal, reducing the rate of supply can have beneficial
effects. Indeed, protocols like Bitcoin, Ethereum and Kadena all have decreasing
mining emission rates over time in recognition of this principle.

Today, we are announcing a **reduced platform emission rate,** effective
immediately, that we feel strikes the best balance of our ability to
aggressively develop the platform while ensuring that the token emission
supports a healthy economy. It extends the emission timeline by 5 years such
that emission completes by 2030, ten years after network launch.

![*New Total Emissions with reduced Platform emission rate*](/assets/blog/1_4CzoC2QMzdPi2gsSd_OgJw.webp)

With the adjustment, the total emission rate of the Kadena platform decreases
significantly. To illustrate, let’s look at the change in overall inflation for
the upcoming year.

**Inflation Rate Jan 18 2021 — Jan 18 2022, Old and New**

- Mining emission rate: 23% (unchanged)

- Total emissions (mining + platform) with “old” genesis rate: 72%

- **Total emissions (mining + platform) with reduced platform rate:** **46%**

These numbers are based on the total coins in circulation reported in the Kadena
Block Explorer on Jan 25 2021 of 98.8M circulating coins, and a mining emission
of 22.9M coins in the time period Jan 18 2021 — Jan 18 2022. The platform
emission decreases from 48M tokens/year to 22.08M tokens/year.

**The Fine Print: Implementing the Reduced Platform Rate**

Genesis blocks cannot be changed without a difficult and risky hard fork.
However, allocations are “released” manually into circulation on the Kadena
platform through the operation “coin.release-allocation”, which is only allowed
to be executed once a given tranche is “unlocked”. For the platform share, this
is a monthly event. Thus, the new platform emission rate represents our
affirmation that starting with the upcoming genesis platform release on Feb 1
2021, Kadena will not exceed a platform coin release rate of 22.08M tokens/year
and 2M tokens/month. Kadena reserves the right to further modify, decrease or
increase the platform emission schedule in the future for what Kadena believes
is in the best interests of the platform, Kadena, and the ecosystem.

## Overall Token Allocation Model

![](/assets/blog/1_nr7LM_0N6Gsqb5u9Nnqr2w.webp)

While the overall Kadena Token Allocation model is unchanged, we’d like to take
this opportunity to provide all the data in one place.

**Mining share: 700M**

This represents all coins that will be emitted through mining over 100+ years,
as described above.

**Platform share: 200M**

This represents all coins that will be emitted as described above. Note that
3.7M was already released (on Jan 1 2021), so the remaining emissions are for
196.3M KDA over 9 years.

**Investor, strategic, and contributor: 90M**

The remaining coins are dispersed into numerous tranches, as follows:

- Series A and Series B Investor sales: 21.4M tokens

- 2019 Coinlist offering: 2.1M tokens

- Contributor share (for employees, consultants, advisers): 30M. Note that 39%
  of these coins are already distributed with the remainder held in trust by
  Kadena.

- Strategic share (for ecosystem initiatives and future sales): 36.5M

**Burned at Launch: 10M**

The Kadena platform was launched without a planned 10M tranche for the strategic
share.

**Total coins in economy: 990M**

This represents the planned amount of 1B coins, minus the 10M burned at launch.

**Current circulating coins: 98.8M (as of Jan 25 2021)**

This represents all coins either mined or released from allocation, and also
represents all transferable coins in the system at the time, as reported in the
Block Explorer.

**Unreleased Investor Coins: 10.98M**

These are coins that are out of lockup for SAFT A and B investors, but the
investors have not released them into circulation. This represents the holdings
of over 50% of the original supporters of the project. They are “available” now,
but we cannot predict, and have no control over, when these will be released.

**Locked Non-Platform Coins: 16.05M**

These are coins that will be coming out of lockup in the upcoming year at
various times.

- Investor locked coins: 2.38M.

- Strategic/contributor locked coins: 13.67M.

## Conclusion

At Kadena, we’re going into 2021 with exciting projects nearing completion: the
multi-protocol DEX **Kadenaswap** is wrapping up an incredibly productive run in
testnet where the community stepped up to find all sorts of issues and great
suggestions for improvement. Chainweb 2.4 released on Jan 15 with native support
for Ethereum and Ethereum-compatible **bridges**, representing the most
difficult milestone for erecting bridges to Ethereum, Celo, Terra and beyond,
with the next step being setting up our **bridge relay program**, and launching
**wrapped tokens**. With this announcement, we seek to similarly turbocharge our
token economy to leave no stone unturned in our quest to prove out Kadena as the
best platform to take crypto into the new decade.

If you have questions or comments, please join the discussion! Outside of
Medium, you are invited to engage with team members on
[Discord](https://discordapp.com/invite/bsUcWmX) and
[Telegram](https://t.me/kadena_io).
