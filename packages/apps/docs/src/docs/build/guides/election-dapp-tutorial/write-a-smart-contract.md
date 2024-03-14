---
title: 'Write a smart contract'
description:
  'Use the Pact smart contract language to build the scaffolding for the
  election application smart contract backend.'
menu: 'Workshop: Election application'
label: 'Write a smart contract'
order: 6
layout: full
tags: [pact, smart contract, typescript, tutorial]
---

# Write a smart contract

Now that you have a unique namespace controlled by your administrative keyset,
you're ready to start building the backend for the election application. In this
tutorial, you'll learn the basics of how to write a **smart contract** that can
be deployed on the blockchain as the backend code for the election application.

A smart contract is a special type of application runs automatically when the
conditions specified in the contract logic are met. By deploying a smart
contract on a blockchain, the terms of an agreement can be executed
programmatically in a decentralized way, without any intermediary involvement or
process delays.

On the Kadena blockchain, a smart contract consists of one or more **modules**
written in the Pact programming language. For this tutorial, the election smart
contract consists of two modules: the main **election** module and an auxiliary
**gas station** module.

The exercises in this tutorial illustrate the basics of building and deploying a
Pact module as you develop the main election module. At the completion of this
tutorial, you'll deploy the core logic of the election module on your local
development network.

## Before you begin

Before you start this tutorial, verify the following basic requirements:

- You have an internet connection and a web browser installed on your local
  computer.
