---
title: "Explore the blockchain"
description: "Add your name to the Kadena Memory Wall on the public blockchain, see the blockchain in action using a block explorer, and create a wallet on the test network to play a game."

menu: Build
label: "Explore the blockchain"
order: 1
layout: full
tags: [chainweb, chainweaver, tutorial, resources]
---

# Explore the blockchain

If you've never used an application that runs on a blockchain, you might wonder how the experience differs from using any other web-based or cloud-based application. 
After all, the backbone of any public blockchain is still the internet.
In many ways, the experience from a user perspective can be—or should be—completely transparent.
However, what makes a blockchain unique—keeping a permanent and tamper-proof record of every transaction—requires resources and resource constraints that other applications running on the internet don't typically need to address.

Because of these resource constraints, most applications that run on a blockchain require application users to pay some type of transaction fee to use their service.
And transaction fees have been one of the main obstacle to wide-spread adoption of blockchain technology, even in industries that could benefit greatly from the security and immutability a blockchain offers.

In this exploratory tutorial, you'll get to see the blockchain in action by accessing applications that run on the Kadena main and test networks.

You'll start by accessing a simple **smart contract** that runs on the Kadena main network.
From there, you'll submit a transaction that adds your name to the public blockchain, then see the results of your transaction in a **block explorer**.
After you complete those steps, you'll create a **wallet account** to hold the native Kadena token—**KDA**—and play a game on the Kadena **test network**.

Let's get started.

## Add your name to the Kadena blockchain

To add your name to the Kadena public network:

