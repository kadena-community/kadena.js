import { createStore } from '../indexeddb';

// create all objects stores for fresh start
export function createTables(db: IDBDatabase) {
  const create = createStore(db);
  create('profile', 'uuid', [{ index: 'name', unique: true }]);
  create('encryptedValue', 'uuid', [{ index: 'profileId' }]);
  create('keySource', 'uuid', [{ index: 'profileId' }]);
  create('account', 'uuid', [
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
  create('watched-account', 'uuid', [
    { index: 'address' },
    { index: 'profileId' },
    { index: 'profile-network', indexKeyPath: ['profileId', 'networkUUID'] },
    {
      index: 'unique-account',
      indexKeyPath: ['profileId', 'contract', 'address', 'networkUUID'],
      unique: true,
    },
  ]);
  create('network', 'uuid', [{ index: 'networkId', unique: true }]);
  create('fungible', 'uuid', [
    { index: 'symbol', unique: true },
    { index: 'contract', unique: true },
  ]);
  create('keyset', 'uuid', [
    { index: 'profileId' },
    { index: 'principal' },
    {
      index: 'unique-keyset',
      indexKeyPath: ['profileId', 'principal'],
      unique: true,
    },
  ]);
  create('transaction', 'uuid', [
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
  create('activity', 'uuid', [
    { index: 'profile-network', indexKeyPath: ['profileId', 'networkUUID'] },
    { index: 'keyset-network', indexKeyPath: ['keysetId', 'networkUUID'] },
  ]);
  create('contact', 'uuid', [{ index: 'name', unique: true }]);
}
