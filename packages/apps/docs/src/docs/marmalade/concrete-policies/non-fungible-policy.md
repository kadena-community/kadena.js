---
title: Non Fungible Policy
description: Utilizing the Non Fungible Policy
menu: Non Fungible Policy
label: Non Fungible Policy
order: 3
layout: full
---

# Non-Fungible Policy

The Non Fungable Policy is designed to safeguard the individuality ( Ensuring
Digital Uniqueness ) of digital assets, known as Non-Fungible Tokens (NFTs).
This policy guarantees the authenticity and uniqueness of every digital
creation.

## Technical Specifications

**Non-fungible-policy-v1**:

- **Purpose**: Manages the creation and distinction of NFTs with a fixed supply
  of ONE.
- **Interface**: Implements the kip.token-policy-v2 interface.
- **Actions**: Handles various token-related functions like minting, burning,
  and transferring.

### Specifications and Tables:

- **Policy functions**: Set rules for different token-related tasks.

### Capabilities:

- `GOVERNANCE`: Oversees access control for contract modifications.

### Functions:

- `enforce-init`: Ensures proper initiation of tokens using a ledger guard. This
  sets the stage for minting by storing the mint guard associated with the
  token.
- `enforce-mint`: Regulates the minting process, maintaining a fixed supply of 1
  for each token, thus preserving its non-fungible nature.

---

[Non Fungible Policy Contract](https://github.com/kadena-io/marmalade/blob/v2/pact/concrete-policies/non-fungible-policy/non-fungible-policy-v1.pact)
