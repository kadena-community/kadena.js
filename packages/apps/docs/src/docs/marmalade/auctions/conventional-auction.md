---

title: Conventional Auction
description: Example of using a Sale Contract as Conventional Auction
menu: Conventional Auction
label: Conventional Auction
order: 1
layout: full

---
# Conventional Auction

This page outlines the Conventional Auction Contract designed for blockchain-based auction systems. It provides a comprehensive guide to its features, components, and usage.

**Features of Conventional Auction**

- **Auction Management**: Set up and manage conventional auctions with start and end dates, and reserve prices.
- **Bid Handling**: Facilitate the placement and management of bids.
- **Escrow Account Management**: Secure handling of funds through escrow accounts.
- **Bid Refunding**: Mechanism for refunding bids.
- **Auction Finalization**: Rules for concluding the auction and determining the winning bid.

## Technical Specifications

## Components
### Capabilities
- `GOVERNANCE`: Governance of the contract, controlled by a keyset defined under the `ADMIN-KS` constant.
- `AUCTION_CREATED`: Event emitted when `create-auction` function is executed. Includes `sale-id` `token-id`, and  `escrow`.
- `MANAGE_AUCTION`: guards auction creation and updates. Takes in `sale-id` and `token-id`, used in `create-auction` and `update-auction` functions.
- `BID_PLACED`: Event emitted upon the placement of a bid.
- `PLACE_BID`: ensures that the bidder is signing to place the bid.
- `REFUND_CAP`: used in escrow guard to protect refunds.

### Schemas
- `auctions-schema`: Composed of auction information including `token-id`, `start-date`, `end-date`, `highest-bid`, `highest-bid-id`, and `reserve-price`
- `bids-schema`: Composed of bid information including `bidder`, `bidder-guard`, and `bid`

### Tables
- `auctions`: stores auction information
- `bids`: stores bid information

### Functions
- `escrow-account`: returns the auction's fungible escrow account name.
- `escrow-guard`: returns the account guard of the escrow-account
- `enforce-fungible-transfer`: Requires that `policy-manager.FUNGIBLE_TRANSFER_CALL` capability is in scope.
- `enforce-quote-update`: function required for sale contracts, triggered during `policy-manager.enforce-buy`. Validates that only the winning bidder processes the `marmalade.buy` call, in addition to escrow payment and checks to marketplace fee information.
- `enforce-withdrawal`: function required for sale contracts, triggered during `policy-manager.enforce-withdraw`. Validates that the auction has expired, or that the bid has already been placed.
- `create-bid-id`: generates a unique bid-id by hashing `sale-id` and `bidder` and the `block-time`
- `create-auction`: allows sellers to initiate conventional auction of their token, after providing auction information.
- `update-auction`: allows sellers to update auction information before its start-time.
- `retrieve-auction`: retrieves auction information from the `auctions` table.
- `retrieve-bid`: retrieves bid information from the `bids` table.
- `place-bid`: transfers bid amount in fungible from bidder to escrow account and places bids in the system.

### Constants
- `ADMIN-KS`: used in `GOVERNANCE` capability, set to `marmalade-sale.marmalade-contract-admin`.
