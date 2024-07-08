# Change Log - @kadena/client

## 1.12.1

### Patch Changes

- 6d4e82074: Deprecated wallet function names (`createSignWithX`) to provide a
  clearer naming scheme.

  The following functions have been deprecated:

  - `createWalletConnectSign` -> `createSignWithWalletConnect`
  - `createWalletConnectQuicksign` -> `createQuicksignWithWalletConnect`
  - `createEckoWalletSign` -> `createSignWithEckoWallet`
  - `createEckoWalletQuicksign` -> `createQuicksignWithEckoWallet`

## 1.12.0

### Minor Changes

- 9c145f196: Export ISigner interface

## 1.11.2

### Patch Changes

- c9fe555df: Pin sensitive dependencies to specific versions
- Updated dependencies \[c9fe555df]
- Updated dependencies \[9c4145cb7]
  - @kadena/cryptography-utils\@0.4.4
  - @kadena/chainweb-node-client\@0.6.2

## 1.11.1

### Patch Changes

- 93bf55b07: Package updates
- Updated dependencies \[93bf55b07]
  - @kadena/chainweb-node-client\@0.6.1
  - @kadena/cryptography-utils\@0.4.3
  - @kadena/pactjs\@0.4.3

## 1.11.0

### Minor Changes

- 3bbfeaaa9: added support for confirmationDepth in client added `pollOne` as an
  alternative to `listen` that uses `/poll` endpoint

### Patch Changes

- Updated dependencies \[3bbfeaaa9]
  - @kadena/chainweb-node-client\@0.6.0

## 1.10.1

### Patch Changes

- d67b52906: Fixed IParsedCode interface

## 1.10.0

### Minor Changes

- 016b9dbfc: Added support for verifiers in @kadena/client

## 1.9.0

### Minor Changes

- b53c2600c: Add WebAuthn as a valid scheme for signers

### Patch Changes

- 6ddf094d8: Fix parse objects and arrays to pact values
- 6ddf094d8: Add Record\<string,any> to PactValue type
  - @kadena/chainweb-node-client\@0.5.3
  - @kadena/cryptography-utils\@0.4.2
  - @kadena/pactjs\@0.4.2

## 1.8.1

### Patch Changes

- Updated dependencies \[5b1d8334e]
  - @kadena/chainweb-node-client\@0.5.3

## 1.8.0

### Minor Changes

- 0540b213b: Adds support for a custom url to signWithChainweaver

## 1.7.0

### Minor Changes

- 9bec1fb8e: intruduce PactReturnType in order to extract pact functions return
  type
- c126ca38c: Extract capability type from pure string pact code
- c637a9596: Resolved the issue with Ikeypair type with two different signatures

### Patch Changes

- a3bb20737: let users pass Literal or ()=>string as function inputs to cover
  more advanced usecases.
  - @kadena/chainweb-node-client\@0.5.2
  - @kadena/cryptography-utils\@0.4.2
  - @kadena/pactjs\@0.4.2

## 1.6.4

### Patch Changes

- 21a0d1530: Fix pactjs-cli to send hash with txs; fixed the issue after
  chainweb-node update

## 1.6.3

### Patch Changes

- 4bd53128d: Fix createEckoWalletQuicksign to work with updated interface

## 1.6.1

### Patch Changes

- 445fb2c7d: Fix pred type for keysets

## 1.6.0

### Patch Changes

- fa6b84e22: No auto-globals for vitest specs
- Updated dependencies \[1d7d88081]
- Updated dependencies \[d15a6231f]
- Updated dependencies \[fa6b84e22]
  - @kadena/chainweb-node-client\@0.5.1
  - @kadena/cryptography-utils\@0.4.1
  - @kadena/pactjs\@0.4.1

## 1.5.0

### Minor Changes

- d62a23ffe: Generate provenance statement during npm publish

### Patch Changes

