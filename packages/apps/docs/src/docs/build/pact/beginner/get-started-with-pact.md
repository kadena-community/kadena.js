---
title: Get started with Pact
description: Start your builder's journey on Kadena by learning about the Pact smart contract programming language.
menu: Pact
label: Get started with Pact
order: 2
layout: full
tags: ['pact', 'pact tutorial', 'pact beginner', 'pact introduction']
---

# Welcome to Pact

Pact is an open-source programming language designed specifically for writing **smart contracts** and developing applications to run on a blockchain.

There are some unique challenges involved in writing smart contracts that are secure and in building solutions that can perform well in a resource constrained environment like a blockchain. 
Pact was built with these challenges in mind to help developers create programs that overcome them.

Before you get to writing code in Pact, you should know a little about what the languages that inspired the design choicess used in Pact and about its key features that make it particularly well-suited for writing smart contracts.

## Languages that inspired Pact

Pact is designed with safety in mind. 
Pact took inspiration from existing approaches to writing smart contracts using other languages such as Solidity or Rust, but with a goal of making contracts less error-prone and vulnerable to attack. 
Pact also took inspiration from stored procedure languages like SQL and LISP. 
In many ways, Pact resembles a general-purpose, Turing-complete language and should feel familiar with  LISP-like syntax, user functions, modules, and imperative style.

## Pact key features

Pact has many key features that make it a safe and high-performance language. 
Some of the most important of these features include the following:

- Turing incomplete
- Human readable
- Upgradable contracts
- Formal verification
- Type inference
- Total governance
- Relational database integration
- Sequenced transactions using **pacts**

![1-pact-smart-contract](/assets/docs/1-pact-smart-contract.png)

### Turing incomplete

Pact contracts are intentionally Turing *incomplete*.

A Turing complete language has the power to run any possible program. 
In some languages, Turing completeness is an extremely important feature. 
For smart contracts, it’s an incredibly dangerous feature. 

For that reason, Pact is designed to place deliberate constraints on its computational ability. 
These constraints support the Pact design goal to provide "just enough" power for transactional blockchain solutions and helps ensure the security of its smart contracts.

The first restriction in Pact is that there is no unbounded looping or recursion. 
Pact detects recursion and fails immediately. 
Looping is also only supported in special circumstances. 
The key benefits of this are to reduce cost and improve performance. 
This feature makes some of the most infamous and costly bugs discovered in other platforms not even possible with Pact. 

For more information on this topic, see [Turing Completeness and Smart Contract Security](/blogchain/2019/turing-completeness-and-smart-contract-security-2019-02-11)

### Human readable

Pact smart contracts are human readable.

All Pact code gets stored as written in a **human-readable** form on the ledger.
Pact smart contracts install directly onto the blockchain. This allows you to
review the running code as it was written and be sure of exactly what it's
doing.

This is important because smart contracts solve business problems that require
both technical and non-technical expertise. Building the best smart contract
solution requires everyone to understand and contribute to the development of
the smart contract.

For that reason, Pact was built to be simple to read and write. This simplicity
helps provide complete transparency for the logic within its smart contracts.
This approach also encourages shorter programs. The code executes directly on
the ledger where it can be read easily by anyone. As a result, Pact is easy to
understand.

For example, here’s a “Hello World” smart contract using Pact.

```pact title=" "

(module helloWorld 'admin-keyset
  (defun hello (name)
    (format "Hello {}!" [name]))
)
(hello "world")

```

Without having learned anything about the Pact language, you can already start
to see how it works. With these few simple lines of code, you see a fully
functioning Pact “Hello World” smart contract.

Once written, smart contracts are deployed to a blockchain. In Pact, the code on
the blockchain is the same as the code that was written. Maintaining this code
means that no matter when you see the code it will always be as it was written.
This allows you to understand the code so you can continue to moderate and
improve your application over time.

### Upgradable contracts

Pact contracts are upgradable.

Upgradable contracts allow you to revise and improve your smart contracts over
time. This allows you to offer new features and fix bugs as you continue
developing your smart contract. None of this is possible with other smart
contract languages, and it’s a powerful feature when building impactful
applications for your business.

Pact's tooling ecosystem further amplifies the simplicity of upgrading
contracts. Compiler and runtime errors offer detailed information, with stack
traces and function documentation to ensure you’re making the best version of
your smart contract.

Pact’s iterative development process is also supported by a feature-rich REPL
helping you to improve and deploy new smart contracts rapidly. It includes
features such as incremental transaction execution and environment and database
inspection.

### Formal verification

Pact comes equipped with a powerful validation tool suite in the form of [formal verification](/blogchain/2018/pact-formal-verification-for-blockchain-smart-contracts-done-right-2018-05-11).

Pact uses Z3, an open-source tool developed by Microsoft, to mathematically verify and test for bugs present in the code.

This means that Pact allows smart contract authors to express, automatically
check, and formally verify that their code does not contain any bugs. Formal
verification is the same system used to protect mission-critical environments
like nuclear power plants or air and space autopilot systems. You now have this
same high level of security in every smart contract you write with Pact.

Formal verification is a huge topic that’s been covered well in the Kadena blog.
For more information on this topic, see [Pact Formal Verification: Making Blockchain Smart Contracts Safer](/blogchain/2018/pact-formal-verification-for-blockchain-smart-contracts-done-right-2018-05-11).

### Type inference

Pact includes type inference.

This feature makes it possible for code to be strongly-typed without declaring type information. 
It also has the added benefit of limiting run-time type enforcement. 
Developers can use a typecheck to add “just enough types”.
Typecheck eliminates warnings and only enforces types at runtime where needed.

### Total governance

Similar to relational database management systems, Pact offers the benefit of total governance. 
This benefit allows changes to commit to the database only if the code runs successfully. 
Any errors roll back changes, abort execution, and avoid costly mistakes.

### Relational database management integration

Pact is also designed to allow direct integration with an industrial relational database management system. 
This design is helpful in cases that need efficient publication of historical data.

### Sequenced transactions using pacts

The Pact programming language comes from one of its key features, known as
Pacts. 
Pacts solve a significant blockchain problem in privacy-preserving blockchains. 
To maintain privacy on a blockchain, participants can only run a subset of smart contracts. 
In these cases, the databases of each of the participants become disjointed.

Pact solves this problem using coroutines. 
Coroutines are functions that can start and stop at critical points in a function’s execution. 
These coroutines are called pacts. 
They define the steps to be executed by different entities as sequential transactions on the blockchain.

### Pact Smart Contracts

Pact smart contracts contain three core elements: the code module, keysets, and
tables.

The table below briefly introduces each of these core elements.

|             |                                                                                                                                                    |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Module**  | A module defines the logic of a smart contract. It contains functions, pact definitions, tables, and schemas.                                      |
| **Keysets** | Includes relevant documentation links and allows you to load code into the REPL, refresh the REPL, or deploy smart contract.                       |
| **Tables**  | Tables store data generated by Pact modules. These tables have a “key-row” structure and support schemas as well as a versioned, columnar history. |

Each of these elements support a wide range of functionality. This ensures that
you have the tools you need to create robust solutions for real-world problems.

## Next steps

Join the [Discord Channel](https://discordapp.com/channels/502858632178958377/502858632178958380)
  for community discussion.

Subscribe to the [Kadena YouTube channel](https://www.youtube.com/channel/UCB6-MaxD2hlcGLL70ukHotA) to
access the latest Pact tutorials.
