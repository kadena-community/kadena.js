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
The Pact command-line program also includes a built-in HTTP server and provides commands and options for working with transactions.

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
| -h, --help | Displays usage information for `pact` or for a specific command.
| -v, --version | Displays version information.
| -b, --builtins | Displays the list of Pact built-in native functions.
| -g, --genkey  | Generates a random public and secret key pair with the ED25519 signature scheme.
| -s, --serve _config-file_ | Starts a built-in HTTP server with the configuration file you specify. After you start the server, you can submit API requests to Pact API endpoints to simulate submitting API requests to a Chainweb node and to create transactions for testing purposes.
| -r, --findscript _file-name_ | Attempts to execute a `.repl` file to for the `.pact` file you specify.
| -t, --trace _file-name_ | Displays trace output for each line of code executed in the specified file.
| -c, --coverage _file-name_ | Generates a coverage report in the `coverage/lcov.info` file for the file you specify.
| -a, --apireq _api-request-yaml_ | Formats an API request as JSON using the _api-request-yaml_ file you specify.
| -l, --local | Formats a request for the `/local` endpoint on the built-in HTTP server or a Chainweb node.
| -u, --unsigned _api-request-yaml_ | Formats an unsigned API request as JSON using the _api-request-yamlL_ file you specify.

## Commands

You can use the following commands with the `pact` command-line interpreter:

| Option | Description
| ------ | -----------
| add-sig | Adds a signature to the signature data from standard input (stdin).
| combine-sigs | Combines multiple signature files.
| sign | Signs arbitrary base64url-encoded data from standard input (stdin).

## Basic examples

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

## Work with transactions using Pact commands

You can use the Pact command-line interpreter, built-in HTTP server, and SQLite backend to sign and submit transactions and to format transactions requests so that they can be executed using `curl` commands or Postman API calls.
The following examples illustrate how you can use the Pact built-in HTTP server, command-line options, and API calls to work with transactions in a local development environment.

### Start the built-in server

To start the built-in HTTP server:

1. Open a terminal shell on your local computer.

2. Create a configuration file using YAML format with the following properties:
   
   ```bash
   port       - HTTP server port number.
   persistDir - Directory for persisting database files. If you omit this setting, the server runs in-memory only.
   logDir     - Directory for HTTP logs.
   pragmas    - SQLite pragma statement to use with persistent database files.
   entity     - Entity name for simulating privacy. The default is "entity".
   gasLimit   - Gas limit for each transaction. The default is zero (0).
   gasRate    - Gas price per action. The default is zero (0).
   flags      - Pact runtime execution flags.
   ```

   For example, create a `pact-config.yaml` file with properties similar to the following:

   ```yaml
   # Config file for pact http server. Launch with `pact -s config.yaml`

   # HTTP server port
   port: 8081
   
   # directory for HTTP logs
   logDir: log
   
   # persistence directory
   persistDir: log
   
   # SQLite pragmas for pact back-end
   pragmas: []
   
   # verbose: provide log output
   verbose: True
   ```

3. Start the built-in server by running a command similar to the following:
   
   ```bash
   pact --serve pact-config.yaml
   ```

### Create and submit an API request

To create an API request and submit a transaction:

1. Open a second terminal window or tab and create an API request for a simple transaction in a YAML file.

   For example, use a text editor to create a YAML file called `my-api-request.yaml` with the following content:
   
   ```yaml
   code: "(+ 1 2)"
   data:
     name: Stuart
     language: Pact
   keyPairs:
     - public: ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d
       secret: 8693e641ae2bbe9ea802c736f42027b03f86afe63cae315e7169c9c496c17332
   ```

   In this example, the transaction API request executes an addition function (+ 1 2) and identifier the request sender using the public and secret key pair.
   The request is defined using YAML format because the format is more readable and less error-prone than the required JSON format.
   However, before you can submit the request, it must be converted to the JSON format that the endpoint receiving the request expects.

2. Format the YAML version of the API request using the Pact `--apireq` command-line option to generate a valid JSON API request.
   
   For example, run the following command to display the output before submitting the request to the built-in server:

   ```bash
   pact --apireq  my-api-request.yaml
   ```

   This command displays the formatted API request as standard output:
   
   ```bash
   {"cmds":[{"hash":"T3vt3Cuh2sdDcTS8Exck96Yht55OD0B9qp_2O8hn1Z0","sigs":[{"sig":"6f8a7fd50d2807127feefe7c9df382c6538b20aa8d62c9c10051f80201af7352f172a18be5f6a43ec2ece7fc74f951e1dd36ef18975fcb76d72bcb453396dc02"}],"cmd":"{\"networkId\":null,\"payload\":{\"exec\":{\"data\":{\"name\":\"Stuart\",\"language\":\"Pact\"},\"code\":\"(+ 1 2)\"}},\"signers\":[{\"pubKey\":\"ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d\"}],\"meta\":{\"creationTime\":0,\"ttl\":0,\"gasLimit\":0,\"chainId\":\"\",\"gasPrice\":0,\"sender\":\"\"},\"nonce\":\"2024-09-06 20:04:12.679143 UTC\"}"}]}
   ```

