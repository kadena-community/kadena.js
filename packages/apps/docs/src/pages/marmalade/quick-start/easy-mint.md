---
title: Easy Minting with Marmalade V2
description: Easy minting with Marmalade 
menu: Guides
label: Quick Start
order: 2
layout: full
---

# Easy Minting Guide

Welcome to the Easy Minting Guide on Marmalade V2 tutorial!

This tutorial will guide you the quickest method to mint your first NFT using
Chainweaver. Because it's a simple NFT mint process, the token will be a very
basic token with URI, and will not have features like royalties or collections.

You will be able to make auction sales with the tokens, once it's created!

Let's get started!

**Step 1: Authenticate and Locate Marmalade v2 in Chainweaver**

To begin, you need to authenticate on Chainweaver. Once you're authenticated,
navigate to the Module Explorer to find the Marmalade v2 contracts.

In the Module Explorer, search for the following string:

```
marmalade-v2.util-v1
```

This will locate the Marmalade v2 util contract, which contains easy mint functions crafted for convenience!

Once you find the contracts, click on "View" to proceed.

**Step 2: Enter token details**

![Screenshot Placeholder](/assets/marmalade/1.easy-mint.png)

``
We will start by adding the required data for toke creation.
Click on the `create-mint-nft` function, and filling in the token components
listed below.

1. **URI**: Enter the off-chain URI that stores the token metadata.
2. **guard**: This guard will be account guard of the minted token. We need to
   locate the keyset information in the transaction data field, by adding in
   `(read-keyset "my-keyset")`

 **Note:** By default, `create-mint-nft` mints a non-fungible token without
 any rules programmed. If you wish to choose different policy options, read
 [advanced tutorial](todo). For more information on token policies, please refer to the
 [Marmalade V2 Token Policies](https://github.com/kadena-io/marmalade/tree/v2#token-policies)
 documentation on GitHub.


**Step 3: Add keyset information**

![Screenshot Placeholder](/assets/marmalade/2.easy-mint.png)

After filling in token details, click on the "configuration" tab to enter
keyset information. Enter "my-keyset" as keyset name and click "Create".
Once this is created, you will see your keysets below it. Please tick the keyset
that matches the account we have been using for this entire process.

**Step 5: Sign Transaction**

![Screenshot Placeholder for Gas Settings](/assets/marmalade/4.easy-mint.png)

Now click on the Sign tab. The boxes refer to the code that you would like to
scope your signature to. Add the gas payer's public key to the first field,
and enter "(marmalade-v2.util-v1.UTIL-SIGN)", and select the public key that will
be minted the token.

**Step 4: Submit to Network**

![Screenshot Placeholder for Gas Settings](/assets/marmalade/5.easy-mint.png)

Finally, go to the Preview tab and submit your transaction if there are no
errors. This time, we're submitting the transaction, so you'd need a valid gas
payer with balance. Wait for the transaction to finish. The server result should
be true.


You've minted your first NFT on marmalade! Investigate the transaction on
the [block explorer](explorer.chainweb.com), and find your token information.
