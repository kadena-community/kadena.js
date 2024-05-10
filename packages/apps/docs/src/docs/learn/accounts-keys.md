---
title: Accounts, keys, and principals
description: Learn about how public and secret keys are used in accounts and how accounts Kadena blockchain differ from accounts and addresses on most blockchains.
menu: Learn
label: Accounts, keys, and principals
order: 2
layout: full
---

# Accounts, keys, and principals

With most blockchains, accounts and account addresses that can send and receive funds are based on generating public and secret key pairs then using your public key as your account name. This “one-to-one” model keeps things simple, but runs into problems when you want to use multiple keys for a single account. For example, you might want an account to represent joint-ownership for partners in a relationship or the officers in a board of directors who must approve expenditures by a majority vote.

To handle situations where an account must represent more than one owner, Kadena makes a distinction between **keys** and **accounts**. This distinction enables multiple keys to be associated with the same account name.

In simple terms, an **account name** is a unique name on the blockchain that can hold funds with one or more public and secret key pairs that grant access to the account. The keys determine ownership of an account. The rules for how many keys are required to act on behalf of the account are defined in a construct called a **keyset**.

## Defining a keyset

A keyset is a specific type of **guard** that consists of one or public keys and a **predicate** that specifies how many of the keys are required to perform an operation. In JSON, a keyset looks similar to the following example:

```json
{
  "my-keyset-name": {
    "keys": [
      "1d5a5e10eb15355422ad66b6c12167bdbb23b1e1ef674ea032175d220b242ed4",
      "4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0",
      "58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c"
    ],
    "pred": "keys-any"
  }
}
```

In this example:

- The keyset name is `my-keyset-name`.
- There are three public keys defined as owners associated with this keyset.
- The predicate of `keys-any` means that any of the three public keys can sign transactions and act on the behalf of the account associated with this keyset.

## Defining accounts

An account is an entry in the Kadena coin contract ledger—a key-value store—that consists of the following parts:

- An account name in the form of a string of 3 to 256 LATIN-1 characters (key).
- An account value that holds the decimal balance of funds in the account and a keyset that governs the account.

As you saw in the previous example, the keyset consists of one or more public keys and the predicate that specifies the number of keys that must sign a transaction for the account.

There are three built-in predicate options:

- keys-all
- keys-any
- keys-2

For most accounts—where there's only one public key with ownership of the account—the default predicate of `keys-all` works as you would expect it to, granting ownership of the account to a single party. However, the predicate is important to consider when creating accounts that require multiple signatures or have multiple owners. For example, the `keys-2` predicate requires that at least two public keys defined in the keyset for the account must sign a transaction to authorize the execution of that transaction.

The following diagram illustrates the relationship between keys, keysets, and accounts:

![Keys, keysets, and accounts on the Kadena network](/assets/docs/kadena-account.png)

