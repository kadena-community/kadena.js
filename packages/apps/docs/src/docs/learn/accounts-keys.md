---
title: Accounts and keys
description: Learn about how accounts are defined on the Kadena blcokchain.
menu: Learn
label: Accounts and keys
order: 2
layout: full
---

# Accounts and keys

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
Kadena,[ check out this article](/blogchain/2020/beginners-guide-to-kadena-accounts-keysets-2020-01-14).

## Kadena is a multi-chain network

Kadena’s major breakthrough is that it has solved scalability in proof-of-work blockchains. 
To achieve this, the Kadena Chainweb consensus protocol braids network connections from multiple parallel chains into a single set of validated blocks.

However, each chain in the network operates independently.
When you create and fund an account on any chain, it only exists on that chain.
You can create accounts on more than one chain, but they are essentially independent accounts, with separate account balances and potentially different keysets and owners.
Because the chains operate independently, you should always pay close attention to the network and chain identifier you have selected when you are signing and submitting transactions

It's also important to remember that the account name doesn't determine ownership of an account. 
The keyset associated with an account determines ownership. 
You could own account named Alice on chain ID 0, and someone else could own account Alice on chain ID 5.

If you want to own a specific account name across all of the chains in the network, you would need to be the first person to create that account on each chain.

To visualize how Kadena Chainweb weaves together connections for multiple chains, check out this [3-minute video](https://www.youtube.com/watch?v=hYvXxFbsN6I).

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
