---
'@kadena/graph': minor
---

We're introduced a number of **deprecations** to prepare to transition to
kadindexer.io/graphql

Changes and their resolution

## Changes without Alternative

```log
 ✖ Field Block.target changed type from Decimal! to String!
 ✖ Field Block.weight changed type from Decimal! to String!
```

These changes shouldn't impact anyone too much, as they're mostly internal

## Changes with a Resolution

```log
 ✖ Field incrementedId was removed from object type Event
```

We've removed this field, `Event.orderIndex` can be used to order events

## Other modifications

```log
 ✖ Type MinerKey was removed
```

We've simplified the schema by using `FungibleAccount` instead of `MinerKey`.

### Guards

We've removed the `Guard` type and replaced it with `IGuard` to allow for more
flexibility in the future. We also added `KeysetGuard` to represent the old
`Guard` type.

The `IGuard` type is a union of all the different types of guards that can be
used in a Pact.

Currently implemented guards are `KeysetGuard` and `UserGuard`.

The `IGuard` has a field `raw` which can be used to retrieve any guard as a raw
JSON object.

They can be queried as such:

```graphql
guard {
  raw
  __typename
  ... on KeysetGuard {
    keys
    predicate
  }
  ... on UserGuard {
    fun
    args
  }
}
```

```log
 ✖ Field FungibleChainAccount.guard changed type from Guard! to IGuard!
 ✖ Type Guard was removed
 ✖ Field NonFungibleTokenBalance.guard changed type from Guard! to IGuard!
 ✔ Description A guard. Has values `keys`, `predicate` to provide backwards
  compatibility for `KeysetGuard`. on type IGuard has changed to A guard. This
  is a union of all the different types of guards that can be used in a pact.
 ✔ Deprecation reason on field IGuard.keys has changed from Use
  `... on KeysetGuard { keys predicate }` instead when working with Keysets to
  deprecated, use KeysetGuard.keys
 ✔ Directive deprecated was added to field IGuard.keys
 ✔ Deprecation reason on field IGuard.predicate has changed from Use
  `... on KeysetGuard { keys predicate }` instead when working with Keysets to
  deprecated, use KeysetGuard.predicate
 ✔ Directive deprecated was added to field IGuard.predicate
 ✔ Type RawGuard was added
 ✔ Type KeysetGuard was added
 ✔ Type UserGuard was added
```

### Default values

We've added default values for arguments to a number of fields to make it easier
to query the graph.

```log
 ⚠ Default value [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
  17, 18, 19 ] was added to argument chainIds on field Query.blocksFromDepth
 ⚠ Default value [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
  17, 18, 19 ] was added to argument chainIds on field Query.blocksFromHeight
 ⚠ Default value [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
  17, 18, 19 ] was added to argument chainIds on field
  Query.completedBlockHeights
 ⚠ Default value coin was added to argument fungibleName on field
  Query.fungibleAccount
 ⚠ Default value coin was added to argument fungibleName on field
  Query.fungibleChainAccount
 ⚠ Default value [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
  17, 18, 19 ] was added to argument chainIds on field Subscription.newBlocks
 ⚠ Default value [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
  17, 18, 19 ] was added to argument chainIds on field
  Subscription.newBlocksFromDepth
```

### Query.fungibleChainAccounts

We've introduced a new field `Query.fungibleChainAccounts(chainIds: [String])`
to allow for querying multiple fungible chain accounts across chains.

```
 ✔ Field fungibleChainAccounts was added to object type Query
 ✔ Type for argument chainIds on field Subscription.newBlocksFromDepth changed
  from [String!]! to [String!]
```

### Deprecations and removals

Various types had `height` and `chainId` which should've been retrieved from
`Block`. We're planning to remove these fields and added deprecations.

```log
 ✖ Type PositiveFloat was removed
 ✔ Field TransactionResult.height is deprecated
 ✔ Field TransactionResult.height has deprecation reason Use `block.height`
  instead.
 ✔ Directive deprecated was added to field TransactionResult.height
 ✔ Field TransactionResult.metadata is deprecated
 ✔ Field TransactionResult.metadata has deprecation reason Not used.
 ✔ Field TransactionResult.metadata changed type from String to String!
 ✔ Directive deprecated was added to field TransactionResult.metadata
 ✔  Field Transfer.blockHash is deprecated
 ✔  Field Transfer.blockHash has deprecation reason Use `block.hash` field
  instead.
 ✔  Field Transfer.chainId is deprecated
 ✔  Field Transfer.chainId has deprecation reason Use `block.chainId` field
  instead.
 ✔  Field Transfer.height is deprecated
 ✔  Field Transfer.height has deprecation reason Use `block.height` field
  instead.
```
