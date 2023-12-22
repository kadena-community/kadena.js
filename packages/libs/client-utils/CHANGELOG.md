# @kadena/client-utils

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
- Updated dependencies [9bec1fb8e]
- Updated dependencies [c126ca38c]
- Updated dependencies [c637a9596]
- Updated dependencies [15c203ee5]
- Updated dependencies [a3bb20737]
  - @kadena/client@1.7.0
  - @kadena/types@0.6.0
  - @kadena/chainweb-node-client@0.5.2
  - @kadena/cryptography-utils@0.4.2

## 0.1.0

### Minor Changes

- a4ccd823a: Adding gasEstimate function + export commandCreator functions

### Patch Changes

- f37318e9d: Small fixes regarding yaml to kadena client transactions
- 86e4927d3: Added YAML template to Pact Command converter
- Updated dependencies [21a0d1530]
  - @kadena/client@1.6.4

## 0.0.5

### Patch Changes

- Updated dependencies [4bd53128d]
  - @kadena/client@1.6.3

## 0.0.4

### Patch Changes

- 7a0b62119: change the sign event that happens for continuation transaction
  from "sign" to "sign-continuation"
- 445fb2c7d: Fix pred type for keysets
- Updated dependencies [445fb2c7d]
  - @kadena/client@1.6.1

## 0.0.3

### Patch Changes

- fa6b84e22: No auto-globals for vitest specs
- Updated dependencies [1d7d88081]
- Updated dependencies [d15a6231f]
- Updated dependencies [fa6b84e22]
  - @kadena/chainweb-node-client@0.5.1
  - @kadena/cryptography-utils@0.4.1
  - @kadena/client@1.6.0
  - @kadena/types@0.5.1

## 0.0.2

### Patch Changes

- Updated dependencies [badc7c2a3]
- Updated dependencies [831c022c8]
- Updated dependencies [2a0e92cd1]
- Updated dependencies [c8bbec395]
- Updated dependencies [b51b86507]
- Updated dependencies [a664a9535]
- Updated dependencies [69eec056f]
- Updated dependencies [591bf035e]
- Updated dependencies [d62a23ffe]
- Updated dependencies [fec8dfafd]
- Updated dependencies [eede6962f]
- Updated dependencies [699e73b51]
- Updated dependencies [7e5bfb25f]
- Updated dependencies [a664a9535]
- Updated dependencies [f6c52c340]
- Updated dependencies [c375cb124]
- Updated dependencies [f1259eafa]
  - @kadena/chainweb-node-client@0.5.0
  - @kadena/cryptography-utils@0.4.0
  - @kadena/client@1.5.0
  - @kadena/types@0.5.0
