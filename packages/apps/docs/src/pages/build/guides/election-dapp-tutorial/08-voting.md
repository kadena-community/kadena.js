---
title: "08: Voting"
description: "In the eighth chapter of the Election dApp tutorial you will add voting functionality to the election Pact module."
menu: Election dApp tutorial
label: "08: Voting"
order: 08
layout: full
tags: [pact, smart contract, typescript, tutorial]
---

# Chapter 08: Voting

In the previous chapters you built and deployed an election smart contract to Devnet. Using the
`@kaden/client` library in the front-end, you were able to add candidates to a database table
in the election Pact module and read all the candidates from that table via the user interface
of the election website. In this chapter you will first upgrade the election module with
functionality that allows anyone with a Kadena account to cast a vote on a candidate. Then,
you will use the Devnet implementation of the vote repository in the front-end to enable
voting on the blockchain via the election website.

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
git checkout 08-voting
```

If you want to skip ahead and see the final solution for this chapter, you can check
out the branch containing the starter code for the next chapter.

```bash
git checkout 09-gas-station
```

## Increment votes of a candidate

Clicking the `Vote` button on the election website triggers a call to the `vote` function
in `frontend/src/repositories/vote/DevnetVoteRepository.ts` with your account name and the
name of the candidate in the same table row as the button that was clicked. In turn, this
function will execute the vote function of the election module using the Kadena JavaScript
client. Some of the lines
of the `vote` function have been commented out. You will gradually add these lines back in
as you add more logic to the election Pact module. The uncommented lines in this function
are highly similar to the `addCandidates` function in the `DevnetCandidateRepository`,
except for a different function being called. You will now implement the `vote` function
in the `election` Pact module, using a test-driven approach in the Pact REPL.

### Organize your REPL files

The `./pact/election.repl` has already become quite large. Adding more tests to this file
will make it harder to understand. To keep your test organized as you add more tests, you can
split up your test suite in multiple `.repl` files and reuse code by loading one file into
the other. Rename `./pact/election.repl` to `./pact/candidates.repl` and create the following
two files.

 * `./pact/setup.repl`
 * `./pact/voting.repl`

Next, move the code before `(begin-tx "Load election module")` into `./pact/setup.repl`. Then,
add the following lines at the start of both `./pact/candidates.repl` and
`./pact/voting.repl`.

```pact
(load "setup.repl")
```

Run `./pact/candidates.repl` to verify that your tests still pass. Also, make sure that
`./pact/voting.repl` loads successfully before you continue.

### Increment votes of a candidate

The election website now displays a table of candidates all having 0 votes.
Everytime someone clicks the `Vote` button in a row of the table, the number of votes displayed
in that row should be increased by 1. The table is rendered based on the result of a call to
the the `list-modules` function of the `election` Pact module. So, in the Pact REPL you can
test the behavior of the new `vote` function against the return value of `list-modules`. Add
the following code to `./pact/voting.repl`, replace the namespace with your own principal
namespace and run the file. The first two transactions load the `election` Pact module and add
a candidate to the candidates table. Then, in the `Voting for a candidate` transaction, the
first assertion verifies that the candidate is initialized with 0 votes. Then, the `vote`
function is called with the `key` of the candidate as the only argument. Finally, it is
asserted that the candidate has 1 vote.

```pact
(begin-tx "Load election module")
  (load "election.pact")
(commit-tx)

(begin-tx "Add a candidate")
  (use n_fd020525c953aa002f20fb81a920982b175cdf1a.election)
  (add-candidate { "key": "1", "name": "Candidate A" })
(commit-tx)

(begin-tx "Voting for a candidate")
  (use n_fd020525c953aa002f20fb81a920982b175cdf1a.election)
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

