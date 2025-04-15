import { validatePassword } from '@/utils/validatePassword';
import { recoverPublicKey, retrieveCredential } from '@/utils/webAuthn';
import {
  addSignatures,
  ICommand,
  IPactCommand,
  IUnsignedCommand,
} from '@kadena/client';
import {
  kadenaChangePassword,
  kadenaDecrypt,
  kadenaEncrypt,
} from '@kadena/hd-wallet';
import { profileTables } from '../db/backup/backup';
import { dbService } from '../db/db.service';
import { deleteItem, getOneItem } from '../db/indexeddb';
import { ChainweaverService } from '../key-source/hd-wallet/chainweaver';
import { keySourceManager } from '../key-source/key-source-manager';
import { INetwork } from '../network/network.repository';
import { securityService } from '../security/security.service';
import {
  IKeyItem,
  IKeySource,
  IProfile,
  walletRepository,
} from './wallet.repository';

export function getProfile(profileId: string) {
  return walletRepository.getProfile(profileId);
}

export async function sign(
  keySources: IKeySource[],
  onConnect: (keySource: IKeySource) => Promise<void>,
  TXs: IUnsignedCommand[],
  keysToSignsBy: string[] = [],
) {
  const signedTxs: Array<IUnsignedCommand | ICommand> = [];
  for (const Tx of TXs) {
    let signaturesOf: Array<{ sig: string; pubKey: string }> = [];
    for (const keySource of keySources) {
      console.log('keySource to sign', keySource);
      const { keys: publicKeys, source } = keySource;
      const cmd: IPactCommand = JSON.parse(Tx.cmd);
      const relevantIndexes = cmd.signers
        .map(
          (signer) =>
            publicKeys.find(
              (key) =>
                key.publicKey === signer.pubKey &&
                (keysToSignsBy.length === 0 ||
                  keysToSignsBy.includes(key.publicKey)),
            )?.index,
        )
        .filter((index) => index !== undefined) as number[] | string[];

      console.log(keySource.source, 'relevantIndexes', relevantIndexes);

      if (relevantIndexes.length === 0) {
        continue;
      }

      const service = await keySourceManager.get(source);

      if (!service.isConnected()) {
        // call onConnect to connect to the keySource;
        // then the ui can prompt the user to unlock the wallet in case of hd-wallet
        await onConnect(keySource);
      }

      if (relevantIndexes.length > 0) {
        const signatures = await service.sign(
          keySource.uuid,
          Tx.hash,
          relevantIndexes,
        );

        signaturesOf = signaturesOf.concat(signatures);
      }
    }
    signedTxs.push(addSignatures(Tx, ...signaturesOf));
  }

  return signedTxs;
}

export function getRelevantKeys(
  keySources: IKeySource[],
  Tx: IUnsignedCommand,
) {
  return keySources.flatMap((keySource) => {
    const { keys } = keySource;
    const cmd: IPactCommand = JSON.parse(Tx.cmd);
    const publicKeys = cmd.signers
      .map((signer) => keys.find((key) => key.publicKey === signer.pubKey))
      .filter((index) => index !== undefined) as Array<IKeyItem>;

    return { ...keySource, keys: publicKeys };
  });
}

export async function createProfile(
  profileName: string,
  password: string,
  networks: INetwork[],
  accentColor: string,
  options: IProfile['options'],
  securityTerm: string | Uint8Array | undefined,
) {
  const secretId = crypto.randomUUID();
  // create this in order to verify the password later
  const secret = await kadenaEncrypt(
    password,
    JSON.stringify({ secretId }),
    'buffer',
  );
  const profileUUID = crypto.randomUUID();
  await walletRepository.addEncryptedValue(secretId, secret, profileUUID);

  const securityPhraseId = securityTerm ? crypto.randomUUID() : undefined;
  if (securityTerm) {
    const encryptedTerm = await kadenaEncrypt(password, securityTerm, 'buffer');

    await walletRepository.addEncryptedValue(
      securityPhraseId!,
      encryptedTerm,
      profileUUID,
    );
  }

  if (options.authMode === 'PASSWORD') {
    //check if password is valid
    const isValidated = validatePassword(password);
    if (isValidated !== true) return isValidated;
  }

  const profile: IProfile = {
    uuid: profileUUID,
    name: profileName,
    networks,
    secretId,
    securityPhraseId,
    accentColor: accentColor,
    options,
  };

  await walletRepository.addProfile(profile);
  return profile;
}

export const unlockProfile = async (profileId: string, password: string) => {
  try {
    const profile = await walletRepository.getProfile(profileId);
    const secret = await walletRepository.getEncryptedValue(profile.secretId);
    const decryptedSecret = await kadenaDecrypt(password, secret);
    const { secretId } = JSON.parse(new TextDecoder().decode(decryptedSecret));
    if (secretId === profile.secretId) {
      return profile;
    }
    return null;
  } catch (e) {
    console.log('error unlocking profile', e);
    console.error(e);
    return null;
  }
};

