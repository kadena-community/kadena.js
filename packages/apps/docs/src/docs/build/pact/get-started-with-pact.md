---
title: Get started with Pact
description: "Pact is a human-readable smart contract programming language, designed to enable correct, transactional execution on a high-performance blockchain. Start your builder's journey on Kadena by learning about the Pact smart contract programming language."
menu: Smart contracts
label: Get started with Pact
order: 2
layout: full
tags: ['pact', 'pact tutorial', 'pact beginner', 'pact introduction']
---

# Get started with Pact

Pact is an open-source programming language designed specifically for writing **smart contracts** and developing applications to run on a blockchain.

There are unique challenges involved in writing smart contracts and building solutions that can run safely and perform well in a resource-constrained environment like a blockchain. Pact was built with these challenges in mind to help developers create programs that overcome them.

Before you get to writing code in Pact, you should know a little about the languages that inspired the design choices used in Pact and about the key features that make Pact particularly well-suited for writing smart contracts.

## Key features of Pact

Pact reflects many of the same approaches to writing smart contracts that are used in other programming languages—such as Solidity or Rust—but with a goal of making contracts less error-prone and less vulnerable to exploits and attacks. You'll find Pact similar to general-purpose, Turing-complete languages in its syntax, function declarations, module definitions, and imperative style. However, Pact has several features that make it a safe and performant language for blockchain applications, including the following:

- Turing incomplete contracts
- Human readable code
- Upgradable contracts
- Formal verification
- Sequenced transactions using **pacts**

![1-pact-smart-contract](/assets/docs/1-pact-smart-contract.png)

### Turing incomplete contracts

Programming languages that are Turing complete can execute any possible set of instructions, and, for many languages, Turing completeness is extremely important. However, unrestrained computation can be costly in a resource-constrained environment like a blockchain. Programs that require significant computational overhead can even affect the ongoing progress of the blockchain by preventing new transactions from being executed. Because of these risks, Pact smart contracts are intentionally Turing _incomplete_.

Pact enforces deliberate constraints on its computational ability to support "just enough" transactional activity and ensure the security of its smart contracts. For example, Pact doesn't allow unbounded looping or recursion. If Pact detects recursion, it fails immediately. Looping is also only supported in special circumstances. These constraints reduce costs and improve network performance.

Because Pact is intentionally Turing incomplete, some of the most costly bugs discovered in other platforms aren't even possible with Pact.

For more information about Turing incompleteness, see [Turing Completeness and Smart Contract Security](https://medium.com/kadena-io/turing-completeness-and-smart-contract-security-67e4c41704c)

### Human readable on-chain

All Pact code gets stored in a **human-readable** form directly on the blockchain. Because the contract is a human-readable part of the public record, anyone can review the running code and be sure of exactly what it's doing.

This feature is important because smart contracts solve business problems that require both technical and non-technical expertise. Building the best smart contract solution requires everyone to understand and contribute to the development of the smart contract.

Pact is designed to be simple to read and write. This simplicity helps provide complete transparency for the logic within its smart contracts. This approach also encourages shorter programs that are easier to understand.

### Upgradable contracts

You can update Pact contracts after they are deployed, so you can revise and improve your smart contracts over time. For example, you can offer new features and fix bugs as you iterate throughout the development process.

Pact tooling also simplifies the process of testing and upgrading contracts, with compiler and runtime errors that offer detailed information about code execution and an interactive read-eval-print-loop (REPL) interpreter shell that enables you to define environmental settings and execute transactions in incremental steps.

### Formal verification

Formal verification involves proving that a system or program mathematically satisfies the specification defined for its correct behavior. Formal verification is most often used to protect mission-critical environments like nuclear power plants or air and space autopilot systems.

Pact supports formal verification using Z3, an open-source tool developed by Microsoft. With this tool, you can define specifications for correct behavior, then automatically check and mathematically verify that your code does not contain bugs in every smart contract you write with Pact.

For more information about formal verification, see [Pact Formal Verification: Making Blockchain Smart Contracts Safer](https://medium.com/kadena-io/pact-formal-verification-for-blockchain-smart-contracts-done-right-889058bd8c3f).

### Sequenced transactions using pacts

One of the key features of the Pact programming language is support for coroutines—called **pacts**—that can start and stop at critical points during the execution of a multi-step transaction. With pacts, you can define the steps to be executed by different entities as sequential operations on the blockchain.

For example, pacts are used to define multi-step operations like cross-chain transfers where a **burn** operation takes place on the first chain and a **mint** operation takes place on the second chain. For a non-fungible token marketplace, you might use a `sale` pact with two steps:

- The **offer** operation signed by the seller.
- The **buy** operation signed by the buyer.

The pact definition enables each participant to only run a subset of functions while preserving the integrity of the transaction as a while in the contract.

## Pact Smart contracts

Pact smart contracts consist of the following core components:

| Component | Description |
| --- | --- |
| **Module** | A module defines the logic of a smart contract. The module contains the functions, pact definitions, tables, and schemas required to describe the business logic for the contract. |
| **Keysets** | One or more keysets specify who has access to different parts of the smart contract and who can update the contract as the contract owner. |
| **Tables** | Tables store data generated by Pact modules. These tables have a “key-row” structure and support schemas and a versioned, columnar history that enables the contracts to be updated. |

Each of these components support a wide range of functionality. This ensures that you have the tools you need to create robust solutions for real-world problems.

## Next steps

Now that you've learned a little about the Pact smart contract programming language—including some its key features and the core components defined in a smart contract—you're ready to get started with a simple "Hello, World!" contract.

For the next steps, you'll:

- Set up a local development network.
- Explore the Chainweaver development environment.
- Run simple command in the interactive Pact REPL interpreter.
