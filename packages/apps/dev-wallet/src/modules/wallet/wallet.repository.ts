import { IDBService, dbService } from '@/modules/db/db.service';
import { SignerScheme } from '@kadena/client';
import type { INetwork } from '../network/network.repository';

export type KeySourceType = 'HD-BIP44' | 'HD-chainweaver' | 'web-authn';

export interface IKeyItem {
  index?: number | string;
  publicKey: string;
  scheme?: SignerScheme;
}

export interface IKeySource {
  uuid: string;
  profileId: string;
  source: KeySourceType;
  keys: Array<IKeyItem>;
}

export interface IProfile {
  uuid: string;
  name: string;
  networks: INetwork[];
  secretId: string;
  securityPhraseId: string;
  accentColor: string;
  options: {
    rememberPassword: 'never' | 'session' | 'short-time';
  } & (
    | {
        authMode: 'PASSWORD';
      }
    | {
        authMode: 'WEB_AUTHN';
        webAuthnCredential: ArrayBuffer;
      }
  );
}

export interface IEncryptedValue {
  uuid: string;
  value: Uint8Array;
  profileId: string;
}

const createWalletRepository = ({
  getAll,
  getOne,
  add,
  update,
}: IDBService) => {
  return {
    getAllProfiles: async (): Promise<Exclude<IProfile, 'networks'>[]> => {
      return getAll('profile');
    },
    getProfile: async (id: string): Promise<IProfile> => {
      return getOne('profile', id);
    },
    addProfile: async (profile: IProfile): Promise<void> => {
      return add('profile', profile);
    },
    updateProfile: async (profile: IProfile): Promise<void> => {
      return update('profile', profile, undefined);
    },
    getEncryptedValue: async (key: string): Promise<Uint8Array> => {
      const { value } = (await getOne<IEncryptedValue>(
        'encryptedValue',
        key,
      )) ?? {
        value: undefined,
      };
      return value;
    },
    addEncryptedValue: async (
      uuid: string,
      value: string | Uint8Array,
      profileId: string,
    ): Promise<void> => {
      return add('encryptedValue', { uuid, value, profileId });
    },
    updateEncryptedValue: async (
      uuid: string,
      value: string | Uint8Array,
      profileId: string,
    ): Promise<void> => {
      return update('encryptedValue', { uuid, value, profileId });
    },
    getProfileKeySources: async (profileId: string): Promise<IKeySource[]> => {
      return (
        (await getAll('keySource', profileId, 'profileId')) as IKeySource[]
      ).reverse();
    },
    getKeySource: async (keySourceId: string): Promise<IKeySource> => {
      return getOne('keySource', keySourceId);
    },
  };
};

export const walletRepository = createWalletRepository(dbService);
