---
title: 10 Minute Quickstart
description: Learn Kadena’s core concepts & tools for development in 10 minutes
menu: Quickstart
label: 10 Minute Quickstart
order: 1
layout: full
tags: [devnet, chainweaver, tutorial, docker, transactions]
---

# 10 minute quickstart with Kadena

Welcome to the world of Kadena, a powerful blockchain platform that combines
scalability with simplicity. In this guide, we'll walk you through the essential
steps to kickstart your journey with Kadena. Whether you're a seasoned
blockchain developer or a newcomer to the space, you'll find the process
intuitive and efficient.

Here we run Devnet and deploy a "Hello World" smart-contract on Kadena
blockchain in 10 minutes

## Start fat-container `kadena/devnet`

1. Create docker volume

   ```shell
   docker volume create kadena_devnet
   ```

2. start kadena-devnet fat-container

   ```shell
   docker run -it -p 8080:8080 -v kadena_devnet:/data --name devnet kadena/devnet
   # restart with
   docker start devnet
   ```

## Monitor the blockchain

In the fat-container we expose an explorer that connects to the devnet

1. Go to http://localhost:8080/explorer/

Here you can see the blocks that are mined, and the transactions that are
executed

In Kadena a block is mined every 30 seconds. However, to optimize development
workflow, the devnet mines a block in 5 seconds.

## Chainweaver wallet

1. Use Chainweaver
   1. Download and install from
      https://github.com/kadena-io/chainweaver/releases
   2. Or, use the web version: https://chainweaver.kadena.network
2. Launch Chainweaver and create your mnemonic key

## Add devnet to Chainweaver

1. Click "Settings" tab in the bottom left
2. Select "Network"
3. Fill in the network name: "Devnet"
4. Open the network you created "> Devnet"
5. Add a node: "127.0.0.1:8080", the red dot on the right, should become green
   now.

## Create keys to sign transactions

1. Go to "Keys" on the left and click "+ Generate" on the top-right. This is
   your first key-pair.
2. To show the balance of this account, click "Add k: Account".
3. Go back to the "Accounts" tab on the left. Notice that the "Balance (KDA)"
   says "Does not exist".

In Kadena, keys and accounts do not represent the same thing. An account needs
to be created before it can be used.

## Fund your account

