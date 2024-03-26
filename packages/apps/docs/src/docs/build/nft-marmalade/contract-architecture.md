---
title: Layered contract architecture
description: Build a non-fungible token (NFT) marketplace using the Marmalade token standard and Pact smart contracts.
menu:  Non-fungible tokens (NFT)
label: Layered contract architecture
order: 3
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

At a high level, the Marmalade architecture consists of the following main contracts:

- The Marmalade **ledger** (`marmalade-v2.ledger`) contract provides the core functionality of the marketplace with the ability to create, mint, burn, transfer, buy, and sell tokens. 
  
- The Marmalade **policy manager** (`marmalade-v2.policy-manager`) contract enables token creators to configure rules to control token properties and allowed operations. 

- Marmalade **sale** (`marmalade-v2.sale-contracts`) contracts enable tokens to be offered for sale using sales models that don't rely on a fixed price.

## Ledger contract

The Marmalade ledger contract—`marmalade-v2.ledger`—is the primary contract that enables buyers and sellers use to interact with the marketplace. 
This contract keeps track of important information for everyone participating in the marketplace and records every transaction that takes place involving tokens minted with Marmalade. 
The ledger stores information about tokens, including the token metadata, the policies associated with the token, and the record of token ownership. 
The main functions in the ledger contract are  

The Marmalade Ledger plays a central role in enabling you to manage the lifecycle of non-fungible tokens and other digital assets. 
The ledger contract provides the core functions—such as `create-token`, `mint`, `burn`, `transfer`, and `sale`—that are required to create, transfer, and track the ownership of tokens. 
The ledger contract ensures that all token-related activity is recorded accurately and securely in a transparent, traceable, and tamper-proof way.

The ledger contract defines the tables and schemas to store information about accounts and tokens. 
The ledger contract also defines specific **capabilities** to perform specific actions and enforce specific conditions when those actions are performed. 
The tables, schemas, and capabilities defined in the ledger contract ensure that token creators, token owners, and token buyers comply with predefined rules and constraints when they interact.

By enforcing rules and constraints through token policies, Marmalade promotes more secure and trustworthy transactions for all marketplace participants.

For more technical details about the Marmalade ledger contract, see [Ledger contract](/reference/marmalade).

## Policy manager

The Marmalade policy manager contract—`marmalade-v2.policy-manager`—enables token creators to select multiple policies to configure the specific token features they want to implement. 
The policy manager acts as a middle layer between the ledger and the individual policies applied to a token. 

The policy manager gives token creators greater flexibility in defining rules for transferring ownership and managing transactions between buyers and sellers.
For example, it's the policy manager contract that enables a sale to require a secure escrow account to complete a token transfer or to guarantee royalty payments.

The following diagram provides a simplified view of how the policy manager contract acts as a middle layer between the ledger contract and policies applied to a token in the token creation process:

![Contract workflow to mint a token](/assets/marmalade/mint_flow.png)

By using the policy manager contract, you can standardize the rules for creating asset properties, collecting payments, and transferring ownership within a marketplaces, providing a more consistent experience for marketplace participants.

With the policy manager contract, you can choose token properties from built-in policies—like the non-fungible policy and royalty policy—or create custom policies to use on their own or in combination with the built-in policies.

For more technical details about the Marmalade policy manager contract, see []().

## Sales-specific contracts

Marmalade supports sales-specific contracts to provide flexibility for how tokens can be sold.
Sales-specific contracts allow you to define different sales models with different sales mechanics—like auctions or limited offering periods—instead of simply quoting an asking price.

When you offer a token for sale in the ledger, you can provide a reference to a specific contract that defines the rules for the sale. 
For example, the sale contract you reference might have auction rules that specify an opening price and how to handle incoming bids.
Depending on the rules defined in the referenced sale contract, the policy manager contract updates the final price of the quote during the buy process. 

By using a separate contract to define and manage the mechanics of the sales process, you can ensure that buyers and sellers can participate safely without compromising royalty payments. 
It's important to note that contracts that define a sales model—the sale contract—must be reviewed and registered in the policy manager so that the policy manager can enforce the contract rules.

The following diagram provides a simplified view of the interaction between the ledger, policy manager, and a sale contract:

![Contract interaction using a sale contract](/assets/marmalade/contracts-workflow.png)

For information about registered sales-specific contracts, see [`conventional-auction`](https://docs.kadena.io/marmalade/auctions/conventional-auction) and [`dutch-auction`](https://docs.kadena.io/marmalade/auctions/dutch-auction).
For information about creating an offer that references a sales-specific contract, see []().

For more information about how to implement the sale contract interface and creating your own sale contract, see [Create a custom sale contract]().

## Policies

Individual policies give you granular control over token properties and token-related activity, including minting, burning, transferring, and buying tokens.
Token policies are implemented as smart contracts based on the interfaces defined in the [`kip.token-policy-v2`](https://github.com/kadena-io/marmalade/blob/main/pact/kip/token-policy-v2.pact) standard.
There are several built-in policies—called **concrete policies**—that are configured to handle the most common marketplace use cases. 

The built-in concrete policies are officially released and maintained to provide ready-to-use implementations of common features that don't require any custom development work.

The concrete policies currently available provide the following features:

- Guard enforcement policy.
  If the `guard-policy` is applied to a token, a keyset or another type of guard must be specified to initiate any token-related activity, bolstering security against unauthorized minting.
- Non-fungible token enforcement policy.
  If the `non-fungible-policy` is applied to a token, the token is guaranteed to be unique with a maximum supply of one and precision set to zero.
- Royalty enforcement policy.
  If the `royalty-policy` is applied to a token, you can designate an account to receive royalties each time the token is transferred to a new owner, fostering an ongoing revenue stream from NFT sales.
- Collection identification policy.
  If the `collection-policy` is applied to a token, the token is identified as part of a collection and can be discovered as an item in a toke list.

You can also create **custom policies** to implement unique rules or enforce specific behavior not covered by the concrete policies.
You can find examples of custom policies in the [examples/policies](https://github.com/kadena-io/marmalade/tree/main/examples/policies) repository.

Example policies aren't officially released and maintained, but can be useful models for developing your own custom policies.
If an example or custom policy seems broadly useful to a general audience, it can be promoted to a concrete policy, contributing to the overall evolution of the Marmalade marketplace.