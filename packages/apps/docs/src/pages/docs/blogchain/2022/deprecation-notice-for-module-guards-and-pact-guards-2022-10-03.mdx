---
title: Deprecation Notice for Module Guards and Pact Guards
description:
  Kadena aims to continue building and supporting our developer community with a
  robust, best-in-class experience for Web3 developers. In order to do so, the
  team at Kadena continues to provide developer updates swiftly to ensure a
  smooth builder experience. This article will inform you on how to migrate away
  from two guard types in Pact to safe alternatives. These deprecated guards
  will be removed in a future release.
menu: Deprecation Notice for Module Guards and Pact Guards
label: Deprecation Notice for Module Guards and Pact Guards
publishDate: 2022-10-03
author: Emily Pillmore
layout: blog
---

## Deprecation Notice for Module Guards and Pact Guards

![](/assets/blog/1_8sbZuCncPEgill19IVOSYQ.webp)

Kadena aims to continue building and supporting our developer community with a
robust, best-in-class experience for Web3 developers. In order to do so, the
team at Kadena continues to provide developer updates swiftly to ensure a smooth
builder experience.

This article will inform you on how to migrate away from two guard types in Pact
to safe alternatives. These deprecated guards will be removed in a future
release.

### Overview

Module and pact guards were designed to allow autonomous code to control funds
in an era when all Pact code execution paths were known at compile time. The
later introduction of **module references** allowed untrusted third-party code
to be executed within module code, rendering module and pact guards unsound. The
solution is to migrate your code to **capability user guards.**

While code that does not involve module references can safely use module and
pact guards in some cases, capability user guards are still less bug-prone. For
this reason **module and pact guards are considered deprecated** and all user
code is recommended to exclusively employ capability user guards in cases where
module and pact guards would previously have been used.

### Module & Pact Guards considered harmful

The original design of Pact offered autonomous guards largely modeled after the
ownership model presented in the Ethereum EVM, where “contract accounts” simply
hold ETH alongside code that can use those funds however it sees fit. In Pact,
this was generalized into module guards, where the guard would pass as long as
the code was being called from the module associated with the guard, and pact
guards, which only pass if a specific instance of a **defpact** is executing.

This, of course, meant that module code invoking the guard-handling code had to
be protected by other predicates and capabilities. As such, the code could have
bugs as there was no explicit authorization, or scoping of said authorization.
Capability-based guards solve these potential issues.

However, the later introduction of module references now brings third-party code
into the mix, with the unfortunate property that **anywhere the owning module
calls into module reference code, that third-party code now passes the module
guard**. This is also true for defpact guards: while the current Pact ID is
validated, invoking modrefs in any way will pass the guard.

Fortunately, building user guards using require-capability offers a truly secure
mitigation. Capabilities now secure and scope guards alongside critical module
code. All of the features that make Pact capabilities sound are now extended to
guards for robust autonomous resource ownership.

### Capability User Guards

Capability User Guards are a design pattern for safe autonomous guards in Pact.
They are composed of three code elements: a **capability**, a **predicate
function**, and a **user guard.** The latter can be offered as a “constructor
function” resulting in a trio of definitions that defined together clearly
present the overall guard structure.

### Migrating Module Guards to Capability User Guards

A typical use of a module guard is to allow a smart contract to control KDA
funds. For instance, the following **deprecated** code transfers money into an
account owned by a module guard.

```pact
    ;; DEPRECATED module guard example.
    (coin.transfer-create funder BANK_KDA_ACCT (create-module-guard "bank") amount)
```

The problem with module and pact guards emerges when invoking the guard to do
critical operations like withdrawals.

The core enabling feature of Pact powering this mitigation are capabilities,
which already serve to secure critical pact code. Modules using the above bank
code might have code that looks like the following:

```pact
    ;; typical Pact code for protecting a critical operation.
    (with-capability (WITHDRAW recipient amount)
      (coin.transfer BANK_KDA_ACCT recipient amount))
```

With a module guard, there is potential for the first code block to be unsafe.
However, by creating or rotating the BANK_KDA_ACCT with a capability user guard,
this same withdraw code can be 100% safe with no changes.

## A capability user guard definition

```pact
    ;; Capability user guard: capability definition
    (defcap WITHDRAW (recipient:string amount:decimal)
      ... ;; enforcement of WITHDRAW capability
    )

    ;; Capability user guard: capability predicate function
    (defun require-WITHDRAW (recipient:string amount:decimal)
      (require-capability (WITHDRAW recipient amount)))

    ;; Capability user guard: guard constructor
    (defun create-WITHDRAW-guard (recipient:string amount:decimal)
      (create-user-guard (require-WITHDRAW recipient amount)
```

