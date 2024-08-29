# @kadena/explorer

## 0.8.0

### Minor Changes

- 013a55a: filter event chains also in range (ex: 1-5)
- 41bd12c: add filter functionality for events

### Patch Changes

- Updated dependencies \[de4fb13]
  - @kadena/kode-icons\@0.2.0
  - @kadena/kode-ui\@0.14.3

## 0.7.0

### Minor Changes

- fb12a2e: style the transition page
- 9afb0c5: add ability to finish the crosschain transfer
- e57350b: style the block hash page
- 2dbe962: show an indicator icon if transaction is crosschain

### Patch Changes

- Updated dependencies \[8121019]
- Updated dependencies \[a5db08b]
  - @kadena/kode-ui\@0.14.2

## 0.6.0

### Minor Changes

- 50c4cd5: fixing the caching of the home page block table
- eb17e31: add functionality and styling of accountpage

### Patch Changes

- f2eaf1a: several minor IOS styling fixes
- Updated dependencies \[c5c1605]
- Updated dependencies \[27ecc26]
  - @kadena/graph\@1.0.9
  - @kadena/kode-ui\@0.14.1
  - @kadena/kode-icons\@0.1.0

## 0.5.0

### Minor Changes

- b6d9e96: add pagination to tables
- 618c170: add google analytics
- d51494a: refactor the search
- 382369d: Set a retry when network does not work
- 98e503c: search component functionality and styling
- e6ffb90: add posibility to remove networks
- 4151182: add toasts for error messages
- d1ebdcf: add more graph queries to the graphql dialog

### Patch Changes

- e47459e: add tests for hooks
- c638c95: refactor routing to use the network.slug instead of network.networkId
- 453476a: fix the account tabs links
- 515830f: improve the network redirect on index
- 09a692c: fix when the network slug is testnet04 or mainnet01 it does not
  redirect to mainnet (we were testing on slug.startsWith, so when the slug was
  mainnet01, it found slug: mainnet) and crashed
- 1707e63: Improve performance by memoizing networkInfo result in graph every 30
  seconds. Skipping in explorer when there's an error. Added block info to
  row-block component on main page
- b0b6236: fix the reroute when network does not exist
- 52c211c: add google analytics events for multiple actions
- 3bd5cb5: remove skeleton loader when account transactions fails to load
- d693227: refactor from snake-case to camel-case for maintainability
- 167d965: fix editting networks
- 539ff08: remove balance from account search result
- 0450bf3: fix transparency of the header
- Updated dependencies \[1707e63]
- Updated dependencies \[bc52918]
- Updated dependencies \[e8ce4b4]
- Updated dependencies \[df12c9a]
- Updated dependencies \[85d84e7]
- Updated dependencies \[b089abf]
  - @kadena/graph\@1.0.8
  - @kadena/kode-ui\@0.14.0

## 0.4.0

### Minor Changes

- 1ec7c85: add loading skeletons
- c00ae03: show block info when the block height is clicked on homepage

### Patch Changes

- c1c84d2: Added minHeight to the layout to prevent flickering across the page
- 371cf07: update the footer functionality
- 5d34a15: Minor improvements to the graphql modal
  - @kadena/graph\@1.0.7
  - @kadena/kode-icons\@0.1.0
  - @kadena/kode-ui\@0.13.0

## 0.3.0

### Minor Changes

- d5de83869: Rename 'react-ui' to 'kode-ui'
- 563fb6cad: Rename react-icons to kode-icons

### Patch Changes

- Updated dependencies \[d5de83869]
- Updated dependencies \[563fb6cad]
  - @kadena/kode-icons\@0.1.0
  - @kadena/kode-ui\@0.13.0

## 0.2.3

### Patch Changes

- e8a47ead1: QoL improvements for truncated messages. Each page has a decent
  title
- 779b599a5: Implemented small ui fixes in the explorer
- ebd7fcfa4: Added rerouting to different instances when network toogle is
  selected
