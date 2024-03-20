---
title: Sale contracts
description: Sale Contracts in Marmalade V2
menu: Sale contracts
label: Sale contracts
order: 3
layout: full
---

# Sale contracts

As discussed in [Layered contract architecture](/build/nft-marmalade/contract-architecture), you can use a sales-specific contract to manage how tokens are sold—for example, by offering tokens for sale in a [conventional auction](https://docs.kadena.io/marmalade/auctions/conventional-auction) or a [dutch auction](https://docs.kadena.io/marmalade/auctions/dutch-auction).

Although this is a flexible system for managing sales, sales-specific contracts must be registered in the policy manager to ensure that the policy manager can enforce the proper collection and distribution of tokens and funds. 
Before you can register a sales-specific contract, it must undergo a review process to ensure that the contract is safe to use.

If you want to create your own sales-specific contract, you can open a pull request in the
[Marmalade Github repository](https://github.com/kadena-io/marmalade/tree/main/pact/sale-contracts) to begin the review process.

Note that creating a sales-specific contract isn't necessary in most cases.
You can implement sales-related logic directly in a policy and attach the policy to a token instead of creating a separate contract.

## Sale contract interface

The sale contract interface is a lightweight interface that must be implemented in any sale contract. 
The interface is used by the policy manager to enforce the logic defined in the contract. 
The interface is defined as follows:

```pact
(defun enforce-quote-update:bool (sale-id:string price:decimal)
  @doc "Read-only Function that is enforced to update quote price at enforce-buy"
)
```

The function `enforce-quote-update` is called in from the `buy` step in the ledger and takes two parameters:

- `sale-id (type: string)`: This parameter represents the `pact-id` that is created when the token is offered up for sale in the ledger.
- `price (type: decimal)`: This parameter represents the final price associated with the sale.

## Using a sales-specific contract

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

Note that when you reference a specific `sale-type`, the `sale-price` for the `offer` must be `0.0` because the references contract is responsible for updating the final price during the `buy` step.
