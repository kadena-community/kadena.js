---
title: Build with Command-line interface
description:
  The `@kadena/kadena-cli` library provides a complete set of commands for creating applications and interacting with the Kadena network interactively or by using scripts from the command-line.
menu: Build with kadena-cli
label: Build with kadena-cli
order: 2
layout: full
tags: ['TypeScript', 'Kadena command-line interface', 'frontend frameworks']
---

# Build with kadena-cli

The Kadena command-line interface (`kadena-cli`) provides direct access to the Kadena blockchain and to commands that help you create, test, deploy, and manage applications for the Kadena network.
You can use the Kadena command-line interface to perform tasks interactively or in scripts and automated workflows that don't allow interactive input.

The Kadena CLI has one primary entry point—the `kadena` parent command. 
By providing a single entry point for performing a wide range of tasks, the Kadena CLI integrates naturally into the typical development workflow.
With commands designed specifically for building, testing, and managing Kadena-based applications, you can focus on building innovative applications using familiar tools.

## Before you begin

Before you use the Kadena command-line interface, verify the following basic requirements:

- You have `node`, version 18 or later, installed.

- You have the `pnpm` package manager installed.
  
  Depending on your development environment, you can install pnpm using a standalone script or using a package manager. For example, you can run the command `brew install pnpm` or `npm install --global pnpm` to install pnpm on your local computer. For more information about installing pnpm on different operating systems, see Installation.
  
  Run `pnpm --version` to verify that you have pnpm installed and the version you are running.

## Install

The Kadena CLI is packaged in a TypeScript library that you can install using a package manager such as `npm` or `pnpm`.

To install globally using `npm` package manager, run the following command:

```bash
npm install -g @kadena/kadena-cli
```

To install globally using `pnpm` package manager, run the following command:

```bash
pnpm install -g @kadena/kadena-cli
```

To verify the package is installed and display usage information, type `kadena` and press Return:

```bash
kadena
```

To see the version of the package you have installed, run the following command:

```bash
kadena version
```

## Get started

The `kadena-cli` package is designed to streamline the development workflow with commands that provide direct
access to everything you need to build on and interact with Kadena networks.
Whether you're doing local development, deploying an application on the test network, or managing your accounts and keys on the Kadena main network, you can use the `kadena-cli` commands to complete tasks without leaving your development environment.

The following diagram provides an overview of the `kadena` command-line interface:

![Kadena command-line interface at a glance](/assets/docs/kadena-cli-overview.png)

## Prepare a development workspace

You can use the `kadena` entry point to run commands to help you set up a complete local development environment.
You can use the command-line interface to generate random keys, create local wallets, add accounts, customize network connections, and construct and send transactions.
After you prepare a development workspace, you can use the kadena commands in combination with other tools—like Pact and Kadena client—to create, test, deploy, and manage decentralized applications for the Kadena network.

## Start with interactive prompting

The `kadena-cli` package is designed to simplify setting up a development environment.
Its intuitive commands prompt you for all of the information required to complete tasks, like creating accounts or managing keys.
Responding to prompts interactively is typically the best approach when getting started, eliminating the need to look up or remember the arguments required for the action you want to perform.

To start using the CLI in interactive Mode, you simply type a command without any options.
For example if you want to add a new wallet but aren't sure of all the required flags and
arguments, you can start by entering the following command:

```
kadena wallet add
```

The CLI then displays interactive prompts to guide you through the necessary steps, asking for the information
required to successfully add the wallet to your local development environment.

Interactive mode is especially useful for new users or those who prefer a more guided approach when using command-line tools. 
It also serves as a learning tool by demonstrating the required inputs for various commands, enhancing your
familiarity with the CLI's functionalities.
As you gain experience, you can reduce interactive prompting by specifying some or all of the arguments as part of the command. 
If you run any command without specifying all of its required parameters, the CLI prompts you to provide the missing information. 

For most commands, responding to interactive prompts and confirmation messages help to ensure that you provide all of the information necessary to successfully execute each command.
However, if you want to disable all interactive prompts and confirmation messages, you can use the `--quiet `flag.
The `--quiet` flag enables you to automate tasks in environments where interactive input is impractical, such as continuous integration (CI) pipelines. 

If you include the  `--quiet` flag in a command, the command suppresses **all interactive prompts** and **skips all confirmations**, so that the command executes uninterrupted without human intervention. 
Running commands using the  `--quiet` flag ensures that automated processes can run smoothly and efficiently, without manual input.
If you use the  `--quiet` flag for a command, you must include all required arguments in the command line.

### Basic usage

The basic syntax for running `kadena` commands is:

```bash
kadena <subcommand> <action> [arguments] [flags]
```

