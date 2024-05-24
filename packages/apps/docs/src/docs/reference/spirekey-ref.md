---
title: Kadena SpireKey technical specifications
description:
  The `@kadena/kadena-cli` library provides a complete set of commands for creating applications and interacting with the Kadena network interactively or by using scripts from the command-line.
menu: Kadena SpireKey
label: Kadena SpireKey technical specifications
order: 2
layout: full
tags: ['WebAuthN', 'authentication', 'signing', 'transactions']
---

# Kadena SpireKey technical specifications

To enable an application to use Kadena SpireKey, the application must be able to do the following:

- Connect to the SpireKey URL to register a new account or access an existing account.
- Request a signature from a SpireKey account and handle the value returned from the SpireKey URL.

## Connect to Kadena SpireKey

From your application, initiate a `GET` request to the Kadena SpireKey /connect endpoint:
[https://spirekey.kadena.io/connect](https://spirekey.kadena.io/connect). 

The `GET` request expects you to provide the following search parameters:

| Parameter | Type | Description |
| :--------- | :------- | :---------------------------------------------------------------------- |
| returnUrl  | string   | Specifies the application URL that SpireKey should return users to after connecting to register or access a SpireKey account. |
| networkId  | string   | Specifies the network identifier for the transaction to be submitted on. For example, use the network identifier testnet04 for transactions to be submitted on the Kadena test network. |
| chainId    | string   | Specifies the chain identifier for the transaction to be submitted on. |
| reason     | string?  | Specifies the reason you want application users to connect to a SpireKey account. |
| optimistic | boolean? | Determines whether SpireKey returns optimistically to your application before an account is confirmed on the blockchain. You can set this parameter to `false` to disable optimistic mode. |

### Registration and onboarding

After your application redirects users to
[https://spirekey.kadena.io/connect](https://spirekey.kadena.io/connect), they are
prompted to create a passkey if they don't already have a SpireKey account. In most
cases, applications don't need to wait for the account to be created before preparing
transactions. Therefore, by default, SpireKey uses optimistic mode to redirect users back to the application as soon as the transaction to create an account has been submitted.

If you want to require an account to be created before users can interact with your application, you can either make use of the `pendingTxIds` parameter returned in the `user` object or set the `optimistic` parameter to `false`.

### Return value

After connecting to an account in SpireKey, users are redirected to the `returnUrl` you specify for your application. 
As part of the redirection, SpireKey appends a `user` object in the `searchParameters`. This object describes information you can use to address the user or to prepare a transaction.

#### User

| Parameter | Type | Description                                                              |
| :----------- | :----------- | :----------------------------------------------------------------------- |
| alias        | string       | Specifies an alias to use for the account as a display name. |
| accountName  | string       | Specifies the `c:account` a user has connected to the application. |
| pendingTxIds | string[]     | Specifies an array of pending transactions related to account creation or maintenance. |
| credentials  | Credential[] | Specifies the credential for the account. See [Credential](#credential). |

#### Credential

Every SpireKey account can return one or more credentials when connected. The
number of credentials does not have to match the number of credentials available on
the blockchain. The credentials returned are the credentials the user wants to
use to submit transactions in your application. When multiple credentials are returned, you
should prepare the transaction with all credentials signing for the same relevant `capabilities`.

| Parameter | Type   | Description  |
| :-------- | :----- | :---------------------------------------- |
| type      | string | Specifies the credential type. This parameter can specify `WebAuthn` or `ED25519` as the signature scheme. |
| publicKey | string | Specifies the public key for the account returned.  |
| id        | string | Specifies the credential identifier for the account returned. |

## Request a signature

When you prepare a transaction for the user to sign, you use the public keys from the credentials included in the response from the Kadena SpireKey `/connect` endpoint to construct the transaction. 
When your transaction is ready to be signed, you need to `base64` encode the stringified JSON of the transaction.

Transactions can grow in size well beyond what is accepted in
`searchParameters`. To enable users to sign these transactions, you should send
the transaction parameters to the SpireKey endpoint using the anchor hashtag (#) instead of the searchParameter question mark (?). For example, a signature request might look like this:
`https://spirekey.kadena.io/sign#transaction=encodedTx&returnUrl=www.mydapp.com`

| Parameter   | Type   | Description                                              |
| :---------- | :----- | :------------------------------------------------------- |
| transaction | string | Specifies the `base64` encoded JSON stringified transaction object.    |
| returnUrl   | string |  Specifies the URL the user needs to be redirected to after signing. |

Signature requests can include an explanation of what the user is signing for. 
If the explanation is accepted and the user consents by signing the transaction, the signed transaction is returned to the application as a parameter in the return URL following an anchor hashtag (#).

You can then collect or combine additional signatures, as required, to finalize the transaction for execution. 

| Parameter   | Type   | Description                                          |
| :---------- | :----- | :--------------------------------------------------- |
| transaction | string | Specifies the `base64` encoded JSON stringified transaction object. |