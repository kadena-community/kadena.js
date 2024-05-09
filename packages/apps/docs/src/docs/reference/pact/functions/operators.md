---
title: Operators
description:
  This document is a reference for the Pact smart-contract language, designed
  for correct, transactional execution on a high-performance blockchain.
menu: Operators
label: Operators
order: 4
layout: full
tags: ['pact', 'language reference', 'operators']
---

# Operators

## !=

_x_&nbsp;`<a[integer,string,time,decimal,bool,[<l>],object:<{o}>,keyset,guard,module{}]>`
_y_&nbsp;`<a[integer,string,time,decimal,bool,[<l>],object:<{o}>,keyset,guard,module{}]>`
_&rarr;_&nbsp;`bool`

True if X does not equal Y.

```bash
pact> (!= "hello" "goodbye")
true
```

## &

_x_&nbsp;`integer` _y_&nbsp;`integer` _&rarr;_&nbsp;`integer`

Compute bitwise X and Y.

```bash
pact> (& 2 3)
2
pact> (& 5 -7)
1
```

## \*

_x_&nbsp;`<a[integer,decimal]>` _y_&nbsp;`<a[integer,decimal]>`
_&rarr;_&nbsp;`<a[integer,decimal]>`

_x_&nbsp;`<a[integer,decimal]>` _y_&nbsp;`<b[integer,decimal]>`
_&rarr;_&nbsp;`decimal`

Multiply X by Y.

```bash
pact> (* 0.5 10.0)
5.0
pact> (* 3 5)
15
```

## \+

_x_&nbsp;`<a[integer,decimal]>` _y_&nbsp;`<a[integer,decimal]>`
_&rarr;_&nbsp;`<a[integer,decimal]>`

_x_&nbsp;`<a[integer,decimal]>` _y_&nbsp;`<b[integer,decimal]>`
_&rarr;_&nbsp;`decimal`

_x_&nbsp;`<a[string,[<l>],object:<{o}>]>`
_y_&nbsp;`<a[string,[<l>],object:<{o}>]>`
_&rarr;_&nbsp;`<a[string,[<l>],object:<{o}>]>`

Add numbers, concatenate strings/lists, or merge objects.

```bash
pact> (+ 1 2)
3
pact> (+ 5.0 0.5)
5.5
pact> (+ "every" "body")
"everybody"
pact> (+ [1 2] [3 4])
[1 2 3 4]
pact> (+ { "foo": 100 } { "foo": 1, "bar": 2 })
{"bar": 2,"foo": 100}
```

## \-

_x_&nbsp;`<a[integer,decimal]>` _y_&nbsp;`<a[integer,decimal]>`
_&rarr;_&nbsp;`<a[integer,decimal]>`

_x_&nbsp;`<a[integer,decimal]>` _y_&nbsp;`<b[integer,decimal]>`
_&rarr;_&nbsp;`decimal`

_x_&nbsp;`<a[integer,decimal]>` _&rarr;_&nbsp;`<a[integer,decimal]>`

Negate X, or subtract Y from X.

```bash
pact> (- 1.0)
-1.0
pact> (- 3 2)
1
```

## /

_x_&nbsp;`<a[integer,decimal]>` _y_&nbsp;`<a[integer,decimal]>`
_&rarr;_&nbsp;`<a[integer,decimal]>`

_x_&nbsp;`<a[integer,decimal]>` _y_&nbsp;`<b[integer,decimal]>`
_&rarr;_&nbsp;`decimal`

Divide X by Y.

```bash
pact> (/ 10.0 2.0)
5.0
pact> (/ 8 3)
2
```

## \<

_x_&nbsp;`<a[integer,decimal,string,time]>`
_y_&nbsp;`<a[integer,decimal,string,time]>` _&rarr;_&nbsp;`bool`

True if X < Y.

```bash
pact> (< 1 3)
true
pact> (< 5.24 2.52)
false
pact> (< "abc" "def")
true
```

## \<=

_x_&nbsp;`<a[integer,decimal,string,time]>`
_y_&nbsp;`<a[integer,decimal,string,time]>` _&rarr;_&nbsp;`bool`

True if X \<= Y.

```bash
pact> (<= 1 3)
true
pact> (<= 5.24 2.52)
false
pact> (<= "abc" "def")
true
```

## \=

_x_&nbsp;`<a[integer,string,time,decimal,bool,[<l>],object:<{o}>,keyset,guard,module{}]>`
_y_&nbsp;`<a[integer,string,time,decimal,bool,[<l>],object:<{o}>,keyset,guard,module{}]>`
_&rarr;_&nbsp;`bool`

Compare alike terms for equality, returning TRUE if X is equal to Y. Equality
comparisons will fail immediately on type mismatch, or if types are not value
types.

```bash
pact> (= [1 2 3] [1 2 3])
true
pact> (= 'foo "foo")
true
pact> (= { 'a: 2 } { 'a: 2})
true
```

## >

_x_&nbsp;`<a[integer,decimal,string,time]>`
_y_&nbsp;`<a[integer,decimal,string,time]>` _&rarr;_&nbsp;`bool`

True if X > Y.

```bash
pact> (> 1 3)
false
pact> (> 5.24 2.52)
true
pact> (> "abc" "def")
false
```

## >=

_x_&nbsp;`<a[integer,decimal,string,time]>`
_y_&nbsp;`<a[integer,decimal,string,time]>` _&rarr;_&nbsp;`bool`

True if X >= Y.

```bash
pact> (>= 1 3)
false
pact> (>= 5.24 2.52)
true
pact> (>= "abc" "def")
false
```

## ^

_x_&nbsp;`<a[integer,decimal]>` _y_&nbsp;`<a[integer,decimal]>`
_&rarr;_&nbsp;`<a[integer,decimal]>`

