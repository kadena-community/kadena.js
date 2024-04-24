<!-- genericHeader start -->

# @kadena/kadena-cli

Kadena CLI tool to interact with the Kadena blockchain (manage keys,
transactions, etc.)

<picture>
  <source srcset="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-white.png" media="(prefers-color-scheme: dark)"/>
  <img src="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-black.png" width="200" alt="kadena.js logo" />
</picture>

<!-- genericHeader end -->

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

<hr>

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

|         | description                                       |
| ------- | ------------------------------------------------- |
| --quiet | Eliminating interactive prompts and confirmations |

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

| **Subcommand** | **Description**            | **Default value** |
| -------------- | -------------------------- | ----------------- |
| init           | initialize default project |                   |


### Initializing the CLI configuration

The `kadena config init` command is your starting point. It creates a .kadena folder pre configured with default network settings (devnet, mainnet, testnet). You have the flexibility to specify the location of your .kadena folder, making it easier to organize your configurations either in the current working directory or a global directory such as your home directory.

Additionally, this command assists in the creation of your initial wallet and account, setting the stage for your transactions on the Kadena network.

```
kadena config init [options]
```

| **Options**         | **Description**                                         | **Required** |
| ------------------- | ------------------------------------------------------- | ------------ |
| --location          | Path for the .kadena directory creation (e.g., home directory or current working directory).  |              |
| --create-wallet     | Confirm the creation of a new wallet. Set to true to enable.              |              |
| --wallet-name       | Name for the new wallet                                 |              |
| --password-file     | Path to a file containing the wallet's password, alternatively, passwords can be passed via stdin. |              |
| --create-account    | Enable the creation of an account using the first wallet key.                 |              |

---

Examples

Setup in a Specific Directory with a New Wallet and Account:
```
kadena config init --location="/my-app/.kadena" --create-wallet="true" --wallet-name="my_first_wallet" --create-account="true"
```

Setup Without Creating a Wallet or Account:
```
kadena config init --location="/my-app/.kadena" --create-wallet="false"
```

Note: All configurations will be stored within the specified .kadena/ folder, ensuring your settings are organized and easily accessible.

## kadena network

Tool to add and manage networks

| **Subcommand** | **Description**             | **Default value** |
| -------------- | --------------------------- | ----------------- |
| list           | List all available networks |                   |
| update         | Manage networks             |                   |
| add            | Add new network             |                   |
| set-default    | Set default network         |                   |
| delete         | Delete existing network     |                   |

---

```
kadena network update [options]
```

| **Options**             | **Description**                         | **Required** |
| ----------------------- | --------------------------------------- | ------------ |
| --network-name          | Update the name of the network          |              |
| --network-id            | Update the id of the network            |              |
| --network-host          | Update the host for the network         |              |
| --network-explorer-url  | Update the explorer url for the network |              |

example:

```
kadena network update --network-name="mainnet" --network-id="mainnet01" --network-host="https://api.chainweb.com" --network-explorer-url="https://explorer.chainweb.com/mainnet/tx/
```

---

```
kadena network add [options]
```

| **Options**             | **Description**                      | **Required** |
| ----------------------- | ------------------------------------ | ------------ |
| --network-name          | Set the name of the network          |              |
| --network-id            | Set the id of the network            |              |
| --network-host          | Set the host for the network         |              |
| --network-explorer-url  | Set the explorer url for the network |              |
| --network-overwrite     | Confirm overwrite configuration      |              |

example:

```
kadena network add --network-name="mainnet" --network-id="mainnet01" --network-host="https://api.chainweb.com" --network-explorer-url="https://explorer.chainweb.com/mainnet/tx/ --network-overwrite="yes"
```

---

```
kadena network set-default [options]
```

| **Options**             | **Description**                               | **Required** |
| ----------------------- | --------------------------------------------- | ------------ |
| --network               | Select name of network to set default         |              |
| --confirm               | Confirmation for default network to set/unset |              |

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

| **Options**             | **Description**                  | **Required** |
| ----------------------- | -------------------------------- | ------------ |
| --network               | Select name of network to delete |              |
| --network-delete        | Confirm deletion of network      |              |

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