3. Format the transaction using the `--local` command-line option to display the API request that can be submitted to the `/local` endpoint of the built-in HTTP server by running the following command:
   
   ```bash
   pact --apireq  my-api-request.yaml --local
   ```
   
   The command displays the transaction to be submitted as standard output:

   ```bash
   {"hash":"RRkPaHkAlAYMOgCxVtIiR20B8aEl4U4FGLNuFMbmSXg","sigs":[{"sig":"47e66eeec37991ad49b162401ab777a8dc9e872090f0a1552ee080931450891d321ab6fd3907d0aa1395d3816a74a8c08dd1be5d2871dc2398dd5d2851cbc60d"}],"cmd":"{\"networkId\":null,\"payload\":{\"exec\":{\"data\":{\"name\":\"Stuart\",\"language\":\"Pact\"},\"code\":\"(+ 1 2)\"}},\"signers\":[{\"pubKey\":\"ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d\"}],\"meta\":{\"creationTime\":0,\"ttl\":0,\"gasLimit\":0,\"chainId\":\"\",\"gasPrice\":0,\"sender\":\"\"},\"nonce\":\"2024-09-06 20:24:45.82271 UTC\"}"}
   ```

   Notice that, in the formatted API request output, there are several fields not defined in the original `my-api-request.yaml` file. 
   In this example, the request is for a simple transaction that executes in a single step.
   Therefore, the transaction uses the API request template for `exec` transactions. 
   The key fields not defined in the original `my-api-request.yaml` file are populated as part of the formatting of the request.
   More complex transactions that require execution of more than one step use the API request template for `cont` transactions. 
   For information about the required and optional fields for in the `exec` and `cont` API request templates, see []().

4. Send the API request to the Pact built-in HTTP server running on port 8081—as configured in the `pact-config.yaml` file for this example—by running the following command:
   
   ```bash
   pact --apireq my-api-request.yaml --local | curl --json @- http://localhost:8081/api/v1/local
   ```
   
   This command returns the transaction result with output similar to the following:

   ```bash
   {"gas":0,"result":{"status":"success","data":3},"reqKey":"q4HW4wP1FCj3RQRvhILQHaqU8tmMqHPp-nDJdw6CwK8","logs":"wsATyGqckuIvlm89hhd2j4t6RMkCrcwJe_oeCYr7Th8","metaData":null,"continuation":null,"txId":null}
   ```

### Pact HTTP server API endpoints

In the previous example, you saw how to submit an API request to the `/local` endpoint exposed by the built-in HTTP server.
The Pact built-in HTTP server supports the following API endpoints:

| Endpoint | Description |
| -------- | ----------- |
| `/listen` | Listen for the result of a single transaction. The request body must contain the request key for the transaction. Requests sent to the `/listen` endpoint block operations waiting for the transaction result. |
| `/local` | Submit a command to simulate the execution of a transaction. Requests sent to the `/local` endpoint don't change the blockchain state. Any database writes or changes to the environment are rolled back. The request body must contain a properly-formatted Pact command. In response to the request, the endpoint returns command result and hash. |
| `/poll` | Poll for the results of one or more transactions. The request body must contain one or more request keys. Requests sent to the `/poll` endpoint don't block operations waiting for the transaction result. In response to the request, the endpoint returns the poll result for each request key. |
| `/send` | Send one or more commands to the local HTTP server to be executed. The request body must contain properly-formatted Pact commands. In response to the request, the endpoint returns the request key for each transaction sent. |
| `/verify` | Verify a transaction request is properly formatted. The request body contains the transaction to analyze. In response to the request, the endpoint returns the result from analyzing the transaction. |

To send a sample transaction to the Pact built-in HTTP server, you can run a command similar to the following:

```bash
pact --apireq test-yaml.yaml | curl --json @- http://localhost:8081/api/v1/send
```

The command returns the request key for the transaction:

```
{"requestKeys":["rXOJyLWXQAQqMaHP-oIN1GDsKqwwzv-thqY-NZzmtYo"]}
```

To poll for the results of a transaction, you can run a command similar to the following:

```bash
curl -L http://localhost:8081/api/v1/poll -H 'Content-Type: application/json' -H 'Accept: application/json' --json '{"requestKeys": ["rXOJyLWXQAQqMaHP-oIN1GDsKqwwzv-thqY-NZzmtYo"]}'  
```

In this example, the transaction is complete and the request returns the following response:

```bash
{"rXOJyLWXQAQqMaHP-oIN1GDsKqwwzv-thqY-NZzmtYo":{"gas":0,"result":{"status":"success","data":30},"reqKey":"rXOJyLWXQAQqMaHP-oIN1GDsKqwwzv-thqY-NZzmtYo","logs":"wsATyGqckuIvlm89hhd2j4t6RMkCrcwJe_oeCYr7Th8","metaData":null,"continuation":null,"txId":1}}%
```

