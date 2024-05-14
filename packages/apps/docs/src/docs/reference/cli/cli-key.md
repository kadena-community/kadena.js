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


Use `kadena key` to generate and manage public and secret keys.

## Basic usage

The basic syntax for the `kadena key` command is:

```bash
kadena key <action> [arguments] [flags]
```

## Actions

Use the following actions to specify the operation you want to perform.

| Use this action | To do this                      |
| --------------- | ---------------------------------|
| generate | Generate random public and secret key pairs. |
| list | List available keys. |

### Flags

You can use the following optional flags with the `kadena key` command.

| Use this flag | To do this
| ------------- | -----------
| -h, --help |	Display usage information.
| -q, --quiet | Eliminate interactive prompts and confirmations to enable automation of tasks.
| -V, --version | Display version information.
| --json | Format command results sent to standard output (stdout) using JSON format.
| --yaml | Format command results sent to standard output (stdout) using YAML format.

## kadena key generate

Use `kadena key generate` to generate a random public and secret key.

### Arguments

You can use the following command-line arguments with the `kadena key generate` command:

| Use this argument | To do this                           |
| ----------------- | ------------------------------------------- |
| -a, --key-alias _keyAlias_ | Set an alias for the key to store on the local filesystem. |
| -n, --key-amount _keyAmount_ | Specify the number of key pairs to generate. The default is one key pair.|
| -l, --legacy | Generate keys using ChainWeaver key derivation methods (ED25519 signature scheme). |

### Examples

To generate one random public and secret key pair interactively, run the following command:

```bash
kadena key generate
```

This command prompts you to enter the alias you want to use for the key and the number of keys to generate.
For example:

```bash
? Enter an alias for your key: bob-dev
? Enter the amount of keys you want to generate (alias-{amount} will increment) (default: 1): 1
```

After you respond to the prompts, the command displays confirmation that the keys were generated and where the key is stored on the local filesystem.
For example:

```bash
Generated Plain Key Pair(s):
Public key
277ca529e0871cc277c84728ce3486947768cc8ff2c2894801f4d13a4b1fe4b7

The Key Pair is stored in your working directory with the filename(s):
bob-dev.yaml

Executed:
kadena key generate --key-alias="bob-dev" --key-amount="1"
```

To generate three random public and secret key pairs that are compatible with Chainweaver, run a command similar to the following:

```bash
kadena key generate --key-alias="chainweaver-keys" --key-amount="3" --legacy
```

The confirmation message displays the public keys and the files created on the local filesystem for the keys.
For example:

```bash
Generated Legacy Plain Key Pair(s):
Public key
0f4d6ddea36e22a9eb7e7f16bdff359d2027b3be08ccd206f27eba357ef6da9f
e5b451fbe95c9f9220be8f4d6909eb508c98da35a5ac7f99bd4630e3a30880d5
8d8748e61291f5cc9d86b4f30929383aeeb940cc692826a3349fb0367f795d44

The Key Pair is stored in your working directory with the filename(s):
chainweaver-keys-0.yaml
chainweaver-keys-1.yaml
chainweaver-keys-2.yaml
```

## kadena key list

Use `kadena key list` to list available keys.

### Arguments

You can use the following command-line arguments with the `kadena key list` command:

| Use this argument | To do this                           |
| ----------------- | ------------------------------------ |
| -d, --directory <directory> | Specify the path to the configuration folder on the local filesystem. The default is the current working directory. |

### Examples

To list all keys in the current working directory, run the following command:

```bash
kadena key list
```

The command displays output similar to the following:

```bash
Listing keys in the working directory:
Filename                Public Key                                                       Legacy
bob-dev.yaml            277ca529e0871cc277c84728ce3486947768cc8ff2c2894801f4d13a4b1fe4b7 No    
chainweaver-keys-0.yaml 0f4d6ddea36e22a9eb7e7f16bdff359d2027b3be08ccd206f27eba357ef6da9f Yes   
chainweaver-keys-1.yaml e5b451fbe95c9f9220be8f4d6909eb508c98da35a5ac7f99bd4630e3a30880d5 Yes   
chainweaver-keys-2.yaml 8d8748e61291f5cc9d86b4f30929383aeeb940cc692826a3349fb0367f795d44 Yes   
myalias-0.yaml          d5989694dc3002e2d91f9f2afb0042df267532a0afa615ed16430c056582d7df No    
myalias-1.yaml          62b03fce0d58d67949f6fd2ec64cfb676deee57a809f5e5bc5cece811a6edfbb No    
```

To list keys in a directory other than your current working directory and format the output as JSON, run a command similar to the following:

```bash
kadena key list --directory ~/My-Kadena --json
```

The command returns the output using JSON format.
For example:

```bash
[
  {
    "alias": "bob-dev.yaml",
    "filepath": "MY-KADENA/bob-dev.yaml",
    "legacy": false,
    "publicKey": "277ca529e0871cc277c84728ce3486947768cc8ff2c2894801f4d13a4b1fe4b7",
    "secretKey": "017a1af4a13cfbe28878f7b6097d30ba36d1c5609d41798a309a6beac6faef13"
  },
  {
    "alias": "chainweaver-keys-0.yaml",
    "filepath": "MY-KADENA/chainweaver-keys-0.yaml",
    "legacy": true,
    "publicKey": "0f4d6ddea36e22a9eb7e7f16bdff359d2027b3be08ccd206f27eba357ef6da9f",
    "secretKey": "L0R4RzFq...NzIycDg9"
  },
  {
    "alias": "chainweaver-keys-1.yaml",
    "filepath": "MY-KADENA/chainweaver-keys-1.yaml",
    "legacy": true,
    "publicKey": "e5b451fbe95c9f9220be8f4d6909eb508c98da35a5ac7f99bd4630e3a30880d5",
    "secretKey": "d0UzRjVZ...zQ2TUlnT"
  },
  {
    "alias": "chainweaver-keys-2.yaml",
    "filepath": "MY-KADENA/chainweaver-keys-2.yaml",
    "legacy": true,
    "publicKey": "8d8748e61291f5cc9d86b4f30929383aeeb940cc692826a3349fb0367f795d44",
    "secretKey": "eFVhNFA3...OTVYVVE9"
  },
  {
    "alias": "myalias-0.yaml",
    "filepath": "MY-KADENA/myalias-0.yaml",
    "legacy": false,
    "publicKey": "d5989694dc3002e2d91f9f2afb0042df267532a0afa615ed16430c056582d7df",
    "secretKey": "638bd7bfb09e3816c7167476f2ccc4143195a31b16576223601f4cd8b38e5b75"
  },
  {
    "alias": "myalias-1.yaml",
    "filepath": "MY-KADENA/myalias-1.yaml",
    "legacy": false,
    "publicKey": "62b03fce0d58d67949f6fd2ec64cfb676deee57a809f5e5bc5cece811a6edfbb",
    "secretKey": "eb880da39766f8d0c6c2965ac1c1fc39e2e283cdc953032eb0b3091514e29239"
  },
]
```
