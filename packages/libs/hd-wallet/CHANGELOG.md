# @kadena/hd-wallet

## 0.6.0

### Minor Changes

- 90a5684: Add support for buffer in kadenaChangePassword

## 0.5.0

### Minor Changes

- 84d9130: Export entropy to mnemonic function
- b1e488c: Export utility functions for legacy chainweaver:
  `legacyKadenaChangePassword` and `legacyKadenaGenKeypair`

### Patch Changes

- 84d9130: convert lagacy kadena-crypto to esm; this will fix rollup build

## 0.4.2

### Patch Changes

- 3949dcccf: Add getting started to the readme

## 0.4.1

### Patch Changes

- 1d1f1dcaf: Expose api doc
- c9fe555df: Pin sensitive dependencies to specific versions
- b916ea42b: Verify that the derivation path template includes `<index>`
- 4b8c2bc0e: Separated test config for Chainweaver to avoid long timeout for all
  newly developed functions.
- Updated dependencies \[c9fe555df]
  - @kadena/cryptography-utils\@0.4.4

## 0.4.0

### Minor Changes

- 0b3018734: Fixed bug in chainweaver signing

### Patch Changes

- 93bf55b07: Package updates
- Updated dependencies \[93bf55b07]
  - @kadena/cryptography-utils\@0.4.3

## 0.3.0

### Minor Changes

- c756c1425: Removed dependency to @kadena/client and refactor sign functions to
  sign hash
- 8fca466c7: refactor hd-wallet to use web-crypto api for cross platform
  compatibility

## 0.2.0

### Minor Changes

- c637a9596: Resolved the issue with Ikeypair type with two different signatures

### Patch Changes

- Updated dependencies \[9bec1fb8e]
- Updated dependencies \[c126ca38c]
- Updated dependencies \[c637a9596]
- Updated dependencies \[a3bb20737]
  - @kadena/client\@1.7.0
  - @kadena/cryptography-utils\@0.4.2

## 0.1.0

### Minor Changes

- 427772991: Add functions to support SLIP-0010 key derivation

### Patch Changes

- Updated dependencies \[21a0d1530]
  - @kadena/client\@1.6.4
