---
title: Kadena Telegram AMA with Stuart Popejoy, March 29, 2021 Transcript
description:
  A Transcript of the Telegram Ask-Me_Anything with Stuart Popejoy, March 29
  2021
menu: Kadena Telegram AMA, March 29 2021
label: Kadena Telegram AMA, March 29 2021
publishDate: 2021-03-29
tags: [kadena]
author: Kadena
authorId: kadena
layout: blog
---

# Kadena Telegram AMA with Stuart Popejoy, March 29, 2021 Transcript

## Opening Remarks:

**JEFF:** Hi Stuart, glad to have you back for your second AMA! We’ve had a lot
of exciting announcements since the last AMA and our community wants to know
more.

**STUART:** Thanks Jeff! I’m personally very excited about the
[Chain Relay](./announcing-the-kadena-chain-relay-2021-03-25) launch 😎!

## Pre-Submitted Questions and Answers

### Chain Relay

**ROBIN: In the latest article about the chain relay you talked about bridges to
Ethereum, Celo, and Terra. Are all these bridges ready yet?**

**STUART:** The Go-To-Market of the relay is:

1. Fund the relay. This is an important first step as we need the economic
   security to be present before we deploy it for bridge operations.

2. Launch the bridge. This is mainly deploying contracts onto the target
   platform.

3. Start wrapping tokens. While this is possible for anybody to do, we want to
   have market makers in place to bring over significant size.

As for target platforms, we will launch with Eth with Celo and Terra close
behind! As I mentioned in the article, with full participation with current
planned reserve, the relay can have >12M TVL KDA!

**ROBIN: Can projects that are currently running on Ethereum migrate to Kadena?
Is it possible to ‘convert’ smart Contracts from ETH to KDA?**

