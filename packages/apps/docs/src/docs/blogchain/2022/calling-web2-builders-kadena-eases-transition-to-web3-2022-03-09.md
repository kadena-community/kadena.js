---
title: Calling Web2 Builders - Kadena Eases Transition to Web3
description:
  In March 2017, Kadena entered my radar when raising its seed round. Despite
  initial skepticism, I remarked to my partners at Asimov Ventures how impressed
  I was with Kadena’s software — it seemed to be addressing serious problems
  with Ethereum. When I subsequently met Kadena’s founders, Will Martino and
  Stuart Popejoy, I was blown away here were two brilliant programmers solving
  their own problems.
menu: Calling Web2 Builders - Kadena Eases Transition to Web3
label: Calling Web2 Builders - Kadena Eases Transition to Web3
publishDate: 2022-03-09
headerImage: /assets/blog/1_jYzwXoAJq18vJgaOfl9rgA.webp
tags: [kadena, chainweb]
author: Tyler Benster
authorId: tyler.benster
layout: blog
---

# Calling Web2 Builders: Kadena Eases Transition to Web3

_by Tyler Benster, Technology Adoption Lead, Kadena Eco_

In March 2017, Kadena entered my radar when raising its seed round. Despite
initial skepticism, I remarked to my partners at Asimov Ventures how impressed I
was with Kadena’s software — it seemed to be addressing serious problems with
Ethereum.

When I subsequently met Kadena’s founders, Will Martino and Stuart Popejoy, I
was blown away: here were two brilliant programmers solving their own problems.
At JP Morgan, they were tasked with identifying a blockchain that was
production-ready for a major banking institution, capable of settling sufficient
transaction volume for a meaningful market like commercial paper. Finding none,
they set out to build a new blockchain. Asimov Ventures came onboard as the
first institutional investor that recognized the value of their vision.

**Choosing the right blockchain for the job**

Blockchains are often described as a distributed ledger — a decentralized
database with a strong trust model. Unlike with frontend technologies, where
Javascript emerged as the singularly dominant programming language thanks to the
coordination of makers of popular browsers, backends typically follow growth
S-curves, where multiple technologies co-exist and new entrants can rapidly
capture mindshare based on their technical merits. PHP, Django (Python), Ruby on
Rails and Phoenix (Elixir) are a smattering of backends that enabled the rise of
Web2.