| **Options**                | **Description**                                | **Required** |
| -------------------------- | ---------------------------------------------- | ------------ |
| --wallet-name              | Set the name of the wallet                     |              |
| --security-password        | Set the password for the wallet                |              |
| --security-verify-password | Set the password for the wallet (verification) |              |
| --legacy                   | Generate legacy wallet                         |              |

example:

```
kadena wallet add --wallet-name="kadenawallet" --security-password=1245678 --security-verify-password=1245678
```

password will be hidden after entry: --security-password=\*
\--security-verify-password=\*

---

```
kadena wallet import [options]
```

| **Options**                | **Description**                                | **Required** |
| -------------------------- | ---------------------------------------------- | ------------ |
| --key-mnemonic             | 12 word mnemonic phrase                        |              |
| --security-new-password    | Set the password for the wallet                |              |
| --security-verify-password | Set the password for the wallet (verification) |              |
| --wallet-name              | Set the name of the wallet                     |              |
| --legacy                   | Use Chainweaver's key derivation               |              |

example:

```
kadena wallet import-wallet --key-mnemonic="male more sugar violin accuse panel kick nose sign alarm stool inmate" --security-new-password=12345678 --security-verify-password=12345678 --key-wallet="mywalletname"
```

password will be hidden after entry: --security-new-password=\*
\--security-verify-password=\*

---

```
kadena wallet generate-key [options]
```

Generate a keypair from a wallet mnemonic

| **Options**             | **Description**                                                            | **Required** |
| ----------------------- | -------------------------------------------------------------------------- | ------------ |
| --wallet-name           | Provide the name of the wallet                                             |              |
| --amount                | The amount of keys to be generated, starting from last generated key index |              |
| --start-index           | Set start index for generating the next key                                |              |
| --password-file         | Password of the wallet, can be passed via stdin                            |              |
| --key-alias             | An optional alias given to the key(s) to recognize them later              |              |

example generating public keys using a range (you will be prompted for password)

