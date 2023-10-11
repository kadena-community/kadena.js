---
title: "09: Gas station"
description: "In the ninth chapter of the Election dApp tutorial you will add a gas station module to the election smart contract."
menu: Election dApp tutorial
label: "09: Gas station"
order: 9
layout: full
tags: [pact, smart contract, typescript, tutorial]
---

# Chapter 09: Gas station

In a traditional government election, all citizens usually receive a paper invitation
to vote from their government in the tradidtional mail. They would take their invitation
to a nearby election office. There, they will receive an anonymous voting ballot from
an election official upon showing their invitation and a matching ID. In a voting booth,
they anonymously select the name of their favorite candidate and cast the voting ballot
in a voting bin. At this point, it is no longer possible to prove that each voting ballot
corresponds to one unique citizen. Corrupt election officials could easily take a number
of voting ballots from the stack of unused voting ballots and use them to cast extra votes on
any given candidate. In many countries, the votes are counted and submitted manually, leaving
even more room for human error. Even though the votes can be cast anonymously in traditional
election, the process is inherently unreliable. It is also inconvenient for voters to physically
vote at an election office. Moreover, a traditional election costs a lot of tax payer money
to organisze.

An election on the blockchain would be more convenient, transparent and reliable. Namely,
everyone who owns a smartphone or computer could vote from the comfort of their own home.
The election would be transparent, because all voting transactions will be logged publically
on the blockchain. Voting would still be anonymous, because citizens vote with their account
name, which is a hash, instead of their social security number. Moreover, the smart contract
of the election itself is also publically accessible on the Kadena blockchain, allowing
everyone to verify that the election rules are fair. Furthermore, the counting process will
be fully automated, leaving no room for human error. Because all votes are publically accessible
on the blockchain, everyone will be able to verify that the outcome of the election is indeed
correct.

A possible pitfall of a blockchain election is that every vote is a transaction and processing
a transaction comes at the price of a gas fee. At the time of the election, some citizens
may have run out of money and would not be able to pay this gas fee and thus would not be
able to vote. That is not very democratic. Kadena solves this with the concept of gas stations.
Kadena created the first crypto gas station on a blockchain in 2020. A gas station is an
account that exists only to make gas payments on behalf of other users under specific conditions.
The government could use a fraction of the traditional election budget to fund a gas station
that can pay the gas fee for every voting transaction, allowing all citizens to vote for free.