_x_&nbsp;`<a[integer,decimal]>` _y_&nbsp;`<b[integer,decimal]>`
_&rarr;_&nbsp;`decimal`

Raise X to Y power.

```bash
pact> (^ 2 3)
8
```

## abs

_x_&nbsp;`decimal` _&rarr;_&nbsp;`decimal`

_x_&nbsp;`integer` _&rarr;_&nbsp;`integer`

Absolute value of X.

```bash
pact> (abs (- 10 23))
13
```

## and

_x_&nbsp;`bool` _y_&nbsp;`bool` _&rarr;_&nbsp;`bool`

Boolean logic with short-circuit.

```bash
pact> (and true false)
false
```

## and?

_a_&nbsp;`x:<r> -> bool` _b_&nbsp;`x:<r> -> bool` _value_&nbsp;`<r>`
_&rarr;_&nbsp;`bool`

Apply logical 'and' to the results of applying VALUE to A and B, with
short-circuit.

```bash
pact> (and? (> 20) (> 10) 15)
false
```

## ceiling

_x_&nbsp;`decimal` _prec_&nbsp;`integer` _&rarr;_&nbsp;`decimal`

_x_&nbsp;`decimal` _&rarr;_&nbsp;`integer`

Rounds up value of decimal X as integer, or to PREC precision as decimal.

```bash
pact> (ceiling 3.5)
4
pact> (ceiling 100.15234 2)
100.16
```

## dec

_x_&nbsp;`integer` _&rarr;_&nbsp;`decimal`

Cast an integer to a decimal value of integer X as decimal.

```bash
pact> (dec 3)
3.0
```

## exp

_x_&nbsp;`<a[integer,decimal]>` _&rarr;_&nbsp;`<a[integer,decimal]>`

Exp of X.

```bash
pact> (round (exp 3) 6)
20.085537
```

## floor

_x_&nbsp;`decimal` _prec_&nbsp;`integer` _&rarr;_&nbsp;`decimal`

_x_&nbsp;`decimal` _&rarr;_&nbsp;`integer`

Rounds down value of decimal X as integer, or to PREC precision as decimal.

```bash
pact> (floor 3.5)
3
pact> (floor 100.15234 2)
100.15
```

## ln

_x_&nbsp;`<a[integer,decimal]>` _&rarr;_&nbsp;`<a[integer,decimal]>`

Natural log of X.

```bash
pact> (round (ln 60) 6)
4.094345
```

## log

_x_&nbsp;`<a[integer,decimal]>` _y_&nbsp;`<a[integer,decimal]>`
_&rarr;_&nbsp;`<a[integer,decimal]>`

_x_&nbsp;`<a[integer,decimal]>` _y_&nbsp;`<b[integer,decimal]>`
_&rarr;_&nbsp;`decimal`

Log of Y base X.

```bash
pact> (log 2 256)
8
```

## mod

_x_&nbsp;`integer` _y_&nbsp;`integer` _&rarr;_&nbsp;`integer`

X modulo Y.

```bash
pact> (mod 13 8)
5
```

## not

_x_&nbsp;`bool` _&rarr;_&nbsp;`bool`

Boolean not.

```bash
pact> (not (> 1 2))
true
```

## not?

_app_&nbsp;`x:<r> -> bool` _value_&nbsp;`<r>` _&rarr;_&nbsp;`bool`

Apply logical 'not' to the results of applying VALUE to APP.

```bash
pact> (not? (> 20) 15)
false
```

## or

_x_&nbsp;`bool` _y_&nbsp;`bool` _&rarr;_&nbsp;`bool`

Boolean logic with short-circuit.

```bash
pact> (or true false)
true
```

## or?

_a_&nbsp;`x:<r> -> bool` _b_&nbsp;`x:<r> -> bool` _value_&nbsp;`<r>`
_&rarr;_&nbsp;`bool`

Apply logical 'or' to the results of applying VALUE to A and B, with
short-circuit.

```bash
pact> (or? (> 20) (> 10) 15)
true
```

## round

_x_&nbsp;`decimal` _prec_&nbsp;`integer` _&rarr;_&nbsp;`decimal`

_x_&nbsp;`decimal` _&rarr;_&nbsp;`integer`

Performs Banker's rounding value of decimal X as integer, or to PREC precision
as decimal.

```bash
pact> (round 3.5)
4
pact> (round 100.15234 2)
100.15
```

## shift

_x_&nbsp;`integer` _y_&nbsp;`integer` _&rarr;_&nbsp;`integer`

Shift X Y bits left if Y is positive, or right by -Y bits otherwise. Right
shifts perform sign extension on signed number types; i.e. they fill the top
bits with 1 if the x is negative and with 0 otherwise.

```bash
pact> (shift 255 8)
65280
pact> (shift 255 -1)
127
pact> (shift -255 8)
-65280
pact> (shift -255 -1)
-128
```

## sqrt

_x_&nbsp;`<a[integer,decimal]>` _&rarr;_&nbsp;`<a[integer,decimal]>`

Square root of X.

```bash
pact> (sqrt 25)
5.0
```

## xor

_x_&nbsp;`integer` _y_&nbsp;`integer` _&rarr;_&nbsp;`integer`

Compute bitwise X xor Y.

```bash
pact> (xor 127 64)
63
pact> (xor 5 -7)
-4
```

## |

_x_&nbsp;`integer` _y_&nbsp;`integer` _&rarr;_&nbsp;`integer`

Compute bitwise X or Y.

```bash
pact> (| 2 3)
3
pact> (| 5 -7)
-3
```

## ~

_x_&nbsp;`integer` _&rarr;_&nbsp;`integer`

Reverse all bits in X.

```bash
pact> (~ 15)
-16
```
