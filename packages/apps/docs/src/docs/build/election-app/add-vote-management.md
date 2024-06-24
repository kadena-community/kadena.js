---
title: "Add vote management"
description: "Add voting and vote counting functionality to the election application in the Pact module smart contract backend."
menu: "Workshop: Election application"
label: "Add vote management"
order: 08
layout: full
tags: [pact, smart contract, typescript, tutorial]
---

# Add vote management

In the previous tutorial, you built and deployed an election smart contract on the local development network. 
You then connected the frontend built with the `@kadena/client` library to the development network backend.
After connecting the frontend to the development network backend, you were able to add a candidate to the `candidates` database table in the Pact `election` module and see the results in the election application website.

In this tutorial, you'll update the `election` module to allow anyone with a Kadena account to cast a vote on a candidate. 
After you update the backend functionality, you'll modify the frontend to use the development network so that Kadena account holders can vote using the election application website and have their votes recorded on the blockchain, ensuring the security and transparency of the election process.

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
- You have created an election Pact module and deployed it as described in [Write a smart contract](/build/election/write-a-smart-contract) and updated its functionality as described in [Nominate candidates](/build/election/nominate-candidates).

## Increment votes for a candidate

When an account holder clicks **Vote Now** in the election application, it triggers a call to the `vote` function in the `frontend/src/repositories/vote/DevnetVoteRepository.ts` file, passing the account name and the name of the candidate corresponding to the table row that was clicked. 
The `vote` function in the frontend uses the Kadena client to execute the `vote` function defined in the `election` module. 

To implement the `vote` function in the `election` Pact module, you can test your code as you go using the Pact REPL as you did in previous tutorials.

### Organize your REPL files

So far, you have added all of your tests for the `election` module to the  `election-dapp/pact/election.repl` file. 
While this is convenient if you have a small number of tests, continuing to add tests to a single file will make testing more complex and difficult to follow. 
To keep tests more organized, you can split them into multiple `.repl` files and reuse the code by loading one file into the other. 

To organize tests into separate files:

1. Open the `election-dapp/pact` folder in the code editor on your computer.

2. Rename `election.repl` to `candidates.repl`.

3. Create a new `setup.repl` file in the `pact` folder.

4. Move the code before `(begin-tx "Load election module")` from the `candidates.repl` into the `setup.repl` file. 

5. Create a new `voting.repl` file in the `pact` folder and add the following as the first line in the file:
   
   ```pact
   (load "setup.repl")
   ```
6. Open the `candidates.repl` file and and add the following as the first line in the file:
   
   ```pact
   (load "setup.repl")
   ```

7. Verify tests in the `candidates.repl` file still pass by running the following command:

   ```bash
   pact candidates.repl -t
   ```

8. Verify that `voting.repl` loads successfully by running the following command:

   ```bash
   pact voting.repl -t
   ```

### Prepare a test for incrementing votes

Based on the work you did in the previous tutorial, the election application website displays a table of the candidates you have added.
Each candidate starts with zero (0) votes.
Each row in the table has a **Vote Now** button.
If you click **Vote Now**, the number of votes displayed in corresponding row should be increased by one. 
The table is rendered based on the result of a call to the `list-candidates` function of the `election` Pact module. 
So, in the Pact REPL you can test the behavior of the new `vote` function against the return value of `list-candidates`. 

To prepare a test for incrementing votes:

1. Open the `election-dapp/pact/voting.repl` file in the code editor on your computer.

2. Add transactions to load the `election` Pact module and to add a candidate to the `candidates` table:
   
   ```pact
   (begin-tx "Load election module")
     (load "election.pact")
   (commit-tx)
   
   (begin-tx "Add a candidate")
     (use n_14912521e87a6d387157d526b281bde8422371d1.election)
     (add-candidate { "key": "1", "name": "Candidate A" })
   (commit-tx)
   ```

   Remember to replace the namespace with your own principal namespace.

