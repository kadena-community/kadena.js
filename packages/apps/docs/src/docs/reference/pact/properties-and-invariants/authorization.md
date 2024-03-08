---
title: Authorization Operators
description:
  Pact comes equipped with the ability for smart contract authors to express and
  automatically check properties -- or, specifications -- of Pact programs.
menu: Authorization Operators
label: Authorization Operators
order: 12
layout: full
tags:
  [
    'pact',
    'language reference',
    'authorization operators',
    'pact authorization',
  ]
---

# Authorization operators

## authorized-by

```pact
(authorized-by k)
```

- takes `k`: `string`
- produces `bool`

Whether the named keyset/guard is satisfied by the executing transaction

Supported in properties only.

## row-enforced

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

## is-principal

```pact
(is-principal s)
```

- takes `s`: `string`
- produces `bool`

Whether `s` conforms to the principal format without proving validity.

Supported in either invariants or properties.

## typeof-principal

```pact
(typeof-principal s)
```

- takes `s`: `string`
- produces `string`

Return the protocol type of the given `s` value. If input value is not a
principal type, then the empty string is returned.

Supported in either invariants or properties.
