---
title: Temporal Operators
description:
  Pact comes equipped with the ability for smart contract authors to express and
  automatically check properties -- or, specifications -- of Pact programs.
menu: Temporal Operators
label: Temporal Operators
order: 8
layout: full
---

# Temporal operators

### add-time

```pact
(add-time t s)
```

- takes `t`: `time`
- takes `s`: _a_
- produces `time`
- where _a_ is of type `integer` or `decimal`

Add seconds to a time

Supported in either invariants or properties.
