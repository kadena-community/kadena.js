---
title: Syntax and keywords
description:
  This document is a reference for the Pact smart-contract language, designed
  for correct, transactional execution on a high-performance blockchain.
menu: Syntax and keywords
label: Syntax and keywords
order: 4
layout: full
tags: ['pact', 'language reference', 'syntax']
---

# Syntax

## Literals

### Strings

String literals are created with double-ticks:

```pact
pact> "a string"
"a string"
```

Strings also support multiline by putting a backslash before and after
whitespace (not interactively).

```pact
(defun id (a)
  "Identity function. \
  \Argument is returned."
  a)
```

### Symbols

Symbols are string literals representing some unique item in the runtime, like a
function or a table name. Their representation internally is simply a string
literal so their usage is idiomatic.

Symbols are created with a preceding tick, thus they do not support whitespace
nor multiline syntax.

```bash
pact> 'a-symbol
"a-symbol"
```

### Integers

Integer literals are unbounded, and can be positive or negative.

```bash
pact> 12345
12345
pact> -922337203685477580712387461234
-922337203685477580712387461234
```

### Decimals

Decimal literals have potentially unlimited precision.

```bash
pact> 100.25
100.25
pact> -356452.234518728287461023856582382983746
-356452.234518728287461023856582382983746
```

### Booleans

Booleans are represented by `true` and `false` literals.

```bash
pact> (and true false)
false
```

### Lists

List literals are created with brackets, and optionally separated with commas.
Uniform literal lists are given a type in parsing.

```bash
pact> [1 2 3]
[1 2 3]
pact> [1,2,3]
[1 2 3]
pact> (typeof [1 2 3])
"[integer]"
pact> (typeof [1 2 true])
"list"
```

### Objects

Objects are dictionaries, created with curly-braces specifying key-value pairs
using a colon `:`. For certain applications (database updates), keys must be
strings.

```bash
pact> { "foo": (+ 1 2), "bar": "baz" }
{ "foo": 3, "bar": "baz" }
```

### Bindings

