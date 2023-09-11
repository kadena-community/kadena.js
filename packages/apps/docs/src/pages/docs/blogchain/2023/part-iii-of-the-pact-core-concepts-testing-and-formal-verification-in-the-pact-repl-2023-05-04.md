---
title:
  Pact Core Concepts Part III — Testing and Formal Verification in the Pact REPL
description:
  The Pact Core Concepts series is a companion guide to the Real World Pact
  repository, written by Thomas Honeyman, a senior engineer at Awake Security.
  The series teaches the essential concepts needed to write and test Pact
  programs on the scalable Chainweb blockchain. Part III of the series, Testing
  and Formal Verification in the Pact REPL, teaches you how to secure your smart
  contracts.
menu: Pact Core Concepts Part III
label: Pact Core Concepts Part III
publishDate: 2023-05-04
author: Kadena
authorId: kadena
layout: blog
---

# Pact Core Concepts Part III — Testing and Formal Verification in the Pact REPL

![](/assets/blog/1_ZsQEhEAHC5wr3oj_kODDng.webp)

The Pact Core Concepts series is a companion guide to the
[Real World Pact](https://github.com/thomashoneyman/real-world-pact) repository,
written by Thomas Honeyman, a senior engineer at Awake Security. The series
teaches the essential concepts needed to write and test Pact programs on the
scalable Chainweb blockchain. Part III of the series,
[\*Testing and Formal Verification in the Pact REPL](https://github.com/thomashoneyman/real-world-pact/blob/main/00-core-concepts/03-Testing-In-The-Pact-REPL.md),\*
teaches you how to secure your smart contracts.

Smart contracts pose a significant challenge in terms of security. The
unforgiving nature of the blockchain environment, where anyone can read and
execute smart contracts that handle sensitive data, has led to billions of
dollars in losses across the web3 ecosystem. Mistakes are easily made and
exploited, often resulting in substantial financial losses.

Pact, a programming language specifically designed for security, eliminates or
blunts many potential threats, such as re-entrancy attacks and infinite loops,
while offering unique capabilities not found in other languages. One such
feature is formal code verification, which is more reliable than unit tests.
However, even with tests and verification, it’s crucial to consider a security
audit to uncover subtle yet critical issues in contracts. Pact, while helpful,
isn’t immune to all exploits.

_Testing and Formal Verification in the Pact REPL_ guides you through combining
unit tests, type checking, and formal verification in Pact. Unit tests are
written in REPL (Read-Eval-Print Loop) files, while types and formal
verification are directly incorporated into Pact modules and executed in the
REPL. Pact offers numerous REPL-exclusive functions to aid developers in writing
tests, benchmarking code, estimating gas consumption, and simulating various
blockchain states.

A typical Pact smart contract developer will:

1.  Use type annotations to document their schemas and functions and rely on the
    Pact type-checker to ensure functions are only called on data of the correct
    type.

2.  Write unit tests in Pact REPL files to verify that code behaves as expected.

3.  Apply formal verification to confirm that code meets desired properties and
    specifications, reducing the risk of unnoticed issues and edge cases.

4.  Consider a security audit to identify subtle yet crucial issues that might
    have been missed during development.

By following these steps, developers can harness the power of the Pact
programming language and its REPL environment to create more secure smart
contracts.

We hoped you enjoy the Pact Core Concept Series as much as we did! For the full
series, please check out the corresponding links below:

1.  [Introduction to Blockchain Development with Kadena](https://github.com/thomashoneyman/real-world-pact/blob/main/00-core-concepts/01-Introduction.md)

2.  [Learn Pact in 20 Minutes](https://github.com/thomashoneyman/real-world-pact/blob/main/00-core-concepts/02-Pact-In-20-Minutes.md)

3.  [Testing and the Pact REPL](https://github.com/thomashoneyman/real-world-pact/blob/main/00-core-concepts/03-Testing-In-The-Pact-REPL.md)
