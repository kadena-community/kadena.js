---
title: kadena account
description:
  The `@kadena/kadena-cli` package provides a complete set of commands for creating applications and interacting with the Kadena network interactively or by using scripts from the command-line.
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
kadena account <action> [arguments] [flags]
```

## Actions

Use the following actions to specify the operation you want to perform.

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
The parameters required depend on the type of account you specify using the `--from` command-line option. 
Use `--from key` to add an account manually from existing local keys.
Use `--from wallet` to add an account to an existing wallet.

### Basic usage

The basic syntax for the `kadena account add` command is:

```bash
kadena account add --from key | wallet [arguments] [flags]
```

### Arguments for using a local key

You can use the following command-line arguments with the `kadena account add --from key` command:

| Use this argument | To do this                                 | 
| ----------------- | ------------------------------------------ | 
| -f --from _key_ | Specify the type of account to add. Use `--from key` to add an account manually from existing keys. |
| -l, --account-alias _aliasName_ | Specify an alias for the account. | 
| -f, --fungible _fungible_ | Specify the fungible module name. The default is `coin`. |
| -p, --predicate _predicate_ | Specify the predicate to use for the account. You can specify on the the `keys-all`, `keys-any`, or `keys-2` built-in predicates or a custom predicate. |
| -k, --public-keys _publickey1_, _publickey2_, ...  | Specify a comma-separated list of public keys. |
| -v, --verify | Verify account details on the blockchain. |
| -n, --network _networkName_ | Specify the name of the network if you want to verify the account details on the blockchain. |
| -c, --chain-id _id_ | Specify the chain identifier if you want to verify the account details on the blockchain. |
| -a, --account-name _accountName_ | Provide an account name. |

If you want to verify the account details on the blockchain, you must provide the network name and chain identifier.

### Arguments for using a wallet

You can use the following command-line arguments with the `kadena account add --from wallet` command:

| Use this argument | To do this                                 |
| ----------------- | ------------------------------------------ |
| -f, --from _wallet_ | Specify the type of account to add. Use `--from wallet` to add a wallet account. | 
| -l, --account-alias _aliasName_ | Specify an alias for the account. |
| -a, --account-name _accountName_ | Provide an account name. |
| -f, --fungible _fungible_ | Specify the fungible module name. The default is `coin`.|
| -k, --public-keys _publickey1_, _publickey2_, ... | Specify a comma-separated list of public keys. |
| -p, --predicate _predicate_ | Specify the predicate to use for the account. You can specify on the the `keys-all`, `keys-any`, or `keys-2` built-in predicates or a custom predicate. |
| -w, --wallet-name _walletName_ | Provide the name of the wallet. |
| --password-file _passwordFile_ | Specify the path to a file containing the password for the wallet. Alternatively, passwords can be passed via stdin. This option is only required only if you choose auto generate keys from the wallet.

### Examples

To add account information interactively, run the following command:

```bash
kadena account add
```

This command prompts you to select the method for providing the public keys for the new account.
If you have a wallet, you can add a new account based on the public key and secret key pair generated for that wallet.
If you have other public keys that you want to use, you can add an account by entering the keys manually.

To add an account locally from an account that exists on the Kadena test network and chain identifier 1, run a command similar to the following:

```bash
kadena account add --from=key --account-alias=pistolas-testnet --account-name=k:bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e --fungible=coin --verify --network=testnet --chain-id=1
```

This command verifies the account details on the Kadena test network and displays a confirmation message similar to the following:

```bash
The account configuration "pistolas-testnet" has been saved in .kadena/accounts/pistolas-testnet.yaml
```

To add an account by providing public keys manually, you can run a command similar to the following:

```bash
kadena account add --from="key" --account-alias=pistolas-publickey --account-name=k:3e7e7db00e2e575a5260b8705ab7663574b186657451d6990316af6bc5108b59 --fungible="coin" --public-keys=3e7e7db00e2e575a5260b8705ab7663574b186657451d6990316af6bc5108b59,99d30af3fa91d78cc06cf53a0d4eb2d7fa2a5a72944cc5451311b455a67a3c1c --predicate=keys-any
```

This command prompts you to specify whether you want to verify the account information before adding the account.
For example:

```bash
? Do you want to verify the account on chain? (Use arrow keys)
❯ Yes, verify the account on chain before adding
  No, add the account without verifying on chain
