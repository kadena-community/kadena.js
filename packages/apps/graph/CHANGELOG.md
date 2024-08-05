# @kadena/graph

## 1.0.8

### Patch Changes

- 1707e63: Improve performance by memoizing networkInfo result in graph every 30
  seconds. Skipping in explorer when there's an error. Added block info to
  row-block component on main page
- e8ce4b4: Fix performance issue when retrieving transactions by sender
- b089abf: Fix issues with performance of Graph queries on
  fungibleAccount.transfers

## 1.0.7

### Patch Changes

- Updated dependencies \[29168e2]
- Updated dependencies \[07c0a26]
- Updated dependencies \[29168e2]
- Updated dependencies \[29168e2]
  - @kadena/client\@1.13.0
  - @kadena/client-utils\@0.9.0
  - @kadena/chainweb-node-client\@0.6.3
  - @kadena/cryptography-utils\@0.4.4
  - @kadena/pactjs\@0.4.3

## 1.0.6

### Patch Changes

- 0e9c0d049: Fixed issue with completed heights query
- 950444ccf: Implement logic to handle difficulty calculations when there are
  orphan blocks
- Updated dependencies \[6d4e82074]
  - @kadena/client\@1.12.1
  - @kadena/client-utils\@0.8.1

## 1.0.5

### Patch Changes

- 1bbf1c6: Added minHeight and maxHeight arguments to transactions and events
- Updated dependencies \[83c3d58]
  - @kadena/client-utils\@0.8.0

## 1.0.4

### Patch Changes

- Updated dependencies \[9c145f196]
- Updated dependencies \[9c145f196]
  - @kadena/client\@1.12.0
  - @kadena/client-utils\@0.7.0

## 1.0.3

### Patch Changes

- e5f85728a: Data Render Component, Transactions List and hash tab routing done.
  Including mobile support.
- 5a9d2de5e: Fixed transaction subscription issue with mempool and completed
  transactions
- c9fe555df: Pin sensitive dependencies to specific versions
- 7e19fd3f3: Added neighbor info to blocks and phased out CHAIN_COUNT and
  NETWORK_ID env vars.
- f4a18faa8: Fixed issue when finding cross chain transfer when original
  transfer is the starting one
- 30217ff8e: Added validations to ensure that we do not yield same events on
  subscriptions
- 4a5045c52: Added endHeight as an argument for blocksFromHeight query. Also
  added aditional validation on arguments
- Updated dependencies \[c9fe555df]
- Updated dependencies \[aa1aae60c]
- Updated dependencies \[9c4145cb7]
- Updated dependencies \[381a766e8]
  - @kadena/cryptography-utils\@0.4.4
  - @kadena/client-utils\@0.6.0
  - @kadena/client\@1.11.2
  - @kadena/chainweb-node-client\@0.6.2

## 1.0.2

### Patch Changes

- 8d7e1340a: Package updates
- 93bf55b07: Package updates
- bf87b3303: Alter reconcile view amount fields to decimals
- ee9cde449: Fixed all ESLint warnings
- 7555a4ddc: Implement difficulty property in block
- 1cd747fdd: Refactor button component to match new styles and replace component
  throughout the mono repo
- 51dc20fe0: Added network info endpoint and auxiliary service and data object
- 37375fa7e: Implement account and chain account by public key queries;
- Updated dependencies \[93bf55b07]
  - @kadena/chainweb-node-client\@0.6.1
  - @kadena/cryptography-utils\@0.4.3
  - @kadena/client-utils\@0.5.4
  - @kadena/client\@1.11.1
  - @kadena/pactjs\@0.4.3

## 1.0.1

### Patch Changes

- 2ff01d300: Optimize events subscription; minor fix in documentation

## 1.0.0

### Major Changes

- f09f02356: Release version 1.0.0

### Patch Changes

- 427957e46: Change non-id field types to strings instead of id's
- 2efb4332e: Add timeouts in pact queries and implement pact query response
  object
- 77dddd8b0: Optimize fetching of latest id for events
- 0e1d37089: Fixed network config retrieval running before system checks
- 4eb925ccc: Added retry mechanism for chainweb-node calls; added environmental
  variables to support this functionality
- 920c38344: Fix auxiliary queries in readme.md
- 9810956fb: Fixed incorrect IDs in schema

## 0.1.14

### Patch Changes

- d82fbd97d: Fix network id and api version on mempool connection test

