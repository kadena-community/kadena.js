---
title: Policy manager contract
description: Functions and capabilities defined in the Marmalade policy manager contract enforce the policies you select for tokens and token-related operations.
menu: Policy manager contract
label: Policy manager contract
order: 2
layout: full
---

# Policy manager contract

As discussed in [Layered contract architecture](/build/nft-marmalade/contract-architecture), the policy manager provides a standard for collecting and distributing fungibles and ensures that all of the policies applied to tokens are enforced.
The policy manager provides the following key features:

- The ability to customize and manage token behavior and attributes by enforcing built-in and custom policies.
- Consistent and predictable policy enforcement.
- The ability to stack multiple policies to craft the exact behavior requirement for every token.
- A standardized interface for all policies through
    [`kip.token-policy-v2`](https://github.com/kadena-io/marmalade/blob/v2/pact/kip/.

Source code: [policy-manager.pact](https://github.com/kadena-io/marmalade/blob/v2/pact/policy-manager/policy-manager.pact)

## Tables and schemas

The policy manager contract defines the following tables and schemas:

- **Ledgers table**: Ensures functions are initiated only from the ledger.
- **Concrete policies table**: Maintains concrete policy information for each
  token.
- **Sale whitelist table**: Lists valid whitelisted sale contracts.
- **Quotes table**: Archives quotes for quoted sales.
- **Ledger schema**: Contains the module reference governed by the policy
  manager, adhering strictly to the ledger-v1 interface.
- **Concrete policies schema**: Includes the module reference, strictly using
  the token-policy-v2 interface.

## Capabilities

The policy manager supports a comprehensive set of capabilities to cover a wide
array of functionalities:

- `GOVERNANCE`
- `QUOTE @event`
- `ESCROW`
- `INIT-CALL`
- `TRANSFER-CALL`
- `MINT-CALL`
- `BURN-CALL`
- `OFFER-CALL`
- `WITHDRAW-CALL`
- `BUY-CALL`
- `SALE-GUARD-CALL`
- `FUNGIBLE-TRANSFER-CALL`
- `UPDATE-QUOTE-PRICE @event`
- `SALE-WHITELIST @event`
- `CONCRETE-POLICY @event`
- `OFFER`
- `BUY`
- `WITHDRAW`

## Policy functions

As a general rule, all of the `enforce-**` functions require the `ledger::**-CALL`
capability to be in scope to ensure that functions are initiated from the ledger.
The `enforce-**` functions then extract the policy list from the token input, which lists
the associated policies.

The policy manager defines the following functions:

- **enforce-init**: Initiates `policies::enforce-init` at `marmalade-v2.ledger.create-token`.
- **enforce-mint**: Executes `policies::enforce-mint` at `marmalade-v2.ledger.mint`.
- **enforce-burn**: Activates `policies::enforce-burn` at `marmalade-v2.ledger.burn`.
- **enforce-offer**: Runs `policies::enforce-offer` at `marmalade-v2.ledger.offer` (step 0 of `marmalade-v2.ledger.sale`). 
  Here, an optional `quote` parameter can be accessed in the `env-data` field. 
  If a quote is identified, the offer saves this quote, and escrow accounts are generated.
  Otherwise, the offer continues without quotes.
- **enforce-withdraw**: Operates `policies::enforce-withdraw` at `marmalade-v2.ledger.withdraw` (step 1 rollback of `marmalade-v2.ledger.sale`).
- **enforce-buy**: Engages `policies::enforce-buy` at `marmalade-v2.ledger.buy` (step 1 of `marmalade-v2.ledger.sale`).
- **write-concrete-policy**: This function registers a concrete policy modref into the concrete policies table.

- **get-escrow-account**: Returns the fungible escrow account created for quoted sales at enforce-offer. 
  The escrow account receives the fungible from the buyer and distributes the fungibles to the policies and the seller at the buy step.

- **write-concrete-policy**: Registers concrete policy `modref` into the concrete-policies table.

- **get-concrete-policy**: Returns the `modref` of the concrete policy.

- **enforce-sale-pact**: Ensures that the sale parameter provided to the function is equal to the ID of the currently executing pact. 
  It does this by calling the `pact-id` function to retrieve the ID of the currently executing pact and comparing it to the provided sale parameter. 
  If they are not equal, an exception will be thrown.
