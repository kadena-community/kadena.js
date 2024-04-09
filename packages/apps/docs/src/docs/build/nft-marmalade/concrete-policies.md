---
title: Policies
description: Describes how to work with concrete and custom policies when you create tokens.
menu: Policies
label: Use concrete policies
order: 8
layout: full
---

# Policies

As noted in [Layered contract architecture](/build/nft-marmalade), policies and the policy manager play an important role in defining and enforcing rules related to token attributes and token activity. 
Individual policies give you granular control over specific token properties or specific token activity, including minting, burning, transferring, and buying tokens.

Token policies are implemented as smart contracts based on the interfaces defined in the [`kip.token-policy-v2`](https://github.com/kadena-io/marmalade/blob/main/pact/kip/token-policy-v2.pact) standard.
There are several built-in policies—called **concrete policies**—that are configured to handle the most common marketplace use cases. 

The built-in concrete policies are officially released and maintained to provide ready-to-use implementations of common features.
These policies ensure consistent behavior without requiring any custom development work.
Depending on how you apply and configure them, concrete policies provide a flexible way to simplify token creation and set boundaries for token activity.

The next sections take a closer look at how to use concrete policies.

## Guard policy

The guard policy ensures that all token-related actions—minting,
burning, transferring, buying, and selling—can only be performed by
authorized parties.
If you apply the guard policy when you create a token, you can specify who is authorized to perform each type of token activity. 

A guard specifies a list of one or more keys and a predicate that dictates how many keys are required to sign a transaction.
Therefore, a typical configuration for the guard policy looks similar to the following:

```json
{
    "mint-guard": {
        "keys": ["k:bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e"], 
        "pred": "keys-all"
        },
    "burn_guard": {
        "keys": ["k:bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e"], 
        "pred": "keys-all"
        },
    "sale_guard": {
        "keys": ["k:bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e"], 
        "pred": "keys-all"
        },
    "transfer_guard": {
        "keys": ["k:bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e"], 
        "pred": "keys-all"
        }
}
```

It's important to note that specify the guards is optional, even if you apply the guard policy to a token.
For example, you can add a guard for the `mint` and `burn` operations without specifying a guard for the `sale` and `transfer` operations.
You can also specify different guards for each operation you want to authorize.
If you don't specify a guard for any operation, there are no restrictions enforced on who can perform any operation.

After you create a token with the guard policy, the guard policy ensure that only accounts with the appropriate `mint` key can mint new tokens. 
Similarly, if you want to reduce the token supply, only accounts with the `burn` key can destroy tokens.

If you want to transfer a token to a new owner, the guard policy verifies the transfer is executed by an account the `transfer` key.
When you're ready to sell, the guard policy confirms the sale ID in the pact and verifies that only accounts with the `sale` key can complete this action to guarantee it's an authorized sale.

For technical details about the guard policy, see [Guard policy](/reference/nft-ref/policy-manager/guard-policy).

## Collection policy

Many token creators generate non-fungible tokens in collections with a common theme or categorize their creative work by media, style, or subject.
The collection policy provides a `create-collection` function that enables you to define the following parameters:

| Use this parameter | To do this
| ------------------ | ----------
| `collection-name` | Specify the name of the collection.
| `collection-size` | Specify the maximum number of assets in the collections.
| `operator-guard` | Specify the keyset that is authorized to add assets to the collection.
| `operator-account` | Specify the account that owns and manages the collection.

The `create-collection` function generates a unique identifier for the collection.
You use this unique identifier to specify which tokens are included in the collection.
For example, you can specify that a token is part of a collection by providing a collection identifier similar to the following:

```json
{
    "collection_id": "collection:MawFy7BSJMkatOJ07y_e0tYbPE26K_q8x0ACX5C25B8",
}
```

For technical details about the collection policy, see [Collection policy](/reference/nft-ref/policy-manager/collection-policy).

## Non-fungible policy

The non-fungible policy ensures the uniqueness of digital assets.
If you apply this policy to a token, the policy guarantees that the token supply is one with a precision of zero.
No additional configuration is necessary for this policy.

For technical details about the non-fungible policy, see [Non-fungible policy](/reference/nft-ref/policy-manager/non-fungible-policy).

## Royalty policy

The royalty policy ensures that you can continue to benefit from your creations after an initial sale and with every subsequent sale.
You can define the royalty terms for a token if you create using the royalty policy.
After you define the terms, the royalty is automatically calculated and transferred to the account you specify whenever your work is sold to a new owner.

For example, a typical configuration for the royalty policy looks similar to the following:

```pact
"royalty_spec": {
  "fungible": "coin",
  "creator": "k:bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e",
  "creator-guard": {"keys": ["creator"], "pred": "keys-all"},
  "royalty-rate": 0.05
}
```

in this example, the royalty policy ensures that the creator account receives a return of 5% (0.05) for all
future sales of the token where this policy is applied.
