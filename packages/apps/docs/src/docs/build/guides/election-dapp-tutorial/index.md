---
title: 'Workshop: Build an election application'
description:
  Learn how to build a decentralized application that registers votes on the
  Kadena blockchain.
menu: 'Workshop: Election application'
label: Welcome
order: 3
layout: full
tags: [pact, smart contract, typescript, tutorial]
---

# Welcome to the Election workshop

The Election application workshop consists of several self-paced tutorials with
content and coding challenges to help you learn about how to build decentralized
applications for the Kadena network using the Pact smart contract programming
language and related tools.

## What you’ll build

The tutorials in the workshop will guide you to create an application website
where Kadena community members can elect the new president of the fictional
Kadena society.

In this application:

- All members of the Kadena community can cast one vote for any candidate
  nominated by election officials.
- All votes and vote-counting mechanics must be published on the blockchain, so
  that the election process is fully transparent.
- Anyone—inside of the community or outside of it—must be able check the
  election results and verify that the election process was conducted fairly.
  For example, anyone should be able to verify that no double or fraudulent
  votes were cast.
- All voters must be able to cast their votes anonymously so their privacy is
  protected.

To ensure that the application can meet these requirements, every vote is
executed as a transaction on a blockchain. The blockchain is the perfect vehicle
for this application because it can ensure data integrity, authenticity,
transparency, and privacy. However, transactions require computational resources
and fees to be paid in exchange for the resources consumed to validate a block.
To make the election application accessible to all community members for free,
the election contract includes a special type of reserve account—called a **gas
station**—that pays the fees for all voting transactions.

## What you’ll learn

By completing the tutorials in this workshop, you’ll learn how to:

- Create and fund accounts.
- Leverage keysets and capabilities to manage permissions.
- Interact with the blockchain directly from your contract code.
- Read data from the blockchain state for free.
- Sign and send transactions that require fee payments.
- Deploy and update a smart contract.
- Use a gas station to pay fees on behalf of application users.

Some of the topics covered in this workshop are similar to topics introduced in
the [_Quick start_](/build/quickstart). For example, you’ll set up a development
network (devnet) running on your local computer in a Docker container and sign
transactions using public keys and Chainweaver accounts. However, the tutorials
in the workshop also touch on additional topics such as:

- How to develop smart contracts that use formal verification.
- Options available for signing transactions.
- Where you can find additional tooling for blockchain development, including
  the Kadena JavaScript client library, Chainweaver, the Pact command-line
  executable, and more.

## What you'll need

To complete the tutorials in the workshop, you need to have some software
installed on the computer you are using for your development environment. Each
tutorial includes a "Before you begin" summary of what you'll need for that
specific tutorial. As a preview before you start the workshop, you should check
whether your development environment meets the following basic requirements:

- You have an internet connection and a web browser installed on your local
  computer.
- You have a code editor, such as Visual Studio Code, access to an interactive
  terminal shell, and are generally familiar with using command-line programs.
- You have [Docker](https://docs.docker.com/get-docker/) installed and are
  generally familiar with using Docker commands for containerized applications.
- You have [Git](https://git-scm.com/downloads) installed and are generally
  familiar with using git commands.
- You have [Node.js](https://nodejs.dev/en/learn/how-to-install-nodejs/) and
  [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
  installed on your local computer.
- You have access to
  [Chainweaver](https://github.com/kadena-io/chainweaver/releases) desktop or
  web application.
- You have [Pact](https://github.com/kadena-io/pact#installing-pact) or the
  [Pact language server plugin](https://github.com/kadena-io/pact-lsp/releases)
  installed on your local computer.

If you have everything you need, let’s start building the election website by
following the workshop roadmap to get started with
[Prepare your workspace](/build/guides/election-dapp-tutorial/prepare-your-workspace).

## Workshop roadmap

This workshop consists of multiple tutorials that you should complete in order.
Each tutorial provides some starter code and guides you to completing the tasks
necessary to build the Election application to run on the Kadena blockchain.

For the first tutorial, you’ll clone a repository with a working front-end for
the election application that stores candidates and votes in memory. After that,
you’ll set up a local development network and your development workspace to
begin building the blockchain back-end for the election website. The workshop
repository contains branches with starter code for every tutorial, so you can
compare your solution with the finished code at every step along the way.

- [Prepare your workspace](/build/guides/election-dapp-tutorial/prepare-your-workspace)
- [Start a local blockchain](/build/guides/election-dapp-tutorial/start-a-local-blockchain)
- [Add an administrator account](/build/guides/election-dapp-tutorial/add-admin-account)
- [Define a namespaces](/build/guides/election-dapp-tutorial/define-a-namespace)
- [Define keysets](/build/guides/election-dapp-tutorial/define-keysets)
- [Write a smart contract](/build/guides/election-dapp-tutorial/write-a-smart-contract)
- [Nominate candidates](/build/guides/election-dapp-tutorial/nominate-candidates)
- [Add voting management](/build/guides/election-dapp-tutorial/add-vote-management)
- [Add a gas station](/build/guides/election-dapp-tutorial/add-a-gas-station)

Stay tuned for future editions of this workshop and for more intermediate and
advanced tutorials covering additional topics, such as:

- Deploy to test network with the functional programming approach
- Develop a continuous integration pipeline

To suggest topics you’d like to see covered in future tutorials and workshops,
submit a
[documentation request](https://github.com/kadena-community/kadena.js/issues/new?assignees=&labels=documentation&projects=&template=003-improve_documentation.yml).
If you'd like to contribute content—either in the form of a new tutorial or to
fix issues—see our [contributor's guide](/contribute/docs).
