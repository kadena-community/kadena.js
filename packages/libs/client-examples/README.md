<!-- genericHeader start -->

# @kadena/client-examples

This project demonstrates the use of the `@kadena/pact-cli` together with
`@kadena/client` for _smart contracts_.

<picture>
  <source srcset="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-white.png" media="(prefers-color-scheme: dark)"/>
  <img src="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-black.png" width="200" alt="kadena.js logo" />
</picture>

<!-- genericHeader end -->

## Preparation

In the following examples, we will interact with the `coin` contract. To have
better type support, we strongly recommend generating the type definition from
the contract using `@kadena/pactjs-cli`.

To install `@kadena/pactjs-cli` as a dev dependency for your project, run the
following command in the terminal:

```shell
npm install @kadena/pactjs-cli --save-dev
```

You can generate type definitions from either a local file or directly from the
chain.

### Creating a type definition from a contract deployed on the chain

```shell
npx pactjs contract-generate --contract="coin" --api http://104.248.41.186:8080/chainweb/0.0/development/chain/0/pact
```

### Creating a type definition from a pact file

```shell
npx pactjs contract-generate --file=./coin.pact --api http://104.248.41.186:8080/chainweb/0.0/development/chain/0/pact
```

Note: Passing the API is optional here, but it's better to always do that so the
script can generate types for all of the dependencies as well.

Note: You can use `--file` and `--contract` several times, and even together.

## Transfer KDA

In this example, we will use `@kadena/client` to transfer `1` KDA from `bob` to
`alice`.

This example demonstrates how to use `Pact.builder`, `Pact.modules`,
`signWithChainweaver`, and `getClient` utilities.

```ts
import {
  getClient,
  isSignedCommand,
  Pact,
  signWithChainweaver,
} from '@kadena/client';

interface IAccount {
  // In KDA, the account name is not the same as the public key. The reason is that the account could be multi-signature, and you can choose a user-friendly name for yourself.
  accountName: string;
  // We need this for signing the transaction.
  publicKey: string;
}

const { submit, listen } = getClient();

async function transfer(
  sender: IAccount,
  receiver: IAccount,
  amount: string,
): Promise<void> {
  // The first step for interacting with the blockchain is creating a request object.
  // We call this object a transaction object. `Pact.builder` will help you to create this object easily.
  const transaction = Pact.builder
    // In Pact, we have two types of commands: execution and continuation. Most of the typical use cases only use execution.
    .execution(
      // This function uses the type definition we generated in the previous step and returns the pact code as a string.
      // This means you want to call the transfer function of the coin module (contract).
      // You can open the coin.d.ts file and see all of the available functions.
      Pact.modules.coin.transfer(
        sender.accountName,
        receiver.accountName,
        // As we know JS rounds float numbers, which is not a desirable behavior when you are working with money. So instead, we send the amount as a string in this format.
        {
          decimal: amount,
        },
      ),
    )
    // The sender needs to sign the command; otherwise, the blockchain node will refuse to do the transaction.
    .addSigner(sender.publicKey, (withCapability) => [
      // The sender also mentions they want to pay the transaction fee by adding the "coin.GAS" capability.
      withCapability('coin.GAS'),
      // The sender scopes their signature only to "coin.TRANSFER" with the specific arguments.
      withCapability(
        'coin.TRANSFER',
        sender.accountName,
        receiver.accountName,
        {
          decimal: amount,
        },
      ),
    ])
    // Since Kadena has a multi-chain architecture, we need to set the chainId.
    // We also need to mention who is going to pay the gas fee.
    .setMeta({ chainId: '0', sender: sender.accountName })
    // We set the networkId to "testnet04"; this could also be "mainnet01" or something else if you use a private network or a fork.
    .setNetworkId('testnet04')
    // Finalize the command and add default values and hash to it. After this step, no one can change the command.
    .createTransaction();

  // The transaction now has three properties:
  // - cmd: stringified version of the command
  // - hash: the hash of the cmd field
  // - sigs: an array that has the same length as signers in the command but all filled by undefined

  // Now you need to sign the transaction; you can do it in a way that suits you.
  // We exported some helpers like `signWithChainweaver` and signWithWalletConnect, but you can also use other wallets.
  // For example, if you are using EckoWallet, it has a specific API for signing transactions.
  // By the end, the signer function should fill the sigs array and return the signed transaction.
  const signedTr = await signWithChainweaver(transaction);

  // As the signer function could be an external function, we double-check if the transaction is signed correctly.
  if (isSignedCommand(signedTr)) {
    // So it's time to submit the transaction; this function returns the requestKey.
    const requestKey = await submit(signedTr);
    // We listen for the result of the request.
    const response = await listen(requestKey);
    // Now we need to check the status.
    if (response.result.status === 'failure') {
      throw response.result.error;
    } else {
      // Congratulations! You have successfully submitted a transfer transaction.
      console.log(response.result);
    }
  }
}

// Calling the function with proper input
transfer(
  { accountName: 'bob', publicKey: 'bob_public_key' },
  { accountName: 'alice', publicKey: 'alice_public_key' },
  '1',
).catch(console.error);
```

### More in-depth

_What is a capability?_

A capability is the security model of Pact - the Kadena smart contract language.
It is used widely in Pact contracts for security reasons, but from the user's
perspective, it allows users to scope their signatures. For example, you can say
"I signed this contract only for paying gas," or "I want a transfer to happen
but only to a specific account and with a specific maximum amount."

_Why do we add `coin.TRANSFER` via `withCapability` once we already added a
similar thing via `Pact.modules.coin.transfer`?_

Pact is a modular language, which means other contracts can import the coin
contract and call the transfer function. To prevent unauthorized transfers, the
coin contract needs to guard against this and ensure that the user is aware of
the transfer happening. `withCapability` is the place for that. So you tell Pact
that you expect a transfer to happen during the execution of this transaction.
