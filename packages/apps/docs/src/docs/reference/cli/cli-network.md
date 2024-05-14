---
title: kadena network
description:
  The `@kadena/kadena-cli` library provides a complete set of commands for creating applications and interacting with the Kadena network interactively or by using scripts from the command-line.
menu: Command-line interface
label: kadena network
order: 2
layout: full
tags: ['TypeScript', 'Kadena client', 'frontend']
---

# kadena network

Use `kadena network` to set up and manage network settings for your development environment.
The `kadena config init` command creates default network settings for the Kadena development, test, and main networks.
You can use the `kadena network` subcommands to view and modify the network settings to suit your needs.

## Basic usage

The basic syntax for the `kadena network` command is:

```bash
kadena network <action> [arguments] [flags]
```

## Actions

Use the following actions to specify the operation you want to perform.

| Use this action | To do this                                        |
| --------------- | ------------------------------------------------- |
| add            | Add a new network.                                          |
| set-default    | Set a network to be the default choice in selection prompts.|
| list           | List all available networks.                                |
| update         | Update properties for an existing network.                  |
| delete         | Delete an existing network.                                 |

## Flags

You can use the following optional flags with `kadena network` commands.

| Use this flag | To do this
| ------------- | -----------
| -h, --help |	Display usage information.
| -q, --quiet | Eliminate interactive prompts and confirmations to enable automation of tasks.
| -V, --version	| Display version information.
| --json | Format command results sent to standard output (stdout) using JSON format.
| --yaml | Format command results sent to standard output (stdout) using YAML format.

## kadena network add

Use `kadena network add` to add a new set of network settings to your development environment.

### Arguments

You can use the following command-line arguments with the `kadena network add` command:

| Use this argument | To do this                    |
| ----------------- | ----------------------------- |
| -a, --network-name _networkName_ | Set the name of the network. The valid values are devnet, testnet, and mainnet. |
| -i, --network-id _networkId_ | Set the identifier for the network. The network identifier is a combination of network name and a chain identifier.For example, valid values include testnet04 and mainnet01. |
| -s, --network-host _networkHost_ | Set the host for the network. |
| -e, --network-explorer-url _networkExplorerUrl_ | Set the block explorer URL for the network. |
| -o, --network-overwrite  | Confirm that you want to overwrite existing network configuration settings. |

### Examples

To add network information interactively, run the following command:

```bash
kadena network add
```

To add network settings for the Kadena test network, run a command similar to the following:

```bash
kadena network add --network-name="testnet" --network-id="testnet08" --network-host="https://api.testnet.chainweb.com" --network-explorer-url="https://explorer.chainweb.com/testnet/tx/ --network-overwrite="yes"
```

## kadena network set-default

Use `kadena network set-default` to specify the network to use as your default network in your development environment.
You can specify the network as `none` to remove a previously-set default network.

### Arguments

You can use the following command-line arguments with the `kadena network set-default` command:

| Use this argument | To do this |
| ----------------- | --------------------------------------------- | 
| -n, --network _networkName_ | Specify the name of network you want to set as the default. The valid values are devnet, testnet, and mainnet. |
| --confirm  | Confirm the change you are making to set or remove the default network. |

### Examples

To add network information interactively, run the following command:

```bash
kadena network set-default
```

To set `testnet` as the default network for your development environment, run the following command:

```bash
kadena network set-default --network="testnet" --confirm
```

To remove the default network setting, run the following command:

```bash
kadena network set-default --network="none" --confirm
```

## kadena network update 

Use `kadena network update` to update properties for an existing network.   

### Arguments

You can use the following command-line arguments with the `kadena network update` command:

| Use this argument | To do this                       
| ----------------- | --------------------------------------- |
| -n, --network _networkName_ | Specify the network you want to update. The valid values are `devnet`, `testnet`, and `mainnet`. |
| -a, --network-name _networkName_ | Update the name of the specified network. |
| -i, --network-id _networkId_ | Update the identifier for the network. The network identifier is a combination of network name and a chain identifier. For example, valid values include `testnet04` and `mainnet01`. |
| -s, --network-host _networkHost_ | Update the host for the specified network. |
| -e, --network-explorer-url _networkExplorerUrl_ | Update the block explorer URL for the specified network |

### Examples

To update network information interactively, run the following command:

```bash
kadena network update
```

To update the network name and identifier for the development network, run a command similar to the following:

```bash
kadena network update --network="devnet" --network-id="devnet03" --network-name="my-devnet"
```

To update network settings for the Kadena main network, run a command similar to the following:

```bash
kadena network update --network="mainnet" --network-id="mainnet01" --network-host="https://api.chainweb.com" --network-explorer-url="https://explorer.chainweb.com/mainnet/tx/
```

## kadena network list

Use `kadena network list` to list all available networks.
To display information about all available networks, run the following command:

```bash
kadena network list
```

The command displays network information similar to the following:

```bash
Network Network ID  Network Host                     Network Explorer URL                           Default Network
devnet  development http://localhost:8080            http://localhost:8080/explorer/development/tx/ No             
mainnet mainnet01   https://api.chainweb.com         https://explorer.chainweb.com/mainnet/tx/      No             
testnet testnet04   https://api.testnet.chainweb.com https://explorer.chainweb.com/testnet/tx/      No  
```

## kadena network delete

Use `kadena network delete` to remove a network and its configuration settings from your development environment.

### Arguments

You can use the following command-line arguments with the `kadena network delete` command:

| Use this argument | To do this |
| ---------------- | -------------------------------- | 
| -n, --network _networkName_ | Specify the name of the network you want to delete. The valid values are `devnet`, `testnet`, and `mainnet`. |
| -d, --network-delete | Confirm that you want to delete the network. | 

### Examples

To delete network information interactively, run the following command:

```bash
kadena network delete
```

To delete the `mainnet` network information from your development environment, run the following command:

```bash
kadena network delete --network="mainnet" --network-delete="yes"
```