- 69eec056f: Fix the issue with continuation to ensure that the proof is a
  string before utilizing string methods.
- fec8dfafd: Upgrade `typescript` and `@types/node` dependencies
- f6c52c340: Expose two new functions:
  - `getHostUrl` to use with `@kadena/client-utils` package
  - `submitOne` to make piping easier. As the piped arguments can be ambiguous
    (array or single transaction)
- f1259eafa: Migrate packages from Jest to Vitest
- Updated dependencies \[badc7c2a3]
- Updated dependencies \[831c022c8]
- Updated dependencies \[2a0e92cd1]
- Updated dependencies \[3e00cf2ac]
- Updated dependencies \[c8bbec395]
- Updated dependencies \[b51b86507]
- Updated dependencies \[a664a9535]
- Updated dependencies \[c143687bd]
- Updated dependencies \[591bf035e]
- Updated dependencies \[d62a23ffe]
- Updated dependencies \[fec8dfafd]
- Updated dependencies \[eede6962f]
- Updated dependencies \[699e73b51]
- Updated dependencies \[7e5bfb25f]
- Updated dependencies \[a664a9535]
- Updated dependencies \[c375cb124]
  - @kadena/chainweb-node-client\@0.5.0
  - @kadena/cryptography-utils\@0.4.0
  - @kadena/pactjs\@0.4.0

## 1.4.0

### Minor Changes

- f6ff5749: Add feature to allow signing with keypair:

  ```ts
  const signWithKeystore = createSignWithKeypair([keyPair, keyPair2]);
  const [signedTx1, signedTx2] = await signWithKeystore([tx1, tx2]);
  const signedTx3 = await signWithKeystore(tx3);
  ```

## 1.3.0

### Minor Changes

- 17230731: Adds signWithEckoWallet and quicksignWithEckoWallet

### Patch Changes

- Updated dependencies \[8adef240]
- Updated dependencies \[242b5687]
- Updated dependencies \[664140f3]
  - @kadena/chainweb-node-client\@0.4.4
  - @kadena/cryptography-utils\@0.3.8
  - @kadena/pactjs\@0.3.2

## 1.2.0

### Minor Changes

- b8b866145: Add `createEckoWalletSign()` and `createEckoWalletQuicksign()`.
  This creates a wrapper for the [eckoWALLET API][1]

This log was last generated on Mon, 21 Aug 2023 10:31:32 GMT and should not be
manually modified.

## 1.1.0

Mon, 21 Aug 2023 10:31:32 GMT

### Minor changes

- Make addSignatures public

### Updates

- throw error for duplicated keys while using addData
- Literal class for handeling literal values during pact expression creation

## 1.0.0

Fri, 04 Aug 2023 16:10:02 GMT

### Updates

- Make the API more flexible by splitting it into three steps - build
  transactions | signing and | submitting
- Accepts multiple code in one transactions
- Refactoring types and suggest all related capabilities of the functions
- exposing sighWithChainWeaver and SignWithWalletConnect
- deprecating `poll` and `send`
- introducing `submit` `pollStatus` `dirtyRead` `preflight`
  `signatureVerification` `runPact`

## 0.6.1

Mon, 10 Jul 2023 14:25:54 GMT

_Version update only_

## 0.6.0

Mon, 10 Jul 2023 14:20:26 GMT

### Minor changes

- Implemented new Chain ID type from @kadena/chainweb-node-client
- PactCommand's `pollUntil` now rejects with the result of the request instead
  of the instance of the PactCommand class

### Updates

- small docs changes
- Consistent fenced code block shell language
- Improve accessibility of the `@kadena/client` readme
- Remove unused dependencies + fix some lint config

## 0.5.0

Tue, 04 Jul 2023 08:27:48 GMT

### Minor changes

- Adds signWithWalletConnect and quicksignWithWalletConnect

### Patches

- added /spv to the apiHost in cont command

### Updates

