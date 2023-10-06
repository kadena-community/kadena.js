---
title: Exploring Kadena.js — Insights into the Kadena Developer’s Experience
description:
  In this article, we’ll walk you through our collective journey within Kadena’s
  extensive open-source ecosystem. We’ll share insights and experiences from
  across our team who are actively engaged in different projects. Although we
  have numerous projects underway, this article will focus on Kadena Client,
  Chainweb Stream, Kadena Tools, and our new Kadena React UI Components.
menu: Exploring Kadena.js — Insights into the Kadena Developer’s Experience
label: Exploring Kadena.js — Insights into the Kadena Developer’s Experience
publishDate: 2023-10-04
headerImage: /assets/blog/2023/1_GZsOuRB9xOfBG1pMHMt9Zg.webp
tags: [newsletter]
author: Kadena
authorId: kadena
layout: blog
---

# Kadena 2023 Q3 Newsletter

As we step into the final stretch of the year, we have seen tremendous progress
and growth in every department at Kadena. From new faces to global partnerships
to innovative developments, Q3 has been a whirlwind of activity, and we are just
getting started.

Let’s dive into some of the highlights that showcase our progress in Q3.

## Making an ImPact in Partnerships

![](/assets/blog/2023/1_fI2CMrnCprDoCzyZ9CLoKg.webp)

In the realm of partnerships, the business development team has been dedicated
to driving progress in several key initiatives, each playing a pivotal role in
Kadena’s evolution and broader blockchain ecosystem adoption. The team has been
focused on growing our array of smart wallets, improving privacy and scalability
with ZK proofs, and actively improving infrastructure, development tooling, and
storage.