### Flags

You can use the following optional flags with the `kadena` parent command or with any of the `kadena` subcommands.

| Use this flag | To do this
| ------------- | -----------
| `-h`, `--help` |	Display usage information.
| `-q`, `--quiet` | Eliminate interactive prompts and confirmations to enable automation of tasks.
| `--json` | Display command output in JSON format.
| `--yaml` | Display command output in YAML format.
| `-V`, `--version`	| Display version information.

### Subcommands

Subcommands to perform actions or organized into categories that describe the subject of the action you want to perform. 
For example, you can create and manage all wallet-related information using the `wallet` subcommand.
Use the following subcommands to select the category of information for the operation you want to perform.

| Use this subcommand | To do this
| ------------------- | -----------
| `config` | Configure the initial context and properties for working with the `kadena` command-line interface.
| `dapp` | Create and manage an application project using a frontend framework template.
| `wallet` | Generate keys and manage wallets.
| `key` | Generate and manage public and secret keys.
| `account` | Create, fund, and manage accounts that contain fungibles assets.
| `network` | Create and manage network information.
| `tx` | Create and manage transactions.
| `help` | Display usage information for a specified command.
| `version` | Display version information.

For reference and usage information—including the arguments and options for specific subcommands and actions—use the `--help` flag on the command-line or review the information in [Command-line reference](/reference/kadena-cli).

## Configure initial settings

Use `kadena config init` to create an initial configuration folder for settings for the Kadena command-line interface to use. 
Depending on where you want the configuration settings available, you can create this folder in your current working directory or in your home directory.

### Working directory

If you select the current working directory, the `.kadena` folder is accessible
from anywhere in that directory. For example, if you run `kadena config init` with
`$HOME/projects/my-kadena-project` as your current working folder, you can access the `.kadena`
configuration settings from anywhere inside that project folder.

### Home directory

If you select your home directory—which is equivalent to running the `kadena config init --global` command—the `kadena` folder is added to the `.config` folder in your home directory and accessible from anywhere on your computer. 

Configuration settings that are defined in a local working directory take precedence over configuration settings defined in the home directory. You add more than one .kadena folder to your development environment, you can use `kadena config path` to see which path is being used in a specific directory.

To configure initial settings:

1. Open a terminal shell on the computer where you've installed the `kadena-cli` package.
2. Enter `kadena config init` on the command line to create the configuration folder interactively:
   
   ```shell
   kadena config init
   ```
   
   Because you're running the command interactively, you are prompted to select a location.
   For example:

   ```shell
   ? Location of kadena config directory (Use arrow keys)
   ❯ Working directory:   /Users/pistolas/MY-KADENA/.kadena
     User home directory: /Users/pistolas/.kadena
   ```
1. Use the up and down arrow keys to select the location for the configuration folder, then press Return.

### Default network configuration

After you select a directory location, your selected folder location is confirmed and default network configuration settings are added to a `networks` subfolder in the `.kadena` folder.
For example:

```shell
? Location of kadena config directory User home directory: 
  /Users/pistolas/.kadena
  Created configuration directory:

    /Users/pistolas/.kadena

  Added default networks:

    - mainnet
    - testnet
    - devnet
```

To continue setting up your local development environment, you are then prompted to create a wallet.
For example:

```bash
? Would you like to create a wallet? (Use arrow keys)
❯ Yes
  No
```

If you already have keys and an account or an existing wallet you want to use, you can select **No** to end the interactive session.
However, wallets are an important part of interacting with any blockchain, so you have the option to create one as part of your initial configuration steps.

### Create a local wallet

If you select **Yes** to create a new wallet as part of your initial configuration, you are prompted to provide a wallet name and password and to generate a public and secret key pair.
For example:

```bash
? Would you like to create a wallet? Yes
? Enter your wallet name: pistolas
? Enter the new wallet password ********
? Re-enter the password ********
You can use the --password-file flag to provide a password.
? Create an account using the first wallet key? Yes

Mnemonic Phrase
stairs small flag festival slogan another gravity busy rotate fence quiz share

Please store the mnemonic phrase in a safe place. You will need it to recover your wallet.

First keypair generated
publicKey: 5926764fb5813ed1618299e5a3e0401b328a4ac637b4ded13e81a566fee2c4b5

Wallet Storage Location
.kadena/wallets/pistolas.yaml

Account created
accountName: k:5926764fb5813ed1618299e5a3e0401b328a4ac637b4ded13e81a566fee2c4b5

Account Storage Location
.kadena/accounts/pistolas.yaml

Executed:
kadena config init --location="/Users/pistolas/MY-KADENA/.kadena" --create-wallet="true" --wallet-name="pistolas" --create-account="true" 
```