- Add repo-wide markdown formatting
- Complete the formatting trilogy
- Introduce generic package doc headers
- Housekeeping npm-published files
- Replace lint-staged with explicit format script
- Rename master branch to main
- apply new lint rules

## 0.4.0

Thu, 22 Jun 2023 09:46:33 GMT

### Minor changes

- Creation of ContCommand class to enable cont type commands

### Patches

- small fix regarding stringified proof in cont command

### Updates

- Added encoding library to support the cross-fetch library

## 0.3.1

Tue, 13 Jun 2023 13:17:28 GMT

### Patches

- Set this.nonce to the created nonce to make it publicly available
- Update to typescript 5

## 0.3.0

Thu, 01 Jun 2023 20:18:44 GMT

### Minor changes

- Add localWithoutSignatureVerification function in command builder
- Adds `setNonceCreator()` to allow the user to set a custom nonce

### Patches

- Fix type for addCap, add requestKey to IPactCommand

### Updates

- Fix usage of `repository` and `npx` in package.json
- Removed localWithoutSignatureVerification

## 0.1.10

Fri, 03 Mar 2023 11:24:59 GMT

_Version update only_

## 0.1.9

Mon, 27 Feb 2023 15:39:44 GMT

_Version update only_

## 0.1.8

Mon, 27 Feb 2023 14:25:39 GMT

### Patches

- Expose requestKey on PactCommand
- update /quickSign to /quicksign in client/signWithChainweaver
- Update with KIP 0015 signing api standard

### Updates

- Updates docs on using PactCommand

## 0.1.7

Thu, 02 Feb 2023 16:30:09 GMT

### Patches

- BREAKING: Pact.modules functions will accept for numbers only IPactDecimal or
  IPactInteger

## 0.1.6

Thu, 02 Feb 2023 11:57:26 GMT

### Patches

- Do not convert js typeof 'number' to decimals

### Updates

- change dependency @kadena-dev/eslint-config and @kadena-dev/heft-rig

## 0.1.5

Wed, 21 Dec 2022 12:17:18 GMT

### Patches

- Renames `callPollUntilTimeout` to `pollUntil`. Adds an onCall callback to
  `pollUntil` which gets called after each poll

## 0.1.4

Mon, 19 Dec 2022 13:39:19 GMT

### Patches

- Fix callPollUntilTimeout to not catch when an empty object is returned from
  /poll

## 0.1.3

Mon, 19 Dec 2022 12:54:50 GMT

### Patches

- Added (postinstall) helpers to make retrieving and generating contracts
  easier.
- Added a `callPollUntilTimeout` function which calls the /poll endpoint until
  the transaction is successful or the request times out

## 0.1.2

Thu, 15 Dec 2022 14:56:25 GMT

### Patches

- When proprerties of a non-malleable transaction change, remove `cmd`, `hash`
  and `signatures` from the transaction to issue a recalculation of the `cmd`
  and `hash`.

## 0.1.1

Fri, 09 Dec 2022 12:07:57 GMT

### Updates

- Updated docs

## 0.1.0

Tue, 29 Nov 2022 16:14:08 GMT

### Minor changes

- BREAKING: Removes `createTransaction`, replaced by `createCommand`.
- Adds `send` and `addSignatures` to CommandBuilder.
- Adds `local` and `poll` to CommandBuilder.

## 0.0.5

Wed, 02 Nov 2022 12:29:53 GMT

### Patches

- fix signWithChainweaver
- use ChainwebNetworkId for networkId

## 0.0.4

Tue, 01 Nov 2022 11:21:25 GMT

### Patches

- fix wrong response type signWithChainweaver

## 0.0.3

Fri, 28 Oct 2022 11:53:11 GMT

### Patches

- Updated readme
- use .kadena/pactjs-generated to prevent deletion

### Updates

- Adds launch-post

[1]: https://docs.ecko.finance/eckodex/getting-started/eckowallet/eckowallet-api
