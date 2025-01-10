---
'@kadena/graph': minor
---

BREAKING CHANGES: we've introduced a number of breaking changes to prepare to
transition to kadindexer.io/graphql

Changes and their resolution

## Breaking Changes

### Without alternative

- ✖ Field `Block.target` changed type from `Decimal!` to `String!`
- ✖ Field `Block.weight` changed type from `Decimal!` to `String!`
- ✖ Field `incrementedId` was removed from object type `Event`
- ✖ Field `parameterText` was removed from object type `Event`
- ✖ Type `MinerKey` was removed
- ✖ Type `PositiveFloat` was removed
- ✖ Field `metadata` was removed from object type `TransactionResult`

### With Alternatives

- ✖ Field `Query.fungibleChainAccount` changed type from `FungibleChainAccount`
  to [FungibleChainAccount!]
- ✖ Argument `chainId`: String! was removed from field
  `Query.fungibleChainAccount`
  - `chainId` was replaced by `chainIds: [String!]` with a default value
- ✖ Field `blockHash` was removed from object type `Transfer`
  - can be retrieved via `block.hash`
- ✖ Field `chainId` was removed from object type `Transfer`
  - can be retrieved via `block.chainId`
- ✖ Field `height` was removed from object type `Transfer`
  - can be retrieved via `block.height`

## Improvements

These shouldn't affect how it's being used. We changed the value for

- `chainIds` to include all chains as the default value,
- `fungibleName` to include `coin` as the default value

and represented as such by GraphQL instead of a optional argument with a hidden
default value.

- ⚠ Default value
  `[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19 ]` was
  added to argument `chainIds` on field `Query.blocksFromDepth`
- ⚠ Default value
  `[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19 ]` was
  added to argument `chainIds` on field `Query.blocksFromHeight`
- ⚠ Default value
  `[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19 ]` was
  added to argument `chainIds` on field `Query.completedBlockHeights`
- ⚠ Default value `coin` was added to argument fungibleName on field
  `Query.fungibleAccount`
- ⚠ Argument `chainIds: [String!]!` (with default value) added to field
  `Query.fungibleChainAccount`
- ⚠ Default value `coin` was added to argument fungibleName on field
  `Query.fungibleChainAccount`
- ⚠ Default value
  `[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19 ]` was
  added to argument `chainIds` on field `Subscription.newBlocks`
- ⚠ Default value
  `[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19 ]` was
  added to argument `chainIds` on field `Subscription.newBlocksFromDepth`

## Other Changes

- ✔ Directive oneOf was added
- ✔ Directive deprecated was added to field IGuard.keys
- ✔ Directive deprecated was added to field IGuard.predicate
- ✔ Type for argument chainIds on field Subscription.newBlocksFromDepth changed
  from [String!]! to [String!]