Be sure to copy and store the mnemonic phrase in a safe place. 
This 12-word secret phrase is required if you ever need to recover your wallet.
You now have a public key that you can use to sign transactions and authorize certain activity.
In this example, the public key for the wallet is 5926764fb5813ed1618299e5a3e0401b328a4ac637b4ded13e81a566fee2c4b5 and the principal account associated with the key is k:5926764fb5813ed1618299e5a3e0401b328a4ac637b4ded13e81a566fee2c4b5.

For more information about accounts names, keys, and principal accounts, see [Accounts, keys, and principals](/learn/accounts).

At this point, you have a wallet and an account, but this information isn't associated with a specific network—devnet, testnet, or mainnet—or with any chain identifier (0-19).
The account has a private and secret key, but no predicate—the guard that defines the condition that must be satisfied for a transaction to be valid.
You need to add the account to a network and one or more chains and specify a predicate for it to use before the account is ready to send and receive funds or sign transactions.

## Add your account to a network

To create an account on the Kadena main network, you need to either have KDA already or have someone who can transfer funds to your account for you.
However, for local development or development on the Kadena test network, you can fund your account using `kadena account` commands, a faucet application, or publicly available private keys.

If you created a local wallet and an account using the wallet key, you can use that information to add your account to the development or test network and one or more chains.

To add your account to the test network:

1. Open a terminal shell on the computer where you've installed the `kadena-cli` package.
2. Enter `kadena account add` on the command line to enter account information interactively:
   
   ```shell
   kadena account add
   ```
   



## Transfer funds to the new account

## Fund the account

## Get account details

kadena account details
? Select an account:(alias - account name)
  Enter an account name manually:
❯ pistolas      - k:592676....fee2c4b5

Select a network (Use arrow keys)
❯ devnet
  mainnet
  testnet

? Enter a ChainId (0-19) (comma or hyphen separated e.g 0,1,2 or 1-5 or all):

## Set a default network

Many commands require you to specify the network you want to work with.
You can streamline command execution by setting a default network.
For example, if you are just getting started, you might want to set the default network to `devnet` to save time as you iterate on your application.
Later, you might want to unset the default, so you can specify the network to use on a command-by-command basis.
As your application matures, you might want change the default network from `devnet` to `testnet` so you can deploy updates for broader testing.

To set the default network:

1. Open a terminal shell on the computer where you've installed the `kadena-cli` package.
2. Enter `kadena network set-default` on the command line to set the default network interactively:

   ```shell
   kadena network set-default
   ```
   
   Because you're running the command interactively, you are prompted to select a network.
   For example:

   ? Select a network (Use arrow keys)
   ❯ devnet
     mainnet
     testnet

3. Use the up and down arrow keys to select the network you want to use as your default network, then press Return.
   For example, select **devnet**, then press Return.

4. Select **Yes** to confirm your default network, then press Return.
   
## Create a project

You can use the `kadena dapp`command to create a new project directory for the decentralized application you want to build.
This command allows you to create an empty project directory or to create a new project from one of the frontend framework templates that are currently supported.
You can create the new project using templates for the following frontend frameworks:

- [Nextjs][18]
- [Vuejs][19]
- [Angular][20]

To create a new project from a template:

1. Open a terminal shell on the computer where you've installed the `kadena-cli` package.
2. Enter `kadena dapp create <app-name>` on the command line to create a new project directory with the name you specify.
   For example, to create a project names my-to-do:

   ```shell
   kadena dapp add my-to-do
   ```
   
   Because you're running the command interactively, you are prompted to select a template.
   For example:

   ```shell
   ? What template do you want to use? (Use arrow keys)
   ❯ Angular
     Next JS
     Vue JS
   ```
1. Use the up and down arrow keys to select the template to use for your project, then press Return.

   If you are missing required dependencies for the template you select, you are prompted to install them.

2. Confirm that you want to install missing dependencies.
   
1. Change to your project directory by running a command similar to the following:

```bash
cd my-vuejs
```

## Add a second set of keys

## Add a new account

## Add a transaction

Use `kadena wallet` to generate, import, and manage a local wallet.

### Basic usage

The basic syntax for the `kadena wallet` command is:

```bash
kadena wallet <action> <arguments> [flag]
```

### Flags

You can use the following optional flags with the `kadena wallet` command.

| Use this flag | To do this
| ------------- | -----------
| `-h`, `--help` |	Display usage information.
| `-l`, `--legacy` | Use a legacy format for output.
| `-q`, `--quiet` | Eliminate interactive prompts and confirmations to enable automation of tasks.
| `-V`, `--version`	| Display version information.

### Actions

