---

title: Dutch auction
description: Create a dutch auction contract
menu: Dutch auction
label: Dutch auction
order: 2
layout: full

---

# Dutch auction contract

## Overview
This document outlines the Dutch Auction Contract, designed for conducting Dutch auctions on a blockchain platform. It details the contract's functionality, structure, and application.

## Features
- **Auction Management**: Set up and manage dutch auctions with start and end dates, starting and reserve prices.
- **Initial High Price**: Begins with a high asking price, set above the expected market value.
- **Price Reduction**: Gradual reduction of the price over a predetermined period.
- **First Bid Wins**: The auction concludes with the first bid at the current price.
- **Auction Finalization**: Details the process for ending the auction and awarding the item to the bidder.

## Technical specifications

The following sections provide reference information for writing a smart contract to conduct a dutch auction using Marmalade on the Kadena network.

### Schemas
- `auctions-schema`: Describes auction information including `token-id`, `start-date`, `end-date`, `start-price`, `reserve-price`, `sell-price`, `price-interval-seconds`, `buyer`, and `buyer-guard`.

### Tables
- `auctions`: Stores auction information.

### Capabilities
- `GOVERNANCE`: Defines governance for the contract and is controlled by the keyset defined under the `ADMIN-KS` constant.
- `AUCTION_CREATED`: Specifies the event emitted after the auction is created by the seller.
- `PRICE_ACCEPTED`: Specifies the event emitted after the buyer successfully executes the `marmalade.buy` function in a sales contract.
- `DUMMY`: Acts as a placeholder capability for the `buyer-guard` field.

### Functions
- `enforce-quote-update`: Enforces a quote update when required for sale contracts. This function is called by the  `policy-manager.enforce-buy` function to validate that the buyer has transferred the fungible amount equal to `current-price` set by the dutch auction. The function updates the `auctions` table with the winner information.
- `enforce-withdrawal`: Enforces a withdrawal when required for sale contracts. This function is called by the `policy-manager.enforce-withdraw` function to validate that the auction has expired, or that the bid has already been placed.
- `validate-auction`: Validates that the auction information adheres to contract logic in the `create-auction` and `update-auction` functions.
- `create-auction`: Allows sellers to create the dutch auction for their token after providing auction information.
- `update-auction`: Allows sellers to update auction information before the auction start time.
- `retrieve-auction`: Retrieves auction information from the `auctions` table.
- `get-current-price`: Calculates the current auction price by starting with the `start-price` and gradually reducing the price per `price-interval-seconds`, always ending with the last time interval at the `reserve-price`.

### Constants

- `ADMIN-KS`: Sets the `marmalade-sale.marmalade-contract-admin` for the `GOVERNANCE` capability.
- `DUMMY_GUARD`: Acts as a placeholder guard constant for the `buyer-guard` field.
