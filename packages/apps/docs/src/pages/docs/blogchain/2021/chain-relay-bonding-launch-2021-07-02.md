---
title: Chain Relay Bonding Launch
description:
  Learn how you can help secure the Kadena Chain Relay by bonding KDA! Today,
  the Kadena Chain Relay Bonding Program launches on Kadena Mainnet and is ready
  to accept bonders. This is an important first step to establish robust
  economic security for bridging activities like wrapping Ethereum tokens on
  Kadena.
menu: Chain Relay Bonding Launch
label: Chain Relay Bonding Launch
publishDate: 2021-07-02
author: Stuart Popejoy
layout: blog
---

![](/assets/blog/1_-YDXCeAfa2h-FyBY4xzE3A.webp)

# Chain Relay Bonding Launch

Learn how you can help secure the Kadena Chain Relay by bonding KDA!

Today, the Kadena Chain Relay Bonding Program launches on Kadena Mainnet and is
ready to accept bonders. This is an important first step to establish robust
economic security for bridging activities like wrapping Ethereum tokens on
Kadena. When the full bridge launches later this summer, bonders will operate
software that proposes and endorses bridged data. Bonders are rewarded for their
participation with fees in the form of an APY _risk fee_ and a per-operation
_activity fee_ for operating the bridge. In this pre-launch phase however
bonders will earn APY for establishing the initial economic security only.

## How can I participate in bonding?

Bonders can participate in two ways: either by bonding the full amount
on-platform and operating the relay software when launched, or working with
delegation services.

## Bonding on-platform

To bond on-platform, go to [relay.chainweb.com](https://relay.chainweb.com) to
create a new bond. Bonds are fixed-size at 50,000 KDA. Initial participants can
earn up to 30% APY with a 5 KDA activity fee. Your bond will be locked up for 30
days. After this period you will be eligible to receive rewards by renewing your
bond for another 30 day period, or by unbonding after a 20-day cooldown period.

![Relay Bonding App](/assets/blog/1_ncSdqxO7x4kwmXGG3ob9tg.webp)

Bonding is easy!

1.  Simply connect your wallet to the KDA account with bonding funds.

2.  To create a new bond, you can use your KDA public key or supply a different
    one, hit the “_+_” button, and click “New Bond” to kick off the transaction
    signing process.

3.  When the transaction is done you will see your **bond name **in the “Result”
    field. The bond name is your KDA account plus the UTC date of your bond.
    Thus if your account is “abcd1234” and the date is July 2, your bond will be
    “abcd1234:2021–07–02”. We’ll be adding a bond explorer UI in the coming
    days, but for now keep track of your bond name.

4.  After your bond expires, you will type/paste the bond name into the
    “Unbond/Renew Bond” field to perform those actions.

## Operating the Relay Software

The relay software is a small, automated application in the form of a Docker
container. Operating the software is quite simple and when the bridge launches,
we will provide full details on its configuration and deployment. For now, bonds
initiated or renewed before bridge launch will earn APY in return for locking up
funds, without needing to operate the software. After the bridge is launched the
minimum activity requirement will be enforced for new or renewed bonds, so
running the software will be required to receive fees.

## Bonding with Delegation Services

Bonding participation will also be available via *delegation services *that
allow different/smaller commitments, or not having to run the software, etc.
CoinMetro will be launching delegation in early July.

## Developer info for bridging data from Ethereum

Developers can get ready to bridge assets over from Ethereum by using the Chain
Relay to validate header data. We’ll be publishing a Developer Deep Dive on this
but you can already see
[live code of an example wrapper kERC on testnet](https://balance.chainweb.com/modules.html?server=api.testnet.chainweb.com&module=free.kERC&chain=0)!
Check out the relay app as well at
[relay.chainweb.com](https://relay.chainweb.com) to see how to automate the
bridging process for your asset.
