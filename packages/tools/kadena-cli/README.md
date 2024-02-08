<!-- genericHeader start -->

# @kadena/kadena-cli

<picture>
  <source srcset="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-white.png" media="(prefers-color-scheme: dark)"/>
  <img src="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-black.png" width="200" alt="kadena.js logo" />
</picture>

<!-- genericHeader end -->

- [@kadena/kadena-cli][1]
- [KADENA CLI][2]
  - [installation from brew][3]
  - [update from brew][4]
  - [list of commands][5]
    - [list of root commands and flags][6]
    - [Command specific help][7]
  - [Subjects][8]
  - [kda config][9]
  - [kda keys (kda tool)][10]
    - [kda keys create][11]
    - [kda keys list][12]
  - [kda tx][13]
  - [kda typescript][14]
    - [generate][15]
  - [kda contract][16]
    - [retrieve][17]
    - [deploy][18]
  - [kda account][19]
  - [kda devnet][20]
  - [kda marmalade][21]
  - [kda dapp][22]

<hr>

# KADENA CLI

Initial setup for Kadena CLI

This document is a representation of the features of kadena CLI, each feature is
linked to a scenario that fully displays each step that will be transformed into
commander steps This document is WIP.

Example code:

```ts
const { Command } = require('commander');
const program = new Command();

program
  .name('string-util')
  .description('CLI to some JavaScript string utilities')
  .version('0.8.0');

program
  .command('split')
  .description('Split a string into substrings and display as an array')
  .argument('<string>', 'string to split')
  .option('--first', 'display just the first substring')
  .option('-s, --separator <char>', 'separator character', ',')
  .action((str, options) => {
    const limit = options.first ? 1 : undefined;
    console.log(str.split(options.separator, limit));
  });

program.parse();
```

## installation from brew

```sh
brew install kda-cli
```

## update from brew

```sh
brew update kda-cli
```

## installation

To install the executable from this repo:

```sh
pnpm install
pnpm build --filter @kadena/kadena-cli

# make sure you're on the project's path
pnpm link -g
```

## list of commands

Each command can be made interactive by not filling in the flags. You can
prefill a question by filling the flag

### list of root commands and flags

|            | description                                                              |
| ---------- | ------------------------------------------------------------------------ |
| config     | configuration of the cli. E.g. network, config directory                 |
| update     | update the kda-cli itself                                                |
| --help     | display help information                                                 |
| --version  | display version information                                              |
| --\[no-]ci | disable all interactive questions (for use in CI) (KDA_CLI_CI_MODE=true) |

### Command specific help

To get help on a `subject` use `kda <subject> --help`

## Subjects

Each command is structured as
`kda <subject> [...<subject>] <verb> [--flags] [args]` apart from some root
level defaults.

Available subjects

| subject    | description                                                                     |
| ---------- | ------------------------------------------------------------------------------- |
| keys       | working with keys: generating, listing, disabling, removing                     |
| tx         | working with transactions: creating and filling templates, sending transactions |
| typescript | generation of type-definitions for client side projects                         |
| contract   | working with contracts: generate, retrieving from chain, deployment             |
| account    | working with any fungible account. Defaults to coin                             |
| devnet     | starting, stopping, restarting and configuring local devnet                     |
| marmalade  | working with NFTs                                                               |

## kda config

init creates a .kadena/ folder with a config.yaml containing the init command
ask for context / devnet/testnet/mainnet/local/custom | if already exists |
overwrite

| **Parameter** | **Description**            | **Required** | **Default value** |
| ------------- | -------------------------- | ------------ | ----------------- |
| init          | initialize default project | No           |                   |

---

example:

```yaml
profiles:
  default:
    private_key: 'efbadbadxx'
    public_key: 'badbadbadxx'
    account: 'k:xx'
    rest_url: 'https://devnet'
```

## kda keys (kda tool)

### kda keys create

| **Parameter** | **Description**                              | **Required** | **Default value** |
| ------------- | -------------------------------------------- | ------------ | ----------------- |
| hd            | HD Key Format                                | No           |                   |
|               | The second format is a 12-word recovery      |              |                   |
|               | phrase compatible with Chainweaver HD key    |              |                   |
|               | generation. This format consists of all 12   |              |                   |
|               | words on a single line, each word separated  |              |                   |
|               | by a single space.                           |              |                   |
|               | \[acid baby cage dad earn face gain hair ice |              |                   |
|               | jar keen lab]                                |              |                   |
|               |                                              |              |                   |
| plain         | plain The first is a plain ED25519 key       | No           |                   |
|               | format compatible with Pact which is a YAML  |              |                   |
|               | file with two fields: public and secret.     |              |                   |
|               | public: 40c1e2e86cc3974cc29b8953e....        |              |                   |
|               | secret: badbadbadbadbadbadbadbadba...        |              |                   |
| list-keys     | List available keys                          | No           |                   |

