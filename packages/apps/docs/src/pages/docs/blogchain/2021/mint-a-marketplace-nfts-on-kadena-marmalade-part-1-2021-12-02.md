---
title: Mint a Marketplace! NFTs on Kadena Marmalade (Part 1)
description:
  Learn how new account protocols on the Kadena blockchain make multi-chain
  operation safer and easier! Blockchain custody is hard. At Kadena we set out
  to solve this hard problem with Pact, by making it easy to do things like key
  rotation, multi-sig, and autonomous guards, so that the average user can
  benefit from institutional-level security best practices.
menu: Mint a Marketplace! NFTs on Kadena Marmalade (Part 1)
label: Mint a Marketplace! NFTs on Kadena Marmalade (Part 1)
publishDate: 2021-12-02
headerImage: /assets/blog/1_BEuMAVlJ32_pP984cFKAwQ.webp
tags: [marmalade]
author: Stuart Popejoy
authorId: stuart.popejoy
layout: blog
---

# Mint a Marketplace! NFTs on Kadena Marmalade (Part 1)

## Part 1: A Better Standard for NFTs

[Marmalade](https://marmalade.art) is the new Kadena standard for NFTs,
addressing a long-standing concern plaguing NFT markets today, which is the
inability to enforce requirements on the sale of the NFT.

With Marmalade, Kadena is revolutionizing NFTs by enabling creators, buyers, and
communities to interact and participate in NFT ownership and sales without
limitation, secure in the knowledge that their unique vision will be enforced,
forever.

Learn how Kadena is making NFTs work for both creators and buyers in an open,
standards-compliant way, while setting the stage for builders to innovate in
ways never before seen, with token creators not just minting tokens but entire
marketplaces!

Be sure to check out the
[second part of this series](./mint-a-marketplace-nfts-on-kadena-marmalade-part-2-2021-12-03)
where we get into the technical details, which can also be seen in our
deployment on [Kadena testnet](https://kadena-io.github.io/marmalade/)!

## The Problem: “Transfer-only” standards

The dominant NFT regime today is powered by standards defined in Ethereum, and
judging by the success and widespread adoption of NFTs, they have well-proven
themselves by allowing NFT marketplaces to spring up and build a huge industry.
The original NFT standard is ERC-721, which defines how an NFT appears on the
blockchain, after which transfer to subsequent buyers can be recorded
transparently and permanently. The main elements of an ERC-721 NFT are:

1.  A **ledger** contract implementing the ERC-721 standard, identified by an
    Ethereum address.

2.  A **token ID** that uniquely identifies the NFT in the ledger.

3.  **Metadata** about the token, namely a name, a symbol, and a “token URI”.
    The latter is intended to reference information about whatever artifact the
    NFT represents.

4.  The **transfer** operation and associated features for transferring custody.

This was followed by the ERC-1155 standard which allowed NFTs to be subdivided,
such that **transfer** does not necessarily transfer the whole NFT. Indeed
ERC-1155 is called the “multi-token standard” because it generalizes both NFT
and “FT” (that is, “normal” tokens or ERC-20s), since a subdividable token is
indistinguishable from a “normal” token, and a typical NFT is simply a token
with only 1 unit.

However, NFTs aren’t tokens — the whole point of “non-fungibility” is to
indicate that this item can’t be traded for another. In a “normal” crypto
coin-like token, **transfer** is the main operation: money changes hands. For an
NFT however, transferring it from one owner to another leaves out a crucial
step: the **sale** of the NFT. The transfer-based model of ERC-20 was grafted
onto NFTs without considering the problem of a _sale-less transfer,_ that is, a
transfer without an associated sale.

## Transfer is not enough

The problem with the ERC transfer-only model for NFTs appears whenever you want
to do something beyond simply buying the NFT from the current owner with no
strings attached. For instance, an oft-touted feature of many NFTs is their
ability to pay a **royalty** to the original creator every time the artifact
changes hands.

One would think this means the blockchain makes it impossible to sell or
transfer the NFT without collecting the royalty. Unfortunately, it doesn’t work
this way with current Ethereum royalty standards like ERC-2981, supported by
exchanges like OpenSea or Nifty.

Under ERC-2981, the NFT ledger exposes a function that takes a price and
computes a royalty and receiver for a given token. The enforcement is entirely
handled by the exchange, such that they essentially pinky-swear that whenever
they make a sale, they will always call this function, and distribute funds
accordingly, before calling **transfer **to hand the NFT to the buyer.

This means that **enforcement of a royalty scheme is entirely dependent on the
exchange it is sold at**. This is not how crypto standards are supposed to work!
The whole point of token standardization is to make it easy for tokens to trade
on any exchange without the possibility of violating the rules of ownership.
ERC-2981 basically traps royalty-bearing NFTs at the exchanges they were minted
at.

This is true for any market control you can think of, such as enforcing a “floor
price” on secondary sales of an NFT. The entire structure of current ERC NFT
standards dance around the fact that not only is **transfer** insufficient, it’s
actually harmful to the intent of creators who want to control how their
creation is bought and sold.

## The solution: an on-chain sale standard

The only solution that makes any sense is to bring the sale into the standard.
But there’s a reason ERC standards don’t do this: **they can’t.**

Think what a sale consists of in the simplest case:

1.  A seller lists an NFT for sale with a price in some coin.

2.  A buyer ponies up the coin to the seller.

3.  The seller transfers the NFT to the buyer.

Notice how the NFT standards described above only involve step 3 (transfer of
the NFT), and royalty standards step 2, with no way to enforce that 2 leads to
3, or that royalty payment is handled correctly. What is needed is a standard
that can encompass **all three steps** and thus **eliminate any possibility of
an improper transfer or unpaid royalty.**

The hard part for Ethereum is, there is no mechanism in Solidity to express a
concept like this. The fact of the matter is, **a sale is a multi-step
process.** A buyer cannot buy an NFT if it is never listed for sale in some
manner. If only there was a smart contract technology that made it easy to
describe a multi-step process …

## Pact to the Rescue — with “Pacts”

Kadena’s smart contract language Pact has the critical missing feature: “pacts”,
which are multi-step processes defined in the smart contract. A pact is a
special kind of function with explicit steps in a fixed order, such that step 2
can only follow step 1, etc: a simple, enforceable “recipe” for sequenced
interactions on-chain.

Best of all, pacts can be specified in standards! For instance, Kadena’s version
of ERC-20, the _fungible-v2_ standard, specifies the “cross-chain transfer”
pact, which allows moving a coin across Kadena’s braided chains. Clearly, this
requires a two-step operation: burn the funds on the source chain, and mint them
on the target chain. All of the sequencing and cryptography required to make
this happen is handled automatically and safely by the Pact language itself!

With the ability to specify a multi-step operation, we can finally see what an
enforceable NFT marketplace standard looks like. The first step is **offer**, in
which a seller lists an NFT for sale. This puts the NFT into a _trustless
escrow_ that can only be released by later steps of the pact. The second step is
**buy**, where a buyer executes some offsetting payment, and the escrowed pact
is transferred to the buyer. If the buyer never shows up, after a timeout the
seller can “roll back” the pact and **withdraw** the sale, transferring the NFT
back to the seller from the escrow account.

## Standard-driven Marketplace Policies

With a “sale” pact, finally all dimensions of NFT sales can be captured in the
standard. What remains is a mechanism for the creator to specify their unique
requirements for how their token can be sold: the **token policy.**

The token policy dictates how sales are handled. For a concrete example let’s
consider a typical royalty policy: first, the royalty policy would require that
the NFT **cannot be transferred directly:** no undermining the creator with
sketchy transfers. Then, when offered for sale the seller must **specify a
price;** finally, when the purchase is complete, the sale automatically
**distributes the royalty to the creator** and the balance to the buyer, before
releasing the NFT from escrow to the buyer. No “opt-in” by the exchange, just
good old DeFi techniques to guarantee everybody plays fair.

Token policies are smart contracts that implement the **token-policy-v1** Kadena
standard, making them “pluggable”: a token creator can pick a policy from a menu
of options, or roll up their sleeves and write their own! Policies make it
possible to quickly and securely design incredible new models:

- Imagine an NFT that instead of paying a creator, pays out to a community DAO
  that is involved in charitable works. Now an artist can donate art to a
  community organization, such that all future sales enrich the community.

- Or, an NFT that allows every past buyer to receive a portion of royalties.

- Almost any auction structure can be used in concert with the **sale** pact, by
  specifying a policy that blesses the auction contract as the sole mechanism
  for sale.

- “Basket”-based purchases, where an NFT can be “traded” for not just tokens but
  other NFTs!

The possibilities are literally endless. Because these policies are locked in at
token creation time, there is no possibility of being “trapped” at those
exchanges that support your vision. Indeed the very concept of “NFT exchange”
gets disrupted when you give creators the tools to control how their creations
are transacted. Exchanges start to function more like their real-world
counterparts like studios and labels: you’ll list your token at an exchange for
those services and cachet afforded by the exchange, but rest secure in the
knowledge that they **cannot** violate your sale mechanisms.

## Minting Marketplaces on Kadena

This is why we say token creators on Kadena will not just mint tokens, but
entire marketplaces. Huge collections of NFTs can form “marketplace communities”
by sharing a common approach to ownership and sale. There is an unimaginably
rich future awaiting NFTs on Kadena, where truly decentralized, autonomous and
innovative transaction models combine with the explosion of creativity seen
on-chain, in the real world and in the metaverse!

Don’t forget: because Kadena is the world’s only scalable POW blockchain, gas
fees will never deprive you as a creator, seller or buyer of value. No matter
how massive your NFT project gets, users will always be able to use it quickly,
cheaply and safely. Kadena standards are charting the course for the future of
NFTs. Come mint a marketplace and show everyone how it’s done!
