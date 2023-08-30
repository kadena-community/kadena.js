---
title: Introducing Kadenaswap “Bountyswap” Live Beta
description:
  After a successful and productive run in testnet, Kadenaswap is headed to
  mainnet to start “Bountyswap” — the live beta! It’s a good time to lay out the
  current plans for Kadenaswap, Bountyswap and the future of multi-protocol,
  scalable DeFi.
menu: Introducing Kadenaswap “Bountyswap” Live Beta
label: Introducing Kadenaswap “Bountyswap” Live Beta
publishDate: 2021-02-02
author: Emily Pillmore
layout: blog
---

![](/assets/blog/1_KbYZmw4TE6ZQEIszK0gqkA.webp)

# Introducing Kadenaswap “Bountyswap” Live Beta

UPDATE Feb 20 2021:
**[Bountyswap is live](https://kadenaswap.chainweb.com/bountyswap)** — start
swapping today! Watch [instructions](https://youtu.be/Dt4DOGA7DeA) on how to
connect your Zelcore wallet to Bountyswap.

After a successful and productive run in testnet, Kadenaswap is headed to
mainnet to start “Bountyswap” — the live beta! It’s a good time to lay out the
current plans for Kadenaswap, Bountyswap and the future of multi-protocol,
scalable DeFi.

## What is Kadenaswap?

Kadenaswap is a decentralized exchange (DEX) running on the Kadena blockchain,
modeled after Uniswap and other “constant product” exchanges. Like those,
“automated market makers” (AMMs) **_provide liquidity_** for **_pairs_** of
tokens, so that users may **_swap _**one token for another at the ratio
currently provided by the pair.

The great thing about this design is how it lives up to the “decentralized”
claim: everything from liquidity provision, pricing to swapping is done entirely
on-chain, requires no intervention from off chain authorities or oracles, and is
fully autonomous with no control by any central on-chain authority either.

**Constant Product Exchanges**

There are two roles in this style of DEX: the AMMs providing liquidity, and
“swappers” accessing that liquidity to swap between tokens. For example, let’s
look at a hypothetical altcoin ABC in a pair with DAI, MakerDAO’s stablecoin,
“wrapped” on the platform. We’ll talk more about “wrapped tokens” below but for
this example, we’ll just call it DAI.

**Liquidity provision**

To swap ABC for DAI on a constant-product DEX, there needs to be ABC and DAI
already there to service your swap. An AMM facilitates this by *adding liquidity
*to the ABC:DAI pair. If the pair doesn’t exist, the AMM can create it,
otherwise they add to what’s there. An AMM must provide **both** ABC and DAI, in
a ratio that represents the current “market price” of swapping between DAI and
ABC.

![Adding liquidity in Kadenaswap](/assets/blog/1_QUr0ecQzLkeefFJsMLZC5w.webp)

Thus, if ABC is trading at USD $0.25, since DAI tracks the dollar closely, an
AMM could provide 1,000 ABC and 250 DAI to launch the pair. A remarkable
principle of constant-product exchanges like Kadenaswap is that arbitrage
swapping ensures the price faithfully reflects the off-chain market:

- If the AMM provides too much DAI, that effectively under-prices ABC, making it
  profitable to swap DAI for ABC, which will bring the pair back inline with the
  market price.

- Likewise, if there’s too much ABC, it over-prices ABC, making it profitable to
  swap ABC for DAI.

**Swapping and Fees**

Now that the pair is provisioned, a user can come in with DAI wanting to buy
ABC, or with ABC wanting to buy DAI. The rate is determined by the available
liquidity, as the smart contract enforces the _constant product._ With 1000 ABC
and 250 DAI, that’s the square root of 1000\*250, or 500: whatever remains after
the swap must compute to something equal or greater than this amount.

In addition, the user is charged a fee of 0.3% _of the constant product_, either
by providing more of one token, or getting less of the other. So the swap in
fact must result in the constant product _with fee_ increasing or equal. So, if
the user wants to buy 10 ABC worth of DAI, instead of getting 2.5 DAI, they will
get 2.467895, and the constant product grows to 500.007426. In this way, the
holdings of the pair in the underlying tokens grows with each swap.

![Swapping tokens in Kadenaswap](/assets/blog/1_sTVSE4vqNgsQGGWB_qpdXg.webp)

**Liquidity Token ownership**

The constant product also faithfully represents AMM positions in the liquidity
pool. In the example above, the first provider gets 500 units of the liquidity
pool, out of 500 total liquidity. A second AMM coming in with the same amounts
also gets 500, but now the total liquidity has risen to 1000. These holdings are
stored in the *liquidity token *for the pair, which in our example is ABC:DAI.

To access these profits, an AMM _removes liquidity_. This results in the burning
of their liquidity tokens and a redemption of the holdings in the pair tokens in
the current ratio. Since this has increased from swaps, the amount of the
underlying tokens has grown, and the AMM profits. Note that there is more to
this story if the external price has moved, but at least according to the
constant product, and trusting that arbitrage has kept the ratio sane, the AMM
is strictly richer due to accrued fees.

![Removing Liquidity in Kadenaswap](/assets/blog/1_RE5kz-sOGOsea9PgDVA9OQ.webp)

**Kadenaswap: gas-free, multi-protocol, multi-chain, multi-platform**

Kadenaswap is designed to take the constant product design that has proven so
successful with Uniswap and other DEXs and leverage the unique advantages of the
Kadena platform.

First, as an on-chain DEX, Kadenaswap will be *multi-protocol *from the start,
offering any on-chain asset that market-makers want to pool. Unlike many
“off-Ethereum’’ DEXes, Kadenaswap pairs are not limited to only super-liquid
tokens like BTC and ETH and leading stablecoins, but any fungible asset
on-chain, such as protocols that provide unique market access like LUNA and
CELO, as well as proven protocols on Ethereum like DAI, and of course all tokens
on the Kadena platform.

Thanks to gas stations, trading on Kadenaswap won’t require a user to hold KDA
to trade. Even if they did have to pay gas, gas fees on Kadena are currently
microscopic (usually ~0.0000000001 KDA). However, this can change if usage
steeply increases. If only running on one chain of the Kadena blockchain, gas
prices would inevitably go up for the same reason they do on Ethereum: in the
face of congestion, increasing the gas price increases the priority for a miner
to include your transaction in the next block.

![Kadenaswap Gas Station in action](/assets/blog/1_T0WoaLF4qrrtlprByThNVg.webp)

**Scaling an on-chain DEX**

The real answer to gas prices is _scalability_. This is where Kadena shines:
even the fastest Proof-of-Stake platform has upper limits on throughput, but
Kadena’s chainweb protocol uniquely can scale the number of chains to meet any
demand. In turn, Dapps on Kadena simply scale out to the number of chains needed
to service demand.

So, just run Kadenaswap on multiple chains, problem solved? Well, not exactly.
Chains in Kadena still run independently, and a coin “can’t be in two places at
the same time”. Each Kadenaswap smart contract on its own chain will have
completely separate pools for a given pair. This can mean prices can get out of
sync, but that can be fixed by the same arb-ing described above. The harder
problem to solve is *liquidity fragmentation, *where a pair on one chain has way
more inventory (and is therefore a better place to trade) than on another chain.

**Multi-Venue AMM Incentives**

We like to call multi-chain Kadenaswap “multi-venue” to indicate the notion that
there is more than one venue where the trade is made. To solve liquidity
fragmentation, incentives are needed to reward AMMs for _balancing liquidity
across venues._

An initial design simply incentivizes AMMs to lock up liquidity in a pair for
some period of time, let’s say a week. An AMM can then prove to the same pair on
Chain 2 that they are providing equal liquidity on Chain 3 for that same week
and receive higher gains accordingly, through either yield incentives, or
through a fee structure that rewards cross-chain provisioning higher than
single-chain.

This allows _pairs to scale independently_: if one pair isn’t overloaded on a
single chain, it can enjoy an unfragmented market. Meanwhile, a hard-hit pair
can scale to as many chains as demand requires, and market makers will be
rewarded for splitting up their positions to service each venue.

Finally, insofar as pairs are truly isolated, they can simply exist in separate
venues. For instance if some altcoin is really only paired with stablecoins,
they can all hang out in a single venue, even though other pools with those
stablecoins and other coins are scaled over multiple venues.

If this sounds confusing, worry not: it will be easy to swap and AMM across all
chains in Kadenaswap. The hard part is the multi-venue design and incentive
structure, which we will be iterating on as we scale. Solving this problem is a
first step to building a truly industrial-strength DEX.

**Multi-Platform**

The great thing about Kadena’s multi-chain structure is that it’s truly
multi-chain while still being in the Kadena universe: once it’s in motion, the
multi-venue design can then scale onto other Pact-supporting platforms like
Cosmos, or Polkadot (once the Pact Core/Kadenadot initiatives are ready).

In this way, Kadenaswap will be the only **multi-venue, multi-protocol, and
multi-platform DEX**, leading to a future where users won’t have to even think
about platforms and protocols, but just access value wherever it is.

![](/assets/blog/1_RV2jy75Q5DPQ-IlObBXBGg.webp)

## Bountyswap Live Beta

Bountyswap is a “soft”, live-beta launch of Kadenaswap on mainnet, using a
“temporary” token that only has value while Bountyswap is in progress. We expect
Bountyswap to run for 2–4 weeks, or longer if issues are found. The goal is to
use the temporary token to incentivize “white-hat hackers” to try to break the
system and steal coins, which is theirs to keep if their hacks are successful.

**“KPenny” temporary Bountyswap token**

We call the Bountyswap temporary token a _KPenny_ which gives a hint of its
functionality. KPenny tokens can be reserved for use with Bountyswap at a rate
of 1M to 1 KDA token.

Bountyswap will then launch three pairs on Kadenaswap, using two “test tokens’’
called ABC and XYZ. The three pairs will thus be KPenny:ABC, KPenny:XYZ, and
ABC:XYZ. The bountyswap admin marketmaker will provide liquidity in all three
pairs. The target quantities will thus represent up to 100,000 KDA, creating a
significant “honeypot” to attract hackers to attack.

At the end of Bountyswap, all KPennys will be returned in the equivalent KDA,
and all three tokens will be decommissioned. However, swaps and fees will mean
that these values will have changed, and the amount returned will reflect this.
This ensures that the “honeypot” will reward the tester if an exploit is found.

This of course also means that any KPenny token reserved for Bountyswap program
is not guaranteed to return to its original owner. Indeed, testers need to be
aware that their reservations can be entirely lost due to an exploit or
otherwise. But in any case, testers will want to swap out of the test tokens
before the program ends. Thus, there will be a “shutdown period” where KPennys
will no longer be available for reservation and will only support transfers out
of pair accounts. During this time, testers can swap out of XYZ and ABC into
KPenny in time for the full shutdown.

## Get involved with Bountyswap!

The [Bountyswap home page](https://kadenaswap.chainweb.com/bountyswap) has
everything you need to get started. At time of writing, Bountyswap is not live
as we’re finishing up KPenny functionality in Testnet. After that, use links
there to download/connect your wallet, reserve some KPennys, and get swapping
and AMM-ing! Don’t forget to join our communities on
[Telegram](https://t.me/kadena_io) and
[Discord](https://discordapp.com/invite/bsUcWmX) to get support, ask questions,
and suggest improvements!
