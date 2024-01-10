---
title: Collection Policy
description: Utilizing the Collection Pßolicy
menu: Collection Policy
label: Collection Policy
order: 1
layout: full
---

# Collection Policy

Marmalade's Collection Policy is a policy designed for creators or operators to
organise their tokens into a curated group, just like creating an art gallery or
a collection of precious items. Imagine you have a bunch of unique tokens, each
representing something special to you. With the Collection Policy, you can
gather these tokens into a curated group called a "Collection."

Creating an NFT collection in this example could be seen as curating an art
exhibition in a digital realm. It's a captivating process where you bring
together unique creations under a single theme or concept.

in shorts these steps are as followed:

- **The Birth of the Collection**: Establishing a new digital space to host
  unique tokens, similar to naming an art exhibition. It's as simple as calling
  the create-collection function and setting the parameters.
- **Crafting the Tokens**: Assigning each token a unique ID and defining its
  rules, like ownership and transfer rights.
- **Minting - The Final Touch**: Embedding the token onto the kadena blockchain,
  utilizing marmalade, marking its official entry into the digital world.

## Technical Specifications

The Collection Policy in Marmalade v2 emphasizes ease of use. Contrasting its
predecessor Marmalade v1, Marmalade v2 opts for simplicity, delegating the
whitelist to a separate policy. It's crucial to highlight that this policy
seamlessly implements the `kip.token-policy-v2` interface.

- **Schemas**: Uses `collection` and `token` schemas to store the collection and
  token-related narratives.
- **Tables**: Utilizes the `collections` and `tokens` tables to archive data
  about collections and tokens.
- **Capabilities**:
  - `GOVERNANCE`: Ensures only authorized entities can upgrade the contract.
  - `COLLECTION` @event: Regulates collection creation and broadcasts its
    inception.
  - `TOKEN-COLLECTION` @event: Manages token addition to collections and
    announces such additions.

**Functions**:

- **`create-collection:`** Initiates a collection by defining its name, size,
  and overseeing entity.
- **`enforce-init:`** Adds tokens to the collection while abiding by the
  collection's set size. It also determines the entity permitted to mint the
  token.
- **`enforce-mint`:** Ascertain that the minting entity has appropriate
  permissions.
- **`create-collection-id:`** Retrieves a collection identifier using the
  collection's name.
- **`get-collection:`** Extracts collection details using a collection ID.
- **`get-token:`** Gleans token details, focusing on its association with a
  collection, via the token ID.

**Capabilities Overview**:

- `GOVERNANCE`: Restricts authority to the `marmalade-admin` keyset.
- `COLLECTION`: Enables the publication of the COLLECTION event.
- `OPERATOR`: Grants authority to the collection's operator for specific
  actions.

With the Collection Policy, you have the power to showcase your creativity and
share your favorite tokens in a safe and organised way.

---

[Quick guide: Creating a collection]: Coming soon

[Collection Policy Contract](https://github.com/kadena-io/marmalade/blob/v2/pact/concrete-policies/collection-policy/collection-policy-v1.pact)
