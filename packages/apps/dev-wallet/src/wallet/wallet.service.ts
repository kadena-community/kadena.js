import { IPactCommand, IUnsignedCommand, addSignatures } from '@kadena/client';
import {
  kadenaDecrypt,
  kadenaEncrypt,
  kadenaGetPublic,
  kadenaMnemonicToSeed,
  kadenaSignWithSeed,
  randomBytes,
} from '@kadena/hd-wallet';
import {
  IAccount,
  IKeyItem,
  IKeySource,
  IProfile,
  WalletRepository,
} from './wallet.repository';

const DEFAULT_DERIVATION_PATH_TEMPLATE = `m'/44'/626'/<index>'`;

export type WalletContextType = {
  walletRepository: WalletRepository;
  profile: IProfile;
  encryptionKey: Uint8Array;
  encryptedSeed: Uint8Array;
};

export const getProfile = ({
  walletRepository,
  profile,
}: Pick<WalletContextType, 'walletRepository' | 'profile'>) => {
  return walletRepository.getProfile(profile.uuid);
};

export const getAccounts = ({
  walletRepository,
  profile,
}: Pick<WalletContextType, 'walletRepository' | 'profile'>) => {
  return walletRepository.getAccountsByProfileId(profile.uuid);
};

export const sign = (
  {
    encryptedSeed,
    encryptionKey,
    profile,
  }: Pick<WalletContextType, 'encryptedSeed' | 'encryptionKey' | 'profile'>,
  TXs: IUnsignedCommand[],
) => {
  if (!encryptedSeed) {
    throw new Error('Wallet is not unlocked');
  }

  const signedTx = Promise.all(
    TXs.map(async (Tx) => {
      const signatures = await Promise.all(
        profile.keySources.map(
          async ({ publicKeys, derivationPathTemplate }) => {
            const cmd: IPactCommand = JSON.parse(Tx.cmd);
            const relevantIndexes = cmd.signers
              .map((signer) =>
                publicKeys.findIndex(
                  (publicKey) => publicKey === signer.pubKey,
                ),
              )
              .filter((index) => index !== undefined) as number[];

            const signatures = await kadenaSignWithSeed(
              encryptionKey,
              encryptedSeed,
              relevantIndexes,
              derivationPathTemplate,
            )(Tx.hash);

            return signatures;
          },
        ),
      );
      return addSignatures(Tx, ...signatures.flat());
    }),
  );

  return signedTx;
};

export const decryptMnemonic = async (
  {
    walletRepository,
    profile,
  }: Pick<WalletContextType, 'walletRepository' | 'profile'>,
  password: string,
) => {
  const encryptedMnemonic = await walletRepository.getEncryptedValue(
    profile.seedKey,
  );
  if (!encryptedMnemonic) {
    throw new Error('No wallet found');
  }
  const decryptedMnemonicBuffer = await kadenaDecrypt(
    password,
    encryptedMnemonic,
  );
  const mnemonic = new TextDecoder().decode(decryptedMnemonicBuffer);
  return mnemonic;
};

export const createKAccount = async (
  {
    profile,
    walletRepository,
  }: Pick<WalletContextType, 'walletRepository' | 'profile'>,
  keyItem: IKeyItem,
) => {
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
};

export const createProfile = async (
  {
    walletRepository,
    encryptionKey,
    encryptedSeed,
  }: Pick<
    WalletContextType,
    'encryptedSeed' | 'encryptionKey' | 'walletRepository'
  >,
  profileName: string,
  encryptedMnemonic: Uint8Array,
) => {
  const mnemonicKey = crypto.randomUUID();

  const publicKey = await kadenaGetPublic(
    encryptionKey,
    encryptedSeed,
    1,
    DEFAULT_DERIVATION_PATH_TEMPLATE,
  );

  await walletRepository.addEncryptedValue(mnemonicKey, encryptedMnemonic);

  const profileId = crypto.randomUUID();

  const keySource: IKeySource = {
    uuid: crypto.randomUUID(),
    source: 'hd-wallet',
    derivationPathTemplate: DEFAULT_DERIVATION_PATH_TEMPLATE,
    publicKeys: [publicKey],
  };

  const profile: IProfile = {
    uuid: profileId,
    name: profileName,
    networks: [],
    seedKey: mnemonicKey,
    keySources: [keySource],
  };

  await walletRepository.addProfile(profile);

  return profile;
};

export async function createWallet(
  walletRepository: WalletRepository,
  profileName: string,
  password: string,
  mnemonic: string,
) {
  if (!walletRepository) {
    throw new Error('Wallet repository not initialized');
  }

  const encryptionKey = randomBytes(32);
  const encryptedSeed = await kadenaMnemonicToSeed(
    encryptionKey,
    mnemonic,
    'buffer',
  );

  const encryptedMnemonic = await kadenaEncrypt(password, mnemonic, 'buffer');

  const profile = await createProfile(
    {
      walletRepository,
      encryptionKey,
      encryptedSeed,
    },
    profileName,
    encryptedMnemonic,
  );

  await createKAccount(
    { profile, walletRepository },
    {
      index: 0,
      keySourceId: profile.keySources[0].uuid,
      publicKey: profile.keySources[0].publicKeys[0],
    },
  );

  const context: WalletContextType = {
    walletRepository,
    profile,
    encryptionKey,
    encryptedSeed,
  };

  return context;
}

export async function unlockWallet(
  walletRepository: WalletRepository,
  profileId: string,
  password: string,
) {
  const profile = await walletRepository.getProfile(profileId);
  const encryptedMnemonic = await walletRepository.getEncryptedValue(
    profile.seedKey,
  );
  const decryptedMnemonicBuffer = await kadenaDecrypt(
    password,
    encryptedMnemonic,
  );

  const mnemonic = new TextDecoder().decode(decryptedMnemonicBuffer);
  const encryptionKey = randomBytes(32);
  const encryptedSeed = await kadenaMnemonicToSeed(
    encryptionKey,
    mnemonic,
    'buffer',
  );

  const context: WalletContextType = {
    walletRepository,
    profile,
    encryptionKey,
    encryptedSeed,
  };

  return context;
}
