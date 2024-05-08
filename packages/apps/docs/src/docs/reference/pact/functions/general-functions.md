---
title: General functions
description:
  This document is a reference for the Pact smart-contract language, designed
  for correct, transactional execution on a high-performance blockchain.
menu: Pact functions
label: General
order: 1
layout: full
tags: ['pact', 'language reference', 'built-in functions']
---

# General purpose functions

Pact provides the following general purpose built-in functions.

## CHARSET_ASCII

Use the `CHARSET_ASCII` constant to indicate the standard ASCII character set.

Constant: &nbsp;&nbsp;`CHARSET_ASCII:integer = 0`

## CHARSET_LATIN1

Use the `CHARSET_LATIN1` constant to indicate the standard Latin-1 (ISO-8859-1) character set.

Constant: &nbsp;&nbsp;`CHARSET_LATIN1:integer = 1`

## at

Use `at` to retrieve the value at the location specified by an *index* number or by a *key* string in a collection.
If you specify an *index* number, the collection must be a list of values.
If you specify a *key* string, the collection must be an object.

### Basic syntax

To get a value using the specified index location from a list of values, use the following syntax:

```pact
at index:integer [list]
```

To get a value using the specified string from an object, use the following syntax:

```pact
at key:string {object}
```

### Arguments

Use one of the following argument to define the value you want to retrieve using the `at` Pact function.

| Argument | Type | Description
| -------- | ---- | -----------
| `index` | integer | Specifies the information you want to retrieve. If you specify an `index` number, the function returns the value from that location in a list of values.
| `key` | string | Specifies the information you want to retrieve. If you specify a `key` string, the function returns the value corresponding to that key from an object.

### Return values

The `at` function returns the value found at the specified *index* or using the specified *key*.
The return value can be any data type.

### Examples

The following example returns the value found at the *index* location—starting with 0—from a list of values:

```pact
(at  3 [20 18 16 14 12 10])
14
```

You can use the `at` function to return any type of data from a list.
For example:

```pact
(at 1 ["blue","green","red","yellow"])
"green"
```

The following example returns the value found at the specified *key* from an object:

```pact
(at "last-name" { "first-name": "maya", "last-name": "tea"})
"tea"
```

You can use the `at` function to return any type of data using the specified *key* from an object.
For example:

```pact
(at "chainId" { "networkId": "development", "chainId": 1, "auth": 0})
1
```

### Property checking

For property checking, you can use the `at` list operator when specifying an invariant or a property to test your code against.

## base64-decode

_string_&nbsp;`string` _&rarr;_&nbsp;`string`

Decode STRING from unpadded base64.

```lisp
pact> (base64-decode "aGVsbG8gd29ybGQh")
"hello world!"
```

## base64-encode

_string_&nbsp;`string` _&rarr;_&nbsp;`string`

Encode STRING as unpadded base64.

```lisp
pact> (base64-encode "hello world!")
"aGVsbG8gd29ybGQh"
```

## bind

_src_&nbsp;`object:<{row}>` _binding_&nbsp;`binding:<{row}>` _&rarr;_&nbsp;`<a>`

Special form evaluates SRC to an object which is bound to with BINDINGS over
subsequent body statements.

```lisp
pact> (bind { "a": 1, "b": 2 } { "a" := a-value } a-value)
1
```

## chain-data

_&rarr;_&nbsp;`object:{public-chain-data}`

Get transaction public metadata. Returns an object with 'chain-id',
'block-height', 'block-time', 'prev-block-hash', 'sender', 'gas-limit',
'gas-price', and 'gas-fee' fields.

```lisp
pact> (chain-data)
{"block-height": 0,"block-time": "1970-01-01T00:00:00Z","chain-id": "","gas-limit": 0,"gas-price": 0.0,"prev-block-hash": "","sender": ""}
```

## compose

_x_&nbsp;`x:<a> -> <b>` _y_&nbsp;`x:<b> -> <c>` _value_&nbsp;`<a>`
_&rarr;_&nbsp;`<c>`

Compose X and Y, such that X operates on VALUE, and Y on the results of X.

```lisp
pact> (filter (compose (length) (< 2)) ["my" "dog" "has" "fleas"])
["dog" "has" "fleas"]
```

## concat

_str-list_&nbsp;`[string]` _&rarr;_&nbsp;`string`

