---
title: Ledger contract
description: What is the Marmalade Ledger
menu: Ledger contract
label: Ledger contract
order: 1
layout: full
---

# What is the Marmalade Ledger?

What is it and what is it used for. Think of a Ledger as your personal bank
statement, only in this case its not just for you, it's for everybody
participating in the system. It's this big ol' record that keeps track of the
things within marmalade that happen. You can look at the ledger as the heart of
marmalade, the place where most of the action happens.

In the context of NFTs, the Marmalade Ledger plays a crucial role in managing
the lifecycle of these unique digital assets. It provides the underlying
infrastructure and framework necessary to create, transfer, and track ownership
of NFTs within the Marmalade ecosystem. It acts as a decentralised, transparent,
and immutable ledger of ownership, ensuring that every change in ownership,
creation, or transfer of an NFT is securely and accurately recorded.

The ledger consists of several components. It defines tables and schemas to
organise data related to accounts and tokens. It includes capabilities, which
are functions that perform specific actions and enforce certain conditions. By
leveraging the capabilities, tables, and schemas defined within the ledger,
developers and users can interact with NFTs in a standardised and reliable
manner. The ledger enforces policies and guards to ensure compliance with
predefined rules and constraints, promoting secure and trustworthy NFT
transactions.

**Diving Deeper into the Marmalade Ledger**

When delving further into the ledger's workings, we find each function and
capability playing a unique role in its operation and management.

## Marmalade functions

**Create Token**

A Token is created in marmalade via running `create-token`. Arguments include:

- `id`: token-id, formatted in `t:{token-detail-hash}`. Should be created using
  `create-token-id`
- `precision`: Number of decimals allowed for for the token amount. For one-off
  token, precision must be 0, and should be enforced in the policy's
  `enforce-init`.
- `uri`: url to external JSON containing metadata
- `policies`: policies contracts with custom functions to execute at marmalade
  functions
- `creation-guard`: Non stored guard (usally a Keyset). Must be used to reserve
  a `token-id`

`policy-manager.enforce-init` calls `policy::enforce-init` in stored
token-policies, and the function is executed in `ledger.create-token`.

**Creation guard usage**

Before creating a token, the creator must choose a temporary guard, which can be

- An usual keyset. (eg: one already used in the guard-policy).
- But also a single-use keyset, since it isn't stored and won't be needed
  anymore.
- Some more complex setups could involve other guard types (eg: when token
  creations are managed by a SC).

This guard will be part of the `token-id` (starting `t:`) creation. As a
consequence, it protects the legit creator from being front-runned during token
creation. With this mechanism, only the legit creator who owns the creation key
can create a specific `token-id`.

Creation steps:

- Generate a unique `token-id` by calling
  `(ledger.create-token-id details creation-guard)`
- Create the token by calling `(ledger.create-token ... creation-guard)`
  - This transaction must include the `TOKEN` capability signed with the keyset
    `creation-guard`

**Mint Token**

Token amount is minted to an account at `mint`. Arguments include:

- `id`: token-id
- `account`: account that will receive the minted token
- `guard`: guard of the minted account
- `amount`: amount to be minted

`policy-manager.enforce-mint` calls `policy:enforce-mint` in stored
token-policies, and the function is executed at `ledger.mint`.

**Burn Token**

Token amount is burnt from an account at `burn`. Arguments include:

- `id`: token-id
- `account`: account where the token will be burnt from
- `amount`: amount to be burnt

`policy-manager.enforce-burn` calls `policy:enforce-burn` in stored
token-policies, and the function is executed at `ledger.burn`.

**Transfer**

Token amount is transferred from sender to receiver at `transfer`. Arguments
include:

- `id`: token-id
- `sender`: sender account
- `receiver`: receiver account
- `amount`: amount to be transferred

`policy-manager.enforce-transfer` calls `policy:enforce-transfer` in stored
token-policies, and the function is executed at `ledger.transfer`.

**Sale**

`sale` allows a two-step offer - buy escrow system using
[defpact](/pact/reference/syntax#defpacth1545231271). Arguments include:

- `id`: token-id
- `seller`: seller account
- `amount`: amount to be sold
- `timeout`: timeout of the offer

**offer**

Step 0 of `sale` executes `offer`. `offer` transfers the token from the seller
to the escrow account.

`policy-manager.enforce-offer` calls `policy:enforce-offer` in stored
token-policies, and the function is executed at step 0 of `sale`.

**withdraw (cont)**

Step 0-rollback executes `withdraw`. `withdraw` transfers token from the escrow
back to the seller. `withdraw` can be executed after timeout, by sending in
`cont` command with `rollback: true`, `step: 0`. Formatting `cont` commands can
be read in
[here](/pact/reference/rest-api#yaml-continuation-command-requesth-2127282742)

`policy-manager.enforce-withdraw` calls `policy:enforce-withdraw` in stored
token-policies, and the function is executed at step 0-rollback of `sale`.

**buy (cont)**

Step 1 executes `buy`. `buy` transfers token from the escrow to the buyer. `buy`
can be executed before `timeout`. The `buyer` and `buyer-guard` information is
read from the `env-data` of the command instead of passing in arguments. Just
like `withdraw`, `buy` is executed using `cont` command with `rollback:false`,
`step: 0`.

`policy-manager.enforce-buy` calls `policy:enforce-buy` in stored
token-policies, and the function is executed at step 1 of `sale`.

---

To sum up, the Marmalade Ledger is a sophisticated system that records and
manages transactions and operation within the Marmalade platform. It ensures
every transaction is accurate, every policy is enforced, and every account is
up-to-date.

We hope you've got a sense of what the marmalade ledger is all about.

Whether you're a code whizz or a crypto newbie, we hope this journey into the
workings of this ledger has helped to unravel some of the mysteries behind it.
You could be buying a new digital art piece today or selling some tomorrow.
Marmalade makes it possible.

---

[Ledger Contract](https://github.com/kadena-io/marmalade/blob/v2/pact/ledger.pact)
