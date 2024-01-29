# @kadena/graph

## 0.1.1

### Patch Changes

- 9bf1a73cd: Initial release
- 9cd6d072f: Added documentation on the cross-chain transfer lookup; the
  reasoning behind the current method
- Updated dependencies [64dd84ee0]
- Updated dependencies [bbeef98a6]
- Updated dependencies [0540b213b]
- Updated dependencies [3fc8ac86d]
- Updated dependencies [72f472e58]
  - @kadena/client-utils@0.3.0
  - @kadena/client@1.8.0

## 1.0.7

### Patch Changes

- 4afeb196d: refactor create principal
- c2b60a1a1: Added descriptions to objects, fields and queries
- ca1834ecb: Complexity calculations and limitations added
- Updated dependencies [9bec1fb8e]
- Updated dependencies [4afeb196d]
- Updated dependencies [c126ca38c]
- Updated dependencies [c637a9596]
- Updated dependencies [34e193c77]
- Updated dependencies [70c126a32]
- Updated dependencies [15c203ee5]
- Updated dependencies [a3bb20737]
  - @kadena/client@1.7.0
  - @kadena/client-utils@0.2.0
  - @kadena/chainweb-node-client@0.5.2
  - @kadena/cryptography-utils@0.4.2
  - @kadena/pactjs@0.4.2

## 1.0.6

### Patch Changes

- 2dec0d4cd: Improved naming convention of Reconcile object
- 73bbcbd56: Made edges non-nullable
- 0f598d10e: Added chain id to transactions filter on block object; changed
  default value for maximum confirmation depth
- ad00ec0b2: Added reconcile view for chainweb data
- 858f52a2e: hotfix for reconcile
- d1f6f99fc: Refactor objects, queries and subscriptions to use the same
  function type definition, to use the same argument naming conventions and
  object casting; also added totalCount resolvers to all prismaConnection
  fields; added errors to simulation log file
- bccf4333a: Added multi-sig accounts support in simulation
- 49e5c55ae: Added tracing and trace analyser
- Updated dependencies [21a0d1530]
  - @kadena/client@1.6.4

## 1.0.5

### Patch Changes

- f4ac431f4: Included cross-chain transfers in transfer object
- 66338bfa0: Enabled option for different gas payers in simulation
- d58bce7ef: acount and chainAccount now implement the Node type, meaning that
  they can be used in the node and nodes queries. Besides this, several
  optimizations with async data retrieval.
- 0a36ed900: Fix simulate script edge case (when it attempts cross-chain
  transfers to the same chain). Add build step in start:generate script
- Updated dependencies [4bd53128d]
  - @kadena/client@1.6.3

## 1.0.4

### Patch Changes

- 6f79f73dd: Added gas estimation query and adjusted folder structure for devnet
  files

## 1.0.3

### Patch Changes

- 2e18fe50c: Added query to get transactions by public key
- 39a870cea: Added endpoint for graph and chainweb-data general info
- aced46632: Updated simulate command to now incorporate safe-transfers
- 6e4895050: Added proper error logging for the graph and client
- 9de5d550c: Added PactData as optional argument to PactQueries
- Updated dependencies [445fb2c7d]
  - @kadena/client@1.6.1

## 1.0.2

### Patch Changes

- 18a8f5574: Added pactQuery and pactQueries for arbitrary PACT code execution
- b348a6899: Added signer object and signer fields on transactions (graph)
- fa6b84e22: No auto-globals for vitest specs
- Updated dependencies [1d7d88081]
- Updated dependencies [d15a6231f]
- Updated dependencies [fa6b84e22]
  - @kadena/chainweb-node-client@0.5.1
  - @kadena/cryptography-utils@0.4.1
  - @kadena/client@1.6.0
  - @kadena/pactjs@0.4.1

## 1.0.1

### Patch Changes

- c94594f12: Added totalCount to Connections; implemented resizable table and
  pagination in path
- 29d7ada24: Show tx overview in block page and create transactions page; make
  transactions query dynamically assign filters; minor fixes and refactoring
- c8bbec395: Fix `types` in package.json
- 42651dd76: Updated the README file
- 9568dff4b: Added fragments for the graph fields and fixed some field names
- ea67704fe: Added account query, chain account query, transactions query,
  transfers query and their pages
- 52f13b9e1: Added block query, confirmation depth query. Implemented block page
  and block transaction page. Performed some adjustments on components to make
  them generic
- 5d705a14f: Added relation between transaction and transfer; applied some logic
  in transaction column code: it now returns 'cont' when null
- fec8dfafd: Upgrade `typescript` and `@types/node` dependencies
- 8b579d89f: Change default timeout for simulation
- Updated dependencies [badc7c2a3]
- Updated dependencies [831c022c8]
- Updated dependencies [2a0e92cd1]
- Updated dependencies [3e00cf2ac]
- Updated dependencies [c8bbec395]
- Updated dependencies [b51b86507]
- Updated dependencies [a664a9535]
- Updated dependencies [69eec056f]
- Updated dependencies [c143687bd]
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
  - @kadena/pactjs@0.4.0
