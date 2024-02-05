import { IPactCommand, IUnsignedCommand, addSignatures } from '@kadena/client';
import { kadenaDecrypt, kadenaEncrypt } from '@kadena/hd-wallet';
import { KeySourceWithSecret } from '../key-source/interface';
import { IKeySourceManager } from '../key-source/keySourceService';
import { INetwork } from '../network/network.repository';
import {
  IAccount,
  IKeyItem,
  IKeySource,
  IProfile,
  WalletRepository,
} from './wallet.repository';

interface Context {
  walletRepository: WalletRepository;
  keySourceManager: IKeySourceManager;
  profile: IProfile;
}

export function getProfile({
  walletRepository,
  profile,
}: Pick<Context, 'walletRepository' | 'profile'>) {
  return walletRepository.getProfile(profile.uuid);
}

export function getAccounts({
  walletRepository,
  profile,
}: Pick<Context, 'walletRepository' | 'profile'>) {
  return walletRepository.getAccountsByProfileId(profile.uuid);
}

export const getSecret = async (
  { walletRepository }: Pick<Context, 'walletRepository'>,
  secret: string | Uint8Array,
) => {
  if (secret === undefined || secret === null) {
    return new Uint8Array();
  }
  if (typeof secret !== 'string') {
    throw new Error('Secret ket must be a string');
  }
  return walletRepository.getEncryptedValue(secret);
};

const storeSecret = async (
  { walletRepository }: Pick<Context, 'walletRepository'>,
  secret: string | Uint8Array,
) => {
  if (secret !== null && secret !== undefined && typeof secret !== 'string') {
    const secretId = crypto.randomUUID();
    await walletRepository.addEncryptedValue(secretId, secret);
    return secretId;
  }
  return secret;
};

export function sign(
  context: Context,
  onConnect: (keySource: IKeySource) => Promise<void>,
  TXs: IUnsignedCommand[],
) {
  const { keySourceManager, profile } = context;
  const signedTx = Promise.all(
    TXs.map(async (Tx) => {
      const signatures = await Promise.all(
        profile.keySources.map(async (keySource) => {
          const { keys: publicKeys, source } = keySource;
          const cmd: IPactCommand = JSON.parse(Tx.cmd);
          const relevantIndexes = cmd.signers
            .map(
              (signer) =>
                publicKeys.find((key) => key.publicKey === signer.pubKey)
                  ?.index,
            )
            .filter((index) => index !== undefined) as number[];

          if (source !== 'hd-wallet-slip10') {
            console.warn('Unsupported key source', source);
            return [];
          }

          const service = keySourceManager.get(keySource.source);

          if (!service.isReady()) {
            // call onConnect to connect to the keySource;
            // then the ui can prompt the user to unlock the wallet in case of hd-wallet
            await onConnect(keySource);
          }

          const signatures = await service.sign(
            Tx.hash,
            {
              ...keySource,
              secret: await getSecret(context, keySource.secret),
            },
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
  { walletRepository }: Pick<Context, 'walletRepository'>,
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
  const profile: IProfile = {
    uuid: crypto.randomUUID(),
    name: profileName,
    networks,
    keySources: [],
    secretId,
  };
  await walletRepository.addProfile(profile);
  return profile;
}

export const unlockProfile = async (
  { walletRepository }: Pick<Context, 'walletRepository'>,
  profileId: string,
  password: string,
) => {
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

export async function storeKeySource(
  context: Pick<Context, 'walletRepository'>,
  keySource: KeySourceWithSecret | IKeySource,
  profileId: string,
) {
  const { walletRepository } = context;
  const profile = await walletRepository.getProfile(profileId);
  const keySourceToStore = {
    ...keySource,
    secret: await storeSecret(context, keySource.secret),
  };
  profile.keySources.push(keySourceToStore);
  await walletRepository.updateProfile(profile);
}

export async function createKey(
  context: Context,
  keySource: KeySourceWithSecret | IKeySource,
  quantity: number,
) {
  const { walletRepository, keySourceManager: keySourceService } = context;
  const profile = await getProfile(context);
  if (keySource.source !== 'hd-wallet-slip10') {
    throw new Error('Unsupported key source');
  }
  const service = keySourceService.get(keySource.source);
  const keys = await service.createKey(
    {
      ...keySource,
      secret: await getSecret(context, keySource.secret),
    },
    quantity,
  );

  profile.keySources = profile.keySources.map((source) => {
    if (source.uuid === keySource.uuid) {
      return { ...source, keys: [...source.keys, ...keys] };
    }
    return source;
  });

  await walletRepository.updateProfile(profile);
  return keys;
}

export async function createKAccount(
  { profile, walletRepository }: Pick<Context, 'walletRepository' | 'profile'>,
  keyItem: IKeyItem,
) {
  const account: IAccount = {
    uuid: crypto.randomUUID(),
    alias: '',
    profileId: profile.uuid,
    address: `k:${keyItem.publicKey}`,
    guard: {
      type: 'keySet',
      pred: 'keys-any',
      publicKeys: [keyItem],
    },
  };

  await walletRepository.addAccount(account);
  return account;
}

export const createFirstAccount = async (
  {
    profile,
    walletRepository,
    keySourceManager,
  }: Pick<Context, 'walletRepository' | 'profile' | 'keySourceManager'>,
  keySource: KeySourceWithSecret,
) => {
  if (!keySourceManager || !profile || !walletRepository) {
    throw new Error('Wallet not initialized');
  }

  const service = keySourceManager.get(keySource.source);
  const keys = await service.createKey(keySource, 1);

  await storeKeySource(
    { walletRepository },
    { ...keySource, keys },
    profile.uuid,
  );

  return createKAccount({ profile, walletRepository }, keys[0]);
};

export async function decryptSecret(
  { walletRepository }: Pick<Context, 'walletRepository'>,
  password: string,
  secretId: string,
) {
  const encrypted = await walletRepository.getEncryptedValue(secretId);
  if (!encrypted) {
    throw new Error('No record found');
  }
  const decryptedBuffer = await kadenaDecrypt(password, encrypted);
  const mnemonic = new TextDecoder().decode(decryptedBuffer);
  return mnemonic;
}
