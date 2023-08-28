---
title: Pact Tips Wrapper Contracts
description:
  Smart-contract blockchains are unique app environments as they combine
  storefronts, back ends, and APIs into one dynamic environment. A single dapp
  may be composed of numerous contracts an NFT exchange might have separate
  contracts for handling the auction vs offering a token for instance.
menu: Pact Tips Wrapper Contracts
label: Pact Tips Wrapper Contracts
publishDate: 2021-07-04
author: Stuart Popejoy
layout: blog
---

![](/assets/blog/1_ErnEQbK35VB7wxDgqoMy9A.webp)

# Pact Tips: Wrapper Contracts

In this article, learn about the use of “wrapper contracts” — smart contracts
that call other smart contracts — in order to offer new features.

**_Quick note:_** “wrapping” here is a form of _indirection_ in calling a smart
contract. It does not refer to “wrapping tokens” via the bridge, which is an
entirely separate process.

## What are Wrapper Contracts?

Smart-contract blockchains are unique app environments as they combine
storefronts, back ends, and APIs into one dynamic environment. A single dapp may
be composed of numerous contracts: an NFT exchange might have separate contracts
for handling the auction vs offering a token for instance.

Since blockchains are open systems, these contracts are all on display for
anyone to inspect, and while some functions are “private” (either not callable
from the outside, like in Solidity, or protected with a capability, in Pact),
most functions can be called by anyone.

This is why for instance Kaddex or Uniswap can have numerous non-official
front-end apps: the real business of the DEX happens inside the smart contract,
while the front end is just Chrome and wallet integration.

You can do this on the blockchain too: you can write a “wrapper” smart contract
that has the same or similar function signatures as an existing smart contract.
The wrapper smart contract calls the corresponding functions on the wrapped
smart contract functions, before or after functionality that offers some extra
service.

## Example: a Kadena Chain Relay wrapper contract

