---
title: Election dApp tutorial
description: Election dApp tutorial
menu: Build
label: Election dApp tutorial
order: 4
layout: full
tags: [pact, smart contract, typescript, tutorial]
---

# Election dApp Tutorial

Welcome to the Kadena Election dApp tutorial. In this tutorial you will create a website for
the election of the new president of the Kadena Universe. All members of the Kadena
community will be able to cast one vote on any of the candidates nominated by the election
officials. Because all votes, as well as the voting mechanism itself, are openly published
on the blockchain, the election process is fully transparent. Everyone can check if the
election proceeded fairly and, for instance, no double votes were cast. Nevertheless, the
privacy of all voters is protected, because they are voting with an anonymous Kadena account.
Every vote is a transaction on the blockchain, which comes at the price of a gas fee to paid
to the miners. The election organization will utilize a gas station that pays the gas for
all voting transactions, so the election is accessible for all community members, for free.

In the video below, you can see the finished project in action.

*[insert video here]*

## What you will learn

The concept of a gas station is a central topic of this tutorial, but definitely not the only
one. You will learn about creating and funding accounts. You will learn how to deal with
permissions by leveraging keyset and capabilities. You will learn how to interact with the
blockchain from your code. You will be reading data from the blockchain for free and send
transactions that cost gas. You will also learn how to deploy a smart contract and upgrade it,
i.e. deploy changes to your smart contract. You will learn how to do this on a Dockerized Devnet
running on your own computer, and to Kadena's Testnet. Before deploying anything you will learn
how to develop smart contracts using the test-driven methodology. You will dive into the different
ways to sign transactions: with keypairs, Chainweaver and other wallet providers. Along the way,
you will learn about a wide range of tooling that is available for blockchain development in
the Kadena platform, like the Kadena JavaScript client library, Chainweaver, the Pact command
line executable and more.

## Tutorial structure

This tutorial consists of multiple chapters. In the first chapter you will start off with a
working front-end that stores candidates and votes in memory. The next chapters will guide
you through the process of building a blockchain back-end for the election website one
step at a time. The tutorial's git repository contains branches with starter code for every
chapter. When you are following along with the tutorial, you can compare your solution with
with the starter code of the next chapter. The branch name that corresponds to each chapter
will be provided at the top of the respective chapter page.

 * [Chapter 01: Getting started](/docs/build/guides/election-dapp-tutorial/01-getting-started)
 * [Chapter 02: Running Devnet](/docs/build/guides/election-dapp-tutorial/02-running-devnet)
 * [Chapter 03: Namespaces](/docs/build/guides/election-dapp-tutorial/03-namespaces)
 * [Chapter 04: Keysets](/docs/build/guides/election-dapp-tutorial/04-keysets)
 * [Chapter 05: Admin account](/docs/build/guides/election-dapp-tutorial/05-admin-account)
 * [Chapter 06: Deploy keyset](/docs/build/guides/election-dapp-tutorial/06-deploy-keyset)
 * [Chapter 07: Deploy contract](/docs/build/guides/election-dapp-tutorial/07-deploy-contract)
 * [Chapter 08: Nominate candidates](/docs/build/guides/election-dapp-tutorial/08-nominate-candidates)
 * [Chapter 09: Gas station](/docs/build/guides/election-dapp-tutorial/09-gas-station)
 * [Chapter 10: Voting](/docs/build/guides/election-dapp-tutorial/10-voting)
 * [Chapter 11: Deploy to Testnet](/docs/build/guides/election-dapp-tutorial/11-deploy-to-testnet)
 * [Chapter 12: Other signing methods](/docs/build/guides/election-dapp-tutorial/12-other-signing-methods)


## Requirements for this tutorial

Before moving on to the first chapter of this tutorial, please make sure that you have the
required software installed on your computer. The tutorial assumes that you have basic
working knowledge of the software listed below.

 - [Docker](https://docs.docker.com/get-docker/)
 - [Git](https://git-scm.com/downloads)
 - [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
 - [Chainweaver](https://github.com/kadena-io/chainweaver/releases)
 - [Pact (optional)](https://github.com/kadena-io/pact#installing-pact)
 - [Pact LSP (optional)](https://github.com/kadena-io/pact-lsp/releases)

## Get started

Let's start creating a website for the election of the new president of the Kadena Universe.
Good luck and have fun with [Chapter 01: Getting started](/docs/build/guides/election-dapp-tutorial/01-getting-started).
