---
title: Pact language reference
description:
  This document is a reference for the Pact smart contract language, designed
  for correct, transactional execution on a high-performance blockchain.
menu: "Language reference"
label: "Language reference"
order: 2
layout: full
tags: ['pact', 'language reference']
---

# Pact language reference

Pact is a smart contract programming language, specifically designed for correct, transactional execution on the [Kadena high-performance blockchain](http://kadena.io).

The language reference covers the following topics:
- [Concepts](/reference/pact/concepts)
- [Syntax and keywords](/reference/pact/syntax)
- [General purpose functions](/reference/pact/general-functions)
- [Database functions](/reference/pact/database-functions)
- [Time functions](/reference/pact/functions/time)
- [Operators](/reference/pact/functions/operators)
- [Keysets](/reference/pact//functions/keysets)
- [Capabilities](/reference/pact//functions/capabilities)
- [Simple payment verification (spv)](/reference/pact/functions//spv)
- [Commitments](/reference/pact/functions/commitments)
- [Guards](/reference/pact/functions/guards)
- [Zero knowledge (zk)](/reference/pact/functions/zk)
- [Repl-only functions](/reference/pact/functions/repl-only-functions)
- [Property checking](/reference/pact/property-checking)
- [Properties and invariants](/reference/pact/properties-and-invariants)
- [Pacts](/reference/pact/pacts)
- [Pact REPL](/reference/pact/pact-repl-cli)

For information about the design of the Pact programming language, see the [Pact white paper](/kadena) or the [pact home page](http://kadena.io/#pactModal).

## General purpose functions

You can use the following built-in functions to perform many common tasks, such as specifying the character set for a smart contract, concatenating a list of strings, or defining a unique namespace for your applications.
Click the name of a function for more information about the function syntax and code examples that illustrate how to use the function.

| Function | Description
| -------- | -----------
| [CHARSET_ASCII](/reference/pact-ref/general#charset_ascii) | Constant denoting the ASCII charset.
| [CHARSET_LATIN1](/reference/pact-ref/general#charset_latin1) | Constant denoting the Latin-1 charset ISO-8859-1.
| [at](/reference/pact-ref/general#at) | Index LIST at IDX, or get value with key IDX from OBJECT.

## Database functions

You can use built-in functions to perform many database-related tasks, such as creating new tables, reading data from an existing table, or updating table records.
Click the name of a function for more information about the function syntax and code examples that illustrate how to use the function.

| Function | Description
| -------- | -----------
| [create-table](/reference/pact-ref/database#create-table) | Constant denoting the ASCII charset.
| [describe-keyset](/reference/pact-ref/database#describe-keyset) | Constant denoting the Latin-1 charset ISO-8859-1.