Armed with these definitions, the original funding code can now be migrated to
read:

```pact
    ;; Migrated module guard example using WITHDRAW capability user guard.
    (coin.transfer-create funder BANK_KDA_ACCT
      (create-WITHDRAW-guard funder amount) amount)
```

… and the withdrawing code above will continue to function with no changes.
Migration complete!

## Employing composition

The problem with the above migration is the _over-specificity_ of building the
guard around the WITHDRAW capability: for instance, the above code only allows
withdrawals of the same amount that was originally funded. If WITHDRAW is
invoked with a different amount, the guard will not pass.

The opposite end of the solution spectrum is a parameter-less capability that
serves only to fulfill the conditions of a capability user guard, which is then
composed into the WITHDRAW capability.

```pact
    ;; Invoking capability definition
    (defcap WITHDRAW (recipient:string amount:decimal)
      ... ;; enforcement of WITHDRAW capability
      (compose-capability (BANK_DEBIT))
    )

    ;; example of other capability also needing debit
    (defcap PAYMENT (recipient:string fee:amount)
      ...
      (compose-capability (BANK_DEBIT))
    )

    ;; Capability user guard: capability definition
    (defcap BANK_DEBIT () true)

    ;; Capability user guard: capability predicate function
    (defun require-BANK_DEBIT ()
      (require-capability (BANK_DEBIT)))

    ;; Capability user guard: guard constructor
    (defun create-BANK_DEBIT-guard ()
      (create-user-guard (require-BANK_DEBIT)))
```

You would then create the account using the BANK_DEBIT guard:

```pact
    ;; Migrated module guard example with BANK_DEBIT capability user guard.
    (coin.transfer-create funder BANK_KDA_ACCT
     (create-BANK_DEBIT-guard) amount)
```

## Best practice: Be as specific as possible

While capability user guards require the least boilerplate when using a
parameter-less capability, it is best to “de-parameterize” only as much as
needed to serve the indicated use cases and no more. For instance, if `WITHDRAW`
was the only bank-debiting operation in the above example module, and was
explicitly designed to withdraw exactly what was funded, then the
`WITHDRAW`-based capability guard is actually safer by limiting cases where the
guard would fire. Indeed, it suggests a design that supports UTXO-like accounts,
with the `WITHDRAW` capability guard perfectly suited to support multiple
accounts that support only a single deposit and withdrawal.

When migrating, keep an eye out for code that relies on a single resource +
module guard which could be improved by decomposing into separate resources. For
instance, if user and autonomous monies previously shared the same KDA bank
account, using two accounts protected by the distinct capability guards is
potentially a safer design.

## Migrating pact guards

Pact guards must be migrated to capabilities **that are explicitly parameterized
with the intended pact ID, and enforce equality with the current pact ID.**
Beyond that, they are identical to migrations for module guards.

```pact
    ;; simplified marmalade-style sale second step capability
    (defcap BUY (sale-id:string token-id:string buyer:string price:decimal)
      ...
      (compose-capability (SALE_PACT sale-id))

    ;; Pact capability user guard: capability definition
    (defcap SALE_PACT (sale-id:string)
      ;; all capabilities for guarding pacts MUST
      ;; validate that the current pact ID matches the
      ;; parameter value.
      (enforce (= (pact-id) sale-id) "invalid sale id")
    )

    ;; Capability user guard: capability predicate function
    (defun require-SALE_PACT (sale-id:string)
      (require-capability (SALE_PACT sale-id))

    ;; Capability user guard: guard constructor
    (defun create-SALE_PACT-guard (sale-id:string)
      (create-user-guard (require-SALE_PACT sale-id))
```

In a marmalade-style sale, BUY guards the second step. In the first step,
instead of using create-pact-guard, you would use the capability user guard with
the current pact ID to guard the NFT escrow:

```pact
    (let ((sale-id (pact-id)))
      (ledger::transfer-create token-id seller (create-sale-account sale-id)
        (create-SALE_PACT-guard sale-id) amount)))
```

Now, you are all set and the pact guards have now been migrated!

We hope that you found this article to be helpful! Please share your feedback
with us on our [Discord channel](http://discord.io/kadena) or on our
[GitHub repository](https://github.com/kadena-io/)! Be sure to follow us on
Kadena’s social media accounts for more developer updates and news as Kadena
continues to drive innovation on the blockchain!
