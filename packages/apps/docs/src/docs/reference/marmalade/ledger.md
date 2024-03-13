---
title: Ledger contract
description: Functions and capabilities defined in the non-fungible token marketplace Marmalade Ledger contract manage the token lifecycle and keep track of all token-related activity.
menu: Ledger contract
label: Ledger contract
order: 1
layout: full
---

# Ledger contract

This part of the documentation describes the functions and capabilities defined in the non-fungible token marketplace Marmalade Ledger contract.
You can use the Marmalade Ledger contract to create, manage, and transfer tokens minted using the Marmalade token standard and to keep track of all token-related activity.

- Ledger functions
- Ledger capabilities

## create-token-id

Use `create-token-id` to generate a unique token identifier with the specified token identifier.

### Arguments

Use the following arguments to create the token identifier.

| Argument | Type | Description
| `details` | object | Defines token properties using the metadata schema in JSON file format.
| `creation-guard` | Specifies the temporary guard—for example, a keyset—used to generate the token identifier. This guard isn't stored and ensure that only the  owner of the creation key can create a specific token identifier.

Before creating a token, you must choose a temporary guard.
The guard can be

- A keyset you've already defined or used in the guard-policy.
- A single-use keyset that won't be used again.
- Another type guard.

This guard becomes part of the hashed data in the `token-id` string prefixed with `t:`. 
Including the guard in the hashed token identifier protects anyone else from creating the token. 
With this mechanism, only you—as the owner of the creation key—can create the token specified by the `token-id` string.

### Example

Generate a unique `token-id` by calling the following function:

`(ledger.create-token-id details creation-guard)`

## create-token

Use `create-token` to create a token with the specified token identifier. 

### Arguments

Use the following arguments to create a token.

| Argument | Type | Description
| `id` | String | Specifies the unique token identifier generated using the`create-token-id` function and formatted as `t:{token-detail-hash}`. 
| `precision` | integer | Specifies the number of decimals allowed for the token supply amount. For non-fungible tokens, the precision must be 0, and should be enforced in the policy's `enforce-init`.
| `uri` | string | Specifies the uniform resource identifier (uri) to an external JSON file containing token metadata.
| `policies` | list| Specifies one or more policy contracts with custom functions to execute at marmalade functions
| `creation-guard` | Specifies the temporary guard—for example, a keyset—used to generate the token identifier. This guard isn't stored and ensure that only the  owner of the creation key can create a specific token identifier.

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