```

To add an account from a wallet, you can run a command similar to the following:

```bash
kadena account add --from="wallet" --wallet-name="wallet_name" --account-alias="account_alias" --fungible="coin" --public-keys="7c8939951b61614c30f837d7b02fe4982565962b5665d0e0f836b79720747cb2" --predicate="keys-all"
```

To add an account from a wallet and automatically generate new keys, you can run a command similar to the following:

```bash
kadena account add --from="wallet" --wallet-name="wallet-name" --account-alias="account_alias_testing" --fungible="coin" --public-keys="your_public_key,_generate_" --predicate="keys-all" --password-file="./kadenawallet-pw.txt"
```

## kadena account details

Use `kadena account details` to retrieve information about a specified account.
The account details include the account balance, the guard public keys and predicate, and the account name. 
To get this information, you must specify the Kadena network and chain identifier for the account. 

## Basic usage

The basic syntax for the `kadena account details` command is:

```bash
kadena account details [arguments] [flags]
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

To get account details for a specific account alias on the Kadena test network and chain 0 formatted as JSON output, you can run a command similar to the following:

```bash
kadena account details --json --account=pistolas-testnet --network=testnet --chain-ids=0
```

This command returns output similar to the following:

```bash
Details of account "pistolas-testnet" on network "testnet04"
[
  {
    "0": {
      "guard": {
        "pred": "keys-all",
        "keys": [
          "bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e"
        ]
      },
      "balance": 2.99334437103,
      "account": "k:bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e"
    }
  }
]
```

To get account details for a specific account name on the Kadena test network and chain 1, you can run a command similar to the following:

```bash
kadena account details --account=k:bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e --network=testnet --chain-ids=1
```

This command prompts you to specify fungible type. 
For example:

```bash
? Enter the name of a fungible: coin
```

You can press Return to accept the default and display account details similar to the following:

```bash
Details of account "k:bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e" on network "testnet04"
Name                             ChainID Public Keys                                                      Predicate Balance        
k:bbccc99ec9ee....4e750ba424d35e 1       bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e keys-all  305.98040161094

Executed:
kadena account details --account="k:bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e" --network="testnet" --chain-ids="1" --fungible="coin" 
```

You can specify a range of chain identifiers to query multiple chains at once. 
Use a comma to specify discrete chains or a hyphen to specify a continuous range of chain identifiers.
For example, to get details for an account on the development network chains 1 and 5, you can run a command similar to the following:

```bash
kadena account details --account=pistolas-dev --network=devnet --chain-ids=1,5
```

This command displays account details similar to the following:

```bash
Name                             ChainID Public Keys                                                      Predicate Balance
k:5ec41b89d323....bc76dc5c35e2c0 1       5ec41b89d323398a609ffd54581f2bd6afc706858063e8f3e8bc76dc5c35e2c0 keys-all  24     
k:5ec41b89d323....bc76dc5c35e2c0 5       5ec41b89d323398a609ffd54581f2bd6afc706858063e8f3e8bc76dc5c35e2c0 keys-all  24     
```

To get account information for a continuous range of chain identifiers, you can run a command similar to the following:

```bash
kadena account details --account=pistolas-dev --network=devnet --chain-ids=2-4
```

This command displays account details similar to the following:

```bash
Details of account "pistolas-dev" on network "development"
Name                             ChainID Public Keys                                                      Predicate Balance
k:5ec41b89d323....bc76dc5c35e2c0 2       5ec41b89d323398a609ffd54581f2bd6afc706858063e8f3e8bc76dc5c35e2c0 keys-all  24     
k:5ec41b89d323....bc76dc5c35e2c0 3       5ec41b89d323398a609ffd54581f2bd6afc706858063e8f3e8bc76dc5c35e2c0 keys-all  24     
k:5ec41b89d323....bc76dc5c35e2c0 4       5ec41b89d323398a609ffd54581f2bd6afc706858063e8f3e8bc76dc5c35e2c0 keys-all  24 
```

To get account information for all chain identifiers, you can run a command similar to the following:

```bash
kadena account details --account=pistolas-dev --network=devnet --chain-ids=all
```

## kadena account fund

Use `kadena account fund` to add funds to an account on the **testnet** or **development** networks. 
This command also creates the account, if it doesn't exist. 
Note that you can't use this command to fund an account on the Kadena main network.