## 0.1.13

### Patch Changes

- fe324038b: Rerelease with all files

## 0.1.12

### Patch Changes

- 2bac09b5e: Implemented confirmation depth verification for blocks in queries
  and subscriptions
- 8f7b1221c: Small fixes for marmamalde simulation
- 89412c156d: Fixed gas limit estimations returning 2500 on failed transactions
- 2a7d0978ee: Removed the account by public key queries
- 3373d6397e: Removed single transfer and event queries due to ineffective
  primary key usage
- 0e5cceacc9: Made fungible name non-required for fungible account queries;
  created default value
- e44ac6fdc: Changed non-fungible account query to accomodate all transactions
  made with marmalade-v2
- fa2cce1cb: Renamed Token and TokenInfo to NonFungibleTokenBalance and
  NonFungibleToken accordingly
- f83bdeac1: Added documentation on in-built graphql server
- 96c7b98341: Improved Schema documentation for events and gas limit
  estimations. And made it easier to query for a transaction.
- 6514f74a5f: Fix transaction on events object; regenerate schema
- 7d1dbdd25: Improved functional documentation, added some query examples
- b3af5a40e: Added Guard to non fungible chain accounts
- 1ebfb0a52: Adjust transactions signatures/signers to domain model
- 3b2e0fe7c: Added input validation to queries and subscriptions
- fc1308be85: Removed duplicate queries
- 96e8c2556: Expand non-fungible account transaction search to all marmalade
  related transactions - v1 and v2
- 6c2ec7fa9: Change default values in dotenv and fix github token default value
- ffb089144: Restore nested querying
- fcdcf99f4: Add minimum depth argument in transaction queries
- a605cc1a6: Added documentation on non-fungible transaction; fixed marmalade
  simulation create-token-id method; implemented dynamic assignment of
  apiVersion instead of hardcoded
- b7c5ca5789: Refactored transactions to include mempool data; refactored all
  objects with relation to transactions
- 077c7c1e6: Add minimum depth parameter on events query and subscription
- Updated dependencies \[3bbfeaaa9]
  - @kadena/chainweb-node-client\@0.6.0
  - @kadena/client\@1.11.0
  - @kadena/client-utils\@0.5.3

## 0.1.11

### Patch Changes

- d5e63d759: Removed obsolete totalCount on some queries and made all array
  return values connections
- 66938ac8f: Updated the README
- 8c8d70d60: Fix typo in transfers object, transaction field\\
- 61ef8bc03: Do not return one object by default on subcriptions if it's not new

## 0.1.10

### Patch Changes

- Updated dependencies \[d67b52906]
  - @kadena/client\@1.10.1
  - @kadena/client-utils\@0.5.2

## 0.1.9

### Patch Changes

- Updated dependencies \[016b9dbfc]
  - @kadena/client\@1.10.0
  - @kadena/client-utils\@0.5.1

## 0.1.8

### Patch Changes

- a5acd8581: Naming consistency and chainId as stringList
- 339ac3155: Added more filter options to the events query and subscription
- b571a8445: Create database index for qualname on events; adjusted the events
  query
- 2c1228774: Add fungible account by public key and chain fungible account by
  public key queries
- 727191dc9: Added system status checker
- 21dfce774: Improved gas limit estimation with support for more types of input
- 6677a71f4: Added Events to Block and removed obsolete fields
- 8716b6b72: Changed the way object relations are handled. Instead of performing
  multiple queries we use prisma's relation to select the object
- ea63873ba: fix an issue where retrieval of marmalade-v2.ledger.get-token-info
  results in invalid json for `policies` removed `policies` for now.
- b9b7eaa13: Fetch network id from /info instead of getting it fron environment
  variables
- cb969a4d7: Optimize the use of Data Loaders for non-fungible account and chain
  accounts
- 1809e6212: Removed confirmation depth as a block property. Added query and
  subscription for blocks from depth
- 01b9ed3e9: Refactored transactions to follow domain model. Adapted
  graph-client to new data format
- 7e50d4949: Replaced SSE with WebSockets for Subscriptions
- Updated dependencies \[b53c2600c]
- Updated dependencies \[57a734447]
- Updated dependencies \[6ddf094d8]
- Updated dependencies \[6ddf094d8]
  - @kadena/client\@1.9.0
  - @kadena/client-utils\@0.5.0
  - @kadena/chainweb-node-client\@0.5.3
  - @kadena/cryptography-utils\@0.4.2
  - @kadena/pactjs\@0.4.2

