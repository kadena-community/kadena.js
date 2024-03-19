---
title: What is Marmalade?
description: Build a non-fungible token (NFT) marketplace using Marmalade and Pact smart contracts.
menu:  Non-fungible tokens (NFT)
label: What is Marmalade?
order: 2
layout: full
---

# What is Marmalade?

Marmalade is the name of the Kadena **token standard**.
This token standard defines the interfaces for minting digital items with Kadena **smart contracts** and protecting those digital items with Kadena **token policies**.

Digital items that are unique, one-of-a-kind assets are most commonly referred to as non-fungible tokens (NFTs).
However, the Kadena token standard is implemented as a multi-token or **poly-fungible** standard that enables you to define, mint, and secure tokens that are fully fungible as interchangeable coins, partially fungible as a limited edition with a fixed supply, or completely non-fungible as unique items.
Tokens can also be restricted to a single owner with rules for transferring ownership or support shared ownership with multiple potential stakeholders.

As a creator, you have complete control over your token properties and the rules for minting, owning, and transferring tokens.

## Traditional marketplaces for non-fungible tokens

Non-fungible tokens defined using other token standards have two main drawbacks:

- Most token standards assume that a change of ownership is always a transfer operation. 
  However, a transfer-based model doesn't take into account the non-transferable nature of a unique asset.
  Marmalade supports both transfers and sales, with the additional flexibility to use token policies for either operation.
- Most token standards don't provide any guarantees that creators will be paid royalties for their work or  what they'll be paid from the exchanges that host their work.

With Marmalade, Kadena eliminates these issues by making **sales contracts** and **token policies** core components of the token standard.

## Sales contracts

In the simplest sense, a sale is typically a three-step process:

1. A seller lists an item for sale with a price.

2. A buyer agrees to pay the seller for the item at a mutually agreed-upon price.

3. The seller receives payment and transfers the item to the buyer.

On the Kadena network, Pact smart contracts use `pact` functions to define multi-step operations like cross-chain transfers and automatic gas payments.
The Marmalade token standard also uses `pact` functions to handle the multi-step nature of a sale.

By using `pact` functions, contracts can define explicit steps that must be executed in a fixed order. 
The `pact` definition forms an enforceable sequence of actions that are executed on-chain.
The sequence can't be altered and no steps can be skipped. 
For a transaction to be successful, all parties must complete the actions they are responsible for.
All of the sequencing and cryptography required to enforce a sales contract is handled automatically by the Pact language itself.

To complete a sale, the `pact` function defines the following steps:

- Offer: A seller who wants to list a digital asset for sale creates an **offer**. 
  This operation puts the asset into a _trustless escrow_ account that can only be released by later steps in the `pact` definition. 

- Buy: A buyer initiates a **buy** operation with a promised payment and the escrowed asset waits for the step to be completed successfully by the buyer. 

- Withdraw: If the buyer doesn't complete the transaction within a certain period of time, the `pact` function can roll back the first step of the transaction and the seller can **withdraw** the sale. 
  If the seller withdraws, the `pact` transfers the asset back to the seller's account from the escrow account.

## Token policies

The Marmalade token standard enables creators to specify **token policies** to control how their assets can be minted, sold, and transferred and how royalties are paid.
For example, a token policy might specify that an asset can't be transferred directly to a buyer until a purchase is complete and the royalty distributed to the creator.

