---
title: Send unsigned transactions to Kadena SpireKey
description:
  If you're an application developer, you can enable users to sign transactions
  using their Kadena SpireKey accounts by constructing the transaction in the
  proper format and sending the unsigned transaction to the SpireKey endpoint.
menu: Authenticate and authorize
label: Send unsigned transactions
order: 2
layout: full
---

# Send unsigned transactions to Kadena SpireKey

If you enable your application to connect to a Kadena SpireKey wallet as
described in [Integrate with Kadena SpireKey](/build/authentication/integrate),
you can construct transactions for users to sign using their Kadena SpireKey
account.

In this guide you'll learn:

- How to construct an unsigned transaction to support signing using a Kadena
  SpireKey account.
- How to send unsigned transactions to the SpireKey wallet.
- How to process the data you receive in signed transaction returned from the
  Kadena SpireKey wallet.

## Construct an unsigned transaction

Transactions that can be signed using a Kadena SpireKey account are similar to
transactions that are signed using other wallets. 
At a high level, you construct
the transaction with the appropriate information, format the information as a
JSON request, and submit the JSON request to a Chainweb node endpoint. 
For
example, you can create an API request in a YAML file and use the
`pact --apireq` command to convert the YAML file to an appropriate JSON
representation of the transaction or you can construct a JSON object with the
appropriate information within your application. 

However, transactions involving Kadena SpireKey accounts have some unique
requirements, including the cryptographic algorithm used to generate the public
and secret keys and separate WebAuthN-specific contracts to manage accounts and permissions.

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

When users create an account for the `coin` contract or for other `fungible-v2`
contracts, they provide an account name and a guard. In most cases, these
accounts use **keysets** to enforce who must sign valid transactions and to
prevent unauthorized signers from submitting transactions.

However, Kadena SpireKey uses its own `webauthn-wallet` and `webauthn-guard`
contracts to create, manage, and secure accounts instead of using the `coin` or
`fungible-v2` contract. Kadena SpireKey accounts use a _capability_ defined in
the `webauthn-guard` contract instead of a keyset to enforce signing rules for
transactions. Capability guards use the `c:` prefix.

Because the `coin` contract can't bring this capability guard into scope when
trying to debit an account, the `webauthn-wallet` contract implements its own
`webauthn-wallet.transfer` function and custom `webauthn-wallet.GAS_PAYER` and
`webauthn-wallet.TRANSFER` capabilities. You can use these custom capabilities
in place of the corresponding `coin.GAS` and `coin.TRANSFER` capabilities in
transactions to identify the guard required to debit an account.

The `webauthn-wallet` contract implements these functions and capabilities for you to use instead of the corresponding functions and capabilities in the `coin` contract because the `coin` contract isn't likely to be updated to accommodate `webauthn-wallet` accounts. 
Other contracts should be compatible with `webauthn-wallet` accounts by default.

The following is an example of what an unsigned transfer transaction from
a Kadena SpireKey wallet might look like for the `n_eef68e581f767dd66c4d4c39ed922be944ede505` principal namespace:

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

In this example, the `n_eef68e581f767dd66c4d4c39ed922be944ede505` namespace is the namespace for the Kadena SpireKey wallet deployed on the Kadena test and main networks.
If you deploy your own versions of the `webauthn-wallet` and `webauthn-guard` contracts, you'll use a different namespace. 
To construct a transaction similar to this example in your application, you can use the `c:` account and `WEBAUTHN` public key returned by the Kadena SpireKey wallet in the `accountName` and `credentials` properties from the account details for a user object.

## Send data to the SpireKey wallet

After you construct the unsigned transaction in your application, you can send
that data along with a `returnUrl` to the Kadena SpireKey wallet. Kadena
SpireKey handles the signing process and redirects users back to your
application. As with registration and authentication, the information is passed
using URL parameters.

You can use the same host that you used to register or connect to an account and navigate to
the `sign` endpoint. For example, https://spirekey.kadena.io/sign.

In the following table, you can see the parameters that are currently accepted by Kadena SpireKey.

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `transaction` | string  | Required | A base64 encoded string of the unsigned transaction. |
| `returnUrl` | string  | Required | The url, encoded as a uriComponent, that the wallet should redirect users to after they have signed the transaction. |
| `translations` | string  | Optional | Custom descriptions that explain what capabilities or operations that the user is user signing for. For more information about using translations to describe transaction details, see [Translate signing operations](/build/authentication/translate). |
| `optimistic` | boolean | Optional | Allows applications to continue the transaction flows without having to wait for the transaction to be confirmed on the blockchain. When this parameter is included, `pendingTxIds` are returned so that the application can keep track of the status of the submitted transactions and update the UI accordingly. For more information about the optimistic transaction flow, see [Allow optimistic account onboarding](/build/authentication/integrate#allow-optimistic-account-onboardingh-380147766). |

The following is an example of how you would construct the route:

```ts
// tx is the unsigned transaction you constructed
const encodedTx = btoa(JSON.stringify(tx));

// Use`encodeURIComponent` so that the return url is still readable
const encodedReturnUrl = encodeURIComponent(RETURN_URL);

// The url you need to navigate to sign and return the transaction
const sendTransactionUrl = `https://spirekey.kadena.io/sign?transaction=${encodedTx}&returnUrl=${encodedReturnUrl}`;
```

After you construct the route to the wallet with the required parameters, you
can navigate to the wallet to handle the signing.

## Verify the signed transaction from the SpireKey wallet

After all signatures for a transaction have been successfully collected from the
wallet, the user is redirected to the `returnUrl` you provided. The signed
transaction and optional parameters are included as URL parameters. If the
transaction was not successfully signed, the unsigned transaction is returned in
the URL parameters.

| Parameter      | Type     | Required | Description                                                                                                                                       |
| -------------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `transaction`  | string   | Required | A base64 encoded string of the signed or unsigned transaction.                                                                                    |
| `pendingTxIds` | string[] | Optional | Pending transaction identifiers that enable the application to move forward without waiting for the transaction to be confirmed on the blockchain. |

To verify that a transaction has been successfully signed, you can check the
`sigs` field in the transaction. If the field has undefined signatures, you
won't be able to submit the transaction.

If the transaction has been successfully signed, it is valid for a limited
period of time as specified in the `ttl` value in the transaction
`publicMeta` data. During this period of time, the application can call the
`local/preflight=true` endpoint to check whether the transaction is valid, then
send it to the blockchain to be executed.

After the transaction is submitted to the blockchain, you can check the transaction status using the request key and chainweb-data API or the Kadena client. 
For example, to check the status of a transaction sent to the Kadena test network using the request key `uOyDol7dZTd96kzUhGz_ZPURIRYOEocR8IGZKuO6T6Y`:

https://estats.testnet.chainweb.com/txs/tx?requestkey=uOyDol7dZTd96kzUhGz_ZPURIRYOEocR8IGZKuO6T6Y

Alternatively, you can poll for the transaction status using Kadena client:

```ts
const results = pollStatus(transactionDescriptors, {
    onPoll: (requestKey) => {
      console.log('polling status of', requestKey);
    },
});
```

