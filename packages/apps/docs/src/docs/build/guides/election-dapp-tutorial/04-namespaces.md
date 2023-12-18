---
title: "Define a namespace"
description: "Learn how to define a unique namespace for your smart contracts, keysets, and Pact modules."
menu: "Workshop: Election application"
label: "Define a namespace"
order: 4
layout: full
tags: [pact, smart contract, typescript, tutorial]
---

# Define a namespace

In the Kadena ecosystem, a **namespace** is conceptual similar to a domain name except that the name is a static prefix that establishes a private boundary for the contracts and keyset definitions you control. 

When you are building, testing, and deploying smart contracts on your local development network, you don't need to define a namespace.
Your work is isolated from others because your blockchain—and any smart contracts you deploy—run exclusively on your local computer.

However, if you want to deploy a smart contract on the Kadena test network or another public blockchain, the contract must have a unique name that distinguishes your Pact module from all the others.
If you try to deploy a Pact module with a name that's already being used on the network where you are trying to deploy, the deployment will fail with an error and you'll pay a transaction fee for the failed attempt. 

To prevent name collisions on the same network, Kadena allows you to define your own unique namespace on the blockchain.
The namespace segregates your work—your smart contracts, custom keysets, and Pact modules—from applications and modules created and deployed by others.
Within your namespace, you can define whatever keysets and modules you need and control who can update the namespace with changes. 
As long as you choose a unique name for your namespace, everything you define inside of it will automatically be unique, too.

In this tutorial, you'll learn how to define a namespace for the election application and how to use that namespace in the remaining tutorials.


Kadena’s namespaces are relatively simple in practice. They are used in exactly two scenarios:

Contract definition, in which a module is published to a namespace, which allows one to access the module and its members by prefixing the namespace and a dot (e.g. if you have a namespace my-namespace, then if you define my-module within it, you may access its members by issuing my-namespace.my-module.my-function.

Keyset definition, in which a keyset is defined within the namespace, and may be referenced by its name prefixed by the namespace name in which it was defined. This allows for keysets to exist with the same name, allowing the namespace to distinguish which keyset with a common name is being referenced at a particular point in code. This also works for named keyset references.

There are two builtins needed to define and “enter” a namespace in order to define constructs: define-namespace, and namespace. Upon defining a namespace, a user and admin governance protocol (a keyset or more generally, a guard) must be supplied in order to define the namespace and who may upload to it. For a more in-depth discussion, see the Pact Language ReadTheDocs.


## Recommended reading

 * [An Introductory Guide to Kadena Namespaces](/blogchain/2023/an-introductory-guide-to-kadena-namespaces-2023-01-11)
 * [Testing in the Pact REPL](https://github.com/thomashoneyman/real-world-pact/blob/main/00-core-concepts/03-Testing-In-The-Pact-REPL.md)

## Before you begin

Before you start this tutorial, verify the following basic requirements:

- You have an internet connection and a web browser installed on your local computer.
- You have a code editor, such as [Visual Studio Code](https://code.visualstudio.com/download), access to an interactive terminal shell, and are generally familiar with using command-line programs.
- You have cloned the [election-dapp](https://github.com/kadena-community/voting-dapp.git election-dapp) repository as described in [Prepare your workspace](/build/guides/election-dapp-tutorial/01-getting-started) and have checked out the `01-getting-started` branch.
- You have the development network running in a Docker container as described in [Start a local blockchain](/build/guides/election-dapp-tutorial/02-running-devnet).
- You have are [connected to the development network](/build/guides/election-dapp-tutorial/02-running-devnet#connect-to-the-development-network) using your local host IP address and port number 8080.
- You have created and funded an administrative account as described in [Add an administrator account](/build/guides/election-dapp-tutorial/03-admin-account).

## Write a transaction in Pact

In this tutorial, you'll write and execute some code using the Pact smart contract programming language and the Pact REPL. 

To write a simple transaction in Pact:

1. Open the `election-dapp/pact` folder in a terminal shell on your computer.

3. Create a new file named `namespace.repl` in the `pact` folder. 

4. Write an empty transaction by typing the following lines of code in the `namespace.repl` file:
   
   ```pact
   (begin-tx
     "Define a namespace called 'election"
   )
   (commit-tx)
   ```

5. Execute the transaction using the `pact` command-line program running locally or in a browser.

   If `pact` is installed locally, run the following command in the current terminal shell:
   
   ```bash
   pact namespace.repl -t
   ```
   
   If `pact` isn't installed locally, you can open [pact](http://localhost:8080/ttyd/pact-cli/) from the Docker container.
   Verify the development network is currently running on your local computer and run the following command:
   
   ```pact
   (load "namespace.repl")
   ```

   After you execute the file, you should see the following output:
   
   ```bash
   namespace.repl:1:0:Trace: Begin Tx 0: Define a namespace called 'election
   namespace.repl:4:0:Trace: Commit Tx 0: Define a namespace called 'election
   Load successful
   ```

## Use Pact built-in functions

Inside the transaction you created in the namespace.repl file, you can call the built-in `define-namespace` Pact function with the following information as arguments:

- The name of the namespace.
- The keyset that defines who can use the namespace.
- The keyset that defines who governs the namespace. 

The `define-namespace` function is wrapped by the `expect` function to test that calling `define-namespace` will succeed.
The `expect` function takes three arguments:

- The title of the test.
- The expected output of the `define-namespace` function.
- The `define-namespace` function call. 

To use the `define-namespace` function:

1. Open the `election-dapp/pact/namespace.repl` file in a terminal shell on your computer.

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
   
   For the transaction to succeed, you must first load the `user-keyset` and `admin-keyset` into the context of the Pact REPL so they can be read using the `read-keyset` function.

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

5. Execute the transaction using the `pact` command-line program by running the following command in the current terminal shell:
   
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

## Update the namespace

After you define a namespace, you can update the namespace. In the next transaction you will update the namespace
to allow the `user-keyset` to govern the namespace and limit the `admin-keyset` to only use
the namespace for defining keysets and Pact modules. Add the following transaction at the
bottom of the `namespace.yml` file and run it.

```pact
(begin-tx
  "Update the 'election' namespace"
)
(expect
  "An admin can redefine the namespace, for instance to set another admin keyset"
  "Namespace defined: election"
  (define-namespace 'election (read-keyset 'admin-keyset) (read-keyset 'user-keyset))
)
(commit-tx)
```

You will see the transaction fail with a message containing `Keyset failure`. This demonstrates
that indeed only the `admin-keyset` is allowed to update the namespace. Sign the transaction
with the `admin-keyset` by loading it into the context of the Pact REPL right before the last
transaction. Use the following code and run `namespace.repl` again.

```pact
(env-sigs
  [{ 'key  : 'admin-public-key
   , 'caps : []
  }]
)
```

The output should show `Load successful`, meaning that the namespace was updated successfully.

### Try to update the namespace with incorrect permissions

After the second transaction, the `admin-keyset` no longer governs the `election` namespace.
You can confirm this with a new transaction in which you redefine the namespace with the same
permissions that you used when creating the namespace. Only, this time, you will wrap the
`define-namespace` function inside an `expect-failure` function, to assert that redefining
the namespace will fail. Redefining the namespace will fail this time around, because the transaction
will be signed with the `admin-keyset` and this keyset no longer has governance permission
after the previous transaction. Add the following transaction at the
bottom of the `namespace.yml` file and run it.

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

### Redefine the namespace as the new admin

To further prove that the namespace was successfully updated in the previous steps, it should
be tested that the `user-keyset` will now be able to redefine the namespace. You will need
to load the signature of the `user-keyset` into the context of the Pact REPL and write a
transaction to redefine the namespace. The transaction will be the same as the previous one,
but this time it is wrapped inside an `expect` function instead of `expect-failure`.
Add the following transaction at the bottom of the `namespace.yml` file and run it.

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

If all is well, `Load successful` will be displayed at the bottom of the output. In conclusion,
you defined a namespace `election` and specified a keyset that is allowed to govern the
namespace and a keyset that is allowed to use the namespace. You wrote an automated test
script to verify that indeed only the governance keyset can redefine the namespace. Finally, the
namespace was redefined in such a way that governance permissions were handed over to another
keyset. Great work!

## Exercise: Define a principal namespace

Choosing an arbitrary namespace name like `election-your-name` still provides no guarantee
that, by coincidence, this namespace is not already defined by someone else. To ensure
that your namespace will be unique, you can create a principal namespace. The
`create-principal-namespace` from the `ns` module creates a principal namespace name
that is a hash of a keyset, prefixed with `n_`. In this example, you will use an `admin-keyset`
that contains the public key of the `sender00` account, because `ns.create-principal-namespace`
only accepts valid public keys inside the keyset. The `ns` module is readily available
on Mainnet, Testnet and Devnet, but to use it in the Pact REPL it needs to be loaded
from the local filesystem. To that end, the `ns` module should be loaded from the local
`./pact/root` folder of the project for testing purposes.The output of
`ns.create-principal-namespace` called with the
`admin-keyset` can be stored in a variable (`ns-name`) and passed to the `define-namespace`
as the first argument. In the `./pact` folder create `principal-namespace.repl` file and paste the following
code into it.

```pact
(env-data
  { 'admin-keyset :
    { 'keys : [ "368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca" ]
    , 'pred : 'keys-all
    }
  }
)

(begin-tx)
(load "root/ns.pact")
(commit-tx)

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

You will notice that the code is very similar to the code in `namespace.repl`. The main
differences are that the `ns` module is loaded and the `define-namespace` is called
with the variable `ns-name` as its first argument, instead of the hardcoded string
`election`. Run the `principal-namespace.repl` file and verify that the test passed.
If so, you have successfully defined a principal namespace in the Pact REPL and you
are ready to define a principal namespace on Devnet with the admin account you
created in the previous chapter.

## Define your namespace on Devnet

Before you define your principal namespace on Devnet, make sure that Chainweaver is
open and the Devnet network is selected. Also, verify that your admin account exists
and holds KDA on chain 1. Otherwise, repeat the steps in the previous chapter to create
and fund your admin account. Chainweaver needs to remain open, because you will use
it to sign the transaction for defining the namespace. Switch to your editor and open
the file `./snippets/principal-namespace.ts`. The `pactCommand` variable contains the
crucial bit of Pact code for defining a principal namespace, which you just tested in
the Pact REPL. Also, recognize how the keyset data is added in a similar fashion as in
the `.repl` file, with slightly different syntax. For the transaction on Devnet, a signer
is also added, which was not required in the Pact REPL. After the transaction is defined,
it is signed with Chainweaver. That is why you need to have Chainweaver open before
executing this snippet. The remainder of the snippet deals with handling the response
that the Kadena JavaScript client receives from your local Devnet.

Open up a terminal and change the directory to the `./snippets` folder in the root of
your project. Execute the `./principal-namespace.ts` snippet by running the following command.
Replace `k:account` with your admin account.

```bash
npm run create-namespace:devnet -- k:account
```

The Chainweaver window usually comes to the foreground as soon as there is a new signing
request for one of your accounts. If not, manually bring the Chainweaver window
to the foreground. You will see a modal with details of the signing request.
Click `Sign All` to sign the request and switch back to your terminal window.
If everything went well, you will see something similar to the following output.

```bash
{
  status: 'success',
  data: 'Namespace defined: n_fd020525c953aa002f20fb81a920982b175cdf1a'
}
```

Congratulations! You have defined a principal namespace on your local Devnet that
can be governed and used by your admin account.

## Next steps

In this chapter you learned to define and update a namespace in the Pact REPL,
allowing you to verify the behavior of Pact namespaces on your local computer
before defining a namespace on the blockchain. You also learned about the
difference between a namespace and a principal namespace. Finally, you used
the Kadena JavaScript client to define a principal namespace on your local Devnet.
In the next chapter you will define a keyset inside your principal namespace. This
keyset definition will later be used to guard who can govern, i.e update, your
election smart contract.



To see the final solution for this chapter, you can check out the branch
containing the starter code for the next chapter.

```bash
git checkout 05-keysets
```

