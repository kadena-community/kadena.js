---
title: Database
description:
  This document is a reference for the Pact smart-contract language, designed
  for correct, transactional execution on a high-performance blockchain.
menu: Pact functions
label: Database
order: 2
layout: full
tags: ['pact', 'language reference', 'database']
---

# Database

## create-table

_table_&nbsp;`table:<{row}>` _&rarr;_&nbsp;`string`

Create table TABLE.

```pact
(create-table accounts)
```

Top level only: this function will fail if used in module code.

## describe-keyset

_keyset_&nbsp;`string` _&rarr;_&nbsp;`object:*`

Get metadata for KEYSET.

Top level only: this function will fail if used in module code.

## describe-module

_module_&nbsp;`string` _&rarr;_&nbsp;`object:*`

Get metadata for MODULE. Returns an object with 'name', 'hash', 'blessed',
'code', and 'keyset' fields.

```pact
(describe-module 'my-module)
```

Top level only: this function will fail if used in module code.

## describe-table

_table_&nbsp;`table:<{row}>` _&rarr;_&nbsp;`object:*`

Get metadata for TABLE. Returns an object with 'name', 'hash', 'blessed',
'code', and 'keyset' fields.

```pact
(describe-table accounts)
```

Top level only: this function will fail if used in module code.

## fold-db

_table_&nbsp;`table:<{row}>` _qry_&nbsp;`a:string b:object:<{row}> -> bool`
_consumer_&nbsp;`a:string b:object:<{row}> -> <b>` _&rarr;_&nbsp;`[<b>]`

Select rows from TABLE using QRY as a predicate with both key and value, and
then accumulate results of the query in CONSUMER. Output is sorted by the
ordering of keys.

```pact
(let*
 ((qry (lambda (k obj) true)) ;; select all rows
  (f (lambda (k obj) [(at 'firstName obj), (at 'b obj)]))
 )
 (fold-db people (qry) (f))
)
```

## insert

_table_&nbsp;`table:<{row}>` _key_&nbsp;`string` _object_&nbsp;`object:<{row}>`
_&rarr;_&nbsp;`string`

Write entry in TABLE for KEY of OBJECT column data, failing if data already
exists for KEY.

```pact
(insert accounts id { "balance": 0.0, "note": "Created account." })
```

## keylog

_table_&nbsp;`table:<{row}>` _key_&nbsp;`string` _txid_&nbsp;`integer`
_&rarr;_&nbsp;`[object:*]`

Return updates to TABLE for a KEY in transactions at or after TXID, in a list of
objects indexed by txid.

```pact
(keylog accounts "Alice" 123485945)
```

## keys

_table_&nbsp;`table:<{row}>` _&rarr;_&nbsp;`[string]`

Return all keys in TABLE.

```pact
(keys accounts)
```

## read

_table_&nbsp;`table:<{row}>` _key_&nbsp;`string` _&rarr;_&nbsp;`object:<{row}>`

_table_&nbsp;`table:<{row}>` _key_&nbsp;`string` _columns_&nbsp;`[string]`
_&rarr;_&nbsp;`object:<{row}>`

Read row from TABLE for KEY, returning database record object, or just COLUMNS
if specified.

```pact
(read accounts id ['balance 'ccy])
```

## select

_table_&nbsp;`table:<{row}>` _where_&nbsp;`row:object:<{row}> -> bool`
_&rarr;_&nbsp;`[object:<{row}>]`

_table_&nbsp;`table:<{row}>` _columns_&nbsp;`[string]`
_where_&nbsp;`row:object:<{row}> -> bool` _&rarr;_&nbsp;`[object:<{row}>]`

Select full rows or COLUMNS from table by applying WHERE to each row to get a
boolean determining inclusion.

```pact
(select people ['firstName,'lastName] (where 'name (= "Fatima")))
(select people (where 'age (> 30)))?
```

## txids

_table_&nbsp;`table:<{row}>` _txid_&nbsp;`integer` _&rarr;_&nbsp;`[integer]`

Return all txid values greater than or equal to TXID in TABLE.

```pact
(txids accounts 123849535)
```

## txlog

_table_&nbsp;`table:<{row}>` _txid_&nbsp;`integer` _&rarr;_&nbsp;`[object:*]`

Return all updates to TABLE performed in transaction TXID.

```pact
(txlog accounts 123485945)
```

## update

_table_&nbsp;`table:<{row}>` _key_&nbsp;`string` _object_&nbsp;`object:~<{row}>`
_&rarr;_&nbsp;`string`

Write entry in TABLE for KEY of OBJECT column data, failing if data does not
exist for KEY.

```pact
(update accounts id { "balance": (+ bal amount), "change": amount, "note": "credit" })
```

## with-default-read

_table_&nbsp;`table:<{row}>` _key_&nbsp;`string`
_defaults_&nbsp;`object:~<{row}>` _bindings_&nbsp;`binding:~<{row}>`
_&rarr;_&nbsp;`<a>`

Special form to read row from TABLE for KEY and bind columns per BINDINGS over
subsequent body statements. If row not found, read columns from DEFAULTS, an
object with matching key names.

```pact
(with-default-read accounts id { "balance": 0, "ccy": "USD" } { "balance":= bal, "ccy":= ccy }
  (format "Balance for {} is {} {}" [id bal ccy]))
```

## with-read

_table_&nbsp;`table:<{row}>` _key_&nbsp;`string`
_bindings_&nbsp;`binding:<{row}>` _&rarr;_&nbsp;`<a>`

Special form to read row from TABLE for KEY and bind columns per BINDINGS over
subsequent body statements.

```pact
(with-read accounts id { "balance":= bal, "ccy":= ccy }
  (format "Balance for {} is {} {}" [id bal ccy]))
```

## write

_table_&nbsp;`table:<{row}>` _key_&nbsp;`string` _object_&nbsp;`object:<{row}>`
_&rarr;_&nbsp;`string`

Write entry in TABLE for KEY of OBJECT column data.

```pact
(write accounts id { "balance": 100.0 })
```
