---

title: Conventional auction reference 
description: Describes the capabilities, schemas, tables, functions, and constants defined in the sales-specific contracts for a conventional auction.
menu: Sales-specific contracts
label: Conventional auction
order: 2
layout: full

---

# Conventional auction sale contract

This section provides reference information for writing a smart contract to conduct a conventional auction using Marmalade on the Kadena network.
The reference information includes the capabilities, schemas, tables, functions, and constants defined for a conventional auction.

Source code: [conventional-auction.pact](https://github.com/kadena-io/marmalade/blob/main/pact/sale-contracts/conventional-auction/conventional-auction.pact)

## Capabilities

The conventional auction smart contract defines the following capabilities to manage permissions:

- `GOVERNANCE`: Defines governance for the contract and is controlled by the keyset defined under the `ADMIN-KS` constant.
- `AUCTION_CREATED`: Specifies the event emitted when the `create-auction` function is executed. The emitted event includes the `sale-id`, `token-id`, and  `escrow` fields.
- `MANAGE_AUCTION`:  Identifies a guard to control who can create and update an auction. You must specify the `sale-id` and `token-id` parameters when you use this capability in `create-auction` and `update-auction` functions.
- `BID_PLACED`: Specifies the event emitted when a bid is place. The emitted event includes the `bidder?`, `bid-amount`, and  `timestamp` fields.
- `PLACE_BID`: Ensures that the bidder signs the transaction to place the bid.
- `REFUND_CAP`: Protects funds held in escrow to ensure refunds can be made, if necessary.

## Schemas

The conventional auction smart contract defines two schemas.

The `auctions-schema` describes the following information for a conventional auction: 

- `token-id`
- `start-date`
- `end-date`
- `highest-bid`
- `highest-bid-id`
- `reserve-price`

The `bids-schema` describes the following information for a conventional auction: 

- `bidder`
- `bidder-guard`
- `bid`

## Tables

The conventional auction contract stores auction information in the `auctions` table and bid information in the `bids` table.

## Functions

The conventional auction contract defines the following functions to manage token sales using the conventional auction format:

- `escrow-account`: Returns the auction's fungible escrow account name.
- `escrow-guard`: Returns the account guard of the escrow account.
- `enforce-fungible-transfer`: Requires that `policy-manager.FUNGIBLE_TRANSFER_CALL` capability is in scope.
- `enforce-quote-update`: Enforces a quote update when required for sale contracts. This function is called by the `policy-manager.enforce-buy` function to validate that only the winning bidder processes the `marmalade.buy` call, the escrow payment, and the marketplace fee.
- `enforce-withdrawal`: Enforces a withdrawal when required for sale contracts. This function is called by the `policy-manager.enforce-withdraw` function to validate that the auction has expired, or that the bid has already been placed.
- `create-bid-id`: Generates a unique bid identifier by hashing the `sale-id`, `bidder`, and `block-time` fields.
- `create-auction`: Allows sellers to create a conventional auction for their token after providing auction information.
- `update-auction`: Allows sellers to update auction information before the auction start time.
- `retrieve-auction`: Retrieves auction information from the `auctions` table.
- `retrieve-bid`: Retrieves bid information from the `bids` table.
- `place-bid`: Transfers the bid amount in a fungible currency from the bidder account to an escrow account and records the bids in the blockchain.

## Constants

The conventional auction contract defines the following constant:

- `ADMIN-KS`: Sets the `marmalade-sale.marmalade-contract-admin` for the `GOVERNANCE` capability.