**STUART:** Great question. Kadenaswap is actually a port of Uniswap v2 to Pact,
and while that was done manually since Pact is actually a more powerful
programming language than Solidity, it is possible to talk about automatic
translation. However, Pact is _so much easier_ than Solidity in most cases it
won’t be necessary. Blend blogged about migrating from Solidity to Pact
[here](https://full-stack.blend.com/choosing-a-blockchain-platform-for-finprint.html).

Also, by Q3 this year we will have all major use cases present on the platform
in pact code: DEX, NFT, lending platform, DAO, governance. So just like
Ethereum, launching will be a matter of copy-paste 😎!

### Kadenaswap

**BUFO: KDA will be the most paired / liquid asset on Kadenaswap. Beyond that
(and adoption and what CoinMetro is doing) what are all the factors that will
drive up the value of KDA?**

**STUART:** Well, chain relay is one as it provides an income stream for
participants, and locks up KDA.

We will be talking about DAOs very soon and that’s when you’ll start to see more
deployments of the treasury like in the chain relay, but with community
governance. This will unleash the community for turbocharging independent
efforts to kickstart new tokens and business models, with KDA grants getting
things started. These will all allow for incentives and other income streams
which will encourage participation.

Also, KDA will be everywhere by the end of 2021, whether that’s Uniswap or major
exchanges, or wrapped platforms**.** But finally, yes, KDA will be a driver of
liquidity and fees on Kadenaswap, which will encourage market making, and
therefore acquisition, of KDA.

**HANK NOMO:** **What “left field” pairings would community members see on
Kadenaswap? Further, will there be incentives to provide liquidity even though
volumes will likely be low in the beginning?**

**STUART:** Well, we’ll see what Thanos has in mind for
[Anedak](https://anedak.com/) 🚀. We do know that there are some great new
altcoins coming to Kadena/Kadenaswap in the very near future.

As for liquidity, this is not something we’re leaving to chance, but instead
aggressively working with market makers for the Kadenaswap launch. The Tokensoft
partnership is initially bringing kETH and kBTC to the platform and the whole
point is to give market makers an opportunity to participate in Kadenaswap and
collect fees.

Plus the chain relay and Eth bridge open up DAI, LUNA/UST, CELO/CUSD, and the
way we roll is we don’t even bother bridging if we don’t come up with size.

**ROBIN: How much of the fees do the liquidity providers for Kadenaswap get?**

**STUART:** Currently, they match the Uniswap v2 model of 0.3% constant product
fee. However, there is a lot in store for Kadenaswap.

First, there is multi-chain, which will modify the fee model to provide higher
returns for multi-chain liquidity provisioning.

Second, there is a lot of innovation happening in DEX-land, whether that’s CLP
models or what have you, and we will focus on what makes sense to bring to
Kadenaswap in Q3.

Finally, Kadenaswap itself will be growing into its own project, which is where
we start to see a governance token that can interoperate with liquidity
provision and provide separate income streams.

### NFT

**BUFO: What is being discussed and developed with KadenaNFT?**

**STUART:** Kadena NFT up to now has been about the token standard.
Interestingly enough this is a very mobile space, and we’re best positioned to
“get it right” by observing what works, for instance, ERC-1155 which allows
limited editions/fractional ownership etc.

But in Q2 it’s more about concrete initiatives. Here we are working with
multiple partners to incubate projects, with at least one launching in Q2. Here
we’re looking to of course provide a superior experience for users, including
better market access for individual minters with no gas fees and a seamless
onboarding experience with new wallet providers.

But we’re also looking at exciting, sustainable models that support artists or
artist communities, alongside the collector-focused approach.

Finally, with these initiatives, we envision more than just an NFT standard but
a full solution similar to Dapper/Flow to help new projects launch quickly and
easily

**PIERRE: Is it possible to make NFTs using Kadena? At the moment all platforms
holding NFTs use ETH, and [I] would love to be able to use my KDA to create some
[NFTs].**

**STUART:** It is today! You’d have to deploy your own KIP-0008 token, which we
already have code for [here](https://github.com/kadena-io/KIPs/pull/15). But of
course, it’s more about having good places to mint, and Q2 will bring that 🙂.

### Future Goals and Partnerships

**BUFO: Which projects are going to launch in the near future on Kadena? Are
there any new tokens natively starting on Kadena?**

**STUART:** Well, of course, we are super psyched for the launch of Kadenaswap
in Q2. Don’t tell anyone, we haven’t released our Q2 roadmap 😉

And as I mentioned, at least one NFT project for sure, but potentially more.
Also as mentioned, at least one major token launch, alongside the wrapped tokens
mentioned above. But there are TONS of new use cases in incubation, that we will
be actively involved in bringing to market: lending platform, DAOs, other
financial engineering, new NFT models.

**YALCIN: What are the goals of Kadena-Zelcore-CM and Kadena-iMe partnerships?**

**STUART:** Kadena Zelcore CoinMetro is like the Three Muskateers of crypto,
bringing great justice to the land 🚀. Really can’t say enough about this trio
of partnerships. It’s critical to the chain relay launch as each is running that
realm that they are masters of: CoinMetro for delegation, Zel for node/software
operation and the premiere wallet experience.

It’s an incredibly synergistic “triad” that will take the whole world on, nobody
will see us coming and when it hits, nobody will be able to catch up.

**FRANCESCO:** iME is a crypto wallet and messaging app that will provide our
users with a new and very easy-to-use wallet for their KDA. Check out their
website to find out more about their product
[https://imem.app/](https://imem.app/) and join their telegram if you have any
additional questions @iMeMessenger. Just as a teaser, maybe one day we will all
be on there instead of telegram 😎

## Community Q&A

**MARKUS: Monica and Emily are advisors for Kadena now. Are there any plans to
fill any of these positions or expand other parts of the team?**

**STUART:** Monica continues to be involved in BD and new projects on Kadena and
is also pursuing a new project 😎. Emily is CTO of the non-profit Haskell
Foundation and continues to develop Pact, and is leading the Polkadot “Core
Pact” initiative.

**DEALHUNTER: How involved is Stuart Haber with the team?**

**STUART:** Stuart Haber — expect to see more of Dr. Haber in the near future 😉
— we are closely working with him on the relay and other projects.

**RON LAFLAMME:** I predict that the launch of Kadenaswap will cause KDA to jump
in value but that will cause painful impermanent loss to Liquidity Providers
(LPs) on Kadenaswap. How will you address this?

**STUART:** Impermanent loss (IL) is very interesting, and claims that CLP
“fixed it” are not convincing 🙂. We’re looking at a number of models for
improving the AMM story. We’re also looking at including single-asset
market-making and other ways to de-risk the AMM experience on Kadenaswap.

I think that to a certain extent, extreme volatility isn’t something to worry
about, but hey this is crypto. In a universe where fundamentals are more
relevant to crypto, IL isn’t as much of an issue. But we’re not there yet 🙂.

**KING KADENA: Can you please share any developments on the KDAX governance
token? What would the Tokenomics of it be? How would it be minted? Could it be
potentially airdropped to KDA holders?**

**STUART:** KDAX — this is all about DAO, so expect to hear about this very soon
in the Q2 roadmap.

**UNIQUE USERNAME: What other new layer1 protocol are you most impressed with
tech-wise, and how will KDA compete with them in the future?**

**STUART:** None other than SCALABLE POW WITH PACT. In all seriousness, I’m
worried about the reliance on illusory differences with POS from platform to
platform making people think one is meaningfully distinct from another — in all
cases it only takes a minimal amount of financial collusion to cause security
issues. Meanwhile, things like “proof of history” etc are academic nonsense.

**YALCIN: You mentioned “new NFT models”. Would you please say more about
them?**

**STUART:** It’s really about finding sustainable models that don’t just
replicate the scarcity-based BS surrounding things like music distribution,
while leveraging scarcity where it makes sense like rare LPs. Expect a far more
detailed announcement in the near future about new NFT models 👍.

**G P: Can you bring some light to marketing plans for the upcoming quarter?**

**FRANCESCO:** More info on notable announcements will be in the Q2 roadmap.
What we want as a company is to grow our community organically. We got a pretty
good head start on this and it’s all been thanks to you guys! Please keep it up
and help us spread the message!

**MW: The KDA ambassador program seems to have had a highly successful start —
how do you envision the program evolving as KDA grows?**

**JEFF:** Thanks! We’ve got great content and representation from our
Ambassadors so far. For the future, I see ourselves growing out the program to
host more events, create more content, and reach out to international community
members. We’re slowly getting the ball moving, but once we start to walk, we’ll
run 😎.

That concludes our AMA. If you are interested in reading the AMA, feel free to
join our Telegram and view the discussion starting
[here](https://t.me/kadena_io/73295). To get announcements about Kadena’s
progress in creating the best multi-platform DEX and DAO, follow us on
[Twitter](https://twitter.com/kadena_io),
[Discord](https://t.co/VK1m2oyh2L?amp=1), and
[Telegram](https://t.me/kadena_io).
