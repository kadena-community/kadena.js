---
title: Marmalade V2 - An Architectural Overview
description:
  Marmalade is an NFT smart contract system in Kadena’s blockchain, which is
  simply a system of multiple contracts that programs and runs logic configured
  by the token policies that the token is built with. Marmalade has been in
  action for several years, and now we’ve diligently upgraded to Marmalade V2,
  encapsulating an entirely new system and simplifying the process of engaging
  with NFTs. Most excitingly, Marmalade V2 is now live on testnet!
menu: Marmalade V2 - An Architectural Overview
label: Marmalade V2 - An Architectural Overview
publishDate: 2023-09-25
headerImage: /assets/blog/2023/1_uGhFDxweQkUk2EJU8zNi1w.webp
tags: [marmalade, architecture, policies]
author: Kadena
authorId: kadena
layout: blog
---

# Marmalade V2: An Architectural Overview

## Background

Marmalade is an NFT smart contract system in Kadena’s blockchain, which is
simply a system of multiple contracts that programs and runs logic configured by
the token policies that the token is built with. Marmalade has been in action
for several years, and now we’ve diligently upgraded to Marmalade V2,
encapsulating an entirely new system and simplifying the process of engaging
with NFTs.

Most excitingly, Marmalade V2 is now live on
[testnet](https://github.com/kadena-io/marmalade/blob/v2/test-marmalade-v2.md)!

Along with this announcement, this article provides a comprehensive overview of
Marmalade V2’s intricate contract architecture and explores the key features

## Ledger

The ledger functions as the primary contract responsible for user interaction,
and it offers the following main functions:

- create-token: creates the token with URI, policies, and precision of the token

- mint: mints token

- burn: burns token

- Transfer: transfers token from a Marmalade account to another Marmalade
  account

- [sale] offer: 1st step of sale, transfers the token from the seller to an
  escrow

- [sale] buy: 2nd step of sale, transfers the token to from escrow to the buyer

- [sale] withdraw: 1st rollback step, transfers the token from escrow back to
  the seller

Marmalade V1 tokens were designed to be governed by a single policy that allows
customization of the core Marmalade functions. In Marmalade V2, token creators
can now use multiple policies to program the tokens.

## Policy Manager

We introduce a new contract, policy-manager, which acts as a middleware between
the ledger and the policies. We will explain key concepts that the Policy
Manager provides below.

### Concrete Policies

Marmalade V2 aims to broaden its audience by providing a tool to simplify the
token creation process, offering a set of policies that encompass commonly used
token features, referred to as concrete policies.

The Policy Manager serves as the repository for these policies. If a
general-purpose policy gains widespread acceptance, it could be incorporated as
a concrete policy. This allows dApps, marketplaces, or wallets to readily
identify token properties, such as collections, non-fungibility, or royalty
specifications, by leveraging the concrete policies stored in the Policy
Manager.

If projects wish to incorporate customized logic alongside the basic features
offered by concrete policies, they can also include their own policies.

### Quoted Sale

![](/assets/blog/2023/0_SC65CXLeeR67wAJ9.png)

In Marmalade v1, fixed-quote-policy served as an example for handling the
fungible transfers at sales. With the upgrade to Marmalade V2, we have
integrated this fungible transfer feature inside the Policy Manager, which
includes various interactions between the Policy Manager, quote manager, and
external contracts. This allows secure escrowed transfers, creative auctions,
guaranteed royalties, and standardized processes within marketplaces.

### Escrows

The Policy Manager also establishes a standard for the collection and
distribution of fungibles between the seller, buyer, and policies through an
escrow.

As a middleware, the Policy Manager receives the user’s `offer` or `buy` call
from the ledger, and dispatches it to individual policies that the token is
composed of. In the case of quoted sales, the Policy Manager transfers the
quoted price from the buyer to an escrow account, disburses a portion of the
reserved fees to the policies, and then remits the remaining quoted price to the
seller.

### Reserve Sale

Within the Policy Manager, there exists a function called
`reserve-sale-at-price`, which is intentionally designed to be called directly,
rather than through the Ledger. This function is to be executed between the
‘offer’ and ‘buy’ actions and can only be initiated when the initial ‘quote’ is
established with the use of ‘quote-guards’, and one of the `quote-guards` signs
the transaction. Further details on ‘quote guards’ will be provided in the Quote
Manager section below.

The primary purpose of the function is to update the quote price and reserve the
buyer. However, it also provides the capability for an external contract,
particularly one related to bidding, to reserve the sale.

## Quote Manager

The Quote Manager is a contract responsible for adding or updating quotes, and
these quotes that function within the Quote Manager are exclusively callable by
the Policy Manager.

### Quote Guards

As briefly introduced in the `Reserve Sale` section, quote guards are a list of
guards that have the ability to call the function, `reserve-sale-at-price`. The
seller adds the quote guards at `offer`, and also has the ability to add or
remove quote guards after making the offer, which would be analogous to
participating in multiple auctions simultaneously. If the seller wants the
quoted price to be unchanged, the quote guards field can be left as an empty
list.

## Conclusion

The introduction of the multi-policy model in Marmalade V2, with the inclusion
of middleware contracts like quote-manager and policy-manager, aims to enhance
the user experience by simplifying token creation and management. We hope that
this article gives a deeper understanding of the Marmalade architecture for the
builders, especially for those involved in policy design and auctions.

Offical GitHub Link:
[https://github.com/kadena-io/marmalade/blob/v2/test-marmalade-v2.md](https://github.com/kadena-io/marmalade/blob/v2/test-marmalade-v2.md)
