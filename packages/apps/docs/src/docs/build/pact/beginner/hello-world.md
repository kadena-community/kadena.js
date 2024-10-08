---
title: Hello World
description: Kadena makes blockchain work for everyone.
menu: Hello World
label: Hello World
order: 2
layout: full
tags:
  [
    'pact',
    'hello world',
    'tutorials',
    'hello world tutorial',
    'pact hello world',
    'smart contract deployment',
  ]
---

# Hello, World! revisited

In the [Quick start](/build/quickstart), you were introduced to a simple `hello-world` module. 
As previously noted in [Get started with Pact](/build/pact), modules provide the basic foundation for all Pact smart contracts:

A module defines the logic of a smart contract. The module contains the functions, pact definitions, tables, and schemas required to describe the business logic for the contract. |

In fact, the term `module` is a reserved keyword that you use to define and install a module with a specified _name_, 

The `hello-world` module defined a single function—one very much like the traditional Hello, World! program you see when learning any new programming language.

In this tutorial, you'll take a closer look at the `hello-world` module, extend its functionality, and deploy it on the Kadena test network.

## Before you begin

Before starting this project, verify your environment meets the following basic requirements:

- You have a GitHub account and can run `git` commands.
- You have installed the Pact programming language and command-line interpreter.
- You have installed the `kadena-cli` package and have a working directory with initial configuration settings.
- You have a local development node that you can connect to that runs the `chainweb-node` program, either in a Docker container or on a physical or virtual computer.

If you have these basics covered, you're ready to go.

## Get the starter code

To get started:

1. Open a terminal shell on your computer.

2. Clone the `pact-coding-projects` repository by running the following command:
   
   ```bash
   git@github.com:kadena-docs/pact-coding-projects.git
   ```

3. Change to the `00-hello-world` directory by running the following command:
   
   ```bash
   cd pact-coding-projects/00-hello-world
   ```