- You have a code editor, such as
  [Visual Studio Code](https://code.visualstudio.com/download), access to an
  interactive terminal shell, and are generally familiar with using command-line
  programs.
- You have cloned the
  [election-dapp](https://github.com/kadena-community/voting-dapp.git
  election-dapp) repository as described in
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
- You have defined the keyset that controls your namespace using the
  administrative account as described in
  [Define keysets](/build/guides/election-dapp-tutorial/define-keysets).

## Define a minimal Pact module

To get started writing Pact modules, you must have a file that contains the bare
minimum of code required to deploy. You can create and test this starter code
for a Pact module using the Pact REPL. After you have a minimal working
deployment, you can add and refactor the code to add functionality to the Pact
module.

To create the starter code for a Pact module:

1. Open the `election-dapp/pact` folder in a terminal shell on your computer.

2. Create a new file named `module.repl` in the `pact` folder.

3. Add a transaction that defines a module named `election` by typing the
   following lines of code in the `module.repl` file:

   ```pact
   (begin-tx
     "Deploy the election module"
   )
     (module election)
   (commit-tx)
   ```

4. Execute the transaction using the `pact` command-line program running locally
   or using [pact-cli](http://localhost:8080/ttyd/pact-cli/) from the Docker
   container.

   If `pact-cli` is installed locally, run the following command in the current
   terminal shell:

   ```bash
   pact module.repl -t
   ```

   As before, if you don't have `pact` installed locally, you can load the
   `module.repl` file in the [pact-cli](http://localhost:8080/ttyd/pact-cli/)
   from the Docker container with the following command:

   ```pact
   (load "module.repl")
   ```

   If you are using the `pact-cli` in a browser, you can replace the
   `pact module.repl -t` command with `(load "module.repl")` throughout this
   tutorial.

   You'll see that this transaction fails with an error similar to the
   following:

   ```bash
   error: Unexpected end of input, Expected: atom, Expected: literal
   ```

   Modules require you to define either a **keyset** or a **capability** guard
   to govern access to the module's functions. Capabilities are similar to
   keysets in that they control permissions—who can do what—in the context of a
   Pact smart contract. You'll learn more about capabilities in this tutorial
   and in other tutorials. For now, you can use the `admin-keyset` you defined
   in the previous tutorial.

5. Add the `admin-keyset` to the transaction to define the `election` module in
   the `module.repl` file:

   ```pact
   (begin-tx
     "Deploy the election module"
   )
     (module election "election.admin-keyset")
   (commit-tx)
   ```

   If you execute the transaction in the Pact REPL now, you'll see a different
   error:

   ```bash
   error: Unexpected end of input, Expected: list
   ```

   Although you've added an owner to the module, the module doesn't yet include
   any functions. You must define at least one function in a Pact module for the
   module to be valid.

6. Add a `list-candidates` function to the transaction that defines the
   `election` module.

   ```pact
   (begin-tx
     "Deploy the election module"
   )
     (module election "election.admin-keyset"
       (defun list-candidates () [])
     )
   (commit-tx)
   ```

   Later, you'll update this function to list the candidates stored in ae
   database table. For now, this function just returns an empty list (`[]`). If
   you execute the transaction in the Pact REPL now, you should see a familiar
   error:

   ```bash
   Error: No such keyset: 'election.admin-keyset
   ```

   Remember that you can only define a keyset in a namespace. The current
   `module.repl` file doesn't define a namespace, so it can't define or use the
   keyset you've specified for the module definition.

7. Add the following code—which should look familiar from the previous
   tutorials—before the transaction to define the `election` module:

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

8. Execute the transaction using the `pact` command-line program:

   ```pact
   pact module.repl -t
   ```

   You'll now see that the transaction succeeds with output similar to the
   following:

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

   You now have all of the starter code required to defined the Pact `election`
   module in the `election` namespace. The module is governed by the
   `election.admin-keyset` and only includes one function.

## Test the election module

Although the `election` module is governed by a keyset and can't be modified
without a signed transaction, the `list-candidate` function publicly accessible.
You can use the global `list-modules` Pact function in the Pact REPL to test
access to the `election` module and the `list-candidate` function.

To test access to the election module:

1. Open the `election-dapp/pact/module.repl` file in the code editor on your
   computer.

1. Add the following transaction to assert that the `election` module is
   available:

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

1. Execute the transaction using the `pact` command-line program:

   ```pact
   pact module.repl -t
   ```

   You should see output similar to the following that indicates the `election`
   module is defined in the Pact REPL:

   ```bash
   module.repl:35:0:Trace: Begin Tx 3: Look up the election module
   module.repl:38:3:Trace: Expect: success: The election module should exist
   module.repl:43:1:Trace: Commit Tx 3: Look up the election module
   Load successful
   ```

1. Add the following lines of code to the `module.repl` file to clear the
   environment keyset and signature information, call the `list-candidates`
   function on the `election` module, and assert that the function returns an
   array:

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

1. Execute the transaction using the `pact` command-line program:

   ```pact
   pact module.repl -t
   ```

   You should see output similar to the following that indicates you were able
   to call the `list-candidates` function without signing the transaction and
   that the function returned an empty list:

   ```bash
   module.repl:44:0:Trace: Setting transaction data
   module.repl:45:0:Trace: Setting transaction signatures/caps
   module.repl:47:0:Trace: Begin Tx 4: Call list-candidates
   module.repl:50:5:Trace: Expect: success: list-candidates returns an empty list
   module.repl:55:0:Trace: Commit Tx 4: Call list-candidates
   Load successful
   ```

   Proving that you can call this function inside of the `election` module
   without an identity context or a signature is important because, in a
   democracy, the list of candidates should be publicly accessible.

## Upgrade the election Pact module

When you defined the `election` module, you specified the keyset used to govern
it. Every change to the module requires the upgrade transaction to be signed
with that keyset. To test that upgrades works as expected, you can try upgrading
the Pact module with the correct keyset and with an incorrect keyset.

### Upgrade using the correct keyset

To test upgrading with the correct keyset:

1. Open the `election-dapp/pact/module.repl` file in the code editor on your
   computer.

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
   - Redefines the `election` module with the `list-candidates` function to
     return a different list containing 1, 2, 3.
   - Tests that `list-candidates` returns the new list.

   You should see output similar to the following that indicates you were able
   to call the updated `list-candidates` function and that the function returned
   a list with numbers:

   ```bash
   module.repl:82:0:Trace: Begin Tx 6: Call updated list-candidates function
   module.repl:85:4:Trace: Expect: success: list-candidates returns a list with numbers
   module.repl:90:0:Trace: Commit Tx 6: Call updated list-candidates function
   Load successful
   ```

### Upgrade using an incorrect keyset

You can't use `expect-failure` in the Pact REPL to test module definitions, but
you can simulate an unauthorized user attempting to update a module.

To test upgrading with an incorrect keyset:

1. Open the `election-dapp/pact/module.repl` file in the code editor on your
   computer.

2. Add the following lines of code after the last transaction:

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
       (module election "election.admin-keyset"
         (defun list-candidates () [])
       )
   (commit-tx)
   ```

3. Execute the transaction using the `pact` command-line program:

   ```pact
   pact module.repl -t
   ```

   You should see the `Load failed`message and that the failure was caused by a
   `Keyset failure` error. With these two tests, you know that you can update
   the Pact module by signing a transaction with with the
   `election.admin-keyset` and that no other keyset can update the `election`
   module.

4. Remove the code you added for testing an incorrect keyset.

5. Execute the transaction using the `pact` command-line program to verify that
   the `module.repl` file loads successfully before you continue:

   ```pact
   pact module.repl -t
   ```

## Modify module governance

You now have the basic scaffolding for the `election` module in place. However,
your current configuration uses the `election.admin-keyset` to governs the
`election` module. To simplify permission management with a separation of
concerns, you can use a **capability** to govern the module instead of using the
`election.admin-keyset` keyset directly. By moving module ownership to a
governance capability, you can later use the `election.admin-keyset` keyset to
restrict access to specific functions without repeating code.

To modify governance for the module:

1. Open the `election-dapp/pact/module.repl` file in the code editor on your
   computer.

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
     "Refactor governance of the module"
   )
     (module election GOVERNANCE
      (defcap GOVERNANCE ()
         (enforce-keyset "election.admin-keyset"))
       (defun list-candidates () [1, 2, 3])
     )
   (commit-tx)
   ```

   This code resets the environment and defines a capability `GOVERNANCE` that
   enforces the keyset `election.admin-keyset`.

3. Execute the transaction using the `pact` command-line program:

   ```pact
   pact module.repl -t
   ```

   You should see output similar to the following that indicates you
   successfully upgraded the `election` module to be governed by a capability:

   ```bash
   module.repl:106:0:Trace: Begin Tx 7: Refactor governance of the module
   module.repl:109:4:Trace: Loaded module election, hash QIk-zRAVReFt6NAFNhdEjXOVYRhqlKsGDH8q0-gB0sA
   module.repl:114:0:Trace: Commit Tx 7: Refactor governance of the module
   Load successful
   ```

You can write additional test cases to verify that the `election.admin-keyset`
is still able to upgrade the module now that governance of the module is
implemented with a capability.

## Deploy the Pact module locally

Now that you've seen how to define and update a Pact module, you're ready to
deploy the module on the local development network with the administrative
account you created using Chainweaver.

To deploy the Pact module on the development network:

1. Verify the development network is currently running on your local computer.

2. Open and unlock the Chainweaver desktop or web application and verify that:

   - You're connected to **development network (devnet)** from the network list.
   - Your administrative account name with the **k:** prefix exists on chain 1.
   - Your administrative account name is funded with KDA on chain 1.

   You're going to use Chainweaver to sign the transaction that defines the
   keyset.

3. Open the `election-dapp/pact` folder file in your code editor and create a
   new file named `election.pact`.

4. Add the minimal Pact code required to define a module to the `election.pact`
   file.

   Remember that a module definition requires a namespace, a governing owner,
   and at least one function.

   Because your deploying the module in your own principal namespace on the
   local development network, replace the generic `election` namespace and
   keyset you used in the` module.repl` file with the unique principal namespace
   you defined on the development network.

   For example:

   ```pact
   (namespace 'n_14912521e87a6d387157d526b281bde8422371d1)

   (module election GOVERNANCE
     (defcap GOVERNANCE ()
       (enforce-keyset "n_14912521e87a6d387157d526b281bde8422371d1.admin-keyset"))

     (defun list-candidates () [1, 2, 3])
   )
   ```

5. Open the `./snippets/deploy-module.ts` file in your code editor.

   You'll notice several differences between this script and the previous
   scripts you've used. For example, in this script, the Pact code is read from
   your `election.pact` module rather than passed as a string or a function call
   to an existing module like `Pact.modules.coin`.

   ```typescript
   async function main(account: string, upgrade: boolean) {
     const transaction = Pact.builder
       .execution(fs.readFileSync('../pact/election.pact', 'utf8'))
   ```

   You'll also see that the metadata for the transaction specifies a gas limit
   and gas price:

   ```typescript
   gasLimit: 100000,
   gasPrice: 0.00000001,
   ```

   Deploying a Pact module is a relatively expensive type of transaction because
   of the resources required to update the blockchain. The transaction will fail
   if the gas limit is set too low.

   After the code used to sign the transaction, the script sends a **preflight
   request** for the signed transaction to the blockchain using the Kadena
   client. The response to the preflight request contains information about the
   expected success of the transaction and the how much gas the transaction
   requires. The preflight request helps to ensure that the script doesn't send
   a transaction to the blockchain that is likely to fail.

   Because you must for pay processing any transaction request even if a
   transaction fails, you should use a preflight request for any computationally
   expensive transactions—like deploying a module—before sending the actual
   transaction to the blockchain.

6. Deploy your election module on the development network by running a command
   similar to the following with your administrative account name:

   ```bash
   npm run deploy-module:devnet -- k:<your-public-key>
   ```

   Remember that `k:<your-public-key>` is the default **account name** for the
   administrative account that you funded in
   [Add an administrator account](/build/guides/election-dapp-tutorial/add-admin-account).
   You can copy this account name from Chainweaver when viewing the account
   watch list. When you run the script, you should see Chainweaver display a
   QuickSign Request.

7. Click **Sign All** to sign the request.

   After you click Sign All, the transaction is executed and the results are
   displayed in your terminal shell. For example, you should see output similar
   to the following:

   ```bash
   {
     gas: 60322,
     result: {
       status: 'success',
       data: 'Loaded module n_14912521e87a6d387157d526b281bde8422371d1.election, hash U76LNmIBivLHjDUq3CADxeMQG5iPO7vaFF84ROMSeXA'
     },
     reqKey: 'RAGwn_Jf67lOIISXsNy6qXbBqlN4sVxt8v8B9q6hLxw',
     logs: 'A42hBn7VEdDxa4vuhuLd0D3R0MzNQMI-hXaJVVcmVwg',
     events: [
       {
         params: [Array],
         name: 'TRANSFER',
         module: [Object],
         moduleHash: 'M1gabakqkEi_1N8dRKt4z5lEv1kuC_nxLTnyDCuZIK0'
       }
     ],
     metaData: {
       publicMeta: {
         creationTime: 1705011524,
         ttl: 28800,
         gasLimit: 100000,
         chainId: '1',
         gasPrice: 1e-8,
         sender: 'k:5ec41b89d323398a609ffd54581f2bd6afc706858063e8f3e8bc76dc5c35e2c0'
       },
       blockTime: 1705011521970026,
       prevBlockHash: 'oJhZZ8m00vBdH4z8_siE1gbHhb4aUE0W2G9uB2QSlHQ',
       blockHeight: 996
     },
     continuation: null,
     txId: 1014,
     preflightWarnings: []
   }
   {
     status: 'success',
     data: 'Loaded module n_14912521e87a6d387157d526b281bde8422371d1.election, hash U76LNmIBivLHjDUq3CADxeMQG5iPO7vaFF84ROMSeXA'
   }
   ```

   You now have a smart contract with one `election` module governed by the
   `admin-keyset` deployed in your principal namespace on your local development
   network. You can verify that your module is deployed by running the following
   command:

   ```bash
   npm run list-modules:devnet
   ```

   You should see output similar to the following:

   ```bash
   [
     'coin',
     'fungible-v1',
     'fungible-v2',
     'fungible-xchain-v1',
     'gas-payer-v1',
     'n_14912521e87a6d387157d526b281bde8422371d1.election',
     'ns'
   ]
   ```

## View smart contract modules in Chainweaver

After you deploy a module, you can use Chainweaver to view and interact with it.

To view the module in Chainweaver:

1. Open and unlock the Chainweaver desktop or web application.

2. In Chainweaver, click **Contracts** in the navigation panel, then click
   **Module Explorer**.
3. Under **Deployed Contracts**, search for the `election` module.
4. Click **View** to see the name of the function and capability that you
   defined in the module
5. Click **Open** to see the content of the module.

   The line specifying the namespace for the module isn't included because it
   isn't considered part of the module itself.

6. Click **Call** to the right of the `list-candidates` function.
7. In Function modal, click **Preview** tab and scroll down to see that the
   **Raw Response** displayed is `[1, 2, 3]`.

   This is an actual response from the blockchain that you can receive without
   paying transaction fees.

   In certain situations, getting a raw response is a preferable alternative to
   sending an actual transaction to the blockchain because sending a transaction
   requires you to pay for gas.

8. Leave Chainweaver open with the content of the election module displayed.

## Update your deployed Pact module

Being able to update a deployed smart contract is an important part of building
applications on the Kadena network. Many blockchain projects don't allow smart
contracts to be updated after they have been deployed on the public blockchain.
With Kadena, you can build and deploy iteratively so you can add new features
and fix bugs as your application matures.

To test updating a deployed smart contract:

1. Open the `election-dapp/pact/election.pact` file in the code editor on your
   computer.

2. Modify the `list-candidates` function to return a different list. For
   example:

   ```pact
     (defun list-candidates () [1, 2, 3, 4, 5])
   ```

3. Update the `election` module by running the `deploy-module:devnet` script in
   a terminal shell:

   ```bash
   npm run deploy-module:devnet -- k:<your-public-key>
   ```

4. Click **Sign All** in Chainweaver to sign the request.

5. In Chainweaver, click **Open** to refresh the module and confirm that the
   module displays the changes you made.

6. Click **Call** to the right of the `list-candidates` function, click
   **Preview** and scroll to see that the **Raw Response** from the blockchain
   now displays the changes you made for the return value of the function.

## Verify other accounts can't update your module

You've seen that you can use your account to deploy and update the election
module on the local development network. You might also want to verify that no
other accounts can make changes to your deployed module.

To verify that other accounts can't update your module:

1. In Chainweaver, click **Keys** in the navigation panel.

1. Click **Generate Key** to add a new public key to your list of public keys.

1. Click **Add k: Account** for the new public key to add a new account to the
   list of accounts you are watching.

1. Copy the **Account name** for the new account.

1. Open a terminal shell on your computer.
1. Create and fund the new account using the `transfer-create` script by running
   a command similar to the following with the new account name you copied from
   Chainweaver:

   ```bash
   npm run transfer-create:devnet -- <new-account-name>
   ```

1. Verify that updating the `election` module fails by running a command similar
   to the following with the new account name you copied from Chainweaver:

   ```bash
   npm run deploy-module:devnet -- <new-account-name>
   ```

   You should see that the transaction fails with output similar to the
   following:

   ```bash
   {
     gas: 100000,
     result: {
       status: 'failure',
       error: {
         callStack: [],
         type: 'TxFailure',
         message: "Keyset failure (keys-all): 'n_14912521e87a6d387157d526b281bde8422371d1.admin-keyset",
         info: ''
       }
     },
     reqKey: 'Bk61YLKYVx6lv2HiHtTonpppoVwiz3iiroQtMYEa2XI',
     logs: 'cNEOIFujnGkxkEMnfh9oFCek13XvxAqHq4truHweGYg',
     events: [
       {
         params: [Array],
         name: 'TRANSFER',
         module: [Object],
         moduleHash: 'M1gabakqkEi_1N8dRKt4z5lEv1kuC_nxLTnyDCuZIK0'
       }
     ],
     metaData: {
       publicMeta: {
         creationTime: 1705016898,
         ttl: 28800,
         gasLimit: 100000,
         chainId: '1',
         gasPrice: 1e-8,
         sender: 'k:99d30af3fa91d78cc06cf53a0d4eb2d7fa2a5a72944cc5451311b455a67a3c1c'
       },
       blockTime: 1705016899793480,
       prevBlockHash: 'LbPeMhAF-hLbpG76FO9DJQLtapRtg3ITyHRDpqec1wg',
       blockHeight: 2016
     },
     continuation: null,
     txId: null,
     preflightWarnings: []
   }
   ```

   With this result, you can be confident that your Pact module is protected on
   the blockchain by the `admin-keyset` that contains the public key for your
   administrative account.

## Next steps

In this tutorial, you learned how to:

- Define a minimal Pact module.
- Test a Pact module using the Pact REPL.
- Deploy a Pact module on the local development network.
- Navigate and view module functions in Chainweaver.
- Implement governance for a module using a keyset and using a capability.
- Update a deployed module governed by your keyset.

You also verified that other accounts can't make changes to a Pact module
governed by your keyset. So far, your `election` module only contains one simple
function that doesn't do very much. The next tutorial demonstrates how to add a
schema and a database table to the `election` module and how to use that table
to store the names of election candidates and the number of votes each candidate
receives.

You'll also update the `list-candidates` function to return data from the
database table and add a new function to nominate candidates.

To see the code for the activity you completed in this tutorial and get the
starter code for the next tutorial, check out the `07-nominate-candidates`
branch from the `election-dapp` repository by running the following command in
your terminal shell:

```bash
git checkout 07-nominate-candidates
```
