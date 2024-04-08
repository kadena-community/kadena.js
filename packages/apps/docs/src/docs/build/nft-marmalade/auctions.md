---
title: Auctions
description: Introduces the types of auctions you can implement for an NFT marketplace using Marmalade and the Kadena blockchain network.
menu: Sales
label: Auctions
order: 5
layout: full
---

# Auctions

With Marmalade, you can write smart contracts for two different types of auctions, depending on how to want to handle the mechanics of the starting price and bidding:
- In a **conventional-auction**, you set the minimum price and a set period of time for bidding to take place with the ability to cancel the auction if no bids exceed the minimum price.
- In a **dutch-auction**, you set an initial price above the expected market value and gradually reduce the price over a predetermined period of time.

## Conventional auction

A conventional auction is a specialized type of smart contract that allows you—as a token owner or reseller—to sell a non-fungible token using the traditional auction format.
In a traditional auction, you set an opening price that represents the minimum price at which an item can be sold and invite bidders to compete by increasing the price they're willing to pay.
The minimum or **reserve price** ensures that the token isn't sold below its starting price.

Typically, the auction is open to bidders for a set period of time and the highest bid at the end of the allotted time wins the auction.
If there are no bids higher than the reserve price, you can cancel the auction and retain the token.
Conventional auction contracts are deployed on the blockchain using the `marmalade-sale.conventional-auction` URL.

Using functions in the `marmalade-sale.conventional-auction` contract, you can:

- Set up and manage the auctions start and end dates.
- Set a reserve price.
- Manage how bids are handled.
- Secure handling of funds through escrow accounts.
- Define a process for refunding bids.
- Define rules for concluding the auction and determining the winning bid.

For reference information about the conventional auction smart contract, see [Conventional auction reference](/reference/nft-ref/sale-contracts/conventional-auction-ref).

## Dutch auction

A dutch auction is a specialized type of smart contract that allows you—as a token owner or reseller—to sell a non-fungible token using the dutch auction format.
In a dutch auction, you set an opening price that represents the maximum price at which you expect an item can be reasonably sold and gradually reduce the price to entice potential buyers to submit a bid.

If you receive a bid before the next price drop, the sale is executed at the current price and the auction ends with the bidder receiving the token at that price.
Dutch auction contracts are deployed on the blockchain using the `marmalade-sale.dutch-auction` URL.

Using functions in the `marmalade-sale.dutch-auction` contract, you can:

- Set up and manage the auction start and end dates.
- Set a high initial asking price—above the expected market value—and a reserve price.
- Specify how to gradually reduce the price over a predetermined period.
- Conclude the auction with the first bid at the current price.
- Define the process for ending the auction and awarding the item to the bidder.

For reference information about the dutch auction smart contract, see [Dutch auction reference](/reference/nft-ref/sale-contracts/dutch-auction).