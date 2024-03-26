---
title: Collection policy
description: Describes the schemas, tables, capabilities, and functions defined in the collection policy contract enable you to manage a token collection.
menu: Collection policy
label: Collection Policy
order: 1
layout: full
---

# Collection policy

The collection policy implements the `kip.token-policy-v2` interface to simplify how you can organize tokens into collections.
This part of the documentation describes the functions and capabilities defined in the collection policy contract.

Source code: [collection-policy.pact](https://github.com/kadena-io/marmalade/blob/v2/pact/concrete-policies/collection-policy/collection-policy-v1.pact)

## Schemas and tables

The `collection` schema describes the following information for a token collection: 

id:string
name:string
size:integer
max-size:integer
operator-guard:guard
operator-account:string

This information is stored in the `collection` table.

The `token` schema describes the following information for a token in a collection:

id:string
collection-id:string

This information is stored in the `token` table.

## Capabilities

The collection policy smart contract defines the following capabilities to manage permissions:

- `GOVERNANCE`: Restricts authority to the `marmalade-admin` keyset and ensures only authorized entities can upgrade the contract.
- `OPERATOR`: Grants authority to the collection's operator for specific actions.
- `COLLECTION` @event: Regulates collection creation and broadcasts of the COLLECTION event.
- `TOKEN-COLLECTION` @event: Manages token addition to collections and announces such additions.

## Functions

The dutch auction contract defines the following functions to manage token collections:

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
