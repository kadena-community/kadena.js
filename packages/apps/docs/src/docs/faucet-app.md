---
title: "Workshop: Faucet application"
description: Learn how to write a faucet application using the Pact smart contract language.
menu: Build
label: "Workshop: Faucet application"
order: 4
layout: full
tags: [pact, smart contract, typescript, tutorial]
---

# Welcome to the Faucet application workshop

The Faucet application workshop consists of self-paced tutorials with step-by-step instructions to help you start coding with the Pact smart contract programming language.
If you are interested in exploring the entire project, see the [Real World Pact](https://github.com/thomashoneyman/real-world-pact) repository, the [Goliath Faucet Contract Overview](https://github.com/thomashoneyman/real-world-pact/tree/main/01-faucet-contract#contract-overview) and [Goliath Faucet Main Contract](https://github.com/thomashoneyman/real-world-pact/blob/main/01-faucet-contract/faucet.pact).

## What you’ll build

The tutorials in the workshop will guide you to create a faucet contract using Pact and a wallet application using TypeScript and React frontend. 

The Goliath faucet is a simple smart contract that allows users to request KDA.
Even though it’s a small contract, you'll learn about many of the most important Pact features by building it. 
The faucet contract is intended for use on a test network, so it allows

In this application:

- Users can request funds from the faucet and have the faucet account sign on their behalf.

- By default, users can request up to 20.0 KDA per call to request-funds and up to 100.0 KDA in total.

- The faucet account can increase the per-request and per-account limits for any account, but it cannot decrease them.

- Users can return funds to the faucet to receive credit against their total account limit.

- Users can look up their per-account and per-request limits to see how much KDA they can still request.

After following all the steps, you’ll be able to understand the contract behind the app, Goliath wallet.

## What you’ll learn

By completing the tutorials in this workshop, you’ll learn how to:

- Define and use namespace.
- Leverage keysets and capabilities to manage permissions.
- Write and use Pact code for modules and interfaces.
- Send Pact code to a Chainweb node for evaluation.
- Deploy and update a smart contract.
- Interact with the contract and blockchain using a frontend client.

## What you'll need

To complete the tutorials in the workshop, you need to have some software installed on the computer you are using for your development environment. 
Each tutorial includes a "Before you begin" summary of what you'll need for that specific tutorial. 
As a preview before you start the workshop, you should check whether your development environment meets the following basic requirements:

- You have an internet connection and a web browser installed on your local
  computer.
- You have a code editor, such as Visual Studio Code, access to an interactive
  terminal shell, and are generally familiar with using command-line programs.
- You have [Docker](https://docs.docker.com/get-docker/) installed and are
  generally familiar with using Docker commands for containerized applications.
- You have [Git](https://git-scm.com/downloads) installed and are generally
  familiar with using `git` commands.
- You have [Node.js](https://nodejs.dev/en/learn/how-to-install-nodejs/) and
  [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
  installed on your local computer.
- You have access to
  [Chainweaver](https://github.com/kadena-io/chainweaver/releases) desktop or
  web application.
- You have [Pact](https://github.com/kadena-io/pact#installing-pact) and the
  [Pact language server plugin](https://github.com/kadena-io/pact-lsp/releases)
  installed on your local computer.

If you have everything you need, you're ready to start building the faucet
 application.

## What is a smart contract?

The core functionality for the faucet application is implemented in a smart contract.
A smart contract is a program that can automatically execute agreements on the
blockchain without external oversight, as long as the conditions specified in the contract are met. 

For the faucet contract in this workshop, you'll be using the Pact smart contract language. 
A Pact smart contract typically includes the following:

- Context-setting code that is executed on-chain when you deploy the contract.

- Interfaces, modules, and functions that can be called using other smart contracts or by sending Pact code to a Chainweb node at its Pact endpoint for evaluation.

In most cases, you start writing Pact smart contracts by defining or specifying a **namespace** for the contract.
The namespace isolates your code and functions from other contracts that might contain similar functions and provides a boundary for code that you control.
Within the namespace, you typically define one or more **keysets** that control who is authorized to manage or use the namespace.
After setting the context for the contract, you typically define a module or interface that other modules can reference and initialize any data required by the module, for example, by defining schemas and creating tables for the module to use.

## Namespaces

In Pact, every module, interface, and keyset must have a unique name within a particular namespace. 
On a private blockchain, you can define your own namespace or use the local root of the chain as your namespace. 
However, on a public blockchain, the root namespace is reserved for foundational, built-in contracts like the `coin` contract.
In addition, defining a new namespace on Chainweb requires approval from the Kadena team.

Because of these restrictions, you have two options for define a new namespace for the faucet contract:

- Use one of the public namespaces Chainweb exposes for general use—the `free` and `user` namespaces to define  the interfaces, modules, and keysets for the contract.
- Create a principal namespace that users your account name to define a unique namespace.

For this tutorial, you can enter the `free` namespace with the `(namespace)` function. 

To enter the `free` namespace:

1. Open your code editor on your local computer and create a new `my-faucet.pact` file.
2. Add the following as the first line in the new file:

   ```pact
   (namespace "free")
   ```

## Keysets

Public-key authorization is widely used in smart contracts to ensure that only the holders of specific cryptographically-secure keys can take certain actions, such as transferring
funds from their account. 
Pact integrates single- and multi-signature public-key authorization into smart contracts directly using the concept of **keysets**.

Pact has other tools for authorizing the actions allowed—primarily through the use of **guards** or **capabilities** that you'll learn about later. 
For now, it's enough to know that a keyset is a specific type of guard that consists of one or public keys and a
**predicate** that specifies how many of the keys are required to perform an operation. 
In JSON, a keyset looks like this:

```json
"name":{
  {
    “keys”: [ “abc123”],
    “pred”: “keys-all”
    }
}
```

Pact will check the predicate function against the set of keys when the keyset
is used as a guard. If the predicate fails then access is denied. There are a
few built-in predicate functions, such as the “keys-all” function above this
predicate means means that all keys in the set must have signed the transaction.
You can also write your own predicate functions (for example, to authorize
access according to a vote).
For more information about keysets, see [Keysets and authorization](/build/pact/advanced#keysets-and-authorization)

Keysets are defined using the `(define-keyset)` function. This function takes a
name and a keyset as arguments. When evaluated, Pact will either register the
keyset at the given name on Chainweb or, if the name is already registered, then
it will “rotate” (ie. update) the keyset to the new value.

When registering a keyset in a smart contract it’s a common practice to send the
keyset in the deployment transaction data instead of hardcoding it into the
contract. That’s because keyset references can be rotated (ie. upgraded) once
rotated, the keyset name won’t refer to the value written in the contract
anymore. If you ever want to see the current value of a keyset reference, you
can look it up by name by sending this code to a Chainweb node:

```pact
(describe-keyset "free.my-keyset")
```

Let’s proceed with defining the “free.goliath-faucet-keyset” using the keyset
provided via transaction data. You can parse data from the transaction using the
(read-\*) family of functions:

- [read-msg](/reference/functions/general#read-msg)
- [read-keyset](/reference/functions/keysets#read-keyset)
- [read-string](/reference/functions/general#read-string)
- [read-integer](/reference/functions/general#read-integer)
- [read-decimal](/reference/functions/general#read-decimal)

Our deployment transaction will be sent with two pieces of data:

- ‘upgrade’: a boolean indicating whether this is a contract deployment or
  an upgrade to the already-deployed module. If the contract is being upgraded, the module can skip
  the keyset definition and initialization steps.

- ‘goliath-faucet-contract’: a keyset that should be registered as the
  `“free.goliath-faucet-keyset”` keyset on-chain.

Below, we read the Goliath faucet keyset from the transaction data and register
it, but only if we are deploying (not upgrading) this contract. Once the keyset
is registered, our Pact module can refer to it when guarding sensitive
information. To see how to provide a keyset in transaction data, see
the
[faucet.repl file](https://github.com/thomashoneyman/real-world-pact/blob/main/01-faucet-contract/faucet.repl)
and the deploy-faucet-contract.yaml file.

```pact
(if (read-msg “upgrade”)
  [ (enforce-keyset (read-keyset “goliath-faucet-keyset”))
    (define-keyset “free.goliath-faucet-keyset”
    (read-keyset “goliath-faucet-keyset”))
  ]
  "Upgrading contract"
)
```

If reading the ‘upgrade’ field yields ‘true’, then this isn’t our initial
deployment and therefore we should skip registering the keyset.

Otherwise, this is our initial deployment, so we should register the keyset.
Just one more thing before we proceed: we should verify our keyset. There are
multiple reasons to do this.

First, what if we have a typo in the keyset sent in the transaction data? The
typo keyset will be registered and we’ll be unable to access anything guarded by
it!

Second, you don’t have to define a keyset inside your smart contract. You may
wish to reuse the same keyset reference in multiple contracts, and so you simply
reuse the keyset reference in your contract. This can be dangerous, however. If
you deploy a contract referring to a keyset but you forgot to register that
keyset, then someone else can register the keyset with their keys and gain
access to your guarded data. To prevent these risks it’s a best practice to
enforce a keyset guard on the transaction that deploys the contract. This guard
should ensure that any keysets passed to the contract were also used to sign the
transaction that deploys the contract. If the enforcement fails, the deployment
is aborted, and you can fix the keyset and try again.
For more information, see [keyset-ref-guard](/reference/functions/guards#keyset-ref-guardh2089873729).

## Interfaces and modules

So far we’ve been writing code at the top level. Code at the top level is
ordinary Pact that Chainweb can execute. However, when you are defining a new
smart contract, you need to organize your Pact code into interfaces and/or
modules so that it can be referenced later from other contracts or via a
Chainweb node’s Pact API. Chainweb will store your interfaces and modules within
the namespace you’ve entered.

Interfaces and modules are both units for organizing Pact code, but they serve
different purposes. An interface describes the API that a module will implement
and can supply constants and models for formal verification to aid in that
implementation, but it doesn’t contain any implementations itself and cannot be
executed on Chainweb.
For more information, see [interfaces](/build/pact/advanced#interfacesh394925690).

Interfaces purely exist as a method of abstraction. An interface can be
implemented by multiple modules (that means that the module provides an
implementation for every function included in the interface), so it serves as a
blueprint for implementers. Also, Pact functions take a reference to module as
an argument so long as the module implements a specific interface. That means
you can write a function that can be used with any module that implements the
given interface — a powerful form of abstraction.
For more information, see [module-references](/build/pact/advanced#module-referencesh1941667004).

We don’t use interfaces in our contract because it’s quite small and no one else
is expected to provide another implementation for its API. Instead, we skip
straight to the implementation: the ‘goliath-faucet’ module.

A [module](/reference/syntax#moduleh-1068784020) in Pact is the primary unit of organization for Pact code. 
Modules can contain functions, pacts, capabilities, tables, and other Pact code.

Let’s define a Pact module with the code for our faucet. To define a module we
must provide a module name, a module governance function, and then the module
body containing the implementation.

The **module name** is used to refer to the module from other modules (or in the
REPL). For example, `coin.transfer` refers to the `transfer` function defined in
the `coin` module. To refer to a module it must have been deployed to Chainweb
(or loaded into the REPL). We’ll name our module `goliath-faucet`.

Since we’re within the `free` namespace, that means we can refer to our module
on Chainweb with the prefix `free.goliath-faucet`. The **module governance
function** restricts how the contract can be upgraded.

Governance functions can be a keyset reference, which means that the contract
can be upgraded so long as the upgrade transaction satisfies the keyset, or they
can be a “capability” defined in the module. We’ll learn a lot more about
capabilities later and will use a keyset reference as our governance.
For more information, see [Keysets and governance functions](/build/pact/advanced#keysets-and-governance-functions).

```pact
(module goliath-faucet "free.goliath-faucet-keyset"
  @doc
  "'goliath-faucet' represents the Goliath Faucet Contract. \
  \ This contract  provides a small number of KDA to any    \
  \ Kadena user who needs some. To request funds for        \
  \ yourself (Chain 0 only):                                \
  \                                                         \
  \ > (free.goliath-faucet.request-funds …)                 \
  \                                                         \
  \ To check your account’s request and total limits:       \
  \ > (free.goliath-faucet.get-limits …)                    \
  \                                                         \
  \ To return funds to the faucet account (Chain 0 only):   \
  \ > (free.goliath-faucet.return-funds …)"

```

Now, let’s implement the body of our module. We’ll begin with the two forms of
metadata we can use to annotate our modules, interfaces, functions, table
schemas, and other Pact code. The @doc metadata field is for documentation
strings, and the @model metadata field is for formal verification.
For more information, see [Docs and metadata](/reference/syntax#docs-and-metadatah85265693).

## Metadata

It’s a best practice to document interfaces, modules, functions, table schemas,
and other Pact code using the `@doc` metadata field. We’ll do that throughout
our contract, beginning with the module itself.

The second metadata type is `@model`. It allows us to specify properties that
functions must satisfy and invariants that table schemas must satisfy. Pact, via
the Z3 theorem prover, can prove that there is no possible set of variable
assignments in our code that will violate the given property or invariant. Or,
if it does find a violation, it can tell us so we can fix it!

Properties (but not invariants) can be defined at the top level of the module so
they can be reused in multiple functions.

We have a few functions that should never succeed unless they were called in a
transaction signed by the Goliath faucet keyset. We can capture that property in
a reusable definition. We’ll see examples of using this property within a
function later on.

```pact
@model
  [ (defproperty faucet-authorized
      (authorized-by "free.goliath-faucet-keyset"))
  ]
```

## Constants

It’s useful to define constants in your interface for values that will be used
in several functions, or values that other modules should be able to refer to.

Our faucet contract has a specific range of values that it will allow the
per-request and per-account limits to be set to. It’s useful to capture these
values in variables that our tests, module code, and other modules on Chainweb
can refer to. To expose a constant value, use [(defconst)](/reference/syntax#defconsth645951102).

```pact
(defconst FAUCET_ACCOUNT "goliath-faucet
   @doc "Account name of the faucet account that holds and disburses   funds.")
(defconst DEFAULT_REQUEST_LIMIT 20.0
   @doc "Users can at minimum ask for up to 20 KDA per request.")
(defconst DEFAULT_ACCOUNT_LIMIT 100.0
   @doc "Users can at minimum ask for up to 100 KDA per account.")
```

## Schemas and tables

When your smart contract needs to persist some data across multiple calls to
functions in the contract, it should use a table. Tables in Pact are relational
databases and have a key-row structure. Keys are always strings. You can define
a table with the `deftable` keyword.

Our smart contract needs to persist four pieces of data. First, we need to
record how much KDA in total each account has requested and returned so that we
know when a request would exceed the per-account limit. We also need to record
the per-request and per-account limits, as they can be adjusted by the faucet
account at any time.

Before we define any tables, however, we should define schemas for them. The
schema for a table specifies the table columns and their data types. #defschema

The schema will be used to verify we are using the right types when reading or
writing the table. For example, Pact can type check our module and ensure we
never try to provide a string for an integer column, or try to insert a row
that’s missing a column.

By convention, we use the same name for a table and its schema, except we give
the schema a -schema suffix.

```pact
(defschema accounts-schema
   @model
   [ (invariant (<= (- funds-requested funds-returned)
        account-limit))
     (invariant (>= (- funds-requested funds-returned) 0.0))
   ]
   funds-requested:decimal
   funds-returned:decimal
   request-limit:decimal
   account-limit:decimal)
```

We’ve seen `@model` used to define some reusable properties at the module level.
Now, let’s see how to leverage invariants (ie. formal verification for table
schemas) to guarantee it is never possible for an address to exceed their
account limit or return more funds than they have requested. To specify an
invariant, use (invariant) and provide a predicate; the Z3 theorem prover will
check that the variables used in your predicate can never have values that would
fail the predicate. Not all Pact functions can be used in the predicate.
For more information about property and invariant functions, see [Property validation](/reference/pact/properties-checking).

The first invariant ensures that you can never receive more funds than your
account limit. The second ensures you can never return more funds than you have
received. Then, we define our four columns and their types.

Now that we have our schema we can define a table which uses it with the
(deftable) function.

We’ll refer to the table by name when we need to insert, read, or update data.
When our module is deployed, we’ll also need to create the table using the
(create-table) function (this must be called outside the module).

Pact supplies several data-access functions for working with tables.
For more information, see the [database](/reference/functions/database) function reference.

Note that these functions can only be called by functions within the module that
defined the table, or in a transaction that satisfies the module governance
function. Beyond these points of access, no one can read or write to tables
directly.

```pact
(deftable accounts:{accounts-schema})
```

## Capabilities

Next, let’s explore a fundamental pair of concepts in Pact: guards and
capabilities. A guard in Pact defines a rule that must be satisfied for the
transaction to continue.

We’ve seen an example already: keysets are one type of guard. But there are
others, such as pact guards that guard the execution of a step in a multi-step transaction or user guards for user-defined predicate functions.

In short, guards are pure predicate functions over the given environment, which
can be enforced at any time with (enforce-guard).

A capability, on the other hand, implements fine-grained control over how a
guard is deployed to grant some access to a user of the smart contract.

Capabilities in Pact are an entire system for managing user rights during the
execution of a transaction. You can define a new capability with (defcap). A
capability consists of a name, a list of arguments, optional metadata, and a
function body that returns a boolean.

For example, an ADMIN capability might ensure that a specific keyset must be
satisfied in order to take some action:

```pact
(defcap ADMIN ()
  (enforce-guard (keyset-ref-guard "free.my-keyset"))
```

Capabilities can implement more sophisticated rules, such as orchestrating a vote to determine whether the contract can be upgraded. 
To learn more about capabilities, see [Capabilities](/build/pact/advanced#capabilities).

There are four critical things to know about capabilities.

First, you can grant a capability to a function with `(with-capability)`, and
you can protect some sensitive code with the `(require-capability)` function.
“Granting” a capability means that calls to `(require-capability)` will succeed
so long as the capability is in scope.

Second, you can only grant a capability within the module that defined the
corresponding capability. That means, for example, that protecting code with
`(require-capability)` means that code cannot be called from outside the module,
because its required capability can only be granted within the module. This is a
helpful way to make particular functions private.

Third, capabilities come in two flavors: unmanaged and managed. Acquiring either
will let you access code protected by `(require-capability)`. However, unmanaged
capabilities are static (they only rely on their parameters and transaction data
to determine whether the capability should be granted), whereas managed
capabilities can be dynamic (they additionally rely on state that can change
each time the capability is requested during a given transaction). By
convention, unmanaged capabilities are “granted” and managed capabilities are
“installed”. You can tell that a capability is managed if it uses the `@managed`
metadata field.

We won’t use managed capabilities in this contract, but you can learn more about
them in [Signatures and managed capabilities](/build/pact/advanced#signatures-and-managed-capabilitiesh-260692187)
and [What are the semantics of capability manager functions in Pact?](https://stackoverflow.com/questions/72746446/what-are-the-semantics-of-capability-manager-functions-in-pact).

Finally, signers of a Pact transaction can scope their signature to one or more
capabilities in the module. This indicates that the signer has agreed to grant
the specified capabilities if they are asked for via the `(with-capability)`
function, but other capabilities should be denied.

Managed capabilities must always be scoped; unmanaged capabilities don’t always
have to be scoped. When the signer signs with an empty capability list, unmanaged
capabilities required in the transaction will be signed.

You can see examples of scoping a signature to a capability in the
[faucet.repl](https://github.com/thomashoneyman/real-world-pact/blob/main/01-faucet-contract/faucet.repl)
file and in the various
[‘send’ request files](https://github.com/thomashoneyman/real-world-pact/tree/50ce4cf19e65f4bfb7de90d8ea5f38948afbd4ce/01-faucet-contract/yaml/send).

Our contract will use one capability: `SET_LIMIT`. It ensures that calls to
change the per-request and per-account limits for a given account _must_ be
signed for by the goliath-faucet account.

The module’s `SET_LIMIT` capability will be a simple keyset guard. To grant this
capability in a function in this module with (with-capability), the transaction
that calls that function must be signed by the goliath-faucet private key,
scoped to the `SET_LIMIT` capability.

```pact
(defcap SET_LIMIT ()
 @doc “Enforce only faucet account can raise limits.”
 (enforce-guard (keyset-ref-guard “free.goliath-faucet-keyset”)))
```

## Functions

Now for the fun part! It’s time to implement the core logic of our smart
contract. Each feature of the contract will be represented by a function.

We’ll implement functions for users to request and return funds and to look up
their account limits. We’ll also implement two admin-only functions to adjust an
account’s limits. Along the way we’ll see how to grant capabilities, prevent
invalid states, read and write tables, format strings, and more.

```pact
free.goliath-faucet.request-funds
```

Our first function lets users request funds from the faucet. Specifically, we
will call the `(coin.transfer-create)` function from the coin contract IF the
requested amount is within the account limits for the receiving account. If our
checks pass (the amount is valid), then we’ll transfer the funds and then update
our accounts table to reflect the transfer.

```pact
(defun request-funds:string (
  receiver:string
  receiver-guard:guard
  amount:decimal)
  @doc
     "Request that funds are sent to the account denoted as the \
    \'receiver'. If the account does not exist then it will be \
    \ created and be guarded by the provided ‘receiver-guard’
    \ keyset."
```

We’ll use two properties to help ensure correct behavior for this function.
First, the transaction should only succeed if the address requested a positive
amount. Second, if the transaction succeeded, then the table at the
‘funds-requested’ column must have increased by the amount requested. The first
property is a simple check, but the second uses a property-only function called
`(column-delta)`.
For more information about this function, see [column-delta](/reference/property-checking/database#column-deltah-1553511807).

Recall that due to our schema invariants we have some additional checks that
verify that our table writes are always within the valid bounds of our account
and request limits. But they won’t stop us from forgetting to write to the table
at all, or from writing a value that’s not the exact amount the user requested.
`(column-delta)` can ensure that for us.

```pact
@model
  [ (property (> amount 0.0))
    (property (= amount (column-delta accounts “funds-requested”)))
  ]
```

Pact’s formal verification will check that your implementation satisfies the two
properties above, but we still have to write the code that _prevents_ the
invalid states. To abort a transaction if it fails to meet a condition, use
(enforce).

To see formal verification in action, comment out this line and re-run the REPL
file.

```pact
(enforce (> amount 0.0) “Amount must be greater than 0.0”)
```

We still need to verify that the amount is within the account’s limits. To do
that, we must read the receiver’s limits from the accounts table if it exists
there (ie. it has requested funds before), or assume the default limits if not.

There are a number of functions for reading and writing tables. One of the most
common is (with-default-read), which is used to read a row from a table, with a
fallback value in the case the row does not exist.

The `:=` operator indicates that we are storing the value of the column on the
left-hand side in the variable name on the right-hand side within the scope of
the `(with-default-read)` call.

```pact
(with-default-read accounts receiver
   { “funds-requested”: 0.0
   , “funds-returned”: 0.0
   , “request-limit”: DEFAULT_REQUEST_LIMIT
   , “account-limit”: DEFAULT_ACCOUNT_LIMIT
   }
   { “funds-requested” := requested
   , “funds-returned” := returned
   , “request-limit” := request-limit
   , “account-limit” := account-limit
   }
```

From this point on we have access to the values of the four columns associated
with the receiver account in the accounts table. Let’s use them to bind a helper
variable, `balance`, that records the difference between the total requested
funds and the total returned funds.

For binding the variable, we can introduce local variables with `(let)`.

This balance is what should be checked against the account limit. Now, we can
finally enforce that the requested amount does not exceed the request limit.

```pact
(let ( (balance (- requested returned)) )
   (enforce (<= amount request-limit)
   (format "{} exceeds the account’s per-request limit, which is {}"
     [ amount request-limit ]))
```

We can also ensure that transferring the requested amount would not result in
exceeding the total account limit.

```pact
(enforce (<= (+ amount balance) account-limit)
  (format "{} would exceed the account’s total limit ({} remains of    {} total)"
    [ amount (- account-limit balance) account-limit ]))
```

With these checks satisfied, we know that the address has requested a valid
amount and we process the transfer using the `(coin.transfer-create)` function:
[coin contract #L358–362](https://github.com/kadena-io/chainweb-node/blob/56e99ae421d2269a657e3bb3780c6d707e5149a0/pact/coin-contract/v5/coin-v5.pact#L358-L362)

Notice that the `(coin.transfer-create)` function grants a capability,
`(coin.TRANSFER)`, as part of its implementation:
[coin contract #L377](https://github.com/kadena-io/chainweb-node/blob/56e99ae421d2269a657e3bb3780c6d707e5149a0/pact/coin-contract/v5/coin-v5.pact#L377)

That means that a transaction that calls this (request-funds) function must be
signed by the faucet account keys, and that signature must be scoped to the
(coin.TRANSFER) capability. To see examples of how to do this, please see the
[faucet.repl file](https://github.com/thomashoneyman/real-world-pact/blob/main/01-faucet-contract/faucet.repl)
and the request-funds.yaml request file!

```pact
(coin.transfer-create FAUCET_ACCOUNT receiver receiver-guard amount)
```

If the transfer succeeded, then we should update the accounts table to indicate
the user has requested more funds. If you’d like to see our formal verification
in action, try “accidentally” hardcoding the funds-requested update below to a
specific number in the
[faucet.pact file](https://github.com/thomashoneyman/real-world-pact/blob/main/01-faucet-contract/faucet.pact).

```pact
(write accounts receiver
  { "funds-requested": (+ amount requested)
  , "funds-returned": returned
  , "request-limit": request-limit
  , "account-limit": account-limit
  }))))
```

Our next two functions can only be called by the faucet account itself. They
adjust the per-request or per-account limit for a given address. We’ll implement
checks to ensure that the new limits are greater than the old limits and that
the transaction executing this function was signed by the faucet account.

```pact
free.goliath-faucet.set-request-limit
```

```pact
(defun set-request-limit:string (account:string new-limit:decimal)
  @doc "Set a new per-request limit for requesting funds from the  faucet."
```

Once again we’ll reach for property tests to ensure our function is correct.

The first property test verifies that the faucet signed this transaction — it’s
referring to the `(faucet-authorized)` property we defined at the module level
earlier in our code.

The second property test verifies that if this transaction succeeded, then the
accounts table row for this account, at the “request-limit” column, has been
updated to be the value provided to this function. Similarly to (column-delta),
we can use this to verify that the table is written correctly.

```pact
@model
 [ (property faucet-authorized)
   (property (= new-limit (at "request-limit"
     (read accounts account   "after"))))
 ]
```

The primary way to enforce a condition in a function is the `(enforce)`
function. However, we can also put enforcement logic into a capability. A
function can only acquire that capability via `(with-capability)` if the
enforcement checks in the capability succeed. Capabilities are the best tool to
reach for when you want to pass a transaction only if it was signed with
particular keys; in our case, we have a (`SET_LIMIT`) capability that enforces
that the `"free.goliath-faucet-keyset"` keyset must be satisfied in order for
the `SET_LIMIT` capability to be granted.

Since we want the (`set-request-limit`) to be only called by the faucet account,
the SET_LIMIT capability is the perfect way to restrict access to this function.
To see an example of how to sign a transaction with this capability, please
refer to the
[faucet.repl](https://github.com/thomashoneyman/real-world-pact/blob/main/01-faucet-contract/faucet.repl)
file or the
[set-user-request-limit.yaml request file](https://github.com/thomashoneyman/real-world-pact/blob/main/01-faucet-contract/request/send/set-user-request-limit.yaml).

We used (with-default-read) before because we wanted to provide a fallback value
in case the account had never requested funds before. This function is
different: it should not be possible to update the limits for an account that
hasn’t yet requested anything. `(with-read)` will fail the transaction if the
given account does not exist in the table, and read the row otherwise.

Note that when using `(with-read)` it is not necessary to bind variables to
every column in the table. You can just use the columns you want.

```pact
(with-capability (SET_LIMIT)
  (with-read accounts account {
     "account-limit" := old-account-limit }
    (enforce (> new-limit old-account-limit)
      (format "The new account limit {} must be a value greater than the old limit ({})"
        [ new-limit, old-account-limit ]))
    (update accounts account { "account-limit": new-limit }))))
```

We used `(write)` before because we were inserting a new row into the table if
the account didn’t yet exist. To update one or more columns in an existing row
you can use `(update)`.

Like `(with-read)`, it’s only necessary to include the columns that you are
updating, not all the columns.

```pact
free.goliath-faucet.set-account-limit
```

The `(set-account-limit)` function is almost identical to the
`(set-request-limit)` function, just targeting a different field.

```pact
(defun set-account-limit:string (account:string new-limit:decimal)
  @doc "Set a new per-account limit for requesting funds from   \
  \ the faucet."
  @model
    [ (property faucet-authorized)
      (property (= new-limit
        (at "account-limit" (read accounts account "after"))))
    ]
  (with-capability (SET_LIMIT)
    (with-read accounts account {
      "account-limit" := old-account-limit
    }
      (enforce (> new-limit old-account-limit)
        (format "The new account limit {} must be a value greater than the old limit ({})"
          [ new-limit, old-account-limit ]))
      (update accounts account { "account-limit": new-limit }))))
```

Our next function is a little helper that lets users look up their account
limits from our table. Remember: tables cannot be accessed outside your module
for security reasons. If you want to provide access to specific data, write a
function that performs the table read.

`free.goliath-faucet.get-limits`

```pact
(defun get-limits:object (account:string)
  @doc "Read the limits for your account and see how much KDA you can request."
  (with-read accounts account {
     "account-limit" := account-limit
   , "request-limit" := request-limit
   , "funds-requested" := requested
   , "funds-returned" := returned
   } {
     "account-limit": account-limit
   , "request-limit": request-limit
   , "account-limit-remaining":
       (- account-limit (- requested  returned))
   }
 ))
```

Our final function allows users to transfer funds back to the faucet account and
credit it against their account limit. The property tests, enforcements, table
reads and writes, and let bindings should start looking familiar!

`free.goliath-faucet.return-funds`

```pact
(defun return-funds:string (account:string amount:decimal)
  @doc “Return funds to the faucet (returned funds credit against your limits).”
  @model
   [ (property (> amount 0.0))
     (property (= amount (column-delta accounts “funds-returned”)))
   ]
   (enforce (> amount 0.0) “Amount must be greater than 0.0”)
   (with-read accounts account {
     “funds-requested” := requested
   , “funds-returned” := returned
   }
   (let ((balance (- requested returned ))
         (new-returned (+ returned amount )) )
```

We didn’t implement a property for this because our table invariants already
verify that the funds returned can never exceed the funds requested. You can
verify that removing this enforcement check will make the model checker yell at
us.

```pact
(enforce (<= amount balance)
  (format "{} exceeds the amount this account can return to the faucet, which is {}."
    [ amount balance ]))
```

Next, we transfer from the user account to the faucet account. To transfer funds
from the user to the faucet account the user must have signed the transaction
and scoped their signature to the (coin.TRANSFER) capability. For examples,
please see the
[faucet.repl](https://github.com/thomashoneyman/real-world-pact/blob/main/01-faucet-contract/faucet.repl)
file and the
[return-funds.yaml](https://github.com/thomashoneyman/real-world-pact/blob/main/01-faucet-contract/request/send/return-funds.yaml)
request file.

```pact
(coin.transfer account FAUCET_ACCOUNT amount)
  (update accounts account { "funds-returned": new-returned }))))
)
```

## Initialization

At this point, we’ve established our smart contract: we entered a namespace,
defined a keyset, and implemented a module. Now it’s time to initialize data.

For a typical smart contract, that simply means creating any tables we defined
in the contract. However, more complex contracts may perform other steps, such
as calling functions from the module.

Tables are defined in modules, but they are created after them. This ensures
that the module can be redefined (ie. upgraded) later without necessarily having
to re-create the table.

Speaking of: it’s a common practice to implement the initialization step as an
‘if’ statement that differentiates between an initial deployment and an upgrade.
As with our keyset definition at the beginning of the contract, this can be done
by sending an `“upgrade”` field with a boolean value as part of the transaction
data:

```pact
(if (read-msg "upgrade")
  "Upgrade complete"
  (create-table free.goliath-faucet.accounts))
```

We have completed writing a faucet contract that can be deployed on devnet. The
next steps will be running a devnet on your local machine, and running the
faucet application that calls the functions from the contract.

You can start by following the instructions here:
[https://github.com/thomashoneyman/real-world-pact/tree/main/02-goliath-wallet](https://github.com/thomashoneyman/real-world-pact/tree/main/02-goliath-wallet)
