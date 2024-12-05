import { builder } from '../builder';
import { Guard, InterfaceGuard } from './guard';

// KeysetGuard
//   {"keys":Array[String] ,"pred":String }

builder.objectType(Guard, {
  name: 'Guard',
  interfaces: [InterfaceGuard],
  fields: (t) => ({
    raw: t.expose('raw', { type: 'String' }),
    predicate: t.expose('predicate', { type: 'String' }),
    keys: t.exposeStringList('keys'),
  }),
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

// // UserGuard:
// //   { "fun":String, "args":Array[PactValue] }
// export class UserGuard {
//   constructor(
//     public raw: string,
//     public fun: string,
//     // public args: PactValue[],
//   ) {}
// }

// builder.objectType(UserGuard, {
//   name: 'UserGuard',
//   fields: (t) => ({
//     raw: t.expose('raw', { type: 'String' }),
//     fun: t.expose('fun', { type: 'String' }),
//     // args: t.expose('args', { type: '[PactValue]' }),
//   }),
// });

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
