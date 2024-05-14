---
title: kadena account
description:
  The `@kadena/kadena-cli` library provides a complete set of commands for creating applications and interacting with the Kadena network interactively or by using scripts from the command-line.
menu: Command-line interface
label: kadena account
order: 2
layout: full
tags: ['TypeScript', 'Kadena client', 'frontend']
---

# kadena account

Use `kadena account` to add, manage, and fund onchain accounts with fungible tokens, for example, by transferring coin.

## Basic usage

The basic syntax for the `kadena account` command is:

```bash
kadena account <action> [flag]
```

## Actions

| Use this action | To do this                                 |
| --------------- | ------------------------------------------ |
| add             | Add an account from an existing key or from an existing wallet. |
| delete          | Delete one or more existing accounts. |
| details         | Get details for an account. |
| fund            | Fund an existing or new account. |
| list            | List available account information. |
| name-to-address | Resolve a .kda name to a k:address (kadena names) |
| address-to-name | Resolve a k:address to a .kda name (kadena names) |

## Flags

You can use the following optional flags with `kadena account` commands.

| Use this flag | To do this
| ------------- | -----------
| -h, --help |	Display usage information.
| -q, --quiet | Eliminate interactive prompts and confirmations to enable automation of tasks.
| -V, --version | Display version information.
| --json | Format command results sent to standard output (stdout) using JSON format.
| --yaml | Format command results sent to standard output (stdout) using YAML format.

## kadena account add

Use `kadena account add` to add a new local account manually from existing keys or from a wallet.
The parameters required depend on the type of account you specify using the `--type` command-line option. 
Use `--type manual` to add an account manually from existing local keys.
Use `--type wallet` to add an account to an existing wallet.

```bash
kadena account add --type manual | wallet [arguments] [flags]
```

### Arguments for manual

You can use the following command-line arguments with the `kadena account add --type manual` command:

| Use this argument | To do this                                 | 
| ----------------- | ------------------------------------------ | 
| -t, --type _manual_ | Specify the type of account to add. Use`manual` to add an account manually from existing keys. |
| -l, --account-alias _aliasName_ | Specify an alias for the account. | 
| -f, --fungible _fungible_ | Specify the fungible module name. The default is `coin`. |
| -p, --predicate _predicate_ | Specify the predicate to use for the account. You can specify on the the `keys-all`, `keys-any`, or `keys-2` built-in predicates or a custom predicate. |
| -k, --public-keys _publickey1_, _publickey2_, ...  | Specify a comma-separated list of public keys. |
| -v, --verify | Verify account details on the blockchain. |
| -n, --network _networkName_ | Specify the name of the network if you want to verify the account details on the blockchain. |
| -c, --chain-id _id_ | Specify the chain identifier if you want to verify the account details on the blockchain. |
| -a, --account-name _accountName_ | Provide an account name. |

If you want to verify the account details on the blockchain, you must provide the network name and chain identifier.

### Examples

To add account information interactively, run the following command:

```bash
kadena account add
```

To add an account locally from an account that exists on the Kadena test network and chain identifier 1, run a command similar to the following:

```bash
kadena account add --type=manual --account-alias=account-add-test-manual --account-name=k:account-name --fungible=coin --verify --network=testnet --chain-id=1
```

This command verifies the account details on the blockchain.

Example for adding an account with manual type and not verifying on chain:

```bash
kadena account add --type="manual" --account-alias="account-add-test-manual-no-verify" --account-name="k:account-name" --fungible="coin" --public-keys="your_key_1, your_key_2" --predicate="keys-all"
```

### Arguments for wallet

You can use the following command-line arguments with the `kadena account add --type wallet` command:

| Use this argument | To do this                                 |
| ----------------- | ------------------------------------------ |
| -t, --type _wallet_ | Specify the type of account to add. Use `wallet` to add a wallet account. | 
| -l, --account-alias _aliasName_ | Specify an alias for the account. |
| -a, --account-name _accountName_ | Provide an account name. |
| -f, --fungible _fungible_ | Specify the fungible module name. The default is `coin`.|
| -k, --public-keys _publickey1_, _publickey2_, ... | Specify a comma-separated list of public keys. |
| -p, --predicate _predicate_ | Specify the predicate to use for the account. You can specify on the the `keys-all`, `keys-any`, or `keys-2` built-in predicates or a custom predicate. |
| -w, --wallet-name _walletName_ | Provide the name of the wallet. |
| --password-file _passwordFile_ | Specify the path to a file containing the password for the wallet. Alternatively, passwords can be passed via stdin. This option is only required only if you choose auto generate keys from the wallet.

Example for adding an account with wallet type:

```bash
kadena account add --type="wallet" --wallet-name="wallet_name" --account-alias="account_alias" --fungible="coin" --public-keys="7c8939951b61614c30f837d7b02fe4982565962b5665d0e0f836b79720747cb2" --predicate="keys-all"
```

Example for adding an account with wallet type and auto generate keys:

```bash
kadena account add --type="wallet" --wallet-name="wallet-name" --account-alias="account_alias_testing" --fungible="coin" --public-keys="your_public_key,_generate_" --predicate="keys-all" --password-file="./kadenawallet-pw.txt"
```

## kadena account details

Use `kadena account details` to retrieve information about a specified account.
The account details include the account balance, the guard public keys and predicate, and the account name. 
To get this information, you must specify the Kadena network and chain identifier for the account. 

