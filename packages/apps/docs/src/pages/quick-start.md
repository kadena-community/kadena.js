---
title: Quick start
description: Kadena makes blockchain work for everyone.
menu: Quick start
label: Quick start
order: 0
editLink: https://github.com/kadena-community/getting-started/edit/main/README.md
layout: full
tags: [devnet,chainweaver,tutorial,docker,transactions]
lastModifiedDate: Fri, 03 Nov 2023 10:17:17 GMT
---

# Welcome to Kadena

The _Quick start_ assumes that you are a new developer without any prior experience working with Kadena and that you want a simplified, 
In the _Quick start_, you'll get a basic introduction to Kadena, learn how to set up a Kadena development environment, and deploy a simple **smart contract** application on the Kadena developer network. 

This _Quick start_ introduces a few basic steps for working with Kadena. 
It provides a simplified entry point for anyone interested in trying out or building on Kadena, with step-by-step instructions to guide you on your journey.
In this tutorial, you’ll learn how to:

- Set up a local **development network**.
- Deploy a simple **smart contract** application.
- Get free developer tokens using a **faucet** utility.
- View your contract recorded in a blockchain using a **block explorer**.

## Kadena at a glance

To get the most out of this tutorial, it’s helpful to be familiar with a few key concepts and terms that might be new to you. 
Kadena is a **proof-of-work** blockchain that runs on the public internet. 
Its proof-of-work protocol is called **Chainweb**.

The Kadena main network is a decentralized public blockchain with multiple member blockchains that have computers running the Chainweb software.
Kadena also maintains a test network for staging changes before they are released on the public blockchain.
For this tutorial, you'll use a private copy of the network—the development network—that runs locally on your computer to simulate deploying an application on the main network.

The application you'll deploy is a simple "Hello, World!" smart contract written in the Kadena programming language, **Pact**.
A smart contract is a computer program that runs automatically when the conditions specified in the program logic are met. 
By deploying a smart contract on a blockchain, the terms of an agreement can be executed programmatically in a decentralized way, without any intermediary involvement or process delays.

Because a smart contract requires computer resources to execute the agreement, the contract also incurs transaction fee to compensate for the resources it uses.
To enable development, most blockchains provide an application that distributes cryptocurrency rewardd—**tokens**—that can be used for testing purposes. 
The application that distributes the tokens is typically called a **faucets** because the rewards are so small, like drops of water from a leaky faucet.
The tokens need to be stored in an account for you to use them.
The account—your digital **wallet**—has a **secret key** and a **public key** to keep it secure and you'll learn more about that in other tutorials.
For now, it's enough to know that you have to authorize transactions you want to execute by signing them with the public key for your account.

If a transaction is successful—properly signed and executed—it gets included in a block, where you can confirm the execution using a **block explorer**.
A block explorer is an application that allows you to view detailed information about blockchain transactions, individual blocks, and account addresses.
In most cases, you access the block explorer using your web browser.
However, every blockchain has its own distinct block explorer. For this tutorial, you'll use a block explorer to see transactions on the Kadena blockchain. 

## Before you begin

Before you start this tutorial, verify the following basic requirements:

