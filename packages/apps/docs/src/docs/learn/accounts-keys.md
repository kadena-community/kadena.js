---
title: Accounts, keys, and principals
description: Learn about how public and secret keys are used in accounts and how accounts Kadena blockchain differ from accounts and addresses on most blockchains.
menu: Learn
label: Accounts, keys, and principals
order: 2
layout: full
---

# Accounts, keys, and principals

With most blockchains, accounts and account addresses that can send and receive funds are based on generating public and secret key pairs then using your public key as your account name. 
This “one-to-one” model keeps things simple, but runs into problems when you want to use multiple keys for a single account.
For example, you might want an account to represent joint-ownership for partners in a relationship or the officers in a board of directors who must approve expenditures by a majority vote.

To handle situations where an account must represent more than one owner, Kadena makes a distinction between **keys** and **accounts**.
This distinction enables multiple keys to be associated with the same account name.

In simple terms, an **account name** is a unique name on the blockchain that can hold funds with one or more public and secret key pairs that grant access to the
account. 
The keys determine ownership of an account.
The rules for how many keys are required to act on behalf of the account are defined in a construct called a **keyset**.

## Defining a keyset

A keyset is a specific type of **guard** that consists of one or public keys and a **predicate** that specifies how many of the keys are required to perform an operation. 
In JSON, a keyset looks similar to the following example:

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

For most accounts—where there's only one public key with ownership of the account—the default predicate of `keys-all` works as you would expect it to, granting ownership of the account to a single party. 
However, the predicate is important to consider when creating accounts that require multiple signatures or have multiple owners. 
For example, the `keys-2` predicate requires that at least two public keys defined in the keyset for the account must sign a transaction to authorize the execution of that transaction.

The following diagram illustrates the relationship between keys, keysets, and accounts:

![Keys, keysets, and accounts on the Kadena network](/assets/docs/kadena-account.png)

