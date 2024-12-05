import { builder } from '../builder';
import type { IGuard } from '../types/graphql-types';

export class Guard implements IGuard {
  public raw: string;
  public predicate: IGuard['predicate'];
  public keys: string[] = [];

  public constructor(
    raw: string,
    predicate: IGuard['predicate'],
    keys: string[] = [],
  ) {
    this.raw = raw;
    this.predicate = predicate;
    this.keys = keys;
  }
}

// Union Guard =
//   Keyset | KeysetRef | UserGuard | CapabilityGuard | ModuleGuard | PactGuard
export const InterfaceGuard = builder.interfaceType(Guard, {
  name: 'IGuard',
  description:
    'A guard. Has values `keys`, `predicate` to provide backwards compatibility for `KeysetGuard`.',
  fields: (t) => ({
    raw: t.string({
      resolve: (parent) =>
        JSON.stringify({ keys: parent.keys, predicate: parent.predicate }),
    }),
    predicate: t.string({
      deprecationReason:
        'Use `... on KeysetGuard { keys predicate }` instead when working with Keysets',
    }),
    keys: t.stringList({
      deprecationReason:
        'Use `... on KeysetGuard { keys predicate }` instead when working with Keysets',
    }),
  }),
});
