---
title: Guard policy
description: Describes the schemas, tables, capabilities, and functions defined in the guard policy.
menu: Guard Policy
label: Guard Policy
order: 2
layout: full
---

# Guard policy

The guard policy ensures that all token-related actions—minting,
burning, transferring, buying, and selling—can only be performed by
authorized parties.
If you apply the guard policy when you create a token, you can specify who is authorized to perform each type of token activity.

This part of the documentation describes the schemas, tables, capabilities, and functions defined in the Marmalade guard policy contract.

Source code: [guard-policy.pact](https://github.com/kadena-io/marmalade/blob/main/pact/concrete-policies/guard-policy/guard-policy-v1.pact)

## Schema and table

The guard policy smart contract defines one schema and one table.
The `guards` schema describes guard values for `mint`, `burn`, `sale`, and `transfer` operations.
The `policy-guards` table maps token identifiers to their guard values.

## Capabilities

The guard policy smart contract defines the following capabilities to manage permissions:

- `GOVERNANCE`: Governs contract upgrade access.
- `GUARDS` @event: Emits guard info during `enforce-init`.
- `MINT`: Applies the `mint-guard` in `enforce-mint`.
- `BURN`: Applies the `burn-guard` in `enforce-burn`.
- `SALE`: Uses the `sale-guard` during `enforce-offer`, `enforce-withdraw`, and
  `enforce-buy`.
- `TRANSFER`: Uses the `sale-guard` in `enforce-transfer`.

## Functions

The guard policy smart contract defines the following functions to enforce restrictions of different token activities:

- `enforce-init`: Initializes the `policy-guards` table with token ID and guard
  values.
- `enforce-mint`: Validates minting processes.
- `enforce-burn`: Validates burning processes.
- `enforce-offer`: Confirms sale offers with guards and verifies the sale-id.
- `enforce-withdraw`: Checks sale withdrawals and the sale-id.
- `enforce-buy`: Validates buying processes and the sale-id.
- `enforce-transfer`: Validates transfers, checking sender, receiver, and
  amount.

