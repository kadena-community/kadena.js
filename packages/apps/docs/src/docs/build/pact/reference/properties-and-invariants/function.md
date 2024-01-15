---
title: Function Operators
description:
  Pact comes equipped with the ability for smart contract authors to express and
  automatically check properties -- or, specifications -- of Pact programs.
menu: Function Operators
label: Function Operators
order: 13
layout: full
tags: ['pact', 'language reference', 'function operators', 'pact operators']
---

# Function operators

## identity

```pact
(identity a)
```

- takes `a`: _a_
- produces _a_
- where _a_ is of type `table` or `string`

identity returns its argument unchanged

Supported in either invariants or properties.

## constantly

```pact
(constantly a)
```

- takes `a`: _a_
- takes `b`: _b_
- produces _a_

constantly returns its first argument, ignoring the second

Supported in either invariants or properties.

## compose

```pact
(compose f g)
```

- takes `f`: _a_ -> _b_
- takes `g`: _b_ -> _c_
- produces _c_

compose two functions

Supported in either invariants or properties.
