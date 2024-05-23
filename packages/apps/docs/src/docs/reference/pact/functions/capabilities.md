---
title: Capabilities
description:
  This document is a reference for the Pact smart-contract language, designed
  for correct, transactional execution on a high-performance blockchain.
menu: Capabilities
label: Capabilities
order: 6
layout: full
tags: ['pact', 'language reference', 'capabilities']
---

# Capabilities

## compose-capability

_capability_&nbsp;` -> bool` _&rarr;_&nbsp;`bool`

Specifies and requests grant of CAPABILITY which is an application of a 'defcap'
production, only valid within a (distinct) 'defcap' body, as a way to compose
CAPABILITY with the outer capability such that the scope of the containing
'with-capability' call will "import" this capability. Thus, a call to
'(with-capability (OUTER-CAP) OUTER-BODY)', where the OUTER-CAP defcap calls
'(compose-capability (INNER-CAP))', will result in INNER-CAP being granted in
the scope of OUTER-BODY.

```pact
(compose-capability (TRANSFER src dest))
```

## emit-event

_capability_&nbsp;` -> bool` _&rarr;_&nbsp;`bool`

Emit CAPABILITY as event without evaluating body of capability. Fails if
CAPABILITY is not @managed or @event.

```pact
(emit-event (TRANSFER "Bob" "Alice" 12.0))
```

## enforce-guard

_guard_&nbsp;`guard` _&rarr;_&nbsp;`bool`

_keysetname_&nbsp;`string` _&rarr;_&nbsp;`bool`

Execute GUARD, or defined keyset KEYSETNAME, to enforce desired predicate logic.

```pact
(enforce-guard 'admin-keyset)
(enforce-guard row-guard)
```

## install-capability

_capability_&nbsp;` -> bool` _&rarr;_&nbsp;`string`

Specifies, and provisions install of, a _managed_ CAPABILITY, defined in a
'defcap' in which a '@managed' tag designates a single parameter to be managed
by a specified function. After install, CAPABILITY must still be brought into
scope using 'with-capability', at which time the 'manager function' is invoked
to validate the request. The manager function is of type 'managed:<p>
requested:<p> -> <p>', where '<p>' indicates the type of the managed parameter,
such that for '(defcap FOO (bar:string baz:integer) @managed baz FOO-mgr ...)',
the manager function would be '(defun FOO-mgr:integer (managed:integer
requested:integer) ...)'. Any capability matching the 'static' (non-managed)
parameters will cause this function to be invoked with the current managed value
and that of the requested capability. The function should perform whatever
logic, presumably linear, to validate the request, and return the new managed
value representing the 'balance' of the request. NOTE that signatures scoped to
a managed capability cause the capability to be automatically provisioned for
install similarly to one installed with this function.

```pact
(install-capability (PAY "alice" "bob" 10.0))
```

## require-capability

_capability_&nbsp;` -> bool` _&rarr;_&nbsp;`bool`

Specifies and tests for existing grant of CAPABILITY, failing if not found in
environment.

```pact
(require-capability (TRANSFER src dest))
```

## with-capability

_capability_&nbsp;` -> bool` _body_&nbsp;`[*]` _&rarr;_&nbsp;`<a>`

Specifies and requests grant of _acquired_ CAPABILITY which is an application of
a 'defcap' production. Given the unique token specified by this application,
ensure that the token is granted in the environment during execution of BODY.
'with-capability' can only be called in the same module that declares the
corresponding 'defcap', otherwise module-admin rights are required. If token is
not present, the CAPABILITY is evaluated, with successful completion resulting
in the installation/granting of the token, which will then be revoked upon
completion of BODY. Nested 'with-capability' calls for the same token will
detect the presence of the token, and will not re-apply CAPABILITY, but simply
execute BODY. 'with-capability' cannot be called from within an evaluating
defcap. Acquire of a managed capability results in emission of the equivalent
event.

```pact
(with-capability (UPDATE-USERS id) (update users id { salary: new-salary }))
```
