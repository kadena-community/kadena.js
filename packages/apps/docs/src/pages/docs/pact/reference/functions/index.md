---
title: Built-in Functions
description:
  This document is a reference for the Pact smart-contract language, designed
  for correct, transactional execution on a high-performance blockchain.
menu: Built-in Functions
label: General
order: 6
layout: full
tags: ['pact', 'language reference', 'built-in functions']
---

# Built-in Functions

## General

### CHARSET_ASCII

Constant denoting the ASCII charset

Constant: &nbsp;&nbsp;`CHARSET_ASCII:integer = 0`

### CHARSET_LATIN1

Constant denoting the Latin-1 charset ISO-8859-1

Constant: &nbsp;&nbsp;`CHARSET_LATIN1:integer = 1`

### at

_idx_&nbsp;`integer` _list_&nbsp;`[<l>]` _&rarr;_&nbsp;`<a>`

_idx_&nbsp;`string` _object_&nbsp;`object:<{o}>` _&rarr;_&nbsp;`<a>`

Index LIST at IDX, or get value with key IDX from OBJECT.

```lisp
pact> (at 1 [1 2 3])
2
pact> (at "bar" { "foo": 1, "bar": 2 })
2
```

### base64-decode

_string_&nbsp;`string` _&rarr;_&nbsp;`string`

Decode STRING from unpadded base64

```lisp
pact> (base64-decode "aGVsbG8gd29ybGQh")
"hello world!"
```

### base64-encode

_string_&nbsp;`string` _&rarr;_&nbsp;`string`

Encode STRING as unpadded base64

```lisp
pact> (base64-encode "hello world!")
"aGVsbG8gd29ybGQh"
```

### bind

_src_&nbsp;`object:<{row}>` _binding_&nbsp;`binding:<{row}>` _&rarr;_&nbsp;`<a>`

Special form evaluates SRC to an object which is bound to with BINDINGS over
subsequent body statements.

```lisp
pact> (bind { "a": 1, "b": 2 } { "a" := a-value } a-value)
1
```

### chain-data

_&rarr;_&nbsp;`object:{public-chain-data}`

Get transaction public metadata. Returns an object with 'chain-id',
'block-height', 'block-time', 'prev-block-hash', 'sender', 'gas-limit',
'gas-price', and 'gas-fee' fields.

```lisp
pact> (chain-data)
{"block-height": 0,"block-time": "1970-01-01T00:00:00Z","chain-id": "","gas-limit": 0,"gas-price": 0.0,"prev-block-hash": "","sender": ""}
```

### compose

_x_&nbsp;`x:<a> -> <b>` _y_&nbsp;`x:<b> -> <c>` _value_&nbsp;`<a>`
_&rarr;_&nbsp;`<c>`

Compose X and Y, such that X operates on VALUE, and Y on the results of X.

```lisp
pact> (filter (compose (length) (< 2)) ["my" "dog" "has" "fleas"])
["dog" "has" "fleas"]
```

### concat

_str-list_&nbsp;`[string]` _&rarr;_&nbsp;`string`

Takes STR-LIST and concats each of the strings in the list, returning the
resulting string

```lisp
pact> (concat ["k" "d" "a"])
"kda"
pact> (concat (map (+ " ") (str-to-list "abcde")))
" a b c d e"
```

### constantly

_value_&nbsp;`<a>` _ignore1_&nbsp;`<b>` _&rarr;_&nbsp;`<a>`

_value_&nbsp;`<a>` _ignore1_&nbsp;`<b>` _ignore2_&nbsp;`<c>` _&rarr;_&nbsp;`<a>`

_value_&nbsp;`<a>` _ignore1_&nbsp;`<b>` _ignore2_&nbsp;`<c>`
_ignore3_&nbsp;`<d>` _&rarr;_&nbsp;`<a>`

Lazily ignore arguments IGNORE\* and return VALUE.

```lisp
pact> (filter (constantly true) [1 2 3])
[1 2 3]
```

### contains

_value_&nbsp;`<a>` _list_&nbsp;`[<a>]` _&rarr;_&nbsp;`bool`

_key_&nbsp;`<a>` _object_&nbsp;`object:<{o}>` _&rarr;_&nbsp;`bool`

_value_&nbsp;`string` _string_&nbsp;`string` _&rarr;_&nbsp;`bool`

Test that LIST or STRING contains VALUE, or that OBJECT has KEY entry.

