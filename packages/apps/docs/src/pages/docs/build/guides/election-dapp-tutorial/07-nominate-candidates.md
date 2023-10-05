---
title: "07: Nominating candidates"
description: "Election dApp tutorial chapter 07: Nominating candidates"
menu: Election dApp tutorial
label: "07: Nominating"
order: 7
layout: full
tags: [pact, smart contract, typescript, tutorial]
---

# Chapter 07: Nominating candidates

In the previous chapters you laid the groundwork for the election smart contract that will
become the back-end of the election website. The election Pact module will store a list
of candidates and the number of votes they have received, as well as a list of the accounts
that have already voted, to make sure that every account can vote only once. In this chapter
you will set up the candidates database table and add functions to the module for adding
candidates to the table and listing all candidates that are stored in the table.

## Recommended reading

 * [Pact Schemas and Tables](https://docs.kadena.io/learn-pact/beginner/schemas-and-tables)

## Database

To prepare the Pact module's database you need to define a schema for the table and define
the table with the schema inside the `election` Pact module. The actual creation of the table
happens outside the Pact module, just like selecting the namespace.

### Define candidates schema and table

Add the following lines to `./pact/election.pact`, inside the `election` module definition.
The `defschema` command defines a `candidate-schema` with two columns: `name` of type string
and `votes` of type integer.

```pact
  (defschema candidates-schema
    "Candidates table schema"
    name:string
    votes:integer)

  (deftable candidates:{candidates-schema})
```

### Create candidates table

Add the following lines at the end of `./pact/election.pact`, after the `election` module
definition. With `read-msg`, the field `init-candidates` is read from the transaction data.
If you set this field to `true` in the data of your module deployment transaction, the
statement between the square brackets will be executed. This will create the table
`candidates` based on its definitions inside the module.

```pact
(if (read-msg "init-candidates")
  [(create-table candidates)]
  []
)
```

Before trying to create the table on Devnet, verify that your changes work as expected by
running some tests in the Pact REPL. Create a file `./pact/election.repl` and set up your
test environment with transactions you can borrow from previous chapters.

```pact
(env-data
  { 'admin-keyset:
      { 'keys : [ "128c32eb3b4d99be6619aa421bc3df9ebc91bde7a4acf5e8eb9c27f553fa84f3" ]
      , 'pred : 'keys-all
      }
  , 'upgrade: false
  , 'init-candidates: true
  }
)

(env-sigs
  [{ 'key  : "128c32eb3b4d99be6619aa421bc3df9ebc91bde7a4acf5e8eb9c27f553fa84f3"
   , 'caps : []
  }]
)

(begin-tx "Define principle namespace")
  (define-namespace 'n_fd020525c953aa002f20fb81a920982b175cdf1a (read-keyset 'admin-keyset ) (read-keyset 'admin-keyset ))
(commit-tx)

(begin-tx "Define admin-keyset")
  (namespace 'n_fd020525c953aa002f20fb81a920982b175cdf1a)
  (define-keyset "n_fd020525c953aa002f20fb81a920982b175cdf1a.admin-keyset" (read-keyset 'admin-keyset ))
(commit-tx)

(begin-tx "Load election module")
  (load "election.pact")
(commit-tx)
```

You will recognize `env-data` and `env-sigs`. Be sure to replace the keys with the public
key of your own admin account. Notice that `'init-candidates: true` is included in the data.
This ensures that the `(create-table candidates)` command is executed when you load the
`election` module into the Pact REPL. The first two transactions define your principle
namespace and an `admin-keyset` therein. Replace the principle namespace with the namespace
used in your `election.pact` file. The last transaction, loading `election.pact`, would
fail without this namespace and keyset being defined, because inside `election.pact` you 
defined the `election` module in that principal namespace and it is governed by the
`admin-keyset` in that same namespace. Try removing either or both of the first two 
transactions and run `election.repl` to see what happens. Then, restore the file and run it
again. You will see that it loads successfully. In the output you should also see a
message containing `TableCreated`, proving that the table was indeed created.

## List candidates

Although the candidates table seems to have been created successfully, it is worth testing
that the table works as expected before upgrading the `election` module on Devnet.
Start by writing a test for the current implementation of the `election.list-candidates`
function in `./pact/election.repl` and run the file.

```pact
(begin-tx "List candidates")
  (use n_fd020525c953aa002f20fb81a920982b175cdf1a.election)
  (expect
    "There should be no candidates in the candidates table"
    []
    (list-candidates)
  )
(commit-tx)
```

Now, change the expected output to `[]` and run the file again. You should now have a failing
test that can be fixed by updating the return value of the `list-candidates` function in
`./pact/election.pact` with the following statement that selects all values of an existing
table. Run `./pact/election.repl` again and observe that the test passes.

```pact
(select candidates (constantly true))
```

Changing `candidates` in the statement above to anything would make the test fail with an
error containing `Cannot resolve`, which proves that the `candidates` table exists and
is readable.

## Add candidate

Without any candidates the election website would not be very interesting. There would
not be anyone to vote on. Add the following test that will fail because the
`add-candidate` function cannot be resolved. You will fix the test later by
implementing this function in the `election` module.

```pact
(begin-tx "Add candidates")
  (use n_fd020525c953aa002f20fb81a920982b175cdf1a.election)
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

The `add-candidate` function will accept a candidate object as an argument, defined
in json format. Notice that this object has the fields `key` and `name`, while the
`candidate-schema` you defined for the `candidates` table has two columns `name` and
`votes`. That it is because the `votes` column will always get an initial value
of `0` when a new candidate is added, so it is not necessary to send the amount of
votes along with the transaction. The value of `key` will be used as a unique
index for the table row that is added. It cannot be automatically generated, so you have
to pass a value yourself. Add the following test to `./pact/election.repl` and run the file.

```pact
(begin-tx "Add candidates")
  (use n_fd020525c953aa002f20fb81a920982b175cdf1a.election)
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

You should now have a failing test that you can fix by implementing the `add-candidates`
function in `./pact/election.pact`. The function will receive one argument `candidates`,
which is a json object like the ones specified in your test. The function body consists
of a single call to the built-in `insert` function that takes three argument. The first
argument is a reference to the table you want to use, the `candidates` table in this
case. The second argument is the value for the key of the row to be inserted. In the
example below, the value of the `key` field is extracted from the `candidate` object
that is passed into the `add-candidate` function as an argument. The third argument
of the `insert` function is a key-value object representing the row to be inserted
into the table. The keys correspond to the column names. So, in this example, the `votes`
column of the new value will always get a value `0` and the `name` column will get a value
of either `"Candidate A"`, `"Candidate B"`, or `"Candidate C"`, as per your test cases.

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

Add the function above to the `./pact/election.pact` file, run the `./pact/election.repl`
file again and verify that all tests are now passing. Remember that the key of each row
in a table must be unique. Add the following code to `./pact/election.repl` to test that
adding another candidate with key `1` will fail with a `Database exception` and run the
file.

```pact
(begin-tx "Add candidate with existing key")
  (use n_fd020525c953aa002f20fb81a920982b175cdf1a.election)
  (expect-failure
    "Adding a candidate with an existing key should fail"
    "Database exception: Insert: row found for key 1"
    (add-candidate { "key": "1", "name": "Candidate D" })
  )
(commit-tx)
```

At this point, there should still be only three candidates in the table. You can verify
that by adding the following assertion to `./pact/election.repl` and running the file.

```pact
(begin-tx "List candidates")
  (use n_fd020525c953aa002f20fb81a920982b175cdf1a.election)
  (expect
    "There should be three candidates"
    3
    (length (list-candidates))
  )
(commit-tx)
```

This demonstration of the unique key constraint for database tables also provides more
confidence that the `list-candidates` function works as expect. Before upgrading the
`election` module on Devnet, there is just one more thing that must be added.

## Guard adding candidates with a capability

Right now, the `add-candidates` function is publically accessible, meaning that anyone
with a Kadena account would be able nominate a candidate. What kind of democracy would
that be, where everyone has the right to vote and to be nominated for election? No, no, no,
in the real world, you have to know the right people to get elected, like the holder
of the `admin-keyset`. To that end, the `add-candidates` function can be guarded by the
`GOVERNANCE` capability that enforces the `admin-keyset`. At the end of
`./pact/election.repl`, define another keyset and add a failing test in which you
expect adding a fourth candidate to fail. Run the file when you are done.

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
  (use n_fd020525c953aa002f20fb81a920982b175cdf1a.election)
  (expect-failure
    "Adding a candidate with the wrong keyset should fail"
    "Keyset failure (keys-all)"
    (add-candidate { "key": "4", "name": "Candidate D" })
  )
(commit-tx)
```

Fix the test by implementing the capability guard in `./pact/election.pact` as follows and run
`./pact/election.repl` again.

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

The `with-capability` function will try to bring the `GOVERNANCE` in scope of the code block
that it wraps. If it fails to do so, because of a keyset failure in this case, the wrapped
code block will not be executed. Thus, the `add-capability` is now guarded by the `GOVERNANCE`
capability.

## Upgrade election module on Devnet

Open up a terminal and change the directory to the `./snippets` folder in the root of
your project. Execute the `./deploy-module.ts` snippet by running the following command.
Replace `k:account` with your admin account. Also, make sure that Devnet is running and
Chainweaver is open so you can sign the transaction. In addition to the account name, you
need to pass `init-candidates` as an argument. This will add `{"init-candidates": true}` to
the transaction, which leads to the execution of `(create-table candidates)` at the bottom
of your `./pact/election.pact`.

```bash
npm run deploy-module:devnet -- k:account init-candidates
```

If all is well, the last line of the output will be as follows.

```bash
{ status: 'success', data: [ 'TableCreated' ] }
```

Look up your `election` module in the Module Explorer of Chainweaver. Click the refresh button
at the top right of the table and view the module. You should see the `add-candidates` being
added to the list of functions in the right pane. Click the `Open` button on the top right
to load the Pact code into the editor in the left pane and verify that the `election` module
on Devnet is in sync with the version on your local computer.

## Connect the front-end to Devnet

Now that you have a working election smart contract running on Devnet, the time has finally
come to connect the front-end of the election website to the blockchain. The front-end
uses repositories to exchange data with the back-end. The interfaces of these repositories
are defined in `frontend/src/types.ts`. By default, the front-end is configured
to use the in-memory implementations of the repositories. After making some changes to the
Devnet implementation of the `interface ICandidateRepository` in
`frontend/src/repositories/candidate/DevnetCandidateRepository.ts`, you can configure the
front-end to use the `devnet` back-end instead of the `in-memory` back-end. Then, you
should be able to add candidates to the candidates table of your election module on Devnet,
and list nominated candidates, via the forms on your election website.

### List candidates

Open `frontend/src/repositories/candidate/DevnetCandidateRepository.ts` in your editor. For
now, you only need to focus on the `listCandidates` and `addCandidates`. The implementation
of these repository method is slightly more complex than the in-memory implementation in
`frontend/src/repositories/candidate/InMemoryCandidateRepository.ts`, but the pattern
should look familiar to the snippets you have used in the previous chapters.
function using components from the `@kadena/client` library. Start easy by replacing the
value `NAMESPACE` constant with your own principal namespace.

```typescript
const NAMESPACE = 'n_fd020525c953aa002f20fb81a920982b175cdf1a';
```

Have a look at the first three lines of the `listCandidates` function. There `@ts-ignore`
comment suppresses a type error on the following line.

```typescript
const transaction = Pact.builder
    // @ts-ignore
    .execution(Pact.modules[`${NAMESPACE}.election`]['list-candidates']())
```

Remove the comment and inspect the problem displayed in your editor or thrown when you
run the project. The problem is that the name of your module cannot be found in `Pact.modules`.
To fix the error, you need to generate types for your election Pact module, that can be
picked up by `@kadena/client`.

```bash
npm run pactjs:generate:contract:election
```

The error should have disappeared from your editor. If you are using Visual Studio Code, you
may have to reload the window first. The front-end should now be fine to build and run.
Before the transaction is created, only the chain id and network id are configured, and
a remarkably high gas limit is set. Apparently, sending a full table read transaction to
the blockchain is quite expensive. Fortunately, you can preview the result, like you
did in Chainweaver earlier, without actually sending a transaction to the blockchain. The
`dirtyRead` method of the client is used conveniently handles this preview request. The rest
of the `listCandidates` function deals with processing the response from Devnet. If the
transaction was successful, a list of candidates is returned, otherwise an empty list.

Open up a terminal with the current directory set to `./frontend` relative to the root
of your project. Run the front-end application configured with the `devnet` back-end by
executing the following commands. Visit `http://localhost:5173` in your browser and
verify that the website loads without errors.

```bash
npm install
npm run start-devnet
```

### Add candidate

While the front-end configured with the in-memory back-end displayed a list of five
candidates right away, no candidates will be displayed when using the devnet back-end.
You will first need to add candidates. Before adding a candidate, open
`frontend/src/repositories/candidate/DevnetCandidateRepository.ts` in your editor and
make sure you understand the `addCandidate` implementation. The function receives a
candidate object and the account of the transaction sender. These will be provided by
you via the form on the website. Remove the `@ts-ignore` comment and observe that the
`insert-candidate` function of your `election` module will be called with the candidate
object when the transaction is executed. Recall that the `add-candidates` function is
guarded by the `GOVERNANCE` capability that enforces the `admin-keyset`. That is why
the following data and signer are added to the transaction.

```typescript
.addData('admin-keyset', {
  keys: [accountKey(sender)],
  pred: 'keys-all',
})
.addSigner(accountKey(sender))
```

Notice that these lines correspond to the following code in your `./pact/election.repl` file.

```pact
(env-data
  { 'admin-keyset:
      { 'keys : [ "128c32eb3b4d99be6619aa421bc3df9ebc91bde7a4acf5e8eb9c27f553fa84f3" ]
      , 'pred : 'keys-all
      }
  }
)

(env-sigs
  [{ 'key  : "128c32eb3b4d99be6619aa421bc3df9ebc91bde7a4acf5e8eb9c27f553fa84f3"
   , 'caps : []
  }]
)
```

In contrast to when you listed candidates, the transaction for adding candidates is actually
sent to the blockchain, so gas must be paid for processing the transaction. The value of the
`senderAccount` field of the metadata specifies the account that will pay for gas. This is
important to remember, because in the next chapters you will specify the account of a
gas statiion to pay for the gas of a transaction that is signed by the account of a voter.
The transaction to add a candidate will be signed and paid by the same account.

```typescript
.addSigner(accountKey(sender))
.setMeta({
  chainId: CHAIN_ID,
  senderAccount: sender,
})
```

Another difference between the `listCandidates` and `addCandidates` implementation is the use
of a preflight request in the `addCandidates` function. This allows you to dry run the
transaction without actually sending the transaction and paying for gas. The preflight
response contains information about the expected success of the transaction and the
amount of gas it will cost. If the transaction would fail or the gas fee is higher than you
like, you can choose not to send the transaction. This helps to prevent unnecessary loss
of KDA paid for gas.

```typescript
const preflightResponse = await client.preflight(signedTx);

if (preflightResponse.result.status === 'failure') {
  throw preflightResponse.result.error;
}
```

The remainder of of the `addCandidates` function deals with sending the transaction and processing the response. An error will be thrown if the transaction fails.

Make sure that Chainweaver is open so you can sign the request. Then, enter your admin account
name on the election website. Click the `Add candidate` button that appears and add a candidate
in the following format.

```json
{ "key": "1", "name": "Your name" }
```

Click `Refresh candidates` to reload the list of candidates and, if all is
well, the candidate you nominated will be listed with its name and zero
votes. Great job!

## Next steps

In this chapter, you have upgraded the smart contract for your election
website. You added a candidates table and functions for listing and adding
candidates to the table. Furthermore, you connected the front-end of the
election website to you local Devnet. The only thing left to finish the
election website is to make it possible to cast a vote on one of the 
candidates. But here is the tricky part, voting should be free for everyone
and storing your vote in the database of your smart contract requires
sending a transacion to the blockchain, which costs gas. This is where
Kadena's gas stations come in. A gas station is a Pact module that can
be used to pay gas for certain transaction. In the next chapter, you will
add the `election-gas-station` module to your smart contract. The election
admin account will transfer KDA to the gas station account, so this account
can pay the gas for all voting transactions automatically via the gas station
mechanism.