If a faucet contract isn't available on the development network for the specified chain identifier, you can use the `--deploy-faucet` option to fund accounts on the development network.

Although you can run this command multiple times, there's a limit to the number of coins you can request.
You can request up to 20 coins per network. 
If you select more than one chain in the request, the coins are distributed equally over the chain identifiers you specify. 
For example, if you request 20 coins for the development network and chains 0-3, each chain receives five coins. 

```bash
kadena account fund [arguments] [flags]
```

### Arguments

You can use the following command-line arguments with the `kadena account fund` command:

| Use this argument | To do this   |
| ----------------- | -------------|
| -a, --account _accountAlias_| Specify an alias to store your account information. This argument is required. |
| -m, --amount _amount_| Specify the number of coins to transfer to fund the account. This argument is required. |
| -n, --network _networkName_ | Specify the name of the network where you want to fund an account. The valid values are devnet and testnet. This argument is required. |
| -c, --chain-ids _chainIds_| Specify the chain identifiers where you want to fund the account. You can specify individual identifiers, ranges, or _all_ for all chains. This argument is required. |
| -d, --deploy-faucet | Deploy a coin faucet contract to fund the account on the local development network. |

### Examples

To fund an account on a single specific chain, you can run a command similar to the following:

```bash
kadena account fund --account="pistolas-testnet" --amount="10" --network="testnet" --chain-ids="3"
```

If the account doesn't exist on the specified chain, the command displays information similar to the following:

```bash
Success with Warnings:
Account "k:bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e" does not exist on Chain ID(s) 3. So the account will be created on these Chain ID(s).

Transaction explorer URL for 
Chain ID "3" : https://explorer.chainweb.com/testnet/tx/dk-speer0XDAFika0az2k8i4_AzlrtjMPGHZ6gIlF0A
✔ Funding account successful.

Account "k:bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e" funded with 10 coin(s) on Chain ID(s) "3" in testnet04 network.
Use "kadena account details" command to check the balance.
```

To fund an account on a local development network by deploying a faucet contract, you can run a command similar to the following:

```
kadena account fund --account="myalias" --amount="20" --network="devnet" --chain-ids="17" --deploy-faucet
```

This command requires you to have the development network running on your local host or accessible from your local computer.
For information about setting up a local development network, see [Set up a local development network](/build/pact/dev-network).

You can specify a range of chain identifiers to fund an account across multiple chains.
Use a comma to specify discrete chains or a hyphen to specify a continuous range of chain identifiers.
For example, to fund an account on the development network chains 1 and 3, you can run a command similar to the following:

```bash
kadena account fund --account="myalias" --amount="10" --network="devnet" --chain-ids="1,3"
```

To fund an account across a continuous range of chain identifiers, you can run a command similar to the following:

```bash
kadena account fund --amount="20" --account="chainweaver-0" --network="devnet" --chain-ids="3-6" 
```

This command displays the request keys for the transaction on each chain, then confirmation similar to the following:

```bash
Transaction explorer URL for 
Chain ID "3" : http://localhost:8080/explorer/development/tx/KCnnIKZG3hiurKUVJUMK17ED55G7pj6xy8Ng4Sfj154
Chain ID "4" : http://localhost:8080/explorer/development/tx/Zu3xmLGRQ6lY_N1jBUKpVRDZB3tRwy-PConW5Sb8YD0
Chain ID "5" : http://localhost:8080/explorer/development/tx/phM7ODgdNpdLyUD64xhaStWmA3ywk-1sjVFUM8tiDsQ
Chain ID "6" : http://localhost:8080/explorer/development/tx/GpibIRZ1DNBiSuxxWszUMsHmZQoiy6_uDsE3zVmq3To
✔ Funding account successful.

Account "k:5ec41b89d323398a609ffd54581f2bd6afc706858063e8f3e8bc76dc5c35e2c0" funded with 2 coin(s) on Chain ID(s) "3, 4, 5, 6" in development network.
Use "kadena account details" command to check the balance.
```

To fund an account across all chains on the testnet, you can run a command similar to the following

```bash
kadena account fund --amount=2 --account=pistolas-dev --network=devnet --chain-ids=all
```

If you try to fund an account too soon after a previous fund request, the command will fail with an error similar to the following:

```bash
Error on Chain ID 3 - Failed to transfer fund : "Coin can be requested every 30 minutes"
```

