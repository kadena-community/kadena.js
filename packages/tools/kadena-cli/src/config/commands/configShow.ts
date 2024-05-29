import type { Table } from 'cli-table3';
import type { Command } from 'commander';
import path from 'node:path';
import {
  ACCOUNT_DIR,
  NETWORKS_DIR,
  TX_TEMPLATE_FOLDER,
  WALLET_DIR,
} from '../../constants/config.js';
import { services } from '../../services/index.js';
import { KadenaError } from '../../services/service-error.js';
import { createCommand } from '../../utils/createCommand.js';
import { getDefaultNetworkName } from '../../utils/helpers.js';
import { log } from '../../utils/logger.js';
import { createTable } from '../../utils/table.js';

const getConfigPaths = (kadenaDir: string): Record<string, string> => ({
  configDirectory: kadenaDir,
  walletDirectory: path.join(kadenaDir, WALLET_DIR),
  defaultTemplateDirectory: path.join(kadenaDir, TX_TEMPLATE_FOLDER),
  networkDirectory: path.join(kadenaDir, NETWORKS_DIR),
  accountDirectory: path.join(kadenaDir, ACCOUNT_DIR),
});

const getNumberOfFiles = async (directory: string): Promise<number> => {
  return (await services.filesystem.readDir(directory).catch(() => [])).length;
};

const calculateDirectoryFileCounts = async (
  config: Record<string, string>,
): Promise<Record<string, number>> => {
  const [
    numberOfWallets,
    numberOfTemplates,
    numberOfNetworks,
    numberOfAccounts,
  ] = await Promise.all([
    getNumberOfFiles(config.walletDirectory),
    getNumberOfFiles(config.defaultTemplateDirectory),
    getNumberOfFiles(config.networkDirectory),
    getNumberOfFiles(config.accountDirectory),
  ]);

  return {
    numberOfWallets,
    numberOfTemplates,
    numberOfNetworks,
    numberOfAccounts,
  };
};

const generateTabularData = async (
  config: Record<string, string | number>,
): Promise<Table> => {
  const table = createTable({});
  table.push(
    { [log.color.green('Config path')]: config.configDirectory },
    { [log.color.green('Wallet path')]: config.walletDirectory },
    { [log.color.green('Number of wallets')]: config.numberOfWallets },
    {
      [log.color.green('Default template path')]:
        config.defaultTemplateDirectory,
    },
    { [log.color.green('Number of templates')]: config.numberOfTemplates },
    { [log.color.green('Network path')]: config.networkDirectory },
    { [log.color.green('Number of networks')]: config.numberOfNetworks },
    { [log.color.green('Default network')]: config.defaultNetwork },
    { [log.color.green('Account path')]: config.accountDirectory },
    { [log.color.green('Number of accounts')]: config.numberOfAccounts },
  );

  return table;
};

export const createConfigShowCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'show',
  'Displays the current config location and counts of different resources like wallets, templates, networks, accounts and etc.)',
  [],
  async () => {
    log.debug('config show');

    const kadenaDir = services.config.getDirectory();
    if (kadenaDir === null) {
      throw new KadenaError('no_kadena_directory');
    }

    log.info(log.color.green('Currently using the following config:'));
    const configPaths = getConfigPaths(kadenaDir);
    const directoryFileCounts = await calculateDirectoryFileCounts(configPaths);
    const defaultNetwork = (await getDefaultNetworkName()) ?? 'N/A';

    const config = {
      ...configPaths,
      ...directoryFileCounts,
      defaultNetwork,
    };
    const table = await generateTabularData(config);

    log.output(table.toString(), config);
  },
);
