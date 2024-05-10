---
title: kadena key
description:
  The `@kadena/kadena-cli` library provides a complete set of commands for creating applications and interacting with the Kadena network interactively or by using scripts from the command-line.
menu: Command-line interface
label: kadena key
order: 2
layout: full
tags: ['TypeScript', 'Kadena client', 'frontend']
---

# kadena key

Tool to generate and manage keys

| **Subcommand** | **Description**                           |
| -------------- | ----------------------------------------- |
| generate       | Generate random public/secret key pair(s) |
| list           | List available key(s)                     |


## kadena key generate

Generate a plain keypair using a random mnemonic.

| **Options**  | **Description**                             |
| ------------ | ------------------------------------------- |
| --key-alias  | Set alias of the key to store on filesystem |
| --key-amount | Set the amount of keys to generate          |
| --legacy     | Generate legacy keys                        |

### Examples

```
kadena key generate --key-alias="myalias" --key-amount="5"
```

```
kadena key generate --key-alias="myalias" --key-amount="5" --legacy
```

## kadena key list

Example for listing all keys:

```
kadena key list
```
