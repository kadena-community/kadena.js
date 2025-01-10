- [ ] Marcos Update descriptions of the fields

- [ ] Marcos [log] ✖  Field Block.difficulty changed type from BigInt! to BigInt
- [ ] Marcos [log] ✖  Field Block.flags changed type from Decimal! to NonNegativeFloat!
- [ ] Marcos [log] ✖  Field Block.nonce changed type from Decimal! to NonNegativeFloat!
- [x] Albert [log] ✖  Field Block.target changed type from Decimal! to String!
- [x] Albert [log] ✖  Field Block.weight changed type from Decimal! to String!
[log] ✖  Type Decimal was removed
- [x] Albert [log] ✖  Field incrementedId was removed from object type Event
- [ ] Marcos [log] ✖  Field Event.name changed type from String! to String
- [x] Albert [log] ✖  Field parameterText was removed from object type Event
- [ ] Marcos [log] ✖  Field FungibleAccount.totalBalance changed type from Decimal! to NonNegativeFloat!
- [ ] Marcos [log] ✖  Field version was removed from object type GraphConfiguration
- [ ] Marcos [log] ✖  Guard object type no longer implements IGuard interface
  For now, use the IGuard interface with only the KeysetGuard implements IGuard.

  """
  A guard. Has values `keys`, `predicate` to provide backwards compatibility for `KeysetGuard`.
  """
  interface IGuard {
    raw: String!
  }

  type KeysetGuard implements IGuard {
    keys: [String!]!
    predicate: String!
    raw: String!
  }
- [ ] Marcos for next version we need the different guards to be implemented

- [x] Albert [log] ✖  Type MinerKey was removed

- [ ] Marcos [log] ✖  Field chainAccounts was removed from object type NonFungibleAccount
  Reintroduce NonFungibleAccount.chainAccounts
  [log] ✖  Field guard was removed from object type NonFungibleTokenBalance

- [x] Albert [log] ✖  Type PositiveFloat was removed
- [x] Albert [log] ✖  Field Query.fungibleChainAccount changed type from FungibleChainAccount to [FungibleChainAccount!]!
- [x] Albert [log] ✖  Argument chainId: String! was removed from field Query.fungibleChainAccount

- [ ] Marcos [log] ✖  Argument parametersFilter: String was removed from field Subscription.events
  https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/working-with-json-fields#filter-on-object-property
  Add complexity information to the queries, and limit complexity for production servers

- [ ] Marcos [log] ✖  Type for argument chainIds on field Subscription.newBlocks changed from [String!] to [String]!
- [x] Albert [log] ✖  Field metadata was removed from object type TransactionResult
- [ ] Marcos [log] ✖  Field Transfer.amount changed type from Decimal! to NonNegativeFloat!
- [x] Albert [log] ⚠  Argument chainIds: [String!] added to field Query.fungibleChainAccount




[log]
Detected the following changes (150) between schemas:

- [ ] Albert [log] ✖  Field FungibleChainAccount.guard changed type from Guard! to KeysetGuard!
- [ ] Albert [log] ✖  Type Guard was removed
- [ ] Albert [log] ✖  Field keys (deprecated) was removed from interface IGuard
- [ ] Albert [log] ✖  Field predicate (deprecated) was removed from interface IGuard

[log] ✖  Field moduleHash was removed from object type Transfer
[log] ✖  Field requestKey was removed from object type Transfer