To see what this looks like, let’s consider a concrete example of a smart
contract sitting in front of the
[Kadena Chain Relay](https://relay.chainweb.com). The relay offers fixed-size
bonding at 50,000 KDA. A wrapper contract could allow multiple accounts to form
a single bond and divvy up rewards accordingly.

Let’s look at how a wrapper contract would work, starting with bond creation.
Creating a new bond at the smart contract level means calling the function
relay.pool.new-bond (the code can be seen
[here](https://balance.chainweb.com/modules.html?server=api.chainweb.com&module=relay.pool&chain=2&line=192)):

```pact
    (defun new-bond:string
        ( pool:string      ;; Bond pool name
          account:string   ;; KDA account
          guard:guard      ;; bond administration guard
        )
```

The “normal” case is that account is a single-signer KDA account, and guard is
the key on that account. The function returns the name of the new bond, which is
used later for servicing the bond.

For our example, we want a _smart contract_ to be in charge, and “wrapping” the
call to new-bond is the most straightforward way to do that.

## Wrapping the “new-bond” call

Wrapping the call to new-bond is easily done in our wrapper contract.

```pact
    (defun wrap-new-bond:string
        ( pool:string      ;; Bond pool name
          account:string   ;; KDA account
          guard:guard      ;; bond administration guard
        )
        (relay.pool.new-bond pool account guard)
      )
```

Of course, this isn’t very interesting by itself, but it illustrates the
mechanism: there is nothing preventing another contract issuing the
relay.pool.new-bond call instead of directly accepting it from a front-end app.
Here it does exactly what a direct call would do: provides the unchanged
arguments, and returns the bond name.

The first thing we want to do is give the wrapper contract control over the bond
administration, which is easily achieved with a _module guard_:

```pact
    (defun wrap-new-bond:string
        ( pool:string      ;; Bond pool name
          account:string   ;; KDA account
          guard:guard      ;; bond administration guard
        )
        (relay.pool.new-bond pool account
          (create-module-guard "bond-wrapper"))
      )
```

This now means that the module guard named "bond-wrapper" administers the bond:
now, only calls from the module defining wrap-new-bond will be able to invoke
things like renew-bond and other bond-servicing operations. We have achieved
_autonomous control_ over the bond servicing.

This means we have to wrap the other calls now too, in order to leverage the
module guard for administration. We’ll look at that later in the article.

## Modeling a multibond

The next step is to actually model the multibond itself. A simple approach
simply collects tranche accounts and sizes in a “multi” object:

```pact
    (defschema tranche
        account:string     ;; KDA account
        amount:decimal     ;; tranche amount
      )

    (defschema multi
       size:decimal                 ;; bond size
       tranches:[object{tranche}])  ;; tranches

    (deftable multis:{multi}) ;; stored by multi KDA account
```

Done! A tranche combines a KDA account with a tranche amount. A multi simply
collects tranches that add up to the bond size. The multis table stores multi
records under a unique KDA account name along with the bond size .

We’re ready to create a new multibond!

## Wrapping the new-bond call to create a multibond

The steps involved to use the multibond are:

1.  Transfer the tranche money into a new KDA account. This account name will
    serve as the multibond ID.

2.  Store the multibond record for later recall.

3.  Create the bond using the new KDA account and module guard.

```pact
    (defun new-multibond:string ( multi:object{multi} ;; multi tranches
    account:string ;; KDA account for multi/multi ID )

        ;; debit from each tranche
        (map (debit-tranche (account)) (at 'tranches multi ))

        ;; store the multi
        (insert multis account multi)

        ;; allow the autonomous transfer to relay bank
        (install-capability
          (coin.TRANSFER account "relay-bank" (at 'size multi)))

        ;; create the bond
        (relay.pool.new-bond "kda-relay-pool" account
          (create-module-guard "multibond"))

    )
```

The new-multibond function takes the tranches multi object and a KDA account
name that acts both as the storage account for the initial bond and future
rewards, as well as the ID for the multibond itself.

The first step is to transfer the tranche amounts into the new shared account.
The function debit-tranche is called on each tranche using map . This is a
simple function that just calls coin.transfer-create :

```pact
    (defun debit-tranche (account:string tranche:object{tranche})
        (coin.transfer-create
          (at 'account tranche)
          account
          (create-module-guard "tranche")
          (at 'amount tranche))
      )
```

Note that the shared KDA account is also autonomously guarded by the module
using create-module-guard "tranche" . This means that only this module code can
debit from the new account.

We then store the multibond by the account. This is straightforward.

```pact
    (insert multis account multi)
```

The third step sets up bond creation by installing the TRANSFER capability. This
is how autonomous ownership is managed. Normally in a transfer, the user adds
the TRANSFER capability to their signatures. Since this is a smart contract, it
simply “installs” the capability.

```pact
    (install-capability
      (coin.TRANSFER account "relay-bank" (at 'size multi)))
```

We’re ready to create the bond!

```pact
    (relay.pool.new-bond relay.relay.POOL account
                 (create-module-guard "multibond"))
```

Let’s consider what’s going on here. The relay will attempt to transfer the bond
amount from account into the relay bank. Thus, if the tranche transfers above
were not enough, the transaction will fail, which is what we want. We’ll talk
about another error case — the tranches add up to too much — later.

That’s it! We’ve added significant functionality to bonding with only a few
lines of code.

## Wrapping the ‘renew-bond’ call

Administering the bond requires allocating rewards. Let’s take a look at how
that might work:

```pact
    (defun renew-multibond:string (account:string)

        ;; track the old balance
        (let ( (old-balance (coin.get-balance account))
               (multi (read multis account)) )

          ;; renew, will credit account
          (relay.pool.renew account)

          ;; compute new amount
          (let ( (amount (- (coin.get-balance account) old-balance)) )

            ;; allocate
            (map
              (allocate account amount (at 'size multi))
              (at 'tranches multi))))
      )
```

It’s really pretty simple. We check the balance of the multibond KDA account to
compute the increase from rewards. We wrap relay.pool.renew to service the bond,
which will succeed because it is autonomously administered by this module. We
compute the new amount using the current balance and the old balance.

Allocation is the only tricky part, but armed with our tranches, the bond size,
and the new amount, we can simply map over the tranches to perform the
allocation.

```pact
    (defun allocate
        ( account:string           ;; multi account
          amount:decimal           ;; total amount to allocate
          size:decimal             ;; bond size
          tranche:object{tranche}  ;; tranche
        )
        (let ( (to (at 'account tranche))

               ;; compute tranche amount
               (tranche-amount (* amount (/ (at 'amount tranche) size))) )

          (install-capability
            (coin.TRANSFER account to tranche-amount))
          (coin.transfer account to tranche-amount))
      )
```

The main code here computes the tranche amount by multiplying the total reward
amount by the proportion of the tranche. It then installs the autonomous
TRANSFER capability and allocates to the source account.

## More to be done

This doesn’t cover everything. unbond still needs to be wrapped, plus the relay
activities propose , endorse and others will need to be wrapped as a simple
pass-through so that the module can provide the authorization by simply calling
the wrapped code.

There are also error cases that need to be handled:

1.  If the tranches add up to too much. This will result in lost coins.

2.  If the size doesn’t match the sum of the tranches. This will result in
    errors in bonding and allocation so it is better UX to test for this
    explicitly.

Finally there are features to add:

1.  Reusing multibond tranches for more than one bond.

2.  Tracking bonds by multibond.

3.  renew and unbond are currently unprotected, so while the relay ensures these
    won’t do any harm, somebody could grief multibonders by e.g. terminating
    their bond.

Finally, it’s worth noting that the new-bond call will be a *multi-sig
transaction *because everything is done in one step, so all tranche owners have
to sign the same transaction. It would probably be easier from a front-end,
wallet perspective to collect the tranche amounts beforehand, and then make the
bond.

## Conclusion

Hopefully this shows the power of wrapper contracts as a way of offering new
services to blockchain users. Pact makes such contracts easy and safe. Indeed,
it’s way safer than Solidity as you can’t really get the target contract wrong
as the wrapper won’t load if there’s a typo. In Solidity you’d better get the
target contract address right or it’s game over, and it can’t tell you if your
calls will actually succeed. Pact is a game-changer for smart contracts, so get
going with your Pact dapp on Kadena blockchain and experience the power for
yourself!
