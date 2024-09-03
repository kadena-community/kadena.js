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
- You have cloned the [voting-dapp](https://github.com/kadena-community/voting-dapp.git) repository to create your project directory as described in [Prepare your workspace](/build/election/prepare-your-workspace).
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

## Prepare to create an onchain account

An account must have funds before it can be used on any Kadena blockchain. 
To interact with the Kadena main public network (`mainnet`), you typically buy KDA as a digital asset through an exchange, and then transfer the KDA to the Kadena account you want to fund. 
For the Kadena test network (`testnet`), you can submit a request to transfer KDA to an account for testing purposes using the Kadena [Developer Tools](https://tools.kadena.io/).

### Prepare to fund an account

To interact with the local development network, you can:

- Create your own [faucet contract](https://github.com/thomashoneyman/real-world-pact/tree/main/01-faucet-contract) to fund a test account.
- Provide your account information to someone who can transfer KDA to you.
- Transfer KDA from a public test account with publicly visible [private keys](https://github.com/kadena-io/chainweb-node/blob/master/pact/genesis/devnet/keys.yaml).

For this tutorial, you can fund the administrative account that governs the election application by transferring KDA from one of the public test accounts.

### Prepare to work with the coin contract

As you saw in [Explore default contracts](/build/election/start-a-local-blockchain#explore-default-contractsh1478700565), the development network includes several default smart contracts, including the coin contract. 
In this tutorial, you'll use the `transfer-create` function that's defined in the `coin` smart contract to transfer 20 KDA from a public test account to your administrative account.

However, transferring coins using functions in the coin contract requires you to interact with **Pact types** that are defined in the contract.
Before you can transfer coins using the Kadena client scripts in the `snippets` folder, you need to generate the types required.

To generate the types required to work with the coin contract:

1. Open the `election-dapp/snippets` folder in a terminal shell on your computer.

1. Generate the types by running the following command:
   
   ```bash
   npm run generate-types:coin:devnet
   ```
   
   This script uses the pactjs-cli to generate types from the oin contract on the development network.
   You should see output similar to the following:

   ```bash
   > snippets@1.0.0 generate-types:coin:devnet
   > pactjs contract-generate --contract coin --api http://localhost:8080/chainweb/0.0/development/chain/1/pact
   
   Generating pact contracts from chainweb for coin
   fetching coin
   fetching fungible-v2
   fetching fungible-xchain-v1

      WARNING: No namespace found for module "coin". You can pass --namespace as a fallback.
      
      WARNING: No namespace found for module "fungible-v2". You can pass --namespace as a fallback.
      
      WARNING: No namespace found for module "fungible-xchain-v1". You can pass --namespace as a fallback.
      
   Creating directory /Users/pistolas/election-dapp/snippets/node_modules/.kadena/pactjs-generated
   Writing default package.json to /Users/pistolas/election-dapp/snippets/node_modules/.kadena/pactjs-generated/package.json
   
   Verifying tsconfig.json at `/Users/pistolas/election-dapp/snippets/tsconfig.json`
   ```

   Because you're generating types to create an account outside of the context of a particular namespace, you can ignore the `namespace` warnings.

### Prepare to run the transfer-create script

Before you transfer coins from a public test account, you should review the script that calls the `transfer-create` to learn more about how Kadena client libraries enable you to insteract with the Kadean blockchain.

To prepare to run the `transfer-create.ts` script:

1. Open the `election-dapp/snippets/transfer-create.ts` script in your code editor.

1. Review the initial client configuration.
   
   As you can see in the first five lines, the script imports functions from the Kadena client library and imports configuration information from the 
   `configuration.ts` file to create a client for interacting with the blockchain:
   
   ```typescript
   import { Pact, createClient, createSignWithKeypair, isSignedTransaction } from '@kadena/client';
   import { PactNumber } from '@kadena/pactjs';
   import { getApiHost, getChainId, getNetworkId } from './configuration';
   
   const client = createClient(getApiHost());
   ```
   
   You must specify the receiving account—your administrative account name—as an argument when running the script, so the script displays an error message if the argument isn't provided.

   ```typescript
   if (!process.argv[2]) {
     console.error('Please specify a Kadena account.');
   }
   ```

1. Review the sender account information. 
   
   As you can see in the next lines, the sender is `sender00`.
   This account is one of the public development network accounts that holds some KDA on all chains. 
   The public and private keys for this account are copied from GitHub.

   ```typescript
   const FUNDING_ACCOUNT = 'sender00';
   const FUNDING_ACCOUNT_PUBLIC_KEY = '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca';
   const FUNDING_ACCOUNT_PRIVATE_KEY = '251a920c403ae8c8f65f59142316af3c82b631fba46ddea92ee8c95035bd2898';
   
   const accountKey = (account: string): string => account.split(':')[1];
   ```

2. Review the `main` function.

   In the remainder of the script, the `main` function calls the `transfer-create` function of the `coin` contract with information about the sender, receiver, and the amount to create and fund your administrative account. 

   Inside the `main` function, the amount to transfer is converted to a `PactDecimal` with the format: `{ decimal: '20.0' }`.

   The script then generates the Pact code and creates the transaction for you, based on the typing information generated in [Prepare to work with the coin contract](#prepare-to-work-with-the-coin-contract) and the arguments provided to the function.

   The third argument of `transfer-create` is a function that returns the **guard** for the account to be created. 
   To define the guard for the account, the `.addData()` function uses the public key of the administrative account as the only key and `keys-all` as the predicate. 
   This guard associates the public key of your administrative account with the private key you hold in Chainweaver to ensure that only you can control the account.

   The `.addSigner()` function specifies that the sender must sign the transaction to pay the transaction fee—commonly referred to as **gas**—and to make the transfer with the provided details. 
   
   In the `.setMeta()` function, `sender00` is specified as the `senderAccount`. 
   After setting the networkId from the `devnet` configuration, the transaction is created. 
   The transaction is then signed with the private key of the `sender00` account and the transaction is submitted.

## Transfer coins to create an account

To transfer coins to fund the administrative account:

1. Verify the development network is currently running on your local computer.

1. Open and unlock the Chainweaver desktop or web application.

2. Click **Accounts** in the Chainweaver navigation pane, then click the Copy to clipboard icon to copy the account name for your account.

3. Open the `election-dapp/snippets` folder in a terminal shell on your computer.

4. Create and fund your administrative account using the `transfer-create` script by running a command similar to the following with the k: account name for your administrative account:

   ```bash
   npm run transfer-create:devnet -- k:<your-public-key>
   ```

   Replace `k:<your-public-key>` with the **account name** for your administrative account. 
   You can copy this account name from Chainweaver when viewing the account watch list.
   After a few seconds, you should see output similar to the following:

   ```bash
   > snippets@1.0.0 transfer-create:devnet
   > KADENA_NETWORK=devnet ts-node ./transfer-create.ts k:5ec41b89d...5c35e2c0
   
   { status: 'success', data: 'Write succeeded' }
   ```

1. Verify that your account was created using the Kadena client and the `coin-details` script for the administrative account with a command similar to the following:

   ```bash
   npm run coin-details:devnet -- k:5ec41b89d...5c35e2c0
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

2. Click **Accounts** in the Chainweaver navigation panel.

3. Expand your administrative account to verify that on chain 1 you are the owner, one keyset is defined, and the balance is 20 KDA.

   ![Your funded administrative account on the development network](/assets/docs/election-workshop/funded-account.png)

## Next steps

In this tutorial, you learned how to:

- Generate a new public and secret key for a Kadena account using Chainweaver.
- Transfer coins to create and fund a new account using the Kadena client.
- Verify account information using the Kadena client and in Chainweaver.

You'll use the KDA you transferred to the administrative account to pay transaction fees for defining keysets, deploying smart contract modules, and nominating candidates in later tutorials. Before we get there, the next tutorial demonstrates how to create a namespace for a new keyset and smart contracts.