Use the following actions to specify the operation you want to perform.

| Use this action | To do this
| --------------- | -----------
| add [options] | Add a new local wallet.
| import [options] | Import or restore wallet from a 12-word mnemonic secret phrase.
| generate-key [options] | Generate public and secret key pairs from your wallet.
| change-password [options] | Update the password used to unlock your wallet.
| decrypt [options] | Decrypt an encrypted  message.
| delete [options] | Delete a specified wallet from your local filesystem.
| list [options] | List information about a specified wallets or all wallets.
| help [command] | Display usage information for a specified command.

### Arguments

Depending on the action you select, you can specify different arguments and options.
The following table summarizes all of the options you can specify.
To see the options to use for a specific action, use the `--help` flag on the command-line or review the examples.

| Use this argument | To do this
| ----------------- | -----------
| `-w`, `--wallet-name` <`walletName`> | Specify the name for your wallet.
| `--password-file` <`passwordFile`>  | Specify the path to the password file.
| `-m`, `--key-mnemonic` <`keyMnemonic`> | Enter the 12-word mnemonic secret phrase used to generate your wallet keys.
| `-c`, `--key-gen-from-choice` <`keyGenFromChoice`> | Select the type of key you want to generate. The valid options are `genPublicKey` (public key only), `genPublicSecretKey` (public and secret key), and `genPublicSecretKeyDec` (public key and secret key decrypted).
| `-a`, `--key-alias` <`keyAlias`> | Specify an alias for storing the key on the filesystem.
| `-r`, `--key-index-or-range` <`keyIndexOrRange`> | Enter the index or range of indices for key generation. For example, you can specify zero (0) for the parent key pair or generate a range of child key pairs (1-5). The default index is 0.
| `-c`, `--current-password-file` <`currentPasswordFile`> | Specify the path to the current password file. In most cases, you use this option to change a password or decrypt a message when using the `--quiet` flag for non-interactive input.
| `-n`, `--new-password-file` <`newPasswordFile`> | Specify the path to the new password file. In most cases, you use this option to change a password when using the `--quiet` flag for non-interactive input.
| `-c`, `--confirm` | Confirm that you want to change the password for the wallet or delete a wallet. In most cases, you use this option to change a password when using the `--quiet` flag for non-interactive input.
| `-m`, `--message` <`message`> | Specify the message you want to decrypt.
| `-c`, `--current-password-file` <`currentPasswordFile`> | Specify the path to the current password file.
| `-n`, `--amount` <`amount`> | Specify the number of keys to generate for a wallet. The default is one.

### Examples

To add a new local wallet interactively, you can run the following command:

```bash
kadena wallet add
```

This command prompts you to enter the wallet name and to set and confirm the password to unlock the wallet, then displays your 12-word secret phrase and the location of your local wallet.
For example:

```bash
You can use the --password-file flag to provide a password.
Mnemonic Phrase                                                            
house second brick miracle trip fire peasant supply hen boost supper dignity
Please store the mnemonic phrase in a safe place. You will need it to recover your wallet.

Wallet Storage Location                                           
/Users/tech-pubs/.kadena/wallets/pistolas-test/pistolas-test.wallet
```

To import a Chainweaver wallet so you to manage it from the command-line, you can run a command similar to the following:

```bash
kadena wallet import --key-mnemonic="model amber rose spoil motor deal alcohol lucky garage empty sausage lunch" --wallet-name="chainweaver-desktop" --legacy
```

This command prompts you to enter and confirm the password to unlock the wallet, then displays the location of your local wallet.

To generate four hierarchical deterministic public and secret key pairs for a local wallet, you can run a command similar to the following:

```bash
kadena wallet generate-keys --wallet-name="pistolas-test.wallet" --key-index-or-range="1-4" --key-gen-from-choice="genPublicSecretKey" --key-alias="pistolas-keys"
```

This command prompts you to enter the password the keys, then displays the public and secret key pairs and the location of the keys on the local filesystem.

To list keys for all wallets, , you can run a command similar to the following:

```bash
kadena wallet list --wallet-name="all"
```

This command returns output similar to the following for all wallets:

```bash
Wallet: chainweaver-desktop (legacy)
No keys

Wallet: lola-pistola
Filename      Index  Legacy   Public Key            Secret Key
pistola1.key  1      No       48bb354f....a721693c  OUVReUwz....UxNS0pweDk5ZVFLYTdOS3VBRXJHQQ==
pistola2.key  2      No       7b355f98....9454959b  WXg2bXFB....WZZb2FxOUdNVUlaaGc2VXpsTWk3Tw==
pistola3.key  3      No       256be5b3....a0ba2e12  aU1YVjI3....E9LNUVQb2hGRGZqeFJpcTRMbjR1TA==
pistola4.key  4      No       b3f0f14a....1f04d21a  U0cxQWEr....1VxWHJWZVFKaCtBVUd5WFhYcnNHSQ==


Wallet: pistolas-test
Filename      Index  Legacy   Public Key            Secret Key
genkey1.key   1      No       c7141a14....ac01a3c9  N/A
```

