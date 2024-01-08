---
title: Royalty Policy
description: Utilizing the Royalty Policy
menu: Royalty Policy
label: Royalty Policy
order: 4
layout: full
---

# Royalty Policy

The Royalty Policy ensures that digital artists continue to benefit from their
creations even after their initial sale. This powerful mechanism connects
creators to their digital assets, guaranteeing them a portion of the profits
with every subsequent sale.

## Concept:

In the realm of digital art, the Royalty Policy acts like a tether between
artists and their creations. Once an artist crafts a unique digital asset,
represented as an NFT (Non-Fungible Token), the relationship doesn't end with
its initial sale. By defining royalty terms using the Royalty Policy, artists
ensure a predetermined royalty rate from every subsequent sale. This royalty is
automatically calculated and transferred to the artist whenever their art is
sold to a new owner.

### Example:

Consider a digital artwork with a royalty specification as:

```pact
"royalty_spec": {
  "fungible": "coin",
  "creator": "k:creator",
  "creator-guard": {"keys": ["creator"], "pred": "keys-all"},
  "royalty-rate": 0.05
}
```

Here, a royalty rate of 5% (0.05) ensures that the artist will receive 5% of all
future sales. This allows the artist to continually benefit from their creation.

## Technical Specifications

### Policy:

`royalty-policy-v1` extends the functionality of the base `kip.token-policy-v2`
interface. It provides specific rules for token actions and royalty payouts
during the sale of a non-fungible token.

### Royalty Specification and Table:

- `royalty-schema`: Stores royalty-related information for NFTs, like the
  creator, royalty rate, and the associated fungible token.
- `royalties` Table: Maintains royalty configurations for NFTs managed under the
  policy, including the token ID and its associated royalty details.

### Capabilities:

- `GOVERNANCE`: Governs contract upgrades.
- `ROYALTY` @event: Emits the token-id and registered royalty information during
  `enforce-init`.
- `ROYALTY-PAYOUT` @event: Emits royalty payout information during `enforce-buy`
  if a royalty is paid.

### Functions:

- `enforce-init`: Sets initial royalty information for a token, ensuring artists
  get their royalties.
- `enforce-buy`: Manages royalty payouts during sales. Validates and abides by
  the agreed terms between buyer and seller.

### Payload Message:

**`ROYALTY_SPEC`**:

Initializes and validates a royalty for a fungible token. The `royalty-schema`
object contains necessary fields like `fungible`, `creator`, `creator-guard`,
`royalty-rate`, and `quote-policy`.

### Events:

**`ROYALTY`**:

Triggered within the `enforce-buy` function when a sale concludes, and a royalty
payment is made to the token's creator. Emitting line:
`(emit-event (ROYALTY sale-id (at 'id token) royalty-payout creator))`

In conclusion, the Royalty Policy revolutionizes how digital artists benefit
from their work. With each transaction, artists are rewarded, emphasizing the
ongoing value of their creations.

---

[Royalty Policy Contract](https://github.com/kadena-io/marmalade/blob/v2/pact/concrete-policies/non-fungible-policy/non-fungible-policy-v1.pact)
