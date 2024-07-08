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

The basic syntax for the `kadena tx` command is:

```bash
kadena tx <action> [arguments] [flags]
```

## Actions

Use the following actions to specify the operation you want to perform.

| Use this action | To do this                       |
| --------------- | -------------------------------- |
| add | Select a template and add a transaction. |
| sign | Sign a transaction using your wallet or using a key pair. |
| test | Test a signed transaction using a local endpoint without submitting it to the blockchain. |
| send | Send a signed transaction to the network.|
| status | Get the status of a transaction.|
| list | List transactions.|
| local | Submit Pact code as a local call. |
| history | Display a formatted list of transactions with their details.

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

Use `kadena tx add` to create transactions from **transaction templates**. 
Transaction templates enable you to provide and customize input to generate transactions for multiple networks and across chains using common patterns. 
After you provide values for template variables, you can generate and save transaction as API request files that are ready for you to
sign, test, and submit for execution.

### Basic usage

The basic syntax for the `kadena tx add` command is:

```bash
kadena tx add [arguments] [flags]
```

### Arguments

You can use the following command-line arguments with the `kadena tx add` command:

| Use this argument | To do this                                  | 
| ----------------- | ------------------------------------------- |
| -t, --template _templateName_ | Specify the path to the transaction template file you want to use. Template files are located in the `transaction-templates` directory and have the `.ktpl` file extension. This argument is required. |
| -d, --template-data _templateData_ | Specify the path to a file with the values that you want to use for template variables. This argument is optional. |
| -o, --out-file _generatedOutput_ | Specify the path for the generated transaction file. |
| -l, --holes | Display a list of the template variables that are required for the specified transaction template. |

### Templates

The Kadena CLI automatically creates and stores default templates in the configuration folder on your local computer.
By default, the templates are located in the `.kadena/transaction-templates` folder in your working directory.
The default templates in the `.kadena/transaction-templates` folder cover the most common types of transactions:

- The `transfer.ktpl` template simplifies the process of transferring tokens between accounts.
- The `safe-transfer.ktpl` template simplifies safe transfer operations that validatethe sender and receiver account information to prevent common mistakes like sending to an incorrect address.

These templates make it easier to construct and execute common operations without writing custom code.
You can also add your own templates to the `transaction-templates`  folder to make them available for generating transactions using the `kadena tx add` command.

### Examples

The `kadena tx add` command enables you to create transactions using **templates** in combination with the input values you specify. 
The default templates—`transfer` and `safe-transfer`—to enable to you create transactions that transfer tokens between accounts.
After you use `kadena tx add` to generate the transaction request and save it in a file, you can use other commands to sign and submit the request with minimal effort.

To generate a transaction from a template interactively, you can run the following command:

```bash
kadena tx add
```

This command then prompts you to select the template to use and to provide information about the account to transfer from and the account to transfer to.
For example:

```bash
? Which template do you want to use: transfer.ktpl
? File path of data to use for template .json or .yaml (optional):
? Template value from-acct: k:bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e
? Template value to-acct: k:5ec41b89d323398a609ffd54581f2bd6afc706858063e8f3e8bc76dc5c35e2c0
? Template value amount: 2.0
? Template value chain: 1
? Template value network: testnet04
? Template value from-key: bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e
? Where do you want to save the output: tx-wip
```

Be sure to use the account name—for example, the principal account name with the k: prefix—for transferring funds between account and not the account alias.
WHen specifying the network, you must use the network identifier—for example, development, testnet04,  or mainnet01—rather than the network name.
After you respond to the prompts, the command displays the transaction you constructed and confirms the location of the file containing the unsigned transaction.
For example:

```bash
{
  "cmd": "{\"payload\":{\"exec\":{\"code\":\"(coin.transfer \\\"k:bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e\\\" \\\"k:5ec41b89d323398a609ffd54581f2bd6afc706858063e8f3e8bc76dc5c35e2c0\\\" 2.0)\",\"data\":{}}},\"nonce\":\"\",\"networkId\":\"testnet04\",\"meta\":{\"sender\":\"k:bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e\",\"chainId\":\"1\",\"creationTime\":1716319427,\"gasLimit\":2300,\"gasPrice\":0.000001,\"ttl\":600},\"signers\":[{\"pubKey\":\"bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e\",\"clist\":[{\"name\":\"coin.TRANSFER\",\"args\":[\"k:bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e\",\"k:5ec41b89d323398a609ffd54581f2bd6afc706858063e8f3e8bc76dc5c35e2c0\",2]},{\"name\":\"coin.GAS\",\"args\":[]}]}]}",
  "hash": "fnfc-hZ9Lz0xzydBkURoL-Muxg0X80MIVKojIoJy9fQ",
  "sigs": [
    null
  ]
}

transaction saved to: ./tx-wip.json

Executed:
kadena tx add --template="transfer.ktpl" --template-data="" --from-acct="k:bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e" --to-acct="k:5ec41b89d323398a609ffd54581f2bd6afc706858063e8f3e8bc76dc5c35e2c0" --amount="2.0" --chain="1" --network="testnet04" --from-key="bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e" --out-file="tx-wip.json" 
```

