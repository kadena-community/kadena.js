---
title: Interfaces with Pact
description:
  Throughout this tutorial you’ll learn why interfaces are valuable and how to
  implement them with Pact.
menu: Interfaces with Pact
label: Interfaces with Pact
order: 4
layout: full
tags: ['pact', 'tutorials', 'interfaces']
---

# Interfaces with Pact

Welcome to this introduction to **Interfaces with Pact**!

Throughout this tutorial you’ll learn why interfaces are valuable and how to
implement them with Pact.

**Topics covered in this tutorial**

- Introduction to Interfaces
- Interfaces and Modules
- Interface Declaration
- Working with Interfaces
- Declaring Models in an Interface
- Coin Contract Demo

:::note Key Takeaway

Interfaces allow you to provide access to the functions within one module to
another module. They are defined using the `interface` statement and can be
accessed from within modules using the `implement` statement.

:::

## Interfaces with Pact

https://www.youtube.com/watch?v=cbwQNIvg7Go

Subscribe to our
[YouTube Channel](https://www.youtube.com/channel/UCB6-MaxD2hlcGLL70ukHotA) to
access the latest Pact tutorials.

## Introduction to Interfaces

Before getting into interfaces with Pact, I’ll briefly review what interfaces
are in general.

Interfaces are the point where two systems meet and interact. This definition
includes people, organizations, electricity, or any other interactions you can
think of. For example, a light socket is a type of interface that gives you
access to electricity.

In programming, interfaces work similarly, but are used to allow interaction
between programs.

![interfaces_004](/assets/docs/interfaces_004-int.png)

This isn’t specific to Pact, so if you are familiar with other programming
languages, you have likely come across this idea already. If you are unfamiliar
with interfaces, you may have at least a basic understanding of what an API is
(Application Programming Interface).

As you might know, many programs have APIs that allow you to build programs that
give access to specific data. For example, you could use Facebook APIs, Twitter
APIs, Google APIs, or any other API to add functionality to your application
that you wouldn’t have otherwise.

Aside from that, you may be familiar with UI, a User Interface. These types of
interfaces give users access to elements of a program without using code at all.

There are many types of interfaces that have both high level and low level use
cases in programming.

In this tutorial, you’ll focus specifically on building interfaces using Pact
that allow users to create interactions between modules.

### Interfaces and Modules

An interface, as defined in Pact, is a collection of models used for formal
verification, constant definitions, and typed function signatures. They contain
API specifications and data definitions for smart contracts.

_They include each of the following elements:_

- Function Specifications
- Constant Values
- Models

Using these three elements, you can both declare and create interface.

**Declare the Interface** To declare an interface, use the statement `interface`
followed by the name of the interface.

```pact title=" "
(interface my-interface
   ;; interface code goes here
)
```

**Import a module inside an interface** You can also import definitions from
modules with a `use` statement.

**Import Module with Use** Use this module from within an interface.

```pact title=" "
(interface example-interface

  (use example-module)
   ;; interface code goes here
  )
)
```

This allows for some interesting functionality within your interface.

**Access the Interface from a Module** After declaring an interface, you can
access if from a module using the `implements` statement.

```pact title=" "
(module my-module (read-keyset 'my-keyset)
    (implements my-interface)

    ;; module code goes here
)
```

## Modules and Interfaces

Interfaces allow modules to communicate information between one another.

Modules and interfaces look very similar to one another, making them simple to
program, but there are some key distinctions and ideas that are worth noting.

**Interfaces Cannot be Upgraded** Interfaces cannot be upgraded and no function
implementations exist in an interface aside from constant data.

**Constant Imports** The constants of an interface can be imported with `use`.
`Use` is not the same as `implements` and you’ll see some of these important
differences throughout the demonstration.

**Conflicting Module Functions** Multiple interfaces may be implemented by a
single module. If there are conflicting function names among multiple
interfaces, then the two interfaces are incompatible. In these cases you need to
either inline the code you want, or redefine the interfaces to resolve the
conflict.

**Unique Interface Names** Interface names must be unique within a namespace.

**Accessing Interfaces** Constants declared in an interface can be accessed
directly by their fully qualified name.

```pact title=" "
interface.const
```

This makes it so that they do not have the same naming constraints as function
signatures.

**Module Declarations** Additionally, interfaces may make use of module
declarations. This allows interfaces to import members of other modules. For
that reason, interface signatures can be defined in terms of table types defined
in an imported module.

## Declare and Implement an Interface

Using the basic ideas described above, you can create more complex interactions
by defining interfaces modules along with the `implements` and use `statements`.

**Declare an Interface** To start, the example below declares an interface named
**my-interface** including a function named **hello-number**.

```pact title=" "
(interface my-interface
    (defun hello-number:string (number:integer)
      @doc "Return the string \"Hello, $number!\" when given a string"
        )

    (defconst SOME_CONSTANT 3)
)
```

**Implement the Interface** Next, define a module that implements
**my-interface** and makes use of the **hello-number** function.

```pact title=" "
(module my-module (read-keyset 'my-keyset)
    (implements my-interface)

    (defun hello-number:string (number:integer)
        (format "Hello, {}!" [number]))

    (defun square-three ()
        (* my-interface.SOME_CONSTANT my-interface.SOME_CONSTANT))
)
```

Notice also, that within the module, a function named **square-three** is
defined. This function makes use of a constant defined within the interface
named SOME_CONSTANT having imported it with the use statement..

## Declaring Models in an Interface

Formal verification is implemented at multiple levels within an interface in
order to provide an extra level of security. Similar to modules, models may be
declared within the body or function level of an interface. Models may be
declared either within the body of the interface or at the function level in the
same way that one would declare them in a module, with the exception of schema
invariants.

```pact title=" "
(interface coin-sig

  "Coin Contract Abstract Interface Example"

  (use acct-module)

  (defun transfer:string (from:string to:string amount:integer)
    @doc   "Transfer money between accounts"
    @model [(property (row-enforced accounts "ks" from))
            (property (> amount 0))
            (property (= 0 (column-delta accounts "balance")))
            ]
  )
)
```

You can't declare tables or schema in an interface, because there's no abstract
`table` or `schema` that you can define or `\i\m\p\l\e\m\e\n\t` in a meaningful
way. It also couples a module too tightly with a particular interface. You can,
however, import a module and use the declared tables and schema in that module
as types in the function signatures, or in models.

Models that you specify in an interface will be added with additional models you
declare in a module. This allows you to layer more constraints on as you wish
per your business needs in your module.

## Coin Contract Demo

For the rest of this tutorial, you’ll take a closer look interfaces using a
version of the coin contract from previous tutorials. You’ll create an interface
to the coin contract that allows its functions to be accessed by other modules.

**Chainweb Repo**

Rather than using the tutorials GitHub repo like previously, you’ll find this
project within the chainweb-node repo
[here](https://github.com/kadena-io/chainweb-node/blob/master/pact/coin-contract/coin-sig.pact).
Chainweb is Kadena’s public blockchain platform. We haven’t discussed this in
previous tutorials, but we will cover this in more detail in later tutorials.
You don’t need to know what this is for this tutorial, but if you’d like, you
can learn more about the basics of Chainweb
[here](/blogchain/2019/all-about-chainweb-101-and-faqs-2019-02-01).

To get started with the demonstration, clone the project and open it in Atom.

**Clone the project**

```bash title=" "
git clone https://github.com/kadena-io/chainweb-node.git
```

**Enter the Project File**

```bash title=" "
cd chainweb-node/pact/coin-contract/coin-sig.pact
```

**Open in Atom**

```bash title=" "
atom .
```

### Project Visual Overview

Looking at the interface, you’ll see that it includes 5 functions. These
functions contain inputs and models allowing for the basic functionality of
managing coins to be used by other modules.

![interfaces_017](/assets/docs/interfaces_017-int.png)

Let’s take a closer look at this code to get a better idea of how it works.

#### Define the Interface

First, define an interface using the interface statement followed by the name of
the interface.

```pact title=" "
(interface coin-sig
       ;; CODE GOES HERE
)
```

Within this interface, you’ll create each of the functions.

### Function: Create Account

**Create-account** takes inputs **account** and **guard**.

```pact title=" "
  (defun create-account:string (account:string guard:guard)
    @doc "Create an account for ACCOUNT, with ACCOUNT as a function of GUARD"
    @model [ (property (not (= account ""))) ]
    )
```

Within this function, a model is defined checking that the account is not an
empty string. This will ensure that each account is given a name.

### Function: Transfer

Transfer allows users to transfer value between a sender and a receiver.

```pact title=" "
  (defun transfer:string (sender:string receiver:string amount:decimal)
    @doc "Transfer between accounts SENDER and RECEIVER on the same chain.    \
    \This fails if both accounts do not exist. Create-on-transfer can be      \
    \handled by sending in a create command in the same tx."

    @model [ (property (> amount 0.0))
             (property (not (= sender receiver)))
           ]
    )
```

It checks that the amount is greater than 0 and that the sender is not also the
receiver before completing the transfer.

The function `transfer` transfers coins to a known account. If that account
doesn’t exist then the coins end up lost in the abyss with no way to retrieve
them. For that reason, you may want to instead use the following function,
transfer and create.

### Function: Transfer and Create

```pact title=" "
  (defun transfer-and-create:string (sender:string receiver:string receiver-guard:guard amount:decimal)
    @doc "Transfer between accounts SENDER and RECEIVER on the same chain.    \
    \This fails if SENDER does not exist or RECEIVER exists and RECEIVER-GUARD does not      match with the guard in RECEIVER’s account
    \Create-on-transfer can be      \
    \handled by sending in a create command in the same tx."
    @model [ (property (> amount 0.0))
             (property (not (= sender receiver)))
           ]
    )
```

`Transfer and create` supplies a guard for the receiving account. If the account
exists, it checks to see if the guards match. If they do, it will complete the
transfer, otherwise the transaction will fail. If the account does not exist,
then the account will be created and the coin will be transferred to the new
account.

:::info Safe vs Unsafe Transfers

The previous functions distinguish between "unsafe" and “safe” transfers. With
unsafe transfers, your tokens could potentially get lost in the crypto abyss.
With “safe” transfers, your tokens always end up in some account,otherwise the
transaction fails and you are refunded.

:::

### Function: Account Balance

The function **account-balance** takes an account string and returns the balance
of the account.

```pact title=" "
  (defun account-balance:decimal (account:string)
    @doc "Query user account ACCOUNT balance")
```

### Function: Coinbase

Coinbase allows users to mint tokens to an address by defining the address,
address-guard, and amount.

```pact title=" "
    (defun coinbase:string (address:string address-guard:guard amount:decimal)
    @doc "Mint some number of tokens and allocate them to some address"

    @model [ (property (> amount 0.0))
             (property (not (= address "")))
           ]
    )
```

:::info What does Coinbase mean?

The **Coinbase transaction**, or **Generation transaction**, is a special
**transaction**. It specifically refers to a transaction that creates coins from
nothing. In certain blockchain protocols, it is the reward that miner gets for
successfully mining a block. It’s also the name of a popular digital asset
exchange company named Coinbase.

:::

Having created each of these functions within the interface, you can now create
modules that use them for whatever purpose they might serve within your
application.

### Review

That wraps up this introduction to Interfaces with Pact!

Throughout this tutorial you learned why interfaces are valuable and how to
implement them with Pact.

We introduced interfaces and described how they are different than modules. From
there you learned how to declare modules, how to work with interfaces, and
viewed a demo app that put these basic ideas to use.

Take some time now to explore these ideas further, study the code demonstration,
and try building an interface for yourself to get a better idea of how you can
use this idea in your future applications.
