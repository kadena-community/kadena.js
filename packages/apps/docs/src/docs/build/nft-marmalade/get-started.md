---
title: Get started with Marmalade
description: Learn how to mint a non-fungible token (NFT) using the Marmalade token standard on the Kadena blockchain.
menu: Get started
label: Get started with Marmalade
order: 2
layout: full
tags: [NFT, marketplace, non-fungible tokens, minting, marmalade, v2]
---

# Get started with Marmalade

As you learned in [What is Marmalade?](/build/nft-marmalade),  Marmalade is the name of the Kadena **token standard**.
The token standard defines the interfaces for minting digital items using a set of smart contracts and token policies.
The Marmalade token standard enables you to define, mint, and secure tokens that are fully fungible coins, partially fungible in a limited edition, or completely non-fungible unique items.
When you mint tokens using these interfaces, the Kadena blockchain infrastructure provides proof of authenticity and ownership by enabling you to commit on-chain transactions with low transaction fees.
With Marmalade and the security and scalability of the Kadena network to handle the mechanics of the marketplace, you can focus on creating digital offerings, finding an audience, and generating revenue.

This tutorial demonstrates how you can create a non-fungible token using Marmalade and Chainweaver. 
Chainweaver is a graphical user interface that allows you to manage accounts, keys, and contracts when you want to interact with the Kadena blockchain.
If you haven't used Chainweaver before, you'll want to start by creating a new wallet.

## Before you begin

Before you start this tutorial, verify the following basic requirements:

- You have an internet connection and a web browser installed on your local computer.

- You have an account in the Chainweaver desktop or web application.

  If you followed the [Quick start](/build/quickstart), you might already have a Chainweaver account.
  If you don't have an account yet, follow the instructions in [Create an account wallet](/build/quickstart#create-an-account-wallet) to create one.

