---
title: Advanced concepts
description: Provides an in-depth look at core concepts for programming advanced applications using the Pact smart contract programming language and key features such as guard, capabilities, pacts, and module references.
menu: Advanced concepts
label: Advanced concepts
order: 3
layout: full
tags: ['pact', 'concepts', 'declaration']
---

# Advanced concepts

This part of the documentation provides a more in-depth look at core concepts for programming advanced applications using the Pact smart contract programming language and working with key features such as guards, capabilities, pacts, and module references. Many of these features offer a great deal of flexibility for developing sophisticated smart contract programs, but introduce additional complexity for you to consider. The descriptions and examples in this section are intended to help you identify best practices and potential risks in using these features and to give you a deeper understanding of how to build with Pact.

## Execution modes

Pact is designed to be used in distinct _execution modes_ to address the performance requirements of rapid linear execution on a blockchain. These are:

- Contract definition.
- Transaction execution.
- Queries and local execution.

### Contract definition

In this mode, a large amount of code is sent into the blockchain to establish the smart contract, as comprised of modules (code), tables (data), and keysets (authorization). This can also include "transactional" (database-modifying) code, for instance to initialize data.

For a given smart contract, these should all be sent as a single message into the blockchain, so that any error will rollback the entire smart contract as a unit.

#### Keyset definition

[Keysets](/reference/functions/keysets) are customarily defined first, as they are used to specify admin authorization schemes for modules and tables. Definition creates the keysets in the runtime environment and stores their definition in the global keyset database.

#### Namespace declaration