## kadena account name-to-address

Use `kadena account name-to-address` to resolve a `.kda` name to a `k:` account name 
By convention, accounts with the `k:` prefix are Kadena account principals with a single public key and the keys-all predicate.

```bash
kadena account name-to-address [arguments] [flags]
```

### Arguments

You can use the following command-line arguments with the `kadena account name-to-address` command:

| Use this argument | To do this |
| ----------------- | ---------- |
| -n, --network _networkName_ | Specify the name of the network where the account exists. |
| -a, --account-kdn-name _kdaAccountName_ | Specify the `.kda` name to resolve to a `k:` account. |

### Examples

To map the specified `.kda` name to an account that uses the `k:` prefix followed by a public key, you can run a command similar to the following:

```bash
kadena account name-to-address --network="mainnet" --account-kdn-name="kadena.kda"
```

## kadena account address-to-name

Use `kadena account address-to-name` to resolve an account name with the `k:` prefix to a `.kda` name.

```bash
kadena account address-to-name [arguments] [flags]
```

### Arguments

You can use the following command-line arguments with the `kadena account address-to-name` command:

| Use this argument | To do this |
| --------------------- | ----------------------------------------- | 
| -n, --network _networkName_ | Specify the name of the network where the account exists. | 
| -a, --account-kdn-address _accountName_ | Specify the `k:` account name to resolve to a `.kda` name | 

### Examples

To map the specified `k:` account name to a `.kda` address, you can run a command similar to the following:

```bash
kadena account address-to-name --network="mainnet" --account-kdn-address="k:1d5a5e10eb15355422ad66b6c12167bdbb23b1e1ef674ea032175d220b242ed4"
```

## kadena account list

Use `kadena account list` to list information for a specific account or for all available accounts.

```bash
kadena account list [arguments] [flags]
```

### Arguments

You can use the following command-line arguments with the `kadena account list` command:

| Use this argument | To do this |
| ----------------- | -------------------------------- |
| -a, --account-alias _accountAlias_ | Specify the alias for the account to list. |

### Examples

To list information for a specific account, you can run a command similar to the following:

```bash
kadena account list --account-alias=pistolas-dev
```

This command displays information similar to the following for the specified account:

```bash
Alias        Name                             Public Key(s)            Predicate Fungible
pistolas-dev k:5ec41b89d323....bc76dc5c35e2c0 5ec41b89d3....dc5c35e2c0 keys-all  coin    
```

To list information for all account, you can run a command similar to the following:

```bash
kadena account list --account-alias="all"
```

This command displays information similar to the following for all available account:

```bash
Alias              Name                             Public Key(s)            Predicate Fungible
chainweaver-0      chainweaver-0                    0f4d6ddea3....357ef6da9f keys-all  coin    
pistolas-dev       k:5ec41b89d323....bc76dc5c35e2c0 5ec41b89d3....dc5c35e2c0 keys-all  coin    
pistolas-kda       k:61cf22aa8f20....7743bf6c355546 61cf22aa8f....bf6c355546 keys-all  coin    
pistolas-local     k:ad833b6bbfc7....28f3249fd5e105 ad833b6bbf....249fd5e105 keys-all  coin    
pistolas-publickey k:3e7e7db00e2e....16af6bc5108b59 3e7e7db00e....6bc5108b59 keys-any  coin       
pistolas-testnet   k:bbccc99ec9ee....4e750ba424d35e bbccc99ec9....0ba424d35e keys-all  coin   
```

## kadena account delete

Use `kadena account delete` to delete a local account.

```bash
kadena account delete [arguments] [flags]
```

### Arguments

You can use the following command-line arguments with the `kadena account delete` command:

| Use this argument | To do this |
| ----------------- | ---------- |
| -a, --account-alias _accountAlias_ | Specify the alias of the account you want to delete. |
| -c, --confirm | Confirm that you want to delete the specified account. |

### Examples

To delete an account interactively, run the following command:

```bash
kadena account delete
```

This command prompts you to select the account alias that you want to delete, then confirm your selection.

To delete a specific account, you can run a command similar to the following:

```bash
kadena account delete --account-alias test-wallet --confirm
```

This command displays confirmation similar to the following:

```bash
The selected account alias "test-wallet" has been deleted
```

To delete all accounts, you can run the following command:

```bash
kadena account delete --account-alias="all" --confirm
```