Takes STR-LIST and concats each of the strings in the list, returning the
resulting string

```lisp
pact> (concat ["k" "d" "a"])
"kda"
pact> (concat (map (+ " ") (str-to-list "abcde")))
" a b c d e"
```

## constantly

_value_&nbsp;`<a>` _ignore1_&nbsp;`<b>` _&rarr;_&nbsp;`<a>`

_value_&nbsp;`<a>` _ignore1_&nbsp;`<b>` _ignore2_&nbsp;`<c>` _&rarr;_&nbsp;`<a>`

_value_&nbsp;`<a>` _ignore1_&nbsp;`<b>` _ignore2_&nbsp;`<c>`
_ignore3_&nbsp;`<d>` _&rarr;_&nbsp;`<a>`

Lazily ignore arguments IGNORE\* and return VALUE.

```lisp
pact> (filter (constantly true) [1 2 3])
[1 2 3]
```

## contains

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

## continue

_value_&nbsp;`*` _&rarr;_&nbsp;`*`

Continue a previously started nested defpact.

```lisp
(continue (coin.transfer-crosschain "bob" "alice" 10.0))
```

## define-namespace

_namespace_&nbsp;`string` _user-guard_&nbsp;`guard` _admin-guard_&nbsp;`guard`
_&rarr;_&nbsp;`string`

Create a namespace called NAMESPACE where ownership and use of the namespace is
controlled by GUARD. If NAMESPACE is already defined, then the guard previously
defined in NAMESPACE will be enforced, and GUARD will be rotated in its place.

```lisp
(define-namespace 'my-namespace (read-keyset 'user-ks) (read-keyset 'admin-ks))
```

Top level only: this function will fail if used in module code.

## describe-namespace

_ns_&nbsp;`string` _&rarr;_&nbsp;`object:{described-namespace}`

Describe the namespace NS, returning a row object containing the user and admin
guards of the namespace, as well as its name.

```lisp
(describe-namespace 'my-namespace)
```

Top level only: this function will fail if used in module code.

## distinct

_values_&nbsp;`[<a>]` _&rarr;_&nbsp;`[<a>]`

Returns from a homogeneous list of VALUES a list with duplicates removed. The
original order of the values is preserved.

```lisp
pact> (distinct [3 3 1 1 2 2])
[3 1 2]
```

## drop

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

## enforce

_test_&nbsp;`bool` _msg_&nbsp;`string` _&rarr;_&nbsp;`bool`

Fail transaction with MSG if pure expression TEST is false. Otherwise, returns
true.

```lisp
pact> (enforce (!= (+ 2 2) 4) "Chaos reigns")
<interactive>:0:0:Error: Chaos reigns
```

## enforce-one

_msg_&nbsp;`string` _tests_&nbsp;`[bool]` _&rarr;_&nbsp;`bool`

Run TESTS in order (in pure context, plus keyset enforces). If all fail, fail
transaction. Short-circuits on first success.

```lisp
pact> (enforce-one "Should succeed on second test" [(enforce false "Skip me") (enforce (= (+ 2 2) 4) "Chaos reigns")])
true
```

## enforce-pact-version

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

## enumerate

Use `enumerate` to return a sequence of numbers from the specified *`first`* number to the specified *`last`* number, inclusively, as a list. 

By default, the sequence increments by one from the *`first`* number to the *`last`* number. 
Optionally, you can specify an increment other than one to use between numbers in the sequence. 

If you specify a *`first`* number that’s greater than the *`last`* number, the sequence decrements by one from the *`first`* number to the *`last`* number.

### Basic syntax

To increment or decrement the sequence by one, use the following syntax:

```pact
enumerate *first* *last*
```

To specify a value to increment or decrement the sequence by, use the following syntax:

```pact
enumerate *first* *last inc*
```

### Arguments

Use the following arguments to define the beginning and end of the sequence you want to list using the `enumerate` Pact function.

| Argument | Type | Description |
| --- | --- | --- |
| `first` | integer | Specifies the first number in the sequence. |
| `last` | integer | Specifies the last number in the sequence. |

### Options

Use the following optional argument to define the increment to use between the beginning and end of the sequence in the `enumerate` Pact function.

