---
title: Command-line interface
description:
  The `@kadena/kadena-cli` library provides a complete set of commands for creating applications and interacting with the Kadena network interactively or by using scripts from the command-line.
menu: Frontend libraries
label: Command-line interface
order: 2
layout: full
tags: ['TypeScript', 'Kadena client', 'frontend']
---

# Kadena command-line reference

The Kadena command-line interface (`kadena`) provides direct access to the Kadena blockchain and to commands that help you create, deploy, and manage applications for the Kadena network.
You can use the Kadena command-line interface to perform tasks interactively or in scripts and automated workflows that don't allow interactive input.

The Kadena CLI has one primary entry point—the `kadena` parent command. 
By providing a single entry point for performing a wide range of tasks, the Kadena CLI integrates naturally into the typical development workflow.
With commands designed specifically for building, testing, and managing Kadena-based applications, you can focus on building innovative applications using familiar tools.

## Before you begin

What are the prerequisites?
Node version?
npm or pnpm version?

## Install

The Kadena CLI is packaged in a TypeScript library that you can install using a package manager such as `npm` or `pnpm`.

For example, run the following command to install globally using `npm`:

```bash
npm install -g @kadena/kadena-cli
```

Run the following command to install globally using `pnpm`:

```bash
pnpm install -g @kadena/kadena-cli
```

## Get started

You can use the `kadena` parent command with different flags and subcommands to perform different types of operations.

The basic syntax for running `kadena` commands is:

```bash
kadena [subcommand] [action] [argument] [flag]
```

Depending on the subcommand you select, the arguments, options, and flags you specify might apply to the parent command or to a specific subcommand. For example, you can use the `--help` flag to display usage information for the `kadena` parent command or for a specified subcommand.

When you have the SDK installed, you can use the following commands to specify the operation you want to perform. For reference information and examples that illustrate using these commands, select an appropriate command.

To display usage information for the `kadena` parent command, type:

```bash
kadena
```

## kadena

Use the `kadena` parent as the primary entry point for commands used to create, test, deploy, and managed decentralized applications you develop for the Kadena network.

Use the flags, subcommands, and arguments to specify the operations you want to perform interactively or quiet mode.

### Basic usage

The basic syntax for running `kadena` commands is:

```bash
kadena [subcommand] [flag]
```

### Flags

You can use the following optional flags with the `kadena` parent command or with any of the `kadena` subcommands.

| Use this flag | To do this
| ------------- | -----------
| `-h`, `--help` |	Display usage information.
| `-q`, `--quiet` | Eliminate interactive prompts and confirmations to enable automation of tasks.
| `-V`, `--version`	| Display version information.

### Subcommands

Use the following subcommand subjects to specify the type of operation you want to perform or to view usage information for a specific command.

| Use this subcommand | To do this
| ------------------- | -----------
| `config` | Configure the initial context and properties for the command-line interface.
| `dapp` | Create and manage an application project.
| `keys` | Generate and manage public and secret keys.
| `account` | Create, fund, and manage accounts that contain fungibles assets.
| `networks` | Create and manage network information.
| `tx` | Create and manage transactions.
| `wallet` | Generate and manage wallets or generate keys from a wallet.
| `help` | Display usage information for a specified command.

For reference information and examples, select an appropriate subcommand.
	
### Interactive and quiet modes

You can make commands prompt you interactively for required parameters by not including arguments in the command.
You can reduce interactive prompting by specifying the arguments as part of the command. 
If you want to disable all interactive prompts and confirmation messages, you can use the `--quiet `flag.

The `--quiet` flag enables you to automate tasks in environments where interactive input is impractical, such as continuous integration (CI) pipelines. 
If you include the  `--quiet` flag in a command, the command suppresses all interactive prompts and skips confirmations, so that the command executes uninterrupted. 
This mode ensures that automated processes can run smoothly and efficiently, without the need for manual intervention.

### Legacy mode

The `--legacy` flag ensures that the output format for commands related to wallets, keys, and transactions aligns with earlier cryptographic standards and with existing workflows and tools, such as Chainweaver. 
This flag is especially useful if you need to interact with tools that rely on a legacy format for processing transactions or if you need to maintain backwards compatibility for an application.

