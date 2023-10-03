---
title: The NFT Collection Tutorial on Marmalade
description:
  Marmalade token policies allow for fine-grained customization of how NFTs are
  minted and sold. This article provides a tutorial demonstrating how an NFT
  collection supporting presale could be implemented in your NFT marketplace,
  using an example policy ‘simple-one-off-collection-policy`. This tutorial will
  demonstrate the policy step-by-step with an example collection called
  muppets-v1.
menu: The NFT Collection Tutorial on Marmalade
label: The NFT Collection Tutorial on Marmalade
publishDate: 2023-01-25
headerImage: /assets/blog/1_0RpXuD_h3i9crcT6pRulPg.webp
tags: [marmalade]
author: Heekyun
authorId: heekyun
layout: blog
---

# The NFT Collection Tutorial on Marmalade

Marmalade _token policies_ allow for fine-grained customization of how NFTs are
minted and sold. This article provides a tutorial demonstrating how an NFT
collection supporting presale could be implemented in your NFT marketplace,
using an example policy ‘simple-one-off-collection-policy`.

This tutorial will demonstrate the policy step-by-step with an example
collection called `muppets-v1`.

Releasing the collection is accomplished in the following steps:

1.  Initiate Collection (Operator)

2.  Reserve Whitelist (Minter)

3.  Reveal Tokens in collection (Operator)

4.  Create / Mint Token (Minter)

5.  Transfer

## Initiate Collection

In order to create a collection, the operator executes a function directly on
the policy,
`marmalade.simple-1-off-whitelist-collection-policy.init-collection`, with the
required fields.

- `collection-id`: id of collection.

- `collection-size`: Total number of tokens in the collection.

- `collection-hash`: Hash of the list of token IDs in the collection.

- `operator-guard`: Guard that is used to reveal the tokens.

- `operator`: existing fungible account to receive funds at `mint`.

- fungible: the fungible to be paid at `reserve_whitelist`.

- `price`: the fungible price of the whitelist to be transferred from buyer to
  operator.

The most important field to understand in this step is the `collection-hash`. In
order to lock in the tokens without revealing its properties, the list of tokens
will be hashed, with each token-id being the hash of its manifests. The tokens
will be revealed at a later step, and the token manifests will have to match the
given collection-hash in order to be created/minted.

When `init-collection` succeeds, an event
(`marmalade.simple-one-off-collection-policy.INIT_COLLECTION collection-id collection-size collection-hash fungible price operator`)
will be emitted.

### Initiate muppets-v1

1.  Create a token-manifest for each token:

All marmalade tokens must use `kip.token-manifest.create-manifest` function,
which will return a manifest format like this:

```pact
    {
      uri:object{mf-uri}
      hash:string
      data:[object{mf-datum}]
    }
```

For simplicity, each muppet token manifests will contain text of its names.

2. Use `marmalade.ledger.create-token-id` to generate token-ids.

```pact
   (marmalade.ledger.create-token-id (kip.token-manifest.create-manifest (uri
   "text" "Kermit the Frog") [])))
```

The function simply formats the manifest with `t:{manifest-hash}`. The token-id
for `Kermit the Frog` muppet token will therefore be
`t:33vh4wJvxEkXW72Bgvd88S6HKcyxLj2WJZEydAP4CCU`.

We will do the same for the 7 more tokens, and get the list of token-ids.

```pact
    (let*
      ( (get-manifest (lambda (muppet:string)
          (create-manifest (uri "text" muppet) [])
          ))
        (manifests:list (map get-manifest [ "Kermit the Frog"
                                            "Miss Piggy"
                                            "Fozzie Bear"
                                            "Gonzo"
                                            "Rowlf the Dog"
                                            "Scooter"
                                            "Animal"
                                            "Pepe the King Prawn"
                                            "Rizzo the Rat"]))
        (tokens:list (map (create-token-id) manifests)
        ))
       tokens
    )
```

returns

