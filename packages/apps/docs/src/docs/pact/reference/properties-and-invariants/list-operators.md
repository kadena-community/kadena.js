---
title: List Operators
description:
  Pact comes equipped with the ability for smart contract authors to express and
  automatically check properties -- or, specifications -- of Pact programs.
menu: List Operators
label: List Operators
order: 6
layout: full
tags: ['pact', 'language reference', 'list operators', 'pact operators']
---

# List operators

## at

```pact
(at key-field some-object)
```

- takes `key-field`: `string`
- takes `some-obect`: `{object _any type_}`
- produces _any type_

```pact
(at index some-list)
```

- takes `index`: `integer`
- takes `some-list`: `[list _any type_]`
- produces _any type_

projection

Supported in either invariants or properties.

## length

```pact
(length s)
```

- takes `s`: [_a_]
- produces `integer`

List length

Supported in either invariants or properties.

## contains

```pact
(contains x xs)
```

- takes `x`: _a_
- takes `xs`: [_a_]
- produces `bool`

```pact
(contains k o)
```

- takes `k`: `string`
- takes `o`: `object`
- produces `bool`

```pact
(contains value string)
```

- takes `value`: `string`
- takes `string`: `string`
- produces `bool`

List / string / object contains

Supported in either invariants or properties.

## enumerate

```pact
(enumerate from to step)
```

- takes `from`: `integer`
- takes `to`: `integer`
- takes `step`: `integer`
- produces [`integer`]

Returns a sequence of numbers as a list

Supported in either invariants or properties.

## reverse

```pact
(reverse xs)
```

- takes `xs`: [_a_]
- produces [_a_]

reverse a list of values

Supported in either invariants or properties.

## sort

```pact
(sort xs)
```

- takes `xs`: [_a_]
- produces [_a_]

sort a list of values

Supported in either invariants or properties.

## drop

```pact
(drop n xs)
```

- takes `n`: `integer`
- takes `xs`: [_a_]
- produces [_a_]

drop the first `n` values from the beginning of a list (or the end if `n` is
negative)

Supported in either invariants or properties.

## take

```pact
(take n xs)
```

- takes `n`: `integer`
- takes `xs`: [_a_]
- produces [_a_]

take the first `n` values from `xs` (taken from the end if `n` is negative)

Supported in either invariants or properties.

## make-list

```pact
(make-list n a)
```

- takes `n`: `integer`
- takes `a`: _a_
- produces [_a_]

create a new list with `n` copies of `a`

Supported in either invariants or properties.

## map

```pact
(map f as)
```

- takes `f`: _a_ -> _b_
- takes `as`: [_a_]
- produces [_b_]

apply `f` to each element in a list

Supported in either invariants or properties.

## filter

```pact
(filter f as)
```

- takes `f`: _a_ -> `bool`
- takes `as`: [_a_]
- produces [_a_]

filter a list by keeping the values for which `f` returns `true`

Supported in either invariants or properties.

## distinct

```pact
(distinct xs)
```

- takes `xs`: [_a_]
- produces [_a_]

returns a list of distinct values

Supported in either invariants or properties.

## fold

```pact
(fold f a bs)
```

- takes `f`: _a_ -> _b_ -> _a_
- takes `a`: _a_
- takes `bs`: [_b_]
- produces _a_

reduce a list by applying `f` to each element and the previous result

Supported in either invariants or properties.

## hash

```pact
(hash xs)
```

- takes `xs`: [_a_]
- produces `string`
- where _a_ is of type `integer`, `decimal`, `bool`, or `string`

BLAKE2b 256-bit hash of lists

Supported in properties only.
