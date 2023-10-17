---
title: Database Operators
description:
  Pact comes equipped with the ability for smart contract authors to express and
  automatically check properties -- or, specifications -- of Pact programs.
menu: Database Operators
label: Database Operators
order: 11
layout: full
tags: ['pact', 'language reference', 'database operators', 'pact operators']
---

# Database operators

## table-written

```pact
(table-written t)
```

- takes `t`: _a_
- produces `bool`
- where _a_ is of type `table` or `string`

Whether a table is written in the function under analysis

Supported in properties only.

## table-read

```pact
(table-read t)
```

- takes `t`: _a_
- produces `bool`
- where _a_ is of type `table` or `string`

Whether a table is read in the function under analysis

Supported in properties only.

## cell-delta

```pact
(cell-delta t c r)
```

- takes `t`: _a_
- takes `c`: _b_
- takes `r`: `string`
- produces _c_
- where _a_ is of type `table` or `string`
- where _b_ is of type `column` or `string`
- where _c_ is of type `integer` or `decimal`

The difference in a cell's value before and after the transaction

Supported in properties only.

## column-delta

```pact
(column-delta t c)
```

- takes `t`: _a_
- takes `c`: _b_
- produces _c_
- where _a_ is of type `table` or `string`
- where _b_ is of type `column` or `string`
- where _c_ is of type `integer` or `decimal`

The difference in a column's total summed value before and after the transaction

Supported in properties only.

## column-written

```pact
(column-written t c)
```

- takes `t`: _a_
- takes `c`: _b_
- produces `bool`
- where _a_ is of type `table` or `string`
- where _b_ is of type `column` or `string`

Whether a column is written to in a transaction

Supported in properties only.

## column-read

```pact
(column-read t c)
```

- takes `t`: _a_
- takes `c`: _b_
- produces `bool`
- where _a_ is of type `table` or `string`
- where _b_ is of type `column` or `string`

Whether a column is read from in a transaction

Supported in properties only.

## row-read

```pact
(row-read t r)
```

- takes `t`: _a_
- takes `r`: `string`
- produces `bool`
- where _a_ is of type `table` or `string`

Whether a row is read in the function under analysis

Supported in properties only.

## row-written

```pact
(row-written t r)
```

- takes `t`: _a_
- takes `r`: `string`
- produces `bool`
- where _a_ is of type `table` or `string`

Whether a row is written in the function under analysis

Supported in properties only.

## row-read-count

```pact
(row-read-count t r)
```

- takes `t`: _a_
- takes `r`: `string`
- produces `integer`
- where _a_ is of type `table` or `string`

The number of times a row is read during a transaction

Supported in properties only.

## row-write-count

```pact
(row-write-count t r)
```

- takes `t`: _a_
- takes `r`: `string`
- produces `integer`
- where _a_ is of type `table` or `string`

The number of times a row is written during a transaction

Supported in properties only.

## row-exists

```pact
(row-exists t r time)
```

- takes `t`: _a_
- takes `r`: `string`
- takes `time`: one of \{"before","after"\}
- produces `bool`
- where _a_ is of type `table` or `string`

Whether a row exists before or after a transaction

Supported in properties only.

## read

```pact
(read t r)
```

- takes `t`: _a_
- takes `r`: `string`
- takes `time`: one of \{"before","after"\}
- produces `object`
- where _a_ is of type `table` or `string`

The value of a read before or after a transaction

Supported in properties only.
