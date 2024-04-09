---
title: Authorization operators
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

Use `authorized-by` to check whether the transaction is signed by an authorized keyset guard.

#### Basic syntax

```pact
(authorized-by keyset)
```

#### Parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| keyset | `string` | Specifies the keyset string.

#### Return type

Returns a `bool` type that indicates whether the specified keyset guard is satisfied by the executing transaction.

#### Example

```pact
(authorized-by "bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e")
```

#### Support

Supported in properties only.

## row-enforced

Use `row-enforced` to check whether the keyset in the row is enforced by the function under analysis.

#### Basic syntax

```pact
(row-enforced t c r)
```

- takes `t`: _a_
- takes `c`: _b_
- takes `r`: `string`
- produces `bool`
- where _a_ is of type `table` or `string`
- where _b_ is of type `column` or `string`

#### Support

Supported in properties only.

## is-principal

Use `is-principal` to check whether the specified string conforms to the principal format without proving validity.

#### Basic syntax

```pact
(is-principal s)
```

#### Parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| s | `string` | Specifies the string to check the formatting for.

#### Return type

Returns a `bool` type that indicates whether the specified string `s` has the format of a principal.

#### Support

Supported in either invariants or properties.

## typeof-principal

Use `typeof-principal` to check the protocol type of the specified string `s` value. 
If input value is not a `principal` data type, then the empty string is returned.

#### Basic syntax

```pact
(typeof-principal s)
```

#### Parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| s | `string` | Specifies the string to check the protocol type of.

#### Return type

If input value is not a `principal` data type, then the empty string is returned.

#### Support

Supported in either invariants or properties.
