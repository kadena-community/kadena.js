import { IDBService, dbService } from '@/modules/db/db.service';
import { SignerScheme } from '@kadena/client';
import type { INetwork } from '../network/network.repository';
import { UUID } from '../types';

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
  selectedNetworkUUID?: UUID;
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

export interface IBackup {
  directoryHandle?: FileSystemDirectoryHandle;
  lastBackup: number;
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
    patchProfile: async (
      uuid: string,
      profile: Partial<IProfile>,
    ): Promise<void> => {
      const existingProfile = await getOne<IProfile>('profile', uuid);
      if (!existingProfile) {
        throw new Error('Profile not found');
      }
      return update('profile', { ...existingProfile, ...profile });
    },
    getEncryptedValue: async (uuid: string): Promise<Uint8Array> => {
      const { value } = (await getOne<IEncryptedValue>(
        'encryptedValue',
        uuid,
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
    getAllKeySources: async (): Promise<IKeySource[]> => {
      return getAll('keySource');
    },
    addBackupOptions: async (backup: IBackup): Promise<void> => {
      return add('backup', { ...backup, uuid: 'backup-id' });
    },
    updateBackupOptions: async (backup: IBackup): Promise<void> => {
      return update('backup', { ...backup, uuid: 'backup-id' });
    },
    getBackupOptions: async (): Promise<IBackup> => {
      const backups: IBackup[] = await getAll('backup');
      return backups[0];
    },
    async patchBackupOptions(patch: Partial<IBackup>) {
      const backups: IBackup[] = await getAll('backup');
      const backupOptions = backups[0];
      if (!backupOptions) {
        await walletRepository.addBackupOptions({
          lastBackup: 0,
          ...patch,
        });
      } else {
        await walletRepository.updateBackupOptions({
          ...backupOptions,
          ...patch,
        });
      }
    },
  };
};

export const walletRepository = createWalletRepository(dbService);
