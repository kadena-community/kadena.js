---
title: 'Nominate candidates'
description:
  'Work with database schemas and tables in your Pact module to manage
  candidates for the election application smart contract backend.'
menu: 'Workshop: Election application'
label: 'Nominate candidates'
order: 7
layout: full
tags: [pact, smart contract, typescript, tutorial]
---

# Nominate candidates

In [Write a smart contract](/build/election/write-a-smart-contract), you learned about defining Pact modules and created a skeleton `election` module for the smart contract that will become the backend of the election application. 
In this tutorial, you'll update the `election` module with a database table and functions to support the following operations:

- Store a list of candidates and the number of votes each candidate receives.
- Store a list of the accounts that have voted to ensure that every account can
  vote only once.
- Add nominated candidates to the candidate table.
- List all of the candidates that are stored in the table.

## Before you begin

Before you start this tutorial, verify the following basic requirements:

- You have an internet connection and a web browser installed on your local computer.
- You have a code editor, such as [Visual Studio Code](https://code.visualstudio.com/download), access to an interactive terminal shell, and are generally familiar with using command-line programs.
- You have cloned the [voting-dapp](https://github.com/kadena-community/voting-dapp.git) repository to create your project directory as described in [Prepare your workspace](/build/election/prepare-your-workspace).
- You have the development network running in a Docker container as described in [Start a local blockchain](/build/election/start-a-local-blockchain).
- You are [connected to the development network](/build/election/start-a-local-blockchain#connect-to-the-development-network) using your local host IP address and port number 8080.
- You have created and funded an administrative account as described in [Add an administrator account](/build/election/add-admin-account).
- You have created a principal namespace on the development network as described in [Define a namespace](/build/election/define-a-namespace).
- You have defined the keyset that controls your namespace using the administrative account as described in [Define keysets](/build/election/define-keysets). 
- You have created a minimal election module using the Pact smart contract language as described in [Write a smart contract](/build/election/write-a-smart-contract).
  
## Define the database schema and table

To prepare the `election` module database, you must first define a **schema**
for the table. You can then define a table that uses the schema inside the
`election` module. The actual creation of the table happens outside the Pact
module, just like selecting the namespace.

To define the database schema and table:

1. Open the `election-dapp/pact/election.pact` file in the code editor on your
   computer.
2. Add the schema for the database table inside of the `election` module
   definition with the following lines of code:

   ```pact
     (defschema candidates-schema
       "Candidates table schema"
       name:string
       votes:integer)

     (deftable candidates:{candidates-schema})
   ```

   In this code, `defschema` defines a `candidate-schema` for a database table
   with two columns: `name` of type string and `votes` of type integer.

3. Create the table outside of the election module by adding the following lines
   of code at the end of the `./pact/election.pact` file, after the closing
   parenthesis (`)`) of the `election` module definition:

   ```pact
   (if (read-msg "init-candidates")
     [(create-table candidates)]
     []
   )
   ```
   
   With this code, the `read-msg` function reads the `init-candidates` field from the transaction data. 
   If you set this field to `true` in the data for your module deployment transaction, the statement between the first square brackets—`(create-table candidates)`—is executed to create the `candidates` table based on its schema definition inside the `election` module.

## Test table creation

Before trying to create the table on your local development network, you can
verify that your changes work as expected by running some tests in the Pact
REPL.

To test table creation:

1. Open the `election-dapp/pact` folder in the code editor on your computer.
4. Create a new file named `election.repl` in the `pact` folder.
5. Set the `env-data` and `env-sigs` fields for the REPL test environment to use the public key for your own administrative account.
   
   For example:

   ```pact
   (env-data
     { 'admin-keyset:
         { 'keys : [ "5ec41b89d323398a609ffd54581f2bd6afc706858063e8f3e8bc76dc5c35e2c0" ]
         , 'pred : 'keys-all
         }
     , 'upgrade: false
     , 'init-candidates: true
     }
   )

   (env-sigs
     [{ 'key  : "5ec41b89d323398a609ffd54581f2bd6afc706858063e8f3e8bc76dc5c35e2c0"
      , 'caps : []
     }]
   )
   ```

   Also, notice that `'init-candidates: true` is included in the environment data to ensure that the `(create-table candidates)` command is executed when you load the `election` module into the Pact REPL. 

6. Define your principal namespace and the `admin-keyset` for the namespace using the principal namespace you used in your `election.pact` file.

   ```pact
   (begin-tx "Define principal namespace")
     (define-namespace 'n_14912521e87a6d387157d526b281bde8422371d1 (read-keyset 'admin-keyset ) (read-keyset 'admin-keyset ))
   (commit-tx)

   (begin-tx "Define admin-keyset")
     (namespace 'n_14912521e87a6d387157d526b281bde8422371d1)
     (define-keyset "n_14912521e87a6d387157d526b281bde8422371d1.admin-keyset" (read-keyset 'admin-keyset ))
   (commit-tx)
   ```
   
   These transactions are required because, inside `election.pact` file, the `election` module is defined in your principal namespace and it is governed by the `admin-keyset` in that namespace.

7. Add a transaction to load the election module:
   
   ```pact
   (begin-tx "Load election module")
     (load "election.pact")
   (commit-tx)
   ```

8. Execute the transaction using the `pact` command-line program running locally or using [pact-cli](http://localhost:8080/ttyd/pact-cli/) from the Docker container.

   If `pact-cli` is installed locally, run the following command inside the
   `pact` folder in current terminal shell:

   ```bash
   pact election.repl -t
   ```

   As before, if you don't have `pact` installed locally, you can load the
   `election.repl` file with the following command:

   ```pact
   (load "election.repl")
   ```

   If you are using the `pact-cli` in a browser, you can replace the
   `pact election.repl -t` command with `(load "election.repl")` throughout this
   tutorial.

   You should see that the transaction succeeds with output similar to the
   following:

   ```bash
   election.pact:3:0:Trace: Loaded module n_14912521e87a6d387157d526b281bde8422371d1.election, hash TW9dmlTaCle12OF9zwn9Z_oF1cX2qhTbZYZAwDXkTqY
   election.pact:16:0:Trace: ["TableCreated"]
   election.repl:27:0:Trace: Commit Tx 2: Load election module
   Load successful
   ```

## List candidates from a table

Although the `candidates` table seems to have been created successfully, it is
worth testing that the table works as expected before updating the `election`
module on the development network.

To test that the table works as expected:

1. Open the `election-dapp/pact/election.repl` file in the code editor on your
   computer.

1. Add a transaction to test the current implementation of the
   `election.list-candidates` function:

   ```pact
   (begin-tx "List candidates")
     (use n_14912521e87a6d387157d526b281bde8422371d1.election)
     (expect
       "There should be no candidates in the candidates table"
       [1, 2, 3, 4, 5]
       (list-candidates)
     )
   (commit-tx)
   ```

1. Execute the transaction using the `pact` command-line program:

   ```pact
   pact election.repl -t
   ```

   If the current implementation of the `list-candidates` function returns [1,
   2, 3, 4, 5], you should see the transaction succeed with output similar to
   the following:

   ```bash
   election.repl:29:0:Trace: Begin Tx 3: List candidates
   election.repl:30:2:Trace: Using n_14912521e87a6d387157d526b281bde8422371d1.election
   election.repl:31:2:Trace: Expect: success: There should be no candidates in the candidates table
   election.repl:36:0:Trace: Commit Tx 3: List candidates
   Load successful
   ```

   If you were to change the expected output to an empty list (`[]`) and run the
   file again, you would see the transaction fails with output similar to the
   following:

   ```bash
   election.repl:37:0:Trace: Commit Tx 3: List candidates
   election.repl:32:2:ExecError: FAILURE: There should be no candidates in the candidates table: expected []:[<a>], received [1 2 3 4 5]:[<c>]
   Load failed
   ```

   You can fix this issue by updating the return value of the `list-candidates`
   function in the `election-dapp/pact/election.pact` file.

1. Open the `election-dapp/pact/election.pact` file in your code editor.

1. Update the return value of the `list-candidates` function to select all of
   the rows of the `candidates` table, including the key and the column values
   of each row.

   For example:

   ```pact
   (defun list-candidates ()
     (fold-db candidates
       (lambda (key columnData) true)
       (lambda (key columnData) (+ { "key": key } columnData))
     ))
   ```

   In this code, the `fold-db` function is like a `SELECT * FROM table` statement in SQL, except that it fetches the value of the `key` column  separately from the other column values. 
   
   - The first argument for `fold-db` is the table name. 
   - The second argument is a predicate function that determines which rows should be selected. 
     To fetch all rows from a table, you can simply return `true` here. 
   - The third argument is an accumulator function that allows you to map the data of each row to a different format. 
   
   This example formats the return value of the `fold-db` function as a JSON object with the following structure.

   ```pact
   [
     { "key": "1", "name": "Candidate A", "votes": 0 },
     { "key": "2", "name": "Candidate B", "votes": 0 }
   ]
   ```

1. Execute the transaction using the `pact` command-line program:   

   ```pact
   pact election.repl -t
   ```

   Because there are no candidates in the table, you should see the transaction
   succeeds with output similar to the following:

   ```bash
   election.repl:30:2:Trace: Using n_14912521e87a6d387157d526b281bde8422371d1.election
   election.repl:31:2:Trace: Expect: success: There should be no candidates in the candidates table
   election.repl:36:0:Trace: Commit Tx 3: List candidates
   Load successful
   ```

   Note that you shouldn't include a call to a function like `fold-db` in
   transactions sent to the blockchain. Instead, you can make a local request to
   select all rows from a table to save gas. You'll learn more about making
   local requests using the Kadena client later in this tutorial.

## Add candidates

At this point, you have a database table for storing candidate names and the
votes they've received, but without any candidates for anyone to vote on.

To add candidates to the database:

1. Open the `election-dapp/pact/election.repl` file in your code editor.

2. Add a transaction to test that candidates have been added to the database
   using the `election.add-candidate` function:

   ```pact
   (begin-tx "Add candidates")
     (use n_14912521e87a6d387157d526b281bde8422371d1.election)
     (expect
       "Add Candidate A"
       "Write succeeded"
       (add-candidate { "key": "1", "name": "Candidate A" })
     )
     (expect
       "Add Candidate B"
       "Write succeeded"
       (add-candidate { "key": "2", "name": "Candidate B" })
     )
     (expect
       "Add Candidate C"
       "Write succeeded"
       (add-candidate { "key": "3", "name": "Candidate C" })
     )
   (commit-tx)
   ```

   If you were to execute the transaction now, the test would fail because the
   `add-candidate` function doesn't exist yet in the `election` module and you
   would see output similar to the following:

   ```bash
   election.repl:40:0:Error: Cannot resolve add-candidate
   Load failed
   ```

   However, from this code, you can see that the `add-candidate` function
   accepts a candidate object as an argument, and that the object is defined in
   JSON format.

   Notice that this object has the fields `key` and `name`, while the
   `candidate-schema` you defined for the `candidates` table has two columns
   `name` and `votes`. The `votes` column always has an initial value of `0`
   when a new candidate is added, so you don't need to send a value for votes in
   the transaction.

   The `key` value is a unique index for the table row that is added. This value
   can't be automatically generated, so you have to pass a value yourself.

3. Open the `election-dapp/pact/election.pact` file in your code editor.

4. Define the `add-candidate` function inside the election module definition to
   receive a `candidate` JSON object and call the built-in `insert` function:

   ```pact
   (defun add-candidate (candidate)
     (insert
       candidates
       (at 'key candidate)
       {
         "name": (at 'name candidate),
         "votes": 0
       }
     )
   )
   ```

   In this code, you pass the following arguments to the `insert` function:
   
   - The name of table you want to update. 
     In this case, the table is the `candidates` table. 
   - The value for the key of the row to be inserted. 
     In this case, the value of the `key` field is extracted from the `candidate` object
   - The key-value object representing the row to be inserted into the table. 
     The keys correspond to the column names.
     In this case, the `votes` column of the new value always gets a value `0` and the `name` column gets a value of `"Candidate A"`, `"Candidate B"`, or `"Candidate C"`, as per your test cases.

   ```pact
   pact election.repl -t
   ```

   You should see that the transaction succeeds with output similar to the
   following:

   ```bash
   election.repl:39:0:Trace: Using n_14912521e87a6d387157d526b281bde8422371d1.election
   election.repl:40:0:Trace: Expect: success: Add Candidate A
   election.repl:45:0:Trace: Expect: success: Add Candidate B
   election.repl:50:0:Trace: Expect: success: Add Candidate C
   election.repl:55:0:Trace: Commit Tx 4: Add candidates
   Load successful
   ```

   The key of each row in a table must be unique. You can add a transaction to
   the `election.repl` file to test that you can't insert a row with a duplicate
   key. For example:

   ```pact
   (begin-tx "Add candidate with existing key")
     (use n_14912521e87a6d387157d526b281bde8422371d1.election)
     (expect-failure
       "Database exception: Insert: row found for key 1"
       (add-candidate { "key": "1", "name": "Candidate D" })
     )
   (commit-tx)
   ```

   If you were to execute this transaction, it would fail—as expected—with
   output similar to the following:

   ```bash
   election.repl:57:0:Trace: Begin Tx 5: Add candidate with existing key
   election.repl:58:2:Trace: Using n_14912521e87a6d387157d526b281bde8422371d1.election
   election.repl:59:2:Trace: Expect failure: success: Database exception: Insert: row found for key 1
   election.repl:63:0:Trace: Commit Tx 5: Add candidate with existing key
   Load successful
   ```

3. Verify that you only have three candidates in the table by adding the following assertion to the `election-dapp/pact/election.repl` file:

   ```pact
   (begin-tx "List candidates")
     (use n_14912521e87a6d387157d526b281bde8422371d1.election)
     (expect
       "There should be three candidates"
       3
       (length (list-candidates))
     )
   (commit-tx)
   ```

7. Execute the transaction using the `pact` command-line program:

   ```pact
   pact election.repl -t
   ```

   You should see that the transaction succeeds with output similar to the
   following:

   ```bash
   election.repl:64:0:Trace: Begin Tx 6: List candidates
   election.repl:65:2:Trace: Using n_14912521e87a6d387157d526b281bde8422371d1.election
   election.repl:66:2:Trace: Expect: success: There should be three candidates
   election.repl:71:0:Trace: Commit Tx 6: List candidates
   Load successful
   ```

   You've now seen how candidates can be stored in a database table and that the
   `list-candidates` function works as expected to retrieve information from
   that table. The next step is to restrict access to the `add-candidate`
   function, so that ony the `election` module owner can update the `candidates`
   database.

## Guard add-candidate with a capability

Right now, the `add-candidate` function is publicly accessible. Anyone with a
Kadena account can nominate a candidate. If everyone can nominate and vote on
anyone, the whole election process and the idea of representative governance
breaks down. To prevent that kind of chaos, you need a gatekeeper—a guard—that
restricts access to the nominating process and the number of candidates to be
voted on.

For the election application, this gatekeeper or **guard** is the holder of the
`admin-keyset` administrative account. To restrict access to the `add-candidate`
function, you can use the `GOVERNANCE` capability. The `GOVERNANCE` capability
enforces the use of the `admin-keyset` to sign transactions that call specific
functions. In the election application, the `GOVERNANCE` capability protects
access to the `add-candidate` function.

To guard access to the `add-candidate` function:

1. Open the `election-dapp/pact/election.repl` file in the code editor on your
   computer.

2. Add a transaction in which you expect adding a fourth candidate to fail.

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

   (begin-tx "Add candidate without permission")
     (use n_14912521e87a6d387157d526b281bde8422371d1.election)
     (expect-failure
       "Adding a candidate with the wrong keyset should fail"
       "Keyset failure (keys-all)"
       (add-candidate { "key": "4", "name": "Candidate D" })
     )
   (commit-tx)
   ```

3. Execute the transaction using the `pact` command-line program:
   
   ```pact
   pact election.repl -t
   ```

   You should see that the transaction fails with output similar to the
   following:

   ```bash
   election.repl:89:4:Trace: FAILURE: Adding a candidate with the wrong keyset should fail: expected failure, got result = "Write succeeded"
   election.repl:94:2:Trace: Commit Tx 7: Add candidate without permission
   election.repl:89:4:ExecError: FAILURE: Adding a candidate with the wrong keyset should fail: expected failure, got result = "Write succeeded"
   Load failed
   ```

4. Open the `election-dapp/pact/election.pact` file in your code editor.

5. Update the `add-candidate` function to add a capability guard as follows:

   ```pact
   (defun add-candidate (candidate)
     (with-capability (GOVERNANCE)
       (insert
         candidates
         (at 'key candidate)
         {
           "name": (at 'name candidate),
           "votes": 0
         }
       )
     )
   )
   ```

   The `with-capability` function tries to bring the `GOVERNANCE` in scope of the code block that it wraps. 
   If it fails to do so, because of a keyset failure in this case, the wrapped code block isn't executed. 
   
6. Execute the transaction using the `pact` command-line program:
   
   ```pact
   pact election.repl -t
   ```

   You should see output similar to the following that verifies the
   `add-candidate` function is now guarded by the `GOVERNANCE` capability:

   ```bash
   election.repl:87:2:Trace: Begin Tx 7: Add candidate without permission
   election.repl:88:4:Trace: Using n_14912521e87a6d387157d526b281bde8422371d1.election
   election.repl:89:4:Trace: Expect failure: success: Adding a candidate with the wrong keyset should fail
   election.repl:94:2:Trace: Commit Tx 7: Add candidate without permission
   Load successful
   ```

## Update the election module locally

Now that you've updated and tested your `election` module using the Pact REPL,
you can update the module deployed on the local development network.

To update the `election` module on the development network:

1. Verify the development network is currently running on your local computer.

2. Open and unlock the Chainweaver desktop or web application and verify that:

   - You're connected to **development network (devnet)** from the network list.
   - Your administrative account name with the **k:** prefix exists on chain 1.
   - Your administrative account name is funded with KDA on chain 1.

   You're going to use Chainweaver to sign the transaction that updates the
   module.

3. Open the `election-dapp/snippets` folder in the terminal shell.

4. Update your `election` module on the development network by running a command
   similar to the following with your administrative account name:

   ```bash
   npm run deploy-module:devnet -- k:<your-public-key> upgrade init-candidates
   ```
   
   Remember that `k:<your-public-key>` is the default **account name** for the administrative account that you funded in [Add an administrator account](/build/election/add-admin-account).
   You can copy this account name from Chainweaver when viewing the account watch list. 
  
   In addition to the account name, you pass `upgrade` and `init-candidates` to add`{"init-candidates": true, "upgrade": true}` to the transaction data.
   These fields are required to allow you to update the module and execute the `(create-table candidates)` statement from your `election` module.

1. Click **Sign All** in Chainweaver to sign the request.

   After you click Sign All, the transaction is executed and the results are
   displayed in your terminal shell. For example, you should see output similar
   to the following:

   ```bash
   {
     gas: 60855,
     result: { status: 'success', data: [ 'TableCreated' ] },
     reqKey: 'Bd80eOQ-yeWqrcsj6iEuFZ2rcMrv3OsWXhGZKOyEkHw',
     logs: 'UjxuW6e-d_p2nmYsytoqdKjqza3Gq_839IIWZ1uQDDs',
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
         creationTime: 1705172812,
         ttl: 28800,
         gasLimit: 100000,
         chainId: '1',
         gasPrice: 1e-8,
         sender: 'k:5ec41b89d323398a609ffd54581f2bd6afc706858063e8f3e8bc76dc5c35e2c0'
       },
       blockTime: 1705172951004717,
       prevBlockHash: 'AMJ6IoPnkMJ8WZFe6Vso5uuYAhep4gP87ANb7rYyvwg',
       blockHeight: 14456
     },
     continuation: null,
     txId: 14483,
     preflightWarnings: []
   }
   { status: 'success', data: [ 'TableCreated' ] }
   ```

2. Verify your contract changes in the Chainweaver Module Explorer by refreshing
   the list of **Deployed Contracts**, then clicking **View** for the `election`
   module.

   After you click View, the Module Explorer displays the `list-candidates` and
   `add-candidate` functions. If you click **Open**, you can view the module
   code in the editor pane and verify that the `election` module deployed on the
   local development network is what you expect.

## Connect the front-end

You now have the election backend defined in a smart contract running on the
development network. To make the functions in the smart contract available to
the election application website, you need to modify the frontend to exchange
data with the development network.

The frontend, written in TypeScript, uses repositories to exchange data with the
backend. The interfaces for these repositories are defined in the
`frontend/src/types.ts` file. By default, the frontend uses the in-memory
implementations of the repositories. By making changes to the implementation of
the `interface ICandidateRepository` in
`frontend/src/repositories/candidate/DevnetCandidateRepository.ts`, you can
configure the frontend to use the `devnet` backend instead of the `in-memory`
backend. After making these changes, you can use the frontend to add candidates
to and list candidates from the `candidates` table managed by your `election`
module running on the development network blockchain.

### List candidates

To modify the frontend to list candidates from the development network:

1. Open
   `election-dapp/frontend/src/repositories/candidate/DevnetCandidateRepository.ts`
   in your code editor.

2. Replace the value of the `NAMESPACE` constant with your own principal
   namespace.

   ```typescript
   const NAMESPACE = 'n_14912521e87a6d387157d526b281bde8422371d1';
   ```

3. Review the `listCandidates` function:

   ```typescript
   const listCandidates = async (): Promise<ICandidate[]> => {
     const transaction = Pact.builder
       // @ts-ignore
       .execution(Pact.modules[`${NAMESPACE}.election`]['list-candidates']())
       .setMeta({
         chainId: CHAIN_ID,
         gasLimit: 100000,
       })
       .setNetworkId(NETWORK_ID)
       .createTransaction();

     const { result } = await client.dirtyRead(transaction);

     return result.status === 'success'
       ? (result.data.valueOf() as ICandidate[])
       : [];
   };
   ```
    
1. Remove the `@ts-ignore` comment and notice that the name of your module cannot be found in `Pact.modules`.
    
    To fix this problem, you must generate types for your Pact module that can be picked up by the Kadena client (`@kadena/client` library).

2. Open a terminal, change to the `election-dapp/frontend` directory, then
   generate types for your `election` module by running the following command:

   ```bash
   npm run pactjs:generate:contract:election
   ```

   This command uses the `pactjs` library to generate the TypeScript definitions
   for the election contract and should clear the error reported by the code
   editor. Depending on the code editor, you might need to close the project in
   the editor and reopen it to reload the code editor window with the change.

   After you clear the error, note that the `listCandidates` function:

   - Sets the chain identifier, gas limit, and network identifier before
     creating the transaction.
   - Uses the `dirtyRead` method to preview the transaction result without
     sending a transaction to the blockchain. The `dirtyRead` method is provided
     by the Kadena client library. This method allows you to return a raw
     response for a transaction as you saw when you deployed your smart
     contract.
   - Processes the response from the development network and returns a list of
     candidates or an empty list.

6. Change to the terminal where the `election-dapp/frontend` directory is your
   current working directory.

7. Install the frontend dependencies by running the following command:

   ```bash
   npm install
   ```

1. Start the frontend application configured to use the `devnet` backend by running the following command: 

   ```bash
   npm run start-devnet
   ```

9. Open `http://localhost:5173` in your browser and verify that the website
   loads without errors.

   You'll notice that—unlike the frontend configured to the in-memory
   backend—there are no candidates displayed when the frontend connects to the
   development network backend. With the development network backend, candidates
   must be added to the `candidates` table before they can be displayed. To do
   that, you must first modify the `addCandidate` function in the frontend.

### Add candidate

To modify the frontend to add candidates from the development network:

1. Open `election-dapp/frontend/src/repositories/candidate/DevnetCandidateRepository.ts` in your code editor.

2. Review the `addCandidate` function.
   
   In the first line, the function receives a candidate object and the account of the transaction sender.

   ```typescript
   const addCandidate = async (candidate: ICandidate, sender: string = ''): Promise<void> => {
   ```

   You provide this information using a form on the website.

   The next lines start constructing the transaction:

   ```typescript
   const transaction = Pact.builder.execution(
     // @ts-ignore
     Pact.modules[`${NAMESPACE}.election`]['add-candidate'](candidate),
   );
   ```

3. Remove the `@ts-ignore` comment to enable the frontend function to call the
   `add-candidate` function in your `election` module.

   The function takes the `candidate` object to insert data into the
   `candidates` database when the transaction is executed.

   Because the `add-candidate` function is guarded by the `GOVERNANCE`
   capability that enforces the `admin-keyset` account, the next lines add the
   keyset and signer data to the transaction:

   ```typescript
   .addData('admin-keyset', {
     keys: [accountKey(sender)],
     pred: 'keys-all',
   })
   .addSigner(accountKey(sender))
   ```

   These lines correspond to the `(env-data)` and `(env-sig)` code you specified in your `./pact/election.repl` file.
   Unlike the transaction for listing candidates, the transaction for adding candidates must be sent to the blockchain, so you must pay a transaction fee—in units of gas—for the resources consumed to process the transaction.
   
   The value of the `senderAccount` field in the metadata specifies the account that pays for gas.
   This is important to remember because, in the [Add a gas station](/build/election/add-a-gas-station) tutorial, you'll specify the account of a **gas station** to pay for transactions that are signed by voters.
   However, the transaction to add a candidate must be signed and paid for by the same account.

   ```typescript
   .addSigner(accountKey(sender))
   .setMeta({
     chainId: CHAIN_ID,
     senderAccount: sender,
   })
   ```

   The `addCandidate` function also implements a preflight request. The
   preflight request allows you to test a transaction without sending it. The
   response to the preflight request contains information about the expected
   success of the transaction and the how much gas the transaction requires. If
   the transaction would fail or the gas fee is higher than you would like, you
   can choose not to send the transaction.

   ```typescript
   const preflightResponse = await client.preflight(signedTx);

   if (preflightResponse.result.status === 'failure') {
     throw preflightResponse.result.error;
   }
   ```

   The remainder of the `addCandidate` function deals with sending the
   transaction and processing the response.

2. Open and unlock the Chainweaver desktop or web application and verify that:

   - You're connected to **development network (devnet)** from the network list.
   - Your administrative account name with the **k:** prefix exists on chain 1.
   - Your administrative account name is funded with KDA on chain 1.

   You're going to use Chainweaver to sign the transaction that adds a candidate
   to the database.

3. Click **Accounts** in the Chainweaver navigation panel, then copy the account
   name for your administrative account.

4. Open `http://localhost:5173` in your browser, then click **Set Account**.

5. Paste your administrative account, then click **Save**.

6. Click **Add candidate**, type the candidate information, then click **Save**. 
   
   Type candidate information using the following format:

   ```json
   { "key": "1", "name": "Your name" }
   ```

7. Click **Sign All**.
   
   After signing the request, a loading indicator is displayed on the website while the transaction is in progress. 
   As soon as the transaction completes successfully, the candidate you nominated is added to the list.

## Next steps

In this tutorial, you learned how to:

- Upgrade the smart contract for your election website.
- Include a `candidates` database table and functions for listing and adding
  candidates to the table.
- Connect the frontend of the election website to the local development network
  as a backend.

In the next tutorial, you'll upgrade the `election` module to enable people to
cast a vote on a candidate with their Kadena account.

To see the code for the activity you completed in this tutorial and get the
starter code for the next tutorial, check out the `08-voting` branch from the
`election-dapp` repository by running the following command in your terminal
shell:

```bash
git checkout 08-voting
```
