---
title: Authenticate and sign with Kadena SpireKey
description:
  Provide authentication and authorization services by implementing Kadena
  SpireKey in your decentralized application.
menu: Authenticate accounts
label: Authentication overview
order: 2
layout: full
---

# Authentication overview

Kadena SpireKey leverages the OAuth protocol and the Web Authentication (WebAuthn) API to provide a secure backend that simplifies the end user experience. 
With Kadena SpireKey, users can connect to a wallet and sign transactions using methods that feel familiar to them. 
For example, an application might present a QR code for them to scan to approve a transaction or send a link to a device that enables them to authenticate using facial recognition or a fingerprint.

## Simplify authentication and signing

By integrating Kadena SpireKey with your applications, you can allow your users to authenticate and sign transactions without using passwords or managing public and secret keys.
Instead, they can use any method that supports passkeys, including Apple ID, Google Accounts, or hardware security keys.

If you're building decentralized applications, implementing Kadena SpireKey can
help bring down the barriers to adoption by providing a more secure
authentication and authorization process with fewer steps and a more familiar
flow.

By making transactions easier and more secure, Kadena SpireKey can improve how
people interact with digital services and make Web3 more accessible and
practical for everyday use.

## How Kadena SpireKey works

Before you add Kadena SpireKey authentication and authorization services to your
applications you should be familiar with the basics of how it works and the
underlying technology that it relies on.

At its core, Kadena SpireKey is inspired by the [OAuth](https://oauth.net/2/)
protocol. The OAuth protocol is an open industry standard for designing
authentication and authorization work flows. The OAuth standard is what enables
users to authenticate using identity providers like Google, Facebook, GitHub,
and others.

If you're familiar with the OAuth 2.0 protocol, you know that it defines four
roles:

- The **resource owner** is responsible for granting access to a requested
  resource.
- The **resource server** is responsible for accepting and responding to
  resource requests using **access tokens**.
- The **client** is any application making a resource requests on behalf of the
  resource owner and with its authorization.
- The **authorization server** is responsible for issuing access tokens to the
  client after authenticating the resource owner and obtaining authorization.

The following diagram provides a simplified overview of the workflow between
these roles.

![OAuth roles and workflow](/assets/docs/oauth-diagram.png)

The workflow for Kadena SpireKey is similar. In Kadena SpireKey, your decentralized application is the client application hosted on the resource server, for example, on the Kadena public network. 
To work with your application, users register on the network using Kadena SpireKey. 
Kadena SpireKey uses WebAuthn to grant access tokens. 
After users are authenticated by WebAuthn, your application can use the account information to construct transactions. 
The transactions passed back to users are signed by Kadena SpireKey using whatever method you choose to implement in your application.
