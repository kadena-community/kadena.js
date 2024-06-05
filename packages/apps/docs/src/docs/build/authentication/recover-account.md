---
title: Recover Kadena SpireKey accounts
description:
  If you're an application developer and have integrated Kadena SpireKey
  accounts and WebAuthn authentication and authorization services into your
  application, you can also implement account recovery using a Kadena SpireKey
  passkey.
menu: Authenticate and authorize
label: Recover accounts
order: 2
layout: full
---

# Recover a Kadena Spirekey account

After you register a device for a Kadena SpireKey account, the account details are stored on the Kadena blockchain and in the `Local storage` of the browser you used to register the account. 
You can view this information using the Developer Tools for the browser by selecting **Application**, then expanding **Storage**. 

If you clear local storage—for example, by selecting **Clear browsing data**—or try to use a different browser to access your Kadena SpireKey account, [Kadena SpireKey](https://spirekey.kadena.io) won't be able to identify the account that belongs to you or recognize you as a registered user. However, you can recover your account information through the passkey stored on any device you created your account with or added to your account. 
For example, if you used a smart phone to register a Kadena SpireKey account, you can use the passkey stored on that phone to recover your account information.

## Identify the passkey for an account

When you register an account as described in [Register an account](/build/authentication/register), Kadena SpireKey creates a passkey for the device you are using with the default name **SpireKey Account 1** and a selected **Network**. 
For example, if you access Kadena SpireKey deployed on the Kadena test network, the passkey created for the device and account combination would be SpireKey Account 1 (Testnet).

If you used a laptop to register this account, your passkey might be based on a
fingerprint stored in a secure enclave on the device or recorded on a security
key you attached to the device. If you used a phone and scanned a QR code to
register this account, your passkey might be based on facial recognition stored
in a secure enclave on the phone.

## Clear local storage

For demonstration purposes, assume that you registered for a Kadena SpireKey
account from a browser running on your local computer. If that's the case, you
can open [spirekey.kadena.io](https://spirekey.kadena.io) in the browser and see
that your account information is displayed by default from the information in
local storage.

To clear local storage:

1. Open [Kadena SpireKey](https://spirekey.kadena.io).
2. Open the Developer Tools.
3. Open the Console and type the following command:

   ```javascript
   localStorage.setItem('localAccounts', '[]');
   ```

4. Refresh the browser window to display the welcome page with the Recover and
   Register options.

## Recover your account from a passkey

To recover account information:

1. Click **Recover** or open
   [spirekey.kadena.io/recover](https://spirekey.kadena.io/recover).
2. Click in the Passkey fingerprint section.
3. Select the passkey for the account you want to recover.

   In this example, the passkey was created on the local computer and is named
   Lola (Testnet). Selecting the Lola (Testnet) passkey then prompts for a
   fingerprint.

   If you created the account using a passkey on your phone and want to recover
   the account from the browser running on a local computer, you can select a
   passkey using **On other devices**. You can then scan the QR code to select
   the passkey on the phone and authenticate using facial recognition.

4. Verify your account details in the account overview.

## How it works

The `webauthn-guard` module of the Kadena SpireKey smart contract emits a
`REGISTER_DEVICE` event containing an account name and the credential identifier
of a passkey every time that there's a successful transaction that calls either
the `register` function or the `add-device` function.

The Kadena SpireKey wallet can query the chainweb-data API for the
`REGISTER_DEVICE` events that contain the credential identifier matching the
passkey you select for account recovery. If Kadena SpireKey finds a matching
event, it retrieves the account name. Kadena SpireKey then calls the
`get-webauthn-guard` function of the `webauthn-wallet` module using the account
name as an argument to retrieve the account details from the blockchain.
