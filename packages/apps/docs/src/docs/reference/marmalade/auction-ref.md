---

title: Auction contracts 
description: Describes the capabilities, schemas, tables, functions, and constants defined in the sales-specific contracts for a conventional auction or  a dutch auction.
menu: Dutch auction
label: Dutch auction
order: 2
layout: full

---

# Auction contracts

This section provides reference information for writing a smart contract to conduct a conventional auction or a dutch auction using Marmalade on the Kadena network.
The reference information includes the capabilities, schemas, tables, functions, and constants defined for each type of auction. 

## Conventional auction contract

The information in this section describes the capabilities, schemas, tables, functions, and constants defined in the convention auction contract.

### Capabilities

You can define the following capabilities to manage permissions in conventional auctions:

- `GOVERNANCE`: Defines governance for the contract and is controlled by the keyset defined under the `ADMIN-KS` constant.
- `AUCTION_CREATED`: Specifies the event emitted when the `create-auction` function is executed. The emitted event includes the `sale-id`, `token-id`, and  `escrow` fields.
- `MANAGE_AUCTION`:  Identifies a guard to control who can create and update an auction. You must specify the `sale-id` and `token-id` parameters when you use this capability in `create-auction` and `update-auction` functions.
- `BID_PLACED`: Specifies the event emitted when a bid is place. The emitted event includes the `bidder?`, `bid-amount`, and  `timestamp` fields.
- `PLACE_BID`: Ensures that the bidder signs the transaction to place the bid.
- `REFUND_CAP`: Protects funds held in escrow to ensure refunds can be made, if necessary.

### Schemas
- `auctions-schema`: Describes auction information including `token-id`, `start-date`, `end-date`, `highest-bid`, `highest-bid-id`, and `reserve-price`.
- `bids-schema`: Describes bid information including `bidder`, `bidder-guard`, and `bid`.

### Tables
- `auctions`: Stores auction information.
- `bids`: Stores bid information.

### Functions
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

### Constants
- `ADMIN-KS`: Sets the `marmalade-sale.marmalade-contract-admin` for the `GOVERNANCE` capability.

## Dutch auction contract

The information in this section describes the capabilities, schemas, tables, functions, and constants defined in the convention auction contract.

### Capabilities

You can define the following capabilities to manage permissions in conventional auctions:

- `GOVERNANCE`: Defines governance for the contract and is controlled by the keyset defined under the `ADMIN-KS` constant.
- `AUCTION_CREATED`: Specifies the event emitted after the auction is created by the seller.
- `PRICE_ACCEPTED`: Specifies the event emitted after the buyer successfully executes the `marmalade.buy` function in a sales contract.
- `DUMMY`: Acts as a placeholder capability for the `buyer-guard` field.

### Schemas
- `auctions-schema`: Describes auction information including `token-id`, `start-date`, `end-date`, `start-price`, `reserve-price`, `sell-price`, `price-interval-seconds`, `buyer`, and `buyer-guard`.

### Tables
- `auctions`: Stores auction information.

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
