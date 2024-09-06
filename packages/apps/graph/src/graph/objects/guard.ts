import { builder } from '../builder';
import type { Guard, PactValue, PvDecimal, PvInteger } from '../types/guard';
import {
  ModuleName,
  PvBool,
  PvCapToken,
  PvGuard,
  PvList,
  PvLiteral,
  PvModRef,
  PvObject,
  PvString,
  PvTime,
} from '../types/guard';

// Define custom scalars if needed
builder.scalarType('PvString', { serialize: String });
builder.scalarType('PvInteger', { serialize: (value: PvInteger) => value });
builder.scalarType('PvDecimal', { serialize: (value: PvDecimal) => value });
builder.scalarType('PvBool', { serialize: Boolean });

// Define the PactValue union type
builder.unionType('PactValue', {
  types: [
    'PvLiteral',
    'PvList',
    'PvGuard',
    'PvObject',
    'PvModRef',
    'PvTime',
    'PvCapToken',
  ],
  resolveType: (value: PactValue) => {
    if (typeof value === 'string') return 'PvString';
    if (
      typeof value === 'number' ||
      (typeof value === 'object' && 'decimal' in value)
    )
      return 'PvDecimal';
    if (typeof value === 'boolean') return 'PvBool';
    if (Array.isArray(value)) return 'PvList';
    if (typeof value === 'object' && 'refName' in value) return 'PvModRef';
    if (typeof value === 'object' && ('time' in value || 'timep' in value))
      return 'PvTime';
    if (typeof value === 'object' && 'ctName' in value) return 'PvCapToken';
    if (typeof value === 'object') return 'PvObject';
    return 'PvGuard';
  },
});

// Define the Guard union type
builder.unionType('Guard', {
  types: [
    'Keyset',
    'KeysetRef',
    'UserGuard',
    'CapabilityGuard',
    'ModuleGuard',
    'PactGuard',
  ],
  resolveType: (value: Guard) => {
    if ('keys' in value) return 'Keyset';
    if ('keysetref' in value) return 'KeysetRef';
    if ('fun' in value) return 'UserGuard';
    if ('cgName' in value) return 'CapabilityGuard';
    if ('moduleName' in value) return 'ModuleGuard';
    if ('pactId' in value) return 'PactGuard';
    return null;
  },
});

// Define the object types
builder.objectType('Keyset', {
  fields: (t) => ({
    keys: t.stringList({ resolve(parent) { return parent.keys; } }),
    pred: t.field({ type: 'String', resolve(parent) { return parent.pred; }}),
  }),
});

builder.objectType('KeysetRef', {
  fields: (t) => ({
    keysetref: t.field({
      type: 'KeysetRef',
      resolve(parent) {
        return parent;
      },
    }),
  }),
});

builder.objectType('UserGuard', {
  fields: (t) => ({
    fun: t.field({ type: 'String', resolve(parent) { return parent.fun; }}),
    args: t.field({ type: '[PactValue]', resolve(parent) { return parent.args; }}),
  }),
});

builder.objectType('CapabilityGuard', {
  fields: (t) => ({
    cgName: t.field({ type: 'String' }),
    cgArgs: t.field({ type: ['PactValue'] }),
    cgPactId: t.field({ type: 'String', nullable: true }),
  }),
});

builder.objectType('ModuleGuard', {
  fields: (t) => ({
    moduleName: t.field({ type: 'ModuleName' }),
    name: t.field({ type: 'String' }),
  }),
});

builder.objectType('PactGuard', {
  fields: (t) => ({
    pactId: t.field({ type: 'String' }),
    name: t.field({ type: 'String' }),
  }),
});

builder.objectType('ModuleName', {
  fields: (t) => ({
    name: t.field({ type: 'String' }),
    namespace: t.field({ type: 'String', nullable: true }),
  }),
});

// Add the custom scalars
builder.scalarType('PvString', { serialize: String });
builder.scalarType('PvInteger', { serialize: (value) => value });
builder.scalarType('PvDecimal', { serialize: (value) => value });
builder.scalarType('PvBool', { serialize: Boolean });
