# Change Log - @kadena-dev/eslint-config

## 1.0.0

### Major Changes

- 242b5687: Separate linting (ESLint) and formatting (Prettier)

  Adds `eslint-config-prettier` and removes `eslint-plugin-prettier`. The
  formatting that Prettier did is removed (also in `--fix` runs). Apply
  formatting separately using Prettier (`--write` or `--check`).

### Minor Changes

- a3f144f3: Implements the ESLint rule consistent-type-imports into our codebase
  and updates the currently existing imports/exports.

### Patch Changes

- Updated dependencies [242b5687]
- Updated dependencies [4d525832]
  - @kadena-dev/eslint-plugin@0.0.6

This log was last generated on Fri, 04 Aug 2023 16:10:02 GMT and should not be
manually modified.

## 0.1.0

Fri, 04 Aug 2023 16:10:02 GMT

### Minor changes

- Move sort-package-json to eslint plugin

### Patches

- formatting and linting

## 0.0.10

Mon, 10 Jul 2023 14:25:54 GMT

_Version update only_

## 0.0.9

Mon, 10 Jul 2023 14:20:26 GMT

### Patches

- Fix reusability and dependencies of eslint packages

## 0.0.8

Tue, 04 Jul 2023 08:27:48 GMT

### Patches

- add new lint rules

## 0.0.7

Thu, 22 Jun 2023 09:46:33 GMT

### Patches

- remove next/core-web-vitals otherwise it doesn't work
- turnoff typedef-var lint rule for next projects
- Fixate TS version to v5.0.4
- remove the unnecessary proptypes rule from eslint config

## 0.0.6

Tue, 13 Jun 2023 13:17:28 GMT

### Patches

- Update to typescript 5

## 0.0.5

Thu, 01 Jun 2023 20:18:44 GMT

### Patches

- Updated React profile to detect react version

## 0.0.4

Fri, 03 Mar 2023 11:24:59 GMT

### Patches

- Sort aliases from tsconfig like internal packages
- Updated @kadena-dev/eslint-plugin react config extension to the config
  recommended by Next.js

## 0.0.3

Mon, 27 Feb 2023 15:39:44 GMT

### Patches

- fix dependencies on @kadena-dev/eslint-plugin

## 0.0.2

Mon, 27 Feb 2023 14:25:39 GMT

### Patches

- Move eslint-plugins from devDependencies to dependencies so consuming projects
  do not need to include them
- Disables @rushstack/typedev-var and adds @kadena-dev/typedev-var to the react
  config
- adds rule to disallow file wide eslint-disable
- add mixin to relax typedef rule for arguments in typed functions

## 0.0.1

Mon, 16 Jan 2023 16:31:08 GMT

_Initial release_
