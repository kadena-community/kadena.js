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

## Package @kadena/client

`@kadena/client` allows JavaScript/TypeScript users to easily interact with the
Kadena Blockchain.

### Readme for @kadena/client\@1.0.0.alpha.1

This is the README for @kadena/client\@1.0.0.alpha.1 that introduces a new API\
To read the README for the old API (< 0.6.1) read [client_v0.6.1/packages/libs/client/README.md][2]

## Getting started

### Transaction building

Interaction with the Kadena Blockchain works in various ways. In
`@kadena/client` we expose a [ **builder** pattern ][3] and a [ **functional**
pattern ][4]. They can both be used with or without the use of type-definitions,
but it's recommended to use the type definitions that you can [generate with the
`@kadena/pactjs-cli`][5]

### Signing

There's also information on an [integrated way of signing using Chainweaver][6].
With `@kadena/client` you can also [send a request to the blockchain][7]. That's
covered in this article. We'll also be exploring the concepts and rationale of
`@kadena/client`.

- [@kadena/client][8]
  - [Package @kadena/client][9]
    - [Readme for @kadena/client@1.0.0.alpha.1][10]
  - [Getting started][11]
    - [Transaction building][12]
    - [Signing][13]
  - [Prerequisites][14]
- [Contract-based interaction using @kadena/client][15]
  - [Generate interfaces from the blockchain][5]
    - [Generate interfaces locally][16]
  - [Downloading contracts from the blockchain][17]
  - [Building a simple transaction from the contract][18]
    - [Notes][19]
  - [Signing][20]
    - [Manually signing the transaction][21]
    - [Integrated sign request to Chainweaver desktop][6]
    - [Signing with a WalletConnect compatible wallet][22]
- [Using the commandBuilder][3]
- [Using FP approach][4]
  - [Send a request to the blockchain][7]
  - [Further development][23]
  - [Contact the team][24]

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
used by `@kadena/client`. You can use smart contracts from the blockchain or
your own local ones.

For the **template based interaction** we will provide a repository with
templates that can be used.

### Generate interfaces from the blockchain

Generate types directly from a contract on the blockchain:

```sh
pactjs contract-generate --contract "coin" --api "https://api.chainweb.com/chainweb/0.0/mainnet01/chain/1/pact"
```

The log shows what has happened. Inside the `node_modules` directory, a new
package has been created: `.kadena/pactjs-generated`. This package is referenced
by `@kadena/client` to give you type information.

Now you can use this by [creating a transaction that calls a smart contract
function][18].

**NOTE:** Make sure to add the new `types` to `compilerOptions` in
`tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": [".kadena/pactjs-generated"]
  }
}
```

#### Generate interfaces locally

You can create your own smart contract or [download it from the blockchain][17]
using `pactjs`.

Using the contract we'll now generate all the functions (`defun`) with their
(typed) arguments and capabilities (`defcap`).

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

Use `--help` to get information on `retrieve-contract`:

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