```
kadena wallet generate-key --wallet-name="kadenawallet" --amount="1" --key-alias=""
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

| **Options**                 | **Description**                                    |
| --------------------------- | -------------------------------------------------- |
| --wallet-name               | Provide the name of the wallet                     |
| --security-current-password | Provide the current password of the wallet         |
| --security-new-password     | Set the new password for the wallet                |
| --security-verify-password  | Set the new password for the wallet (verification) |
| --confirm                   | Confirm password change                            |

example:

```
kadena wallet change-password --wallet-name="kadenawallet.wallet" --security-current-password=12345678 --security-new-password=12345678 --security-verify-password=1234567 --confirm=true
```

password will be hidden after entry: --security-current-password=\*
\--security-new-password=\* --security-verify-password=\*

---

```
kadena wallet delete [options]
```

| **Options**             | **Description**               |
| ----------------------- | ----------------------------- |
| --wallet-name           | Select the name of the wallet |
| --confirm               | Confirm deletion of wallet    |

example single wallet deletion:

```
kadena wallet delete --wallet-name="kadenawallet.wallet" --confirm=true
```

example deletion of all wallets:

```
kadena wallet delete --wallet-name="all" --confirm=true
```

---

```
kadena wallet list [options]
```

| **Options**             | **Description**            |
| ----------------------- | -------------------------- |
| --wallet-name           | Set the name of the wallet |

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

| **Options**             | **Description**                                          |
| ----------------------- | -------------------------------------------------------- |
| --wallet-name           | Name of the wallet you want to export a key from         |
| --key-index             | The index of the key to export                           |
| --password-file         | Filepath to the wallet password, can be passed via stdin |

example (password will be prompted):

```
kadena wallet export --wallet-name="kadenawallet" --key-index="0" > mykey.yaml
```

print as json (password will be prompted):

```
kadena wallet export --wallet-name="kadenawallet" --key-index="0" --json > mykey.json
```

---

## kadena keys

Tool to generate and manage keys

| **Subcommand** | **Description**                           | **Required** | **Default value** |
| -------------- | ----------------------------------------- | ------------ | ----------------- |
| generate       | Generate random public/secret key pair(s) | No           |                   |
| list           | List available key(s)                     | No           |                   |

---

```
kadena key generate [options]
```

Generate a plain keypair using a random mnemonic

| **Options**             | **Description**                             |
| ----------------------- | ------------------------------------------- |
| --key-alias             | Set alias of the key to store on filesystem |
| --key-amount            | Set the amount of keys to generate          |
| --legacy                | Generate legacy keys                        |

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

| **Options**             | **Description** |
| ----------------------- | --------------- |

example for listing all keys

```
kadena key list"
```

## kadena account

Tool to manage / fund accounts of fungibles (e.g. coin')

| **Subcommand**  | **Description**                                     | **Default value** |
| --------------- | --------------------------------------------------- | ----------------- |
| add-manual      | Add an existing account to the CLI                  |                   |
| add-from-wallet | Add an account from a key wallet                    |                   |
| create          | create an account in mainnet on chain(nr) for token |                   |
| details         | Get details of an account                           |                   |
| fund            | Fund an existing/new account                        |                   |
| name-to-address | Resolve a .kda name to a k:address (kadena names)   |                   |
| address-to-name | Resolve a k:address to a .kda name (kadena names)   |                   |
| list            | List available account(s)                           |                   |
| delete          | Delete existing account(s)                          |                   |

---

```
kadena account add-manual [options]
```

| **Options**             | **Description**                              | **Required** |
| ----------------------- | -------------------------------------------- | ------------ |
| --account-alias         | Set alias for account                        |              |
| --account-name          | Set account name                             |              |
| --fungible              | Fungible module name (default: coin)         |              |
| --network               | Name of the network to be used               |              |
| --chain-id              | Chain to be used                             |              |
| --public-keys           | Comma separated list of public keys          |              |
| --predicate             | keys-all, keys-any, keys-2, Custom predicate |              |

example:

```
kadena account add-manual --account-alias="myalias" --account-name="myaccountname" --fungible="coin" --network="mainnet" --chain-id="1" --public-keys="mypublickey" --predicate="keys-all"
```

---

```
kadena account add-from-wallet [options]
```

| **Options**             | **Description**                              | **Required** |
| ----------------------- | -------------------------------------------- | ------------ |
| --account-alias         | Set alias for account                        |              |
| --key-wallet            | Provide the name of the wallet               |              |
| --fungible              | Fungible module name (default: coin)         |              |
| --network               | Name of the network to be used               |              |
| --chain-id              | Chain to be used                             |              |
| --public-keys           | Comma separated list of public keys          |              |
| --predicate             | keys-all, keys-any, keys-2, Custom predicate |              |

example:

```
kadena account add-from-wallet --account-alias="myalias" --key-wallet="mywallet.wallet" --fungible="coin" --network="mainnet" --chain-id="1" --public-keys="publickey" --predicate="keys-all"
```

---

### Creating an account on mainnet

The kadena account create command allows you to create a new account on the
mainnet network. This command is restricted to mainnet use and it doesn't
support on other networks.

If you would like to create an account on [testnet][16], please use the
`kadena account fund` command.

```
kadena account create [options]
```

| **Options**             | **Description**                              | **Required** |
| ----------------------- | -------------------------------------------- | ------------ |
| --account-name          | Provide an account name                      | No           |
| --fungible              | Fungible e.g coin                            | No           |
| --chain-id              | Chain to be used                             |              |
| --public-keys           | Comma separated list of public keys          |              |
| --predicate             | keys-all, keys-any, keys-2, Custom predicate |              |

example:

Create an account without specifying a name:

```
kadena account create --account-name="" --public-keys="YOUR_PUBLIC_KEY" --predicate="keys-any" --chain-id="0"
```

Create an account with a name

```
kadena account create --account-name="mainnet_test_account" --public-keys="YOUR_PUBLIC_KEY" --predicate="keys-any" --chain-id="0" --fungible="coin
```

---

### Getting an account details / balance

The `kadena account details` command retrieves vital information about a
specified account on the Kadena blockchain, such as its balance, guard
conditions (public keys, predicate), and the account's name.

```
kadena account details [options]
```

| **Options**             | **Description**                                                                                                                           | **Required** |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| --account               | Provide account alias/name to retrieve its details                                                                                        |              |
| --network               | Name of the network to be used                                                                                                            |              |
| --fungible              | Type of fungible asset (e.g., "coin").                                                                                                    |              |
| --chain-id              | Provide the chain ID associated with the account<br/>Supports individual IDs, ranges (e.g., "1-5" or 2,5), <br/> or "all" for all chains. |              |

Example: **Single Chain ID:**

using account alias:

```
kadena account details --account="myalias" --network="mainnet" --chain-id="1"
```

Note: Fungible type is retrieved from the account alias file.

using account name:

```
kadena account details --account="k:PUBLIC_KEY" --network="mainnet" --chain-id="1"
```

Note: Specify `--fungible` if using an account name. Defaults to "coin" if not
provided.

**Chain ID Range:**

You can specify a range of chain IDs to query multiple chains at once. Use a
comma for discrete values or a hyphen for a continuous range.

Discrete Chain IDs:

```
kadena account details --account="myalias" --network="mainnet" --chain-id="1,5"
```

Continuous Range of Chain IDs:

```
kadena account details --account="myalias" --network="mainnet" --chain-id="1-5"
```

All Chains: Use "all" to query details across all chains.

```
kadena account details --account="k:PUBLIC_KEY" --network="mainnet" --chain-id="all"
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

