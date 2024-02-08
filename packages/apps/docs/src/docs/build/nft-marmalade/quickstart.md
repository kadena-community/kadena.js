---
title: Get started with Marmalade
description: Learn how to mint a non-fungible token (NFT) using the Marmalade marketplace on the Kadena blockchain.
menu: Get started
label: Get started with Marmalade
order: 2
layout: full
tags: [NFT, marketplace, non-fungible tokens, minting, marmalade, v2]
---

# Get started with Marmalade

Marmalade is a unique marketplace tool that enables you to create—often referred to as minting—and distribute non-fungible tokens (NFTs).
Marmalade relies on the Kadena blockchain infrastructure to provide guaranteed proof of provenance committed as on-chain transactions with low gas fees and the ability to share ownership across platforms. 
Marmalade is designed to handle the security, scalability, and future-proofing of your NFT marketplace, so you can focus on your offering, audience, and revenue.

This tutorial demonstrates how you can create a non-fungible token using Marmalade and Chainweaver. 
Chainweaver is a graphical user interface that allows you to manage accounts, keys, and contracts when you want to interact with the Kadena blockchain.
If you haven't used Chainweaver before, you'll want to start by creating a new wallet.

## Before you begin

Before you start this tutorial, verify the following basic requirements:

- You have an internet connection and a web browser installed on your local computer.

- You have a code editor, access to an interactive terminal shell, and are generally familiar with using command-line programs.

- You have an account in the Chainweaver desktop or web application.

  If you followed the [Quick start](/build/quickstart), you might already have a Chainweaver account.
  If you don't have an account yet, follow the instructions in [Create an account wallet](/build/quickstart#create-an-account-wallet) to create one.
   
## Authenticate and locate Marmalade contracts

To authenticate and locate Marmalade contracts:

1. Open and unlock the Chainweaver desktop or web application.
2. Select **Testnet** as the network to connect to the Kadena test network.
3. Click **Contracts** in the Chainweaver navigation panel.
4. On the right side of Contracts, click **Module Explorer**.
5. Under **Deployed Contracts**, search for the `marmalade-v2.util` contract.
6. Select the `marmalade-v2.util-v1` contract, then click **View**.

## Create a new token

For this tutorial, you'll create a basic NFT token using the `mint-basic-NFT` function.
By default, the `mint-basic-NFT` function creates a non-fungible token without any
rules programmed.
To create this token, you need to provide some required information.

To create a new token:

1. Click the **mint-basic-NFT** function to display the required fields.
   
1. Specify the required parameters with the following information:

   - **uri**: Type the uniform resource identifier (URI) for the off-chain where you have stored the token metadata.
   - **guard**: Specify the account guard for the minted token.
   
   You can read the keyset information in the transaction data field by adding a `read-keyset` call.
   For example, if you have defined a keyset with the name my-keyset, type `(read-keyset "my-keyset")` for the guard.

   ![Mint with URI and Guard](/assets/marmalade/mint_1.png)

1. Click **Next**.
2. Select an account with funds on the Kadena test network as the **Transaction Sender**.
1. Click **Advanced**, type `my-keyset` as keyset name, then click **Create**.
2. Select the public key to use for the `my-keyset` guard, then click **Next**. 
   
   ![Add "my-keyset"](/assets/marmalade/mint_gas.png)

1. Select your public key under **Unrestricted Signing**, then click **Next**. 
   
   The public key you select will sign the transaction and pay the transaction fee.
   
   ![Unrestricted Signing](/assets/marmalade/mint_unrestricted_signing.png)

1. On the Preview tab, click **Submit** to submit the transaction.

2. Wait for the transaction to finish.
   
   After the transaction is complete, you've minted your first NFT on the Marmalade platform.
   View the transaction in the [block explorer](explorer.chainweb.com), and find your token information.