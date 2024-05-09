<!-- genericHeader start -->

# @kadena/kadena-cli

Kadena CLI tool to interact with the Kadena blockchain (manage keys,
transactions, etc.)

<picture>
  <source srcset="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-white.png" media="(prefers-color-scheme: dark)"/>
  <img src="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-black.png" width="200" alt="kadena.js logo" />
</picture>

- [@kadena/kadena-cli][1]
- [KADENA CLI][2]
  - [installation from npm][3]
  - [list of commands][4]
    - [list of root commands and flags][5]
    - [Command specific help][6]
  - [Subjects][7]
  - [kadena config][8]
  - [kadena network][9]
  - [kadena wallet][10]
  - [kadena key][11]
  - [kadena account][12]
  - [kadena tx][13]
  - [kadena dapp][14]
  - [Supported Templates][15]

<!-- genericHeader end -->

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

### list of global commands and flags

|         | description                                                |
| ------- | ---------------------------------------------------------- |
| --quiet | Eliminating interactive prompts and confirmations          |
| --json  | Adds relevant result data in json format to stdout stream. |

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

## JSON output

Using `--json` or `--yaml` will output relevant command result data in json or
yaml format on stdout. This can be used to pipe into a file or other programs.
Do be aware that this does not remove the regular logging which happens on
stderr. It will not get in the way of piping since that only uses stdout by
default. You can disable the other logging by using the `KADENA_LOG=output`
environment variable. This does still print warnings or errors if they are
present.

Example usage

```
kadena wallet list --wallet-name="all" --json
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
kadena key generate
kadena tx sign
```

```
kadena [command] --legacy
```

---

# Interactive Mode

Interactive Mode is designed to make command execution more intuitive and
user-friendly. When you run a command in the Kadena CLI without specifying all
required options, the CLI automatically prompts you to provide the missing
inputs. This guided approach helps streamline your workflow and ensures that you
provide all necessary information to successfully execute a command.

## How It Works

To use Interactive Mode, simply type a command without its options:

```
kadena [command] [argument]
```

If the CLI is not running in Quiet Mode (`--quiet`), it will detect the missing
elements needed for the command to run and will prompt you interactively to
input them. This means you can start a command with minimal initial input and
fill in the details as prompted by the CLI.

## Benefits

- **Ease of Use**: Reduces the need to remember all command arguments and
  options upfront.
- **Guided Execution**: Ensures that all required inputs are collected before
  executing a command.
- **Flexibility**: Allows for a more conversational and less rigid interaction
  with the CLI.

## Example

If you want to add a new wallet but aren't sure of all the required flags and
arguments, simply start with:

```
kadena wallet add
```

The CLI will then guide you through the necessary steps, asking for each
required piece of information to complete the wallet addition.

Interactive Mode is especially useful for new users or those who prefer a more
guided approach when using command-line tools. It also serves as a learning tool
by demonstrating the required inputs for various commands, enhancing your
familiarity with the CLI's functionalities.

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

| **Subcommand** | **Description**                       |
| -------------- | ------------------------------------- |
| init           | initialize project configuration      |
| path           | Print current used configuration path |

### Initializing the CLI configuration

The `kadena config init` command is your starting point. It creates a .kadena
folder pre configured with default network settings (devnet, mainnet, testnet).
You have the flexibility to specify the location of your .kadena folder, making
it easier to organize your configurations either in the current working
directory or a global directory such as your home directory.

Additionally, this command assists in the creation of your initial wallet and
account, setting the stage for your transactions on the Kadena network.

```
kadena config init [options]
```

