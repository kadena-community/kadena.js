---
title: String Operators
description:
  Pact comes equipped with the ability for smart contract authors to express and
  automatically check properties -- or, specifications -- of Pact programs.
menu: String Operators
label: String Operators
order: 7
layout: full
tags: ['pact', 'language reference', 'string operators', 'pact operators']
---

# String operators

## length

```pact
(length s)
```

- takes `s`: `string`
- produces `integer`

String length

Supported in either invariants or properties.

## \+

```pact
(+ s t)
```

- takes `s`: `string`
- takes `t`: `string`
- produces `string`

```pact
(+ s t)
```

- takes `s`: [_a_]
- takes `t`: [_a_]
- produces [_a_]

String / list concatenation

Supported in either invariants or properties.

## str-to-int

```pact
(str-to-int s)
```

- takes `s`: `string`
- produces `integer`

```pact
(str-to-int b s)
```

- takes `b`: `integer`
- takes `s`: `string`
- produces `integer`

String to integer conversion

Supported in either invariants or properties.

## take

```pact
(take n s)
```

- takes `n`: `integer`
- takes `s`: `string`
- produces `string`

take the first `n` values from `xs` (taken from the end if `n` is negative)

Supported in either invariants or properties.

## drop

```pact
(drop n s)
```

- takes `n`: `integer`
- takes `s`: `string`
- produces `string`

drop the first `n` values from `xs` (dropped from the end if `n` is negative)

Supported in either invariants or properties.

## hash

```pact
(hash s)
```

- takes `s`: `string`
- produces `string`

BLAKE2b 256-bit hash of string values

Supported in properties only.

## hash

```pact
(hash s)
```

- takes `s`: _a_
- produces `string`
- where _a_ is of type `integer` or `decimal`

BLAKE2b 256-bit hash of numerical values

Supported in properties only.