```lisp
pact> (contains 2 [1 2 3])
true
pact> (contains 'name { 'name: "Ted", 'age: 72 })
true
pact> (contains "foo" "foobar")
true
```

### continue

_value_&nbsp;`*` _&rarr;_&nbsp;`*`

Continue a previously started nested defpact.

```lisp
(continue (coin.transfer-crosschain "bob" "alice" 10.0))
```

### define-namespace

_namespace_&nbsp;`string` _user-guard_&nbsp;`guard` _admin-guard_&nbsp;`guard`
_&rarr;_&nbsp;`string`

Create a namespace called NAMESPACE where ownership and use of the namespace is
controlled by GUARD. If NAMESPACE is already defined, then the guard previously
defined in NAMESPACE will be enforced, and GUARD will be rotated in its place.

```lisp
(define-namespace 'my-namespace (read-keyset 'user-ks) (read-keyset 'admin-ks))
```

Top level only: this function will fail if used in module code.

### describe-namespace

_ns_&nbsp;`string` _&rarr;_&nbsp;`object:{described-namespace}`

Describe the namespace NS, returning a row object containing the user and admin
guards of the namespace, as well as its name.

```lisp
(describe-namespace 'my-namespace)
```

Top level only: this function will fail if used in module code.

### distinct

_values_&nbsp;`[<a>]` _&rarr;_&nbsp;`[<a>]`

Returns from a homogeneous list of VALUES a list with duplicates removed. The
original order of the values is preserved.

```lisp
pact> (distinct [3 3 1 1 2 2])
[3 1 2]
```

### drop

_count_&nbsp;`integer` _list_&nbsp;`<a[[<l>],string]>`
_&rarr;_&nbsp;`<a[[<l>],string]>`

_keys_&nbsp;`[string]` _object_&nbsp;`object:<{o}>` _&rarr;_&nbsp;`object:<{o}>`

Drop COUNT values from LIST (or string), or entries having keys in KEYS from
OBJECT. If COUNT is negative, drop from end. If COUNT exceeds the interval
(-2^63,2^63), it is truncated to that range.

```lisp
pact> (drop 2 "vwxyz")
"xyz"
pact> (drop (- 2) [1 2 3 4 5])
[1 2 3]
pact> (drop ['name] { 'name: "Vlad", 'active: false})
{"active": false}
```

### enforce

_test_&nbsp;`bool` _msg_&nbsp;`string` _&rarr;_&nbsp;`bool`

Fail transaction with MSG if pure expression TEST is false. Otherwise, returns
true.

```lisp
pact> (enforce (!= (+ 2 2) 4) "Chaos reigns")
<interactive>:0:0:Error: Chaos reigns
```

### enforce-one

_msg_&nbsp;`string` _tests_&nbsp;`[bool]` _&rarr;_&nbsp;`bool`

Run TESTS in order (in pure context, plus keyset enforces). If all fail, fail
transaction. Short-circuits on first success.

```lisp
pact> (enforce-one "Should succeed on second test" [(enforce false "Skip me") (enforce (= (+ 2 2) 4) "Chaos reigns")])
true
```

### enforce-pact-version

_min-version_&nbsp;`string` _&rarr;_&nbsp;`bool`

_min-version_&nbsp;`string` _max-version_&nbsp;`string` _&rarr;_&nbsp;`bool`

Enforce runtime pact version as greater than or equal MIN-VERSION, and less than
or equal MAX-VERSION. Version values are matched numerically from the left, such
that '2', '2.2', and '2.2.3' would all allow '2.2.3'.

```lisp
pact> (enforce-pact-version "2.3")
true
```

Top level only: this function will fail if used in module code.

### enumerate

_from_&nbsp;`integer` _to_&nbsp;`integer` _inc_&nbsp;`integer`
_&rarr;_&nbsp;`[integer]`

_from_&nbsp;`integer` _to_&nbsp;`integer` _&rarr;_&nbsp;`[integer]`

Returns a sequence of numbers from FROM to TO (both inclusive) as a list. INC is
the increment between numbers in the sequence. If INC is not given, it is
assumed to be 1. Additionally, if INC is not given and FROM is greater than TO
assume a value for INC of -1. If FROM equals TO, return the singleton list
containing FROM, irrespective of INC's value. If INC is equal to zero, this
function will return the singleton list containing FROM. If INC is such that
FROM + INC > TO (when FROM < TO) or FROM + INC < TO (when FROM > TO) return the
singleton list containing FROM. Lastly, if INC is such that FROM + INC < TO
(when FROM < TO) or FROM + INC > TO (when FROM > TO), then this function fails.