[Namespace](/build/pact/advanced#namespacesh-2137443688) declarations provide a unique prefix for modules and interfaces defined within the namespace scope. Namespaces are handled differently in public and private blockchain contexts: in private they are freely definable, and the _root namespace_ (ie, not using a namespace at all) is available for user code. In public blockchains, users are not allowed to use the root namespace (which is reserved for built-in contracts like the coin contract) and must define code within a namespace, which may or may not be definable (ie, users might be restricted to "user" namespaces).

Namespaces are defined using [define-namespace](/reference/functions/general#define-namespaceh-1430035511). Namespaces are "entered" by issuing the [namespace](/reference/functions/general#namespaceh1252218203) command.

#### Module declaration

[Modules](/reference/syntax#moduleh-1068784020) contain the API and data definitions for smart contracts. They are comprised of:

- [functions](/reference/syntax#defunh95462750)
- [schema](/reference/syntax#defschemah-1003560474) definitions
- [table](/reference/syntax#deftableh661222121) definitions
- [pact](/reference/syntax#defpacth1545231271) special functions
- [constant](/reference/syntax#defconsth645951102) values
- [models](/reference/property-checking)
- [capabilities](/build/pact/advanced#capabilitiesh-1323277354)
- [imports](/reference/syntax#useh116103)
- [implements](/reference/syntax#implementsh-915384400)

When a module is declared, all references to native functions, interfaces, or definitions from other modules are resolved. Resolution failure results in transaction rollback.

Modules can be re-defined as controlled by their governance capabilities. Often, such a function is simply a reference to an administrative keyset. Module versioning is not supported, except by including a version sigil in the module name (e.g., "accounts-v1"). However, _module hashes_ are a powerful feature for ensuring code safety. When a module is imported with [use](/reference/syntax#useh116103), the module hash can be specified, to tie code to a particular release.

As of Pact 2.2, `use` statements can be issued within a module declaration. This combined with module hashes provides a high level of assurance, as updated module code will fail to import if a dependent module has subsequently changed on the chain; this will also propagate changes to the loaded modules' hash, protecting downstream modules from inadvertent changes on update.

Module names must be unique within a namespace.

#### Interface Declaration

[Interfaces](/build/pact/advanced#interfacesh394925690#interfaces) contain an API specification and data definitions for smart contracts. They are comprised of:

- [function](/reference/syntax#defunh95462750) specifications (i.e. function signatures)
- [constant](/reference/syntax#defconsth645951102) values
- [schema](/reference/syntax#defschemah-1003560474) definitions
- [pact](/reference/syntax#defpacth1545231271) specifications
- [models](/reference/property-checking)
- [capabilities](/build/pact/advanced#capabilitiesh-1323277354) specifications
- [imports](/reference/syntax#useh116103)

Interfaces represent an abstract api that a [module](/reference/syntax#moduleh-1068784020) may implement by issuing an `implements` statement within the module declaration. Interfaces may import definitions from other modules by issuing a [use](/reference/syntax#useh116103#use) declaration, which may be used to construct new constant definitions, or make use of types defined in the imported module. Unlike Modules, Interface versioning is not supported. However, modules may implement multiple interfaces.

Interface names must be unique within a namespace.

#### Table Creation

Tables are [created](/reference/functions/database#create-tableh447366077) at the same time as modules. While tables are _defined_ in modules, they are _created_ "after" modules, so that the module may be redefined later without having to necessarily re-create the table.

The relationship of modules to tables is important, as described in [Table Guards](/build/pact/advanced#module-table-guardsh-1588944812).

There is no restriction on how many tables may be created. Table names are namespaced with the module name.

Tables can be typed with a [schema](/reference/syntax#defschemah-1003560474).

### Transaction Execution

"Transactions" refer to business events enacted on the blockchain, like a payment, a sale, or a workflow step of a complex contractual agreement. A transaction is generally a single call to a module function. However there is no limit on how many statements can be executed. Indeed, the difference between "transactions" and "smart contract definition" is simply the _kind_ of code executed, not any actual difference in the code evaluation.

### Queries and Local Execution

Querying data is generally not a business event, and can involve data payloads that could impact performance, so querying is carried out as a _local execution_ on the node receiving the message. Historical queries use a _transaction ID_ as a point of reference, to avoid any race conditions and allow asynchronous query execution.

Transactional vs local execution is accomplished by targeting different API endpoints; pact code has no ability to distinguish between transactional and local execution.

## Database Interaction

Pact presents a database metaphor reflecting the unique requirements of blockchain execution, which can be adapted to run on different back-ends.

### Atomic execution

A single message sent into the blockchain to be evaluated by Pact is _atomic_: the transaction succeeds as a unit, or does not succeed at all, known as "transactions" in database literature. There is no explicit support for rollback handling, except in [multi-step transactions](/reference/pacts).

### Key-Row Model

Blockchain execution can be likened to OLTP (online transaction processing) database workloads, which favor denormalized data written to a single table. Pact's data-access API reflects this by presenting a _key-row_ model, where a row of column values is accessed by a single key.

As a result, Pact does not support _joining_ tables, which is more suited for an OLAP (online analytical processing) database, populated from exports from the Pact database. This does not mean Pact cannot _record_ transactions using relational techniques -- for example, a Customer table whose keys are used in a Sales table would involve the code looking up the Customer record before writing to the Sales table.

### Queries and Performance

As of Pact 2.3, Pact offers a powerful query mechanism for selecting multiple rows from a table. While visually similar to SQL, the [select](/build/pact/schemas-and-tables#selecth-1822154468) and [where](/reference/functions/general#whereh113097959) operations offer a _streaming interface_ to a table, where the user provides filter functions, and then operates on the rowset as a list data structure using [sort](/reference/functions/general#sorth3536286) and other functions.

```pact

;; the following selects Programmers with salaries >= 90000 and sorts by age descending

(reverse (sort ['age]
  (select 'employees ['first-name,'last-name,'age]
    (and? (where 'title (= "Programmer"))
          (where 'salary (< 90000))))))

;; the same query could be performed on a list with 'filter':

(reverse (sort ['age]
  (filter (and? (where 'title (= "Programmer"))
                (where 'salary (< 90000)))
          employees)))

```

In a transactional setting, Pact database interactions are optimized for single-row reads and writes, meaning such queries can be slow and prohibitively expensive computationally. However, using the [local](/build/pact/advanced#queries-and-local-executionh-453550016) execution capability, Pact can utilize the user filter functions on the streaming results, offering excellent performance.

The best practice is therefore to use select operations via local, non-transactional operations, and avoid using select on large tables in the transactional setting.

### No Nulls

Pact has no concept of a NULL value in its database metaphor. The main function for computing on database results, [with-read](/reference/functions/database#with-readh866473533), will error if any column value is not found. Authors must ensure that values are present for any transactional read. This is a safety feature to ensure _totality_ and avoid needless, unsafe control-flow surrounding null values.

### Versioned History

The key-row model is augmented by every change to column values being versioned by transaction ID. For example, a table with three columns "name", "age", and "role" might update "name" in transaction #1, and "age" and "role" in transaction #2. Retrieving historical data will return just the change to "name" under transaction 1, and the change to "age" and "role" in transaction #2.

### Back-ends

Pact guarantees identical, correct execution at the smart-contract layer within the blockchain. As a result, the backing store need not be identical on different consensus nodes. Pact's implementation allows for integration of industrial RDBMSs, to assist large migrations onto a blockchain-based system, by facilitating bulk replication of data to downstream systems.

## Types and Schemas

With Pact 2.0, Pact gains explicit type specification, albeit optional. Pact 1.0 code without types still functions as before, and writing code without types is attractive for rapid prototyping.

Schemas provide the main impetus for types. A schema [is defined](/reference/syntax#defschemah-1003560474) with a list of columns that can have types (although this is also not required). Tables are then [defined](/reference/syntax#deftableh661222121) with a particular schema (again, optional).

Note that schemas also can be used on/specified for object types.

### Runtime Type enforcement

Any types declared in code are enforced at runtime. For table schemas, this means any write to a table will be typechecked against the schema. Otherwise, if a type specification is encountered, the runtime enforces the type when the expression is evaluated.

### Static Type Inference on Modules

With the [typecheck](/reference/functions/repl-only-functions#typecheckh522701326) repl command, the Pact interpreter will analyze a module and attempt to infer types on every variable, function application or const definition. Using this in project repl scripts is helpful to aid the developer in adding "just enough types" to make the typecheck succeed. Successful typechecking is usually a matter of providing schemas for all tables, and argument types for ancillary functions that call ambiguous or overloaded native functions.

### Formal Verification

Pact's typechecker is designed to output a fully typechecked and inlined AST for generating formal proofs in the SMT-LIB2 language. If the typecheck does not succeed, the module is not considered "provable".

We see, then, that Pact code can move its way up a "safety" gradient, starting with no types, then with "enough" types, and lastly, with formal proofs.

Note that as of Pact 2.0 the formal verification function is still under development.

## Keysets and Authorization

Pact is inspired by Bitcoin scripts to incorporate public-key authorization directly into smart contract execution and administration. Pact seeks to take this further by making single- and multi-sig interactions ubiquitous and effortless with the concept of _keysets_, meaning that single-signature mode is never assumed: anywhere public-key signatures are used, single-sig and multi-sig can interoperate effortlessly. Finally, all crypto is handled by the Pact runtime to ensure programmers can't make mistakes "writing their own crypto".

Also see [Guards and Capabilities](/build/pact/advanced#guards-vs-capabilitiesh100483783) below for how Pact moves beyond just keyset-based authorization.

### Keyset definition

Keysets are [defined](/reference/functions/keysets#define-keyseth1939391989) by [reading](/reference/functions/general#read-keyseth2039204282) definitions from the message payload. Keysets consist of a list of public keys and a _keyset predicate_.

Examples of valid keyset JSON productions:

```typescript
/* examples of valid keysets */
{
  "fully-specified-with-native-pred":
    { "keys": ["abc6bab9b88e08d","fe04ddd404feac2"], "pred": "keys-2" },

  "fully-specified-with-qual-custom":
    { "keys": ["abc6bab9b88e08d","fe04ddd404feac2"], "pred": "my-module.custom-pred" },

  "keysonly":
    { "keys": ["abc6bab9b88e08d","fe04ddd404feac2"] }, /* defaults to "keys-all" pred */

  "keylist": ["abc6bab9b88e08d","fe04ddd404feac2"] /* makes a "keys-all" pred keyset */
}

```

### Keyset Predicates

A keyset predicate references a function by its (optionally qualified) name, and will compare the public keys in the keyset to the key or keys used to sign the blockchain message. The function accepts two arguments, "count" and "matched", where "count" is the number of keys in the keyset and "matched" is how many keys on the message signature matched a keyset key.

Support for multiple signatures is the responsibility of the blockchain layer, and is a powerful feature for Bitcoin-style "multisig" contracts (i.e. requiring at least two signatures to release funds).

Pact comes with built-in keyset predicates: [keys-all](/reference/functions/keysets#keys-allh517472840), [keys-any](/reference/functions/keysets#keys-anyh517472915), [keys-2](/reference/functions/keysets#keys-2h-1134655847). Module authors are free to define additional predicates.

If a keyset predicate is not specified, [keys-all](/reference/functions/keysets#keys-allh517472840) is used by default.

### Key rotation

Keysets can be rotated, but only by messages authorized against the current keyset definition and predicate. Once authorized, the keyset can be easily [redefined](/reference/functions/keysets#define-keyseth1939391989).

### Module Table Guards

When [creating](/reference/functions/database#create-tableh447366077) a table, a module name must also be specified. By this mechanism, tables are "guarded" or "encapsulated" by the module, such that direct access to the table via [data-access functions](/reference/functions/database) is authorized only by the module's governance. However, _within module functions_, table access is unconstrained. This gives contract authors great flexibility in designing data access, and is intended to enshrine the module as the main "user data access API".

See also [module guards](/build/pact/advanced#module-guardsh-1103833470) for how this concept can be leveraged to protect more than just tables.

Note that as of Pact 3.5, the option has been added to selectively allow unguarded reads and transaction history access in local mode only, at the discretion of the node operator.

### Row-level keysets

Keysets can be stored as a column value in a row, allowing for _row-level_ authorization. The following code indicates how this might be achieved:

```pact
(defun create-account (id)
  (insert accounts id { "balance": 0.0, "keyset": (read-keyset "owner-keyset") }))

(defun read-balance (id)
  (with-read accounts id { "balance":= bal, "keyset":= ks }
    (enforce-keyset ks)
    (format "Your balance is {}" [bal])))
```

In the example, `create-account` reads a keyset definition from the message payload using [read-keyset](/reference/functions/general#read-keyseth2039204282) to store as "keyset" in the table. `read-balance` only allows that owner's keyset to read the balance, by first enforcing the keyset using [enforce-keyset](/reference/functions/keysets#enforce-keyseth1553446382).

## Namespaces

Namespaces are defined by specifying a namespace name and associating a keyset with the namespace. Namespace scope is entered by declaring the namespace environment. All definitions issued after the namespace scope is entered are accessible by their fully qualified names. These names are of the form _namespace.module.definition_. This form can also be used to access code outside of the current namespace for the purpose of importing module code, or implementing modules:

```pact
(implements my-namespace.my-interface)
;; or
(use my-namespace.my-module)
```

Code may be appended to the namespace by simply re-entering the namespace and declaring new code definitions. All definitions _must_ occur within a namespace, as the global namespace (the empty namespace) is reserved for Kadena code.

Examples of valid namespace definition and scoping:

#### Example: Defining a namespace

Defining a namespace requires a keyset, and a namespace name of type string:

```pact
(define-keyset 'my-keyset)
(define-namespace 'my-namespace (read-keyset 'my-keyset))

pact> (namespace 'my-namespace)
"Namespace set to my-namespace"
```

#### Example: Accessing members of a namespace

Members of a namespace may be accessed by their fully-qualified names:

```pact
pact> (my-namespace.my-module.hello-number 3)
"Hello, your number is 3!"

;; alternatively
pact> (use my-namespace.my-module)
"Using my-namespace.my-module"
pact> (hello-number 3)
"Hello, your number is 3!"

```

#### Example: Importing module code or implementing interfaces at a namespace

Modules may be imported at a namespace, and interfaces my be implemented in a similar way. This allows the user to work with members of a namespace in a much less verbose and cumbersome way.

```pact
; in my-namespace
(module my-module EXAMPLE_GUARD
  (implements my-other-namespace.my-interface)

  (defcap EXAMPLE_GUARD ()
    (enforce-keyset 'my-keyset))

  (defun hello-number:string (number:integer)
    (format "Hello, your number is {}!" [number]))
)

```

#### Example: appending code to a namespace

If one is simply appending code to an existing namespace, then the namespace prefix in the fully qualified name may be ommitted, as using a namespace works in a similar way to importing a module: all toplevel definitions within a namespace are brought into scope when `(namespace 'my-namespace)` is declared. Continuing from the previous example:

```pact
pact> (my-other-namespace.my-other-module.more-hello 3)
"Hello, your number is 3! And more hello!"

; alternatively
pact> (namespace 'my-other-namespace)
"Namespace set to my-other-namespace"

pact> (use my-other-module)
"Using my-other-module"

pact> (more-hello 3)
"Hello, your number is 3! And more hello!"

```

## Guards, Capabilities and Events

Pact 3.0 introduces powerful new concepts to allow programmers to express and implement authorization schemes correctly and easily: _guards_, which generalize keysets, and _capabilities_, which generalize authorizations or rights. In Pact 3.7, capabilities also function as [events](/build/pact/advanced#eventsh2087505209).

### Guards

A guard is essentially a predicate function over some environment that enables a pass-fail operation, `enforce-guard`, to be able to test a rich diversity of conditions.

A keyset is the quintessential guard: it specifies a list of keys, and a predicate function to verify how many keys were used to sign the current transaction. Enforcement happens via `enforce-keyset`, causing the transaction to fail if the necessary keys are not found in the signing set.

However, there are other predicates that are equally useful:

- We might want to enforce that a _module_ is the only entity that can perform some function, for instance to debit some account.

- We might want to ensure that a user has provided some secret, like a hash preimage, as seen in atomic swaps.

- We might want to combine all of the above into a single, enforceable rule: "ensure user A signed the transaction AND provided a hash preimage AND is only executable by module `foo`".

Finally, we want guards to _interoperate_ with each other, so that smart contract code doesn't have to worry about what kind of guard is used to mediate access to some resource or right. For instance, it is easy to think of entries in a ledger having diverse guards, where some tokens are guarded by keysets, while others are autonomously owned by modules, while others are locked in some kind of escrow transaction: what's important is that the guard always be enforced for the given account, not what type of guard it is.

Guards address all of these needs. Keysets are now just one type of guard, to which we add module guards, pact guards, and completely customizable "user guards". You can store any type of guard in the database using the `guard` type. The `keyset` type is still supported, but developers should switch to `guard` to enjoy the enhanced flexibility.

### Capabilities

Capabilities are a new construct in Pact 3.0 that draws from capability theory to offer a system for managing runtime user rights in an explicit, literate, and principled fashion.

Simply put, a _capability_ is a "ticket" that when _acquired_ allows the user to perform some sensitive task. If the user is unable to acquire the ticket, portions of the transaction that demand the ticket will fail.

#### Using capabilities to protect code

Code can demand that a capability be "already granted", that is, make no attempt to acquire the ticket, but fail if it was not acquired somewhere else. This is done with the construct `require-capability`.

Code can also directly attempt to acquire a capability, but only for a specific _scope_. This is done with the special form `with-capability`, which, like `with-read`, scopes a body of code. Here, the ticket is granted while this body of code is executing, and is revoked when the body leaves execution.

#### Expressing capabilities in code: defcap

We've described capabilities like a "ticket", so let's continue by adding some attributes to this ticket:

- It needs a general name, like "ALLOW_ENTRY", to identify the operation being protected.
- It needs _parameters_, so that a capability can be granted to a specific entity ("user-id"), and/or for a particular amount ("amount" some decimal, "active" flag).
- It needs a _predicate function_ to perform whatever tests govern whether to grant the ticket.

Pact provides the `defcap` construct to do this.

```pact
(defcap ALLOW_ENTRY (user-id:string)
  "Govern entry operation."
  (with-read table user-id
    { "guard" := guard, "active" := active }
    (enforce-guard guard)
    (enforce active "Only active users allowed entry")))
```

`ALLOW_ENTRY` is the name or _domain_ of the capability. `user-id` is a _parameter_. Together, they form the _specification_ of a capability. Thus, `(ALLOW_ENTRY 'dave)` and `(ALLOW_ENTRY 'carol)` describe separate capabilities. (Note that capability theory's notion of _designation_ is indicated here, which we'll return to when we discuss capabilities and signatures).

The body implements the predicate function. It accesses whatever data it needs to perform necessary tests to protect against improper granting of the ticket. The body can do more than that -- it can import or _compose_ additional capabilities, for instance -- and it can even modify database state. This might be used to ensure a capability cannot be granted ever again after the first time it is acquired, for example.

To acquire this capability, you would invoke `with-capability`:

```pact
(defun enter (user-name)
  (with-capability (ALLOW_ENTRY user-name)
    (do-entry user-name)            ;; call "protected" function
    (update-entry-status user-name) ;; update database
  )
  (record-audit "ENTRY" user-name)  ;; some "unsafe" operation
)
```

To demand or _require_ the capability, you would use `require-capability`:

```pact
(defun do-entry (user-name)
  (require-capability (ALLOW_ENTRY user-name))
  ...
)
```

Requiring capabilities allow for "private" or "restricted" functions than cannot be called directly. Here we see that `do-entry` can only be called "privately", by code inside the module somewhere. What's more, it can only be called in an outer operation for this user in particular, "restricting" it to that user.

#### Composing capabilities

A `defcap` can "import" other capabilities, for modular factoring of guard code, or to "compose" the outer capability from "smaller", "inner" capabilities.

```pact
(defcap ALLOW_ENTRY (user-id:string)
  "Govern entry operation."
  (with-read table user-id
    { "guard" := guard, "active" := active }
    (enforce-guard guard)
    (enforce active "Only active users allowed entry")
    (compose-capability DB_LOG) ;; allow db logging while ALLOW_ENTRY is in scope
    ))
```

Composed capabilities are only in scope when their "parent" capability is granted.

### Signature capabilities

In Pact transaction messages, each signer can "scope" their signature to one or more capabilities. This restricts keyset guard operations on that signature: keysets demanding the scoped signature will only succeed while the ticket is held, or is in the process of being acquired -- keysets are often checked in order to grant a capability.

This "scoping" allows the signer to safely call untrusted code. For instance, in the Chainweb gas system, the "sender" signs the message to fund whatever gas costs are charged for the transaction. By signing the message, the sender has potentially allowed any code to debit from their account!

With that sender's signature has `(GAS)` added to it, it is scoped within gas payments in the coin contract only. Third-party code is prohibited from accessing that account during the transaction.

### Signatures and Managed Capabilities

Signature capabilities are also a mechanism to _install_ capabilities, but only if that capability is _managed_. "Vanilla" capabilities are just tickets to show before you try some protected operation, but _managed_ capabilities are able to _change the state_ of a capability as it is brought into and out of scope. The ticket metaphor breaks down here, as this is now a dynamic object that mediates whether capabilities are acquired.

If a signer attaches a managed capability to their signature list, the capability is "installed", which is not the same as "granted" or "acquired": if the capability's predicate function allows this signer to install the capability, the installed version will then govern any code needing the capability to unlock some protected operation, by means of a _manager function_.

#### Capability management with a manager function

A managed capability allows for safe interoperation with otherwise untrusted code. By signing with a managed capability, you are _allowing_ some untrusted code to _request_ grant of the capability; if the capability was not in the signature list, the untrusted code cannot request it.

If the capability _manager function_ doesn't grant the request, the untrusted code fails to execute. The common usage of this is to grant a payment to third-party code, such that the third-party code can directly transfer on behalf of the user some amount of coin, but only up to the indicated amount.

#### The TRANSFER managed capability

```pact
(defcap TRANSFER (sender:string receiver:string amount:decimal)
  @managed amount TRANSFER_mgr
  (compose-capability (DEBIT sender))
  (compose-capability (CREDIT receiver)))

(defun TRANSFER_mgr:decimal (managed:decimal requested:decimal)
  (enforce (>= managed requested) "Transfer quantity exhausted")
  (- managed requested) ;; update managed quantity for next time
)
```

`TRANSFER` allows for `sender` to approve any number of payments to `receiver` up to some `amount`. Once the amount is exceeded, the capability can no longer be brought into scope.

This allows third-party code to directly enact payments. Managed capabilities are an important feature to allow smart contracts to directly call some other trusted code in a tightly-constrained context.

#### Automatic "one-shot" capability management

A managed capability that does not specify a manager function is "auto-managed", meaning that after install, the capability can be granted exactly once for the given parameters. Further attempts will fail after the initial grant goes out of scope.

In the following example, the capability will have "one-shot" automatic management:

```pact
(defcap VOTE (member:string)
  @managed
  (validate-member member))
```

### Guards vs Capabilities

Guards and capabilities can be confusing: given we have guards like keysets, what do we need the capability concept for?

Guards allow us to define a _rule_ that must be satisfied for the transaction to proceed. As such, they really are just a way to declare a pass-fail condition or predicate. The Pact guard system is flexible enough to express any rule you can code.

Capabilities allow us to declare how that rule is deployed to grant some authority. In doing so, they enumerate the critical rights that are extended to users of the smart contract, and "protect" code from being called incorrectly.

Note also that **capabilities can only be granted inside the module code that declares them**, whereas guards are simply data that can be tested anywhere. This is an important security property, as it ensures an attacker cannot elevate their privileges from outside the module code.

### Modeling capabilities with compose-capability

The only problem with the above code is it pushed the awareness of DEBIT into the `transfer` function, whereas separation of concerns would better have it housed in `debit`. What's more, we'd like to ensure that `debit` is always called in a "transfer" capacity, that is, that the corresponding `credit` occurs. Thus, the better way to model this is with two capabilities, with TRANSFER being a "no-guard" capability that simply encloses `debit` and `credit` calls:

```pact
(defcap TRANSFER (from to amount)
  (compose-capability (DEBIT from))
  (compose-capability (CREDIT to)))

(defcap DEBIT (from)
  (enforce-guard (at 'guard (read table from))))

(defcap CREDIT (to)
  (check-account-exists to))

(defun transfer (from to amount)
  (with-capability (TRANSFER from to amount)
    (debit from amount)
    (credit to amount)))

(defun debit (user amount)
  (require-capability (DEBIT user))
    (update accounts user ...))

(defun credit (user amount)
  (require-capability (CREDIT user)
    (update accounts user ...)))
```

Thus, `TRANSFER` protects `debit` and `credit` from being used independently, while `DEBIT` governs specifically the ability to debit, enforcing the guard, while `CREDIT` simply creates a "restricted" capability for `credit`.

### Improving efficiency

Once capabilities are granted they are installed into the pact environment for the scope of the call to `with-capability`; once that form is exited, the capability is uninstalled. This scoping prevents duplicate testing of the predicate: **capabilities that have already been acquired (or installed) and are in-scope are not re-evaluated**, either by acquiring or requiring.

### defcap details

Since a `defcap` production both _specifies_ a "domain" of capability instances, and _implements_ the guard function, it has some surprising features. Since capability grant is cached in the environment, the function does not need to be called when invoked in `with-capability` or `require-capability` asks for some already-granted ticket.

As a result, **`defcap`s cannot be executed directly**, as arbitrary execution would violate the semantics described here. This is an important security property as it ensures that the granting code can only be called in approved contexts, inside the module.

### Testing scoping signatures with capabilities

Scoped signatures can be tested using the new `env-sigs` REPL function as follows:

```pact
(module accounts GOV
  ...
  (defcap PAY (sender receiver amount)
    (enforce-keyset (at 'keyset (read accounts sender))))

  (defun pay (sender receiver amount)
    (with-capability (PAY sender receiver amount)
      (transfer sender receiver amount)))
  ...
)

(env-sigs [{'key: "alice", 'caps: ["(accounts.PAY \"alice\" \"bob\" 10.0)"]}])
(accounts.pay "alice" "bob" 10.0) ;; works as the cap match the signature caps

(env-sigs [('key: "alice", 'caps: ["(accounts.PAY \"alice\" "\carol\" 10.0)"]}])
(expect-failure "payment to bob will no longer be able to enforce alice's keyset"
  (accounts.pay "alice" "bob" 10.0))
```

### Guard types

Guards come in five flavors: keyset, keyset reference, module, pact, and user guards.

#### Keyset guards.

These are the classic pact keysets. Using the `keyset` type is the one instance where you can restrict a guard subtype, otherwise the `guard` type obscures the implementation type to prevent developers from engaging in guard-specific control flow, which would be against best practices. Again, it is better to switch to `guard` unless there is a specific need to use keysets.

```pact
(enforce-guard (read-keyset "keyset"))
```

#### Keyset reference guards

Keysets can be installed into the environment with `define-keyset`, but if you wanted to store a reference to a defined keyset, you would need to use a `string` type. To make environment keysets interoperate with concrete keysets and other guards, we introduce the "keyset reference guard" which indicates that a defined keyset is used instead of a concrete keyset.

```pact
(enforce-guard (keyset-ref-guard "foo"))

(update accounts user { "guard": (keyset-ref-guard "foo") })
```

#### Module guards

Module guards are a special guard that when enforced will fail unless:

- the code calling the enforce was called from within the module, or

- module governance is granted to the current transaction.

This is for allowing a module or smart contract to autonomously "own" and manage some asset. As such it is operationally identical to how module table access is guarded: only module code or a transaction having module admin can directly write to a module tables, or upgrade the module, so there is no need to use a module guard for these in-module operations. A module guard is used to "project" module admin outside of the module (e.g. to own coins in an external ledger), or "inject" module admin into an internal database representation (e.g. to own an internally-managed asset alongside other non-module owners).

See [Module Governance](/build/pact/advanced#generalized-module-governanceh828884046) for more information about module admin management.

`create-module-guard` takes a `string` argument to allow naming the guard, to indicate the purpose or role of the guard.

```pact
(enforce-guard (create-module-guard "module-owned-asset"))
```

#### Pact guards

Pact guards are a special guard that will only pass if called in the specific `defpact` execution in which the guard was created.

Imagine an escrow transaction where the funds need to be moved into an escrow account: if modeled as a two-step pact, the funds can go into a special account named after the pact id, guarded by a pact guard. This means that only code in a subsequent step of that particular pact execution (ie having the same pact ID) can pass the guard.

```pact
(defpact escrow (from to amount)
  (step (with-capability (ESCROW) (init-escrow from amount)))
  (step (with-capability (ESCROW) (complete-escrow to amount))))

(defun init-escrow (from amount)
  (require-capability (ESCROW))
  (create-account (pact-id) (create-pact-guard "escrow"))
  (transfer from (pact-id) amount))

(defun complete-escrow (to amount)
  (require-capability (ESCROW))
  (with-capability (USER_GUARD (pact-id)) ;; enforces guard on account (pact-id)
    (transfer (pact-id) to amount)))
```

Pact guards turn pact executions into autonomous processes that can own assets, and is a powerful technique for trustless asset management within a multi-step operation.

#### User guards

User guards allow the user to design an arbitrary predicate function to enforce the guard, given some initial data. For instance, a user guard could be designed to require two separate keysets to be enforced:

```pact
(defun both-sign (ks1 ks2)
  (enforce-keyset ks1)
  (enforce-keyset ks2))

(defun install-both-guard ()
  (write guard-table "both"
    { "guard":
      (create-user-guard
        (both-sign (read-keyset "ks1) (read-keyset "ks2")))
    }))


(defun enforce-both-guard ()
  (enforce-guard (at "guard" (read guard-table "both"))))
```

User guards can seem similar to capabilities but are different, namely in that they can be stored in the database and passed around like plain data. Capabilities are in-module rights that can only be enforced within the declaring module, and offer scoping and the other benefits mentioned above. User guards are for implementing custom predicate logic that can't be expressed by other built-in guard types.

#### HTLC guard example

The following example shows how a "hash timelock" guard can be made, to implement atomic swaps.

```pact

(create-hashlock-guard (secret-hash timeout signer-ks)
  (create-user-guard (enforce-hashlock secret-hash timeout signer-ks)))

(defun enforce-hashlock (secret-hash timeout signer-ks)
  (enforce-one [
    (enforce (= (hash (read-msg "secret")) secret-hash))
    (and
      (enforce-keyset signer-ks)
      (enforce (> (at "block-time" (chain-data)) timeout) "Timeout not passed"))
      ]))
```

### Events

Pact 3.7 introduces [events](/build/pact/advanced#eventsh2087505209) which are emitted in the course of a transaction and included in the transaction receipt to allow for monitoring and proving via SPV that a particular event transpired.

In Pact, events are modeled as capabilities, for the following reasons:

- Capabilities already have the right shape for an event, which is essentially arbitrary data published under a topic or name. With capabilities, the capability name is the topic, and the arguments are the data.
- The acquisition of managed capabilities are a bona-fide event. Events complete the managed lifecycle, where you might install/approve a capability of some quantity on the way in, but not necessarily see what quantity was used. With events, the output of the actually acquired capability is present in the receipt.
- Capabilities are protected such that they can only be acquired in module code, which is appropriate as well for events.

#### The @event metadata tag

Any capability can cause events to be emitted upon acquisition by using the `@event` metadata tag.

```pact
(defcap BURN(qty:decimal)
  @event
  ...
)
```

`@event` cannot be used alongside `@managed`, because ...

#### Managed capabilities are automatically eventing

Managed capabilites emit events automatically with the parameters specified in acquisition (as opposed to install). From an eventing point of view, managed capabilities are those capabilities that can only "happen once". Whereas, a non-managed, eventing capability can fire events an arbitrary amount of times.

#### Testing for events

Use [env-events](/reference/functions/repl-only-functions#env-eventsh-139702791) to test for emitted events in repl scripts.

## Generalized Module Governance

Before Pact 3.0, module upgrade and administration was governed by a defined keyset that is referenced in the module definition. With Pact 3.0, this `string` value can alternately be an unqualified bareword that references a `defcap` within the module body. This `defcap` is the _module governance capability_.

With the introduction of the governance capability syntax, Pact modules now support _generalized module governance_, allowing for module authors to design any governance scheme they wish. Examples include tallying a stakeholder vote on an upgrade hash, or enforcing more than one keyset.

### Keysets and governance functions

To illustrate, let's consider a module governed by a keyset:

```pact
(module foo 'foo-keyset ...)
```

This indicates that if a user tried to upgrade the module, or directly write to the module tables, `'foo-keyset` would be enforced on the transaction signature set.

This can be directly implemented in a governance capability as follows:

```pact
(module foo GOVERNANCE
  ...
  (defcap GOVERNANCE ()
    (enforce-keyset 'foo-keyset))
  ...
)
```

Note the capability can have whatever name desired; GOVERNANCE is a good idiomatic name however.

### Governance capability and module admin

As a `defcap`, the governance function cannot be called directly by user code. It is automatically invoked in the following circumstances:

- A module upgrade is being attempted
- Module tables are being directly accessed outside the module code
- A [module guard](/build/pact/advanced#module-guardsh-1103833470) for this module is being enforced.

In these cases, the transaction is tested for elevated access to "module admin", defined as the grant of the _module admin capability_. This capability cannot be expressed in user code, so it cannot be installed, acquired, required or composed.

However, the implementing capability, here called `GOVERNANCE`, can be installed or acquired etc. If passed, this gets scoped like any normal capability, here over some protected code that only module admins can run.

#### Module admin capability scope

The special module admin capability, once automatically installed in the cases described above, **stays in scope for the rest of the calling transaction**. This is unlike "user" capabilities, which can only be acquired in a fixed scope specified by the body of `with-capability`.

This may sound worrisome, but the rationale is that a governance capability once granted should not be based on some transient fact that can become false during a single transaction. This is important especially in module upgrades, _which can change the governance capability itself_: if the module admin was tested again this could cause the upgrade to fail, for instance when migrating data with direct table rights.

#### Capability risks

Also, this means that, when initially installing a module, _the governance function is not invoked_. This is different behavior than when a keyset is specified: the keyset must be defined and it is enforced, to ensure that the keyset actually exists.

Module governance is therefore more "risky" as it can mean that the module cannot be upgraded if there is a bug in the governance capability. Clearly, care must be taken when implementing module capabilities, and using the Pact formal verification system is highly recommended here.

### Example: stakeholder upgrade vote

In the following code, a module can be upgraded based on a vote. An upgrade is designed as a Pact transaction, and its hash and code are distributed to stakeholders, who vote for the upgrade. Once the upgrade is sent in, the vote is tallied in the governance capability, and if a simple majority is found, the code is upgraded.

```pact
(module govtest count-votes
  "Demonstrate programmable governance showing votes \
 \ for upgrade transaction hashes"
  (defschema vote
    vote-hash:string)

  (deftable votes:{vote})

  (defun vote-for-hash (user hsh)
    "Register a vote for a particular transaction hash"
    (write votes user { "vote-hash": hsh })
  )

  (defcap count-votes ()
    "Governance capability to tally votes for the upgrade hash".
    (let* ((h (tx-hash))
           (tally (fold (do-count h)
                        { "for": 0, "against": 0 }
                        (keys votes)))
          )
      (enforce (> (at 'for tally) (at 'against tally))
               (format "vote result: {}, {}" [h tally])))
  )

  (defun do-count (hsh tally u)
    "Add to TALLY if U has voted for HSH"
    (bind tally { "for" := f, "against" := a }
      (with-read votes u { 'vote-hash := v }
        (if (= v hsh)
            { "for": (+ 1 f), "against": a }
          { "for": f, "against": (+ 1 a) })))
  )
```

## Interfaces

An interface, as defined in Pact, is a collection of models used for formal verification, constant definitions, and typed function signatures. When a module issues an [implements](/reference/syntax#implementsh-915384400), then that module is said to 'implement' said interface, and must provide an implementation . This allows for abstraction in a similar sense to Java's interfaces, Scala's traits, Haskell's typeclasses or OCaML's signatures. Multiple interfaces may be implemented in a given module, allowing for an expressive layering of behaviors.

Interfaces are declared using the `interface` keyword, and providing a name for the interface. Since interfaces cannot be upgraded, and no function implementations exist in an interface aside from constant data, there is no notion of governance that need be applied. Multiple interfaces may be implemented by a single module. If there are conflicting function names among multiple interfaces, then the two interfaces are incompatible, and the user must either inline the code they want, or redefine the interfaces to the point that the conflict is resolved.

Constants declared in an interface can be accessed directly by their fully qualified name `namespace.interface.const`, and so, they do not have the same naming constraints as function signatures.

Additionally, interfaces my make use of module declarations, admitting use of the [use](/reference/syntax#useh116103) keyword, allowing interfaces to import members of other modules. This allows interface signatures to be defined in terms of table types defined in an imported module.

#### Example: Declaring and implementing an interface

```pact
(interface my-interface
    (defun hello-number:string (number:integer)
      @doc "Return the string \"Hello, $number!\" when given a string"
        )

    (defconst SOME_CONSTANT 3)
)

(module my-module (read-keyset 'my-keyset)
    (implements my-interface)

    (defun hello-number:string (number:integer)
        (format "Hello, {}!" [number]))

    (defun square-three ()
        (* my-interface.SOME_CONSTANT my-interface.SOME_CONSTANT))
)
```

### Declaring models in an interface

[Formal verification](/reference/property-checking) is implemented at multiple levels within an interface in order to provide an extra level of security. Models may be declared either within the body of the interface or at the function level in the same way that one would declare them in a module, with the exception that not all models are applicable to an interface. Indeed, since there is no abstract notion of tables for interfaces, abstract table invariants cannot be declared. However, if an interface imports table schema and types from a module via the [use](/reference/syntax#useh116103) keyword, then the interface can define body and function models that apply directly to the concrete table type. Otherwise, all properties are candidates for declaration in an interface.

When models are declared in an interface, they are appended to the list of models present in the implementing module at the level of declaration: body-level models are appended to body-level models, and function-level models are appended to function-level models. This allows users to extend the constraints of an interface with models applicable to specific business logic and implementation.

Declaring models shares the same syntax with modules:

#### Example: declaring models, tables, and importing modules in an interface

```pact
(interface coin-sig

  "Coin Contract Abstract Interface Example"

  (use acct-module)

  (defun transfer:string (from:string to:string amount:integer)
    @doc   "Transfer money between accounts"
    @model [(property (row-enforced accounts "ks" from))
            (property (> amount 0))
            (property (= 0 (column-delta accounts "balance")))
            ]
  )
)
```

## Module References

Pact 3.7 introduces module references (also called "modrefs"), a new language feature that enables important use-cases that require polymorphism. For example, a Uniswap-like DEX allows users to specify pairs of tokens to allow trading between them. The `fungible-v2` interface allows tokens to offer identical operations such as `transfer-create`, but without a way to abstract over different `fungible-v2` implementations, a DEX smart contract would have to be upgraded for each pair with custom code for every operation.

```pact
;;; simplified DEX example with hardcoded dispatching on token symbols
(defun swap
  ( a-token:string a-amount:decimal a-account:string
    b-token:string b-amount:decimal b-account:string
  )
  (with-read pair-accounts (format "{}:{}" [a-token b-token])
    { 'pair-a-account := pair-a-account
    , 'pair-b-account := pair-b-account
    }
    (cond
      ((= "KDA" a-token)
       (coin.transfer a-account pair-a-account a-amount))
      ((= "KBTC" a-token)
       (kbtc.ledger.transfer a-account pair-a-account a-amount))
      ((= "KUSD" a-token)
       (kusd.ledger.transfer a-account pair-a-account a-amount))
      "Unrecognized a-token value")
    (cond
      ((= "KDA" b-token)
       (coin.transfer b-pair-account b-account b-amount))
      ((= "KBTC" b-token)
       (kbtc.ledger.transfer b-pair-account b-account b-amount))
      ((= "KUSD" b-token)
       (kusd.ledger.transfer b-pair-account b-account b-amount))
      "Unrecognized b-token value"))
)
```

With module references, the DEX can now accept pairs of modref values where each value references a concrete module that implements the `fungible-v2` interface, giving it the ability to call `fungible-v2` operations using those values.

```pact
;;; simplified DEX example with modref dynamic dispatch
(defun swap
  ( a-token:module{fungible-v2} a-amount:decimal a-account:string
    b-token:module{fungible-v2} b-amount:decimal b-account:string
  )
  (with-read pair-accounts (format "{}:{}" [a-token b-token])
    { 'pair-a-account := pair-a-account
    , 'pair-b-account := pair-b-account
    }
    (a-token::transfer a-account pair-a-account a-amount)
    (b-token::transfer pair-b-account b-account b-amount))
)
```

To invoke the above function, the module names are directly referenced in code.

```pact

(swap coin a-amount a-account
      kbtc.ledger b-amount b-account)

```

Module reference values are "normal Pact values" that can be stored in the database, referenced in events and returned from functions.

```pact
;;; simplified DEX example with stored pair modrefs
(defun swap
  ( pair-symbol:string
    a-amount:decimal a-account:string
    b-amount:decimal b-account:string
  )
  (with-read pair-accounts pair-symbol
    { 'pair-a-account := pair-a-account:string
    , 'a-token := a-token:module{fungible-v2}
    , 'pair-b-account := pair-b-account:string
    , 'b-token := b-token:module{fungible-v2}
    }
    (a-token::transfer a-account pair-a-account a-amount)
    (b-token::transfer pair-b-account b-account b-amount))
)
```

### Modrefs and Polymorphism

Modrefs provide polymorphism for use cases like the example above with an emphasis on interoperability. A modref is specified with one or more interfaces, allowing for values of that modref to reference modules that implement those interfaces.

In the calling example above, the modref `a-token:module{fungible-v2}` accepts a reference to the Kadena `coin` KDA token module, because `coin` implements `fungible-v2`. Of course there is nothing special about `fungible-v2`: modrefs can specify any defined interface and accept any module that implements said interface.

The polymorphism offered by modrefs resembles generics in Java or traits in Rust, and should not be confused with more object-oriented polymorphism like that found with Java classes or TypeScript types. Modules cannot "extend" one another, they can only offer operations that match some interface specification, and interfaces themselves cannot extend some other interface.

Modrefs introduce indirection which increases overall complexity, making the system harder to understand and reason about. Reach for modrefs when your code wants to offer flexible interoperation to other smart contracts, but if it's just your code, strive to use direct references whenever possible.

### Important concerns when using modrefs.

#### Late Binding

Modrefs are "late-binding", which means that the latest upgraded version of a module will be used when a module operation is invoked.

Consider a modref to a module stored in the database when the module is at version 1. Sometime later the module is upgraded to version 2. The modref in the database will refer to the upgraded version 2 of the module when read back in and used.

As described in the [Dependency Management](/build/pact/advanced#dependency-managementh304790584) section, Pact direct references are not late-binding, so this modref behavior might be surprising.

#### Modrefs can introduce untrusted code

In the common case of employing modrefs to allow foreign modules to operate with your code, this of course means that you should not assume that this code is safe: indeed, **any modref call should be treated as untrusted code**.

Specifically, modref invocation in the context of capability acquisition can result in unintended privilege escalation, in the common case of using `require-capability` to protect functions from being called directly.

Consider a module with a public function `collect-data` that is intended to allow foreign modules to provide some data, resulting in the one-time payment of a fee. The foreign modules implement `data-collector` which offers `collect` to get the data, and `get-fee-recipient` to identify the receiving account. The module code acquires the `COLLECT` capability, and uses this to prevent two delegate functions from being called directly. Unfortunately, with the wrong code, this seemingly benign code can be exploited by a malicious modref implementor.

```pact
(module data-market GOVERNANCE
  ...

  (defun collect-data (collector:module{data-collector})
    "Provide data, get paid!"
    ;; BAD: capability acquired before modref calls
    (with-capability (COLLECT)
      ;; BAD: modref invoked with capability in scope!
      (store-data (collector::collect))
      (pay-fee (collector::get-fee-recipient)))

  (defun pay-fee (account:string)
    "Private function to pay one-time fee for collection"
    (require-capability (COLLECT))
    (coin.transfer FEE_BANK account FEE))

  (defun store-data (data:object{data-schema})
    "Private function to update database with data collection results"
    (require-capability (COLLECT))
    ...)

```

The problem with the above code is that the `with-capability` call happens _before_ the calls to the modref operations, such that while the foreign module code is executing, the `COLLECT` capability is in scope. While this is true, `pay-fee` (and `store-data` as well) can be called from anywhere.

As such, a malicious coder could provide a modref whose code directly calls `data-market.pay-fee` as many times as they like in the seemingly innocent calls to `collect` or `get-fee-recipient`. They could also call `data-market.store-data` and wreak havoc that way. Once a capability is in scope, the protections provided by `require-capability` are not available.

Fortunately, this is easily avoided by keeping modref calls out of scope of the sensitive capability.

```pact
(defun collect-data (collector:module{data-collector})
  "Provide data, get paid!"
  ;; GOOD: modref invoked before with-capability call
  (let ((data (collector::collect))
        (account (collector::get-fee-recipient)))
    (with-capability (COLLECT)
      (store-data data)
      (pay-fee account))))
```

Now, the modref calls have safely returned before the capability is acquired. A malicious implementation has no way to invoke the sensitive code.

### Coding with modrefs

Modules and interfaces thus need to be referenced directly, which is simply accomplished by issuing their name in code.

```pact
(module foo 'k
  (defun bar () 0))

(namespace ns)

(interface bar
  (defun quux:string ()))

(module zzz 'k
  (implements bar)
  (defun quux:string () "zzz"))

foo ;; module reference to 'foo', of type 'module'
ns.bar ;; module reference to `bar` interface, also of type 'module'
ns.zzz ;; module reference to `zzz` module, of type 'module{ns.bar}'
```

Using a module reference in a function is accomplished by specifying the type of the module reference argument, and using the [dereference operator](/reference/syntax#dereference-operatorh-1211281350) `::` to invoke a member function of the interfaces specified in the type.

```pact
(interface baz
  (defun quux:bool (a:integer b:string))
  (defconst ONE 1)
  )
(module impl 'k
  (implements baz)
  (defun quux:bool (a:integer b:string)
    (> (length b) a))
  )

...

(defun foo (bar:module{baz})
  (bar::quux 1 "hi") ;; derefs 'quux' on whatever module is passed in
  bar::ONE             ;; directly references interface const
)

...

(foo impl) ;; 'impl' references the module defined above, of type 'module{baz}'
```

## Computational Model

Here we cover various aspects of Pact's approach to computation.

### Turing-Incomplete

Pact is turing-incomplete. The language doesn't allow recursion. Recursion is detected before execution and results in an error. Pact also doesn't allow code to loop indefinitely. Pact does support operations on list structures using [map](/reference/functions/general#maph107868), [fold](/reference/functions/general#foldh3148801#fold) and [filter](/reference/functions/general#filterh-1274492040), but since there is no ability to define infinite lists, these are necessarily bounded.

Turing-incompleteness allows Pact module loading to resolve all references in advance. Instead of addressing functions in a lookup table, the function definition is directly injected (or "inlined") into the call site. This is an example of the performance advantages of a Turing-incomplete language.

### Single-assignment Variables

Pact allows variable declarations in [let expressions](/reference/syntax#leth107035) and [bindings](/reference/syntax#bindingsh1004766894). Variables are immutable: they cannot be re-assigned, or modified in-place.

A common variable declaration occurs in the [with-read](/reference/functions/database#with-readh866473533) function, assigning variables to column values by name. The [bind](/reference/functions/general#bindh3023933) function offers this same functionality for objects.

Module-global constant values can be declared with [defconst](/reference/syntax#defconsth645951102).

### Data Types

Pact code can be explicitly typed, and is always strongly-typed under the hood as the native functions perform strict type checking as indicated in their documented type signatures.

Pact's supported types are:

- [Strings](/reference/syntax#stringsh-217105822)
- [Integers](/reference/syntax#integersh634718997)
- [Decimals](/reference/syntax#decimalsh630176610)
- [Booleans](/reference/syntax#booleansh2070707563)
- [Time values](/reference/functions/time)
- [Keysets](/build/pact/advanced#keysets-and-authorizationh960403648) and [Guards](/build/pact/advanced#guardsh2143724174)
- [Lists](/reference/syntax#listsh73429877)
- [Objects](/reference/syntax#objectsh5004532)
- [Function](/reference/syntax#defunh95462750), [pact](/reference/syntax#defpacth1545231271), and [capability](/reference/syntax#defcaph-1335639635) definitions
- [Tables](/reference/syntax#deftableh661222121)
- [Schemas](/reference/syntax#defschemah-1003560474)

### Performance

Pact is designed to maximize the performance of [transaction execution](/build/pact/advanced#transaction-executionh1561326614), penalizing queries and module definition in favor of fast recording of business events on the blockchain. Some tips for fast execution are:

#### Single-function transactions

Design transactions so they can be executed with a single function call.

#### Call with references instead of use

When calling module functions in transactions, use [reference syntax](/reference/syntax#referencesh-916552024) instead of importing the module with [use](/reference/syntax#useh116103). When defining modules that reference other module functions, `use` is fine, as those references will be inlined at module definition time.

#### Hardcoded arguments vs. message values

A transaction can encode values directly into the transactional code:

```pact
(accounts.transfer "Acct1" "Acct2" 100.00)
```

or it can read values from the message JSON payload:

```pact
(defun transfer-msg ()
  (transfer (read-msg "from") (read-msg "to")
            (read-decimal "amount")))
...
(accounts.transfer-msg)
```

The latter will execute slightly faster, as there is less code to interpret at transaction time.

#### Types as necessary

With table schemas, Pact will be strongly typed for most use cases, but functions that do not use the database might still need types. Use the [typecheck](/reference/functions/repl-only-functions#typecheckh522701326) REPL function to add the necessary types. There is a small cost for type enforcement at runtime, and too many type signatures can harm readability. However types can help document an API, so this is a judgement call.

### Control Flow

Pact supports conditionals via [if](/reference/functions/general#ifh3357), bounded looping, and of course function application.

#### Use enforce

"If" should never be used to enforce business logic invariants: instead, [enforce](/reference/functions/general#enforceh-1604583454) is the right choice, which will fail the transaction.

Indeed, failure is the only _non-local exit_ allowed by Pact. This reflects Pact's emphasis on _totality_.

Note that [enforce-one](/reference/functions/general#enforce-oneh281764347) (added in Pact 2.3) allows for testing a list of enforcements such that if any pass, the whole expression passes. This is the sole example in Pact of "exception catching" in that a failed enforcement simply results in the next test being executed, short-circuiting on success.

#### Use built-in keyset predicates

The built-in keyset functions [keys-all](/reference/functions/keysets#keys-allh517472840), [keys-any](/reference/functions/keysets#keys-anyh517472915), [keys-2](/reference/functions/keysets#keys-2h-1134655847) are hardcoded in the interpreter to execute quickly. Custom keysets require runtime resolution which is slower.

### Functional Concepts

Pact includes the functional-programming "greatest hits": [map](/reference/functions/general#maph107868), [fold](/reference/functions/general#foldh3148801) and [filter](/reference/functions/general#filterh-1274492040). These all employ [partial application](/reference/syntax#partial-applicationh1147799825), where the list item is appended onto the application arguments in order to serially execute the function.

```pact
(map (+ 2) [1 2 3])
(fold (+) "" ["Concatenate" " " "me"])
```

Pact also has [compose](/reference/functions/general#composeh950497682), which allows "chaining" applications in a functional style.

### Pure execution

In certain contexts Pact can guarantee that computation is "pure", which simply means that the database state will not be modified. Currently, `enforce`, `enforce-one` and keyset predicate evaluation are all executed in a pure context. [defconst](/reference/syntax#defconsth645951102) memoization is also pure.

### LISP

Pact's use of LISP syntax is intended to make the code reflect its runtime representation directly, allowing contract authors focus directly on program execution. Pact code is stored in human-readable form on the ledger, such that the code can be directly verified, but the use of LISP-style [s-expression syntax](/reference/syntax#s-expressionsh-1188303263) allows this code to execute quickly.

### Message Data

Pact expects code to arrive in a message with a JSON payload and signatures. Message data is read using [read-msg](/reference/functions/general#read-msgh-868697398) and related functions. While signatures are not directly readable or writable, they are evaluated as part of [keyset predicate](/build/pact/advanced#keyset-predicatesh2121179193) enforcement.

#### JSON support

Values returned from Pact transactions are expected to be directly represented as JSON values.

When reading values from a message via [read-msg](/reference/functions/general#read-msgh-868697398), Pact coerces JSON types as follows:

- String -> `string`
- Number -> `decimal`
- Boolean -> `bool`
- Object -> `object`
- Array -> `list`

Integer values are represented as objects and read using [read-integer](/reference/functions/general#read-integerh1563412487).

## Confidentiality

Pact is designed to be used in a _confidentiality-preserving_ environment, where messages are only visible to a subset of participants. This has significant implications for smart contract execution.

### Entities

An _entity_ is a business participant that is able or not able to see a confidential message. An entity might be a company, a group within a company, or an individual.

### Disjoint Databases

Pact smart contracts operate on messages organized by a blockchain, and serve to produce a database of record, containing results of transactional executions. In a confidential environment, different entities execute different transactions, meaning the resulting databases are now _disjoint_.

This does not affect Pact execution; however, database data can no longer enact a "two-sided transaction", meaning we need a new concept to handle enacting a single transaction over multiple disjoint datasets.

### Confidential Pacts

An important feature for confidentiality in Pact is the ability to orchestrate disjoint transactions in sequence to be executed by targeted entities. This is described in the next section.

## Asynchronous Transaction Automation with Pacts

"Pacts" are multi-stage sequential transactions that are defined as a single body of code called a [pact](/reference/syntax#defpacth1545231271). Defining a multi-step interaction as a pact ensures that transaction participants will enact an agreed sequence of operations, and offers a special "execution scope" that can be used to create and manage data resources only during the lifetime of a given multi-stage interaction.

Pacts are a form of _coroutine_, which is a function that has multiple exit and re-entry points. Pacts are composed of [steps](/reference/syntax#steph3540684) such that only a single step is executed in a given blockchain transaction. Steps can only be executed in strict sequential order.

A pact is defined with arguments, similarly to function definition. However, arguments values are only evaluated in the execution of the initial step, after which those values are available unchanged to subsequent steps. To share new values with subsequent steps, a step can [yield](reference/functions/general#yieldh114974605) values which the subsequent step can recover using the special [resume](/reference/functions/general#resumeh-934426579) binding form.

Pacts are comprised of steps that can only execute in strict sequence. Any enforcement of who can execute a step happens within the code of the step expression. All steps are "manually" initiated by some participant in the transaction with CONTINUATION commands sent into the blockchain.

### Failures, Rollbacks and Cancels

In pacts, a rollback expression is specified to indicate that the pact can be "cancelled" at this step with a participant sending in a CANCEL message before the next step is executed. Once the last step of a pact has been executed, the pact will be finished and cannot be rolled back. Failures in public steps are no different than a failure in a non-pact transaction: all changes are rolled back. Pacts can therefore only be canceled explicitly and should be modeled to offer all necessary cancel options.

### Yield and Resume

A step can yield values to the following step using [yield](reference/functions/general#yieldh114974605) and [resume](/reference/functions/general#resumeh-934426579). This is an unforgeable value, as it is maintained within the blockchain pact scope.

### Pact execution scope and pact-id

Every time a pact is initiated, it is given a unique ID which is retrievable using the [pact-id](/reference/functions/general#pact-idh-806844250) function, which will return the ID of the currently executing pact, or fail if not running within a pact scope. This mechanism can thus be used to guard access to resources, analogous to the use of keysets and signatures. One typical use of this is to create escrow accounts that can only be used within the context of a given pact, eliminating the need for a trusted third party for many use-cases.

### Testing pacts

Pacts can be tested in repl scripts using the [env-entity](/reference/functions/repl-only-functions#env-entityh-146648893), [env-step](/reference/functions) and [pact-state](/reference/functions/repl-only-functions#pact-stateh-2050254554) repl functions to simulate pact executions.

It is also possible to simulate pact execution in the pact server API by formatting [continuation Request](/reference/functions) yaml files into API requests with a `cont` payload.

## Dependency Management

Pact supports a number of features to manage a module's dependencies on other Pact modules.

### Module Hashes

Once loaded, a Pact module is associated with a hash computed from the module's source code text. This module hash uniquely identifies the version of the module. Hashes are base64url-encoded BLAKE2 256-bit hashes. Module hashes can be examined with [describe-module](/reference/functions/repl-only-functions#describe-moduleh-1618399314):

```bash
pact> (at "hash" (describe-module 'accounts))
"ZHD9IZg-ro1wbx7dXi3Fr-CVmA-Pt71Ov9M1UNhzAkY"
```

### Pinning module versions with use

The [use](/reference/syntax#useh116103) special form allows a module hash to be specified, in order to pin the dependency version. When used within a module declaration, it introduces the dependency hash value into the module's hash. This allows a "dependency-only" upgrade to push the upgrade to the module version.

### Inlined Dependencies: No Leftpad

When a module is loaded, all references to foreign modules are resolved, and their code is directly inlined. At this point, upstream definitions are permanent: the only way to upgrade dependencies is to reload the original module.

This permanence is great for user code: once a module is loaded, an upstream provider cannot change what code is executed within. However, this creates a big problem for upstream developers, as they cannot upgrade the downstream code themselves in order to address an exploit, or to introduce new features.

### Blessing hashes

A trade-off is needed to balance these opposing interests. Pact offers the ability for upstream code to break downstream dependent code at runtime. Table access is guarded to enforce that the module hash of the inlined dependency either matches the runtime version, or is in a set of "blessed" hashes, as specified by [bless](/reference/syntax#blessh93823227) in the module declaration:

```pact
(module provider 'keyset
  (bless "ZHD9IZg-ro1wbx7dXi3Fr-CVmA-Pt71Ov9M1UNhzAkY")
  (bless "bctSHEz4N5Y1XQaic6eOoBmjty88HMMGfAdQLPuIGMw")
  ...
)
```

Dependencies with these hashes will continue to function after the module is loaded. Unrecognized hashes will cause the transaction to fail. However, "pure" code that does not access the database is unaffected. This prevents a "leftpad situation" where trivial utility functions can harm downstream code stability.

### Phased upgrades with v2 modules

Upstream providers can use the bless mechanism to phase in an important upgrade, by renaming the upgraded module to indicate the new version, and replacing the old module with a new, empty module that only blesses the last version (and whatever earlier versions desired). New clients will fail to import the "v1" code, requiring them to use the new version, while existing users can continue to use the old version, presumably up to some advertised time limit. The "empty" module can offer migration functions to handle migrating user data to the new module, for the user to self-upgrade in the time window.
