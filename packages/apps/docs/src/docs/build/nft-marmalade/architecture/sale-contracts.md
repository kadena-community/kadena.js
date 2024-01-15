---
title: Sale contracts
description: Sale Contracts in Marmalade V2
menu: Sale contracts
label: Sale contracts
order: 3
layout: full
---

# Sale contracts

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
