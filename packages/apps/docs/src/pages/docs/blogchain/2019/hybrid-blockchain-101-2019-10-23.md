---
title: Hybrid Blockchain 101
description: What a public-private hybrid blockchain makes possible.
menu: Hybrid Blockchain 101
label: Hybrid Blockchain 101
publishDate: 2019-10-23
headerImage: /assets/blog/1_cXMen2j6k5hcvXVgyEqqzw.webp
tags: [kadena]
author: Miguel Angel Romero Jr.
authorId: miguel.angel
layout: blog
---

# Hybrid Blockchain 101

### What a public-private hybrid blockchain makes possible.

Blockchain terminology evolves as fast as the technology, which can get
confusing for people learning about the subject. At Kadena, we aim to clearly
describe our technology, which evolved from our team’s enterprise blockchain
experience at JPMorgan. Kadena’s blockchain captures what we believe represents
the future of how people will share, transfer and unlock value. A term we’ve
found useful to describe our blockchain platform is “hybrid.”

**What does it mean to have a hybrid blockchain?**

Think of a street with many stores. Like these stores, a public blockchain is
accessible to everyone to browse and explore. Like the back offices of these
stores, a permissioned blockchain is restricted to owners and authorized people
and holds private internal records. You need both to have a functioning
marketplace.

