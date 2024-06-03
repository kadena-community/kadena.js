---
title: Create transactions for Kadena SpireKey
description:
  If you're an application developer, you can enable users to sign transactions
  using their Kadena SpireKey account by constructing the transaction in the
  proper format and sending the unsigned transaction to the SpireKey endpoint.
menu: Authenticate accounts
label: Create transactions
order: 2
layout: full
---

# Create transactions for Kadena SpireKey

If you enable your application to connect to Kadena SpireKey as
described in [Integrate decentralized apps](/build/authentication/integrate),
you can construct transactions for users to sign using their Kadena SpireKey
account.

In this guide you'll learn:

- How to construct an unsigned transaction to support signing using a Kadena
  SpireKey account.
- How to send unsigned transactions to the SpireKey URL for signing.
- How to process the data you receive in signed transaction returned from
  Kadena SpireKey.

## Construct an unsigned transaction

Transactions that can be signed using a Kadena SpireKey account are similar to
transactions that are signed using other wallets. 
At a high level, you construct
the transaction with the appropriate information, format the information as a
JSON request, and submit the JSON request to a Chainweb node endpoint.  

However, transactions involving Kadena SpireKey accounts have some unique
requirements.

### Public key generation

When users register an account using Kadena SpireKey, the cryptographic algorithm
used to generate the public and secret keys is different from the cryptographic
algorithm and ED25519 signature scheme used to generate the public and secret keys for other Kadena accounts. 
To differentiate Kadena SpireKey account public keys from other public
keys, transactions must include both the public key and the `scheme` attribute
set to `WebAuthn` as its value when signing transactions.

```ts
{ pubKey: webAuthnPublicKey, scheme: 'WebAuthn' }
```

### Account guard

When users create an account for the `coin` contract or for other `fungible-v2` contracts, they provide an account name and a guard. 
As mentioned in [Account, keys, and principals](/learn/accounts), there are different types of guards, but **keysets** are the most commonly-used for accounts that hold assets. 

Kadena SpireKey accounts are different in that they use a **capability** defined in the `webauthn-wallet` contract instead of a keyset to enforce the rules for signing transactions. 
Because the `coin` contract can't bring this capability into scope when trying to debit an account, the `webauthn-wallet` contract implements its own `webauthn-wallet.transfer` function and custom `webauthn-wallet.GAS_PAYER` and `webauthn-wallet.TRANSFER` capabilities. 

The `webauthn-wallet` contract wraps the `coin` contract to bring the required capabilities into scope before calling the wrapped functions.
You can use the `webauthn-wallet.GAS_PAYER` and `webauthn-wallet.TRANSFER` capabilities
in place of the corresponding `coin.GAS` and `coin.TRANSFER` capabilities to satisfy the guard required to debit an account.

The following is a simplified example of what an unsigned transfer transaction from
a Kadena SpireKey account might look like with the `cmd` field in non-stringified JSON format for readability:

```json
{
  "cmd": {
    "payload": {
      "exec": {
        "code": "(n_eef68e581f767dd66c4d4c39ed922be944ede505.webauthn-wallet.transfer \"c:bF51UeSqhrSjEET1yUWBYabDTfujlAZke4R70I4rrHc\" \"k:9cb650e653f563d782182a67b73a4d5d553aaf6f1c4928087bb7d91d59b8a227\" 2.00000000000)",
        "data": {}
      }
    },
    "nonce": "kjs:nonce:1710872658811",
    "signers": [
      {
        "pubKey": "WEBAUTHN-a50102032620012158200df3845d4ad0f626a3c860715ad3d4bd7bbee03330aa32878d6baa045e98f64f2258206a93722f35f3d0692dc4c26703653498eae51816ffb7b70e4670b010103bd9eb",
        "scheme": "WebAuthn",
        "clist": [
          {
            "name": "n_eef68e581f767dd66c4d4c39ed922be944ede505.webauthn-wallet.GAS_PAYER",
            "args": [
              "c:bF51UeSqhrSjEET1yUWBYabDTfujlAZke4R70I4rrHc",
              {
                "int": 1
              },
              1
            ]
          },
          {
            "name": "n_eef68e581f767dd66c4d4c39ed922be944ede505.webauthn-wallet.TRANSFER",
            "args": [
              "c:bF51UeSqhrSjEET1yUWBYabDTfujlAZke4R70I4rrHc",
              "k:9cb650e653f563d782182a67b73a4d5d553aaf6f1c4928087bb7d91d59b8a227",
              {
                "decimal": "2.00000000000"
              }
            ]
          }
        ]
      }
    ],
    "meta": {
      "gasLimit": 2000,
      "gasPrice": 1e-7,
      "sender": "c:bF51UeSqhrSjEET1yUWBYabDTfujlAZke4R70I4rrHc",
      "ttl": 60000,
      "creationTime": 1710872658,
      "chainId": "1"
    },
    "networkId": "testnet04"
  },
  "hash": "6DGS9ML91o6S9BLgo_lBzLPkRZSb5RImCL06zjrbkD0",
  "sigs": [null]
}
```

