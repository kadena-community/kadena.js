---
title: Kadena 2023 Live Technical Roadmap
description:
  Since Kadena’s mainnet launch in January 2020, our team and community have
  grown tremendously. Our ecosystem experienced exponential growth with several
  hundred projects now building on the Kadena blockchain. Kadena’s massive
  growth could only be accomplished with the help of our amazing community,
  ecosystem of partners, builders, and ambassadors! Thank you everyone for
  accompanying us through this journey!
menu: Kadena 2023 Live Technical Roadmap
label: Kadena 2023 Live Technical Roadmap
publishDate: 2022-12-15
author: Stuart Popejoy
authorId: stuart.popejoy
layout: blog
---

![](/assets/blog/1_eguMp-5U0vl9Za5LkYNiCw.webp)

# Kadena 2023 Live Technical Roadmap

Since Kadena’s mainnet launch in January 2020, our team and community have grown
tremendously. Our ecosystem experienced exponential growth with several hundred
projects now building on the Kadena blockchain. Kadena’s massive growth could
only be accomplished with the help of our amazing community, ecosystem of
partners, builders, and ambassadors! Thank you everyone for accompanying us
through this journey!

As we enter 2023, Kadena will narrow our focus on developing our ecosystem
through technical developments such as refining the builder onboarding process
and improving our blockchain’s efficiency. As a result, we have updated our live
roadmap to define constant iterations in key areas of engineering and technical
development that will greatly benefit our community of builders and our entire
ecosystem as a whole. The upgraded roadmap will consist of:

