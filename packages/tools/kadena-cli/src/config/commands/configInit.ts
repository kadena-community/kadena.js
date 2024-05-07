import type { Command } from 'commander';
import path from 'path';
import { ACCOUNT_DIR } from '../../constants/config.js';
import { getNetworkFiles } from '../../constants/networks.js';
import { ensureNetworksConfiguration } from '../../networks/utils/networkHelpers.js';
import { Services } from '../../services/index.js';
import { KadenaError } from '../../services/service-error.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions, securityOptions } from '../../utils/globalOptions.js';
import { log } from '../../utils/logger.js';
import {
  createAccountAliasByPublicKey,
  logAccountCreation,
  logWalletInfo,
} from '../../wallets/utils/walletHelpers.js';
import { walletOptions } from '../../wallets/walletOptions.js';
import { configOptions } from '../configOptions.js';

export const createConfigInitCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'init',
  'Initialize default configuration of the Kadena CLI',
  [
    configOptions.location(),
    walletOptions.createWalletConfirmation(),
    walletOptions.walletName({ isOptional: false }),
    securityOptions.createPasswordOption({
      message: 'Enter the new wallet password:',
      confirmPasswordMessage: 'Re-enter the password:',
    }),
    globalOptions.legacy({ isOptional: true, disableQuestion: true }),
    walletOptions.createAccount(),
  ],
  async (option) => {
    const { location } = await option.location();
    log.debug('config init', { location });
    const services = new Services({
      configDirectory: location,
    });
    const exists = await services.filesystem.directoryExists(location);
    if (exists) {
      log.warning(`The configuration directory already exists at ${location}`);
      return;
    }

    await services.filesystem.ensureDirectoryExists(location);

    await ensureNetworksConfiguration(location);

    log.info(log.color.green('Created configuration directory:\n'));
    log.info(`  ${location}\n`);
    log.info(log.color.green(`Added default networks:\n`));
    log.info(
      `${Object.keys(getNetworkFiles(location))
        .map((x) => `  - ${x}`)
        .join('\n')}`,
    );

    const { createWallet } = await option.createWallet();
    if (createWallet === 'false') {
      log.info('Configuration initialized without creating a wallet.');
      return;
    }

    const { walletName } = await option.walletName();
    const { passwordFile } = await option.passwordFile();
    const { legacy } = await option.legacy();
    const { createAccount } = await option.createAccount();

    const created = await services.wallet.create({
      alias: walletName,
      legacy: legacy,
      password: passwordFile,
    });
    let { wallet } = created;
    const key = await services.wallet.generateKey({
      seed: wallet.seed,
      legacy: wallet.legacy,
      password: passwordFile,
      index: 0,
    });

    wallet = await services.wallet.storeKey(wallet, key);

    logWalletInfo(created.words, wallet.filepath, key.publicKey);

    if (createAccount === 'true') {
      const directory = services.config.getDirectory();
      if (directory === null) {
        throw new KadenaError('no_kadena_directory');
      }

      const accountDir = path.join(directory, ACCOUNT_DIR);
      const { accountName, accountFilepath } =
        await createAccountAliasByPublicKey(
          wallet.alias,
          wallet.keys[0].publicKey,
          accountDir,
        );
      logAccountCreation(accountName, accountFilepath);
    }
  },
);
