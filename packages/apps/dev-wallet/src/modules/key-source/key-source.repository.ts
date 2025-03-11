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
  secretId?: string;
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

export type KeySourceType = (IHDBIP44 | IHDChainweaver | IWebAuthn) & {
  isDefault?: boolean;
};

export interface HDWalletRepository {
  getKeySource: (id: string) => Promise<KeySourceType>;
  getKeySources: (profileId: string) => Promise<KeySourceType[]>;
  addKeySource: (profile: KeySourceType) => Promise<void>;
  updateKeySource: (profile: KeySourceType) => Promise<void>;
  patchKeySource: (id: string, patch: Partial<KeySourceType>) => Promise<void>;
  setAsDefault: (id: string, profileId: string) => Promise<void>;
}

const createKeySourceRepository = ({
  getOne,
  add,
  update,
  getAll,
}: IDBService): HDWalletRepository => {
  const getKeySource = async (id: string): Promise<KeySourceType> => {
    return getOne('keySource', id);
  };
  const getKeySources = async (profileId: string): Promise<KeySourceType[]> => {
    return getAll('keySource', profileId, 'profileId');
  };
  const addKeySource = async (keySource: KeySourceType): Promise<void> => {
    return add('keySource', keySource);
  };
  const updateKeySource = async (keySource: KeySourceType): Promise<void> => {
    return update('keySource', keySource);
  };
  const patchKeySource = async (
    id: string,
    patch: Partial<KeySourceType>,
  ): Promise<void> => {
    const keySource = await getOne('keySource', id);
    if (!keySource) return;
    return update('keySource', { ...keySource, ...patch });
  };
  const setAsDefault = async (id: string, profileId: string): Promise<void> => {
    const keySources: KeySourceType[] = await getAll(
      'keySource',
      profileId,
      'profileId',
    );
    if (!keySources || !keySources.length) return;
    await Promise.all(
      keySources
        .filter((ks) => ks.uuid !== id)
        .map((ks) => update('keySource', { ...ks, isDefault: false })),
    );
    const keySource: KeySourceType = await getOne('keySource', id);
    return update('keySource', { ...keySource, isDefault: true });
  };

  return {
    getKeySource,
    getKeySources,
    addKeySource,
    updateKeySource,
    patchKeySource,
    setAsDefault,
  };
};

export const keySourceRepository = createKeySourceRepository(dbService);