3. Add the following lines of code for a voting transaction:
   
   ```pact
   (begin-tx "Voting for a candidate")
     (use n_14912521e87a6d387157d526b281bde8422371d1.election)
     (expect
       "Candidate A has 0 votes"
       0
       (at 'votes (at 0 (list-candidates)))
     )
     (vote "1")
     (expect
       "Candidate A has 1 vote"
       1
       (at 'votes (at 0 (list-candidates)))
     )
   (commit-tx)
   ```
   
   This code:
   
   - Verifies that the candidate is initialized with zero votes.
   - Calls the `vote` function with the key value (`1`) of the candidate as the only argument.
   - Asserts that the candidate has one vote.
   
   If you were to execute the transaction, the test would fail because the `vote` function doesn't exist yet in the `election` module and you would see output similar to the following:
   
   ```bash
   voting.repl:18:5:Error: Cannot resolve vote
   Load failed
   ```

1. Open the `election-dapp/pact/election.pact` file in your code editor.

2. Define the `vote` function after the `add-candidate` function and before the `candidates-schema` definition with the following lines of code: 
   
   ```pact
   (defun vote (candidateKey:string)
     (with-read candidates candidateKey
       { "name" := name, "votes" := numberOfVotes }
       (update candidates candidateKey { "votes": (+ numberOfVotes 1) })
     )
   )
   ```
   
   In this code, the `vote` function takes the `candidateKey` parameter with a of type string: 
  
   - The `candidateKey` value specifies the key for the row in the `candidates` table to read using the built-in `with-read` Pact function. 
   - The database column named  `"votes"` is assigned a value from the  `numberOfVotes` variable. 
   
   The `vote` function then calls the built-in `update` Pact function with three arguments to specify:
     
   - The table to update (`candidates`).
   - The key for the row to update (`candidateKey`).
   - An object with the column names to update and the new value for the respective columns. 
     In this case, the `vote` function only updates the `votes` column.
     The new value is the current number of votes that was obtained from `with-read` and stored in the `numberOfVotes` variable incremented by one (`(+ numberOfVotes 1)`).

1. Execute the transaction using the `pact` command-line program:
   
   ```pact
   pact voting.repl -t
   ```

   You should see the transaction succeeds with output similar to the following:

   ```bash
   voting.repl:13:5:Trace: Expect: success: Candidate A has 0 votes
   voting.repl:18:5:Trace: Write succeeded
   voting.repl:19:5:Trace: Expect: success: Candidate A has 1 vote
   voting.repl:24:3:Trace: Commit Tx 4: Voting for a candidate
   Load successful
   ```

### Prepare a test for voting on an invalid candidate

To make the `vote` function more robust, you should handle the scenario where the `candidateKey`  passed in that doesn't exist in the database. 

To prepare a test for votes on an invalid candidate:

1. Open the `election-dapp/pact/voting.repl` file in the code editor on your computer.

1. Add the following transaction before the `Voting for a candidate` transaction:

   ```pact
   (begin-tx "Voting for a non-existing candidate")
     (use n_14912521e87a6d387157d526b281bde8422371d1.election)
     (expect-failure
       "Cannot vote for a non-existing candidate"
       (vote "X")
     )
   (commit-tx)
   ```
   
   Remember to replace the namespace with your own principal namespace.

1. Execute the transaction using the `pact` command-line program:
   
   ```pact
   pact voting.repl -t
   ```

   You should see that the transaction succeeds with output similar to the following:

   ```bash
   voting.repl:11:0:Trace: Begin Tx 4: Voting for a non-existing candidate
   voting.repl:12:5:Trace: Using n_14912521e87a6d387157d526b281bde8422371d1.election
   voting.repl:13:5:Trace: Expect failure: success: Cannot vote for a non-existing candidate
   voting.repl:17:0:Trace: Commit Tx 4: Voting for a non-existing candidate
   ```
   
   The test returns the expected result—failure—because the call to `with-read` fails for the `candidateKey` value of `"X"`.
   The failure prevents the execution of the `update` function. 
   
   As you add checks to the `vote` function, you should return more specific error messages, so that each check provides information about why it failed to the caller of the function.

