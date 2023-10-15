---
title: "03: Admin account"
description: "In the third chapter of the Election dApp tutorial you will create an admin account to govern your Pact modules"
menu: Election dApp tutorial
label: "03: Admin account"
order: 3
layout: full
tags: [pact, smart contract, typescript, tutorial]
---

# Chapter 03: Admin account

The smart contract that will become the back-end of the election website requires a
Kadena account to govern it. In this chapter you will create this account on your
local Devnet. All Kadena accounts are comprised of 3 parts: an account name, keys
and a predicate. Your account will have just one key. The predicate will be `keys-all`,
meaning that any transaction must be signed by all keys in the account. Since you
specify only one key, only one signature will be required per transaction. For the
account name, the convention of using the single key of the account prefixed by
`k:` will be followed.

## Recommended reading

 * [Beginner’s Guide to Kadena: Accounts + Keysets](/blogchain/2020/beginners-guide-to-kadena-accounts-keysets-2020-01-14)
 * [Kadena Public Blockchain: Getting Started with Transfers](/blogchain/2019/kadena-public-blockchain-getting-started-with-transfers-2019-12-19)


## Get the code

The project files have not been changed since the last chapter, so if you are
following along with the tutorial you can continue on the `01-getting-started`
branch. If you started the tutorial with this chapter, clone the tutorial
project and change the current directory of your terminal to the project folder.

```bash
git clone git@github.com:kadena-community/voting-dapp.git election-dapp
cd election-dapp
```

After cloning the project, switch branches to get the starter code for this chapter.

```bash
git checkout 03-admin-account
```

## Creating the admin key

There are several ways to create a key, but in this tutorial you will create a key
with Chainweaver. Open Chainweaver and make sure that the Devnet network is selected.
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
admin account indeed does not yet exist on Devnet.

## Creating the admin account

There are different routes to create an account on the Kadena blockchain. On the Mainnet,
you would typically buy KDA on an exchange and transfer that KDA to the Kadena account you want to
create. The Testnet has a faucet contract that allows you to
[receive 20 KDA](https://faucet.testnet.chainweb.com/) on your account for free
for the purpose of testing. At the time of writing this tutorial, the local Devnet does not contain the
faucet contract out of the box. So, you can either
[create your own faucet contract](https://github.com/thomashoneyman/real-world-pact/tree/main/01-faucet-contract)
or you could use a shortcut to create and fund your account. Namely, the Devnet contains a set
of test accounts holding lots of KDA and their private keys are published
[on GitHub](https://github.com/kadena-io/chainweb-node/blob/master/pact/genesis/devnet/keys.yaml).
You will use one of these accounts to create the admin account that governs the election smart contracts.

As you may recall from the previous chapter, the Devnet has a few smart contracts pre-installed.
You will use the `transferCreate` function from the `coin` module to create the admin account on
Devnet and transfer 20 KDA to the account in one operation. Open a terminal window with the current
directory set to your project root. First, change the current directory to the `./snippets` folder
and install the TypeScript types for the `coin` module.

```bash
cd ./snippets
npm run generate-types:coin:devnet
```

Now you are ready to run the npm script that executes the snippet `./transferCreate.ts`. Open up this
file in your editor to learn how the Kadena JavaScript client is used to call the `transfer-create`
function of the `coin` module to create and fund your admin account. After importing the depencies
and creating the client with the right (Devnet) configuration, the
main function is called with information about the sender, the receiver and the amount. The amount
of KDA to transfer to the receiver is hardcoded to 20. The receiver will be you admin account name,
which you will specify as an argument when running the script. The sender, `sender00`, is one
of the pre-installed Devnet test accounts that holds some KDA on all chains. The public and private
key for this account were copied over from GitHub. Inside the main function, the amount to transfer
is converted to a PactDecimal, which boils down to this format: `{ decimal: '20.0' }`. Then, the
transaction is created. Creating this transaction is slightly more complex than the `list-modules`
you learned about in the previous chapter.

Instead of passing raw Pact code as a string to `Pact.builder.execution()`, the `coin['transferCreate']`
function is called on `Pact.modules` to generate the correct Pact code for you, based on the
typing information you generated in the previous step, combined with the arguments provided to
the function. The third argument of `transfer-create` is a function that returns the
guard for the account to be created. This guard is specified in `.addData()`, with the public
key of the admin account as the only key and `keys-all` as the predicate. This guard associates the
created account with the public key of your admin account, for which you hold the private key
in Chainweaver, to make sure that only you will be able to control the account. In `.addSigner()`, it
is specified that the sender needs to sign off for the capability to pay the gas fee for the
transaction and to make the transfer with the provided details. In `.setMeta()`, `sender00` is
specified as the `senderAccount`. After setting the network id from the Devnet configuration,
the transaction is created. Next, the transaction is signed with the private key of the
`sender00` account and the transaction is submitted. Open up a terminal window with the current
directory set to the `./snippets` folder. Run the following command to create and fund your
admin account. Replace `k:account` with your admin account.

```bash
npm run transfer-create:devnet -- k:account
```

After a few seconds, `Write succeeded` should be printed in the terminal window. Verify that your account was created by checking the account details using the Kadena JavaScript client.
Replace `k:account` with your admin account.

```bash
npm run coin-details:devnet -- k:account
```

This time, the script should print out the account name, the KDA balance and the receiver guard
of the account. Chainweaver will tell the same story. Navigate to `Accounts` in the top section of the left menu bar. Expand your admin account to view the information on all chains. You will
see that on chain 1 you are the owner, one keyset is defined and the balance is 20 KDA.

## Next steps

In this chapter you learned how to create a key for a Kadena account using Chainweaver and to
create and fund this account using the Kadena JavaScript client. You verified the creation
of the account in `Accounts` view of Chainweaver and by calling the `details` function of the `coin` module on Devnet using the Kadena JavaScript client. The admin user will use its KDA
to pay gas fees charged for deploying keysets, deploying smart contracts and sending transactions to nominate candidates for the election. In the following chapter you will learn
how to create a namespace in which you will later define an admin keyset and deploy your
smart contracts.
