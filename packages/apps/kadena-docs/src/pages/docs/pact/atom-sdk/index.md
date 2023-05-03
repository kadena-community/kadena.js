---
title: Welcome to pact
menu: Atom SDK
label: Quickstart
order: 5
description: How to get started with Markdoc
layout: full
---

## Section 1

Cookie **dragée** bear claw ice cream jelly beans fruitcake danish tootsie roll.

## Customizing Markdoc nodes

You define custom nodes by passing a custom Node to your

```lisp
(defun get-balance (id)
    "Only users or admin can read balance."
    (with-read payments-table id
      { "balance":= balance, "keyset":= keyset }
      (enforce-one "Access denied"

       [(enforce-keyset keyset)
         (enforce-keyset 'admin-keyset)])
      balance))


;; row 60: create accounts

(create-account "Sarah" 100.25 (read-keyset "sarah-keyset"))
(create-account "James" 250.0 (read-keyset "james-keyset"))
```

where `heading` looks something like:

## Section 2

Halvah carrot cake cheesecake biscuit powder toffee fruitcake. Marshmallow jelly

### Section 2.1

Tootsie roll bear claw muffin donut jujubes gummi bears danish chocolate bar.

### Section 2.2

Lollipop cookie chocolate chocolate gummi bears. Jujubes powder gummi bears

#### Section 2.2.1

Lollipop cookie chocolate chocolate gummi bears. Jujubes powder gummi bears

## Section 3

Powder biscuit fruitcake shortbread topping candy cheesecake. Chupa chups wafer