**Generate to file**

```sh
kda keys plain > filename.kda
```

### kda keys list

## kda tx

Sign and send

| **Parameter**   | **Description**                                       | **Required**          | **Default value** |
| --------------- | ----------------------------------------------------- | --------------------- | ----------------- |
| transfer        | Transfer                                              | No                    |                   |
| transfer-create | Transfer and create account when account non existent | No                    |                   |
| sign            |                                                       | Yes                   |                   |
| --combine-signs | Signatures from multiple wallets                      | When sign is provided |                   |
| --sign          | Sign transactions                                     | When sign is provided |                   |
| --wallet-sign   | Send transactions to a wallet for signing             | When sign is provided |                   |
| local           | Send transaction to /local                            |                       |                   |
| --preflight     | (true/false) run gas calculations                     |                       |                   |
| --verifySig     | (true/false) verify signatures                        |                       |                   |
| preflight       | (true/false) preflight and verifySig false            |                       |                   |
| send            | Send transactions the network /send                   |                       |                   |

## kda typescript

### generate

Generate Typescript definitions based on a contract

| **Parameter**        | **Description**                                                           | **Required**                | **Default value** |
| -------------------- | ------------------------------------------------------------------------- | --------------------------- | ----------------- |
| -c, --clean          | Clean existing generated files                                            | No                          |                   |
| -i, --caps-interface | Custom name for the interface of the caps. Can be used                    | No                          |                   |
|                      | to create a type definition with a limited set of capabilities.           |                             |                   |
| -f, --file           | Generate d.ts from Pact contract file                                     | If --contract is ommitted   |                   |
| --contract           | Generate d.ts from Pact contract from the blockchain                      | If --file is ommitted       |                   |
| --api                | The API to use for retrieving the contract                                | When --contract is provided |                   |
|                      | (e.g. [https://api.chainweb.com/chainweb/0.0/mainnet01/chain/8/pact][23]) |                             |                   |
| --chain              | The chainId to retrieve the contract from                                 | When --contract is provided | 0                 |
| --network            | The networkId to retrieve the contract from (e.g. testnet)                | When --contract is provided | mainnet           |

**Generate from file**

```sh
kda typescript generate --file ./myContract.pact
```

**Generate from chain**

```sh
kda typescript generate --contract free.coin --api https://api.chainweb.com/chainweb/0.0/mainnet01/chain/8/pact --chain 0 --network testnet04
```

## kda contract

Commands to work with smart-contracts

### retrieve

Retrieve a contract from an API using a /local call

| **Parameter** | **Description**                                                           | **Required** | **Default value**              |
| ------------- | ------------------------------------------------------------------------- | ------------ | ------------------------------ |
| retrieve      |                                                                           |              |                                |
| -m --module   | The module you want to retrieve (e.g. "coin")                             | Yes          |                                |
| -o, --out     | File to write the contract to (e.g. ./myContract.pact)                    | Yes          |                                |
| -a, --api     | API to fetch the contract from                                            | Yes          | [https://api.chainweb.com][24] |
|               | (e.g. [https://api.chainweb.com/chainweb/0.0/mainnet01/chain/8/pact][23]) |              |                                |
| -n, --network | Network to retrieve from (e.g. testnet)                                   | No           | mainnet                        |
| create        |                                                                           |              |                                |
| --principled  | create a smart contract on a principled namespace                         |              |                                |
| --keys        |                                                                           |              |                                |

### deploy

Deploy / upgrade a smart contract to chain x

| **Parameter** | **Description**                              | **Required**            | **Default value** |
| ------------- | -------------------------------------------- | ----------------------- | ----------------- |
| deploy        | deploy / upgrade a smart contract to chain x | Yes                     |                   |
| --chain       | select chain for deployment                  | When deploy is provided |                   |
| --env         | select chain for deployment                  | No                      | defaults to conf  |

Retrieve a contract from chain

```sh
kda contract --out ./myContract.pact
```

## kda account

Tasks to do with an account in a `fungible` smart contract. Defaults to `coin`
smart contract

| **Parameter** | **Description**                      | **Required** | **Default value** |
| ------------- | ------------------------------------ | ------------ | ----------------- |
| fund          | Fund an account in devnet or testnet | No           |                   |

## kda devnet

These tasks are from the kda-cli from kadena.js they need to be adjusted to the
new devnet interface

| **Parameter** | **Description** | **Required** | **Default value** |
| ------------- | --------------- | ------------ | ----------------- |
| rerun         | Rerun devnet    | No           |                   |
| start         | Start devnet    | No           |                   |
| stop          | Stop devnet     | No           |                   |

## kda marmalade

| **Parameter** | **Description**            | **Required**            | **Default value** |
| ------------- | -------------------------- | ----------------------- | ----------------- |
| mint          |                            | No                      |                   |
| --single      | Mint a single NFT          | When mint is provided   |                   |
| --collection  | Mint a collection of NFT's | When mint is provided   |                   |
| deploy        |                            | No                      |                   |
| --nftstorage  | Deploy to NFT storage      | When deploy is provided |                   |

## kda dapp

Tool to create a starter project with @kadena/client integration

It enables you to quickly start a new application that has Kadena Blockchain
integration set up and ready to go. The application supports Typescript and
makes use of `@kadena/client`

The application is backed by a [**smart contract**][23] written in Pact that is
included for convenience and also deployed on the Kadena Blockchain, so you have
a working application from the start.

The two most common blockchain use cases are covered in this starter app:

- Reading a message from the chain (requires no transaction).
- Writing a message on the chain, which includes signing and sending a
  transaction on chain and waiting for it to be mined.

[Chainweaver][24] is used for signing transactions, since it's the Official
Kadena wallet for advanced blockchain usage and smart contract development.

## Supported Templates

Create Kadena App supports a number of well known and widely used frameworks to
choose from when starting a new project. The following project templates are
currently available:

- [Nextjs][25]
- [Vuejs][26] - _(Under development, coming soon)_
- [Angular][27] - _(Under development, coming soon)_

Usage: kda dapp generate \[options]

\| **Parameter** | **Description** | **Required** | **Default value** | |
\-------------- | ----------------------- | ------------ | -----------------z |
| dapp | | Yes | | | -n, --name | Project name | No | | | -t, --template |
Project template to use | No | |

### Options:

- `name` determines the name of the project but also the folder on the
  filesystem that will contain the project. The same general operating system
  folder name rules apply and are being validated.
- `template` determines the template being used for the project that is being
  created. Valid values are:
  - nextjs
  - vuejs
  - angular
- `help` displays the help menu

## The Pact smart contract

The smart contract is called `cka-message-store` and can be found [here][28].
The folder contains two files `message-store.pact` which is the smart contract
written in Pact but also `message-store.repl` which contains a supporting test
suite. The contract is also deployed on testnet chain 0 as
`free.cka-message-store`.

The two main functions of the contract are `read-message` and `write-message`
which are shown below:

```pact
(defun read-message (account:string)
  "Read a message for a specific account"

  (with-default-read messages account
    { "message": "You haven't written any message yet" }
    { "message" := message }
    message
  )
)
```

Reading a message is unrestricted, so everyone can access the smart contract and
read the message a user has written, given the acount is provided.

```pact
(defun write-message (account:string message:string)
  "Write a message"

  (enforce (<= (length message) 150) "Message can be a maximum of 150 characters long")

  ;; Try to acquire the `ACCOUNT-OWNER` capability which checks
  ;; that the transaction owner is also the owner of the KDA account provided as parameter to our `write-messages` function.
  (with-capability (ACCOUNT-OWNER account)
    (write messages account { "message" : message })
  )
)
```

Writing a message is guarded by a capability `ACCOUNT-OWNER`, so only the
account owner kan write a message.

The contract contains a single table `messages` that stores the messages for all
users.

This readme doesn't aim to be a tutorial for Pact therefore we aren't going into
the complete details of the contract nor the Pact language. For more detailed
info on Pact development visit the **Build** section on [docs.kadena.io][29].

[1]: #kadenakadena-cli
[2]: #kadena-cli
[3]: #installation-from-brew
[4]: #update-from-brew
[5]: #list-of-commands
[6]: #list-of-root-commands-and-flags
[7]: #command-specific-help
[8]: #subjects
[9]: #kda-config
[10]: #kda-keys-kda-tool
[11]: #kda-keys-create
[12]: #kda-keys-list
[13]: #kda-tx
[14]: #kda-typescript
[15]: #generate
[16]: #kda-contract
[17]: #retrieve
[18]: #deploy
[19]: #kda-account
[20]: #kda-devnet
[21]: #kda-marmalade
[22]: #kda-dapp
[23]: ##The-Pact-smart-contract
[24]: https://docs.kadena.io/basics/chainweaver/chainweaver-user-guide
[25]: https://nextjs.org/
[26]: https://vuejs.org/
[27]: https://angular.io/
[28]:
  https://github.com/kadena-community/kadena.js/tree/main/packages/tools/create-kadena-app/pact
[29]: https://docs.kadena.io/
