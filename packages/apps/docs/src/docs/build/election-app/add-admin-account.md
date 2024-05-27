---
title: 'Add an administrator account'
description: 'Create an administrative account for the election application to control access to specific functions.'
menu: 'Workshop: Election application'
label: 'Add administrator account'
order: 3
layout: full
tags: [pact, smart contract, typescript, tutorial]
---

# Add an administrator account

At this point, the election application doesn't restrict who can nominate a candidate. In this tutorial, you'll create an administrative account to control the actions that can be taken in the election application.

Kadena accounts consist of four parts:

- An account name.
- An account balance.
- One or more public keys that can be used to sign transactions.
- A predicate that specifies how many keys are required to sign transactions.

For this tutorial, you'll create an administrative account with only one key and you'll use the default `keys-all` predicate. The `keys-all` predicate requires transactions to be signed by all keys in the account. Because you're creating this account with only one key, only one signature will be required to sign transactions. You can use any text string of three to 256 characters for the account name. However, the convention for accounts that only have one key is to use the prefix `k:` followed by public key of the account.

For a more general introduction to how public and private keys are used to sign transactions and in Kadena accounts, see [Beginner’s Guide to Kadena: Accounts + Keysets](https://medium.com/kadena-io/beginners-guide-to-kadena-accounts-keysets-fb7f32104291).

## Before you begin

Before you start this tutorial, verify the following basic requirements:

- You have an internet connection and a web browser installed on your local computer.
- You have a code editor, such as [Visual Studio Code](https://code.visualstudio.com/download), access to an interactive terminal shell, and are generally familiar with using command-line programs.
- You have cloned the [election-dapp](https://github.com/kadena-community/voting-dapp.git) repository as described in [Prepare your workspace](/build/election/prepare-your-workspace).
- You have the development network running in a Docker container as described in [Start a local blockchain](/build/election/start-a-local-blockchain).
- You have created a [Chainweaver account](/build/election/start-a-local-blockchain#create-a-chainweaver-account) and are [connected to the development network](/build/election/start-a-local-blockchain#connect-to-the-development-network) using your local host IP address and port number 8080.

## Generate the administrative key pair

There are many tools you can use to create keys, including the Chainweaver application you used in the previous tutorial. In fact, if you followed that tutorial, you already have a public and private key pair that you could use as the basis for your administrative account. However, for demonstration purposes in this tutorial, let's create a new key in Chainweaver and use the new key as the basis for your Kadena account.

To create a new key pair and account:

1. Verify the development network is currently running on your local computer.

2. Open Chainweaver.

3. Select **devnet** from the network list.

4. Click **Keys** in the Chainweaver navigation panel.

5. Click **Generate Key** to add a new public key to your list of public keys.

6. Click **Add k: Account** for the new public key to add a new account to the list of accounts you are watching in Chainweaver.

   If you expand the new account, you'll see that no balance exists for the account on any chain and there's no information about the owner or keyset for the account. For example:

   ![Initial state of a new account](/assets/docs/election-workshop/new-admin-account.png)

   In this initial state, the account name acts as a placeholder, but the account doesn't exist yet on the development network.

   If you change to the `./snippets` folder in the election project directory, you can also verify that your account doesn't exist using the Kadena client. For example, you can run the `coin-details` script for the administrative account you just added with a command similar to the following:

   ```bash
   npm run coin-details:devnet -- k:<your-public-key>
   ```

   Because your account doesn't exist yet on the development network, the script returns an error similar to the following:

   ```text
     type: 'TxFailure',
     message: 'with-read: row not found: k:5ec41b89d323398a609ffd54581f2bd6afc706858063e8f3e8bc76dc5c35e2c0',
   ```

## Transfer coins to create an account

An account must have funds before it can be used on any Kadena blockchain. To interact with the Kadena main public network (`mainnet`), you typically buy KDA as a digital asset through an exchange, and then transfer the KDA to the Kadena account you want to fund. For the Kadena test network (`testnet`), you can submit a request to [transfer 20 KDA](https://faucet.testnet.chainweb.com/) to a specified account for testing purposes.

To interact with the local development network (`devnet`), you can either:

- Create your own [faucet contract](https://github.com/thomashoneyman/real-world-pact/tree/main/01-faucet-contract).
- Transfer KDA from a test account with publicly published [private keys](https://github.com/kadena-io/chainweb-node/blob/master/pact/genesis/devnet/keys.yaml).

For this tutorial, you can fund the administrative account that governs the election application by transferring KDA from one of the test accounts.

To transfer coins to fund the administrative account:

1. Open the `election-dapp/snippets` folder in a terminal shell on your computer.

   As you saw in the previous tutorial, the development network includes several smart contracts by default. In this tutorial, you'll use the `transfer-create` function that's defined in the `coin` smart contract to transfer 20 KDA to the administrative account.

2. Open the `./transferCreate.ts` script in your code editor.

   This script uses the Kadena client to call the `transfer-create` function of the `coin` contract to create and fund your administrative account. After importing the dependencies and creating the client with the `devnet` configuration, the `main` function is called with information about the sender, the receiver, and the amount.

   - The sender—`sender00`—is one of the pre-installed development network test accounts that holds some KDA on all chains. The public and private key for this account are copied from GitHub.
   - You specify the receiver—your administrative account name—as an argument when running the script.
   - The amount to transfer to the receiver is hardcoded to 20.

   Inside the `main` function, the amount to transfer is converted to a `PactDecimal` with the format: `{ decimal: '20.0' }`.

   The script then generates the Pact code and creates the transaction for you, based on the typing information from the previous step and the arguments provided to the function.

   The third argument of `transfer-create` is a function that returns the **guard** for the account to be created. To define the guard for the account, the `.addData()` function uses the public key of the administrative account as the only key and `keys-all` as the predicate. This guard associates the public key of your administrative account with the private key you hold in Chainweaver to ensure that only you can control the account.

   The `.addSigner()` function specifies that the sender must sign the transaction to pay the transaction fee—commonly referred to as **gas**—and to make the transfer with the provided details. In the `.setMeta()` function, `sender00` is specified as the `senderAccount`. After setting the network id from the `devnet` configuration, the transaction is created. The transaction is then signed with the private key of the `sender00` account and the transaction is submitted.

3. Create and fund your administrative account using the `transfer-create` script by running a command similar to the following with your administrative account name:

   ```bash
   npm run transfer-create:devnet -- k:<your-public-key>
   ```

   After a few seconds, you should see a status message:

   ```bash
   { status: 'success', data: 'Write succeeded' }
   ```

4. Verify that your account was created using the Kadena client and the `coin-details` script for the administrative account with a command similar to the following:

   ```bash
   npm run coin-details:devnet -- k:<your-public-key>
   ```

   You should see information about the new account similar to the following:

   ```bash
   {
     guard: {
       pred: 'keys-all',
       keys: [
          '5ec41b89d323398a609ffd54581f2bd6afc706858063e8f3e8bc76dc5c35e2c0'
       ]

     },
     balance: 20,
     account: 'k:5ec41b89d323398a609ffd54581f2bd6afc706858063e8f3e8bc76dc5c35e2c0'
   }
   ```

5. Click **Accounts** in the Chainweaver navigation panel.

6. Expand your administrative account to verify that on chain 1 you are the owner, one keyset is defined, and the balance is 20 KDA.

   ![Your funded administrative account on the development network](/assets/docs/election-workshop/funded-account.png)

## Next steps

In this tutorial, you learned how to:

- Generate a new public and secret key for a Kadena account using Chainweaver.
- Transfer coins to create and fund a new account using the Kadena client.
- Verify account information using the Kadena client and in Chainweaver.

You'll use the KDA you transferred to the administrative account to pay transaction fees for defining keysets, deploying smart contract modules, and nominating candidates in later tutorials. Before we get there, the next tutorial demonstrates how to create a namespace for a new keyset and smart contracts.