- You should have funds in an account on the Kadena test network.
  You can fund a new or existing account on the test network by accessing [Developer Tools](https://tools.kadena.io) in a web browser.

## Create a digital item

To get started, you must have a digital item of some type that's stored in a location that can be accessed using a uniform resource identifier (URI).
You must also have a metadata file for the digital item with properties that describe the item
using the JSON schema for token metadata.

In this tutorial, the digital item is a portable network graphic (.PNG) image that's stored in a local directory for testing purposes.
The metadata file for this example only contains the required name and description properties and a path to the image.

For example:

```json
{
   "name": "My test token",
   "description": "This is my local test token",
   "image": "file:///Users/pistolas/scorebook.png"
}
```
For this tutorial, the metadata for the digital item is also a local file that's stored in the same directory, making  `file:///Users/pistolas/scorebook-nft.json` the URI for the metadata that describes the digital item.

## Authenticate and locate Marmalade contracts

To authenticate and locate Marmalade contracts:

1. Open and unlock the Chainweaver desktop or web application.
2. Select **Testnet** as the network to connect to the Kadena test network.
3. Click **Contracts** in the Chainweaver navigation panel.
4. On the right side of Contracts, click **Module Explorer**.
5. Under **Deployed Contracts**, search for the `marmalade-v2.util` contract.
6. Select the `marmalade-v2.util-v1` contract, then click **View**.
   
   ![View the utilities contract](/assets/marmalade/mint-util.png)

   After you click **View**, you'll see a list of modules, functions, and capabilities that are used in the contract.

## Prepare to mint

For this tutorial, you'll create and mint a single NFT token using the `mint-basic-NFT` helper function defined in the `marmalade-v2.util-v1` contract.
This function simplifies the minting process by wrapping functions from the  `marmalade-v2.ledger` contract and performing steps for you.
The `mint-basic-NFT` function creates and mints the most basic type of non-fungible token with no configuration or token policies applied.

For this function, you only need to provide the path to the uniform resource identifier (URI) that describes the token and an account guard for paying the transaction fee.
However, the function requires you to grant and install the CREATE-TOKEN and MINT capabilities to a specific account instead of allowing you to use unrestricted signing. 
You can use the `mint-basic-NFT` helper function to prepare the capability required then apply the code to install the capabilities to create and mint the token.

To prepare to mint:

1. Under Functions, select **mint-basic-NFT**, then click **Call**. 

2. Set the required parameters by specifying the following information:

   **uri**: Type the uniform resource identifier (URI) for the off-chain location where you have stored the token metadata using the JSON schema.
   For this tutorial, the URI is `file:///Users/pistolas/scorebook-nft.json` for the metadata.

   **guard**: Specify the account guard to use for this transaction.
   For this tutorial, you can configure the keyset information as part of the transaction data, so you can use a `read-keyset` call to specify the account guard.
   
   For example, you can configure a guard with the name **my-keyset** that uses your public key to sign transactions and specify `(read-keyset "my-keyset")` for the **guard** parameter.

   ![Mint a basic token with the URI and guard](/assets/marmalade/mint_parameters.png)

3. Click **Next**.
4. Review the General configuration settings to verify the destination network is Testnet.
5. Select an account with funds on the Kadena test network as the **Transaction Sender**.
   
   ![Verify the destination network and select the Transaction Sender](/assets/marmalade/mint_general-configuration.png)

6. Click **Advanced**, type `my-keyset` as the keyset name, then click **Create**.
7. Select the public key to use for the `my-keyset` guard, then click **Next**. 
   
   ![Create the keyset and select a public key](/assets/marmalade/mint_advanced-keyset.png)

8. Select your public key under **Unrestricted Signing**, then click **Next**. 

9. Scroll to the Raw Response is view the error message, then copy the code to install the MINT capability.
   For example, you should see the MINT capability with parameters similar to the following, specifying the token identifier, your account name, and the token amount of 1.0:

   ```text
   (marmalade-v2.ledger.MINT "t:wzT9Fro45Np_0QMmLgO-1gp09Ofe5MFtVWaiyFe_wUc" "k:bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e" 1.0)
   ```

   After you copy this line of code, you can continue to the next step.

## Mint your first token

To mint a basic token with no policies:

1. On the Preview tab, click **Back** to return to the Sign tab. 

1. On the Sign tab, click the **Grant Capabilities** plus (+) to add the CREATE-TOKEN capability to the transaction and specify the **token identifier** returned from the error message and a creation guard **predicate** and **key** as arguments.
   
   In this example, the capability and arguments look lke this:

   ```text
   (marmalade-v2.ledger.CREATE-TOKEN "t:wzT9Fro45Np_0QMmLgO-1gp09Ofe5MFtVWaiyFe_wUc" {"pred":"keys-all","keys":["bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e"]})
   ```

2. Click the **Grant Capabilities** plus (+) to add the MINT capability to the transaction and specify the **token identifier**, **minting account**, and **amount** as arguments.   
   
      In this example, the capability and arguments look lke this:

   ```text
   (marmalade-v2.ledger.MINT "t:wzT9Fro45Np_0QMmLgO-1gp09Ofe5MFtVWaiyFe_wUc" "k:bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e" 1.0)
   ```

3. Select the Signing Key to sign for the **coin.GAS** capability, click **Apply to all** to use the key for the additional capabilities, then click **Next**.

2. Review the information on the Preview tab to verify the Raw Response is **true**, then click **Submit** to submit the transaction.
    
   ![Verify the raw response](/assets/marmalade/mint_preview-nft.png)

   If the raw response displays an error, click **Back** to fix the issue.
   For example, if the gas limit is set too low for a successful transaction, you might see a **Gas limit (1000) exceeded** error.
   Click **Back** to return to the configuration settings and adjust the gas limit accordingly.

   If there are no errors, you should see that your transaction has been submitted.
   For example:

   ![Transaction submitted to the blockchain](/assets/marmalade/mint_tx-submit.png)

## Review your mint transaction

As you wait for the transaction to finish, you can copy the request key displayed in Chainweaver so you can view details about your transaction in the Kadena block explorer.

To review your transaction results:

1. Copy the **Request Key** displayed in Chainweaver, then click **Done**.
2. Open the [Kadena Testnet block explorer](https://explorer.chainweb.com/testnet).
3. Select **Request Key**, then paste the key you copied from Chainweaver into the Search field.
4. Review the transaction results and the events recorded for the mint transaction.
   
   For example, you should see that the transaction completed successfully:
   
   ![Mint transaction results](/assets/marmalade/tx-basic-nft-result.png)
   
   You should also see a set of events similar to the following:

   ![Events related to minting a non-fungible token](/assets/marmalade/nft-basic-events.png)
   
   If your transaction results include events similar to these events, you know you have successfully minted your first NFT using the Marmalade standard on the Kadena test network.
   
## Next steps

In this tutorial, you learned the most basic steps for creating and minting a token using the interfaces defined in the Marmalade token standard and a helper function from the `marmalade-v2.util-v1` contract.
However, both the digital item and its metadata are local files in this example and only accessible through the local file system, which isn't a realistic scenario for listing items for sale in a digital marketplace.
In addition, the `mint-basic-NFT` function doesn't provide any policy configuration to prevent unauthorized minting and burning of tokens.

The `marmalade-v2.util-v1` contract provides two additional helper functions to simplify minting tokens with policies to prevent unauthorized minting and burning of tokens.

- The `mint-NFT` function enables you to mint a single non-fungible token with policies such as the `guard-policy` to authorize specific accounts to perform specific token-related operations.
- The `create-token-with-mint-guard` function enables you to create a token that can be minted more than once by a registered MINT-GUARD account.

The next steps to take—and whether you should use the helper functions or the underlying functions defined in the `marmalade-v2.ledger` contract—depend on what you are trying to accomplish and where you want to store your digital items and metadata.

To learn more about working with Marmalade smart contracts and token policies, see the following topics:

- [Describe tokens in metadata](/build/nft-marmalade/metadata)
- [Store digital assets](/build/nft-marmalade/storage)
- [Create a non-fungible token](/build/nft-marmalade/create-nft)
- [Create a token collection](/build/nft-marmalade/create-a-collection)
<!--
- [Create a limited edition](/build/nft-marmalade/limited-edition)
-->
