declare const module: any;
declare const governance: any;
declare const defun: any;
declare const defcap: any;
declare const defschema: any;
declare const deftable: any;
declare const bless: any;
declare const doc: any;
declare const with_capability: any;
declare const enforce: any;
declare const enforce_guard: any;
declare const read: any;
declare const format: any;
declare const managed: any;
declare const enforce_unit: any;
declare const compose_capability: any;
declare const require_capability: any;
declare const validate_account: any;
declare const with_read: any;
declare const with_default_read: any;
declare const update: any;
declare const table: any;
declare const enforce_reserved: any;
declare const namespace: any;
declare const createTable: any;
declare const createSchema: any;
declare const defCap: any;
declare const defModule: any;
declare const defGovernance: any;
declare type decimal = number & { _brand?: 'decimal' };
declare type guard = any;
declare class Table<T> {
  constructor(schema: Schema<T>);
  read(key: string): any;
  write(key: string, value: any);
}
@module('fungible-v2')
class fungibleV2 {}
@module('fungible-xchain-v1')
class fungibleXChainV1 {}

declare class Schema<T> {}