```lisp
pact> (enumerate 0 10 2)
[0 2 4 6 8 10]
pact> (enumerate 0 10)
[0 1 2 3 4 5 6 7 8 9 10]
pact> (enumerate 10 0)
[10 9 8 7 6 5 4 3 2 1 0]
```

### filter

_app_&nbsp;`x:<a> -> bool` _list_&nbsp;`[<a>]` _&rarr;_&nbsp;`[<a>]`

Filter LIST by applying APP to each element. For each true result, the original
value is kept.

```lisp
pact> (filter (compose (length) (< 2)) ["my" "dog" "has" "fleas"])
["dog" "has" "fleas"]
```

### fold

_app_&nbsp;`x:<a> y:<b> -> <a>` _init_&nbsp;`<a>` _list_&nbsp;`[<b>]`
_&rarr;_&nbsp;`<a>`

Iteratively reduce LIST by applying APP to last result and element, starting
with INIT.

```lisp
pact> (fold (+) 0 [100 10 5])
115
```

### format

_template_&nbsp;`string` _vars_&nbsp;`[*]` _&rarr;_&nbsp;`string`

Interpolate VARS into TEMPLATE using `{}`.

```lisp
pact> (format "My {} has {}" ["dog" "fleas"])
"My dog has fleas"
```

### hash

_value_&nbsp;`<a>` _&rarr;_&nbsp;`string`

Compute BLAKE2b 256-bit hash of VALUE represented in unpadded base64-url.
Strings are converted directly while other values are converted using their JSON
representation. Non-value-level arguments are not allowed.

```lisp
pact> (hash "hello")
"Mk3PAn3UowqTLEQfNlol6GsXPe-kuOWJSCU0cbgbcs8"
pact> (hash { 'foo: 1 })
"h9BZgylRf_M4HxcBXr15IcSXXXSz74ZC2IAViGle_z4"
```

### identity

_value_&nbsp;`<a>` _&rarr;_&nbsp;`<a>`

Return provided value.

```lisp
pact> (map (identity) [1 2 3])
[1 2 3]
```

### if

_cond_&nbsp;`bool` _then_&nbsp;`<a>` _else_&nbsp;`<a>` _&rarr;_&nbsp;`<a>`

Test COND. If true, evaluate THEN. Otherwise, evaluate ELSE.

```lisp
pact> (if (= (+ 2 2) 4) "Sanity prevails" "Chaos reigns")
"Sanity prevails"
```

### int-to-str

_base_&nbsp;`integer` _val_&nbsp;`integer` _&rarr;_&nbsp;`string`

Represent integer VAL as a string in BASE. BASE can be 2-16, or 64 for unpadded
base64URL. Only positive values are allowed for base64URL conversion.

```lisp
pact> (int-to-str 16 65535)
"ffff"
pact> (int-to-str 64 43981)
"q80"
```

### is-charset

_charset_&nbsp;`integer` _input_&nbsp;`string` _&rarr;_&nbsp;`bool`

Check that a string INPUT conforms to the a supported character set CHARSET.
Character sets currently supported are: 'CHARSET_LATIN1' (ISO-8859-1), and
'CHARSET_ASCII' (ASCII). Support for sets up through ISO 8859-5 supplement will
be added in the future.

```lisp
pact> (is-charset CHARSET_ASCII "hello world")
true
pact> (is-charset CHARSET_ASCII "I am nÖt ascii")
false
pact> (is-charset CHARSET_LATIN1 "I am nÖt ascii, but I am latin1!")
true
```

### length

_x_&nbsp;`<a[[<l>],string,object:<{o}>]>` _&rarr;_&nbsp;`integer`

Compute length of X, which can be a list, a string, or an object.

```lisp
pact> (length [1 2 3])
3
pact> (length "abcdefgh")
8
pact> (length { "a": 1, "b": 2 })
2
```

### list

_elems_&nbsp;`*` _&rarr;_&nbsp;`[*]`

Create list from ELEMS. Deprecated in Pact 2.1.1 with literal list support.

```lisp
pact> (list 1 2 3)
[1 2 3]
```

### list-modules

_&rarr;_&nbsp;`[string]`

