import { builder } from '../builder';
import type { IGuard } from '../types/graphql-types';

async function tryParseJson<T>(json: string): Promise<T> {
  return new Promise((resolve, reject) => {
    try {
      resolve(JSON.parse(json));
    } catch (error) {
      reject(error);
    }
  });
}

export class GuardInterfaceClass implements IGuard {
  public raw: string;
  public keys: string[] = [];
  public predicate: '' | 'keys-all' | 'keys-any' | 'keys-two' = '';

  public constructor(raw: string) {
    this.raw = raw;
  }
}

// Union Guard =
//   Keyset | KeysetRef | UserGuard | CapabilityGuard | ModuleGuard | PactGuard
export const InterfaceGuard = builder.interfaceType(GuardInterfaceClass, {
  name: 'IGuard',
  description:
    'A guard. This is a union of all the different types of guards that can be used in a pact.',
  resolveType: async (value) => {
    let parsed: Record<string, unknown> | undefined = undefined;
    try {
      parsed = await tryParseJson(value.raw);
    } catch (error) {
      console.error('Error parsing guard', error);
      throw new Error('not supported guard');
    }
    switch (true) {
      case parsed && 'keys' in parsed:
        return 'KeysetGuard';
      // case parsed && 'keysetref' in parsed:
      //   return 'KeysetRefGuard';
      // case parsed && 'fun' in parsed:
      //   return 'UserGuard';
      // case parsed && 'cgName' in parsed:
      //   return 'CapabilityGuard';
      // case parsed && 'moduleName' in parsed:
      //   return 'ModuleGuard';
      // case parsed && 'pactId' in parsed:
      //   return 'PactGuard';
      default:
        return 'RawGuard';
    }
  },
  fields: (t) => ({
    raw: t.string({ resolve: (parent) => parent.raw }),
    predicate: t.string({
      deprecationReason: 'deprecated, use KeysetGuard.predicate',
      resolve: () =>
        'GraphQL Error: field deprecated, use KeysetGuard.predicate',
    }),
    keys: t.stringList({
      deprecationReason: 'deprecated, use KeysetGuard.keys',
      resolve: () => ['GraphQL Error: field deprecated, use KeysetGuard.keys'],
    }),
  }),
});

// KeysetGuard
//   {"keys":Array[String] ,"pred":String }
builder.objectType('KeysetGuard', {
  interfaces: [InterfaceGuard],
  description: 'A keyset guard.',
  fields: (t) => ({
    raw: t.field({
      type: 'String',
      resolve: (parent) => parent.raw,
    }),
    predicate: t.field({
      type: 'String',
      resolve: async (parent) => ((await tryParseJson(parent.raw)) as any).pred,
    }),
    keys: t.field({
      type: ['String'],
      resolve: async (parent) => ((await tryParseJson(parent.raw)) as any).keys,
    }),
  }),
});

// Temporary RawGuard
builder.objectType('RawGuard', {
  interfaces: [InterfaceGuard],
  description:
    'DEPRECATED: a fallthrough IGuard type to cover non-KeysetGuard types.',
});

// // KeysetRef:
// //   { "keysetref": { "ns":String?, "ksn":String } }
// export class KeysetRefGuard {
//   constructor(
//     public raw: string,
//     public keysetref: { ns: string | null; ksn: string },
//   ) {}
// }

// builder.objectType(KeysetRefGuard, {
//   name: 'KeysetRefGuard',
//   fields: (t) => ({
//     raw: t.expose('raw', { type: 'String' }),
//     keysetref: t.expose('keysetref', {
//       type: 'KeysetRef'
//     }),
//   }),
// });

type PactValue = string;

// // UserGuard:
// //   { "fun":String, "args":Array[PactValue] }
export class UserGuard extends GuardInterfaceClass {
  public constructor(
    public raw: string,
    public fun: string,
    public args: PactValue[],
  ) {
    super(raw);
  }
}

builder.objectType(UserGuard, {
  name: 'UserGuard',
  interfaces: [InterfaceGuard],
  fields: (t) => ({
    fun: t.field({
      type: 'String',
      resolve: (parent) =>
        tryParseJson(parent.raw).then((parsed) => (parsed as any).fun),
    }),
    args: t.field({
      type: ['String'],
      resolve: async (parent) =>
        (await tryParseJson<UserGuard>(parent.raw)).args.map((arg: any) =>
          JSON.stringify(arg),
        ),
    }),
    // args: t.expose('args', { type: '[PactValue]' }),
  }),
});

// // CapabilityGuard:
// //   { "cgName":String, "cgArgs":Array[PactValue], "cgPactId":String? }
// export class CapabilityGuard {
//   constructor(
//     public raw: string,
//     public cgName: string,
//     public cgArgs: PactValue[],
//     public cgPactId: string | null,
//   ) {}
// }

// builder.objectType(CapabilityGuard, {
//   name: 'CapabilityGuard',
//   fields: (t) => ({
//     raw: t.expose('raw', { type: 'String' }),
//     cgName: t.expose('cgName', { type: 'String' }),
//     cgArgs: t.expose('cgArgs', { type: '[PactValue]' }),
//     cgPactId: t.expose('cgPactId', { type: 'String', nullable: true }),
//   }),
// });

// ModuleGuard:
//   { "moduleName":ModuleName, "name":String }
// export class ModuleGuard {
//   constructor(
//     public raw: string,
//     public moduleName: ModuleName,
//     public name: string,
//   ) {}
// }

// export class ModuleName {
//   constructor(
//     public name: string,
//     public namespace: string,
//   ) {}
// }

// builder.objectType(ModuleGuard, {
//   name: 'ModuleGuard',
//   fields: (t) => ({
//     raw: t.expose('raw', { type: 'String' }),
//     moduleName: t.expose('moduleName', {
//       type: 'ModuleName',
//       name: t.expose('name', { type: 'String' }),
//       namespace: t.expose('namespace', { type: 'String' }),
//     }),
//     name: t.expose('name', { type: 'String' }),
//   }),
// });

// // PactGuard (Or Defpact Guard):
// //   { "pactId":String, "name":String }
// export class PactGuard {
//   constructor(
//     public raw: string,
//     public pactId: string,
//     public name: string,
//   ) {}
// }

// builder.objectType(PactGuard, {
//   name: 'PactGuard',
//   fields: (t) => ({
//     raw: t.expose('raw', { type: 'String' }),
//     pactId: t.expose('pactId', { type: 'String' }),
//     name: t.expose('name', { type: 'String' }),
//   }),
// });
