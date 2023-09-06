---
title: Mint a Marketplace NFTs on Kadena Marmalade (Part 2)
description:
  In the previous article, we showed how Kadena Marmalade is revolutionizing how
  NFTs are transacted on-chain with multi-step pacts controlling sale, and token
  policies offering “pluggable” marketplace implementations for creators to
  choose from, or write their own! In this article we will go deep into the
  actual standards and Pact implementations so builders can start minting
  marketplaces right away on testnet!
menu: Mint a Marketplace NFTs on Kadena Marmalade (Part 2)
label: Mint a Marketplace NFTs on Kadena Marmalade (Part 2)
publishDate: 2021-12-03
author: Stuart Popejoy
authorId: stuart.popejoy
layout: blog
---

![](/assets/blog/1_BEuMAVlJ32_pP984cFKAwQ.webp)

# Mint a Marketplace: NFTs on Kadena Marmalade (Part 2)

## Part 2: Technical Details of the new NFT Standard and Smart Contracts

In the
[previous article](./mint-a-marketplace-nfts-on-kadena-marmalade-part-1-2021-12-02),
we showed how Kadena [Marmalade](http://marmalade.art) is revolutionizing how
NFTs are transacted on-chain with multi-step pacts controlling sale, and token
policies offering “pluggable” marketplace implementations for creators to choose
from, or write their own! In this article we will go deep into the actual
standards and Pact implementations so builders can start minting marketplaces
right away [on testnet](https://kadena-io.github.io/marmalade/)!

## Version 2 of the poly-fungible standard

Kadena’s initial NFT standard is inspired by ERC-1155, the “multi-token
standard” on Ethereum. Like the ERC version, it mainly specifies transfer
operations and limited metadata (the **uri** string value).
[Version 2](https://github.com/kadena-io/KIPs/pull/20) turbocharges this with
the full Kadena vision of truly decentralized on-chain NFTs:

- **Haber Content Manifests.** This replaces **uri** with cryptographically
  verifiable on-chain data, employing elements of Stuart Haber’s Content
  Integrity designs. This can be anything from a simple Data URI or DID
  (Decentralized Identifier) to any structured data, including image or document
  data on-chain!

- **“t:” Token Identifiers.** These incorporate the Content Manifest hash to
  make a token ID that cryptographically identifies the actual NFT. No more
  random addresses and duplicate NFTs!

- **The “sale” pact.** As introduced in the last article, this is the
  two-step-with-rollback trustless escrow sale pact that enables policy-driven
  markets. No more exchange lock-in!

- **Token policy specification.** The “pluggable” logic that makes it possible
  for creators to specify every last detail of issuance, transfer and sale.
  Policies are how you “mint a marketplace”.

## Understanding the “sale” trustless-escrow pact

Pacts in Kadena define a multi-step operation. They are used to handle
cross-chain transfers and, behind the scenes, even handle the automatic gas
purchase->redeem process on the Kadena blockchain!

In the sale pact, two steps are specified: **offer **and **buy. **The offer
operation also has a “rollback step” that allows the seller to **withdraw **the
sale. The sale pact uses a special feature of pacts, “pact guards”, to govern
the _trustless escrow_ of the NFT sale. Once an asset is transferred to an
account governed by a pact guard, only that particular execution of the pact, as
identified by its “pact ID”, has the right to manage that asset in subsequent
steps.

Note that a sale can only occur after token creation and minting. A sale is how
an existing NFT token that is owned by a “seller” finds a “buyer” who, upon
success, will receive the token.

## Step 1: Offer

![*Example of an “offer” step. Bob has offered to sell NFT1, which transfers the NFT to the escrow account associated with the sale ID. The NFT uses a token policy that allows quoting a coin price, so Bob quotes 50 KDA.*](/assets/blog/0_lOGA7REb1MsdjAQX.png)

The first step of the sale pact **offers the NFT for sale. **This step handles
the transfer of the NFT into the escrow account, and the fresh Pact ID assigned
to the particular sale execution is considered the “sale ID” in the SALE event
that gets emitted.

It’s important that the NFT be escrowed for sale, as it commits the seller to
“play by the rules.” This allows buyers to pay (or bid) with confidence that the
seller can’t rug-pull the NFT between offer and purchase or other shady
business. By initiating the sale, **the seller actually loses custody of the
token **unless the buyer does not materialize, at which point the seller can
roll back the sale with the **withdraw **process described below.

The token policy is responsible for any specific behavior needed, as specified
in the **init-sale **operation. The sale pact itself does nothing other than
escrowing the pact and capturing a timeout value. Policies would here quote a
price in some coin, or enforce a floor price: whatever is needed for the
particular marketplace.

## Step 2: Buy

![Example of an “buy” step. Alice sends a continuation of the sale:1 pact in order to transfer the NFT out of escrow to Alice’s NFT account. The NFT token policy first debits the sale price of 50.0 from Alice’s KDA account to credit Bob.](/assets/blog/0_vzGX8d_AGRxODoZN.png)

If a buyer wants to acquire the token offered in the first step, they send a
**continuation message **of the Pact ID (or “sale ID”) initiated in the first
step into the blockchain. Buyer recipient data for the token is specified in the
message payload in the **buyer **and **buyer-guard **fields.

At this point, the token policy is responsible for enacting whatever offsetting
transaction is needed to allow the release of the escrowed NFT to the buyer, in
the **enforce-sale **operation. While the sale pact handles transferring the NFT
out of escrow (and enforcing the timeout), everything else is “pluggable”, be
that an offsetting coin transfer, royalty redemption, or whatever you can
imagine!

## Step 1 Rollback: Withdraw

The timeout captured in the **offer **step allows a sender to withdraw from the
sale if nobody shows up to buy the token. The timeout is measured in blocks,
such that if a seller sets the timeout to 30 blocks, they cannot pull out of the
sale until 30 blocks have been mined on-chain.

Once the timeout has passed, the seller (or anybody, as the only authority
governing the rollback is the Pact code itself) sends a special “rollback”
continuation message for the sale ID. The **withdraw **operation simply
transfers the token out of the escrow account back to the seller.

Note that all of the logic surrounding the step-wise operation of the sale pact
is automatically handled by the Pact language itself (and the blockchain hosting
it). This ensures that step 2 can only happen after step 1, and only if step 1
has not been rolled back, and only if step 2 has not already happened; likewise
a rollback can’t occur if step 1 hasn’t happened, or if step 2 has already
happened. As you can see, left to programmers this would inevitably result in
numerous bugs. Instead with Pact it’s **impossible to have a bug in the
sequencing logic.**

## Token Policies

The sale pact is the critical piece of logic that powers mintable marketplaces,
since it introduces a fully autonomous and enforceable way to offer tokens for
sale within the standard. However, the **token policy** handles critical aspects
of the sale, such as how does money change hands? How might a royalty be
implemented? And also, doesn’t **transfer** still undermine everything?

Token policies don’t just govern sales, but transfer, minting, and burning as
well. This is necessary to make a truly enforceable token policy:

- **Creation.** The token policy is invoked when a token is created (this is
  distinct from minting, which actually establishes ownership of the NFT). This
  is where something like a royalty rate or other “permanent” data would be
  captured.

- **Minting.** One thing about ERC-1155 (and poly-fungible-v1 too) is the lack
  of a way to lock down issuance. With the minting policy, a token can declare
  itself to be a true 1-of-1, or limited series, or a fully fungible coin.

- **Burning.** Burning is already a head-scratcher for NFTs, but can obviously
  make sense for fungible coins. Burn policies allow prevention of burns in
  1-of-1 and limited-series NFTs, as well as other rules a creator may desire.

- **Transfer.** Transfer can finally be tamed with the transfer policy! For most
  NFTs it gets banned altogether, but it also serves other use cases like
  transfer restrictions, minimum or maximum order sizes, etc.

- **Sale.** Sale policies have separate operations for the offer and buy steps
  of the sale pact. Offer is where you might quote a price, and buy is where an
  offsetting transaction can be executed.

## Example: a “Fixed Quote Royalty” policy

To give a simple but powerful example of policies in action, let’s consider a
creator offering a token that implements a policy that enforces scarcity,
requires sales for transfer, and pays a royalty.

![*Creator “Carol” creates NFT7, a 1-of-1 with a 5% royalty, and mints it to herself.*](/assets/blog/0_-eWnPctZqoX1I1Gv.png)

In token **creation**, a **fixed max supply** is captured, which along with the
standard notion of **precision,** allows creating a true 1-for-1 NFT (supply
1.0, precision 0), a limited series of say 5 (supply 5.0, precision 0), or any
fixed issuance.

**Minting** enforces the max supply (precision is automatically enforced in the
ledger), to prevent minting once the max supply is reached. For a 1-of-1 this
would allow a single mint only. **Burning is prohibited** altogether.

![The current owner of NFT7, “Bob”, initiates a sale, quoting a price of 100 KDA. NFT7 is transferred to the trustless escrow account for the sale ID `<s17>`](/assets/blog/0_ccqAMUoU0CfHj2Sx.png)

The **sale** **initiation** policy requires the seller to quote a price in some
coin. This puts the NFT into the trustless escrow. **Transfer is prohibited
altogether** to prevent offline sales without royalty enforcement.

![*“Alice” pays the 100.0 KDA to receive NFT7 from the trustless escrow, with 95.0 going to Bob, and 5.0 going to Carol.*](/assets/blog/0_cDJKu9bnL-K9TR_f.png)

The **sale completion** policy computes the royalty from the quoted price,
transfers the royalty to the creator, and the balance to the seller, before
releasing the escrowed token to the buyer.

Note that **all sales going forward have to respect this process.** The buyer
can only resell using the exact same quoting process and royalty, with no
possibility of back-handed transfers behind the scenes.

## Conclusion: An Open Standard for Token Sales

Finally, NFTs can have rich on-chain metadata, verifiable IDs, and a true sale
process for enforcing a policy-driven marketplace. Check out the
[KIP-0013](https://github.com/kadena-io/KIPs/pull/20) proposal where we’re
hammering out the new standard, and come check out our smart contracts
[on testnet](https://kadena-io.github.io/marmalade/) and
[on Github](https://github.com/kadena-io/hft) to see how you can “mint a
marketplace” and drive innovation in NFTs on Kadena!
