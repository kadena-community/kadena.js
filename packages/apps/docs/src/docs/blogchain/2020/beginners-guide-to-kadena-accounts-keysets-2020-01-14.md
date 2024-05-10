---
title: Beginner’s Guide to Kadena Accounts + Keysets
description:
  When getting started with the Kadena public blockchain, the first thing you’ll
  want to do is create an account so you can start transacting with other users.
  This article will break down exactly what keys are, what an account is, the
  myriad ways to create one, and how to add your account to several existing
  tools.
menu: Beginner’s Guide to Kadena Accounts + Keysets
label: Beginner’s Guide to Kadena Accounts + Keysets
publishDate: 2020-01-14
headerImage: /assets/blog/2020/1_JfE77s3CWXoDbh4o9F2-gA.webp
tags: [pact]
author: Emily Pillmore
authorId: emily.pillmore
layout: blog
---

# Beginner’s Guide to Kadena Accounts + Keysets

## Beginner’s Guide to Kadena: Accounts + Keysets

When getting started with the
[Kadena public blockchain](https://www.kadena.io/kadena), the first thing you’ll
want to do is create an account so you can start transacting with other users.
This article will break down exactly what keys are, what an account is, the
myriad ways to create one, and how to add your account to several existing
tools. First, we’ll do an extremely high-level tour of public-key cryptography.

## What Are Keys?

Keys are everywhere in blockchain land. You might at least be aware that to
begin transacting in any network, you have to generate a public/private
_key-pair._ Using this pair of keys, you generally share the public one and keep
the private one secret, using the private key exclusively for signing
transactions. If this is foreign to you, I suggest you take a look at this
lovely
[StackOverflow summary](https://stackoverflow.com/questions/454048/what-is-the-difference-between-encrypting-and-signing-in-asymmetric-encryption)
of the metaphor. A key-pair is
[easy to generate](https://kadena-community.github.io/kadena-transfer-js/), and
looks a little like this:

```shell
public: 4bf1a0b622650367effca85dd6da35a937bc75fdbbdba04ff7d9338262135e98
secret: 0e809ea42eccb4a90caebeef015dd9ef71a8d1cdfcfabfecb446320dd3bfe7d2
```

Now, the fun part about public/private key-pairs is that a key-pair has the
property that the secret key can “prove” you are the owner of the public key
through a sophisticated dance (the underlying algorithm), and also has the
incredible property that any given key-pair is almost universally guaranteed to
be unique. No one will ever be able to produce an exact copy of either key by
any reasonable means other than theft. I say “almost,” because there’s still a
[probabilistically minute chance](https://security.stackexchange.com/questions/2943/what-are-the-chances-to-generate-the-same-ssh-key)
that someone may end up generating the same key-pair as you, but the time it
would take for that to happen is several trillion years from now, sometime
around the
[Heat Death of the Universe](https://en.wikipedia.org/wiki/Heat_death_of_the_universe)
— roughly the same probability as your computer spontaneously catching fire
during the generation process.

In many blockchains, because of the global uniqueness of key-pairs, accounts are
modeled as simply public/private key-pairs or a variation on the theme with
additional data like a nonce. This is great and makes things simple, but it runs
into problems very quickly from a philosophical standpoint. Consider the
following question: what do key-pairs represent? Is it an individual? A couple?
A throuple? A polycule? A board of directors? If it’s more than one person, what
governs usage policy? Certainly, if a married couple decides to open up a joint
bank account, it’d be terrible if one could drain the account and leave the
other penniless and without recourse. Indeed, joint accounts require
multiple-signature signing to release funds. In the same vein, a board of
directors would vote, and a majority of votes would determine what to do with
the funds of a company. Let’s call this idea _governance predicate_.

The metaphor works fantastically well for single-person, single-key-pair
accounts, but breaks down in blockchains like Ethereum when a many-to-many
relationship and finer-grained multiple-signature governance is needed. Much of
the Ethereum ecosystem, for instance, is geared towards finding clever ways to
shove the many-to-many idea into a many-to-one box, which ends up being costlier
than it needs to be, and frankly, begs a better design. Oddly enough, Bitcoin
handles multi-signature accounts just fine.

This brings us to the notion of Keysets in Kadena.

## What Is a Keyset?

Kadena natively supports multiple keys governing the same account (multi-sig),
so [keysets](/build/pact/advanced#keysets-and-authorizationh960403648) are,
to some degree, exactly what they sound like: a set of keys. In addition to a
set of keys, every keyset contains something called a ‘predicate function’ that
determines which keys are allowed to make choices for the account when it comes
to transactions (do all keys need to be present? only one? two? etc.).
Summarily, keysets look like the following as JSON data:

```shell
    {
      "keys": ["pubkey1", "pubkey2",...,"pubkeyN"],
      "pred": "some governance function"
    }
```

When signing a transaction, the list of private keys supplied as signing key
pairs will be checked against the keyset and predicate to ensure that not only
are all keys that need to be present accounted for but that the predicate is
satisfied.

**Predicate Functions**

There are 3 out-of-the-box predicate functions that are available:

- `keys-all`: This predicate will require that all key pairs governing the
  account are in scope when signing a transaction.

- `keys-any`: This predicate requires that at least one key pair governing the
  account is in scope when signing a transaction.

- `keys-2`: This predicate requires that at least two key pairs governing the
  account are in scope when signing a transaction.

Smart contract authors are free to write their own predicate functions if they
need more fine-grained functionality, but that is beyond the scope of this
article. Feel free to read up more on predicates in
[Keysets and authorization](/build/pact/advanced#keysets-and-authorizationh960403648).

**When Are Two Keysets the Same?**

Two keysets are the same when all of their keysets match, and they have the same
predicate function guarding the keys. This means that if you have an account
defined in the coin contract as the following data:

```shell
    key: "Emily" -> value: { 0.0, { ["fcca3bc5..."], "keys-all" }}
```

And someone attempts to transfer-create (see:
[getting started with transfers](/blogchain/2019/kadena-public-blockchain-getting-started-with-transfers-2019-12-19))
to your account (which checks the keyset against the one supplied by the sender)
with the following data:

```shell
    (transfer-create 1.0 "Emily" { ["fcca3bc5..."], "keys-any" })
```

Then this will fail because the keyset governing the account is wrong, and the
blockchain will see the transaction as someone using the wrong keys to try and
access an account. If you imagine a board of directors sitting around and all of
them have to be present to make a vote, but some bozo comes in trying to say
only 1 of them needs to be there and the rest can go home, that person would be
laughed out of the room! The same goes for keysets. Make sure the keys match
**exactly**.

## What Is an Account?

[Kadena](https://www.kadena.io/) is unique in the fact that there is no global
notion of what an account is. Even the
[KDA token](https://minerstat.com/coin/KDA) exists as a smart contract in the
network! It turns out that in the Kadena blockchain, every smart contract can
define their own tables and interact with them in a robust way, defining their
own data structures, called
[\*schema](/reference/syntax#defschemah-1003560474). These schemas\* are
used inside the contract to define the table structure, and therefore the way
the contract will store data. It just so happens that this is exactly what the
KDA coin contract does — it defines a table called coin-table along with a
schema called `coin-schema` , which defines the general model for interacting
with tokens. The schema is rather simple — row keys are account names, and the
data it points to are a balance and a set of keys governing the account.
Visually, it looks like this:

```shell
    key: Account Name -> value: { Balance, Keyset }
```

In practice, many people are used to the model that blockchains like Ethereum or
Bitcoin use, where public keys are considered an “address,” and there is an
associated balance. This is very similar to what Kadena has. In fact, if you
make your account name your public key, then it looks roughly the same:

```shell
    key: "f1f6f54914f33..." -> value: { 0.0, ["f1f6f54914f33..."] }
```

But if you really want to get fancy, then you can have a custom name as your
account name:

```shell
    key: "2Chainz" -> value: { 0.0, ["f1f6f54914f33..."] }
```

It doesn’t really matter — you just have to remember it! Practically, this is
why people just go with a public key as their account name — it’s right there in
the keys. As more sophisticated technology comes out supporting the Kadena
ecosystem, and as wallet technology gets better and better, tracking this sort
of thing will be taken care of automatically.

## Creating Accounts

Account creation happens in the blockchain in a few ways:

- When mining to an account and a keyset, when you win a block, the reward will
  create your account automatically using the keyset and account you specified.
  By default, if you just submit your public key as the argument to your keyset,
  then a singleton keyset will be constructed and your predicate will be set to
  `keys-all`.

- [`coin.create-account`](https://github.com/kadena-io/chainweb-node/blob/c9aaff7719b7a40d0deb900393379c6b8540e4bf/pact/coin-contract/v2/coin.pact#L228)
  which allows someone to create a zero-balance new account (note that this
  costs gas, which would have to be paid by a different account, which is
  possible with Kadena).

- Someone used
  [`transfer-create`](/blogchain/2019/kadena-public-blockchain-getting-started-with-transfers-2019-12-19)
  or
  [`transfer-crosschain`](/blogchain/2019/kadena-public-blockchain-getting-started-with-transfers-2019-12-19)
  to transfer coins to an account that did not exist (those functions
  spontaneously create an account and deposit the transfer amount into it if the
  account doesn’t exist).

Just creating a public key pair is not the same as creating an account in the
blockchain, but it does guarantee that you have a unique account name.
Cryptographically, public keys are almost guaranteed to be uniquely generated,
so people often conflate the two.

## Chainweaver Accounts

Along with its blockchain, Kadena released a wallet for Mac, called
[Chainweaver](https://www.kadena.io/chainweaver), and this wallet allows you to
create accounts easily with the click of a button. We’ve done a full write-up of
how to create accounts, keys, and make use of the wallet’s numerous features
[here.](/blogchain/2020/do-anything-on-the-kadena-blockchain-with-a-single-tool-2020-02-21)

## **Conclusion**

There you have it: this has been a tour of accounts! This is one of the more
fundamental aspects of interacting with the Kadena blockchain, and I’m glad you
took the time to read about it. We’ve made some great improvements to the way
people interact with blockchains, supporting native multi-sig and custom smart
contract table design, and we are happy to take on board any feedback you can
give.

We also welcome help from the community for documenting these tools and
constructing new ones along the way. We are always happy to rep
community-blessed tools if they are better than our own. We welcome anyone to
contribute to the
[Kadena Community projects repository](https://github.com/kadena-community) with
your own project or add to existing ones. So far, the community projects have
yielded both a great terminal wallet with
[Bag of Holding](https://github.com/kadena-community/bag-of-holding), and a
[blazing fast GPU miner](https://github.com/kadena-community/bigolchungus)
courtesy of Alex Khonovalov, Edmund Noble, and myriad other insanely smart
community members.

Thanks to everyone who contributed, and please feel free to raise your questions
to me in [Discord](https://discord.io/kadena) — my handle is one of @topos,
[@pitopos](https://twitter.com/pitopos), or
[@emilypi](https://github.com/emilypi) depending on where I am on the internet.
I’m perpetually glued to my screen, so I’ll usually answer if you find me. In
the event I’m sleeping, there may be a delay.
