---
title: "05: Keysets"
description: "In the fith chapter of the Election dApp tutorial you will create a keyset to protect your modules and specific function calls"
menu: Election dApp tutorial
label: "05: Keysets"
order: 5
layout: full
tags: [pact, smart contract, typescript, tutorial]
---

# Chapter 05: Keysets

Pact Keysets determine which accounts can access and update various parts of a
smart contract. In this chapter, you will define an `admin-keyset` in the principal
namespace that you created in the previous chapter. This keyset will contain
the public key of the admin account that you created in Chapter 03. In the next
chapters you will use the `admin-keyset` to authorize only your admin account to
make high impact transactions on the election smart contract. These transactions
include upgrading the smart contract and nominating candidates for other accounts
to vote on.

In this chapter, you will first use the Pact REPL to test out Pact commands for defining
a keyset. At the end of the chapter you will define a keyset for your project
on your local Devnet.

## Recommended reading

 * [Beginner’s Guide to Kadena: Accounts + Keysets](/blogchain/2020/beginners-guide-to-kadena-accounts-keysets-2020-01-14)
 * [Pact Keysets](/pact/beginner/keysets)

## Get the code

If you are following along with the tutorial you can continue working on your current
branch. In case you started the tutorial with this chapter, clone the tutorial
project and change the current directory of your terminal to the project folder.

```bash
git clone git@github.com:kadena-community/voting-dapp.git election-dapp
cd election-dapp
```

Switch branches to get the starter code for this chapter.

```bash
git checkout 05-keysets
```

If you want to skip ahead and see the final solution for this chapter, you can check
out the branch containing the starter code for the next chapter.

```bash
git checkout 06-smart-contract
```

## Exercise: Define a keyset

In the `./pact` folder, create a file `keyset.repl`. Write an empty transaction inside
this file.

```pact
(begin-tx
  "Define a new keyset"
)
(commit-tx)
```

if you have the pact executable installed locally, you can run the `keyset.repl`
file using the following command in a terminal with the current directory set
to the root of your project.

```bash
pact pact/keyset.repl -t
```

