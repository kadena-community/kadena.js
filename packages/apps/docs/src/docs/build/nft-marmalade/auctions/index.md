---
title: Auctions
description: Introduces the types of auctions you can implement for an NFT marketplace using Marmalade and the Kadena blockchain network.
menu: Auctions
label: Overview
order: 5
layout: full
---

# Auctions for marmalade tokens

## Introduction

With Marmalade, you can write smart contracts for two different types of auctions, depending on how to want to handle the mechanics of the starting price and bidding:
- In a [conventional-auction](https://docs.kadena.io/marmalade/auctions#conventional-auction), you set the minimum price and a set period of time for bidding to take place with the ability to cancel the auction if no bids exceed the minimum price.
- In a [dutch-auction](https://docs.kadena.io/marmalade/auctions#dutch-auction), you set an initial price above the expected market value and gradually reduce the price over a predetermined period of time.

### **Conventional Auction**

A conventional auction is a specialized type of smart contract that allows you—as a token owner or reseller—to sell a non-fungible token using the traditional auction format.
In a traditional auction, you set an opening price that represents the minimum price at which an item can be sold and invite bidders to compete by increasing the price they're willing to pay.
The minimum or **reserve price** ensures that the token isn't sold below its starting price.
Typically, the auction is open to bidders for a set period of time and the highest bid at the end of the allotted time wins the auction.
If there are no bids higher than the reserve price, you can cancel the auction and retain the token.
Conventional auction contracts are deployed on the blockchain using the `marmalade-sale.conventional-auction` URL.

### **Dutch Auction**

A dutch auction is a specialized type of smart contract that allows you—as a token owner or reseller—to sell a non-fungible token using the dutch auction format.
In a dutch auction, you set an opening price that represents the maximum price at which you expect an item can be reasonably sold and gradually reduce the price to entice potential buyers to submit a bid.
If you receive a bid before the next price drop, the sale is executed at the current price and the auction ends with the bidder receiving the token at that price.
Dutch auction contracts are deployed on the blockchain using the `marmalade-sale.dutch-auction` URL.
sale contract that allows Dutch auction style price management.
In this contract, the token sale starts at a high price and is progressively lowered
until a bid is received. Once a bid is executed at the current price, the auction
ends, and the bidder receives the token at that price. The contract is deployed at
`marmalade-sale.dutch-auction`.