To delete a wallet interactively, you can run the following command:

```bash
kadena wallet delete
```

This command prompts you to select the wallet you want to delete and to confirm the action.
If you select Yes, the wallet is deleted from the local filesystem.

## kadena key

Use `kadena key` to generate and manage public and secret keys.

### Basic usage

The basic syntax for the `kadena key` command is:

```bash
kadena key <action> <argument> [flag]
```

### Flags

You can use the following optional flags with the `kadena keys` command.

| Use this flag | To do this
| ------------- | -----------
| `-h`, `--help` |	Display usage information.
| `-l`, `--legacy` | Generate keys using a legacy format.
| `-q`, `--quiet` | Eliminate interactive prompts and confirmations to enable automation of tasks.
| `-V`, `--version`	| Display version information.

### Actions

Use the following action to specify the operation you want to perform.

| Use this action | To do this
| --------------- | -----------
| `generate` | Generate random public and secret key pairs.
| `delete` | Delete a public and secret key pair from the local filesystem.
| `list` | List all available keys.
| `help` | Display help for a specified command.

### Arguments

Depending on the action you select, you can specify different arguments and options.
The following table summarizes all of the options you can specify.
To see the options to use for a specific action, use the `--help` flag on the command-line or review the examples.

| Use this argument | To do this
| ----------------- | -----------
| `-a`, `--key-alias`	<`keyAlias`> | Set an alias for the key to store on the file system.
| `-n`, `--key-amount` <`keyAmount`>| Specify the number of key pairs to generate. The default is one.

### Examples

To generate a random public and secret key pair interactively, run the following command:

```bash
kadena keys generate --key-alias="myalias" --key-amount="2"
```

This command prompts you to enter the alias you want to use for the key and the number of keys to generate.
After you respond to the prompts, the command displays confirmation that the keys were generated and where the key is stored on the local filesystem.
For example:

```bash
Generated Plain Key Pair(s): 
Public Key           Secret Key                                                      
af042ef9<public-key> 52d872b1<secret-key>

The Plain Key Pair is stored within your keys folder under the filename(s):
Filename
pistolas.key

Executed:
kadena key generate --key-alias="pistolas" --key-amount="1" 
```

To generate two public and secret key pairs, you can run a command similar to the following:

```bash
kadena key generate --key-alias="myalias" --key-amount="2"
```

To generate a public and secret key pair using a legacy format for backward compatibility, you can run a command similar to the following:

```bash
kadena key generate --key-alias="myalias" --key-amount="5" --legacy
```

To list information about available keys, you can run the following command:

```bash
kadena keys list
```

This command displays information similar to the following:

```bash
Alias         Index Legacy Public Key           Secret Key                                                      
myalias-1.key 1     No     8724e659<public-key> 5a2410de<secret-key>
myalias.key   0     No     6ab6cffe<public-key> 45b829ee<secret-key>
pistolas.key  0     No     dd4a1a4a<public-key> 2c1863f3<secret-key>
```

To delete a key interactively, you can run the following command:

```bash
kadena key delete
```

This command prompts you to select all key files or a specific key file.
After you select the key file you want to delete, you are prompted to confirm the selection.
For example:

```bash
? Select a key file: test.key: af042....5b9b9f
? Are you sure you want to delete the key: "test.key"? Yes

the key: "test.key" has been deleted

Executed:
kadena key delete --key-files="test.key" --confirm 
```

## kadena network

Use `kadena network` to add and manage Kadena networks and network information.

### Basic usage

The basic syntax for the `kadena network` command is:

```bash
kadena network <action> <arguments> [flag]
```

### Flags

You can use the following optional flags with the `kadena network` command.

| Use this flag | To do this
| ------------- | -----------
| `-h`, `--help` |	Display usage information.
| `-q`, `--quiet` | Eliminate interactive prompts and confirmations to enable automation of tasks.
| `-V`, `--version`	| Display version information.

### Actions

Use the following actions to specify the operation you want to perform.

| Use this action | To do this
| --------------- | -----------
| `add`	| Add a new local network configuration.
| `list`	| List all available local networks.
| `update` | Update existing network information.
| `delete` | Delete an existing network configuration.
| `help` | Display help for a specified command.

### Arguments

