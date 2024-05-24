---
title: Integrate decentralized applications
description:
  If you're an application developer, you can leverage Kadena SpireKey accounts and WebAuthN authentication and authorization services by connecting to Kadena SpireKey endpoints from your application.
menu: Authenticate accounts
label: Integrate decentralized apps
order: 2
layout: full
---

# Integrate applications with Kadena SpireKey

To work with Kadena SpireKey, an application must be able to connect to the Kadena SpireKey URL and pass some information back and forth.
Kadena SpireKey handles the account registration and authentication based on the information your application provides when it connects to the SpireKey URL.

You can view the interaction between an application and Kadena SpireKey as a simple two-way conversation.
You initiate the conversation from your application by connecting to the Kadena SpireKey URL to request account information.
Kadena SpireKey determines if the account exists or needs to be registered and either creates or accesses the account information.
Kadena SpireKey returns information about the account to your application.

Your application parses the information to provide services to the user and to prepare a transaction and bundle it into signing request.
Your application then connects to the Kadena SpireKey URL to request the account signatures required to complete the transaction.
If the user approves and successfully signs the transaction, Kadena SpireKey returns the signature to your application.
The application constructs the transaction with the proper signatures and submits the transaction for processing on the blockchain.

In summary, the application is responsible for:

- Connecting to the Kadena SpireKey URL to get account information.
- Preparing transactions and requesting signatures from Kadena SpireKey.
- Constructing transactions that use signatures from Kadena SpireKey.
- Submitting signed transactions for execution.

## Connect to Kadena SpireKey

You can connect to Kadena SpireKey and request account information from an application by send a `GET` request to the Kadena SpireKey `/connect` endpoint and specifying a return URL with appropriate parameters to return the user to your application.

The following example illustrates an application running locally on
`http://localhost:3000` that's deployed on the `testnet04` network:

https://spirekey.kadena.io/connect?returnUrl=http://localhost:3000&networkId=testnet04

As you see in this example, the `returnUrl` is a URL-encoded **query parameter** that Kadena SpireKey uses to redirect users after they connect. 
When users are redirected to the `/connect` endpoint, Kadena SpireKey checks whether they have an account. 
Users who don't have an account are automatically redirected to the `/register` endpoint to register a passkey. 
After registering a passkey for the account, users are automatically returned to your application by default.

## Specify the network and chain

In many cases, applications are only deployed on a specific network and chain. 
For example, your application might only allow transactions on the Kadena
You can specify the `networkId` and `chainId` parameters to only connect to accounts in the specified network and chain.


In many cases, applications are only deployed on a specific chain in the network.
For example, your application might only allow transactions on chain 7 of the
Kadena test network. 
The chain you use for your applications might be different from the chain that Kadena SpireKey creates accounts on by default. 
If users attempt to connect an account that exists on a different chain than the one your application runs on, they won't be able to sign and complete transactions in your application.

To prevent this type of transaction failure, you can specify the `chainId` as a query parameter when connecting to the Kadena SpireKey URL. 
The `chainId` parameter limits the accounts that users can select from to accounts created on the specified chain. 
In the following example URL, the `chainId` parameter is set to `7`. 

https://spirekey.kadena.io/connect?returnUrl=http://localhost:3000&networkId=testnet04&chainId=7

You can change the value to any of the twenty available chains on the Kadena network, as needed. Note that the chains are zero-indexed, so the first chain is 0 and the last one is 19.

## Specify a reason 

In addition to the application URL, the network identifier, and the chain identifier, you can
customize the reason that your application asks users to connect to their Kadena
SpireKey account.

To display more detailed information about why your application requires account
information from the user, add the `reason` query parameter to the Kadena
SpireKey URL. You must use URL encoding to specify the value for this
parameter. For example:

https://spirekey.kadena.io/connect?returnUrl=http://localhost:3000&networkId=development&reason=Before%20you%20complete%20this%20purchase,%20select%20an%20account.

## Optimistic account onboarding

Depending on the network and other factors that affect network activity—such as
the number of requests and available nodes—confirming that an account has been created on the blockchain can take some time.
Because most applications don't need accounts to be created onchain before preparing transaction, Kadena SpireKey supports **optimistic** onboarding by default.

Withn optimistic onboarding, users are immediately redirected back to your application without waiting for the account creation transaction to be confirmed on the blockchain.
In most cases, creating user accounts in a background process is safe. 
However, you must ensure that your application only submits signed transactions after all signer accounts exist on the blockchain.

If you want to prevent **optimistic** onboarding, you can set the `optimistic` parameter to `false` when connecting to the Kadena SpireKey URL.

## Use Kadena SpireKey account information

After creating or selecting a Kadena SpireKey account, users are redirected to
your application with their public account details appended as a base64-encoded
`user` object. You can parse the decoded parameter value as a JSON
object. The resulting `user` object consists of key and value pairs similar to
the following set of properties:

{ "accountName": "c:68foI6nNAYN_a6Nu_CNEGiKyVDJlGxKC0dOZLBq6ZeW", "alias":
"Alice", "credentials": [ { "id": "d2eYT3zAklMgZZJNjQ3zJxZ6kuT4tkd_ndePIEWK3Nd",
"publicKey":
"WEBAUTHN-a50102032620012158209a4e83b6d734880b926c0e74bce8e449ac03f0998cb224999d5039651c24534d225820f2804f3c424918786a978c56956628dc93d0d32182973db187084579503cea3c",
"type": "WebAuthn" } ], "pendingTxIds":
["gzlhITOU8hMaOXHKcSJgxLl0Ir8j2crUnFh20cGcxsR"] }

### User object properties

As illustrated in the previous example, after decoding and parsing the account
details, you should see the following properties:

| Property | Description |
| ------------- | ------------------------- |
| alias         | Specifies an alias to use as the display name for the account. |
| accountName   | Specifies the full public name of the account on the blockchain. It is a string consisting of a `c:` prefix followed by a hash. |
| credentials   | Contains an array of credential objects. For Kadena SpireKey accounts, there is always at least one credential in the array. The `publicKey` in the `credential` property holds the public key of the user's WebAuthn credential. The private key is never included in the `user` object. The private key is encrypted and stored in a security enclave on the user's device. |
| pendingTxIds  | Specifies the transaction identifier for users who registered to create a new account from your application. You can use the chainweb-data API to poll the status of this transaction to ensure that you don't create transactions for the user to sign before the account is confirmed on the blockchain. If the `pendingTxIds` property is empty, the account creation transaction completed before the user returned to your application. |

### Poll for pending account creation

If you use the optimistic flow for onboarding users, you can use the
chainweb-data API to poll the status of pending transaction using the identifier
from the `pendingTxIds` property. For example, if the `pendingTxIds` property in
the `user` object is `gzlhITOU8hMaOXHKcSJgxLl0Ir8j2crUnFh20cGcxsR`, the
chainweb-data API request would look like this:

https://estats.testnet.chainweb.com/txs/tx?requestkey=gzlhITOU8hMaOXHKcSJgxLl0Ir8j2crUnFh20cGcxsR

You should note that there are scenarios where the `pendingTxIds` property might
contain transaction identifiers that aren't related to account creation, but
these are beyond the scope of this guide.

## Register for an account workflow

If you add the `/connect` endpoint for Kadena SpireKey to your application, Kadena SpireKey handles the workflow for adding credentials and connecting to Kadena SpireKey accounts for your users. 
The following diagram illustrates the basic workflow for registering an account
using Kadena SpireKey.

![Kadena SpireKey registration workflow](/assets/docs/register-spirekey-account.png)