## 0.1.7

### Patch Changes

- 357a29456: Created TokenInfo and added object to Token

## 0.1.6

### Patch Changes

- 85b8911fc: Added flood command in readme and changed fungible and non-fungible
  chain account queries file names
- 889956dad: Remove coin related data from non-fungible account

## 0.1.5

### Patch Changes

- Updated dependencies \[5b1d8334e]
  - @kadena/chainweb-node-client\@0.5.3
  - @kadena/client\@1.8.1
  - @kadena/client-utils\@0.4.1

## 0.1.4

### Patch Changes

- 5d5b91918: use `creationTime` next to `id` to get recent blocks

## 0.1.3

### Patch Changes

- ae6b98387: only write schema when `NODE_END=development`

## 0.1.2

### Patch Changes

- 6a4153b1b: Alter migrations to support the correct format for devnet. Also
  removed unnecessary indexes.
- 5f89df506: Change default value for branch
- e6e252cd9: Implement flood functionality
- Updated dependencies \[172734c8b]
- Updated dependencies \[1b4e49d96]
  - @kadena/client-utils\@0.4.0

## 0.1.1

### Patch Changes

- 9bf1a73cd: Initial release
- 9cd6d072f: Added documentation on the cross-chain transfer lookup; the
  reasoning behind the current method
- Updated dependencies \[64dd84ee0]
- Updated dependencies \[bbeef98a6]
- Updated dependencies \[0540b213b]
- Updated dependencies \[3fc8ac86d]
- Updated dependencies \[72f472e58]
  - @kadena/client-utils\@0.3.0
  - @kadena/client\@1.8.0

## 1.0.7

### Patch Changes

- 4afeb196d: refactor create principal
- c2b60a1a1: Added descriptions to objects, fields and queries
- ca1834ecb: Complexity calculations and limitations added
- Updated dependencies \[9bec1fb8e]
- Updated dependencies \[4afeb196d]
- Updated dependencies \[c126ca38c]
- Updated dependencies \[c637a9596]
- Updated dependencies \[34e193c77]
- Updated dependencies \[70c126a32]
- Updated dependencies \[15c203ee5]
- Updated dependencies \[a3bb20737]
  - @kadena/client\@1.7.0
  - @kadena/client-utils\@0.2.0
  - @kadena/chainweb-node-client\@0.5.2
  - @kadena/cryptography-utils\@0.4.2
  - @kadena/pactjs\@0.4.2

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
- Updated dependencies \[21a0d1530]
  - @kadena/client\@1.6.4

## 1.0.5

### Patch Changes

- f4ac431f4: Included cross-chain transfers in transfer object
- 66338bfa0: Enabled option for different gas payers in simulation
- d58bce7ef: acount and chainAccount now implement the Node type, meaning that
  they can be used in the node and nodes queries. Besides this, several
  optimizations with async data retrieval.
- 0a36ed900: Fix simulate script edge case (when it attempts cross-chain
  transfers to the same chain). Add build step in start:generate script
- Updated dependencies \[4bd53128d]
  - @kadena/client\@1.6.3

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
- Updated dependencies \[445fb2c7d]
  - @kadena/client\@1.6.1

## 1.0.2

### Patch Changes

- 18a8f5574: Added pactQuery and pactQueries for arbitrary PACT code execution
- b348a6899: Added signer object and signer fields on transactions (graph)
- fa6b84e22: No auto-globals for vitest specs
- Updated dependencies \[1d7d88081]
- Updated dependencies \[d15a6231f]
- Updated dependencies \[fa6b84e22]
  - @kadena/chainweb-node-client\@0.5.1
  - @kadena/cryptography-utils\@0.4.1
  - @kadena/client\@1.6.0
  - @kadena/pactjs\@0.4.1

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
- Updated dependencies \[badc7c2a3]
- Updated dependencies \[831c022c8]
- Updated dependencies \[2a0e92cd1]
- Updated dependencies \[3e00cf2ac]
- Updated dependencies \[c8bbec395]
- Updated dependencies \[b51b86507]
- Updated dependencies \[a664a9535]
- Updated dependencies \[69eec056f]
- Updated dependencies \[c143687bd]
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
  - @kadena/pactjs\@0.4.0
