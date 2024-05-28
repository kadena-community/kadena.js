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

## Implement account recovery

If you are developing a decentralized application to work with Kadena SpireKey
or developing your own wallet application for the Kadena network, you can also
implement account recovery in your application.

### Before you begin

Before you attempt to implement account recovery as described in this guide, you
should verify the following basic requirements:

- You have an internet connection and a web browser installed on your local
  computer.

- You have a code editor, access to an interactive terminal shell, and are
  generally familiar with using command-line programs.

- You are developing an application for WebAuthn authentication using TypeScript
  to run on the Kadena test network (Testnet).

### Select a passkey

As demonstrated in
[Recover your account from a passkey](#recover-your-account-from-a-passkey),
account recovery requires users to select a passkey on a device that is
associated with their account.

To prompt users to select a passkey in your application, you can use the
`startAuthentication` method from the `@simplewebauthn/browser` package then set
your wallet domain as the value of the `rpId` variable.

The following example uses `window.location.hostname` to set the wallet domain.
You can specify the wallet domain in other ways. However, you should note the
following requirements:

- The `rpId` value must match the host name or the domain the application is
  running on.
- If the host is not `localhost`, the host must be secured with the secure HTTP
  (`https`) protocol.

If you don't satisfy these two requirements, the request will fail.

In addition, you must set a value for the `challenge` field. The field is
required, but the value doesn't matter because `startAuthentication` is only
used to retrieve the credential identifier of a device associated with the
account being recovered.

```typescript
import { startAuthentication } from '@simplewebauthn/browser';

const domain = window.location.hostname;

const getCredentialId = async (): string => {
  const authResult = await startAuthentication({
    challenge: 'doesnotreallymatter',
    rpId: domain,
  });
  return authResult.id;
};

const recoverAccount = async () => {
  const credentialId = await getCredentialId();
};

recoverAccount();
```

### Find the registration event

After you prompt the user to select a passkey from a device, you can use the
credential identifier retrieved to find the event that was emitted when the
user's device was added to an account. You can find the event by calling the
chainweb-data API endpoint `/txs/events` with the following query parameters.

| Parameter | Description |
| :-------- | :---------- |
| param | Specifies the credential identifier for the passkey selected by the user. |
| name | Specifies the name of the event. In this case, the REGISTER_DEVICE event. |
| modulename | Specifies the name of the module that emitted the event. In this case, the module `webauthn-guard` prefixed with the module namespace. For example, the namespace and module for Kadena SpireKey running on the Kadena test network is `n_eef68e581f767dd66c4d4c39ed922be944ede505.webauthn-guard`. |

The following code example extends the previous example with the code for
finding the `REGISTER_DEVICE` event using the previously-obtained credential
identifier. If you are developing an application that runs locally on a
development network, replace the `chainwebDataUrl` and module `namespace` to
suit your local development environment and namespace. For brevity, the code
example doesn't handle error or edge cases like no events being found.

```typescript
// Code for retrieving the credential identifier omitted for clarity.

interface Event {
  params: string[];
}

const chainwebDataUrl = 'https://estats.testnet.chainweb.com';
const namespace = 'n_eef68e581f767dd66c4d4c39ed922be944ede505';

const fetchEvent = async (credentialId: string): Promise<Event> => {
  const eventsResponse = await fetch(
    `${chainwebDataUrl}/txs/events?param=${credentialId}&name=REGISTER_DEVICE&modulename=${namespace}.webauthn-guard`,
  );
  const events = await eventsResponse.json();

  return events[0];
};

const recoverAccount = async () => {
  // Code for retrieving the credential identifier omitted for clarity.

  const event = await fetchEvent(credentialId);
};

recoverAccount();
```

### Find the account name

The event object you retrieve contains a `params` field. The first value in the
`params` array is the `webauthn-guard` account. The `webauthn-guard` is an
account with the `w:` prefix. Use the value of this field to retrieve the
`webauthn-wallet` account—an account with the `c:` prefix—by making a local
transaction that calls the `get-account-name` function of the `webauthn-wallet`
contract.

The gist of the Pact command to be executed is:

```pact
`(n_eef68e581f767dd66c4d4c39ed922be944ede505.webauthn-wallet.get-account-name "w:lImvUWTPtU99aeL9IY8eSxqnbD6bIBzczlMqGlh6OLB:keys-any")`
```

The following code example uses the functional programming pattern for creating
and executing transactions provided by the `@kadena/client` package. After
preparing the transaction and creating a client to connect to the Kadena test
network, chain 14, the following code retrieves the `webauthn-wallet` account
name from the `webauthn-guard` account name in the event.

```typescript
// Existing implementation omitted for clarity.

import { createTransaction, createClient } from '@kadena/client';
import {
  composePactCommand,
  execution,
  setMeta,
  setNetworkId,
} from '@kadena/client/fp';
import { ChainId } from '@kadena/types';

const chainwebDataUrl = 'https://estats.testnet.chainweb.com';
const networkId = 'testnet04';
const chainId: ChainId = '14';

const client = createClient(({ chainId, networkId }) => {
  return `${chainwebDataUrl}/chainweb/0.0/${networkId}/chain/${chainId}/pact`;
});

const asyncPipe =
  (...args: Array<(arg: any) => any>): ((init: any) => Promise<any>) =>
  (init: any): Promise<any> =>
    args.reduce((chain, fn) => chain.then(fn), Promise.resolve(init));

const getAccountName = async (wAccount: string): Promise<string> =>
  asyncPipe(
    composePactCommand(
      execution(
        `(${namespace}.webauthn-wallet.get-account-name "${wAccount}")`,
      ),
      setMeta({
        chainId: process.env.CHAIN_ID as ChainId,
        gasLimit: 1000,
        gasPrice: 0.0000001,
        ttl: 60000,
      }),
      setNetworkId(networkId),
    ),
    createTransaction,
    (tx) =>
      client.local(tx, { preflight: false, signatureVerification: false }),
    (tx) => tx.result.data,
  )({});

const recoverAccount = async () => {
  // Existing implementation omitted for clarity.

  const accountName = await getAccountName(event.params[0]);
};

recoverAccount();
```

### Get account details and balance

You now have the account name for the credential identifier associated with the
passkey on the user's device. With this information, you can proceed to retrieve
all of the account details by executing a local transaction. The following code
example again uses the functional programming pattern for creating and executing
transactions provided by the `@kadena/client` package.

The transaction includes:

- A call to the `get-webauthn-guard` function of the `webauthn-wallet` module to
  retrieve the account details.
- A call to the `get-balance` function of the `coin` module to retrieve the
  account balance.

The gist of the Pact command to be executed is:

```pact
[
    (n_eef68e581f767dd66c4d4c39ed922be944ede505.webauthn-wallet.get-webauthn-guard "c:JYqXwmvVTNV5dDiUwoecY-DWRlBUq3j0nGSjxaf6PsE")
    (coin.get-balance "c:JYqXwmvVTNV5dDiUwoecY-DWRlBUq3j0nGSjxaf6PsE")
]
```

For example, you can add code similar to the following code to get the account
details based on the retrieved account name, then use the account details to
display the account details in your application.

```typescript
// Existing implementation omitted for clarity.

interface Device {
  domain: string;
  ['credential-id']: string;
  guard: {
    keys: string[];
    pred: 'keys-any';
  };
  name: string;
}

interface Account {
  accountName: string;
  balance: string;
  devices: Device[];
}

const getAccountDetails = async (accountName: string): Promise<Account> =>
  asyncPipe(
    composePactCommand(
      execution(
        `[
          (${namespace}.webauthn-wallet.get-webauthn-guard "${accountName}")
          (coin.get-balance "${accountName}")
        ]`,
      ),
      setMeta({ chainId }),
      setNetworkId(networkId),
    ),
    createTransaction,
    (tx) => client.local(tx, { preflight: false }),
    (tx) => {
      if (tx?.result?.status !== 'success') return null;
      const [devices, balance] = tx.result.data;
      return {
        accountName,
        devices: devices.devices || [],
        balance,
      };
    },
  )({});

const recoverAccount = async () => {
  // Existing implementation omitted for clarity.

  const account = await getAccountDetails(accountName);
};

recoverAccount();
```

### Full implementation

```typescript
import { startAuthentication } from '@simplewebauthn/browser';

import {
  BuiltInPredicate,
  ChainId,
  createTransaction,
  createClient,
} from '@kadena/client';

import {
  composePactCommand,
  execution,
  setMeta,
  setNetworkId,
} from '@kadena/client/fp';

import { ChainId } from '@kadena/types';

interface Event {
  params: string[];
}

interface Device {
  domain: string;
  ['credential-id']: string;
  guard: {
    keys: string[];
    pred: BuiltInPredicate;
  };
  name: string;
}

interface Account {
  accountName: string;
  balance: string;
  devices: Device[];
}
const domain = window.location.hostname;
const chainwebDataUrl = 'https://estats.testnet.chainweb.com';
const networkId = 'testnet04';
const chainId: ChainId = '14';
const namespace = 'n_eef68e581f767dd66c4d4c39ed922be944ede505';

const getCredentialId = async (): string => {
  const authResult = await startAuthentication({
    challenge: 'doesnotreallymatter',
    rpId: domain,
  });
  return authResult.id;
};

const fetchEvent = async (credentialId: string): Promise<Event> => {
  const eventsResponse = await fetch(
    `${chainwebDataUrl}/txs/events?param=${credentialId}&name=REGISTER_DEVICE&modulename=${namespace}.webauthn-guard`,
  );
  const events = await eventsResponse.json();

  return events[0];
};

const client = createClient(({ chainId, networkId }) => {
  return `${chainwebDataUrl}/chainweb/0.0/${networkId}/chain/${chainId}/pact`;
});

const asyncPipe =
  (...args: Array<(arg: any) => any>): ((init: any) => Promise<any>) =>
  (init: any): Promise<any> =>
    args.reduce((chain, fn) => chain.then(fn), Promise.resolve(init));

const getAccountName = async (wAccount: string): Promise<string> =>
  asyncPipe(
    composePactCommand(
      execution(
        `(${namespace}.webauthn-wallet.get-account-name "${wAccount}")`,
      ),
      setMeta({
        chainId: process.env.CHAIN_ID as ChainId,
        gasLimit: 1000,
        gasPrice: 0.0000001,
        ttl: 60000,
      }),
      setNetworkId(networkId),
    ),
    createTransaction,
    (tx) =>
      client.local(tx, { preflight: false, signatureVerification: false }),
    (tx) => tx.result.data,
  )({});

const getAccountDetails = async (accountName: string): Promise<Account> =>
  asyncPipe(
    composePactCommand(
      execution(
        `[
          (${namespace}.webauthn-wallet.get-webauthn-guard "${accountName}")
          (coin.get-balance "${accountName}")
        ]`,
      ),
      setMeta({ chainId }),
      setNetworkId(networkId),
    ),
    createTransaction,
    (tx) => client.local(tx, { preflight: false }),
    (tx) => {
      if (tx?.result?.status !== 'success') return null;
      const [devices, balance] = tx.result.data;
      return {
        accountName,
        devices: devices.devices || [],
        balance,
      };
    },
  )({});

const recoverAccount = async () => {
  const credentialId = await getCredentialId();
  const event = await fetchEvent(credentialId);
  const accountName = await getAccountName(event.params[0]);
  const account = await getAccountDetails(accountName);
};

recoverAccount();
```
