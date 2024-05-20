---
title: kadena config
description:
  The `@kadena/kadena-cli` package provides a complete set of commands for creating applications and interacting with the Kadena network interactively or by using scripts from the command-line.
menu: Command-line interface
label: kadena config
order: 2
layout: full
tags: ['TypeScript', 'Kadena client', 'frontend']
---

# kadena config

Use `kadena config` to set up and manage configuration settings for the Kadena CLI environment.
To get started with the CLI, use `kadena config init` to create a `.kadena` configuration folder.
The configuration folder stores information about your development environment, including:

- Default network settings for the Kadena development, test, and main networks.
- Transaction templates for constructing transactions locally and sending transactions to the blockchain.
- Local keys, wallets, and accounts that you create for the development environment.
- Keys, wallets, and accounts you import from existing chains.

## Basic usage

The basic syntax for the `kadena config` command is:

```bash
kadena config <action> [arguments] [flags]
```

## Actions

Use the following actions to specify the operation you want to perform.

| Use this action | To do this
| --------------- | ----------- |
| init | Initialize the `kadena` configuration folder with configuration settings for the Kadena CLI to use. |
| path | Display the path to the configuration folder currently in use. |

## Flags

You can use the following optional flags with `kadena config` commands.

| Use this flag | To do this
| ------------- | -----------
| -h, --help |	Display usage information.
| -q, --quiet | Eliminate interactive prompts and confirmations to enable automation of tasks.
| -V, --version	| Display version information.
| --json | Format command results sent to standard output (stdout) using JSON format.
| --yaml | Format command results sent to standard output (stdout) using YAML format.

## kadena config init

Use `kadena config init` to create a configuration folder in the directory of your choice.
The command automatically initializes the configuration folder with default network settings for the Kadena development, test, and main networks and adds transaction templates to your development environment.
You can also use this command to create your first wallet and account, so you can sign transactions locally for development and testing.

By default, the initial configuration settings are written to a `.kadena` folder in your current working directory and the settings can be used from anywhere within that directory. 
For example, if you run `kadena config init` in the `/home/user/projects/my-kadena-project` folder, the configuration settings are available from anywhere inside that project directory.
By using a working directory for the configuration folder, you can use different configuration settings in different folders.

Alternatively, you can run `kadena config init` with the `--global` command-line option to add the configuration folder as a global directory inside of your home directory. 
This option enables you to use the same configuration settings from any folder on your computer. 

Configuration settings that are defined in a local working directory take precedence over configuration settings defined in the home directory. 
If you add more than one configuration folder to your development environment, you can use the `kadena config path` commands to see which path is being used in a specific directory.

### Basic usage

The basic syntax for the `kadena config` command is:

```bash
kadena config init [arguments] [flags]
```

### Arguments

You can use the following command-line arguments with the `kadena config init` command:

| Use this argument | To do this |
| ----------------- | --------------- |
| -g, --global | Initialize the configuration folder in the current user's home directory, so that it's available globally. For example, this option creates the `~/.config/kadena` directory.|
| -c, --create&#8209;wallet | Create a new wallet. Set to `true` to generate keys and create a new wallet. |
| &#8209;w,&nbsp;&#8209;&#8209;wallet&#8209;name&nbsp;_walletName_ | Specify a name for the new wallet. |
| &#8209;&#8209;password&#8209;file&nbsp;_passwordFile_ | Specify the path to a file containing the password for the wallet being created. Alternatively, you can specify the password from standard input (stdin). |
| -L, --legacy | Use the ChainWeaver ED25519 signature scheme to generate keys when creating a wallet. |
| -a, --create&#8209;account | Create an account using the first wallet key. Set to `true` to use the first wallet key to create a new local account.|
| -l, --account&#8209;alias&nbsp;_aliasName_ | Create an account alias to store your account details, if creating an account. |

### Examples

To create the Kadena CLI configuration folder and initial settings interactively, run the following command:

```bash
kadena config init
```

This command creates the `.kadena `configuration folder in your current working directory and prompts you to create a new wallet.

To make the Kadena CLI configuration folder and initial settings available globally from your home directory, run the following command:

```bash
kadena config init --global
```

This command creates a global `kadena` folder in your home directory—for example, as `~/.config/kadena`—so you can use the configuration settings from any folder. 
The command then prompts you to create a new wallet.

To create the Kadena CLI configuration folder with a new wallet and account in the current working directory, run a command similar to the following:

```bash
kadena config init --create-wallet="true" --wallet-name="my_first_wallet" --create-account="true" --account-alias="dev_account"
```

To create the Kadena CLI configuration folder without creating a new wallet or account, run the following command:

```bash
kadena config init --create-wallet="false"
```

## kadena config path

Use `kadena config path` to display the location of the configuration folder currently being used.
If you add more than one configuration folder to your development environment, you can use the `kadena config path` command to see the location of the configuration folder that's used for your current directory.

To display the location of the configuration folder currently being used, run the following command:

```bash
kadena config path       
```

The command displays the path to the Kadena CLI configuration folder.
For example:

```bash
Currently using kadena config directory in:
/Users/pistolas/MY-KADENA/.kadena
```
