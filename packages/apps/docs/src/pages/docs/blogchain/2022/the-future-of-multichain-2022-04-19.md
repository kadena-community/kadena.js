---
title: The Future of Multichain
description:
  At Kadena, we like to say that our users “live in the future” because every
  day they leverage advanced cross-chain bridge technology just by using and
  trading KDA! Kadena’s scalability joins multiple independent chains like lanes
  on a freeway. However, unlike a real freeway, we can add more lanes anytime,
  so there are no “traffic jams” to drive up gas prices and slow down dapps,
  like we see on Ethereum and other unscalable layer-1s. The future of
  blockchain is a multi-chain protocol and it’s currently being realized today.
menu: The Future of Multichain
label: The Future of Multichain
publishDate: 2022-04-19
author: Stuart Popejoy
authorId: stuart.popejoy
layout: blog
---

![](/assets/blog/1_DPNo47Y2B1zwEMGSA_E-gA.webp)

# The Future of Multichain

## Building on a Multi-Chain Protocol

At Kadena, we like to say that our users “live in the future” because every day
they leverage advanced cross-chain bridge technology just by using and trading
KDA! Kadena’s scalability joins multiple independent chains like lanes on a
freeway. However, unlike a real freeway, we can add more lanes anytime, so there
are no “traffic jams” to drive up gas prices and slow down dapps, like we see on
Ethereum and other unscalable layer-1s. The future of blockchain is a
multi-chain protocol and it’s currently being realized today.

In today’s ecosystem, we see that multiple chains can confuse users. Directly
managing accounts on up to 20 chains is a new concept to wallets and exchanges,
so users are left having to move coins themselves. This adds mental overhead and
anguish to the experience. We’re always working with our partners to improve
this user experience whereby users will simply see a single balance, and the app
can seamlessly move your money around in the background. KDA is KDA — no matter
what chain it is on!

For builders, however, this problem can be even thornier. A consequence of being
the most advanced blockchain means Kadena has to solve problems for builders
that other layer-1 protocols can’t even conceive of, because they simply stop
scaling when they hit capacity. A Kadena builder needs their app to be just as
scalable as Kadena itself. The good news is with the 2.14 Chainweb upgrade and
Pact 4.3, builders can scale beyond their wildest dreams.

## Scalable Dapps on Kadena

A scalable Web3 app, otherwise known as a “dapp,” on Kadena is spread across
chains to avoid any possibility of congestion, while ensuring that on-chain data
is moved around correctly. Just like
[Pact smart contracts](https://www.youtube.com/watch?v=Voe0W5bJ0Cg&feature=youtu.be)
keep single-chain smart contracts safe and simple, multi-chain is no different,
thanks to three key new features coming in Chainweb 2.14 and Pact 4.3:

1.  **Principal accounts. **In 2021, Kadena introduced “K accounts” that ensured
    single-key accounts would be reserved on all chains, eliminating account
    squatting and other problems. With this upgrade, KDA will now support
    “principals,” which are multi-chain-safe account names for any kind of
    ownership: single-key, multisig, escrow accounts, and more. This allows
    transfers to “fire and forget” across chains with no chance of failure.

2.  **Nested Pacts. **Pact smart contracts like KDA move assets across chains
    using “pacts” to automate the two “legs” of the cross-chain transaction. Up
    until now, cross-chain pacts were stand-alone operations, but with _nested
    pacts_, one pact can initiate and continue pacts in other smart contracts.
    This allows single “atomic” operations that involve multiple assets, like
    managing liquidity across chains, or selling an NFT with money on another
    chain.

3.  **Cross-chain capabilities**. Finally, KDA, as a “fungible” token, now
    implements the new _fungible-xchain_ standard so that users can safely
    entrust cross-chain actions to dapps to move KDA on their behalf. The
    TRANSFER_XCHAIN capability allows the user to safely delegate cross-chain
    transfers to a dapp, just like TRANSFER does for same-chain payments.

## Real-world example: cross-chain DEX swap

Let’s see how these new features come together to allow for a seamless
experience with a real-world example: swapping between pools on different
chains!

Consider a DEX app with a liquidity pool for KDA-KBTC on chain 8 and a KDA-FLUX
pool on chain 11. We’ll show how a user can swap KBTC for FLUX simply and
easily. To start, the KDA-KBTC pool is managing 10MM KDA and 1,000 KBTC, while
the KDA-FLUX pool is managing 1MM KDA and 10MM FLUX. Our user Carol wants to
swap 0.1 KBTC for 1,000 FLUX.

![](/assets/blog/1_ezNlvAhuTwuzytAydi-XOw.webp)

On chain 8, the pool kicks off its cross-chain pact by transferring 0.1 KBTC
from Carol’s account into the pool’s account. It then initiates a cross-chain
pact of 100 KDA between its pool account on chain 8 to the pool account on
chain 11.

![](/assets/blog/1_EPXOd_D9LuH4QuCOqvKewQ.webp)

The second step on chain 11 happens automatically in the KDA-FLUX pool when the
pact is “continued” by the dapp, with no interaction needed from Carol. It
“continues” the KDA cross-chain to complete the 100 KDA transfer to its pool
account, and finally transfers the 1,000 FLUX from its account to a new
k-account for Carol.

![](/assets/blog/1_8CLtvjgeoqUU9BdbqSgICA.webp)

It’s important to realize that with principal accounts, Carol’s receipt of FLUX
on chain 11 cannot fail. Even if the pool does not have enough FLUX to pay 1,000
it can fall back to simply crediting Carol with the transferred KDA. Thus, what
looks like two unrelated transactions actually form a single “atomic” pair that
are guaranteed to succeed.

This is just the beginning of course. With proper overcollateralization, smart
contracts can manage risk across chains and indeed engage lending protocols to
allow liquidity providers to profit when a swapper’s need for liquidity across
chains goes over some (still safe) limit, by lending money on-demand to the
pool. Pools can then broadcast their risk positions safely to other chains,
guaranteeing scalable accessibility to swappers no matter what chain they start
on.

## The Result: A Seamless User Experience

The example above shows how Kadena can offer something no other layer-1 can
touch: truly scalable, safe interactions across chains without any user
intervention. But the real goal is to deliver value to the user so that they
don’t see chain 8 or chain 11 but just an industrial-strength marketplace ready
to service their needs quickly and safely.

At Kadena, we cannot predict all the amazing solutions that our technology will
be able to provide. Instead, we’re all about creating the building blocks and
infrastructure that builders can reliably use to take crypto mainstream and meet
Web 2.0 expectations of ease-of-use and accessibility.

Join our [Discord](http://discord.io/kadena) and come build on Kadena today.
Create the future of digital value!