## Recommended reading

 * [The First Crypto Gas Station is Now on Kadena’s Blockchain](https://medium.com/kadena-io/the-first-crypto-gas-station-is-now-on-kadenas-blockchain-6dc43b4b3836)

## Create a voter account

In the previous chapter you voted with your admin account. The transaction was successful, because
this account had sufficient KDA to pay the gas fee of the transaction. Now, you will create a voter
account with a zero KDA balance on chain 1 of your local Devnet to prove that the voting transaction
triggered from the election website will fail with this account.

### Create voter key in Chainweaver

Open Chainweaver and make sure that the Devnet network is selected.
Also make sure that your local Devnet is running. In Chainweaver, navigate to `Keys`
via the top section of the
navigation bar on the left side of the window. When you click `+ Generate Key` on the
top right, a new public key will be added to the list of public keys. Click `Add k: Account`
on the right of this new public key and your k:account will be added to the accounts
that you are watching via Chainweaver. Expand the row of the account you justed added
by clicking the arrow on the left side of the account name. You will see that no KDA balance
exists for this account on any of the chains and the information about the owner and keyset
of the account is missing. This indicates that your account does not yet exist on Devnet.

The Kadena JavaScript client will tell you the same. Open up a terminal and change the directory
to the `./snippets` folder in the root of your project. Execute the `./coin-details.ts`
snippet by running the following command. Replace `k:account` with your admin account.

```bash
npm run coin-details:devnet -- k:account
```

You will see an error logged to your terminal, stating `row not found`, confirming that your
admin account indeed does not yet exist on Devnett.

### Create voter account on Devnet

The admin account was created by calling the `transferCreate` function in the `coin` module. You
will create the voter account using the `create-account` function in the same module by running
the npm scripts that executes the snippet `./snippets/create-account.ts`. Take a look at this snippet
and notice that it is highly similar to `./snippets/transfer-create.ts`, except that no amount
is passed to the executed function and it is not necessary to sign for the `COIN.TRANSFER`
capability. Open up a terminal window with the current directory set to the `./snippets` folder. 
Run the following command to create your voter account. Replace `k:account` with your voter account.

```bash
npm run create-account:devnet -- k:account
```

After a few seconds, `Write succeeded` should be printed in the terminal window. Verify that the
account was created by checking the account details using the Kadena JavaScript client.
Replace `k:account` with your voter account.

```bash
npm run coin-details:devnet -- k:account
```

This time, the script should print out the account name, the KDA balance and the receiver guard
of the account. Verify that the balance of the voter account is `0`.
Chainweaver will tell the same story. Navigate to `Accounts` in the top section
of the left menu bar. Expand the voter account to view the information on all chains. You may need
to click refresh at the top of the window. You will
see that on chain 1 you are the owner, one keyset is defined and the balance is 0 KDA where it
previously said `Does not exist`.

## Cast a vote on the election website

Open up a terminal with the current directory set to `./frontend` relative to the root
of your project. Run the front-end application configured with the `devnet` back-end by
executing the following commands. Visit `http://localhost:5173` in your browser and
verify that the website loads without errors.

```bash
npm install
npm run start-devnet
```

Make sure that the list of nominated candidates is not empty. Otherwise, first nominate a
candidate with your admin account according to the instructions in the previous chapter.
Set the account to your voter account. Make
sure that Chainweaver is open so you can sign the transaction. Click the `Vote` button
behind your favorite candidate, sign the transaction and wait for the transaction to
finish. You will see an error similar to
`Attempt to buy gas failed with: (enforce (<= amount balance) "...: Failure: Tx Failed: Insufficient funds`,
proving that it is indeed not possible to vote with an account that has zero balance.

## Implement gas station interface

The `election-gas-station` will become the second module in your `election` smart contract.
Create a file `./pact/election-gas-station.pact` with the following content. Replace the
namespace with your own principle namespace. Just like the `election` module, this module
will be governed by the `admin-keyset`.

```pact
(namespace 'n_fd020525c953aa002f20fb81a920982b175cdf1a)

(module election-gas-station GOVERNANCE
  (defcap GOVERNANCE ()
    (enforce-keyset "n_fd020525c953aa002f20fb81a920982b175cdf1a.admin-keyset")
  )

  (implements gas-payer-v1)
)
```

Create a `./pact/election-gas-station.repl` file as follows, to verify that the module
loads correctly. Run the file.

```pact
(load "setup.repl")

(begin-tx "Load election gas station module")
  (load "root/gas-payer-v1.pact")
  (load "election-gas-station.pact")
(commit-tx)
```

You will notice that the module does not load correctly. Because you merely defined that
the module should implement the `gas-payer-v1` interface, but not actually implemented
that interface yet, the error
`Error: found unimplemented member while resolving model constraints: GAS_PAYER` appears.
You can find the signature of this capability in `./pact/root/gas-payer-v1.pact`. It is
included in this project, so you can test your module that relies on it, in the Pact
REPL. This interface is already pre-installed on Devnet, Testnet and Mainnet. Therefore,
it is not needed to deploy it along with your `election-gas-station` module. The documentation
inside the `gas-payer-v1` interface file states that `GAS_PAYER` should compose a capability.
You can include a capability within a capability using the built-in `compose-capability`
function. Add a capability `ALLOW_GAS` that always returns `true` and compose the `GAS_PAYER`
capability with it as follows. Then, run `./pact/election-gas-station.repl` again.

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

The test will now fail with
`Error: found unimplemented member while resolving model constraints: create-gas-payer-guard`.
Indeed, there is a function `create-gas-payer-guard` defined in the `gas-payer-v1` interface
that still needs to be implemented. The documentation inside is a bit cryptic, but its suggests
to require something like the `GAS_PAYER` capability without the parameters. You can use
the `GAS` capability from the `coin` module here. After all, in Chainweaver's module explorer
you can find that this capability is documented as `Magic capability to protect gas buy and redeem`.
Sounds legit! Implement `create-gas-payer-guard` as follows, using the built-in functions
`create-user-guard` and `require-capability`. You can use `GAS` directly if you load the
`coin` module in the `election-gas-station` module.

```pact
(namespace 'n_fd020525c953aa002f20fb81a920982b175cdf1a)

(module election-gas-station GOVERNANCE
  (defcap GOVERNANCE ()
    (enforce-keyset "n_fd020525c953aa002f20fb81a920982b175cdf1a.admin-keyset")
  )

  (implements gas-payer-v1)

  (use coin)

  (defcap GAS_PAYER:bool
    ( user:string
      limit:integer
      price:decimal
    )
    (compose-capability (ALLOW_GAS))
  )

  (defcap ALLOW_GAS () true)

  (defun create-gas-payer-guard:guard ()
    (create-user-guard (gas-payer-guard))
  )

  (defun gas-payer-guard ()
    (require-capability (GAS))
  )
)
```

Run `./pact/election-gas-station.repl` again and observe that the test loads successfully.
Now that you have a working implementation of the `gas-payer-v1` interface, you can deploy
your new module to Devnet so you can test if it can already pay the gas fee for votes
cast via the election website.

## Deploy to devnet

Open up a terminal and change the directory to the `./snippets` folder in the root of
your project. Execute the `./deploy-gas-station.ts` snippet by running the following command.
Replace `k:account` with your admin account. The content of `./deploy-gas-station.ts` is
roughly the same as `./deploy-module.ts`, except that it deploys the 
`./pact/election-gas-station.repl` file

```bash
npm run deploy-gas-station:devnet -- k:account
```

The Chainweaver window usually comes to the foreground as soon as there is a new signing
request for one of your accounts. If not, manually bring the Chainweaver window
to the foreground. You will see a modal with details of the signing request.
Click `Sign All` to sign the request and switch back to your terminal window.
If everything went well, you will see something similar to the following output.

```bash
{
  status: 'success',
  data: 'Loaded module n_fd020525c953aa002f20fb81a920982b175cdf1a.election-gas-station, hash HM4XCH_oYiXxIx6mjShn2COyOfRhK3u4A37yqomNI0c'
}
```

Congratulations! You have added a second module to your smart contract. deployed a smart contract consisting of the `election` module that
is governed by the `admin-keyset` in your principal namespace on your local Devnet.
If you would now run the `list-modules:devnet` script, you will find your new module in the list
of deployed modules.

```bash
npm run list-modules:devnet
```

## Voting

Open the file `frontend/src/repositories/vote/DevnetVoteRepository.ts` and in the `vote`
function change the line `.addSigner(accountKey(account))` into the following.

```pact
.addSigner(accountKey(account), (withCapability) => [
  withCapability(`${NAMESPACE}.election-gas-station.GAS_PAYER`, account, { int: 0 }, { decimal: '0.0' }),
  withCapability('coin.GAS'),
])
```

This scopes the signature of the account that votes to two capabilities. The `coin.GAS` capability is used
in the `create-gas-payer-guard` function of the `election-gas-station` module. The voter account name and
zero (unlimited) limits for the amount of gas and the gas price are passed into the
`${NAMESPACE}.election-gas-station.GAS_PAYER` capability.

Also, change the `senderAccount` in the transaction's metadata to `'election-gas-station'`.

Return to the election website and try to vote again with the voter account. The transaction will still fail
with the error: `Failure: Tx Failed: Insufficient funds`. Apparently, the gas station does not work as it is
supposed to yet. The reason is that the gas station module attempts to pay for gas using the `senderAccount`,
but this account does not exist. It has to be created first. It also needs to have a positive KDA balance.
Otherwise, the transaction will still fail due to insufficient funds in the gas station account.

## Create and fund the gas station account

The `coin` module is already imported inside the `election-gas-station` module. You can use it to create the
`election-gas-station` account in a function called `init`, as follows.

```pact
(defconst GAS_STATION_ACCOUNT "election-gas-station")

(defun init ()
  (coin.create-account GAS_STATION_ACCOUNT (create-gas-payer-guard))
)
```

Add an if-statement after the module declaration that calls this `init` function if the module is deployed with
data `{ "init": true }`.

```pact
(if (read-msg 'init)
  [(init)]
  ["not creating the gas station account"]
)
```

Update `./pact/election-gas-station.repl` to set `init` to true for the next transactions, by adding the following
code after loading `setup.repl`. Run the file again to verify that the election module still works before you upgrade
the module on Devnet.

```pact
(env-data
  { 'init: true }
)
```

Open a terminal window and upgrade the `election-gas-station` module on Devnet by executing the following command
in the `./snippets` folder of your project. Replace `k:account` with your admin account.

```bash
npm run deploy-gas-station:devnet -- k:account upgrade init
```

Verify that the `election-gas-station` account now exists with a 0 KDA balance on Devnet by running the
following script.

```bash
npm run coin-details:devnet -- election-gas-station
```

If everything went well, you should see output similar to this.

```bash
{
  guard: {
    args: [],
    fun: 'n_fd020525c953aa002f20fb81a920982b175cdf1a.election-gas-station.gas-payer-guard'
  },
  balance: 0,
  account: 'election-gas-station'
}
```

Execute the `./transfer.ts` snippet by running the following command to transfer 1 KDA from your admin
account to the gas station account. Replace `k:account` with your admin account. The transaction
inside this file is similar to `./transfer-create.ts`, except that it does not use the special
`sender00` account, but your own election admin account to transfer KDA. Therefore, the transaction
needs to be signed with Chainweaver instead of a private key. Also, the `transfer` function of the
`coin` module is used. This function requires that the receiving account already exists on the
blockchain and will not create the account if it does not exist like `transfer-create`.

```bash
npm run transfer:devnet -- k:account election-gas-station 1
```

Verify that the `election-gas-station` account now has a 1 KDA balance on Devnet by running the
following script again.

```bash
npm run coin-details:devnet -- election-gas-station
```

Now, everything should set to allow voters to vote for free because the `election-gas-station`
account can pay the gas fee charged for the voting transaction.

## Vote again

Return to the election website, set the account to your voter account and vote for one of the
candidates in the list. Unfortunately, the transaction still fails but this time with a
different error: `Keyset failure`. This error occurs because the signature is not scoped to
the `ACCOUNT-OWNER` capability used in `./pact/election.repl`. When you created this capability
in the previous chapter, you did not scope the signatures to capabilities in `./pact/voting.repl`
either. So, why was it still possible to vote with the voter account?

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

The `caps` field in the signature passed to `env-sigs` is an empty array. As a consequence, the
signature of the transaction is not scoped to any capability and the signer automatically
approves all capabilities required for the function execution. In the `vote` function of
`frontend/src/repositories/vote/DevnetVoteRepository.ts` you scoped the signature of the
transaction to two gas related capabilities, but not for the `ACCOUNT-OWNER` capability. When
you sign for some capabilities but not all capabilities required for execution of a transaction,
the execution will fail at the point where a capability is required that you did not sign for.
Therefore, you need to add a third capability to the array passed to `addSigners` in
the `vote` function in `frontend/src/repositories/vote/DevnetVoteRepository.ts`.

```typescript
withCapability(`${NAMESPACE}.election.ACCOUNT-OWNER`, account),
```

Now, try to vote again using the voter account on the election website. Sign the transaction
and wait for it to complete. If all is well, you will see the number of votes on your favorite
candidate increase by one. You have successfully exercised your democratic rights on the
Kadena blockchain!

## Add rules and guards

There are still a few things left to add to the gas station module to make it more secure.

### Transaction gas price limit

First, you can enforce an upper limit for the gas price of the transaction to ensure that
the funds of the gas station account cannot be drained to quickly. Add the following functions
to retrieve the transaction's gas price from the metadata of the transaction using the
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

Then, call `(enforce-below-or-at-gas-price 0.000001)` right before `(compose-capability (ALLOW_GAS))`.

### Limit accessibility

Second, any module can use your gas station as it is, which can become quite costly when the
word spreads. Especially, since any kind of transaction is allowed and heavy transaction cost even
more gas than lighter transaction.

There are two types of Pact transactions: `exec` and `cont`. `cont` transaction
is used for multi-step pacts, while `exec` is for regular transactions. Limit the usage to `exec`
transactions by adding the following line to the start of body of the `GAS_PAYER` `defcap`.

```pact
(enforce (= "exec" (at "tx-type" (read-msg))) "Can only be used inside an exec")
```

An `exec` transaction can contain multiple function calls. Allow only one function call by adding
the following line after the previous one.

```pact
(enforce (= 1 (length (at "exec-code" (read-msg)))) "Can only be used to call one pact function")
```

To limit usage of the gas station to pay for gas consumed only by functions defined in your module,
add the following line. Replace the namespace with your own principal namespace.

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
and reliable than traditional elections. The only remaining challenge is that it is possible to
vote more than once by simply creating multiple Kadena accounts. To comply with the law, the
Kadena accounts that are allowed to vote should somehow be linked to the social security numbers
of citizens of voting age as stored in legacy government systems. Or, perhaps, everyone should
just get a Kadena account instead of a social security number at birth. Anyway there are several
technical and theoretical solutions for such last hurdle. Food for thought.

As a next step, you could deploy the election website online and deploy the election smart contract
to Testnet. This will allow anyone to take part in your online election. In the future, more chapters
will be added to this tutorial, or new tutorials will be created, to teach you how to do that. You can
also experiment with signing methods other than Chainweaver. If there is anything you feel is missing
from this tutorial, please let us know, so we can keep improving.