2. Update the invalid candidate transaction to specify `"Candidate does not exist"` as the expected error message:
   
      ```pact
   (begin-tx "Voting for a non-existing candidate")
     (use n_14912521e87a6d387157d526b281bde8422371d1.election)
     (expect-failure
       "Cannot vote for a non-existing candidate"
       "Candidate does not exist"
       (vote "X")
     )
   (commit-tx)
   ```
   
   In this code:
   
   - This first argument of `expect-failure` is the name of the test.
   - The second argument is the expected output of the function call.
   - The third argument is the actual function call. 

1. Execute the transaction using the `pact` command-line program:
   
   ```pact
   pact voting.repl -t
   ```

   You should see that the transaction fails with output similar to the following:
   
   ```bash
   voting.repl:11:0:Trace: Begin Tx 4: Voting for a non-existing candidate
   voting.repl:12:5:Trace: Using n_14912521e87a6d387157d526b281bde8422371d1.election
   voting.repl:13:5:Trace: FAILURE: Cannot vote for a non-existing candidate: expected error message to contain 'Candidate does not exist', got '(with-read candidates candidat...: Failure: Tx Failed: with-read: row not found: X'
   voting.repl:18:0:Trace: Commit Tx 4: Voting for a non-existing candidate
   ```
   
   To prevent the read operation from failing with a standard message, you can use the built-in `with-default-read` Pact function.
   The `with-default-read` function doesn't throw an error if no row is found with the specified key, but returns a default object instead. 
   The default object contains the default values for the name (`""`) and votes (`0`) columns.
   
   For successful reads, the value of the `"name"` column is assigned to a `name` variable, similar to the value of the `"votes"` column. 
   This allows you to enforce that `name` must not be an empty string, and throw a specific error if it is. 

1. Open the `election-dapp/pact/election.pact` file in your code editor.

2. Update the `vote` function to use the `with-default-read` function and return an error if `name` is an empty string:


   ```pact
   (defun vote (candidateKey:string)
     (with-default-read candidates candidateKey
       { "name": "", "votes": 0 }
       { "name" := name, "votes" := numberOfVotes }
       (enforce (> (length name) 0) "Candidate does not exist")
       (update candidates candidateKey { "votes": (+ numberOfVotes 1) })
     )
   )
   ```

1. Execute the transaction using the `pact` command-line program:
   
   ```pact
   pact voting.repl -t
   ```

   You should see that the transaction succeeds with output similar to the following:
   
   ```bash
   voting.repl:11:0:Trace: Begin Tx 4: Voting for a non-existing candidate
   voting.repl:12:5:Trace: Using n_14912521e87a6d387157d526b281bde8422371d1.election
   voting.repl:13:5:Trace: Expect failure: success: Cannot vote for a non-existing candidate
   voting.repl:18:0:Trace: Commit Tx 4: Voting for a non-existing candidate
   ```
   
   The `vote` function now returns a specific error message when someone tries to vote for a candidate that doesn't exist.

## Prevent double votes

At this point, the `election` smart contract allows voting, but it doesn't yet restrict each Kadena account to only voting once. 
To keep track of the accounts that have already voted, you can create a new `votes` table that uses the account name for each voter as the key and the candidate key as the only column. 
In addition to a check against this table, you'll also need to check the keyset used to sign each voting transaction.

### Define votes schema and table

To define the database schema and table:

1. Open the `election-dapp/pact/election.pact` file in your code editor.

2. Add the schema for the `votes` database table inside of the `election` module definition after the definition of the `candidates` schema and table with the following lines of code:

   ```pact
     (defschema votes-schema
       candidateKey:string
     )
   
     (deftable votes:{votes-schema})
   ```

1. Create the table outside of the election module by adding the following lines of code at the end of `./pact/election.pact`, after the `election` module definition and the `init-candidates` code snippet:
   
   ```pact
   (if (read-msg "init-votes")
     [(create-table votes)]
     []
   )
   ```
   
   With this code, `read-msg` reads the `init-votes` field from the transaction data. 
   If you set this field to `true` in your module deployment transaction, the statement between the first square brackets is executed.
   This statement creates the `votes` table based on its schema definition inside the module when you load the module into the Pact REPL or upgrade the module on the blockchain.

2. Open the `election-dapp/pact/setup.repl` file in your code editor.

