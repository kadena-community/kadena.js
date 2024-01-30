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
  WalletRepositoryTx,
} from './wallet.repository';

const DEFAULT_DERIVATION_PATH_TEMPLATE = `m'/44'/626'/<index>'`;

type ServiceProps = {
  walletRepository: WalletRepository | WalletRepositoryTx;
  profile: IProfile;
  encryptionKey: Uint8Array;
  encryptedSeed: Uint8Array;
};

const createTxIfItsNot = (
  walletRepository: WalletRepository | WalletRepositoryTx,
) => {
  const wr: WalletRepositoryTx =
    'commit' in walletRepository
      ? walletRepository
      : walletRepository.createTransactionContext();

  return wr;
};

const addPublicKeysToKeySource =
  ({ walletRepository }: Pick<ServiceProps, 'walletRepository'>) =>
  async (keySourceId: string, newPublicKeys: string[]): Promise<IKeyItem[]> => {
    const keySource = await walletRepository.getKeySource(keySourceId);
    const keyIndex = keySource.publicKeys.length;

    const updatedKeySource = {
      ...keySource,
      publicKeys: [...keySource.publicKeys, ...newPublicKeys],
    };

    await walletRepository.updateKeySource(updatedKeySource);
    return newPublicKeys.map((publicKey, index) => ({
      publicKey,
      keySourceId: keySource.uuid,
      index: keyIndex + index,
    }));
  };

const createPublicKeys =
  ({
    walletRepository,
    encryptionKey,
    encryptedSeed,
  }: Pick<
    ServiceProps,
    'walletRepository' | 'encryptedSeed' | 'encryptionKey'
  >) =>
  async (quantity = 1, keySourceId: string): Promise<IKeyItem[]> => {
    const keySource = await walletRepository.getKeySource(keySourceId);

    const keyIndex = keySource.publicKeys.length;

    const newPublicKeys = await kadenaGetPublic(
      encryptionKey,
      encryptedSeed,
      [keyIndex, keyIndex + quantity - 1],
      keySource.derivationPathTemplate,
    );

    await addPublicKeysToKeySource({ walletRepository })(
      keySource.uuid,
      newPublicKeys,
    );

    return newPublicKeys.map((publicKey, index) => ({
      publicKey,
      keySourceId,
      index: keyIndex + index,
    }));
  };

const createKAccount =
  (props: ServiceProps) => async (keySourceId: string, publicKey: string) => {
    const { walletRepository, profile } = props;
    const txBasedRepository = createTxIfItsNot(walletRepository);
    try {
      const publicKeys = await addPublicKeysToKeySource({
        ...props,
        walletRepository: txBasedRepository,
      })(keySourceId, [publicKey]);

      const account: IAccount = {
        uuid: crypto.randomUUID(),
        alias: '',
        profileId: profile.uuid,
        address: `k:${publicKey}`,
        guard: {
          type: 'keySet',
          pred: 'keys-any',
          publicKeys: publicKeys,
        },
      };
      await txBasedRepository.addAccount(account);
      // tx commit will happen automatically; if we get here, it means that the transaction was successful
      return account;
    } catch (e) {
      console.log('TRYING TO ABORT', e);
      txBasedRepository.abort();
      throw e;
    }
  };

