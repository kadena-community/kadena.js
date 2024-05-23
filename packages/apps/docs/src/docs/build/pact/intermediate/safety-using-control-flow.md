---
title: Safety Using Control Flow
description:
  In this tutorial, we’ll focus specifically on how Pact approaches control flow
  to ensure safety.
menu: Safety Using Control Flow
label: Safety
order: 3
layout: full
tags: ['pact', 'intermediate', 'safety', 'control flow']
---

# Safety Using Control Flow

Welcome to this tutorial on **Safety Using Control Flow** with Pact.

While Pact is already a simple and safe language for smart contracts, there are
a few patterns and recommendations you can follow to make it even simpler and
even safer. Throughout the next few tutorials, we’ll discuss a few of these
patterns.

In this tutorial, we’ll focus specifically on how Pact approaches control flow
to ensure safety.

**Topics covered in this tutorial**

- Control Flow
- Project Setup
- Unsafe/Safe Example #1
- Unsafe/Safe Example #2

:::note Key Takeaway

When writing Pact smart contracts, avoid using
[if](/reference/functions/general#ifh3357) statements. Instead, use
[enforce](/reference/functions/general#enforceh-1604583454) to ensure your code is
both simpler and safer.

:::

## Safety Using Control Flow Tutorial

https://www.youtube.com/watch?v=YHwE08g_bSI

Subscribe to our
[YouTube Channel](https://www.youtube.com/channel/UCB6-MaxD2hlcGLL70ukHotA) to
access the latest Pact tutorials.

## Control Flow

_Control flow_ is the order in which individual statements, instructions or
function calls are evaluated.

In Pact, like in many languages, there are a few ways to approach control flow
in your applications. Using Pact, you can use either if or enforce as a means to
control the flow of your application. While you can technically use either, we
recommend using enforce whenever possible. Using if is considered harmful to the
application.

## “If” considered harmful

Here is an example of an **if** statement using Pact.

```pact title=" "
pact> (if (= (+ 2 2) 4) "Don’t use if statements" "Use enforce instead")
"Don’t use if statements"
```

Consider avoiding **if** whenever possible. Every branch makes code harder to
understand, opening up the possibility of bugs in your code.

:::info Pact History

Pact’s original design left out if altogether (and looping), but it was decided
that users should be able to judiciously use these features as necessary.

:::

## Use enforce Instead

Enforce is considered a safer option for your smart contracts by making code
simpler and less prone to bugs.

Here is an example of an **enforce** statement using Pact.

```pact title=" "
pact> (enforce (!= (+ 2 2) 4) "Stay Safe. Enforce the law.")
<interactive>:0:0: Stay safe. Enforce the law.
```

**If** should never be used to enforce business logic invariants. Instead,
[enforce](/reference/functions/general#enforceh-1604583454) is the right choice,
which will fail the transaction.

:::info Note

You can view more on Control Flow
[here](/build/pact/advanced#control-flowh-1518197167).

:::

Next, you will walk through a demonstration smart contract using if statements.
You will then refactor these to use the safe option, enforce.

## Code Demonstration

For this demonstration, we have built a smart contract named **my-coin**. This
project represents a simple ledger system providing transfer, credit, debit,
account creation, and querying. The goal of this demonstration is to develop a
smart contract that adheres to the best control flow safety practices. You’ll
work on this contract through the remainder of the tutorial.

### Open Project Locally

To start, open your terminal and change into your project directory.

```bash title=" "
cd projectDirectory
```

Clone the project repo.

```bash title=" "
git clone https://github.com/kadena-io/pact-lang.org-code.git
```

Change into the control-flow project directory.

```terminal
cd pact-lang.org-code/safety/control-flow
```

Open the project in atom.

```bash title=" "
atom .
```

### View the Project

In this project you should see both the **my-coin.pact** and **my-coin.repl**
files.

![1-project-file](/assets/docs/1-project-file-int.png)

Within the **my-coin.pact** file you will see both unsafe and safe alternatives
for this program. You can view the completed files in the **complete** folder
and the code challenges from within the **challenge** folder.

Throughout the rest of this tutorial, I’ll work in the challenge folder and
demonstrate the 2 examples from this file. First, by writing the unsafe
alternative using if, then by writing the safer alternative using **enforce**.

## Demonstration #1: Unsafe

Starting in the **debit-if** function, you can see that there is an opportunity
to use an **if** statement.

Taking a step back, you’ll see that this function is meant to debit a certain
**AMOUNT** from an **ACCOUNT** balance while recording both the **DATE** and
**DATA**. The opportunity for the if statement is at the point where we need to
check if the balance is sufficient for the transfer.

```pact title=" "
  ;; Debit using if
  (defun debit-if:string (account:string amount:decimal)
    @doc "Debit AMOUNT from ACCOUNT balance recording DATE and DATA"
      (with-read my-coin-table account
        { "balance" := balance }
        ;;Check if balance is sufficient for the transfer
          ;;STEP 1: UNSAFE IF STATEMENT GOES HERE
          ;;STEP 2: If condition is true, update my-coin-table


          ;;STEP 3:If condition is false, print message

         )
```

As you can see, we want to check that the amount being transferred is greater
than the balance.

**STEP 1: Write If Statement**

A perfectly unsafe way to do this would be to write an if statement as shown
here.

```pact title=" "
(if (> balance amount)
```

**STEP 2: If the Condition is TRUE**

If the statement is true, meaning the balance is sufficient to make the
transfer, the **if** statement will go on to update the **account** from within
the **my-coin-table**.

```pact title=" "
(update my-coin-table account
    { "balance" : (- balance amount) })
```

**STEP 3: If the Condition is FALSE** If the statement is false, meaning the
balance is insufficient to make the transfer, send an error message.

```pact title=" "
 ;;If condition is false, print message
 "Balance is not sufficient for transfer" ))
```

**Final If Statement Code**

Here is a look at the final code.

```pact title=" "
   ;; Debit using if
  (defun debit-if:string (account:string amount:decimal)
    @doc "Debit AMOUNT from ACCOUNT balance"
      (with-read my-coin-table account
        { "balance" := balance }
        ;;Check if balance is sufficient for the transfer
        (if (> balance amount)
          ;;If condition is true, update my-coin-table
          (update my-coin-table account
            { "balance" : (- balance amount) })
          ;;If condition is false, print message
          "Balance is not sufficient for transfer" )))
```

This is a clear case where it feels like **if** makes sense to use in your code.
However, for reasons mentioned earlier, we’d like to remove **if** from our code
in favor of **enforce**.

## Demonstration #1: Safe

Now, let’s refactor this code using enforce. In this case, the function is
similar but we’ll make the safe decision and use enforce.

```pact title=" "
  ;; refactor with enforce
  (defun debit:string (account:string amount:decimal)
    @doc "Debit AMOUNT from ACCOUNT balance"
      (with-read my-coin-table account
        { "balance" := balance }
        ;;STEP 1: Enforce the condition, and fail transaction if condition doesn't meet.

        ;;STEP 2: Update the balance.


        )
```

As you can see, you’ll need to **enforce** the condition without using an **if**
statement, then update the **my-coin-table** as you had done previously.

**STEP 1: Write Enforce Statement**

To start, enforce that the balance is greater than the amount being sent and
fail the transaction if the condition isn’t met.

```pact title=" "
;; Enforce the condition, and fail transaction if condition doesn't meet.
(enforce (> balance amount) "Balance is not sufficient for transfer")
```

This step is very similar to the if statement but allows us to finish the
function using simpler logic.

**STEP 2: Update the my-coin-table Table**

Since the **enforce** statement handled the failing scenario, you can now write
the update to the my-coin-table account assuming that the **enforce** statement
has passed. Update the balance of the account in my-coin-table to be the balance
minus the amount sent.

```pact title=" "
(update my-coin-table account
    { "balance" : (- balance amount) }))
```

**Final Enforce Statement**

By using **enforce**, you no longer need to create branching logic dependent on
the outcome of the if statement.

```pact title=" "
  ;; refactor with enforce
  (defun debit:string (account:string amount:decimal)
    @doc "Debit AMOUNT from ACCOUNT balance"
      (with-read my-coin-table account
        { "balance" := balance }
        ;; Enforce the condition, and fail transaction if condition doesn't meet.
        (enforce (> balance amount) "Balance is not sufficient for transfer")
        ;;Update the balance.
        (update my-coin-table account
          { "balance" : (- balance amount) })))
```

Keep this pattern in mind and use enforce rather than if to create simpler,
safer Pact code.

## Demonstration #2: Unsafe

Next, I’ll walk through another demonstration showing the difference between
**if** and **enforce**. This is another situation where it may be tempting to
use **if**. Though it is a similar idea, there are a few subtle differences in
this demonstration that will be valuable to understand.

Here is a look at the starting code.

```pact title=" "
  ;;TEMPTING USE of "IF" (type 2)
  (defun credit-if:string (account:string keyset:keyset amount:decimal)
    @doc "Credit AMOUNT to ACCOUNT balance"

   ;;STEP 1: Fetch all keys in my-coin-table and see if account exists.


    ;;STEP 2: if the row exists, check keyset and update the balance


       ;;STEP 3: If the keysets do match, update the balance.
       ;;Otherwise, print error message.





    ;;STEP 4: if the row does not exist, insert a row into the table.



      ))
```

As you can see, you’ll need to check that an account exists, update its balance
if the row exists or if the keysets match, or insert a row if it does not exist.
Each of these cases make it tempting to use **if**. For that reason, I’ll walk
through now coding each line using **if** statements.

**Step 1: Check that Account Exists**

First, fetch all keys in my-coin-table to see if the account exists.

```pact title=" "
;;STEP 1: Fetch all keys in my-coin-table and see if account exists.If true, go to step 2, or else go to step 4
(if (contains account (keys my-coin-table))
```

**Step 2: Update Balance if Row Exists**

Within the if statement, check the keyset and update the balance if it is found
that the row exists.

```pact title=" "
    ;;STEP 2: if the row exists, bind variables
    (with-read my-coin-table account { "balance":= balance,
                                       "keyset":= retk }
```

**Step 3: Update Balance if Keysets Match**

Then, if the keysets match update the balance.

```pact title=" "
       ;;STEP 3: If the keysets do match, update the balance.
       ;;Otherwise, print error message.
       (if (= retk keyset)
         (update my-coin-table account {
           "balance": (+ amount balance)})
         "The keysets do not match" ))
```

**Step 4: Insert Row if it Does not Exist**

Next, if the row does not exist, insert the balance and keyset into the account
on my-coin-table.

```pact title=" "
    ;;STEP 4: if the row does not exist, insert a row into the table.
    (insert my-coin-table account{
       "balance": amount,
       "keyset": keyset
      }))
```

**Final Unsafe Code Using If**

Looking back at the final code, we can see that it is working, but that it is
using an unsafe **if** statement. This is causing logic that is more complicated
than necessary and is something that would be better written using **enforce**.

```pact title=" "
  ;;TEMPTING USE of "IF" (type 2)
  (defun credit-if:string (account:string keyset:keyset amount:decimal)
    @doc "Credit AMOUNT to ACCOUNT balance recording DATE and DATA"

   ;;STEP 1: Fetch all keys in my-coin-table and see if account exists.
   (if (contains account (keys my-coin-table))

    ;;STEP 2: if the row exists, check keyset and update the balance
    (with-read my-coin-table account { "balance":= balance,
                                       "keyset":= retk }
       ;;STEP 3: If the keysets do match, update the balance.
       ;;Otherwise, print error message.
       (if (= retk keyset)
         (update my-coin-table account {
           "balance": (+ amount balance)})
         "The keysets do not match" ))

    ;;STEP 4: if the row does not exist, insert a row into the table.
    (insert my-coin-table account{
       "balance": amount,
       "keyset": keyset
      })))
```

This code can be refactored using **enforce**.

## Demonstration #2: Safe

Take some time now to reconsider the code you wrote previously. Read through the
new comments and decide how you may be able to approach writing this same logic
with enforce rather than if.

```pact title=" "
  ;;refactor with with-default-read & write & enforce
  (defun credit:string (account:string keyset:keyset amount:decimal)
    @doc "Credit AMOUNT to ACCOUNT balance recording DATE and DATA"

    ;;STEP 1: Default the row to balance at 0.0 and keyset at input keyset
    ;;If row exists, then bind balance and keyset value from the table.
    ;;This allows one time key lookup - increases efficiency.



      ;;STEP 2: Check that the input keyset is the same as the row's keyset


      ;;STEP 3: Writes the row to the table. (write adds the table with the key and the row.




)
```

As you can see, you will again need to check that an account exists, update its
balance if the row exists or if the keysets match, or insert a row if it does
not exist. You can do all of this using **enforce** as shown below.

**Step 1: Create Efficient One Time Key Lookup**

To start, you will need to reorder the code slightly.

You’ll start by setting the default row balance to 0.0 and a keyset at input
keyset. If the row exists, then bind the balance and keyset value from the
table.

```pact title=" "
    ;;STEP 1: Default the row to balance at 0.0 and keyset at input keyset
    ;;If row exists, then bind balance and keyset value from the table.
    ;;This allows one time key lookup - increases efficiency.
    (with-default-read my-coin-table account
      { "balance": 0.0, "keyset": keyset }
      { "balance":= balance, "keyset":= retg }
```

This is more efficient than the previous code and allows for a one time key
lookup.

**Previous Code Using If**

As a comparison, look back at steps 2 and 4 from the earlier code you wrote.
Take some time to understand how the code above is combining each of these steps
by allowing for a single lookup.

```pact title=" "
    …code

    ;;STEP 2: if the row exists, check keyset and update the balance
    (with-read my-coin-table account { "balance":= balance,
                                       "keyset":= retk }

    …code

    ;;STEP 4: if the row does not exist, insert a row into the table.
    (insert my-coin-table account{
       "balance": amount,
       "keyset": keyset
    …code
```

**Step 2: Check Input Key vs Row’s Keyset**

Next, use **enforce** to check that the input keyset is the same as the row’s
keyset. If not, return that the account guards do not match.

```pact title=" "
      ;;STEP 2: Check that the input keyset is the same as the row's keyset
      (enforce (= retg keyset)
        "account guards do not match")
```

**Step 3: Write Row to Table**

Finally, write the account balance and keyset to a row in the my-coin-table.

```pact title=" "
      ;;STEP 3: Writes the row to the table. (write adds the table with the key and the row.
      (write my-coin-table account
        { "balance" : (+ balance amount)
        , "keyset"   : retg
        })))
```

**Final Enforce Statement**

Looking back at the final version of the code, you can see that we have
completed the same logic without ever using an if statement. This again allows
for simpler logic and can help you write safer code.

```pact title=" "
  ;;refactor with with-default-read & write & enforce
  (defun credit:string (account:string keyset:keyset amount:decimal)
    @doc "Credit AMOUNT to ACCOUNT balance recording DATE and DATA"

    ;;STEP 1: Default the row to balance at 0.0 and keyset at input keyset
    ;;If row exists, then bind balance and keyset value from the table.
    ;;This allows one time key lookup - increases efficiency.
    (with-default-read my-coin-table account
      { "balance": 0.0, "keyset": keyset }
      { "balance":= balance, "keyset":= retg }
      ;;STEP 2: Check that the input keyset is the same as the row's keyset
      (enforce (= retg keyset)
        "account guards do not match")
      ;;STEP 3: Writes the row to the table. (write adds the table with the key and the row.
      (write my-coin-table account
        { "balance" : (+ balance amount)
        , "keyset"   : retg
        })))
)
```

Take a moment now to look back and compare both versions of this code. Ensure
that you keep these patterns in mind as you write your own code.

## my-coin.repl

In my-coin.repl file, you can check that the failing cases of **debit-if** and
**credit-if** are tested with
[expect ...](/reference/functions/repl-only-functions#expecth-1289163687)
by checking if the output matches the expected failure message. The refactored
code allows us to test with
[expect-failure ...](/reference/functions/repl-only-functions#expect-failureh-1357342698)to
check if the function succeeds or not.

:::info Note

For more information on running .repl files from Atom, see the tutorial
[Contract Interaction > Run REPL File](/build/pact/test-in-the-sdk#run-repl-file).

:::

## Review

That wraps up this tutorial on Pact safety using control flow.

Throughout this tutorial, you learned that using **enforce** can help make your
the control flow of your Pact smart contracts even simpler and safer. You went
over a few demonstrations teaching you ways to avoid using **if** statements in
favor of **enforce**.

This is one of a few key patterns that you can use to improve the safety of your
smart contracts. Coming up, we’ll go over a few more safety tips to keep in mind
as you develop Pact smart contracts.