<<<<<<< HEAD | **Options** | **Description** | **Required** | | ----------------
|
--------------------------------------------------------------------------------------------------
| ------------ | | --location | Path for the .kadena directory creation (e.g.,
home directory or current working directory). | | | --create-wallet | Confirm
the creation of a new wallet. Set to true to enable. | | | --wallet-name | Name
for the new wallet | | | --password-file | Path to a file containing the
wallet's password, alternatively, passwords can be passed via stdin. | | |
--create-account | Enable the creation of an account using the first wallet key.
| | | --account-alias | Alias to store your account details | | ======= |
**Options** | **Description** | **Required** | | ---------------- |
-------------------------------------------------------------------------------------------------
| ------------ | | --global | Initialize the .kadena directory in the current
user's home directory. (~/.config/kadena) | | | --create-wallet | Confirm the
creation of a new wallet. Set to true to enable. | | | --wallet-name | Name for
the new wallet. | | | --password-file | Path to a file containing the wallet's
password, alternatively, password can be passed via stdin. | | | --legacy | Use
ChainWeaver based key derivation when creating a wallet. | | | --create-account
| Enable the creation of an account using the first wallet key. | | |
--account-alias | Alias to store your account details, if creating an account. |
|

> > > > > > > main

---

### Working directory and home directory

**Local:** by default the config is written to `.kadena` and this is accessible
from anywhere in this directory. For example running `kadena config init` in
`/home/user/projects/my-kadena-project` will allow you to access this
configuration from anywhere inside that project directory.

**Global:** if passing the `--global` (or `-g`) flag the configuration is stored
in your home directory in `.config/kadena`. This will allow you to use this
configuration from anywhere on your system. Do be aware local configurations
have priority. You can use `kadena config path` to validate which path is being
used when in a certain directory.

**Examples**

Setup in a the current working directory with a new Wallet and Account:

```
kadena config init --create-wallet="true" --wallet-name="my_first_wallet" --create-account="true" --account-alias="dev_account"
```

Setup in the home user directory (~/.config/kadena). This will allow you to use
the cli from anywhere and use this configuration.

```
kadena config init --global
```

Setup without creating a Wallet or Account:

```
kadena config init --create-wallet="false"
```

Note: All configurations will be stored within the specified .kadena/ folder,
ensuring your settings are organized and easily accessible.

## kadena network

Tool to add and manage networks

| **Subcommand** | **Description**                                             | **Default value** |
| -------------- | ----------------------------------------------------------- | ----------------- |
| list           | List all available networks                                 |                   |
| update         | Update properties of an existing network                    |                   |
| add            | Add new network                                             |                   |
| set-default    | Set a network to be the default choice in selection prompts |                   |
| delete         | Delete existing network                                     |                   |

---

```
kadena network update [options]
```

| **Options**            | **Description**                         | **Required** |
| ---------------------- | --------------------------------------- | ------------ |
| --network              | The network to update                   |              |
| --network-name         | Update the name of the network          |              |
| --network-id           | Update the id of the network            |              |
| --network-host         | Update the host for the network         |              |
| --network-explorer-url | Update the explorer url for the network |              |

example:

```
kadena network update --network="mainnet" --network-id="mainnet01" --network-host="https://api.chainweb.com" --network-explorer-url="https://explorer.chainweb.com/mainnet/tx/
```

---

```
kadena network add [options]
```

| **Options**            | **Description**                      | **Required** |
| ---------------------- | ------------------------------------ | ------------ |
| --network-name         | Set the name of the network          |              |
| --network-id           | Set the id of the network            |              |
| --network-host         | Set the host for the network         |              |
| --network-explorer-url | Set the explorer url for the network |              |
| --network-overwrite    | Confirm overwrite configuration      |              |

example:

```
kadena network add --network-name="mainnet" --network-id="mainnet01" --network-host="https://api.chainweb.com" --network-explorer-url="https://explorer.chainweb.com/mainnet/tx/ --network-overwrite="yes"
```

---

```
kadena network set-default [options]
```

| **Options** | **Description**                               | **Required** |
| ----------- | --------------------------------------------- | ------------ |
| --network   | Select name of network to set default         |              |
| --confirm   | Confirmation for default network to set/unset |              |

example for setting default network:

```
kadena network set-default --network="testnet" --confirm
```

example for removing default network:

```
kadena network set-default --network="none" --confirm
```

## Passing a network as "none" will remove the default network

```
kadena network delete [options]
```

