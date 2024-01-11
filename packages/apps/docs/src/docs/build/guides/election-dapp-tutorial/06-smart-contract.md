---
title: 'Write the smart contract'
description:
  'Use the Pact smart contract language to build the scaffolding for the election application smart contract backend.'
menu: "Workshop: Build an Election application"
label: 'Write a smart contract'
order: 6
layout: full
tags: [pact, smart contract, typescript, tutorial]
---

# Write a smart contract

Now that you have a unique namespace controlled by your administrative keyset, you're ready to start building the backend for the election application.
In this tutorial, you'll learn the basics of how to write a **smart contract** that can be deployed on the blockchain as the backend code for the election application.

A smart contract is a special type of application runs automatically when the conditions specified in the contract logic are met. 
By deploying a smart contract on a blockchain, the terms of an agreement can be executed programmatically in a decentralized way, without any intermediary involvement or process delays.

On the Kadena blockchain, a smart contract consists of one or more **modules** written in the Pact programming language. 
For this tutorial, the election smart contract consists of two modules: the main **election** module and an auxiliary **gas station** module. 

The exercises in this tutorial illustrate the basics of building and deploying a Pact module as you develop the main election module. 
At the completion of this tutorial, you'll deploy the core logic of the election module on your local development network.

## Before you begin

Before you start this tutorial, verify the following basic requirements:

- You have an internet connection and a web browser installed on your local computer.
- You have a code editor, such as [Visual Studio Code](https://code.visualstudio.com/download), access to an interactive terminal shell, and are generally familiar with using command-line programs.
- You have cloned the [election-dapp](https://github.com/kadena-community/voting-dapp.git election-dapp) repository as described in [Prepare your workspace](/build/guides/election-dapp-tutorial/01-getting-started) and have checked out the `01-getting-started` branch.
- You have the development network running in a Docker container as described in [Start a local blockchain](/build/guides/election-dapp-tutorial/02-running-devnet).
- You are [connected to the development network](/build/guides/election-dapp-tutorial/02-running-devnet#connect-to-the-development-network) using your local host IP address and port number 8080.
- You have created and funded an administrative account as described in [Add an administrator account](/build/guides/election-dapp-tutorial/03-admin-account).
- You have created a principal namespace on the development network as described in [Define a namespace](/build/guides/election-dapp-tutorial/04-namespaces).
- You have defined the keyset that controls your namespace using the administrative account as described in [Define keysets](/build/guides/election-dapp-tutorial/05-keysets). 

## Define a minimal Pact module

To get started writing Pact modules, you must have a file that contains the bare minimum of code required to deploy. 
You can create and test this starter code for a Pact module using the Pact REPL.
After you have a minimal working deployment, you can add and refactor the code to add functionality to the Pact module. 

To create the starter code for a Pact module:

1. Open the `election-dapp/pact` folder in a terminal shell on your computer.

2. Create a new file named `module.repl` in the `pact` folder.

3. Add a transaction that defines a module named `election` by typing the following lines of code in the `module.repl` file:

   ```pact
   (begin-tx
     "Deploy the election module"
   )
     (module election)
   (commit-tx)
   ```

1. Execute the transaction using the `pact` command-line program running locally or using [pact-cli](http://localhost:8080/ttyd/pact-cli/) from the Docker container.

   If `pact-cli` is installed locally, run the following command in the current terminal shell:

   ```bash
   pact module.repl -t
   ```
   
   As before, if you don't have `pact` installed locally, you can load the `module.repl` file in the [pact-cli](http://localhost:8080/ttyd/pact-cli/) from the Docker container with the following command:

   ```pact
   (load "module.repl")
   ```

   If you are using the `pact-cli` in a browser, you can replace the `pact module.repl -t` command with `(load "module.repl")` throughout this tutorial.
   
   You'll see that this transaction fails with an error similar to the following:

   ```bash
   error: Unexpected end of input, Expected: atom, Expected: literal
   ```
   
   Modules require you to define either a **keyset** or a **capability** guard to govern access to the module's functions.
   Capabilities are similar to  keysets in that they control permissions—who can do what—in the context of a Pact smart contract. 
   You'll learn more about capabilities in this tutorial and in other tutorials.
   For now, you can use the `admin-keyset` you defined in the previous tutorial.

2. Add the `admin-keyset` to the transaction to define the `election` module in the `module.repl` file:

   ```pact
   (begin-tx
     "Deploy the election module"
   )
     (module election "election.admin-keyset")
   (commit-tx)
   ```

   If you execute the transaction in the Pact REPL now, you'll see a different error:

   ```bash
   error: Unexpected end of input, Expected: list
   ```

   Although you've added an owner to the module, the module doesn't yet include any functions.
   You must define at least one function in a Pact module for the module to be valid.

1. Add a `list-candidates` function to the transaction that defines the `election` module.
   
   ```pact
   (begin-tx
     "Deploy the election module"
   )
     (module election "election.admin-keyset"
       (defun list-candidates () [])
     )
   (commit-tx)
   ```

   Later, you'll update this function to list the candidates stored in ae database table. 
   For now, this function just returns an empty list (`[]`).
   If you execute the transaction in the Pact REPL now, you should see a familiar error:

   ```bash
   Error: No such keyset: 'election.admin-keyset
   ```
   
   Remember that you can only define a keyset in a namespace. 
   The current `module.repl` file doesn't define a namespace, so it can't define or use the keyset you've specified for the module definition.

1. Add the following code—which should look familiar from the previous tutorials—before the transaction to define the `election` module:

   ```pact
   (env-data
     { 'admin-keyset :
       { 'keys : [ 'admin-key ]
       , 'pred : 'keys-all
       }
     }
   )
   (env-sigs
     [{ 'key  : 'admin-key
      , 'caps : []
     }]
   )

   (begin-tx
     "Define a namespace for the module"
   )
     (define-namespace 'election (read-keyset 'admin-keyset) (read-keyset 'admin-keyset))
   (commit-tx)
   
   (begin-tx
     "Define a keyset to govern the module"
   )
     (namespace 'election)
     (define-keyset "election.admin-keyset" (read-keyset 'admin-keyset))
   (commit-tx)
   ```

2. Execute the transaction using the `pact` command-line program:
   
   ```pact
   pact module.repl -t
   ```

   You'll now see that the transaction succeeds with output similar to the following:

   ```bash
   module.repl:1:0:Trace: Setting transaction data
   module.repl:9:0:Trace: Setting transaction signatures/caps
   module.repl:15:0:Trace: Begin Tx 0: Define a namespace for the module
   module.repl:18:4:Trace: Namespace defined: election
   module.repl:19:0:Trace: Commit Tx 0: Define a namespace for the module
   module.repl:21:0:Trace: Begin Tx 1: Define a keyset to govern the module
   module.repl:24:4:Trace: Namespace set to election
   module.repl:25:4:Trace: Keyset defined
   module.repl:26:0:Trace: Commit Tx 1: Define a keyset to govern the module
   module.repl:28:0:Trace: Begin Tx 2: Deploy the election module
   module.repl:31:4:Trace: Loaded module election, hash ElJ6iBzJbN_WaWuzr6PPPVkjlCQAXhosymHnI3nPYZM
   module.repl:34:0:Trace: Commit Tx 2: Deploy the election module
   Load successful
   ```
   
   You now have all of the starter code required to defined the Pact `election` module in the `election` namespace. 
   The module is governed by the `election.admin-keyset` and only includes one function.

## Test the election module

Although the `election` module is governed by a keyset and can't be modified without a signed transaction, the `list-candidate` function publicly accessible.
You can use the global `list-modules` Pact function in the Pact REPL to test access to the `election` module and the `list-candidate` function. 

To test access to the election module:

1. Open the `election-dapp/pact/module.repl` file in the code editor on your computer.

1. Add the following transaction to assert that the `election` module is available:

   ```pact
   (begin-tx
      "Look up the election module"
   )
     (expect
      "The election module should exist"
      ["election"]
      (list-modules)
     )
   (commit-tx)
   ```

2. Execute the transaction using the `pact` command-line program:
   
   ```pact
   pact module.repl -t
   ```
   
   You should see output similar to the following that indicates the `election` module is defined in the Pact REPL:

   ```bash
   module.repl:35:0:Trace: Begin Tx 3: Look up the election module
   module.repl:38:3:Trace: Expect: success: The election module should exist
   module.repl:43:1:Trace: Commit Tx 3: Look up the election module
   Load successful
   ```

3. Add the following lines of code to the `module.repl` file to clear the environment keyset and signature information, call the `list-candidates` function on the `election` module, and assert that the function returns an array:

   ```pact
   (env-data {})
   (env-sigs [])
   
   (begin-tx
     "Call list-candidates"
   )
     (expect
       "list-candidates returns an empty list"
       []
       (election.list-candidates)
     )
   (commit-tx)
   ```

2. Execute the transaction using the `pact` command-line program:
   
   ```pact
   pact module.repl -t
   ```
   
   You should see output similar to the following that indicates you were able to call the `list-candidates` function without signing the transaction and that the function returned an empty list:

   ```bash
   module.repl:44:0:Trace: Setting transaction data
   module.repl:45:0:Trace: Setting transaction signatures/caps
   module.repl:47:0:Trace: Begin Tx 4: Call list-candidates
   module.repl:50:5:Trace: Expect: success: list-candidates returns an empty list
   module.repl:55:0:Trace: Commit Tx 4: Call list-candidates
   Load successful
   ```

   Proving that you can call this function inside of the `election` module without an identity context or a signature is important because, in a democracy, the list of candidates should be publicly accessible.

## Upgrade the election Pact module

When you defined the `election` module, you specified the keyset used to govern it. 
Every change to the module requires the upgrade transaction to be signed with that keyset. 
To test that upgrades works as expected, you can try upgrading the Pact module with the correct keyset and with an incorrect keyset.

To test upgrading with the correct keyset:

1. Open the `election-dapp/pact/module.repl` file in the code editor on your computer.

2. Add the following lines of code after the last transaction:
   
   ```pact
   (env-data
     { 'admin-keyset :
       { 'keys : [ 'admin-key ]
       , 'pred : 'keys-all
       }
     }
   )
   
   (env-sigs
     [{ 'key  : 'admin-key
      , 'caps : []
     }]
   )
   
   (begin-tx
     "Upgrade the module"
   )
     (module election "election.admin-keyset"
       (defun list-candidates () [1, 2, 3])
     )
   (commit-tx)
   
   (begin-tx
     "Call updated list-candidates function"
   )
     (expect
       "list-candidates returns a list with numbers"
       [1, 2, 3]
       (election.list-candidates)
     )
   (commit-tx)
   ```
   
   This code:
   
   - Reloads the correct keyset and signature into the Pact REPL
   - Redefines the `election` module with the `list-candidates` function to return a different list containing 1, 2, 3.
   - Tests that `list-candidates` returns the new list.
   
    You should see output similar to the following that indicates you were able to call the updated `list-candidates` function and that the function returned a list with numbers:

   ```bash
   module.repl:82:0:Trace: Begin Tx 6: Call updated list-candidates function
   module.repl:85:4:Trace: Expect: success: list-candidates returns a list with numbers
   module.repl:90:0:Trace: Commit Tx 6: Call updated list-candidates function
   Load successful
   ```

Earlier, you used `expect-failure` in the test REPL to catch and test errors
that were thrown as a result of an illegal attempt to redefine a namespace or
keyset. This will not work with module definitions, because they are special in
nature. It is possible to see what happens when someone illegally tries to
redefine a module without wrapping the attempt in an `except-failure` assertion.
However, the execution of the `module.repl` file will be marked as a failure.
For demonstration purposes, it does not matter, so go ahead and add the
following code at the end of the file and run it again.

```pact
(env-data
  { 'admin-keyset :
    { 'keys : [ 'other-key ]
    , 'pred : 'keys-all
    }
  }
)

(env-sigs
  [{ 'key  : 'other-key
   , 'caps : []
  }]
)

(begin-tx
  "Upgrade the module without permission"
)
  (namespace 'election)
    (module election "election.admin-keyset"
      (defun list-candidates () [])
    )
(commit-tx)
```

If all is well, the last line of the output should be `Load failed`. A few lines
up you will notice a `Keyset failure` error. This means that another keyset than
the `election.admin-keyset` cannot update the `election` module. So, you have
proven that you can govern a Pact module with a keyset. Remove the code to
make sure that the `module.repl` file can load successfully again before you
continue with the next exercise.

## Exercise: Governance with Capability

The `election.admin-keyset` that governs the `election` module will later be
used to restrict access to high impact functions of the modules, such as
nominating new candidates. To keep the module code DRY (Don't Repeat Yourself)
and descriptive, you will use a capability to govern the module instead of the
keyset directly. Add the following code after the last transaction in
`module.repl`. It defines a capability `GOVERNANCE` that enforces the keyset
`election.admin-keyset`. Run `module.repl` again.

```pact
(begin-tx
  "Refactor governance of the module"
)
  (module election GOVERNANCE
    (defcap GOVERNANCE ()
      (enforce-keyset "election.admin-keyset"))
    (defun list-candidates () [1, 2, 3])
  )
(commit-tx)
```

The last line of the output should be `Load successful`, meaning that the you
successfully upgraded the `election` module to be governed by a capability.
Using the examples from the exercises in this chapter, you can write additional
test cases to verify if the `election.admin-keyset` is still able to upgrade the
module now that governance of the module is implemented with a capability.

## Deploy the election Pact module to Devnet

Before you deploy your Pact module to Devnet, make sure that Chainweaver is open
and the Devnet network is selected. Chainweaver needs to remain open, because
you will use it to sign the transaction for deploying the module. Also, verify
that the following requirements are met:

- your admin account exists on chain 1 of Devnet
- your admin account has a positive KDA balance
- the `admin-keyset` is defined in your principal namespace on Devnet

If these requirements are not met, repeat the steps in the previous chapters.
Create a file `election.pact` in the `./pact/` folder of your project and add
the final Pact module code from the exercises above to it. Replace the principal
namespace with the one you defined on Devnet in the previous chapter in both
places.

```pact
(namespace 'n_fd020525c953aa002f20fb81a920982b175cdf1a)

(module election GOVERNANCE
  (defcap GOVERNANCE ()
    (enforce-keyset "n_fd020525c953aa002f20fb81a920982b175cdf1a.admin-keyset"))

  (defun list-candidates () [1, 2, 3])
)
```

Open the file `./snippets/deploy-module.ts` and you will notice there are some
differences compared to the previous snippets you used. First of all, the Pact
code to execute is not passed as a string or a function call on something like
`Pact.modules.coin`. Instead, the code is read from your `election.pact` file.
This helps you keep your code organized. Second, a very high gas limit is
specified in the metadata of the transaction. This is necessary, because
deploying a Pact module costs a lot of gas and the transaction will fail if you
use the default gas limit. Finally, after signing the transaction, a preflight
request for the signed transaction is sent to the blockchain using the Kadena
client. The response contains feedback about the expected success of the
transaction and the amount of gas the transaction will cost. If the feedback is
negative, the snippet will not send the actual transaction to the blockchain.
This is economical, because you would have to pay for gas, even if a transaction
fails. So, for expensive transactions like deploying a module it is recommended
to make a preflight request before sending the actual transaction to the
blockchain.

Open up a terminal and change the directory to the `./snippets` folder in the
root of your project. Execute the `./deploy-module.ts` snippet by running the
following command. Replace `k:account` with your admin account.

```bash
npm run deploy-module:devnet -- k:account
```

The Chainweaver window usually comes to the foreground as soon as there is a new
signing request for one of your accounts. If not, manually bring the Chainweaver
window to the foreground. You will see a modal with details of the signing
request. Click `Sign All` to sign the request and switch back to your terminal
window. If everything went well, you will see something similar to the following
output.

```bash
{
  status: 'success',
  data: 'Loaded module n_fd020525c953aa002f20fb81a920982b175cdf1a.election, hash xJZhwnEffBNXySXJFpEAAES_TUd-PJE8BCG6YBi736E'
}
```

Congratulations! You have deployed a smart contract consisting of the `election`
module that is governed by the `admin-keyset` in your principal namespace on
your local Devnet. If you would now run the `list-modules:devnet` script, you
will find your module in the list of deployed modules.

```bash
npm run list-modules:devnet
```

Open Chainweaver and navigate to `Contracts` via the left navigation bar. Select
the `Module Explorer` tab in the right panel and search for `election` on chain
1 under `Deployed Contracts`. You may have to click the refresh button on the
right above the table with contracts for your module to show up. Click the
`View` button to the right of the name of your module. In the right panel you
will see the name of the function and capability that you defined in the module.
On the top right of the panel, click `Open` to see the content of the module.
Notice that the statement for selecting the namespace is not displayed. It is
not considered part of the module itself. In the right pane, click the `Call`
button to the right of the `list-candidates` function. In the modal that pops
up, do not click `Next`, but select the `Preview` tab and scroll down. There you
will see the `Raw Response` from the blockchain displayed as `[1, 2, 3]`. This
is an actual response from the blockchain that you are able to receive without
paying gas, which is similar to the `dirtyRead` method of the Kadena JavaScript
client. You will learn more about that in the next chapter. In situations that
allow it, this is a cheaper alternative than sending an actual transaction to
the blockchain to call the module function, since sending a transaction requires
you to pay for gas.

Update `./pact/election.pact` in your editor to return a different list, like
`[1, 2, 3, 4, 5]` and upgrade the module using the `deploy-module:devnet` npm
script. View your module in Chainweaver and click `Open` once more to refresh
the module and confirm that the module is upgraded according to your
expectations. Click the `Call` button to the right of the `list-candidates`
function again, select the `Preview` tab in the modal and scroll all the way
down. The `Raw Response` from the blockchain should now display
`[1, 2, 3, 4, 5]`, or whatever you changed the return value of the function to.

The only thing that is left is to verify that other accounts cannot upgrade your
election module on Devnet. Navigate to `Keys` via the left navigation bar of
Chainweaver and generate a new key. Add a `k:account` for the new key and copy
it. Run the following script to create and fund the account on your Devnet.
Replace `k:account` with this new account.

```bash
npm run transfer-create:devnet -- k:account
```

Now try to upgrade the `election` module using the following script, again
replacing `k:account` with the new account.

```bash
npm run deploy-module:devnet -- k:account
```

If all is well, the transaction should fail with a `Keyset failure (keys-all)`.
This means that your Pact module is safely protected on the blockchain by the
`admin-keyset` that contains the public key of your admin account.

## Next steps

In this chapter you learned how to deploy, use and upgrade a Pact module. You
implemented governance of the module with a keyset and with a capability.
Moreover, you verified that it is impossible for others to make changes to a
Pact module governed by your keyset. In the next chapter, you will add a schema
and a database table to the `election` module. The table will store the names of
election candidates and the number of votes they have received. The `list-candidates`
function will remain public, but will return data from the database table. You will
add another function to nominate candidates, guarded by the governance
capability you defined in this chapter. The election website will come to life
as you will connect the front-end to the `election` module on Devnet.
