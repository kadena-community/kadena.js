<!-- genericHeader start -->

# @kadena/kadena-cli

<picture>
  <source srcset="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-white.png" media="(prefers-color-scheme: dark)"/>
  <img src="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-black.png" width="200" alt="kadena.js logo" />
</picture>

<!-- genericHeader end -->

<hr>

# KADENA CLI

Initial setup for Kadena CLI

This document is a representation of the features of kadena CLI, each feature is linked to a scenario that fully displays each step that will be transformed into commander steps
This document is WIP.

Example code:

```code
const { Command } = require('commander');
const program = new Command();

program
  .name('string-util')
  .description('CLI to some JavaScript string utilities')
  .version('0.8.0');

program.command('split')
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

```bash
brew install kda-cli
```

## update from brew

```bash
brew update kda-cli
```

## list of commands

## kda help

- displays help instructions

## kda version

- displays cli version information

## kda config

init creates a .kadena/ folder with a config.yaml containing
the init command ask for context / devnet/testnet/mainnet/local/custom | if already exists | overwrite

| **Parameter** | **Description**            | **Required** | **Default value** |
| ------------- | -------------------------- | ------------ | ----------------- |
| -init         | initialise default project | No           |                   |

---

example:

```yaml
profiles:
  default:
    private_key: "efbadbadxx"
    public_key: "badbadbadxx"
    account: "k:xx"
    rest_url: "https://devnet"
```

## kda keys (kda tool)

| **Parameter** | **Description**                             | **Required** | **Default value** |
| ------------- | ------------------------------------------- | ------------ | ----------------- |
| -hd           | HD Key Format                               | No           |                   |
|               | The second format is a 12-word recovery     |              |                   |
|               | phrase compatible with Chainweaver HD key   |              |                   |
|               | generation. This format consists of all 12  |              |                   |
|               | words on a single line, each word separated |              |                   |
|               | by a single space.                          |              |                   |
|               | [acid baby cage dad earn face gain hair ice |              |                   |
|               | jar keen lab]                               |              |                   |
|               |                                             |              |                   |
| -plain        | plain The first is a plain ED25519 key      | No           |                   |
|               | format compatible with Pact which is a YAML |              |                   |
|               | file with two fields: public and secret.    |              |                   |
|               | public: 40c1e2e86cc3974cc29b8953e....       |              |                   |
|               | secret: badbadbadbadbadbadbadbadba...       |              |                   |
| -list-keys    | List available keys                         | No           |                   |

**Generate from file**

```bash
kda keys plain > filename.kda
```

## kda deploy

Deploy / upgrade a smart contract to chain x

| **Parameter** | **Description**                              | **Required**             | **Default value** |
| ------------- | -------------------------------------------- | ------------------------ | ----------------- |
| -deploy       | deploy / upgrade a smart contract to chain x | Yes                      |                   |
| --chain       | select chain for deployment                  | When -deploy is provided |                   |
| --env         | select chain for deployment                  | No                       | defaults to conf  |

## kda tx

### generate

Generate client based on a contract

| **Parameter**    | **Description**                                       | **Required**           | **Default value** |
| ---------------- | ----------------------------------------------------- | ---------------------- | ----------------- |
| -transfer        | Transfer                                              | No                     |                   |
| -transfer-create | Transfer and create account when account non existent | No                     |                   |
| -sign            | Generate d.ts from Pact contract file                 | Yes                    |                   |
| --combine-signs  | Signatures from multiple wallets                      | When -sign is provided |                   |
| --sign           | Sign transactions                                     | When -sign is provided |                   |
| --wallet-sign    | Send transactions to a wallet for signing             | When -sign is provided |                   |

## kda typescript

### generate

Generate client based on a contract

| **Parameter**        | **Description**                                                                                                        | **Required**                | **Default value** |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------- | --------------------------- | ----------------- |
| -c, --clean          | Clean existing generated files                                                                                         | No                          |                   |
| -i, --caps-interface | Custom name for the interface of the caps. Can be used to create a type definition with a limited set of capabilities. | No                          |                   |
| -f, --file           | Generate d.ts from Pact contract file                                                                                  | If --contract is ommitted   |                   |
| --contract           | Generate d.ts from Pact contract from the blockchain                                                                   | If --file is ommitted       |                   |
| --api                | The API to use for retrieving the contract (e.g. [https://api.chainweb.com/chainweb/0.0/mainnet01/chain/8/pact][1])    | When --contract is provided |                   |
| --chain              | The chainId to retrieve the contract from                                                                              | When --contract is provided | 0                 |
| --network            | The networkId to retrieve the contract from (e.g. testnet)                                                             | When --contract is provided | mainnet           |

**Generate from file**

```bash
kda typescript generate --file ./myContract.pact
```

**Generate from chain**

```bash
kda typescript generate --contract free.coin --api https://api.chainweb.com/chainweb/0.0/mainnet01/chain/8/pact --chain 0 --network testnet04
```

### retrieve-contract

Retrieve a contract from an API using a /local call

| **Parameter** | **Description**                                                                                         | **Required** | **Default value**             |
| ------------- | ------------------------------------------------------------------------------------------------------- | ------------ | ----------------------------- |
| -m --module   | The module you want to retrieve (e.g. "coin")                                                           | Yes          |                               |
| -o, --out     | File to write the contract to (e.g. ./myContract.pact)                                                  | Yes          |                               |
| -a, --api     | API to fetch the contract from (e.g. [https://api.chainweb.com/chainweb/0.0/mainnet01/chain/8/pact][1]) | Yes          | [https://api.chainweb.com][2] |
| -n, --network | Network to retrieve from (e.g. testnet)                                                                 | No           | mainnet                       |

Retrieve a contract from chain

```bash
kda typescript retrieve-contract --out ./myContract.pact
```

## kda localdev

These tasks are from the kda-cli from kadena.js they need to be adjusted to the new localdev interface

| **Parameter** | **Description** | **Required** | **Default value** |
| ------------- | --------------- | ------------ | ----------------- |
| -rerun        | Rerun devnet    | No           |                   |
| -start        | Start devnet    | No           |                   |
| -stop         | Stop devnet     | No           |                   |
| -fund         | Fund devnet     | No           |                   |
| -deploy       | Deploy devnet   | No           |                   |

## kda marmalade

| **Parameter** | **Description**            | **Required**             | **Default value** |
| ------------- | -------------------------- | ------------------------ | ----------------- |
| -mint         |                            | No                       |                   |
| --single      | Mint a single NFT          | When -mint is provided   |                   |
| --collection  | Mint a collection of NFT's | When -mint is provided   |                   |
| -deploy       |                            | No                       |                   |
| --nftstorage  | Deploy to NFT storage      | When -deploy is provided |                   |