| **Options**      | **Description**                  | **Required** |
| ---------------- | -------------------------------- | ------------ |
| --network        | Select name of network to delete |              |
| --network-delete | Confirm deletion of network      |              |

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
| generate-key    | Generate public/secret key pair(s) from your wallet |                   |
| change-password | Update the password for your wallet                 |                   |
| delete          | Delete existing wallet from local filesystem        |                   |
| list            | List wallet(s)                                      |                   |

---

```
kadena wallet add [options]
```

| **Options**      | **Description**                              | **Required** |
| ---------------- | -------------------------------------------- | ------------ |
| --wallet-name    | Set the name of the wallet                   |              |
| --password-file  | File path to the password file               |              |
| --legacy         | Generate legacy wallet                       |              |
| --create-account | Create an account using the first wallet key |              |
| --account-alias  | Alias to store your account details          |              |

example:

```
kadena wallet add --wallet-name="kadena_wallet" --password-file="./kadenawallet-pw.txt"
```

example using wallet with account creation:

```
kadena wallet add --wallet-name="kadena_wallet" --password-file="./kadenawallet-pw.txt" --create-account=true --account-alias="dev_account"
```

---

```
kadena wallet import [options]
```

| **Options**     | **Description**                                                                               | **Required** |
| --------------- | --------------------------------------------------------------------------------------------- | ------------ |
| --mnemonic-file | Filepath to your 12-word mnemonic phrase file to generate keys from (can be passed via stdin) | Yes          |
| --password-file | Filepath to the password file                                                                 | Yes          |
| --wallet-name   | Enter you wallet name                                                                         | Yes          |
| --legacy        | Use Chainweaver's key derivation                                                              |              |

example:

```
kadena wallet import --wallet-name="myWallet"
```

---

```
kadena wallet generate-key [options]
```

Generate a keypair from a wallet mnemonic

| **Options**     | **Description**                         | **Required** |
| --------------- | --------------------------------------- | ------------ |
| --wallet-name   | Provide the name of the wallet          | Yes          |
| --amount        | Amount of keys to generate (default: 1) |              |
| --start-index   | Index to start generating keys at       | Yes          |
| --password-file | Filepath to the password filein         | Yes          |
| --key-alias     | Optional alias for generated key(s)     | Yes          |

example generating public keys using a range (you will be prompted for password)

```
kadena wallet generate-key --wallet-name="" --amount="1" --key-alias=""
```

Example passing password via a file

```
kadena wallet generate-key --wallet-name="kadenawallet" --amount="1" --key-alias="" --password-file=./kadenawallet-pw.txt
```

Example passing password via a stdin

```
echo "supersecret" | kadena wallet generate-key --wallet-name="kadenawallet" --amount="1" --key-alias=""
```

example generating a key at a specific starting index index

```
kadena wallet generate-key --wallet-name="kadenawallet" --amount="1" --start-index="100" --key-alias=""
```

---

```
kadena wallet change-password [options]
```

| **Options**         | **Description**                   | **Required** |
| ------------------- | --------------------------------- | ------------ |
| --wallet-name       | Wallet name                       | Yes          |
| --password-file     | Filepath to the password file     | Yes          |
| --new-password-file | Filepath to the new password file | Yes          |
| --confirm           | Confirm changing wallet password  | Yes          |

example:

```
kadena wallet change-password --wallet-name="mywalletname" --confirm
```

---

```
kadena wallet delete [options]
```

| **Options**   | **Description**               |
| ------------- | ----------------------------- |
| --wallet-name | Select the name of the wallet |
| --confirm     | Confirm deletion of wallet    |

example single wallet deletion:

```
kadena wallet delete --wallet-name="mywalletname" --confirm
```

example deletion of all wallets:

```
kadena wallet delete --wallet-name="all" --confirm
```

---

```
kadena wallet list [options]
```