List modules available for loading.

Top level only: this function will fail if used in module code.

### make-list

_length_&nbsp;`integer` _value_&nbsp;`<a>` _&rarr;_&nbsp;`[<a>]`

Create list by repeating VALUE LENGTH times.

```lisp
pact> (make-list 5 true)
[true true true true true]
```

### map

_app_&nbsp;`x:<b> -> <a>` _list_&nbsp;`[<b>]` _&rarr;_&nbsp;`[<a>]`

Apply APP to each element in LIST, returning a new list of results.

```lisp
pact> (map (+ 1) [1 2 3])
[2 3 4]
```

### namespace

_namespace_&nbsp;`string` _&rarr;_&nbsp;`string`

Set the current namespace to NAMESPACE. All expressions that occur in a current
transaction will be contained in NAMESPACE, and once committed, may be accessed
via their fully qualified name, which will include the namespace. Subsequent
namespace calls in the same tx will set a new namespace for all declarations
until either the next namespace declaration, or the end of the tx.

```lisp
(namespace 'my-namespace)
```

Top level only: this function will fail if used in module code.

### pact-id

_&rarr;_&nbsp;`string`

Return ID if called during current pact execution, failing if not.

### pact-version

_&rarr;_&nbsp;`string`

Obtain current pact build version.

```lisp
pact> (pact-version)
"4.7.1"
```

Top level only: this function will fail if used in module code.

### public-chain-data

Schema type for data returned from 'chain-data'.

Fields: &nbsp;&nbsp;`chain-id:string` &nbsp;&nbsp;`block-height:integer`
&nbsp;&nbsp;`block-time:time` &nbsp;&nbsp;`prev-block-hash:string`
&nbsp;&nbsp;`sender:string` &nbsp;&nbsp;`gas-limit:integer`
&nbsp;&nbsp;`gas-price:decimal`

### read-decimal

_key_&nbsp;`string` _&rarr;_&nbsp;`decimal`

Parse KEY string or number value from top level of message data body as decimal.

```lisp
(defun exec ()
   (transfer (read-msg "from") (read-msg "to") (read-decimal "amount")))
```

### read-integer

_key_&nbsp;`string` _&rarr;_&nbsp;`integer`

Parse KEY string or number value from top level of message data body as integer.

```lisp
(read-integer "age")
```

### read-msg

_&rarr;_&nbsp;`<a>`

_key_&nbsp;`string` _&rarr;_&nbsp;`<a>`

Read KEY from top level of message data body, or data body itself if not
provided. Coerces value to their corresponding pact type: String -> string,
Number -> integer, Boolean -> bool, List -> list, Object -> object.

```lisp
(defun exec ()
   (transfer (read-msg "from") (read-msg "to") (read-decimal "amount")))
```

### read-string

_key_&nbsp;`string` _&rarr;_&nbsp;`string`

Parse KEY string or number value from top level of message data body as string.

```lisp
(read-string "sender")
```

### remove

_key_&nbsp;`string` _object_&nbsp;`object:<{o}>` _&rarr;_&nbsp;`object:<{o}>`

Remove entry for KEY from OBJECT.

```lisp
pact> (remove "bar" { "foo": 1, "bar": 2 })
{"foo": 1}
```

### resume

_binding_&nbsp;`binding:<{r}>` _&rarr;_&nbsp;`<a>`

Special form binds to a yielded object value from the prior step execution in a
pact. If yield step was executed on a foreign chain, enforce endorsement via
SPV.

### reverse

_list_&nbsp;`[<a>]` _&rarr;_&nbsp;`[<a>]`

Reverse LIST.

```lisp
pact> (reverse [1 2 3])
[3 2 1]
```

### sort

_values_&nbsp;`[<a>]` _&rarr;_&nbsp;`[<a>]`

_fields_&nbsp;`[string]` _values_&nbsp;`[object:<{o}>]`
_&rarr;_&nbsp;`[object:<{o}>]`

Sort a homogeneous list of primitive VALUES, or objects using supplied FIELDS
list.

```lisp
pact> (sort [3 1 2])
[1 2 3]
pact> (sort ['age] [{'name: "Lin",'age: 30} {'name: "Val",'age: 25}])
[{"name": "Val","age": 25} {"name": "Lin","age": 30}]
```

### str-to-int

_str-val_&nbsp;`string` _&rarr;_&nbsp;`integer`

