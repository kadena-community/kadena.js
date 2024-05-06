---

title: Dutch auction reference 
description: Describes the capabilities, schemas, tables, functions, and constants defined in the sales-specific contracts for a dutch auction.
menu: Sales-specific contracts
label: Dutch auction
order: 2
layout: full

---

# Dutch auction sale contract

This section provides reference information for writing a smart contract to conduct a dutch auction using Marmalade on the Kadena network.
The reference information includes the capabilities, schemas, tables, functions, and constants defined for a dutch auction. 

Source code: [dutch-auction.pact](https://github.com/kadena-io/marmalade/blob/main/pact/sale-contracts/dutch-auction/dutch-auction.pact)

## Capabilities

The dutch auction smart contract defines the following capabilities to manage permissions:

- `GOVERNANCE`: Defines governance for the contract and is controlled by the keyset defined under the `ADMIN-KS` constant.
- `AUCTION_CREATED`: Specifies the event emitted after the auction is created by the seller.
- `PRICE_ACCEPTED`: Specifies the event emitted after the buyer successfully executes the `marmalade.buy` function in a sales contract.
- `DUMMY`: Acts as a placeholder capability for the `buyer-guard` field.

## Schema and table

The `auctions-schema` describes the following information for a dutch auction: 

- `token-id`
- `start-date`
- `end-date`
- `start-price`
- `reserve-price`
- `sell-price`
- `price-interval-seconds`
- `buyer`
- `buyer-guard`

The dutch auction contract stores auction information in the `auctions` table.

## Functions

The dutch auction contract defines the following functions to manage token sales using the dutch auction format:

- `enforce-quote-update`: Enforces a quote update when required for sale contracts. This function is called by the  `policy-manager.enforce-buy` function to validate that the buyer has transferred the fungible amount equal to `current-price` set by the dutch auction. The function updates the `auctions` table with the winner information.
- `enforce-withdrawal`: Enforces a withdrawal when required for sale contracts. This function is called by the `policy-manager.enforce-withdraw` function to validate that the auction has expired, or that the bid has already been placed.
- `validate-auction`: Validates that the auction information adheres to contract logic in the `create-auction` and `update-auction` functions.
- `create-auction`: Allows sellers to create the dutch auction for their token after providing auction information.
- `update-auction`: Allows sellers to update auction information before the auction start time.
- `retrieve-auction`: Retrieves auction information from the `auctions` table.
- `get-current-price`: Calculates the current auction price by starting with the `start-price` and gradually reducing the price per `price-interval-seconds`, always ending with the last time interval at the `reserve-price`.

## Constants

The dutch auction contract defines the following constants:

- `ADMIN-KS`: Sets the `marmalade-sale.marmalade-contract-admin` for the `GOVERNANCE` capability.
- `DUMMY_GUARD`: Acts as a placeholder guard constant for the `buyer-guard` field.
