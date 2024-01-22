---

title: Dutch Auction
description: Example of using a Sale Contract as Dutch Auction
menu: Dutch Auction
label: Dutch Auction
order: 2
layout: full

---

# Dutch Auction Contract

## Overview
This document outlines the Dutch Auction Contract, designed for conducting Dutch auctions on a blockchain platform. It details the contract's functionality, structure, and application.

## Features
- **Auction Management**: Set up and manage dutch auctions with start and end dates, starting and reserve prices.
- **Initial High Price**: Begins with a high asking price, set above the expected market value.
- **Price Reduction**: Gradual reduction of the price over a predetermined period.
- **First Bid Wins**: The auction concludes with the first bid at the current price.
- **Auction Finalization**: Details the process for ending the auction and awarding the item to the bidder.

## Components

### Schemas and Tables:

### Schemas
- `auctions-schema`: Composed of auction information including `token-id`, `start-date`, `end-date`, `start-price`, `reserve-price`, `sell-price`, `price-interval-seconds`, `buyer`, and `buyer-guard`.

### Tables
- `auctions`: Table that stores the auction information.

### Capabilities
- `GOVERNANCE`: Contract governance, governed by keyset, set to constant, `ADMIN_KS`.
- `AUCTION_CREATED`: Event emitted once the auction is created by the seller.
- `PRICE_ACCEPTED`: Event emitted once the buyer successfully executes `marmalade.buy` of the sale.
- `DUMMY`: Dummy capability used as placeholder of the `buyer-guard` field.

### Functions
- `enforce-quote-update`: function required for sale contracts, triggered during `policy-manager.enforce-buy`. Validates that the buyer transfers the fungible amount equal to `current-price` set by the dutch auction. Updates the auction table with the winner information.
- `enforce-withdrawal`: function required for sale contracts, triggered during `policy-manager.enforce-withdraw`. Validates that the auction has expired, or that the bid has already been placed.
- `validate-auction`: used in `create-auction` and `update-auction` to validate the auction information adheres to logic.
- `create-auction`: allows sellers to initiate dutch auction of their token, after providing auction information.
- `update-auction`: allows sellers to update auction information before its start-time.
- `retrieve-auction`: retrieves auction information from the `auctions` table.
- `get-current-price`: Calculates the current auction price. Starts with `start-price`, with price gradually dropped per `price-interval-seconds`, always ending with the last time interval at `reserve-price`.

### Constants
- `ADMIN-KS`: used in `GOVERNANCE` capability, set to `marmalade-sale.marmalade-contract-admin`.
- `DUMMY_GUARD`: Dummy guard constant used as placeholder of the `buyer-guard` field.

## Usage
- The contract facilitates the setting up and management of Dutch auctions, including price adjustments and bid acceptance.

## Conclusion
This README provides a concise overview of the Dutch Auction Contract, highlighting its key functionalities and components for blockchain-based Dutch auctions.
