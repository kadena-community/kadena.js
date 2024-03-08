---
title: Property and invariant functions
description:
  Pact comes equipped with the ability for smart contract authors to express and
  automatically check properties -- or, specifications -- of Pact programs.
menu: Property and Invariant Functions
label: Intro
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

- [Authorization]
- [Bitwise]
- [Database]
- [Function]
- [List]
- [Logical]
- [Numerical]
- [Object]
- [Other]
- [Quantification]
- [String]
- [Temporal]
- [Transactional]

## Authorization


### authorized-by

Use authorized-by to check whether the transaction is signed by an authorized keyset guard.

#### Basic syntax

```pact
(authorized-by keyset)
```

#### Parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| keyset | `string` | Specifies the keyset string.

#### Return type

Return a `bool` type that indicates whether the specified keyset guard is satisfied by the executing transaction.

#### Example

```pact
(authorized-by "bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e")
```

#### Support

Supported in properties only.

### row-enforced

```pact
(row-enforced t c r)
```

- takes `t`: _a_
- takes `c`: _b_
- takes `r`: `string`
- produces `bool`
- where _a_ is of type `table` or `string`
- where _b_ is of type `column` or `string`

Whether the keyset in the row is enforced by the function under analysis

Supported in properties only.

### is-principal

```pact
(is-principal s)
```

- takes `s`: `string`
- produces `bool`

Whether `s` conforms to the principal format without proving validity.

Supported in either invariants or properties.

### typeof-principal

```pact
(typeof-principal s)
```

- takes `s`: `string`
- produces `string`

Return the protocol type of the given `s` value. If input value is not a
principal type, then the empty string is returned.

Supported in either invariants or properties.
