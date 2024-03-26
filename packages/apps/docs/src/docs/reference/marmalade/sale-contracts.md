---
title: Sales-specific contracts
description: Provides a technical overview of how to create a custom sales type contract or call an existing sales contract.
menu: Sales-specific contracts
label: Create a sale contract
order: 3
layout: full
---

# Create a sale contract

As discussed in [Layered contract architecture](/build/nft-marmalade/contract-architecture), you can use a sales-specific contract to manage how tokens are sold—for example, by offering tokens for sale in a [conventional auction]() or a [dutch auction]().

Although this is a flexible system for managing sales, sales-specific contracts must be registered in the policy manager to ensure that the policy manager can enforce the proper collection and distribution of tokens and funds. 
Before you can register a sales-specific contract, the contract must be reviewed by an auditor to ensure that the contract logic is safe to use.

If you want to create your own sales-specific contract, you can implement the `enforce-quote-update` interface in your contract, then open a pull request in the [Marmalade Github repository](https://github.com/kadena-io/marmalade/tree/main/pact/sale-contracts) to begin the review process.

Note that creating a sales-specific contract isn't necessary in most cases.
You can implement sales-related logic directly in a policy and attach the policy to a token instead of creating a separate contract.

## Implement the sale contract interface

The sale contract interface is a lightweight interface that must be implemented in any sale contract. 
The interface is used by the policy manager to enforce the logic defined in the contract. 
The interface is defined as follows:

```pact
(defun enforce-quote-update:bool (sale-id:string price:decimal)
  @doc "Read-only Function that is enforced to update quote price at enforce-buy"
)
```

The function `enforce-quote-update` is called from the `buy` step in the ledger and takes two parameters:

- `sale-id (type: string)`: This parameter represents the `pact-id` that is created when the token is offered up for sale in the ledger.
- `price (type: decimal)`: This parameter represents the final price associated with the sale.

## Using a sales-specific contract

You can specify the sale contract to use by providing the module name for the contract as part of the `quote` specification when calling the `offer` function in the ledger.
The following example illustrates the `quote` specification with the `sale-type` set to use the `marmalade-sale.conventional-auction` sale contract:

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

Note that when you reference a specific `sale-type`, the `sale-price` for the `offer` must be `0.0` because the references contract is responsible for updating the final price during the `buy` step.