Legacy mode is available for:

kadena wallet add
kadena keys generate
kadena tx sign

kadena [command] --legacy

## kadena config

Use `kadena config` to set up and manage the Kadena CLI environment.
Use `kadena config init` to creates a `.kadena` folder with the default Kadena networks, including the development, test, and main public networks.

### Basic usage

The basic syntax for the `kadena config` command is:

```bash
kadena config <action> [flag]
```

### Flags

You can use the following optional flags with the `kadena config` command.

| Use this flag | To do this
| ------------- | -----------
| `-h`, `--help` |	Displays usage information.
| `-q`, `--quiet` | Eliminates interactive prompts and confirmations to enable automation of tasks.
| `-V`, `--version`	| Displays version information.

### Actions

Use the following action to specify the operation you want to perform.

| Use this action | To do this
| --------------- | -----------
| `init` | Initialize the `.kadena` folder with default networks.

### Examples

To initialize your project with the default Kadena networks, run the following command:

```bash
kadena config init
```

This command creates the `.kadena` folder in your current working directory and the `devnets` and `networks` subfolders with default settings for the network name, identifier, host, and block explorer for each network.

## kadena dapp

Use `kadena dapp` to create a new decentralized application project from a frontend framework template.

### Basic usage

The basic syntax for the `kadena dapp` command is:

```bash
kadena dapp <action> <argument> [flag]
```

### Flags

You can use the following optional flags with the `kadena dapp` command.

| Use this flag | To do this
| ------------- | -----------
| `-h`, `--help` |	Displays usage information.
| `-q`, `--quiet` | Eliminates interactive prompts and confirmations to enable automation of tasks.
| `-V`, `--version`	| Displays version information.

### Actions

Use the following action to specify the operation you want to perform.

| Use this action | To do this
| --------------- | -----------
| `create` | Create a new project directory using a frontend framework template.

### Arguments

| Use this argument | To do this
| ----------------- | -----------
| `project-directory` | Specify the name of the project directory. This argument is required.
| `--dapp-template`	| Select the framework template to use for the new project. The valid framework templates are `vuejs`, `nextjs`, and `angular`.

### Examples

To create a new project using a Vue.js template, you can run a command similar to the following:

```bash
kadena dapp create my-vuejs --dapp-template="vuejs"
```

If you are missing required dependencies for the template you select, you are prompted to install them.
After running the command, you can change to your project directory by running a command similar to the following:

```bash
cd my-vuejs
```

## kadena keys

Use `kadena keys` to generate and manage public and secret keys.

### Basic usage

The basic syntax for the `kadena keys` command is:

```bash
kadena keys <action> <argument> [flag]
```

### Flags

You can use the following optional flags with the `kadena keys` command.

| Use this flag | To do this
| ------------- | -----------
| `-h`, `--help` |	Displays usage information.
| `-q`, `--quiet` | Eliminates interactive prompts and confirmations to enable automation of tasks.
| `-V`, `--version`	| Displays version information.

### Actions

Use the following action to specify the operation you want to perform.

| Use this action | To do this
| --------------- | -----------
| `create-wallet` | Create your local wallet.
| `import-wallet` | Import or restore wallet from a secret mnemonic phrase.
| `gen-hd` | Generate hierarchical deterministic keys for your wallet.
| `gen-plain` | Generate simple public and secret key pairs.
| `change-wallet-password` | Update the password for your wallet.
| `delete-wallet` | Delete a wallet from your local storage.
| `decrypt` | Decrypt an encrypted message.
| `list` | List all available keys.
| `help` | Display help for a specified command.

### Options

Depending on the action you select, you can specify different arguments and options.
The following table summarizes all of the options you can specify.
To see the options to use for a specific action, use the --help flag on the command line or review the examples.