In this example, the `n_eef68e581f767dd66c4d4c39ed922be944ede505` namespace is the namespace for Kadena SpireKey where the `webauthn-wallet` and `webauthn-guard` contracts are deployed on the Kadena test and main networks.
The transaction sender is a Kadena SpireKey account with the account name `c:bF51UeSqhrSjEET1yUWBYabDTfujlAZke4R70I4rrHc`.

To construct a transaction similar to this example in your application, you use the `c:` account and `WEBAUTHN` public key returned by Kadena SpireKey in the `accountName` and `credentials` properties from the account details for a user object.

## Send transactions to Kadena SpireKey

After you construct the unsigned transaction in your application, you need to `base64` encode the stringified JSON of the transaction and send a signing request to Kadena SpireKey.

To construct the route:

1. Stringify the unsigned transaction (tx) you've prepared:
   
   ```typesecript
   const encodedTx = btoa(JSON.stringify(tx));
   ```
   
2. Use the `encodeURIComponent` function to encode the return URL:

   ```typescript
   const encodedReturnUrl = encodeURIComponent(RETURN_URL);
   ```

1. Construct the request URL using the `encodedTx` and `encodedReturnUrl` to send the transaction to Kadena SpireKey:
   
   ```typescript
   const sendTransactionUrl = `https://spirekey.kadena.io/sign#transaction=${encodedTx}&returnUrl=${encodedReturnUrl}`;
   ```

Because transaction strings can be longer than what is accepted in `searchParameters`, you should send transactions to the `/sign` endpoint using the anchor hashtag (`#`) instead of the `searchParameters` question mark (`?`). 

For example, a signature request might look similar to this:

https://spirekey.kadena.io/sign#transaction=encodedTx&returnUrl=www.mydapp.com

The following table describes the parameters that you can include in your signing request:

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `transaction` | string  | Required | A base64 encoded string of the unsigned transaction. |
| `returnUrl` | string  | Required | The url, encoded as a uriComponent, that the Kadena SpireKey should redirect users to after they have signed the transaction. |
| `translations` | string  | Optional | Custom descriptions that explain what capabilities or operations that the user is signing for. |
| `optimistic` | boolean | Optional | Allows applications to continue transaction workflows without having to wait for the transaction to be confirmed on the blockchain. When this parameter is included, `pendingTxIds` are returned so that the application can keep track of the status of the submitted transactions and update the UI accordingly. For more information about the optimistic transaction flow, see [Optimistic account onboarding](/build/authentication/integrate#optimistic-account-onboardingh-416162207). |

After you construct the request with the required parameters, you can navigate to Kadena SpireKey to enable the user to sign the transaction.

## Verify the signed transaction

After signing the transaction, the user is redirected to the `returnUrl` you provided. 
The signed transaction and optional parameters are returned as parameters using the anchor hashtag (`#`). 

If the transaction was not successfully signed, the unsigned transaction is returned.

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `transaction` | string | Required | A base64 encoded string of the signed or unsigned transaction. |
| `pendingTxIds`| string[] | Optional | Pending transaction identifiers that enable the application to move forward without waiting for the transaction to be confirmed on the blockchain. |

To verify that a transaction has been successfully signed, you can check the `sigs` field in the transaction. 
If the field has undefined signatures, you won't be able to submit the transaction.

If the transaction has been successfully signed, it is valid for the period of time set in the `ttl` value in the transaction `publicMeta` data.
During this period of time, the application can call the `local?preflight=true` endpoint to check whether the transaction is valid, then send it to the blockchain to be executed.

After the transaction is submitted to the blockchain, you can check the transaction status using the request key and the Kadena client. 
For example, you can poll for the transaction status using Kadena client:

```typescript
const results = pollStatus(transactionDescriptors, {
    onPoll: (requestKey) => {
      console.log('polling status of', requestKey);
    },
});
```
