---
title: Guards
description:
  This document is a reference for the Pact smart-contract language, designed
  for correct, transactional execution on a high-performance blockchain.
menu: Guards
label: Guards
order: 9
layout: full
tags: ['pact', 'language reference', 'guards']
---

# Guards

## create-capability-guard

_capability_&nbsp;` -> bool` _&rarr;_&nbsp;`guard`

Creates a guard that will enforce that CAPABILITY is acquired.

```pact
(create-capability-guard (BANK_DEBIT 10.0))
```

## create-capability-pact-guard

_capability_&nbsp;` -> bool` _&rarr;_&nbsp;`guard`

Creates a guard that will enforce that CAPABILITY is acquired and that the
currently-executing defpact is operational.

```pact
(create-capability-pact-guard (ESCROW owner))
```

## create-module-guard

_name_&nbsp;`string` _&rarr;_&nbsp;`guard`

Defines a guard by NAME that enforces the current module admin predicate.

## create-pact-guard

_name_&nbsp;`string` _&rarr;_&nbsp;`guard`

Defines a guard predicate by NAME that captures the results of 'pact-id'. At
enforcement time, the success condition is that at that time 'pact-id' must
return the same value. In effect this ensures that the guard will only succeed
within the multi-transaction identified by the pact id.

## create-principal

_guard_&nbsp;`guard` _&rarr;_&nbsp;`string`

Create a principal which unambiguously identifies GUARD.

```pact
(create-principal (read-keyset 'keyset))
(create-principal (keyset-ref-guard 'keyset))
(create-principal (create-module-guard 'module-guard))
(create-principal (create-user-guard 'user-guard))
(create-principal (create-pact-guard 'pact-guard))
```

## create-user-guard

_closure_&nbsp;` -> bool` _&rarr;_&nbsp;`guard`

Defines a custom guard CLOSURE whose arguments are strictly evaluated at
definition time, to be supplied to indicated function at enforcement time.

## is-principal

_principal_&nbsp;`string` _&rarr;_&nbsp;`bool`

Tell whether PRINCIPAL string conforms to the principal format without proving
validity.

```pact
(enforce   (is-principal 'k:462e97a099987f55f6a2b52e7bfd52a36b4b5b470fed0816a3d9b26f9450ba69)   "Invalid account structure: non-principal account")
```

## keyset-ref-guard

_keyset-ref_&nbsp;`string` _&rarr;_&nbsp;`guard`

Creates a guard for the keyset registered as KEYSET-REF with 'define-keyset'.
Concrete keysets are themselves guard types; this function is specifically to
store references alongside other guards in the database, etc.

## typeof-principal

_principal_&nbsp;`string` _&rarr;_&nbsp;`string`

Return the protocol type of a given PRINCIPAL value. If input value is not a
principal type, then the empty string is returned.

```pact
(typeof-principal 'k:462e97a099987f55f6a2b52e7bfd52a36b4b5b470fed0816a3d9b26f9450ba69)
```

## validate-principal

_guard_&nbsp;`guard` _principal_&nbsp;`string` _&rarr;_&nbsp;`bool`

Validate that PRINCIPAL unambiguously identifies GUARD.

```pact
(enforce (validate-principal (read-keyset 'keyset) account) "Invalid account ID")
```
