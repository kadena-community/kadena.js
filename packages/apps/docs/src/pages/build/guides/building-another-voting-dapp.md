---
title: Another voting dApp
description: Another voting dApp
menu: Build
label: Another voting dApp
order: 4
layout: full
tags: [pact, smart contract, typescript, tutorial]
---

# Building a voting dApp

## What you will learn

## What is a dApp?

## Blockchain makes voting fair and secure

## Requirements for this tutorial

 - Docker
 - Git
 - npm
 - Chainweaver
 - Pact (optional)

## Chapter 1: Introduction

### Clone the repository

The main branch contains the finished dApp

### Checkout branch 01-scaffolding

To follow allong with the tutorial. A branch for every chapter. Compare your
solution to the code in the branch of the next chapter

### Run the frontend

```bash
cd ./frontend
npm install
npm run start
```

Visit `http://localhost:3000` in your browser and you will see the working 
front-end of the voting application. It is not yet connected to the blockchain.
We will gradually build up to that in the course of this tutorial. All the data
that is presented is loaded from memory right now, to give you an idea of the
functionality of the dApp. It presents a list of candidate names and the number
of votes they have received. There is an option to set your account name. This
can be anything at this point of the tutorial. After you have set an account
name, you can cast a vote on any of the candidates. You can only cast one
vote per account. It is also possible to add a candidate or candidates in bulk.
This operation is not yet limited to certain accounts with a specific permission,
but we will get to that soon enough.

### Project structure

#### Pact folder

A root folder with contracts that we need for local Pact development. These contracts
are already deployed on devnet, testnet and mainnet. Pact and REPL files for this
project will go directly in the `./pact` folder

#### Front-end

A basic React app with components and a service repository pattern. In the
configuration file you can see that the front-end is configured to use
inmemory implementations of the repositories that handle data transactions
for the dApp. In this tutorial we will first create the implementation for
Devnet, a complete blockchain that you can run on your own computer using
Docker. Later on, we will go live with a deployment of your smart contracts
to Testnet. And also write the corresponding repository implementations.

#### Snippets

Pieces of JavaScript code that allow you to interact with the blockchain.
Creating and funding accounts, deploying and upgrading smart contracts,
and more.

## Chapter 2: Running the devnet

```
docker run -it -p 8080:8080 -v ./:/tmp/uploads kadena/devnet:latest
```

### Listing modules

You will see preloaded contracts among which the contracts in the `./pact/root`
folder. No voting related contracts yet.

### Configure Devnet in Chainweaver

Settings > Network.
Node: http://localhost:8080

### List modules

Same result as when running the snippet

## Chapter 2: Namespaces

REPL and devnet

## Chapter 3: Keysets

REPL and devnet

## Chapter 4: Admin account

In Chainweaver, create a key and add a k: account. See that it does not exist
yet. Run the transferCreate snippet. A special account called sender00 will
create the account on the blockchain and transfer funds to it

## Chapter 5: Deploying the keyset definition

Signed by the admin account.

## Chapter 6: Deploy the empty contract

Teach about governance capability and the relation to keysets. Show that the 
deployed contract can be discovered on the blockchain.
Create another account with funds and show that this account cannot upgrade 
the contract but the admin account can.

## Chapter 7: Adding and listing candidates

Create a pact and REPL file. Load the contract in REPL and write a failing test.
Adding candidates and listing them. Exercise with tables and schemas. Guard
adding capability so that only the admin account can add candidates and the
other account cannot.
Front-end repository devnet implementation of the adding and listing methods.

## Chapter 8: Gas station

### What is gas?

Price for a transaction, seen deducted during deploy. To make voting accessible
for everyone, it is nice to not require them to pay gas for being able to vote.

### What is a gas station

A gas station offers a mechanism for letting someone else, who filled up the
gas station, automatically pay someone else's gas. The government for example,
allowing everyone to cast a vote for free.

### Create gas station account in pact module

Watch it on chainweaver

### Implement gas station interface


### Add rules and guards


### Fund the gas station

Using sender00

## Chapter 9: Voting

Create a key and a k:account for a voting user. Run the create account snippet
to just create the account on chain but without funds.

## Chapter 10: Deploy to testnet

### Switch network in Chainweaver

### Create admin account

### Fund admin account with testnet faucet

### Run deploy-testnet snippet

### Tweak Devnet repository implementation to point to testnet

### Deploy the front-end online

Your complete dApp will be publically available online.

## Chapter 11: Other signing methods

### Keypair

### WalletConnect
