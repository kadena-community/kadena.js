---
title: The First Crypto Gas Station is Now on Kadena’s Blockchain
description:
  Here at Kadena, we’re focused on making blockchain as useful and usable as
  possible. From our user-friendly and powerful smart contract language Pact, to
  our wallet and developer environment Chainweaver, we’re creating products that
  make the safety and global reach of blockchain accessible to everyone. Today,
  we’re announcing that we’ve implemented the world’s first autonomous crypto
  gas station on a public blockchain.
menu: The First Crypto Gas Station is Now on Kadena’s Blockchain
label: The First Crypto Gas Station is Now on Kadena’s Blockchain
publishDate: 2020-08-06
headerImage: /assets/blog/2020/1_yl4w71ccQB02X08t389QDg.webp
tags: [gas station, pact]
author: Taylor Rolfe
authorId: taylor.rolfe
layout: blog
---

# The First Crypto Gas Station is Now on Kadena’s Blockchain

Here at Kadena, we’re focused on making blockchain as useful and usable as
possible. From our user-friendly and powerful smart contract language Pact, to
our wallet and developer environment Chainweaver, we’re creating products that
make the safety and global reach of blockchain accessible to everyone. Today,
we’re announcing that we’ve implemented the world’s first autonomous crypto gas
station on a public blockchain.

One of the biggest barriers to the broad use of decentralized applications
(dApps) is the requirement that participants must first onboard to a
cryptocurrency to pay gas for transaction costs. Before a user can interact with
a dApp, they first have to create a wallet, go to an exchange, and buy the
relevant cryptocurrency used as a unit of gas. These steps create a huge hurdle
to onboarding, one of the most critical steps to adoption. If creating an
account for an app is hard, nobody is going to use it.

Kadena’s solution to this onboarding problem is gas stations. A gas station is
an account that exists only to fund gas payments on behalf of other users under
specific conditions. By having a gas station pay user onboarding costs, we
remove the friction of acquiring tokens in advance of signup, which allows a
user’s first interaction with a dApp to be as easy as filling out a web form.

