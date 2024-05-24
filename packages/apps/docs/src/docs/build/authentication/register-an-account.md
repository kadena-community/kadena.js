---
title: Register a Kadena SpireKey account
description:
  Whether you're a user or developer, creating a Kadena SpireKey account is the
  first step to using simplified WebAuthn authentication and authorization
  services.
menu: Authenticate accounts
label: Register an account
order: 2
layout: full
---

# Register an account with Kadena SpireKey

Whether you're a user or developer, creating a Kadena SpireKey account is the
first step to using simplified WebAuthn authentication and authorization
services. Registering for an account stores the account information you provide
on the blockchain after registration is complete. Your secret information is
encrypted and stored on the device you use to register. 

No secret information is stored on the blockchain or in Kadena SpireKey.

To register for a new Kadena SpireKey account:

1. Open [Kadena SpireKey](https://spirekey.kadena.io) in a web browser on your
   phone, tablet, or desktop.
2. Click **Register** to start entering your account information.
3. Type an **Alias** to use for your account, then click **Next**.

   The alias is typically a short and distinguishable name that helps you
   recognize your account in Kadena SpireKey and to distinguish
   between accounts if you add more than one account.

   The **Alias** you specify is only stored in the browser on the device you use
   to register and cannot been seen by anyone else. If you don't want to create
   an account, click **Cancel** to exit the registration flow.

4. Click in the **Passkey** field to generate a public and secret key pair.
   
   The secret key is encrypted and stored on the device you're using to register an account.

   The encrypted **passkey** is a WebAuthn credential that's protected with
   biometric data—such as a fingerprint or facial recognition—or a security key
   depending on the options available on the device you're using to register.
   Only the public key and credential identifier associated with the private
   passkey are stored on the blockchain after completing the account
   registration. No sensitive information is transferred to or stored on the
   Kadena blockchain or visible to the public.

## Complete registration

After you create a **passkey**, Kadena SpireKey displays your Accounts page with a
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

If you're an application developer, you can integrate the account services from Kadena SpireKey
in decentralized applications.
For an overview of the workflow, see [Integrate decentralized apps](/build/authentication/integrate).
For technical details, see [Kadena SpireKey technical specifications](/reference/spirekey).