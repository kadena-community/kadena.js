# Change Log - @kadena/pactjs-cli

## 1.10.1

### Patch Changes

- Updated dependencies [d67b52906]
  - @kadena/pactjs-generator@1.10.1
  - @kadena/client@1.10.1

## 1.10.0

### Patch Changes

- Updated dependencies [016b9dbfc]
  - @kadena/client@1.10.0
  - @kadena/pactjs-generator@1.10.0

## 1.9.0

### Patch Changes

- Updated dependencies [b53c2600c]
- Updated dependencies [6ddf094d8]
- Updated dependencies [6ddf094d8]
- Updated dependencies [be9129381]
  - @kadena/client@1.9.0
  - @kadena/pactjs-generator@1.9.0

## 1.8.1

### Patch Changes

- @kadena/client@1.8.1
- @kadena/pactjs-generator@1.8.1

## 1.8.0

### Patch Changes

- Updated dependencies [3ed72cddf]
- Updated dependencies [0540b213b]
  - @kadena/pactjs-generator@1.8.0
  - @kadena/client@1.8.0

## 1.7.0

### Minor Changes

- 9bec1fb8e: intruduce PactReturnType in order to extract pact functions return
  type

### Patch Changes

- 735aeb38f: Fixed dependency resolution in pactjs-cli
- 74880bb51: Extract networkId and chainId from the api
- Updated dependencies [9bec1fb8e]
- Updated dependencies [735aeb38f]
- Updated dependencies [c126ca38c]
- Updated dependencies [c637a9596]
- Updated dependencies [a3bb20737]
  - @kadena/pactjs-generator@1.7.0
  - @kadena/client@1.7.0

## 1.6.4

### Patch Changes

- 21a0d1530: Fix pactjs-cli to send hash with txs; fixed the issue after
  chainweb-node update
- Updated dependencies [21a0d1530]
  - @kadena/client@1.6.4
  - @kadena/pactjs-generator@1.6.4

## 1.6.3

### Patch Changes

- @kadena/pactjs-generator@1.6.3

## 1.6.1

### Patch Changes

- @kadena/pactjs-generator@1.6.1

## 1.6.0

### Minor Changes

- e62a9505e: add option to store modules parse tree to dist

### Patch Changes

- fa6b84e22: No auto-globals for vitest specs
- Updated dependencies [1d7d88081]
- Updated dependencies [fa6b84e22]
  - @kadena/pactjs-generator@1.6.0

## 1.5.0

### Patch Changes

- 99ce19b47: Fix index.d.ts by using import instead of export since we use
  interface merging for types
- c8bbec395: Fix `types` in package.json
- fec8dfafd: Upgrade `typescript` and `@types/node` dependencies
- Updated dependencies [3873e73c4]
- Updated dependencies [badc7c2a3]
- Updated dependencies [831c022c8]
- Updated dependencies [3e00cf2ac]
- Updated dependencies [99ce19b47]
- Updated dependencies [a664a9535]
- Updated dependencies [d62a23ffe]
- Updated dependencies [fec8dfafd]
- Updated dependencies [a664a9535]
- Updated dependencies [c375cb124]
  - @kadena/pactjs-generator@1.5.0

## 1.4.0

### Patch Changes

- Updated dependencies [5068b099]
- Updated dependencies [143d0bef]
  - @kadena/pactjs-generator@1.4.0

## 1.3.0

### Patch Changes

- e8d0e92a: fix issue where shebang was missing in the executable file
- Updated dependencies [8adef240]
- Updated dependencies [17230731]
- Updated dependencies [242b5687]
- Updated dependencies [17230731]
- Updated dependencies [0afa85d8]
- Updated dependencies [f148002c]
  - @kadena/pactjs-generator@1.3.0

## 1.2.0

### Patch Changes

- @kadena/pactjs-generator@1.2.0

This log was last generated on Fri, 04 Aug 2023 16:10:02 GMT and should not be
manually modified.

## 1.0.0

Fri, 04 Aug 2023 16:10:02 GMT

_Version update only_

## 0.1.5

Mon, 10 Jul 2023 14:25:54 GMT

_Version update only_

## 0.1.4

Mon, 10 Jul 2023 14:20:26 GMT

### Updates

- Consistent fenced code block shell language
- Fix up lint config
- Remove unused dependencies + fix some lint config

## 0.1.3

Tue, 04 Jul 2023 08:27:48 GMT

### Updates

- Add repo-wide markdown formatting
- Complete the formatting trilogy
- Introduce generic package doc headers
- Housekeeping npm-published files
- Replace lint-staged with explicit format script
- Rename master branch to main
- apply new lint rules
- Updated the README.md to have correct example usages

## 0.1.2

Thu, 22 Jun 2023 09:46:33 GMT

### Updates

- disable codecoverage report

## 0.1.1

Tue, 13 Jun 2023 13:17:28 GMT

### Patches

- Update to typescript 5

## 0.1.0

Thu, 01 Jun 2023 20:18:44 GMT

### Minor changes

- Add --contract option to retrieve a contract from the chain

### Patches

- append the export to index.d.ts if it's not already there

### Updates

- Fix usage of `repository` and `npx` in package.json
- use nodejs path util to make path-like strings for cross OS compability

## 0.0.12

Fri, 03 Mar 2023 11:24:59 GMT

_Version update only_

## 0.0.11

Mon, 27 Feb 2023 15:39:44 GMT

_Version update only_

## 0.0.10

Mon, 27 Feb 2023 14:25:39 GMT

_Version update only_

## 0.0.9

Thu, 02 Feb 2023 16:30:09 GMT

_Version update only_

## 0.0.8

Mon, 16 Jan 2023 16:31:08 GMT

### Patches

- Adds option to choose custom interface for caps

### Updates

- change dependency @kadena-dev/eslint-config and @kadena-dev/heft-rig

## 0.0.7

Thu, 15 Dec 2022 14:56:25 GMT

_Version update only_

## 0.0.6

Thu, 01 Dec 2022 09:16:13 GMT

_Version update only_

## 0.0.5

Tue, 29 Nov 2022 16:14:08 GMT

_Version update only_

## 0.0.4

Tue, 01 Nov 2022 11:21:25 GMT

### Updates

- fix published package

## 0.0.2

Fri, 28 Oct 2022 11:53:11 GMT

### Patches

- use .kadena/pactjs-generated to prevent deletion
