---
title: Object Operators
description:
  Pact comes equipped with the ability for smart contract authors to express and
  automatically check properties -- or, specifications -- of Pact programs.
menu: Object Operators
label: Object Operators
order: 5
layout: full
tags: ['pact', 'language reference', 'object operators', 'pact operators']
---

# Object operators

## at

```pact
(at k o)
```

- takes `k`: `string`
- takes `o`: `object`
- produces _a_

```pact
(at i l)
```

- takes `i`: `integer`
- takes `o`: `list`
- produces `bool`

projection

Supported in either invariants or properties.

## \+

```pact
(+ x y)
```

- takes `x`: `object`
- takes `y`: `object`
- produces `object`

Object merge

Supported in either invariants or properties.

## drop

```pact
(drop keys o)
```

- takes `keys`: [`string`]
- takes `o`: `object`
- produces `object`

drop entries having the specified keys from an object

Supported in either invariants or properties.

## take

```pact
(take keys o)
```

- takes `keys`: [`string`]
- takes `o`: `object`
- produces `object`

take entries having the specified keys from an object

Supported in either invariants or properties.

## length

```pact
(length o)
```

- takes `o`: `object`
- produces `integer`

the number of key-value pairs in the object

Supported in either invariants or properties.
