---
title: Unclassified operators
description:
  Pact comes equipped with the ability for smart contract authors to express and
  automatically check properties—or, specifications—of Pact programs.
menu: Other Operators
label: Other Operators
order: 14
layout: full
tags: ['pact', 'language reference', 'other operators', 'pact operators']
---

# Unclassified operators

## where

```pact
(where field f obj)
```

- takes `field`: `string`
- takes `f`: _a_ -> `bool`
- takes `obj`: `object`
- produces `bool`

utility for use in `filter` and `select` applying `f` to `field` in `obj`

Supported in either invariants or properties.

## typeof

```pact
(typeof a)
```

- takes `a`: _a_
- produces `string`

return the type of `a` as a string

Supported in either invariants or properties.