4. Open the `hello-world.pact` file in your code editor.
   
   ```pact
   ;;
   ;; "Hello, world!" module
   ;; 
   ;;-----------------------------------------------------------------------
   ;;
   ;;  Use semicolons (;) for comments in smart contracts.
   ;;  By convention, use:
   ;;  
   ;;  - A single semicolon (;) for short notes on a single line of code. 
   ;;  - Two semicolons (;;) to describe functions or other top-level forms.
   ;;  - Three semicolons (;;;) to separate larger sections of code.
   ;;
   ;;-----------------------------------------------------------------------
   
   (module helloWorld GOVERNANCE
       "You can also embed comments in smart contracts by using quoted strings."
   
       (defcap GOVERNANCE () true)
         (defun say-hello(name:string)
           (format "Hello, {}! ~ from Kadena" [name])
       )
   )
   ```

   A few things you should note about this starter code:
   
   - The `module` being defined is named `helloWorld`.
   - Every module is governed by either a _keyset_ or a _capability_. 
     In this example, the GOVERNANCE capability is used to control access to the module.
     This capability must evaluate to true to grant access.
   - The  `defun` reserved keyword signals the start of a function definition.
     In this example, the function being defined is named `say-hello` and the function takes one variable, `name`, with a data type of `string`. 
   - The `say-hello` function uses the built-in `format` function that allows you to format messages using a placeholder and a variable or a specified value.
     The curly braces (`{}`) indicate the location of the value to be inserted and the [name] is the variable to be inserted in place of the curly braces (`{}`).
   
   To learn more, see the following topics:
   
   - [Syntax and keywords](/reference/syntax)
   - [General built-in functions](/reference/functions/general#formath-1268779017)

## Load and test the module

The Pact command-line interpreter provides a read-evaluate-print-loop (REPL) for interactive testing of Pact commands and for executing tests defined in files.

To load and test the `helloWorld` module interactively:

1. Add a call to the `say-hello` function at the bottom of the `hello-world.pact` file in your code editor.
   
   ```pact
   ;;
   ;; "Hello, world!" module
   ;; 
   ;;-----------------------------------------------------------------------
   ;;
   ;;  Use semicolons (;) for comments in smart contracts.
   ;;  By convention, use:
   ;;  
   ;;  - A single semicolon (;) for short notes on a single line of code. 
   ;;  - Two semicolons (;;) to describe functions or other top-level forms.
   ;;  - Three semicolons (;;;) to separate larger sections of code.
   ;;
   ;;-----------------------------------------------------------------------
   
   (module helloWorld GOVERNANCE
       "You can also embed comments in smart contracts by using quoted strings."
   
       (defcap GOVERNANCE () true)
         (defun say-hello(name:string)
           (format "Hello, {}! ~ from Kadena" [name])
       )
   )

   (say-hello "Pistolas") 
   ```

2. Open a terminal shell on your computer.

3. Start the Pact interpreter by running the following command:

   ```bash
   pact
   ```
   
   After running this command, the terminal displays the `pact >` prompt:

   ```pact
   pact >
   ```

4. Copy and paste the `helloWorld` module code into the terminal with the `pact >` prompt, then press Return on the keyboard to load the module.
   
   You should see that the module loads and the call to the `say-hello` function is executed with output similar to the following:

   ```pact
   "Loaded module helloWorld, hash fsYJQuzCtzdocWkgjS9yXFz6WAJlV0Aor1RmWhyfgc0"
   pact> 
   pact> (say-hello "Pistolas")
   "Hello, Pistolas! ~ from Kadena"
   ```

1. Exit the Pact interpreter by pressing control-d on the keyboard.

## Create a hello-world.repl file

The Pact REPL environment accepts many built-in functions that are specifically for testing and debugging your Pact code.
You can use these built-in functions in files that are similar to `.pact` files, like the `hello-world.pact` file you've been working with so far.
However, the files you create for testing Pact functionality use the `.repl` file extension.

To create a basic `hello-world.repl` file:

1. Create a new file named `hello-world.repl` file in your code editor.
   
1. Use the built-in `(begin-tx)` and `(commit-tx)` functions to define a transaction that loads the `hello-world.pact` file:

   ```pact
   (begin-tx)
     (load "hello-world.pact")
   (commit-tx)
   ```

2. Open a terminal shell and execute the `hello-world.repl` file by running the following command:
   
   ```pact
   pact --trace hello-world.repl
   ```
   
   Notice that you are executing the file in a terminal shell and not in the Pact command-line interpreter.
   This command executes the functions defined in the `hello-world.repl` file and displays output in the terminal similar to the following:

   ```bash
   hello-world.repl:1:0:Trace: Begin Tx 0
   hello-world.repl:2:0:Trace: Loading hello-world.pact...
   hello-world.pact:15:0:Trace: Loaded module helloWorld, hash Nci-2EJkgvvHnVLyfOJG-WKGuQ6-tLAYWRYVGPGW2cc
   hello-world.pact:24:0:Trace: Hello, Pistolas! ~ from Kadena
   hello-world.repl:3:0:Trace: Commit Tx 0
   Load successful
   ```

   To learn more, see the following topics:
   
   - [Testing Pact programs](/build/pact/test-in-the-sdk)
   - [REPL-only functions](/reference/functions/repl-only-functions)

## Modify the module to store names

One way to make the `helloWorld` module a more interesting sample project is to enable the contract to store greetings in a table.

To modify the `helloWorld` module:

1. Copy the `hello-world.pact` file to create a new file named `2-hello-world.pact` file in your code editor.

1. Modify the module code to create a schema and table for storing greeting recipient values and add functions to write and read the value from the table.
   
   For example:

   ```pact
   ;;
   ;; Modified "Hello, world!" module
   ;; 
   ;;-----------------------------------------------------------------------
   ;;
   ;;  Use semicolons (;) for comments in smart contracts.
   ;;  By convention, use:
   ;;  
   ;;  - A single semicolon (;) for short notes on a single line of code. 
   ;;  - Two semicolons (;;) to describe functions or other top-level forms.
   ;;  - Three semicolons (;;;) to separate larger sections of code.
   ;;
   ;;  In this example, the module defines a table for storing greeting
   ;;  names and two functions:
   ;; 
   ;;  - (say-hello-to "name")
   ;;  - (greet)
   ;;
   ;;-----------------------------------------------------------------------
   
   (module helloWorld-mod GOVERNANCE
     @doc "Update the hello-world project to store names."
     
     (defcap GOVERNANCE () true)
     
     (defschema hello-schema
       @doc "Add a schema to store the 'name' variable for the greeting recipient."
       name:string)
   
     (deftable names:{hello-schema})
   
     (defun say-hello-to (name)
       @doc "Store 'name' to say hello with."
       (write names "name" { 'name: name }))
   
     (defun greet ()
       @doc "Say hello using the stored 'name' from the hellos table."
       (with-read names "name" { "name" := name }
         (format "Hello, {}!" [name])))
   )
   
   (create-table names)
   
   (say-hello-to "world") ; store greeting recipient "world" in the names table
   (greet)                ; say hello!
   ```

1. Create a new file named `2-hello-world.repl` file in your code editor.

1. Use the built-in `(begin-tx)` and `(commit-tx)` functions to define a transaction that executes the `2-hello-world.pact` module:

   ```pact
   (begin-tx)
     (load "2-hello-world.pact")
   (commit-tx)
   (begin-tx)
     (helloWorld-mod.say-hello-to "Las Pistolas")
     (helloWorld-mod.greet)
   (commit-tx)
   ```

2. Open a terminal shell and execute the `2-hello-world.repl` file by running the following command:
   
   ```pact
   pact --trace 2-hello-world.repl
   ```

   ```bash
   2-hello-world.repl:1:0:Trace: Begin Tx 0
   2-hello-world.repl:2:0:Trace: Loading 2-hello-world.pact...
   2-hello-world.pact:15:0:Trace: Loaded module helloWorld-mod, hash ZcpdtgW86UIwvw_TjlgNreTErM2ECGEjh1m9nLu3AwA
   2-hello-world.pact:36:0:Trace: TableCreated
   2-hello-world.pact:38:0:Trace: Write succeeded
   2-hello-world.pact:39:0:Trace: Hello, world!
   2-hello-world.repl:3:0:Trace: Commit Tx 0
   2-hello-world.repl:4:0:Trace: Begin Tx 1
   2-hello-world.repl:5:0:Trace: Write succeeded
   2-hello-world.repl:6:0:Trace: Hello, Las Pistolas!
   2-hello-world.repl:7:0:Trace: Commit Tx 1
   Load successful
   ```

## Deploy the contract

After testing the contract using the Pact interpreter and the REPL file, you can deploy the contract on your development network or the Kadena test network.
If you wanted to deploy this contract on the Kadena test network or a production network, you would first need to identify a _namespace_ for deploying the contract and ensure that the module name is unique across all of the modules that exist in that namespace.

For simplicity, you can deploy this project locally on your development network without selecting a namespace or updating the module name.
However, even on the local development network, you must have an account with funds and a key to sign the transaction that deploys the contract.

You can use `kadena account` commands to configure and fund accounts for the local development network.
You can also use `kadena tx` commands to create transactions to deploy contracts.
However, one of the simplest ways to generate keys, manage accounts, and deploy contracts is by using the Chainweaver desktop or web-based application and its integrated development environment. 
To complete the 00-hello-world project, you can use Chainweaver to deploy the hello-world contract on the Kadena test network.

To deploy the contract on the Kadena test network using Chainweaver:

1. Open the contract you want to deploy in your code editor.
   
   For example, open the `2-hello-world.pact` file in your code editor.

2. Add the `free` namespace before the module definition in the file and update the module name to be unique.

   For example:

   ```pact
   (namespace "free")
   (module helloWorld-mod-pistolas GOVERNANCE
     ...
   )
   ```

3. Save the changes in the code editor.

4. Open Chainweaver and select the **testnet** network.

5. Click **Accounts** in the Chainweaver navigation pane and verify that you have at least one account with funds on at least one chain in the test network. 
   
   For example:

   ![You must have an account with funds on a chain to continue](/assets/docs/deploy-testnet-account.png)

   If you don't have keys and at least one account on any chain on the test network,you need to generate keys, create an account, and fund the account on at least one chain before continuing.

6. Click **Contracts** in the Chainweaver navigation pane, then click **Open File** to select the contract you want to deploy.

7. Click **Deploy** to display the Configuration tab:
   
   - Select the **Chain identifier** for the chain where you want to deploy the contract.
   - Select a **Transaction Sender**.
   - Click **Next**.

8. On the Sign tab, select an **Unrestricted Signing Key**, then click **Next**.

9. On the Preview tab, scroll to see the Raw Response is "Hello, world!", then click **Submit**.

   After you click Submit, the transaction is sent to the blockchain. 
   You can use the block explorer and the transaction request key to view the transaction results or wait for the transaction to be included in a block before closing the transaction submission dialog by clicking **Done**.
   When the transaction is mined into a block, you will have deployed your Hello World smart contract on the Kadena test network.

## Call the deployed contract

After you deploy a contract, you can view its details and call its functions using Chainweaver.

To view and call your contract:

1. Click **Contracts** in the Chainweaver navigation pane, if necessary, then click **Module Explorer**.
2. Under Deployed Contracts, search for your module name in the **free** namespace and chain where you deployed, then click **Refresh** to update the list of deployed contracts to display only your just-deployed contract.
   
   In this example, the unique module name is **free.helloWorld-mod-pistolas** and the contract was deployed on the testnet chain **1**. 
   
   ![Search for and view your deployed contract](/assets/docs/deploy-view-testnet.png)

3. Click **View** to display the functions and capabilities defined in your contract.

4. Click **Call** to call the contract functions.
  
   - Click **Call** for the **hello** function to specify a new string in quotes, then click **Next**.
   - Click **Next**, select an **Unrestricted Signing Key** for this call, then click **Next**.
   - Click **Submit** to submit the transaction and commit the change.
  
   After the transaction is included in a block:

   - Click **Call** for the **greet** function, then click **Next**.
   - Select an **Unrestricted Signing Key** for this call, then click **Next**.
   - Scroll to see the **Raw Response** uses the string you specified for the **hello** function.
   - Click **Submit** if you want to submit the transaction to the blockchain or close the function call without submitting the transaction.

     ![Call the greet function](/assets/docs/deploy-greet.jpg)