```pact
    [ "t:33vh4wJvxEkXW72Bgvd88S6HKcyxLj2WJZEydAP4CCU"
       "t:UohIzpKOlpp5l7UZ-KNni2xaLu5pO67QlHLmxj65g5U"
       "t:u7u36BxiPTKp5Wuq_mXOLS7r2LFRaLeEKg2FY6ylNX0"
       "t:rj3gbsmUdcXeb0kA39meDeKoMhWOPK6XEOCQ2RKF0q8"
       "t:uOCqa9-MgFF68zyxccZKORGDk2zMRLwpKdXvr8hfE5A"
       "t:dOFBE3GdsL-5BgMCdZfQzT20G81cANzwgwIf22N8_ig"
       "t:LScEFcxVDsvZP38jO1Kp95yNu7hGmGNrzYkwCM5UWyA"
       "t:--kKualbcNt2jKUPLG0Pyp6ByLJerOS_Wtxe914_YHA"
       "t:sQ19jh3-w3HOchpBefpKTBGj2_ARjC4xLiV0SVlokf4"]
```

3.Hash the token list.

Finally, we can hash the list and get the `collection-hash`, by using `hash`
function.

```pact
    (hash
      ["t:33vh4wJvxEkXW72Bgvd88S6HKcyxLj2WJZEydAP4CCU"
       "t:UohIzpKOlpp5l7UZ-KNni2xaLu5pO67QlHLmxj65g5U"
       "t:u7u36BxiPTKp5Wuq_mXOLS7r2LFRaLeEKg2FY6ylNX0"
       "t:rj3gbsmUdcXeb0kA39meDeKoMhWOPK6XEOCQ2RKF0q8"
       "t:uOCqa9-MgFF68zyxccZKORGDk2zMRLwpKdXvr8hfE5A"
       "t:dOFBE3GdsL-5BgMCdZfQzT20G81cANzwgwIf22N8_ig"
       "t:LScEFcxVDsvZP38jO1Kp95yNu7hGmGNrzYkwCM5UWyA"
       "t:--kKualbcNt2jKUPLG0Pyp6ByLJerOS_Wtxe914_YHA"
       "t:sQ19jh3-w3HOchpBefpKTBGj2_ARjC4xLiV0SVlokf4"] )
```

`eLbTngl8lNBPshPMohX0ILM8l7R4RV8eNm9p0Pq1W6E` is our collection hash. Note that
all of the steps 1-3 are not to be done on-chain, but should be done off-chain.
Only the following step will be executed on-chain.

4. Run `init-collection`

Finally, we have our required fields to initiate our collection. The following
code creates `muppet-v1` collection with 9 tokens that we generated above, with
`k:aa5f18ed095607fbef309abd5511baaa0844e067a61ed4cf51d5333e770ed030` being the
operator account in fungible, coin, with whitelist price of 5.0. This code
should now be sent to the chain.

```pact
    (init-collection
      "muppet-v1" 9 "eLbTngl8lNBPshPMohX0ILM8l7R4RV8eNm9p0Pq1W6E"
      "k:aa5f18ed095607fbef309abd5511baaa0844e067a61ed4cf51d5333e770ed030" (read-keyset 'operator-guard) coin 5.0)
```

We will see the following event emitted once the transaction succeeds.
`(marmalade.simple-one-off-collection-policy.INIT_COLLECTION "muppet-v1" 9 "eLbTngl8lNBPshPMohX0ILM8l7R4RV8eNm9p0Pq1W6E" "k:aa5f18ed095607fbef309abd5511baaa0844e067a61ed4cf51d5333e770ed030" coin 5.0)`

## Reserve Whitelist

Whitelists in this collection policy are on a first-come, first-served basis.
This step is to be run by the minters.

1.  To reserve whitelists, minters must have a `fungible` account with a balance
    bigger than the price.

In our example, `muppets-v1` collection uses fungible, `coin`, so the mint
account must be a coin account with a balance bigger than 5.0. Minters must use
a principal-ed account. This can simply be a `k:{public-key}`, but there is an
act function to generate it in code. For example, running the following code.

```pact
    (create-principal (read-keyset 'keyset))
```

with a keyset of

```pact
    {
      "keys": ["27fff7d20390142caf727cd4713d2c810839486fa2350af7e2ce980090185ce4"],
      "pred": "keys-all"
    }
```

will generate a
`k:27fff7d20390142caf727cd4713d2c810839486fa2350af7e2ce980090185ce4`.

Because this transaction will transfer `coin` to operator, the minters must sign
the capability
`(coin.TRANSFER "k:27fff7d20390142caf727cd4713d2c810839486fa2350af7e2ce980090185ce4" "k:aa5f18ed095607fbef309abd5511baaa0844e067a61ed4cf51d5333e770ed030" 5.0)`
to send from mint account to the operator account.

2. With prepared account, minters can now run `reserve-whitelist` and get their
   slots locked in.

