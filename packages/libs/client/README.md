<!-- genericHeader start -->

# @kadena/client

Core library for building Pact expressions to send to the blockchain in js.
Makes use of .kadena/pactjs-generated

<picture>
  <source srcset="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-white.png" media="(prefers-color-scheme: dark)"/>
  <img src="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-black.png" width="200" alt="kadena.js logo" />
</picture>

<!-- genericHeader end -->

API Reference can be found here [client.api.md][1]

## Release @kadena/client

`@kadena/client` allows JavaScript/TypeScript users to easily interact with the
Kadena Blockchain.

Interaction with the Kadena Blockchain works in multiple ways. With
`@kadena/client` you will be able to interact with the Kadena Blockchain in two
ways:

1.  [contract based][2]
2.  [modular pact command][3]
3.  [functional pact command][4]

There's also information on an [integrated way of signing using Chainweaver][5].
With `@kadena/client` you can also [send a request to the blockchain][6]. That's
covered in this article. We'll also be exploring the concepts and rationale of
`@kadena/client`.

- [@kadena/client](#kadenaclient)
  - [Release @kadena/client](#release-kadenaclient)
  - [Prerequisites](#prerequisites)
- [Contract-based interaction using @kadena/client](#contract-based-interaction-using-kadenaclient)
    - [Generate interfaces from the blockchain](#generate-interfaces-from-the-blockchain)
      - [Generate interfaces locally](#generate-interfaces-locally)
    - [Downloading contracts from the blockchain](#downloading-contracts-from-the-blockchain)
  - [Building a simple transaction from the contract](#building-a-simple-transaction-from-the-contract)
  - [Signing](#signing)
    - [Manually signing the transaction](#manually-signing-the-transaction)
    - [Integrated sign request to Chainweaver desktop](#integrated-sign-request-to-chainweaver-desktop)
    - [Signing with a WalletConnect compatible wallet](#signing-with-a-walletconnect-compatible-wallet)
- [Using the commandBuilder](#using-the-commandbuilder)
- [Using FP approach](#using-fp-approach)
  - [Send a request to the blockchain](#send-a-request-to-the-blockchain)
  - [Further development](#further-development)
  - [Contact the team](#contact-the-team)

## Prerequisites

To use `@kadena/client`, Node.js v14 or higher is required. Let's install the
bare minimum you need to get started:

```sh
mkdir my-dapp-with-kadena-client
cd my-dapp-with-kadena-client
npm init -y
npm install @kadena/client
npm install --save-dev @kadena/pactjs-cli typescript ts-node
npx tsc --init
```

# Contract-based interaction using @kadena/client

We wanted `@kadena/client` to be independent so this is a tool that can be used
with arbitrary contracts. That is also why you have to _generate_ the interfaces
used by `@kadena/client`. You can use the smart contracts from the blockchain or
from your own local smart contracts.

For the **template based interaction** we will provide a repository with
templates that can be used.

### Generate interfaces from the blockchain

Generate types directly from a contract on the blockchain

```bash
pactjs contract-generate --contract "coin" --api "https://api.chainweb.com/chainweb/0.0/mainnet01/chain/1/pact"
```

The log shows what has happened. Inside the `node_modules` directory, a new
package has been created: `.kadena/pactjs-generated`. This package is referenced
by `@kadena/client` to give you type information.

Now you can use this by
[creating a transaction that calls a smart-contract function](#building-a-simple-transaction-from-the-contract)

> **NOTE:** do not forget to add this `"types": [".kadena/pactjs-generated"],`
> to `compilerOptions` in `tsconfig.json`. Otherwise this will not work

#### Generate interfaces locally

You can create your own smart-contract or
[download it from the blockchain](#downloading-contracts-from-the-blockchain)
using

Using the contract we'll now generate all the functions (`defun`s) with their
(typed) arguments and the capabilities (`defcap`s).

```sh
pactjs contract-generate --file "./contracts/coin.module.pact"
```

### Downloading contracts from the blockchain

Let's download the contracts you want to create Typescript interfaces for:

```sh
mkdir contracts
npx pactjs retrieve-contract --out "./contracts/coin.module.pact" --module "coin"
```

There are several options to retrieve contracts from another network or chain.

Help information on retrieve-contract

`pactjs retrieve-contract --help`

```txt
> pactjs retrieve-contract --help
Usage: pactjs retrieve-contract [options]

Retrieve contract from a chainweb-api in a /local call (see also: https://github.com/kadena-io/chainweb-node#configuring-running-and-monitoring-the-health-of-a-chainweb-node).

Options:
  -m, --module <module>    The module you want to retrieve (e.g. "coin")
  -o, --out <file>         File to write the contract to
  --api <url>              API to retrieve from (e.g. "https://api.chainweb.com/chainweb/0.0/mainnet01/chain/8/pact")
  -n, --network <network>  Network to retrieve from (default "mainnet") (default: "mainnet")
  -c, --chain <number>     Chain to retrieve from (default 1) (default: 1)
  -h, --help               display help for command
```

## Building a simple transaction from the contract

> Take a look at
> [https://github.com/kadena-community/kadena.js/blob/main/packages/libs/client-examples/src/example-contract/simple-transfer.ts][20]
> for the full example

Now that everything is bootstrapped, we can start building transactions.

Create a new file and name it `transfer.ts` (or `.js`).

```ts
import { Pact } from '@kadena/client';

const unsignedTransaction = Pact.builder
  .execute(
    Pact.modules.coin.transfer('k:your-pubkey', 'k:receiver-pubkey', {
      decimal: '231',
    }),
  )
  .addSigner('your-pubkey', (withCapability) => [
    // add necessary coin.GAS capability (this defines who pays the gas)
    withCapability('coin.GAS'),
    // add necessary coin.TRANSFER capability
    withCapability('coin.TRANSFER', 'k:your-pubkey', 'k:receiver-pubkey', {
      decimal: '231',
    }),
  ])
  .setMeta({ chainId: '1', sender: 'your-pubkey' })
  .setNetworkId('mainnet01')
  .createTransaction();
```

**Note**

Take note of the following:

- namespaced arguments (`k:`, `w:` etc) are account-names, where non-namespaced
  arguments are assumed to be public-keys
- the contract doesn't specify whether you need to pass an **account-name** or
  **public-key**. This is knowledge that can be obtained by inspecting the
  contract downloaded earlier or consulting the documentation for the contract.
- `addSigner` function accepts the `public-key` of the signer and let signer add
  the capabilities they want to sign for. `coin.GAS` doesn't have any arguments,
  `coin.TRANSFER` does.
- `setMeta`s object has a `sender` property, which is a `public-key` this could
  be gas-station address is some scenarios.
- to add an **Unrestricted Signer**
  ([Unscoped Signature](https://pact-language.readthedocs.io/en/stable/pact-reference.html?highlight=signer#signature-capabilities)),
  just call `addSigner` without extra arguments

## Signing

Signing can be done in various ways. Either manually, by signing the hash of the transaction or with a wallet. There's currently two options in @kadena/client to sign with a wallet:

1. [WalletConnect (preferred)](#signing-with-a-walletconnect-compatible-wallet)
2. [Chainweaver](#integrated-sign-request-to-chainweaver-desktop)

### Manually signing the transaction

the unsignedTransaction can be pasted into the `SigData` of Chainweaver.

Take note of the following:

- `createTransaction()` will return the transaction. The hash will be calculated
  and command will be serialized.

### Integrated sign request to Chainweaver desktop

Using the `transaction` we can send a sign-request to Chainweaver. **(NB: this
can only with the desktop version, not the web-version, as it's [exposing port
9467][21]**

```ts
import { signWithChainweaver } from '@kadena/client';

// use the transaction, and sign it with Chainweaver
const signedTransaction = signWithChainweaver(unsignedTransaction)
  .then(console.log)
  .catch(console.error);
```

> To **send** the transaction to the blockchain, continue with [**Send a request
> to the blockchain**][6]

### Signing with a WalletConnect compatible wallet

There's several steps to setup a WalletConnect connections and sign with WalletConnect.

1. Setting up the connection using [`ClientContextProvider.tsx`](https://github.com/kadena-io/wallet-connect-example/blob/main/src/providers/ClientContextProvider.tsx#L69C6-L69C6)
2. Use `signWithWalletConnect` to request a signature from the wallet (`Transaction.tsx`)[https://github.com/kadena-io/wallet-connect-example/blob/2efc34296f845aea75f37ab401a5c49081f75b47/src/components/Transaction.tsx#L104]

# Using the commandBuilder

If you don't wish to generate JS code for your contracts, or use templates, you
still can use the commandBuilder to build a command, and then easily send it.

```ts
import { Pact } from '@kadena/client';

const client = getClient(
  'https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/8/pact',
);

const unsignedTransaction = Pact.builder
  .execute('(format "Hello {}!" [(read-msg "person")])')
  // add signer(s) if its required
  .addSigner('your-pubkey')
  // set chian id and sender
  .setMeta({ chainId: '8', sender: 'your-pubkey' })
  // set networkId
  .setNetworkId('mainnet01')
  // create transaction with hash
  .createTransaction();

// Send it or local it
client.local(unsignedTransaction);
client.submit(unsignedTransaction);
```

# Using FP approach

this library uses a couple of utility functions in order to create pactCommand
you can import those function from `@kadena/client/fp` if you need more
flexibility on crating command like composing command or lazy loading.

> See:
> [https://github.com/kadena-community/kadena.js/blob/main/packages/libs/client-examples/src/example-contract/transfer-fp.ts][23]
> and:
> [https://github.com/kadena-community/kadena.js/blob/main/packages/libs/client-examples/src/example-contract/compose-commands.ts][23]

## Send a request to the blockchain

The `@kadena/client` exports `getClient` function that comes with some utility
functions. this helpers calls pact api under the hood [Pactjs API][22].

- `local`,
- `submit` and
- `pollStatus`.
- `getStatus`
- `pollSpv`
- `getSpv`

`getClient` accepts the host url or the host url generator function that handel
url generating as pact is a multi chian network we need to change the url based
on that.

```ts
// we only want to send request to the chain 1 one the mainnet
const hostUrl = 'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/1/pact';
const client = getClient(hostUrl);
// we need more flexibility to call different chains or even networks, then functions
// extract networkId and chainId from the cmd part of the transaction and use the hostUrlGenerator to generate the url
const hostUrlGenerator = ({ networkId, chainId }) =>
  `https://api.chainweb.com/chainweb/0.0/${networkId}/chain/${chainId}/pact`;
const { local, submit, getStatus, pollStatus, getSpv, pollSpv } =
  getClient(hostUrlGenerator);
```

Probably the simplest call you can make is `describe-module`, but as this is not
on the `coin` contract, we have to trick Typescript a little:

> See:
> [https://github.com/kadena-community/kadena.js/blob/main/packages/libs/client-examples/src/example-contract/get-balance.ts][23]

```ts
const res = await local({
  payload: {
    exec: {
      code: Pact.modules.coin['get-balance']('albert'),
    },
  },
});
console.log(JSON.stringify(res, null, 2));
```

> **A more elaborate example** that includes signing, sending, **and polling**
> can be found here:
> [https://github.com/kadena-community/kadena.js/blob/main/packages/libs/client-examples/src/example-contract/transfer.ts][24]

## Further development

This is the launch post of `@kadena/client`. Next steps will be to see what the
community thinks of this approach. We'd love to hear your feedback and use
cases, especially when the current `@kadena/client` and `@kadena/pactjs-cli`
isn't sufficient.

## Contact the team

We try to be available via Discord and Github issues:

- [Github Issues][25]
- Discord in the [#kadena-js channel][25]

[1]:
  https://github.com/kadena-community/kadena.js/tree/main/packages/libs/client/etc/client.api.md
[2]: #contract-based-interaction-using-kadenaclient
[3]: #using-the-commandBuilder
[4]: #using-the-createPactCommand
[5]: #integrated-sign-request-to-chainweaver-desktop
[6]: #send-a-request-to-the-blockchain
[7]: #kadenajs---client
[8]: #release-kadenaclient
[9]: #prerequisites
[10]: #load-contracts-from-the-blockchain
[11]: #generate-interfaces-from-the-blockchain
[12]: #building-a-simple-transaction-from-the-contract
[13]: #manually-singing-the-transaction
[14]: #load-the-contract-repository
[15]: #generate-code-from-templates
[16]: #a-function-is-generated-from-a-template
[17]: #using-the-generated-code
[18]: #further-development
[19]: #contact-the-team
[20]:
  https://github.com/kadena-community/kadena.js/blob/main/packages/libs/client-examples/src/example-contract/simple-transfer.ts
[21]: https://kadena-io.github.io/signing-api/
[22]: https://api.chainweb.com/openapi/pact.html
[23]:
  https://github.com/kadena-community/kadena.js/blob/main/packages/libs/client-examples/src/example-contract/get-balance.ts
[24]:
  https://github.com/kadena-community/kadena.js/blob/main/packages/libs/client-examples/src/example-contract/transfer.ts
[25]: https://github.com/kadena-community/kadena.js/issues
