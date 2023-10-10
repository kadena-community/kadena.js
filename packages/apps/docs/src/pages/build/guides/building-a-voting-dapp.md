---
title: Building a voting dApp
description: Building a voting dApp
menu: Build
label: Building a voting dApp
order: 3
layout: full
tags: [pact, smart contract, typescript, tutorial]
---

# Building a voting dApp

One of the best ways to learn a new technology is to get your hands dirty and
build applications with it. In this tutorial we'll learn to use Kadena's smart
contract language, Pact, to build a minimal voting application that runs on the
Chainweb blockchain.

Along the way, we'll learn how to write and test smart contracts in Pact, the
basic architecture of dApps on Chainweb, and about major concepts like gas
stations and deploying contracts. We'll also get acquainted with several useful
tools in the Kadena ecosystem, including the Pact local test server and
JavaScript libraries you can use to interact with nodes running Pact.

### Voting on the Blockchain

:::info

The complete code of this tutorial can also be found in the
[voting dApp repository](https://github.com/kadena-community/voting-dapp).

:::

Elections are a necessary part of democracies and democratic organizations. The
voting systems used to administer elections must ensure a fair process and
trustworthy result — easier said than done! Election security is a deep,
fascinating topic, especially when it comes to online voting.

Blockchain technologies are well-suited to help secure online elections. A
public blockchain gives participants a single view of all transactions, which
makes it easy to verify votes without trusting a central election authority to
tally and report the results.

Blockchain technologies don't solve all election security issues, but they're a
strong foundation and
[researchers have proposed fully-secure online voting systems based on them](https://eprint.iacr.org/2019/1406.pdf).
They've also seen success in the real world: Thailand's Democrat party held an
election in which
[more than 120,000 registered Democrats voted via blockchain](https://bitcoinmagazine.com/culture/thailand-uses-blockchain-supported-electronic-voting-system-primaries).

### What We're Building

We'll build a tiny voting dApp prototype that lets anyone with a Kadena wallet
address vote for a candidate from a selection of candidates. Each voter (i.e.
address) can vote once. Some Kadena accounts are chosen as "election officials",
and the smart contract grants them special privileges to select the candidates.
Election officials can add new candidates at any time (but they can't remove
candidates or adjust their votes).

Once the app is deployed, the election has begun! The frontend for our dApp will
help users submit their votes and will display the total votes received by each
candidate.

## Setup

#### Requirements

1. [Pact](http://github.com/kadena-io/pact)
2. [NodeJS](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
3. [Kadena.js](https://github.com/kadena-community/kadena.js)

#### Create Project Structure

Let's start by creating a basic project structure. Open your terminal and run
the commands below:

```bash
mkdir election-dapp && cd election-dapp
mkdir pact
mkdir frontend
```

We've got the `election-dapp` directory and two additional sub-directories:

- `pact`, which holds the smart contracts
- `frontend`, which holds the frontend part of our application

### Implementing the Voting Smart Contract

A typical developer workflow looks like this:

1. Write contract code in `.pact` files
2. Write tests in `.repl` files
3. Execute your tests in the REPL
4. Deploy to local pact server
5. Deploy to Testnet

In this section we will focus on steps 1 to 3. Later, we'll deploy our smart
contract to a local Pact server and to Testnet (the test version of Chainweb).

In your project directory, let's create two files:

- `pact/election.pact`, which will hold the source code for our smart contract
- `pact/election.repl`, which will hold our tests

:::info

What is Pact REPL? The Pact REPL is an environment where we can load our Pact
source code and work with it interactively. It's a best practice to include a
`.repl` file next to your source code which imports your contract, calls
functions from it, and inspects its current state to ensure everything is
correct.

:::

We also have to import some dependencies to our project but first let's provide
some context to better understand why we need them. In the introduction we
explained that our voting smart contract allows anyone with a wallet address to
vote for a candidate. Kadena uses an account model so creating a wallet means
creating an account for the native coin, KDA, which is a smart contract deployed
on Kadena blockchain. The name of this contract is intuitively `coin`.

The `coin` contract itself has two additional dependencies:

- `fungible-v2`, an interface that each fungible token deployed on Kadena should
  implement
- `fungible-xchain-v1`, an interface that provides standard capability for
  cross-chain transfers.

To be able to properly test our voting contract we will need to invoke functions
defined in the `coin` contract so we have to include it in our project together
with its dependencies, the `fungible-v2` and `fungible-xchain-v1` interfaces.

Please find the latest versions of those modules here:

- [coin-v5.pact](https://github.com/kadena-io/chainweb-node/blob/master/pact/coin-contract/v5/coin-v5.pact)
- [fungible-v2.pact](https://github.com/kadena-io/chainweb-node/blob/master/pact/coin-contract/v2/fungible-v2.pact)
- [fungible-xchain-v1.pact](https://github.com/kadena-io/chainweb-node/blob/master/pact/coin-contract/v4/fungible-xchain-v1.pact)

Make sure to add these files to your project in the `pact/root/` directory. You
should have 3 new files: `coin-v5.pact`, `fungible-v2.pact`,
`fungible-xchain-v1.pact`.

Before we begin writing code, let's recap the features of our voting contract:

1. Voters can record 1 vote for a candidate of their choice from the list of
   options. In response to voting, we'll return confirmation of their vote by
   returning their vote back to them.
2. Election administrators can add candidates. The "add candidate" functionality
   should be guarded to only allow access to keys belonging to the election
   administrator accounts.

#### Election module

We're going to start by creating a Pact module called `election` and define a
keyset named `election-admin-keyset` which is used to guard certain features of
the module.

Let's copy the following code in the `election.pact` file:

```pact
;; election.pact

(namespace 'free)

;; Define a keyset with name `election-admin-keyset`.
;; Keysets cannot be created in code, thus we read them in from the load message data.
(define-keyset "free.election-admin-keyset" (read-keyset 'election-admin-keyset))

;; Define `election` module
(module election GOVERNANCE
  "Election demo module"

  (defcap GOVERNANCE ()
    "Module governance capability that only allows the admin to update this module"
    ;; Check if the tx was signed with the provided keyset, fail if not
    (enforce-keyset "free.election-admin-keyset")
  )
)
```

The `GOVERNANCE` keyword on the module definition line is the _module governance
capability_ and it references the capability defined right below using the
`defcap` construct. It's purpose is to restrict access to the module upgrade and
administration operations, for example later on we'll add an `insert-candidate`
function that only administrators should be able to call and we'll use the
GOVERNANCE capability to guard it. The implementation can be as simple as in our
example, enforcing a keyset or more complex like tallying a stakeholder vote on
an upgrade hash.

:::note

Module names and keyset definitions are required to be unique. We will mention
this again when we get to deploy our contract to Testnet, but you should keep
this in mind when you think about choosing a name for your modules and keysets.

:::

#### Capabilities

Capabilities offer a system to manage user rights in an explicit way, i.e. allow
a user to perform some sensitive task if the required capability has been
successfully acquired. If not, the transaction will fail.

Our module already defines one capability, the module governance capability. In
addition to that, we're going to define the `ACCOUNT-OWNER` and the `VOTED`
capabilities. The `VOTED` capability is used to emit an event when a vote has
been made. The `ACCOUNT-OWNER` capability validates the ownership of the KDA
account that's used to identify a user. This might not be clear at first but
let's look at the code:

```pact
;; election.pact

  ;; Import `coin` module while only making the `details` function available
  ;; in the `election` module body
  (use coin [ details ])

  (defcap ACCOUNT-OWNER (account:string)
    "Make sure the requester owns the KDA account"

    ;; Get the guard of the given KDA account using coin.details function
    ;; and execute it using `enforce-guard`
    (enforce-guard (at 'guard (coin.details account)))
  )

  (defcap VOTED (candidateId:string)
    "Emit an event that indicates a vote has been made for the provided candidate"
    @event
    true
  )
```

The user submitting the vote is identified by the `account` parameter that we
will pass to the `vote` function that we'll implement later on. This parameter
can take any value which is why we need to make sure the value provided is the
correct one, in our case it should be the KDA account controlled by the tx
initiator. Every KDA account has a _guard_ which controls access to it and we're
using the `coin.details` function that returns an object of type
`fungible-v2.account-details` to retrieve this guard for the provided account.
Finally we execute the guard using the built-in Pact function `enforce-guard`.

Don't forget to add the snippet above in the `election` module body.

:::info

To learn more about guards and capabilities, please visit the
[Guards, Capabilities and Events](/pact/reference/concepts#guards) section of
the Pact official documentation.

:::

### Tables and data storage

So far we've defined a module and implemented some capabilities. Now we're going
to talk about storing data. We have to store who the candidates are so you can
vote for them and as well as who voted already so we can prevent double-voting.

Pact smart contracts store data in tables and each table has its own schema. For
our voting contract we need 2 tables: `candidates` and `votes`.

```pact
  ;; election.pact

  ;; Define the `candidates-schema` schema
  (defschema candidates-schema
    "Candidates table schema"

    ;; Candidates table has 2 columns, `name` of type string
    ;; and `votes` which is an `integer`
    name:string
    votes:integer)

  ;; Define the `votes-schema` schema
  (defschema votes-schema
    "Votes table schema"

    ;; Votes table has one column, `cid` - Candidate id of type string
    cid:string
  )

  ;; Define the `votes` table that's using the `votes-schema`
  (deftable votes:{votes-schema})

  ;; Define the `candidates` table that's using the `candidates-schema`
  (deftable candidates:{candidates-schema})
```

To summarize, we created a table to store candidates and their associated vote
counts and one for storing what accounts have already voted to prevent
double-voting.

:::info To find out about all Pact's supported types you can check the
[Data Types](/pact/reference/concepts#data-types) section in the Pact official
documentation. :::

:::note

Pact implements a key-row model which means a row is accessed by a single key.
The key is implicitly present in the schema but it is our responsibility as
developers to design the schema in a way that we can retrieve the information
that we need using a single row query. Multiple row queries are very expensive
and should not be used.

The row key is always a simple string, not to be confused with the cryptographic
keys used for signing transactions.

:::

#### Functionality

We've defined our data storage so now we can add functions to read and write
data, i.e. candidates and votes. One of the core features of our voting contract
is to allow users to vote for a candidate while preventing double-voting so
let's implement it:

```pact
  ;; election.pact

  (defun user-voted:bool (account:string)
    "Check if a user already voted"

    ;; Read from the votes table using `account` param value as key
    ;; with-default-read allows us to set default values for the table columns
    ;; that are returned if the row does not exist.
    (with-default-read votes account

      ;; In this case we're setting the `cid` column default value to an empty string
      { "cid": "" }
      { "cid":= cid }

      ;; Check if `cid` is an empty string or not, return true if not,
      ;; i.e. user already voted and false otherwise,
      ;; meaning the user did not vote yet
      (> (length cid) 0))
  )

  (defun candidate-exists:bool (cid:string)
    "Check if a candidate exists"

    ;; Using a similar approach as in `user-voted` function,
    ;; in this case to check if a candidate exists
    (with-default-read candidates cid
      { "name": "" }
      { "name" := name }
      (> (length name) 0))
  )

  (defun vote-protected (account:string candidateId:string)
    "Safe vote"

    ;; Check that the ACCOUNT-OWNER capability has already been granted, fail if not
    (require-capability (ACCOUNT-OWNER account))

    ;; Read the current number of votes the candidate has
    (with-read candidates candidateId { "votes" := votesCount }

      ;; Increment the number of votes by 1
      (update candidates candidateId { "votes": (+ votesCount 1) })

      ;; Record the vote in the `votes` table (prevent double-voting)
      (insert votes account { "cid": candidateId })

      ;; Emit an event that can be used by the frontend component to update the number of
      ;; votes displayed for a candidate
      (emit-event (VOTED candidateId))
    )
  )

  (defun vote (account:string cid:string)
    "Vote for a candidate"

    ;; Prevent double-voting by checking if the user already voted through `user-voted` function
    ;; and `enforce` the returned value is `false`
    (let ((double-vote (user-voted account)))
      (enforce (= double-vote false) "Multiple voting not allowed"))

    ;; Prevent voting for a candidate that doesn't exist through `candidate-exists`
    ;; function and `enforce` the returned value is `true`
    (let ((exists (candidate-exists cid)))
      (enforce (= exists true) "Candidate doesn't exist"))

    ;; Try to acquire the `ACCOUNT-OWNER` capability which checks
    ;; that the transaction owner is also the owner of the KDA account provided as parameter to our `vote` function.
    (with-capability (ACCOUNT-OWNER account)

      ;; While the `ACCOUNT-OWNER` capability is in scope we are calling `vote-protected` which is the function that updates the database
      (vote-protected account cid))

    (format "Voted for candidate {}!" [cid])
  )
```

A quick recap: we implemented a `vote` function that allows to vote for a
candidate while **preventing double-voting, voting for a candidate that doesn't
exist or voting with an account that the user doesn't own**.

Now that we can vote, we also need a function to read the number of votes a
candidate received:

```pact
  (defun get-votes:integer (cid:string)
    "Get the votes count by cid"

    ;; Read the row using cid as key and select only the `votes` column
    (at 'votes (read candidates cid ['votes]))
  )
```

Last thing on the list is adding candidates:

```pact
  (defun insert-candidate (candidate)
    "Insert a new candidate, admin operation"

    ;; Try to acquire the GOVERNANCE capability
    (with-capability (GOVERNANCE)
      ;; While GOVERNANCE capability is in scope, insert the candidate
      (let ((name (at 'name candidate)))
        ;; The key has to be unique, otherwise this operation will fail
        (insert candidates (at 'key candidate) { "name": (at 'name candidate), "votes": 0 })))
  )

  (defun insert-candidates (candidates:list)
    "Insert a list of candidates"
    ;; Using the above defined `insert-candidate` to bulk-insert a list of candidates
    (map (insert-candidate) candidates)
  )
```

Inserting a new candidate is an "admin-only" operation and we reused the already
defined `GOVERNANCE` capability to guard it.

We have now essentially completed our module. All the required functionality is
implemented.

When a module is deployed, the tables that it defines need to be created. This
is done using the `create-table` function. Insert the snippet below after the
module's closing parenthesis:

```pact
;; election.pact

;; Read the `upgrade` key from transaction data
(if (read-msg "upgrade")
  ;; If its value is true, it means we're upgrading the module
  ["upgrade"]
  ;; Otherwise, the transaction is deploying the module and we need to create the tables
  [
    (create-table candidates)
    (create-table votes)
  ]
)
```

:::info Code outside the module will be called when the module is loaded the
first time, when its deployed or upgraded. In the snippet above we are checking
if the `upgrade` key that comes from transaction data is `true` and only execute
the `create-table` calls if it's not since we cannot recreate tables when
upgrading a module. :::

You can find the complete source code of the `election.pact` contract in the
[voting dApp repository](https://github.com/kadena-community/voting-dapp).

It's time to summarize what we've learned so far:

- we can use Pact capabilities to protect certain features of our smart contract
- we should design our tables in such a way that we can retrieve the information
  using a single row query
- we can validate the owner of an account by executing its guard

These are general concepts to keep in mind when developing Pact smart contracts.

### Namespaces

Each module or interface needs to be part of a namespace. To set the namespace
of a module we have to use the `namespace` function. Ensure the following line
is at the beginning of your `.pact` files:

```pact
(namespace 'free)
```

Within the same namespace, each module name needs to be unique, similar
requirement for defined keysets.

Access a module's function using the fully qualified name
`{namespace}.{module-name}.{function-name}`, e.g. `free.election.vote`. See the
Pact documentation to
[read more about namespaces](/pact/reference/concepts#namespace-declaration).

The `free` namespace is available to use on both `mainnet` and `testnet`.

### Testing the contract

We wrote quite a bit of code but at this point we don't know if it's working
correctly. A critical step in smart-contract development process is writing a
proper set of tests which is what we're going to focus on now.

:::tip

We separated writing functionality and writing tests to make it easier to follow
this tutorial but in a real-world scenario you should work on these in parallel.

:::

We're going to start by setting up the environment data that we need for our
tests, load the required modules, i.e. `coin` module and of our `election`
module and create some KDA accounts that we will use to vote later on.

Create the `election.repl` file and copy the snippet below:

```pact
;; election.repl

;; begin-tx and commit-tx simulate a transaction
(begin-tx "Load modules")

;; set transaction JSON data
(env-data {
  ;; Here we set the required keysets.
  ;; Note:
  ;; - in a real transaction, `admin-key` would be a public key
  ;; - "keys-all" is a built-in predicate that specifies all keys are needed to sign a tx,
  ;;   in this case we only set one key
  'election-admin-keyset: { "keys": ["admin-key"], "pred": "keys-all" },
  'alice-keyset: { "keys": ["alice-key"], "pred": "keys-all" },
  'bob-keyset: { "keys": ["bob-key"], "pred": "keys-all" },
  'namespace-keyset: { "keys": [ ], "pred": "keys-all" },

  ;; Upgrade key is set to false because we are deploying the modules
  'upgrade: false
})

;; All Pact modules must exist within a namespace on Chainweb, except for basic contracts provided by Kadena.
;; There are two namespaces available for anyone to use on Chainweb: the 'free' namespace and the 'user'
;; namespace. Our contract uses the "free" namespace, so we need to make sure it exists in our REPL
;; environment.

;; Defining a namespace requires that we provide two keysets. The first keyset indicates the user that must
;; have signed any transaction that deploys code to the given namespace. The second keyset is the namespace
;; admin's keyset, and it indicates that the admin must sign the transaction that creates the new namespace.
;; For testing purposes we will use the same mock namespace keyset for both.
(define-namespace "free" (read-keyset "namespace-keyset") (read-keyset "namespace-keyset"))

;; load fungible-v2 interface
(load "root/fungible-v2.pact")

;; load fungible-xchain-v1 interace
(load "root/fungible-xchain-v1.pact")

;; load coin module
(load "root/coin-v5.pact")

;; create coin module tables
(create-table coin.coin-table)
(create-table coin.allocation-table)

;; load election module
(load "election.pact")

;; commit the transaction
(commit-tx)

(begin-tx "Create KDA accounts")

;; create "alice" KDA account
(coin.create-account "alice" (read-keyset "alice-keyset"))
;; create "bob" KDA account
(coin.create-account "bob" (read-keyset "bob-keyset"))

(commit-tx)
```

Now that this initial setup is done, we can go on and write some tests. Notice
that we did not add any candidates just yet so any attempt to vote at this point
should fail. Let's try it:

```pact
;; election.repl

(begin-tx "Vote for non-existing candidate")

;; set the key signing this transaction, `alice-key`
;; setting `caps` as an empty array translates into `unrestricted mode`, meaning our keyset
;; can be used to sign anything, it's not restricted to a specific set of capabilities
(env-sigs [{ "key": "alice-key", "caps": []}])
;; this test passes because the election.vote call fails
(expect-failure "Can't vote for a non-existing candidate" (free.election.vote "alice" "5"))

(commit-tx)
```

In the snippet above we've learned that we can use `expect-failure` to test that
an expression will fail and that we can configure the keys and capabilities
signing a transaction using `env-sigs`.

:::note

REPL-Only Functions `expect-failure` and `env-sigs` are two of the many
REPL-only functions that we can use in `.repl` files to test Pact
smart-contracts by simulating blockchain environment. You can check the
[complete list of REPL-only functions](/pact/reference/functions/repl-only-functions#repl-only-functions)
in the Pact official documentation.

:::

Next we're going to add some candidates and check if their number of votes is
correctly initialized.

```pact
;; election.repl

(begin-tx "Add candidates")
(use free.election)

;; Need to provide the key that is part of the election-admin-keyset
(env-sigs [{ "key": "admin-key", "caps": []}])

;; Call `insert-candidates` to add 3 candidates
(free.election.insert-candidates [{ "key": "1", "name": "Candidate A" } { "key": "2", "name": "Candidate B" } { "key": "3", "name": "Candidate B" }])

;; test if votes count for candidate "1" is initialized with 0
(expect "votes for Candidate A initialized" (get-votes "1") 0)

;; test if votes count for candidate "2" is initialized with 0
(expect "votes for Candidate B initialized" (get-votes "2") 0)

;; test if votes count for candidate "3" is initialized with 0
(expect "votes for Candidate C initialized" (get-votes "3") 0)

(commit-tx)
```

We can use `expect` function to test that any 2 expressions value is equal, in
this case we checked if `get-votes` returns 0 for each candidate.

Moving on, we want to validate that votes are correctly recorded, the `VOTED`
event is emitted and double-voting is not allowed.

```pact
;; election.repl

(begin-tx)
(use free.election)
;; we set the key signing this tx and the capabilities that can be signed
;; coin.GAS is a capability that allows gas payments, we will talk more about gas and gas stations in the
;; next section
;; election.ACCOUNT-OWNER is the capability we implemented that validates the owner of the KDA account
(env-sigs [{ "key": "alice-key", "caps": [(coin.GAS), (free.election.ACCOUNT-OWNER "alice")]}])

;; test if votes count for candidate "1" is correctly increased by 1
;; 1. Retrieve the number of votes
(let ((count (get-votes "1")))
  ;; 2. Vote
  (vote "alice" "1")
  ;; 3. Check if the vote was correctly recorded
  (expect "votes count is increased by 1" (get-votes "1") (+ count 1)))

;; Test if the `VOTED` event with parameter "1" was emitted in this transaction
(expect "voted event"
  [ { "name": "free.election.VOTED", "params": ["1"], "module-hash": (at 'hash (describe-module "free.election"))}]
  (env-events true))

;; execute the same test using a different account
(env-sigs [{ "key": "bob-key", "caps": [(coin.GAS), (free.election.ACCOUNT-OWNER "bob")]}])
;; test if votes count for candidate "2" is correctly increased by 1
(let ((count (get-votes "2")))
  (vote "bob" "2")
  (expect "votes count is increased by 1" (get-votes "2") (+ count 1)))

(expect "voted event"
  [ { "name": "free.election.VOTED",
      "params": ["2"],
      "module-hash": (at 'hash (describe-module "free.election"))
    }
  ]
  (env-events true))

;; test that bob's attempt to vote twice fails
(expect-failure "Double voting not allowed" (vote "bob" "1"))

(commit-tx)
```

Notice the `let` construct that we used above, it is helpful when you need to
bind some variables to be in the same scope as other logic that uses them. In
our case we first loaded the number of votes and binded the result to `count`
variable which we compared with the new count after submitting a vote. Feel free
to read more about [`let` and `let*`](/pact/reference/syntax#let) in Pact
official documentation.

:::info

Write a test Can you think of some cases that we didn't cover? Hint:
ACCOUNT-OWNER.

Try to write a test that validates that only the correct owner of an account can
vote.

:::

The only thing left is to run these tests and confirm everything is working:

```
$ pact
pact> (load "election.repl")
```

:::tip

The REPL preserves state between subsequent runs unless the optional parameter
`reset` is set to true:

```
(load "election.repl" true)
```

:::

Let's recap what we've learned in this section:

- we can test Pact smart-contracts using `.repl` scripts that simulate
  blockchain environment through a set of REPL-only functions
- before writing tests we need to make sure all required modules are loaded as
  well as KDA accounts are created if we need them
- we can test functions returned values, emitted events, failure scenarios (and
  much more that we couldn't cover)

### Implementing the Gas Station

A unique feature of Kadena is the ability to allow gas to be paid by a different
entity than the one who initiated the transaction. This entity is what we call a
_gas station_.

:::info

**Gas** is the cost necessary to perform a transaction on the network. Gas is
paid to miners and its price varies based on supply and demand. It's a critical
piece of the puzzle, but at the same time it brings up a UX problem. Every user
needs to be aware of what gas is as well as how much gas they need to pay for
their transaction. This causes significant friction and a less than ideal
experience.

To help mitigate this problem Kadena brings an innovation to the game. Hello
[gas stations](/blogchain/2020/the-first-crypto-gas-station-is-now-on-kadenas-blockchain-2020-08-06)!

Gas stations are a way for dApps to subsidize gas costs for their users. This
means that your user doesn't need to know what gas is or how much the gas price
is, which translates into a smooth experience when interacting with your dApp.

In our voting app this will allow users to submit votes without paying for gas,
instead gas will be subsidized by the gas station. In short, this means that
miners will still be paid, but our users can vote for free.

The standard for gas station implementation is defined by the `gas-payer-v1`
interface. The `gas-payer-v1` interface is deployed to all chains on `testnet`
and `mainnet` so you can directly use it in your contract. We can specify that a
module implements an interface using the `(implements INTERFACE)` construct.

:::

:::info

Pact interfaces are similar to Java's interfaces, Scala's traits, Haskell's
typeclasses or Solidity's interfaces. If you're not familiar with this concept
you can [read more about it](/pact/reference/concepts#interfaces) in Pact
reference.

:::

Let's take a look at the `gas-payer-v1` interface defining a capability and a
function:

```pact
(interface gas-payer-v1

  (defcap GAS_PAYER:bool
    ( user:string
      limit:integer
      price:decimal
    )
    @doc
    " Provide a capability indicating that declaring module supports \
    \ gas payment for USER for gas LIMIT and PRICE. Functionality \
    \ should require capability (coin.FUND_TX), and should validate \
    \ the spend of (limit * price), possibly updating some database \
    \ entry. \
    \ Should compose capability required for 'create-gas-payer-guard'."
    @model
    [ (property (user != ""))
      (property (limit > 0))
      (property (price > 0.0))
    ]
  )

  (defun create-gas-payer-guard:guard ()
    @doc
    " Provide a guard suitable for controlling a coin account that can \
    \ pay gas via GAS_PAYER mechanics. Generally this is accomplished \
    \ by having GAS_PAYER compose an unparameterized, unmanaged capability \
    \ that is required in this guard. Thus, if coin contract is able to \
    \ successfully acquire GAS_PAYER, the composed 'anonymous' cap required \
    \ here will be in scope, and gas buy will succeed."
  )
)
```

:::tip

`@doc` is a metadata field used to provide documentation and `@model` is used by
Pact tooling to verify the correctness of the implementation. You can
[read more about docs and metadata](/pact/reference/syntax#docs-and-metadata) in
Pact reference.

:::

Our module needs to implement all the functions and capabilities defined by the
`gas-payer-v1` interface:

- `GAS_PAYER` capability
- `create-gas-payer-guard` function

A gas station allows someone to debit from a coin account that they do not own,
gas station account, to pay the gas fee for a transaction under certain
conditions. How exactly that happens, let's see below.

Create a new file `election-gas-station.pact` and paste the following snippet:

```pact
;; election-gas-station.pact

(module election-gas-station GOVERNANCE
  (defcap GOVERNANCE ()
    "Only admin can update the smart contract"
    (enforce-keyset "free.election-admin-keyset"))

  ; Signal that the module implements the gas-payer-v1 interface
  (implements gas-payer-v1)

  ; Import the coin module, we need it to create a KDA account that will be controlled
  ; by the gas station
  (use coin)
)
```

Next we will implement the `gas-payer-v1` interface. We don't want to let users
abuse our gas station so we'll have to add a limit for the maximum gas price
we're willing to pay or make sure it can only be used to pay for transactions
that are calling the `election` module. Let's get to it:

```pact
  ;; election-gas-station.pact

  (defun chain-gas-price ()
    "Return gas price from chain-data"
    ; chain-data is a built-in function that returns tx public metadata
    ; we are using it to retrieve the tx gas price
    (at 'gas-price (chain-data)))

  (defun enforce-below-or-at-gas-price:bool (gasPrice:decimal)
    (enforce (<= (chain-gas-price) gasPrice)
      (format "Gas Price must be smaller than or equal to {}" [gasPrice])))

  (defcap GAS_PAYER:bool
    ( user:string
      limit:integer
      price:decimal
    )

    ; There are 2 types of Pact transactions: exec and cont
    ; `cont` is used for multi-step pacts, `exec` is for regular transactions.
    ; In our case transaction has to be of type `exec`.
    (enforce (= "exec" (at "tx-type" (read-msg))) "Inside an exec")

    ; A Pact transaction can have multiple function calls, but we only want to allow one
    (enforce (= 1 (length (at "exec-code" (read-msg)))) "Tx of only one pact function")

    ; Gas station can only be used to pay for gas consumed by functions defined in `free-election` module
    (enforce
      ; We take the first 15 characters and compare it with `(free.election`
      ; to make sure a function from our module is called.
      ; `free` is the namespace where our module will be deployed.
      (= "(free.election." (take 15 (at 0 (at "exec-code" (read-msg)))))
      "Only election module calls allowed")

    ;; Limit the gas price that the gas station can pay
    (enforce-below-or-at-gas-price 0.000001)

    ; Import the `ALLOW_GAS` capability
    (compose-capability (ALLOW_GAS))
  )
```

To recap, the `GAS_PAYER` capability implementation performs a few checks and
composes the `ALLOW_GAS` capability that we will define next. `chain-gas-price`
and `enforce-below-or-at-gas-price` are helper functions to limit the gas price
that our gas station is willing to pay.

```pact
  ;; election-gas-station.pact
  (defcap ALLOW_GAS () true)

  (defun create-gas-payer-guard:guard ()
    (create-user-guard (gas-payer-guard))
  )

  (defun gas-payer-guard ()
    (require-capability (GAS))
    (require-capability (ALLOW_GAS))
  )

  (defconst GAS_STATION "election-gas-station")

  (defun init ()
    (coin.create-account GAS_STATION (create-gas-payer-guard))
  )
```

Then we can wrap it up and make sure the `init` function is called when we're
deploying the module:

```pact
;; election-gas-station.pact
(if (read-msg 'upgrade)
  ["upgrade"]
  [
    (init)
  ]
)
```

First we define the `ALLOW_GAS` capability which is brought in scope by the
`GAS_PAYER` capability through `compose-capability` function.

:::note

Composing capabilities allows for modular factoring of guard code, e.g. an
"outer" capability could be composed out of multiple "inner" capabilities. Also
composed capabilities are only in scope when their parent capability is granted.

:::

Then we implement the `gas-payer-guard` function which tests if `GAS` (magic
capability defined in coin contract) and `ALLOW_GAS` capabilities have been
granted which are needed to be able to pay for gas fees. By composing
`ALLOW_GAS` in `GAS_PAYER` we hide the implementation details of `GAS_PAYER`
that `gas-payer-guard` function does not need to know about. This is then used
in `create-gas-payer-guard` to create a special guard for the coin contract
account from where the gas fees are paid.

Last thing we need is to create an account where the funds will be stored which
is what happens in the `init` function. As you can see, the guard of that
account is the guard returned by `create-gas-payer-guard`, essentially allowing
access to the account as long as `GAS` and `ALLOW_GAS` capabilities have already
been granted.

To summarize, a gas station is a coin account with a special guard that's valid
if both `GAS` and `ALLOW_GAS` capabilities are granted. If you're wondering how
`GAS_PAYER` is granted, the answer is
[signature capabilities](/pact/reference/concepts#signature-capabilities). We
will see how this works in the frontend section of this tutorial where we
interact with the smart contracts.

:::info Guards and capabilities are an entire topic that we cannot cover in
detail in this tutorial. To learn more check the
[Guards, Capabilities and Events](/pact/reference/concepts#guards-capabilities-and-events)
section of the Pact documentation. :::

### Deploying to Chainweb

To deploy our contracts to the real blockchain network, we'll need to pay for
the transaction using gas fees (whether it's Testnet or Mainnet).

In this tutorial we are using Chainweaver wallet to create accounts and sign
transactions. Head over to Chainweaver and create an account on `testnet`.

Next step is to fund your `testnet` account using this
[faucet](http://faucet.testnet.chainweb.com). You will receive 20 Testnet KDA.

:::tip

Here's a snippet that you can use to list all deployed modules by using the
top-level `list-modules` built-in function:

:::

```javascript
const { PactCommand } = require('@kadena/client');
const { createExp } = require('@kadena/pactjs');

const NETWORK_ID = 'testnet04';
const CHAIN_ID = '1';
const API_HOST = `https://api.testnet.chainweb.com/chainweb/0.0/${NETWORK_ID}/chain/${CHAIN_ID}/pact`;

listModules();

async function listModules() {
  const pactCommand = new PactCommand();
  const publicMeta = {
    chainId: CHAIN_ID,
    gasLimit: 6000,
    gasPrice: 0.001,
    ttl: 600,
  };
  pactCommand.code = createExp('list-modules');
  pactCommand.setMeta(publicMeta, NETWORK_ID);

  const response = await pactCommand.local(API_HOST);
  console.log(response.result.data);
}
```

The snippets can also be found in the
[tutorial repository](https://github.com/kadena-community/voting-dapp).

You can use the snippet below to deploy your contract to **chain 1** on
`testnet`. To do this, it's required to run Chainweaver locally to sign for the
transaction. Please see the
[Chainweaver User Guide](/kadena/wallets/chainweaver) for downloads and
instructions.

Now we can install the dependencies and deploy the contract:

```bash
npm init -y
npm install @kadena/client @kadena/chainweb-node-client --save
```

```js
const { PactCommand, signWithChainweaver } = require('@kadena/client');
const fs = require('fs');

const NETWORK_ID = 'testnet04';
const CHAIN_ID = '1';
const API_HOST = `https://api.testnet.chainweb.com/chainweb/0.0/${NETWORK_ID}/chain/${CHAIN_ID}/pact`;
const CONTRACT_PATH = '../pact/election.pact';
const ACCOUNT_NAME = 'some-account-name';
const PUBLIC_KEY = 'some-public-key';

const pactCode = fs.readFileSync(CONTRACT_PATH, 'utf8');

deployContract(pactCode);

async function deployContract(pactCode) {
  const publicMeta = {
    ttl: 28000,
    gasLimit: 100000,
    chainId: CHAIN_ID,
    gasPrice: 0.000001,
    sender: ACCOUNT_NAME, // the account paying for gas
  };
  const pactCommand = new PactCommand()
    .setMeta(publicMeta, NETWORK_ID)
    .addCap('coin.GAS', PUBLIC_KEY)
    .addData({
      'election-admin-keyset': [PUBLIC_KEY],
      upgrade: false,
    });
  pactCommand.code = pactCode;

  const signedTransaction = await signWithChainweaver(pactCommand);

  const response = await signedTransaction[0].send(API_HOST);
  console.log(response);
}
```

Make sure to replace `ACCOUNT_NAME` and the `PUBLIC_KEY` with the ones in your
local chainweaver. Also ensure the `CHAIN_ID` matches the one having `KDA`
available. When everything goes according to plan, you should see something like
this:

```shell
$ node ./deploy-testnet.js
{ requestKeys: [ 'SufG_mxEf3GZcbgxtjLbfMPgBuShuk3MMK_T5uoB0QM' ] }
```

### Frontend

If you made it until here, congrats! We wrote, tested and deployed our smart
contract. But we're still missing a key component: a UI for users to interact
with our dApp, so let's get this done.

Start by adding the required libraries from
[Kadena.js](https://github.com/kadena-community/kadena.js) as a dependency to
your project either via a package manager or add it to your asset pipeline
similar to any other JavaScript library.

```bash
npm init -y
npm install @kadena/client @kadena/chainweb-node-client --save
```

#### Typescript

The Kadena.js team has created libraries that allow Javascript/Typescript users
to easily interact with the Kadena Blockchain. Also there's a commandline tool
`pactjs-cli` that allows generation of types from pact contracts, which we're
going to make use of in this tutorial. Let's first add the required libraries to
your project.

```bash
npm install typescript @kadena/types --save-dev
npm install @kadena/pactjs-cli -g
```

Create a `tsconfig.json` file in the root of the frontend folder and paste in
the following JSON:

```js
{
  "compilerOptions": {
    "types": [".kadena/pactjs-generated"],
    "module": "commonjs",
    "esModuleInterop": true,
    "target": "es6",
    "moduleResolution": "node",
    "sourceMap": true,
    "outDir": "dist"
  },
  "lib": ["es2015"]
}
```

From the root of the frontend folder, use the following commands to generate
types for our `election`, `election-gas-station` and `coin` contracts.
Generating types for the `coin` contract is necessary, because when paying for
gas we use the `coin.GAS` capability from the coin contract.

```bash
npx pactjs contract-generate --file ../pact/election.pact;
npx pactjs contract-generate --file ../pact/election-gas-station.pact;
npx pactjs contract-generate --file ../pact/root/coin-v5.pact
```

The log shows what has happened. Inside the `node_modules` directory, a new
package has been created: `.kadena/pactjs-generated`. This package is extending
the @kadena/client types to give you type information. Make sure to add
`"types": [".kadena/pactjs-generated"]` to your tsconfig.json.

### Our implementation

:::note

Our example uses [React](https://reactjs.org), but you are free to use any
framework that you are comfortable with. The main focus will be on blockchain
and wallet interaction.

:::

There are a few key aspects concerning a frontend implementation of a blockchain
application:

- reading data from smart contracts
- allowing users to sign and submit transactions
- notify users when various actions take place like a transaction being mined or
  a smart contract event was emitted

The code of this tutorial can be found in the frontend folder in the
[tutorial repository](https://github.com/kadena-community/voting-dapp). For
demonstration purposes the election smart contracts have been deployed to
**_testnet chain 0_** and **_testnet chain 1_**.

#### Read Data

For this demo application we would like to display the number of votes that each
candidate received. To do that we have to call the `get-votes` function from our
`election` module. Here's what that looks like:

```js
// ./api.ts

import { Pact, signWithChainweaver } from '@kadena/client'
import { pollTransactions } from './utils'

const NETWORK_ID = 'testnet04'
const CHAIN_ID = '1'
const API_HOST = `https://api.testnet.chainweb.com/chainweb/0.0/${NETWORK_ID}/chain/${CHAIN_ID}/pact`

const accountKey = (account: string): string => account.split(':')[1]

/**
 * Return the amount of votes a candidate has received
 *
 * @param candidateId - The candidate's id
 * @return the number of votes
 */
export const getVotes = async (candidateId: string): Promise<number> => {
  const transactionBuilder = Pact.modules['free.election']['get-votes'](candidateId)
  const { result } = await transactionBuilder.local(API_HOST)

  if (result.status === 'success') {
    return result.data.valueOf() as number
  } else {
    console.log(result.error)
    return 0
  }
}
```

We're sending a command to the `/local` endpoint where the `pactCode` attribute
is a call to our module function which returns the number of votes for the given
candidate.

:::note

Remember to always use the fully qualified name, _namespace.module.function_.

:::

Here's a screenshot from our demo app where we display the candidates and the
number of votes received by each candidate:

![Screenshot of the voting dApp](https://github.com/kadena-community/voting-dapp/blob/main/frontend/screens/main.png?raw=true)

#### Sign & Send Transaction

The next step is to allow users to vote for a candidate. When it comes to
updating on-chain data, each dApp has to implement the following flow:

1. Create transaction
2. Sign transaction
3. Send transaction
4. Notify when transaction is mined

:::info

In this tutorial we are using Chainweaver wallet to sign transactions, other
wallets might have a different API but the steps mentioned above are similar.
There might be the case where a wallet takes care of more than signing a
transaction (e.g. it also sends it to the network) and you will have to adapt
your implementation accordingly.

:::

**@kadena/client** provides a couple of useful methods here:
`signWithChainweaver` to interact with the Chainweaver signing API and `send` on
the `ICommandBuilder` to submit the signed transaction to the network.

In the snippet below we are constructing a transaction that calls the
`free.election.vote` contract function to vote for a candidate.

```js
// ./api.ts

/**
 * Vote for a candidate and poll the transaction status afterwards
 *
 * @param account - The account that is voting
 * @param candidateId - The candidateId that is being voted for
 * @return
 */
export const vote = async (
  account: string,
  candidateId: string,
): Promise<void> => {
  const transactionBuilder = Pact.modules['free.election']
    .vote(account, candidateId)
    .addCap('coin.GAS', accountKey(account))
    .addCap('free.election.ACCOUNT-OWNER', accountKey(account), account)
    .setMeta(
      {
        ttl: 28000,
        gasLimit: 100000,
        chainId: CHAIN_ID,
        gasPrice: 0.000001,
        sender: account,
      },
      NETWORK_ID,
    );

  const signedTransaction = await signWithChainweaver(transactionBuilder);

  console.log(`Sending transaction: ${signedTransaction[0].code}`);
  const response = await signedTransaction[0].send(API_HOST);

  console.log('Send response: ', response);
  const requestKey = response.requestKeys[0];
  await pollTransactions([requestKey], API_HOST);
};
```

Notice the `addCap` function where we define the capabilities that the user's
keyset will have to sign. In this case we have two:

- `coin.GAS` -> enables the payment of gas fees
- `free.election.ACCOUNT-OWNER` -> checks if the user is the owner of the KDA
  account

:::note

Scoping signatures Keep in mind, for security reasons a keyset should only sign
specific capabilities and using a keyset in "unrestricted mode" is not
recommended. Scoping the signature allows the signer to safely call untrusted
code which is an important security feature of Pact and Kadena.

"Unrestricted mode" means that we do not define any capabilities when creating a
transaction.

:::

Since this is a transaction that requires gas fees, we now set `sender` (account
paying for gas) to the name of the KDA account of the user. If we would want to
utilize the gas station we deployed we would set the sender to the account owned
by our gas station `election-gas-station` and use the
`free.election-gas-station.GAS_PAYER` capability instead of `coin.GAS`.

Lastly, to get the result of a transaction we are using the `pollTransactions`
helper method which can be found in the project repository.

To run the frontend dApp, go to the frontend folder and run:

```shell
npm run start
```

Going back to the UI, we implemented this signing flow using a modal window
where users have to enter their KDA account. Once the account is entered and the
user hasn't voted yet the **Vote Now** button will become available. Clicking on
the **Vote Now** button will automatically open the Chainweaver signing wizard.

Below is the first step of the Chainweaver request signing wizard:

![Screenshot of Chainweaver request signing wizard](https://github.com/kadena-community/voting-dapp/blob/main/frontend/screens/quicksign.png?raw=true)

Once the transaction is signed, our dApp modal will automatically submit it to
the network.

The request key together with the transaction result are displayed in the
browsers console output.

_Note: Since mining is an external process, while waiting for our transaction to
be included in the blockchain, the user should be able to keep using the
application freely._

:::info

As an extra excercise; modify the code to utilize the gasstation instead of
having the user pay for gas fees.

:::

### Conclusion

It took a while but we are now at the end of this tutorial. Congratulations!
You've managed to implement a complete dApp on Kadena blockchain and we hope you
found this guide useful.

Stay tuned for more tutorials and we cannot wait to see what dApps **YOU** will
build next!