## kadena tx sign

Use `kadena tx sign` to sign a transaction you've previously created.
You can sign the transaction using your wallet key or by manually entering one or more public and secret key pairs.

### Basic usage

The basic syntax for the `kadena tx sign` command is:

```bash
kadena tx sign [arguments] [flags]
```

### Arguments

You can use the following command-line arguments with the `kadena tx sign` command:

| Use this argument | To do this |
| ----------------- | ---------- |
| -s, --tx-sign-with _signingMethod_ | Specify the signing method. The valid values are wallet or keyPair. |
| -w, --wallet-name _walletName_ | Specify the name of the wallet if you are signing with a wallet. |
| --password-file _passwordFile_ | Specify the path to a file that stores the password for your wallet. If you don't have the password stored in a text file, you can enter it as standard input. |
| -k, --key-pairs _keyPairs_ | Specify each public and secret key pair as comma-separated strings. For example, specify the key pair using the following format publicKey=xxx,secretKey=xxx. If specifying more than one key pair, use a semi-colon (;) between key pairs. |
| -u, --tx-unsigned-transaction-files _unsignedTransactionFiles_ | Specify one or more the unsigned transaction file to sign. If specifying more than one file, use a comma-separated list. |
| -d, --directory _configDirectory_ | Specify the path to the configuration folder. The default is the current working directory.
| -l, --legacy | Sign using the ED25519 signature scheme for compatibility with Chainweaver. |

#### Examples

To sign a transaction interactively, run the following command:

```bash
kadena tx sign
```

This command prompts you to select a signing method, the transaction to sign, and keys to use.
For example:

```bash
? Select an action: Sign with wallet
? Select a transaction file: Transaction: tx-wip.json
? 1 wallets found containing the keys for signing this transaction, please select a wallet to sign this transaction 
with first: Wallet: cw-desktop
? Enter the wallet password: ********
```

After you enter the password, the transaction is signed and saved to a file.
For example, you should see output similar to the following:

```bash
Command 1 (hash: fnfc-hZ9Lz0xzydBkURoL-Muxg0X80MIVKojIoJy9fQ) will now be signed with the following signers:
Public Key                                                     Capabilities                                                                                                                                          
bbccc99ec9ee....750ba424d35e coin.TRANSFER(k:bbccc99ec9ee....750ba424d35e, k:5ec41b89d323....bc76dc5c35e2c0, 2)
                             coin.GAS()

Transaction executed code: 
"(coin.transfer \"k:bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e\" \"k:5ec41b89d323398a609ffd54581f2bd6afc706858063e8f3e8bc76dc5c35e2c0\" 2.0)"

Transaction with hash: fnfc-hZ9Lz0xzydBkURoL-Muxg0X80MIVKojIoJy9fQ was successfully signed.
Signed transaction saved to /Users/lisagunn/MY-KADENA/transaction-fnfc-hZ9Lz-signed.json

Executed:
kadena tx sign --tx-sign-with="wallet" --tx-unsigned-transaction-files="tx-wip.json" --wallet-name="cw-desktop" 
```

To sign a transaction with a public and secret key pair, you can run a command similar to the following:

```bash
kadena tx sign --tx-sign-with="keyPair" --wallet-name="testwallet" --tx-unsigned-transaction-files="transaction-(request-key)-signed.json"
```

## kadena tx test

Use `kadena tx test` to test the execution of a signed transaction against a specified network by making a Local call. 
By executing the transaction using the /local API endpoints, you can verify Pact smart contracts with actual data in the coin contract tables. 
You can use this command to check account information and to determine whether transactions will be executed successfully and without incurring transaction fees.

### Basic usage

The basic syntax for the `kadena tx test` command is:

```bash
kadena tx test [arguments] [flags]
```

### Arguments

You can use the following command-line arguments with the `kadena tx test` command:

| Use this argument | To do this |
| ----------------- | ---------- |
| -d, --directory _configDirectory_ | Specify the path to the configuration folder. The default is the current working directory. |
| -s, --tx-signed-transaction-files _signedTxFiles_| Specify one or more signed transaction files to sign in a comma-separated list. |
| -n, --tx-transaction-network _network_ | Specify a comma-separated list of networks to be used for executing the transaction in order of transaction. For example, to test executing a transaction on the Kadena development, test, and main networks in that order, you can set this argument to devnet,testnet, mainnet. |