| **Options**   | **Description**            |
| ------------- | -------------------------- |
| --wallet-name | Set the name of the wallet |

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
kadena wallet export [options]
```

Export a KeyPair from a wallet unencrypted. Prints to stdout as yaml by default

| **Options**     | **Description**                                          |
| --------------- | -------------------------------------------------------- |
| --wallet-name   | Name of the wallet you want to export a key from         |
| --key-index     | The index of the key to export                           |
| --password-file | Filepath to the wallet password, can be passed via stdin |

example (password will be prompted):

```
kadena wallet export --wallet-name="kadenawallet" --key-index="0" > mykey.yaml
```

print as json (password will be prompted):

```
kadena wallet export --wallet-name="kadenawallet" --key-index="0" --json > mykey.json
```

---

## kadena key

Tool to generate and manage keys

| **Subcommand** | **Description**                           |
| -------------- | ----------------------------------------- |
| generate       | Generate random public/secret key pair(s) |
| list           | List available key(s)                     |

---

```
kadena key generate [options]
```

Generate a plain keypair using a random mnemonic

| **Options**  | **Description**                             |
| ------------ | ------------------------------------------- |
| --key-alias  | Set alias of the key to store on filesystem |
| --key-amount | Set the amount of keys to generate          |
| --legacy     | Generate legacy keys                        |

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

example for listing all keys:

```
kadena key list"
```

## kadena account

Tool to manage / fund accounts of fungibles (e.g. coin')

| **Subcommand**  | **Description**                                   |
| --------------- | ------------------------------------------------- |
| add             | Add an existing account locally to the CLI        |
| delete          | Delete existing account(s)                        |
| details         | Get details of an account                         |
| fund            | Fund an existing/new account                      |
| list            | List available account(s)                         |
| name-to-address | Resolve a .kda name to a k:address (kadena names) |
| address-to-name | Resolve a k:address to a .kda name (kadena names) |

---

### Account add command

Adds a new account with customizable parameters based on the specified
type(wallet or manual).

```
kadena account add [options]
```

Common Options

| **Options**     | **Description**                                      | **Required** |
| --------------- | ---------------------------------------------------- | ------------ |
| --type          | Method to add account details (`manual` or `wallet`) |              |
| --account-alias | Alias for the account                                |              |
| --account-name  | Provide account name                                 |              |
| --fungible      | Fungible module name (default: coin)                 |              |
| --public-keys   | Comma separated list of public keys                  |              |
| --predicate     | keys-all, keys-any, keys-2, Custom predicate         |              |

#### Options for Type "wallet"

These options are required when the account type is set to `wallet`:

| **Options**     | **Description**                                                                                    | **Required** |
| --------------- | -------------------------------------------------------------------------------------------------- | ------------ |
| --wallet-name   | Provide the name of the wallet                                                                     |              |
| --password-file | Path to a file containing the wallet's password, alternatively, passwords can be passed via stdin. |

`--password-file` option is required only when you choose auto generate keys
from wallet.

example for adding an account with wallet type:

```
kadena account add --type="wallet" --wallet-name="wallet_name" --account-alias="account_alias" --fungible="coin" --public-keys="7c8939951b61614c30f837d7b02fe4982565962b5665d0e0f836b79720747cb2" --predicate="keys-all"
```

example for adding an account with wallet type and auto generate keys:

```
kadena account add --type="wallet" --wallet-name="wallet-name" --account-alias="account_alias_testing" --fungible="coin" --public-keys="your_public_key,_generate_" --predicate="keys-all" --password-file="./kadenawallet-pw.txt"
```

#### Options for Type "manual"

| **Options** | **Description**                           | **Required** |
| ----------- | ----------------------------------------- | ------------ |
| --verify    | Verify account details on the blockchain. |              |
| --network   | Name of the network to be used            |              |
| --chain-id  | Chain to be used                          |              |

As part of manual option only if you want to verify the account details on the
blockchain, you need to provide the network and chain-id.

---

example for adding an account with manual type and verifying on chain(assume if
account already exists on chain):

```
kadena account add --type=manual --account-alias=account-add-test-manual --account-name=k:account-name --fungible=coin --verify --network=testnet --chain-id=1
```

example for adding an account with manual type and not verifying on chain:

```
kadena account add --type="manual" --account-alias="account-add-test-manual-no-verify" --account-name="k:account-name" --fungible="coin" --public-keys="your_key_1, your_key_2" --predicate="keys-all"
```

---

### Getting an account details / balance

The `kadena account details` command retrieves vital information about a
specified account on the Kadena blockchain, such as its balance, guard
conditions (public keys, predicate), and the account's name.

```
kadena account details [options]
```

| **Options** | **Description**                                    | **Required** |
| ----------- | -------------------------------------------------- | ------------ |
| --account   | Provide account alias/name to retrieve its details | Yes          |
| --network   | Name of the network to be used                     | Yes          |
| --fungible  | Type of fungible asset (e.g., "coin").             | Yes          |
| --chain-ids | Kadena chain id range (e.g: 1 / 0-3 / 0,1,5 / all) | Yes          |

Example: **Single Chain ID:**

using account alias:

```
kadena account details --account="k:PUBLIC_KEY" --network="testnet" --chain-ids="0"
```

Note: Fungible type is retrieved from the account alias file.

using account name:

```
kadena account details --account="k:PUBLIC_KEY" --network="mainnet" --chain-ids="1"
```

Note: Specify `--fungible` if using an account name. Defaults to "coin" if not
provided.

**Chain ID Range:**

You can specify a range of chain IDs to query multiple chains at once. Use a
comma for discrete values or a hyphen for a continuous range.

Discrete Chain IDs:

```
kadena account details --account="myalias" --network="mainnet" --chain-ids="1,5"
```

Continuous Range of Chain IDs:

```
kadena account details --account="myalias" --network="mainnet" --chain-ids="1-5"
```

All Chains: Use "all" to query details across all chains.

```
kadena account details --account="k:PUBLIC_KEY" --network="mainnet" --chain-ids="all"
```

---

### Funding an account on testnet/devnet

The kadena account fund command is used to add funds to an account on the
**testnet** or **development** networks. This command also creates the account
if it does not exist. Remember, this operation is not allowed on the mainnet.

If a faucet contract isn't available on the development network for the
specified chain ID, you can use the `--deploy-faucet` option. This will deploy
the faucet, allowing you to fund accounts on the development network.

```
kadena account fund [options]
```

| **Options**     | **Description**                                                                                                                           | **Required** |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| --account       | Provide alias for an account                                                                                                              | Yes          |
| --amount        | Amount to fund                                                                                                                            | Yes          |
| --network       | Name of the network to be used                                                                                                            | Yes          |
| --chain-ids     | Provide the chain ID associated with the account<br/>Supports individual IDs, ranges (e.g., "1-5" or 2,5), <br/> or "all" for all chains. | Yes          |
| --fungible      | Type of fungible asset (e.g., "coin") Defaults to "coin" if not provided                                                                  | Yes          |
| --deploy-faucet | Deploy a coin faucet contract to fund the account on devnet (development)                                                                 |              |

Example: **Single Chain ID:**

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

**Chain ID Range:**

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

---

```
kadena account account name-to-address [options]
```

| **Options**        | **Description**                           | **Required** |
| ------------------ | ----------------------------------------- | ------------ |
| --network          | Name of the network to be used            | Yes          |
| --account-kdn-name | Provide .kda name to resolve to k:account | Yes          |

example:

```
kadena account name-to-address --network="mainnet" --account-kdn-name="kadena.kda"
```

---

```
kadena account address-to-name [options]
```

| **Options**           | **Description**                           | **Required** |
| --------------------- | ----------------------------------------- | ------------ |
| --network             | Name of the network to be used            | Yes          |
| --account-kdn-address | Provide k:account to resolve to .kda name | Yes          |

example:

```
kadena account address-to-name --network="mainnet" --account-kdn-address="k:account"
```

---

```
kadena account list [options]
```

| **Options**     | **Description**                  |
| --------------- | -------------------------------- |
| --account-alias | Provide the alias of the account |

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
kadena account delete [options]
```

