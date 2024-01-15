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
of middleware contracts like policy-manager and sale-contracts, aims to enhance
the user experience by simplifying token creation and management.

## Ledger

The ledger functions as the primary contract responsible for user interaction.

Marmalade is a system of multiple contracts, that calls functions in layers. The
main contract in Marmalade is `marmalade-v2.ledger`, which stores the token
information, token's accounts, and the policies associated with it. The main
functions are `create-token`, `mint`, `burn`, `transfer`, `sale`.

For more info on the ledger please click [here](/marmalade/architecture/ledger)

![Leder meets Policy Manager](/assets/marmalade/mint_flow.png)

## Policy Manager

Marmalade V1 tokens were designed to be governed by a single policy that allows
customization of the core Marmalade functions. In Marmalade V2, token creators
can now use multiple policies to program the tokens. This is done via the policy
manager.

The policy-manager, which acts as a middleware between the ledger and the
policies.

**Quoted Sale**

In Marmalade v1, fixed-quote-policy served as an example for handling the
fungible transfers at sales. With the upgrade to Marmalade V2, we have
integrated this fungible transfer feature inside the Policy Manager, which
includes various interactions between the Policy Manager, policies, and sale
contracts. This allows secure escrowed transfers, creative auctions, guaranteed
royalties, and standardized processes within marketplaces.

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

for more info on the policy manager please click
[here](/marmalade/architecture/policy-manager)

## Sale Contracts

The Sale Contract is a contract responsible for updating the final price of the
quote during the buy process. By managing sale contracts within Marmalade, we
can provide users a safe way to participate in various sale features such as
creative auctions, while also guaranteeing royalty payout.

for more info on the sale contracts please click
[here](/marmalade/architecture/sale-contracts)

---

**[Marmalade on GitHub](https://github.com/kadena-io/marmalade)**