Depending on the action you select, you can specify different arguments and options.
The following table summarizes all of the arguments you can specify.
To see usage information for a specific action, use the `--help` flag in the command-line or see the examples for performing specific tasks.

| Use this argument | To do this
| ----------------- | -----------
| `-n`, `--network-name` <`networkName`> | Specify the name of the network to act on.
| `-i`, `--network-id` <`networkId`>| Specify the identifier for the network to act on.
| `-s`, `--network-host` <`networkHost`>| Specify the host for the network to act on.
| `--network-explorer-url` <`networkExplorerURL`>| Specify the explorer URL for the network to act on.
| `--network-overwrite` yes|no | Confirm that you want to overwrite existing information for the specified network.
| `--network-delete` yes|no | Confirm that you want to delete the specified network.

### Examples

To add a new network configuration, you can run a command similar to the following:

```bash
kadena network add \
  --network-name="mydevnet" \
  --network-id="mydevnet01" \
  --network-host="localhost:8081" \
  --network-explorer-url="https://explorer.localhost:8081" \
  --network-overwrite="yes"
```

If you leave out any of the arguments, you are prompted interactively to provide the missing information.
Because this example specifies all of the arguments, the command creates the network and displays output similar to the following:

```bash
The network configuration "mydevnet" has been saved.
```
To list the details for all networks, you can run a command similar to the following:

```bash
kadena network list
```

This command displays information similar to the following:

```bash
Network  Network ID Network Host   Network Explorer URL           
mydevnet mydevnet01 localhost:8081 https://explorer.localhost:8081
```

To update the information for a network, you can run a command similar to the following:

```bash
kadena networks update \
  --network-name="mydevnet" \
  --network-id="mydevnet01" \
  --network-host="https://api.chainweb.com" \
  --network-explorer-url="https://explorer.chainweb.com/mainnet/tx/"
```

To delete an existing network, you can run a command similar to the following:

```bash
kadena network delete \
  --network="mydevnet" \
  --network-delete="yes"
```

## kadena account

Use `kadena account` to add, fund, and manage Kadena accounts and fungible assets.

### Basic usage

The basic syntax for the `kadena account` command is:

```bash
kadena account <action> <arguments> [flag]
```

### Flags

You can use the following optional flags with the `kadena account` command.

| Use this flag | To do this
| ------------- | -----------
| `-h`, `--help` |	Display usage information.
| `-q`, `--quiet` | Eliminate interactive prompts and confirmations to enable automation of tasks.
| `-V`, `--version`	| Display version information.

### Actions

Use the following actions to specify the operation you want to perform.

| Use this action | To do this
| --------------- | -----------
| create [options] | Create an account on the Kadena public blockchain network (mainnet).
| add-manual [options] | Add an existing account locally to the CLI.
| add-from-wallet [options] | Add a local account from a key wallet.
| delete [options] | Delete a local account.
| details [options] | Get details for a specified account.
| fund [options] | Fund a specified new or existing account.
| list [options] | List all available accounts.
| name-to-address [options] | Resolve a .kda name to a k:account The k: prefix refers to Kadena account name associated with a public key.
| address-to-name [options]  Resolve a k:account to a .kda name.
| help [command] | Display help for a specified command.

### Arguments

Depending on the action you select, you can specify different arguments and options.
The following table summarizes all of the arguments you can specify.
To see usage information for a specific action, use the `--help` flag in the command-line or see the examples for performing specific tasks.

| Use this argument | To do this
| ----------------- | -----------
| `-l`, `--account-alias` <`accountAlias`> | Specify an alias to store your account information.
| `-a`, `--account-name` <`accountName`> | Specify the account name associated with one or more specified public keys.
| `-f`, `--fungible` <`fungible`> | Specify the name of a fungible asset type. The valid values are `coin` and `nft`. The default is `coin`.
| `-n`, `--network` <`network`> | Specify the Kadena network name—for example, `testnet` or `mainnet`—to use.
| `-c`, `--chain-id` <`chainId`> | Specify the chain identifier to use.
| `-k`, `--public-keys` <`publicKeys`> | Specify public keys for an account in a comma-separated list.
| `-p`, `--predicate` <`predicate`> | Specify the number of signatures required in a keyset for a transaction to be valid. You can specify `keys-all`, `keys-any`, `keys-2`, or a custom predicate.
| `-w`, `--wallet-name` <`walletName`> | Specify the wallet name you are adding an account from.
| `-o`, `--account-overwrite` | Overwrite account details from the chain.
| `-a`, `--account-kdn-name` <`accountName`> | Specify the Kadena domain address (.kda) that you want to translate to a Kadena account name.
| `-a`, `--account-kdn-address` <`accountKdnAddress`> | Specify the Kadena account name (k: prefix) that you want to translate to a Kadena domain address (`.kda`).
| `-c`, `--confirm` | Confirm that you want to delete a specified account.	
| `-h`, `--help` | Display help for a specified command.

