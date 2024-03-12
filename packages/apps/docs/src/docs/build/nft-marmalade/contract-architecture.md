---
title: Layered contract architecture
description: Build a non-fungible token (NFT) marketplace using the Marmalade token standard and Pact smart contracts.
menu:  Non-fungible tokens (NFT)
label: Layered contract architecture
order: 2
layout: full
---

# Layered contract architecture

As you learned in [What is Marmalade?](/build/nftmarmalade/what-is-marmalade), Marmalade is a token standard that defines the interfaces for minting and managing digital items like non-fungible tokens and token collections using Pact smart contracts on the Kadena network. 

The Marmalade standard includes several built-in smart contracts to manage how tokens are minted, offered for sale, and transferred between accounts. 
This multi-layered contract architecture simplifies how you create and manage tokens, define marketplace policies, and implement common token features.

## Contract architecture overview

The Marmalade contract architecture provides separate contracts to handle specific tasks.
For example, there are separate contracts for managing policies applied to token and for managing auction rules for token sales.
This architecture ensures that functions are called in the correct order to complete multi-step transactions.

At a high level, the Marmalade architecture consists of the following core contracts:

- The Marmalade ledger (`marmalade-v2.ledger`) contract is the primary contract that enables buyers and sellers use to interact with the marketplace. 
  This contract keeps track of important token information, including the token metadata, the policies associated with the token, and the record of token ownership. 
  The main functions in the ledger contract are `create-token`, `mint`, `burn`, `transfer`, and `sale`. 
  
- The Marmalade policy manager (`marmalade-v2.policy-manager`) contract enables token creators to use multiple policies to implement the token features. 
  The policy manager acts as a middle layer between the ledger and the policies applied to a token to support more complex rules for transactions between buyers and sellers.
  It's the policy manager that enables sales contracts to enforce secure escrowed transfers, guaranteed royalties, and standardized processes for collecting and distributing assets within marketplaces.

  The following diagram provides a simplified view of how the policy manager contract acts as a middle layer between the ledger contract and policies applied to a token in the token creation process:

  ![Contract workflow to mint a token](/assets/marmalade/mint_flow.png)

- Marmalade sales contracts (`marmalade-v2.sale-contracts`) are used to updates the final price of the quote during the buy process. 
  By managing the sales contract in Marmalade, users can participate safely in different types of auctions without compromising royalty payments. 
  

## Ledger contract

What is it and what is it used for. Think of a Ledger as your personal bank
statement, only in this case its not just for you, it's for everybody
participating in the system. It's this big ol' record that keeps track of the
things within marmalade that happen. You can look at the ledger as the heart of
marmalade, the place where most of the action happens.

In the context of NFTs, the Marmalade Ledger plays a crucial role in managing
the lifecycle of these unique digital assets. It provides the underlying
infrastructure and framework necessary to create, transfer, and track ownership
of NFTs within the Marmalade ecosystem. It acts as a decentralised, transparent,
and immutable ledger of ownership, ensuring that every change in ownership,
creation, or transfer of an NFT is securely and accurately recorded.

The ledger consists of several components. It defines tables and schemas to
organise data related to accounts and tokens. It includes capabilities, which
are functions that perform specific actions and enforce certain conditions. By
leveraging the capabilities, tables, and schemas defined within the ledger,
developers and users can interact with NFTs in a standardised and reliable
manner. The ledger enforces policies and guards to ensure compliance with
predefined rules and constraints, promoting secure and trustworthy NFT
transactions.

**Diving Deeper into the Marmalade Ledger**

When delving further into the ledger's workings, we find each function and
capability playing a unique role in its operation and management.

## Policy manager

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

## Sales contracts

With Sale Contracts, Marmalade V2 introduces a new way to manage the sale of a
token. WHen offering a token up for sale in the ledger, it is now possible to
also provide a reference to a sale contract. This sale contract can then be used
to manage the sale of the token which allows for maximum flexibility and
creativity in the sale of a token.

Security is an important aspect of selling a token, especially when it comes to
guaranteeing royalty. Therefore the sale contracts are required to be registered
within the Policy Manager. This ensures that the sale contract is known to the
Policy Manager and that the Policy Manager can enforce the sale contract. Before
registering the sale contract will undergo a review process to ensure that it is
safe to use.

Where Sale Contracts are aimed at general purpose sales, Marmalade token
creators still have complete flexibility to implement any custom sale logic
within a policy and attach it to the token itself. This allows for a wide range
of sale options and flexibility.

## Sale Contract Interface

The sale contract interface is a light interface which needs to be implemented
by any sale contract. It is used by the Policy Manager to enforce the sale
contract. The interface is defined as follows:

```pact
(defun enforce-quote-update:bool (sale-id:string price:decimal)
  @doc "Read-only Function that is enforced to update quote price at enforce-buy"
)
```

The function `enforce-quote-update` is called in from the `buy` step in the
ledger and takes two parameters:

- sale-id (type: string): This parameter represents the identifier of the sale,
  which is basicaly the pact-id that is created when the token is offered up for
  sale in the ledger.
- price (type: decimal): This parameter represents the finale price associated
  with the sale.

## Available Sale Contracts

The available sale contracts are listed below. More sale contracts will follow
but in the meantime, you can also create your own sale contract. The sale
contracts can be found in the
[Marmalade Github repository](https://github.com/kadena-io/marmalade/tree/v2/pact/sale-contracts)
under `pact/sale-contracts`. Just create a pull request and we will review your
sale contract and take care of deployment and whitelisting it in the Policy
Manager.

Marmalade V2 provides 2 useful sale contracts, which lets token owners easily
create auctions of their choice: [`conventional-auction`](https://docs.kadena.io/marmalade/auctions/conventional-auction) and [`dutch-auction`](https://docs.kadena.io/marmalade/auctions/dutch-auction). 

## Using a Sale Contract

The sale contract can be used by providing the sale contract's module name as
part of the quote specification when calling the `offer` function in the ledger.
Here's an example of the quote specification with the sale contract's module
name mentioned under the key `sale-type`.

```pact
"quote" : {
  "fungible": coin
  ,"sale-price": 0.0
  ,"seller-fungible-account": {
    "account": "k:seller"
    ,"guard": {"keys": ["seller"], "pred": "keys-all"}
  }
  ,"sale-type": "marmalade-sale.conventional-auction"
}
```

**_Note:_** When using a sale contract the `sale-price` during `offer` must
always be `0.0`, since the sale contract will be responsible for updating the
price during the `buy` step.

[Sale Interface Contract](https://github.com/kadena-io/marmalade/blob/v2/pact/policy-manager/sale.interface.pact)