_Read more about how gas stations solve blockchain’s usability problem in
[this article](https://medium.com/kadena-io/users-shouldnt-pay-for-gas-4df989ec8236)
by Kadena Co-Founder and CEO Will Martino._

A successful gas station must be easy to use while remaining secure from bad
actors. Kadena’s smart contract language Pact enables this by supporting
multi-sig and a capability-based security model. In the context of gas stations,
“multi-sig” means that a different account can pay for gas within a single
transaction, and “capability-based” means that only approved operations are
allowed to access the gas station. Kadena is currently experimenting with live
implementations of gas stations, and early signals indicate that they are a
major leap forward in ease-of-use for blockchains.

Gas stations are flexible, and their governance can be enforced in various ways
depending on the requirements. Kadena has open-sourced two types of gas stations
for community review and use:

1.  “Gas guard” type gas stations require that the transaction’s **gas limit**
    falls within a threshold.

2.  “Gas payer” type gas stations require that **certain functions** are called
    or that only **approved accounts** are permitted.

## Example: “Gas guard” type gas station

**Background**: The Kadena public blockchain scales by braiding together
multiple Bitcoin-like Proof of Work chains. Moving coins between two different
chains requires two gas payments; one on the transaction’s origin chain and one
on the transaction’s target chain. If a user does not have tokens on the target
chain to pay for gas, then their transaction cannot finish until they acquire
funds on the target chain to complete the cross-chain transfer. In an effort to
help users complete their cross-chain transfers on the target chain, Kadena has
deployed a gas station with a gas guard.

**Implementation**: The gas station is an account with custom guards that
enforces (1) the gas limit, (2) the gas price, and (3) that its funds can only
be used for gas. This account is not guarded by a keyset, so anyone can access
these funds for free as long as they satisfy the guards.

**User Interface**: Users can access this gas station in 3 simple steps —

1.  Go to this
    [web page](https://kadena-community.github.io/kadena-transfer-js/xchain.html)

2.  Enter the transaction’s Request Key

3.  Press submit

**Why it works**: Completing a cross-chain transfer on the target chain consumes
the least amount of gas of all transfer functions. The gas limit guard is set
for an amount that is below a standard transfer function but above the
cross-chain completion amount, so only the approved function can satisfy the
guard for using this gas station. All other transfer functions will exceed the
low gas limit and fail.

**Key Takeaway**: Gas stations will ultimately be demand driven, and this tool
has already been used dozens of times to help KDA holders complete cross-chain
transfers that otherwise may have remained stuck for some time. This gas station
demonstrates one of the simpler ways to support existing users, but there are
also more interesting gas stations that can get built to drive adoption with new
users (as seen with the COVID-19 dApp example below).

**Bonus**: A similar gas station that helps users complete cross-chain transfers
of KDA can also be seen on the multi-currency crypto wallet, ZelCore.

![](/assets/blog/2020/1_NfLprkEnhzsul2fPmC_SjA.webp)

## Example: “Gas payer” type gas station

**Background**: To help demonstrate the significant opportunity enabled by gas
stations, Kadena developed a prototype COVID-19 test tracking application. This
coronavirus test tracking dApp creates a common data set of test records that is
secure, verifiable, and universally accessible in a privacy preserving manner.
All the power of blockchain is neatly packaged within a smart QR code that is
associated with COVID-19 test kits. The tests get scanned by healthcare
professionals to record data via web form.

_Read more about the COVID-19 test tracker dApp
[here](https://github.com/kadena-io/covid19-platform) or watch this brief
animation._

[](https://www.youtube.com/watch?v=y7R6RbSptE0)

**Implementation**: The gas station used by this dApp is configured with guards
that require (1) access from a **verified account** and (2) that **specific
functions** are used to redeem gas. As long as a user follows the provided
interface, these criteria get automatically satisfied.

Here’s how it works:

1.  Test suppliers use an assigned keypair to generate unique QR codes which are
    then printed and paired with each test kit (embedded within each QR code is
    the access data for a **verified account**).

2.  During the test, medical staff scan the QR code using any smart device to
    open a web form that collects and records patient data (submitting data
    through this web form calls the **specific function** for redeeming gas).

**User Interface**: There are three potential user groups that benefit from this
dApp, each of which may interface with a web form and/or a QR code.

![](/assets/blog/2020/1_OQo0NHsWnN7VHBlslwthNA.webp)

\* [Test Supplier web form](https://covid19-dashboard.chainweb.com/)

\*\* [Medical Staff web form](https://covid19-test.chainweb.com/)

**Why it matters**: Inconsistent test standards and fragmented access to data
are barriers to better management of COVID-19. A blockchain-based application
can deliver the necessary level of data security, transparency, aggregation, and
immutability. Gas stations dramatically simplify the dApp user experience,
making a blockchain-based application feasible for real-world use.

**Key Takeaway**: The “Gas Payer” type of gas station has unique flexibility in
allowing a dApp to be user-friendly or even user-hidden while retaining the
powerful features of blockchain. In fact, gas stations are customizable with the
same functionality as any Pact smart contract. More advanced gas stations can
specify _who_ can use the gas, _when_ gas gets used, _why_ gas gets used, and
even _how many_ times an account can access its gas.

## Gas Stations: An Innovative Concept that is Now Reality

Gas stations will play a key role in bringing blockchain-based applications into
the hands of everyday people. When onboarding new users no longer requires
familiarity with blockchain, any user registration, or software installation,
then the user base of a dApp grows exponentially from *savvy token holders *to
_virtually anyone with an internet connection_. Given the potential reach, dApp
creators would be wise to offer pre-paid gas fees to their users as a low-cost
investment with high-value returns.

The concept of subsidized gas payments is not new, but other platforms have
struggled to execute a well-supported implementation. Many platforms have fallen
short largely due to network limitations. For example, Ethereum is fundamentally
a single-signature platform, which requires added complexity at the smart
contract level to enable a different account to pay the gas for a transaction.
Bitcoin has scalability limits that make it unreasonable for gas station hosts
to sustain the high cost of gas fees. Uniquely, Kadena has the base-layer
scalability and the smart contract capabilities needed to make gas station
implementation viable.

Kadena is a complete platform that gives developers the required resources to
simply build powerful and far-reaching blockchain applications. To support the
community, Kadena has a dedicated fund for developers that will cover gas
station startup costs. Developers that want to build dApps quickly and easily
can count on Kadena to support their launch and growth. Reach out to our team at
[info@kadena.io](mailto:info@kadena.io) if you would like to start building on
Kadena.