### Examples

To create an account on the Kadena public blockchain network (mainnet) interactively, run the following command:

```bash
kadena account create
```

To add an account on the development network manually, you can run a command similar to the following:

```bash
kadena account add-manual --account-alias="pistolas" --account-name="k:bbccc99ec-accountname" --fungible="coin" --network="devnet" --chain-id="1" --public-keys="bbccc99ec-publickey" --predicate="keys-all"
```

To add an account on the test network from a wallet you've exported to a file, you can run a command similar to the following:

```bash
kadena account add-from-wallet --account-alias="myalias" --wallet="mywallet.wallet" --fungible="coin" --network="testnet" --chain-id="5" --public-keys="publickey" --predicate="keys-all"
```

To see details about an account by using the account alias, you can run a command similar to the following:

```bash
kadena account details --account="pistolas" --network="testnet" --chain-id="1" 
```

This command returns output similar to the following for the specified alias:

```bash
Details of account "pistolas" on network "testnet04" and chain "1" is:

Account Name                 Public Keys         Predicate Balance      
k:5ec41b89....bc76dc5c35e2c0 5ec41b89....c35e2c0 keys-all  69.9986947922

Executed:
kadena account details --account="pistolas" --network="mainnet" --chain-id="1"
```

To fund an account on the test network using the account alias, you can run a command similar to the following:

```bash
kadena account fund --account="pistolas" --amount="10" --network="testnet" --chain-id="2"
```

To display the Kadena account name (`k:` prefix) for a specified Kadena domain address (`.kda`) name, you can run a command similar to the following:

```bash
kadena account name-to-address --network="mainnet" --account-kdn-name="kadena.kda"
```

To display the Kadena domain address (`.kda`) for a specified Kadena account name (`k:` prefix) name, you can run a command similar to the following:

```bash
kadena account address-to-name --network="mainnet" --account-kdn-address="k:3b60fe83bc63cc9c797cf13d153b5f90dc538be97246a79561fe488490112886"
```

To list account information for a specified account alias, you can run a command similar to the following:

```bash
kadena account list --account-alias="pistolas"
```

This command returns output similar to the following for the specified alias:

```bash
Account Alias Account Name                     Public Key(s)            Predicate Fungible
pistolas      k:5ec41b89d323....bc76dc5c35e2c0 5ec41b89d3....dc5c35e2c0 keys-all  coin    
```

To list account information for all account aliases, you can specify --account-alias="all" in the command.

To delete a specific account:

kadena account delete --account-alias="nft-owner" --confirm

To delete all accounts:

kadena account delete --account-alias="all" --confirm

## kadena tx

Use `kadena tx` to create, submit, and manage transactions.

### Basic usage

The basic syntax for the `kadena tx` command is:

```bash
kadena tx <action> <arguments> [flag]
```

### Flags

You can use the following optional flags with the `kadena tx` command.

| Use this flag | To do this
| ------------- | -----------
| `-h`, `--help` |	Display usage information.
| `-l`, `--legacy` | Sign transaction using a legacy format.
| `-q`, `--quiet` | Eliminate interactive prompts and confirmations to enable automation of tasks.
| `-V`, `--version`	| Display version information.

### Actions

Use the following actions to specify the operation you want to perform.

| Use this action | To do this
| --------------- | -----------
| add [options] | Select a template and add a transaction.
| sign [options] | Sign a transaction using your local wallet/aliased file/keypair.
| send [options] | Send a transaction to the network.
| test [options] | Test a signed transaction on testnet.
| list [options] | List transactions.
| help [command] | Display usage information for a specified command.

### Arguments

Depending on the action you select, you can specify different arguments and options.
The following table summarizes all of the options you can specify.
To see the options to use for a specific action, use the `--help` flag on the command-line or review the examples.

