---
title: 'Define keysets'
description: 'Learn how to define keysets in your principal namespace.'
menu: 'Workshop: Election application'
label: 'Define keysets'
order: 5
layout: full
tags: [account, keyset, namespace, governance, authorization, tutorial]
---

# Define keysets

As you learned in
[Add an administrator account](/build/guides/election-dapp-tutorial/add-admin-account)
and
[Define a namespace](/build/guides/election-dapp-tutorial/define-a-namespace),
keysets determine rules for signing transaction and controlling the accounts
that can access and update the namespaces where you deploy smart contracts. This
tutorial demonstrates how to define the `admin-keyset` in the principal
namespace that you created in
[Define a namespace](/build/guides/election-dapp-tutorial/define-a-namespace)
using the public key of the administrative account you created in
[Add an administrator account](/build/guides/election-dapp-tutorial/add-admin-account).

After you define the `admin-keyset` in your principal namespace, you'll be able
to use it to authorize your administrative account to submit specific types of
transactions for the election application you're building. For example, you'll
be able to authorize transactions that deploy and upgrade the election smart
contract and that nominate the candidates that other accounts can vote on.

## Before you begin

Before you start this tutorial, verify the following basic requirements:

- You have an internet connection and a web browser installed on your local
  computer.
- You have a code editor, such as
  [Visual Studio Code](https://code.visualstudio.com/download), access to an
  interactive terminal shell, and are generally familiar with using command-line
  programs.
- You have cloned the
  [election-dapp](https://github.com/kadena-community/voting-dapp.git)
  repository as described in
  [Prepare your workspace](/build/guides/election-dapp-tutorial/prepare-your-workspace)
  and have checked out the `01-getting-started` branch.
- You have the development network running in a Docker container as described in
  [Start a local blockchain](/build/guides/election-dapp-tutorial/start-a-local-blockchain).
- You are
  [connected to the development network](/build/guides/election-dapp-tutorial/start-a-local-blockchain#connect-to-the-development-network)
  using your local host IP address and port number 8080.
- You have created and funded an administrative account as described in
  [Add an administrator account](/build/guides/election-dapp-tutorial/add-admin-account).
- You have created a principal namespace on the development network as described
  in
  [Define a namespace](/build/guides/election-dapp-tutorial/define-a-namespace).

## Write a transaction to define a keyset

Like the previous tutorial, in this tutorial, you'll write and execute Pact code
in the Pact REPL. After testing the transaction to define a keyset in the Pact
REPL, you'll define a keyset to use on your local development network.

To define a keyset:

1. Open the `election-dapp/pact` folder in a terminal shell on your computer.

2. Create a new file named `keyset.repl` in the `pact` folder.

3. Write an empty transaction by typing the following lines of code in the
   `keyset.repl` file:

   ```pact
   (begin-tx
     "Define a new keyset"
   )
   (commit-tx)
   ```

4. Execute the transaction using the `pact` command-line program running locally
   or using [pact-cli](http://localhost:8080/ttyd/pact-cli/) from the Docker
   container.

   If `pact-cli` is installed locally, run the following command in the current
   terminal shell:

   ```bash
   pact keyset.repl -t
   ```

   After you execute the transaction, you should see the following output:

   ```bash
   keyset.repl:1:0:Trace: Begin Tx 0: Define a new keyset
   keyset.repl:4:0:Trace: Commit Tx 0: Define a new keyset
   Load successful
   ```

   As before, if you don't have `pact` installed locally, you can load the
   `keyset.repl` file in the [pact-cli](http://localhost:8080/ttyd/pact-cli/)
   from the Docker container with the following command:

   ```pact
   (load "keyset.repl")
   ```

   If you are using the `pact-cli` in a browser, you can replace the
   `pact keyset.repl -t` command with `(load "keyset.repl")` throughout this
   tutorial.

## Add functions to define the keyset

Pact has a built-in function—`define-keyset`—that you can use to define keysets.
This function takes two arguments:

- The name keyset of the keyset.
- The keyset—that is, one or more keys and a predicate—that you want to
  associate with the keyset name you re defining.

The `define-keyset` function is wrapped by the `expect` function to test that
calling `define-keyset` will succeed. The `expect` function takes three
arguments:

- The title of the test.
- The expected output of the `define-keyset` function.
- The `define-keyset` function call.

The first argument of expect is the title of the test, the second argument is
the expected output of the `define-keyset` function and the third argument is
the actual `define-keyset` function call.

To define a keyset:

1. Open the `election-dapp/pact/keyset.repl` file in a terminal shell on your
   computer.

2. Add the following lines of code between the `begin-tx` and `commit-tx` lines:

   ```pact
   (expect
     "A keyset can be defined"
     "Keyset defined"
     (define-keyset "admin-keyset" (read-keyset 'admin-keyset))
   )
   ```

3. Execute the transaction using the `pact` command-line program by running the
   following command in the current terminal shell:

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

   As you saw when defining a namespace, you must load the `admin-keyset` into
   the context of the Pact REPL so it can be read using the `read-keyset`
   function.

4. Add the following lines at the top of the `keyset.repl` file:

   ```pact
   (env-data
     { 'admin-keyset :
       { 'keys : [ 'admin-public-key ]
       , 'pred : 'keys-all
       }
     }
   )
   ```

   If you execute the transaction now, however, it will fail with the following
   error:

   `Cannot define a keyset outside of a namespace`

   As this error indicates, keysets must be defined within the context of a
   specific namespace.

5. Add the following transaction to define the `election` namespace before the
   transaction to define a keyset.

   ```pact
   (begin-tx
     "Define a namespace to define the keyset in"
   )
   (define-namespace 'election (read-keyset 'admin-keyset) (read-keyset 'admin-keyset))
   (commit-tx)
   ```

6. Modify the `Define a new keyset` transaction to specify the `election`
   namespace as a prefix for the new keyset with the following lines of code:

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

7. Execute the transaction using the `pact` command-line program:

   ```bash
   pact keyset.repl -t
   ```

   You'll see that this transaction still fails, but with a different error.
   This time the error message is:

   `Keyset failure (keys-all): [admin-ke...]`

   The transaction failed because it isn't following the signing rules specified
   by the keyset passed to the `define-keyset` function.

8. Sign the transaction with the key from the `admin-keyset` you loaded into the
   context of the Pact REPL.

   For example, sign the transaction with the `admin-public-key` by adding the
   following lines of code before the `Define a new keyset` transaction:

   ```pact
   (env-sigs
     [{ 'key  : 'admin-public-key
      , 'caps : []
     }]
   )
   ```

9. Execute the transaction using the `pact` command-line program:

   ```bash
   pact keyset.repl -t
   ```

   You'll now see that the transaction succeeds with output similar to the
   following:

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

   You now have a keyset named `admin-keyset` in the `election` namespace in the
   Pact REPL.

## Test keyset authorization

The `election.admin-keyset` you just defined is protected by the `admin-keyset`
that has only one key, the `admin-public-key`. Only this account is authorized
to call the `define-keyset` function to modify or update the
`election.admin-keyset` definitions. Transactions that use any other key will
fail.

To test keyset authorization and verify that no other accounts can take control
of your namespace, you can add another test case to the `keyset.repl` file.

To test keyset authorization works as expected:

1. Open the `election-dapp/pact/keyset.repl` file in a terminal shell on your
   computer.

2. Load the `admin-keyset` with a different public key than you previously used
   into the context of the Pact REPL.

   For example, add the following lines to the bottom of the `keyset.repl` file:

   ```pact
   (env-data
     { 'admin-keyset :
       { 'keys : [ 'other-public-key ]
       , 'pred : 'keys-all
       }
     }
   )
   ```

   These lines establish a different context for the transaction trying to
   change the keyset definition.

3. Sign the transaction with the key from the `admin-keyset` you loaded into the
   context of the Pact REPL.

   For example, sign the transaction with the `other-public-key` by adding the
   following lines of code after the lines changing the context and before the
   new `Define a keyset` transaction:

   ```pact
   (env-sigs
     [{ 'key  : 'other-public-key
      , 'caps : []
     }]
   )
   ```

4. Add a transaction to define a new keyset using the `other-public-key` in the
   `admin-keyset` and change the `expect` function to `expect-failure` with the
   following lines of code:

   ```pact
   (begin-tx
     "Define a keyset using a different keyset fails"
   )
   (namespace 'election)
   (expect-failure
     "keyset definition is already defined using a different keyset"
     "Keyset failure (keys-all): 'election.admin-keyset"
     (define-keyset "election.admin-keyset" (read-keyset 'admin-keyset))
   )
   (commit-tx)
   ```

5. Execute the transaction using the `pact` command-line program:

   ```bash
   pact keyset.repl -t
   ```

   You'll see that the transaction to change the `election.admin-keyset`
   fails—as expected—with output similar to the following:

   ```bash
   keyset.repl:33:0:Trace: Setting transaction signatures/caps
   keyset.repl:38:0:Trace: Begin Tx 2: Define a keyset using a different keyset fails
   keyset.repl:41:2:Trace: Namespace set to election
   keyset.repl:42:2:Trace: Expect failure: success: keyset definition is already defined using a different keyset
   keyset.repl:47:2:Trace: Commit Tx 2: Define a keyset using a different keyset fails
   Load successful
   ```

   This output proves that the `election.admin-keyset` can only be governed by
   the account with the `admin-public-key` and can't be modified by an account
   that uses a different key.

## Rotate the keyset

The previous example illustrated that an unauthorized account can't take control
of your namespace. However, it is possible for you to transfer governance
permissions to someone else by **rotating** the `election.admin-keyset` to use a
different key. Keyset rotation can be useful in many situations. For example, if
the administrator of an election resigns or retires, you can use keyset rotation
to add the signature of a new authorized successor to the original
`admin-public-key` in a new transaction.

To rotate the keyset to accept a new signature:

1. Open the `election-dapp/pact/keyset.repl` file in a terminal shell on your
   computer.

2. Add signatures for both authorized accounts using the following lines of
   code:

   ```pact
   (env-sigs
     [{ 'key  : 'other-public-key
      , 'caps : []
     }
     ,{ 'key  : 'admin-public-key
      , 'caps : []
     }]
   )
   ```

3. Add a new transaction that allows the `election.admin-keyset` to be modifies
   and is expected to succeed:

   ```pact
   (begin-tx
     "Rotating the existing keyset to a new keyset works if the transaction is signed with the original admin-public-key"
   )
   (namespace 'election)
   (expect
     "Keyset can be rotated"
     "Keyset defined"
     (define-keyset "election.admin-keyset" (read-keyset 'admin-keyset))
   )
   (commit-tx)
   ```

4. Execute the transaction using the `pact` command-line program:

   ```bash
   pact keyset.repl -t
   ```

   You'll see that the transaction to change the `election.admin-keyset`
   fails—as expected—with output similar to the following:

   ```bash
   keyset.repl:49:2:Trace: Setting transaction signatures/caps
   keyset.repl:57:2:Trace: Begin Tx 3: Rotating the existing keyset to a new keyset works if the transaction is signed with the original admin-public-key
   keyset.repl:60:2:Trace: Namespace set to election
   keyset.repl:61:2:Trace: Expect: success: Keyset can be rotated
   keyset.repl:66:2:Trace: Commit Tx 3: Rotating the existing keyset to a new keyset works if the transaction is signed with the original admin-public-key
   Load successful
   ```

   This output indicates that your test passed and you have successfully rotated
   the `election.admin-keyset` to be governed by an `admin-keyset` that contains
   the public key `other-public-key`.

## Test your keyset definition

In
[Define a namespace](/build/guides/election-dapp-tutorial/define-a-namespace),
you defined a principal namespace for your local development network. In this
tutorial, you'll add a keyset definition for your account to govern that
principal namespace. As a best practice, you can use the Pact REPL to test the
transaction before you submit it on the development network.

To test your keyset definition:

1. Open the `election-dapp/pact/principal-namespace.repl` file in your code
   editor.

   You might remember that this file:

   - Loads the public key of the `sender00` account and the `ns` module from the
     local filesystem into the context of the Pact REPL.
   - Creates the principal namespace using the `ns-name` variable.

2. Add the following transaction to define the keyset:

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

   This code adds a signature for the transaction and stores the name of the
   principal namespace in the `ns-name` variable. The variable is used in the
   `(namespace ns-name)` function to enter the principal namespace before
   calling the `define-keyset` function. In the `define-keyset` function, the
   keyset name is composed from the principal namespace name stored in the
   `ns-name` variable and the string `admin-keyset` instead of a hardcoded
   `election.admin-keyset` string.

3. Execute the transaction using the `pact` command-line program:

   ```bash
   pact principal-namespace.repl -t
   ```

   You'll see that the transaction succeeds with output similar to the
   following:

   ```bash
   principal-namespace.repl:31:0:Trace: Begin Tx 2: Define a keyset in the principal namespace
   principal-namespace.repl:34:0:Trace: Expect: success: A keyset can be defined in a principal namespace
   principal-namespace.repl:42:0:Trace: Commit Tx 2: Define a keyset in the principal namespace
   Load successful
   ```

   In this example, you defined a keyset in the Pact REPL using the public key
   for `sender00` account. Next, you can define a keyset in your principal
   namespace on the development network using the administrative account you
   created in
   [Add an administrator account](/build/guides/election-dapp-tutorial/add-admin-account).

## Define your keyset in your principal namespace

Now that you've seen how to use the `define-keyset` and how to enter your
namespace with the `namespace` functions, you're ready to define keyset for the
your principal namespace on the local development network with the
administrative account you created using Chainweaver.

To define your keyset on the development network:

1. Verify the development network is currently running on your local computer.

2. Open and unlock the Chainweaver desktop or web application and verify that:

   - You're connected to **development network (devnet)** from the network list.
   - Your administrative account name with the **k:** prefix exists on chain 1.
   - Your administrative account name is funded with KDA on chain 1.

   You're going to use Chainweaver to sign the transaction that defines the
   keyset.

3. Open the `election-dapp/snippets/define-keyset.ts` file in your code editor.

   The `pactCommand` variable in this file contains the same Pact code for
   defining a keyset that you tested in the Pact REPL. After the `pactCommand`,
   the next lines construct the transaction and wait for the signature from
   Chainweaver.

4. Open the `election-dapp/snippets` folder in a terminal shell on your
   computer.

5. Create the keyset for your principal namespace using the `define-keyset`
   script by running a command similar to the following with your administrative
   account name:

   ```bash
   npm run define-keyset:devnet -- k:<your-public-key>
   ```

   Remember that `k:<your-public-key>` is the default **account name** for your
   administrative account that you funded in
   [Add an administrator account](/build/guides/election-dapp-tutorial/add-admin-account).
   You can copy this account name from Chainweaver when viewing the account
   watch list. When you run the script, you should see Chainweaver display a
   QuickSign Request.

6. Click **Sign All** to sign the request.

   After you click Sign All, the transaction is executed and the results are
   displayed in your terminal shell. For example, you should see output similar
   to the following:

   ```bash
   { status: 'success', data: 'Keyset defined' }
   ```

You now have a **keyset definition** that governs your principal namespace on
the local development network. This keyset is governed controlled by the
administrative account you created in Chainweaver.

## Next steps

In this tutorial, you learned how to:

- Define and update a keyset in the Pact REPL.
- Test the behavior of keysets before defining a keyset on the blockchain.
- Use the Kadena client to define a keyset in your principal namespace in the
  local development network.

In the next tutorial, you'll create your first **Pact module** for the election
application. You'll define the Pact module inside of your principal namespace
and control how it's used with the keyset you defined in this tutorial. After
you complete the tutorial, you'll have the basic functionality for the election
website.

To see the code for the activity you completed in this tutorial and get the
starter code for the next tutorial, check out the `06-smart-contracts` branch
from the `election-dapp` repository by running the following command in your
terminal shell:

```bash
git checkout 06-smart-contracts
```