export async function createKey(
  keySource: IKeySource,
  onConnect: (keySource: IKeySource) => Promise<void>,
  index?: number,
) {
  const service = await keySourceManager.get(keySource.source);
  if (!service.isConnected()) {
    await onConnect(keySource);
  }
  const key = await service.createKey(keySource.uuid, index);
  return key;
}

export async function decryptSecret(password: string, secretId: string) {
  const encrypted = await walletRepository.getEncryptedValue(secretId);
  if (!encrypted) {
    throw new Error('No record found');
  }
  const decryptedBuffer = await kadenaDecrypt(password, encrypted);
  const mnemonic = new TextDecoder().decode(decryptedBuffer);
  return mnemonic;
}

export const getWebAuthnPass = async (
  profile: Pick<IProfile, 'options' | 'uuid'>,
) => {
  if (profile.options.authMode !== 'WEB_AUTHN') {
    throw new Error('Profile does not support WebAuthn');
  }
  const credentialId = profile.options.webAuthnCredential;
  const credential = await retrieveCredential(credentialId);
  if (!credential) {
    throw new Error('Failed to retrieve credential');
  }
  const keys: string[] = await recoverPublicKey(credential);
  for (const key of keys) {
    const result = await unlockProfile(profile.uuid, key);
    if (result) {
      return key;
    }
  }
  console.error('Failed to unlock profile');
};

// TODO: this needs to be written with caution as changing password is a critical operation
// if something goes wrong the user might lose access to their funds; So we need to first create a backup of data and then
// if everything goes well we can delete the old data
export const changePassword = async (
  profileId: string,
  currentPassword: string,
  newPassword: string,
) => {
  const profile = await walletRepository.getProfile(profileId);
  const keySources = await walletRepository.getProfileKeySources(profileId);
  const persistData: Array<() => Promise<void>> = [];
  if (!profile) return;

  //check if password is valid
  const isValidated = validatePassword(newPassword);
  if (isValidated !== true) return isValidated;

  if (profile.securityPhraseId !== undefined) {
    const securityPhraseId = profile.securityPhraseId;
    const encryptedMnemonic =
      await walletRepository.getEncryptedValue(securityPhraseId);
    if (!encryptedMnemonic) {
      throw new Error('No mnemonic found');
    }
    const data = await kadenaChangePassword(
      currentPassword,
      encryptedMnemonic,
      newPassword,
      'buffer',
    );
    persistData.push(() =>
      walletRepository.updateEncryptedValue(
        securityPhraseId,
        data,
        profile.uuid,
      ),
    );
  }
  const secret = await kadenaEncrypt(
    newPassword,
    JSON.stringify({ secretId: profile.secretId }),
    'buffer',
  );
  const legacyKeySource = keySources.filter(
    ({ source }) => source === 'HD-chainweaver',
  );
  if (legacyKeySource.length > 0) {
    const service = (await keySourceManager.get(
      'HD-chainweaver',
    )) as ChainweaverService;
    await Promise.all(
      legacyKeySource.map(async (keySource) => {
        await service.changePassword(
          keySource.uuid,
          currentPassword,
          newPassword,
          (updates) => {
            persistData.push(...updates);
            return Promise.resolve([]);
          },
        );
      }),
    );
  }

  persistData.push(() =>
    walletRepository.updateEncryptedValue(
      profile.secretId,
      secret,
      profile.uuid,
    ),
  );

  // save all data to the db in on place after all the operations are done;
  // TODO: For more reliability, this must be performed as a single transaction, ensuring that if anything goes wrong, the IndexedDB data is rolled back.
  await Promise.all(persistData.map((cb) => cb()));
  await securityService.clearSecurityPhrase();
};

const deleteProfileTables =
  (transaction: IDBTransaction, profileId: string) =>
  (table: (typeof profileTables)[number]) => {
    return new Promise<void>((resolve, reject) => {
      const objectStore = transaction.objectStore(table);
      const index = objectStore.index('profileId');
      const query = index.openCursor(IDBKeyRange.only(profileId));
      query.onsuccess = (event) => {
        const cursor: IDBCursorWithValue | undefined | null = (
          event.target as any
        )?.result;
        if (cursor) {
          cursor.delete().onerror = () => {
            reject();
          }; // Delete the current record
          cursor.continue(); // Move to the next record
        } else {
          resolve();
        }
      };

      query.onerror = () => {
        reject();
      };
    });
  };

export const deleteProfile = async (profileId: string) => {
  const deleteCb = dbService.injectDbWithNotify(
    (db) => async () => {
      const transaction = db.transaction(
        ['profile', ...profileTables],
        'readwrite',
      );
      const profileStore = await getOneItem(db, transaction)(
        'profile',
        profileId,
      );
      if (!profileStore) {
        return;
      }
      await deleteItem(db, transaction)('profile', profileId);
      const deleteProfileTable = deleteProfileTables(transaction, profileId);
      await Promise.all(profileTables.map(deleteProfileTable));
      return;
    },
    'import',
  );
  return deleteCb();
};
