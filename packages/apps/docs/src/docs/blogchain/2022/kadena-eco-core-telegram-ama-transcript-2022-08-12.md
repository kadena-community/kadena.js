---
title: Kadena Eco & Core Telegram AMA, August 11, 2022 Transcript
description:
  Welcome everyone, to the return of Kadena’s Telegram AMA! Compared to last
  year, we have a full suite of amazing team members joining us today for this
  special AMA session! Without further ado, I’ll let the team introduce
  themselves to the existing community members and anyone new tuning in!
menu: AMA, August 11, 2022 Transcript
label: AMA, August 11, 2022 Transcript
publishDate: 2022-08-12
tags: [kadena, grant]
author: Kadena
authorId: kadena
layout: blog
---

# Kadena Eco & Core Telegram AMA, August 11, 2022 Transcript

## Introduction

**Jeffrey Ou:** Welcome everyone, to the return of Kadena’s Telegram AMA!
Compared to last year, we have a full suite of amazing team members joining us
today for this special AMA session! Without further ado, I’ll let the team
introduce themselves to the existing community members and anyone new tuning in!

**Stuart Popejoy:** Hey y’all! great to be back with the original crew doing an
AMA, looking forward to everyone’s questions!

**Emily Pillmore:** Hi Everyone! glad to be here!

**Francesco Melpignano:** Hi everyone! Great to be here for a live AMA and
looking forward to everyone’s questions!

**Doug Beardsley:** Hi everyone, I’m Doug, Kadena’s Director of Engineering.
Lately, I’ve been focusing on growing the team and onboarding the phenomenal
engineers who have recently joined.

**Will Martino:** Jeff says we should intro ourselves! Hi I’m Will Martino,
Co-Founder and President of Kadena. Before Kadena I was lead eng for Juno, JPM’s
first blockchain and what became JPMCoin v0. Before that I was at the SEC as the
lead eng for a quant group that was building forensic tools that are now
deployed nationwide. When I was at the SEC I also was the founding tech lead of
the SEC’s Crypto Working Group. My co-founder Stuart Popejoy and I met at JPM
and founded Kadena to address the shortcomings we found when we tried to get the
EVM/ETH to do more than simple tokens/debt at an industrial scale. This required
substantial innovations in both smart contract and base layer technology, which
we’ve spent the last 6 years shipping (gosh it’s been 6+ years).

**Emily Pillmore:** I’ll intro too: Hi! I’m Emily Pillmore, Team Lead for Pact.
Before, I was CTO of the Haskell Foundation, Advisor for SundaeSwap, Senior at
Disney/ESPN/Bamtech, and hired gun CCAR auditor on Wall St. I’m a published math
nerd, programming language buff, and I ride a motorcycle with cat ears on my
helmet.

**Doug Beardsley:** I’ve been in the software business for close to 19 years.
Over that time I’ve worked in defense, security, finance, and in a few startups
building frontend and backend web apps. I’ve been programming Haskell
professionally for 12 years which is what led me to meet the Kadena team. Now
I’m Kadena’s Director of Engineering and love working with the talented team of
engineers we have.

**Stuart Popejoy:** Hey everyone, Stuart here — I’m the CEO of Kadena and author
of the Pact smart contract language. Before that, I built the blockchain team at
JP Morgan, been in tech for 25 years, and trading tech for 15. Now I’m pumped to
be working with the best technologists and product thinkers in blockchain:
Kadena Core & Kadena Eco!!

**Francesco Melpignano:** Intro as well, CEO of Kadena Eco and leading the
ecosystem growth of Kadena through grants, investments, R&D, and
incubation/acceleration. Lots of exciting stuff coming from our end in the
coming months. Happy to leak some alpha here today

**Jeffrey Ou:** Awesome, great to have the core team from Kadena Eco and Core
joining in on this AMA! With the introductions out of the way, let’s jump into
the pre-asked questions from Twitter, Telegram, Discord, and Reddit!

## Community Pre-Asked Questions

**Jeffrey Ou:** The first question we have from the community is from

> **Frag (@Frag6534)** on Telegram: “What is the status of these collaborations
> [such as Chainlink, API3, and USCF]?”

