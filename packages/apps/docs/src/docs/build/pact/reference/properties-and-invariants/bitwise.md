---
title: Bitwise Operators
description:
  Pact comes equipped with the ability for smart contract authors to express and
  automatically check properties -- or, specifications -- of Pact programs.
menu: Bitwise Operators
label: Bitwise Operators
order: 3
layout: full
tags: ['pact', 'language reference', 'bitwise operators', 'pact operators']
---

# Bitwise operators

## &

```pact
(& x y)
```

- takes `x`: `integer`
- takes `y`: `integer`
- produces `integer`

Bitwise and

Supported in either invariants or properties.

## |

```pact
(| x y)
```

- takes `x`: `integer`
- takes `y`: `integer`
- produces `integer`

Bitwise or

Supported in either invariants or properties.

## xor

```pact
(xor x y)
```

- takes `x`: `integer`
- takes `y`: `integer`
- produces `integer`

Bitwise exclusive-or

Supported in either invariants or properties.

## shift

```pact
(shift x y)
```

- takes `x`: `integer`
- takes `y`: `integer`
- produces `integer`

Shift `x` `y` bits left if `y` is positive, or right by `-y` bits otherwise.

Supported in either invariants or properties.

## ~

```pact
(~ x)
```

- takes `x`: `integer`
- produces `integer`

Reverse all bits in `x`

Supported in either invariants or properties.
