---
title: NFT marketplace reference
description: Technical reference information for Marmalade smart contracts and NFT marketplace.
menu: NFT marketplace reference
label: NFT marketplace reference
order: 4
layout: full
---

# NFT marketplace reference

In Marmalade V2, policies play a pivotal role in defining the behavior and
attributes of tokens. Policies enable creators to exercise granular control over
token functionalities, including minting, burning, transferring, buying.

The Marmalade V2 ecosystem introduces two types of policies: **Concrete
Policies** and **Custom Policies**. Both types adhere to the same
[`kip.token-policy-v2`](https://github.com/kadena-io/marmalade/blob/v2/pact/kip/token-policy-v2.pact)
interface, ensuring consistency and versatility in token behavior.

### **Concrete Policies**

A concrete policy in Marmalade V2 is a pre-built, ready-to-use implementation of
commonly used features in token creation. It simplifies the process of adding
functionality to NFTs and offers convenience for token creators. With concrete
policies, Marmalade aims to provide a rich set of features that can be easily
added to tokens without the need for extensive custom development.

This reference section provides technical information for the following Marmalade smart contracts:

Ledger 
Policy manager

Guard policy
Collection policy
Non-fungible policy
Royalty policy

Conventional auction
Dutch auction