3. Add `, 'init-votes: true` to the `env-data` so that this data is loaded in the Pact REPL environment when you load the `election` module and the `votes` table is created:

   ```pact
   (env-data
     { 'admin-keyset:
         { 'keys : [ "5ec41b89d323398a609ffd54581f2bd6afc706858063e8f3e8bc76dc5c35e2c0" ]
         , 'pred : 'keys-all
         }
     , 'init-candidates: true
     , 'init-votes: true
     }
   )
   ```

4. Execute the transaction using the `pact` command-line program:
   
   ```pact
   pact voting.repl -t
   ```

   You should see that the transaction succeeds with `TableCreated` twice in the output similar to the following:
   
   ```bash
   election.pact:48:0:Trace: ["TableCreated"]
   election.pact:53:0:Trace: ["TableCreated"]
   ```

### Test the votes table

To test that an account can only vote once:

1. Open the `election-dapp/pact/voting.repl` file in the code editor on your computer.

2. Add the following transaction to assert that it is not possible to cast more than one vote:

   ```pact
   (begin-tx "Double vote")
     (use n_14912521e87a6d387157d526b281bde8422371d1.election)
     (expect-failure
       "Cannot vote more than once"
       "Multiple voting not allowed"
       (vote "1")
     )
   (commit-tx)
   ```

   Remember to replace the namespace with your own principal namespace.

4. Execute the transaction using the `pact` command-line program:
   
   ```pact
   pact voting.repl -t
   ```

   You should see that the transaction fails with output similar to the following:

   ```bash
   voting.repl:37:5:Trace: FAILURE: Cannot vote more than once: expected failure, got result = "Write succeeded"
   voting.repl:42:3:Trace: Commit Tx 6: Double vote
   voting.repl:37:5:ExecError: FAILURE: Cannot vote more than once: expected failure, got result = "Write succeeded"
   Load failed
   ```
   
   Remember that all transactions in `voting.repl` are signed with the `admin-keyset` you defined for the REPL environment in the `setup.repl` file. 
   Your administrative account can cast more than one vote on `Candidate A`, which makes the election unfair.

   To fix this issue, you'll need to update the `vote` function and `election` module.

1. Open the `election-dapp/pact/election.pact` file in your code editor.

3. Update the `vote` function to include the account name and prevent the same account from voting more than once:
   
   ```pact
   (defun vote (account:string candidateKey:string)
     (let ((double-vote (account-voted account)))
       (enforce (= double-vote false) "Multiple voting not allowed"))
   
     (with-default-read candidates candidateKey
       { "name": "", "votes": 0 }
       { "name" := name, "votes" := numberOfVotes }
       (enforce (> (length name) 0) "Candidate does not exist")
       (update candidates candidateKey { "votes": (+ numberOfVotes 1) })
       (insert votes account { "candidateKey": candidateKey })
     )
   )
   ```

   This code:
   
   - Adds the account of the voter as the first parameter of the `vote` function.
   - Stores the result from a new `account-voted` function in the `double-vote` variable and uses that value to prevent an account from voting more than once.
   - Enforces that no row in the `votes` table is keyed with the account name using the `with-default-read` pattern that you used to prevent voting on a non-existent candidate. 
   - Inserts a new row into the `votes` table with the account name as the key and the candidate key as the value for the `candidateKey` column every time the `vote` function is called. 
    
4. Add the `account-voted` function to check if an account has already voted:
   
   ```pact
   (defun account-voted:bool (account:string)
     (with-default-read votes account
       { "candidateKey": "" }
       { "candidateKey" := candidateKey }
       (> (length candidateKey) 0)
     )
   )
   ```

   The frontend of the election application can then use the result from the `account-voted` function to determine if **Vote Now** should be enabled. 
   
1. Open the `election-dapp/pact/voting.repl` file in the code editor on your computer.

2. Update all calls to the `vote` function to pass your administrative account name as the first argument.
   
   For example, update the `vote` function in the `Double vote` transaction:

   ```pact
   (begin-tx "Double vote")
     (use n_14912521e87a6d387157d526b281bde8422371d1.election)
     (expect-failure
       "Cannot vote more than once"
       "Multiple voting not allowed"
       (vote "k:5ec41b89d323398a609ffd54581f2bd6afc706858063e8f3e8bc76dc5c35e2c0" "1")
     )
   (commit-tx)
   ```

