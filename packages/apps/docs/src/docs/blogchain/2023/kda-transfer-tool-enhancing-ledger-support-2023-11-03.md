---
title: KDA Transfer Tool - Enhancing Ledger Support
description:
  You can now sign complex JSON transactions with your Ledger. The Kadena team
  is introducing an exciting update for Ledger users! You can now sign complex
  JSON transactions with your Ledger using the Kadena Transfer Tool at
  transfer.chainweb.com!
menu: KDA Transfer Tool - Enhancing Ledger Support
label: KDA Transfer Tool - Enhancing Ledger Support
publishDate: 2023-11-04
headerImage: /assets/blog/2023/1_lhubfAgTf35c-g2fk01kmw.webp
tags: [kadena, ledger, chainweb]
author: Kadena
authorId: kadena
layout: blog
---

# KDA Transfer Tool: Enhancing Ledger Support

## You can now sign complex JSON transactions with your Ledger.

The Kadena team is introducing an exciting update for Ledger users! You can now
sign complex JSON transactions with your Ledger using the Kadena Transfer Tool
at [transfer.chainweb.com](https://transfer.chainweb.com/)!

We’ve added two new utilities:

- Ledger:
  [Sign Transactions (JSON)](https://transfer.chainweb.com/sign-ledger-json.html)

- Ledger: [Search Keys](https://transfer.chainweb.com/search-ledger-keys.html)

These enhancements build on the existing Ledger support for simple transfers,
paving the way for even more extensive Ledger support in the future, including
Ledger signing functionality in the@kadena/client
[TypeScript SDK](https://www.npmjs.com/package/@kadena/client).

The Ledger “Change/Verify Account” feature was also updated to lift the 1000
account limitation, and its default derivation method for non-zero keys has
changed, with the previous method still supported in “legacy mode.”

Finally, we introduce a web based tool to search your Ledger account keys, for
both exact key matches and key prefixes.

![](/assets/blog/2023/1_FXHlNrl7QZZh5IyIupEBPQ.webp)

## How to sign Kadena JSON Transactions with Ledger

This feature is intended for intermediate to advanced users. **It enables
sending and receiving safe transfers using your Ledger**, as well as a plethora
of other complicated transactions, **but it does require operating on the “JSON
Transaction” level.** [Chainweaver](https://chainweaver.kadena.network/) may
come in handy for creating these.

The [Kadena Sign with Ledger](https://transfer.chainweb.com/sign-ledger-json)
page allows you to paste a JSON transaction and sign it using your Ledger. This
is *not *the same as blind signing a hash! All details of the transaction will
be displayed on your device.

In Chainweaver you can find your transaction in JSON format in the “Signatures”
page, after expanding “Advanced Details and Signing Data”. The “JSON” tab should
be pre-selected.

![Getting the JSON-encoded transaction from Chainweaver’s signing flow modal](/assets/blog/2023/1_66IM15H2vXMQwBCwugbBPw.webp)

Copy the entire text field starting with {“cmd”:”{\”signers\”: and paste it in
the large text area on the
[Sign with Ledger](https://transfer.chainweb.com/sign-ledger-json.html) tool.

![](/assets/blog/2023/1_nhrhJjJb306GRsVDeciaqQ.webp)

After clicking “Sign with Ledger” you will see all relevant details of this
transaction on your Ledger device. _If you see Error: Nothing to sign! (...) Do
you need to select a different account? then you may be helped by the “Ledger:
Search keys” section of this article._

![Ledger Nano S showing the transfer recipient starting with k:3fbf…](/assets/blog/2023/1_9uS4FS1LIQ4pHFgTm_Ebqw.webp)

**When signing on a Ledger device, you should always check the details of the
transaction carefully.** If everything is in order, click “Confirm” to sign the
transaction. After this, the Transfer Tool should update its interface to show
the transaction signature:

![](/assets/blog/2023/1_OiBsVRB1E0xNkmL9TneP_Q.webp)

The signature from the ledger device is shown in the text field, and you can
copy it easily with the button on the right of the signature. If there are no
more signatures required, you can submit the transaction to the network directly
from the tool.

In certain cases, such as when signing one part of a safe transfer, more
signatures will be required before the transaction can be submitted. In this
case, the interface will look like this:

![](/assets/blog/2023/1_xWVpcQZyowqsPq3WVCZpKA.webp)

The signature will be available to copy as before, but submitting the
transaction will be disabled.

If you used Chainweaver to construct the transaction, you can copy the signature
and paste it in the correct field in Chainweaver under your key in the “External
Signatures” section:

![After the signature is pasted in the 3fbf4e.. field, the JSON signature is updated](/assets/blog/2023/1_oTCvhMqEpY_OyltLXBWeAw.webp)

Chainweaver will validate the signature and, if it is valid, add it to the JSON
transaction. You can then share the transaction JSON with your counterparty, and
they should be able to sign and submit it. If the signature was invalid,
Chainweaver will indicate so near the signature field.

### Ledger: Search Chainweb Keys

Ledger devices support multiple accounts for most cryptocurrencies. The Kadena
Ledger app is no exception, allowing an infinite amount of keys to be derived
and used. **The
[Kadena Search Ledger Keys](https://transfer.chainweb.com/search-ledger-keys.html)
tool allows you to search through your available keys to find a specific key or
a desired prefix.**

The default Ledger key/account that you’d use without customization will usually
be “key zero”, or the first key in the infinite numbered list of keys you can
use.

> \*🤓 **\*How does this work?** These keys are addressed using a
> “[key derivation path](https://blog.ledger.com/understanding-crypto-addresses-and-derivation-paths/#account-model)”.
> In Kadena’s case, this path looks like: 44'/626'/0'/0/0. The 0' in the middle
> of this sequence is the account index, so this path would represent the first
> account you can use, at slot zero. The second account you can use would be
> derived from the path 44'/626'/1'/0/0, and so on. You can use keys in any
> order. The keys are derived from a master secret and cannot be linked to each
> other without knowing the master secret. This derivation path changed with
> this release, but the previous addressing method is still available in Legacy
> mode. Read the section “Multiple Ledger Accounts: New Standard and Legacy
> mode” for more details.

The
[Ledger simple transfer tool](https://transfer.chainweb.com/transfer-ledger-create.html)
was recently updated to add access to multiple Ledger account keys:

![Key 100 on this ledger is k:3fbf4e7ac…](/assets/blog/2023/1_3t-ZSlXZwMFQXC14mi1afQ.webp)

In the image, the user selected key 100 and its address k:3fbf4e7ac… was fetched
from the Ledger and displayed. **Clicking “verify” would show the address on the
Ledger itself, which is a secure way to verify that the address was not tampered
with by the website or any malware.**

The new
[Sign (JSON) with Ledger](https://transfer.chainweb.com/sign-ledger-json.html)
tool also has the same support for multiple accounts, and we have extended
account support in both ledger tools: the previous version “only” supported the
first thousand keys, and now you can use any number.

### What was my key index, again?

In case you forget which key index corresponds to which account, the
[Search Ledger Keys](https://transfer.chainweb.com/search-ledger-keys.html) tool
allows you to search your ledger for a specific key:

![Search in progress for a ledger key 3fbf4e7ac…](/assets/blog/2023/1_Apczttw1SqpMu40eYAURwA.webp)

Under the hood, the tool checks each key starting with 0. Each check can take up
to one second to execute, so it could be a few minutes until the key is found.

![Key found in index (slot) 100](/assets/blog/2023/1_oOJRlP_0qQSG4oGirfe9hw.webp)

In the above example, the tool found this key at index 100. To use this key with
either of the Ledger tools we would input 100 in the “Change Ledger Account
Name” field.

The search tool also supports “Legacy Mode”. If you used the Ledger simple
transfer feature _with a custom account_ in October 2023, you should be able to
find your keys and transact by toggling “Legacy Mode” on. Read the “Multiple
Ledger Accounts: New Standard and Legacy mode” section below for more details
about this change.

### Search for key prefix

The second panel of the
[Search Ledger Keys](https://transfer.chainweb.com/search-ledger-keys.html) tool
allows you to find keys matching a specific prefix (or number of prefixes.)

![Example prefix search for keys starting with a repeated hex number](/assets/blog/2023/1_LAgKEgQRk42iHalbjBZugg.webp)

This can be used to find a key starting with a hexadecimal prefix of your
choosing.

**Disclaimer:** keys with large offsets may not be supported by wallets.

**Stay safe: when validating that you are sending to the right account, it is
important to confirm the entire key. **Checking just the first few characters
may lead to you inadvertently sending funds to a malicious phishing account that
is made to look similar to yours. Phishing attacks are common in blockchain, and
transactions are irreversible.

## Multiple Ledger Accounts: New Standard and Legacy mode

This release changes the transfer tools’ _default_ behavior when accessing
multiple Ledger accounts, but we will still support the previous method for
users who have used this feature already.

> \*🤓**\* What changed?** The previous derivation path structure used was
> _44'/626'/0'/0/123 _(for account 123.) Moving forward we will be standardizing
> on the path 44'/626'/123'/0/0which is in line with the
> [BIP-44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki#user-content-Account)
> and
> [Ledger](https://blog.ledger.com/understanding-crypto-addresses-and-derivation-paths/#account-model)
> recommendations.

If you used the “Change Ledger Account” feature in October 2023, you will be
able to access your account keys using the “Legacy Mode” toggle that is now
found below the “Verify” button:

![Ledger Account Switcher with Legacy Mode turned on](/assets/blog/2023/1_WQM9zfj5nipW4_4mN6m1Zg.webp)

Click on > Not the account you were expecting? to expand the legacy mode panel.

All three Ledger tools on the transfer tools website have been updated to
support both methods.

As always, we are extremely grateful for our community's unwavering support and
feedback, and hope that you are as excited as we are with our new features!
