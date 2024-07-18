# @kadena/client-utils

## 0.9.0

### Minor Changes

- 29168e2: Added safeTransferCreate to use transfer create for safe transfer +
  fixed issue with `from` in pipelines

### Patch Changes

- 07c0a26: Adds CodeSandbox example with link in the readme
- Updated dependencies \[29168e2]
- Updated dependencies \[29168e2]
- Updated dependencies \[29168e2]
  - @kadena/client\@1.13.0
  - @kadena/chainweb-node-client\@0.6.3
  - @kadena/types\@0.7.0
  - @kadena/pactjs-cli\@1.13.0
  - @kadena/cryptography-utils\@0.4.4
  - @kadena/pactjs\@0.4.3

## 0.8.1

### Patch Changes

- Updated dependencies \[6d4e82074]
  - @kadena/client\@1.12.1
  - @kadena/pactjs-cli\@1.12.1

## 0.8.0

### Minor Changes

- 83c3d58: Add support for Marmalade utility functions

## 0.7.0

### Minor Changes

- 9c145f196: Add support for public key scheme

### Patch Changes

- Updated dependencies \[9c145f196]
  - @kadena/client\@1.12.0
  - @kadena/pactjs-cli\@1.12.0

## 0.6.0

### Minor Changes

- aa1aae60c: Added `listModules` function to `client-utils`

### Patch Changes

- c9fe555df: Pin sensitive dependencies to specific versions
- 381a766e8: Added marmalade functions and correspondent integration testing
- Updated dependencies \[c9fe555df]
- Updated dependencies \[9c4145cb7]
  - @kadena/cryptography-utils\@0.4.4
  - @kadena/pactjs-cli\@1.11.2
  - @kadena/client\@1.11.2
  - @kadena/chainweb-node-client\@0.6.2

## 0.5.4

### Patch Changes

- 93bf55b07: Package updates
- Updated dependencies \[93bf55b07]
  - @kadena/chainweb-node-client\@0.6.1
  - @kadena/cryptography-utils\@0.4.3
  - @kadena/pactjs-cli\@1.11.1
  - @kadena/client\@1.11.1
  - @kadena/pactjs\@0.4.3
  - @kadena/types\@0.6.2

## 0.5.3

### Patch Changes

- Updated dependencies \[3bbfeaaa9]
  - @kadena/chainweb-node-client\@0.6.0
  - @kadena/client\@1.11.0
  - @kadena/pactjs-cli\@1.11.0

## 0.5.2

### Patch Changes

- Updated dependencies \[d67b52906]
  - @kadena/client\@1.10.1
  - @kadena/pactjs-cli\@1.10.1

## 0.5.1

### Patch Changes

- Updated dependencies \[016b9dbfc]
  - @kadena/client\@1.10.0
  - @kadena/pactjs-cli\@1.10.0

## 0.5.0

### Minor Changes

- 57a734447: Introducing accountDiscovery and queryAllChainsClient

### Patch Changes

- 6ddf094d8: Add Record\<string,any> to PactValue type
- Updated dependencies \[b53c2600c]
- Updated dependencies \[6ddf094d8]
- Updated dependencies \[6ddf094d8]
  - @kadena/client\@1.9.0
  - @kadena/types\@0.6.1
  - @kadena/pactjs-cli\@1.9.0
  - @kadena/chainweb-node-client\@0.5.3
  - @kadena/cryptography-utils\@0.4.2
  - @kadena/pactjs\@0.4.2

## 0.4.1

### Patch Changes

- Updated dependencies \[5b1d8334e]
  - @kadena/chainweb-node-client\@0.5.3
  - @kadena/client\@1.8.1
  - @kadena/pactjs-cli\@1.8.1

## 0.4.0

### Minor Changes

- 1b4e49d96: introduce `from` function that allows start a process from a
  specific event

### Patch Changes

- 172734c8b: enable the utility function 'describeModule' to be used in other
  packages

## 0.3.0

### Minor Changes

- bbeef98a6: added createPactCommandFromStringTemplate method
- 3fc8ac86d: add utility function for built-in Pact function 'describe-module'
- 72f472e58: Add safeTransfer which requires both sender and receiver to sign

### Patch Changes

- 64dd84ee0: Changed the return type for getBalance to string.
- Updated dependencies \[0540b213b]
  - @kadena/client\@1.8.0
  - @kadena/pactjs-cli\@1.8.0

## 0.2.0

### Minor Changes

- 4afeb196d: refactor create principal
- 34e193c77: Introduce `executeTo` which executes the process until the specific
  event is fired then it returns the result of that and pauses the process until
  you call it again.
- 15c203ee5: improve client utils returns type

### Patch Changes

- 9bec1fb8e: intruduce PactReturnType in order to extract pact functions return
  type
- 70c126a32: Fixed minor issue in yaml converter related to an aditional data
  field in IPactCommand.
- a3bb20737: let users pass Literal or ()=>string as function inputs to cover
  more advanced usecases.
- Updated dependencies \[9bec1fb8e]
- Updated dependencies \[c126ca38c]
- Updated dependencies \[c637a9596]
- Updated dependencies \[15c203ee5]
- Updated dependencies \[a3bb20737]
  - @kadena/client\@1.7.0
  - @kadena/types\@0.6.0
  - @kadena/chainweb-node-client\@0.5.2
  - @kadena/cryptography-utils\@0.4.2

## 0.1.0

### Minor Changes

- a4ccd823a: Adding gasEstimate function + export commandCreator functions

### Patch Changes

- f37318e9d: Small fixes regarding yaml to kadena client transactions
- 86e4927d3: Added YAML template to Pact Command converter
- Updated dependencies \[21a0d1530]
  - @kadena/client\@1.6.4

## 0.0.5

### Patch Changes

- Updated dependencies \[4bd53128d]
  - @kadena/client\@1.6.3

## 0.0.4

### Patch Changes

- 7a0b62119: change the sign event that happens for continuation transaction
  from "sign" to "sign-continuation"
- 445fb2c7d: Fix pred type for keysets
- Updated dependencies \[445fb2c7d]
  - @kadena/client\@1.6.1

## 0.0.3

### Patch Changes

- fa6b84e22: No auto-globals for vitest specs
- Updated dependencies \[1d7d88081]
- Updated dependencies \[d15a6231f]
- Updated dependencies \[fa6b84e22]
  - @kadena/chainweb-node-client\@0.5.1
  - @kadena/cryptography-utils\@0.4.1
  - @kadena/client\@1.6.0
  - @kadena/types\@0.5.1

## 0.0.2

### Patch Changes

- Updated dependencies \[badc7c2a3]
- Updated dependencies \[831c022c8]
- Updated dependencies \[2a0e92cd1]
- Updated dependencies \[c8bbec395]
- Updated dependencies \[b51b86507]
- Updated dependencies \[a664a9535]
- Updated dependencies \[69eec056f]
- Updated dependencies \[591bf035e]
- Updated dependencies \[d62a23ffe]
- Updated dependencies \[fec8dfafd]
- Updated dependencies \[eede6962f]
- Updated dependencies \[699e73b51]
- Updated dependencies \[7e5bfb25f]
- Updated dependencies \[a664a9535]
- Updated dependencies \[f6c52c340]
- Updated dependencies \[c375cb124]
- Updated dependencies \[f1259eafa]
  - @kadena/chainweb-node-client\@0.5.0
  - @kadena/cryptography-utils\@0.4.0
  - @kadena/client\@1.5.0
  - @kadena/types\@0.5.0
