---
title: Get started with Pact
description: "Pact is a human-readable smart contract programming language, designed to enable correct, transactional execution on a high-performance blockchain. Start your builder's journey on Kadena by learning about the Pact smart contract programming language."
menu: Get started
label: Introduction
order: 2
layout: full
tags: ['pact', 'pact tutorial', 'pact beginner', 'pact introduction']
---

# Introduction

This part of the Kadena developer documentation is focused on writing **smart contracts** and developing applications to run on a blockchain.
To get started, it's important to know what smart contracts are and the kinds of challenges that you might face in writing them.

## Smart contracts

A smart contract is a program that can automatically execute agreements—in the form of transactions—on the blockchain without any external oversight.
The contract ensures that the specific conditions, defined in the code logic to describe the terms of the agreement, are met before executing the transaction programmatically.
Smart contracts are deployed and executed on blockchain networks because the blockchain provides a decentralized, immutable, and publicly accessible record of all transactions.
This transparency and traceability ensures that the programmatic execution of the contract can been considered trustworthy.

However, there are several unique challenges involved in writing smart contracts that can run safely and perform well in a resource-constrained environment like a blockchain.
For example, if the code in a smart contract isn't efficient, it can be costly to execute the contract functions.
Inefficient code can also delay transaction execution and block validation, affecting the throughput for the entire blockchain network.

If a smart contract performs unbounded operations, excessive looping, or recursion, the contract might strain or overload the computational capacity that the blockchain has access to.
In worst case scenarios, bugs in a smart contract can result in lost funds for participants or stall the progress of the blockchain.

With these challenges and risks in mind, you can see why it's important to avoid common pitfalls and write smart contracts that execute transactions efficiently and securely.

## Pact smart contracts

Pact is an open-source programming language designed specifically for writing **smart contracts** and developing applications to run on a blockchain.
Pact was built to help developers create programs that overcome the challenges associated with writing smart contracts.

Pact reflects many of the same approaches to writing smart contracts that are used in other programming languages—such as Solidity or Rust—but with a goal of making contracts less error-prone and less vulnerable to exploits and attacks. 
Pact is similar to many general purpose languages in its syntax, function declarations, module definitions, and imperative style. 
However, Pact has several features that make it a safe and performant language for blockchain applications, including the following:

- A familiar database model for manipulating state in tables.
- Contracts can be deployed with updated code, enabling you to iterate and upgrade contracts.
- Contracts aren't allowed to include unbound looping or recursion at the language level.
- Contract transactions can be executed as single-step transactions or as a sequence of steps executed in a specific order.

### Limiting computational overhead

Many programming languages allow programs to execute any possible set of instructions, making them Turing complete languages.
However, unrestrained computation can be costly in a resource-constrained environment like a blockchain. 
Programs that require significant computational overhead can even affect the ongoing progress of the blockchain by preventing new transactions from being executed. 
With Pact,smart contracts are intentionally restricted to limit the computational overhead they can consume.

Pact enforces deliberate constraints on computation to provide "just enough" transactional activity and ensure the security of its smart contracts. 
For example, Pact doesn't allow unbounded looping or recursion. 
If Pact detects recursion, it fails immediately. 
Looping is also only supported in special circumstances. 
These constraints reduce costs and improve network performance.

For more information about Turing incompleteness, see [Turing Completeness and Smart Contract Security](https://medium.com/kadena-io/turing-completeness-and-smart-contract-security-67e4c41704c)

### Human readable on-chain

All Pact code gets stored in a **human-readable** form directly on the blockchain. Because the contract is a human-readable part of the public record, anyone can review the running code and be sure of exactly what it's doing.

This feature is important because smart contracts solve business problems that require both technical and non-technical expertise. Building the best smart contract solution requires everyone to understand and contribute to the development of the smart contract.

Pact is designed to be simple to read and write. This simplicity helps provide complete transparency for the logic within its smart contracts. This approach also encourages shorter programs that are easier to understand.

### Upgradable contracts

You can update Pact contracts after they are deployed, so you can revise and improve your smart contracts over time. For example, you can offer new features and fix bugs as you iterate throughout the development process.

Pact tooling also simplifies the process of testing and upgrading contracts, with compiler and runtime errors that offer detailed information about code execution and an interactive read-eval-print-loop (REPL) interpreter shell that enables you to define environmental settings and execute transactions in incremental steps.

### Sequenced transactions using pacts

One of the key features of the Pact programming language is support for coroutines—called **pacts**—that can start and stop at critical points during the execution of a multi-step transaction. With pacts, you can define the steps to be executed by different entities as sequential operations on the blockchain.

For example, pacts are used to define multi-step operations like cross-chain transfers where a **burn** operation takes place on the first chain and a **mint** operation takes place on the second chain. For a non-fungible token marketplace, you might use a `sale` pact with two steps:

- The **offer** operation signed by the seller.
- The **buy** operation signed by the buyer.

The pact definition enables each participant to only run a subset of functions while preserving the integrity of the transaction as a while in the contract.

## Writing contracts in other languages 

## Navigating Pact documentation and resources

Who the documentation is for
How the documentation is organized
Documentation conventions
Additional resources to get started 

## Contributing to Pact documentation or code base
