---
title: kadena wallet
description:
  The `@kadena/kadena-cli` package provides a complete set of commands for creating applications and interacting with the Kadena network interactively or by using scripts from the command-line.
menu: Command-line interface
label: kadena wallet
order: 2
layout: full
tags: ['TypeScript', 'Kadena client', 'frontend']
---

# kadena wallet

Use `kadena wallet` to add, manage, and fund onchain accounts with fungible tokens, for example, by transferring coin.

## Basic usage

The basic syntax for the `kadena wallet` command is:

```bash
kadena wallet <action> [arguments] [flags]
```

## Actions

Use the following actions to specify the operation you want to perform.

| Use this action | To do this                          | 
| --------------- | ----------------------------------- | 
| add             | Add a new local wallet. | 
| import          | Import or restore a wallet from its 12-word secret phrase. | 
| generate-key    | Generate a new random public and secret key pair for your wallet from its existing secret phrase. | 
| change-password | Update the password for your wallet. | 
| delete          | Delete an existing wallet from the local filesystem. | 
| list            | List wallet information. | 

## Flags

You can use the following optional flags with `kadena wallet` commands.

| Use this flag | To do this
| ------------- | -----------
| -h, --help |	Display usage information.
| -q, --quiet | Eliminate interactive prompts and confirmations to enable automation of tasks.
| -V, --version	| Display version information.
| --json | Format command results sent to standard output (stdout) using JSON format.
| --yaml | Format command results sent to standard output (stdout) using YAML format.


## kadena wallet add

Use `kadena wallet add` to add a new local wallet to the filesystem.

### Basic usage

The basic syntax for the `kadena wallet add` command is:

```bash
kadena wallet add [arguments] [flags]
```

### Arguments

You can use the following command-line arguments with the `kadena wallet add` command:

| Use this argument | To do this                                  | 
| ----------------- | ------------------------------------------- |
| -w, --wallet-name _walletName_ | Specify the name of the wallet. |
| --password-file _passwordFile_ | Specify the path to a file that stores the password for your wallet. If you don't have the password stored in a text file, you can enter it as standard input. |
| -l, --legacy | Generate a legacy wallet using the ED25519 signature scheme to be compatible with Chainweaver. |
| -a, --create-account | Create an account using the first wallet key. Enter true to create an account using the first public key from the wallet.
Enter false to skip account creation.|
| -l, --account-alias _accountAlias_ | Specify an account alias to store your account details. |

### Examples

To add a wallet interactively, run the following command:

```bash
kadena wallet add
```

This command prompts you to enter the wallet name and password, and, optionally, to create a new account using the public key from the wallet.
For example:

```bash
? Enter your wallet name: sf-wallet
? Enter the new wallet password:
? Not using a password will store your wallet unencrypted. Are you sure? (y/n): n
? Enter the new wallet password: ********
? Re-enter the password: ********
? Create an account using the first wallet key? Yes
? Enter an alias for an account: sf-account
```

To add a wallet using a password file instead of standard input (stdin), you can run a command similar to the following:

```bash
kadena wallet add --wallet-name=sf-wallet --password-file=my-pwd
```

This command prompts you to specify whether you want to create a new account using the public key from the wallet.
If you select **No**, the command displays wallet information similar to the following:

```bash
====================================================
== 🚨 IMPORTANT: Mnemonic Phrase 🚨 ==
====================================================
Mnemonic Phrase:
provide act country elbow unhappy rigid have letter pluck fame thank abandon

Please store the mnemonic phrase in a SAFE and SECURE place. 
This phrase is the KEY to recover your wallet. Losing it means losing access to your assets.

====================================================

First keypair generated
publicKey: f4ebafe19bc0f02c53ca78cbfc5ef33de0019c9971a56eaf00e0149e8c2db307

Wallet Storage Location
.kadena/wallets/sf-wallet.yaml


Executed:
kadena wallet add --wallet-name="sf-wallet" --password-file="my-pwd" --create-account="false" 
```