Perhaps most excitingly, our team is one step closer to developing a bridge
solution to enhance blockchain interoperability with the
[Hyperlane](https://www.hyperlane.xyz/) Network. Hyperlane is a groundbreaking
permissionless interoperability layer, that offers APIs for interconnection
service between different blockchains, and an SDK to empower developers in
building interchain dApps. Hyperlane’s distinguishing feature lies in its
adaptability, rendering it compatible with a wide spectrum of blockchain
ecosystems. Hyperlane serves as the critical network for establishing essential
connections between Kadena, EVM chains, and other chains in the future.

Regarding our grantees, here are some of the remarkable projects that joined the
Kadena ecosystem in Q3:

1.  **[KadenAI](https://kadenai.com/form)** — Powered by Kadena’s NFT standard
    Marmalade, KadenAI is an innovative platform that offers a suite of
    comprehensive tools designed to facilitate the creation of NFT collections.
    These tools include NFT minters, utility generators, and AI-powered image
    generation, all aimed at creating a novel NFT experience. Generate your very
    own NFTs [here](https://kadenai.com/form).

2.  **[UNITT](https://www.unitt.io/)** (Universal Transaction Token Project) —
    UNITT is a project focused on building a tokenized payment infrastructure
    for chat-based interaction and content discovery. Their first featured
    application enables creators to sell their content directly to their
    audiences and monetize chat-based interactions such as follower engagement,
    AI chatbots, and paid searches.

3.  **[Linx](https://linxwallet.xyz/)** — Linx is the first chain-less wallet
    explicitly designed for operating on the Kadena blockchain. Linx wallet
    empowers users to send, store, and accomplish their tasks with just a few
    taps without the need for extensive technical knowledge.

4.  **[Swarms.Finance](https://dao.swarms.finance/intro)** — Swarms.Finance is a
    platform with a mission to transform DAOs within the world of DeFi. The
    platform provides a comprehensive suite of tools and features for managing
    funds, investments, liquidity, swaps, payments, and purchases.

In an effort to expand our outreach and foster meaningful connections, the
Kadena team has also made appearances at ETHCC Paris, Tech Open Air Berlin,
Messari Mainnet, Science of Blockchain Conference (SBC), Permissionless II, and
AwesomeWasm. Keep your eyes out as the BD Team is heading to DevConnect Istanbul
in Q4.

## Connecting every Kadena Corner: Community and Marketing

It’s a new chapter for Kadena with the recent addition of
[Mike Herron](/docs/blogchain/2023/mike-herron-kadenas-new-chief-marketing-officer-2023-09-08)
as Kadena’s Chief Marketing Officer. Mike specializes in enhancing branding
strategies and cultivating meaningful brand collaborations for renowned
companies spanning a wide array of industries, including sports, airlines,
consumer software, media, entertainment, and beyond.

Mike will be supercharging Kadena’s marketing endeavors across all facets,
spanning products to partnerships, all under a cohesive brand umbrella. The goal
is to inspire the community, blockchain innovators, and developers from diverse
backgrounds to embrace Kadena as the most secure and scalable blockchain
platform. For those who haven’t had the pleasure of hearing Mike’s big, big
plans for Kadena, we invite you to watch our
[Kadena Campfire Episode #31](https://www.youtube.com/watch?v=_KolOdcP5EE) for
some exciting upcoming news!

On the community front, [David Gillett](https://twitter.com/KadenaDave) has
joined Kadena as our community manager. David will be leading efforts to engage
with our vibrant community, foster meaningful discussions, and facilitate
collaboration among our members. His experience and dedication will play a
crucial role in nurturing the growth and vitality of the Kadena community.

Another development that has sent waves of excitement throughout the Kadena
community is the recent Ledger integration of KDA tokens. This integration marks
a significant milestone in our journey and is crucial in safeguarding your KDA
tokens. If you haven’t already had the opportunity to do so, we strongly
encourage you to check out
[this tutorial](https://support.ledger.com/hc/en-us/articles/7415959614109-Kadena-KDA-?docs=true)
about creating your own Ledger KDA account using your Ledger device.

We have also taken our community experience to the next level with Zealy. Zealy
is a platform that allows our community to complete tasks, learn more about
Kadena and the projects building on the network, and most importantly, it
provides valuable insights into the community. Best of all, community members
can earn XP points for completing the tasks which can be exchanged for some
awesome Kadena prizes. Start your quest with [Zealy](http://zealy.io/c/kadena/)
today!

If you want to learn more about Kadena’s visionary plans, head over to our
[Kadena Campfire Episode #27](https://www.youtube.com/watch?v=gYtzTdgtfsg),
featuring our founders, Stuart Popejoy and William Martino, where they cover
everything from Pact, to chainless wallets, to EVM compatibility.

## The Quest for a Remarkable Developer Experience

Q3 has been a period of intense activity for the Developer Experience Team at
Kadena. The team has been actively forging partnerships to drive the adoption of
Kadena’s cutting-edge technology. Collaborations with [code]capi, Varias, and
Superconnectors have all been instrumental in leveraging Kadena’s infrastructure
and tools to build products that connect startups with key industry players.

Kadena also sponsored its very first 3-day hackathon-style event organized by
Vue.js Forge. This event served as a platform for developers to showcase their
skills, collaborate, and explore innovative solutions within the Vue.js and
Kadena ecosystem.

On the tech front, the team has been laser-focused on building and providing
exceptional user experience. Highlights include the release of the
[Chainweb Streaming Server,](https://github.com/kadena-io/chainweb-stream/releases/tag/%40kadena%2Fchainweb-stream_v0.0.4)
a new system that enables persistent streaming of transactions and their
confirmation status, and the
[@kadena/client](https://github.com/kadena-community/kadena.js/tree/main/packages/libs/client),
which enables building, signing, and sending transactions to the Kadena
blockchain using TypeScript/JavaScript.

For new developers who want to build Web3 applications and learn Pact, the
Kadena Academy features hands-on workshops and tutorials. This quarter, the
Kadena Academy launched its first Pact Course:
[Mastering Functions in Pact](https://academy.kadena.io/courses/mastering-functions-in-pact).
Make sure to check it out and don’t forget that developers can collect Kadena
Learning Points along the way.

![](/assets/blog/2023/1_c16fH7iKnXDbSeUJ53nmVg.webp)

## Marmalade V2: A Unique NFT Experience

The whole Kadena team is hard at work, putting the finishing touches on
Marmalade V2, Kadena’s NFT standard. Offering limitless customization, policy
options, and enforceable royalties, Marmalade is setting itself apart to provide
creators, users, builders, and marketplaces with an exceptional NFT experience.
We expect Marmalade to be available on Mainnet soon, so keep your eyes peeled
for more news and updates.

Check out this
[article](/docs/blogchain/2023/marmalade-v2-an-architectural-overview-2023-09-25)
for a comprehensive exploration of all the one-of-a-kind features that Marmalade
has to offer.

## The Final Stretch

Q3 has been an exhilarating ride for Kadena. With partnerships, innovations, and
an ever-growing community, the path forward is clearer than ever.

Heading into the final few months of the year, our community can expect new
applications and updates such as the redesign of the Kadena Docs, the release of
new dev toolings, and perhaps most excitingly, a new Kadena website to signify a
momentous step forward in the evolution of Kadena.

Make sure to join our [Discord](http://discord.gg/kadena) and be part of our
incredibly talented and supportive community. Follow us on all our social media
channels and let’s continue to build a secure and scalable decentralized future
together!
