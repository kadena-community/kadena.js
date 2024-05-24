---
title: Register a Kadena SpireKey account
description:
  Whether you're a user or developer, creating a Kadena SpireKey account is the
  first step to using simplified WebAuthN authentication and authorization
  services.
menu: Authenticate accounts
label: Register an account
order: 2
layout: full
---

# Register a device to create a new Kadena SpireKey account

Whether you're a user or developer, creating a Kadena SpireKey account is the
first step to using simplified WebAuthN authentication and authorization
services. Registering for an account stores the account information you provide
on the blockchain after registration is complete. Secret information is
encrypted and stored with the authentication method of the device you use to
register. Secret information is not stored on the blockchain with your account
information.

To register for a new Kadena SpireKey account:

1. Open [Kadena SpireKey](https://spirekey.kadena.io) in a web browser on your
   phone, tablet, or desktop.
2. Click **Register** to start entering your account information.
3. If you don't want to create
   an account, click **Cancel** to exit the registration flow.

4. Create a private **Passkey** to be stored in encrypted form on the device you
   are using to register an account.

   The encrypted **Passkey** is a WebAuthN credential that's protected with
   biometric data—such as a fingerprint or facial recognition—or a security key
   depending on the options available on the device you're using to register.
   Only the public key and credential identifier associated with the private
   passkey are stored on the blockchain after completing the account
   registration. No sensitive information is transferred to or stored on the
   Kadena blockchain or visible to the public.

## Complete registration

After you create a **Passkey**, Kadena SpireKey displays your Accounts page with a
card representing your account information. While the registration transaction
is processed, the account name—a string with the c: prefix—is presented in an
animated state. After the registration transaction is successfully mined into a
block, the animation stops to indicate that you have a fully functional Kadena
SpireKey account guarded by a WebAuthn credential. You can use this account to
connect to any applications that integrate with Kadena SpireKey and use your
WebAuthn credential to sign transactions initiated by those applications.

The card representing your account information only displays the beginning and
end of the c: account name. You can click Copy to the right of the account name
to copy and paste the full account name whenever needed.

From the Accounts page, you can also view, send, or request transfers.

## Select a network

The Kadena SpireKey wallet is currently configured to create all new accounts on
the Kadena test network (Testnet). The network information is always displayed
on the account preview card, so you know the network you are creating an account
on. In the future, you'll be able to select a specific network when registering
an account.

If you are doing application or wallet development, you can override the preset
network configuration for development purposes.

To override the network configuration:

1. Open [Kadena SpireKey](https://spirekey.kadena.io) in a new Incognito or
   Private browser window.
2. Open the Developer Tools.
3. Open the Console and type the following command:

   ```javascript
   localStorage.setItem('devMode', true);
   ```

4. Refresh the browser, then click **Register** to complete the registration
   with the option to select the development network as the second step.

## Integrate with Kadena SpireKey

As an application developer, there are three basic integration points between a
decentralized application and Kadena SpireKey. To integrate with Kadena
SpireKey, your application needs to enable users to perform the following steps:

- Register an account on Kadena SpireKey by authenticating in Kadena SpireKey
  using a Web Authentication (WebAuthn) method.
- Log in using a Kadena SpireKey account.
- Sign transactions created by the application using a Kadena SpireKey account.

### Register or sign in using a Kadena SpireKey account

You can enable users to register or sign in with a Kadena SpireKey account from
your application by creating a link to the `/connect` endpoint for the Kadena
SpireKey wallet and specifying a return URL with appropriate parameters to
return the user to your application.

The following example illustrates an application running locally on
`http://localhost:3000` that's deployed on the `testnet04` network:

https://spirekey.kadena.io/connect?returnUrl=http://localhost:3000&networkId=testnet04

As you see in this example, the `returnUrl` is a URL-encoded **query parameter**
that the Kadena SpireKey wallet uses to redirect users after they connect. When
users are redirecting to the `/connect` endpoint, the Kadena SpireKey wallet
checks whether they have a Kadena SpireKey account. Users who don't have a
Kadena SpireKey account are automatically redirected to the `/register` endpoint
so they can follow the steps to register an account. After completing the
registration, they are redirected back to your application with the
newly-created account selected. If users have one or more Kadena SpireKey
accounts, they can select the account they want to use then return directly to
your application.

### Specify the network in the query parameter

In many cases, applications are only deployed on a specific network. For
example, your application might only allow transactions on the development,
test, or main Kadena network. If users attempt to connect and complete
transactions in an application running on Testnet with an account they created
on the development network, the transaction will fail.

To prevent this type of transaction failure, you can specify the `networkId` as
a query parameter for connecting to the Kadena SpireKey wallet URL. The
networkId limits the accounts that users can select from to accounts created on
the specified network. In the example URL above, the value of this query
parameter is set to `testnet04`. You can change the value to `mainnet01` or
`development`, as needed.

### Specify the chain in the query parameter

In many cases, applications are only deployed on a specific chain in the network.
For example, your application might only allow transactions on chain 7 of the
Kadena test network. This chain may be different from the default chain that
Kadena SpireKey creates accounts on by default. If users attempt to connect an
account that exists on a different chain than the one your application runs on
they will not be able to and complete transactions in your application.

To prevent this type of transaction failure, you can specify the `chainId` as
a query parameter for connecting to the Kadena SpireKey wallet URL. The
chainId limits the accounts that users can select from to accounts created on
the specified chain. In the example URL below, the value of this query
parameter is set to `7`. You can change the value to any of the twenty available
chains on the Kadena network, as needed.

https://spirekey.kadena.io/connect?returnUrl=http://localhost:3000&networkId=testnet04&chainId=7

### Specify a reason as a query parameter

In addition to your application URL and the network identifier, you can
customize the reason that your application asks users to connect to their Kadena
SpireKey account.

To display more detailed information about why your application requires account
information from the user, add the `reason` query parameter to the Kadena
SpireKey wallet URL. You must use URL encoding to specify the value for this
parameter. For example:

https://spirekey.kadena.io/connect?returnUrl=http://localhost:3000&networkId=development&reason=Before%20you%20complete%20this%20purchase,%20select%20an%20account.

### Allow optimistic account onboarding

Depending on the network and other factors that affect network activity—such as
th number of requests and available nodes—confirming that the account creation
transaction has completed can take some time.

You can optimize onboarding of users to your application for speed by allowing
users to connect their account to your application before the account creation
transaction is confirmed on the blockchain. If you wan to allow this
**optimistic** onboarding, you can adding the `optimistic=true` query parameter
to the Kadena SpireKey wallet URL.

With the `optimistic=true` query parameter, the Kadena SpireKey wallet URL would
look like this:

https://spirekey.kadena.io/connect?returnUrl=http://localhost:3000&networkId=development&reason=Your%20reason&optimistic=true

If you don't include this parameter, users without an account must wait until
their account is successfully created on the blockchain before they can return
to your application. In most cases, you can configure applications to prepare
transactions for the user before account creation is complete, so allowing an
optimistic flow—where the account is created in a background process—is
reasonably safe. However, you must ensure that your application only submits a
signed transaction after all signer accounts exist on blockchain.

| Optimistic flow                                                       | Non-optimistic flow                                                                                               |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Redirects the user back to the application immediately after signing. | Redirects the user back to the application after the account creation transaction is confirmed on the blockchain. |
| Your application monitors the pending account creation transaction.   | Kadena SpireKey monitors the account creation transaction.                                                        |

If you use the `optimistic=true` query parameter, the `requestKeys` are
URL-encoded and appended to the URL for your application. For example, the URL
in the previous example redirects the user to the following URL after connecting
to the account in the Kadena SpireKey wallet:

https://localhost:3000?user=eyJhY2NvdW50TmFtZSI6ImM6NjhmbyI2bk5BWV9hNk51X0NORUdpS3lWREpseUd4S0MwZE9aTEJxNlp1IiwiYWxpYXMiOiJBbGljZSIsImNyZWRlbnRpYWxzIjpbeyJpZCI6ImQyZVlUM3pBa2xNZ1paSk5qUTN6SnhaNmt1VDR0a2RfbmRlUElFV0szTmQiLCJwdWJsaWNQb2ludCI6IldFQkFVVEhOLWE1MDEwMjMyNjIwMDEyMTU4MjA5YTRlODNiNmQ3MzQ4ODBiOTI2YzBlNzRiY2U4ZTg0OWFjMDNmMDk5OGNiMjI0OTk5ZDUwMzk2NTFjMjQ1MzQxZDIyNTgyMDYwZjI4MDRmM2M0MjQ5MTg3ODZhOTc4YzU2OTU2MjhkYzkzZDQzMjE4MjkyNzNkYjE4NzA4NDU3OTUwM2NlYTNhM2MifV19XQ==&pendingTxIds=%5B%22Z3psaElUT1U4aE1hT1hIS2NTSkd4TGwwSXJoMmNyVW5GaDIwY0djOHhzUg%3D%3D%22%5D

You can get the array of pending transactions by decoding the `pendingTxIds`
query parameter. In this example, there is a pending transaction with the
requestKey `Z3psaElUT1U4aE1hT1hIS2NTSkd4TGwwSXJoMmNyVW5GaDIwY0djOHhzUg==`.

## Use Kadena SpireKey account information

After creating or selecting a Kadena SpireKey account, users are redirected to
your application with their public account details appended as a base64-encoded
`user` query parameter. You can parse the decoded parameter value as a JSON
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

| This property | Contains this information                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| alias         | A private description of the account.                                                                                                                                                                                                                                                                                                                                                                                                               |
| accountName   | The full public name of the account on the blockchain. It is a string consisting of a `c:` prefix followed by a hash.                                                                                                                                                                                                                                                                                                                               |
| credentials   | An array of credential objects. For Kadena SpireKey WebAuthn accounts, there is always only one credential in the array. The `publicKey` in the `credential` property holds the public key of the user's WebAuthn credential. The private key is never included in the `user` object. The private key is encrypted and stored in a security enclave on the user's device.                                                                           |
| pendingTxIds  | The account creation transaction identifier for users who registered to create a new account from your application. You can use the chainweb-data API to poll the status of this transaction to ensure that you don't create transactions for the user to sign before the account is confirmed on the blockchain. If the `pendingTxIds` property is empty, the account creation transaction completed before the user returned to your application. |

### Poll for pending account creation

If you use the optimistic flow for onboarding users, you can use the
chainweb-data API to poll the status of pending transaction using the identifier
from the `pendingTxIds` property. For example, if the `pendingTxIds` property in
the `user` object is `gzlhITOU8hMaOXHKcSJgxLl0Ir8j2crUnFh20cGcxsR`,the
chainweb-data API request would look like this:

https://estats.testnet.chainweb.com/txs/tx?requestkey=gzlhITOU8hMaOXHKcSJgxLl0Ir8j2crUnFh20cGcxsR

You should note that there are scenarios where the `pendingTxIds` property might
contain transaction identifiers that aren't related to account creation, but
these are beyond the scope of this guide.

## Register for an account workflow

If you add the `/connect` endpoint for the Kadena SpireKey wallet to your
application, Kadena SpireKey handles the workflow for adding WebAuthn
credentials and connecting to Kadena SpireKey accounts for your users. The
following diagram illustrates the basic workflow for registering an account
using Kadena SpireKey.

![Kadena SpireKey registration workflow](/assets/docs/register-spirekey-account.png)