| Use this argument | To do this
| ----------------- | -----------
| `-d`, `--directory` <`directory`> | Specify the directory that contains the transaction file. The default is your current working directory.
| `-s`, `--tx-signed-transaction-files` <`txSignedTransactionFiles`> | Specify the name of signed transaction files. You can specify multiple files in a comma-separated list.
| `-n`, `--tx-transaction-network` <`txTransactionNetwork`> | Specify the Kadena networks that you want to send the transaction to. You can specify networks in a comma-separated list in the order you want the transaction sent.  For example, to send a transaction to the development network then the test network, you can specify "devnet, testnet"
| `-p`, `--poll` | Poll for transaction status.
| `-s`, `--tx-sign-with` <`txSignWith`> | Select a signing method for a transaction. The valid signing methods are `keyPair`, `aliasFile`, and `localWallet`.
| `-w`, `--wallet-name` <`walletName`>  | Specify the wallet to use to sign a transaction.
| `--password-file` <`passwordFile`> | Specify the path to the password file.
| `-u`, `--tx-unsigned-transaction-files` <`txUnsignedTransactionFiles`> | Specify the name of unsigned transaction files that you want to sign using the specified signing method. You can specify multiple files in a comma-separated list.
| `-a`, `--key-alias-select` <`keyAliasSelect`> | Sign a transaction using the specified key alias.
| `-k`, `--key-pairs` <`keyPairs`> | Specify key pairs as strings on the command-line. You can specify multiple key pairs separated by semi-colons (;).
| `-n`, `--network` <`network`> | Specify the Kadena network name—for example, `testnet` or `mainnet`—to use.
| `-c`, `--chain-id` <`chainId`> | Specify the chain identifier to use.
| `-t`, `--template `<`template`> | Select a template for adding a transaction.
| `-d`, `--template-data` <`templateData`> | Specify a template data file for adding a transaction.
| `--template-variables` <`templateVariables`> | Specify template variables to use for adding a transaction.
| `-o`, `--out-file` <`outFile`> | Specify the file name to save the output from adding a transaction.
| `-l`, `--holes` | List all of the values a specified template requires.

### Examples

The `kadena tx add` command enables you to create transactions using **templates** in combination with values you specify to generate the most common types of transactions that are ready to sign and submit across multiple chains with minimal effort.
Currently, there are two default templates—`transfer` and `safe-transfer`—to enable to you create transactions that transfer tokens between accounts.
For more information about using templates to generate transactions, see [Code templates](/build/templates).
To generate a transaction from a template interactively, you can run the following command:

```bash
kadena tx add
```

This command then prompts you to select the template to use and information about the account to transfer from and the account to transfer to.

For example:

```bash
? Which template do you want to use: transfer.ktpl
? File path of data to use for template .json or .yaml (optional):
? Template value account-from:
k:bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e
? Template value account-to:
k:bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e
? Template value decimal-amount: 1.0
? Template value chain-id: 1
? Template value pk-from:
bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e
? Template value network-id: testnet
? Where do you want to save the output: my-test-output
```

After you respond to the prompts, the command displays the transaction you constructed and confirms the location of the file containing the unsigned transaction.

To sign an unsigned transaction using a public and secret key pair, you can run a command similar to the following:

```bash
kadena tx sign --tx-sign-with="keyPair" --key-pairs="publicKey=xxx,secretKey=xxx" --tx-unsigned-transaction-files="transaction-(request-key).json"
```

To sign two unsigned transactions using a key alias file from a wallet, you can run a command similar to the following:

```bash
kadena sign --tx-sign-with="aliasFile" --wallet-name="mywallet.wallet" --key-alias-select="mywalletalias.key" --tx-unsigned-transaction-files="transaction-(request-key).json,transaction-(request-key).json"
```

You can use the `kadena tx test` command to use a local API endpoint to check whether a signed transaction for a specified network is viable without submitting the transaction. 
By using the local endpoints, you can dry-run smart contract code using data in the `coin` contract tables without paying transaction fees.

To test whether a signed transaction would be successful on the test network using the local endpoint, you can run a command similar to the following:

```bash
kadena tx test --network="testnet" --directory="./my-tx" --tx-signed-transaction-files="transaction-(request-key)-signed.json" --chain-id="1"
```

To send a signed transaction to the Kadena main network and test network, you can run a command similar to the following:

```bash
kadena tx send --tx-signed-transaction-files="transaction-I4WaMUwQZDxhaf2r2FZj0TQf7Zv1J5v45Yc2MYxPURU-signed.json" --tx-transaction-network "mainnet, testnet" --poll
```

To get the status of a transaction on the Kadena blockchain, you can run a command similar to the following:

```bash
kadena tx status --request-key="118mEpX1-6NpJT1kArsWIHHVtJaOERQOeEwNoouOSGU" --network="testnet" --chain-id="0"
```

This command returns the current status of the transaction identified by the
provided request key.

To monitor the status of a transaction until it is finalized, you can add the `--poll` option.
For example:

```bash
kadena tx status --request-key="118mEpX1-6NpJT1kArsWIHHVtJaOERQOeEwNoouOSGU" --network="testnet" --chain-id="0" --poll
```

This command checks the transaction status and continues to run until
the transaction is confirmed.
The default timeout for polling is 60 seconds, but it will attempt to keep
polling until confirmation is achieved.