| **Options**     | **Description**                  |
| --------------- | -------------------------------- |
| --account-alias | Provide the alias of the account |
| --confirm       | Confirm deletion of account      |

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

| **Subcommand** | **Description**                         |
| -------------- | --------------------------------------- |
| add            | Select a template and add a transaction |
| sign           | Sign a transaction using your wallet,   |
|                | Sign a transaction using a key pair     |
|                |                                         |
| test           | Test a signed transaction               |
| send           | Send a transaction to the network       |
| status         | Get the status of a transaction         |
| list           | List transaction(s)                     |

---

```
kadena tx add [options]
```

`kadena tx add` is a powerful command that leverages transaction templates to
facilitate the quick and efficient creation of transactions across multiple
chains and access patterns. This feature is designed to work with user-supplied
values, filling out predefined templates to generate transactions ready for
signing and submission.

### Command Usage

```plaintext
kadena tx add [options] [options]
```

This command accepts various arguments and options, allowing for detailed
customization of the transaction being created. Below is a breakdown of the
options available:

| **Options**       | **Description**                                           | Required |
| ----------------- | --------------------------------------------------------- | -------- |
| `--template`      | Path to the transaction template file.                    | Yes      |
| `--template-data` | File path for the data used to fill the template.         | No       |
| `--network-id`    | Specifies the network ID (e.g., `testnet04`).             | Yes      |
| `--out-file`      | Path for saving the generated transaction file.           | No       |
| `--holes`         | Displays a list of required template variables.           | No       |
| Custom options    | Generated based on the chosen template's required fields. | Varies   |

