---
title: KIP-0019 - Future Iteration of the Coin and Fungible Contracts
description:
  If you’re keeping your finger on the pulse of all things Web3 and blockchain,
  you’ve heard all about smart wallets and how they’ve emerged as powerful and
  convenient tools for users. With their ability to seamlessly interact with
  decentralized applications (dApps), smart wallets are revolutionizing the way
  we engage with digital assets. Let’s explore a little deeper!
menu: KIP-0019 - Future Iteration of the Coin and Fungible Contracts
label: KIP-0019 - Future Iteration of the Coin and Fungible Contracts
publishDate: 2023-06-06
headerImage: /assets/blog/1_dDdOhCBy_d7PrAe-xm8E2w.webp
tags: [kadena, formal verification]
author: Robert Soeldner
authorId: robert.soeldner
layout: blog
---

# KIP-0019: Future Iteration of the Coin and Fungible Contracts

We are excited to present KIP-0019
([Kadena Improvement Proposal](https://medium.com/r?url=https%3A%2F%2Fgithub.com%2Fkadena-io%2FKIPs)
0019), the next iteration of the Coin and Fungible contracts with the aim of
enhancing trustworthiness and security. KIP-0019 proposes several modifications
aimed at improving the reliability and robustness of these contracts, ensuring a
more secure platform for the exchange of tokens on Kadena’s Platform. This
article briefly outlines the reasoning behind the removal of the rotate feature
and the necessary property adjustments to ensure successful formal verification
of the coin contract.

The proposed changes of KIP-0019 includes but is not limited to the following:

1.  **Removal of the rotate function**. This preserves cross-chain soundness and
    avoids the potential risk of locking funds. By implementing this change, we
    aim to foster a more secure and resilient environment for cryptocurrency
    transactions.

2.  **Reorganization of constants and functions.** The constants and some
    functions within the contract will be **reorganized to increase
    maintainability**, reducing the chances of errors and improving the overall
    quality of the contract. By streamlining the codebase, we aim to create a
    more efficient and reliable foundation for our users.

3.  **Introduction of modifications to the verification-related code.** This
    will allow for **formal verification**, ensuring the correctness and
    reliability of the contract.

### Changes resulting in fungible-v3.pact:

- Model annotation for the schema `account-details`: Add new invariant
  expressing positive balance (`>= balance 0.0`).

- Model annotation for defun `get-balance`: Add new property that
  `!= account ""` and `>= result 0.0`.

- Model annotation for defun `details`: Add property that the account is not
  empty `!= account ""`.

- Model annotation for defun `enforce-unit`: Add property that the amount is not
  negative `>= amount 0.0`.

- Model annotation for defun `create-account`: Add property that the account is
  not empty `!= account ""`.

### Changes resulting in coin-v6.pact:

- Change the `fungible-v2` interface to `fungible-v3`.

- Bless old coin contract (coin v5).

- Move constants (`COIN_CHARSET`, `MINIMUM_PRECISION`, `MINIMUM_ACCOUNT_LENGTH`,
  `MAXIMUM_ACCOUNT_LENGTH`, and `VALID_CHAIN_IDS`) to a different section.

- Move utility functions (`enforce-unit`, and `validate-account`) to a different
  section.

- Replace `enforce (!= sender ...` by `validate-account` in defun `DEBIT` and
  `CREDIT`.

- Remove defcap `ROTATE`

- Add additional `enforce` to express that gas consumption must be greater than
  zero (`enforce (> total 0.0)`) within defun `redeem-gas`.

- Enforce the refund unit `enforce-unit` refund within defun `redeem-gas`.

- Add `validate-account` to defun `get-balance`.

- Add `validate-account` to defun `details`.

- Within `fund-tx` enforce a valid miner within the `defpact` step.

- Add invariant `>= balance 0.0` for the `allocation-schema`.

As part of our commitment to community involvement and collaboration, we have
utilized the
[Kadena Improvement Proposal](https://medium.com/r?url=https%3A%2F%2Fgithub.com%2Fkadena-io%2FKIPs)
to invite all members of our community to actively** facilitate development
**and** solicit crucial feature requests **for various technologies such as
Chainweb, our proof-of-work blockchain, and Pact, our smart contract language.

To ensure prompt decision-making, we have established a **time limit of
approximately 1.5 months** for the KIP process, which will conclude on **July
15th Anywhere on Earth (AoE)**. We encourage community engagement up to this
deadline to discuss the **future direction of our coin and fungible contracts**.

Here are the details:

> What: Next iteration of the Coin and Fungible contract Seek: Community
> involvement Till: July 15th AoE Where:
> [https://github.com/kadena-io/KIPs/pull/43](https://github.com/kadena-io/KIPs/pull/43)

Your feedback and insights are invaluable in shaping the future direction of
Kadena!
