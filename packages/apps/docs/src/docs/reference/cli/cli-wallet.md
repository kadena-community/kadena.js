---
title: kadena wallet
description:
  The `@kadena/kadena-cli` library provides a complete set of commands for creating applications and interacting with the Kadena network interactively or by using scripts from the command-line.
menu: Command-line interface
label: kadena wallet
order: 2
layout: full
tags: ['TypeScript', 'Kadena client', 'frontend']
---

# kadena wallet

Tool to generate and manage wallets

# Basic usage

The basic syntax for the `kadena wallet` command is:

```bash
kadena wallet <action> [flag]
```

## Actions

Use the following actions to specify the operation you want to perform.

| **Subcommand**  | **Description**                                     | 
| --------------- | --------------------------------------------------- | 
| add             | Add a new local wallet                              | 
| import          | Import ( restore ) wallet from mnemonic phrase      | 
| generate-key    | Generate public/secret key pair(s) from your wallet | 
| change-password | Update the password for your wallet                 | 
| delete          | Delete existing wallet from local filesystem        | 
| list            | List wallet(s)                                      | 

## Flags

You can use the following optional flags with `kadena network` commands.

| Use this flag | To do this
| ------------- | -----------
| `-h`, `--help` |	Display usage information.
| `-q`, `--quiet` | Eliminate interactive prompts and confirmations to enable automation of tasks.
| `--json` |
| `--yaml` |
| `-V`, `--version`	| Display version information.

## kadena wallet add

| **Options**      | **Description**                              | **Required** |
| ---------------- | -------------------------------------------- | ------------ |
| --wallet-name    | Set the name of the wallet                   |              |
| --password-file  | File path to the password file               |              |
| --legacy         | Generate legacy wallet                       |              |
| --create-account | Create an account using the first wallet key |              |
| --account-alias  | Alias to store your account details          |              |

### Examples

```
kadena wallet add --wallet-name="kadena_wallet" --password-file="./kadenawallet-pw.txt"
```

example using wallet with account creation:

```
kadena wallet add --wallet-name="kadena_wallet" --password-file="./kadenawallet-pw.txt" --create-account=true --account-alias="dev_account"
```

## kadena wallet import

| **Options**     | **Description** | **Required** |
| --------------- | --------------- | ------------ |
| --mnemonic-file | Filepath to your 12-word mnemonic phrase file to generate keys from (can be passed via stdin) | Yes          |
| --password-file | Filepath to the password file                                                                 | Yes          |
| --wallet-name   | Enter you wallet name                                                                         | Yes          |
| --legacy        | Use Chainweaver's key derivation                                                              |              |

### Examples

```
kadena wallet import --wallet-name="myWallet"
```

## kadena wallet generate-key

Generate a key pair from a wallet mnemonic.

| **Options**     | **Description**                         | **Required** |
| --------------- | --------------------------------------- | ------------ |
| --wallet-name   | Provide the name of the wallet          | Yes          |
| --amount        | Amount of keys to generate (default: 1) |              |
| --start-index   | Index to start generating keys at       | Yes          |
| --password-file | Filepath to the password filein         | Yes          |
| --key-alias     | Optional alias for generated key(s)     | Yes          |

### Examples

Example generating public keys using a range (you will be prompted for password):

```
kadena wallet generate-key --wallet-name="" --amount="1" --key-alias=""
```

Example passing password from a file:

```
kadena wallet generate-key --wallet-name="kadenawallet" --amount="1" --key-alias="" --password-file=./kadenawallet-pw.txt
```

Example passing password from a standard input (stdin):

```
echo "supersecret" | kadena wallet generate-key --wallet-name="kadenawallet" --amount="1" --key-alias=""
```

Example generating a key at a specific starting index index:

```
kadena wallet generate-key --wallet-name="kadenawallet" --amount="1" --start-index="100" --key-alias=""
```

## kadena wallet change-password

| **Options**         | **Description**                   | **Required** |
| ------------------- | --------------------------------- | ------------ |
| --wallet-name       | Wallet name                       | Yes          |
| --password-file     | Filepath to the password file     | Yes          |
| --new-password-file | Filepath to the new password file | Yes          |
| --confirm           | Confirm changing wallet password  | Yes          |

### Examples

```
kadena wallet change-password --wallet-name="mywalletname" --confirm
```

## kadena wallet delete

| **Options**   | **Description**               |
| ------------- | ----------------------------- |
| --wallet-name | Select the name of the wallet |
| --confirm     | Confirm deletion of wallet    |

### Examples

Example single wallet deletion:

```
kadena wallet delete --wallet-name="mywalletname" --confirm
```

Example deletion of all wallets:

```
kadena wallet delete --wallet-name="all" --confirm
```

## kadena wallet list

| **Options**   | **Description**            |
| ------------- | -------------------------- |
| --wallet-name | Set the name of the wallet |


### Examples

Example for listing specific wallet:

```
kadena wallet list --wallet-name="walletname"
```

Example for listing all wallets:

```
kadena wallet list --wallet-name="all"
```

## kadena wallet export

Export a KeyPair from a wallet unencrypted. Prints to stdout as yaml by default

| **Options**     | **Description**                                          |
| --------------- | -------------------------------------------------------- |
| --wallet-name   | Name of the wallet you want to export a key from         |
| --key-index     | The index of the key to export                           |
| --password-file | Filepath to the wallet password, can be passed via stdin |

### Examples

Example (password will be prompted):

```
kadena wallet export --wallet-name="kadenawallet" --key-index="0" > mykey.yaml
```

Print as json (password will be prompted):

```
kadena wallet export --wallet-name="kadenawallet" --key-index="0" --json > mykey.json
```

