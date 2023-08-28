---
title: Token Protocol on Marmalade
description:
  To end 2022 with a bang, we are excited to announce our last feature upgrade
  of the year! The Marmalade team at Kadena has worked hard and is now rolling
  out an upgrade to the Marmalade contract with a new feature ttoken protocol.
  This new token protocol will increase safety for our developers during the
  lazy minting process! Let’s dive right in.
menu: Token Protocol on Marmalade
label: Token Protocol on Marmalade
publishDate: 2022-12-23
author: Heekyun
layout: blog
---

# Token Protocol on Marmalade

![](/assets/blog/1_PMdTOo8SNitmuC9rU75ahg.webp)

To end 2022 with a bang, we are excited to announce our last feature upgrade of
the year! The [Marmalade](https://marmalade.art/) team at
[Kadena](https://kadena.io/) has worked hard and is now rolling out an upgrade
to the Marmalade contract with a new feature: t:token protocol. This new token
protocol will increase safety for our developers during the lazy minting
process! Let’s dive right in.

**What is a Token Protocol?**

Token protocol code is a way to reserve token IDs that start with a single
character and a colon. This should sound familiar if you’ve seen Kadena Account
Procotols, or `k:` accounts. Just like accounts, token IDs now cannot be named
as `a:blahblah`. The first token protocol to introduce is `t:` token protocol.

**`t:` Token Protocol**

Our first token protocol, `t:` , reserves token ID’s with the token manifest,
specifically, the hash of the manifest.

Let’s look at the contract. All marmalade tokens uses manifest format like this:

```typescript
    {
      uri:object{mf-uri}
      hash:string
      data:[object{mf-datum}]
    }
```

The field, hash, is the hashed content of the `uri` and `data` field, and is
always verified at token creation. By using the hash in the token protocol, we
can ensure that the token is created with the matching manifest.

`t:` tokens are formatted as `t:`\{hash\}.

**What does it achieve?**

The newly introduced token protocol will add safety to lazy minting. Marmalade
policies can now safely reveal token IDs before its minting, without the
possibility of being squatted. Note that the safety doesn’t apply once the
entire manifest is revealed.

**Implementation**

The upgraded contract now enforces the token protocol at `create-token`, with a
newly created function `enforce-token-reserved`.

`enforce-token-reserved` takes in `token-id` and manifest , and checks that the
two match.

Another function available in the upgraded contract is `create-token-id`, which
takes in `manifest`, and returns the `t:` token ID matching the supplied
manifest.

Let’s look at an example.

Here’s a simple manifest with `hello-world` text, with

```typescript
    {
        "uri":
         {
           "scheme": "text",
           "data": "hello-world"
         }
       ,"hash": "lM-wiutct6tYae6bDuUTZ-aM359hwJ4ySHWPThbIGE0"
       ,"data": []
      }
```

The following code will generate the token id,
`t:lM-wiutct6tYae6bDuUTZ-aM359hwJ4ySHWPThbIGE0`

```pact
    (create-token-id
      {
        "uri":
         {
           "scheme": "text",
           "data": "hello-world"
         }
       ,"hash": "lM-wiutct6tYae6bDuUTZ-aM359hwJ4ySHWPThbIGE0"
       ,"data": []
      })
```

And below will enforce that the protocol passes with provided token-id and the
manifest

```pact
    (enforce-token-reserved
      "t:lM-wiutct6tYae6bDuUTZ-aM359hwJ4ySHWPThbIGE0"
      {
        "uri":
         {
           "scheme": "text",
           "data": "hello-world"
         }
       ,"hash": "lM-wiutct6tYae6bDuUTZ-aM359hwJ4ySHWPThbIGE0"
       ,"data": []
      })
```

**Conclusion**

Marmalade offers rich flexibility with pluggable policies that allow customized
rules for token creation, mint, burn, and transfers, and sales. Token Protocols
provides marmalade-universal standards across the policies.

We hope that you found this Marmalade upgrade useful. Please make sure to follow
us on our socials for more upcoming releases in 2023 as we’ll be rolling out
some fun and innovative content, tutorials, and policies!