The test will fail with `Error: Cannot resolve vote`, because the `vote` function does not
exist yet. Implement the `vote` function in `./pact/election.pact`, below the `add-candidate`
function, as follows. Define the function with a parameter `candidateKey` of type string. On
the next line you will use its value as the key for the row of the candidates table to read
using the built-in `with-read` function. On the following line, you specify that the `"votes"`
column value must be assigned to a variable `numberOfVotes`. Finally, the built-in `update`
function
is called with three arguments. The first argument is the table to update: `candidates`. The
second argument is the key of the row that should be updated: `candidateKey`. The third
argument is an object keyed with the column names to update and the new value for the
respective columns. Only the `votes` column will be updated and the new value is the
current number of votes that was obtained from `with-read` incremented by one:
`(+ numberOfVotes 1)`.

```pact
(defun vote (candidateKey:string)
  (with-read candidates candidateKey
    { "name" := name, "votes" := numberOfVotes }
    (update candidates candidateKey { "votes": (+ numberOfVotes 1) })
  )
)
```

Run `./pact/voting.repl` again and verify that the test passes.

### Vote on a candidate that does not exist

To make the `vote` function more robust, you need to handle the scenario where a
`candidateKey` is passed in, that does not exist in the database. Add the following code to
`./pact/voting.repl` before the transaction `Voting for a candidate`, replace the namespace
with your own principal namespace and run the file again.

```pact
(begin-tx "Voting for a non-existing candidate")
  (use n_fd020525c953aa002f20fb81a920982b175cdf1a.election)
  (expect-failure
    "Cannot vote for a non-existing candidate"
    (vote "X")
  )
(commit-tx)
```

You will notice that the test already passes. Namely, the call to `with-read` fails for
`candidateKey` `"2"`, which prevents the execution of the `update` function. Since you will
add several more checks in the `vote` function, it is advisable to throw specific error
messages for each check that fails to provide clear feedback to the caller of this function.
In `./pact/voting.repl`, add a line below `"Cannot vote for a non-existing candidate"` to
specify the expected error message: `"Candidate does not exist"`.
This first argument of `expect-failure` is the name of the test, while the second line you
just added is the expected output of the third argument: the actual function call. Now, when
your run the test again, it fails with the message `Failed: with-read: row not found: 2`. To
prevent the read operation from failing with a standard message, you can leverage the built-in
`with-default-read` function that does not throw an error if no row is found with the specified
key, but returns a default object instead. The default will be an object containing the
default values `""` and `0` for the columns `"name"` and `"votes"` respectively.
For successful reads, the value of the `"name"` column is assigned to a variable
`name`, similar to the value of the `"votes"` column. This allows you to enforce that `name`
must not be an empty string, and throw a specific error otherwise. Update the your `vote`
function implementation as follows.

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

Run `./pact/voting.repl` again and verify that the test now passes. The `vote` function now
returns a meaningful error message for the scenario where someone tries to vote for a
candidate that does not exist.

## Prevent double votes

Add this point, the basic voting mechanism is in place, but it does not fulfill the requirement
of each Kadena account being allowed to only vote once. To keep track of the accounts that
have already voted, you will create a new table `votes` keyed by the account name of voters
and the candidate key as the only column. In addition to a check against this table, you
will also add checks against the keyset used to sign the voting transaction.

### Define votes schema and table

Add the following lines to `./pact/election.pact`, inside the `election` module definition,
below the definition of the `votes` schema and table.

```pact
  (defschema votes-schema
    candidateKey:string
  )

  (deftable votes:{votes-schema})
```

### Create votes table

Add the following lines at the end of `./pact/election.pact`. With `read-msg`, the field
`init-votes` is read from the transaction data.
If you set this field to `true` in the data of your module deployment transaction, the
`votes` table will be created when you load the module into the Pact REPL or upgrade the
module on the blockchain.

```pact
(if (read-msg "init-votes")
  [(create-table votes)]
  []
)
```

In `./pact/setup.repl`, add `, 'init-candidates: true` to the `env-data` command as follows,
so this data will be loaded in the Pact REPL environment when you load the `election`
module, to ensure that the `votes` table will be created.

