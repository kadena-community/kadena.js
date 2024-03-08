# @kadena/graph-client

## 0.1.13

### Patch Changes

- 6677a71f4: Added Events to Block and removed obsolete fields
- 04468a259: Added parameters filter to events
- 1809e6212: Removed confirmation depth as a block property. Added query and
  subscription for blocks from depth
- 48fc44b5a: Fixed token object
- 01b9ed3e9: Refactored transactions to follow domain model. Adapted
  graph-client to new data format
- f503c33df: Fixed Cont/Exec Payload renaming issue
- 7e50d4949: Replaced SSE with WebSockets for Subscriptions
- Updated dependencies [550e6d9e4]
  - @kadena/react-ui@0.8.2

## 0.1.12

### Patch Changes

- 3abcf01d2: Added Tooltip in cases where columns can be truncated
- Updated dependencies [cce6c38de]
- Updated dependencies [1aa8bfa8d]
  - @kadena/react-ui@0.8.1

## 0.1.11

### Patch Changes

- Updated dependencies [bc5ff9ab1]
- Updated dependencies [52200486f]
- Updated dependencies [817eff027]
- Updated dependencies [5a52cd69b]
- Updated dependencies [eb12b600e]
  - @kadena/react-ui@0.8.0

## 0.1.10

### Patch Changes

- Updated dependencies [b6a44c813]
  - @kadena/react-ui@0.7.1

## 0.1.9

### Patch Changes

- Updated dependencies [940891ac6]
- Updated dependencies [a4b469d49]
- Updated dependencies [803668c21]
- Updated dependencies [3e940f62e]
- Updated dependencies [b8f8fb55e]
- Updated dependencies [bc071367c]
- Updated dependencies [13e2cc6a3]
- Updated dependencies [1ed317352]
- Updated dependencies [fc92629b5]
- Updated dependencies [5516b2467]
- Updated dependencies [0dc7a52b7]
- Updated dependencies [5e63b76a6]
- Updated dependencies [db097d39b]
- Updated dependencies [90227d348]
- Updated dependencies [e10423358]
- Updated dependencies [bd357be45]
- Updated dependencies [47e3ac2a9]
- Updated dependencies [9d3aab7c8]
- Updated dependencies [58ed2adfa]
  - @kadena/react-ui@0.7.0

## 0.1.8

### Patch Changes

- Updated dependencies [5cf64e17c]
- Updated dependencies [269e3bd66]
- Updated dependencies [f2312a16c]
- Updated dependencies [52664959c]
- Updated dependencies [5a71173a8]
- Updated dependencies [6d30efacd]
- Updated dependencies [d1f705b4d]
  - @kadena/react-ui@0.6.0

## 0.1.7

### Patch Changes

- 73bbcbd56: Implemented Pagination component; added possibility of table
  resizing in transfers and implemented logic in order for cross-chain transfers
  to always display in the same line with the correct order (starting /
  finishing transfer)
- a58e0886c: Set second search field when account search; added omitHeader prop
  to header for when 404 not found page is displayed
- f02b991cb: Added Guards to Account page and updated styling; added
  LoaderAndError component
- Updated dependencies [a7bb78d8b]
- Updated dependencies [957af9922]
- Updated dependencies [bf490445c]
- Updated dependencies [854604595]
- Updated dependencies [a30106c85]
- Updated dependencies [5250be30b]
- Updated dependencies [6992a2b58]
- Updated dependencies [d9109f3ba]
- Updated dependencies [4b8b728dd]
  - @kadena/react-ui@0.5.0

## 0.1.6

### Patch Changes

- f4ac431f4: Edited the pages containing transfers to display cross-chain
  transfers as one entry
- Updated dependencies [49d8366c7]
  - @kadena/react-ui@0.4.0

## 0.1.5

### Patch Changes

- 6f79f73dd: Created gas estimation page and ajusted header component to
  incorporate option for gas. Also added necessary graph references to consume
  the endpoint
- Updated dependencies [6f79f73dd]
- Updated dependencies [6f79f73dd]
  - @kadena/react-ui@0.3.1

## 0.1.4

### Patch Changes

- 6e4895050: Added proper error logging for the graph and client
- 39a870cea: Changed queries to adjust to new endpoint for getting graph and
  chainweb-data info
- Updated dependencies [11747cde4]
- Updated dependencies [6491589b5]
- Updated dependencies [8a719c647]
- Updated dependencies [df7044cac]
  - @kadena/react-ui@0.3.0

## 0.1.3

### Patch Changes

- 96e321d8a: Changed the transaction overview page to display signer related
  information
- bcac940f7: Apply formatting to all json's and code in client
- fa6b84e22: No auto-globals for vitest specs
- Updated dependencies [1d7d88081]
- Updated dependencies [fa98adaa8]
- Updated dependencies [fa6b84e22]
  - @kadena/react-ui@0.2.1

## 0.1.2

### Patch Changes

- dc2409e30: Prefill module field and add labels
- c94594f12: Added totalCount to Connections; implemented resizable table and
  pagination in path
- 29d7ada24: Show tx overview in block page and create transactions page; make
  transactions query dynamically assign filters; minor fixes and refactoring
- a95d6b397: Fixed the chain parameter and title attributes
- 9adf6f26d: Added missing links in block overview
- 12e1ee508: Included tx count in block overview
- ac2a67caf: Created Header Component and removed common header from all pages;
  added breadcrumb navigation in all pages
- 9568dff4b: Added fragments for the graph fields and fixed some field names
- ace51d3eb: Added aliases for easy accessibility and better code readability
- ea67704fe: Added account query, chain account query, transactions query,
  transfers query and their pages
- 52f13b9e1: Added block query, confirmation depth query. Implemented block page
  and block transaction page. Performed some adjustments on components to make
  them generic
- fec8dfafd: Upgrade `typescript` and `@types/node` dependencies
- e67d71a68: Implement dynamic select based on input
- Updated dependencies [97f19a48b]
- Updated dependencies [c0e9f781c]
- Updated dependencies [5b8161d66]
- Updated dependencies [3572d7cdd]
- Updated dependencies [badc7c2a3]
- Updated dependencies [831c022c8]
- Updated dependencies [b4547a5ab]
- Updated dependencies [b51b86507]
- Updated dependencies [8374fc752]
- Updated dependencies [a664a9535]
- Updated dependencies [27a0996a0]
- Updated dependencies [66981b4f2]
- Updated dependencies [6cf0c27e5]
- Updated dependencies [cf3b8aa86]
- Updated dependencies [f31e96dbf]
- Updated dependencies [c371666c4]
- Updated dependencies [fec8dfafd]
- Updated dependencies [aae405956]
- Updated dependencies [659fff8c5]
- Updated dependencies [80c680d2c]
- Updated dependencies [251e5165c]
- Updated dependencies [a664a9535]
- Updated dependencies [c375cb124]
- Updated dependencies [49a9956fa]
  - @kadena/react-ui@0.2.0

## 0.1.1

### Patch Changes

- Updated dependencies [e8780f4c]
- Updated dependencies [8adef240]
- Updated dependencies [17230731]
- Updated dependencies [9ef42410]
- Updated dependencies [a0bdef5c]
- Updated dependencies [242b5687]
- Updated dependencies [14b81501]
- Updated dependencies [3e53006e]
  - @kadena/react-ui@0.1.0
