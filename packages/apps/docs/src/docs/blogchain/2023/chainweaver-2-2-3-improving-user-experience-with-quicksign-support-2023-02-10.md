---
title: Chainweaver 2.2.3 - Improving User Experience with Quicksign Support
description:
  In our latest Chainweaver wallet version 2.2.3, we’re excited to highlight an
  amazing new addition that will take the user experience to the next level
  quicksign support for desktop applications! Based on KIP-0015, the quicksign
  API allows wallets to sign multiple transactions in a single request.
menu: Chainweaver 2.2.3
label: Chainweaver 2.2.3
publishDate: 2023-02-10
headerImage: /assets/blog/1_eQ0aqLVMW21bLxOF1PB8yQ.webp
tags: [chainweaver]
author: Kadena
authorId: kadena
layout: blog
---

# Chainweaver 2.2.3: Improving User Experience with Quicksign Support

In our latest Chainweaver wallet version 2.2.3, we’re excited to highlight an
amazing new addition that will take the user experience to the next level:
**quicksign support for desktop applications!** Based on
[KIP-0015,](https://github.com/kadena-io/KIPs/pull/29/files)the quicksign API
allows wallets to sign multiple transactions in a single request.

This is a huge step towards a better user experience as our multi-chain
architecture is streamlined and simplified for our entire community. For
developers, quicksign support will enable builders to quickly iterate on their
smart contracts and push their applications into production by deploying their
contracts to multiple chains with less effort. For end users, this update will
facilitate a smoother user experience like chain-agnostic transfers, which allow
the end user to simply set the number of coins to be transferred from one chain
to another with just a single signing request as shown in this demo.

[demo](https://twitter.com/BlockchainDoug/status/1539733933801316361)

![Quicksign API works by sending multiple transactions to Kadena’s blockchain simultaneously](/assets/blog/0_AiU-isvNBfs5RpkP.png)

We’ve already begun seeing builders and projects capitalizing on this update and
improving their project’s UX. [**X-Wallet**](https://xwallet.kaddex.com/), a
robust and user-friendly web-extension wallet that is native to Kadena, has
implemented quicksign which allows the execution of multiple transactions
simultaneously with just one signature approval.
[**Koala Wallet**](https://koalawallet.io/) by Kadena Eco Grantee,
[**Eucalyptus Lab**](https://eucalyptuslabs.com/), is also implementing
quicksign and WalletConnect to their wallet as a step towards making Kadena
easier to use and advancing the chainless experience. See
[https://kadena-io.github.io/signing-api/](https://kadena-io.github.io/signing-api/)
for more detailed reference information about the new API!

In addition to the quicksign API, Chainweaver also added feature improvements
and bug fixes for builders such as:

- Adding better gas defaults for transfer/cross-chain operations

- Fixing bugs related to contract deployment simulations with /local

- Fixing slow module search in module explorer

- Modernizing Pact sample-contracts in the contract tab

Kadena’s infinitely scalable multi-chain system is on its way to becoming the
future of chainless UI/UX. We are pushing the boundaries of innovation, one
chain at a time.

**Please join the discussion to further improve our user experience here**:
[https://github.com/kadena-io/KIPs/pull/29/files](https://github.com/kadena-io/KIPs/pull/29/files).

If you want to test out the quicksign API, it is now available in desktop
versions of Chainweaver 2.2.3, you can find more information below:

**Download or use Chainweaver here:**
[Get started with Chainweaver](/invest/wallets/chainweaver).

**Official release:**
[https://github.com/kadena-io/chainweaver/releases/tag/v2.2.3](https://github.com/kadena-io/chainweaver/releases/tag/v2.2.3)