4. Execute the transaction using the `pact` command-line program:
   
   ```pact
   pact voting.repl -t
   ```

   You should see that the transaction succeeds with output similar to the following:

   ```bash
   voting.repl:35:3:Trace: Begin Tx 6: Double vote
   voting.repl:36:5:Trace: Using n_14912521e87a6d387157d526b281bde8422371d1.election
   voting.repl:37:5:Trace: Expect failure: success: Cannot vote more than once
   voting.repl:42:3:Trace: Commit Tx 6: Double vote
   Load successful
   ```
   
   With these changes, the same account can't call the `vote` function more than once.

### Prevent voting on behalf of other accounts

The current implementation of the `vote` function does, however, allow the administrative
account to vote on behalf of other accounts. 

To demonstrate voting on behalf of another account:

1. Open the `election-dapp/pact/setup.repl` file in the code editor on your computer.
2. Add a `voter-keyset` to `env-data` so that this data is loaded in the Pact REPL environment when you load the `election` module:

   ```pact
   , 'voter-keyset: { "keys": ["voter"], "pred": "keys-all" }
   ```

1. Load the `coin` module and the interfaces it implements with the following lines of code in the `setup.repl`:

   ```pact
   (begin-tx "Set up coin")
     (load "root/fungible-v2.pact")
     (load "root/fungible-xchain-v1.pact")
     (load "root/coin-v5.pact")
   
     (create-table coin.coin-table)
     (create-table coin.allocation-table)
   
     (coin.create-account "voter" (read-keyset "voter-keyset"))
     (coin.create-account "k:5ec41b89d323398a609ffd54581f2bd6afc706858063e8f3e8bc76dc5c35e2c0" (read-keyset "admin-keyset"))
   (commit-tx)
   ```
   
   This code:
   
   - Creates the `coin.coin-table` and `coin.allocation-table` required to create the `voter` account.
   - Creates the `voter` account and your administrative account in the `coin` module database. 
   
   Remember to replace the administrative account name with your own account name.

1. Open the `election-dapp/pact/voting.repl` file in the code editor on your computer.
2. Add a transaction at the end of the file to cast a vote on behalf of the `voter` account signed by the `admin-keyset`.

   ```pact
   (begin-tx "Vote on behalf of another account")
     (use n_14912521e87a6d387157d526b281bde8422371d1.election)
     (expect-failure
       "Voting on behalf of another account should not be allowed"
       "Keyset failure (keys-all): [voter]"
       (vote "voter" "1")
     )
   (commit-tx)
   ```

   Remember to replace the namespace with your own principal namespace.

4. Execute the transaction using the `pact` command-line program:
   
   ```pact
   pact voting.repl -t
   ```

   You should see that the transaction fails with output similar to the following:

   ```bash
   voting.repl:51:0:Trace: Commit Tx 8: Vote on behalf of another account
   voting.repl:46:2:ExecError: FAILURE: Voting on behalf of another account should not be allowed: expected failure, got result = "Write succeeded"
   Load failed
   ```
   
   The test failed because the `voter` account name doesn't exist in the `votes` table keys and the candidate exists, so the number of votes for the candidate is incremented. 
   You need to make sure that the signer of the transaction owns the KDA account passed to the `vote` function.

1. Open the `election-dapp/pact/election.pact` file in the code editor on your computer.

1. Define the `ACCOUNT-OWNER` capability to enforce the guard of the account passed to the `vote` function:
   
   ```pact
   (use coin [ details ])
   
   (defcap ACCOUNT-OWNER (account:string)
       (enforce-guard (at 'guard (coin.details account)))
   )
   ```

   This code uses the `coin.details` function to get the guard for an account by account name. 
   The `details` function of the `coin` module must be imported into the `election` module to be able to use it.
   In this case, `voter-keyset` is the guard for the account. 
   By enforcing this guard, you can ensure that the keyset used to sign the `vote` transaction belongs to the account name passed to the function.

