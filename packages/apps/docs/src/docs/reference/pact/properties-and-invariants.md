---
title: Properties and invariants
description:
  Pact comes equipped with the ability for smart contract authors to express and
  automatically check properties—or, specifications—of Pact programs.
menu: Property validation
label: Properties and invariants
order: 8
layout: full
tags:
  [
    'pact',
    'language reference',
    'property and invariant functions',
    'pact functions',
  ]
---

# Property and invariant functions

This part of the documentation describes functions that are available in properties and invariants, though not necessarily in executable Pact code. 
All of these functions are available in properties, but only a subset are available in invariants. 
As a general rule:

- Invariants describe the shape of data.
- Properties describe the shape of data, function inputs and outputs, and database interactions. 

The documentation for each function also indicates whether the function available only as a property or as a property and an invariant.

- [Authorization](/reference/property-checking/authorization)
- [Bitwise](/reference/property-checking/bitwise)
- [Database](/reference/property-checking/database)
- [Function](/reference/property-checking/function)
- [List](/reference/property-checking/list)
- [Logical](/reference/property-checking/logical)
- [Numerical](/reference/property-checking/numerical)
- [Object](/reference/property-checking/object)
- [Quantification](/reference/property-checking/quantification)
- [String](/reference/property-checking/string)
- [Temporal](/reference/property-checking/temporal)
- [Transactional](/reference/property-checking/transactional)
- [Unclassified](/reference/property-checking/other)
