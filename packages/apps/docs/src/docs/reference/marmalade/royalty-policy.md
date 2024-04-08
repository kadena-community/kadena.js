---
title: Royalty policy
description:  Describes the schemas, tables, capabilities, and functions defined in the royalty policy.
menu: Policy manager
label: Royalty policy
order: 4
layout: full
---

# Royalty policy

The royalty policy extends the functionality of the base `kip.token-policy-v2`
interface to provide specific rules for token actions and royalty payouts
during the sale of a non-fungible token.

Source code: 
[royalty-policy.pact](https://github.com/kadena-io/marmalade/blob/v2/pact/concrete-policies/royalty-policy/royalty-policy-v1.pact)

## Schema and table

- `royalty-schema`: Stores royalty-related information for NFTs, like the
  creator, royalty rate, and the associated fungible token.
- `royalties` Table: Maintains royalty configurations for NFTs managed under the
  policy, including the token ID and its associated royalty details.

## Capabilities

- `GOVERNANCE`: Governs contract upgrades.
- `ROYALTY` @event: Emits the token-id and registered royalty information during
  `enforce-init`.
- `ROYALTY-PAYOUT` @event: Emits royalty payout information during `enforce-buy`
  if a royalty is paid.

## Functions

- `enforce-init`: Sets initial royalty information for a token, ensuring artists
  get their royalties.
- `enforce-buy`: Manages royalty payouts during sales. Validates and abides by
  the agreed terms between buyer and seller.

## Payload message

**`ROYALTY_SPEC`**:

Initializes and validates a royalty for a fungible token. The `royalty-schema`
object contains necessary fields like `fungible`, `creator`, `creator-guard`,
`royalty-rate`, and `quote-policy`.

## Events

**`ROYALTY`**:

Triggered within the `enforce-buy` function when a sale concludes, and a royalty
payment is made to the token's creator. Emitting line:
`(emit-event (ROYALTY sale-id (at 'id token) royalty-payout creator))`