If you would like to learn more about keys and accounts in Kadena, see [Beginner's Guide to Kadena: Accounts + Keysets](https://medium.com/kadena-io/beginners-guide-to-kadena-accounts-keysets-fb7f32104291).

## Accounts on a multi-chain network

The Kadena network is a scalable proof-of-work blockchain with a consensus model that weaves the transactions and blocks from multiple **parallel chains** into a single and consistent view of the blockchain state. For a visual introduction to how the Kadena Chainweb protocol weaves connections from multiple chains into a single view of state, watch the 3-minute video [How Chainweb Works: A Simple Animation](https://www.youtube.com/watch?v=hYvXxFbsN6I).

Ultimately, this single view of state is one network. However, each of the parallel chains in the network operates independently. When you create and fund an account on any chain, it only exists on that chain. You can create accounts on more than one chain, but they are essentially independent accounts, with separate account balances and potentially different keysets and owners. Because the chains operate independently, you should always pay close attention to the network and chain identifier you have selected when you are signing and submitting transactions.

It's also important to remember that the account name doesn't determine ownership of an account. The keyset associated with an account determines ownership. You could own account named Alice on chain ID 0, and someone else could own an account named Alice on chain ID 5. If you want to own a specific account name across all of the chains in the network, you would need to be the first person to create that account on each chain.

## Account names and principals

As mentioned in [Defining accounts](#defining-accounts), an account name can be any string. Using an arbitrary string as an account name can be convenient. For example, you might want to create an account with a name that identifies it as a personal or primary account, for example, Lola-Pistola, so that it's easy to differentiate it from an account that you own jointly with another party or a group, for example, Las-Pistolas.

However, using arbitrary account names like these examples can make your account vulnerable to certain kinds of attacks. For example, an attacker might try to hijack a transaction that creates an account or transfers funds by changing the guard associated with the account name. One way to prevent an account from being hijacked by an attacker is to create **principal** account. A principal is a way to enforce a one-to-one relationship between a guard and what the guard is there to protect, like the ownership of an account balance. If an attacker tries to hijack the account by changing the guard, the guard won't match the account as it's defined in the underlying ledger, so the guard would be rejected and the transaction would fail.

### Guards

In Pact, **guards** provide a way to limit access. The guard defines the specific conditions that must be met before granting access to the account, permission, module, or other information that the guard is there to protect. Pact provides several different types of guards to handle different scenarios and use cases.

You've already seen the most common type of guard—the keyset—and pinning the keyset guard to the account name is the most common scenario for creating a principal account for individual keys or groups of keys.

### Keysets and principals

Keysets represent the most-commonly used type of guard and are the most similar to how most blockchains protect access to accounts using public and secret keys. A keyset holds a collection of one or more public keys and a predicate that defines how many of those keys must sign to satisfy the guard. In Pact, the guard is a Boolean value that must return true for an associated action to take place.

By default, when you define a keyset with a **single** public key and the **keys-all** predicate, the result is an account name that starts with the `k:` prefix, followed by the public key for the account. This naming convention creates a principal account for an individual key.

You can also create principal accounts for keysets that have multiple keys and that use either built-in or custom predicate rules. For example, you can define a keyset with two public keys and the built-in predicate `keys-any`. If you create a principal for this account, the keyset information is used to generate a unique hash and the account is created using the `w:` prefix, followed by the hash for the guard.

### Other types of guards

You can create principals for other types of guards and there are several different types of guards you can implement in smart contracts. You learn more about the other types of guards available and how to use them in [Advanced concepts](/build/pact/advanced). The most likely guards that you might create a principal account for are **user guards** and **capability guards**.

#### User guards

In some cases, you might want to customize the guard to allow one of two different keysets to sign. For example, you might have one keyset where the keys for the members of a board of directors are registered and another keyset where the keys for union representatives are registered.

You can create a principal for this type of guard to evaluate the keysets at runtime to determine whether the guard is satisfied by the board of directors or the union representatives. If you create a principal for this type of guard, the keyset information is used to generate a unique hash and the account is created using the `u:` prefix, followed by the hash for the guard.

User guards can be very flexible and powerful. However, user guards are pure functions that don't allow access to a database during evaluation of the guard.

#### Capability guards

Because user guards are required to be pure functions, they can't take database state into account. If you need to access database state, you can define a guard that requires a capability to be brought into scope. With this type of guard, you can retrieve database state when you bring the capability into scope. If you create a principal for this type of guard, the guard information is used to generate a unique hash and the account is created using the `c:` prefix, followed by the hash for the guard.

### Account prefixes

Each type of principal and guard uses a unique prefix, so they are easy to recognize. If you create principal accounts for the guards, you'll see that the principal accounts use the following set of prefixes:

- k: for single key keysets
- w: for multiple keys keysets
- u: for user guards
- c: for capability guards

## Transfers within and between chains

There are two main ways to move Kadena tokens (KDA) between accounts:

- Transfer coins between accounts on the same chain.
- Transfer coins between accounts on different chains

The primary different between these two types of transfers is who pays the transaction fee to have the transaction included in a block.

- With same-chain transfers, the sender must pay the transaction fee.
- With cross-chain transfers, the sender and the recipient must both pay a transaction fee.

With a cross-chain transfer, you interact with two different blockchains, which requires two separate transactions, one on each chain.

If you attempt to send a cross-chain transfer to a recipient with no funds on the destination chain, the transfer operation won't be able to complete. However, anyone with funds on the destination chain can help to pay the required fee, allowing the transfer to finish as intended. Kadena has also set up **gas stations** cover the cost of transaction fees for cross-chain transfers. If you have an incomplete cross-chain transfer, you can use the [Transfer assistant](https://transfer.chainweb.com) to finish the transaction on the destination chain.

To learn more about transfers in Kadena, see [Getting started with transfers](https://medium.com/kadena-io/kadena-public-blockchain-getting-started-with-transfers-153bf87d6824).