> Note: we use [NodeJS](https://nodejs.dev/en/learn/how-to-install-nodejs/)
> (personal recommendation to
> [install with `n`](https://github.com/tj/n#readme)) and run `npm install` in
> the root of this project
>
> 1. install nodejs
> 2. run `npm install`

Before we can create an account, you need to have KDA to pay for the gas-fees
(transaction fee).

We can gain KDA by funding it from a pre-installed "devnet" account called
"sender00".

In this process, we’ll submit a transaction that creates an account based on the
"keys" and "predicate" that you supply. The combination of `keys` + `predicate`
makes a `keyset`, which is used to `guard` your account.

1. Send money from "sender00" to your account. Copy your account name from the
   "Accounts" tab and fill it in the command

   ```shell
   npm run start -- fund --keys "<your-key>" --predicate "keys-all"
   ```

2. Open the Block Explorer http://localhost:8080/explorer/ to monitor the
   transaction
3. In Chainweaver, click "Refresh" to update the account balances

## Deploy a contract

We're going to deploy the `hello world` smart-contract using your newly created
account. This is what the smart contract looks like:

```lisp
(namespace 'free)
(module hello-world GOVERNANCE
  (defcap GOVERNANCE () true)
  (defun say-hello(name:string)
    (format "Hello, {}! ~ from: ${publicKey}" [name])
  )
)
```

We've created the commands necessary to deploy this smart contract. You can just
run the following command. Make sure to have Chainweaver open, as it's required
to sign with your private key.

**Important**: the web version of Chainweaver does not have an automated signing
flow. Use the **Chainweaver Web** command. **_Follow the instructions in the
terminal_**.

Once you run the command you'll see a modal open in Chainweaver. This modal
shows a few things:

1. Transaction metadata like who pays for the transaction, etc.
2. The "code" that's executed when the transaction
3. The "data" that's available for the functions that are executed (in this case
   nothing)
4. The "signers" needed to sign for the transaction  
   In this example we have an "unscoped signer" as for deploying a smart
   contract, there are no "capabilities" that scope what your signature can be
   used for (read more about this in our
   [Step-By-Step Guide to Writing Smart Contracts](https://docs.kadena.io/build/guides/a-step-by-step-guide-to-writing-pact-smart-contract#capabilities))

```shell
npm run start -- deploy --keys "<your-key>" --predicate "keys-all"

# chainweaver web: follow the instructions in the terminal
npm run start -- deploy --keys "<your-key>" --predicate "keys-all" --sign-manually
```

In the terminal you'll see a "requestkey". Copy this and search for it to the
[block explorer](http://localhost:8080/explorer). You'll see a transaction with
a "Result" that looks like:

> Loaded module free.hello-world, hash
> PMQzeVszU0Zo9WJzjGmzndylVKb5tSjAukS7J0EMpLQ

Now you can interact with the smart contract

## Interacting with a smart contract

1. Open Chainweaver
2. Navigate to the "Contracts" on the left
3. Open the "Module Explorer"-tab on the right
4. Search in "Deployed Contracts" for the `hello-world` contract
5. Click the "View" button to show details of the smart contract

If everything went correctly, you should be able to see the smart contract and
its details.

Now on the left side you can write a command. You can write any command and
execute it on the blockchain. Each command requires at least someone to pay the
transaction fee, often called "gas".

You can also write a command that **does not require transaction fee** as it
doesn't write, but **only read** from the database of the blockchain.

This is a read command that you can execute that uses the contract that you just
deployed. Write it in the left side of your Chainweaver inside "Contracts" page.

```lisp
(free.hello-world.say-hello "Albert")
```

1. Click the "deploy" button on the top right.
2. Click next twice
3. You'll get an error "A 'Gas Payer' has not been selected for this
   transaction. Are you sure this is correct?", but you can ignore that since
   you're executing a read-only command.
4. Scroll to the bottom. Here you'll see the "Raw Response"

> "Hello, Albert!"

## Writing to the blockchain

Actually, you've already written to the blockchain. When you deployed your smart
contract, you executed a write. But that's not a write from within the smart
contract, but a "native" one.

To write on the blockchain via a smart contract, we need to make a few
adjustments to our smart contract.

We've created an updated smart contract for you that you can use for that.
[Check it out here](https://github.com/kadena-community/getting-started/blob/main/src/pact/hello-world.pact).
Run the following command to **redeploy** the `hello-world` smart contract:

```shell
npm run start -- deploy \
  --keys "your-key" \
  --predicate keys-all \
  --file ./src/pact/hello-world.pact

# chainweaver web: follow the instructions in the terminal
npm run start -- deploy \
  --keys "your-key" \
  --predicate keys-all \
  --file ./src/pact/hello-world.pact \
  --sign-manually
```

You'll walk through the same process as before in Chainweaver.

> Yes you read that correctly. **You can redeploy and update a smart
> contract!**  
> This is one of the many cool features of Pact and Kadena, however, you cannot
> change the schema (yet)

We've created a schema that'll show the structure of what you post on the
blockchain. This is the "value"-side of a "key-value-pair". Each value is
assigned to a key that you pass when you execute a `(write <table> <key> { })`.
Anything between `{}` must comply with the schema.

The schema is very simple, and looks like this:

```lisp
(defschema hello-world-schema
  @doc "The schema for hello world"

  text:string)
```

We also created a function that allows you to write to the schema:

```lisp
(defun write-hello(name:string)
  (write hello-world-table name
    { "text": (say-hello name) }))
```

### Executing a write function

1. Go to the "contracts" page in Chainweaver
2. Write the following snippet
   ```lisp
   (free.hello-world.write-hello "Albert")
   ```
3. Click "Deploy"
4. Select Chain ID "0"
5. In "Transaction Sender" select "Account" that corresponds with the account
   that you funded. It should be `k:<public-key>`
6. Other settings should be correctly filled in as default
7. Click "next"
8. In "Unrestricted Signing Keys" select the `public-key` of your account
9. Click "next"
10. You'll see a Notice:

    > A 'Gas Payer' has not been selected for this transaction. Are you sure
    > this is correct?

    You can safely ignore this, as the gas-payment will be done by the
    unrestricted signer

11. Click "submit". Now that you have written to the table, we can read from the
    table

### Read from the table

Execute the following function, and deploy to read the keys from the table.

> **Note:** this function costs a lot as this is not something you'd usually do
> in a regular transaction.

1. Paste the snippet in the editor
   ```lisp
   (map (read free.hello-world.hello-world-table) (keys free.hello-world.hello-world-table))
   ```
2. Click "deploy"
3. Change the Chain ID to 0 (as we only deployed the contract on Chain 0)
4. Change the gas limit to `99999`
5. Click next to the end
6. In "Raw Response" you should be able to see
   ```
   [{"text": "Hello, Albert!"}]
   ```

## Further reading

Get started with the basics of Pact by reading the
[Welcome to Pact](https://docs.kadena.io/learn-pact/beginner/welcome-to-pact)
docs.

[Reference documentation of Pact](https://pact-language.readthedocs.io/en/latest/)

A very good and complete tutorial on learning pact, with real world scenario's,
is the
[Real World Pact series of Thomas Honeyman](https://github.com/thomashoneyman/real-world-pact#real-world-pact)

<!-- Now we can try to execute the `say-hello` function using chainweaver. First
navigate to the contracts tab:

![image](https://github.com/kadena-community/getting-started/assets/1508400/0f2d192f-6a75-4a9b-ba5d-e87ff51edaf4) -->

<!-- Then click on the module explorer from the right side tab:

![image](https://github.com/kadena-community/getting-started/assets/1508400/af74e8e4-199e-4f6b-a199-f5f2f1ac9ec5) -->

<!-- Then search for the `hello-world` contract:

![image](https://github.com/kadena-community/getting-started/assets/1508400/5b253553-8e3c-43a7-8e23-a0309675d5d7) -->

<!-- View the contract to see all available methods:

![image](https://github.com/kadena-community/getting-started/assets/1508400/8b360ae2-260d-4eed-8c6f-f742d427d49d) -->

<!-- Click on `call` to see the necessary arguments:

![image](https://github.com/kadena-community/getting-started/assets/1508400/808ddb40-cab9-4eba-aa15-35d823f020a8) -->

<!-- Notice how the raw command is prepared by chainweaver, make sure to fill in
`sender00` for the account. If you don't fill in any account, chainweaver will
warn you that no account has been selected for the transaction:

![image](https://github.com/kadena-community/getting-started/assets/1508400/02677a89-17ed-4a83-812b-b2fc40896018) -->

<!-- Then click on preview and ignore the
`A 'Gas Payer' has not been selected for this transaction` message. We are only
performing a lookup and will not be submitting this transaction. Scroll all the
way down and see the result of the method:

![image](https://github.com/kadena-community/getting-started/assets/1508400/c2c3eba1-a87b-48c6-b01a-4ab5b2e0b643) -->

<!-- Now let's copy the `Raw Command` and close the window. Paste the `Raw Command`
in the editor:

![image](https://github.com/kadena-community/getting-started/assets/1508400/d205e7aa-1b66-4fa9-8c00-2c1560c9bb2a) -->

<!-- Click on `Deploy` and fill in account to `sender00` and click on Preview once
more:

![image](https://github.com/kadena-community/getting-started/assets/1508400/7e76d1f5-188e-4631-8c4b-ba5047bc350d) -->

<!-- NOTE: if you do not fill in any account you will be presented with the following
message:

![image](https://github.com/kadena-community/getting-started/assets/1508400/3747b8a8-3c34-496d-8da4-5933d0fc83a4) -->
