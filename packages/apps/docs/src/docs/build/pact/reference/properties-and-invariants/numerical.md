---
title: Numerical Operators
description:
  Pact comes equipped with the ability for smart contract authors to express and
  automatically check properties -- or, specifications -- of Pact programs.
menu: Numerical Operators
label: Numerical operators
order: 2
layout: full
tags: ['pact', 'language reference', 'numerical operators', 'pact operators']
---

# Numerical operators

## \+

```pact
(+ x y)
```

- takes `x`: _a_
- takes `y`: _a_
- produces _a_
- where _a_ is of type `integer` or `decimal`

Addition of integers and decimals.

Supported in either invariants or properties.

## \-

```pact
(- x y)
```

- takes `x`: _a_
- takes `y`: _a_
- produces _a_
- where _a_ is of type `integer` or `decimal`

Subtraction of integers and decimals.

Supported in either invariants or properties.

## \*

```pact
(* x y)
```

- takes `x`: _a_
- takes `y`: _a_
- produces _a_
- where _a_ is of type `integer` or `decimal`

Multiplication of integers and decimals.

Supported in either invariants or properties.

## /

```pact
(/ x y)
```

- takes `x`: _a_
- takes `y`: _a_
- produces _a_
- where _a_ is of type `integer` or `decimal`

Division of integers and decimals.

Supported in either invariants or properties.

## ^

```pact
(^ x y)
```

- takes `x`: _a_
- takes `y`: _a_
- produces _a_
- where _a_ is of type `integer` or `decimal`

Exponentiation of integers and decimals.

Supported in either invariants or properties.

## log

```pact
(log b x)
```

- takes `b`: _a_
- takes `x`: _a_
- produces _a_
- where _a_ is of type `integer` or `decimal`

Logarithm of `x` base `b`.

Supported in either invariants or properties.

## \-

```pact
(- x)
```

- takes `x`: _a_
- produces _a_
- where _a_ is of type `integer` or `decimal`

Negation of integers and decimals.

Supported in either invariants or properties.

## sqrt

```pact
(sqrt x)
```

- takes `x`: _a_
- produces _a_
- where _a_ is of type `integer` or `decimal`

Square root of integers and decimals.

Supported in either invariants or properties.

## ln

```pact
(ln x)
```

- takes `x`: _a_
- produces _a_
- where _a_ is of type `integer` or `decimal`

Logarithm of integers and decimals base e.

Supported in either invariants or properties.

## exp

```pact
(exp x)
```

- takes `x`: _a_
- produces _a_
- where _a_ is of type `integer` or `decimal`

Exponential of integers and decimals. e raised to the integer or decimal `x`.

Supported in either invariants or properties.

## abs

```pact
(abs x)
```

- takes `x`: _a_
- produces _a_
- where _a_ is of type `integer` or `decimal`

Absolute value of integers and decimals.

Supported in either invariants or properties.

## round

```pact
(round x)
```

- takes `x`: `decimal`
- produces `integer`

```pact
(round x prec)
```

- takes `x`: `decimal`
- takes `prec`: `integer`
- produces `integer`

Banker's rounding value of decimal `x` as integer, or to `prec` precision as
decimal.

Supported in either invariants or properties.

## ceiling

```pact
(ceiling x)
```

- takes `x`: `decimal`
- produces `integer`

```pact
(ceiling x prec)
```

- takes `x`: `decimal`
- takes `prec`: `integer`
- produces `integer`

Rounds the decimal `x` up to the next integer, or to `prec` precision as
decimal.

Supported in either invariants or properties.

## floor

```pact
(floor x)
```

- takes `x`: `decimal`
- produces `integer`

```pact
(floor x prec)
```

- takes `x`: `decimal`
- takes `prec`: `integer`
- produces `integer`

Rounds the decimal `x` down to the previous integer, or to `prec` precision as
decimal.

Supported in either invariants or properties.

## dec

```pact
(dec x)
```

- takes `x`: `integer`
- produces `decimal`

Casts the integer `x` to its decimal equivalent.

Supported in either invariants or properties.

## mod

```pact
(mod x y)
```

- takes `x`: `integer`
- takes `y`: `integer`
- produces `integer`

Integer modulus

Supported in either invariants or properties.
