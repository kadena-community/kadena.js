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
  source: 'web-authn';
  keys: Array<{
    index: string;
    publicKey: string;
    scheme: 'WebAuthn';
  }>;
}

export type KeySourceType = IHDBIP44 | IHDChainweaver | IWebAuthn;

export interface HDWalletRepository {
  getKeySource: (id: string) => Promise<KeySourceType>;
  addKeySource: (profile: KeySourceType) => Promise<void>;
  updateKeySource: (profile: KeySourceType) => Promise<void>;
  getEncryptedValue: (key: string) => Promise<Uint8Array>;
  addEncryptedValue: (key: string, value: string | Uint8Array) => Promise<void>;
}

const createKeySourceRepository = ({
  getOne,
  add,
  update,
}: IDBService): HDWalletRepository => {
  return {
    getKeySource: async (id: string): Promise<KeySourceType> => {
      return getOne('keySource', id);
    },
    addKeySource: async (keySource: KeySourceType): Promise<void> => {
      return add('keySource', keySource);
    },
    updateKeySource: async (keySource: KeySourceType): Promise<void> => {
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
