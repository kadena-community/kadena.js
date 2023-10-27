---
title: Election dApp tutorial
description: The Election dApp tutorial will teach you how to implement a voting website that registers votes on the Kadena blockchain.
menu: Election dApp tutorial
label: Introduction
order: 3
layout: full
tags: [pact, smart contract, typescript, tutorial]
---

# Election dApp Tutorial

Welcome to the Kadena Election dApp tutorial. In this tutorial you will create a website for
the election of the new president of the Kadena Universe. All members of the Kadena
community will be able to cast one vote on any of the candidates nominated by the election
officials. Because all votes, as well as the voting mechanism itself, are openly published
on the blockchain, the election process is fully transparent. Everyone can check if the
election has proceeded fairly and, for instance, no double votes were cast. Nevertheless, the
privacy of all voters is protected, because they are voting with an anonymous Kadena account.
Every vote is a transaction on the blockchain, which comes at the price of a gas fee to paid
to the miners. The election organization will utilize a gas station that pays the gas for
all voting transactions, so the election is accessible for all community members, for free.

## What you will learn

The concept of a gas station is a central topic of this tutorial, but definitely not the only
one. You will learn about creating and funding accounts. You will learn how to deal with
permissions by leveraging keysets and capabilities. You will learn how to interact with the
blockchain from your code. You will be reading data from the blockchain for free and send
transactions that cost gas. You will also learn how to deploy a smart contract and upgrade it,
i.e. deploy changes to your smart contract. You will learn how to do this on a Dockerized Devnet
running on your own computer. Before deploying anything you will learn
how to develop smart contracts using the test-driven methodology. You will dive into different
ways to sign transactions: with keypairs and Chainweaver. Along the way,
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

 * [Chapter 01: Getting started](/build/guides/election-dapp-tutorial/01-getting-started)
 * [Chapter 02: Running Devnet](/build/guides/election-dapp-tutorial/02-running-devnet)
 * [Chapter 03: Admin account](/build/guides/election-dapp-tutorial/03-admin-account)
 * [Chapter 04: Namespaces](/build/guides/election-dapp-tutorial/04-namespaces)
 * [Chapter 05: Keysets](/build/guides/election-dapp-tutorial/05-keysets)
 * [Chapter 06: Smart contract](/build/guides/election-dapp-tutorial/06-smart-contract)
 * [Chapter 07: Nominate candidates](/build/guides/election-dapp-tutorial/07-nominate-candidates)
 * [Chapter 08: Voting](/build/guides/election-dapp-tutorial/08-voting)
 * [Chapter 09: Gas station](/build/guides/election-dapp-tutorial/09-gas-station)

In the future, additional chapters may be added to this tutorial. Some ideas are already floating
around, but if you have any suggestions for topics you would like to see covered, please
get in touch.

 * Deploying to Testnet with the functional programming approach
 * A continuous integration pipeline for deploying your dApp
 * Other signing methods than keypair and Chainweaver

## Requirements for this tutorial

Before moving on to the first chapter of this tutorial, please make sure that you have the
required software installed on your computer. The tutorial assumes that you have installed
the software listed below.

 - [Docker](https://docs.docker.com/get-docker/)
 - [Git](https://git-scm.com/downloads)
 - [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
 - [Chainweaver](https://github.com/kadena-io/chainweaver/releases)
 - [Pact (optional)](https://github.com/kadena-io/pact#installing-pact)
 - [Pact LSP (optional)](https://github.com/kadena-io/pact-lsp/releases)

## Get started

Let's start creating a website for the election of the new president of the Kadena Universe.
Good luck and have fun with [Chapter 01: Getting started](/build/guides/election-dapp-tutorial/01-getting-started).