2. Apply the capability by wrapping the `update` and `insert` statements in the `vote` function inside a `with-capability` statement as follows:

   ```pact
   (defun vote (account:string candidateKey:string)
     (let ((double-vote (account-voted account)))
       (enforce (= double-vote false) "Multiple voting not allowed"))
   
     (with-default-read candidates candidateKey
       { "name": "", "votes": 0 }
       { "name" := name, "votes" := numberOfVotes }
       (enforce (> (length name) 0) "Candidate does not exist")
       (with-capability (ACCOUNT-OWNER account)
         (update candidates candidateKey { "votes": (+ numberOfVotes 1) })
         (insert votes account { "candidateKey": candidateKey })
       )
     )
   )
   ```

3. Execute the transaction using the `pact` command-line program:
   
   ```pact
   pact voting.repl -t
   ```

   You should see that the transaction succeeds with output similar to the following:

   ```bash
   voting.repl:44:3:Trace: Begin Tx 8: Vote on behalf of another account
   voting.repl:45:2:Trace: Using n_14912521e87a6d387157d526b281bde8422371d1.election
   voting.repl:46:2:Trace: Expect failure: success: Voting on behalf of another account should not be allowed
   voting.repl:51:0:Trace: Commit Tx 8: Vote on behalf of another account
   Load successful
   ```

   With these changes, the administrative account can't vote on behalf of another account.

### Verify voting on one's own behalf 

To verify that the voter account can vote on its own behalf:

1. Open the `election-dapp/pact/voting.repl` file in the code editor on your computer.

1. Add a transaction to verify that the `voter` account can vote on its own behalf, leading to an increase of the number of votes on `Candidate A` to 2:

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
   
   Remember to replace the namespace with your own principal namespace.

2. Execute the transaction using the `pact` command-line program:
   
   ```pact
   pact voting.repl -t
   ```

   You should see that the transaction succeeds with output similar to the following:

   ```bash
   voting.repl:62:4:Trace: Expect: success: Candidate A has 2 votes
   voting.repl:67:2:Trace: Commit Tx 9: Vote as voter
   Load successful
   ```

Impressive!
You now have a simple smart contract with the basic functionality for conducting an election that allows Kadena account holders to vote on the candidate of their choice.
With these changes, you're ready to upgrade the `election` module on the development network.

## Update the development network

Now that you've updated and tested your `election` module using the Pact REPL, you can update the module deployed on the local development network.

To update the `election` module on the development network:

1. Verify the development network is currently running on your local computer.

2. Open and unlock the Chainweaver desktop or web application and verify that:
   
   - You're connected to **development network (devnet)** from the network list.
   - Your administrative account name with the **k:** prefix exists on chain 1.
   - Your administrative account name is funded with KDA on chain 1. 
   
   You're going to use Chainweaver to sign the transaction that updates the `election` module. 

3. Open the `election-dapp/snippets` folder in a terminal shell on your computer.

1. Deploy your election module on the development network by running a command similar to the following with your administrative account name:
   
   ```bash
   npm run deploy-module:devnet -- k:<your-public-key> upgrade init-votes
   ```

   Remember that `k:<your-public-key>` is the default **account name** for the administrative account that you funded in [Add an administrator account](/build/election/add-admin-account).
   You can copy this account name from Chainweaver when viewing the account watch list.
   
   In addition to the account name and `upgrade`, you must include `init-votes` in the command to add `{"init-votes": true}` to the transaction data.
   This field is required to allow you to execute the `(create-table votes)` statement from your `election` module.

2. Click **Sign All** in Chainweaver to sign the request.

   After you click Sign All, the transaction is executed and the results are displayed in your terminal shell.
   For example, you should see output similar to the following:
   
   ```bash
   { status: 'success', data: [ 'TableCreated' ] }
   ```

3. Verify your contract changes in the Chainweaver Module Explorer by refreshing the list of **Deployed Contracts**, then clicking **View** for the `election` module.
   
   After you click View, you should see the updated list of functions and capabilities.
   If you click **Open**, you can view the module code in the editor pane and verify that the `election` module deployed on the local development network is what you expect.

## Update the frontend and cast a vote

