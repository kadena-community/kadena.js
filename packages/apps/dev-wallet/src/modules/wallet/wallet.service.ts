import { IPactCommand, IUnsignedCommand, addSignatures } from '@kadena/client';
import { kadenaDecrypt, kadenaEncrypt } from '@kadena/hd-wallet';

import { idToColor } from '@/utils/id-to-color';
import { accountRepository } from '../account/account.repository';
import { keySourceManager } from '../key-source/key-source-manager';
import { INetwork } from '../network/network.repository';
import { IKeySource, IProfile, walletRepository } from './wallet.repository';

export function getProfile(profileId: string) {
  return walletRepository.getProfile(profileId);
}

export function getAccounts(profileId: string) {
  return accountRepository.getAccountsByProfileId(profileId);
}

export function sign(
  keySources: IKeySource[],
  onConnect: (keySource: IKeySource) => Promise<void>,
  TXs: IUnsignedCommand[],
) {
  const signedTx = Promise.all(
    TXs.map(async (Tx) => {
      const signatures = await Promise.all(
        keySources.map(async (keySource) => {
          const { keys: publicKeys, source } = keySource;
          const cmd: IPactCommand = JSON.parse(Tx.cmd);
          const relevantIndexes = cmd.signers
            .map(
              (signer) =>
                publicKeys.find((key) => key.publicKey === signer.pubKey)
                  ?.index,
            )
            .filter((index) => index !== undefined) as number[];

          const service = keySourceManager.get(source);

          if (!service.isConnected()) {
            // call onConnect to connect to the keySource;
            // then the ui can prompt the user to unlock the wallet in case of hd-wallet
            await onConnect(keySource);
          }

          const signatures = await service.sign(
            Tx.hash,
            keySource.uuid,
            relevantIndexes,
          );

          return signatures;
        }),
      );
      return addSignatures(Tx, ...signatures.flat());
    }),
  );

  return signedTx;
}

export async function createProfile(
  profileName: string,
  password: string,
  networks: INetwork[],
) {
  const secretId = crypto.randomUUID();
  // create this in order to verify the password later
  const secret = await kadenaEncrypt(
    password,
    JSON.stringify({ secretId }),
    'buffer',
  );
  await walletRepository.addEncryptedValue(secretId, secret);
  const uuid = crypto.randomUUID();

  const profile: IProfile = {
    uuid,
    name: profileName,
    networks,
    secretId,
    accentColor: idToColor(uuid),
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
    return null;
  }
};

export async function createKey(keySource: IKeySource) {
  const service = keySourceManager.get(keySource.source);
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
