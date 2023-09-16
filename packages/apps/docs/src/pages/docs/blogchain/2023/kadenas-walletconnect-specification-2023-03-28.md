---
title: Kadena’s WalletConnect Specification
description:
  We are excited to announce that we have taken the next step in standardizing
  development on Kadena, which will significantly improve the development
  experience for our community of builders and developers. We recently merged
  KIP-17, which defines our standard for interacting with the WalletConnect
  signing API.
menu: Kadena’s WalletConnect Specification
label: Kadena’s WalletConnect Specification
publishDate: 2023-03-28
headerImage: /assets/blog/1_qFkL2D2XFLbmCr3a-MI0_g.webp
tags: [kadena, walletconnect]
author: Jermaine Jong
authorId: jermaine.jong
layout: blog
---

# Kadena’s WalletConnect Specification

We are excited to announce that we have taken the next step in standardizing
development on Kadena, which will significantly improve the development
experience for our community of builders and developers. We recently merged
[KIP-17](https://github.com/kadena-io/KIPs/blob/master/kip-0017.md), which
defines our standard for interacting with the WalletConnect signing API.

Definition of this standard is something that was highly anticipated by our
community, but why do we need WalletConnect in the first place? One of the keys
to adoption from the perspective of both builders and users is ease of use.
Within the Kadena ecosystem, we were faced with the following challenges:

- The Kadena ecosystem does not have a standard protocol for wallets and dApps
  to communicate with each other.

- Kadena’s previous Signing API required the wallet to be able to run an HTTP
  server. This is not feasible for some browser-based and mobile wallets.

### WalletConnect

WalletConnect is the communications protocol for web3 that enables wallets and
apps to securely connect and interact. WalletConnect offers connecting your
wallet and verifying a transaction in a seamless, one-click experience. The
WalletConnect protocol is tried and tested across all devices and it removes the
burden of having to maintain a Kadena-specific implementation. In addition,
Wallets and dApps that are already using the WC protocol will have an easier
time integrating with the Kadena ecosystem.

Kadena’s WalletConnect Specification is built on top of the
[WalletConnect Specification](https://docs.walletconnect.com/2.0/specs/clients/sign).

### How does it work?

There are basically three steps involved for a dApp and wallet to connect over
WalletConnect.

![](/assets/blog/1_mObCLodGMDr1qfRWDGxouw.webp)

1.  **Retrieving the URL:**

This is usually done by scanning a QR code that is provided by the dApp that
wants to initiate the connection.

In cases where scanning isn’t possible, this can also be done by entering the
URL directly in the wallet.

**2. The Pairing Proposal:**

The dApp initiates a pairing with a wallet using WalletConnect as a tunnel. This
is done by sending a Pairing Proposal.

**3. The Settlement:**

The wallet responds with the Settlement. This contains information on which of
the requested items it supports.

### Pairing Proposal

```pact
    // Proposal Request
    {
      // … other properties from the WalletConnect Proposal Request
      "requiredNamespaces": {
        "kadena": {
          "chains": ["kadena:mainnet01", "kadena:testnet04", "kadena:development"],
          "methods": [
            "kadena_getAccounts_v1",
            "kadena_sign_v1",
            "kadena_quicksign_v1"
          ],
          "events": []
        }
      }
    }
```

### Settlement

```pact
    // Settlement Response
    {
      // … other properties from the WalletConnect Settlement Response
      "namespaces": {
        "kadena": {
          "accounts": [
            "kadena:mainnet01:38298612cc2d5e841a232bd08413aa5304f9ef3251575ee182345abc3807dd89",
            "kadena:testnet04:38298612cc2d5e841a232bd08413aa5304f9ef3251575ee182345abc3807dd89",
            "kadena:testnet04:22ddc64851718e9d41d98b0f33d5e328ae5bbbbd97aed9885adac0f2d070ff9c"
          ],
          "methods": [
             "kadena_getAccounts_v1",
             "kadena_sign_v1",
             "kadena_quicksign_v1"
          ],
          "events": []
        }
      }
    }
```

During the settlement process, public keys available in the wallet are returned
so they can be used in the dApp. For some background and rationale on why public
keys are being returned, please head to the
[Accounts vs Public Keys](https://github.com/kadena-io/KIPs/blob/master/kip-0017.md#accounts-vs-public-keys)
section of the KIP.

## Interacting via WalletConnect

WalletConnect methods are ways for dApps to interact with a wallet using
predefined method identifiers and an optional payload. The methods that we have
defined for Kadena are:

- **kadena_getAccounts_v1**: This method returns the Kadena account names and
  contract(s) on the Kadena blockchain.

- **kadena_quicksign_v1**: QuickSign is part of the
  [Kadena Signing API](https://github.com/kadena-io/signing-api) and was defined
  in
  [kip-0015 (QuickSign Signing API v1)](https://github.com/kadena-io/KIPs/blob/master/kip-0015.md).
  This method allows the wallet to show the user multiple transactions that need
  signature approval.

- **kadena_sign_v1**: Sign is part of the
  [Kadena Signing API](https://github.com/kadena-io/signing-api). This method
  allows the wallet to show the user a single transaction that needs signature
  approval.

For details on these methods and signatures please refer to the specification in
[KIP-17](https://github.com/kadena-io/KIPs/blob/master/kip-0017.md).

—

We hope that you are as excited about the KIP-17 merge as we are! A special
thank you to Jacquin Mininger, Doug Beardsley, Albert Groothedde, and the
community for helping finalize KIP 17.

Stay up to date on how Kadena is streamlining and redefining our developer
experience by following all of Kadena’s social channels.
