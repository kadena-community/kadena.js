---
title: "Deploy your first contract - Quick start"
id: quickstart
description: "Learn how to set up a development environment and deploy your first smart contract on Kadena."
menu: Build
label: "Deploy your first contract"
order: 1
layout: full
tags: [pact, typescript, account, transactions, utils]
---

# Deploy your first contract

This *Quick start* introduces a few basic steps for working with Kadena.
It provides a simplified entry point for anyone interested in trying out or building on Kadena, with step-by-step instructions to guide you on your journey.
In this tutorial, you’ll learn how to:

*   Set up a local **development network**.
*   Create and fund a development account **wallet**.
*   Deploy a simple **smart contract** application.
*   View your contract recorded in a blockchain using a **block explorer**.

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

Because a smart contract requires computer resources to execute the agreement, the contract also incurs a transaction fee to compensate for the resources it uses.
To enable development, most blockchains provide an application that distributes cryptocurrency rewards—**tokens**—that can be used for testing purposes.
The application that distributes the tokens is typically called a **faucet** because the rewards are so small, like drops of water from a leaky faucet.
The tokens need to be stored in an account for you to use them.
The account—your digital **wallet**—has a **secret key** and a **public key** to keep it secure.
You'll learn more about that in other tutorials.
For now, it's enough to know that you have to authorize transactions you want to execute by signing them with the public key for your account.

If a transaction is successful—properly signed and executed—it gets included in a block, where you can confirm the execution using a **block explorer**.
A block explorer is an application that allows you to view detailed information about blockchain transactions, individual blocks, and account addresses.
In most cases, you access the block explorer using your web browser.
However, every blockchain has its own distinct block explorer.
For this tutorial, you'll use ath Kadena block explorer to see transactions on the Kadena development network blockchain.

## Before you begin

Before you start this tutorial, verify the following basic requirements:

*   You have an internet connection and a web browser installed on your local computer.

*   You have a code editor, access to an interactive terminal shell, and are generally familiar with using command-line programs.

