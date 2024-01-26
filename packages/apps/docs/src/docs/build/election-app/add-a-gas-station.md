---
title: "Add a gas station"
description: "Prepare a gas station module to pay the transaction fees for account holders who cast votes in the election application."
menu: "Workshop: Election application"
label: "Add a gas station"
order: 9
layout: full
tags: [pact, smart contract, typescript, tutorial]
---

# Add a gas station

Traditional elections have minimal safeguards against fraud, corruption, mishandling of ballots, and intentional or unintentional disruptions.
Even where voting is available by mail or online, elections can be costly, inefficient, and subject to human error.

By using blockchain technology, elections could be made more convenient, transparent and reliable.
For example:

- Every vote can be recorded as a public transaction that can't be altered.
- Voters can remain anonymous with votes linked to an encrypted digital fingerprint instead of government-issued identification.
- Election results can be independently verified by anyone.

However, there is one main drawback to using a blockchain to cast votes in an election.
Because every vote is a public transaction that changes the state of the blockchain, every vote requires computational resources and incurs a processing fee—commonly referred to as a **gas** payment.

Paying for transaction processing is normal in the context of many business operations, but paying to vote is essentially undemocratic. 
To address this issue, Kadena introduced a transaction processing clearing house for paying fees called a **gas station**.

A gas station is an account that exists only to make transaction fee payments on behalf of other accounts and under specific conditions.
For example, a government agency could apply a fraction of its budget for a traditional election to fund a gas station.
The gas station could then pay the transaction fee for every voting transaction, allowing all citizens to vote for free.

For more information about the introduction of gas stations, see [The First Crypto Gas Station is Now on Kadena’s Blockchain](/blogchain/2020/the-first-crypto-gas-station-is-now-on-kadenas-blockchain-2020-08-06).

## Before you begin

Before you start this tutorial, verify the following basic requirements:

