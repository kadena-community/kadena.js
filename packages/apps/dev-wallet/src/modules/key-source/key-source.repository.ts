import { IDBService, dbService } from '@/modules/db/db.service';

export interface IHDBIP44 {
  uuid: string;
  profileId: string;
  secretId: string;
  source: 'HD-BIP44';
  derivationPathTemplate: string;
  keys: Array<{
    index: number;
    publicKey: string;
  }>;
}

export interface IHDChainweaver {
  uuid: string;
  profileId: string;
  secretId: string;
  source: 'HD-chainweaver';
  rootKeyId: string;
  keys: Array<{
    index: number;
    publicKey: string;
    secretId: string;
  }>;
}

export interface IWebAuthn {
  uuid: string;
  profileId: string;
  source: 'webauthn';
  keys: Array<{
    index: number;
    id: string;
    publicKey: string;
  }>;
}

export type HDWalletKeySource = IHDBIP44 | IHDChainweaver;

export interface HDWalletRepository {
  getKeySource: (id: string) => Promise<HDWalletKeySource>;
  addKeySource: (profile: HDWalletKeySource) => Promise<void>;
  updateKeySource: (profile: HDWalletKeySource) => Promise<void>;
  getEncryptedValue: (key: string) => Promise<Uint8Array>;
  addEncryptedValue: (key: string, value: string | Uint8Array) => Promise<void>;
}

const createKeySourceRepository = ({
  getOne,
  add,
  update,
}: IDBService): HDWalletRepository => {
  return {
    getKeySource: async (id: string): Promise<HDWalletKeySource> => {
      return getOne('keySource', id);
    },
    addKeySource: async (keySource: HDWalletKeySource): Promise<void> => {
      return add('keySource', keySource);
    },
    updateKeySource: async (keySource: HDWalletKeySource): Promise<void> => {
      return update('keySource', keySource);
    },
    getEncryptedValue: async (key: string): Promise<Uint8Array> => {
      return getOne('encryptedValue', key);
    },
    addEncryptedValue: async (
      key: string,
      value: string | Uint8Array,
    ): Promise<void> => {
      return add('encryptedValue', value, key);
    },
  };
};

export const keySourceRepository = createKeySourceRepository(dbService);
