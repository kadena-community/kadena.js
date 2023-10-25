---
title: Introducing Kadena Account Protocols (KIP-0012)
description:
  Learn how new account protocols on the Kadena blockchain make multi-chain
  operation safer and easier! Blockchain custody is hard. At Kadena we set out
  to solve this hard problem with Pact, by making it easy to do things like key
  rotation, multi-sig, and autonomous guards, so that the average user can
  benefit from institutional-level security best practices.
menu: Introducing Kadena Account Protocols (KIP-0012)
label: Introducing Kadena Account Protocols (KIP-0012)
publishDate: 2021-09-27
headerImage: /assets/blog/1_40Badddk5S15Yw1X3WOSLg.webp
tags: [kda]
author: Doug Beardsley
authorId: doug.beardsley
layout: blog
---

# Introducing Kadena Account Protocols (KIP-0012)

Learn how new account protocols on the Kadena blockchain make multi-chain
operation safer and easier!

Blockchain custody is hard. At Kadena we set out to solve this hard problem with
Pact, by making it easy to do things like key rotation, multi-sig, and
autonomous guards, so that the average user can benefit from institutional-level
security best practices. Toward this end, in June we rolled out a new protocol
in our public blockchain to specifically target a particular hard part: **how do
you secure accounts on multiple chains?** While this isn’t fundamentally the
hardest problem, it is made harder by the way wallets force users to manage
their keys in a one-to-one relationship to an account ID. To solve this we have
introduced the **single-key account protocol** to ensure a single key is
reserved on any chain. This protocol is already active for KDA, and is now
standardized in
[KIP-0012](https://github.com/kadena-io/KIPs/blob/master/kip-0012/kip-0012.md)
as `account-protocols-v1` with KDA as the reference implementation.

## Custody in a Multi-Chain, Multi-Sig World

Accounts on Kadena are already living in the future, because Kadena is the only
native, seamless multi-chain platform on the market. It’s why Kadena can scale
to meet any demand while still maintaining the unbeatable security of
Proof-of-Work. However, this means we are hitting issues that other chains
haven’t even begun to consider.

Owning crypto on Kadena chains isn’t hard, and moving coins around from chain to
chain is easily accomplished with any wallet or our online tools. Accounts can
have any name regardless of the key or keys backing it, which is important for
multi-sig and other advanced techniques.

Indeed, at Kadena we see a future where users will use multi-sig as easily as
they use their bank account app today, with different keys on your phone, your
computer, and your watch all being able to sign transactions for the same
account in a manner similar to Two-Factor Authentication on websites.

Nonetheless, single-key is the dominant model for users today. Our account
flexibility is useful here too, to have multiple accounts under a single key.
You can even be like Bitcoin and do every transaction with a new account while
using the same key.

## Wallets are still in a single-chain, single-sig world.

Kadena’s flexibility is still beyond what wallets and dapps present to users
today. The “old way” (really the Ethereum way, since Bitcoin HD wallets have
long mastered multiple keys and multiple accounts) links a key irrevocably to a
single account. On Kadena this manifests as an account where the public key acts
also as the name of the account, or where the account name is a hash of the
public key. Most wallets aren’t designed for multi-account or multi-chain so
they expect/demand that the key match the account name in some deterministic
way.

In this world, multi-account flexibility creates a problem on multi-chain:
accounts named after a given key can be “hijacked” on other chains. While we
would prefer that wallets simply grok a multi-chain world, they still don’t,
which means somebody could think they’re sending you money on a different chain,
since it’s the same account ID, but somebody else “squatted” on the account
name.

## Kadena Account Protocols

Kadena account protocols are a newly-introduced feature that reserves all
account names starting with a single character and a colon. Thus, you cannot
create an account `a:blahblahblah` on Kadena because it starts with `a:`, etc.
This reserves these type of names for the creation of a rich family of account
naming protocols that will eventually allow for multi-sig and other innovative
account protocols.

## Single-Key Accounts

The first protocol we have introduced is the Single-Key Account Protocol, which
reserves k: for accounts that are named the same as the public key. Thus, if you
have key `7e5bb6365ddbbef620a39b7e4d1445b6fdf49d21a74c9dff6051ab690f893d6b`, you
know that you are the only person who can ever create an account named
`k:7e5bb6365ddbbef620a39b7e4d1445b6fdf49d21a74c9dff6051ab690f893d6bon` any
chain, as the KDA coin contract will check the public key guarding the account
and make sure it matches the name after the `k:`. With this, you can transact
with today’s wallets safely across multiple chains, secure in the knowledge that
your account cannot be “squatted”.

Note that this is only enforced on account creation. After you create the
account, you are allowed to rotate the account keyset to include more than one
key. This lets the reserved `k:` account name work for multi-sig while still
guaranteeing that it was originally controlled by the expected key.

Support for Single-Key Accounts is coming to wallets soon, but there is nothing
stopping you from using this approach in our wallet Chainweaver where you can
simply prepend k: to your public key when creating an account, or do the same in
our online wallet tools.

We’re excited to introduce this useful feature, and more Kadena Account
Protocols as we bring things like effortless multi-sig to wallets. This is how
we are building the bridge to the future on Kadena!
