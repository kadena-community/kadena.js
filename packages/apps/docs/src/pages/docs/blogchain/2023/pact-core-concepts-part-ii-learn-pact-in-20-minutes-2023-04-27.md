---
title: Pact Core Concepts Part II— Learn Pact in 20 Minutes
description:
  The Pact Core Concepts series is a companion guide to the Real World Pact
  repository, written by Thomas Honeyman, senior engineer at Awake Security. The
  series teaches the essential concepts needed to write and test Pact programs
  on the scalable Chainweb blockchain. Part II of the series, Learn Pact in 20
  Minutes, is a crash course in the Pact programming language.
menu: Pact Core Concepts Part II
label: Pact Core Concepts Part II
publishDate: 2023-04-27
author: Kadena
layout: blog
---

# Pact Core Concepts Part II— Learn Pact in 20 Minutes

![](/assets/blog/1_IOeDK7eWYyl_w4yFdEF5vA.webp)

The Pact Core Concepts series is a companion guide to the
[Real World Pact](https://github.com/thomashoneyman/real-world-pact) repository,
written by Thomas Honeyman, senior engineer at Awake Security. The series
teaches the essential concepts needed to write and test Pact programs on the
scalable Chainweb blockchain. Part II of the series,
[Learn Pact in 20 Minutes](https://github.com/thomashoneyman/real-world-pact/blob/main/00-core-concepts/02-Pact-In-20-Minutes.md),
is a crash course in the Pact programming language.

To become proficient in a new language you need to read a lot of it — but you
need to know the language to understand what you’re reading! Learn Pact in 20
Minutes introduces you to Pact via dozens of snippets of codes that you are
likely to encounter in the real world. These code snippets cover most of the
Pact features you will use in your day-to-day smart contract development, and
you can run each snippet yourself in a Pact REPL to follow along.

The Pact programming language is specifically designed for smart contract
development. That design means that powerful features like fine-grained access
control, sophisticated multi-signature authorization, on-chain data storage,
cross-chain state transfers, and formal code verification are a natural part of
Pact programming. Other design decisions — like non-Turing-completeness, which
disallows loops and recursion, or fixed-precision decimals, which don’t overflow
when doing math — help eliminate
[entire classes](https://twitter.com/SirLensALot/status/1445886740044996608) of
bugs present in other smart contract languages.

This makes Pact an ideal language for smart contract development. It also means
that Pact will look unfamiliar to developers who use languages like JavaScript,
Python, Solidity, and others. Learn Pact in 20 Minutes helps bridge the
familiarity gap by showing you plenty of snippets of real-world Pact code you’re
likely to encounter when you read the source code of any major Pact project.

The article covers, among other things:

- The basic types available in Pact, such as strings, decimals, and keysets

- How to annotate values with types — and create your own types

- How to define functions, tables, and capabilities

- How to format strings

- The difference between “top-level” code and “module-level” code

- How to read data from a transaction’s JSON payload

- The most common utility functions you’ll use in code, like map, filter, and
  fold

- How to work with databases, from creating tables to reading and writing data

- The most common ways to control access to sensitive data How to cause a
  transaction to fail and return an error message to the user

Once you have completed
[Learn Pact in 20 Minutes](https://github.com/thomashoneyman/real-world-pact/blob/main/00-core-concepts/02-Pact-In-20-Minutes.md),
you will feel competent reading snippets of Pact code you encounter — whether
you’re evaluating the smart contracts of a project you use, or reading the
source code of a contract you plan to depend on, or writing smart contracts of
your own. We hope you enjoyed this article!
