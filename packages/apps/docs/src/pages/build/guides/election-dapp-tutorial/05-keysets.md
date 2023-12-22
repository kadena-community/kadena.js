---
title: "Define keysets"
description: "Learn how to define keysets in your principal namespace."
menu: "Workshop: Election application"
label: "Define keysets"
order: 5
layout: full
tags: [account, keyset, namespace, governance, authorization, tutorial]
---

# Define keysets

As you learned in [Add an administrator account](/build/guides/election-dapp-tutorial/03-admin-account) and [Define a namespace](/build/guides/election-dapp-tutorial/04-namespaces), keysets determine rules for signing transaction and controlling the accounts that can access and update the namespaces where you deploy smart contracts. 
This tutorial demonstrates how to define the `admin-keyset` in the principal
namespace that you created in [Define a namespace](/build/guides/election-dapp-tutorial/04-namespaces) using the public key of the administrative account you created in [Add an administrator account](/build/guides/election-dapp-tutorial/03-admin-account). 

After you define the `admin-keyset` in your principal namespace, you'll be able to use it to authorize your administrative account to submit specific types of transactions for the election application you're building.
For example, you'll be able to authorize transactions that deploy and upgrade the election smart contract and that nominate the candidates that other accounts can vote on.

## Before you begin

Before you start this tutorial, verify the following basic requirements:

- You have an internet connection and a web browser installed on your local computer.
- You have a code editor, such as [Visual Studio Code](https://code.visualstudio.com/download), access to an interactive terminal shell, and are generally familiar with using command-line programs.
- You have cloned the [election-dapp](https://github.com/kadena-community/voting-dapp.git election-dapp) repository as described in [Prepare your workspace](/build/guides/election-dapp-tutorial/01-getting-started) and have checked out the `01-getting-started` branch.
- You have the development network running in a Docker container as described in [Start a local blockchain](/build/guides/election-dapp-tutorial/02-running-devnet).
- You are [connected to the development network](/build/guides/election-dapp-tutorial/02-running-devnet#connect-to-the-development-network) using your local host IP address and port number 8080.
- You have created and funded an administrative account as described in [Add an administrator account](/build/guides/election-dapp-tutorial/03-admin-account).
- You have created a principal namespace on the development network as described in [Define a namespace](/build/guides/election-dapp-tutorial/04-namespaces).

## Write a transaction to define a keyset

Like the previous tutorial, in this tutorial, you'll write and execute Pact code in the Pact REPL.
After testing the transaction to define a keyset in the Pact REPL, you'll define a keyset to use on your local development network.

To define a keyset:

1. Open the `election-dapp/pact` folder in a terminal shell on your computer.

2. Create a new file named `keyset.repl` in the `pact` folder.

3. Write an empty transaction by typing the following lines of code in the `keyset.repl` file:
   
   ```pact
   (begin-tx
     "Define a new keyset"
   )
   (commit-tx)
   ```

1. Execute the transaction using the `pact` command-line program running locally or using [pact-cli](http://localhost:8080/ttyd/pact-cli/) from the Docker container.
   
   If `pact-cli` is installed locally, run the following command in the current terminal shell:

   ```bash
   pact keyset.repl -t
   ```

   After you execute the transaction, you should see the following output:

   ```bash
   keyset.repl:1:0:Trace: Begin Tx 0: Define a new keyset
   keyset.repl:4:0:Trace: Commit Tx 0: Define a new keyset
   Load successful
   ```

   As before, if you don't have `pact` installed locally, you can load the `keyset.repl` file in the [pact-cli](http://localhost:8080/ttyd/pact-cli/) from the Docker container with the following command:

   ```pact
   (load "keyset.repl")
   ```

   If you are using the `pact-cli` in a browser, you can replace the `pact keyset.repl -t` command with `(load "keyset.repl")` throughout this tutorial.

## Add functions to define the keyset

Pact has a built-in function—`define-keyset`—that you can use to define keysets. 
This function takes two arguments:

- The name keyset of the keyset.
- The keyset—that is, one or more keys and a predicate—that you want to associate with the keyset name you re defining.

The `define-keyset` function is wrapped by the `expect` function to test that calling `define-keyset` will succeed.
The `expect` function takes three arguments:

- The title of the test.
- The expected output of the `define-keyset` function.
- The `define-keyset` function call.

The first argument of expect is the title of the test, the second argument is the expected
output of the `define-keyset` function and the third argument is the actual `define-keyset`
function call. 

To define a keyset:


1. Open the `election-dapp/pact/keyset.repl` file in a terminal shell on your computer.

2. Add the following lines of code between the `begin-tx` and `commit-tx` lines:

   ```pact
   (expect
     "A keyset can be defined"
     "Keyset defined"
     (define-keyset "admin-keyset" (read-keyset 'admin-keyset))
   )
   ```

3. Execute the transaction using the `pact` command-line program by running the following command in the current terminal shell:

   ```bash
   pact keyset.repl -t
   ```

   You'll see that this transaction fails with output similar to the following:

   ```bash
   keyset.repl:1:0:Trace: Begin Tx 0: Define a new keyset
   keyset.repl:4:0:Trace: FAILURE: A keyset can be defined: evaluation of actual failed:keyset.repl:7:34: No such key in message: admin-keyset
   keyset.repl:9:0:Trace: Commit Tx 0: Define a new keyset
   keyset.repl:4:0:ExecError: FAILURE: A keyset can be defined: evaluation of actual failed:keyset.repl:7:34: No such key in message: admin-keyset
   Load failed
   ```

   As you saw when defining a namespace, you must load the `admin-keyset` into the context of the Pact REPL so it can be read using the `read-keyset` function. 

1. Add the following lines at the top of the `keyset.repl` file:

   ```pact
   (env-data
     { 'admin-keyset :
       { 'keys : [ 'admin-public-key ]
       , 'pred : 'keys-all
       }
     }
   )
   ```

   If you execute the transaction now, however, it will fail with the following error:
   
   `Cannot define a keyset outside of a namespace`
   
   As this error indicates, keysets must be defined within the context of a specific namespace.
   
2. Add the following transaction to define the `election` namespace before the transaction to define a keyset.

   ```pact
   (begin-tx
     "Define a namespace to define the keyset in"
   )
   (define-namespace 'election (read-keyset 'admin-keyset) (read-keyset 'admin-keyset))
   (commit-tx)
   ```

1. Modify the `Define a new keyset` transaction to specify the `election` namespace as a prefix for the new keyset with the following lines of code:
   
   ```pact
   (begin-tx
     "Define a new keyset"
   )
   (namespace 'election)
   (expect
     "A keyset can be defined"
     "Keyset defined"
     (define-keyset "election.admin-keyset" (read-keyset 'admin-keyset)))
   (commit-tx)
   ```

2. Execute the transaction using the `pact` command-line program:

   ```bash
   pact keyset.repl -t
   ```

   You'll see that this transaction still fails, but with a different error.
   This time the error message is:
   
   `Keyset failure (keys-all): [admin-ke...]`
  
   The transaction failed because it isn't following the signing rules specified by the keyset passed to the `define-keyset` function. 

3. Sign the transaction with the key from the `admin-keyset` you loaded into the context of the Pact REPL. 
   
   For example, sign the transaction with the `admin-public-key` by adding the following lines of code before the `Define a new keyset` transaction:

   ```pact
   (env-sigs
     [{ 'key  : 'admin-public-key
      , 'caps : []
     }]
   )
   ```

2. Execute the transaction using the `pact` command-line program:

   ```bash
   pact keyset.repl -t
   ```
   
   You'll now see that the transaction succeeds with output similar to the following:

   ```bash
   keyset.repl:1:0:Trace: Setting transaction data
   keyset.repl:8:0:Trace: Begin Tx 0: Define a namespace to define the keyset in
   keyset.repl:11:2:Trace: Namespace defined: election
   keyset.repl:12:0:Trace: Commit Tx 0: Define a namespace to define the keyset in
   keyset.repl:13:0:Trace: Setting transaction signatures/caps
   keyset.repl:18:0:Trace: Begin Tx 1: Define a new keyset
   keyset.repl:21:2:Trace: Namespace set to election
   keyset.repl:22:2:Trace: Expect: success: A keyset can be defined
   keyset.repl:26:0:Trace: Commit Tx 1: Define a new keyset
   Load successful
   ```

   You now a keyset named `admin-keyset` in the `election` namespace in the Pact REPL.

## Test keyset authorization

The `election.admin-keyset` you just defined is protected by the `admin-keyset` that has only one key, the `admin-public-key`. 
Only this account is authorized to call the `define-keyset` function to modify or update
the `election.admin-keyset` definitions. 
Transactions that use any other key will fail. 

To test keyset authorization and verify that no other accounts can seize control of your namespace, you can add another test case to the `keyset.repl` file. 
-----
First, you will load the `admin-keyset` into the context
of the Pact REPL. The keys of this keyset contain a different public key than the one
that was used when the keyset was initially defined. A signature must be defined for the
other public key to prevent the transaction from failing with a `Keyset failure`. The
transaction you will add is exactly the same as the previous one, except for the `expect`
function, which is changed to `expect-failure`. Add the following code to your `keyset.repl`
file and run it.

```pact
(env-data
  { 'admin-keyset :
    { 'keys : [ 'other-public-key ]
    , 'pred : 'keys-all
    }
  }
)

(env-sigs
  [{ 'key  : 'other-public-key
   , 'caps : []
  }]
)

(begin-tx
  "Defining a keyset that is already defined using a different keyset fails"
)
(namespace 'election)
(expect-failure
  "keyset definition is already defined using a different keyset"
  "Keyset failure (keys-all): 'election.admin-keyset"
  (define-keyset "election.admin-keyset" (read-keyset 'admin-keyset))
)
(commit-tx)
```

At the end of the output you will see `Load successful`, which means that your test has
passed and you proved that the `election.admin-keyset` is exclusively governed by the account
with the `admin-key` and cannot be redefined by others.

## Rotate the keyset

It is possible to transfer governance permissions to someone else by rotating the
`election.admin-keyset`. This can be convenient if, for instance, the administrator of the election
resigns and a successor needs to take over the election administration. All that is needed to
rotate the keyset is to add the signature for the original `admin-key` to the transaction. In
the `keyset.repl` file, create signatures for both public keys and add another transaction in which
the redefinition of the `election.admin-keyset` is expected to succeed, and run it.

```pact
(env-sigs
  [{ 'key  : 'other-public-key
   , 'caps : []
  }
  ,{ 'key  : 'admin-key
   , 'caps : []
  }]
)
(begin-tx
  "Rotating the existing keyset to a new keyset works if the transaction is signed with the original admin-key"
)
(namespace 'election)
(expect
  "Keyset can be rotated"
  "Keyset defined"
  (define-keyset "election.admin-keyset" (read-keyset 'admin-keyset))
)
(commit-tx)
```

At the end of the output you will see `Load successful`, which means that your test has
passed and you successfully rotated the `election.admin-keyset`, meaning that is it is now
governed by an `admin-keyset` that contains the public key `other-public-key`.

## Define a keyset in a principal namespace

In the previous chapter you defined a principal namespace on your local Devnet. At the end
of this chapter you will define an `admin-keyset` in that principal namespace. Before sending
the transaction to Devnet, it is a good idea to first test if the transaction will work in the
Pact REPL. In the `./pact` folder, create a file `./pact/principal-namespace.repl` and add the
transaction displayed below into it. The main difference from the previous `Define a new keyset` transaction 
is that the name of the keyset passed to the `define-keyset` function is no longer passed as the hardcoded
string `election.admin-keyset`. Instead, it is composed of the principal namespace name stored
in the `ns-name` variable and the string `admin-keyset`. The `ns-name` variable, in turn, gets its
value assigned from the return value of a call to the `ns.create-principal-namespace` function.
Also note that, before calling `define-keyset` you need to enter the principal namespace first, using
the statement `(namespace ns-name)`. Finally, you need to add a signature for the transaction
to succeed.

```pact
(begin-tx)
  (load "root/ns.pact")
(commit-tx)

(env-sigs
  [{ 'key  : "368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca"
   , 'caps : []
  }]
)

(begin-tx
  "Define a keyset in the principal namespace"
)
(expect
  "A keyset can be defined in a principal namespace"
  "Keyset defined"
  (let ((ns-name (ns.create-principal-namespace (read-keyset 'admin-keyset))))
    (namespace ns-name)
    (define-keyset (format "{}.{}" [ns-name 'admin-keyset]) (read-keyset 'admin-keyset ))
  )
)
(commit-tx)

```

At the end of the output you will see `Load successful`, which means that your test has
passed and you successfully defined the `admin-keyset` in the principal namespace. You are now
ready to define the admin keyset that holds your own admin account's public key in the principal
namespace on your local Devnet.

## Define your keyset on Devnet

Before you define your keyset on Devnet, make sure that Chainweaver is
open and the Devnet network is selected. Also, verify that your admin account exists
and holds KDA on chain 1. Otherwise, repeat the steps in the previous chapters to create
and fund your admin account. Chainweaver needs to remain open, because you will use
it to sign the transaction for defining the keyset. Switch to your editor and open
the file `./snippets/define-keyset.ts`. The `pactCommand` variable contains the
crucial bit of Pact code for defining the keyset in your principal namespace. The code
should look familiar if you followed along with the exercises in this chapter. At this point
in thet tutorial, you should be able to explain how the the `Pact.builder` constructs the
transaction, on what line the transaction is signed, on what line the transaction is sent to
the blockchain, and how the response from the blockchain is handled.

Open up a terminal and change the directory to the `./snippets` folder in the root of
your project. Execute the `./define-keyset.ts` snippet by running the following command.
Replace `k:account` with your admin account.

```bash
npm run define-keyset:devnet -- k:account
```

The Chainweaver window usually comes to the foreground as soon as there is a new signing
request for one of your accounts. If not, manually bring the Chainweaver window
to the foreground. You will see a modal with details of the signing request.
Click `Sign All` to sign the request and switch back to your terminal window.
If everything went well, you will see something similar to the following output.

```bash
{ status: 'success', data: 'Keyset defined' }
```

Congratulations! You have defined a keyset in your principal namespace on your local Devnet.
This keyset is governed by your admin account.

## Next steps

In this chapter you learned to define and update a keyset in the Pact REPL,
allowing you to verify the behavior of Pact keysets on your local computer
before defining a keyset on the blockchain. You used
the Kadena JavaScript client to define a keyset in the principal namespace to your local Devnet.
In the next chapter you will create the election Pact module that will become the back-end of the
election website. The pact module will be defined in your principal namespace and it will be
governed by the keyset you defined in this chapter. In later chapters, the keyset will also
be used to guard high impact functions inside the election Pact module, such as nominating
candidates that can receive votes.


## Recommended reading

 * [Beginner’s Guide to Kadena: Accounts + Keysets](/blogchain/2020/beginners-guide-to-kadena-accounts-keysets-2020-01-14)
 * [Pact Keysets](/pact/beginner/keysets)