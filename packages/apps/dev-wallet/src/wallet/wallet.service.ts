import {
  ICommand,
  IPactCommand,
  IUnsignedCommand,
  addSignatures,
} from '@kadena/client';
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

export interface IWalletService {
  getProfile: () => IProfile;
  getKeySources: () => Promise<IKeySource[]>;
  getAccounts: () => Promise<IAccount[]>;
  createKAccount: (keySourceId: string) => Promise<IAccount>;
  createKeySource: (derivationPathTemplate?: string) => Promise<IKeySource>;
  createPublicKeys: (
    quantity: number | undefined,
    keySourceId: string,
  ) => Promise<IKeyItem[]>;
  createAccount: (account: IAccount) => Promise<void>;
  sign: (TXs: IUnsignedCommand[]) => Promise<(IUnsignedCommand | ICommand)[]>;
  decryptMnemonic: (password: string) => Promise<string>;
}

// For now wa just support hd-wallet keySources; we need to refactor this to support other types of keySources
export function walletService(
  walletRepository: WalletRepository,
  profile: IProfile,
  encryptionKey: Uint8Array,
  encryptedSeed: Uint8Array,
): IWalletService {
  const getProfile = () => profile;
  const getKeySources = async () => {
    const keySources = await walletRepository.getKeySourcesByProfileId(
      profile.uuid,
    );
    return keySources;
  };
  const createKAccount = async (keySourceId: string) => {
    const publicKeys = await createPublicKeys(1, keySourceId);

    const account: IAccount = {
      uuid: crypto.randomUUID(),
      alias: '',
      profileId: profile.uuid,
      address: `k:${publicKeys[0].publicKey}`,
      guard: {
        type: 'keySet',
        pred: 'keys-any',
        publicKeys: publicKeys,
      },
    };
    await walletRepository.addAccount(account);
    return account;
  };

  const createKeySource = async (
    derivationPathTemplate = DEFAULT_DERIVATION_PATH_TEMPLATE,
  ) => {
    const keySource: IKeySource = {
      uuid: crypto.randomUUID(),
      source: 'hd-wallet',
      derivationPathTemplate,
      publicKeys: [],
      profileId: profile.uuid,
    };
    await walletRepository.addKeySource(keySource);
    return keySource;
  };

  const createPublicKeys = async (
    quantity = 1,
    keySourceId: string,
  ): Promise<IKeyItem[]> => {
    const keySource = await walletRepository.getKeySource(keySourceId);

    const keyIndex = keySource.publicKeys.length;

    const newPublicKeys = await kadenaGetPublic(
      encryptionKey,
      encryptedSeed,
      [keyIndex, keyIndex + quantity - 1],
      keySource.derivationPathTemplate,
    );

    const updatedKeySource = {
      ...keySource,
      publicKeys: [...keySource.publicKeys, ...newPublicKeys],
    };

    await walletRepository.updateKeySource(updatedKeySource);
    return newPublicKeys.map((publicKey, index) => ({
      publicKey,
      keySourceId,
      index: keyIndex + index,
    }));
  };

  const createAccount = async (account: IAccount) => {
    await walletRepository.addAccount(account);
  };

  const sign = async (TXs: IUnsignedCommand[]) => {
    if (!encryptedSeed) {
      throw new Error('Wallet is not unlocked');
    }

    const keySources = await walletRepository.getKeySourcesByProfileId(
      profile.uuid,
    );

    const signedTx = Promise.all(
      TXs.map(async (Tx) => {
        const signatures = await Promise.all(
          keySources.map(async ({ publicKeys, derivationPathTemplate }) => {
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
          }),
        );
        return addSignatures(Tx, ...signatures.flat());
      }),
    );

    return signedTx;
  };

  const decryptMnemonic = async (password: string) => {
    if (!encryptedSeed || !profile || !walletRepository) {
      throw new Error('Wallet is not unlocked');
    }
    const encryptedMnemonic = await walletRepository.getEncryptedValue(
      profile.HDWalletSeedKey,
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

  const getAccounts = async () => {
    return walletRepository.getAccountsByProfileId(profile.uuid);
  };

  return {
    getProfile,
    getKeySources,
    getAccounts,
    createKAccount,
    createKeySource,
    createPublicKeys,
    createAccount,
    sign,
    decryptMnemonic,
  };
}

export const walletFactory = (walletRepository: WalletRepository) => ({
  async createWallet(profileName: string, password: string, mnemonic: string) {
    if (!walletRepository) {
      throw new Error('Wallet repository not initialized');
    }
    const mnemonicKey = crypto.randomUUID();
    const encryptedMnemonic = await kadenaEncrypt(password, mnemonic, 'buffer');
    await walletRepository.addEncryptedValue(mnemonicKey, encryptedMnemonic);

    const profile: IProfile = {
      uuid: crypto.randomUUID(),
      name: profileName,
      networks: [],
      HDWalletSeedKey: mnemonicKey,
    };

    await walletRepository.addProfile(profile);
    const encryptionKey = randomBytes(32);
    const encryptedSeed = await kadenaMnemonicToSeed(
      encryptionKey,
      mnemonic,
      'buffer',
    );
    const service = walletService(
      walletRepository,
      profile,
      encryptionKey,
      encryptedSeed,
    );
    const keySource = await service.createKeySource();
    await service.createKAccount(keySource.uuid);
    return service;
  },

  async unlockWallet(profileId: string, password: string) {
    if (!walletRepository) {
      throw new Error('Wallet repository not initialized');
    }
    const profile = await walletRepository.getProfile(profileId);
    const encryptedMnemonic = await walletRepository.getEncryptedValue(
      profile.HDWalletSeedKey,
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

    const service = walletService(
      walletRepository,
      profile,
      encryptionKey,
      encryptedSeed,
    );

    return service;
  },
});
