import { builder } from '../builder';
import { IInterfaceGuard } from '../types/graphql-types';

export class Guard implements IInterfaceGuard {
  constructor(
    public raw: string,
    public predicate: IInterfaceGuard['predicate'],
    public keys: string[] = [],
  ) {}
}

// Union Guard =
//   Keyset | KeysetRef | UserGuard | CapabilityGuard | ModuleGuard | PactGuard
export const IGuard = builder.interfaceType(Guard, {
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
