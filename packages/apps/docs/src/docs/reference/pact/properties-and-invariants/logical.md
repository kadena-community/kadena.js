---
title: Logical operators
description:
  Pact comes equipped with the ability for smart contract authors to express and
  automatically check properties -- or, specifications -- of Pact programs.
menu: Logical operators
label: Logical operators
order: 4
layout: full
tags: ['pact', 'language reference', 'logical operators', 'pact operators']
---

# Logical operators

## >

```pact
(> x y)
```

- takes `x`: _a_
- takes `y`: _a_
- produces `bool`
- where _a_ is of type `integer` or `decimal`

True if `x` > `y`

Supported in either invariants or properties.

## \<

```pact
(< x y)
```

- takes `x`: _a_
- takes `y`: _a_
- produces `bool`
- where _a_ is of type `integer` or `decimal`

True if `x` < `y`

Supported in either invariants or properties.

## >=

```pact
(>= x y)
```

- takes `x`: _a_
- takes `y`: _a_
- produces `bool`
- where _a_ is of type `integer` or `decimal`

True if `x` >= `y`

Supported in either invariants or properties.

## \<=

```pact
(<= x y)
```

- takes `x`: _a_
- takes `y`: _a_
- produces `bool`
- where _a_ is of type `integer` or `decimal`

True if `x` \<= `y`

Supported in either invariants or properties.

## =

```pact
(= x y)
```

- takes `x`: _a_
- takes `y`: _a_
- produces `bool`
- where _a_ is of type `integer`, `decimal`, `string`, `time`, `bool`, `object`,
  or `keyset`

True if `x` = `y`

Supported in either invariants or properties.

### !=

```pact
(!= x y)
```

- takes `x`: _a_
- takes `y`: _a_
- produces `bool`
- where _a_ is of type `integer`, `decimal`, `string`, `time`, `bool`, `object`,
  or `keyset`

True if `x` != `y`

Supported in either invariants or properties.

## and

```pact
(and x y)
```

- takes `x`: `bool`
- takes `y`: `bool`
- produces `bool`

Short-circuiting logical conjunction

Supported in either invariants or properties.

## or

```pact
(or x y)
```

- takes `x`: `bool`
- takes `y`: `bool`
- produces `bool`

Short-circuiting logical disjunction

Supported in either invariants or properties.

## not

```pact
(not x)
```

- takes `x`: `bool`
- produces `bool`

Logical negation

Supported in either invariants or properties.

## when

```pact
(when x y)
```

- takes `x`: `bool`
- takes `y`: `bool`
- produces `bool`

Logical implication. Equivalent to `(or (not x) y)`.

Supported in either invariants or properties.

## and?

```pact
(and? f g a)
```

- takes `f`: _a_ -> `bool`
- takes `g`: _a_ -> `bool`
- takes `a`: _a_
- produces `bool`

`and` the results of applying both `f` and `g` to `a`

Supported in either invariants or properties.

## or?

```pact
(or? f g a)
```

- takes `f`: _a_ -> `bool`
- takes `g`: _a_ -> `bool`
- takes `a`: _a_
- produces `bool`

`or` the results of applying both `f` and `g` to `a`

Supported in either invariants or properties.

## hash

```pact
(hash s)
```

- takes `s`: `bool`
- produces `string`

BLAKE2b 256-bit hash of bool values

Supported in properties only.