Bitcoin Script and Solidity are foundational blockchain languages insofar as
they were the first. Their novelty, utility, and draw come from the network
effects of the ecosystem rather than any technical merits.
[Solidity](https://en.wikipedia.org/wiki/Solidity), for example, ignores the
advances and ergonomics from two decades of progress in Programming Language
Theory, allowing entire classes of bugs to exist that could be prevented at a
language level.

Nearly all programmers today use language and tooling that are, in some
theoretical sense, completely interchangeable. Ultimately our code could be
interpreted by a Turing Machine, and while ergonomics matter, no language is
fundamentally incapable of running an algorithm written in another. This brings
exquisite beauty and power. Some programs can merrily tick along indefinitely,
like a carefully initialized instance of Conway’s
[Game of Life](https://playgameoflife.com/). Yet this property irrecoverably
produces one of the thorniest challenges for the static analysis of programs:
the [halting problem](https://brilliant.org/wiki/halting-problem/). For
[Turing Complete](https://academy.binance.com/en/glossary/turing-complete)
languages, one cannot look at an arbitrary program and make a simple declaration
if it will terminate or execute indefinitely.

If you were a financial modeler using Microsoft Excel as your daily driver, an
unhalting spreadsheet might be disruptive, and indeed patterns like the
while-loop or recursive functions are highly discouraged and largely unused.
More pertinently, if I were to hire you, the reader, as a consultant, it would
be unthinkable for a mistake in our contract that allows you to recursively call
a “pay” function and drain my bank account. Most of us do not want or need
Turing Completeness when expressing financial transactions.

**Kadena evolves blockchain programming**

Enter Pact. [Pact](/tags/pact) is a Turing Incomplete smart contract language
from the Lisp-family, because
[real hackers use Lisp](http://www.paulgraham.com/avg.html), of course! Thanks
to Turing-incompleteness, all Pact programs must halt, and powerful tooling like
Formal Verification are baked in at the language level–think test fuzzing or
integration testing on steroids. Pact is lightweight, easy to learn, and the
human-readable code stored on the blockchain is exactly what is run. In
contrast, Ethereum’s Solidity stores bytecode on the blockchain, allowing for
exploits where human-readable code is audited but malicious bytecode is actually
submitted to the blockchain.

Central to Pact is the notion of a “def-pact”: a function that defines a
multi-step transaction. A simple “def-pact” is used to create one of Kadena’s
defining features: the ability to transfer coins from one blockchain to another.
In brief, first a user burns coins on the first blockchain. Then, the user
completes the pact by submitting
[Proof-of-Burn](https://www.investopedia.com/terms/p/proof-burn-cryptocurrency.asp#:~:text=Proof%20of%20burn%20%20is,%E2%80%9Cburn%E2%80%9D%20virtual%20currency%20tokens.)
to a second blockchain, which verifies that the proof is valid and not yet
submitted, allowing the coins to be created. The smart contract that implements
“coin” has a mass-preserving property declared, and the compiler performs formal
verification to ensure that new coins cannot be created out of nothing. Thanks
to the power of “def-pact” and formal verification, Kadena has operated a bridge
across all 20 chains for more than two years in production with _zero_ hacks or
attacks.

**The case for Kadena: VHS vs. Beta? Email vs. Fax?**

If you were to start a newsletter business in 1994, perhaps you’d choose between
two networks: email or the fax. At first blush, you’d have to be crazy to choose
the internet. The number of fax machines was vast, the network effects were
massive. And indeed, even in 2022 fax machines are still a staple of many
businesses — the protocol has many users even today. Yet the mere existence of
an alternate, dominant network does not preclude the adoption of new ones.

The proliferation of chat applications comes to mind. While attending the
ETHDenver conference in February, I connected with folks on Telegram, Discord,
Twitter, Instagram, Whatsapp, iMessage, Signal and SMS. These networks coexist
happily on my phone. Users gravitate to new chat platforms because they offer
killer features, like cross-platform, end-to-end encryption, GIF support and
more. Often, it’s easier to start a new network, than bolt on to an existing one
(see IRC, AOL Instant Messenger, Blackberry Messenger).

I conceive that had Bitcoin and Ethereum figured out how to scale Proof-of-Work,
that Proof-of-Stake blockchains might not exist. If Bitcoin were settling the
world’s transactions, its energy usage would be acceptable. But it’s not —
Bitcoin’s current capacity is seven transactions per second. Yet solutions to
this problem are not unknown; many sharding-based approaches were described
nearly a decade ago (see section on “PoW Parallel Chain Prior Art” in the
[Chainweb whitepaper](https://www.kadena.io/whitepapers)). Proof-of-Work
blockchains such as Kadena’s are notoriously stable and stubborn: each node
operator or miner chooses whether or not to adopt new software, effectively
forming a Decentralized Autonomous Organizations (DAOs) that resists change
deemed too bold or in conflict with miner interest.

**Kadena Eco: the right partner for builders at any stage**

Kadena has experienced rapid initial market adoption among talented developers
and other community members. We attribute this growth to Kadena’s many technical
advantages:

1.  Mainstream accessibility

2.  True decentralization

3.  Infinitely scalable

4.  Energy efficient

5.  Best-in-class security

6.  Next-gen programming languages

Now Kadena is making significant investments to empower all technologists to
build blockchain for the mainstream. In February, we announced
[Kadena Eco](./turbocharging-mainstream-adoption-with-kadena-eco-2022-02-15), an
innovation network fueling the mainstream adoption of Web3, DeFi and NFT. Kadena
Eco aims to unite technical founders and entrepreneurs with the world’s top
blockchain leaders, venture capitalists and acceleration partners to support
startups at every phase of their development journey.

In my role at Kadena Eco, I continuously engage with startup founders and
early-stage technology innovators to better understand their needs and
requirements. My goal is to help them take advantage of Kadena’s many
advantages, from platform superiority, to product and operational expertise, to
the deployment of smart capital.

But most importantly, I want builders to realize one key thing: in an industry
that moves incredibly fast, choosing the right growth partner is critical to
achieving their vision. Kadena Eco is the right partner as Web3 horizons emerge
in full view, with greater clarity than ever.

**The Web3 promise: speed to growth and financial freedom**

Web3 promises a new bargain for technical builders and users. In the Web2 boom,
founders might raise a seed round from Angel investors and subsequent Series A-D
funding from venture capitalists. If all went well, within five to seven years
after founding, the company might be acquired or IPO. Only at this point would
platform users and retail investors be able to formally acquire a say in
governance as well as share the upside of the company’s growth.

Conversely: in Web3, it’s not uncommon for project tokens to be liquid in five
to seven _months_ after formation, with early adopters often obtaining formal
governance privileges from the onset. It’s a radically different economic model
for founders, users and retail investors.

With the removal of key gatekeepers from financing comes greater freedom to
fundraise for ideas from founders who otherwise might be shunned by previous
technology tastemakers. Background, experience, and previous relationships
matter only insofar as they help galvanize community support and adoption.
Today, a new democratized form of work is emerging, where folks can get paid to
work for organizations they support just by joining a Discord channel.

**Join the Kadena Eco community**

If you’ve made it this far, take the next step and connect with us today.

For Web2 builders looking to learn from tutorials or get involved with starter
projects, get started with Kadena:
[https://kadena.io/build/](https://kadena.io/build/)

For Web3 builders seeking to take projects to new levels of security,
scalability and decentralization, connect with our world-class experts and
advisors: [https://kadena.io/eco/](https://kadena.io/eco/)

- _Specific to energy efficiency, I’m excited to share that Kadena is newly
  named as the most efficient Proof of Work network according to Cryptowisser’s
  [Crypto Carbon Footprint List](https://www.cryptowisser.com/crypto-carbon-footprint/)._
