---
title: Pact command-line interpreter
description:
  The Pact command-line interpreter enables you to test Pact code and modules in an interactive terminal shell.
menu: Pact REPL
label: Pact REPL
order: 6
layout: full
tags: ['pact', 'language reference', 'REPL commands']
---

# Pact command-line interpreter

Use the Pact command-line interpreter—also referred to as the Pact read–eval–print-loop (REPL) interactive shell program—to test Pact code and modules in an interactive terminal shell.

## Basic usage

```bash
pact [COMMAND] [option]
pact [option] FILE
```

Depending on the option you provide, `FILE` can specify the path to a `.pact` file to compile or a `.repl` file to execute.
You can specify command-line options before or after the file name.

## Options

You can use the following command-line options with the `pact` command-line interpreter:

| Option | Description
| ------ | -----------
| -h,--help | Displays usage information for `pact` or for a specific command.
| -v,--version | Displays version information.
| -b,--builtins | Displays the list of Pact built-in native functions.
| -g,--genkey  | Generates a public and secret key pair with the ED25519 signature scheme.
| -s,--serve <config> | Starts a REST API server with the configuration file you specify.
| -r,--findscript FILE | Attempts to execute a `.repl` file to for the `.pact` file you specify.
| -t,--trace FILE | Displays trace output for each line of code executed in the specified file.
| -c,--coverage FILE | Generates a coverage report in the `coverage/lcov.info` file for the file you specify.
| -a,--apireq REQ_YAML | Formats an API request as JSON using the REQ_YAML file you specify.
| -l,--local | Formats a request for the `/local` endpoint on a chainweb node.
| -u,--unsigned REQ_YAML | Formats sn unsigned API request as JSON using the REQ_YAML file you specify.

## Commands

You can use the following commands with the `pact` command-line interpreter:

| Option | Description
| ------ | -----------
| add-sig | Adds a signature to the signature data from standard input (stdin).
| combine-sigs | Combines multiple signature files.
| sign | Signs arbitrary base64url-encoded data from standard input (stdin).

## Examples

To display usage information for the `add-sig` command, you can run the following command:

```pact
pact add-sig --help
```

To generate a new public and secret key pair, you can run the following command:

```pact
pact --genkey
```

This command produces output similar to the following snippet:

```bash
public: e552972a1a4fc0249fe528dd61c38779266cbebdcb49fdb48511259c28c1013c
secret: 3d08b5eba8274ab0f3e137c59e06d20ee234e40d600ac8eae8f3e89c4e24478a
```

To trace the output for a set of transactions defined in the `election.repl` file, you would run the following command:

```pact
pact --trace election.repl
```

This command produces output similar to the following snippet:

```bash
election.repl:1:0:Trace: Setting transaction data
election.repl:11:0:Trace: Setting transaction signatures/caps
election.repl:17:0:Trace: Begin Tx 0: Define principal namespace
election.repl:18:2:Trace: Namespace defined: n_14912521e87a6d387157d526b281bde8422371d1
election.repl:19:0:Trace: Commit Tx 0: Define principal namespace
election.repl:21:0:Trace: Begin Tx 1: Define admin-keyset
election.repl:22:2:Trace: Namespace set to n_14912521e87a6d387157d526b281bde8422371d1
election.repl:23:2:Trace: Keyset defined
election.repl:24:0:Trace: Commit Tx 1: Define admin-keyset
election.repl:26:0:Trace: Begin Tx 2: Load election module
election.repl:27:2:Trace: Loading election.pact...
election.pact:1:0:Trace: Namespace set to n_14912521e87a6d387157d526b281bde8422371d1
election.pact:3:0:Trace: Loaded module n_14912521e87a6d387157d526b281bde8422371d1.election, hash t1hO-iYUQ3XWHOekZXRruuJYpSFN3ejj1TTMKfiEoko
election.pact:34:0:Trace: ["TableCreated"]
election.repl:28:0:Trace: Commit Tx 2: Load election module
Load successful
```

