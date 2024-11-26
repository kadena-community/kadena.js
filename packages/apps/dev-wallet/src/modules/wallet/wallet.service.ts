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
  securityTerm: string | Uint8Array,
) {
  const secretId = crypto.randomUUID();
  // create this in order to verify the password later
  const secret = await kadenaEncrypt(
    password,
    JSON.stringify({ secretId }),
    'buffer',
  );
  const profileUUID = crypto.randomUUID();
  const encryptedTerm = await kadenaEncrypt(password, securityTerm, 'buffer');
  const securityPhraseId = crypto.randomUUID();
  await walletRepository.addEncryptedValue(secretId, secret, profileUUID);

  await walletRepository.addEncryptedValue(
    securityPhraseId,
    encryptedTerm,
    profileUUID,
  );

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
) {
  const service = await keySourceManager.get(keySource.source);
  if (!service.isConnected()) {
    await onConnect(keySource);
  }
  const key = await service.createKey(keySource.uuid);
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
  const keys = await recoverPublicKey(credential);
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
  if (!profile) return;
  const encryptedMnemonic = await walletRepository.getEncryptedValue(
    profile.securityPhraseId,
  );
  if (!encryptedMnemonic) {
    throw new Error('No mnemonic found');
  }
  const data = await kadenaChangePassword(
    currentPassword,
    encryptedMnemonic,
    newPassword,
    'buffer',
  );
  const secret = await kadenaEncrypt(
    newPassword,
    JSON.stringify({ secretId: profile.secretId }),
    'buffer',
  );
  const legacyKeySource = keySources.filter(
    ({ source }) => source === 'HD-chainweaver',
  );
  const persistData: Array<() => Promise<void>> = [];
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

  persistData.push(
    () =>
      walletRepository.updateEncryptedValue(
        profile.securityPhraseId,
        data,
        profile.uuid,
      ),
    () =>
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
