# @kadena-dev/scripts

## 0.1.0

### Minor Changes

- bae860a: Adds a script to validate whether changed files are exclusively of a
  specific set

  - **`check-changed-files.sh`** in `packages/tools/scripts/`:
    - A script to validate that changes in a pull request are restricted to
      specific documentation and asset files.
    - The script checks the modified files against a predefined list of allowed
      paths and file types and exits with an error if any disallowed files are
      detected.

  **Purpose:** To support automated approval of pull requests that only modify
  approved documentation or asset files, enhancing the CI/CD workflow
  efficiency.

## 0.0.4

### Patch Changes

- 93bf55b07: Package updates

## 0.0.3

### Patch Changes

- 0d7fbe56a: Fix generate packages json to include new line as the last line.
  This fixes linting errors on build

## 0.0.2

### Patch Changes

- fa6b84e22: No auto-globals for vitest specs

## 0.0.1

### Patch Changes

- fec8dfafd: Upgrade `typescript` and `@types/node` dependencies