#### Examples

To sign a transaction interactively, run the following command:

```bash
kadena tx test
```

This command prompts you to select a signed transaction file, then displays the execution results with output similar to the following:

```bash
--------------------------------------------------------------------------------
  txSignedTransaction test result:                                              
--------------------------------------------------------------------------------
  Transaction info:
     fileName: transaction-fnfc-hZ9Lz-signed.json
     transactionHash: fnfc-hZ9Lz0xzydBkURoL-Muxg0X80MIVKojIoJy9fQ


  Response:
    Response:
       gas: 509
       result:
         status: success
         data: Write succeeded
       reqKey: fnfc-hZ9Lz0xzydBkURoL-Muxg0X80MIVKojIoJy9fQ
       logs: wsATyGqckuIvlm89hhd2j4t6RMkCrcwJe_oeCYr7Th8
       events:
        [0]:
           params:
            [0]:
              k:bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e
            [1]:
              k:5ec41b89d323398a609ffd54581f2bd6afc706858063e8f3e8bc76dc5c35e2c0
            [2]:
              2
           name: TRANSFER
           module:
             namespace: null
             name: coin
           moduleHash: klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s
       metaData:
         publicMeta:
           creationTime: 1716319427
           ttl: 600
           gasLimit: 2300
           chainId: 1
           gasPrice: 0.000001
           sender: k:bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e
         blockTime: 1716319437772700
         prevBlockHash: Dh9XvsLlKpaYfAwo2xe1DpP-p68UMu8omJ-GWWFcscQ
         blockHeight: 4311122
       continuation: null
       txId: null


  Details:
     chainId: 1
     network: testnet
     networkId: testnet04
     networkHost: https://api.testnet.chainweb.com
     networkExplorerUrl: https://explorer.chainweb.com/testnet/tx/


  Transaction Command:
     cmd: {"payload":{"exec":{"code":"(coin.transfer \"k:bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e\" \"k:5ec41b89d323398a609ffd54581f2bd6afc706858063e8f3e8bc76dc5c35e2c0\" 2.0)","data":{}}},"nonce":"","networkId":"testnet04","meta":{"sender":"k:bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e","chainId":"1","creationTime":1716319427,"gasLimit":2300,"gasPrice":0.000001,"ttl":600},"signers":[{"pubKey":"bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e","clist":[{"name":"coin.TRANSFER","args":["k:bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e","k:5ec41b89d323398a609ffd54581f2bd6afc706858063e8f3e8bc76dc5c35e2c0",2]},{"name":"coin.GAS","args":[]}]}]}
     hash: fnfc-hZ9Lz0xzydBkURoL-Muxg0X80MIVKojIoJy9fQ
     sigs:
      [0]:
         sig: 179a060d420420115203024b9730f1c6d7bde8e62145096ec380d4a14c4fa9f1b07b8e48fadd94f3180c60a0f89f69047d0fb1f1f9778def5682a0f5fa12b40e
--------------------------------------------------------------------------------

Executed:
kadena tx test --tx-signed-transaction-files="transaction-fnfc-hZ9Lz-signed.json" --tx-transaction-network="testnet" 
```

## kadena tx send

Use `kadena tx send` to send a signed transaction to the specified network. 

### Basic usage

The basic syntax for the `kadena tx send` command is:

```bash
kadena tx send [arguments] [flags]
```

### Arguments

You can use the following command-line arguments with the `kadena tx send` command:

| Use this argument | To do this |
| ----------------- | ---------- |
| -d, --directory _configDirectory_ | Specify the path to the configuration folder. The default is the current working directory. |
| -s, --tx-signed-transaction-files _signedTxFiles_| Specify one or more signed transaction files to sign in a comma-separated list. |
| --tx-transaction-network _network_ | Specify a comma-separated list of networks to be used for executing the transaction in order of execution. For example, to execute a transaction on the Kadena development, test, and main networks in that order, you can set this argument to devnet,testnet, mainnet. |
| --poll | Poll the blockchain repeatedly for the current status of a sent transaction. |

### Examples

To send a transaction interactively, run the following command:

```bash
kadena tx send
```

This command prompts you to select a signed transaction file, then displays the execution results with output similar to the following:

```bash
kadena tx send
? Select a transaction file: Transaction: transaction-fnfc-hZ9Lz-signed.json
⠋ Sending transactions...

Transaction detail for command with hash: fnfc-hZ9Lz0xzydBkURoL-Muxg0X80MIVKojIoJy9fQ
Network ID Chain ID
testnet04  1       


✔ Completed
Transaction: fnfc-hZ9Lz0xzydBkURoL-Muxg0X80MIVKojIoJy9fQ submitted with request key: fnfc-hZ9Lz0xzydBkURoL-Muxg0X80MIVKojIoJy9fQ

Executed:
kadena tx send --tx-signed-transaction-files="transaction-fnfc-hZ9Lz-signed.json" --tx-transaction-network="testnet" 
```

To poll the blockchain for the transaction results until the transaction is executed, you can run a command similar to the following:

```bash
kadena tx send --tx-signed-transaction-files="transaction-JRk5jPdjTW-signed.json"  --poll
```

## kadena tx status

Use `kadena tx status` to retrieve the status of a transaction on the Kadena blockchain. 
By providing a transaction request key and specifying the network and chain id, you can query the current state of your transactions.
This command supports additional options for polling, allowing for real-time status updates until the transaction is finalized.

### Basic usage

The basic syntax for the `kadena tx status` command is:

```bash
kadena tx status [arguments] [flags]
```

### Arguments

You can use the following command-line arguments with the `kadena tx status` command:

| Use this argument | To do this |
| ----------------- | ---------- |
| -k, --request-key _requestKey_ | Specify the request key for the transaction you submitted. |
| -n, --network _network_ | Specify the Kadena network that you sent the transaction to. For example, you can set this argument to devnet, testnet, or mainnet. |
| -c, --chain-id _chainId_| Specify the Kadena chain identifier that you sent the transaction to.|
| --poll | Poll the blockchain repeatedly for the current status of a sent transaction. |

### Examples

To check the status of a transaction interactively, you can run a command similar to the following:

```bash
kadena tx status
```

This command prompts you to specify the request key, network, and chain identifier and returns the current status of the transaction identified by the provided request key.
If the transaction hasn't been completed, you can use the `--poll` option to continuously monitor the status of the transaction until it
Polling checks the transaction status every 60 seconds until the transaction is confirmed.

To poll the blockchain for transaction results using a request key, you can run a command similar to the following:

```bash
kadena tx status --request-key=JRk5jPdjTWseiE1MeQXq4FT2drpKsVJz4UBen6DT3ro --chain-id=1 --network=testnet --poll
```

If the specified transaction has been executed, you should see output similar to the following:

```bash
✔ Completed
Transaction Status: success
Chain ID            1                                                                 
Transaction Status  success                                                           
Transaction ID      6023995                                                           
Gas                 736                                                               
Block Height        4311429                                                           
Event:coin.TRANSFER k:5ec41b89d323398a609ffd54581f2bd6afc706858063e8f3e8bc76dc5c35e2c0
                    k:db776793be0fcf8e76c75bdb35a36e67f298111dc6145c66693b0133192e2616
                    0.000736                                                          
Event:coin.TRANSFER k:5ec41b89d323398a609ffd54581f2bd6afc706858063e8f3e8bc76dc5c35e2c0
                    k:bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e
                    1                  
```

## kadena tx list

Use `kadena tx list` to list the transactions you've created from transaction templates. 
The output from the command indicates whether the transaction has been signed.

### Basic usage

The basic syntax for the `kadena tx list` command is:

```bash
kadena tx list [arguments] [flags]
```

### Arguments

You can use the following command-line arguments with the `kadena tx list` command:

| Use this argument | To do this |
| ----------------- | ---------- |
| -d, --directory _configDirectory_ | Specify the path to the configuration folder. The default is the current working directory. |

### Examples

To list the transactions in your current working directory, you can run the following command:

```bash
kadena tx list
```

This command displays output similar to the following:

```bash
Filename                           Signed
my-code.json                       Yes   
transaction-kQSKbcjN3z-signed.json Yes   
tx-simple.json                     No    
tx-transfer-testnet.json           No    
```

## kadena tx local

Use `kadena tx local` to submit Pact code as a local call. 
This command can be useful for testing Pact code without submitting the transaction to the blockchain.

### Basic usage

The basic syntax for the `kadena tx local` command is:

```bash
kadena tx local [arguments] [flags]
```

### Arguments

You can use the following command-line arguments with the `kadena tx local` command:

| Use this argument | To do this |
| ----------------- | ---------- |
| -n, --network _networkName_ | Specify the Kadena network to connect to for calling the `/local` endpoint. The default is the `/local` endpoint on the Kadena test network. |
| -c, --chain-id _chainID_ | Specify the chain identifier to connect to for calling the `/local` endpoint. Valid values are "0" to "19". The default is the `/local` endpoint on chain 0. |
| -g, --gas-limit _gasLimit_ | Specify a gas limit for executing the local transaction. |