**Francesco Melpignano:** After a very
[successful cohort set of grants](./introducing-kadena-ecos-inaugural-grant-cohort-2022-07-26)
going out, oracles will be a big focus for the next cohort. We are working with
API3 and Chainlink to be on their integration pipelines, although they are
focusing more heavily on EVM-based chains. There are many other companies we are
also talking to at the moment to natively support Kadena oracles and also
several other intermediate steps to give builders all the necessary
infrastructure to build all possible use-cases on Kadena. With Kaddex coming to
life with a successful launch, their price feed can work as an intermediary step
for oracles

We are also working closely with [Kalend ](http://Kalend.finance)to help them
figure out the most reasonable solution. We are drawing a lot of parallels from
AAVE who also run their own internal oracle as a sanity check for the integrity
of their data.

**Will Martino:** My fav collab (sorta pet project) at the moment is Electron
Labs. We’ve been wanting to do ZK on KDA for a while. About a year ago we
started working on bridges and found the existing tech pretty for decentralized
bridges pretty rickety… and in the intervening year, that opinion has been
pretty validated. Then we got in touch with Electron, and I’m really digging
their ZK bridge approach. The first step is to bring Electrons ZK onto testnet,
which we’re aiming for October. After that, mainnet. This will support
rollups/privacy. After that, we can dig into the decentralized bridging tech.

**Jeffrey Ou:** Thanks for the updates. Speaking about grantee cohorts, this is
a great segway to another community question for Kadena Eco’s CEO @fmelp.

> **Hereby (@herebycm)** on Telegram asked “What about the Kadena Green mining
> incentive?”

**Francesco Melpignano:** Awesome question, thanks @herebycm. We are also
focusing on decentralizing and providing more green mining to the Kadena network
with the next cohort of grants. We have almost finalized a grant to a project
that has already implemented the tech for a decentralized mining pool. We
exposed that API to the community some time back and we are glad to see a
company with great founders and serious backing turn it into a self-sustainable
project. The project will empower our community to choose a pool that does not
centralize hashpower and payouts.

RE the green mining initiative, we are looking for companies and applications
that can facilitate green initiatives and reward miners using actually renewable
energies.

**Jeffrey Ou:** Thanks for the sneak preview on the next cohort @fmelp!

**Doug Beardsley:** While we’re talking about mining, I’ll just remind the
Kadena mining community that spreading hash power around among the different
pools always helps improve things in a variety of ways. Some new pools have come
online recently. Definitely worth checking them out.

**Jeffrey Ou:** Moving onto Marmalade, Kadena’s NFT standard.

> **@cryptometcalfe** on Twitter had asked: “It seems there’s a number of
> different approaches with Marmalade leading to potential NFT fragmentation.
> How do you plan to bring it all together into a unified standard to ensure
> interoperability through the ecosystem?”

**Stuart Popejoy:** Great question! Kadena’s always been at the forefront of
standards technology, but it’s nothing if the community is not involved every
step of the way, and recently this has taken a step up with great community
involvement surrounding things like managing and interoperating with NFT
collections, wallet interactions, cross-chain, DIDs and other exciting topics.
While you’re right there has been some fragmentation, I see this as a natural
outcome of an open process/open-source code that only helps the final standard,
as builders simply deploy with their own ideas and then coalesce around better
ways to do things. The upcoming weeks will have some great new work coming on
line in all of these areas and even v2 of some of the standards!

**Jeffrey Ou:** Awesome to hear that we’re involving our community of builders
in the decision-making with regards to the development of Marmalade! Speaking of
community builders,

> **MarcoMrm (@Marco_o_O)** on Telegram asked: “When Pact with python-like
> syntax? Will Pact support other syntaxes?”

**Doug Beardsley:** Oooh, been a while since we got this one…

**Emily Pillmore:** Another good question! So we’ve been discussing this for the
past few months and Jose has released some preliminary syntactic snippets to
gauge interest in whether or not Pythonic syntax would be a good idea for Pact.
Since we’re going all in on Pact Core over the next 6 months for improved
performance, tooling, and community involvement, we decided that yes: pythonic
syntax would be good to have and we’re going to follow through with it. However,
it will not be the first syntax released for the new Pact, since it would
require an ecosystem-wide migration effort in terms of docs, tutorials and
tooling support to do it. So, we’ll be rolling out with the classic lisp-like
syntax at first, and enlisting tons of your help in order to help us migrate.

**Jeffrey Ou:** Thanks for the alpha on Pact’s roadmap @emilypi! Can’t wait for
the new and improved Pact! Before we move onto more builder questions, we have a
specific question for @wjmartino!

> **R0nnybums** on Reddit asked: “Did you have programming experience before you
> went to ‘Hacker School’ to learn Haskell? Seems quite an impressive jump to
> learn Haskell for 3 months before getting a job at JP Morgan as a Haskell dev
> then creating a blockchain in Haskell a year or so after that. Thanks!”

**Will Martino:** Yeah… well I kinda burnt out at the SEC and needed a break.
Hacker School (Recurse now) was/is a great way to fall back in love with
programming, it’s like a writers retreat for programmers. Anyway, I had a blast
and focused on actually learning Haskell which I’d wanted to do for years.
Interesting side note, the _write you a scheme_ that I did when I was there was
one of the first 2 languages to run on JPM Coin v0. I got really lucky in
landing a gig at JPM and meeting @Stuart Popejoy after Hacker School and I guess
the rest is history.

**Jeffrey Ou:** Always great to hear more about your impressive background and
Kadena’s founding! Going back to builder-related questions, this next question
is very much in line with the discussion held during @mightybyte’s office hours
(Wednesdays at 9 AM ET on Twitter).

> **@cryptometcalfe** on Twitter had asked: “I’d like to understand the roadmap
> to better interoperability between chains. Doug seems to be working on
> IntelliSend, is there any other infrastructural tools that will help retail
> users operate with less chain friction?”

**Doug Beardsley:** The key piece of infrastructure that will reduce chain
friction is what we call QuickSign, a signing API that allows multiple
transactions to be signed in a single signing request to the wallet. That
interface is simple and already defined. We are currently working on
WalletConnect infrastructure which will allow this QuickSign API to be used in
many more dAPPs and wallets. I dropped a teaser video of something I’ve been
working on that I’m tentatively calling IntelliSend that shows how this kind of
signing infrastructure can be used to make chains completely disappear. You can
see it at:

[https://twitter.com/BlockchainDoug/status/1539733933801316361](https://twitter.com/BlockchainDoug/status/1539733933801316361)

There are a couple of significant things about that video. First, the signing is
being done by a web wallet (not a desktop wallet or browser extension). This is
something that wasn’t possible before WalletConnect. Second, handling chains
transparently opens up a whole new set of possibilities for optimization. A
sophisticated transfer tool could automatically load balance across chains,
choosing chains that are less congested and have lower gas fees. Huge
possibilities for improvement here.

**Jeffrey Ou:** Thanks for the update @mightybyte! After this [next] question,
we’ll open the floor up for live questions so be sure to paste in your questions
soon! In terms of accessibility, wallets are one of the most essential tools
needed for interacting with the blockchain.

> **@AlterVibeEgo** on Twitter had asked: “Is it possible to integrate a
> hardware authentication device like a YubiKey onto Chainweaver or Chainweaver
> web?”

**Doug Beardsley:** Yes. In fact, I happen to know that someone has already
integrated a credit-card-sized hardware wallet and is actually using it to sign
Kadena transactions. YubiKey I’m not 100% sure about. That will need more
investigation. But the more general question of arbitrary hardware signing
devices is a definite yes.

**Francesco Melpignano:** There’s definitely been testing and exploration of
several hardware wallet solutions and once again thanks for the question as this
is another focus of the next cohort of grants. To support wallet infrastructure
and extend the wallet ecosystem to hardware solutions and tools to make mobile
dAPP interaction easy and seamless. For those that caught it, the Lago team a
while back teased out signing a tx with an existing hardware wallet solution

**Doug Beardsley:** Note that my IntelliSend teaser was intentionally vague.
There’s more to come there.

**Jeffrey Ou:** Sweet! Great to see progress with the hardware wallet and making
it easier for users to access KDA and any other tokens on Kadena!

## Live Community Questions

**Jeffrey Ou:** Great! Let’s open up the floor for community questions :)!

> **Ra:** What are possible catalysts this year?

**Doug Beardsley:** I actually think the current crypto bear market is a great
catalyst. I think the weak projects will get shaken out. While this will
inevitably involve some short-term pain I think that this will ultimately be
good for solid projects.

> **k: Mr Metcalfe (@whippersnapperUK):** Any news on Kuro updates to work
> alongside mainnet? It seems some projects are keen to use it?

**Emily Pillmore:** While Kuro is a very capable L2, the reason we’re doing ZK
rollups with Electron is so that we can provide a more modern optimistic rollup
solution first, as we gauge what the workload is going to look like for Kuro.

> **Charlie (@Charliesmith1):** Any ideas for devs on key infrastructure that
> isn’t already being built that Kadena needs to bring widespread adoption?

**Francesco Melpignano:** Infra is a big focus to give builders what they need
to come to develop the next gens of dAPPs on Kadena. Now that a bridge is live,
we are focusing on getting more tokens over (with and without tokensoft),
oracles, node hosting solutions (think infura/alchemy), wallets that make Kadena
chain and apps ready for mainstream users (beyond seed phrases and conventional
wallets today), more example policies and documentation for Marmalade to power
the next-gen of NFTs.

> **hereby (@herebycm):** What makes Kadena better than Ethereum for Zk rollups
> (referring to what Emily said in KDLounge)?

**Will Martino:** The main thing is base-layer scaling + readable on-chain code,
but that’s what makes KDA better for crypto development generally. If you don’t
have a scalable base layer, you can’t handle adoption long term… as there’s no
way to handle gas price increases. ZK helps via rollups, but still settling to
mainnet costs a lot of gas on a normal single chain (or even DAG) chain. Add to
that that the code that executes is the code that you write, and it’s just
safer. That said, one cool benefit is that you can have parallel ZK kernels for
the same token running on different chains, so a properly scalable ZK token
becomes a reality.

> **tesco value:** Is there a minimum hash power or # of miners needed for XXX…
> Number of chains? If there were rolling blackouts around the world, how many
> miners would be needed to keep all chains producing blocks?

**Will Martino:** No, there’s not. That’s the cool part of POW. Once the
hashrate is **sufficiently **strong (which we already are) then the number of
chains run vs hashrate are truly unrelated.

> **G P Popejoy (@ALkaLineNumber9):** Is there a plan for the next Kadena
> conference?

**Doug Beardsley:** Yes, a Kadena conference is in the works. Not sure on timing
yet but we definitely know that in-person events, meetups, hackathons,
conferences, etc are things that we will want to do in the future.

## Closing Remarks

**Jeffrey Ou:** Thanks for the questions everyone, going to mute the channel for
closing remarks! As we wrap up today’s AMA session, I just wanted to go around
the room and ask what each team member is currently working on and the exciting
project/roadmap item they’re most excited about!

**Will Martino:** I already talked about mine… making scalable ZK a reality!

**Emily Pillmore:** Thanks everybody! I’m most excited about delivering Pact
Core in the next 6 months and I’m hyped AF that it’s going to be reality. 2
years from inception to release!!! WAGMI.

**Francesco Melpignano:** Thanks everyone! Can’t wait to reveal the next cohort
of grants and the progress of the previous cohort that’s already shipping
fundamental infra for Kadena and all the builders coming our way.

**Stuart Popejoy:** Between work on refining Marmalade standards, the great work
Emily and the pact team are doing, and the incredible cohorts coming out of
Kadena Eco, 2022 is heading toward an exciting Q4 with incredible projects and
builders coming on line and new technologies hitting the ground! Kadena is the
future of digital value and we’re not slowing down. Stay tuned and keep
building! This community is the best and we couldn’t be prouder to be part of
making blockchain work for everybody!

**Doug Beardsley:** I’m most excited about this in-progress WalletConnect
infrastructure because it will totally change the game with respect to how
people think about wallets. Features that used to be considered wallets will be
able to be moved to dAPPs. I think we’ve only started to scratch the surface of
the possibilities.

**Jeffrey Ou:** Thanks for the update!! And thank YOU to the community for the
awesome questions!!

That concludes the first Kadena Telegram AMA for this year. If you are
interested in reading the AMA directly from Telegram, join our
[Telegram](http://t.me/kadena_io) and view the discussion starting
[here](https://t.me/kadena_io/410978). To get the latest announcements about
Kadena’s progress follow us on [Twitter](https://twitter.com/kadena_io),
[Discord](https://t.co/VK1m2oyh2L?amp=1),
[Reddit](https://www.reddit.com/r/kadena/),
[LinkedIn](https://www.linkedin.com/company/kadena-llc), and
[YouTube](https://www.youtube.com/kadenablockchain).