For Kadena, a **hybrid blockchain** means _a public and permissioned blockchain
that can interact seamlessly to make a more secure digital marketplace_ — and
pave the way for a different type of shared economy. Our public and permissioned
blockchains interoperate by utilizing the same, easy-to-use smart contract
language, [Pact](https://pactlang.org/).

## Public and Permissioned Blockchain: Tradeoffs Without Hybrid

To further understand what hybrid blockchain offers, let’s first consider the
benefits and drawbacks of public and permissioned blockchains when they work
alone:

A **public blockchain**, like Bitcoin or Ethereum, is a “permissionless,”
globally distributed and cryptographically secure ledger, to which anyone with a
personal computer can read, write and contribute. Public blockchains have
created significant value in the form of cryptocurrencies, tokens and smart
contracts.

Benefits of public blockchain include:

- Decentralization — the more honest people participate, the more secure the
  network becomes (proven by Bitcoin’s Proof of Work system).

- Resistance to censorship — anyone can participate because no central authority
  (i.e. bank, company, or government) acts as a gatekeeper.

- Cryptocurrency and tokens — the first secure and permissionless digital
  representations of value.

But there are drawbacks to current public blockchains for certain use cases,
including:

- Permanence by design — the secure, immutable nature of public blockchain can
  run contrary to privacy principles such as the “right to be forgotten” in the
  EU’s General Data Protection Regulation (GDPR).

- Slow speeds — the average public blockchain runs 8–10 transactions per second,
  a fraction of what we need for large scale financial transactions.

- Complex & unsafe apps on smart contract platforms like Ethereum — see the
  [Parity multi-sig bug](https://cointelegraph.com/news/parity-multisig-wallet-hacked-or-how-come)
  and
  [the DAO hack](https://www.coindesk.com/understanding-dao-hack-journalists).

On the other hand, a **permissioned blockchain**, also known as “enterprise” or
“private” blockchain, is similar to a series of replicated databases. However,
this class of blockchain can have owners selectively share information with
trusted participants. Permissioned blockchains have some benefits over public
blockchains including:

- Faster settlement mechanisms with different consensus protocols.

- More controlled membership — participants get to choose who engages with the
  network.

- Privacy — with proper governance, you can control how sensitive data gets
  shared.

Permissioned blockchains also have their own problems, namely:

- [Some of them aren’t even real blockchains](https://thenextweb.com/podium/2019/05/05/ibms-hyperledger-isnt-a-real-blockchain-heres-why).

- Closed-source code — many permissioned blockchains can be more complicated and
  less secure than their public blockchain counterparts.

- They lack cryptographically secure, public tokenized assets.

## Hybrid Blockchain: Why Both Is Better

A hybrid blockchain takes the best of public and permissioned blockchain and
allows participants to seamlessly leverage decentralization while also gaining
management of sensitive personal data and improved performance. With hybrid
blockchain, the benefits include the liquidity and market access of public
blockchain alongside the privacy and security benefits of permissioned
blockchain. Below, we’ll cover a wide range of examples of what hybrid can
empower, from the end consumer experience to the enterprise providing new
services.

### Hybrid Example 1: I want to share my medical data easily with my doctor and health insurance company, but also want to ensure personal privacy and security.

Laws such as
[HIPAA](https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html)
in the United States recognize the importance of privacy when it comes to
personal data like medical records. Hybrid blockchain allows for siloing
Protected Health Information in a secure, HIPAA-compliant database and passing
along an encrypted identifier to a private blockchain that is run between
healthcare insurers, doctors and hospitals*. *Then, public blockchain accounts
can get linked to the private network. Other medical companies can interact with
the data through a public smart contract, giving greater visibility and control
over who accesses sensitive information.

### Hybrid Example 2: I want to use private payment systems on public networks.

Companies like JP Morgan are already creating their own private tokens. However,
the value of JPMCoin can only be redeemed/settled within the company, like a
Starbucks point or an airline mile. For digital currencies to have greater
value, they need to connect to a public blockchain. Hybrid blockchain makes the
interoperability possible. Using hybrid blockchain, consumers can unlock greater
liquidity so their money doesn’t have to stay trapped, like on a corporate gift
card.

### Hybrid Example 3: I run a company that wants to monetize our excess capacity and share our services with others.

We’ve called this concept the
[smart contract sharing economy](/docs/blogchain/2018/blockchain-future-smart-contract-sharing-economy-2018-12-17).
It allows individuals and small businesses to gain access to services that are
normally too costly for them to perform on their own. One example involves
fashion startup Rent the Runway (RTR), which has the largest dry cleaning
facility in North America in order to service all their rentable formalwear. RTR
already has an economy of scale when it comes to dry cleaning. With a hybrid
tokenized contract API on the blockchain, RTR could offer up their excess dry
cleaning capacity to a small or medium-sized business at an affordable rate
through selling a token that represents a full door-to-door dry cleaning
lifecycle. Hybrid smart contract APIs have the potential to be much more
specialized, accessible and affordable than current APIs and database services.

## Introducing: Kadena’s Hybrid Blockchain Stack

Kadena’s goal with hybrid blockchain is to empower entrepreneurs and enterprises
to _build better blockchain apps_, ones that can scale with growing success and
that people can trust for keeping their money & data safe.

1.  **[Kadena Scalable Permissioned Blockchain](./scalablebft-kadenas-private-blockchain-101-2019-03-09)
    —** Enterprise-ready permissioned blockchain. Community Edition available on
    [AWS](http://kadena.io/aws) and [Azure](http://kadena.io/azure) for free.

2.  **[Kadena Public Blockchain](./all-about-chainweb-101-and-faqs-2019-02-01)
    —** Scalable Proof of Work public blockchain. Currently in testnet for a
    planned launch in Winter 2019.

3.  **[Pact](./safer-smarter-contracts-with-pact-2019-02-20)** — Simple and safe
    smart contract language (open source). Easy to learn with industry-leading
    security features like user code
    [Formal Verification](/docs/blogchain/2018/pact-formal-verification-for-blockchain-smart-contracts-done-right-2018-05-11).
    Pact facilitates interoperability between Kadena’s permissioned and public
    blockchain.

### What can you do with Kadena today?

- Spin up our Chainweb testnet [binary](http://kadena.io/testnetbinary) and
  check out our new [public dashboard](http://kadena.io/dashboard)!

- Follow us on [Medium](http://medium.com/kadena-io) and
  [Twitter](http://twitter.com/kadena_io) for announcements and updates about
  our upcoming public blockchain mainnet launch.

- Go through a [Pact Beginner Tutorial](http://pactlang.org/), or try
  [Pact in your browser](http://pact.kadena.io/).

- Test our scalable permissioned blockchain deployment on
  [AWS](http://kadena.io/aws) or [Azure](http://kadena.io/azure).

- Join Kadena’s [Community Discord](http://discord.io/kadena) to chat with our
  team.