Token policies are implemented as smart contracts based on the interfaces defined in the [`kip.token-policy-v2`](https://github.com/kadena-io/marmalade/blob/main/pact/kip/token-policy-v2.pact) standard.
There are several built-in policies—called **concrete policies**—that are configured to handle the most common marketplace use cases. 
For example, if you apply the `non-fungible-policy` to a token, the token is automatically configured to be minted only once. 

You can apply built-in policies to any token or write custom policies based on the `kip.token-policy-v2` standard.
You can also create **collections** of tokens using the `collection-policy` to establish **marketplace communities** that share a common approach to token ownership or token sales.
After you create the group of tokens that make up the collection, the entire collection can be discovered from Chainweb events.

For example, you can use token policies to define the following types of rules:

- You can create tokens with a **royalty** policy to specify a royalty rate and the account that should receive royalties.

- You can use policies to control mint operations such as whether a token is unique, part of a limited series, or a fully fungible coin.

- You can use policies to prevent certain tokens from being burned or to be burned only when specific conditions are met.

- You can use policies to restrict how tokens are owned and transferred.

## Preparing to mint a token

Before you can mint a token on the blockchain, you must create the digital item and upload it to at least one accessible location such as InterPlanetary File System (IPFS), Arweave, or another content delivery or hosting service.

After you have a uniform resource identifier (URI) for locating the digital item, you must also create a metadata file using the JSON schema to record the name, location, and other properties about the item to be minted.
You can then create and mint the token for the digital item, generating an on-chain token identifier with a `t:` prefix. 
The token identifier includes the hash for the metadata that describes the token to ensure that a digital item can be cryptographically verified to be the actual NFT. 

Depending on how you apply or configure token policies, you might be the sole owner of the token you mint or share ownership with others. 
If you're the owner of a token, you have the option to offer the token for sale or transfer the token to another owner. 

## Token sales and trustless escrow

If you're the owner of a token, you can start the sales process to find a buyer by selecting and configuring a `sale` smart contract.
You've already seen that a sale is essentially a `pact` with two steps: the **offer** step and the **buy** step.

Smart contracts with the `sale` pact also use a special feature of pacts—**pact guards**—to govern the **trustless escrow account** for the token sale. 
After you offer an asset for sale, the asset is transferred to an account governed by a pact guard.
From that point, only that pact guard—identified by its pact ID—can manage the asset in subsequent steps.

Let's take a closer look at how a sale takes place, starting with an offer.

### Offer

A seller creates an **offer** for the asset to be sold.
For this example, the offer is a simple sale with a **quoted** asking price.
There are other ways you can sell assets—including conventional auctions and dutch auctions—that implement different sale mechanics, but the general use of the trusted escrow account applies to all types of sales.

The **offer** step transfers the asset from the seller's account in the token ledger to the escrow account. The `sale` pact assigns an identifier to the SALE event that results from the transfer operation.

For example, Bob submits a transaction to offer NFT1 for sale with a price quote of 50 KDA.
This transaction:

- Removes NFT1 from Bob's account in the token ledger. 
- Transfers NFT1 to an escrow account associated with a specific sale identifier—`sale:1`—in the token ledger. 

![Bob starts a sale by offering NFT1](/assets/marmalade/offer.png)

By initiating the sale, Bob loses custody of the asset for a period of time.
The `sale:1` pact guard takes ownership of the asset.

### Buy

The buyer who wants to acquire the asset that's been offered for sale sends a **continuation** transaction for the identifier assigned to the SALE event. 

For example, Alice sends a continuation transaction for the `sale:1` pact identifier to transfer NFT1 out of the escrow account in the token ledger and into her account. 
The ledger then debits the sale price of 50.0 from Alice’s KDA account to credit Bob and executes any other offsetting transaction needed to release the escrowed NFT.
For example, the token policy pays any royalty fees or returns any funds as specified in the policy. 

![Alice continues the execution of the sale pact](/assets/marmalade/buy.png)

With this separation of duties, the `sale` pact is responsible for transferring the NFT out of escrow and enforcing the timeout.
Any other transaction requirements are handled by token policies.

### Withdraw

Sellers can configure sale contracts to allow them to withdraw from the sale if there are no interested buyers for a token.
Alternatively, sellers can specify a **timeout** as part of the **offer** step. 
The timeout is measured in blocks.
If a seller sets the timeout to 30 blocks, he can't pull out of the sale until 30 blocks have been mined on-chain.

After the timeout, the seller can send a **rollback** continuation transaction for the identifier assigned to the SALE event. 
The **withdraw** operation then transfers the token out of the escrow account and returns it to the seller.

### Completing a logical sequence

All of the logic required to step through the sales process is automatically handled by the Pact language.
The pact definition ensures that step two can only happen after step one and only under the following conditions:

- If step one hasn't been rolled back.
- If step two hasn't already happened.

Similarly, a rollback can’t occur if step one hasn’t happened, or if step two has already happened. 
With Pact, this logic isn't left to contract programmers.
Instead, Pact prevents the contract developer from introducing faulty logic in sequencing the transaction.

## Using built-in policies

The Marmalade token standard defines interfaces for policy-based token management.
To simplify token creation using the standard, Kadena provides several built-in token policies for the most common features.
You can use the built-in policies—called **concrete policies**—independently or in combination to provide the specific features you want to implement.
For example:

- Use the **guard policy** to prevent unauthorized token activity like minting or burning.
- Use the **non-fungible policy** to ensure that a token can only be minted once and never burned.
- Use the **royalty policy** to specify the account for depositing royalty payments from sales.
- Use the **collection policy** to create token collections for a marketplace.

To illustrate how you can use these policies, assume that you want to offer a non-fungible token.
You want to ensure that you are the only person authorized to mint the token and that only one token can be minted and owned.
You also want to require that the token can only be transferred to a new owner through a sale contract and you'll be paid a royalty any time the token ownership changes.

To accomplish this, you can create the token using the `marmalade-v2.guard-policy-v1`,`marmalade-v2.non-fungible-policy-v1`, and `marmalade-v2.royalty-policy-v1` policies.

These policies help to ensure that you are the only person authorized to mint the token, only one token can be minted, and any time the token is transferred to a new owner, you're paid the royalty you specify.
After you mint the token, all future sales respect the policies you've put in place. 
Any new NFT owner can only resell the NFT using the offer, trustless escrow, and royalty enforcement process with a new buyer.

## Creating custom policies

If you find that some combination of concrete policies doesn't meet your needs, you can also use the built-in policies as models for creating your own custom token policies.
You can find several examples of custom policies in [Marmalade examples](https://github.com/kadena-io/marmalade/tree/main/examples/policies).

Like concrete policies, custom policies must adhere to the [`kip.token-policy-v2`](https://github.com/kadena-io/marmalade/blob/v2/pact/kip/token-policy-v2.pact) interface to be valid.
