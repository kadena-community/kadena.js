# @kadena/graph

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