If you do not have the pact executable installed locally, you can run the `keyset.repl`
file from the [pact ttyd in your browser](http://localhost:8080/ttyd/pact-cli/).
Make sure that your local Devnet is running.

```pact
(load "keyset.repl")
```

If all is well, you should see the following output.

```bash
pact/namespace.repl:2:0:Trace: Begin Tx 0: Define a namespace called 'election
pact/namespace.repl:5:0:Trace: Commit Tx 0: Define a namespace called 'election
Load successful
```

### Define the admin-keyset

Inside the transaction you will call the built-in Pact function `define-keyset` with
the name of the keyset as the first argument and the actual keyset as the second argument.
This function is wrapped
by the `expect` function in order to test that calling `define-keyset` will succeed.
The first argument of expect is the title of the test, the second argument is the expected
output of the `define-keyset` function and the third argument is the actual `define-keyset`
function call. Add the following code between the `begin-tx` and `commit-tx` lines in
`keyset.repl` and run it.

```pact
(expect
  "A keyset can be defined"
  "Keyset defined"
  (define-keyset "admin-keyset" (read-keyset 'admin-keyset))
)
```

The test will fail with the message `No such key in message: admin-keyset`. You will need
to load the `admin-keyset` into the context of the Pact REPL so they
can be read using the `read-keyset` function. Add the following lines at the top of the
`keyset.repl` file and run it again.

```pact
(env-data
  { 'admin-keyset :
    { 'keys : [ 'admin-key ]
    , 'pred : 'keys-all
    }
  }
)
```

The test will still fail, this time with the message `Cannot define a keyset outside of a namespace`.
As it appears, keysets may only be defined within a namespace. Add the following transaction before
the other transaction to define a namespace called `election`.

```pact
(begin-tx
  "Define a namespace to define the keyset in"
)
(define-namespace 'election (read-keyset 'admin-keyset) (read-keyset 'admin-keyset))
(commit-tx)
```

You will also need to use the `election` namespace in the `Define a new keyset` transaction and
prefix the name of the keyset with `election.`. Update that transaction as follows and run the
`keyset.repl` file again.

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

You will notice that your test is still failing, this time with a `Keyset failure`. This is
because the `Define a new keyset` transaction must be signed in accordance with the actual
keyset that is passed to the `define-keyset` function. Add a signature for the key `admin-key`
to the `keyset.repl` file, right before the `Define a new keyset` transaction as follows and
run the file again.

```pact
(env-sigs
  [{ 'key  : 'admin-key
   , 'caps : []
  }]
)
```

Finally, `Load successful` will be printed at the end of the output in your terminal,
which means that your test has passed and you successfully defined a keyset called `election`
in the `election` namespace using the Pact REPL.

### Redefine the keyset with a different keyset

The `election.admin-keyset` you defined is now protected by the `admin-keyset` with `admin-key`
as the only key. In case someone else tries to call `define-keyset` to redefine
`election.admin-keyset` using an `admin-keyset` containing the keys to their own account, that
transaction will fail. Remember that your keyset definition will be used to authorize only your
admin account to make high impact transactions on the election smart contract, like upgrading
the smart contract and manipulating sensitive data. You would not want others to be able to
transfer this authorization from you to themselves by accident or on purpose.

To verify that other accounts are indeed unable to seize control of your namespace, add another
test case to the `keyset.repl` file. First, you will load the `admin-keyset` into the context
of the Pact REPL. The keys of this keyset contain a different public key than the one
that was used when the keyset was initially defined. A signature must be defined for the
other public key to prevent the transaction from failing with a `Keyset failure`. The
transaction you will add is exactly the same as the previous one, except for the `expect`
function, which is changed to `expect-failure`. Add the following code to your `keyset.repl`
file and run it.

```pact
(env-data
  { 'admin-key :
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

### Rotating the keyset

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

## Exercise: Define a keyset in a principal namespace

In the previous chapter you defined a principal namespace on your local Devnet. At the end
of this chapter you will define an `admin-keyset` in that principal namespace. Before sending
the transaction to Devnet, it is a good idea to first test if the transaction will work in the
Pact REPL. Open the (*other*) `./pact/principal-namespace.repl` file in your editor and add the
transaction displayed below. The main difference from the previous `Define a new keyset` transaction 
is that the name of the keyset passed to the `define-keyset` function is not passed as the hardcoded
string `election.admin-keyset`. Instead, it is composed of the principal namespace name stored
in the `ns-name` variable and the string `admin-keyset`. The `ns-name` variable, in turn, gets its
value assigned from the return value of a call to the `ns.create-principal-namespace` function. Also note that, before calling `define-keyset` you need to enter the principal namespace first, using
the the statement `(namespace ns-name)`. Finally, you need to add a signature for the transaction
to succeed.

```pact
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
passed and you successfully defined the `admin-keyset` in the principal namespace You are now
ready to define the admin keyset that holds your own admin account's public key in the principal
namespace on your local Devnet.

## Define your keyset on Devnet

Before you define your keyset on Devnet, make sure that Chainweaver is
open and the Devnet network is selected. Also, verify that your admin account exists
and holds KDA on chain 1. Otherwise, repeat the steps in the previous chapters to create
and fund your admin account. Chainweaver needs to remain open, because you will use
it to sign the transaction for defining the keyset. Switch to your editor and open
the file `./snippets/define-keyset.ts`. The `pactCommand` variable contains the
crucial bit of Pact code for defining the keyset in your principle namespace. The code
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

Congratulations! You have defined a keyset in your principle namespace on your local Devnet.
This keyset is governed by your admin account.

## Next steps

In this chapter you learned to define and update a keyset in the Pact REPL,
allowing you to verify the behavior of Pact keysets on your local computer
before defining a keyset on the blockchain. You used
the Kadena JavaScript client to define a keyset in the principal namespace to your local Devnet.
In the next chapter you will create the election Pact module that will become the back-end of the
election website. The pact module will be defined in your principle namespace and it will be
governed by the keyset you defined in this chapter. In later chapters, the keyset will also
be used to guard high impact functions inside the election Pact module, such as nominating
candidates that can receive votes.
