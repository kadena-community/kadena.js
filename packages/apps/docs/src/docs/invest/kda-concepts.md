---
title: Accounts, addresses, and keys
description: KDA Concepts
menu: Accounts, addresses, and keys
label: Accounts, addresses, and keys
order: 2
layout: full
---

# Accounts, addresses, and keys

With most blockchains, accounts are modeled as simply public/private keypairs
(i.e. your account name is the same as your public key). This “one-to-one” model
keeps things simple, but runs into problems when you want to use multiple keys
for a single account, such as with jointly-owned or majority-ruled accounts.

Kadena natively supports multiple keys governing the same account name, and thus
the distinction between “keys” and “account name” becomes important.

In simple terms, “account name” refers to your unique name on the blockchain,
and “keys” refers to the public/private keypairs that grant access to your
account. In other words, it is the keys that determine ownership of an account.

Some Kadena account examples:

**Unnamed account** — account name is the same as a single public key

| **Account Name**                                                  | **Public Key ("Keyset")**                                         |
| ----------------------------------------------------------------- | ----------------------------------------------------------------- |
| 961fd95b190aeb38850754fee81b42486d 140e44ee78f8f2d9e25ab69c3053b6 | 961fd95b190aeb38850754fee81b42486d 140e44ee78f8f2d9e25ab69c3053b6 |

**Account Name**

**Public Key ("Keyset")**

- 961fd95b190aeb38850754fee81b42486d 140e44ee78f8f2d9e25ab69c3053b6

- 961fd95b190aeb38850754fee81b42486d 140e44ee78f8f2d9e25ab69c3053b6

**Named account** — account name is some memorable user-defined string

| **Account Name** | **Public Key ("Keyset")**                                         |
| ---------------- | ----------------------------------------------------------------- |
| alice            | 961fd95b190aeb38850754fee81b42486d 140e44ee78f8f2d9e25ab69c3053b6 |

**Account Name**

**Public Key ("Keyset")**

- alice

- 961fd95b190aeb38850754fee81b42486d 140e44ee78f8f2d9e25ab69c3053b6

**Multi-signature account** — a single account is governed by multiple keys

| **Account Name** | **Public Keys ("Keyset")**                                                                                                                                                                            |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BoardOfDirectors | 961fd95b190aeb38850754fee81b42486d 140e44ee78f8f2d9e25ab69c3053b6 c1cb44cf2327213b29729d1e5f4b70d812 0bc3ab1cbddc60633909324464e6ef 7731d6a6a772dcbf2cd0c8ca5649f902af fd6ed29622738810aa38ef8b307ca7 |

**Account Name**

**Public Keys ("Keyset")**

- BoardOfDirectors

- 961fd95b190aeb38850754fee81b42486d 140e44ee78f8f2d9e25ab69c3053b6 -
  c1cb44cf2327213b29729d1e5f4b70d812 0bc3ab1cbddc60633909324464e6ef -
  7731d6a6a772dcbf2cd0c8ca5649f902af fd6ed29622738810aa38ef8b307ca7

All Kadena accounts are comprised of 3 parts:

1. Account name
2. Keys
3. Predicate

“Predicate” is something that determines how many signatures are required to
transfer coins from the account. The three built-in predicate options are
keys-all, keys-any, and keys-2. Most KDA holders will never see, or even know
about, their account’s predicate because they will have a traditional single-key
account wherein keys-all and keys-any do the same thing. However, the predicate
becomes more important with multi-signature accounts. For example, the keys-2
predicate requires that at least 2 keys in the account must sign in order to
authorize a transaction.

If you would like to learn more about keys and accounts in
Kadena,[ check out this article](/blogchain/2020/beginners-guide-to-kadena-accounts-keysets-2020-01-14).

## 2. Kadena is a multi-chain network

Kadena’s major breakthrough is that it has solved scalability in Proof of Work
blockchains. To achieve this, Kadena has braided together multiple Bitcoin-like
chains. This means that Kadena is not just a single blockchain, but rather it is
comprised of several interconnected blockchains. Therefore, we say Kadena is a
multi-chain network. To visualize how this
works,[ check out this 3-minute video](https://www.youtube.com/watch?v=hYvXxFbsN6I).

For users, this means that any account you create will only exist on that chain.
If you would like to own a particular account name across all chains then you
must be the first person to create that account on each chain.

Important: The account name alone does not determine ownership. The keyset
associated with an account determines ownership. You could own account Alice on
chain ID 0, and someone else could own account Alice on chain ID 5.

The key takeaway is that you should pay attention to the chain on which you are
transacting.

## 3. Transfers can be done on the same chain or across two different Kadena chains

As the title suggests, there are 2 main ways to move KDA; on the same chain or
across chains.

The key takeaway here is related to gas—the small fee that users pay in order to
have their transactions included in a block.

- With same-chain transfers the sender must pay some gas
- With cross-chain transfers, the sender and the recipient must pay some gas

Cross-chain transfers interact with two different blockchains, so sending KDA
from one chain to another requires two separate transactions, one on each chain.

The good news is that cross-chain transfers sent to a recipient with no funds
are not necessarily lost forever, they are just incomplete transfers. Anyone
with funds on the destination chain can help to pay the required gas, allowing
the transfer to finish as intended. Further, Kadena has set-up gas stations
which will cover the cost of gas on the destination chain. One such gas station
can be accessed at[ this page](https://transfer.chainweb.com) which provides an
interface for finishing cross-chain transfers.

If you would like to learn more about transfers in
Kadena,[ check out this article](/blogchain/2019/kadena-public-blockchain-getting-started-with-transfers-2019-12-19).