const createKeySource =
  ({
    walletRepository,
    profile,
  }: Pick<ServiceProps, 'profile' | 'walletRepository'>) =>
  async (derivationPathTemplate = DEFAULT_DERIVATION_PATH_TEMPLATE) => {
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

const createAccount =
  ({ walletRepository }: Pick<ServiceProps, 'walletRepository'>) =>
  async (account: IAccount) => {
    await walletRepository.addAccount(account);
  };

const getKeySources =
  ({
    walletRepository,
    profile,
  }: Pick<ServiceProps, 'walletRepository' | 'profile'>) =>
  async () => {
    const keySources = await walletRepository.getKeySourcesByProfileId(
      profile.uuid,
    );
    return keySources;
  };

const getAccounts =
  ({
    walletRepository,
    profile,
  }: Pick<ServiceProps, 'walletRepository' | 'profile'>) =>
  async () => {
    return walletRepository.getAccountsByProfileId(profile.uuid);
  };

const sign =
  ({ walletRepository, encryptedSeed, encryptionKey, profile }: ServiceProps) =>
  async (TXs: IUnsignedCommand[]) => {
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

const decryptMnemonic =
  ({
    walletRepository,
    profile,
  }: Pick<ServiceProps, 'walletRepository' | 'profile'>) =>
  async (password: string) => {
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

const createProfileAndFirstAccount =
  (
    props: Pick<
      ServiceProps,
      'encryptedSeed' | 'encryptionKey' | 'walletRepository'
    >,
  ) =>
  async (profileName: string, encryptedMnemonic: Uint8Array) => {
    const { walletRepository, encryptionKey, encryptedSeed } = props;
    const txBasedRepository = createTxIfItsNot(walletRepository);
    try {
      const mnemonicKey = crypto.randomUUID();

      const newPublicKeys = await kadenaGetPublic(
        encryptionKey,
        encryptedSeed,
        1,
        DEFAULT_DERIVATION_PATH_TEMPLATE,
      );

      await txBasedRepository.addEncryptedValue(mnemonicKey, encryptedMnemonic);

      const profile: IProfile = {
        uuid: crypto.randomUUID(),
        name: profileName,
        networks: [],
        HDWalletSeedKey: mnemonicKey,
      };

      const updatedConfig = {
        ...props,
        profile,
        walletRepository: txBasedRepository,
      };

      await txBasedRepository.addProfile(profile);

      const keySource = await createKeySource(updatedConfig)();
      await createKAccount(updatedConfig)(keySource.uuid, newPublicKeys);
      return profile;
    } catch (e) {
      txBasedRepository.abort();
      throw e;
    }
  };

export interface IWalletService {
  getProfile: () => IProfile;
  getKeySources: () => Promise<IKeySource[]>;
  getAccounts: () => Promise<IAccount[]>;
  createKAccount: (keySourceId: string, publicKey: string) => Promise<IAccount>;
  createKeySource: (derivationPathTemplate?: string) => Promise<IKeySource>;
  addPublicKeysToKeySource: (
    keySourceId: string,
    newPublicKeys: string[],
  ) => Promise<IKeyItem[]>;
  createPublicKeys: (
    quantity: number | undefined,
    keySourceId: string,
  ) => Promise<IKeyItem[]>;
  createAccount: (account: IAccount) => Promise<void>;
  sign: (TXs: IUnsignedCommand[]) => Promise<(IUnsignedCommand | ICommand)[]>;
  decryptMnemonic: (password: string) => Promise<string>;
}

// For now wa just support hd-wallet keySources; we need to refactor this to support other types of keySources
export function walletService(config: ServiceProps): IWalletService {
  const { profile } = config;
  const getProfile = () => profile;

  return {
    getProfile,
    getKeySources: getKeySources(config),
    getAccounts: getAccounts(config),
    createKAccount: createKAccount(config),
    createKeySource: createKeySource(config),
    addPublicKeysToKeySource: addPublicKeysToKeySource(config),
    createAccount: createAccount(config),
    createPublicKeys: createPublicKeys(config),
    sign: sign(config),
    decryptMnemonic: decryptMnemonic(config),
  };
}

export const walletFactory = (walletRepository: WalletRepository) => ({
  async createWallet(profileName: string, password: string, mnemonic: string) {
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

    const profile = await createProfileAndFirstAccount({
      walletRepository,
      encryptionKey,
      encryptedSeed,
    })(profileName, encryptedMnemonic);

    const service = walletService({
      walletRepository,
      profile,
      encryptionKey,
      encryptedSeed,
    });

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

    const service = walletService({
      walletRepository,
      profile,
      encryptionKey,
      encryptedSeed,
    });

    return service;
  },
});
