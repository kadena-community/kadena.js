---
title: 5 Minute Quickstart
description: Learn Kadena’s core concepts & tools for development in 5 minutes
menu: Quickstart
label: 5 Minute Quickstart
order: 1
layout: full
tags: [devnet, chainweaver, tutorial, docker, transactions]
---

# Getting Started with Kadena

Welcome to the world of Kadena, a powerful blockchain platform that combines
scalability with simplicity. In this guide, we'll walk you through the essential
steps to kickstart your journey with Kadena. Whether you're a seasoned
blockchain developer or a newcomer to the space, you'll find the process
intuitive and efficient.

## Start fat-container `kadena/devnet`

1. Create docker volume

   ```shell
   docker volume create kadena_devnet
   ```

2. start kadena-devnet fat-container

   ```shell
   docker run -it -p 8080:8080 -v kadena_devnet:/data --name devnet kadena/devnet
   ```

## Monitor the blockchain

In the fat-container we expose an explorer that connects to the devnet

1. Go to http://localhost:8080/explorer/

Here you can see the blocks that are mined, and the transactions that are
executed

In Kadena a block is mined every 30 seconds. However, to optimize development
workflow, the devnet mines a block in 5 seconds.

## Install Chainweaver

1. Download and install Chainweaver:
   https://github.com/kadena-io/chainweaver/releases
2. Launch Chainweaver and create your mnemonic key

## Add devnet to Chainweaver

1. Click "Settings" tab in the bottom left
2. Select "Network"
3. Fill in the network name: "Devnet"
4. Open the network you created "> Devnet"
5. Add a node: "127.0.0.1:8080", the red dot on the right, should become green
   now.

## Create keys to sign transactions

1. Go to "Keys" on the left and click "+ Generate" on the top-right. This is
   your first key-pair.
2. To show the balance of this account, click "Add k: Account".
3. Go back to the "Accounts" tab on the left. Notice that the "Balance (KDA)"
   says "Does not exist".

In Kadena, keys and accounts do not represent the same thing. An account needs
to be created before it can be used.

## Fund your account

> Note: we use [NodeJS](https://nodejs.dev/en/learn/how-to-install-nodejs/)
> (personal recommendation to
> [install with `n`](https://github.com/tj/n#readme)) and run `npm install` in
> the root of this project

Before we can create an account, you need to have KDA to pay for the gas-fees
(transaction fee).

We can gain KDA by funding it from a pre-installed "devnet" account called
"sender00".

In this process, we’ll submit a transaction that creates an account based on the
"keys" and "predicate" that you supply. The combination of `keys` + `predicate`
makes a `keyset`, which is used to `guard` your account.

1. Send money from "sender00" to your account. Copy your account name from the
   "Accounts" tab and fill it in the command

   ```shell
   npm run start -- fund --keys "<your-key>" --predicate "keys-all"
   ```

1. Open the Block Explorer http://localhost:8080/explorer/ to monitor the
   transaction
2. In Chainweaver, click "Refresh" to update the account balances

## Deploy a contract

TBD
