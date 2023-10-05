---
title: "06: Smart contract"
description: "Election dApp tutorial chapter 06: Smart contract"
menu: Election dApp tutorial
label: "06: Smart contract"
order: 6
layout: full
tags: [pact, smart contract, typescript, tutorial]
---

# Chapter 06: Smart contract

A smart contract is an application on the blockchain. On the Kadena blockchain, a smart
contract consists of one or more Pact modules. The election smart contract in this tutorial
will consist of two modules: the main election module and an auxiliary gas station module. In
this chapter, you will lay the foundation of the election module. Through a series of
exercises you will learn the basics of deploying, using and upgrading Pact modules. At the end
of the chapter you will deploy the election module to your local Devnet. In the following
chapters you will gradually add more logic to the module.

## Recommended reading

 * [Pact Modules](https://docs.kadena.io/learn-pact/beginner/modules)
 * [Capabilities](https://pact-language.readthedocs.io/en/latest/pact-reference.html#capabilities)
 * [Pact: Solving Smart Contract Governance and Upgradeability](https://medium.com/kadena-io/pact-solving-smart-contract-governance-and-upgradeability-976aac3bbb31)

## Exercise: Define the election Pact module

In this exercise you will test the deployment and upgrade of a Pact module in the Pact REPL.
You will start with debugging the minimal requirements for deploying a Pact module until you
have a working deployment. Then, you will refactor the Pact module to be governed with a
capability instead of a keyset directly. In the `./pact` folder, create a `module.repl` file.
Write the following in the file: a transaction to define a module named `election`.

```pact
(begin-tx
  "Deploy the election module"
)
  (module election)
(commit-tx)
```

if you have the pact executable installed locally, you can run the `module.repl`
file using the following command in a terminal with the current directory set
to the root of your project.

```bash
pact pact/module.repl -t
```

If you do not have the pact executable installed locally, you can run the `module.repl`
file from the [pact ttyd in your browser](http://localhost:8080/ttyd/pact-cli/).
Make sure that your local Devnet is running.

```pact
(load "keyset.repl")
```

Run the `module.repl` file and notice the following error.

```bash
error: Unexpected end of input, Expected: atom, Expected: literal
```

You need to add another argument to the module definition: a keyset or a capability that
governs the module. Update the content of `module.repl` as follows and run the file again.

```pact
(begin-tx
  "Deploy the election module"
)
  (module election "election.admin-keyset")
(commit-tx)
```

A new error will appear.

```bash
error: Unexpected end of input, Expected: list
```

This error means that it is not possible to create an empty Pact module. Add a function `list-candidates` that will be used later to list the candidates in the respective database
tables. For now, this function will just return an empty list `[]`.

```pact
(begin-tx
  "Deploy the election module"
)
  (module election "election.admin-keyset"
    (defun list-candidates () [])
  )
(commit-tx)
```

When you run file again, you should see an error that looks familiar.

```bash
Error: No such keyset: 'election.admin-keyset
```

Remember from the previous chapter that you can only define a keyset in a namespace. Add the
following code before the transaction to define the `election` namespace and define the
`election.admin-keyset`. Then, run the `module.repl` file again.

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

At the end of the output you will see `Load successful`, which means that you have
successfully defined the `election` Pact module in the `election` namespace. While the
module itself is governed by the `election.admin-keyset`, the `list-candidate` function
of the module is publically accessible. In the next exercise you will prove that the
`election` module works by testing the `list-candidates` function.

## Exercise: Use the election Pact module

Remember from earlier chapters that there is a global Pact function `list-modules` that
lists all Pact modules deployed on the blockchain. This function can also be used in
the Pact REPL. Add the following transaction to `module.repl` to assert that the `election`
module is available and run it.

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

If all is well, the last line of the output should be `Load successful` and you have proven
that the `election` module is defined in the Pact REPL. But does it actually work? Add the
following transaction to `module.repl`, which calls the `list-candidates` function on the
`election` module and asserts that it returns an array. Also, clear the environment to make
sure that the function is accessible without a keyset and signature.

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

The last line of the output should be `Load successful` again, meaning that you successfully
received an empty list from the `list-candidates` function without having to sign the
transaction. This is an important requirement for the eventual election website, because
in a democracy, the list of candidates should be publically accessible.

## Exercise: Upgrade the election Pact module

The `election` module was defined with a keyset to govern the module. Every subsequent upgrade
- i.e. change - of the module will only be allowed if the upgrade transaction is signed with
that keyset. In this exercise you will examine two scenarios for upgrading a Pact module: with
the correct keyset and with an incorrect keyset. Add the following code after the last
transaction in `module.repl`. This code reloads the correct keyset and signature into the Pact 
REPL, redefines the `election` module with the `list-candidates` function returns a different
list, and tests that `list-candidates` now returns the new list.

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
  (namespace 'election)
  (module election "election.admin-keyset"
    (defun list-candidates () [1, 2, 3])
  )
(commit-tx)

(env-data {})
(env-sigs [])

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

The last line of the output should be `Load successful` again, meaning that you successfully
upgraded the `election` module and the `list-modules` function indeed returns a different
value after the upgrade.

Earlier, you used `expect-failure` in the test REPL to catch and test errors
that were thrown as a result of an illegal attempt to redefine a namespace or keyset. This will
not work with module definitions, because they are special in nature. It is possible to see
what happens when someone illegally tries to redefine a module without wrapping the attempt in
an `except-failure` assertion. However, the execution of the `module.repl` file will be marked
as a failure. For demonstration purposes, it does not matter, so go ahead and add the following
code at the end of the file and run it again.

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

If all is well, the last line of the output should be `Load failed`. A few lines up you will notice a `Keyset failure` error. This means that another keyset than the
`election.admin-keyset` cannot update the `election` module. So, you have proven that you can
govern a Pact module with a keyset. Remove the code to continue with the next exercise.

## Exercise: Governance with Capability

The `election.admin-keyset` that governs the `election` module will later be used to restrict
access to high impact functions of the modules, such as nominating new candidates. To keep the
module code DRY (Don't Repeat Yourself) and descriptive, you will use a capability to govern
the module instead of the keyset directly. Add the following code after the last transaction
in `module.repl`. It defines a capability `GOVERNANCE` that enforces the keyset
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

The last line of the output should be `Load successful`, meaning that the you successfully
upgraded the `election` module to be governed by a capability. Using the examples from the
exercises in this chapter, you can write additional test cases to verify if the
`election.admin-keyset` is still able to upgrade the module now that governance of the module
is implemented with a capability.

## Deploy the election Pact module to Devnet

Before you deploy your Pact module to Devnet, make sure that Chainweaver is
open and the Devnet network is selected. Chainweaver needs to remain open, because you will
use it to sign the transaction for deploying the module. Also, verify that the following
requirements are met:

 * your admin account exists on chain 1 of Devnet
 * your admin account has a positive KDA balance
 * the `admin-keyset` is defined in your principle namespace on Devnet

If these requirements are not met, repeat the steps in the previous chapters. Create a file
`election.pact` in the `./pact/` folder of your project and add the final Pact module code
from the exercises above to it. Replace the principal namespace with the one you defined
on Devnet in the previous chapter in both places.

```pact
(namespace 'n_fd020525c953aa002f20fb81a920982b175cdf1a)

(module election GOVERNANCE
  (defcap GOVERNANCE ()
    (enforce-keyset "n_fd020525c953aa002f20fb81a920982b175cdf1a.admin-keyset"))

  (defun list-candidates () [1, 2, 3])
)
```

Open the file `./snippets/deploy-module.ts` and you will notice there are some differences
compared to the previous snippets you used. First of all, the Pact code to execute is not
passed as a string or a function call on something like `Pact.modules.coin`. Instead, the
code is read from your `election.pact` file. This helps you keep your code organized.
Second, a very high gas limit is specified in the metadata of the transaction. This is
necessary, because deploying a Pact module costs a lot of gas and the transaction will
fail if you use the default gas limit. Finally, after signing the transaction, a preflight
request for the signed transaction is sent to the blockchain using the Kadena client. This
The response contains feedback about the expected success of the transaction and the
amount of gas the transaction will cost. If the feedback is negative, the snippet will not
send the actual transaction to the blockchain. This is economical, because you would have
to pay for gas, even if a transaction fails. So, for expensive transactions like deploying
a module it is recommended to make a preflight request before sending the actual
transaction to the blockchain.

Open up a terminal and change the directory to the `./snippets` folder in the root of
your project. Execute the `./deploy-module.ts` snippet by running the following command.
Replace `k:account` with your admin account.

```bash
npm run deploy-module:devnet -- k:account
```

The Chainweaver window usually comes to the foreground as soon as there is a new signing
request for one of your accounts. If not, manually bring the Chainweaver window
to the foreground. You will see a modal with details of the signing request.
Click `Sign All` to sign the request and switch back to your terminal window.
If everything went well, you will see something similar to the following output.

```bash
{
  status: 'success',
  data: 'Loaded module n_fd020525c953aa002f20fb81a920982b175cdf1a.election, hash xJZhwnEffBNXySXJFpEAAES_TUd-PJE8BCG6YBi736E'
}
```

Congratulations! You have deployed a smart contract consisting of the `election` module that
is governed by the `admin-keyset` in your principal namespace on your local Devent.
If you would now run the `list-modules:devnet` script, you will find your module in the list
of deployed modules.

```bash
npm run list-modules:devnet
```

Open Chainweaver and navigate to `Contracts` via the left navigation bar. Select the
`Module Explorer` tab in the right panel and search for `election` on chain 1 under
`Deployed Contracts`. You may have to click the refresh button on the right above the table
with contracts for your module to show up. Click the `View` button to the right of the name
of your module. In the right panel you will see the name of the function and capability
that you defined in the module. On the top right of the panel, click `Open` to see the
content of the module. Notice that the statement for selecting the namespace is not
displayed. It is not considered part of the module itself. In the right pane, click the
`Call` button to the right of the `list-candidates` function. In the modal that pops up,
do not click `Next`, but select the `Preview` tab and scroll down. There you will see
the `Raw Response` from the blockchain displayed as `[1, 2, 3]`. This is an actual
response from the blockchain that you are able to receive without paying gas, which is
similar to the `dirtyRead` method of the Kadena JavaScript client. You will learn more
about that in the next chapter. In situations that allow it, this is a cheaper alternative
than sending an actual transaction to the blockchain to call the module function, since
sending a transaction requires you to pay for gas.

Update `./pact/election.pact` in your editor to return a different list, like `[1, 2, 3, 4, 5]`
and upgrade the module using the `deploy-module:devnet` npm script. View your module in
Chainweaver and click `Open` once more to refresh the module and confirm that the module
is upgraded according to your expectations. Click the `Call` button to the right of the
`list-candidates` function again, select the `Preview` tab in the modal and scroll all
the way down. The `Raw Response` from the blockchain should now display `[1, 2, 3, 4, 5]`,
or whatever you changed the return value of the function to.

The only thing that is left is to verify that other accounts cannot upgrade your election
module on Devnet. Navigate to `Keys` via the left navigation bar of Chainweaver and
generate a new key. Add a `k:account` for the new key and copy it. Run the following script to
create and fund the account on your Devnet. Replace `k:account` with this new account.

```bash
npm run transfer-create:devnet -- k:account
```

Now try to upgrade the `election` module using the following script, again replacing `k:account` with the new account.

```bash
npm run deploy-module:devnet -- k:account
```

If all is well, the transaction should fail with a `Keyset failure (keys-all)`. This means that your Pact module is safely protected on the blockchain by the `admin-keyset` that contains
the public key of your admin account.

## Next steps

In this chapter you learned how to deploy, use and upgrade a Pact module. You implemented
governance of the module with a keyset and with a capability. Moreover, you verified that
it is impossible for others to make changes to a Pact module governed by your keyset. In the
next chapter, you will add a schema and a database table to the `election` module. The table
will store the names of election candidates and the number of votes they received. The
`list-candidates` function will remain public and will read data from the database table.
You will add another function to nominate candidates, guarded by the governance capability
you defined in this chapter. The election website will come to life as you will connect
the front-end to the `election` module on Devnet.