Take a look at
[https://github.com/kadena-community/kadena.js/blob/main/packages/libs/client-examples/src/example-contract/simple-transfer.ts][25]
for a complete example.

Now that everything is bootstrapped, we can start building transactions.

Create a new file and name it `transfer.ts` (or `.js`):

```ts
import { Pact } from '@kadena/client';

const unsignedTransaction = Pact.builder
  .execution(
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

### Notes

- Namespaced arguments (`k:`, `w:` etc) are account names, where non-namespaced
  arguments are assumed to be public keys.
- The contract doesn't specify whether you need to pass an **account name** or
  **public key**. This is knowledge that can be obtained by inspecting the
  contract downloaded earlier or consulting the documentation for the contract.
- The `addSigner` function accepts the `public-key` of the signer and let signer
  add the capabilities they want to sign for. Note that `coin.GAS` doesn't have
  any arguments, but `coin.TRANSFER` does.
- The `setMeta` argument object has a `sender` property. This is a `public-key`
  and could be gas station address in some scenarios.
- To add an **Unrestricted Signer** ([Unscoped Signature][26]), call `addSigner`
  without extra arguments

## Signing

Signing can be done in various ways. Either manually, by signing the hash of the
transaction or with a wallet. There's currently two options in `@kadena/client`
to sign with a wallet:

1.  [WalletConnect (preferred)][22]
2.  [Chainweaver][6]

### Manually signing the transaction

The unsignedTransaction can be pasted into the `SigData` of Chainweaver.

The `createTransaction` function will return the transaction. The hash will be
calculated and the command will be serialized.

### Integrated sign request to Chainweaver desktop

Using the `transaction` we can send a sign request to Chainweaver.

**Note:** This can only be done using the desktop version, not the web version,
as it's [exposing port 9467][27].

```ts
import { signWithChainweaver } from '@kadena/client';

// use the transaction, and sign it with Chainweaver
const signedTransaction = signWithChainweaver(unsignedTransaction)
  .then(console.log)
  .catch(console.error);
```

> To **send** the transaction to the blockchain, continue with [**Send a request
> to the blockchain**][7]

### Signing with a WalletConnect compatible wallet

There's several steps to setup a WalletConnect connections and sign with
WalletConnect.

1.  Setting up the connection using [`ClientContextProvider.tsx`][28]
2.  Use `signWithWalletConnect` to request a signature from the wallet
    (`Transaction.tsx`)\[[https://github.com/kadena-io/wallet-connect-example/blob/2efc34296f845aea75f37ab401a5c49081f75b47/src/components/Transaction.tsx#L104][29]]

# Using the commandBuilder

You may prefer to not generate JavaScript code for your contracts or use
templates. In that case, you can use the `commandBuilder` function to build a
command and submit the transaction yourself:

```ts
import { Pact } from '@kadena/client';

const client = getClient(
  'https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/8/pact',
);

const unsignedTransaction = Pact.builder
  .execution('(format "Hello {}!" [(read-msg "person")])')
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

This library uses a couple of utility functions in order to create pactCommand
you can import those function from `@kadena/client/fp` if you need more
flexibility on crating command like composing command or lazy loading.

Here are two examples to demonstrate this:

- [example-contract/functional/transfer-fp.ts][30]
- [example-contract/functional/compose-commands.ts][31]

## Send a request to the blockchain

The `@kadena/client` provides a `getClient` function with some utility
functions. this helpers calls pact api under the hood [Pactjs API][32].

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

Also see [example-contract/get-balance.ts][33].

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

A more elaborate example that includes signing, sending **and polling** can be
found in [example-contract/transfer.ts][34]

## Further development

The `@kadena/client` is still in an early phase. Next steps will include to see
what the community thinks of this approach. We'd love to hear your feedback and
use cases, especially if the current `@kadena/client` and `@kadena/pactjs-cli`
isn't sufficient.

## Contact the team

We are available via Discord and Github issues:

- [Github Issues][35]
- Discord in the [#kadena-js channel][36]

[1]:
  https://github.com/kadena-community/kadena.js/tree/main/packages/libs/client/etc/client.api.md
[2]:
  https://github.com/kadena-community/kadena.js/blob/%40kadena/client_v0.6.1/packages/libs/client/README.md
[3]: #using-the-commandbuilder
[4]: #using-fp-approach
[5]: #generate-interfaces-from-the-blockchain
[6]: #integrated-sign-request-to-chainweaver-desktop
[7]: #send-a-request-to-the-blockchain
[8]: #kadenaclient
[9]: #package-kadenaclient
[10]: #readme-for-kadenaclient100alpha1
[11]: #getting-started
[12]: #transaction-building
[13]: #signing
[14]: #prerequisites
[15]: #contract-based-interaction-using-kadenaclient
[16]: #generate-interfaces-locally
[17]: #downloading-contracts-from-the-blockchain
[18]: #building-a-simple-transaction-from-the-contract
[19]: #notes
[20]: #signing-1
[21]: #manually-signing-the-transaction
[22]: #signing-with-a-walletconnect-compatible-wallet
[23]: #further-development
[24]: #contact-the-team
[25]:
  https://github.com/kadena-community/kadena.js/blob/main/packages/libs/client-examples/src/example-contract/simple-transfer.ts
[26]:
  https://pact-language.readthedocs.io/en/stable/pact-reference.html?highlight=signer#signature-capabilities
[27]: https://kadena-io.github.io/signing-api/
[28]:
  https://github.com/kadena-io/wallet-connect-example/blob/main/src/providers/ClientContextProvider.tsx#L69C6-L69C6
[29]:
  https://github.com/kadena-io/wallet-connect-example/blob/2efc34296f845aea75f37ab401a5c49081f75b47/src/components/Transaction.tsx#L104
[30]:
  https://github.com/kadena-community/kadena.js/blob/main/packages/libs/client-examples/src/example-contract/functional/transfer-fp.ts
[31]:
  https://github.com/kadena-community/kadena.js/blob/main/packages/libs/client-examples/src/example-contract/functional/compose-commands.ts
[32]: https://api.chainweb.com/openapi/pact.html
[33]:
  https://github.com/kadena-community/kadena.js/blob/main/packages/libs/client-examples/src/example-contract/get-balance.ts
[34]:
  https://github.com/kadena-community/kadena.js/blob/main/packages/libs/client-examples/src/example-contract/transfer.ts
[35]: https://github.com/kadena-community/kadena.js/issues
[36]: https://discord.com/channels/502858632178958377/1001088816859336724
