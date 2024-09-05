import { builder } from '../builder';

export class GenericGuard {
  constructor(
    public raw: string,
    public predicate: string | null,
    public keys: string[] | null,
  ) {}
}

// Union Guard =
//   Keyset | KeysetRef | UserGuard | CapabilityGuard | ModuleGuard | PactGuard
export enum GuardTypes {
  KEYSET,
  KEYSETREF,
  USERGUARD,
  CAPABILITYGUARD,
  MODULEGUARD,
  PACTGUARD,
}

builder.interfaceType(GenericGuard, {
  name: 'IGuard',
  description:
    'A guard. Has values `keys`, `predicate` to provide backwards compatibility for `KeysetGuard`.',
  fields: (t) => ({
    raw: t.string({
      resolve: (parent) =>
        JSON.stringify({ keys: parent.keys, predicate: parent.predicate }),
    }),
    predicate: t.string({
      nullable: true,
      deprecationReason:
        'Use `... on KeysetGuard { keys predicate }` instead when working with Keysets',
    }),
    keys: t.stringList({
      nullable: true,
      deprecationReason:
        'Use `... on KeysetGuard { keys predicate }` instead when working with Keysets',
    }),
  }),
});

builder.enumType(GuardTypes, {
  name: 'GuardType',
});
