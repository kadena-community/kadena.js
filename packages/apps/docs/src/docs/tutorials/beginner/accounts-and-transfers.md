---
title: Accounts and Transfers
description:
  The goal of this tutorial is to help you build an application that transfers
  value between two accounts. To do this, you’ll build a smart contract that
  implements this functionality named Simple Payments. This is an important
  function of smart contracts and will set you up to create more complex
  applications using accounts and transfers.
menu: Accounts and Transfers
label: Accounts and Transfers
order: 9
layout: full
tags: ['pact', 'beginner tutorials', 'accounts and transfers']
---

# Accounts and Transfers

Welcome to this tutorial on Accounts and Transfers with Pact!

**This tutorial covers the following topics**

- Project Environment Setup
- Module and Keysets
- Define Schema and Table
- Functions
- Create Table
- Create Accounts
- Make Payments
- Deploy Smart Contract

The goal of this tutorial is to help you build an application that transfers
value between two accounts. To do this, you’ll build a smart contract that
implements this functionality named Simple Payments. This is an important
function of smart contracts and will set you up to create more complex
applications using accounts and transfers.

:::note Key Takeaway

Accounts and transfers are a key feature of many smart contracts. Using Pact,
you can define tables that track account keysets and values, allowing you to set
and update these values as needed.

:::

## Pact Accounts and Transfers

https://www.youtube.com/watch?v=uYVLLivwKlI

