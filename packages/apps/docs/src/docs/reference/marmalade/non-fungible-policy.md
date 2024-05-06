---
title: Non-fungible policy
description: Describes the schemas, tables, capabilities, and functions defined in the non-fungible policy.
menu: Policy manager
label: Non-fungible policy
order: 3
layout: full
---

# Non-fungible policy

The non-fungible policy ensures the uniqueness of digital assets.
If you apply this policy to a token, the policy guarantees that the token supply is one with a precision of zero.

Source code: [non-fungible-policy.pact](https://github.com/kadena-io/marmalade/blob/main/pact/concrete-policies/non-fungible-policy/non-fungible-policy-v1.pact)

## Capabilities

The non-fungible policy smart contract defines the following capability to manage permissions:

- `GOVERNANCE`: Oversees access control for contract modifications.

## Functions

The guard policy smart contract defines the following functions to enforce restrictions of different token activities:

- `enforce-init`: Ensures proper initiation of tokens using a ledger guard. This
  sets the stage for minting by storing the mint guard associated with the
  token.
- `enforce-mint`: Regulates the minting process, maintaining a fixed supply of 1
  for each token, thus preserving its non-fungible nature.