To create a new wallet and an account without interactive prompting, you can run a command similar to the following:

```bash
kadena wallet add --wallet-name=sf-wallet --password-file=my-pwd --create-account=true --account-alias=sf-dev-account
```

## kadena wallet import

Use `kadena wallet import` to import or restore a local wallet using an existing 12-word mnemonic phrase.

### Basic usage

The basic syntax for the `kadena wallet import` command is:

```bash
kadena wallet import [arguments] [flags]
```

### Arguments

You can use the following command-line arguments with the `kadena wallet import` command:

| Use this argument | To do this                                  | 
| ----------------- | ------------------------------------------- |
| -m, --mnemonic-file _mnemonicFile_ | Specify the path to a file that stores your 12-word mnemonic phrase file used to generate keys for your wallet. If you don't have the mnemonic phrase stored in a text file, you can enter the 12-word phrase as standard input. |
| --password-file _passwordFile_| Specify the path to a file that stores the password for your wallet. If you don't have the password stored in a text file, you can enter it as standard input. |
| -w, --wallet-name _walletName_ | Specify the name of the wallet. |
| -l, --legacy | Use the ED25519 signature scheme to generate keys from the mnemonic phrase so that the wallet is compatible with Chainweaver. |

### Examples

To import a wallet interactively, run the following command:

```bash
kadena wallet import
```

This command prompts you to enter the 12-word mnemonic phrase, wallet name, and password as standard input.

To import a Chainweaver wallet using a password stored in a text file, you can run a command similar to the following:

```bash
kadena wallet import --wallet-name="chainweaver-wallet" --password-file="my-cw-pwd.txt" --legacy 
```

This command prompts you to enter the 12-word mnemonic phrase, then imports the wallet with a conformation similar to the following:

```bash
✔ Wallet imported successfully

====================================================
== 🚨 IMPORTANT: Mnemonic Phrase 🚨 ==
====================================================
Mnemonic Phrase:
recall skirt derive occur mad system camera fringe mom list company search

Please store the mnemonic phrase in a SAFE and SECURE place. 
This phrase is the KEY to recover your wallet. Losing it means losing access to your assets.

====================================================

Wallet Storage Location
.kadena/wallets/chainweaver-wallet.yaml

Executed:
kadena wallet import --wallet-name="chainweaver-wallet" --password-file="my-cw-pwd.txt" --legacy 
```

## kadena wallet generate-key

Use `kadena wallet generate-key` to generate a new public and secret key pair from the 12-word mnemonic phrase for an existing wallet.

### Basic usage

The basic syntax for the `kadena wallet generate-key` command is:

```bash
kadena wallet generate-key [arguments] [flags]
```

### Arguments

You can use the following command-line arguments with the `kadena wallet generate-key` command:

| Use this argument | To do this                                  | 
| ----------------- | ------------------------------------------- |
| -w, --wallet-name _walletName_ | Specify the name of the wallet. |
| -n, --amount _amount_ | Specify how many public and secret key pairs to generate. The default is one (1). |
| -i, --start-index _startIndex_ | Specify an index to start generating keys at. |
| --password-file _passwordFile_ | Specify the path to a file that stores the password for your wallet. If you don't have the password stored in a text file, you can enter it as standard input. |
| -a, --key-alias _keyAlias_ | Specify an optional alias for the generated keys. |

### Examples

To generate one new public and private key pair for the `sf-wallet`, you can run a command similar to the following:

```bash
kadena wallet generate-key --wallet-name="sf-wallet"
```

This command prompts you for the wallet password, number of keys to generate, and a key alias.
For example:

```bash
 Enter the wallet password: ********
? Amount of keys to generate: 1
? Alias for the generated key (optional): sf-1
```

After you respond to the prompts, the command displays confirmation similar to the following:

```bash
✔ Keys generated successfully
Public key                                                       Index
9de797dc0cb16c3eea4d26a5417b2e0c81ee8c1c1d7b358ebb6afaf6a3ca23a5 1    

Wallet Storage Location
.kadena/wallets/sf-wallet.yaml

Executed:
kadena wallet generate-key --wallet-name="sf-wallet" --amount="1" --key-alias="sf-1" 
```

To generate keys from a wallet using a password stored in a text file, you can run a command similar to the following:

```bash
kadena wallet generate-key --wallet-name="sf-wallet" --amount="3" --key-alias="sf-3" --password-file=my-pwd
```

This command displays confirmation similar to the following:

```bash
✔ Keys generated successfully
Public key                                                       Index
14de87a379114013a20bf4f00ec32c8a0ac3f64046cab80ac8062bc8319dc5e0 2    
c218080d0ffb4024070946ee25e38675e0408d6ea94c9a5fc937340d223b919c 3    
8eea71dbe7f13c11c1e4f796f1206639004e9b648abc57c1a1f32cc57464dbcc 4    

Wallet Storage Location
.kadena/wallets/sf-wallet.yaml
```

To generate a key at a specific starting index,  you can run a command similar to the following:

```bash
kadena wallet generate-key --wallet-name="chainweaver-wallet" --amount=1 --start-index=100 --key-alias=cw
```

This command prompts you for the wallet password, then displays confirmation similar to the following:

```bash
✔ Keys generated successfully
Public key                                                       Index
78d02f5d8981068333f5e06e428fba2e78fbe27d3075aeb3f3f7c6a0dec74cf2 100  

Wallet Storage Location
.kadena/wallets/chainweaver-wallet.yaml

Executed:
kadena wallet generate-key --wallet-name="chainweaver-wallet" --amount="1" --start-index="100" --key-alias="cw" 
```

## kadena wallet change-password

Use `kadena wallet change-password` to change the password for an existing wallet.

### Basic usage

The basic syntax for the `kadena wallet change-password` command is:

```bash
kadena wallet change-password [arguments] [flags]
```

### Arguments

You can use the following command-line arguments with the `kadena wallet change-password` command:

| Use this argument | To do this                                  | 
| ----------------- | ------------------------------------------- |
| -w, --wallet-name _walletName_ | Specify the name of the wallet. |
| --password-file _passwordFile_ | Specify the path to a file that stores the current password for your wallet. If you don't have the password stored in a text file, you can enter it as standard input. |
 --new-password-file _newPasswordFile_ | Specify the path to a file that stores the new password for your wallet. If you don't have the password stored in a text file, you can enter it as standard input. |
| -c, --confirm | Confirm that you want to change the wallet password. |

### Examples

To change the password for your wallet interactively, run the following command:

```bash
kadena wallet change-password --wallet-name="mywalletname" --confirm
```

This command prompts you to select a wallet, enter your current password, enter a new password, and confirm your changes.
For example:

```bash
? Select a wallet: Wallet: my-chainweaver-wallet
? Enter your current password: *******************
? Enter the new wallet password: ********
? Re-enter the password: ********

You are about to update the password for this wallet. If you lose your password the wallet can not be recovered.

? Do you wish to update your password? (Use arrow keys)
❯ Yes
  No
```

If you select **Yes** to change the wallet password, the command displays conformation of the change similar to the following:

```bash
Wallet password successfully updated..

Wallet location:  .kadena/wallets/my-chainweaver-wallet.yaml

Executed:
kadena wallet change-password --wallet-name="my-chainweaver-wallet" --confirm 
```

To change the password for your wallet using passwords stored in local files, you can run a command similar to the following:

```bash
kadena wallet change-password --wallet-name=my-chainweaver-wallet --password-file=my-pwd --new-password-file=my-cw-pwd.txt --confirm
```

## kadena wallet delete

Use `kadena wallet delete` to delete an existing wallet.

### Basic usage

The basic syntax for the `kadena wallet delete` command is:

```bash
kadena wallet delete [argument] [flag]
```

### Arguments

You can use the following command-line arguments with the `kadena wallet delete` command:

| Use this argument | To do this                                  | 
| ----------------- | ------------------------------------------- |
| -w, --wallet-name _walletName_ | Specify the name of the wallet. |
| -c, --confirm | Confirm that you want to delete the specified wallet. |

### Examples

To delete wallets interactively, run the following command:

```bash
kadena wallet delete
```

This command prompts you to select all wallets or a specific wallet and confirm that you want to delete the selected wallet.

To delete a single specific wallet deletion, you can run a command similar to the following:

```bash
kadena wallet delete --wallet-name=my-chainweaver-wallet --confirm
```

This command displays conformation similar to the following:

```bash
The wallet: "my-chainweaver-wallet" and associated keys have been deleted.
```

To delete all wallets, run the following command:

```
kadena wallet delete --wallet-name=all --confirm
```

## kadena wallet list

Use `kadena wallet list` to list information for an existing wallet or for all wallets.

### Basic usage

The basic syntax for the `kadena wallet list` command is:

```bash
kadena wallet list [argument] [flag]
```

### Arguments

You can use the following command-line arguments with the `kadena wallet list` command:

| Use this argument | To do this                                  | 
| ----------------- | ------------------------------------------- |
| -w, --wallet-name _walletName_ | Specify the name of the wallet. |

### Examples

To list information about a specific wallet, you can run a command similar to the following:

```bash
kadena wallet list --wallet-name=sf-wallet
```

This command displays key information similar to the following:

```bash
Wallet: sf-wallet
Alias Index Public key                                                      
N/A   0     967ea530ad415376d94049a33a06985a5f4d559acdeee9cecccd882982d03ef1
sf-1  1     9de797dc0cb16c3eea4d26a5417b2e0c81ee8c1c1d7b358ebb6afaf6a3ca23a5
sf-3  2     14de87a379114013a20bf4f00ec32c8a0ac3f64046cab80ac8062bc8319dc5e0
sf-3  3     c218080d0ffb4024070946ee25e38675e0408d6ea94c9a5fc937340d223b919c
sf-3  4     8eea71dbe7f13c11c1e4f796f1206639004e9b648abc57c1a1f32cc57464dbcc
```

To list information for all wallets and display the output in YAML format, you can run a command similar to the following:

```bash
kadena wallet list --wallet-name="all" --yaml
```

This command displays information for all wallets similar to the following:

