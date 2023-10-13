---
title: Quantification Operators
description:
  Pact comes equipped with the ability for smart contract authors to express and
  automatically check properties -- or, specifications -- of Pact programs.
menu: Quantification Operators
label: Quantification Operators
order: 9
layout: full
tags:
  ['pact', 'language reference', 'quantification operators', 'pact operators']
---

# Quantification operators

## forall

```pact
(forall (x:string) y)
```

- binds `x`: _a_
- takes `y`: _r_
- produces _r_
- where _a_ is _any type_
- where _r_ is _any type_

Bind a universally-quantified variable

Supported in properties only.

## exists

```pact
(exists (x:string) y)
```

- binds `x`: _a_
- takes `y`: _r_
- produces _r_
- where _a_ is _any type_
- where _r_ is _any type_

Bind an existentially-quantified variable

Supported in properties only.

## column-of

```pact
(column-of t)
```

- takes `t`: `table`
- produces `type`

The _type_ of `column`s for a given `table`. Commonly used in conjunction with
quantification; e.g.:
`(exists (col:(column-of accounts)) (column-written accounts col))`.

Supported in properties only.
