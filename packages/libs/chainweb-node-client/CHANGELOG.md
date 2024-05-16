# Change Log - @kadena/chainweb-node-client

## 0.6.1

### Patch Changes

- 93bf55b07: Package updates
- Updated dependencies \[93bf55b07]
  - @kadena/cryptography-utils\@0.4.3
  - @kadena/pactjs\@0.4.3

## 0.6.0

### Minor Changes

- 3bbfeaaa9: added support for confirmationDepth in client added `pollOne` as an
  alternative to `listen` that uses `/poll` endpoint

## 0.5.3

### Patch Changes

- 5b1d8334e: delete all console.errors from chainweb-node-client functions

## 0.5.1

### Patch Changes

- fa6b84e22: No auto-globals for vitest specs
- Updated dependencies \[1d7d88081]
- Updated dependencies \[fa6b84e22]
  - @kadena/cryptography-utils\@0.4.1
  - @kadena/pactjs\@0.4.1

## 0.5.0

### Minor Changes

- d62a23ffe: Generate provenance statement during npm publish

### Patch Changes

- c8bbec395: Fix `types` in package.json
- fec8dfafd: Upgrade `typescript` and `@types/node` dependencies
- Updated dependencies \[badc7c2a3]
- Updated dependencies \[831c022c8]
- Updated dependencies \[3e00cf2ac]
- Updated dependencies \[c8bbec395]
- Updated dependencies \[b51b86507]
- Updated dependencies \[a664a9535]
- Updated dependencies \[c143687bd]
- Updated dependencies \[d62a23ffe]
- Updated dependencies \[fec8dfafd]
- Updated dependencies \[eede6962f]
- Updated dependencies \[699e73b51]
- Updated dependencies \[a664a9535]
- Updated dependencies \[c375cb124]
  - @kadena/cryptography-utils\@0.4.0
  - @kadena/pactjs\@0.4.0

This log was last generated on Mon, 21 Aug 2023 10:31:32 GMT and should not be
manually modified.

## 0.4.4

Mon, 21 Aug 2023 10:31:32 GMT

_Version update only_

## 0.4.3

Fri, 04 Aug 2023 16:10:02 GMT

### Patches

- formatting and linting

## 0.4.2

Fri, 14 Jul 2023 10:02:16 GMT

### Patches

- Simplified types for the `/local` wrapper

## 0.4.1

Mon, 10 Jul 2023 14:25:54 GMT

_Version update only_

## 0.4.0

Mon, 10 Jul 2023 14:20:26 GMT

### Minor changes

- Updated Chain ID type to be usable during runtime as well

## 0.3.3

Tue, 04 Jul 2023 08:27:48 GMT

_Version update only_

## 0.3.2

Thu, 22 Jun 2023 09:46:33 GMT

_Version update only_

## 0.3.1

Tue, 13 Jun 2023 13:17:28 GMT

### Patches

- Update to typescript 5

## 0.3.0

Thu, 01 Jun 2023 20:18:44 GMT

### Minor changes

- Add localWithoutSignatureVerification, changed local to use preflight=true as
  default

## 0.1.4

Fri, 03 Mar 2023 11:24:59 GMT

_Version update only_

## 0.1.3

Mon, 27 Feb 2023 15:39:44 GMT

_Version update only_

## 0.1.2

Mon, 27 Feb 2023 14:25:39 GMT

### Patches

- update ISignature to non-null

## 0.1.1

Fri, 09 Dec 2022 12:07:57 GMT

### Patches

- remove only-allow pnpm

## 0.1.0

Tue, 29 Nov 2022 16:14:08 GMT

### Minor changes

- BREAKING: Removed wrapper `pact`. Exports functions directly

## 0.0.4

Fri, 28 Oct 2022 11:53:11 GMT

### Patches

- version bump
- updated Readme
- Added absolute url's and repositories for npm