```bash
Wallet: chainweaver-wallet (legacy)
Alias Index Public key                                                      
N/A   0     1b03e0f9b1f981f21484164e4d05febbb6f71fea34033f5d6a7f45c0ee9712af
cw    100   78d02f5d8981068333f5e06e428fba2e78fbe27d3075aeb3f3f7c6a0dec74cf2

Wallet: pistolas
Alias Index Public key                                                      
N/A   0     61cf22aa8f209b1a5549242601b4a217f034e3d931b6522ccb7743bf6c355546
N/A   1     ad833b6bbfc72fb7d18b88cd5b4349f82b2f015be8e4b5e7ad28f3249fd5e105
N/A   2     465f11d72de289719a4832a9e5cc6d0264be61b8254db769094f59f3b37b9d89

Wallet: sf-wallet
Alias Index Public key                                                      
N/A   0     967ea530ad415376d94049a33a06985a5f4d559acdeee9cecccd882982d03ef1
sf-1  1     9de797dc0cb16c3eea4d26a5417b2e0c81ee8c1c1d7b358ebb6afaf6a3ca23a5
sf-3  2     14de87a379114013a20bf4f00ec32c8a0ac3f64046cab80ac8062bc8319dc5e0
sf-3  3     c218080d0ffb4024070946ee25e38675e0408d6ea94c9a5fc937340d223b919c
sf-3  4     8eea71dbe7f13c11c1e4f796f1206639004e9b648abc57c1a1f32cc57464dbcc
chainweaver-wallet:
  alias: chainweaver-wallet
  filepath: /Users/lisagunn/MY-KADENA/.kadena/wallets/chainweaver-wallet.yaml
  version: 1
  legacy: true
  keys:
    - publicKey: 1b03e0f9b1f981f21484164e4d05febbb6f71fea34033f5d6a7f45c0ee9712af
      index: 0
    - publicKey: 78d02f5d8981068333f5e06e428fba2e78fbe27d3075aeb3f3f7c6a0dec74cf2
      index: 100
      alias: cw
pistolas:
  alias: pistolas
  filepath: /Users/lisagunn/MY-KADENA/.kadena/wallets/pistolas.yaml
  version: 1
  legacy: false
  keys:
    - publicKey: 61cf22aa8f209b1a5549242601b4a217f034e3d931b6522ccb7743bf6c355546
      index: 0
    - publicKey: ad833b6bbfc72fb7d18b88cd5b4349f82b2f015be8e4b5e7ad28f3249fd5e105
      index: 1
    - publicKey: 465f11d72de289719a4832a9e5cc6d0264be61b8254db769094f59f3b37b9d89
      index: 2
sf-wallet:
  alias: sf-wallet
  filepath: /Users/lisagunn/MY-KADENA/.kadena/wallets/sf-wallet.yaml
  version: 1
  legacy: false
  keys:
    - publicKey: 967ea530ad415376d94049a33a06985a5f4d559acdeee9cecccd882982d03ef1
      index: 0
    - publicKey: 9de797dc0cb16c3eea4d26a5417b2e0c81ee8c1c1d7b358ebb6afaf6a3ca23a5
      index: 1
      alias: sf-1
    - publicKey: 14de87a379114013a20bf4f00ec32c8a0ac3f64046cab80ac8062bc8319dc5e0
      index: 2
      alias: sf-3
    - publicKey: c218080d0ffb4024070946ee25e38675e0408d6ea94c9a5fc937340d223b919c
      index: 3
      alias: sf-3
    - publicKey: 8eea71dbe7f13c11c1e4f796f1206639004e9b648abc57c1a1f32cc57464dbcc
      index: 4
      alias: sf-3
```

## kadena wallet export

Use `kadena wallet export` to export a public and secret key pair from a wallet as unencrypted text. 
This command returns the exported keys to standard output (stdout) in YAML format by default.

### Basic usage

The basic syntax for the `kadena wallet export` command is:

```bash
kadena wallet export [arguments] [flags]
```

### Arguments

You can use the following command-line arguments with the `kadena wallet liexportst` command:

| Use this argument | To do this                                  | 
| ----------------- | ------------------------------------------- |
| -w, --wallet-name _walletName_ | Specify the name of the wallet. |
| -i, --key-index _keyIndex_ | Specify the index of the key you want to export. |
| --password-file _passwordFile_ | Specify the path to a file that stores the password for your wallet. If you don't have the password stored in a text file, you can enter it as standard input. |

### Examples

To export key information for the sf-wallet key at index 3 in YAML format, you can run a command similar to the following:

```bash
kadena wallet export --wallet-name=sf-wallet --key-index=3
```

This command prompts you for the wallet password, then displays the public and secret keys as unencrypted text.
For example:

```bash
Warning: this will print the keypair unencrypted.
publicKey: c218080d0ffb4024070946ee25e38675e0408d6ea94c9a5fc937340d223b919c
secretKey: 25b4a6b924c167cae4ee7d975c2b121ec5bb533a3b9578017d0784cd8547517a


Executed:
kadena wallet export --wallet-name="sf-wallet" --key-index="3" 
```

To use the password stored in a local file and save the exported key to a file in JSON format, you can run a command similar to the following:

```bash
kadena wallet export --wallet-name=sf-wallet --password-file=my-pwd --key-index=3 --json > mykey.json
```
