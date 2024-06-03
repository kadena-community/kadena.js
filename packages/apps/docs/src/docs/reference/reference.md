---
title: Reference
subTitle: "Find technical reference information all in on place"
id: reference
description: "Find technical reference information for the Pact smart contract language, the Chainweb protocol, and other Kadena tools."
menu: Reference
label: Introduction
order: 1
layout: landing
tags: [pact, typescript, account, transactions, utils]
---

# Smart contracts: Pact

Pact is a smart contract programming language, specifically designed for correct, transactional execution on the Kadena high-performance blockchain.

The reference information for the Pact programming language covers the following topics:

- [Syntax and keywords](/reference/syntax) provides a quick reference to the language syntax and how to declare different types.
- [Pact functions](/reference/functions) describes all of the native, built-in functions in the Pact programming languages organized into different categories
- [Property validation](/reference/property-checking) explains how you can use Pact property checking to validate your code and the properties and invariants you can use to test the code for correctness.
- [Sequenced pacts](/reference/pacts) highlights the use of multi-step transactions using pact definitions.
- [Pact REPL](/reference/pact-repl) provides command-line reference information for the Pact REPL interactive command-line program.
- [Pact REST API](/reference/rest-api) describes the Pact REST API and how you can use it to interact with the blockchain.

For information about the design of the Pact programming language, see the [Pact white paper](https://cdn.sanity.io/files/agrhq0bu/production/70f01649395af96655ca94d331fb1bd01af9fc8a.pdf) or the [Pact home page](https://www.kadena.io/pact).

## Kadena command-line interface

[Command-line interface](/reference/kadena-cli) provides a complete set of commands and command-line options for setting up and managing a local development environment using a command-line workflow.

## Frontend libraries: Kadena client

The Kadena client is a collection`of libraries, functions, and utilities written in TypeScript to provide a familiar application programming interface (API) for interacting with smart contracts and the Kadena network. 

The Kadena client includes the following packages:

- [Kadena client](/reference/kadena-client) is the primary TypeScript library that provides a frontend application programming interface (API) for performing common tasks such as calling functions in Pact smart contracts and submitting transactions to the Kadena network.

- [Client utilities](reference/kadena-client/client-utils) is a TypeScript library with a simplified application programming interface (API) for helper utilities.

- [Cryptographic utilities](/reference/kadena-client/cryptographic-utils) provides a collection of utility functions to perform common cryptographic operations.

- The [pactjs-cli](/reference/kadena-client/pactjs-cli) and [pactjs-generator](/reference/kadena-client/pactjs-generator) libraries generate TypeScript types from Pact contracts.

## NFT marketplace: Marmalade technical reference

The Marmalade token standard defines the interfaces for minting digital items—including non-fungible tokens, token collections, and policy-driven marketplace communities—using Pact smart contracts on the Kadena network.

The reference information for the Marmalade standard covers the following topics:

- [Ledger](/reference/nft-ref) describes the core functions defined in the Marmalade ledger contract.

- [Policy manager](/reference/nft-ref/policy-manager) describes the core functions defined in the policy manager contract and provides reference information for the concrete policies.

- [Sales-specific contracts](/reference/nft-ref/sale-contracts) provides an overview for creating a custom sale contract and provides reference information for the registered sale contracts.

## Queries and indexing: Kadena GraphQL

Documentation for the Kadena GraphQL schema is embedded in the GraphQL Explorer.

## Authentication and authorization: Kadena SpireKey

[Kadena SpireKey technical specifications](/reference/spirekey) describes the Kadena SpireKey endpoints and required parameters that you use to integrate Kadena SpireKey account management with decentralized applications.

## Consensus protocol: Chainweb API