### Example Command

```
kadena tx add --template="transfer.yaml" --template-data="data.yaml" --network-id="testnet04" --out-file="transaction.json"
```

In this example, `transfer.yaml` is the template used to construct the
transaction. `data.yaml` contains the user-supplied values for the template
variables. The `--network-id` specifies which network the transaction is
intended for, and `--out-file` determines where the generated transaction file
will be saved.

## Default Templates in `kadena tx add`

The `kadena tx add` command in the Kadena CLI includes a set of default
templates that are designed to facilitate the quick and efficient creation of
transactions. These templates are integral to the command's functionality and
enhance user experience by providing predefined frameworks for common
transaction types.

### Location of Default Templates

When you use the `kadena tx add` command for the first time, the CLI
automatically creates and stores default templates in the
`.kadena/transaction-templates` directory on your local machine. This directory
serves as the central repository for these templates, allowing easy access and
customization.

### Available Default Templates

Currently, the CLI comes with two primary default templates:

- **`transfer`**: Simplifies the process of transferring tokens between
  accounts.
- **`safe-transfer`**: Ensures a safer transfer with checks and validations to
  prevent common mistakes like sending to incorrect addresses.

These templates are designed to cover the most common types of transactions,
making it easier for users to execute these operations without the need to write
or customize code.

### Benefits of Using Default Templates

1. **Ease of Use**: The templates make it straightforward to create transactions
   without needing detailed blockchain scripting knowledge.
2. **Efficiency**: Speeds up the transaction creation process by providing
   ready-to-use frameworks that only require filling in specific details.
3. **Error Reduction**: The structured format of the templates, combined with
   interactive prompts, significantly reduces the potential for mistakes.

### Customizing and Extending Templates

While default templates offer convenience and speed, you might sometimes need to
customize or extend these templates to fit specific needs or to handle unique
transaction types. The CLI allows you to either modify existing templates or
create new ones from scratch and save them in the
`.kadena/transaction-templates` directory.

By understanding and utilizing these default templates, you can significantly
streamline your transaction creation processes with the Kadena CLI, making it a
powerful tool for managing blockchain transactions efficiently.

Below is a YAML template `transfer.yaml` that outlines the structure for a coin
transfer operation on Kadena. Notice the use of placeholders with prefixes to
define expected data types for each field:

