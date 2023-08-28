---
title: Introducing Marmalade V2 - Empowering the Future of NFTs
description:
  The long-awaited release of Marmalade’s V2 standard has arrived, bringing a
  host of exciting updates and features to the top NFT standard in the industry!
  If you’ve been tracking the progress of Kadena and its NFT standards, you know
  we’ve been on a journey from the unstandardised on-chain metadata and
  single-policy token logic in V1 (KIP-13) to a far more robust and dynamic V2
  (KIP-20). We’re thrilled to share the next stage of this adventure.
menu: Introducing Marmalade V2 - Empowering the Future of NFTs
label: Introducing Marmalade V2 - Empowering the Future of NFTs
publishDate: 2023-06-16
author: Heekyun
layout: blog
---

## Introducing Marmalade V2: Empowering the Future of NFTs

![](/assets/blog/1_zGdTSmjV4Q0BQWJ6ulpMIA.webp)

The long-awaited release of Marmalade’s V2 standard has arrived, bringing a host
of exciting updates and features to the top NFT standard in the industry! If
you’ve been tracking the progress of Kadena and its NFT standards, you know
we’ve been on a journey from the unstandardised on-chain metadata and
single-policy token logic in V1 (KIP-13) to a far more robust and dynamic V2
(KIP-20). We’re thrilled to share the next stage of this adventure.

**Understanding KIP-0020: The Marmalade V2 Standard**

Marmalade V1 initially introduced the use of the Haber manifest model and had a
policy-model token system, allowing tokens to adopt various policies, which adds
extra logic into the marmalade function such as create-token, mint, burn,
transfer, sale. With the V1 model, tokens could be programmed to allow
whitelisted collections, fungible sales with royalties, and more.

Marmalade V2 represents a significant leap forward. It introduces an off-chain
URI with a standardized metadata format, opening the door for marketplaces to
easily fetch necessary data.

In our continuous pursuit of advancement and refinement, we’ve incorporated an
enhanced feature in Marmalade V2: the stacking of policies. Unlike in V1, each
token in V2 isn’t bound by a singular policy. Instead, tokens can accommodate N
number of policies, providing an unprecedented degree of flexibility and
functionality. This feature is powered by one of the most notable additions in
Marmalade V2: “the policy manager”. The policy manager provides token creators
with the convenience of selecting their preferred features from our
comprehensive concrete policies, enabling effortless token creation. For those
seeking additional rules, the immutable policies field offers the flexibility to
incorporate specific requirements.

At the heart of this approach, there are three distinct types of policies:
**`concrete-policies`**, **`immutable-policies`**, and
**`adjustable-policies`**. Let’s dive deeper into what each of these means:

1. **Concrete-Policies**: These policies serve as foundational features for the
   token, representing its core characteristics. Stored as boolean values, they
   indicate whether a specific concrete-policy is in use. Importantly, these are
   immutable; once set, they cannot be altered. More importantly, Concrete
   policies are written and maintained by Kadena.

2. **Immutable-Policies**: These policies offer additional functionality,
   augmenting the capabilities of the token. Once established, these policies
   are also immutable, meaning they cannot be changed post-implementation.

3. **Adjustable-Policies**: Unlike the previous two, these policies provide
   flexibility, as they can be modified by the token owner. It’s crucial to
   note, however, that fractional tokens do not possess the capability to adjust
   these policies.

With respect to concrete policies, we offer five primary concrete policies which
encapsulate the most commonly used functionalities in token creation. Marmalade
V2 incorporates these concrete policies to simplify the process of token
creation, while simultaneously ensuring that the tokens still benefit from rich,
advanced features. The concrete policies are:

- **Collection Policy**: This policy facilitates the initiation of a collection
  with predefined token lists.

- **Fungible Quote Policy**: This policy empowers the sale of NFTs with
  fungibles through the use of an escrow account.

- **Non-fungible Policy**: This policy constrains the token supply to 1 and sets
  precision to 0, thereby enforcing the token’s non-fungibility.

- **Royalty-policy**: Dependent on the `fungible-quote-policy`, this policy
  designates the creator account to receive royalties upon each sale of the
  token using the `fungible-quote-policy`.

- **Guard-policy**: grants the ability to add optional guards to each marmalade
  action.

To incorporate these features during token minting, Marmalade users simply need
to add `true` or `false` next to the respective policy fields in
**`concrete-policies`**. Should projects require custom logic beyond what these
concrete policies offer, they can deactivate the concrete policy and incorporate
additional policies into the **`immutable-policies`** or
**`adjustable-policies`** fields.

![](/assets/blog/1_K4qJr2FaCwIjP-e78Hpc9A.webp)

**Migration**

For those seeking to migrate from Marmalade V1 to V2, the `migration-policy-v1`
policy is specifically built to migrate `marmalade.ledger` tokens to
`marmalade-v2.ledger`.

For projects that seek to use the v1 manifest model, they can continue using the
manifest using `onchain-manifest-policy-v1`.

–

The evolution from V1 to V2 signifies our relentless commitment to make NFTs
more secure, flexible, and beneficial for everyone involved — creators, buyers,
and the broader community. While we loved the idea of everyone minting their own
marketplace in V1, we realized that the true strength lies in the policy
management.

As we delve into this new and exciting journey, remember that this is just the
beginning. We’re looking forward to the innovative ways that you, the builders
and pioneers, will harness the power of Marmalade V2 to create a dynamic, more
inclusive, and ever-evolving NFT landscape.