Bindings are dictionary-like forms, also created with curly braces, to bind
database results to variables using the `:=` operator. They are used in
[with-read](/pact/reference/functions/database#with-readh866473533),
[with-default-read](/pact/reference/functions/database#with-default-readh1087687497),
[bind](/pact/reference/functions#bindh3023933) and
[resume](/pact/reference/functions#resumeh-934426579) to assign variables to
named columns in a row, or values in an object.

```pact
(defun check-balance (id)
  (with-read accounts id { "balance" := bal }
    (enforce (> bal 0) (format "Account in overdraft: {}" [bal]))))
```

### Lambdas

Lambdas, or "anonymous functions", allow defining functions to be applied in
local scope, as opposed to defining functions at top-level with `defun.`

Lambdas are supported in `let`, `let*`, and as inline arguments to built-in
function applications.

```pact
  ; identity function
  (let ((f (lambda (x) x))) (f a))
  ; native example
  (let ((f (lambda (x) x))) (map (f) [1 2 3]))
  ; Inline native example:
  (map (lambda (x) x) [1 2 3])
```

## Type specifiers

Types can be specified in syntax with the colon `:` operator followed by a type
literal or user type specification.

### Type literals

- `string`
- `integer`
- `decimal`
- `bool`
- `time`
- `keyset`
- `list`, or `[type]` to specify the list type
- `object`, which can be further typed with a schema
- `table`, which can be further typed with a schema
- `module`, which must be further typed with required interfaces.

### Schema type literals

A schema defined with [defschema](/pact/reference/syntax#defschemah-1003560474)
is referenced by name enclosed in curly braces.

```pact
table:{accounts}
object:{person}
```

### Module type literals

[Module references](/pact/reference/concepts#modrefs-and-polymorphismh83727950)
are specified by the interfaces they demand as a comma-delimited list.

```pact
module:{fungible-v2,user.votable}
```

## Dereference operator

The dereference operator `::` allows a member of an interface specified in the
type of a
[module reference](/pact/reference/concepts#modrefs-and-polymorphismh83727950)
to be invoked at run-time.

```pact
(interface baz
  (defun quux:bool (a:integer b:string))
  (defconst ONE 1)
  )
...
(defun foo (bar:module{baz})
  (bar::quux 1 "hi") ;; invokes 'quux' on whatever module is passed in
  bar::ONE             ;; directly references interface const
)
```

### What can be typed

#### Function arguments and return types

```pact
(defun prefix:string (pfx:string str:string) (+ pfx str))
```

#### Let variables

```pact
(let ((a:integer 1) (b:integer 2)) (+ a b))
```

#### Tables and objects

Tables and objects can only take a schema type literal.

```pact
(deftable accounts:{account})

(defun get-order:{order} (id) (read orders id))
```

#### Consts

```pact
(defconst PENNY:decimal 0.1)
```

## Special forms

### Docs and Metadata

Many special forms like [defun](/pact/reference/syntax#defunh95462750) accept
optional documentation strings, in the following form:

```pact
(defun average (a b)
  "take the average of a and b"
  (/ (+ a b) 2))
```

Alternately, users can specify metadata using a special `@`-prefix syntax.
Supported metadata fields are `@doc` to provide a documentation string, and
`@model` that can be used by Pact tooling to verify the correctness of the
implementation:

```pact
(defun average (a b)
  @doc   "take the average of a and b"
  @model (property (= (+ a b) (* 2 result)))
  (/ (+ a b) 2))
```

Indeed, a bare docstring like `"foo"` is actually just a short form for
`@doc "foo"`.

Specific information on _Properties_ can be found in
[The Pact Property Checking System](/pact/reference/property-checking).

### bless

```bash
(bless HASH)
```

Within a module declaration, bless a previous version of that module as
identified by HASH. See
[Dependency management](/pact/reference/concepts#dependency-managementh304790584)
for a discussion of the blessing mechanism.

```pact
(module provider 'keyset
  (bless "ZHD9IZg-ro1wbx7dXi3Fr-CVmA-Pt71Ov9M1UNhzAkY")
  (bless "bctSHEz4N5Y1XQaic6eOoBmjty88HMMGfAdQLPuIGMw")
  ...
)
```

### defun

```pact
(defun NAME ARGLIST [DOC-OR-META] BODY...)
```

Define NAME as a function, accepting ARGLIST arguments, with optional
DOC-OR-META. Arguments are in scope for BODY, one or more expressions.

```pact
(defun add3 (a b c) (+ a (+ b c)))

(defun scale3 (a b c s)
  "multiply sum of A B C times s"
  (* s (add3 a b c)))
```

### defcap

```pact
(defcap NAME ARGLIST [DOC] BODY...)
```

Define NAME as a capability, specified using ARGLIST arguments, with optional
DOC. A `defcap` models a capability token which will be stored in the
environment to represent some ability or right. Code in BODY is only called
within special capability-related functions `with-capability` and
`compose-capability` when the token as parameterized by the arguments supplied
is not found in the environment. When executed, arguments are in scope for BODY,
one or more expressions.

```pact
(defcap USER_GUARD (user)
  "Enforce user account guard
  (with-read accounts user
    { "guard": guard }
    (enforce-guard guard)))
```

### defconst

```pact
(defconst NAME VALUE [DOC-OR-META])
```

Define NAME as VALUE, with option DOC-OR-META. Value is evaluated upon module
load and "memoized".

```pact
(defconst COLOR_RED="#FF0000" "Red in hex")
(defconst COLOR_GRN="#00FF00" "Green in hex")
(defconst PI 3.14159265 "Pi to 8 decimals")
```

### defpact

```
(defpact NAME ARGLIST [DOC-OR-META] STEPS...)
```

Define NAME as a _pact_, a computation comprised of multiple steps that occur in
distinct transactions. Identical to
[defun](/pact/reference/syntax#defunh95462750) except body must be comprised of
[steps](/pact/reference/syntax#steph3540684) to be executed in strict sequential
order.

```pact
(defpact payment (payer payer-entity payee
                  payee-entity amount)
  (step-with-rollback payer-entity
    (debit payer amount)
    (credit payer amount))
  (step payee-entity
    (credit payee amount)))
```

Defpacts may be nested (though the recursion restrictions apply, so it must be a
different defpact). They may be executed like a regular function call within a
defpact, but are continued after the first step by calling `continue` with the
same arguments.

As such, they have the following restrictions:

- The number of steps of the child must match the number of steps of the parent.
- If a parent defpact step has the rollback field, so must the child. If parent
  steps roll back, so do child steps.
- `continue` must be called with the same continuation arguments as the defpact
  originally dispatched, to support multiple nested defpacts of the same
  function but with different arguments.

The following example shows well-formed defpacts with equal number of steps,
nested rollbacks and continue:

```pact
(defpact payment (payer payee amount)
  (step-with-rollback
    (debit payer amount)
    (credit payer amount))
  (step payee-entity
    (credit payee amount)))

...
(defpact split-payment (payer payee1 payee2 amount ratio)
  (step-with-rollback
    (let
      ((payment1 (payment payer payee1 (* amount ratio)))
      (payment2 (payment payer payee2 (* amount (- 1 ratio))))
      )
      "step 0 complete"
    )
    (let
      ((payment1 (continue (payment payer payee1 (* amount ratio))))
       (payment2 (continue (payment payer payee2 (* amount (- 1 ratio)))))
      )
      "step 0 rolled back"
    )
  )
  (step
    (let
      ((payment1 (continue (payment payer payee1 (* amount ratio))))
       (payment2 (continue (payment payer payee2 (* amount (- 1 ratio)))))
      )
      "step 1 complete"
    )
  )
)
```

### defschema

```pact
(defschema NAME [DOC-OR-META] FIELDS...)
```

Define NAME as a _schema_, which specifies a list of FIELDS. Each field is in
the form `FIELDNAME[:FIELDTYPE]`.

```pact
(defschema accounts
  "Schema for accounts table".
  balance:decimal
  amount:decimal
  ccy:string
  data)
```

### deftable

```pact
(deftable NAME[:SCHEMA] [DOC-OR-META])
```

Define NAME as a _table_, used in database functions. Note the table must still
be created with
[create-table](/pact/reference/functions/database#create-tableh447366077).

### let

```pact
(let (BINDPAIR [BINDPAIR [...]]) BODY)
```

Bind variables in BINDPAIRs to be in scope over BODY. Variables within BINDPAIRs
cannot refer to previously-declared variables in the same let binding; for this
use [let\*](/pact/reference/syntax#leth3318127).

```pact
(let ((x 2)
      (y 5))
  (* x y))
> 10
```

### let\*

```pact
(let* (BINDPAIR [BINDPAIR [...]]) BODY)
```

Bind variables in BINDPAIRs to be in scope over BODY. Variables can reference
previously declared BINDPAIRS in the same let. `let*` is expanded at
compile-time to nested `let` calls for each BINDPAIR; thus `let` is preferred
where possible.

```pact
(let* ((x 2)
       (y (* x 10)))
  (+ x y))
> 22
```

### cond;

```pact
(cond (TEST BRANCH) [(TEST2 BRANCH2) [...]] ELSE-BRANCH)
```

Special form/sugar to produce a series of "if-elseif-else" expressions, such
that if TEST1 passes, BRANCH1 is evaluated, otherwise followed by evaluating
TEST2 -> BRANCH2 etc. ELSE-BRANCH is evaluated if all tests fail.

`cond` is syntactically expanded such that

```pact
(cond
   (a b)
   (c d)
   (e f)
   g)
```

is expanded to:

```pact
(if a b (if c d (if e f g)))
```

### step

```pact
(step EXPR)
(step ENTITY EXPR)
```

Define a step within a [defpact](/pact/reference/syntax#defpacth1545231271),
such that any prior steps will be executed in prior transactions, and later
steps in later transactions. Including an ENTITY argument indicates that this
step is intended for confidential transactions. Therefore, only the ENTITY would
execute the step, and other participants would "skip" it.

### step-with-rollback

```pact
(step-with-rollback EXPR ROLLBACK-EXPR)
(step-with-rollback ENTITY EXPR ROLLBACK-EXPR)
```

Define a step within a [defpact](/pact/reference/syntax#defpacth1545231271)
similarly to [step](/pact/reference/syntax#steph3540684) but specifying
ROLLBACK-EXPR. With ENTITY, ROLLBACK-EXPR will only be executed upon failure of
a subsequent step, as part of a reverse-sequence "rollback cascade" going back
from the step that failed to the first step. Without ENTITY, ROLLBACK-EXPR
functions as a "cancel function" to be explicitly executed by a participant.

### use

```pact
(use MODULE)
(use MODULE HASH)
(use MODULE IMPORTS)
(use MODULE HASH IMPORTS)
```

Import an existing MODULE into a namespace. Can only be issued at the top-level,
or within a module declaration. MODULE can be a string, symbol or bare atom.
With HASH, validate that the imported module's hash matches HASH, failing if
not. Use
[describe-module](/pact/reference/functions/database#describe-moduleh-1618399314)
to query for the hash of a loaded module on the chain.

An optional list of IMPORTS consisting of function, constant, and schema names
may be supplied. When this explicit import list is present, only those names
will be made available for use in the module body. If no list is supplied, then
every name in the imported module will be brought into scope. When two modules
are defined in the same transaction, all names will be in scope for all modules,
and import behavior will be defaulted to the entire module. IMPORTS may only be
empty when a module hash is also supplied. If a module hash is not supplied,
IMPORTS are required to be either a non-empty list, or left undeclared.

```pact
(use accounts)
(transfer "123" "456" 5 (time "2016-07-22T11:26:35Z"))
"Write succeeded"
```

```pact
(use accounts "ToV3sYFMghd7AN1TFKdWk_w00HjUepVlqKL79ckHG_s")
(transfer "123" "456" 5 (time "2016-07-22T11:26:35Z"))
"Write succeeded"
```

```pact
(use accounts [ transfer example-fun ])
(transfer "123" "456" 5 (time "2016-07-22T11:26:35Z"))
"Write succeeded"
```

```pact
(use accounts "ToV3sYFMghd7AN1TFKdWk_w00HjUepVlqKL79ckHG_s" [ transfer example-fun ])
(transfer "123" "456" 5 (time "2016-07-22T11:26:35Z"))
"Write succeeded"
```

### interface

```pact
(interface NAME [DOR-OR-META] BODY...)
```

Define and install interface NAME, with optional DOC-OR-META.

BODY is composed of definitions that will be scoped in the module. Valid
expressions in a module include:

- [defun](/pact/reference/syntax#defunh95462750)
- [defconst](/pact/reference/syntax#defconsth645951102)
- [defschema](/pact/reference/syntax#defschemah-1003560474)
- [defpact](/pact/reference/syntax#defpacth1545231271)
- [defcap](/pact/reference/syntax#defcaph-1335639635)
- [use](/pact/reference/syntax#useh116103)
- [models](/pact/reference/property-checking)

```pact
(interface coin-sig
  "'coin-sig' represents the Kadena Coin Contract interface. This contract     \
  \provides both the general interface for a Kadena's token, supplying a   \
  \transfer function, coinbase, account creation and balance query."
  (defun create-account:string (account:string guard:guard)
    @doc "Create an account for ACCOUNT, with GUARD controlling access to the  \
    \account."
    @model [ (property (not (= account ""))) ]
    )
  (defun transfer:string (sender:string receiver:string amount:decimal)
    @doc "Transfer AMOUNT between accounts SENDER and RECEIVER on the same    \
    \chain. This fails if either SENDER or RECEIVER does not exist.           \
    \Create-on-transfer can be done using the 'transfer-and-create' function."
    @model [ (property (> amount 0.0))
             (property (not (= sender receiver)))
           ]
    )
  (defun account-balance:decimal (account:string)
    @doc "Check an account's balance"
    @model [ (property (not (= account ""))) ]
    )
)
```

### module

```pact
(module NAME KEYSET-OR-GOVERNANCE [DOC-OR-META] BODY...)
```

Define and install module NAME, with module admin governed by
KEYSET-OR-GOVERNANCE, with optional DOC-OR-META.

If KEYSET-OR-GOVERNANCE is a string, it references a keyset that has been
installed with `define-keyset` that will be tested whenever module admin is
required. If KEYSET-OR-GOVERNANCE is an unqualified atom, it references a
`defcap` capability which will be acquired if module admin is requested.

BODY is composed of definitions that will be scoped in the module. Valid
productions in a module include:

- [defun](/pact/reference/syntax#defunh95462750)
- [defpact](/pact/reference/syntax#defpacth1545231271)
- [defcap](/pact/reference/syntax#defcaph-1335639635)
- [deftable](/pact/reference/syntax#deftableh661222121)
- [defschema](/pact/reference/syntax#defschemah-1003560474)
- [defconst](/pact/reference/syntax#defconsth645951102)
- [implements](/pact/reference/syntax#implementsh-915384400)
- [use](/pact/reference/syntax#useh116103)
- [bless](/pact/reference/syntax#blessh93823227)

```pact
(module accounts 'accounts-admin
  "Module for interacting with accounts"

  (defun create-account (id bal)
   "Create account ID with initial balance BAL"
   (insert accounts id { "balance": bal }))

  (defun transfer (from to amount)
   "Transfer AMOUNT from FROM to TO"
   (with-read accounts from { "balance": fbal }
    (enforce (<= amount fbal) "Insufficient funds")
     (with-read accounts to { "balance": tbal }
      (update accounts from { "balance": (- fbal amount) })
      (update accounts to { "balance": (+ tbal amount) }))))
)
```

### implements

```pact
(implements INTERFACE)
```

Specify that containing module _implements_ interface INTERFACE. This requires
the module to implement all functions, pacts, and capabilities specified in
INTERFACE with identical signatures (same argument names and declared types).

Note that [models](/pact/reference/property-checking) declared for the
implemented interface and its members will be appended to whatever models are
declared within the implementing module.

A module thus specified can be used as a
[module reference](/pact/reference/concepts#modrefs-and-polymorphismh83727950)
for the specified interface(s).

## Expressions

Expressions may be [literals](/pact/reference/syntax#literalsh1425955268),
atoms, s-expressions, or references.

### Atoms

Atoms are non-reserved barewords starting with a letter or allowed symbol, and
containing letters, digits and allowed symbols. Allowed symbols are
`%#+-_&$@<>=?*!|/`. Atoms must resolve to a variable bound by a
[defun](/pact/reference/syntax#defunh95462750),
[defpact](/pact/reference/syntax#defpacth1545231271),
[binding](/pact/reference/syntax#bindingsh1004766894) form,
[lambda](/pact/reference/syntax#lambdash1611513196) form, or to symbols imported
into the namespace with [use](/pact/reference/syntax#useh116103).

### S-expressions

S-expressions are formed with parentheses, with the first atom determining if
the expression is a
[special form](/pact/reference/syntax#special-formsh-1564089880) or a function
application, in which case the first atom must refer to a definition.

#### Partial application

An application with less than the required arguments is in some contexts a valid
_partial application_ of the function. However, this is only supported in Pact's
[functional-style functions](/pact/reference/concepts#functional-conceptsh-276985720);
anywhere else this will result in a runtime error.

### References

References are multiple atoms joined by a dot `.` that directly resolve to
definitions found in other modules.

```pact
pact> accounts.transfer
"(defun accounts.transfer (src,dest,amount,date) \"transfer AMOUNT from
SRC to DEST\")"
pact> transfer
Eval failure:
transfer<EOF>: Cannot resolve transfer
pact> (use 'accounts)
"Using \"accounts\""
pact> transfer
"(defun accounts.transfer (src,dest,amount,date) \"transfer AMOUNT from
SRC to DEST\")"
```

References are preferred over `use` for transactions, as references resolve
faster. However, when defining a module, `use` is preferred for legibility.
