import type { Command } from 'commander';
import { services } from '../../services/index.js';

import path from 'node:path';
import { writeAccountAliasMinimal } from '../../account/utils/createAccountConfigFile.js';
import { ACCOUNT_DIR } from '../../constants/config.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions, securityOptions } from '../../utils/globalOptions.js';
import { log } from '../../utils/logger.js';
import { relativeToCwd } from '../../utils/path.util.js';
import { walletOptions } from '../walletOptions.js';

/**
<<<<<<< Updated upstream
 * Generates a new key for the wallet.
 * @param {string} password - The password to encrypt the mnemonic with.
 * @param {boolean} legacy - Whether to use legacy format.
 * @returns {Promise<{words: string, seed: string}>} - The mnemonic words and seed.
 */
async function generateKey(
  password: string,
  legacy: boolean,
): Promise<{ words: string; seed: string }> {
  let words: string;
  let seed: string;

  if (legacy === true) {
    words = LegacyKadenaGenMnemonic();
    seed = await legacykadenaMnemonicToRootKeypair(password, words);
  } else {
    words = kadenaGenMnemonic();
    seed = await kadenaMnemonicToSeed(password, words);
  }

  return { words, seed };
}

export const generateWallet = async (
  walletName: string,
  password: string,
  legacy = false,
): Promise<
  CommandResult<{
    mnemonic: string;
    path: string;
  }>
> => {
  const existing = await getWallet(
    storageService.addWalletExtension(walletName, legacy),
  );

  if (existing !== null && existing.legacy === legacy) {
    return {
      status: 'error',
      errors: [`Wallet "${walletName}" already exists.`],
    };
  }

  const walletPath = join(WALLET_DIR, walletName);
  if (await services.filesystem.fileExists(walletPath)) {
    return {
      status: 'error',
      errors: [`Wallet named "${walletName}" already exists.`],
    };
  }

  const { words, seed } = await generateKey(password, legacy);

  const path = await storageService.storeWallet(seed, walletName, legacy);

  return {
    status: 'success',
    data: { mnemonic: words, path },
  };
};

/**
=======
>>>>>>> Stashed changes
 * Creates a command to generate wallets.
 * @param {Command} program - The commander program.
 * @param {string} version - The version of the program.
 */
export const createGenerateWalletCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'add',
  'Add a new wallet',
  [
    walletOptions.walletName({ isOptional: false }),
    securityOptions.createPasswordOption({
      message: 'Enter the new wallet password',
      confirmPasswordMessage: 'Re-enter the password',
    }),
    globalOptions.legacy({ isOptional: true, disableQuestion: true }),
    walletOptions.walletAccountCreate(),
  ],
  async (option, { collect }) => {
    const config = await collect(option);
    log.debug('create-wallet:action', config);

    try {
      const { wallet, words } = await services.wallet.create({
        alias: config.walletName,
        legacy: config.legacy,
        password: config.passwordFile,
      });
      log.output(log.generateTableString(['Mnemonic Phrase'], [[words]]));
      log.info(
        log.color.yellow(
          `\nPlease store the mnemonic phrase in a safe place. You will need it to recover your wallet.\n`,
        ),
      );
      log.output(
        log.generateTableString(
          ['Wallet Storage Location'],
          [[relativeToCwd(wallet.filepath)]],
        ),
      );
      if (config.walletAccountCreate) {
        const accountFilepath = path.join(ACCOUNT_DIR, `${wallet.alias}.yaml`);
        await writeAccountAliasMinimal(
          {
            accountName: `k:${wallet.keys[0].publicKey}`,
            fungible: 'coin',
            predicate: `keys-all`,
            publicKeysConfig: [wallet.keys[0].publicKey],
          },
          accountFilepath,
        );
        log.output(
          log.generateTableString(
            ['Account Storage Location'],
            [[relativeToCwd(accountFilepath)]],
          ),
        );
        // TODO: ask to fund created account
        // - prompt "Do you want to fund the account?"
        // - prompt network
        // - prompt chainId
      }
    } catch (error) {
      if (error instanceof Error) {
        log.error(error.message);
      }
    }
  },
);