- You have an internet connection and a web browser installed on your local computer.
- You have a code editor, such as [Visual Studio Code](https://code.visualstudio.com/download), access to an interactive terminal shell, and are generally familiar with using command-line programs.
- You have cloned the [election-dapp](https://github.com/kadena-community/voting-dapp.git) repository as described in [Prepare your workspace](/build/guides/election-dapp-tutorial/prepare-your-workspace).
- You have the development network running in a Docker container as described in [Start a local blockchain](/build/guides/election-dapp-tutorial/start-a-local-blockchain).
- You are [connected to the development network](/build/guides/election-dapp-tutorial/start-a-local-blockchain#connect-to-the-development-network) using your local host IP address and port number 8080.
- You have created and funded an administrative account as described in [Add an administrator account](/build/guides/election-dapp-tutorial/add-admin-account).
- You have created a principal namespace on the development network as described in [Define a namespace](/build/guides/election-dapp-tutorial/define-a-namespace).
- You have defined the keyset that controls your namespace using the administrative account as described in [Define keysets](/build/guides/election-dapp-tutorial/define-keysets).
- You have created an election Pact module and deployed it as described in [Write a smart contract](/build/guides/election-dapp-tutorial/write-a-smart-contract).
- You have updated and deployed the election smart contract on the development network as described in [Nominate candidates](/build/guides/election-dapp-tutorial/nominate-candidates) and [Add vote management](/build/guides/election-dapp-tutorial/add-vote-management).

## Create a voter account

In the previous tutorial, you voted with your administrative account. 
The transaction was successful because the account had sufficient funds to pay the transaction fee. 
For this tutorial, you need to create a new voter account on development network. 
Initially, you'll use the voter account to see that voting transactions in the election application require funds.

The steps for creating the voter account are similar to the steps you followed to create your administrative account.

To create a voter account:

1. Verify the development network is currently running on your local computer.

2. Open Chainweaver.

3. Select **devnet** from the network list.

4. Click **Keys** in the Chainweaver navigation panel.

5. Click **Generate Key** to add a new public key to your list of public keys.

6. Click **Add k: Account**  for the new public key to add a new account to the list of accounts you are watching in Chainweaver.

   If you expand the new account, you'll see that no balance exists for the account on any chain and there's no information about the owner or keyset for the account.

7. Open the `election-dapp/snippets/create-account.ts` file in the code editor on your computer.

   This script uses the Kadena client to call the `create-account` function of the `coin` contract to create a voter account.
   After importing the dependencies and creating the client with the `devnet` configuration, the script calls the `main` function.
   You'll notice that this script is similar to the `./snippets/transfer-create.ts` script you used previously.
   However, this script doesn't pass funds to the executed function and it isn't necessary to sign for the `COIN.TRANSFER` capability. 
   
8. Open the `election-dapp/snippets` folder in a terminal shell on your computer. 

9.  Run the following command to create a new voter account. Replace `k:account` with your voter account.

   ```bash
   npm run create-account:devnet -- k:<voter-public-key>
   ```


   Remember that `k:<voter-public-key>` is the default **account name** for the new voter account that you generated keys for.
   You can copy this account name from Chainweaver when viewing the account watch list.

   After a few seconds, you should see a status message:

   ```bash
   { status: 'success', data: 'Write succeeded' }
   ```

10. Verify that the account was created by checking the account details using the Kadena client:

   ```bash
   npm run coin-details:devnet -- k:<voter-public-key>
   ```
   
   After running this command, you should see output similar to the following for the new voter account:

   ```bash
   {
     guard: {
       pred: 'keys-all',
       keys: [
         'bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e'
       ]
     },
     balance: 0,
     account: 'k:bbccc99ec9eeed17d60159fbb88b09e30ec5e63226c34544e64e750ba424d35e'
   }
   ```

   If you view the account in Chainweaver, you'll see similar information for the new account.

## Attempt to cast a vote

To attempt to cast a vote with the voter account:

1. Verify the development network is currently running on your local computer.

2. Open and unlock the Chainweaver desktop or web application and verify that:
   
   - You're connected to **development network (devnet)** from the network list.
   - Your voter account name with the **k:** prefix exists on chain 1.
   - Your voter account name has no KDA account balance (0) on chain 1. 

3. Open the `election-dapp/frontend` folder in a terminal shell on your computer. 

4. Install the frontend dependencies by running the following command:
   
   ```bash
   npm install
   ```

5. Start the frontend application configured to use the `devnet` backend by running the following command: 

   ```bash
   npm run start-devnet
   ```

6. Open `http://localhost:5173` in your browser and verify that there's at least one candidate listed.

7. Click **Set Account**.
8. Paste your voter account name, then click **Save**.
9. Click **Vote Now** for a candidate, sign the transaction, then open the Developer Tools for your browser and view the console output.

   In the console, you'll see an error similar to the following:
   
   ```console
   Attempt to buy gas failed with: (enforce (<= amount balance) "...: Failure: Tx Failed: Insufficient funds`, proving that it is indeed not possible to vote with an account that has zero balance.
   ```

## Implement gas station interface

In this tutorial, you'll add a second Pact module—the `election-gas-station` module—to your `election` smart contract.

To create the gas station module:

1. Open the `election-dapp/pact` folder in the code editor on your computer.

2. Create a new `election-gas-station.pact` file in the `pact` folder.

3. Add the minimal Pact code required to define a module.
   
   Remember that a module definition requires a namespace, a governing owner, and at least one function.
   In this case, the function you want to add to the module is an implementation of the `gas-payer-v1` interface.
   Because you're deploying the module in your own principal namespace on the local development network, be sure you replace the namespace and keyset with the principal namespace you defined on the development network.
   
   For example:

   ```pact
   (namespace 'n_14912521e87a6d387157d526b281bde8422371d1)
   
   (module election-gas-station GOVERNANCE
     (defcap GOVERNANCE ()
       (enforce-keyset "n_14912521e87a6d387157d526b281bde8422371d1.admin-keyset")
     )
   
     (implements gas-payer-v1)
   )
   ```
   
   As you can see in this example, the new module—like the `election` module—is governed by your `admin-keyset`.

1. Create a `election-gas-station.repl` file in the `pact` folder and add the following lines of code:
   
   ```pact
   (load "setup.repl")
   
   (begin-tx "Load election gas station module")
     (load "root/gas-payer-v1.pact")
     (load "election-gas-station.pact")
   (commit-tx)
   ```

2. Execute the transaction in the Pact REPL running locally or in the Docker container.

   If the Pact REPL is installed locally, run the following command inside the `pact` folder in the terminal shell:

   ```bash
   pact election-gas-station.repl -t
   ```
   
   As before, if you don't have the Pact REPL installed locally, you can load the file in the [Pact REPL](http://localhost:8080/ttyd/pact-cli/) with the following command:

   ```pact
   (load "election-gas-station.repl")
   ```

   If you are using the Pact REPL in a browser, you can replace the `pact election-gas-station.repl -t` command with `(load "election-gas-station.repl")` throughout this tutorial.

   You should see that this transaction fails with an error similar to the following:

   ```bash
   election-gas-station.pact:3:3:Error: found unimplemented member while resolving model constraints: GAS_PAYER at election-gas-station.pact:3:3: module
   Load failed
   ```
   
   The `gas-payer-v1` interface you have referenced in your `election-gas-station.pact` file is defined in the `election-dapp/pact/root/gas-payer-v1.pact` file.
   This file is included in your project so that you can test your module in the Pact REPL.
   The interface is also pre-installed on the Kadena development, test, and main networks, so you don't need to deploy it when you deploy the `election-gas-station` module.
   However, you haven't implemented the `gas-payer-v1` interface yet in the `election-gas-station.pact` file.

1. Open the `election-dapp/pact/root/gas-payer-v1.pact` file in the code editor on your computer and review the signature for the interface.
   
   The documentation for the `gas-payer-v1` interface file states that `GAS_PAYER` should compose a capability.
   You can include a capability within a capability using the built-in `compose-capability` function. 
   From this documentation, you know that you need to add the `ALLOW_GAS` capability that always returns `true` within the `GAS_PAYER` capability to implement the `gas-payer-v1` interface.

2. Add the capability `ALLOW_GAS` within the `GAS_PAYER` capability in the `election-gas-station.pact` file with the following lines of code:
   
   ```pact
   (defcap GAS_PAYER:bool
     ( user:string
       limit:integer
       price:decimal
     )
     (compose-capability (ALLOW_GAS))
   )
     
   (defcap ALLOW_GAS () true)
   ```

3. Execute the transaction using the `pact` command-line program:
   
   ```pact
   pact election-gas-station.repl -t
   ```
   
   You should see that this transaction fails with an error similar to the following:

   ```bash
   election-gas-station.pact:3:3:Error: found unimplemented member while resolving model constraints: create-gas-payer-guard at election-gas-station.pact:3:3: module
   Load failed
   ```

   If you review the `gas-payer-v1` interface again, you'll see it defines a `create-gas-payer-guard` function
   that you haven't implemented yet in your `election-gas-station` module.
   To implement the required guard, you can use the built-in `create-capability-guard` function and pass the `ALLOW_GAS` capability into it. 
   The function returns a guard for the `ALLOW_GAS` capability.

4. Add the  `create-capability-guard` function and pass the `ALLOW_GAS` capability into it with the following lines of code:
   
   ```pact
     (defun create-gas-payer-guard:guard ()
       (create-capability-guard (ALLOW_GAS))
     )
   ```

3. Execute the transaction using the `pact` command-line program:
   
   ```pact
   pact election-gas-station.repl -t
   ```
   
   You should see that the transaction succeeds with output similar to the following:

   ```bash
   election-gas-station.pact:3:3:Trace: Loaded module n_14912521e87a6d387157d526b281bde8422371d1.election-gas-station, hash UKFa_ybmNJeGY1JJHtz4mv5h5QaN6-29WMIa4H6SIz8
   election-gas-station.repl:6:0:Trace: Commit Tx 3: Load election gas station module
   Load successful
   ```

   Now that you have a working implementation of the `gas-payer-v1` interface, you can deploy the new module on the development network to test whether it can pay the transaction fee for votes cast using the election application.

## Deploy the Pact module on the development network

To deploy the new Pact module on the development network:

1. Verify the development network is currently running on your local computer.

2. Open and unlock the Chainweaver desktop or web application and verify that:

   - You're connected to **development network (devnet)** from the network list.
   - Your administrative account name with the **k:** prefix exists on chain 1.
   - Your administrative account name is funded with KDA on chain 1. 
   
   You're going to use Chainweaver to sign the transaction that deploys the module. 

3. Open the `election-dapp/snippets` folder in a terminal shell on your computer.

1. Deploy your `election-gas-station` module on the development network by running a command similar to the following with your administrative account name:
   
   ```bash
   npm run deploy-gas-station:devnet -- k:<your-public-key>
   ```
   
   Remember that `k:<your-public-key>` is the default **account name** for the administrative account that you funded in [Add an administrator account](/build/election/add-admin-account).
   You can copy this account name from Chainweaver when viewing the account watch list.

    The `election-dapp/deploy-gas-station.ts` script is similar to the `election-dapp/deploy-module.ts` script, except that it deploys the `election-gas-station.pact` module.

   When you run the script, you should see Chainweaver display a QuickSign Request.
  
2. Click **Sign All** to sign the request.
   
   After you click Sign All, the transaction is executed and the results are displayed in your terminal shell.
   For example, you should see output similar to the following:

   ```bash
   {
     gas: 60414,
     result: {
       status: 'success',
       data: 'Loaded module n_14912521e87a6d387157d526b281bde8422371d1.election-gas-station, hash UKFa_ybmNJeGY1JJHtz4mv5h5QaN6-29WMIa4H6SIz8'
     },
     reqKey: '0b0yxjVLgKusW5obhDJON6jww1BF0cTfn3O2aiffV7U',
     logs: 'lYZH-dn07T7PmnxUMf-h4vch8sPoHfz42olDtV153fA',
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
         creationTime: 1706218447,
         ttl: 28800,
         gasLimit: 100000,
         chainId: '1',
         gasPrice: 1e-8,
         sender: 'k:5ec41b89d323398a609ffd54581f2bd6afc706858063e8f3e8bc76dc5c35e2c0'
       },
       blockTime: 1706218445726808,
       prevBlockHash: 'so-M2Qv_sPH9se6OigQEfrznrQgl6H5XTI5xMdXK-TY',
       blockHeight: 14684
     },
     continuation: null,
     txId: 14728,
     preflightWarnings: []
   }
   {
     status: 'success',
     data: 'Loaded module n_14912521e87a6d387157d526b281bde8422371d1.election-gas-station, hash UKFa_ybmNJeGY1JJHtz4mv5h5QaN6-29WMIa4H6SIz8'
   }
   ```

   With this transaction, you now have two Pact modules in your `election` smart contract. 

3. Verify that the `election-gas-station` module is deployed on the development network by running the following command:

   ```bash
   npm run list-modules:devnet
   ```

   You should see your modules listed in output similar to the following:

   ```bash
   'n_14912521e87a6d387157d526b281bde8422371d1.election',
   'n_14912521e87a6d387157d526b281bde8422371d1.election-gas-station',
   ```

## Update the vote function

The next step is to ensure that the signature of the account that votes is within the scope of the `GAS_PAYER` capability. 
To do this, you'll update the `vote` function to accept the following arguments:

- The voter account name.
- Zero as the gas limit to allow unlimited gas.
- Zero as the gas price. 

You'll also change the `senderAccount` in the transaction metadata to use the`'election-gas-station'` module so that the election gas station account pays the transaction fee for voting transactions instead of the voter account.

To update the `vote` function:

1. Open the `frontend/src/repositories/vote/DevnetVoteRepository.ts` file in the code editor on your computer.

2. Update the `vote` function to change the `.addSigner(accountKey(account))` code as follows:

   ```typescript
   .addSigner(accountKey(account), (withCapability) => [
     withCapability(`${NAMESPACE}.election-gas-station.GAS_PAYER`, account, { int: 0 }, { decimal: '0.0' }),
   ])
   ```

3. Update the `senderAccount` in the transaction metadata to be `'election-gas-station'` as follows: 
   
   ```typescript
   .setMeta({
      chainId: CHAIN_ID,
      ttl: 28000,
      gasLimit: 100000,
      gasPrice: 0.000001,
      senderAccount: 'election-gas-station',
   })
   ```

   If you have closed the election application you previously had running, restart it using the `devnet` backend, then open `http://localhost:5173` in your browser.

4. Click **Set Account**, copy and paste the voter account name from Chainweaver to vote using that account, then click **Save**.
5. Click **Vote Now** for a candidate, sign the transaction, then open the Developer Tools for your browser and view the console output.

   In the console, you'll see an error similar to the following:
   
   ```console
   Uncaught (in promise) Error: Validation failed for hash "shH9LgwlSuvMtm2hR-LvxFTYUOOA-iw359d4y45xO7M": Attempt to buy gas failed with: (read coin-table sender): Failure: Tx Failed: read: row not found: election-gas-station
   ```
   
   As this error indicates, the `election-gas-station` account you specified for the `senderAccount` doesn't exist yet.
   You need to create and fund the account before it can be used by voters.

## Create the gas station account

To make the gas station account more secure, you can create it using a principal account name and guard access to it by using the `ALLOW_GAS` capability. 
Because the gas station account is a capability-guarded account, you can use the `create-principal` Pact function to automatically create its account name with a `c:` prefix. 
You can then define the gas station account name as a constant in the `election-gas-station.pact` file.

To create a capability-guarded account:

1. Open the `election-dapp/pact` folder in the code editor on your computer.
2. Open the `election-gas-station.pact` file and add the following line of code to the end of the module definition:

   ```pact
   (defconst GAS_STATION_ACCOUNT (create-principal (create-gas-payer-guard)))
   ```

1. Open the `./pact/election-gas-station.repl` file and update the transaction to display the capability-guarded gas station
account name when you run the file.

   ```pact
   (load "setup.repl")
   
   (begin-tx "Load election gas station module")
     (load "root/gas-payer-v1.pact")
     (load "election-gas-station.pact")
     [GAS_STATION_ACCOUNT]
   (commit-tx)
   ```

3. Execute the transaction using the `pact` command-line program:
   
   ```pact
   pact election-gas-station.repl -t
   ```
   
   You should see that the transaction succeeds with output similar to the following:

   ```bash
   election-gas-station.repl:5:2:Trace: Loading election-gas-station.pact...
   election-gas-station.pact:1:0:Trace: Namespace set to n_14912521e87a6d387157d526b281bde8422371d1
   election-gas-station.pact:3:3:Trace: Loaded module n_14912521e87a6d387157d526b281bde8422371d1.election-gas-station, hash -idAeKp54xkfddZ9MIxQw8GCD4jTZ_Ow8pXWR9zwC-k
   election-gas-station.repl:6:0:Trace: Commit Tx 3: Load election gas station module
   Load successful
   ```

4. Open the `election-gas-station.pact` file in the code editor on your computer.

5. Add an `init` function that uses the `create-account` function from the `coin` module to create the gas station account in the `election-gas-station` module:
   
   ```pact
   (defun init ()
     (coin.create-account GAS_STATION_ACCOUNT (create-gas-payer-guard))
   )
   ```

   In this code:
   
   - The first argument of the function is the account name you just defined.
   - The second argument is the guard for the account.

1. Add an if-statement after the module definition that calls the `init` function if the module is deployed with
 `{ "init": true }` in the transaction data:

   ```pact
   (if (read-msg 'init)
     [(init)]
     ["not creating the gas station account"]
   )
   ```

1. Update the `election-gas-station.repl` file to set `init` to true for the next transactions by adding the following
lines of code after loading the `setup.repl` module:

   ```pact
   (env-data
     { 'init: true }
   )
   ```
3. Execute the transaction using the `pact` command-line program:
   
   ```pact
   pact election-gas-station.repl -t
   ```
   
   You should see that the transaction succeeds with output similar to the following:

   ```bash
   election-gas-station.pact:30:0:Trace: ["Write succeeded"]
   election-gas-station.repl:10:2:Trace: ["c:qjp3-APtX5tTTSvQSMbJ1KZ1hCru238IUirIqN6tkMI"]
   election-gas-station.repl:11:0:Trace: Commit Tx 3: Load election gas station module
   Load successful
   ```
   
   If you're successful loading the election-gas-station module in the Pact REPL, you can update the module deployed on the development network.

## Update the gas station module

To deploy the new Pact module on the development network:

1. Verify the development network is currently running on your local computer.

2. Open and unlock the Chainweaver desktop or web application and verify that:

   - You're connected to **development network (devnet)** from the network list.
   - Your administrative account name with the **k:** prefix exists on chain 1.
   - Your administrative account name is funded with KDA on chain 1. 
   
   You're going to use Chainweaver to sign the transaction that updates the module. 

3. Open the `election-dapp/snippets` folder in a terminal shell on your computer.

1. Deploy your `election-gas-station` module on the development network by running a command similar to the following with your administrative account name:
   
   ```bash
   npm run deploy-gas-station:devnet -- k:<your-public-key> upgrade init
   ```
   
   Remember that `k:<your-public-key>` is the default **account name** for the administrative account that you funded in [Add an administrator account](/build/election/add-admin-account).
   You can copy this account name from Chainweaver when viewing the account watch list.

2. Click **Sign All** to sign the request.
   
   After you click Sign All, the transaction is executed and the results are displayed in your terminal shell.
   For example, you should see output similar to the following:

   ```bash
   { status: 'success', data: [ 'Write succeeded' ] }
   ```

1. Verify that the gas station account now exists with a 0 KDA balance on development network by running the
following script. 

   ```bash
   npm run coin-details:devnet -- c:<capability-guarded-account-name>
   ```
   
   Replace `c:<capability-guarded-account-name>` with the gas station account name displayed when you tested the `election-gas-station.repl` file in the Pact REPL.

   After running the script, you should see output similar to the following:

   ```bash
   {
     guard: {
       cgPactId: null,
       cgArgs: [],
       cgName: 'n_14912521e87a6d387157d526b281bde8422371d1.election-gas-station.ALLOW_GAS'
     },
     balance: 0,
     account: 'c:qjp3-APtX5tTTSvQSMbJ1KZ1hCru238IUirIqN6tkMI'
   }   
   ```
   
   In the account details, you can see that the `ALLOW_GAS` capability is used to guard the gas station account.
   The `ALLOW_GAS` capability has a prefix that includes your principal namespace and the module name.
   Because the principal namespace is based on your administrative keyset and the principal account of the gas station is based on a capability including that principal namespace, you know that the gas station account name is unique to your administrative account. 
   This account naming scheme makes it impossible for someone with a different keyset to use your gas station account on another chain. 
   As a result, principal accounts in principal namespaces are far more secure than vanity account names in the `free` namespace.

## Fund the gas station account

Now that you have created and deployed a secure gas station account, you're ready to fund the account to pay transaction fees.

To fund the gas station account:

1. Verify the development network is currently running on your local computer.

2. Open and unlock the Chainweaver desktop or web application and verify that:

   - You're connected to **development network (devnet)** from the network list.
   - Your administrative account name with the **k:** prefix exists on chain 1.
   - Your administrative account name is funded with KDA on chain 1. 
   
   You're going to use Chainweaver to sign the transaction that funds the gas station account. 

3. Open the `election-dapp/snippets` folder in a terminal shell on your computer.
4. Transfer one KDA from your administrative account to the gas station account by running the following command:
   
   ```bash
   npm run transfer:devnet -- k:<your-public-key> c:<capability-guarded-account-name> 1
   ```
   
   Remember to replace `k:<your-public-key>` with the **account name** for your administrative account and `c:<capability-guarded-account-name>` with the account name for your gas station. 
   The `transfer.ts` script is similar to the `transfer-create.ts` script except that this script:
   
   - Transfers KDA from your administrative account and must be signed using Chainweaver. Also, 
   - Requires the receiving account to already exist on the blockchain.

5. Click **Sign All** to sign the request.
   
   After you click Sign All, the transaction is executed and the results are displayed in your terminal shell.
   For example, you should see output similar to the following:

   ```bash
   { status: 'success', data: [ 'Write succeeded' ] }
   ```
  
6. Verify that the election gas station account now has a KDA balance on the development network by running the
following script again.

   ```bash
   npm run coin-details:devnet -- c:<capability-guarded-account-name>
   ```

   Remember to replace `c:<capability-guarded-account-name>` with the account name for your gas station.

   After running the script, you should see output similar to the following:

   ```bash
   {
     guard: {
       cgPactId: null,
       cgArgs: [],
       cgName: 'n_14912521e87a6d387157d526b281bde8422371d1.election-gas-station.ALLOW_GAS'
     },
     balance: 1,
     account: 'c:qjp3-APtX5tTTSvQSMbJ1KZ1hCru238IUirIqN6tkMI'
   }
   ```

## Modify the senderAccount

Now that you have created a capability-guarded account for the gas station, you need to modify the vote function to use this account.

To modify the `senderAccount` to use the gas station account:

1. Open the `frontend/src/repositories/vote/DevnetVoteRepository.ts` file in the code editor on your computer.

2. Update the `senderAccount` in the transaction metadata to replace `'election-gas-station'` with the `c:<capability-guarded-account-name>` account name for your gas station.
   
   For example: 
   
   ```typescript
   .setMeta({
      chainId: CHAIN_ID,
      ttl: 28000,
      gasLimit: 100000,
      gasPrice: 0.000001,
      senderAccount: 'c:qjp3-APtX5tTTSvQSMbJ1KZ1hCru238IUirIqN6tkMI',
   })
   ```

## Set the scope for signatures

At this point, most of the work required to use a gas station to pay transaction fees is done.
However, if you attempt to vote in the election application and sign the transaction with the voter account name from Chainweaver, the Developer Tools console output will display an error similar to the following:

```console
App.tsx:42 Uncaught (in promise) {callStack: Array(0), type: 'TxFailure', message: 'Keyset failure (keys-all): [bbccc99e...]', info: ''}
```

When you added the `ACCOUNT-OWNER` capability to the `election-dapp/pact/election.pact` file, you didn't set the scope for the capability.

You might recall in the previous tutorial that you tested voting with a transactionb similar to the following in the `voting.repl` file:

```pact
(env-sigs
  [{ 'key  : "voter"
   , 'caps : []
  }]
)

(begin-tx "Vote as voter")
  (use n_14912521e87a6d387157d526b281bde8422371d1.election)
  (vote "voter" "1")
  (expect
    "Candidate A has 2 votes"
    2
    (at 'votes (at 0 (list-candidates)))
  )
(commit-tx)
```

In this test from the previous tutorial, the `caps` field passed to `env-sigs` is an empty array. 
As a consequence, the signature of the transaction is not scoped to any capability and the signer automatically
approves all capabilities required for the function to execute. 

In the `vote` function of `frontend/src/repositories/vote/DevnetVoteRepository.ts` you scoped the signature of the
transaction to the `GAS_PAYER` capability, but not to the `ACCOUNT-OWNER` capability. 
If you sign for some capabilities but not for all capabilities required for a transaction to be executed,
the transaction will fail at the point where a capability is required that you did not sign for.
Therefore, you need to add a second capability to the array passed to `addSigners` in
the `vote` function in `frontend/src/repositories/vote/DevnetVoteRepository.ts`.

To set the scope for the `ACCOUNT-OWNER` capability:

1. Open the `frontend/src/repositories/vote/DevnetVoteRepository.ts` file in the code editor on your computer.

2. Add the `ACCOUNT-OWNER` capability to the `.addSigner` with the following line of code:
   
   ```typescript
   withCapability(`${NAMESPACE}.election.ACCOUNT-OWNER`, account),
   ```

## Cast a vote

To cast a vote with the voter account:

1. Verify the development network is currently running on your local computer.

2. Open and unlock the Chainweaver desktop or web application and verify that:
   
   - You're connected to **development network (devnet)** from the network list.
   - Your voter account name with the **k:** prefix exists on chain 1.
   - Your voter account name has no KDA account balance (0) on chain 1.
  

   If you have closed the election application you previously had running:
   
   - Open the `election-dapp/frontend` folder in a terminal shell on your computer.
   - Install the frontend dependencies by running the `npm install` command.
   - Start the frontend application configured to use the `devnet` backend by running the `npm run start-devnet` command.

3. Open `http://localhost:5173` in your browser and verify that there's at least one candidate listed.
4. Click **Set Account**, copy and paste the voter account name from Chainweaver to vote using that account, then click **Save**.
5.  Click **Vote Now** for a candidate, sign the transaction, and wait for it to complete. 

## Enforce a limit on transaction fees

You now have a functioning gas station for the election application.
However some additional configuration is required to make the module more secure.

For example, you should enforce an upper limit for transaction fees to help ensure that funds in the gas station account aren't drained too quickly.

To set an upper limit for transaction fees:

1. Open the `election-gas-station.pact` file in the code editor on your computer.

1. Add the following functions to retrieve the transaction gas price from the metadata of the transaction using the
built-in `chain-data` function and to enforce it to be below a given limit.

   ```pact
   (defun chain-gas-price ()
     (at 'gas-price (chain-data))
   )
   
   (defun enforce-below-or-at-gas-price:bool (gasPrice:decimal)
     (enforce (<= (chain-gas-price) gasPrice)
       (format "Gas Price must be smaller than or equal to {}" [gasPrice]))
   )
   ```

1. Update the `GAS_PAYER` capability by adding `(enforce-below-or-at-gas-price 0.000001)` right before `(compose-capability (ALLOW_GAS))`.

## Limit access to the gas station

Any module can use your gas station as it is, which can become quite costly if the word spreads. 
Especially, since any kind of transaction is allowed and heavy transactions cost even more gas than lighter transactions.

There are two types of Pact transactions: `exec` and `cont`. 

- `cont` transactions enable multi-step pacts.
- `exec` is for regular transactions. 

You can limit the use to `exec` transactions by adding the following line to the start of the body of the `GAS_PAYER` `defcap`.

```pact
(enforce (= "exec" (at "tx-type" (read-msg))) "Can only be used inside an exec")
```

An `exec` transaction can contain multiple function calls. 
Allow only one function call by adding the following line after the previous one.

```pact
(enforce (= 1 (length (at "exec-code" (read-msg)))) "Can only be used to call one pact function")
```

To limit usage of the gas station to pay for gas consumed only by functions defined in your module, add the following line. 
Replace the namespace with your own principal namespace.

```pact
(enforce
  (= "(n_fd020525c953aa002f20fb81a920982b175cdf1a.election." (take 52 (at 0 (at "exec-code" (read-msg)))))
  "Only election module calls are allowed"
)
```

## Final checks

Take the time to run the different `.repl` files you created and verify that all tests are still passing.
If you are up to the challenge, try to add some tests in the Pact REPL to verify the behavior of the
election gas station on your own. Then, open up a terminal and change the directory to the `./snippets`
folder in the root of your project. Execute the `./deploy-gas-station.ts` snippet by running the following
command to upgrade the `election-gas-station` module and complete the project. Replace `k:account` with
your admin account.

```bash
npm run deploy-gas-station:devnet -- k:account upgrade
```

## Next steps

In this chapter, you added a second module to your smart contract: the `election-gas-station`. You
built the gas station from the ground up, secured it and deployed it to Devnet. You learned that
Kadena's gas station mechanism allows someone else to automatically pay the gas fee for transactions
of others under certain conditions. This enables voters to vote for free via a website that uses
a smart contract on the blockchain as its back-end. By completing this project, you are able to
demonstrate and explain that online elections on the blockchain are more efficient, transparent
and reliable than traditional elections. The only remaining challenge is that it is currently
possible to
vote more than once by simply creating multiple Kadena accounts. To comply with the law, the
Kadena accounts that are allowed to vote should somehow be linked to the social security numbers
of citizens of voting age as stored in legacy government systems. Or, perhaps, everyone should
just get a Kadena account instead of a social security number at birth. Anyway, there are several
technical and theoretical solutions for such last hurdle. Food for thought.

As a next step, you could deploy the election website online and deploy the election smart contract
to Testnet. This will allow anyone to take part in your online election. In the future, more chapters
will be added to this tutorial, or new tutorials will be created, to teach you how to do that. You can
also experiment with signing methods other than Chainweaver. If there is anything you feel is missing
from this tutorial, please let us know, so we can keep improving.
