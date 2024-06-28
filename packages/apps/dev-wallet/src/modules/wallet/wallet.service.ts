import { defaultAccentColor } from '@/modules/layout/layout.provider.tsx';
import {
  addSignatures,
  ICommand,
  IPactCommand,
  IUnsignedCommand,
} from '@kadena/client';
import { kadenaDecrypt, kadenaEncrypt } from '@kadena/hd-wallet';
import { accountRepository } from '../account/account.repository';
import { keySourceManager } from '../key-source/key-source-manager';
import { INetwork } from '../network/network.repository';
import {
  IKeyItem,
  IKeySource,
  IProfile,
  walletRepository,
} from './wallet.repository';

export function getProfile(profileId: string) {
  return walletRepository.getProfile(profileId);
}

export function getAccounts(profileId: string) {
  return accountRepository.getAccountsByProfileId(profileId);
}

export async function sign(
  keySources: IKeySource[],
  onConnect: (keySource: IKeySource) => Promise<void>,
  TXs: IUnsignedCommand[],
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
            publicKeys.find((key) => key.publicKey === signer.pubKey)?.index,
        )
        .filter((index) => index !== undefined) as number[] | string[];

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
    accentColor: accentColor || defaultAccentColor,
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
