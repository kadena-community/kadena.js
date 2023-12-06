---
title: "04: Namespaces"
description: "In the fourth chapter of the Election dApp tutorial you will create a namespace for your keyset and modules."
menu: Election dApp tutorial
label: "04: Namespaces"
order: 4
layout: full
tags: [pact, smart contract, typescript, tutorial]
---

# Chapter 04: Namespaces

After you have completed this entire tutorial, you may want to deploy your election
smart contract to Testnet. Many others like you would perhaps like to do the same.
If everyone would deploy Pact modules with the same name to the same network, however,
it would become impossible to distinguish your Pact module from all the others. Therefore,
it is not allowed to deploy a Pact module with a name that is already used by someone
else on the chain you are deploying to
and your deployment transaction will fail with an error if you try. Fortunately,
Kadena offers a solution to this problem by introducing namespaces. You can create
your own unique namespace on the blockchain and you get to decide who can update the
namespace or use it to define keysets and modules inside it. As long as you choose a
unique name for your namespace, all keysets and modules defined inside it will automatically
be unique, too.

In this chapter, you will use the Pact REPL to test out Pact commands for defining
namespaces. At the end of the chapter you will define a namespace for your project
on your local Devnet. You will be using that namespace throughout the remainder of
the tutorial.

## Recommended reading

 * [An Introductory Guide to Kadena Namespaces](/blogchain/2023/an-introductory-guide-to-kadena-namespaces-2023-01-11)
 * [Testing in the Pact REPL](https://github.com/thomashoneyman/real-world-pact/blob/main/00-core-concepts/03-Testing-In-The-Pact-REPL.md)

## Get the code

The project files have not been changed since the last chapter, so if you are
following along with the tutorial you can continue on the `01-getting-started`
branch. If you started the tutorial with this chapter, clone the tutorial
project and change the current directory of your terminal to the project folder.

```bash
git clone git@github.com:kadena-community/voting-dapp.git election-dapp
cd election-dapp
```

After cloning the project, switch branches to get the starter code for this chapter.

```bash
git checkout 04-namespaces
```

In this chapter you will add some code to the project for the first time. If you want
to skip ahead and see the final solution for this chapter, you can check out the branch
containing the starter code for the next chapter.

```bash
git checkout 05-keysets
```

## Exercise: Define a namespace

In the `./pact` folder, create a file `namespace.repl`. Write an empty transaction inside
this file.

```pact
(begin-tx
  "Define a namespace called 'election"
)
(commit-tx)
```

If you have the pact executable installed locally, you can run the `namespace.repl`
file using the following command in a terminal with the current directory set
to the root of your project.

```bash
pact pact/namespace.repl -t
```

If you do not have the pact executable installed locally, you can run the `namespace.repl`
file from the [pact ttyd in your browser](http://localhost:8080/ttyd/pact-cli/).
Make sure that your local Devnet is running.

```pact
(load "namespace.repl")
```

If all is well, you should see the following output.

```bash
pact/namespace.repl:2:0:Trace: Begin Tx 0: Define a namespace called 'election
pact/namespace.repl:5:0:Trace: Commit Tx 0: Define a namespace called 'election
Load successful
```

### Define a namespace

Inside the transaction you will call the built-in Pact function `define-namespace` with
the name of the namespace, the keyset that defines who can use the namespace and the
keyset that defines who governs the namespace as arguments. This function is wrapped
by the `expect` function in order to test that calling `define-namespace` will succeed.
The first argument of expect is the title of the test, the second argument is the expected
output of the `define-namespace` function and the third argument is the actual `define-namespace`
function call. Add the following code between the `begin-tx` and `commit-tx` lines in
`namespace.repl` and run it.

```pact
(expect
  "A namespace can be defined"
  "Namespace defined: election"
  (define-namespace 'election (read-keyset 'user-keyset) (read-keyset 'admin-keyset))
)
```

The test will fail with the message `No such key in message: user-keyset`. You will need
to load the `user-keyset` and `admin-keyset` into the context of the Pact REPL so they
can be read using the `read-keyset` function. Add the following lines at the top of the
`namespace.repl` file and run it again.

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

At the end of the output you will see `Load successful`, which means that your test has
passed and you successfully defined a namespace called `election` in the Pact REPL.

### Update the namespace

It is possible to update a namespace. In the next transaction you will update the namespace
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
