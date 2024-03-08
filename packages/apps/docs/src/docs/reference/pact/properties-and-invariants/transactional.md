---
title: Transactional Operators
description:
  Pact comes equipped with the ability for smart contract authors to express and
  automatically check properties -- or, specifications -- of Pact programs.
menu: Transactional Operators
label: Transactional Operators
order: 10
layout: full
tags:
  ['pact', 'language reference', 'transactional operators', 'pact operators']
---

# Transactional operators

## abort

```pact
abort
```

- of type `bool`

Whether the transaction aborts. This function is only useful when expressing
propositions that do not assume transaction success. Propositions defined via
`property` implicitly assume transaction success. We will be adding a new mode
in which to use this feature in the future -- please let us know if you need
this functionality.

Supported in properties only.

## success

```pact
success
```

- of type `bool`

Whether the transaction succeeds. This function is only useful when expressing
propositions that do not assume transaction success. Propositions defined via
`property` implicitly assume transaction success. We will be adding a new mode
in which to use this feature in the future -- please let us know if you need
this functionality.

Supported in properties only.

## governance-passes

```pact
governance-passes
```

- of type `bool`

Whether the governance predicate passes. For keyset-based governance, this is
the same as something like `(authorized-by 'governance-ks-name)`. Pact's
property checking system currently does not analyze the body of a capability
when it is used for governance due to challenges around capabilities making DB
modifications -- the system currently assumes that a capability-based governance
predicate is equally capable of succeeding or failing. This feature allows
describing the scenarios where the predicate passes or fails.

Supported in properties only.

## result

```pact
result
```

- of type _r_
- where _r_ is _any type_

The return value of the function under test

Supported in properties only.
