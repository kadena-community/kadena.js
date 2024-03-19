<!-- genericHeader start -->

# @kadena/kadena-cli

<picture>
  <source srcset="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-white.png" media="(prefers-color-scheme: dark)"/>
  <img src="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-black.png" width="200" alt="kadena.js logo" />
</picture>

<!-- genericHeader end -->

- [@kadena/kadena-cli](#kadena/kadena-cli)
- [KADENA CLI](#kadena-cli)
  - [installation from npm](#installation-from-npm)
  - [list of commands](#list-of-commands)
    - [list of root commands and flags](#list-of-root-commands-and-flags)
    - [Command specific help](#command-specific-help)
  - [Subjects](#subjects)
  - [kadena config](#kadena-config)
  - [kadena network](#kadena-network)
  - [kadena wallet](#kadena-wallet)
  - [kadena key](#kadena-key)
  - [kadena account](#kadena-account)
  - [kadena tx](#kadena-tx)
  - [kadena dapp](#kadena-dapp)
  - [Supported Templates](#supported-templates)

<hr>

# KADENA CLI

The Kadena CLI embodies our commitment to simplicity, power, and flexibility for
developers. It's crafted to streamline your development process, offering direct
and efficient access to Kadena's blockchain capabilities. This tool caters to
the pragmatic needs of developers by providing a straightforward, command-line
interface that integrates seamlessly into your workflow, allowing you to focus
on building robust, innovative applications without the overhead of unnecessary
complexity. Our philosophy centers on empowering developers with the tools they
need to unlock the full potential of the kadena blockchain, in a clear and
concise manner.

# KADENA GUIDE

Command Line Interface

Welcome to the Kadena CLI guide, your all-encompassing manual for mastering the
Kadena command-line interface. This document is designed to unveil the full
suite of commands available through Kadena CLI, providing you with the insights
necessary to harness its potential fully.

Kadena CLI has one primary entry-point command: kadena, dedicated to application
development, offering tools and commands tailored for building and managing
Kadena-based applications.

## installation from npm

```npm
npm install -g @kadena/kadena-cli
```

## installation from pnpm

```pnpm
pnpm install -g @kadena/kadena-cli
```

## list of commands

Each command can be made interactive by not filling in the flags. You can
prefill a question by filling the flag

### list of root commands and flags

|           | description                 |
| --------- | --------------------------- |
| --help    | display help information    |
| --version | display version information |

### list global commands and flags

|         | description                                       |
| ------- | ------------------------------------------------- |
| --quiet | Eliminating interactive prompts and confirmations |

## Quiet Mode

The Quiet Mode feature of the Kadena CLI can be used to streamline the
automation of tasks, specifically targeting environments where interactive input
is impractical, such as continuous integration (CI) systems. By activating Quiet
Mode, the CLI suppresses interactive prompts and skips confirmations, allowing
commands to execute uninterrupted. This mode ensures that automated processes
can run smoothly and efficiently, without the need for manual intervention.

```
kadena [command] --quiet
kadena [command] -q
```

---

## Legacy Mode

Legacy Mode offers a bridge for users requiring compatibility with the
previously used crypto algo, particularly for commands related to wallets, keys,
and transactions. This mode ensures the output format aligns with earlier
standards, facilitating seamless integration with existing workflows and tools
such as Chainweaver. It's especially useful when interacting with systems that
rely on the legacy format for processing or when maintaining backward
compatibility is critical.

Legacy mode is available for:

```
kadena wallet add
kadena keys generate
kadena tx sign
```

```
kadena [command] --legacy
```

---

### Command specific help

To get help on a `subject` use `kadena <subject> --help`

## Subjects

Each command is structured as
`kadena <subject> [...<subject>] <verb> [--flags] [args]` apart from some root
level defaults.

Available subjects

| subject | description                                                     |
| ------- | --------------------------------------------------------------- |
| network | Tool to add and manage networks                                 |
| account | Tool to manage / fund accounts of fungibles (e.g 'coin')        |
| key     | Tool to generate and manage random keys                         |
| wallet  | Tool to generate / manage wallets and generate keys from wallet |
| tx      | Tool for creating and managing transactions                     |
| dapp    | Tool for managing dapp projects                                 |

---

## kadena config

Tool for setting up and managing the CLI configuration

init creates a .kadena/ folder with default networks devnet/mainnet/testnet

| **Subcommand** | **Description**            | **Default value** |
| -------------- | -------------------------- | ----------------- |
| init           | initialize default project |                   |

---

## kadena network

Tool to add and manage networks

| **Subcommand** | **Description**             | **Default value** |
| -------------- | --------------------------- | ----------------- |
| list           | List all available networks |                   |
| update         | Manage networks             |                   |
| add            | Add new network             |                   |
| delete         | Delete existing network     |                   |

---

```
kadena network update [arguments]
```

| **Arguments & Options** | **Description**                         | **Required**  |
| ----------------------- | --------------------------------------- | ------------- |
| --network-name          | Update the name of the network          |               |
| --network-id            | Update the id of the network            |               |
| --network-host          | Update the host for the network         |               |
| --network-explorer-url  | Update the explorer url for the network |               |

example:

```
kadena networks update --network-name="mainnet" --network-id="mainnet01" --network-host="https://api.chainweb.com" --network-explorer-url="https://explorer.chainweb.com/mainnet/tx/
```

---

```
kadena networks add [arguments]
```

| **Arguments & Options** | **Description**                      | **Required**  |
| ----------------------- | ------------------------------------ | ------------- |
| --network-name          | Set the name of the network          |               |
| --network-id            | Set the id of the network            |               |
| --network-host          | Set the host for the network         |               |
| --network-explorer-url  | Set the explorer url for the network |               |
| --network-overwrite     | Confirm overwrite configuration      |               |

example:

```
kadena network add --network-name="mainnet" --network-id="mainnet01" --network-host="https://api.chainweb.com" --network-explorer-url="https://explorer.chainweb.com/mainnet/tx/ --network-overwrite="yes"
```

---

```
kadena networks delete [arguments]
```

| **Arguments & Options** | **Description**                  | **Required** |
| ----------------------- | -------------------------------- | ------------ |
| --network               | Select name of network to delete |              |
| --network-delete        | Confirm deletion of network      |              |

example:

```
kadena network delete --network="mainnet" --network-delete="yes"
```

---

## kadena wallet

Tool to generate and manage wallets

| **Subcommand**  | **Description**                                     | **Default value** |
| --------------- | --------------------------------------------------- | ----------------- |
| add             | Add a new local wallet                              |                   |
| import          | Import ( restore ) wallet from mnemonic phrase      |                   |
| generate-keys   | Generate public/secret key pair(s) from your wallet |                   |
| change-password | Update the password for your wallet                 |                   |
| delete          | Delete existing wallet from local filesystem        |                   |
| list            | List wallets(s)                                     |                   |

---

```
kadena wallet add [arguments]
```

| **Arguments & Options**    | **Description**                                | **Required** |
| -------------------------- | ---------------------------------------------- | ------------ |
| --wallet-name              | Set the name of the wallet                     |              |
| --security-password        | Set the password for the wallet                |              |
| --security-verify-password | Set the password for the wallet (verification) |              |
| --legacy                   | Generate legacy wallet                         |              |

example:

```
kadena wallet add --wallet-name="kadenawallet" --security-password=1245678 --security-verify-password=1245678
```

password will be hidden after entry: --security-password=\*
--security-verify-password=\*

---

```
kadena wallet import [arguments]
```

| **Arguments & Options**    | **Description**                                | **Required** |
| -------------------------- | ---------------------------------------------- | ------------ |
| --key-mnemonic             | 12 word mnemnoc phrase                         |              |
| --security-new-password    | Set the password for the wallet                |              |
| --security-verify-password | Set the password for the wallet (verification) |              |
| --wallet-name              | Set the name of the wallet                     |              |
| --legacy                   | Use Chainweaver's key derivation               |              |

example:

```
kadena wallet import-wallet --key-mnemonic="male more sugar violin accuse panel kick nose sign alarm stool inmate" --security-new-password=12345678 --security-verify-password=12345678 --key-wallet="mywalletname"
```

password will be hidden after entry: --security-new-password=\*
--security-verify-password=\*

---

```
kadena wallet generate-keys [arguments]
```

Generate a keypair from a wallet mnemonic

| **Arguments & Options** | **Description**                                                                     | **Required** |
| ----------------------- | ----------------------------------------------------------------------------------- | ------------ |
| --wallet-name           | Provide the name of the wallet                                                      |              |
| --key-index-or-range    | Set index or range of indices for key generation (e.g., 5 or 1-5)                   |              |
| --security-password     | Set the password for the wallet                                                     |              |
| --key-gen-from-choice   | Select generation type: genPublicKey (publicKey only), genPublicSecretKey           |              |
|                         | (publickey and secretKey), genPublicSecretKeyDec (publicKey and SecretKey Decrypted |              |

example generating public keys using a range

```
kadena wallet add --wallet-name="kadenawallet.wallet" --key-index-or-range="0-5" --key-gen-from-choice="genPublicKey" --key-alias="myalias" --security-password=12345678
```

example generating a public key using a index

```
kadena wallet add --wallet-name="kadenawallet.wallet" --key-index-or-range="0" --key-gen-from-choice="genPublicKey" --key-alias="myalias" --security-password=12345678
```

example generating a public and secret key using a index

```
kadena wallet add --wallet-name="kadenawallet.wallet" --key-index-or-range="0" --key-gen-from-choice="genPublicSecretKey" --key-alias="myalias" --security-password=12345678
```

example generating a public and decrypted secret key using a index (will not be
stored on filesystem)

```
kadena wallet add --wallet-name="kadenawallet.wallet" --key-index-or-range="0" --key-gen-from-choice="genPublicSecretKeyDec" --security-password=12345678
```

password will be hidden after entry: --security-password=\*

---

```
kadena wallet change-password [arguments]
```

| **Arguments & Options**     | **Description**                                    |
| --------------------------- | -------------------------------------------------- |
| --wallet-name               | Provide the name of the wallet                     |
| --security-current-password | Provide the current password of the wallet         |
| --security-new-password     | Set the new password for the wallet                |
| --security-verify-password  | Set the new password for the wallet (verification) |
| --confirm                   | Confirm password change                            |

example:

```
kadena wallet change-password --wallet-name="kadenawallet.wallet" --security-current-password=12345678 --security-new-password=12345678 --security-verify-password=1234567 --confirm=true
```

password will be hidden after entry: --security-current-password=\*
--security-new-password=\* --security-verify-password=\*

---

```
kadena wallet delete [arguments]
```

| **Arguments & Options** | **Description**               |
| ----------------------- | ----------------------------- |
| --wallet-name           | Select the name of the wallet |
| --confirm               | Confirm deletion of wallet    |

example single wallet deletion:

```
kadena wallet delete --wallet-name="kadenawallet.wallet" --confirm=true
```

example deletion of all wallets:

```
kadena wallet delete --wallet-name="all" --confirm=true
```

---

```
kadena wallet list [arguments]
```

| **Arguments & Options** | **Description**            |
| ----------------------- | -------------------------- |
| --wallet-name           | Set the name of the wallet |

example for listing specific wallet:

```
kadena wallet list --wallet-name="walletname"
```

example for listing all wallets:

```
kadena wallet list --wallet-name="all"
```

---

```
kadena wallet decrypt [arguments]
```

| **Arguments & Options**     | **Description**                     |
| --------------------------- | ----------------------------------- |
| --key-message               | Provide encrypted Message           |
| --security-current-password | Provide password to decrypt message |

example:

```
kadena wallet decrypt --key-message="encryptedmessage" --security-current-password=12345678
```

password will be hidden after entry: --security-current-password=\*

---

## kadena keys

Tool to generate and manage keys

| **Subcommand** | **Description**                           | **Required** | **Default value** |
| -------------- | ----------------------------------------- | ------------ | ----------------- |
| generate       | Generate random public/secret key pair(s) | No           |                   |
| list           | List available key(s)                     | No           |                   |

---

```
kadena key generate [arguments]
```

Generate a plain keypair using a random mnemonic

| **Arguments & Options** | **Description**                             |
| ----------------------- | ------------------------------------------- |
| --key-alias             | Set alias of the key to store on filesystem |
| --key-amount            | Set the amount of keys to generate          |
| --legacy                | Generate legacy keys                        |

example

```
kadena key generate --key-alias="myalias" --key-amount="5"
```

```
kadena key generate --key-alias="myalias" --key-amount="5" --legacy
```

---

```
kadena key list
```

| **Arguments & Options** | **Description** |
| ----------------------- | --------------- |

example for listing all keys

```
kadena key list"
```

## kadena account

Tool to manage / fund accounts of fungibles (e.g. coin')

| **Subcommand**  | **Description**                                     | **Default value** |
| --------------- | --------------------------------------------------- | ----------------- |
| add-manual      | Add an existing account to the CLI                  |                   |
| add-from-wallet | Add an account from a key wallet                    |                   |
| create          | create an account in mainnet on chain(nr) for token |                   |
| details         | Get details of an account                           |                   |
| fund            | Fund a existing/new account                         |                   |
| name-to-address | Resolve a .kda name to a k:address (kadenanames)    |                   |
| address-to-name | Resolve a k:address to a .kda name (kadenanames)    |                   |
| list            | List available account(s)                           |                   |
| delete          | Delete existing account(s)                          |                   |

---

```
kadena account add-manual [arguments]
```

| **Arguments & Options** | **Description**                              | **Required** |
| ----------------------- | -------------------------------------------- | ------------ |
| --account-alias         | Set alias for account                        |              |
| --account-name          | Set account name                             |              |
| --fungible              | Fungible e.g coin                            |              |
| --network               | Name of the network to be used               |              |
| --chain-id              | Chain to be used                             |              |
| --public-keys           | Comma seperated list of public keys          |              |
| --predicate             | keys-all, keys-any, keys-2, Custom predicate |              |

example:

```
kadena account add-manual --account-alias="myalias" --account-name="myaccountname" --fungible="coin" --network="mainnet" --chain-id="1" --public-keys="mypublickey" --predicate="keys-all"
```

---

```
kadena account add-from-wallet [arguments]
```

| **Arguments & Options** | **Description**                              | **Required** |
| ----------------------- | -------------------------------------------- | ------------ |
| --account-alias         | Set alias for account                        |              |
| --key-wallet            | Provide the name of the wallet               |              |
| --fungible              | Fungible e.g coin                            |              |
| --network               | Name of the network to be used               |              |
| --chain-id              | Chain to be used                             |              |
| --public-keys           | Comma separated list of public keys          |              |
| --predicate             | keys-all, keys-any, keys-2, Custom predicate |              |

example:

```
kadena account add-from-wallet --account-alias="myalias" --key-wallet="mywallet.wallet" --fungible="coin" --network="mainnet" --chain-id="1" --public-keys="publickey" --predicate="keys-all"
```

---

```
kadena account create [arguments]
```

| **Arguments & Options** | **Description**                              | **Required** |
| ----------------------- | -------------------------------------------- | ------------ |
| --account-name          | Provide an account name                      | No           |
| --fungible              | Fungible e.g coin                            | No           |
| --chain-id              | Chain to be used                             |              |
| --public-keys           | Comma separated list of public keys          |              |
| --predicate             | keys-all, keys-any, keys-2, Custom predicate |              |

example:

create an account with optional account name and fungible

```
kadena account create --account-name="" --public-keys="YOUR_PUBLIC_KEY" --predicate="keys-any" --chain-id="0"
```

create an account with an account name and fungible

```
kadena account create --account-name="mainnet_test_account" --public-keys="YOUR_PUBLIC_KEY" --predicate="keys-any" --chain-id="0" --fungible="coin
```

---

```
kadena account details [arguments]
```

| **Arguments & Options** | **Description**                        | **Required** |
| ----------------------- | -------------------------------------- | ------------ |
| --account               | Provide account alias/name for account |              |
| --network               | Name of the network to be used         |              |
| --chain-id              | Chain to be used                       |              |

example using account alias:

```
kadena account details --account="myalias" --network="mainnet" --chain-id="1"
```

example using account name:

```
kadena account details --account="k:PUBLIC_KEY" --network="mainnet" --chain-id="1"
```

---

```
kadena account fund [arguments]
```

| **Arguments & Options** | **Description**                | **Required** |
| ----------------------- | ------------------------------ | ------------ |
| --account               | Provide alias for account      |              |
| --amount                | Amount to fund                 |              |
| --network               | Name of the network to be used |              |
| --chain-id              | Chain to be used               |              |

example:

```
kadena account fund --account="myalias" --amount="10" --network="testnet" --chain-id="1"
```

---

```
kadena account account name-to-address [arguments]
```

| **Arguments & Options** | **Description**                           | **Required** |
| ----------------------- | ----------------------------------------- | ------------ |
| --network               | Name of the network to be used            |              |
| --account-kdn-name      | Provide .kda name to resolve to k:account |              |

example:

```
kadena account name-to-address --network="mainnet" --account-kdn-name="kadena.kda"
```

---

```
kadena account address-to-name [arguments]
```

| **Arguments & Options** | **Description**                           | **Required** |
| ----------------------- | ----------------------------------------- | ------------ |
| --network               | Name of the network to be used            |              |
| --account-kdn-address   | Provide k:account to resolve to .kda name |              |

example:

```
kadena account address-to-name --network="mainnet" --account-kdn-address="k:account"
```

---

```
kadena account list [arguments]
```

| **Arguments & Options** | **Description**                  |
| ----------------------- | -------------------------------- |
| --account-alias         | Provide the alias of the account |

example for listing specific account:

```
kadena account list --account-alias="accountAlias"
```

example for listing all accounts:

```
kadena account list --account-alias="all"
```

---

```
kadena account delete [arguments]
```

| **Arguments & Options** | **Description**                  |
| ----------------------- | -------------------------------- |
| --account-alias         | Provide the alias of the account |
| --confirm               | Confirm deletion of account      |

example for delete a specific account:

```
kadena account delete --account-alias="accountAlias" --confirm
```

example for delete all accounts:

```
kadena account delete --account-alias="all" --confirm
```

## kadena tx

Tool for creating and managing transactions

| **Subcommand** | **Description**                                  | **Default value** |
| -------------- | ------------------------------------------------ | ----------------- |
| send           | Send a transaction to the network                |                   |
| sign           | Sign a transaction using a keypair,              |                   |
|                | Sign a transaction using your local aliased file |                   |
|                | Sign a transaction using your local wallet       |                   |
|                |                                                  |                   |
| test           | Test a signed transaction                        |                   |
| add            | Select a template and add a transaction          |                   |

---

```
kadena tx add [arguments]
```

| **Arguments & Options** | **Description**                                | **Required** |
| ----------------------- | ---------------------------------------------- | ------------ |
| --template              | Select template path                           |              |
| --template-data         | Provide File path of data to use for template  |              |
| --network-id            | Provide the network id                         |              |
| --out-file              | Provide path to save output                    |              |
| --xx                    | Args are created onl the fly based on template |              |

example:

```
kadena tx add --template="transfer.yaml" --template-data="path" (--account-from="k:account" --account-to="k:toaccount" --amount="1" --chain-id="1" --pk-from="publicKey") --network-id="testnet04" --out-file="transaction-(request-key).json"
```

Template variables are prompted unless assigned via --template-data or direct
flags. Variables can be prefixed to enable value selection using:

- `account:` to select a account name
- `key:` to select a public key
- `network:` to select existing networkId
- `decimal:` to enable decimal input validation

---

```
kadena tx sign [arguments]
```

| **Arguments & Options**         | **Description**                                                         | **Required** |
| ------------------------------- | ----------------------------------------------------------------------- | ------------ |
| --tx-sign-with="aliasFile"      | Provide signing method                                                  | Yes          |
| --key-pairs                     | Provide publickey and secretKey (or list separated my semicolon)        |              |
| --tx-unsigned-transaction-files | Provided unsigned transaction file(s) to sign (or comma seperated list) |              |

example:

```
kadena tx sign --tx-sign-with="keyPair" --key-pairs="publicKey=xxx,secretKey=xxx" --tx-unsigned-transaction-files="transaction-(request-key).json"
```

---

```
kadena kadena sign [arguments]
```

| **Arguments & Options**         | **Description**                                                         | **Required** |
| ------------------------------- | ----------------------------------------------------------------------- | ------------ |
| --tx-sign-with="aliasFile"      | Provide signing method                                                  | Yes          |
| --key-wallet                    | Provide the name of the wallet                                          |              |
| --security-password             | Provide the password for the wallet                                     |              |
| --key-alias-select              | Select a aliased file                                                   |              |
| --tx-unsigned-transaction-files | Provided unsigned transaction file(s) to sign (or comma separated list) |              |

example:

```
kadena sign --tx-sign-with="aliasFile" --key-wallet="mywallet.wallet" --security-password=1234567 --key-alias-select="mywalletalias.key" --tx-unsigned-transaction-files="transaction-(request-key).json,transaction-(request-key).json"
```

password will be hidden after entry: --security-password=\*

---

```
kadena tx sign [arguments]
```

| **Arguments & Options**         | **Description**                                                         | **Required** |
| ------------------------------- | ----------------------------------------------------------------------- | ------------ |
| --tx-sign-with="localWallet"    | Provide signing method                                                  | Yes          |
| --key-wallet                    | Provide the name of the wallet                                          |              |
| --security-password             | Provide the password for the wallet                                     |              |
| --key-alias-select              | Select a aliased file                                                   |              |
| --tx-unsigned-transaction-files | Provided unsigned transaction file(s) to sign (or comma separated list) |              |

example:

```
kadena tx sign --tx-sign-with="localWallet"  --key-wallet="mywallet.wallet" --security-password=12345678 --tx-unsigned-transaction-files="transaction-(request-key)-signed.json"
```

password will be hidden after entry: --security-password=\*

---

```
kadena tx test-signed-transaction [arguments]
```

| **Arguments & Options**       | **Description**                                                       | **Required** |
| ----------------------------- | --------------------------------------------------------------------- | ------------ |
| --network                     | Name of the network to be used                                        |              |
| --directory                   | Provide the directory for the signed transaction                      |              |
| --tx-signed-transaction-files | Provided signed transaction file(s) to sign (or comma separated list) |              |
| --chain-id                    | Chain to be used                                                      |              |

example:

```
kadena tx test-signed-transaction --network="testnet" --directory="./" --tx-signed-transaction-files="transaction-(request-key)-signed.json" --chain-id="1"
```

---

```
kadena tx send [arguments]
```

| **Arguments & Options**       | **Description**                                                       | **Required** |
| ----------------------------- | --------------------------------------------------------------------- | ------------ |
| --tx-signed-transaction-files | Provided signed transaction file(s) to sign (or comma separated list) |              |
| --tx-transaction-network      | Kadena networks comma separated list in order of transaction          |              |
|                               | (e.g. "mainnet, testnet, devnet, ...")                                |              |
| --poll                        | Poll status of sent transactions                                      |              |

example:

```
kadena tx send --tx-signed-transaction-files="transaction-I4WaMUwQZDxhaf2r2FZj0TQf7Zv1J5v45Yc2MYxPURU-signed.json" --tx-transaction-network "mainnet, testnet"
```

```
kadena tx send --tx-signed-transaction-files="transaction-I4WaMUwQZDxhaf2r2FZj0TQf7Zv1J5v45Yc2MYxPURU-signed.json" --tx-transaction-network "mainnet, testnet" --poll
```

---

```
kadena tx status [arguments]
```

| **Arguments & Options** | **Description**                                       | **Required** |
| ----------------------- | ----------------------------------------------------- | ------------ |
| --request-key           | Provide a transaction request key                     |              |
| --network               | Select name of the network where transaction happened |              |
|                         | (e.g. "mainnet, testnet, devnet, ...")                |              |
| --chain-id              | Chain to be used in the transaction                   |              |

example:

```
kadena tx status --request-key="118mEpX1-6NpJT1kArsWIHHVtJaOERQOeEwNoouOSGU" --network="testnet" --chain-id="0"
```

---

## kadena dapp

Tool for creating dapp projects

| **Subcommand** | **Description**        | **Default value** |
| -------------- | ---------------------- | ----------------- |
| add            | add a new Dapp project |                   |

```
kadena dapp add [arguments]
```

| **Arguments & Options** | **Description**                          | **Required** |
| ----------------------- | ---------------------------------------- | ------------ |
| project-directory       | Specify the project directory [Required] | yes          |
| --dapp-template         | Select template: vuejs, nextjs, angular  |              |

example:

```
kadena dapp add --dapp-template="vuejs" kadena-dapp
```

---

### Supported Templates

It supports a number of well known and widely used frameworks to choose from
when starting a new project. The following project templates are currently
available:

- [Nextjs][1]
- [Vuejs][2]
- [Angular][3]

[1]: https://nextjs.org/
[2]: https://vuejs.org/
[3]: https://angular.io/