_base_&nbsp;`integer` _str-val_&nbsp;`string` _&rarr;_&nbsp;`integer`

Compute the integer value of STR-VAL in base 10, or in BASE if specified.
STR-VAL can be up to 512 chars in length. BASE must be between 2 and 16, or 64
to perform unpadded base64url conversion. Each digit must be in the correct
range for the base.

```lisp
pact> (str-to-int 16 "abcdef123456")
188900967593046
pact> (str-to-int "123456")
123456
pact> (str-to-int 64 "q80")
43981
```

### str-to-list

_str_&nbsp;`string` _&rarr;_&nbsp;`[string]`

Takes STR and returns a list of single character strings

```lisp
pact> (str-to-list "hello")
["h" "e" "l" "l" "o"]
pact> (concat (map (+ " ") (str-to-list "abcde")))
" a b c d e"
```

### take

_count_&nbsp;`integer` _list_&nbsp;`<a[[<l>],string]>`
_&rarr;_&nbsp;`<a[[<l>],string]>`

_keys_&nbsp;`[string]` _object_&nbsp;`object:<{o}>` _&rarr;_&nbsp;`object:<{o}>`

Take COUNT values from LIST (or string), or entries having keys in KEYS from
OBJECT. If COUNT is negative, take from end. If COUNT exceeds the interval
(-2^63,2^63), it is truncated to that range.

```lisp
pact> (take 2 "abcd")
"ab"
pact> (take (- 3) [1 2 3 4 5])
[3 4 5]
pact> (take ['name] { 'name: "Vlad", 'active: false})
{"name": "Vlad"}
```

### try

_default_&nbsp;`<a>` _action_&nbsp;`<a>` _&rarr;_&nbsp;`<a>`

Attempt a pure ACTION, returning DEFAULT in the case of failure. Pure
expressions are expressions which do not do i/o or work with non-deterministic
state in contrast to impure expressions such as reading and writing to a table.

```lisp
pact> (try 3 (enforce (= 1 2) "this will definitely fail"))
3
(expect "impure expression fails and returns default" "default" (try "default" (with-read accounts id {'ccy := ccy}) ccy))
```

### tx-hash

_&rarr;_&nbsp;`string`

Obtain hash of current transaction as a string.

```lisp
pact> (tx-hash)
"DldRwCblQ7Loqy6wYJnaodHl30d3j3eH-qtFzfEv46g"
```

### typeof

_x_&nbsp;`<a>` _&rarr;_&nbsp;`string`

Returns type of X as string.

```lisp
pact> (typeof "hello")
"string"
```

### where

_field_&nbsp;`string` _app_&nbsp;`x:<a> -> bool` _value_&nbsp;`object:<{row}>`
_&rarr;_&nbsp;`bool`

Utility for use in 'filter' and 'select' applying APP to FIELD in VALUE.

```lisp
pact> (filter (where 'age (> 20)) [{'name: "Mary",'age: 30} {'name: "Juan",'age: 15}])
[{"name": "Juan","age": 15}]
```

### yield

_object_&nbsp;`object:<{y}>` _&rarr;_&nbsp;`object:<{y}>`

_object_&nbsp;`object:<{y}>` _target-chain_&nbsp;`string`
_&rarr;_&nbsp;`object:<{y}>`

Yield OBJECT for use with 'resume' in following pact step. With optional
argument TARGET-CHAIN, target subsequent step to execute on targeted chain using
automated SPV endorsement-based dispatch.

```lisp
(yield { "amount": 100.0 })
(yield { "amount": 100.0 } "some-chain-id")
```

### zip

_f_&nbsp;`x:<a> y:<b> -> <c>` _list1_&nbsp;`[<a>]` _list2_&nbsp;`[<b>]`
_&rarr;_&nbsp;`[<c>]`

Combine two lists with some function f, into a new list, the length of which is
the length of the shortest list.

```lisp
pact> (zip (+) [1 2 3 4] [4 5 6 7])
[5 7 9 11]
pact> (zip (-) [1 2 3 4] [4 5 6])
[-3 -3 -3]
pact> (zip (+) [1 2 3] [4 5 6 7])
[5 7 9]
pact> (zip (lambda (x y) { 'x: x, 'y: y }) [1 2 3 4] [4 5 6 7])
[{"x": 1,"y": 4} {"x": 2,"y": 5} {"x": 3,"y": 6} {"x": 4,"y": 7}]
```
