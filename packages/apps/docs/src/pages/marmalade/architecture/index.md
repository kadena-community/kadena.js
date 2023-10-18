---
title: Contract Architecture
description: Marmalade V2 Architecture
menu: Contract Architecture
label: Overview
order: 3
layout: full
---

# Marmalade Architecture

The introduction of the multi-policy model in Marmalade V2, with the inclusion
of middleware contracts like quote-manager and policy-manager, aims to enhance
the user experience by simplifying token creation and management.

![Screenshot Placeholder](/assets/marmalade/architecture.png)

## Ledger

The ledger functions as the primary contract responsible for user interaction,
and it offers the following main functions:

**create-token**: creates the token with URI, policies, and precision of the
token\
**mint**: mints token\
**burn**: burns token\
**Transfer**: transfers token from a Marmalade account to another Marmalade account\
**[sale] offer**: 1st step of sale, transfers the token from the seller to an
escrow\
**[sale] buy**: 2nd step of sale, transfers the token to from escrow to the buyer\
**[sale] withdraw**: 1st rollback step, transfers the token from escrow back to
the seller

Marmalade V1 tokens were designed to be governed by a single policy that allows
customization of the core Marmalade functions. In Marmalade V2, token creators
can now use multiple policies to program the tokens.

## Policy Manager

We introduce a new contract, policy-manager, which acts as a middleware between
the ledger and the policies. We will explain key concepts that the Policy
Manager provides below.

**Quoted Sale**

In Marmalade v1, fixed-quote-policy served as an example for handling the
fungible transfers at sales. With the upgrade to Marmalade V2, we have
integrated this fungible transfer feature inside the Policy Manager, which
includes various interactions between the Policy Manager, and sale contracts.
This allows secure escrowed transfers, creative auctions, guaranteed royalties,
and standardized processes within marketplaces.

**Escrows**

The Policy Manager also establishes a standard for the collection and
distribution of fungibles between the seller, buyer, and policies through an
escrow.

As a middleware, the Policy Manager receives the user’s `offer` or `buy` call
from the ledger, and dispatches it to individual policies that the token is
composed of. In the case of quoted sales, the Policy Manager transfers the
quoted price from the buyer to an escrow account, disburses a portion of the
reserved fees to the policies, and then remits the remaining quoted price to the
seller.

## Sale Whitelists

The main feature of the sale contracts is that the function controls the final price
of the quote. By managing safe sale contracts, we can provide Marmalade users a
safe way to participate in various sale features such as creative auctions,
while also guaranteeing royalty payout. 

**Offical GitHub Link**:
https://github.com/kadena-io/marmalade/blob/v2/test-marmalade-v2.md