| Use this argument | To do this
| ----------------- | -----------
| `-a`, `--key-alias`	| Set an alias for the key to store on the file system.
| `-c`, `--key-gen-from-choice` | Choose an action for generating keys.
| `-c`, `--security-current-password` | Enter your current key password
| `--confirm` | Confirm that you want to change the wallet password or delete the wallet.
| `-l`, `--legacy` | Generate keys using a legacy format.
|` -m`, `--key-mnemonic` | Import or restore your wallet using the 12-word mnemonic phrase used to generate your wallet keys.
| `-n`, `--security-new-password` | Enter your new key password
| `-n`, `--key-amount` | Specify the number of key pairs to generate. The default is one.
| `-n`, `--key-message` | Enter a message to decrypt.
| `-q`, `--quiet` | Disables interactive prompts and skips confirmations.
| `-p`, `--security-password` | Enter a password to encrypt your key with.
| `--security-verify-password` | Confirm the password used to encrypt the wallet.
| `-r`, `--key-index-or-range` | Enter the index or range of indices for key generation (for example, 5 or 1-5). The default is one.
| `-w`, `--key-wallet` | Specify the name for your wallet.

### Examples

To create a wallet interactively, run the following command:

```bash
kadena keys create-wallet
```

This command prompts you to enter a wallet name, type a password, and confirm your password.
The command then displays the 12-word mnemonic phrase required to import or restore the wallet and where the wallet is stored on the local filesystem.
For example:

```bash
Mnemonic phrase: urban bubble quarter sleep apple property that machine castle enforce crowd warfare
Please store the key phrase in a safe place. You will need it to recover your keys.


Your wallet was stored at: /Users/my-vuejs/.kadena/wallets/pistolas1/pistolas1.wallet
```

After creating a wallet, you can use the `kadena keys gen-hd` or `kadena keys gen-plain` to generate public and secret key pairs for the wallet.

To generate one or more public and secret key pairs, you can run a command similar to the following:

```bash
kadena keys gen-plain --key-alias="myalias" --key-amount="2"
```

To generate a public and secret key pair using a legacy format for backward compatibility, you can run a command similar to the following:

```bash
kadena keys generate --key-alias="myalias" --key-amount="5" --legacy
```

```bash
kadena keys list
```

kadena wallet add --wallet-name="kadenawallet" --security-password=1245678 --security-verify-password=1245678
password will be hidden after entry: --security-password=* --security-verify-password=*

kadena wallet import [arguments]
Arguments & Options	Description	Required
--key-mnemonic	12 word mnemnoc phrase	
--security-new-password	Set the password for the wallet	
--security-verify-password	Set the password for the wallet (verification)	
--wallet-name	Set the name of the wallet	
--legacy	Use Chainweaver's key derivation	
example:

kadena wallet import-wallet --key-mnemonic="male more sugar violin accuse panel kick nose sign alarm stool inmate" --security-new-password=12345678 --security-verify-password=12345678 --key-wallet="mywalletname"
password will be hidden after entry: --security-new-password=* --security-verify-password=*

kadena wallet generate-keys [arguments]
Generate a keypair from a wallet mnemonic

