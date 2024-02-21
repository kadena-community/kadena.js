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
  - [kadena networks](#kadena-networks)
  - [kadena wallets](#kadena-wallets)
  - [kadena keys](#kadena-keys)
  - [kadena account](#kadena-account)
  - [kadena tx](#kadena-tx)
  - [kadena dapp](#kadena-dapp)
  - [Supported Templates](#supported-templates)

<hr>

# KADENA CLI

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

|           | description                                              |
| --------- | -------------------------------------------------------- |
| config    | configuration of the cli. E.g. network, config directory |
| --help    | display help information                                 |
| --version | display version information                              |

### Command specific help

To get help on a `subject` use `kadena <subject> --help`

## Subjects

Each command is structured as
`kadena <subject> [...<subject>] <verb> [--flags] [args]` apart from some root
level defaults.

Available subjects

| subject  | description                                              |
| -------- | -------------------------------------------------------- |
| networks | Tool to create and manage networks                       |
| account  | Tool to manage / fund accounts of fungibles (e.g 'coin') |
| keys     | Tool to generate and manage keys                         |
| tx       | Tool for creating and managing transactions              |
| dapp     | Tool for managing dapp projects                          |

---

## kadena config

Tool for setting up and managing the CLI configuration

init creates a .kadena/ folder with default networks devnet/mainnet/testnet

| **Parameter** | **Description**            | **Required** | **Default value** |
| ------------- | -------------------------- | ------------ | ----------------- |
| init          | initialize default project | No           |                   |

---

## kadena networks

Tool to create and manage networks

| **Parameter** | **Description**             | **Required** | **Default value** |
| ------------- | --------------------------- | ------------ | ----------------- |
| list          | List all available networks | No           |                   |
| update        | Manage networks             | No           |                   |
| create        | Create new networks         | No           |                   |
| delete        | Delete existing networks    | No           |                   |

---

```
kadena networks update [arguments]
```

| **Arguments & Options** | ** Description**                        |
| ----------------------- | --------------------------------------- |
| --network-name          | Update the name of the network          |
| --network-id            | Update the id of the network            |
| --network-host          | Update the host for the network         |
| --network-explorer-url  | Update the explorer url for the network |

example:

```
kadena networks update --network-name="mainnet" --network-id="mainnet01" --network-host="https://api.chainweb.com" --network-explorer-url="https://explorer.chainweb.com/mainnet/tx/
```

---

```
kadena networks create [arguments]
```

| **Arguments & Options** | ** Description**                     |
| ----------------------- | ------------------------------------ |
| --network-name          | Set the name of the network          |
| --network-id            | Set the id of the network            |
| --network-host          | Set the host for the network         |
| --network-explorer-url  | Set the explorer url for the network |
| --network-overwrite     | Confirm overwrite configuration      |

example:

```
kadena networks create --network-name="mainnet" --network-id="mainnet01" --network-host="https://api.chainweb.com" --network-explorer-url="https://explorer.chainweb.com/mainnet/tx/ --network-overwrite="yes"
```

---

```
kadena networks delete [arguments]
```

| **Arguments & Options** | ** Description**                 |
| ----------------------- | -------------------------------- |
| --network               | Select name of network to delete |
| --network-delete        | Confirm deletion of network      |

example:

```
kadena networks delete --network="mainnet" --network-delete="yes"
```

---

## kadena wallets

Tool to generate and manage wallets

| **Parameter**   | **Description**                                     | **Required** | **Default value** |
| --------------- | --------------------------------------------------- | ------------ | ----------------- |
| add             | Add a new local wallet                              | No           |                   |
| import          | Import ( restore ) wallet from mnemonic phrase      | No           |                   |
| generate-keys   | Generate public/secret key pair(s) from your wallet | No           |                   |
| change-password | Update the password for your wallet                 | No           |                   |
| delete          | Delete existing wallet from local filesystem        | No           |                   |
| list            | List wallets(s)                                     | No           |                   |

---

```
kadena wallets add [arguments]
```

| **Arguments & Options**    | ** Description**                               |
| -------------------------- | ---------------------------------------------- |
| --wallet-wallet            | Set the name of the wallet                     |
| --security-password        | Set the password for the wallet                |
| --security-verify-password | Set the password for the wallet (verification) |

example:

```
kadena wallets add --wallet-wallet="kadenawallet" --security-password=1245678 --security-verify-password=1245678
```

password will be hidden after entry: --security-password=\*
--security-verify-password=\*

---

```
kadena wallets import [arguments]
```

| **Arguments & Options**    | ** Description**                               |
| -------------------------- | ---------------------------------------------- |
| --key-mnemonic             | 12 word mnemnoc phrase                         |
| --security-new-password    | Set the password for the wallet                |
| --security-verify-password | Set the password for the wallet (verification) |
| --wallet-wallet            | Set the name of the wallet                     |

example:

```
kadena wallets import-wallet --key-mnemonic="male more sugar violin accuse panel kick nose sign alarm stool inmate" --security-new-password=12345678 --security-verify-password=12345678 --key-wallet="mywalletname"
```

password will be hidden after entry: --security-new-password=\*
--security-verify-password=\*

---

```
kadena wallets generate-keys [arguments]
```

| **Arguments & Options** | ** Description**                                                                    |
| ----------------------- | ----------------------------------------------------------------------------------- |
| --wallet-wallet         | Provide the name of the wallet                                                      |
| --key-index-or-range    | Set index or range of indices for key generation (e.g., 5 or 1-5)                   |
| --security-password     | Set the password for the wallet                                                     |
| --key-gen-from-choice   | Select generation type: genPublicKey (publicKey only), genPublicSecretKey           |
|                         | (publickey and secretKey), genPublicSecretKeyDec (publicKey and SecretKey Decrypted |

example generating public keys using a range

```
kadena wallets generate --wallet-wallet="kadenawallet.wallet" --key-index-or-range="0-5" --key-gen-from-choice="genPublicKey" --key-alias="myalias" --security-password=12345678
```

example generating a public key using a index

```
kadena wallets generated --wallet-wallet="kadenawallet.wallet" --key-index-or-range="0" --key-gen-from-choice="genPublicKey" --key-alias="myalias" --security-password=12345678
```

example generating a public and secret key using a index

```
kadena wallets generate --wallet-wallet="kadenawallet.wallet" --key-index-or-range="0" --key-gen-from-choice="genPublicSecretKey" --key-alias="myalias" --security-password=12345678
```

example generating a public and decrypted secret key using a index (will not be
stored on filesystem)

```
kadena keys wallets generate --wallet-wallet="kadenawallet.wallet" --key-index-or-range="0" --key-gen-from-choice="genPublicSecretKeyDec" --security-password=12345678
```

password will be hidden after entry: --security-password=\*

---

```
kadena wallets change-password [arguments]
```

| **Arguments & Options**     | ** Description**                                   |
| --------------------------- | -------------------------------------------------- |
| --wallet-wallet             | Provide the name of the wallet                     |
| --security-current-password | Provide the current password of the wallet         |
| --security-new-password     | Set the new password for the wallet                |
| --security-verify-password  | Set the new password for the wallet (verification) |
| --confirm                   | Confirm password change                            |

example:

```
kadena wallets change-password --wallet-wallet="kadenawallet.wallet" --security-current-password=12345678 --security-new-password=12345678 --security-verify-password=1234567 --confirm=true
```

password will be hidden after entry: --security-current-password=\*
--security-new-password=\* --security-verify-password=\*

---

```
kadena wallets delete [arguments]
```

| **Arguments & Options** | ** Description**              |
| ----------------------- | ----------------------------- |
| --wallet-wallet         | Select the name of the wallet |
| --confirm               | Confirm deletion of wallet    |

example single wallet deletion:

```
kadena wallets delete --wallet-wallet="kadenawallet.wallet" --confirm=true
```

example deletion of all wallets:

```
kadena wallets delete --wallet-wallet="all" --confirm=true
```

---

```
kadena wallets list [arguments]
```

| **Arguments & Options** | ** Description**           |
| ----------------------- | -------------------------- |
| --wallet-wallet         | Set the name of the wallet |

example for listing specific wallet:

```
kadena wallets list --wallet-wallet="walletname"
```

example for listing all wallets:

```
kadena wallets list --wallet-wallet="all"
```

---

## kadena keys

Tool to generate and manage keys

| **Parameter** | **Description**                           | **Required** | **Default value** |
| ------------- | ----------------------------------------- | ------------ | ----------------- |
| generate      | Generate random public/secret key pair(s) | No           |                   |
| decrypt       | Decrypt encrypted messsage                | No           |                   |
| list          | List available key(s)                     | No           |                   |

---

```
kadena keys generate [arguments]
```

| **Arguments & Options** | ** Description**                            |
| ----------------------- | ------------------------------------------- |
| --key-alias             | Set alias of the key to store on filesystem |
| --key-amount            | Set the amount of keys to generate          |

example

```
kadena keys generate --key-alias="myalias" --key-amount="5"
```

---

```
kadena keys decrypt [arguments]
```

| **Arguments & Options**     | ** Description**                    |
| --------------------------- | ----------------------------------- |
| --key-message               | Provide encrypted Message           |
| --security-current-password | Provide password to decrypt message |

example:

```
kadena keys decrypt --key-message="encryptedmessage" --security-current-password=12345678
```

password will be hidden after entry: --security-current-password=\*

---

```
kadena keys list
```

| **Arguments & Options** | ** Description** |
| ----------------------- | ---------------- |

example for listing all keys

```
kadena kets list"
```

## kadena account

Tool to manage / fund accounts of fungibles (e.g. coin')

| **Parameter**   | **Description**                                  | **Required** | **Default value** |
| --------------- | ------------------------------------------------ | ------------ | ----------------- |
| add-manual      | Add an existing account to the CLI               | No           |                   |
| add-from-wallet | Add an account from a key wallet                 | No           |                   |
| create          | Create account on chain(nr) for token \*WIP      | No           |                   |
| details         | Get details of an account                        | No           |                   |
| fund            | Fund a existing/new account                      | No           |                   |
| name-to-address | Resolve a .kda name to a k:address (kadenanames) | No           |                   |
| address-to-name | Resolve a k:address to a .kda name (kadenanames) | No           |                   |
| address-to-name | Resolve a k:address to a .kda name (kadenanames) | No           |                   |
| list            | List available account(s) \*WIP                  | No           |                   |

---

```
kadena account add-manual [arguments]
```

| **Arguments & Options** | ** Description**                             |
| ----------------------- | -------------------------------------------- |
| --account-alias         | Set alias for account                        |
| --account-name          | Set account name                             |
| --fungible              | Fungible e.g coin                            |
| --network               | Name of the network to be used               |
| --chain-id              | Chain to be used                             |
| --public-keys           | Comma seperated list of public keys          |
| --predicate             | keys-all, keys-any, keys-2, Custom predicate |

example:

```
kadena account add-manual --account-alias="myalias" --account-name="myaccountname" --fungible="coin" --network="mainnet" --chain-id="1" --public-keys="mypublickey" --predicate="keys-all"
```

---

```
kadena account add-from-wallet [arguments]
```

| **Arguments & Options** | ** Description**                             |
| ----------------------- | -------------------------------------------- |
| --account-alias         | Set alias for account                        |
| --key-wallet            | Provide the name of the wallet               |
| --fungible              | Fungible e.g coin                            |
| --network               | Name of the network to be used               |
| --chain-id              | Chain to be used                             |
| --public-keys           | Comma seperated list of public keys          |
| --predicate             | keys-all, keys-any, keys-2, Custom predicate |

example:

```
kadena account add-from-wallet --account-alias="myalias" --key-wallet="mywallet.wallet" --fungible="coin" --network="mainnet" --chain-id="1" --public-keys="publickey" --predicate="keys-all"
```

---

```
kadena account details [arguments]
```

| **Arguments & Options** | ** Description**               |
| ----------------------- | ------------------------------ |
| --account               | Provide alias for account      |
| --network               | Name of the network to be used |
| --chain-id              | Chain to be used               |

example:

```
kadena account details --account="myalias.yaml" --network="mainnet" --chain-id="1"
```

---

```
kadena account fund [arguments]
```

| **Arguments & Options** | ** Description**               |
| ----------------------- | ------------------------------ |
| --account               | Provide alias for account      |
| --amount                | Amount to fund                 |
| --network               | Name of the network to be used |
| --chain-id              | Chain to be used               |

example:

```
kadena account fund --account="myalias.yaml" --amount="10" --network="testnet" --chain-id="1"
```

---

```
kadena account fund [arguments]
```

| **Arguments & Options** | ** Description**               |
| ----------------------- | ------------------------------ |
| --account               | Provide alias for account      |
| --amount                | Amount to fund                 |
| --network               | Name of the network to be used |
| --chain-id              | Chain to be used               |

example:

```
kadena account fund --account="myalias.yaml" --amount="10" --network="testnet" --chain-id="1"
```

---

```
kadena account account name-to-address [arguments]
```

| **Arguments & Options** | ** Description**                          |
| ----------------------- | ----------------------------------------- |
| --network               | Name of the network to be used            |
| --account-kdn-name      | Provide .kda name to resolve to k:account |

example:

```
kadena account name-to-address --network="mainnet" --account-kdn-name="kadena.kda"
```

---

```
kadena account account name-to-address [arguments]
```

| **Arguments & Options** | ** Description**                          |
| ----------------------- | ----------------------------------------- |
| --network               | Name of the network to be used            |
| --account-kdn-address   | Provide k:account to resolve to .kda name |

example:

```
kadena account address-to-name --network="mainnet" --account-kdn-address="k:account"
```

---

## kadena tx

Tool for creating and managing transactions

| **Parameter**           | **Description**                                  | **Required** | **Default value** |
| ----------------------- | ------------------------------------------------ | ------------ | ----------------- |
| send                    | Send a transaction to the network                | No           |                   |
| sign-with-keypair       | Sign a traqnsaction using a keypair              | No           |                   |
| sign-with-alias-file    | Sign a transaction using your local aliased file | No           |                   |
| sign-with-local-wallet  | Sign a transaction using your local wallet       | No           |                   |
| test-signed-transaction | Test a signed transaction                        | No           |                   |
| create-transaction      | Select a template and create a transaction       | No           |                   |

---

```
kadena tx create-transaction [arguments]
```

| **Arguments & Options** | ** Description**                               |
| ----------------------- | ---------------------------------------------- |
| --template              | Select template                                |
| --template-data         | Provide File path of data to use for template  |
| --network-id            | Provide the network id                         |
| --out-file              | Provide path to save output                    |
| --xx                    | Args are created onl the fly based on template |

example:

```
kadena tx create-transaction --template="transfer.yaml" --template-data="path" (--account-from="k:account" --account-to="k:toaccount" --amount="1" --chain-id="1" --pk-from="publicKey") --network-id="testnet04" --out-file="transaction-(request-key).json"
```

---

```
kadena tx create-transaction [arguments]
```

| **Arguments & Options** | ** Description**                               |
| ----------------------- | ---------------------------------------------- |
| --template              | Select template                                |
| --template-data         | Provide File path of data to use for template  |
| --network-id            | Provide the network id                         |
| --out-file              | Provide path to save output                    |
| --xx                    | Args are created onl the fly based on template |

example:

```
kadena tx create-transaction --template="transfer.yaml" --template-data="path" (--account-from="k:account" --account-to="k:toaccount" --amount="1" --chain-id="1" --pk-from="publicKey") --network-id="testnet04" --out-file="transaction-(request-key).json"
```

---

```
kadena tx sign-with-keypair [arguments]
```

| **Arguments & Options**         | ** Description**                                                        |
| ------------------------------- | ----------------------------------------------------------------------- |
| --key-pairs                     | Provide publickey and secretKey (or list seperated my semicolon)        |
| --tx-unsigned-transaction-files | Provided unsigned transaction file(s) to sign (or comma seperated list) |

example:

```
kadena tx sign-with-keypair --key-pairs="publicKey=xxx,secretKey=xxx" --tx-unsigned-transaction-files="transaction-(request-key).json"
```

---

```
kadena tx sign-with-alias-file [arguments]
```

| **Arguments & Options**         | ** Description**                                                        |
| ------------------------------- | ----------------------------------------------------------------------- |
| --key-wallet                    | Provode the name of the wallet                                          |
| --security-password             | Provide the password for the wallet                                     |
| --key-alias-select              | Select a aliased file                                                   |
| --tx-unsigned-transaction-files | Provided unsigned transaction file(s) to sign (or comma seperated list) |

example:

```
kadena tx sign-with-alias-file --key-wallet="mywallet.wallet" --security-password=1234567 --key-alias-select="mywalletalias.key" --tx-unsigned-transaction-files="transaction-(request-key).json,transaction-(request-key).json"
```

password will be hidden after entry: --security-password=\*

---

```
kadena tx sign-with-local-wallet [arguments]
```

| **Arguments & Options**         | ** Description**                                                        |
| ------------------------------- | ----------------------------------------------------------------------- |
| --key-wallet                    | Provode the name of the wallet                                          |
| --security-password             | Provide the password for the wallet                                     |
| --key-alias-select              | Select a aliased file                                                   |
| --tx-unsigned-transaction-files | Provided unsigned transaction file(s) to sign (or comma seperated list) |

example:

```
kadena tx sign-with-local-wallet --key-wallet="mywallet.wallet" --security-password=12345678 --tx-unsigned-transaction-files="transaction-(request-key)-signed.json"
```

password will be hidden after entry: --security-password=\*

---

```
kadena tx test-signed-transaction [arguments]
```

| **Arguments & Options**       | ** Description**                                                      |
| ----------------------------- | --------------------------------------------------------------------- |
| --network                     | Name of the network to be used                                        |
| --directory                   | Provide the directory for the signed transaction                      |
| --tx-signed-transaction-files | Provided signed transaction file(s) to sign (or comma seperated list) |
| --chain-id                    | Chain to be used                                                      |

example:

```
kadena tx test-signed-transaction --network="testnet" --directory="./" --tx-signed-transaction-files="transaction-(request-key)-signed.json" --chain-id="1"
```

---

```
kadena tx send [arguments]
```

| **Arguments & Options**       | ** Description**                                                      |
| ----------------------------- | --------------------------------------------------------------------- |
| --tx-signed-transaction-files | Provided signed transaction file(s) to sign (or comma seperated list) |
| --network                     | Name of the network to be used                                        |
| --chain-id                    | Chain to be used                                                      |

example:

```
kadena tx send --tx-signed-transaction-files="transaction-I4WaMUwQZDxhaf2r2FZj0TQf7Zv1J5v45Yc2MYxPURU-signed.json" --network="testnet" --chain-id="1"
```

---

## kadena dapp

Tool for creating dapp projects

| **Parameter** | **Description**           | **Required** | **Default value** |
| ------------- | ------------------------- | ------------ | ----------------- |
| create        | Create a new Dapp project | No           |                   |

```
kadena dapp create [arguments]
```

| **Arguments & Options** | ** Description**                         |
| ----------------------- | ---------------------------------------- |
| project-directory       | Specify the project directory [Required] |
| --dapp-template         | Select template: vuejs, nextjs, angular  |

example:

```
kadena dapp create --dapp-template="vuejs" danillo
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