As you learned in [Nominate candidates](/build/election/nominate-candidates), the election application frontend is written in TypeScript and uses repositories to exchange data with the backend. 
By default, the frontend uses the in-memory implementations of the repositories. 
By making changes to the implementation of the `interface IVoteRepository` in
`frontend/src/repositories/candidate/DevnetVoteRepository.ts` file, you can configure the
frontend to use the `devnet` backend instead of the `in-memory` backend. 
After making these changes, you can use the frontend to cast votes on candidates listed in the `candidates` table and managed by the `election` module running on the development network blockchain.

To cast a vote using the election application website:

1. Open `election-dapp/frontend/src/repositories/candidate/DevnetVoteRepository.ts` in your code editor.
2. Replace the value of the `NAMESPACE` constant with your own principal namespace.

   ```typescript
   const NAMESPACE = 'n_14912521e87a6d387157d526b281bde8422371d1';
   ```

3. Review the `hasAccountVoted` function:
   
   ```typescript
   const hasAccountVoted = async (account: string): Promise<boolean> => {
     const transaction = Pact.builder
       // @ts-ignore
       .execution(Pact.modules[`${NAMESPACE}.election`]['account-voted'](account))
       .setMeta({ chainId: CHAIN_ID })
       .setNetworkId(NETWORK_ID)
       .createTransaction();
     const { result } = await client.dirtyRead(transaction);
   
     if (result.status === 'success') {
       return result.data.valueOf() as boolean;
     } else {
       console.log(result.error);
       return false;
     }
   };
   ```
   
1. Remove the `@ts-ignore` comment from the function and notice the resulting errors.
   To fix the errors, you must generate types for your Pact module that can be picked up by `@kadena/client`.

4. Open a terminal, change to the `election-dapp/frontend` directory, then generate types for your `election` module by running the following command:
   
   ```bash
   npm run pactjs:generate:contract:election
   ```
   
   This command uses the `pactjs` library to generate the TypeScript definitions for the election contract and should clear the errors reported by the code editor. 
   Depending on the code editor, you might need to close the project in the editor and reopen it to reload the code editor window with the change.

5. Review the `vote` function, remove the `@ts-ignore` comment, and save your changes to the `DevnetVoteRepository.ts` file.

6. Open the `election-dapp/frontend` folder in a terminal shell on your computer.
7. Install the frontend dependencies by running the following command:
   
   ```bash
   npm install
   ```

8. Start the frontend application configured to use the `devnet` backend by running the following command: 

   ```bash
   npm run start-devnet
   ```

1. Open `http://localhost:5173` in your browser, then click **Set Account**.
2. Paste your administrative account, then click **Save**.
3. Add a candidate, if necessary.
4. Click **Vote Now** for a candidate, sign the transaction, and wait for the transaction to
finish. 
1. Verify that the number of votes for the candidate you voted for increased by one vote. 
   
   After you vote, the Vote Now button is disabled because the frontend checks if your account has already voted by making a `local` request to the `account-voted` function of the `election` Pact module.

   ![View the result after voting](/assets/docs/election-workshop/election-after-voting.png)

## Next steps

In this tutorial, you learned how to:

- Organize test cases into separate REPL files.
- Modify the `vote` function iteratively using test cases and expected results.
- Use the `with-default-read` function.
- Add a `votes` database table to store the vote cast by each account holder. 
- Connect the voting functionality from the frontend to the development network as a backend. 
  
With this tutorial, you completed the functional requirements for the `election` Pact module, deployed it as a smart contract on your local development network, and interacted with the blockchain backend through the frontend of the election application website.

However, you might have noticed that your administrative account had to pay for gas to cast a vote. 

To make the election accessible, account holders should be able to cast a vote without having to pay transaction fees. 
The next tutorial demonstrates how to add a **gas station** module to the `election` smart contract.
With this module, an election organization can act as the owner of an account that provides funds to pay the transaction fees on behalf of election voters. 
By using a gas station, voters can cast votes without incurring any transaction fees.

To see the code for the activity you completed in this tutorial and get the starter code for the next tutorial, check out the `09-gas-station` branch from the `election-dapp` repository by running the following command in your terminal shell:

```bash
git checkout 09-gas-station
```
