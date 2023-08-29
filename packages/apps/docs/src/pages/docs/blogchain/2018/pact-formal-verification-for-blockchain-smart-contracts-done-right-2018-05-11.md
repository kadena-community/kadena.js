---
title: Pact Formal Verification Making Blockchain Smart Contracts Safer
description:
  Property checking tools are now available for Kadena’s smart contract
  language, Pact! This means that Pact now allows for smart contract authors to
  express, automatically check, and formally verify that their code does not
  contain potentially catastrophic bugs.
menu: Pact Formal Verification
label: Pact Formal Verification
publishDate: 2018-05-11
author: Vivienne Chen
layout: blog
---

# Pact Formal Verification: Making Blockchain Smart Contracts Safer

### Today, Kadena has open-sourced its formal verification tools for our smart contract language, Pact. Here’s what that means.

MAY 11, 2018 (NEW YORK, NY) — Property checking tools are now available for
Kadena’s smart contract language, [Pact](https://github.com/kadena-io/pact)!
This means that Pact now allows for smart contract authors to express,
automatically check, and formally verify that their code does not contain
potentially
[catastrophic bugs](https://www.coindesk.com/ethereum-dao-fears-forks-finger-pointing-parity-exploit-aftermath/).

Pact’s property checking system is our solution to the chaos and uncertainty in
today’s smart contract programming world. Instead of requiring human (therefore,
error-prone) smart contract authors to try to imagine all possible ways an
attacker could exploit their contract— and inevitably make a
[hundred million-dollar mistake](https://hackernoon.com/how-the-170-million-ethereum-bug-could-have-been-prevented-819053c3b2cb)
— we allow you to mathematically prove your code is protected against attacks,
without requiring a background in formal verification.

### What is Formal Verification? How does Kadena’s version in Pact work?

When people talk about “Formal Verification,” they generally mean transforming
code into mathematical models that can be computationally proven. Formal
verification systems are often used in mission critical environments like
nuclear power plants or air and space autopilot systems. But there is a spectrum
of formal verification and it’s important to highlight where we sit in the wider
FV landscape:

![](/assets/blog/1_I0U5Nz3AzjoUsyxqcxKHfg.webp)

A quick run-down of what Pact’s formal verification system is **not**:

- **Unit testing**: Most of program verification in the production world happens
  via unit testing, where the behavior of a program is validated for a single
  combination of inputs that the author *hopes *can generalize to all inputs.

- **Quickcheck**: Here a system generates thousands of test-cases, but cannot
  100% guarantee a property is tested for all cases.

- **Full specification**: where a system generates mathematical proof that
  guarantees your code does what it says it does — not only the thing you want
  it to do, but also nothing more and nothing less. These are incredibly
  sophisticated tools that require highly specialized knowledge, well beyond the
  reach of a typical programmer.

Pact’s tools combine the benefits of full specification without requiring users
to have a mathematics PhD to use them. With Pact’s system, you can specify
particular properties in order to prove they are true for all possible inputs
and states, but unlike full specification, you don’t need to specify every
detail of your program.

An example of a Pact property with particular importance for public blockchain
is conserves-mass: **this ensures that the amount of currency traded from one
account to another doesn’t add or remove funds**, lest you create money out of
thin air.

### How Pact’s FV helps make blockchain safer: A timely case study

![photo courtesy of PeckShield](/assets/blog/1_zWaLQYAGmb095e2l1NOABw.webp)

Recently,
c[rypto exchanges paused services](https://www.coindesk.com/crypto-exchanges-pause-services-over-contract-bugs/)
when a blockchain security team found a bug in some ERC-20 tokens they called
“[BatchOverflow](https://medium.com/@peckshield/alert-new-batchoverflow-bug-in-multiple-erc20-smart-contracts-cve-2018-10299-511067db6536).”
The vulnerabilities would allow hackers to create ridiculously large amounts of
coins out of thin air.

Now, Pact was already designed to be immune to this particular bug (Pact uses
unbounded integers which don’t overflow) but with our property checking system,
you can take it one step further. For instance, we caught a similar bug via our
own formal verification methods.

Let’s work through an example where we write a function to transfer some amount
of a balance across two accounts, with the invariant that balances can not be
negative:

```pact
    (defschema account
      ("user accounts with balances"
        (invariants [(>= balance 0)]))

      balance:integer
      ks:keyset)

    (deftable 'accounts:{account})
```

The following code may look correct at first glance, but it turns out that there
are number of bugs which we can eradicate with the help of our formal
verification tools.

```pact
    (defun transfer (from:string to:string amount:integer)
      ("Transfer money between accounts"
        (properties [(row-enforced 'accounts 'ks from)]))

      (let ((from-bal (at 'balance (read 'accounts from)))
            (from-ks  (at 'ks      (read 'accounts from)))
            (to-bal   (at 'balance (read 'accounts to))))
        (enforce-keyset from-ks)
        (enforce (>= from-bal amount) "Insufficient Funds")
        (update 'accounts from { "balance": (- from-bal amount) })
        (update 'accounts to   { "balance": (+ to-bal amount) })))
```

Let’s add the property `(conserves-mass 'accounts 'balance)` to ensure that it's
not possible for the function to be used to create or destroy any money.

```pact
    (defun transfer (from:string to:string amount:integer)
      ("Transfer money between accounts"
        (properties
          [(row-enforced 'accounts 'ks from)
           (conserves-mass 'accounts 'balance)])

      (let ((from-bal (at 'balance (read 'accounts from)))
            (from-ks  (at 'ks      (read 'accounts from)))
            (to-bal   (at 'balance (read 'accounts to))))
        (enforce-keyset from-ks)
        (enforce (>= from-bal amount) "Insufficient Funds")
        (update 'accounts from { "balance": (- from-bal amount) })
        (update 'accounts to   { "balance": (+ to-bal amount) })))
```

Now, when we use `verify` to check all properties in this module, Pact's
property checker points out that it's able to falsify the positive balance
invariant by passing in an `amount` of `-1` (when the balance is `0`). In this
case it's actually possible for the "sender" to steal money from anyone else by
tranferring a negative amount. Let's fix that by enforcing (`> amount 0`), and
try again:

```pact
    (defun transfer (from:string to:string amount:integer)
      ("Transfer money between accounts"
        (properties
          [(row-enforced 'accounts 'ks from)
           (conserves-mass 'accounts 'balance)])

      (let ((from-bal (at 'balance (read 'accounts from)))
            (from-ks  (at 'ks      (read 'accounts from)))
            (to-bal   (at 'balance (read 'accounts to))))
        (enforce-keyset from-ks)
        (enforce (>= from-bal amount) "Insufficient Funds")
        (enforce (> amount 0)         "Non-positive amount")
        (update 'accounts from { "balance": (- from-bal amount) })
        (update 'accounts to   { "balance": (+ to-bal amount) })))
```

When we run `verify` this time, the property checker is yet again able to find a
combination of inputs that break our mass conservation property! It's able to
falsify the property when `from` and `to` are set to the same account. When this
is the case, we see that the code actually creates money out of thin air!

To zoom in on how this happens, let’s focus on the two `update` calls, where
`from` and `to` are set to the same value, and `from-bal` and `to-bal` are also
set to what we'll call `previous-balance`:

```pact
    (update 'accounts "alice" { "balance": (- previous-balance amount) })
    (update 'accounts "alice" { "balance": (+ previous-balance amount) })
```

In this case, we can see that the second `update` call will completely overwrite
the first one, with the value `(+ previous-balance amount)`. Alice has
effectively created `amount` tokens for free!

We can fix this add another `enforce` (with `(!= from to)`) to prevent this
scenario:

```pact
    (defun transfer (from:string to:string amount:integer)
      ("Transfer money between accounts"
        (properties
          [(row-enforced 'accounts 'ks from)
           (conserves-mass 'accounts 'balance)])

      (let ((from-bal (at 'balance (read 'accounts from)))
            (from-ks  (at 'ks      (read 'accounts from)))
            (to-bal   (at 'balance (read 'accounts to))))
        (enforce-keyset from-ks)
        (enforce (>= from-bal amount) "Insufficient Funds")
        (enforce (> amount 0)         "Non-positive amount")
        (enforce (!= from to)         "Sender is the recipient")
        (update 'accounts from { "balance": (- from-bal amount) })
        (update 'accounts to   { "balance": (+ to-bal amount) })))
```

And now we see that finally the property checker verifies that all of the
following are true:

(1) the sender must be authorized to transfer money, (2) it’s not possible for a
balance to drop below zero, and (3) it’s not possible for money to be created or
destroyed.

**Want to learn more about other properties of Pact? [**Check out the full
docs](https://github.com/kadena-io/pact/blob/ac759c0882d97b60473cfbb5853b1c25259e1213/docs/pact-properties.md)
or visit
[Kadena at Consensus ’18](https://twitter.com/kadena_io/status/994605341332602880)
(May 14–16) for Blockchain Week NYC where we’ll be doing exclusive demos of
various aspects of Pact’s Formal Verification!

**Is this it?** No, property checking and formal verification are just the first
steps in our journey to making Pact the standard language for blockchain.

To keep up with updates on Pact, sign up for Kadena’s
[newsletter](http://kadena.io/newsletter). You can also
[try some elements of Pact](http://kadena.io/try-pact/) in your browser.

_This announcement was compiled with work from Brian Schroeder and Joel Burget._