```bash
kadena account details [options]
```

### Arguments

You can use the following command-line arguments with the `kadena account details` command:

| Use this argument | To do this                                  | 
| ----------------- | ------------------------------------------- |
| -a, --account _accountAlias_ | Specify the account alias or account name you want to retrieve details about. This argument is required. |
| -n, --network _networkName_ | Specify the name of the network where the account exists. This argument is required. |
| -f, --fungible _fungible_ | Specify the type of fungible asset, for example, `coin` or `nft`. This argument is required. |
| -c, --chain-ids _id_ | Specify the chain identifier or a range of chain identifiers. For example, you can specify a single chain identifier (1), a continuous range of chain identifiers (0-3), individual chain identifiers (0,1,5) or all chains (all). This argument is required. |

### Examples

Single chain ID using an account alias:

```bash
kadena account details --account="k:PUBLIC_KEY" --network="testnet" --chain-ids="0"
```

Note: Fungible type is retrieved from the account alias file.

Single chain ID using account name:

```bash
kadena account details --account="k:PUBLIC_KEY" --network="mainnet" --chain-ids="1"
```

Note: Specify `--fungible` if using an account name. Defaults to "coin" if not
provided.

You can specify a range of chain IDs to query multiple chains at once. Use a
comma for discrete values or a hyphen for a continuous range.

Discrete Chain IDs:

```bash
kadena account details --account="myalias" --network="mainnet" --chain-ids="1,5"
```

Continuous Range of Chain IDs:

```bash
kadena account details --account="myalias" --network="mainnet" --chain-ids="1-5"
```

All Chains: Use "all" to query details across all chains.

```bash
kadena account details --account="k:PUBLIC_KEY" --network="mainnet" --chain-ids="all"
```

## kadena account fund

The kadena account fund command is used to add funds to an account on the
**testnet** or **development** networks. This command also creates the account
if it does not exist. Remember, this operation is not allowed on the mainnet.

If a faucet contract isn't available on the development network for the
specified chain ID, you can use the `--deploy-faucet` option. This will deploy
the faucet, allowing you to fund accounts on the development network.

```
kadena account fund [options]
```

### Arguments

| **Options**     | **Description** | **Required** |
| --------------- | --------------- | ------------ |
| --account       | Provide alias for an account. This argument is required. |
| --amount        | Amount to fund. This argument is required. |
| --network       | Name of the network to be used. This argument is required. |
| --chain-ids     | Provide the chain ID associated with the account<br/>Supports individual IDs, ranges (e.g., "1-5" or 2,5), <br/> or "all" for all chains. This argument is required. |
| --fungible      | Type of fungible asset (e.g., "coin") Defaults to "coin" if not provided. This argument is required.           |
| --deploy-faucet | Deploy a coin faucet contract to fund the account on devnet (development). |

### Examples

Fund an account on a specific chain:

```
kadena account fund --account="myalias" --amount="10" --network="testnet" --chain-ids="1"
```

Fund an account on a devnet with deploying faucet:

```
kadena account fund --account="myalias" --amount="20" --network="devnet" --chain-ids="17" --deploy-faucet
```

**Note**: To deploy a faucet on the development network, please make sure devnet
is running and accessible. To setup devnet, please refer [here][17]

You can specify a range of chain IDs to fund an account across multiple chains.
Use a comma for discrete values or a hyphen for a continuous range.

Discrete Chain IDs:

```
kadena account fund --account="myalias" --amount="10" --network="testnet" --chain-ids="1,3"
```

Continuous Range of Chain IDs:

```
kadena account fund --account="myalias" --amount="10" --network="testnet" --chain-ids="1-3"
```

All Chains: Use "all" to fund an account across all chains on the testnet.

```
kadena account fund --account="myalias" --amount="10" --network="testnet" --chain-ids="all"
```

## kadena account name-to-address [options]

| **Options**        | **Description**                           | **Required** |
| ------------------ | ----------------------------------------- | ------------ |
| --network          | Name of the network to be used            | Yes          |
| --account-kdn-name | Provide .kda name to resolve to k:account | Yes          |

#### Examples

```
kadena account name-to-address --network="mainnet" --account-kdn-name="kadena.kda"
```
#### kadena account address-to-name [options]

| **Options**           | **Description**                           | **Required** |
| --------------------- | ----------------------------------------- | ------------ |
| --network             | Name of the network to be used            | Yes          |
| --account-kdn-address | Provide k:account to resolve to .kda name | Yes          |

### Examples

```
kadena account address-to-name --network="mainnet" --account-kdn-address="k:account"
```

## kadena account list

| **Options**     | **Description**                  |
| --------------- | -------------------------------- |
| --account-alias | Provide the alias of the account |

Example for listing specific account:

```
kadena account list --account-alias="accountAlias"
```

Example for listing all accounts:

```
kadena account list --account-alias="all"
```

## kadena account delete

| **Options**     | **Description**                  |
| --------------- | -------------------------------- |
| --account-alias | Provide the alias of the account |
| --confirm       | Confirm deletion of account      |

Example for delete a specific account:

```
kadena account delete --account-alias="accountAlias" --confirm
```

Example for delete all accounts:

```
kadena account delete --account-alias="all" --confirm
```


