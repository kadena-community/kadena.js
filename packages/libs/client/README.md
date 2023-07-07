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
2.  [template based][3]
3.  [modular pact command][4]

There's also information on an [integrated way of signing using Chainweaver][5].
With `@kadena/client` you can also [send a request to the blockchain][6]. That's
covered in this article. We'll also be exploring the concepts and rationale of
`@kadena/client`.

- [@kadena/client](#kadenaclient)
  - [Release @kadena/client](#release-kadenaclient)
  - [Prerequisites](#prerequisites)
- [Contract-based interaction using @kadena/client](#contract-based-interaction-using-kadenaclient)
    - [Load contracts from the blockchain](#load-contracts-from-the-blockchain)
    - [Generate interfaces](#generate-interfaces)
  - [Building a simple transaction from the contract](#building-a-simple-transaction-from-the-contract)
    - [Manually signing the transaction](#manually-signing-the-transaction)
  - [Integrated sign request to Chainweaver desktop](#integrated-sign-request-to-chainweaver-desktop)
  - [Template based interaction using @kadena/client](#template-based-interaction-using-kadenaclient)
    - [Load the contract repository](#load-the-contract-repository)
    - [Generate code from templates](#generate-code-from-templates)
    - [A function is generated from a template](#a-function-is-generated-from-a-template)
    - [Using the generated code](#using-the-generated-code)
- [Using the fluentBuilder](#using-the-fluentbuilder)
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

### Load contracts from the blockchain

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

### Generate interfaces

Using the contract we'll now generate all the functions (`defun`s) with their
(typed) arguments and the capabilities (`defcap`s).

```sh
pactjs contract-generate --file "./contracts/coin.module.pact"
```

or generating type directly from a contract on the blockchain

```bash
pactjs contract-generate --contract "coin" --api "https://api.chainweb.com/chainweb/0.0/mainnet01/chain/1/pact"
```

The log shows what has happened. Inside the `node_modules` directory, a new
package has been created: `.kadena/pactjs-generated`. This package is referenced
by `@kadena/client` to give you type information.

> **NOTE:** do not forget to add this `"types": [".kadena/pactjs-generated"],`
> to `compilerOptions` in `tsconfig.json`. Otherwise this will not work

## Building a simple transaction from the contract

> Take a look at
> [https://github.com/kadena-community/kadena.js/blob/main/packages/libs/pactjs-test-project/src/example-contract/simple-transfer.ts][20]
> for the full example

Now that everything is bootstrapped, we can start building transactions.

Create a new file and name it `transfer.ts` (or `.js`).

```ts
import { Pact } from '@kadena/client';

const unsignedTransaction = Pact.command
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

### Manually signing the transaction

the unsignedTransaction can be pasted into the `SigData` of Chainweaver.

Take note of the following:

- `createTransaction()` will **finalize** the transaction. The hash will be
  calculated. In further versions we will invalidate the hash and the command
  that's been generated on the transaction when `addSigner`, `setMeta` or other
  changes are made to the transaction

## Integrated sign request to Chainweaver desktop

Using the `transaction` we can send a sign-request to Chainweaver. **(NB: this
can only with the desktop version, not the web-version, as it's [exposing port
9467][21]**

> **Note**\
> In the future we will provide an interface with WalletConnect. This is not yet
> finalized. Once it is, we'll update the `@kadena/client` accordingly

```ts
import { signWithChainweaver } from '@kadena/client';

// use the finalized transaction, and sign it with Chainweaver
const signedTransaction = signWithChainweaver(unsignedTransaction)
  .then(console.log)
  .catch(console.error);
```

> To **send** the transaction to the blockchain, continue with [**Send a request
> to the blockchain**][6]

## Template based interaction using @kadena/client

To provide contract-developers a way to communicate how their contracts should
be used, we added a way to get autocompletion for templates. Contract-developers
can now provide their contracts that consumers of their smart-contract can use
in Javascript.

### Load the contract repository

For now we have not added a way to directly generate the code from a remote git
repository. Cloning the template repository as a submodule is a great option.
This gives you a way to version the source of the templates.

```sh
git submodule add \
  git@github.com:kadena-community/kadena-coin-templates.git \
  ./templates/
```

Useful `git submodule` commands

- Add a Git repository as a submodule:\
  `git submodule add repository_url`

- Add a Git repository as a submodule at the specified directory:\
  `git submodule add repository_url path/to/directory`

- Update every submodule to its latest commit:\
  `git submodule foreach git pull`

- Install a repository's specified submodules (after cloning the repo):\
  `git submodule update --init --recursive`

### Generate code from templates

Usually a template directory/repository contains multiple templates, but they're
all from the same source. So we're grouping them per directory/repository. This
is done by selecting the directory as input for the command.

This command will result in one file containing all the templates.

```sh
pactjs template-generate --file ./templates/kadena-coin-templates/ --out ./generated/kadena-coin-templates.ts
```

Notes on the input (`--file`) and output (`--out`):

- `-f, --file`
  - selecting a file as input will create ONLY code for that file
  - selecting a directory as input will create code for ALL the templates in the
    directory
- `-o, --out`
  - when the output is a file, the code for the templates will end up in that
    file
  - when the output is a directory, an `index.ts` will be created in that
    directory, containing the code for the templates

### A function is generated from a template

Each file in the repository is converted to a function that can be called. The
function has one argument; an object that contains named key-value pairs for
each variable in the template.

For example, a bogus template that looks like this

```txt
# ./hello.txt
This is a Hello, {{name}}!
```

Will have it's function call:

```ts
import myTemplates from './myTemplates';

myTemplates.hello({ name: 'alber70g' });
```

Of course this isn't a valid template to be used as a transaction, so this won't
work. This outlines the general idea of how templates are used.

### Using the generated code

Let's say we're using this template. Templates **aren't** valid `yaml`. They are
however checked to be valid transactions when used as templates.

```txt
code: |-
  (coin.transfer "{{fromAcct}}" "{{toAcct}}" {{amount}})
data:
publicMeta:
  chainId: '{{chain}}'
  sender: {{fromAcct}}
  gasLimit: 2500
  gasPrice: 1.0e-8
  ttl: 600
networkId: {{network}}
signers:
  - pubKey: {{fromKey}}
    caps:
      - name: 'coin.TRANSFER'
        args: [{{fromAcct}}, {{toAcct}}, {{amount}}]
      - name: 'coin.GAS'
        args: []
type: exec
```

Each of the `{{name}}`s are variables that can be passed to the template
function.

The function returns a `CommandBuilder`, this can be used to add metadata to the
transaction and to `signWithChainweaver(unsignedTx)` [as shown here][5]

```ts
import kadenaCoinTemplates from './templates/kadena-coin-templates';

// this returns a transactionBuilder
const transactionBuilder = kadenaCoinTemplates['safe-transfer']({
  fromAcct: 'k:sender-pubkey',
  toAcct: 'k:receiver-pubkey',
  fromKey: 'sender-pubkey',
  amount: '231',
  chain: '1',
  network: 'mainnet01',
});

const unsignedTransaction = transactionBuilder.createTransaction();
```

# Using the fluentBuilder

If you don't wish to generate JS code for your contracts, or use templates, you
still can use the commandBuilder to build a command, and then easily send it.

```ts
import { Pact } from '@kadena/client';

const client = getClient(
  'https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/8/pact',
);

const unsignedTransaction = Pact.command
  .execute('(format "Hello {}!" [(read-msg "person")])')
  // as signer if its required
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

## Send a request to the blockchain

The `@kadena/client` exports `getClient` function that comes with some utility
functions. this helpers eventually calls pact api [Pactjs API][22].

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
// extract networkId and chainId from the cmd part of a transaction and use the hostUrlGenerator to generate the url
const hostUrlGenerator = (networkId, chainId) =>
  `https://api.chainweb.com/chainweb/0.0/${networkId}/chain/${chainId}/pact`;
const { local, submit, getStatus, pollStatus, getSpv, pollSpv } =
  getClient(hostUrlGenerator);
```

Probably the simplest call you can make is `describe-module`, but as this is not
on the `coin` contract, we have to trick Typescript a little:

> See:
> [https://github.com/kadena-community/kadena.js/blob/main/packages/libs/pactjs-test-project/src/example-contract/get-balance.ts][23]

```ts
const res = await local({
  payload: {
    exec:{
      code: Pact.modules.coin.['get-balance']("albert"),
    },
  },
});
console.log(JSON.stringify(res, null, 2));
```

> **A more elaborate example** that includes signing, sending, **and polling**
> can be found here:
> [https://github.com/kadena-community/kadena.js/blob/main/packages/libs/pactjs-test-project/src/example-contract/transfer.ts][24]

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
[3]: #template-based-interaction-using-kadenaclient
[4]: #using-the-pactcommand-class
[5]: #integrated-sign-request-to-chainweaver-desktop
[6]: #send-a-request-to-the-blockchain
[7]: #kadenajs---client
[8]: #release-kadenaclient
[9]: #prerequisites
[10]: #load-contracts-from-the-blockchain
[11]: #generate-interfaces
[12]: #building-a-simple-transaction-from-the-contract
[13]: #manually-singing-the-transaction
[14]: #load-the-contract-repository
[15]: #generate-code-from-templates
[16]: #a-function-is-generated-from-a-template
[17]: #using-the-generated-code
[18]: #further-development
[19]: #contact-the-team
[20]:
  https://github.com/kadena-community/kadena.js/blob/main/packages/libs/pactjs-test-project/src/example-contract/simple-transfer.ts
[21]: https://kadena-io.github.io/signing-api/
[22]: https://api.chainweb.com/openapi/pact.html
[23]:
  https://github.com/kadena-community/kadena.js/blob/main/packages/libs/pactjs-test-project/src/example-contract/get-balance.ts
[24]:
  https://github.com/kadena-community/kadena.js/blob/main/packages/libs/pactjs-test-project/src/example-contract/transfer.ts
[25]: https://github.com/kadena-community/kadena.js/issues