If you would like to learn more about keys and accounts in
Kadena, see [Beginner's Guide to Kadena: Accounts + Keysets](/blogchain/2020/beginners-guide-to-kadena-accounts-keysets-2020-01-14).

## Accounts on a multi-chain network

The Kadena network is a scalable proof-of-work blockchain with a consensus model that weaves the transactions and blocks from multiple **parallel chains** into a single and consistent view of the blockchain state.
For a visual introduction to how the Kadena Chainweb protocol weaves connections from multiple chains into a single view of state, watch the 3-minute video [How Chainweb Works: A Simple Animation](https://www.youtube.com/watch?v=hYvXxFbsN6I).

Ultimately, this single view of state is one network.
However, each of the parallel chains in the network operates independently.
When you create and fund an account on any chain, it only exists on that chain.
You can create accounts on more than one chain, but they are essentially independent accounts, with separate account balances and potentially different keysets and owners.
Because the chains operate independently, you should always pay close attention to the network and chain identifier you have selected when you are signing and submitting transactions.

It's also important to remember that the account name doesn't determine ownership of an account. 
The keyset associated with an account determines ownership. 
You could own account named Alice on chain ID 0, and someone else could own an account named Alice on chain ID 5.
If you want to own a specific account name across all of the chains in the network, you would need to be the first person to create that account on each chain.

## Account names and principals

As mentioned in [Defining accounts](#defining-accounts), an account name can be any string.
Using an arbitrary string as an account name can be convenient. 
For example, you might want to create an account with a name that identifies it as a personal or primary account, for example, Lola-Pistola, so that it's easy to differentiate it from an account that you own jointly with another party or a group, for example, Las-Pistolas.

However, using arbitrary account names like these examples can make your account vulnerable to certain kinds of attacks.
For example, an attacker might try to hijack a transaction that creates an account or transfers funds by changing the guard associated with the account.
One way to prevent an account from being hijacked by an attacker is to create **principal** account that has its guard pinned to the account name.
If an attacker tries to hijack the account by changing the guard for a principal account, the result would be a different account and the transaction would fail. 

## Guards

In Pact, guards provide a way to limit access.
The guard defines the specific conditions that must be met before granting access to the account the guard is protecting. 
Pact provides several different types of guards to handle different scenarios and use cases.
You've already seen the most common type of guard—the keyset—and pinning the keyset guard to the account name is the most common scenario for creating a principal account for individual keys or groups of keys.

## Keysets and principals

Keysets represent the most-commonly used type of guard and are the most similar to how most blockchains protect access to accounts using public and secret keys. 
A keyset holds a collection of one or more public keys and a predicate that defines how many of those keys must sign to satisfy the guard. 
In Pact, the guard is a Boolean value that must return true for an associated action to take place.

By default, when you define a Keyset with a **single** public key and the **keys-all** predicate, the result is an account name that starts with the `k:` prefix, followed by the public key for the account.
This naming convention create a principal account for an individual key.
 
Any other type of keyset combination results in an account with the `w:` prefix.

## User guards

In some cases, you might want to customize the guard to allow one of two different keysets to sign. 
For example, you might have one keyset where the members of a board of directors are registered and another keyset where union representatives are registered. 
This type of guard can be very flexible and powerful. 
However, user guards don't allow access to a database during evaluation of the guard. 
A user guard is ,in essence, a pure function that is evaluated at runtime to guard an account.

Such accounts result in an account with the `u:` prefix.

## Capability guards

Because user guards are required to be pure functions, they can't take database state into account. 
To gain this dynamic property ,one could retrieve such data while bringing a capability into scope. 
This way you can define a guard that requires a capability to be brought into scope. 
This can be achieved using a user guard, but a capability guard is more convenient and a more explicit way to achieve the same.

Accounts guarded by a capability result in an account with the `c:` prefix.

## Accounts recap

Every type of guard can be represented in a unique way. 
For every type of guard, you have a different protocol name. 
Here is a short overview of the protocols:

k for single key keysets
w for multiple keys keysets
c for capability guards
u for user guards

There are more principals, but I'll leave it at these as these are the most likely guards you'll use for creating an account.

You can see some examples below.

principal.pact
(begin-tx)
(module test G
  (defcap G() true)
  (defcap SOME-CAPABILITY(account:string) true)
  (defun enforce-my-guard(guard:guard)
    (enforce-keyset guard)))
(commit-tx)

(env-data
  { "ks": ["pubkey"]
  , "mks": ["pubkey1", "pubkey2"]
  , "amks": { "keys": ["pubkey1", "pubkey2"], "pred": "keys-any" }
  })
(begin-tx)
(expect "Principal name to match"
  "k:pubkey"
  (create-principal (read-keyset "ks")))
(expect "Principal name to match"
  "w:XJKZlqax4U3SYulCyboYGInyn33ycPFS2wJCVybYsjw:keys-all"
  (create-principal (read-keyset "mks")))
(expect "Principal name to match"
  "w:XJKZlqax4U3SYulCyboYGInyn33ycPFS2wJCVybYsjw:keys-any"
  (create-principal (read-keyset "amks")))
(expect "Principal name to match"
  "c:b7iZJRzXJZqY5gun9HLuKGwiRf8ZJICLvunggRWzlRs"
  (create-principal (create-capability-guard (test.SOME-CAPABILITY "my-account"))))
(expect "Principal name to match"
  "c:jDL5hzYaJEQiw-6x8Hd6_H1w7KrjCCubPSehxt500hM"
  (create-principal (create-capability-guard (test.SOME-CAPABILITY "my-other-account"))))
(expect "Principal name to match"
  "u:test.enforce-my-guard:Xv7uRrsqw9iCQIbGLudMQ7t_DB3xPzki5jqnAupaHoc"
  (create-principal (create-user-guard (test.enforce-my-guard (read-keyset "ks")))))
(expect "Principal name to match"
  "u:test.enforce-my-guard:39DM3OJqENcyQB3--8AuHxPsUTjgCsW-1jh-MFZv--U"
  (create-principal (create-user-guard (test.enforce-my-guard (read-keyset "mks")))))
(commit-tx)

(begin-tx)
(module test G
  (defcap G() true)
  (defcap SOME-CAPABILITY(accounts:string) 
    (enforce true "This is a test")))
(commit-tx)

(begin-tx)
(expect "the body of defcap to have no affect on the principal name"
  "c:b7iZJRzXJZqY5gun9HLuKGwiRf8ZJICLvunggRWzlRs"
  (create-principal (create-capability-guard (test.SOME-CAPABILITY "my-account"))))
(expect "the body of defcap to have no affect on the principal name"
  "c:jDL5hzYaJEQiw-6x8Hd6_H1w7KrjCCubPSehxt500hM"
  (create-principal (create-capability-guard (test.SOME-CAPABILITY "my-other-account"))))
(commit-tx)

## Transfers within and between chains

There are two main ways to move Kadena tokens (KDA) between accounts:

- Transfer coins between accounts on the same chain.
- Transfer coins between accounts on different chains

The primary different between these two types of transfers is who pays the transaction fee to have the transaction included in a block.

- With same-chain transfers, the sender must pay the transaction fee.
- With cross-chain transfers, the sender and the recipient must both pay a transaction fee.

With a cross-chain transfer, you interact with two different blockchains, which requires two separate transactions, one on each chain.

If you attempt to send a cross-chain transfer to a recipient with no funds on the destination chain, the transfer operation won't be able to complete.
However, anyone with funds on the destination chain can help to pay the required fee, allowing the transfer to finish as intended. 
Kadena has also set up **gas stations** cover the cost of transaction fees for cross-chain transfers. 
If you have an incomplete cross-chain transfer, you can use the [Transfer assistant](https://transfer.chainweb.com) to finish the transaction on the destination chain.

To learn more about transfers in Kadena, see [Getting started with transfers](/blogchain/2019/kadena-public-blockchain-getting-started-with-transfers-2019-12-19).
