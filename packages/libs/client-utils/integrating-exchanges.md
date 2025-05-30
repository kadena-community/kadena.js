# Integrating Exchanges

This document provides a guide how Kadena blockchain can be integrated with
exchanges.

Typical features that exchanges may utilize include are listed below

- [Integrating Exchanges](#integrating-exchanges)
  - [Low Level Client](#low-level-client)
  - [Retrieve balance](#retrieve-balance)
  - [Generate an account on the blockchain](#generate-an-account-on-the-blockchain)
  - [Create, sign and send a transaction](#create-sign-and-send-a-transaction)
  - [Check status of a transaction](#check-status-of-a-transaction)
    - [Single check](#single-check)
    - [Polling check](#polling-check)
  - [Estimate Gas Usage](#estimate-gas-usage)
  - [Listens for Events](#listens-for-events)
    - [Chainweb Stream](#chainweb-stream)
    - [Third-party Services](#third-party-services)
    - [Custom implementation](#custom-implementation)

## Low Level Client

An exchange usually hosts their own node to interact with the Kadena blockchain.

They might want to limit the sub-chains they work with, so a custom host
generator function can be used to connect to specific chains.

Typically, an exchange want to wait for more confirmations than a regular user.

See for more details on how to use the **low-level client**
[docs.kadena.io](https://docs.kadena.io/reference/kadena-client#get-started-with-kadena-client)

```ts
import { createClient } from '@kadena/client';

// An exchange may want to only work with a limited set of sub-chains.
// Generally an Exchange will host their own node
const customHostGeneratorFunction = ({ networkId, chainId }) => {
  if (![0, 1, 2].includes(chainId)) {
    throw new Error('This Exchange only works with chains 0, 1, and 2');
  }

  const hostname = 'kadena-node.my-exchange.tld';
  return `https://${hostname}/chainweb/0.0/${networkId}/chain/${chainId}/pact`;
};

// This is a lower-level client that can be used to connect to the blockchain.
const client = createClient(customHostGeneratorFunction, {
  confirmationDepth: 10, // an Exchange may want to wait for more confirmations
});
```

## Retrieve balance

```ts
import { getBalance } from '@kadena/client-utils/coin';

const balance = await getBalance(
  'k:my-wallet-address',
  'mainnet01',
  '0', // chainId
  customHostGeneratorFunction, // NOTE: you can pass both the hostname or a generator function
);
console.log(`Balance: ${balance}`);
```

## Generate an account on the blockchain

It's higly recommended to use a **multisig account** to manage funds owned by
the Exchange. This way the four-eye-principle can be applied. Built in
predicates for multisig accounts are `keys-all`, `keys-2`, and `keys-any`.
Generally `keys-2` is used for 2-out-of-n.

Create keys using a wallet

- [Chainweaver v3](https://wallet.kadena.io) (Built by Kadena)
- [Kadena CLI Wallet](https://docs.kadena.io/reference/cli/cli-wallet)
- [Other wallets](https://www.kadena.io/defi?topic=Wallets#:~:text=Wallets%20allow%20you%20to%20store%2C%20send%20and%20receive%20digital%20currencies%2C%20unlocking%20the%20speed%2C%20security%2C%20privacy%20and%20cost%20reduction%20benefits%20of%20blockchain%20for%20your%20business)

To use mnemonics prorgammatically, you can use the
[`@kadena/hd-wallet` library](https://www.npmjs.com/package/@kadena/hd-wallet)

```ts
import { createAccount } from '@kadena/client-utils/coin';

const result = await createAccount(
  {
    account: 'k:' + publicKey,
    keyset: {
      pred: 'keys-2',
      keys: [publicKeyA, publicKeyB], // two public keys for a 2-of-2 multisig
      // keys: [publicKeyA, publicKeyB, publicKeyC], // three public keys for a 2-of-3 multisig
    },
    gasPayer: { account: 'gasPayer', publicKeys: [''] },
    chainId: '0',
  },
  {
    host: customHostGeneratorFunction,
    defaults: {
      networkId: 'mainnet01',
    },
    sign: signWithChainweaver,
  },
)
  // signed Tx
  .on('sign', (data) => console.log(data))
  // preflight result
  .on('preflight', (data) => console.log(data))
  // submit result
  .on('submit', (data) => console.log(data))
  // listen result
  .on('listen', (data) => console.log(data))
  .execute();
```

## Create, sign and send a transaction

To create a transaction manually, you can run the combined functions:

- `Pact.builder` to create a transaction
- `Pact.modules.<module>.<function>` to create a Pact expression

```ts
async function transfer(
  sender: string,
  senderAPublicKey: string,
  senderBPublicKey: string,
  receiver: string,
  amount: IPactDecimal,
): Promise<void> {
  const transaction = Pact.builder
    .execution(
      // pact expression
      Pact.modules.coin.transfer(sender, receiver, amount),
    )
    // add signers
    .addSigner(senderAPublicKey, (signFor) => [
      // add capabilities
      signFor('coin.GAS'),
      signFor('coin.TRANSFER', sender, receiver, amount),
    ])
    // if second signer is needed due to `keys-2` predicate on the `sender` account
    .addSigner(senderBPublicKey, (signFor) => [
      signFor('coin.TRANSFER', sender, receiver, amount),
    ])
    // set chainId and sender
    .setMeta({ chainId: '0', senderAccount: sender })
    .setNetworkId('mainnet01')
    // will create a IUnsignedTransaction { cmd, hash, sigs }
    .createTransaction();

  const signedTx = await signWithChainweaver(transaction);

  // create client
  const client = createClient(customHostGeneratorFunction, {
    confirmationDepth: 10,
  });

  // check if all necessary signatures are added
  if (isSignedTransaction(signedTx)) {
    const transactionDescriptor = await client.submit(signedTx);
    const response = await client.listen(transactionDescriptor, {});
    if (response.result.status === 'failure') {
      throw response.result.error;
    } else {
      console.log(response.result);
    }
  }
}

// run the function
transfer(senderAccount, senderPublicKey, receiverAccount, {
  decimal: '13.37',
}).catch(console.error);
```

## Check status of a transaction

Checking the status of a transaction can be done in a few ways. You can
incidentally check the status with `getStatus` or poll for the status until a
certain state is reached

### Single check

```ts
const client = createClient(/* omitted options, see "Low Level Client"*/);
// requestKey is the hash of the submitted transaction
client.getStatus({ chainId, networkId, requestKey });
```

### Polling check

```ts
client.pollStatus(
  { networkId: 'mainnet01', chainId: '0', requestKey: 'tx-hash' },
  { confirmationDepth: 10 },
);
```

## Estimate Gas Usage

To get an estimation of the gas usage, a `local` call can be executed.

> NOTE: this isn't the real gas usage as state on the blockchain can influence
> the branches which te code takes.

```ts
// We do not need to send signatures to check gas estimation
// This can however influence the direction of the code, thus gas usage
const response = await client.local(unsignedTx, {
  preflight: true,
  signatureVerification: false,
});

if (response.result.status === 'failure') {
  throw response.result.error;
}

const gasEstimation = response.gas;
```

## Listens for Events

### Chainweb Stream

To listen to events from the blockchain, one can use the server package
[Chainweb-stream](https://github.com/kadena-io/chainweb-stream) combined with
[`@kadena/chainweb-stream-client`](https://www.npmjs.com/package/@kadena/chainweb-stream-client).
This is a tool that can listen for certain events on the blockchain. In case of
an Exchange, they likely want to listen to `coin.TRANSFER` events.

### Third-party Services

Alternatively a service can be used to get information from a third-party
indexer. In no particular order:

- [Kadindexer](https://www.kadindexer.io/)
- [Tatum](https://www.tatum.io/)

### Custom implementation

You can also implement your own listener using the
[`@kadena/chainwebjs`](https://www.npmjs.com/package/@kadena/chainwebjs)
package.
