---
title: Auctions
description: What are Auctions
menu: Auctions
label: Overview
order: 5
layout: full
---

# Auctions and Implementations

## Introduction

Currently, Marmalade V2 supports 2 types of Auctions: Conventional Auction and Dutch Auction.
Following auctions are whitelisted sale contracts, and lets marmalade token owners to easily start auction sales of their choice.

### **Conventional Auction**

Conventional Auction is a sale contract that allows for the sale of a token
through a conventional auction. The seller can set a reserve price which will
ensure that the token is not sold below a certain price. The auction will run
for a set amount of time and the highest bidder will win the auction. If the
reserve price is not met, the seller can choose to cancel the auction and the
token will be returned to the seller. The contract is deployed at
`marmalade-sale.conventional-auction`.

### **Dutch Auction**

Dutch Auction is a sale contract that allows Dutch auction style price management.
In this contract, the token sale starts at a high price and is progressively lowered
until a bid is received. Once a bid is executed at the current price, the auction
ends, and the bidder receives the token at that price. The contract is deployed at
`marmalade-sale.dutch-auction`.

## Conclusion

Marmalade V2's inclusion of Conventional and Dutch Auctions provides users with flexible, secure, and efficient means of conducting token sales. Whether for unique, high-value tokens or for rapid sales, these auction types cater to a wide range of needs while ensuring compliance with Marmalade's standards.