- f8afbbaa7: Refactored logic to deal with blocks fetched on startup
- cb0f14f3f: Update readme with some adition info
- 555892d55: Added graph in local .env variables describing graph host url's
- Updated dependencies \[df0a2e823]
- Updated dependencies \[311d0bf44]
- Updated dependencies \[0e9c0d049]
- Updated dependencies \[950444ccf]
  - @kadena/kode-ui\@0.12.2
  - @kadena/graph\@1.0.6

## 0.2.2

### Patch Changes

- Updated dependencies \[16f0b17ed]
- Updated dependencies \[4dc02eec8]
- Updated dependencies \[db77beba0]
- Updated dependencies \[c0a6ffde5]
- Updated dependencies \[7ee91269f]
- Updated dependencies \[5b95decb2]
- Updated dependencies \[6d9900ef8]
  - @kadena/kode-ui\@0.12.1

## 0.2.1

### Patch Changes

- ed626de: Added graph in local .env variables describing graph host url's
- Updated dependencies \[1bbf1c6]
- Updated dependencies \[63bdbcb]
- Updated dependencies \[15a492c]
  - @kadena/graph\@1.0.5
  - @kadena/kode-ui\@0.12.0

## 0.2.0

### Minor Changes

- d5286c2f0: add the navbar to the layout

### Patch Changes

- bf2ac3987: fix of styling in the transaction page
- 51e34b300: Added queries used by main search
- Updated dependencies \[6a969ebdc]
- Updated dependencies \[b541021f4]
- Updated dependencies \[e648c32fa]
  - @kadena/kode-ui\@0.11.0
  - @kadena/graph\@1.0.4

## 0.1.0

### Minor Changes

- 872a0f199: add the account page

### Patch Changes

- 9231982a1: Implemented statistics, search and logo components and necessary
  logic
- e5f85728a: Data Render Component, Transactions List and hash tab routing done.
  Including mobile support.
- 2a172928f: added transaction/\[requestKey] page
- ca4fbfae2: Add Media for SSR
- Updated dependencies \[020be02d7]
- Updated dependencies \[9d7545ae0]
- Updated dependencies \[f045afe82]
- Updated dependencies \[e5f85728a]
- Updated dependencies \[5a9d2de5e]
- Updated dependencies \[dac1b28ca]
- Updated dependencies \[3805b414e]
- Updated dependencies \[c9fe555df]
- Updated dependencies \[8e2a29721]
- Updated dependencies \[cfb7c5bab]
- Updated dependencies \[864329d3e]
- Updated dependencies \[076f0980f]
- Updated dependencies \[9cb50ea42]
- Updated dependencies \[7e19fd3f3]
- Updated dependencies \[f4a18faa8]
- Updated dependencies \[30217ff8e]
- Updated dependencies \[49fb38853]
- Updated dependencies \[a415d7995]
- Updated dependencies \[07ec9691c]
- Updated dependencies \[4a5045c52]
- Updated dependencies \[b0b05ca86]
  - @kadena/kode-ui\@0.10.0
  - @kadena/graph\@1.0.3

## 0.0.2

### Patch Changes

- 60ce919f5: K:Explorer - initial commit
- 863943da8: Added block and transaction queries, subscriptions and fragments
- 0afd02c65: Added the Activity Graph Component
- 625db2c97: Block Activity Graph added
- Updated dependencies \[b06929dcc]
- Updated dependencies \[8d7e1340a]
- Updated dependencies \[f3b72d63d]
- Updated dependencies \[93bf55b07]
- Updated dependencies \[bf87b3303]
- Updated dependencies \[07c2e666c]
- Updated dependencies \[ee9cde449]
- Updated dependencies \[2be7eaedc]
- Updated dependencies \[eafc7b0b1]
- Updated dependencies \[7555a4ddc]
- Updated dependencies \[1cd747fdd]
- Updated dependencies \[134666df3]
- Updated dependencies \[9865ea759]
- Updated dependencies \[51dc20fe0]
- Updated dependencies \[145268647]
- Updated dependencies \[5cf752eed]
- Updated dependencies \[0d18ab81c]
- Updated dependencies \[37375fa7e]
  - @kadena/kode-ui\@0.9.0
  - @kadena/graph\@1.0.2
  - @kadena/kode-icons\@0.0.3