| Option | Type | Description |
| --- | --- | --- |
| `inc` | integer | Specifies the increment to use between numbers in the sequence. The value can be a positive or negative integer. |

### Return values

The `enumerate` function returns the resulting sequence of numbers as a list.

### Examples

The following example enumerates a sequence of numbers using the default increment of one in the Pact REPL:

```pact
pact> (enumerate 0 10)
[0 1 2 3 4 5 6 7 8 9 10]
```

The following example enumerates a sequence of numbers using an increment of two between numbers in the sequence:

```pact
pact> (enumerate 0 10 2)
[0 2 4 6 8 10]
```

The following example illustrates decrementing a sequence of numbers using an `inc` value of -2 between numbers in the sequence:

```pact
pact> (enumerate 20 10 -2)
[20 18 16 14 12 10]
```

## filter

Use `filter` to filter a list of element by applying the specified criteria to each element in the list.
FEach element that matches the specified criteria—returning a result of `true`—is included in the resulting list with its original value.

### Basic syntax

To filter a list of elements, use the following syntax:

```pact
filter *apply-criteria* [list]
```

### Arguments

Use the following argument to define the criteria you want to use to filter the list of elements.

| Argument | Type | Description |
| --- | --- | --- |
| `apply-criteria` | integer | Specifies the criteria to apply to evaluate each element in a list. If the element matches the criteria applied, its value is included in the resulting list.|

### Return values

The `filter` function returns the list of elements matching the specified criteria.

### Examples

The following example composes a list of elements by evaluating the length of strings with less than two characters:

```pact
pact> (filter (compose (length) (< 2)) ["my" "dog" "has" "fleas"])
["dog" "has" "fleas"]
```

## fold

_app_&nbsp;`x:<a> y:<b> -> <a>` _init_&nbsp;`<a>` _list_&nbsp;`[<b>]`
_&rarr;_&nbsp;`<a>`

Iteratively reduce LIST by applying APP to last result and element, starting
with INIT.

```lisp
pact> (fold (+) 0 [100 10 5])
115
```

## format

_template_&nbsp;`string` _vars_&nbsp;`[*]` _&rarr;_&nbsp;`string`

Interpolate VARS into TEMPLATE using `{}`.

```lisp
pact> (format "My {} has {}" ["dog" "fleas"])
"My dog has fleas"
```

## hash

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

## identity

_value_&nbsp;`<a>` _&rarr;_&nbsp;`<a>`

Return provided value.

```lisp
pact> (map (identity) [1 2 3])
[1 2 3]
```

## if

_cond_&nbsp;`bool` _then_&nbsp;`<a>` _else_&nbsp;`<a>` _&rarr;_&nbsp;`<a>`

Test COND. If true, evaluate THEN. Otherwise, evaluate ELSE.

```lisp
pact> (if (= (+ 2 2) 4) "Sanity prevails" "Chaos reigns")
"Sanity prevails"
```

## int-to-str

_base_&nbsp;`integer` _val_&nbsp;`integer` _&rarr;_&nbsp;`string`

Represent integer VAL as a string in BASE. BASE can be 2-16, or 64 for unpadded
base64URL. Only positive values are allowed for base64URL conversion.

```lisp
pact> (int-to-str 16 65535)
"ffff"
pact> (int-to-str 64 43981)
"q80"
```

## is-charset

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

## length

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

## list

_elems_&nbsp;`*` _&rarr;_&nbsp;`[*]`

Create list from ELEMS. Deprecated in Pact 2.1.1 with literal list support.

```lisp
pact> (list 1 2 3)
[1 2 3]
```

## list-modules

_&rarr;_&nbsp;`[string]`

List modules available for loading.

Top level only: this function will fail if used in module code.

## make-list

_length_&nbsp;`integer` _value_&nbsp;`<a>` _&rarr;_&nbsp;`[<a>]`

Create list by repeating VALUE LENGTH times.

```lisp
pact> (make-list 5 true)
[true true true true true]
```

## map

_app_&nbsp;`x:<b> -> <a>` _list_&nbsp;`[<b>]` _&rarr;_&nbsp;`[<a>]`

Apply APP to each element in LIST, returning a new list of results.

```lisp
pact> (map (+ 1) [1 2 3])
[2 3 4]
```

## namespace

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

## pact-id

_&rarr;_&nbsp;`string`

Return ID if called during current pact execution, failing if not.

