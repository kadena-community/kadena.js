---
title: Guard Policy
description: Utilizing the Guard Policy
menu: Guard Policy
label: Guard Policy
order: 2
layout: full
---

# Guard Policy

The Guard Policy is designed to ensure that all token-related actions - minting,
burning, transferring, and buying/selling - are done securely and only by
authorized parties.

**The Role of Guard Policy in Digital Asset Protection**:

1.  **Token Creation and Initialization**:

    - Envision owning a unique Non-Fungible Token (NFT). When initiating your
      token, you apply the Guard Policy. This policy outlines specific guards or
      rules for different actions, from minting to transfer.
    - A typical configuration for guards looks like:

    ```pact
    'mint-guard': {"keys": ["mint"], "pred": "keys-all"},
    'burn-guard': {"keys": ["burn"], "pred": "keys-all"},
    'sale-guard': {"keys": ["sale"], "pred": "keys-all"},
    'transfer-guard': {"keys": ["transfer"], "pred": "keys-all"}
    ```

2.  **Token Minting**:

    - After creation, you might want to produce new tokens. The Guard Policy
      ensures that only those with the appropriate 'mint' key can do this.

3.  **Token Burning**:

    - If you wish to reduce your token's supply, only those with the 'burn' key
      can proceed with this action under the Guard Policy.

4.  **Token Transfer**:

    - When moving your token to another party, the Guard Policy verifies the
      transfer, ensuring only those with the 'transfer' key can execute it.

5.  **Token Sale**:

    - When you're ready to sell, the Guard Policy checks that only entities with
      the 'sale' key can complete this action. It also confirms the sale ID with
      the ongoing pact to guarantee only authorized sales.

While this might seem intricate, the platform simplifies the process, taking
most of the weight off token owners. All you need to do is set up your guard
configuration.

In essence, the Guard Policy isn't just a security tool; it's a means to ensure
trust, control, and peace of mind in the digital assets realm.

## Technical Specifications

### Schemas and Tables:

- **Schemas**: Contains `guards` that specify values for `mint`, `burn`, `sale`,
  and `transfer`.

- **Tables**: The `policy-guards` table connects token IDs to their guard
  values.

### Capabilities:

- `GOVERNANCE`: Governs contract upgrade access.
- `GUARDS` @event: Emits guard info during `enforce-init`.
- `MINT`: Applies the `mint-guard` in `enforce-mint`.
- `BURN`: Applies the `burn-guard` in `enforce-burn`.
- `SALE`: Uses the `sale-guard` during `enforce-offer`, `enforce-withdraw`, and
  `enforce-buy`.
- `TRANSFER`: Uses the `sale-guard` in `enforce-transfer`.

## Functions:

- `enforce-init`: Initializes the `policy-guards` table with token ID and guard
  values.
- `enforce-mint`: Validates minting processes.
- `enforce-burn`: Validates burning processes.
- `enforce-offer`: Confirms sale offers with guards and verifies the sale-id.
- `enforce-withdraw`: Checks sale withdrawals and the sale-id.
- `enforce-buy`: Validates buying processes and the sale-id.
- `enforce-transfer`: Validates transfers, checking sender, receiver, and
  amount.

In summary, the Guard policy ensures the safety and integrity of digital assets.

---

[Guard Policy Contract](https://github.com/kadena-io/marmalade/blob/v2/pact/concrete-policies/guard-policy/guard-policy-v1.pact)
