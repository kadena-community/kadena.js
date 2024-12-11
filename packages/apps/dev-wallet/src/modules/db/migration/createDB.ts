import { createStore } from '../indexeddb';

type TableName =
  | 'profile'
  | 'encryptedValue'
  | 'keySource'
  | 'account'
  | 'watched-account'
  | 'network'
  | 'fungible'
  | 'keyset'
  | 'transaction'
  | 'activity'
  | 'contact'
  | 'backup';

export type ExtendedTableName =
  | TableName
  | `backup:${TableName}-v${number}:${number}`
  | `temp:${TableName}-v${number}:${number}`;

export interface TableScheme {
  name: ExtendedTableName;
  keyPath: string;
  indexes?: {
    index: string;
    indexKeyPath?: string | string[];
    unique?: boolean;
  }[];
}

export const defineSchemeFactory = () => {
  const dbScheme: {
    [key: string]: TableScheme;
  } = {};
  return {
    defineScheme: (
      name: TableScheme['name'],
      keyPath: TableScheme['keyPath'],
      indexes?: TableScheme['indexes'],
    ) => {
      dbScheme[name] = { name, keyPath, indexes };
      return dbScheme[name];
    },
    getScheme: () => dbScheme,
  };
};

export function getDBScheme() {
  const { defineScheme, getScheme } = defineSchemeFactory();
  defineScheme('profile', 'uuid', [{ index: 'name', unique: true }]);
  defineScheme('encryptedValue', 'uuid', [{ index: 'profileId' }]);
  defineScheme('keySource', 'uuid', [{ index: 'profileId' }]);
  defineScheme('account', 'uuid', [
    { index: 'address' },
    { index: 'keysetId' },
    { index: 'profileId' },
    { index: 'profile-network', indexKeyPath: ['profileId', 'networkUUID'] },
    {
      index: 'unique-account',
      indexKeyPath: ['keysetId', 'contract', 'networkUUID'],
      unique: true,
    },
  ]);
  defineScheme('watched-account', 'uuid', [
    { index: 'address' },
    { index: 'profileId' },
    { index: 'profile-network', indexKeyPath: ['profileId', 'networkUUID'] },
    {
      index: 'unique-account',
      indexKeyPath: ['profileId', 'contract', 'address', 'networkUUID'],
      unique: true,
    },
  ]);
  defineScheme('network', 'uuid', [{ index: 'networkId', unique: true }]);
  defineScheme('fungible', 'contract', [{ index: 'symbol', unique: true }]);
  defineScheme('keyset', 'uuid', [
    { index: 'profileId' },
    { index: 'principal' },
    {
      index: 'unique-keyset',
      indexKeyPath: ['profileId', 'principal'],
      unique: true,
    },
  ]);
  defineScheme('transaction', 'uuid', [
    { index: 'hash' },
    { index: 'profileId' },
    { index: 'groupId' },
    { index: 'network', indexKeyPath: ['profileId', 'networkUUID'] },
    {
      index: 'unique-tx',
      indexKeyPath: ['profileId', 'networkUUID', 'hash'],
      unique: true,
    },
    {
      index: 'network-status',
      indexKeyPath: ['profileId', 'networkUUID', 'status'],
    },
  ]);
  defineScheme('activity', 'uuid', [
    { index: 'profileId' },
    { index: 'profile-network', indexKeyPath: ['profileId', 'networkUUID'] },
    { index: 'keyset-network', indexKeyPath: ['keysetId', 'networkUUID'] },
  ]);
  defineScheme('contact', 'uuid', [{ index: 'name', unique: true }]);
  defineScheme('backup', 'uuid');
  return getScheme();
}

// create all objects stores for fresh start
export function createTables(db: IDBDatabase) {
  const create = createStore(db);
  const dbScheme = getDBScheme();
  Object.values(dbScheme).map((tableScheme) => create(tableScheme));
}
