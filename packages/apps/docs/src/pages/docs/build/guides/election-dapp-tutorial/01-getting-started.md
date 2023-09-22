---
title: "01: Getting started"
description: "Election dApp tutorial chapter 01: Getting started"
layout: full
tags: [pact, smart contract, typescript, tutorial]
---

# Chapter 01: Getting started

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