Successful whitelist will emit an event,
`(RESERVE_WHITELIST collection-id account whitelist-index)`. This info should be
saved for the token creations and mint index.

The whitelist of the last token will generate a random index that will shift the
whitelist slots. This shift index will be used to randomize the selection of
NFTs within collection. By randomly setting the shift index at the end of
whitelist, marmalade prevents the operator to reserve certain NFTs that may be
more valuable than others.

### Whitelist a token in muppet-v1

1. Run `reserve-whitelist` with a keyset.

```pact
   (marmalade.simple-one-off-collection-policy.reserve-whitelist "muppet-v1"
   (create-principal (read-keyset 'keyset)))
```

2. Save the emitted event.

```pact
   (marmalade.simple-one-off-collection-policy.RESERVE_WHITELIST "muppets-v1"
   "k:27fff7d20390142caf727cd4713d2c810839486fa2350af7e2ce980090185ce4" 0)
```

3. Whitelist of the last token generates a shift-index.

Let’s assume that the last `reserve-whitelist` made it into block 20987. The
shift-index generated will be 8, and the transaction will emit 2 events.

```pact
    (marmalade.simple-one-off-collection-policy.RESERVE_WHITELIST "muppets-v1" "k:27fff7d20390142caf727cd4713d2c810839486fa2350af7e2ce980090185ce4" 8)
    (marmalade.simple-one-off-collection-policy.SHIFT collection-0" 8)
```

## Reveal Tokens

Once `reserve-whitelist` is complete, the operator can now reveal the token
manifests, showing which whitelist index is dedicated to each token id.

### Reveal muppets-v1

Operator of the `muppets-v1` will prepare the token-ids, and run the function.

```pact
    (marmalade.simple-one-off-collection-policy.reveal-tokens "muppets-v1"
        [  "t:33vh4wJvxEkXW72Bgvd88S6HKcyxLj2WJZEydAP4CCU"
           "t:UohIzpKOlpp5l7UZ-KNni2xaLu5pO67QlHLmxj65g5U"
           "t:u7u36BxiPTKp5Wuq_mXOLS7r2LFRaLeEKg2FY6ylNX0"
           "t:rj3gbsmUdcXeb0kA39meDeKoMhWOPK6XEOCQ2RKF0q8"
           "t:uOCqa9-MgFF68zyxccZKORGDk2zMRLwpKdXvr8hfE5A"
           "t:dOFBE3GdsL-5BgMCdZfQzT20G81cANzwgwIf22N8_ig"
           "t:LScEFcxVDsvZP38jO1Kp95yNu7hGmGNrzYkwCM5UWyA"
           "t:--kKualbcNt2jKUPLG0Pyp6ByLJerOS_Wtxe914_YHA"
           "t:sQ19jh3-w3HOchpBefpKTBGj2_ARjC4xLiV0SVlokf4"])
```

Note that the function `reveal-tokens` enforces the hash of the list of the
token-ids to match the `collection-hash` that was used in the `init-collection`
step as shown below.

```pact
    (enforce (= collection-hash (hash token-ids)) "Token manifests don't match")
```

In order for minters to be able to create and mint their tokens, the operator
must publish the token manifests to the whitelisters.

## Create Token / Mint Token

`create-token` is an operations required for each marmalade token in the
collection to add it to the marmalade ledger. Minters must use the published
manifest to call `create-token`.

This step is ideally run together with `mint` transaction. `mint` is the final
step that is required to own the token. Similar to `create-token`, `mint` is a
general marmalade operation.

Collection policy enforces that the `create-token` and `mint` is done by the
whitelisted account.

### Create “t:sQ19jh3-w3HOchpBefpKTBGj2_ARjC4xLiV0SVlokf4” token.

1.  Find the `whitelist-info`.

In the previous step, we had reserved whitelist for the account, and saw the
emitted event of below.

```pact
    (marmalade.simple-one-off-collection-policy.RESERVE_WHITELIST "muppets-v1" "k:27fff7d20390142caf727cd4713d2c810839486fa2350af7e2ce980090185ce4" 0)
```