1. Open a browser on your local computer.
2. Go to [hello.chainweb.com](https://hello.chainweb.com) to open the Memory Wall smart contract.
3. Type your name, then click **Was Here**.
4. Wait for the transaction to be completed and added to a block.
   
   ![Wait for a successful transaction](/assets/docs/onboard/memory-wall-success.png)

5. Click **View transaction in Block Explorer**.
6. Verify your name was added on chain zero (O) and other details, including the transaction fee—called **Gas**—paid on your behalf and the **coin.TRANSFER** event.
   
   ![View the transaction result](/assets/docs/onboard/memory-wall-tx.png)

   This smart contract allowed you to complete a transaction on a public blockchain without having an account or any tokens to pay the transaction fee.
   Instead, this smart contract has a built-in autonomous account that can only be used to pay transaction fees on behalf of users and under specific conditions.
   In this example, the account—**hw-gas-payer**—pays the transaction fee for you to eliminate onboarding costs and enable you to interact with the application.

   This autonomous account—often referred to as a gas station—simplifies the user experience, but requires a little extra work by the application developer.
   You can learn more about the first gas station on the Kadena network in [The First Crypto Gas Station is Now on Kadena’s Blockchain](/blogchain/2020/the-first-crypto-gas-station-is-now-on-kadenas-blockchain-2020-08-06).
   
   You can see the smart contract code for this application in the [Memory Wall](https://github.com/kadena-io/developer-scripts/tree/master/pact/dapp-contracts/memory-wall) repository.

## Create an account wallet

You didn't need a wallet to add your name to the Kadena blockchain using the Memory Wall smart contract.
However, most applications and blockchain operations do require you to have an account—some type of digital wallet—to hold your digital assets, like KDA, the native token for the Kadena network.

There are a lot of options for creating a wallet.
The steps are similar for any wallet, but in this tutorial, you'll use Kadena Chainweaver to set up your account wallet.
You can use Chainweaver as a desktop application installed locally or as a web-based application you access in a browser. 
For this tutorial, you'll create your account wallet using the web-based application.

To create an account wallet:

1. Open Chainweaver from your browser using the URL https://chainweaver.kadena.network.

2. Review the [Terms of Service](https://kadena.io/chainweaver-tos/) and confirm that you agree to them, then click **Create a new wallet**.

3. Type and confirm the password you want to use for this account, then click **Continue**.
    
   Behind the scenes, Chainweaver generates a public and secret key for your account and a 12-word recovery phrase that is cryptographically secure, so only you can unlock your account.

4. Confirm that you understand the importance of the recovery phrase, then click **Continue**.

5. Click **Copy** to copy the 12-word recovery phrase to the clipboard so you can save it in a secure location, for example, as a note in a password vault.

   You can also reveal each word by moving the cursor over the text field in the browser.
   Write each word in the correct order and store the complete recovery phrase in a secure place.

6. Confirm that you have stored the recovery phrase, then click **Continue**.

7. Verify the 12-word recovery phrase by typing the correct words in the correct order, then click **Continue**.

8. Click **Done** to view your new wallet.
   
   At this point, your wallet is simply an online custodian for the public and secret key pair associated with your recovery phase.

1. Click **Add k: Account** to link your public key to an **account name** with the **k:** prefix.

## Fund the account wallet

After you generate the keys for an account, the account name acts as a placeholder waiting for you to complete the next step to identify the public key or account name that owns the wallet. 
Before you take this step, your wallet isn't associated with any particular **network** or any particular **chain**.
In fact, if you view your account in Chainweaver navigation panel, you'll see that the balance displays **Does not exist** for every chain in the selected network.

To fund the account wallet:

1. Click **Keys** in the Chainweaver navigation panel.
2. Click the **Copy to Clipboard** icon next to the public key for your wallet.
3. Open [Kadena Developer Tools](https://tools.kadena.io/) in your browser.
4. Click **Fund new account**.
5. Paste the public key you copied from Chainweaver in the **Public Key** field, then click the plus (+).
   
   The account name is automatically populated to use a default account name with the prefix **k:** followed by your public key.

6. Verify the chain identifier selected is Chain ID 1.

7. Click **Create and fund account**.
   
   You'll see a message that the transaction is being processed followed by a message that the transaction was submitted that includes a **Request Key** link.
   You can click this link to open the block explorer again to check on the status of your request.
   You should see the result **Write succeeded** and two **coin.TRANSFER** events in the block explorer.

   You'll also see a message that the transaction successfully completed in the Tools site.

8. Click the **Copy to Clipboard** icon next to the account name to copy the account name for the account you just funded.for your wallet.
9. In Chainweaver, click **Accounts** in the navigation panel, click **Watch Account**, paste the account name, then click **Add**.
   
   You should see that your account on the Kadena test network has 100 tokens one chain 1.
   If you don't see your new account with 100 tokens, click Refresh in Chainweaver to update the information displayed.

   You can see the smart contract code for this application in the [Faucet](https://github.com/kadena-io/developer-scripts/tree/master/pact/dapp-contracts/faucet) repository.

## Play and score points

Now that you have a wallet and some tokens on the Kadena test network, you can use those tokens to play an online game.
Each round you choose to play, you'll sign a transaction to see how many points you score.
Because you'll be signing transactions, you'll need Chainweaver open on your local computer.

To play the game:

1. Open and unlock Chainweaver.
2. Click **Accounts** in the Chainweaver navigation panel.
3. Click the **Copy to Clipboard** icon next to your account name to copy the account name you funded with 100 tokens.
4. Open [pactyparrots.testnet.chainweb.com](http://pactyparrots.testnet.chainweb.com/) in a browser on your computer.
1. Click **Game rules** to review the game rules.
2. Click **Choose Account**, paste the account name you copied from Chainweaver, then click **Let's Play**
3. Click **Start new round** to open a new transaction signing request in Chainweaver:
   
   In Chainweaver, you'll see that the request has three parts:
   
   - Configuration: Verify the network and chain identifier match the network and chain where your account has tokens—for example, the network is Testnet and the Chain ID is 1—then click **Next**.
   - Sign: Select your public key for each of the three **Grant Capabilities** fields, then click **Next**.
   - Preview: Scroll to see the Raw Response displays **Write succeeded**, then click **Submit**.

1. Watch the parrots dance and wait for your result.
2. Click **Spin again** or **Cash out** and sign the new transaction in Chainweaver.

   This application illustrates how you can integrate a signing API into an application workflow without embedding a web browser or storing private keys in a browser plug-in.
   If you're building an application that needs to send a signed transaction, you can simply make an AJAX request to the signing API on localhost port 9467. 
   After the application makes he request, the user's wallet handles the details of transaction signing.

   You can see the smart contract code for this application in the [Pacty Parrots](https://github.com/kadena-io/developer-scripts/tree/master/pact/dapp-contracts/pacty-parrot) repository.
   For more information about implementing the signing API in your application, see the [signing API](https://kadena-io.github.io/signing-api/) repository.

## What’s next?

As part of this onboarding experience, you learned how to:

- Interact with the Kadena main network using a gas station.
- Use the block explorer to view transaction results.
- Create a wallet using Chainweaver.
- Create and fund a new wallet on the Kadena test network.
- SIgn transactions using the signing API and a wallet.

You are now familiar with the most basic aspects of the user experience when interacting with applications running on the Kadena blockchain. 
If you want to build on Kadena, you can take the next step with the following resources:

- Follow the [Deploy your first contract - Quick start](/build/quickstart) to set up your development environment and deploy the `hello-world.pact` smart contract.
- Start with the [create-pact-app](https://github.com/kadena-io/create-pact-app) template to build an application with a React frontend.
- Learn [Pact](/build/pact), the Kadena smart contract programming language.