- You have an internet connection and a web browser installed on your local computer.
- You have a code editor, access to an interactive terminal shell, and are generally familiar with using command-line programs.
- You have Docker installed and are generally familiar with using Docker commands for containerized applications.
 
  For information about downloading and installing Docker, see [Docker documentation](https://docs.docker.com/get-docker).

- You have [Node.js](https://nodejs.dev/en/learn/how-to-install-nodejs/) installed on your local computer.

## Start a local development network

To get started, you are going to use Docker to create a Kadena development network in an application container on your local computer.

To set up a local development network:

1. Open a terminal shell on your computer.

1. Start the Docker service if it isn't configured to start automatically in your local environment.
   
   You can run the `docker info` command to check whether Docker is currently running.
   
2. Create a new Docker volume by running the following command:

   ```shell
   docker volume create kadena_devnet
   ```

3. Pull the `kadena_devnet` volume image and start the `devnet` container by running the following command:
   
   ```shell
   docker run --interactive --tty --publish 8080:8080 --volume kadena_devnet:/data --name devnet kadena/devnet
   ```

4. Restart the development network by running the following command:
   
   ```shell
   docker start devnet
   ```

## View the development network

The `devnet` container includes a block explorer that connects to the network.
You can open the block explorer to see blocks as they are added to the blockchain and the transactions that are executed and included in those blocks.
On the Kadena main network, blocks are added to the chain every 30 seconds. 
However, to optimize the development workflow on the Kadena development network, blocks are added to the chain every five seconds. 

1. Open a web browser on your local computer.
2. Open the Kadena development network block explorer using the URL http://localhost:8080/explorer/.
3. Notice that blocks are added every five seconds but at this point no transactions are being executed.

## Create an account wallet

As mentioned in [Kadena at a glance](#kadena-at-a-glance), you need an account—a digital wallet—to hold the tokens required to interact with the blockchain.
There are a lot of options for creating a wallet.
The steps are similar for any wallet, but in this tutorial, let's use Kadena Chainweaver to set up your account wallet.

To create an account wallet:

1. Open Chainweaver from your browser using the URL https://chainweaver.kadena.network.

2. Review the [Terms of Service](https://kadena.io/chainweaver-tos/) and confirm that you agree to them, then click **Create a new wallet**.

3. Enter and confirm the password for your account, then click **Continue**.

4. Confirm that you understand the importance of the recovery phrase, then click **Continue**.

5. Click **Copy** to copy the 12-word recovery phrase to a secure location.
   
   You can also reveal each word by moving the cursor over the text field in the browser. 
   Write each word in the correct order and store the complete recovery phrase in a secure location.

6. Confirm that you have stored the recovery phrase, then click **Continue**.

7. Verify the 12-word recovery phrase by typing the correct words in the correct order, then click **Continue**.

8. Click **Done** to view your new wallet.

## Add the development network

Now that you have a Chainweaver wallet, you need to connect it to the development network.

To add the development network to your new wallet:

1. Click **Settings** in the navigation panel.

2. Click **Network**.

3. In Edit Networks, type the network name **Ddvnet**, then click **Create**.

4. Expand the **devnet** network, then add the localhost as a node for this network by typing `127.0.0.1:8080`.
   
   If the local computer is still running the development network, you should see the dot next to the node turn green.

1. Click **Ok** to close the network settings.

## Create keys to sign transactions

The next step is to create keys for your account so that you can sign transactions that you want to authorize.

To create keys in your Chainweaver wallet:

1. Click **Keys** in the navigation panel.
   
   You'll see that a public key has already been generated for your account.
   The secret key for this account is the information that can only be recovered using the 12-word recovery phrase.
   You can create additional public keys for signing transactions by clicking **Generate Key**.
   However, any additional public keys you generate are still associated with the same secret key and recovery phrase.

2. Click **Add k: Account**.
   
   Under Balance (KDA), notice that the account displays **Does not exist**.
   In Kadena, keys are used to sign transactions but they don't hold funds to pay transaction fees.
   Keys must be linked to an account that holds funds before you can use them to sign transactions.

## Fund your account

Right now, you have an empty wallet.
The next step is to fund your account so you can pay transaction fees. 
You can fund the account from a pre-installed development network account called `sender00`.

1. Open a terminal shell on your computer.

1. Clone the `getting-started` repository by running the following command:

    ```shell
    git clone https://github.com/kadena-community/getting-started.git
    ```

2. Change to the root of the `getting-started` repository by running the following command:
   
    ```shell
    cd getting-started
    ```
1. Install dependencies by running the following command:

    ```shell
    npm install
    ```

1. In Chainweaver, click **Accounts** in the navigation panel, then copy the account name for your account.
    
1. Send tokens from the `sender00` account to the account name you copied by running a command similar to the following:
   
   ```shell
   npm run start -- fund --keys "<your-account-key>" --predicate "keys-all"
   ```

   In this command, specify the public key for the account you copied from Chainweaver for the `--keys` command-line option.
   The combination of the `keys` and `predicate` create a **keyset** that is used to safeguard your account.
   You'll learn more about keysets in other tutorials.

2. Open the [Kadena Block Explorer](http://localhost:8080/explorer/) to search for the transaction using the account you copied from Chainweaver.

3. In Chainweaver, click **Refresh** to update the account balances.

## Deploy a contract

Now that you have a funded account, you can use that account and public key to deploy a simple `hello world` smart contract—written on the Kadena programming language, Pact—on the development network.
You'll learn more about Pact in other tutorials, but for now, let's deploy a predefined smart contract that looks like this:

```lisp
(namespace 'free)
(module hello-world GOVERNANCE
  (defcap GOVERNANCE () true)
  (defun say-hello(name:string)
    (format "Hello, {}! ~ from: ${publicKey}" [name])
  )
)
```

To deploy the smart contract:

1. Verify you have Chainweaver open in the browser.

2. Open a terminal shell on your computer.

1. Change to the root of the `getting-started` repository, if necessary, by running the following command:
   
   ```shell
   cd getting-started
   ```

3. Deploy the smart contract from the `getting-started` repository by running a command similar to the following:
   
   ```shell
   npm run start -- deploy --keys "<your-account-key>" --predicate "keys-all" --sign-manually
   ```

   In the next steps, you copy and paste information between the terminal and the Chainweaver application.
   The instructions for signing the transaction using Chainweaver in the browser are also displayed in the terminal.

1. In Chainweaver, click **SigBuilder** in the navigation panel.

2. Copy and paste the transaction information displayed in the terminal into the Signature Builder, then click **Review**.

3. Verify that the hash matches the hash displayed in the terminal to ensure you're signing the transaction you expect to sign, then click **Details**.

4. Scroll to locate the **Signers** section of the transaction and verify that your public key is listed, then click **Sign**.

5. Copy the full Command JSON or the content of the `sig` key-value pair and paste it into the terminal.
   
   After you enter this command, the terminal displays information about the transaction including a `requestkey`. 
   You can click **Done** in Chainweaver to close the Signature Builder.

6. Copy the `requestkey` from the terminal.

7. Open the [Kadena block explorer](http://localhost:8080/explorer), select **Request Key**, paste the `requestkey` from the terminal, then click **Search**
   
   In the Transaction Results, you'll see a result similar to the following:
   
   Loaded module free.hello-world, hash dP-eeuLlCkDI7aEvHuWhxGs-mTjw-gSUAD0DHJ9Xnxw

Now that you have uploaded the smart contract, you can interact with it on the development network.

## View the smart contract

After you deploy the `hello-world` smart contract, you can view and interact with it on the development network using Chainweaver.

To view the `hello-world` smart contract:

1. In Chainweaver, click **Contracts** in the navigation panel.
   
   After you click Contracts, Chainweaver displays two working areas.
   The left side enables you to view and edit contract code and execute commands interactively.
   The right side enables you to navigate, view details, and test operations for contracts you have deployed.

2. On the right side in Contracts, click **Module Explorer**.

3. Under Deployed Contracts, search for the `hello-world` contract.

4. Click **View**  to display details about the smart contract.
   For example, you can see that this contract has two functions—`set-message` and `greet`—and one capability defined.

## Execute a read-only command

On the left side of the Contracts tab, you can write commands you want to execute on the blockchain. 
Most commands require you to pay a transaction fee because they change the state of the information stored in the blockchain.
However, you can also write commands that only **read** information from the blockchain.
Read-only commands don't require transaction fees.

To execute a command using the `hello-world` contract:

1. In the left side under Contracts, type the following command:
   
   ```lisp
   (free.hello-world.say-hello "Albert")
   ```

2. Click **Deploy** to display the transaction details, then click **Next**.

3. Review the signing information, but leave the Signing Key empty because you're executing a read-only command, then click **Next**.

   After you click Next, You'll see an error message that "A 'Gas Payer' has not been selected for this transaction. Are you sure this is correct?"
   You can ignore this message because you're executing a read-only command.

4. Scroll to see the Raw Response:
   
   "Hello, Albert!"

## Write to the blockchain

You've actually already written to the blockchain by deploying your `hello-world` smart contract. 
You changed the **state** of the blockchain from not having the `hello-world` contract to having the `hello-world` contract included in a specific block.
However, that state change transaction didn't take place from within the context of the smart contract itself.
No contract logic was executed in the transaction.

To illustrate how you can change the state of information stored on the blockchain using the logic in a smart contract, we make a few adjustments to the content of the `hello-world` smart contract.
The modified version of the smart contract looks like this:

```lisp
(namespace 'free)
(module hello-world G
  (defcap G () true)

  (defschema hello-world-schema
    @doc "The schema for hello world"

    text:string)

  (deftable hello-world-table:{hello-world-schema})

  (defun say-hello(name:string)
    (format "Hello, {}!" [name]))

  (defun write-hello(name:string)
    (write hello-world-table name
      { "text": (say-hello name) }))

)

(create-table hello-world-table)
```
### Review contract changes

Before moving on, let's take a closer look at what's changed in the sample `hello-world` contract.

The updated `hello-world` contract creates a simple schema of what you want deployed on the blockchain. 
This schema assigns a value to each key when you execute the `(write <table> <key> { })` command.
Anything between the curly braces (`{ }`) must comply with the schema.

The schema for this contract is defined in the following lines:

```lisp
(defschema hello-world-schema
  @doc "The schema for hello world"

  text:string)
```

The updated contract also includes a function that allows you to write to the schema in the following lines:

```lisp
(defun write-hello(name:string)
  (write hello-world-table name
    { "text": (say-hello name) }))
```

### Deploy the modified contract

After making these changes, you need to redeploy the contract.

To redeploy the `hello-world` smart contract:

1. Verify you have Chainweaver open in the browser.

2. Open a terminal shell on your computer.

1. Change to the root of the `getting-started` repository, if necessary, by running the following command:
   
   ```shell
   cd getting-started
   ```

3. Redeploy the smart contract from the `getting-started` repository by running a command similar to the following:
   
   ```shell
   npm run start -- deploy \
   --keys "your-account-key" \
   --predicate keys-all \
   --file ./src/pact/hello-world.pact
   --sign-manually
   ```

   As you saw in the previous deployment, you'll copy and paste information between the terminal and the Chainweaver application.
   The instructions for signing the transaction using Chainweaver in the browser are also displayed in the terminal.

### Execute a write function

1.  Go to the "contracts" page in Chainweaver

2.  Write the following snippet
    ```lisp
    (free.hello-world.write-hello "Albert")
    ```

3.  Click "Deploy"

4.  Select Chain ID "0"

5.  In "Transaction Sender" select "Account" that corresponds with the account
    that you funded. It should be `k:<public-key>`

6.  Other settings should be correctly filled in as default

7.  Click "next"

8.  In "Unrestricted Signing Keys" select the `public-key` of your account

9.  Click "next"

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

1.  Paste the snippet in the editor
    ```lisp
    (map (read free.hello-world.hello-world-table) (keys free.hello-world.hello-world-table))
    ```
2.  Click "deploy"
3.  Change the Chain ID to 0 (as we only deployed the contract on Chain 0)
4.  Change the gas limit to `99999`
5.  Click next to the end
6.  In "Raw Response" you should be able to see
        [{"text": "Hello, Albert!"}]

## Further reading

Get started with the basics of Pact by reading the
[Welcome to Pact](https://docs.kadena.io/learn-pact/beginner/welcome-to-pact)
docs.

[Reference documentation of Pact](https://docs.kadena.io/pact/reference)

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