### Examples

To execute a simple Pact expression using the `/local` endpoint on the default network and chain, you can run a command similar to the following: 

```bash
kadena tx local "(+ 2 2)"
```

This command evaluates the `(+ 2 2)` expressions displays the following output:

```bash
Local transaction on network testnet chain 0:
4
```

To execute a Pact expression using the `/local` endpoint on a specific chain and set a gas limit for the transaction, you can run a command similar to the following: 

```bash
kadena tx local --network testnet --chain-id 3 --gas-limit 4 "(* 3 4)"
```

If the gas limit is too low, the command fails with an error message similar to the following:

```bash
Local transaction on network testnet chain 3:
Error from local call:
Gas limit (4) exceeded: 6
```

If you adjust the gas limit, the command succeeds:

```bash
kadena tx local --network testnet --chain-id 3 --gas-limit 10 "(* 3 4)"
Local transaction on network testnet chain 3:
12
```

To execute a Pact command that includes strings, you can escape the inner quotations marks with a command similar to the following:

```bash
kadena tx local --chain-id 3 '(base64-encode "once in a lifetime")'
```

The command evaluates the expression and displays the following output:

```bash
Local transaction on network testnet chain 3:
"b25jZSBpbiBhIGxpZmV0aW1l"

```

## kadena tx history

Use `kadena tx history` to list your transactions history. 

### Basic usage

The basic syntax for the `kadena tx history` command is:

```bash
kadena tx list [arguments] [flags]
```

### Arguments

You can use the following command-line arguments with the `kadena tx history` command:

| Use this argument | To do this |
| ----------------- | ---------- |
| -d, --directory _configDirectory_ | Specify the path to the configuration folder. The default is the current working directory. |

### Examples

To list the transaction history in your current working directory, you can run the following command:

```bash
kadena tx history
```

This command displays output similar to the following:

```bash
Request Key    EYh5uvPiUSBXS0KC7XDVKQxabgm7jXtdray_CBK_XRs
Network Host   http://localhost:8080                      
Network ID     development                                
Chain ID       3                                          
Time           2024-06-18 14:06                           
Status         success                                    
Transaction ID 1438 
                     
Request Key    m32rYeSP3iBoNZNZhkknHTDdIokPzBjy3xeI-Md1Dn0
Network Host   http://localhost:8080                      
Network ID     development                                
Chain ID       3                                          
Time           2024-06-18 14:16                           
Status         success                                    
Transaction ID 1471                 
```

To format the output in JSON, you can include the `--json` command-line options:

```bash
kadena tx history --json
```

```bash
{
  "EYh5uvPiUSBXS0KC7XDVKQxabgm7jXtdray_CBK_XRs": 
  {
    "dateTime": "2024-06-18T21:06:51.366Z",
    "cmd": "{\"payload\":{\"exec\":{\"code\":\"(coin.transfer-create \\\"k:0b8fb7b68f6e058143d5c57094a9be9835811d936ae486120ef036cc4ff9b31a\\\" \\\"k:6887c4cce24a0ac69e0db0e3e1db6d2d97edb6b7935da7c19f1651b71ade398f\\\" (read-keyset \\\"account-guard\\\") 2.0)\",\"data\":{\"account-guard\":{\"keys\":[\"6887c4cce24a0ac69e0db0e3e1db6d2d97edb6b7935da7c19f1651b71ade398f\"],\"pred\":\"keys-all\"}}}},\"nonce\":\"\",\"networkId\":\"development\",\"meta\":{\"sender\":\"k:0b8fb7b68f6e058143d5c57094a9be9835811d936ae486120ef036cc4ff9b31a\",\"chainId\":\"3\",\"creationTime\":1718744764,\"gasLimit\":2000,\"gasPrice\":1e-8,\"ttl\":7200},\"signers\":[{\"pubKey\":\"0b8fb7b68f6e058143d5c57094a9be9835811d936ae486120ef036cc4ff9b31a\",\"clist\":[{\"name\":\"coin.TRANSFER\",\"args\":[\"k:0b8fb7b68f6e058143d5c57094a9be9835811d936ae486120ef036cc4ff9b31a\",\"k:6887c4cce24a0ac69e0db0e3e1db6d2d97edb6b7935da7c19f1651b71ade398f\",2]},{\"name\":\"coin.GAS\",\"args\":[]}]}]}",
    "networkId": "development",
    "chainId": "3",
    "networkHost": "http://localhost:8080",
    "status": "success",
    "txId": 1438
  }
}