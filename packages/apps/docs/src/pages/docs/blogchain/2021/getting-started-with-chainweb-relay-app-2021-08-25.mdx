---
title: Getting Started with Kadena Relay App in Testnet
description:
  Part 1 Create and fund a testnet KDA account. Part 2 Create a Bond on Kadena
  Testnet. Part 3 Install and Run Kadena Relay App on Testnet. Part 4 (bonus)
  Rotate, renew, and unbond your bonds.
menu: Getting Started with Kadena Relay App in Testnet
label: Getting Started with Kadena Relay App in Testnet
publishDate: 2021-08-25
author: Heekyun
layout: blog
---

![](/assets/blog/1_bmXFrJ6AX3NxWty7Au7sVg.webp)

## Getting Started with Kadena Relay App in Testnet

Part 1: Create and fund a testnet KDA account

Part 2: Create a Bond on Kadena Testnet

Part 3: Install and Run Kadena Relay App on Testnet

Part 4 (bonus): Rotate, renew, and unbond your bonds.

## Part 1: Create and fund a testnet KDA account

You’ll first create a testnet KDA account (will be referred to tKDA account in
this article) in order to create a bond on Kadena testnet. If you have a Zelcore
or Chainweaver account, you can use the account from Zelcore. Otherwise, you can
generate a keypair from [kadena-transfer-tool](https://transfer.chainweb.com/)
to create the account.

![kadena-transfer-tool](/assets/blog/1_ZvEmzVsDfAUTuAR4nJ90aA.webp)

![Zelcore Wallet — Kadena](/assets/blog/1_qqE5owAzNukpZB7EE0ofsA.webp)

![Zelcore Wallet — Receive](/assets/blog/1_5mefJQ__uzqP1kpqL3Ifmg.webp)

1.  Visit the [kadena-transfer-tool](https://transfer.chainweb.com/) and click
    on “Generate KeyPair.” A file that contains a set of public key and a
    private key will be downloaded. For Zelcore users, click on “Receive” to
    find your account name and the public key.

2.  Visit [Kadena Testnet Faucet](https://faucet.testnet.chainweb.com/) and
    click on “Create and Fund New Account”. If you already have a tKDA, click on
    “Add Funds to Existing Account.”

![Step 3,4,5 — Kadena Testnet Faucet](/assets/blog/1_jH2o3B1BjKJvbqH6ZE2q-g.webp)

3. Paste in the public key from Step 1 and add to keysets by clicking “+”.

4. Fill in the account name. We recommend using the public key as the account
   name.

5. Click on “Create and Fund Account”

You now have a testnet KDA account with a balance of 20 tKDA.

## Part 2: Create a Bond on Kadena Testnet

1.  Visit the
    [Testnet Chainweb Relay Website](https://relay.chainweb.com/testnet/). This
    website allows you to manually create a new bond, and manage existing bonds.

![](/assets/blog/1_gmagyJ4Di-B_ZW4iXXfZbQ.webp)

2 . Click on “Connect Wallet” on the top right, and paste in your account name.
Then set the signing option to preferred method.

3. Paste in the public key in “Bond Guard” that you will use to manage the bond,
   and add to the keyset by clicking “+” button.

4. Click on “New Bond”.

Once the transaction is complete, you’ll see the bond details after refreshing
the page.

## Part 3: Install and Run Relay App

Before running app, you should have a **relay bond** and an **infura**
**project.** Follow this
[guide](https://blog.infura.io/getting-started-with-infura-28e41844cc89/) to
create an infura project.

1.  Set up Bond Details.

Create an .env file with the template below and fill in the details.

```pact
    DEFAULT_ENV=kovan

    # Infura project ID
    INFURA_API_TOKEN=

    # Relay-app settings (always required)
    BOND_NAME=
    PACT_PRIVATE_KEY=
```

**INFURA_API_TOKEN — **the project ID of your infura project. **BOND_NAME** —
the bond name that will be listed under “Your Bonds” in
[Chainweb Relay Testnet](https://relay.chainweb.com/testnet/) website.
**PACT_PRIVATE_KEY** — the private key of keypair used in the bond.

If you used the public key from Zelcore, or want to use a separate keypair to
manage the bond, look at **part 4: Rotate** to rotate your bond guard to a
separate keypair.

2. Install and run the Relay App.

The software listens to Ethereum Testnet for transfer activities to a “lockup”
account and propose or endorse the header information on Kadena Testnet. If the
header is proposed, the Kadena Testnet emits PROPOSE events, which the app will
listen and endorse. When the app succeeds in endorsing the proposal, then the
bond will have earned a new **activity**.

There are two ways to run this software: **Docker** or **npm**.

Run via Docker:

```shell
    docker run -v "$PWD/.env:/app/.env:ro" kadena/relay-app
```

Run via npm:

```shell
    npm install --global @kadena/relay-app:latest
    relay-app
```

### Advanced: Generate lockup events on Ethereum testnet

In order to create the headers to propose or endorse, there needs to be transfer
activity to lockup account on Ethereum Testnet (We default to Kovan network).
You can learn about creating these events
[here](https://github.com/kadena-io/chainweb-relay#generating-test-lockup-transfers).

## Part 4(bonus): Rotate, renew, and unbond your bonds.

## Rotate

Although bond guards can be identical to tKDA account guard, user can use a
separate keypair to guard the bonds. This is to allow the wallet users to use a
keypair to be used in the bond software.

To Rotate, go to the
[testnet chainweb relay website.](https://relay.chainweb.com/testnet/)

1.  Click on Bond Name, and then click on “Rotate”

2.  Paste in the public key of the keypair that the bond guard to be rotated to.
    You can create a new keypair using the
    [kadena-transfer-tool](https://transfer.chainweb.com/) .

3.  Sign with the preferred method with the tKDA account guard.

4.  Click “Confirm”

## Renew / Unbond

The bonds need to be renewed after the lockup period (10 days). Once the renew
period ends (10 days), then the bond can be unbonded. The buttons will be active
once the renew / unbond period begins. The steps are similar to ROTATE, with
only one difference — it needs to be signed with the bond guard, not tKDA
account guard.

1. Click on Bond Name, and then click on “Renew” or “Unbond”

2. Sign with the preferred method with the bond guard

3. Click Confirm

You now have a bond on Kadena Testnet and a way to earn activity using the
Kadena Relay App! Join our [Discord channel](http://discord.io/kadena) for any
technical questions regarding the relay app!