We need 4 fields for whitelist info: `collection-id`, `account`, `guard`,
`index`. What's not in this event is the guard. Guard can simply be the `keyset`
info we've provided at `(create-principal (read-keyset 'keyset))`.

Our `whitelist-info` will be added to `env-data` of our transaction, and will
look like the following:

```pact
    {
      'whitelist-info : {
         'collection-id: "muppets-v1"
        ,"index": 0
        ,"account": "k:27fff7d20390142caf727cd4713d2c810839486fa2350af7e2ce980090185ce4"
        ,"guard": {"keys": ["27fff7d20390142caf727cd4713d2c810839486fa2350af7e2ce980090185ce4"], "pred": "keys-all"}}
    }
```

2. Find the token that matches the whitelist index.

Our whitelist index was 0. When the whitelist ended, the shift index was updated
at 8. This means we will be able to mint the token at index 8. If our whitelist
index was 1, we will be able to mint the token at index 0, and so on. The
token-id at index 8 is `t:sQ19jh3-w3HOchpBefpKTBGj2_ARjC4xLiV0SVlokf4`.

3. Receive the token-manifest from the operator.

The operator will release the token-manifest somewhere for the users to mint the
tokens. The manifest that matches token
`t:sQ19jh3-w3HOchpBefpKTBGj2_ARjC4xLiV0SVlokf4`, is shown below.

```pact
    {"uri":
      {"scheme": "text","data": "Rizzo the Rat"},
       "hash": "sQ19jh3-w3HOchpBefpKTBGj2_ARjC4xLiV0SVlokf4","data": []}
```

Note that above is the result of the code,

```pact
    (kip.token-manifest.create-manifest (uri "text" "Rizzo the Rat") [])
```

4. Run `create-token` and `mint` with the `whitelist-info` in `env-data`.

`create-token` takes in `token-id`, `precision`, `token-manifest`, and `policy`.
The `precision` is 0, because this is a one-off collection policy. `mint` takes
in `token-id`, `account`, `guard`, and `amount`. `amount` is always 1.0, because
this is an one-off collection policy.

```pact
    (marmalade.ledger.create-token
      "t:sQ19jh3-w3HOchpBefpKTBGj2_ARjC4xLiV0SVlokf4"
      0
      {"uri":
        {"scheme": "text","data": "Rizzo the Rat"},
         "hash": "sQ19jh3-w3HOchpBefpKTBGj2_ARjC4xLiV0SVlokf4","data": []}
      marmalade.simple-one-off-collection-policy)
    (marmalade.ledger.mint
      "t:9mCeDcVIuQET1awDEWbYXF-HlRzhLv5VW3hXiW9m678"
      "k:27fff7d20390142caf727cd4713d2c810839486fa2350af7e2ce980090185ce4"
      (at 'guard (read-msg 'whitelist-info ))
      1.0))
```

The minter needs to sign the capabilities,
`(marmalade.ledger.CREATE_TOKEN "t:9mCeDcVIuQET1awDEWbYXF-HlRzhLv5VW3hXiW9m678" "k:27fff7d20390142caf727cd4713d2c810839486fa2350af7e2ce980090185ce4"), (marmalade.ledger.MINT "t:9mCeDcVIuQET1awDEWbYXF-HlRzhLv5VW3hXiW9m678" "k:27fff7d20390142caf727cd4713d2c810839486fa2350af7e2ce980090185ce4" 1.0)`

`create-token` and `mint` can run separately or together on the same
transaction.

## Transfer

This collection policy uses plain `transfer` and `transfer-create` from the
`marmalade.ledger` contract. `transfer` requires sender and receiver account
names as well as the amount, which works with existing receiver accounts.
`transfer-create` requires sender and receiver account names, receiver guard,
and the amount, which works with existent and non-existent receivers. Sender's
signature is required for both `transfer` and `transfer-create`.

## Things to consider

We have now looked at initiating a collection to mint each token in the
collection. The account designated at the mint step now owns the token in the
main `marmalade` ledger.

There are more questions to be asked, however, including the scalability of
bigger collections.

- How should we prevent the operator from scamming the whitelisters? The
  contract collects the funds of the buyers at `reserve-whitelist` phase, which
  means that without operator from providing token-mainifests, the buyers cannot
  mint the token.

- Should the operator run `reveal-tokens`? If the token list is available
  off-chain, then the operator is not necessarily required to `reveal-tokens`.
  If not, who should run it?

- If the collection holds bigger tokens, then adding the slots and token-list as
  a list inside a table can become a costly transaction. The alternative can be
  adding each whitelists and token-ids as rows in the table.

We hope that you found this tutorial helpful! There will be lots of exciting
development in Marmalade over the course of the year, so please follow us on our
social channels to keep updated!