```
code: |-
  (coin.transfer "{{{account:from}}}" "{{{account:to}}}" {{decimal:amount}})
data:
meta:
  chainId: '{{chain-id}}'
  sender: '{{{account:from}}}'
  gasLimit: 2300
  gasPrice: 0.000001
  ttl: 600
signers:
  - public: '{{key:from}}'
    caps:
      - name: 'coin.TRANSFER'
        args: ['{{{account:from}}}', '{{{account:to}}}', {{decimal:amount}}]
      - name: 'coin.GAS'
        args: []
networkId: '{{network:networkId}}'
type: exec
```

This template exemplifies how variables and prefixes guide users in providing
the correct types of input values, significantly reducing the potential for
errors when the CLI is operated in its interactive mode. In this mode, the
prefixes play a crucial role in prompting users for the specific type of
information required, ensuring the accuracy and validity of the transaction
data. This interactive guidance simplifies the transaction creation process,
enhancing the security and reliability of the transactions constructed.

### Using template variables and prefixes

Variables are a critical part of transaction templates, defining the data
required to construct a transaction. Users can be prompted for variables missing
from the `--template-data` file or not provided as command-line options. The
`--holes` option is particularly useful for identifying all the variables a
template requires.

Variables support specific prefixes (`account:`, `key:`, `network:`, `decimal:`)
to facilitate the correct selection or validation of input values in interactive
mode.

`account`: This prefix is used for variables that should be filled with an
account name, guiding users to input valid Kadena account identifiers.

`key`: Variables with this prefix expect a public key, ensuring that users
provide cryptographic keys in the correct format.

`network`: This prefix is used for specifying the network ID, helping users to
select the appropriate network for their transaction.

`decimal`: For variables that involve numerical values with decimal points, this
prefix ensures the format and precision of the input.

In contrast, when operating in non-interactive mode, the system relies on
options passed directly via the command line. In this scenario, the values for
the transaction are provided as options, and the prefixes are ignored. This
means that the responsibility for ensuring the correctness and appropriateness
of the input values shifts entirely to the user. It's crucial for users to be
mindful of the data types and formats expected by the template to avoid errors.
This method allows for a more streamlined and automated approach to transaction
creation, suitable for users who prefer script-based automation or who are
running the CLI in environments where interactive prompts are not feasible.

### Using data files as template data sources.

Below is a YAML example `data.yaml` for `transfer.yaml` that outlines the
structure for a template data file.

```yaml
account-from: ''
account-to: ''
decimal-amount: ''
chain-id: ''
pk-from: ''
network-id: ''
```

### Example Command

```
kadena tx add  --template-data="data.yaml"
```

---

```
kadena tx sign [options]
```

| **Options**                     | **Description**                                                               | **Required** |
| ------------------------------- | ----------------------------------------------------------------------------- | ------------ |
| --tx-sign-with                  | Provide signing method "wallet" or "keyPair                                   | Yes          |
| --wallet-name                   | Provide the name of the wallet                                                |              |
| --password-file                 | Filepath to the password file                                                 | Yes          |
| --key-pairs <keyPairs>          | Key pairs as string publicKey=xxx,secretKey=xxx(;publicKey=xxx,secretKey=xxx) |              |
| --tx-unsigned-transaction-files | Provided unsigned transaction file(s) to sign (or comma separated list)       | Yes          |
| --legacy                        | Output legacy format                                                          |              |

example:

```
kadena tx sign --tx-sign-with="wallett" --wallet-name="testwallet" --tx-unsigned-transaction-files="transaction-(request-key)-signed.json"
```

password will be hidden after entry: --security-password=\*

---

```
kadena tx test-signed-transaction [options]
```

Testing a signed transaction for its viability against a specified network by
making a Local call. Using the local API endpoints, you can dry-run Pact smart
contracts using actual data in the coin contract tables. This is perfect for
checking the viability of your transactions / smart contracts, as well as to
check account data without necessarily having to spend tokens.

| **Options**                   | **Description**                                                                  | **Required** |
| ----------------------------- | -------------------------------------------------------------------------------- | ------------ |
| --tx-transaction-network      | Name of the network to be used (overwrites network choice in transactions)       |              |
| --directory                   | Provide the directory for the signed transaction (defaults to working directory) |              |
| --tx-signed-transaction-files | Provided signed transaction file(s) to sign (or comma separated list)            | Yes          |