Arguments & Options	Description	Required
--wallet-name	Provide the name of the wallet	
--key-index-or-range	Set index or range of indices for key generation (e.g., 5 or 1-5)	
--security-password	Set the password for the wallet	
--key-gen-from-choice	Select generation type: genPublicKey (publicKey only), genPublicSecretKey	
(publickey and secretKey), genPublicSecretKeyDec (publicKey and SecretKey Decrypted	
example generating public keys using a range

kadena wallet add --wallet-name="kadenawallet.wallet" --key-index-or-range="0-5" --key-gen-from-choice="genPublicKey" --key-alias="myalias" --security-password=12345678
example generating a public key using a index

kadena wallet add --wallet-name="kadenawallet.wallet" --key-index-or-range="0" --key-gen-from-choice="genPublicKey" --key-alias="myalias" --security-password=12345678
example generating a public and secret key using a index

kadena wallet add --wallet-name="kadenawallet.wallet" --key-index-or-range="0" --key-gen-from-choice="genPublicSecretKey" --key-alias="myalias" --security-password=12345678
example generating a public and decrypted secret key using a index (will not be stored on filesystem)

kadena wallet add --wallet-name="kadenawallet.wallet" --key-index-or-range="0" --key-gen-from-choice="genPublicSecretKeyDec" --security-password=12345678
password will be hidden after entry: --security-password=*

kadena wallet change-password [arguments]
Arguments & Options	Description
--wallet-name	Provide the name of the wallet
--security-current-password	Provide the current password of the wallet
--security-new-password	Set the new password for the wallet
--security-verify-password	Set the new password for the wallet (verification)
--confirm	Confirm password change
example:

kadena wallet change-password --wallet-name="kadenawallet.wallet" --security-current-password=12345678 --security-new-password=12345678 --security-verify-password=1234567 --confirm=true
password will be hidden after entry: --security-current-password=* --security-new-password=* --security-verify-password=*

kadena wallet delete [arguments]
Arguments & Options	Description
--wallet-name	Select the name of the wallet
--confirm	Confirm deletion of wallet
example single wallet deletion:

kadena wallet delete --wallet-name="kadenawallet.wallet" --confirm=true
example deletion of all wallets:

kadena wallet delete --wallet-name="all" --confirm=true
kadena wallet list [arguments]
Arguments & Options	Description
--wallet-name	Set the name of the wallet
example for listing specific wallet:

kadena wallet list --wallet-name="walletname"
example for listing all wallets:

kadena wallet list --wallet-name="all"
kadena wallet decrypt [arguments]
Arguments & Options	Description
--key-message	Provide encrypted Message
--security-current-password	Provide password to decrypt message
example:

kadena wallet decrypt --key-message="encryptedmessage" --security-current-password=12345678
password will be hidden after entry: --security-current-password=*

## kadena networks

Use `kadena networks` to add and manage Kadena networks and network information.

### Basic usage

The basic syntax for the `kadena networks` command is:

```bash
kadena networks <action> <argument> [flag]
```

### Flags

You can use the following optional flags with the `kadena config` command.

| Use this flag | To do this
| ------------- | -----------
| `-h`, `--help` |	Displays usage information.
| `-q`, `--quiet` | Eliminates interactive prompts and confirmations to enable automation of tasks.
| `-V`, `--version`	| Displays version information.

### Actions

Use the following actions to specify the operation you want to perform.

| Use this action | To do this
| --------------- | -----------
| `create`	| Create a new network.
| `delete` | Delete an existing network.
| `list`	| List all available networks.
| `update` | Update existing network information.

### Arguments

Depending on the action you select, you can specify different arguments and options.
The following table summarizes all of the arguments you can specify.

| Use this argument | To do this
| ----------------- | -----------
| `--network-name` | Specify the name of the network to act on.
| `--network-id` | Specify the identifier for the network to act on.
| `--network-host` | Specify the host for the network to act on.
| `--network-explorer-url` | Specify the explorer URL for the network to act on.
| `--network-overwrite` | Confirm that you want to overwrite existing information for the specified network.
| `--network-delete` | Confirm that you want to delete the specified network.

### Examples

To create a new network, you can run a command similar to the following:

```bash
kadena networks create \
  --network-name="mydevnet" \
  --network-id="mydevnet01" \
  --network-host="localhost:8081" \
  --network-explorer-url="https://explorer.localhost:8081" \
  --network-overwrite="yes"
```

If you leave out any of the arguments, you are prompted interactively to provide the missing information.
Because this example specifies all of the arguments, the command creates the network and displays output similar to the following:

```bash
-------------------------------------------------------------------------------
  networkName : mydevnet                                                  
  networkId : mydevnet01                                                  
  networkHost : localhost:8081                                            
  networkExplorerUrl : https://explorer.localhost:8081                    
  networkOverwrite : yes                                                  
--------------------------------------------------------------------------------
```

To delete an existing network, you can run a command similar to the following:

```bash
kadena network delete \
  --network="mydevnet" \
  --network-delete="yes"
```

To list the details for all networks, you can run a command similar to the following:

```bash
kadena network list
```

To update the information for a network, you can run a command similar to the following:

```bash
kadena networks update \
  --network-name="mydevnet" \
  --network-id="mydevnet01" \
  --network-host="https://api.chainweb.com" \
  --network-explorer-url="https://explorer.chainweb.com/mainnet/tx/"
```



## kadena account
Tool to manage / fund accounts of fungibles (e.g. coin')

Subcommand	Description	Default value
add-manual	Add an existing account to the CLI	
add-from-wallet	Add an account from a key wallet	
create	create an account in mainnet on chain(nr) for token	
details	Get details of an account	
fund	Fund a existing/new account	
name-to-address	Resolve a .kda name to a k:address (kadenanames)	
address-to-name	Resolve a k:address to a .kda name (kadenanames)	
list	List available account(s)	
delete	Delete existing account(s)	
kadena account add-manual [arguments]
Arguments & Options	Description	Required
--account-alias	Set alias for account	
--account-name	Set account name	
--fungible	Fungible e.g coin	
--network	Name of the network to be used	
--chain-id	Chain to be used	
--public-keys	Comma seperated list of public keys	
--predicate	keys-all, keys-any, keys-2, Custom predicate	
example:

kadena account add-manual --account-alias="myalias" --account-name="myaccountname" --fungible="coin" --network="mainnet" --chain-id="1" --public-keys="mypublickey" --predicate="keys-all"
kadena account add-from-wallet [arguments]
Arguments & Options	Description	Required
--account-alias	Set alias for account	
--key-wallet	Provide the name of the wallet	
--fungible	Fungible e.g coin	
--network	Name of the network to be used	
--chain-id	Chain to be used	
--public-keys	Comma separated list of public keys	
--predicate	keys-all, keys-any, keys-2, Custom predicate	
example:

kadena account add-from-wallet --account-alias="myalias" --key-wallet="mywallet.wallet" --fungible="coin" --network="mainnet" --chain-id="1" --public-keys="publickey" --predicate="keys-all"
kadena account create [arguments]
Arguments & Options	Description	Required
--account-name	Provide an account name	No
--fungible	Fungible e.g coin	No
--chain-id	Chain to be used	
--public-keys	Comma separated list of public keys	
--predicate	keys-all, keys-any, keys-2, Custom predicate	
example:

create an account with optional account name and fungible

kadena account create --account-name="" --public-keys="YOUR_PUBLIC_KEY" --predicate="keys-any" --chain-id="0"
create an account with an account name and fungible

kadena account create --account-name="mainnet_test_account" --public-keys="YOUR_PUBLIC_KEY" --predicate="keys-any" --chain-id="0" --fungible="coin
kadena account details [arguments]
Arguments & Options	Description	Required
--account	Provide account alias/name for account	
--network	Name of the network to be used	
--chain-id	Chain to be used	
example using account alias:

kadena account details --account="myalias" --network="mainnet" --chain-id="1"
example using account name:

kadena account details --account="k:PUBLIC_KEY" --network="mainnet" --chain-id="1"
kadena account fund [arguments]
Arguments & Options	Description	Required
--account	Provide alias for account	
--amount	Amount to fund	
--network	Name of the network to be used	
--chain-id	Chain to be used	
example:

kadena account fund --account="myalias" --amount="10" --network="testnet" --chain-id="1"
kadena account account name-to-address [arguments]
Arguments & Options	Description	Required
--network	Name of the network to be used	
--account-kdn-name	Provide .kda name to resolve to k:account	
example:

kadena account name-to-address --network="mainnet" --account-kdn-name="kadena.kda"
kadena account address-to-name [arguments]
Arguments & Options	Description	Required
--network	Name of the network to be used	
--account-kdn-address	Provide k:account to resolve to .kda name	
example:

kadena account address-to-name --network="mainnet" --account-kdn-address="k:account"
kadena account list [arguments]
Arguments & Options	Description
--account-alias	Provide the alias of the account
example for listing specific account:

kadena account list --account-alias="accountAlias"
example for listing all accounts:

kadena account list --account-alias="all"
kadena account delete [arguments]
Arguments & Options	Description
--account-alias	Provide the alias of the account
--confirm	Confirm deletion of account
example for delete a specific account:

kadena account delete --account-alias="accountAlias" --confirm
example for delete all accounts:

kadena account delete --account-alias="all" --confirm
kadena tx
Tool for creating and managing transactions

Subcommand	Description	Default value
send	Send a transaction to the network	
sign	Sign a transaction using a keypair,	
Sign a transaction using your local aliased file	
Sign a transaction using your local wallet	
test	Test a signed transaction	
add	Select a template and add a transaction	
kadena tx add [arguments]
Arguments & Options	Description	Required
--template	Select template path	
--template-data	Provide File path of data to use for template	
--network-id	Provide the network id	
--out-file	Provide path to save output	
--xx	Args are created onl the fly based on template	
example:

kadena tx add --template="transfer.yaml" --template-data="path" (--account-from="k:account" --account-to="k:toaccount" --amount="1" --chain-id="1" --pk-from="publicKey") --network-id="testnet04" --out-file="transaction-(request-key).json"
Template variables are prompted unless assigned via --template-data or direct flags. Variables can be prefixed to enable value selection using:

account: to select a account name
key: to select a public key
network: to select existing networkId
decimal: to enable decimal input validation
kadena tx sign [arguments]
Arguments & Options	Description	Required
--tx-sign-with="aliasFile"	Provide signing method	Yes
--key-pairs	Provide publickey and secretKey (or list separated my semicolon)	
--tx-unsigned-transaction-files	Provided unsigned transaction file(s) to sign (or comma seperated list)	
example:

kadena tx sign --tx-sign-with="keyPair" --key-pairs="publicKey=xxx,secretKey=xxx" --tx-unsigned-transaction-files="transaction-(request-key).json"
kadena kadena sign [arguments]
Arguments & Options	Description	Required
--tx-sign-with="aliasFile"	Provide signing method	Yes
--key-wallet	Provide the name of the wallet	
--security-password	Provide the password for the wallet	
--key-alias-select	Select a aliased file	
--tx-unsigned-transaction-files	Provided unsigned transaction file(s) to sign (or comma separated list)	
example:

kadena sign --tx-sign-with="aliasFile" --key-wallet="mywallet.wallet" --security-password=1234567 --key-alias-select="mywalletalias.key" --tx-unsigned-transaction-files="transaction-(request-key).json,transaction-(request-key).json"
password will be hidden after entry: --security-password=*

kadena tx sign [arguments]
Arguments & Options	Description	Required
--tx-sign-with="localWallet"	Provide signing method	Yes
--key-wallet	Provide the name of the wallet	
--security-password	Provide the password for the wallet	
--key-alias-select	Select a aliased file	
--tx-unsigned-transaction-files	Provided unsigned transaction file(s) to sign (or comma separated list)	
example:

kadena tx sign --tx-sign-with="localWallet"  --key-wallet="mywallet.wallet" --security-password=12345678 --tx-unsigned-transaction-files="transaction-(request-key)-signed.json"
password will be hidden after entry: --security-password=*

kadena tx test-signed-transaction [arguments]
Arguments & Options	Description	Required
--network	Name of the network to be used	
--directory	Provide the directory for the signed transaction	
--tx-signed-transaction-files	Provided signed transaction file(s) to sign (or comma separated list)	
--chain-id	Chain to be used	
example:

kadena tx test-signed-transaction --network="testnet" --directory="./" --tx-signed-transaction-files="transaction-(request-key)-signed.json" --chain-id="1"
kadena tx send [arguments]
Arguments & Options	Description	Required
--tx-signed-transaction-files	Provided signed transaction file(s) to sign (or comma separated list)	
--tx-transaction-network	Kadena networks comma separated list in order of transaction	
(e.g. "mainnet, testnet, devnet, ...")	
--poll	Poll status of sent transactions	
example:

kadena tx send --tx-signed-transaction-files="transaction-I4WaMUwQZDxhaf2r2FZj0TQf7Zv1J5v45Yc2MYxPURU-signed.json" --tx-transaction-network "mainnet, testnet"
kadena tx send --tx-signed-transaction-files="transaction-I4WaMUwQZDxhaf2r2FZj0TQf7Zv1J5v45Yc2MYxPURU-signed.json" --tx-transaction-network "mainnet, testnet" --poll
kadena tx status [arguments]
Arguments & Options	Description	Required
--request-key	Provide a transaction request key	
--network	Select name of the network where transaction happened	
(e.g. "mainnet, testnet, devnet, ...")	
--chain-id	Chain to be used in the transaction	
example:

kadena tx status --request-key="118mEpX1-6NpJT1kArsWIHHVtJaOERQOeEwNoouOSGU" --network="testnet" --chain-id="0"
