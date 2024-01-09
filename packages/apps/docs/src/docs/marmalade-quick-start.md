---
title: Get started with Marmalade
description: Learn how to mint a non-fungible token (NFT) using the Marmalade marketplace on the Kadena blockchain.
menu: Guides
label: Quick start
order: 2
layout: full
tags: [NFT, marketplace, non-fungible tokens, minting, marmalade, v2]
---

# Get started with Marmalade

Marmalade is a unique marketplace tool that enables you to create—often referred to as minting—and distribute non-fungible tokens (NFTs).
Marmalade relies on the Kadena blockchain infrastructure to provide guaranteed proof of provenance committed as an on-chain transactions with low gas fees and the ability to share ownership across platforms. 
Marmalade is designed to handle the security, scalability, and future-proofing of your NFT marketplace, so you can focus on your offering, audience, and revenue.

This tutorial demonstrates how you can create a non-fungible token using Marmalade and Chainweaver. 
Chainweaver is a graphical user interface that allows you to manage accounts, keys, and contracts when you want to interact with the Kadena blockchain.
If you haven't used Chainweaver before, you'll want to start by creating a new wallet.

## Before you begin

Before you start this tutorial, verify the following basic requirements:

* You have an internet connection and a web browser installed on your local computer.

* You have a code editor, access to an interactive terminal shell, and are generally familiar with using command-line programs.

* You have Docker installed and are generally familiar with using Docker commands for containerized applications.

    For information about downloading and installing Docker, see [Docker documentation](https://docs.docker.com/get-docker).

*   You have [Node.js](https://nodejs.dev/en/learn/how-to-install-nodejs/) installed on your local computer.
*   
Let's get started!

## Step 1: Authenticate and Locate Marmalade v2 in Chainweaver

First, authenticate yourself on Chainweaver and make your way to the Module
Explorer and search for the Marmalade V2 contracts.

Specifically, enter this string into the Module Explorer: `marmalade-v2.util-v1`

This leads you to the Marmalade V2 util contract, which is a contract that wraps
around marmalade functions to provide easy minting process for users.

Once located, select "View" to continue.

## Step 2: Enter token details

![Mint with URI and Guard](/assets/marmalade/mint_1.png)

We will start by adding the required data for token creation. Click on the
`mint-basic-NFT` function, and filling in the token components listed below.

1. **URI**: Enter the off-chain URI that stores the token metadata.
2. **guard**: This guard will be account guard of the minted token. We need to
   locate the keyset information in the transaction data field, by adding in
   `(read-keyset "my-keyset")`

**Note:** By default, `mint-basic-NFT` mints a non-fungible token without any
rules programmed.

## Step 3: Configure Gas Setting

![Add "my-keyset"](/assets/marmalade/mint_gas.png)

Now you're ready to mint the NFT, but before you submit, you need to pay gas for
the transaction.

Prepare a coin account, and add into gas configuration as `Transaction Sender`.

## Step 4: Add keyset information

![Add "my-keyset"](/assets/marmalade/mint_keyset.png)

After filling in token details, click on the 'configuration' tab to enter keyset
information. Open "Advanced" at the bottom and enter `my-keyset` as keyset name
and click `Create`.

Once this is created, you will see your keysets below it. Please tick the public
Key that matches the account we have been using for this entire process.

## Step 5: Sign Transaction

![Unrestricted Signing](/assets/marmalade/mint_unrestricted_signing.png)

For simplicity, click on unrestricted signing. Note that this requires the key
to also sign for the gas payment.

## Step 4: Submit to Network

![Screenshot Placeholder for Gas Settings](/assets/marmalade/mint_submit.png)

Finally, go to the Preview tab and submit your transaction.

Wait for the transaction to finish. The server result should be true.

You've minted your first NFT on marmalade! Investigate the transaction on the
[block explorer](explorer.chainweb.com), and find your token information.