example:

```
kadena tx test-signed-transaction --tx-signed-transaction-files="transaction-(request-key)-signed.json"
```

---

```
kadena tx send [options]
```

| **Options**                   | **Description**                                                       | **Required** |
| ----------------------------- | --------------------------------------------------------------------- | ------------ |
| --directory <directory>       | Config file directory path (default: working directory)               |              |
| --tx-signed-transaction-files | Provided signed transaction file(s) to sign (or comma separated list) | Yes          |
| --tx-transaction-network      | Kadena network (overwrites network choice in transactions)            |              |
| --poll                        | Poll status of sent transactions                                      |              |

example:

```
kadena tx send --tx-signed-transaction-files="transaction-I4WaMUwQZDxhaf2r2FZj0TQf7Zv1J5v45Yc2MYxPURU-signed.json"  --poll
```

---

```
kadena tx status [options]
```

The kadena tx status command is used to retrieve the status of a transaction on
the Kadena blockchain. By providing a transaction request key and specifying the
network and chain id, users can query the current state of their transactions.
This command supports additional options for polling, allowing for real-time
status updates until the transaction is finalized.

| **Options**   | **Description**                                       | **Required** |
| ------------- | ----------------------------------------------------- | ------------ |
| --request-key | Provide a transaction request key                     | Yes          |
| --network     | Select name of the network where transaction happened | Yes          |
|               | (e.g. "mainnet, testnet, devnet, ...")                |              |
| --chain-id    | Chain to be used in the transaction                   | Yes          |
| --poll        | Poll status to get transaction details                | Yes          |

To check the status of a transaction, use the following command:

```
kadena tx status --request-key="118mEpX1-6NpJT1kArsWIHHVtJaOERQOeEwNoouOSGU" --network="testnet" --chain-id="0"
```

This will return the current status of the transaction identified by the
provided request key.

**With Polling:** To continuously monitor the status of a transaction until it
is finalized, add the `--poll` option:

```
kadena tx status --request-key="118mEpX1-6NpJT1kArsWIHHVtJaOERQOeEwNoouOSGU" --network="testnet" --chain-id="0" --poll
```

Polling checks the transaction status in real-time and will keep running until
the transaction is confirmed.

The default timeout for polling is 60 seconds, but it will attempt to keep
polling until confirmation is achieved.

---

```
kadena tx list
```

example:

```
kadena tx list
```

---

## kadena dapp

Tool for creating dapp projects

| **Subcommand** | **Description**        |
| -------------- | ---------------------- |
| add            | add a new Dapp project |

```
kadena dapp add <arguments> [options]
```

| **Arguments**     | **Description**                           | **Required** |
| ----------------- | ----------------------------------------- | ------------ |
| project-directory | Specify the project directory \[Required] | yes          |

| **Options**     | **Description**                         | **Required** |
| --------------- | --------------------------------------- | ------------ |
| --dapp-template | Select template: vuejs, nextjs, angular | Yes          |

example:

```
kadena dapp add --dapp-template="vuejs" kadena-dapp
```

---

### Supported Templates

It supports a number of well known and widely used frameworks to choose from
when starting a new project. The following project templates are currently
available:

- [Nextjs][18]
- [Vuejs][19]
- [Angular][20]

```

```

[1]: #kadena/kadena-cli
[2]: #kadena-cli
[3]: #installation-from-npm
[4]: #list-of-commands
[5]: #list-of-root-commands-and-flags
[6]: #command-specific-help
[7]: #subjects
[8]: #kadena-config
[9]: #kadena-network
[10]: #kadena-wallet
[11]: #kadena-key
[12]: #kadena-account
[13]: #kadena-tx
[14]: #kadena-dapp
[15]: #supported-templates
[16]: #funding-an-account-on-testnet
[17]:
  https://docs.kadena.io/pact/beginner/web-editor#start-the-development-networkh2097912892
[18]: https://nextjs.org/
[19]: https://vuejs.org/
[20]: https://angular.io/
