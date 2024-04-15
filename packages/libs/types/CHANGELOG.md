# Change Log - @kadena/types

## 0.6.1

### Patch Changes

- 6ddf094d8: Add Record<string,any> to PactValue type

## 0.6.0

### Minor Changes

- c637a9596: Resolved the issue with Ikeypair type with two different signatures
- 15c203ee5: improve client utils returns type

## 0.5.1

### Patch Changes

- fa6b84e22: No auto-globals for vitest specs

## 0.5.0

### Minor Changes

- d62a23ffe: Generate provenance statement during npm publish

### Patch Changes

- c8bbec395: Fix `types` in package.json
- fec8dfafd: Upgrade `typescript` and `@types/node` dependencies

This log was last generated on Mon, 21 Aug 2023 10:31:32 GMT and should not be
manually modified.

## 0.4.2

Mon, 21 Aug 2023 10:31:32 GMT

### Patches

- removed the PactReference in favor of Literal class

## 0.4.1

Fri, 04 Aug 2023 16:10:02 GMT

### Patches

- formatting and linting
- rename PactGuard ro PactReference to be more general

## 0.4.0

Fri, 14 Jul 2023 10:02:16 GMT

### Minor changes

- Remove `chainId: ''` added PactGuard

## 0.3.5

Mon, 10 Jul 2023 14:25:54 GMT

_Version update only_

## 0.3.4

Mon, 10 Jul 2023 14:20:26 GMT

_Version update only_

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

- Changed `ICommand` to not accept undefined sig, added `IUnsignedCommand`

## 0.1.2

Fri, 03 Mar 2023 11:24:59 GMT

_Version update only_

## 0.1.1

Mon, 27 Feb 2023 15:39:44 GMT

_Version update only_

## 0.1.0

Mon, 27 Feb 2023 14:25:39 GMT

### Minor changes

- add null type to IUnsignedTransaction sig

### Patches

- adds SigningRequest type and createSigningRequest for use in the sign endpoint
  of the Signing API

## 0.0.3

Fri, 09 Dec 2022 12:07:57 GMT

### Patches

- remove only-allow pnpm

## 0.0.2

Fri, 28 Oct 2022 11:53:11 GMT

### Patches

- Added absolute url's and repositories for npm