```pact
(env-data
  { 'admin-keyset:
      { 'keys : [ "128c32eb3b4d99be6619aa421bc3df9ebc91bde7a4acf5e8eb9c27f553fa84f3" ]
      , 'pred : 'keys-all
      }
  , 'init-candidates: true
  , 'init-votes: true
  }
)
```

If you run `./pact/voting.repl` again, the file should still load successfully and you
should see `TableCreated` appear twice in the output. Once for the `candidates` table
and once for the `votes` table.

### Use the votes table

Add another transaction at the end of `./pact/voting.repl` to assert that it is not
possible to cast more than one vote. Use the snippet below, replacing the namespace
with your own principal namespace and run the file again.

```pact
(begin-tx "Double vote")
  (use n_fd020525c953aa002f20fb81a920982b175cdf1a.election)
  (expect-failure
    "Cannot vote more than once"
    "Multiple voting not allowed"
    (vote "1")
  )
(commit-tx)
```

The test will fail with the error
`FAILURE: Cannot vote more than once: expected failure, got result = "Write succeeded"`.
Remember that all transactions in `./pact/voting.repl` so far are signed with the
`admin-keyset`, as defined in `./pact/setup.repl`. This means that your admin account
is able to cast more than one vote on `Candidate A`, which makes the election unfair. To fix
this, insert a row into the `votes` table with the account name as key and the candidate key
as value for the column `candidateKey`. In addition, add the account of the voter as the
first parameter of the `vote` function and enforce that there is no row in the `votes` table
that is keyed with the account name, using the `with-default-read` pattern that you just used
to prevent voting on a non-existing candidate. Create a separate function `account-voted`
for the checking if
an account has already voted, so the front-end of the election website can fetch this
information to determine of the voting buttons should be enabled. Within the `vote` function,
the result of `account-voted` is stored in a variable `double-vote` before the condition is
enforced. Update the implementation of the `vote` function as follows.

```pact
(defun account-voted:bool (account:string)
  (with-default-read votes account
    { "candidateKey": "" }
    { "candidateKey" := candidateKey }
    (> (length candidateKey) 0)
  )
)

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

Update all calls to the `vote` function in `./pact/voting.repl` to pass your admin account
name as the first argument and run the file once more. All tests should now pass, meaning
that it is no longer possible to call the `vote` function of the election module with the
same account more than once.

### Prevent voting on behalf of other accounts

The current implementation of the `vote` function does, however, still allow the admin
account to vote on behalf of other accounts. Create a voter account to demonstrate this. First,
add a `voter-keyset` to `env-data` in `./pact/setup.repl`.

```pact
, 'voter-keyset: { "keys": ["voter"], "pred": "keys-all" },
```

While you are editing this file, load the `coin` module and the interaces it implements at
the end of it. After that, create the `coin.coin-table` and `coin.allocation-table` required
to create the voter account. Also, create the voter account and your admin account in the
`coin` module's database. Remember to replace the admin account name with your own.

```pact
(begin-tx "Set up coin")
  (load "root/fungible-v2.pact")
  (load "root/fungible-xchain-v1.pact")
  (load "root/coin-v5.pact")

  (create-table coin.coin-table)
  (create-table coin.allocation-table)

  (coin.create-account "voter" (read-keyset "voter-keyset"))
  (coin.create-account "k:128c32eb3b4d99be6619aa421bc3df9ebc91bde7a4acf5e8eb9c27f553fa84f3" (read-keyset "admin-keyset"))
(commit-tx)
```

Add a transaction at the end of `./pact/voting.repl` to cast a vote for the voter account,
still signed by the admin keyset. Run the file.

```pact
(begin-tx "Vote on behalf of another account")
  (use n_fd020525c953aa002f20fb81a920982b175cdf1a.election)
  (expect-failure
    "Voting on behalf of another account should not be allowed"
    "Keyset failure (keys-all): [voter]"
    (vote "voter" "1")
  )
