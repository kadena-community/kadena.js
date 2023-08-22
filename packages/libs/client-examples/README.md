<!-- genericHeader start -->

# @kadena/client-examples

This project demonstrates the use of the `@kadena/pactjs-cli` together with
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
npx pactjs contract-generate --contract="coin" --api https://api.chainweb.com/chainweb/0.0/mainnet01/chain/1/pact
```

### Creating a type definition from a pact file

```shell
npx pactjs contract-generate --file=./coin.pact --api https://api.chainweb.com/chainweb/0.0/mainnet01/chain/1/pact
```

if your contract has dependency to other modules you should either pass those
modules with `--file` or if they are already deployed on the chain you can use
`--api` to let the script fetch them from the chian. So for the coin example you
can alternatively use the following command if you have all of the files
locally.

```shell
npx pactjs contract-generate --file=./coin.pact --file=./fungible-v2.pact --file=./fungible-xchain-v1.pact
```

Note: You can use `--file` and `--contract` several times, and even together.

_Tip: Remember to persist the generated types by adding the command as a npm
scripts._

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
    // if you are using TypeScript this function comes with types of the available capabilities based on the execution part.
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
    .setMeta({ chainId: '0', senderAccount: sender.accountName })
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
  if (!isSignedCommand(signedTr)) {
    throw new Error('TX_IS_NOT_SIGNED');
  }

  // Now it's time to submit the transaction; this function returns the requestDescriptor {requestKey, networkId, chainId}.
  // by storing this object in a permanent storage you always can fetch the result of the transaction from the blockchain
  const requestDescriptor = await submit(signedTr);
  // We listen for the result of the request.
  const response = await listen(requestDescriptor);
  // Now we need to check the status.
  if (response.result.status === 'failure') {
    throw response.result.error;
  }

  // Congratulations! You have successfully submitted a transfer transaction.
  console.log(response.result);
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

_why do we set senderAccount?_

In Kadane, the account paying the gas fee might not be the same as others
involved in the transaction. By choosing the senderAccount, you're telling the
system which account should cover the gas cost. In a regular transaction, the
owner of this account must also sign the transaction.

_Do we always need to add `coin.GAS` capability, Isn't this redundant while we
set the sender in the metadata?_

When working with capabilities, remember to clearly define the scope of your
signature. When you include capabilities, you need to list all of them. So, if
you add `coin.TRANSFER` to your scope and you're also the senderAccount, you
must add `coin.GAS` too. And even if you're not adding any other capabilities,
it's a good idea to include `coin.GAS`. This helps ensure that you control what
happens during the transaction.

### Extra information

In Kadena, there's a special account type called a "gas station" which can act
as the senderAccount. This allows users to send transactions without directly
paying for gas fee. Gas stations don't sign transactions themselves; instead, a
smart contract takes care of this.
