---
title: "Define a namespace"
description: "Learn how to define a unique namespace for your smart contracts, keysets, and Pact modules."
menu: "Workshop: Election application"
label: "Define a namespace"
order: 4
layout: full
tags: [namespace, pact, smart contract, typescript, tutorial]
---

# Define a namespace

In the Kadena ecosystem, a **namespace** is conceptually similar to a domain name except that the name is a static prefix that establishes a private boundary for the contracts and keyset definitions you control. 

When you are building, testing, and deploying smart contracts on your local development network, you don't need to define a namespace.
Your work is isolated from others because your blockchain—and any smart contracts you deploy—run exclusively on your local computer.

However, if you want to deploy a smart contract on the Kadena test network or another public blockchain, the contract must have a unique name that distinguishes your Pact module from all the others.
If you try to deploy a Pact module with a name that's already being used on the network where you are trying to deploy, the deployment will fail with an error and you'll pay a transaction fee for the failed attempt. 

To prevent name collisions on the same network, Kadena allows you to define your own unique namespace on the blockchain.
The namespace segregates your work—your smart contracts, keyset definitions, and Pact modules—from applications and modules created and deployed by others.
Within your namespace, you can define whatever keysets and modules you need and control who can update the namespace with changes. 
As long as you choose a unique name for your namespace, everything you define inside of that namespace is automatically unique, too.

In this tutorial, you'll learn how to define a namespace for the election application and how to use that namespace in the remaining tutorials.
If you want to learn more about namespaces and how they are used before continuing, see [An Introductory Guide to Kadena Namespaces](/blogchain/2023/an-introductory-guide-to-kadena-namespaces-2023-01-11).

## Before you begin

Before you start this tutorial, verify the following basic requirements:

- You have an internet connection and a web browser installed on your local computer.
- You have a code editor, such as [Visual Studio Code](https://code.visualstudio.com/download), access to an interactive terminal shell, and are generally familiar with using command-line programs.
- You have cloned the [election-dapp](https://github.com/kadena-community/voting-dapp.git) repository as described in [Prepare your workspace](/build/election/prepare-your-workspace).
- You have the development network running in a Docker container as described in [Start a local blockchain](/build/election/start-a-local-blockchain).
- You are [connected to the development network](/build/election/start-a-local-blockchain#connect-to-the-development-network) using your local host IP address and port number 8080.
- You have created and funded an administrative account as described in [Add an administrator account](/build/election/add-admin-account).

## Write a transaction in Pact

In this tutorial, you'll write and execute some code using the Pact smart contract programming language and the Pact read–eval–print-loop (REPL) interactive shell program. 

To write a simple transaction in Pact:

1. Open the `election-dapp/pact` folder in the code editor on your computer.

2. Create a new file named `namespace.repl` in the `pact` folder. 

3. Write an empty transaction by typing the following lines of code in the `namespace.repl` file:
   
   ```pact
   (begin-tx
     "Define a namespace called 'election"
   )
   (commit-tx)
   ```

4. Save your changes.

5. Change to the `pact` folder in a terminal within your code editor.

6. Execute the transaction using the `pact` command-line program.

   If `pact-cli` is installed locally, run the following command inside the `pact` folder in the terminal shell:
   
   ```bash
   pact namespace.repl -t
   ```
   
   After you execute the file, you should see the following output:

   ```bash
   namespace.repl:1:0:Trace: Begin Tx 0: Define a namespace called 'election
   namespace.repl:4:0:Trace: Commit Tx 0: Define a namespace called 'election
   Load successful
   ```

   If you don't have `pact` installed locally, you can open the [pact-cli](http://localhost:8080/ttyd/pact-cli/) from the Docker container.
   However, to use the `pact-cli` in the development network, you must mount the `pact` folder in the container.
   To mount the `pact` folder, start the development network with the following command:
   
   ```docker
   docker run --interactive --tty --publish 8080:8080 \
    --volume ./pact:/pact-cli:ro kadena/devnet:latest
   ```
   
   After you start the development network with the `pact` folder mounted, you can load the `namespace.repl` file with the following command:

   ```pact
   (load "namespace.repl")
   ```

   If you are using `pact-cli` in a browser, you can replace the `pact namespace.repl -t` command with `(load "namespace.repl")` throughout this tutorial.

## Use Pact built-in functions

Pact has two built-in functions to define and work inside of a namespace: `define-namespace` and `namespace`. 
To define a namespace, you must specify a **user keyset** and an **admin keyset**.
These two keysets control who can access the namespace and what they can do.
- The user keyset controls who can use the modules and contracts deployed to the namespace.
- The admin keyset controls who owns the namespace and can upload or modify what the namespace contains.

### Arguments for the define-namespace function

For this tutorial, you're going to call the `define-namespace` function inside the transaction you created in the `namespace.repl` file.
For this function call, you must provide the following information as arguments:

- The name of the namespace.
- The keyset that defines who can use the namespace.
- The keyset that defines who owns the namespace and governs what it contains. 

### Arguments for the expect function

The `define-namespace` function is wrapped by the `expect` function to test that calling `define-namespace` will succeed.
The `expect` function takes three arguments:

- The title of the test.
- The expected output of the `define-namespace` function.
- The `define-namespace` function call.

### Define the election namespace

To define the election application namespace with the `define-namespace` function:

1. Open the `election-dapp/pact/namespace.repl` file in the code editor on your computer.

2. Add the following lines of code between the `begin-tx` and `commit-tx` lines:

   ```pact
   (expect
     "Test whether a namespace can be defined"
     "Namespace defined: election"
     (define-namespace 'election (read-keyset 'user-keyset) (read-keyset 'admin-keyset))
   )
   ```

3. Execute the transaction using the `pact` command-line program by running the following command in the current terminal shell:
   
   ```bash
   pact namespace.repl -t
   ```

   You'll see that this transaction fails with output similar to the following:
   
   ```bash
   namespace.repl:1:0:Trace: Begin Tx 0: Define a namespace called 'election
   namespace.repl:4:0:Trace: FAILURE: Test whether a namespace can be defined: evaluation of actual failed:namespace.repl:7:32: No such key in message: user-keyset
   namespace.repl:9:0:Trace: Commit Tx 0: Define a namespace called 'election
   namespace.repl:4:0:ExecError: FAILURE: Test whether a namespace can be defined: evaluation of actual failed:namespace.repl:7:32: No such key in message: user-keyset
   Load failed
   ```
   
   For the transaction to succeed, you must first load the `user-keyset` and `admin-keyset` into the context of the Pact REPL so they can be read using the `read-keyset` function within the `define-namespace` function.

4. Add the following lines at the top of the `namespace.repl` file:

   ```pact
   (env-data
    { 'user-keyset :
      { 'keys : [ 'user-public-key ]
      , 'pred : 'keys-all
      }
    , 'admin-keyset :
      { 'keys : [ 'admin-public-key ]
      , 'pred : 'keys-all
      }
    }
   )
   ```

5. Execute the transaction using the `pact` command-line program:
   
   ```bash
   pact namespace.repl -t
   ```

   You'll see that this transaction succeeds with output similar to the following:
   
   ```bash
   namespace.repl:1:0:Trace: Setting transaction data
   namespace.repl:12:0:Trace: Begin Tx 0: Define a namespace called 'election
   namespace.repl:15:0:Trace: Expect: success: Test whether a namespace can be defined
   namespace.repl:20:0:Trace: Commit Tx 0: Define a namespace called 'election
   Load successful
   ```
   
   You now have a namespace called `election` defined in the Pact REPL.

## Modify the namespace

After you define a namespace, only the `admin-keyset`—the namespace owner—can update the namespace. 
You can test this behavior by creating a new transaction to modify the namespace with an instruction to allow the `user-keyset` to govern the namespace and limit the `admin-keyset` to only use the namespace. 

To test modifying the election application namespace:

1. Open the `election-dapp/pact/namespace.repl` file in the code editor on your computer.

2. Add the following lines of code as a second transaction at the bottom of the `namespace.repl` file:
   
   ```pact
   (begin-tx
     "Update the 'election' namespace"
   )
   (expect
     "An admin can modify the namespace to change the keyset governing the namespace"
     "Namespace defined: election"
     (define-namespace 'election (read-keyset 'admin-keyset) (read-keyset 'user-keyset))
   )
   (commit-tx)
   ```

3. Execute the transaction using the `pact` command-line program:
   
   ```bash
   pact namespace.repl -t
   ```

   You'll see that this transaction fails with a message containing `Keyset failure` because only the `admin-keyset` is allowed to update the namespace and the transaction isn't signed by the `admin-keyset`.

4. Sign the transaction with the `admin-keyset` by loading it into the context of the Pact REPL right before the last transaction with the following lines of code:

   ```pact
   (env-sigs
     [{ 'key  : 'admin-public-key
      , 'caps : []
     }]
   )
   ```

5. Execute the transaction using the `pact` command-line program:
   
   ```bash
   pact namespace.repl -t
   ```
   
   You'll see that the update transaction succeeds with output similar to the following:
   
   ```bash
   namespace.repl:1:0:Trace: Setting transaction data
   namespace.repl:12:0:Trace: Begin Tx 0: Define a namespace called 'election
   namespace.repl:15:0:Trace: Expect: success: Test whether a namespace can be defined
   namespace.repl:20:0:Trace: Commit Tx 0: Define a namespace called 'election
   namespace.repl:21:0:Trace: Setting transaction signatures/caps
   namespace.repl:26:0:Trace: Begin Tx 1: Update the 'election' namespace
   namespace.repl:29:0:Trace: Expect: success: An admin can modify the namespace to change the keyset governing the namespace
   namespace.repl:34:0:Trace: Commit Tx 1: Update the 'election' namespace
   Load successful
   ```

   After this second transaction is successful, the `admin-keyset` no longer
   governs the `election` namespace.

### Verify the admin-keyset doesn't govern the namespace

Now that you have successfully modified the `election` namespace, you can no longer use the `admin-keyset` to sign transactions that modify the namespace.
You can confirm this behavior by adding another transaction that attempts to redefine the namespace with the same permissions that you used when you initially created the namespace.

This transaction is expected to fail because it's signed using the `admin-keyset` and that keyset no longer governs the namespace after the previous transaction. 
Therefore, for this example, you can wrap the `define-namespace` function inside an `expect-failure` function to assert that redefining the namespace is expected to fail. 

To verify that redefining the election application namespace fails:

1. Open the `election-dapp/pact/namespace.repl` file in the code editor on your computer.

2. Add the following lines of code as a third transaction at the bottom of the `namespace.repl` file:
   
   ```pact
   (begin-tx
      "Try to update the 'election' namespace with the wrong permissions"
   )
   (expect-failure
     "The previous admin can no longer update the namespace"
     "Keyset failure (keys-all)"
     (define-namespace 'election (read-keyset 'user-keyset) (read-keyset 'admin-keyset))
   )
   (commit-tx)
   ```

3. Execute the transaction using the `pact` command-line program:
   
   ```bash
   pact namespace.repl -t
   ```

   You'll see that the redefining the namespace fails—as expected—with output similar to the following:
   
   ```bash
   namespace.repl:36:0:Trace: Begin Tx 2: Try to update the 'election' namespace with the wrong permissions
   namespace.repl:39:0:Trace: Expect failure: success: The previous admin can no longer update the namespace
   namespace.repl:44:0:Trace: Commit Tx 2: Try to update the 'election' namespace with the wrong permissions
   Load successful
   ```

### Verify the user-keyset governs the namespace

To verify that the `user-keyset` can now redefine the namespace, you can load the signature of the `user-keyset` into the context of the Pact REPL and write a transaction to redefine the namespace. 

To verify that redefining the election application namespace succeeds:

1. Open the `election-dapp/pact/namespace.repl` file in the code editor on your computer.

2. Add the following lines of code as a fourth transaction at the bottom of the `namespace.repl` file:
   
   ```pact
   (env-sigs
     [{ 'key  : 'user-public-key
      , 'caps : []
     }]
   )
   (begin-tx
     "Redefine a namespace called 'election as the new admin"
   )
   (expect
     "The new admin can update the namespace"
     "Namespace defined: election"
     (define-namespace 'election (read-keyset 'user-keyset) (read-keyset 'admin-keyset))
   )
   (commit-tx)
   ```

3. Execute the transaction using the `pact` command-line program:
   
   ```bash
   pact namespace.repl -t
   ```

   You'll see that the transaction succeeds with output similar to the following:
   
   ```bash
   namespace.repl:50:0:Trace: Begin Tx 3: Redefine a namespace called 'election as the new admin
   namespace.repl:53:0:Trace: Expect: success: The new admin can update the namespace
   namespace.repl:58:0:Trace: Commit Tx 3: Redefine a namespace called 'election as the new admin
   Load successful
   ```

## Create a principal namespace in the Pact REPL

So far, you've seen how to define and manage a namespace, but the function you used in the previous examples doesn't guarantee that your namespace would have a unique name that isn't being used by anyone else.
To ensure your namespace has a unique name, Kadena provides a built-in `ns` module on the main, test, and development networks.

When you use the  `ns` module, you can create a uniquely-named **principal namespace** on any Kadena network. 
The  `ns` module includes a `create-principal-namespace` function specifically for this purpose.
The `create-principal-namespace` function enables you to create a namespace using the prefix `n_` followed by the hash of a keyset. 
This naming convention ensures that your principal namespace won't conflict with any other namespaces defined in the same network.

This example demonstrates creating a principal namespace using an `admin-keyset` that contains the public key of the `sender00` account because the `ns.create-principal-namespace` function only accepts valid public keys inside the keyset.
The steps are similar to what you've done before.

To create a principal namespace:

1. Open the `election-dapp/pact` folder in the code editor on your computer.

3. Create a new file named `principal-namespace.repl` in the `pact` folder.

4. Load the `admin-keyset` with the public key of the `sender00` account into the context of the Pact REPL by adding the following lines at the top of the `principal-namespace.repl` file:
   
   ```pact
   (env-data
     { 'admin-keyset :
       { 'keys : [ "368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca" ]
       , 'pred : 'keys-all
       }
     }
   )
   ```

5. Load the `ns` module from the local filesystem to make it available in the Pact REPL by adding the following lines of code to the `principal-namespace.repl`:
    
   ```pact
   (begin-tx)
     (load "root/ns.pact")
   (commit-tx)
   ```
   
   Loading the `ns` module from the local `./pact/root` folder of the project is only required for testing in the Pact REPL.

1. Add a transaction to create the principal namespace by typing the following lines of code in the `principal-namespace.repl` file:
   
   ```pact
   (begin-tx
     "Define a principal namespace"
   )
   (expect
     "A principal namespace can be created"
     "Namespace defined: n_560eefcee4a090a24f12d7cf68cd48f11d8d2bd9"
     (let ((ns-name (ns.create-principal-namespace (read-keyset 'admin-keyset))))
       (define-namespace ns-name (read-keyset 'admin-keyset ) (read-keyset 'admin-keyset ))
     )
   )
   (commit-tx)
   ```

   In this code:
   
   - The `admin-keyset` calls the `ns.create-principal-namespace` function.
   - The output of the `ns.create-principal-namespace` function is stored in the `ns-name` variable.
   - The `define-namespace` function takes the output stored in  `ns-name` variable as its first argument to create the unique name for the namespace. 
   
   The code is similar to the code you wrote in the `namespace.repl` file except that you're using the `ns` module and passing the `ns-name` variable instead of using a hardcoded  `election` string. 

2. Execute the transaction using the `pact` command-line program:
   
   ```bash
   pact principal-namespace.repl -t
   ```

   You'll see that the transaction succeeds with output similar to the following:
   
   ```bash
   principal-namespace.repl:1:0:Trace: Setting transaction data
   principal-namespace.repl:9:0:Trace: Begin Tx 0
   principal-namespace.repl:10:3:Trace: Loading root/ns.pact...
   root/ns.pact:1:0:Trace: Loaded module ns, hash jXT9VNDw_Wn0wsWQcLCejEQfAdpyA_GUjeINHG9Z3aU
   principal-namespace.repl:11:0:Trace: Commit Tx 0
   principal-namespace.repl:13:0:Trace: Begin Tx 1: Define a principal namespace
   principal-namespace.repl:16:0:Trace: Expect: success: A principal namespace can be created
   principal-namespace.repl:23:0:Trace: Commit Tx 1: Define a principal namespace
   Load successful
   ```

In this example, you defined a principal namespace in the Pact REPL using the public key for the `sender00` test account. 
Next, you can define a principal namespace on the development network using the administrative account you created in [Add an administrator account](/build/election/add-admin-account).

## Create your own principal namespace

Now that you've seen how to use the `define-namespace` and `create-principal-namespace` functions, you're ready to create your own principal namespace on your local development network with the administrative account you created using Chainweaver.

To create your principal namespace on the development network:

1. Verify the development network is currently running on your local computer.

2. Open and unlock the Chainweaver desktop or web application and verify that:
   
   - You're connected to **development network (devnet)** from the network list.
   - Your administrative account name with the **k:** prefix exists on chain 1.
   - Your administrative account name is funded with KDA on chain 1. 
   
   ![Verify your administrative account in Chainweaver](/assets/docs/election-workshop/funded-account.png)
   
   You're going to use Chainweaver to sign the transaction that creates the principal namespace. 

3. Open the `election-dapp/snippets/principal-namespace.ts` file in your code editor. 

   The `pactCommand` variable in this file contains the same Pact code for defining a principal namespace that you tested in the Pact REPL.

   ```typescript
   async function main(account: string) {
     const pactCommand = `
       (let ((ns-name (ns.create-principal-namespace (read-keyset 'admin-keyset))))
         (define-namespace ns-name (read-keyset 'admin-keyset ) (read-keyset 'admin-keyset ))
       )
     `;
   ```
   
   The next lines in the file add the keyset data with slightly different syntax and a transaction signer:

   ```typescript
   const transaction = Pact.builder
       .execution(pactCommand)
       .addData('admin-keyset', {
         keys: [accountKey(account)],
         pred: 'keys-all',
       })
       .addSigner(accountKey(account))
       .setMeta({ chainId: getChainId(), senderAccount: account })
       .setNetworkId(getNetworkId())
       .createTransaction();
    ```
    
    The signing code wasn't required to execute the transaction in the Pact REPL, but you need this code to execute the transaction on the development network. 
    After the transaction is defined, Chainweaver signs the transaction so it can be executed:

    ```typescript
      const signedTx = await signWithChainweaver(transaction);
    ```
    
    In the remaining lines of code, the Kadena client processes the response it receives from your local development network.

1. Open the `election-dapp/snippets` folder in a terminal shell on your computer.

2. Create your principal namespace using the `create-namespace` script by running a command similar to the following with your administrative account name:

   ```bash
   npm run create-namespace:devnet -- k:<your-public-key>
   ```
   
   Remember that `k:<your-public-key>` is the default **account name** for your administrative account that you funded in [Add an administrator account](/build/election/add-admin-account).
   You can copy this account name from Chainweaver when viewing the account watch list.

   ![Sample QuickSign request](/assets/docs/election-workshop/quicksign-request.png)

   If you don't see the request automatically, select Chainweaver to bring it to the foreground. 

6. Click **Sign All** to sign the request.

   After you click Sign All, the transaction is executed and the results are displayed in your terminal shell.
   For example, you should see output similar to the following:

   ```bash
   {
     status: 'success',
     data: 'Namespace defined: n_14912521e87a6d387157d526b281bde8422371d1'
   }
   ```

You now have a unique **principal namespace** that you can use in your local development network and that you can govern using your administrative account.

## Next steps

In this tutorial, you learned how to:

- Define and update a **namespace** for the election application in the Pact REPL.
- Specify the **keysets** that are allowed to use and govern the namespace.
- Write simple transactions to test the keyset used to govern and modify the namespace.
- Modify the keyset with permission to govern the namespace.
- Create and test a **principal namespace** locally before defining a namespace on the network.
- Create a principal namespace on the local development network that is governed by your administrative account.

The work you completed in this tutorial sets the groundwork for the next tutorial.
In the next tutorial, you'll learn how to define a keyset inside your principal namespace and how the keyset you define is used to guard who can modify your election application smart contract.

To see the code for the activity you completed in this tutorial and get the starter code for the next tutorial, check out the `05-keysets` branch from the `election-dapp` repository by running the following command in your terminal shell:

```bash
git checkout 05-keysets
```