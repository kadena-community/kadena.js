---
title: kadena tx
description:
  The `@kadena/kadena-cli` package provides a complete set of commands for creating applications and interacting with the Kadena network interactively or by using scripts from the command-line.
menu: Command-line interface
label: kadena tx
order: 2
layout: full
tags: ['TypeScript', 'Kadena client', 'frontend']
---

# kadena tx

Use `kadena tx` and transaction templates to create, sign, test, send, and manage transactions.


## Basic usage

The basic syntax for the `kadena network` command is:

```bash
kadena tx <action> [arguments] [flags]
```

## Actions

Use the following actions to specify the operation you want to perform.

| Use this action | To do this                       |
| --------------- | -------------------------------- |
| add            | Select a template and add a transaction. |
| sign           | Sign a transaction using your wallet or using a key pair. |
| test           | Test a signed transaction without submitting it to the blockchain. |
| send           | Send a transaction to the network.|
| status         | Get the status of a transaction.|
| list           | List transactions.|

## Flags

You can use the following optional flags with `kadena tx` commands.

| Use this flag | To do this
| ------------- | -----------
| -h, --help |	Display usage information.
| -q, --quiet | Eliminate interactive prompts and confirmations to enable automation of tasks.
| -V, --version | Display version information.
| --json | Format command results sent to standard output (stdout) using JSON format.
| --yaml | Format command results sent to standard output (stdout) using YAML format.

## kadena tx add

`kadena tx add` is a powerful command that leverages transaction templates to
facilitate the quick and efficient creation of transactions across multiple
chains and access patterns. This feature is designed to work with user-supplied
values, filling out predefined templates to generate transactions ready for
signing and submission.

### Basic usage

```bash
kadena tx add [arguments] [flags]
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

### Examples

```bash
kadena tx add --template="transfer.yaml" --template-data="data.yaml" --network-id="testnet04" --out-file="transaction.json"
```

In this example, `transfer.yaml` is the template used to construct the
transaction. `data.yaml` contains the user-supplied values for the template
variables. The `--network-id` specifies which network the transaction is
intended for, and `--out-file` determines where the generated transaction file
will be saved.

### Default Templates in `kadena tx add`

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

```yaml
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

## kadena tx sign

| **Options**                     | **Description**                                                               | **Required** |
| ------------------------------- | ----------------------------------------------------------------------------- | ------------ |
| --tx-sign-with                  | Provide signing method "wallet" or "keyPair                                   | Yes          |
| --wallet-name                   | Provide the name of the wallet                                                |              |
| --password-file                 | Filepath to the password file                                                 | Yes          |
| --key-pairs <keyPairs>          | Key pairs as string publicKey=xxx,secretKey=xxx(;publicKey=xxx,secretKey=xxx) |              |
| --tx-unsigned-transaction-files | Provided unsigned transaction file(s) to sign (or comma separated list)       | Yes          |
| --legacy                        | Output legacy format                                                          |              |

#### Examples

```
kadena tx sign --tx-sign-with="wallett" --wallet-name="testwallet" --tx-unsigned-transaction-files="transaction-(request-key)-signed.json"
```

password will be hidden after entry: --security-password=\*


### kadena tx test-signed-transaction [options]

Testing a signed transaction for its viability against a specified network by
making a Local call. Using the local API endpoints, you can dry-run Pact smart
contracts using actual data in the coin contract tables. This is perfect for
checking the viability of your transactions / smart contracts, as well as to
check account data without necessarily having to spend tokens.

| **Options** | **Description**  | **Required** |
| ----------- | ---------------- | ------------ |
| --tx-transaction-network      | Name of the network to be used (overwrites network choice in transactions)       |              |
| --directory                   | Provide the directory for the signed transaction (defaults to working directory) |              |
| --tx-signed-transaction-files | Provided signed transaction file(s) to sign (or comma separated list)            | Yes          |

#### Examples

```
kadena tx test-signed-transaction --tx-signed-transaction-files="transaction-(request-key)-signed.json"
```

### kadena tx send [options]

| **Options**                   | **Description**                                                       | **Required** |
| ----------------------------- | --------------------------------------------------------------------- | ------------ |
| --directory <directory>       | Config file directory path (default: working directory)               |              |
| --tx-signed-transaction-files | Provided signed transaction file(s) to sign (or comma separated list) | Yes          |
| --tx-transaction-network      | Kadena network (overwrites network choice in transactions)            |              |
| --poll                        | Poll status of sent transactions                                      |              |

#### Examples

```
kadena tx send --tx-signed-transaction-files="transaction-I4WaMUwQZDxhaf2r2FZj0TQf7Zv1J5v45Yc2MYxPURU-signed.json"  --poll
```

### kadena tx status [options]

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


### kadena tx list

Example:

```
kadena tx list
```