| **Options**             | **Description**                                                                                                                           | **Required** |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| --account               | Provide alias for an account                                                                                                              |              |
| --amount                | Amount to fund                                                                                                                            |              |
| --network               | Name of the network to be used                                                                                                            |              |
| --chain-id              | Provide the chain ID associated with the account<br/>Supports individual IDs, ranges (e.g., "1-5" or 2,5), <br/> or "all" for all chains. |              |
| --fungible              | Type of fungible asset (e.g., "coin") Defaults to "coin" if not provided                                                                  |              |
| --deploy-faucet         | Deploy a coin faucet contract to fund the account on devnet (development)                                                                 |              |

Example: **Single Chain ID:**

Fund an account on a specific chain:

```
kadena account fund --account="myalias" --amount="10" --network="testnet" --chain-id="1"
```

Fund an account on a devnet with deploying faucet:

```
kadena account fund --account="myalias" --amount="20" --network="devnet" --chain-id="17" --deploy-faucet
```

**Note**: To deploy a faucet on the development network, please make sure devnet
is running and accessible. To setup devnet, please refer [here](https://docs.kadena.io/pact/beginner/web-editor#start-the-development-networkh2097912892)

**Chain ID Range:**

You can specify a range of chain IDs to fund an account across multiple chains.
Use a comma for discrete values or a hyphen for a continuous range.

Discrete Chain IDs:

```
kadena account fund --account="myalias" --amount="10" --network="testnet" --chain-id="1,3"
```

Continuous Range of Chain IDs:

```
kadena account fund --account="myalias" --amount="10" --network="testnet" --chain-id="1-3"
```

All Chains: Use "all" to fund an account across all chains on the testnet.

```
kadena account fund --account="myalias" --amount="10" --network="testnet" --chain-id="all"
```

---

```
kadena account account name-to-address [options]
```

| **Options**             | **Description**                           | **Required** |
| ----------------------- | ----------------------------------------- | ------------ |
| --network               | Name of the network to be used            |              |
| --account-kdn-name      | Provide .kda name to resolve to k:account |              |

example:

```
kadena account name-to-address --network="mainnet" --account-kdn-name="kadena.kda"
```

---

```
kadena account address-to-name [options]
```

| **Options**             | **Description**                           | **Required** |
| ----------------------- | ----------------------------------------- | ------------ |
| --network               | Name of the network to be used            |              |
| --account-kdn-address   | Provide k:account to resolve to .kda name |              |

example:

```
kadena account address-to-name --network="mainnet" --account-kdn-address="k:account"
```

---

```
kadena account list [options]
```

| **Options**             | **Description**                  |
| ----------------------- | -------------------------------- |
| --account-alias         | Provide the alias of the account |

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

| **Options**             | **Description**                  |
| ----------------------- | -------------------------------- |
| --account-alias         | Provide the alias of the account |
| --confirm               | Confirm deletion of account      |

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

| **Subcommand** | **Description**                         | **Default value** |
| -------------- | --------------------------------------- | ----------------- |
| add            | Select a template and add a transaction |                   |
| sign           | Sign a transaction using your wallet,   |                   |
|                | Sign a transaction using a key pair     |                   |
|                |                                         |                   |
| test           | Test a signed transaction               |                   |
| send           | Send a transaction to the network       |                   |
| status         | Get the status of a transaction         |                   |
| list           | List transaction(s)                     |                   |

---

```
kadena tx add [options]
```

`kadena tx add` is a powerful command that leverages transaction templates to
facilitate the quick and efficient creation of transactions across multiple
chains and access patterns. This feature is designed to work with user-supplied
values, filling out predefined templates to generate transactions ready for
signing and submission.

### Available Templates

Currently, two default templates are provided: `transfer` and `safe-transfer`.
(Default templates are stored at `.kadena/transaction-templates`) These
templates cover the most common transaction types, allowing for straightforward
transfers of tokens between accounts.

### Command Usage

```plaintext
kadena tx add [options] [options]
```

This command accepts various arguments and options, allowing for detailed
customization of the transaction being created. Below is a breakdown of the
options available:

| **Options**             | **Description**                                           | Required |
| ----------------------- | --------------------------------------------------------- | -------- |
| `--template`            | Path to the transaction template file.                    | Yes      |
| `--template-data`       | File path for the data used to fill the template.         | No       |
| `--network-id`          | Specifies the network ID (e.g., `testnet04`).             | Yes      |
| `--out-file`            | Path for saving the generated transaction file.           | No       |
| `--holes`               | Displays a list of required template variables.           | No       |
| Custom options          | Generated based on the chosen template's required fields. | Varies   |

### Example Command

```
kadena tx add --template="transfer.yaml" --template-data="data.yaml" --network-id="testnet04" --out-file="transaction.json"
```

In this example, `transfer.yaml` is the template used to construct the
transaction. `data.yaml` contains the user-supplied values for the template
variables. The `--network-id` specifies which network the transaction is
intended for, and `--out-file` determines where the generated transaction file
will be saved.

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

`account`: This prefix is used for variables that should be filled with an
account name, guiding users to input valid Kadena account identifiers. `key`:
Variables with this prefix expect a public key, ensuring that users provide
cryptographic keys in the correct format. `network`: This prefix is used for
specifying the network ID, helping users to select the appropriate network for
their transaction. `decimal`: For variables that involve numerical values with
decimal points, this prefix ensures the format and precision of the input.

This template exemplifies how prefixes guide users in providing the correct
types of input values, significantly reducing the potential for errors when the
CLI is operated in its interactive mode. In this mode, the prefixes play a
crucial role in prompting users for the specific type of information required,
ensuring the accuracy and validity of the transaction data. This interactive
guidance simplifies the transaction creation process, enhancing the security and
reliability of the transactions constructed.

In contrast, when operating in non-interactive mode, the system relies on
options passed directly via the command line. In this scenario, the values for
the transaction are provided as options, and the prefixes are ignored. This
means that the responsibility for ensuring the correctness and appropriateness
of the input values shifts entirely to the user. It's crucial for users to be
mindful of the data types and formats expected by the template to avoid errors.
This method allows for a more streamlined and automated approach to transaction
creation, suitable for users who prefer script-based automation or who are
running the CLI in environments where interactive prompts are not feasible.

### Template Variables

Variables are a critical part of transaction templates, defining the data
required to construct a transaction. Users can be prompted for variables missing
from the `--template-data` file or not provided as command-line options. The
`--holes` option is particularly useful for identifying all the variables a
template requires.

Variables support specific prefixes (`account:`, `key:`, `network:`, `decimal:`)
to facilitate the correct selection or validation of input values in interactive
mode.

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

---

```
kadena tx sign [options]
```

| **Options**                     | **Description**                                                         | **Required** |
| ------------------------------- | ----------------------------------------------------------------------- | ------------ |
| --tx-sign-with="aliasFile"      | Provide signing method                                                  | Yes          |
| --key-pairs                     | Provide publickey and secretKey (or list separated my semicolon)        |              |
| --tx-unsigned-transaction-files | Provided unsigned transaction file(s) to sign (or comma separated list) |              |

example:

```
kadena tx sign --tx-sign-with="keyPair" --key-pairs="publicKey=xxx,secretKey=xxx" --tx-unsigned-transaction-files="transaction-(request-key).json"
```

---

```
kadena kadena sign [options]
```

| **Options**                     | **Description**                                                         | **Required** |
| ------------------------------- | ----------------------------------------------------------------------- | ------------ |
| --tx-sign-with="aliasFile"      | Provide signing method                                                  | Yes          |
| --key-wallet                    | Provide the name of the wallet                                          |              |
| --security-password             | Provide the password for the wallet                                     |              |
| --key-alias-select              | Select a aliased file                                                   |              |
| --tx-unsigned-transaction-files | Provided unsigned transaction file(s) to sign (or comma separated list) |              |

example:

```
kadena sign --tx-sign-with="aliasFile" --key-wallet="mywallet.wallet" --security-password=1234567 --key-alias-select="mywalletalias.key" --tx-unsigned-transaction-files="transaction-(request-key).json,transaction-(request-key).json"
```

password will be hidden after entry: --security-password=\*

---

```
kadena tx sign [options]
```

| **Options**                     | **Description**                                                         | **Required** |
| ------------------------------- | ----------------------------------------------------------------------- | ------------ |
| --tx-sign-with="localWallet"    | Provide signing method                                                  | Yes          |
| --key-wallet                    | Provide the name of the wallet                                          |              |
| --security-password             | Provide the password for the wallet                                     |              |
| --key-alias-select              | Select a aliased file                                                   |              |
| --tx-unsigned-transaction-files | Provided unsigned transaction file(s) to sign (or comma separated list) |              |

example:

```
kadena tx sign --tx-sign-with="localWallet"  --key-wallet="mywallet.wallet" --security-password=12345678 --tx-unsigned-transaction-files="transaction-(request-key)-signed.json"
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

| **Options**                   | **Description**                                                       | **Required** |
| ----------------------------- | --------------------------------------------------------------------- | ------------ |
| --network                     | Name of the network to be used                                        |              |
| --directory                   | Provide the directory for the signed transaction                      |              |
| --tx-signed-transaction-files | Provided signed transaction file(s) to sign (or comma separated list) |              |
| --chain-id                    | Chain to be used                                                      |              |

example:

```
kadena tx test-signed-transaction --network="testnet" --directory="./" --tx-signed-transaction-files="transaction-(request-key)-signed.json" --chain-id="1"
```

---

```
kadena tx send [options]
```

| **Options**       | **Description**                                                       | **Required** |
| ----------------------------- | --------------------------------------------------------------------- | ------------ |
| --tx-signed-transaction-files | Provided signed transaction file(s) to sign (or comma separated list) |              |
| --tx-transaction-network      | Kadena networks comma separated list in order of transaction          |              |
|                               | (e.g. "mainnet, testnet, devnet, ...")                                |              |
| --poll                        | Poll status of sent transactions                                      |              |

example:

```
kadena tx send --tx-signed-transaction-files="transaction-I4WaMUwQZDxhaf2r2FZj0TQf7Zv1J5v45Yc2MYxPURU-signed.json" --tx-transaction-network "mainnet, testnet"
```

```
kadena tx send --tx-signed-transaction-files="transaction-I4WaMUwQZDxhaf2r2FZj0TQf7Zv1J5v45Yc2MYxPURU-signed.json" --tx-transaction-network "mainnet, testnet" --poll
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

| **Options**             | **Description**                                       | **Required** |
| ----------------------- | ----------------------------------------------------- | ------------ |
| --request-key           | Provide a transaction request key                     |              |
| --network               | Select name of the network where transaction happened |              |
|                         | (e.g. "mainnet, testnet, devnet, ...")                |              |
| --chain-id              | Chain to be used in the transaction                   |              |
| --poll                  | Poll status to get transaction details                |              |

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

| **Subcommand** | **Description**        | **Default value** |
| -------------- | ---------------------- | ----------------- |
| add            | add a new Dapp project |                   |

```
kadena dapp add <arguments> [options]
```

| **Arguments**           | **Description**                          | **Required** |
| ----------------------- | ---------------------------------------- | ------------ |
| project-directory       | Specify the project directory [Required] | yes          |

| **Options**             | **Description**                          | **Required** |
| ----------------------- | ---------------------------------------- | ------------ |
| --dapp-template         | Select template: vuejs, nextjs, angular  |              |

example:

```
kadena dapp add --dapp-template="vuejs" kadena-dapp
```

---

### Supported Templates

It supports a number of well known and widely used frameworks to choose from
when starting a new project. The following project templates are currently
available:

- [Nextjs][17]
- [Vuejs][18]
- [Angular][19]

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
[17]: https://nextjs.org/
[18]: https://vuejs.org/
[19]: https://angular.io/
