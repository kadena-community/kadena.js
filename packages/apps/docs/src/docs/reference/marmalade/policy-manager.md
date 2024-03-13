---
title: Policy manager contract
description: The Power of the Policy Manager in Marmalade V2
menu: Policy manager contract
label: Policy manager contract
order: 2
layout: full
---

# Policy Manager in Marmalade V2

Marmalade V2 introduces a groundbreaking Policy Manager, a tool that transforms
how policies for non-fungible tokens (NFTs) are curated and implemented. With
this innovation, dApps, marketplaces, and wallets can seamlessly identify token
properties like collections, non-fungibility, and royalty specifications,
leveraging the concrete policies within the Policy Manager.

## Overview

The Policy Manager stands as a central repository for these policies, supporting
both general-purpose policies and concrete policies. When a general-purpose
policy becomes widely accepted, it has the potential to be assimilated as a
concrete policy, contributing to the stability and uniformity of token
attributes.

**Key Features of the Policy Manager:**

1.  **Tailored Policies**: Customize and manage policies to define your NFTs'
    behavior and attributes.
2.  **Dynamic Implementation**: Utilize both immutable Concrete Policies
    (provided by Marmalade's creators) and Custom Policies (created by anyone)
    for additional, unique functionalities.
3.  **Policy Stacking**: Stack multiple policies with tokens, resulting in
    dynamic and intricate NFTs.
4.  **Standardized Enforcement**: Policies are consistently enforced across the
    Marmalade ecosystem through the
    [`kip.token-policy-v2`](https://github.com/kadena-io/marmalade/blob/v2/pact/kip/token-policy-v2.pact)
    interface.

Venturing further into the realm of Marmalade V2, token creators gain the
flexibility to program tokens by selecting multiple policies, encompassing rules
for creation, mints, transfers, burns, sales, and more.

## Technical Details

### Policy Manager and Quotes

The Policy Manager promotes a standard for collecting and distributing
fungibles. In the predecessor, Marmalade V1, the fixed-quote-policy managed
fungible transfers during sales. Now, with Marmalade V2, every token optionally
benefits from this feature via the Policy Manager.

### Components

- **Ledgers Table**: Ensures functions are initiated only from the ledger.
- **Concrete Policies Table**: Maintains concrete policy information for each
  token.
- **Sale Whitelist Table**: Lists valid whitelisted sale contracts.
- **Quotes Table**: Archives quotes for quoted sales.
- **Ledger Schema**: Contains the module reference governed by the policy
  manager, adhering strictly to the ledger-v1 interface.
- **Concrete Policies Schema**: Includes the module reference, strictly using
  the token-policy-v2 interface.

### Capabilities

The Policy Manager supports a comprehensive set of capabilities to cover a wide
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

### Policy Functions

**General Principle**: The `enforce-**` functions require the `ledger::**-CALL`
capability to be in scope, ensuring functions are initiated from the ledger.
These functions then extract the policy list from the token input, which lists
the associated policies.

- **enforce-init**: Initiates `policies::enforce-init` at
  `marmalade-v2.ledger.create-token`.
- **enforce-mint**: Executes `policies::enforce-mint` at
  `marmalade-v2.ledger.mint`.
- **enforce-burn**: Activates `policies::enforce-burn` at
  `marmalade-v2.ledger.burn`.
- **enforce-offer**: Runs `policies::enforce-offer` at
  `marmalade-v2.ledger.offer` (step 0 of `marmalade-v2.ledger.sale`). Here, an
  optional parameter "quote" can be accessed in the `env-data` field. If a quote
  is identified, the offer saves this quote, and escrow accounts are generated.
  Otherwise, the offer continues without quotes.
- **enforce-withdraw**: Operates `policies::enforce-withdraw` at
  `marmalade-v2.ledger.withdraw` (step 1 rollback of
  `marmalade-v2.ledger.sale`).
- **enforce-buy**: Engages `policies::enforce-buy` at `marmalade-v2.ledger.buy`
  (step 1 of `marmalade-v2.ledger.sale`).
- **write-concrete-policy**: This function registers a concrete policy modref
  into the concrete policies table.

- **get-escrow-account**: Returns the fungible escrow account created for quoted
  sales at enforce-offer. The escrow account receives the fungible from the
  buyer and distributes the fungibles to the policies and the seller at buy
  step.

- **write-concrete-policy**: Registers concrete policy modref into the
  concrete-policies table.

- **get-concrete-policy**: Returns the modref of the concrete policy.
- **enforce-sale-pact**: Ensures that the sale parameter provided to the
  function is equal to the ID of the currently executing pact. It does this by
  calling the pact-id function to retrieve the ID of the currently executing
  pact and comparing it to the provided sale parameter. If they are not equal,
  an exception will be thrown".

With the Policy Manager and its support for policy stacking, you can craft
sophisticated and innovative NFTs that push the boundaries of creativity and
functionality. As you embark on this exciting journey, we await your innovative
ideas and creativity to further enrich the NFT experience within Kadena's
Marmalade ecosystem. Happy crafting!

---

[Policy Manager Contract](https://github.com/kadena-io/marmalade/blob/v2/pact/policy-manager/policy-manager.pact)
