# @kadena/kadena-cli

## 1.2.0

### Minor Changes

- 8f4897d44: Add pactjs command for generating typescript from pact

### Patch Changes

- Updated dependencies \[6d4e82074]
- Updated dependencies \[3949dcccf]
  - @kadena/client\@1.12.1
  - @kadena/hd-wallet\@0.4.2
  - @kadena/client-utils\@0.8.1
  - @kadena/pactjs-cli\@1.12.1
  - @kadena/pactjs-generator\@1.12.1

## 1.1.2

### Patch Changes

- Updated dependencies \[83c3d58]
  - @kadena/client-utils\@0.8.0

## 1.1.1

### Patch Changes

- Updated dependencies \[9c145f196]
- Updated dependencies \[9c145f196]
  - @kadena/client\@1.12.0
  - @kadena/client-utils\@0.7.0
  - @kadena/pactjs-cli\@1.12.0
  - @kadena/pactjs-generator\@1.12.0

## 1.1.0

### Minor Changes

- e26cc1f21: Updated table generation and json output format to improve account
  information display

- e79c1800e: - Updated "tx send" command to include transaction logging
  functionality. Transactions are now saved in a log file, capturing network
  details, transaction ID, and status.

  - Implemented the tx history command to display a formatted transaction
    history. This command provides a user-friendly way to view detailed
    transaction logs, including network host, network ID, chain ID, status, and
    transaction ID.

- e1c80f695: Rename config path command to config show command Config show
  command to include all commands directory paths and counts of different
  resources like wallets, accounts, networks etc.

- 7e1eb308b: Add empty state warning message for network list command All empty
  state log level to warning for consistency

- 6b940f9ce: Fixed reducing the overall maximum fund amount to 20 and
  dynamically split the max amount per chain when funding multiple chains.

  Fixed sorting of chain ids in the log.

- f385a62fb: Add warning log message when user selects "no" for deploying the
  faucet.

- 9a5d89c74: - Renamed `--type` option to `--from` in the `account add` command.
  - Updated `--type=manual` to `--from=key` for specifying account addition via
    key file or manual entry.
  - Improved descriptions in account from selection prompts for better clarity
    on available options.

### Patch Changes

- c9fe555df: Pin sensitive dependencies to specific versions
- Updated dependencies \[1d1f1dcaf]
- Updated dependencies \[c9fe555df]
- Updated dependencies \[aa1aae60c]
- Updated dependencies \[b916ea42b]
- Updated dependencies \[381a766e8]
- Updated dependencies \[4b8c2bc0e]
  - @kadena/hd-wallet\@0.4.1
  - @kadena/cryptography-utils\@0.4.4
  - @kadena/client-utils\@0.6.0
  - @kadena/pactjs-cli\@1.11.2
  - @kadena/client\@1.11.2
  - @kadena/pactjs-generator\@1.11.2

## 1.0.0

### Major Changes

- 0ea2d14f7: Release v1.0.0

### Minor Changes

- 862e6d909: Add support for funding accounts on devnet

### Patch Changes

- 93bf55b07: Package updates
- Updated dependencies \[0b3018734]
- Updated dependencies \[93bf55b07]
- Updated dependencies \[b3a50b49a]
  - @kadena/hd-wallet\@0.4.0
  - @kadena/cryptography-utils\@0.4.3
  - @kadena/pactjs-generator\@1.11.1
  - @kadena/client-utils\@0.5.4
  - @kadena/pactjs-cli\@1.11.1
  - @kadena/client\@1.11.1
  - @kadena/pactjs\@0.4.3

## 0.2.0

### Minor Changes

- e4b24d905d: Added default network setup
- 990dda2ad0: Added getting a transaction status(tx status) command

### Patch Changes

- Updated dependencies \[3bbfeaaa9]
  - @kadena/client\@1.11.0
  - @kadena/client-utils\@0.5.3
  - @kadena/pactjs-cli\@1.11.0
  - @kadena/pactjs-generator\@1.11.0

## 0.1.2

### Patch Changes

- Updated dependencies \[d67b52906]
  - @kadena/pactjs-generator\@1.10.1
  - @kadena/client\@1.10.1
  - @kadena/pactjs-cli\@1.10.1
  - @kadena/client-utils\@0.5.2

## 0.1.1

### Patch Changes

- Updated dependencies \[016b9dbfc]
  - @kadena/client\@1.10.0
  - @kadena/client-utils\@0.5.1
  - @kadena/pactjs-cli\@1.10.0
  - @kadena/pactjs-generator\@1.10.0

## 0.1.0

### Minor Changes

- b383c722b: Fix account add command for --quiet flag
- 1a326e534: Add scripts to deploy faucet to devnet Add "account fund" command
  to kadena-cli
- caae0f830: Fix account details sub command

### Patch Changes

- e7b64b1f4: exclude unnecessary files from published npm package
- Updated dependencies \[b53c2600c]
- Updated dependencies \[57a734447]
- Updated dependencies \[6ddf094d8]
- Updated dependencies \[6ddf094d8]
- Updated dependencies \[be9129381]
  - @kadena/client\@1.9.0
  - @kadena/client-utils\@0.5.0
  - @kadena/pactjs-generator\@1.9.0
  - @kadena/pactjs-cli\@1.9.0
  - @kadena/cryptography-utils\@0.4.2
  - @kadena/hd-wallet\@0.3.0
  - @kadena/pactjs\@0.4.2

## 0.3.1

### Patch Changes

- @kadena/client\@1.8.1
- @kadena/client-utils\@0.4.1
- @kadena/pactjs-cli\@1.8.1
- @kadena/pactjs-generator\@1.8.1

## 0.3.0

### Minor Changes

- 737f1c914: Update account get details sub command

## 0.2.0

### Minor Changes

- bf09d1161: Feat: "add-manual" and "add-from-wallet" sub command as part of
  account command
- 8ce9095ef: add dapp create command

### Patch Changes

- 9b7efef2a: Add max time option for kadena devnet
- 095aca720: Added kadena devnet simulate command and auxiliary functionalities
- Updated dependencies \[172734c8b]
- Updated dependencies \[1b4e49d96]
  - @kadena/client-utils\@0.4.0

## 0.1.0

### Minor Changes

- 8fca466c7: refactor hd-wallet to use web-crypto api for cross platform
  compatibility

### Patch Changes

- b266703d7: add account commands
- 7b5b93b38: add devnet commands to kadena-cli
- Updated dependencies \[c756c1425]
- Updated dependencies \[64dd84ee0]
- Updated dependencies \[bbeef98a6]
- Updated dependencies \[3ed72cddf]
- Updated dependencies \[8fca466c7]
- Updated dependencies \[0540b213b]
- Updated dependencies \[3fc8ac86d]
- Updated dependencies \[72f472e58]
  - @kadena/hd-wallet\@0.3.0
  - @kadena/client-utils\@0.3.0
  - @kadena/pactjs-generator\@1.8.0
  - @kadena/client\@1.8.0
  - @kadena/pactjs-cli\@1.8.0
