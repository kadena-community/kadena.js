# Change Log - @kadena/pactjs-generator

## 1.12.1

## 1.12.0

## 1.11.2

## 1.11.1

### Patch Changes

- 93bf55b07: Package updates
- b3a50b49a: fix the build issue by removing prebuild script since we dont need
  it anymore

## 1.11.0

## 1.10.1

### Patch Changes

- d67b52906: Fixed IParsedCode interface

## 1.10.0

## 1.9.0

### Minor Changes

- be9129381: export execCodeParser in order to parse code peroperty of
  transactions

## 1.8.1

## 1.8.0

### Minor Changes

- 3ed72cddf: Add events to the parse tree

## 1.7.0

### Minor Changes

- 9bec1fb8e: intruduce PactReturnType in order to extract pact functions return
  type
- a3bb20737: let users pass Literal or ()=>string as function inputs to cover
  more advanced usecases.

### Patch Changes

- 735aeb38f: Fixed dependency resolution in pactjs-cli

## 1.6.4

## 1.6.3

## 1.6.1

## 1.6.0

### Patch Changes

- fa6b84e22: No auto-globals for vitest specs

## 1.5.0

### Minor Changes

- d62a23ffe: Generate provenance statement during npm publish

### Patch Changes

- 3873e73c4: Fix no namesapce issue for used modules
- 99ce19b47: Fix index.d.ts by using import instead of export since we use
  interface merging for types
- fec8dfafd: Upgrade `typescript` and `@types/node` dependencies

## 1.4.0

### Patch Changes

- 5068b099: Update the pact-grammar to support a list as a valid function's
  return type.
- 143d0bef: Fix the name collision between the arguments of capabilities in the
  generated type

## 1.3.0

### Patch Changes

- f148002c: Accept power "^" as a valid operator

## 1.2.0

This log was last generated on Fri, 04 Aug 2023 16:10:02 GMT and should not be
manually modified.

## 1.0.0

Fri, 04 Aug 2023 16:10:02 GMT

### Updates

- Use ICap from @kadena/types instead of ICapabilityItem

## 0.1.13

Mon, 10 Jul 2023 14:25:54 GMT

_Version update only_

## 0.1.12

Mon, 10 Jul 2023 14:20:26 GMT

### Updates

- small changes in readme
- Remove unused dependencies + fix some lint config

## 0.1.11

Tue, 04 Jul 2023 08:27:48 GMT

### Updates

- Add repo-wide markdown formatting
- Complete the formatting trilogy
- Introduce generic package doc headers
- Housekeeping npm-published files
- Replace lint-staged with explicit format script
- Rename master branch to main
- apply new lint rules

## 0.1.10

Thu, 22 Jun 2023 09:46:33 GMT

_Version update only_

## 0.1.9

Tue, 13 Jun 2023 13:17:28 GMT

### Patches

- Update to typescript 5
- Use Jest snapshot to assert generated file

### Updates

- Skip create-kadena-app tests in Windows/Git Bash

## 0.1.8

Thu, 01 Jun 2023 20:18:44 GMT

### Patches

- Set the namespace for each module
- fixing the issue regards "rush install" and "rush build" on windows

### Updates

- Fix usage of `repository` and `npx` in package.json

## 0.1.7

Fri, 03 Mar 2023 11:24:59 GMT

_Version update only_

## 0.1.6

Mon, 27 Feb 2023 15:39:44 GMT

_Version update only_

## 0.1.5

Mon, 27 Feb 2023 14:25:39 GMT

_Version update only_

## 0.1.4

Thu, 02 Feb 2023 16:30:09 GMT

### Patches

- BREAKING: Pact.modules functions will accept for numbers only IPactDecimal or
  IPactInteger

## 0.1.3

Mon, 16 Jan 2023 16:31:08 GMT

### Patches

- Merge generated types for capabilities across modules

### Updates

- change dependency @kadena-dev/eslint-config and @kadena-dev/heft-rig

## 0.1.2

Thu, 15 Dec 2022 14:56:25 GMT

### Patches

- fix issue where modules did not contain namespace

## 0.1.1

Thu, 01 Dec 2022 09:16:13 GMT

### Patches

- fix issue where dashes in smart contract caused invalid typings

## 0.1.0

Tue, 29 Nov 2022 16:14:08 GMT

### Minor changes

- Adds `IPactCommand` to module functions.

## 0.0.2

Fri, 28 Oct 2022 11:53:11 GMT

### Patches

- Updated readme for release