Subscribe to our
[YouTube channel](https://www.youtube.com/channel/UCB6-MaxD2hlcGLL70ukHotA) to
access the latest Pact tutorials.

## Project Overview

To get started with this application, take a look at the visual overview. This
provides a summary of each of the features you will be creating for the simple
payment smart contract.

![1-project-overview](/assets/docs/1-project-overview.png)

As you can see, you will create a payments module including 3 functions;
**create-account**, **get-balance**, and **pay**. These functions will store
data on a **payments-table** which manages payments between 2 accounts **Sarah**
and **James**.

Now that you have a basic understanding of the requirements, you can start
building the project for yourself!

## Project Environment Setup

To get started, choose a project directory and clone the project resources into
your local environment.

```bash title=" "
git clone https://github.com/kadena-io/pact-lang.org-code.git
```

Change into the **loans** directory to begin working on this project.

```bash title=" "
cd pact-lang.org-code/payments
```

Open this directory in atom to see each of the files provided.

```bash title=" "
atom .
```

As you’ll see, there are a few separate folders available to you.

|                |                                                                                                                                                                             |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **start**      | Provides a starting point with all comments for every challenge.                                                                                                            |
| **challenges** | Challenges in the demo are broken out into separate files, allowing you to build your application over time while having the flexibility to experiment with your own ideas. |
| **finish**     | Includes all comments and code for the final application.                                                                                                                   |
| **loans**      | Includes final application without the challenge comments.                                                                                                                  |

Each of these options are meant to help support you as you work through these
challenges. Feel free to use them however you’d like to.

## 1. Module and Keyset

The first step is to set up the module and keysets for the smart contract.

:::caution Code Challenge

Define and read the admin-keyset, create the payments module, and give the
admin-keyset access to the module.

- [Challenge](https://github.com/kadena-io/pact-lang.org-code/blob/master/payments/2-challenges/1-module-and-keysets/challenge.pact)
- [Solution](https://github.com/kadena-io/pact-lang.org-code/blob/master/payments/2-challenges/1-module-and-keysets/solution.pact)

:::

:::info

If you’re unfamiliar with modules and keyset, our
[Pact Modules Tutorial](/pact/beginner/modules)

is a great place to get started.

:::

## 2. Define Schema and Table

The next step is to define the schema and table for the smart contract.

The **payments-table**, will keep track of the balance of the accounts and
associate that to the account’s keyset.

**Payments Table**

| fieldname | fieldtype |
| --------- | --------- |
| balance   | decimal   |
| keyset    | keyset    |

:::caution Code Challenge

Define a schema and table with columns **balance** and **keyset**.

- [Challenge](https://github.com/kadena-io/pact-lang.org-code/blob/master/payments/2-challenges/2-schema-and-table/challenge.pact)
- [Solution](https://github.com/kadena-io/pact-lang.org-code/blob/master/payments/2-challenges/2-schema-and-table/solution.pact)

:::

:::info

Schema definitions are introduced in the
[Pact Schemas and Tables Tutorial](/pact/beginner/schemas-and-tables#define-schemas).

:::

## 3. Functions

This smart contract will contain 3 functions create-account, get-balance, and
pay. Each of these are essential functions to allow users to manage their
accounts.

:::info

You can review each of the function types in the
[Schemas and Tables Tutorial](/pact/beginner/schemas-and-tables) as well as the
[Pact Language Basics Tutorial](/pact/beginner/language-basics).

:::

### 3.1 Create Account

First, add a function that allows the administrator to create accounts. This
will allow you to add as many accounts as you’d like.

:::caution Code Challenge

Create a function **create-account** that allows administrator to create
accounts.

- [Challenge](https://github.com/kadena-io/pact-lang.org-code/blob/master/payments/2-challenges/3-functions/3.1-create-account/challenge.pact)
- [Solution](https://github.com/kadena-io/pact-lang.org-code/blob/master/payments/2-challenges/3-functions/3.1-create-account/solution.pact)

:::

:::info

Try using [enforce](/reference/functions/general#enforceh-1604583454) to regulate
who has access to create an account.

:::

### 3.2 Get Balance

Now that you can create accounts, it is helpful to be able to view the balance
of these accounts. In this case, we’ll allow both users and administrators to
view the balance.

:::caution Code Challenge

Create a function **get-balance** that allows administrators and users to view
the balance of their account.

- [Challenge](https://github.com/kadena-io/pact-lang.org-code/blob/master/payments/2-challenges/3-functions/3.2-function-get-balance/challenge.pact)
- [Solution](https://github.com/kadena-io/pact-lang.org-code/blob/master/payments/2-challenges/3-functions/3.2-function-get-balance/solution.pact)

:::

### 3.3 Pay

Next, you’ll create the function that allows one account to pay another account.
This allows accounts to transfer value from their account to another to begin
making payments and managing their finances.

:::caution Code Challenge

Create a function **pay** that allows an account to pay another account.

- [Challenge](https://github.com/kadena-io/pact-lang.org-code/blob/master/payments/2-challenges/3-functions/3.3-function-pay/challenge.pact)
- [Solution](https://github.com/kadena-io/pact-lang.org-code/blob/master/payments/2-challenges/3-functions/3.3-function-pay/solution.pact)

:::

## 4. Create Table

You have now completed the module. Outside of the module you can create the
table that you defined earlier.

:::caution Code Challenge

Create the **payments-table**.

- [Challenge](https://github.com/kadena-io/pact-lang.org-code/blob/master/payments/2-challenges/4-create-table/challenge.pact)
- [Solution](https://github.com/kadena-io/pact-lang.org-code/blob/master/payments/2-challenges/4-create-table/solution.pact)

:::

:::info

At this point you have completed the module. You will notice the previous
challenge containing a final parenthesis to close out the module. The remaining
steps are meant to help you call functions from within the module you created to
put your smart contract to use.

:::

## 5. Create Accounts

The next step is to create the accounts that will transfer value.

For this tutorial, create 2 accounts.

- Sarah
- James

To do this, you use the **create-account** function built earlier. This function
takes 3 arguments; **id**, **initial-balance**, and **keyset**.

:::caution Code Challenge

Call the **create-account** function to create accounts for **Sarah** and
**James**.

- [Challenge](https://github.com/kadena-io/pact-lang.org-code/blob/master/payments/2-challenges/5-create-accounts/challenge.pact)
- [Solution](https://github.com/kadena-io/pact-lang.org-code/blob/master/payments/2-challenges/5-create-accounts/solution.pact)

:::

## 6. Make Payment

The final step is to make a payment from one account to another. You can do this
using the pay function created earlier.

:::caution Code Challenge Use the pay function to transfer **25.0** to **James**
from **Sarah’s** account. After making the payment, read the balance of both
Sarah and James.

- [Challenge](https://github.com/kadena-io/pact-lang.org-code/blob/master/payments/2-challenges/6-make-payment/challenge.pact)
- [Solution](https://github.com/kadena-io/pact-lang.org-code/blob/master/payments/2-challenges/6-make-payment/solution.pact)

:::

### Deploy the Smart Contract

Congratulations, at this point you have completed the Simple Payment smart
contract!

If you’d like, you can try deploying this smart contract. You can deploy this
contract using the **Pact Online Editor** or from the **Pact Atom SDK**. If you
choose to deploy this locally, you’ll need the REPL file which you can find
inside of the repository you cloned.

For help getting started and deploying in each of these environments, try the
following tutorials.

- [Pact Online Editor](/pact/beginner/web-editor)
- [Pact Development on Atom SDK Tutorial](/pact/beginner/atom-sdk)

## Review

Congratulations on completing the **Accounts and Transfers Tutorial**!

In this tutorial, you built a **Simple Payment** application that creates
accounts, views account balances, and makes payments between accounts. This is
an important function of smart contracts and will set you up to create more
complex applications using accounts and transfers.

This is a key feature of many smart contracts and can be extended into all types
of use cases. Take some time now to experiment with these features to try them
out in creative new ways.