## pact-version

_&rarr;_&nbsp;`string`

Obtain current pact build version.

```lisp
pact> (pact-version)
"4.9"
```

Top level only: this function will fail if used in module code.

## public-chain-data

Schema type for data returned from 'chain-data'.

Fields: &nbsp;&nbsp;`chain-id:string` &nbsp;&nbsp;`block-height:integer`
&nbsp;&nbsp;`block-time:time` &nbsp;&nbsp;`prev-block-hash:string`
&nbsp;&nbsp;`sender:string` &nbsp;&nbsp;`gas-limit:integer`
&nbsp;&nbsp;`gas-price:decimal`

## read-decimal

_key_&nbsp;`string` _&rarr;_&nbsp;`decimal`

Parse KEY string or number value from top level of message data body as decimal.

```lisp
(defun exec ()
   (transfer (read-msg "from") (read-msg "to") (read-decimal "amount")))
```

## read-integer

_key_&nbsp;`string` _&rarr;_&nbsp;`integer`

Parse KEY string or number value from top level of message data body as integer.

```lisp
(read-integer "age")
```

## read-msg

_&rarr;_&nbsp;`<a>`

_key_&nbsp;`string` _&rarr;_&nbsp;`<a>`

Read KEY from top level of message data body, or data body itself if not
provided. Coerces value to their corresponding pact type: String -> string,
Number -> integer, Boolean -> bool, List -> list, Object -> object.

```lisp
(defun exec ()
   (transfer (read-msg "from") (read-msg "to") (read-decimal "amount")))
```

## read-string

_key_&nbsp;`string` _&rarr;_&nbsp;`string`

Parse KEY string or number value from top level of message data body as string.

```lisp
(read-string "sender")
```

## remove

_key_&nbsp;`string` _object_&nbsp;`object:<{o}>` _&rarr;_&nbsp;`object:<{o}>`

Remove entry for KEY from OBJECT.

```lisp
pact> (remove "bar" { "foo": 1, "bar": 2 })
{"foo": 1}
```

## resume

_binding_&nbsp;`binding:<{r}>` _&rarr;_&nbsp;`<a>`

Special form binds to a yielded object value from the prior step execution in a
pact. If yield step was executed on a foreign chain, enforce endorsement via
SPV.

## reverse

_list_&nbsp;`[<a>]` _&rarr;_&nbsp;`[<a>]`

Reverse LIST.

```lisp
pact> (reverse [1 2 3])
[3 2 1]
```

## sort

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

## str-to-int

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

## str-to-list

_str_&nbsp;`string` _&rarr;_&nbsp;`[string]`

Takes STR and returns a list of single character strings

```lisp
pact> (str-to-list "hello")
["h" "e" "l" "l" "o"]
pact> (concat (map (+ " ") (str-to-list "abcde")))
" a b c d e"
```

## take

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

## try

_default_&nbsp;`<a>` _action_&nbsp;`<a>` _&rarr;_&nbsp;`<a>`

Attempt a pure ACTION, returning DEFAULT in the case of failure. Pure
expressions are expressions which do not do i/o or work with non-deterministic
state in contrast to impure expressions such as reading and writing to a table.

```lisp
pact> (try 3 (enforce (= 1 2) "this will definitely fail"))
3
(expect "impure expression fails and returns default" "default" (try "default" (with-read accounts id {'ccy := ccy}) ccy))
```

## tx-hash

_&rarr;_&nbsp;`string`

Obtain hash of current transaction as a string.

```lisp
pact> (tx-hash)
"DldRwCblQ7Loqy6wYJnaodHl30d3j3eH-qtFzfEv46g"
```

## typeof

_x_&nbsp;`<a>` _&rarr;_&nbsp;`string`

Returns type of X as string.

```lisp
pact> (typeof "hello")
"string"
```

## where

_field_&nbsp;`string` _app_&nbsp;`x:<a> -> bool` _value_&nbsp;`object:<{row}>`
_&rarr;_&nbsp;`bool`

Utility for use in 'filter' and 'select' applying APP to FIELD in VALUE.

```lisp
pact> (filter (where 'age (> 20)) [{'name: "Mary",'age: 30} {'name: "Juan",'age: 15}])
[{"name": "Juan","age": 15}]
```

## yield

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

## zip

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
