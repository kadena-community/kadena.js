# Change Log - @kadena/client

This log was last generated on Fri, 04 Aug 2023 16:10:02 GMT and should not be manually modified.

## 1.0.0
Fri, 04 Aug 2023 16:10:02 GMT

### Updates

- prepare for final release of 1.0.0
- Edit `@kadena/client` docs (fix links + improve readability)
- Move sort-package-json to eslint plugin
- Fix devDep for client
- add jsdoc to client methods
- Upgrade to new API
- export commandBuilder for configure it with initial data
- formatting and linting
- submit returns single requestKey for one single input + export literal and readKeyset utils
- fixed readKeyset
- Rename createPactCommand to composePactCommand.
- Remove the wrapper payload.execution and payload.continuation.
- fix typo in `createClient().dirtyReady` to `createClient().dirtyRead`
- Improve API for ISignFunction where the input matches the output. A single transaction returns a single signed transaction and respectively for an array
- Fix links in client readme
- Apply formatting
- Remove format:pkg everywhere
- update pact parser to parse symbols as string
- remove ms from the time string
- refactored composePactCommand to a more functional way and fixed issues with setMeta
- refactore the client's utilities in order to return or accept requestObject { requestKey, chainId, networkId }
- renamed getClient to createClient

## 0.6.1
Mon, 10 Jul 2023 14:25:54 GMT

_Version update only_

## 0.6.0
Mon, 10 Jul 2023 14:20:26 GMT

### Minor changes

- Implemented new Chain ID type from @kadena/chainweb-node-client
- PactCommand's `pollUntil` now rejects with the result of the request instead of the instance of the PactCommand class

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

- BREAKING: Pact.modules functions will accept for numbers only IPactDecimal or IPactInteger

## 0.1.6
Thu, 02 Feb 2023 11:57:26 GMT

### Patches

- Do not convert js typeof 'number' to decimals

### Updates

- change dependency @kadena-dev/eslint-config and @kadena-dev/heft-rig

## 0.1.5
Wed, 21 Dec 2022 12:17:18 GMT

### Patches

- Renames `callPollUntilTimeout` to `pollUntil`. Adds an onCall callback to `pollUntil` which gets called after each poll

## 0.1.4
Mon, 19 Dec 2022 13:39:19 GMT

### Patches

- Fix callPollUntilTimeout to not catch when an empty object is returned from /poll

## 0.1.3
Mon, 19 Dec 2022 12:54:50 GMT

### Patches

- Added (postinstall) helpers to make retrieving and generating contracts easier.
- Added a `callPollUntilTimeout` function which calls the /poll endpoint until the transaction is successful or the request times out

## 0.1.2
Thu, 15 Dec 2022 14:56:25 GMT

### Patches

- When proprerties of a non-malleable transaction change, remove `cmd`, `hash` and `signatures` from the transaction to issue a recalculation of the `cmd` and `hash`.

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