(commit-tx)
```

The test should fail with the message:
`FAILURE: Double voting not allowed: expected failure, got result = "Write succeeded"`,
because the account name `voter` does not yet exist in the `votes` table keys and the
candidate exists, so the number of votes of the candidate is incremented. You need to
make sure that the signer of the transaction owns the KDA account passed to the `vote`
function. To this end, define the `ACCOUNT-OWNER` capability that enforces the guard
of the account passed to the `vote` function. The `coin.details` function can be used
to get the guard of an account by account name. The `details` function of the `coin`
module must be imported in the `election` module to be able to use it.
In this case, the guard of the account is the `voter-keyset`. By enforcing this guard,
you can make sure that the keyset used to sign the `vote` transaction belongs to the
account name passed to the function.

```pact
(use coin [ details ])

(defcap ACCOUNT-OWNER (account:string)
    (enforce-guard (at 'guard (coin.details account)))
)
```

To apply the capability, wrap the `update` and `insert` statements in `./pact/election.pact`
inside a `with-capability` statement as follows.

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

Run `./pact/election.repl` and verify that all tests are passing. This means that it is no
longer possible to vote on behalf of another account. For extra confidence that the `vote`
function works as expected add a transaction to verify that the `voter` account can vote
on its own behalf, leading to an increase of the number of votes on `Candidate A` to 2.

```pact
(env-sigs
  [{ 'key  : "voter"
   , 'caps : []
  }]
)

(begin-tx "Vote as voter")
  (use n_fd020525c953aa002f20fb81a920982b175cdf1a.election)
  (vote "voter" "1")
  (expect
    "Candidate A has 2 votes"
    2
    (at 'votes (at 0 (list-candidates)))
  )
(commit-tx)
```

Run the file again and, if all is well, all tests pass, meaning that any account can cast
only one vote on their own behalf. Congratulations, you are now ready to upgrade the `election`
module on Devnet.

## Upgrade election module on Devnet

Open up a terminal and change the directory to the `./snippets` folder in the root of
your project. Execute the `./deploy-module.ts` snippet by running the following command.
Replace `k:account` with your admin account. Also, make sure that Devnet is running and
Chainweaver is open so you can sign the transaction. In addition to the account name and
`upgrade`, you need to pass `init-votes` as an argument. This will add `{"init-votes": true}`
to the transaction, which leads to the execution of `(create-table votes)` at the bottom
of your `./pact/election.pact` file.

```bash
npm run deploy-module:devnet -- k:account upgrade init-votes
```

If all is well, the last line of the output will be as follows.

```bash
{ status: 'success', data: [ 'TableCreated' ] }
```

Look up your `election` module in the Module Explorer of Chainweaver. Click the refresh button
at the top right of the table and view the module. Click the `Open` button on the top right
to load the Pact code into the editor in the left pane and verify that the `election` module
on Devnet is in sync with the version on your local computer.

## Cast a vote on the election website

Open up a terminal with the current directory set to `./frontend` relative to the root
of your project. Run the front-end application configured with the `devnet` back-end by
executing the following commands. Visit `http://localhost:5173` in your browser and
verify that the website loads without errors.

```bash
npm install
npm run start-devnet
```

Set the account to your admin account and nominate a candidate if you have not already. Make
sure that Chainweaver is open so you can sign the transaction. Click the `Vote` button
behind your favorite candidate, sign the transaction and wait for the transaction to
finish. Verify that the number of votes for the candidate
you voted on increased by 1. After you voted, the `Vote` buttons are disabled, because
the front-end checks if you account has already voted by making a `local` request to
the `account-voted` function of the `election` Pact module.

## Next steps

Congratulations! You have completed the `election` Pact module, deployed it to your local
Devnet and demonstrated that the front-end of election website can use it as its back-end.
If you paid close attention during the signing of the transaction, though, you may have
noticed that your admin account still has to pay for gas to cast a vote. To make the
election accessible for everyone, however, it should be possible to cast a vote without
having to pay anything. In the next chapter, you will add a gas station module to the
`election` smart contract that can be funded by the election organisation so it can
pay the gas fee for voting transaction of voters.


