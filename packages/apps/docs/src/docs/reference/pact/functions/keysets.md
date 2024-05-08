---
title: Keysets
description:
  This document is a reference for the Pact smart-contract language, designed
  for correct, transactional execution on a high-performance blockchain.
menu: Keysets
label: Keysets
order: 5
layout: full
tags: ['pact', 'language reference', 'keysets']
---

# Keysets

## define-keyset

_name_&nbsp;`string` _keyset_&nbsp;`string` _&rarr;_&nbsp;`string`

_name_&nbsp;`string` _&rarr;_&nbsp;`string`

Define keyset as NAME with KEYSET, or if unspecified, read NAME from message
payload as keyset, similarly to 'read-keyset'. If keyset NAME already exists,
keyset will be enforced before updating to new value.

```pact
(define-keyset 'admin-keyset (read-keyset "keyset"))
```

Top level only: this function will fail if used in module code.

## enforce-keyset

_guard_&nbsp;`guard` _&rarr;_&nbsp;`bool`

_keysetname_&nbsp;`string` _&rarr;_&nbsp;`bool`

Execute GUARD, or defined keyset KEYSETNAME, to enforce desired predicate logic.

```pact
(enforce-keyset 'admin-keyset)
(enforce-keyset row-guard)
```

## keys-2

_count_&nbsp;`integer` _matched_&nbsp;`integer` _&rarr;_&nbsp;`bool`

Keyset predicate function to match at least 2 keys in keyset.

```pact
pact> (keys-2 3 1)
false
```

## keys-all

_count_&nbsp;`integer` _matched_&nbsp;`integer` _&rarr;_&nbsp;`bool`

Keyset predicate function to match all keys in keyset.

```pact
pact> (keys-all 3 3)
true
```

## keys-any

_count_&nbsp;`integer` _matched_&nbsp;`integer` _&rarr;_&nbsp;`bool`

Keyset predicate function to match any (at least 1) key in keyset.

```pact
pact> (keys-any 10 1)
true
```

## read-keyset

_key_&nbsp;`string` _&rarr;_&nbsp;`keyset`

Read KEY from message data body as keyset
`({ "keys": KEYLIST, "pred": PREDFUN })`. PREDFUN should resolve to a keys
predicate.

```pact
(read-keyset "admin-keyset")
```
