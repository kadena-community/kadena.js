---
title: Marmalade NFT architecture
description: Build a non-fungible token (NFT) marketplace using Marmalade and Pact smart contracts.
menu:  Non-fungible tokens (NFT)
label: Marmalade NFT architecture
order: 2
layout: full
---

# Marmalade NFT contract architecture

Marmalade is a non-fungible token (NFT) standard that you can use to build an NFT marketplace using Pact smart contracts on the Kadena blockchain network. 

In a Marmalade NFT marketplace, multiple smart contracts execute the logic defined in the token policies you implement as the contract author.
With these customizable contracts, Marmalade simplifies how you create and manage tokens, define marketplace policies, and implement common token features.

## Contract architecture overview

Marmalade has a multi-layered architecture with specialized contracts to handle specific tasks.
For example, there are separate contracts for defining policies applied to token and managing auction rules for token sales.
The contracts calls functions in layers to complete multi-step transactions in the proper sequence.

At a high level, the Marmalade architecture consists of the following contracts:
- The `marmalade-v2.ledger` contract is the main contract in a Marmalade NFT marketplace.
  The `ledger` is also the primary contract for buyers and sellers to interact with the marketplace. 
  This contract stores token information, including the token accounts and the policies associated with the token. 
  The main functions in the ledger contract are `create-token`, `mint`, `burn`, `transfer`, and `sale`. 
  
  For more about the ledger, see [NFT marketplace ledger](/marmalade/architecture/ledger).

- The `marmalade-v2.policy-manager` contract enables token creators to use multiple policies to implement the token features. 
  The `policy-manager` acts as a middle layer between the ledger and the policies applied to a token. 
  The `policy-manager` also enables more complex interaction between policies and sale contracts to support secure escrowed transfers, creative auctions, guaranteed royalties, and standardized processes within marketplaces, including a standard for collecting and distributing fungible assets between the seller and buyer through an escrow. 
  
  For more information about the policy-manager, see [NFT marketplace policy manager](/marmalade/architecture/policy-manager).

- The `marmalade-v2.sale-contracts` contract updates the final price of the quote during the buy process. 
  By managing the sales contract in Marmalade, users can participate safely in creative auctions without compromising royalty payments. 
  
  For more information about sale contracts, see [NFT marketplace sales](/marmalade/architecture/sale-contracts).

| Contract | Description
| :-------- | :------------
| `ledger` | The `marmalade-v2.ledger` contract is the main contract in Marmalade and is the primary contract for user interaction. This contract stores token information, including the token accounts and the policies associated with the token. The main functions in the contract are `create-token`, `mint`, `burn`, `transfer`, and `sale`. For more about the ledger, see [NFT marketplace ledger](/marmalade/architecture/ledger)
| `policy-manager` | The `marmalade-v2.policy-manager` contract enables token creators to use multiple policies to implement the token features. The policy-manager acts as a middleware between the ledger and the policies. The `policy-manager` also enables more complex interaction between policies and sale contracts to support secure escrowed transfers, creative auctions, guaranteed royalties, and standardized processes within marketplaces, including a standard for the collection and distribution of fungibles between the seller and buyer through an escrow. For more information about the policy-manager, see [NFT marketplace policy manager](/marmalade/architecture/policy-manager).
| `sale-contracts` | The `marmalade-v2.sale-contracts` contract updates the final price of the quote during the buy process. By managing the sale contract in Marmalade, users can participate safely in creative auctions without compromising royalty payments. For more information about sale contracts, see [NFT marketplace sales](/marmalade/architecture/sale-contracts).

## Contract workflow

The following diagram provides a simplified view of how the policy-manager contract acts as a middle layer between the ledger contract and policies applied to a token in the token creation process:

![Contract workflow to mint a token](/assets/marmalade/mint_flow.png)
