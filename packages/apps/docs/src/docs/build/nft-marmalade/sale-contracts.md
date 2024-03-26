---
title: Sell tokens
description: Describes the different ways you can offer tokens for sale and how to create and use sales-specific contracts.
menu: Sell tokens
label: Sale options
order: 3
layout: full
---

# Sale options

The Marmalade contract architecture supports three different options for managing the sales process when you offer tokens for sale.

## Without a quote

You can offer a token for sale without specifying a quoted price.
In this case, the sale transfers the token from the seller to the escrow account and on to the buyer without any built-in policy enforcement. 
If you want to enforce rules on the sale or transfer, you can write custom logic or custom policies to implement rules that manage the sale or transfer process.

## With a fixed quote and no sale type

You can offer a token for sale using a quoted sales price without using a specific type of sale contract.
In this case, you must specify the fungible price for the token and the sale can proceed when a buyer pays the asking price. 
In enforcing the rules for a quoted token sale, the policy manager sets the `sale-type` for the quote to be empty (`"sale-type"`: `""`).
You can write custom logic or custom policies to implement rules that manage the sale or transfer process, but this type of sale is essentially a fixed price sale.

## With a variable quote and a specific sale type

You can offer a token for sale using a quoted sales price and a specific type of sale contract.
In this case, you must specify the type of sale contract you want to use as part of the quote.
The contract you specify can then update the quote based on the rules for the type of sale it implements.
For example, a dutch auction starts with a price above market value and drops over a period of time.
If you offer a token for sale and select the `dutch-auction` sale contract, the policy manager handles the mechanics of lowering the price over the scheduled auction period.

There are two registered sale contracts available in the [Marmalade Github repository](https://github.com/kadena-io/marmalade/tree/v2/pact/sale-contracts) under `pact/sale-contracts`.
These contracts enable you to create auctions to sell your tokens using a [conventional-auction]() format or a [`dutch auction`]() format. 

## Creating custom sale contracts

Sales-specific contracts provide a flexible system for managing sales and implementing custom enforcement rules.
However, sales-specific contracts must be registered in the policy manager to ensure that the policy manager can enforce the proper collection and distribution of tokens and funds. 
Before you can register a sales-specific contract, the contract must be reviewed by an auditor to ensure that the contract logic is safe to use.

To create your own sales-specific contract:

1. Implement the `enforce-quote-update` interface in your contrac to allow the policy manager to enforce the sale
contract:
   
   ```pact
   (defun enforce-quote-update:bool (sale-id:string price:decimal)
      @doc "Read-only Function that is enforced to update quote price at enforce-buy"
   )
   ```
   
   The function `enforce-quote-update` is called in the `buy` step in the ledger and takes two parameters:
   
   - `sale-id` (type: string): This parameter represents the `pact-id` for the sale that is created when the token is offered up for sale in the ledger.
   - `price` (type: decimal): This parameter represents the finale price associated with the sale.

1. Implement the `enforce-withdrawal` and `enforce-quote-update` functions and ensure that pass at both `withdraw` step and `buy` step.
   
   These functions are required to give the sale contract authority to restrict `buy` operations to winning bids and winner accounts, or withdraw operations after only certain conditions. 

1. Open a pull request in the [Marmalade Github repository](https://github.com/kadena-io/marmalade/tree/main/pact/sale-contracts) to begin the review process.