1.  [\*\*Kadena.js](https://github.com/kadena-community/kadena.js)\*\* — New
    tools, resources, tutorials, and learning platform to increase and enhance
    the developer onboarding experience.

2.  [**Pact **](https://github.com/kadena-io/pact)— Upgrades to Kadena’s smart
    contract language to improve user and builder experience

3.  [\*\*Chainweb](https://github.com/kadena-io/chainweb-node)\*\* — Upgrades to
    Chainweb to enhance the blockchain’s efficiency, scalability, and
    decentralization.

The [Kadena 2023 Live Roadmap](https://kadena.io/roadmap/) is meant to fuel user
and ecosystem growth and will continually evolve over the course of the year. We
invite our community and anyone else to chime in and provide feedback and/or
suggestions to make Kadena better as we head into the new year.

![](/assets/blog/0_ujgA00av2h1eBx9c.png)

## Kadena.js

Kadena.js is a library that makes it easier for builders to interact with the
Kadena blockchain using JavaScript/TypeScript. It includes but is not limited to
libraries, tooling, dApps, tutorials, and more. The Kadena.js team has massively
expanded in 2022 and now has intricate plans in 2023 to launch new tools and
resources to increase and enhance the developer onboarding experience.

![](/assets/blog/1_ZpVSVYT0VLmEpOQ2eGhuBg.webp)

### Libs

Libs are a collection of pre-written, modular code components that can easily be
integrated into a builder’s project, without having to write all the necessary
code from scratch. Builders will be able to quickly iterate and spin up their
applications more efficiently and securely. Currently, we have curated a
collection of reusable codes targeted to address specific issues as listed
below:

- [@kadena/cryptography-utils](https://www.npmjs.com/package/@kadena/cryptography-utils)

- [@kadena/types](https://www.npmjs.com/package/@kadena/types)

- [@kadena/cookbook](https://github.com/kadena-community/kadena.js/tree/master/packages/tools/cookbook)

- [@kadena/pactjs](https://www.npmjs.com/package/@kadena/pactjs)

- [@kadena/chainweb-node-client](https://www.npmjs.com/package/@kadena/chainweb-node-client)
  — blockchain wrapper around chainweb-node p2p api endpoints

- [@kadena/client](https://www.npmjs.com/package/@kadena/client) — Github
  link[ here](https://github.com/kadena-community/kadena.js/tree/master/packages/libs/client#kadenajs---client)

- [@kadena/pactjs-cli](https://www.npmjs.com/package/@kadena/pactjs-cli)

- [@kadena/pactjs-generator](https://www.npmjs.com/package/@kadena/pactjs-generator)

We will be adding the following to our Libs in 2023:

- @kadena/chainweb-node-client — Pact js wrapper with fetch to call the Pact API
  REST endpoints.

- @kadena/wallet-client — client for wallet to sign, connect, retrieve account
  info, etc

- @kadena/marmalade-client specific client for marmalade/NFTs

- @kadena/transaction-templates, which is a supportive library for transactions.
  Transaction-templates provide the community with a way to “publish” templates.
  These templates can be used by @kadena/pactjs-cli to generate the necessary
  TypeScript functions

- @Kadena/chainwebjs

- @kadena/sse-client

- @kadena/react

![](/assets/blog/1_Us4NvSIgo06nr-GhKyL_zg.webp)

### Tools

Kadena.js tools are designed to assist developers achieve a specific function or
goal with their application. At Kadena, our team is designing the following to
help our community of developers build with efficiency and ease through better
environments for coding and testing:

- IDE support for VSCode

- IDE Support for Intelij

- Tool for deployments

- Tools for code generation

- WalletConnect multi-tx signing API specification

![](/assets/blog/1_yaqwcAKsgaznfM2xnimS8g.webp)

### Apps

The Kadena.js team has also dedicated their time to creating dynamic and
interactive apps to help users and developers interact with and/or retrieve
information from the Kadena blockchain. In 2023, the Kadena.js team aims to
launch the following apps:

- Multi-tx signing tools

- Balance Checker

- Rebuild of the Transfer Tool

- Tx-Tester

- Rebuild of the Faucet

- Event streaming Server

- GraphQL interface

- Ledger support

![](/assets/blog/1_FdA74oe-yMT29wSr6zXtuQ.webp)

### Tutorials

The Kadena.js team curated a number of tutorials to provide our community of
developers guidance for a wide range of topics. The tutorials are designed
specifically with practicality in mind to ensure our developers learn the
necessary tools to help them build in the most efficient and simple manner. In
2023, we plan to launch the following tutorials:

- Todo App

- Wallet

- Voting

- ZK rollup

- ZK identification

- Payment

- eCommerce

- DeFi

- Gaming

- Oracle integration

- Storage

- NFT

![](/assets/blog/1__iFitLHpTQGMA1GGtQ0bgA.webp)

### Kadena Tutorials Learning Platform

The “Kadena Tutorials Learning Platform” is a new comprehensive educational
program developed by the Developer Experience team specifically designed for the
curious and the aspiring developers/builders. The Kadena Tutorials Learning
Platform provides users an introduction to Pact and Kadena.js. Users will
participate in coding challenges for building and deploying blockchain
applications on Kadena.

To engage users, the Kadena Tutorials Learning Platform is structured to be a
token-based platform where developers can earn tokens for completing challenges.
Users are also able to earn shareable certificates and NFT certificates upon
course completion. Currently, the developer experience team is also entertaining
the option of creating leaderboards to ensure a fun and lighthearted competitive
experience. The team will be running a first test of the Kadena Tutorial
Platform with beta users in the beginning of 2023 — stay tuned to find out more!

![](/assets/blog/1_GRlrWMEO_oLcBLDyvDbj5A.webp)

## Pact

Pact is an open-source, Turing-incomplete smart contract language that has been
purpose-built with blockchains first in mind. It was designed to make building
safer smart contracts effortless as it is readable by non-developers and can
automatically detect certain classes of bugs.

Over the course of the next year, Pact developers will see feature releases with
the goal of improving user and builder experience by improving error handling
and implementing standards to help builders code safer. Some of the releases in
2023 will include:

- Autonomous namespace definition

- Enhanced dry-run transaction simulation via /local on Pact service

- Gas model improvements

- Zero-knowledge primitives

- Reintroduction of on-chain Pact user error messages

- Database compaction

- Improved module caching — Allow Pact to operate at a faster speed in different
  scenarios

- Work toward Pact Core — Includes gradual change of the Pact language in order
  to improve the consistency of its semantics and enable builders to code in a
  safer, cleaner, and more efficient manner

![](/assets/blog/1_fVcMG2X6fjaaPWUwFTU0TA.webp)

## Chainweb

Chainweb is Kadena’s blockchain consensus mechanism and continues today to be
the only sharded and scalable layer-1 PoW network in production since its
release in 2019. In the coming year, the Kadena team will set technical
milestones to improve Chainweb’s reliability and performance for miners,
developers, and, ultimately, users of our network. We expect the team to focus
on the following in 2023:

- Performance improvements, including during catchup and replay

- Specialized devnets for different usage scenarios

- Bootstrap reliability (covered by payload query performance improvements,
  catchup performance improvements, and P2P topology adjustments; all of which
  will also contribute to DOS protection)

- Uptime/node reliability (esp. bootstraps)

## CONCLUSION

The 2023 Kadena roadmap is designed to push Kadena to build the most
cutting-edge blockchain technology that can scale to global demand without
compromising security and decentralization. All of the features outlined in
Kadena’s 2023 live roadmap are meant to empower our community to build without
limits.

If you are as excited as we are for the new road ahead, kindly join our efforts
in making Kadena better. Whether that’s building on our platform as a developer,
creating a new dApp learning to code with Pact, or simply providing suggestions
and feedback, the Kadena community becomes stronger with each and every one of
you.

We are excited to have you as part of our journey and look forward to building
the future of the blockchain together!