*   You have Docker installed and are generally familiar with using Docker commands for containerized applications.

    For information about downloading and installing Docker, see [Docker documentation](https://docs.docker.com/get-docker).

*   You have [Node.js](https://nodejs.dev/en/learn/how-to-install-nodejs/) installed on your local computer.

## Start a local development network

To get started, you are going to use Docker to create a Kadena development network in an application container on your local computer.

To set up the local development network:

1.  Open a terminal shell on your computer.

2.  Start the Docker service if it isn't configured to start automatically in your local environment.

    You can run the `docker info` command to check whether Docker is currently running.

3.  Create a new Docker volume by running the following command:

    ```shell
    docker volume create kadena_devnet
    ```

4.  Pull the `kadena_devnet` volume image and start the `devnet` container by running the following command:

    ```shell
    docker run --interactive --tty --publish 8080:8080 --volume kadena_devnet:/data --name devnet kadena/devnet
    ```

    If you want to automatically remove the container when you stop it, add the `--rm` command-line option.
    For example:

    ```shell
    docker run --rm --interactive --tty --publish 8080:8080 --volume kadena_devnet:/data --name devnet kadena/devnet
    ```

    Wait for the image to be downloaded to your local environment.

5.  Restart the development network by running the following command:

    ```shell
    docker start devnet
    ```

    After you start the development network, you'll see information about the network processes displayed in a terminal console.

    ![Development network (devnet) console](/assets/docs/hello-world-quickstart/devnet-console.png)

## View the development network

The `devnet` container includes a block explorer that connects to the network.
You can open the block explorer to see blocks as they are added to the blockchain and the transactions that are executed and included in those blocks.
On the Kadena main network, blocks are added to the chain every 30 seconds.
However, to optimize the development workflow on the Kadena development network, blocks are added to the chain every five seconds.

To view the development network:

1.  Open a web browser on your local computer.
2.  Open the Kadena development network block explorer using the URL http://localhost:8080/explorer/.
3.  Notice that blocks are added every five seconds, but, at this point, no transactions are being executed.

## Create an account wallet

As mentioned in [Kadena at a glance](#kadena-at-a-glance), you need an account—a digital wallet—to hold the funds required to interact with the blockchain.
There are a lot of options for creating a wallet.
The steps are similar for any wallet, but in this tutorial, you'll use Kadena Chainweaver to set up your account wallet.

To create an account wallet:

1.  Open Chainweaver from your browser using the URL https://chainweaver.kadena.network.

2.  Review the [Terms of Service](https://kadena.io/chainweaver-tos/) and confirm that you agree to them, then click **Create a new wallet**.

3.  Type and confirm the password you want to use for this account, then click **Continue**.

4.  Confirm that you understand the importance of the recovery phrase, then click **Continue**.

5.  Click **Copy** to copy the 12-word recovery phrase to the clipboard so you can save it in a secure location, for example, as a note in a password vault.

    You can also reveal each word by moving the cursor over the text field in the browser.
    Write each word in the correct order and store the complete recovery phrase in a secure place.

6.  Confirm that you have stored the recovery phrase, then click **Continue**.

7.  Verify the 12-word recovery phrase by typing the correct words in the correct order, then click **Continue**.

8.  Click **Done** to view your new wallet.

## Connect to the development network

Now that you have a Chainweaver wallet, you can connect it to the development network.

To add the development network to your new wallet:

1.  Click **Settings** in the Chainweaver navigation panel.

2.  Click **Network**.

3.  In Edit Networks, type the network name **devnet**, then click **Create**.

4.  Expand the **devnet** network, then add the localhost as a node for this network by typing `127.0.0.1:8080`.

    If the local computer is still running the development network Docker container, you should see the dot next to the node turn green.

5.  Click **Ok** to close the network settings.

## Create keys to sign transactions

The next step is to create keys for your account so that you can sign transactions that you want to authorize.

To create keys in your Chainweaver wallet:

1.  Click **Keys** in the Chainweaver navigation panel.

    You'll see that a public key has already been generated for your account.
    The secret key for this account is the information that can only be recovered using the 12-word recovery phrase.
    You can create additional public keys for signing transactions by clicking **Generate Key**.
    However, any additional public keys you generate are still associated with the same secret key and recovery phrase.
    For this tutorial, you can use the public key that was generated for you.

2.  Click **Add k: Account**.

    Under Balance (KDA), notice that the account displays **Does not exist**.
    In Kadena, keys are used to sign transactions but they don't hold funds to pay transaction fees.
    Keys must be linked to an authorization account—a guardian or guard—that holds funds and identifies who can sign transactions and transfer funds.

## Fund your account

Right now, you have an empty wallet.
The next step is to fund your account so you can pay transaction fees.
You can fund the account from a predefined development network account called `sender00`.
To simplify the process for this tutorial, you can use scripts located in the `getting-started` repository.

To fund your account:

1.  Open a terminal shell on your computer.

2.  Clone the `getting-started` repository by running the following command:

    ```shell
    git clone https://github.com/kadena-community/getting-started.git
    ```

3.  Change to the root of the `getting-started` repository by running the following command:

    ```shell
    cd getting-started
    ```

4.  Install dependencies by running the following command:

    ```shell
    npm install
    ```

5.  In Chainweaver, click **Accounts** in the navigation panel, then copy the account name for your account.

6.  Send tokens from the `sender00` account to the account name you copied by running a command similar to the following:

    ```shell
    npm run start -- fund --keys "<your-account-public-key>" --predicate "keys-all"
    ```

    In this command, specify the public key for the account you copied from Chainweaver for the `--keys` command-line option.
    If the account key you copied includes the `k:` prefix, remove the prefix from the command-line argument.
    The combination of the `keys` and `predicate` create a **keyset** that is used to safeguard your account.
    You'll learn more about keysets in other tutorials.

7.  Open the [Kadena Block Explorer](http://localhost:8080/explorer/) to search for the transaction using the account you copied from Chainweaver.

8.  In Chainweaver, click **Refresh** to update the account balance.

## Deploy a contract

Now that you have a funded account, you can use that account and public key to deploy a simple `hello world` smart contract—written in the Kadena programming language, Pact—on the development network.
You'll learn more about Pact in other tutorials, but for now, you can deploy a predefined smart contract that looks like this:

```pact
(namespace 'free)
(module hello-world GOVERNANCE
  (defcap GOVERNANCE () true)
  (defun say-hello(name:string)
    (format "Hello, {}! ~ from: ${publicKey}" [name])
  )
)
```

To deploy the smart contract:

1.  Verify you have Chainweaver open in the browser.

2.  Open a terminal shell on your computer.

3.  Change to the root of the `getting-started` repository, if necessary, by running the following command:

    ```shell
    cd getting-started
    ```

4.  Deploy the smart contract from the `getting-started` repository by running a command similar to the following:

    ```shell
    npm run start -- deploy --keys "<your-account-public-key>" --predicate "keys-all" --sign-manually
    ```

    In the next steps, you copy and paste information between the terminal and the Chainweaver application.
    The instructions for signing the transaction using Chainweaver in the browser are also displayed in the terminal.

5.  In Chainweaver, click **SigBuilder** in the navigation panel.

6.  Copy and paste the transaction information displayed in the terminal into the Signature Builder, then click **Review**.

7.  Verify that the hash matches the hash displayed in the terminal to ensure you're signing the transaction you expect to sign, then click **Details**.

8.  Scroll to locate the **Signers** section of the transaction and verify that your public key is listed, then click **Sign**.

9.  Copy the full Command JSON and paste it into the terminal, then click **Done** in Chainweaver to close the Signature Builder.

    After you enter the command in the terminal, you'll see that the terminal displays information about the transaction including a `requestKey`.
    You can copy this `requestKey` from the terminal to view information about the transaction in the [Kadena block explorer](http://localhost:8080/explorer).

To verify the "Hello, World!" contract deployment in the block explorer:

1.  Open the [Kadena block explorer](http://localhost:8080/explorer).

2.  Select **Request Key** as the information you want to search for.

    ![Select Request Key to search for your transaction](/assets/docs/hello-world-quickstart/request-key.png)

3.  Paste the `requestKey` from the terminal, then click **Search** to see transaction results similar to the following:

    ![Deployed smart contract](/assets/docs/hello-world-quickstart/tx-result.png)

## View the smart contract

After you deploy the `hello-world` smart contract, you can view and interact with it on the development network using Chainweaver.

To view the `hello-world` smart contract:

1.  In Chainweaver, click **Contracts** in the navigation panel.

    After you click Contracts, Chainweaver displays two working areas.
    The left side displays a sample contract in an editor that you can use to view and edit contract code and execute commands interactively.
    The right side provides controls that enable you to navigate between contracts, view contract details, and test operations for contracts you have deployed.

2.  On the right side of Contracts, click **Module Explorer**.

3.  Under Deployed Contracts, search for the `hello-world` contract.

4.  Click **View**  to display details about the smart contract.
    For example, you can see that this contract has one function—`say-hello`—defined.

## Execute a read-only command

On the left side of the Contracts tab, you can write commands you want to execute on the blockchain.
Most commands require you to pay a transaction fee because they change the state of the information stored in the blockchain.
However, you can also write commands that only **read** information from the blockchain.
Read-only commands don't require transaction fees.

To execute a command using the `hello-world` contract:

1.  In the left side under Contracts, remove the sample contract displayed, then type the following command:

    ```pact
    (free.hello-world.say-hello "World")
    ```

2.  Click **Deploy** to display the transaction details, then click **Next**.

3.  Review the signing information, but leave the Signing Key empty because you're executing a read-only command, then click **Next**.

    After you click Next, You'll see an error message that "A 'Gas Payer' has not been selected for this transaction. Are you sure this is correct?"
    You can ignore this message because you're executing a read-only command.

4.  Scroll to see the Raw Response:

    ![Deployed "Hello, World!" smart contract](/assets/docs/hello-world-quickstart/raw-response-hello.png)

## Write to the blockchain

You've actually already written to the blockchain by deploying your `hello-world` smart contract.
You changed the **state** of the blockchain from not having the `hello-world` contract to having the `hello-world` contract included in a specific block.
However, that state change transaction didn't take place from within the context of the smart contract itself.
No contract logic was executed in the transaction.

To illustrate how you can change the state of information stored on the blockchain using the logic in a smart contract, you first need to modify the code in the `hello-world` smart contract.
The modified version of the smart contract looks like this:

```pact
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

```pact
(defschema hello-world-schema
  @doc "The schema for hello world"

  text:string)
```

The updated contract also includes a function that allows you to write to the schema in the following lines:

```pact
(defun write-hello(name:string)
  (write hello-world-table name
    { "text": (say-hello name) }))
```

### Deploy the modified contract

After making these changes, you need to redeploy the modified contract.

To deploy the modified `hello-world` smart contract:

1.  Verify you have Chainweaver open in the browser.

2.  Open a terminal shell on your computer.

3.  Change to the root of the `getting-started` repository, if necessary, by running the following command:

    ```shell
    cd getting-started
    ```

4.  Deploy the updated smart contract from the `getting-started` repository by running a command similar to the following:

    ```shell
    npm run start -- deploy \
    --keys "<your-account-public-key>" \
    --predicate keys-all \
    --file ./src/pact/hello-world.pact
    --sign-manually
    ```

    If the account key includes the `k:` prefix, remove the prefix from the command-line argument.

    As you saw in the previous deployment, you'll copy and paste information between the terminal and the Chainweaver application.
    The instructions for signing the transaction using Chainweaver in the browser are also displayed in the terminal.

    *   Copy the command displayed in the terminal into the Signature Builder, then click **Review**.
    *   Verify the information displayed is correct, then click **Sign**.
    *   Copy the JSON from Signature Builder and paste it into the terminal.
    *   Copy the `requestKey` from the terminal.
    *   Open the Kadena block explorer, select Request Key, paste the `requestKey`  from the terminal, then click **Search**.

    For the updated `hello-world` contract, you'll see the transaction result is **TableCreated**.

### View the modified contract

After you deploy the updated  `hello-world` smart contract, you can view and interact with it using Chainweaver.

To view the `hello-world` smart contract:

1.  In Chainweaver, click **Contracts** in the navigation panel.

2.  Click **Module Explorer**.

3.  Under Deployed Contracts, search for the `hello-world` contract.

4.  Click **View**  and note that the new contract has two new functions—`say-hello` and `write-hello`.

    ![Updated "Hello, World!" smart contract](/assets/docs/hello-world-quickstart/updated-two-functions.png)

    The `say-hello` function reads from the table and the `write-hello` function writes to the table.

### Execute a write function

1.  Click **Contracts** in the Chainweaver navigation panel.

2.  In the editor, type the following code:

    ```pact
    (free.hello-world.write-hello "Everyone")
    ```

3.  Click **Deploy**.

4.  In the Configuration section of the Transaction Details:

    *   Under Destination, select Chain ID **0**.
    *   Under Transaction Sender, select account with the public key that matches the account that you funded.
        The account format uses a `k:` followed by the public key for your account.
    *   Use the default settings for the remaining fields.

5.  Click **Next**.

6.  Under Unrestricted Signing Keys, check the public key of your account, then click **Next**.

    After you click Next, the transaction Preview displays a notice that a Gas Payer has not been selected for the transaction.
    You can ignore this notice because you have set the unrestricted signer for this transaction to use your public key.

7.  Click **Submit**.

8.  Wait for the transaction result **Successful Server result: "Write succeeded"**, then click **Done**.

### Read from the table

Now that you have written to the table, you can read from the table.

**Note:** This function call is expensive because it isn't something you'd do in a typical transaction.

1.  In the editor, type the following code:

    ```pact
    (map (read free.hello-world.hello-world-table) (keys free.hello-world.hello-world-table))
    ```

2.  Click **Deploy**.

3.  Select the Chain ID **0** because the contract was deployed on Chain 0.

4.  Set the **Gas Limit Units** to `99999`.

5.  Click **Next** to display the transaction signing fields, then click **Next** again.

6.  Check the Raw Response and verify that you see the following:

    ![Updated "Hello, World!" smart contract](/assets/docs/hello-world-quickstart/hello-everyone.png)

## Reset the development network

If you want to run through this tutorial more than once, keep in mind that after you deploy a contract it remains on the network.
If you want to experiment with writing and deploying contracts, you should periodically reset the development network to a clean state to avoid errors.
To shut down the development network, you can run the following command:

```docker
docker stop devnet
```

To completely remove the development network from your local computer, you can run commands similar to the following:

```docker
docker stop <volume-container-identifier>
docker rm <volume-container-identifier>
docker volume rm kadena_devnet
```

## Next steps

In this tutorial, you learned a little about a lot of topics.
For example, you learned some basic terminology for building on the Kadena blockchain.
You also had some hands-on experience with the following tasks:

*   Setting up a local development network.
*   Creating a wallet account with a public and secret key.
*   Funding your account with coins from a predefined account application.
*   Deploying a simple smart contract.
*   Using Chainweaver and the Kadena block explorer to interact with the blockchain and view information about transactions.
*   Executing the write and read functions from a smart contract on the blockchain.

The most important next step from here is to start learning how to write your own smart contracts using the Pact programming language.
The following are the best resources for learning Pact:

*   [Get started with Pact](/build/pact).
*   [Set up a local development network](/build/pact/dev-network)
*   [Real World Pact](https://github.com/thomashoneyman/real-world-pact#real-world-pact) tutorial series by Thomas Honeyman.