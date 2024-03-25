---
title: "Workshop: NFT marketplace"
description: Learn how to create, mint, sell, and buy tokens using Marmalade marketplace smart contracts on the Kadena blockchain.
menu: "Workshop: NFT marketplace"
label: "Welcome"
order: 3
layout: full
tags: [pact, smart contract, typescript, tutorial]
---

# Welcome to the NFT marketplace workshop

The NFT marketplace workshop consists of several self-paced tutorials with
content and coding challenges to help you learn how to create, mint, sell, and buy tokens using Marmalade marketplace smart contracts on the Kadena blockchain.
The workshop assumes that you've already created the artwork or own the rights to the artwork, and that you'll play the role of both seller and buyer for demonstration purposes.

## What you’ll learn

The tutorials in the workshop will guide you to create a small collection of non-fungible—that is, a one-of-a-kind—tokens with examples of how to configure built-in concrete policies to manage how tokens are minted, burned, sold, and transferred.
The workshop also demonstrates how to configure policies and call contract functions to conduct a conventional auction as a token seller and to purchase a token as a buyer.
By completing the tutorials in this workshop, you’ll learn how to:

- Deploy Marmalade smart contracts on a local development network.
- Define a collection.
- Upload assets as a collection.
- Create and upload metadata for a collection.
- Create and mint the token collection using concrete policies.
- Offer a token from the collection for sale using a conventional auction contract.
- Bid and buy a token from the collection using a buyer account.
- Receive payment in your token owner account.

Some of the topics covered in this workshop are similar to topics introduced in
the [_Deploy your first contract_](/build/quickstart) and in [Create a token collection](/build/nft-marmalade/create-a-collection). 
For example, you’ll deploy contracts on a development network (devnet) running on your local computer in a Docker container and sign transactions using public keys and Chainweaver accounts. 
However, the tutorials in the workshop provide a more complete picture of how to configure policies, how to call the `offer` and `buy` functions, and how to work with a specific type of `sale` contract.

## What you'll need

To complete the tutorials in the workshop, you need to have some software
installed on the computer you are using for your development environment. 
Each tutorial includes a "Before you begin" summary of what you'll need for that
specific tutorial. 
As a preview before you start the workshop, you should check
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
- You have selected an off-chain permanent storage location for your assets, such as the InterPlanetary File System (IPFS).

## Workshop roadmap

This workshop consists of tutorials that you should complete in order.

- [Prepare your workspace](/build/nft-workshop/prepare-your-workspace)
- [Deploy contracts on a local blockchain](/build/nft-workshop/deploy-local-contracts)
- [Define a collection](/build/nft-workshop/define-collection)
- [Upload assets](/build/nft-workshop/upload-assets)
- [Create and upload metadata](/build/nft-workshop/upload-metadata)
- [Create and mint tokens](/build/nft-workshop/mint-tokens)
- [Configure an offer](/build/nft-workshop/configure-offer)
- [Bid and buy](/build/nft-workshop/bid-and-buy)
- [Receive funds](/build/nft-workshop/receive-funds)

Stay tuned for future editions of this workshop and for more intermediate and
advanced tutorials covering additional topics, such as:

- Deploy contract updates.
- Develop custom policies.
- Create custom sale contracts.

To suggest topics you’d like to see covered in future tutorials and workshops,
submit a
[documentation request](https://github.com/kadena-community/kadena.js/issues/new?assignees=&labels=documentation&projects=&template=003-improve_documentation.yml).
If you'd like to contribute content—either in the form of a new tutorial or to
fix issues—see our [contributor's guide](/participate/docs).
