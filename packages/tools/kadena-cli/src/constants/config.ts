import { isAbsolute, join } from 'node:path';

const ENV_KADNEA_DIR = process.env.ENV_KADNEA_DIR;

// app executable (for development run `npm link` or use the dev command)
export const CLINAME = 'kadena';

// root folders
export const WORKING_DIRECTORY = process.cwd();
const DEFAULT_KADENA_DIR = join(WORKING_DIRECTORY, '.kadena');

export const KADENA_DIR = (() => {
  if (ENV_KADNEA_DIR !== undefined) {
    return isAbsolute(ENV_KADNEA_DIR)
      ? ENV_KADNEA_DIR
      : join(WORKING_DIRECTORY, ENV_KADNEA_DIR);
  }
  return DEFAULT_KADENA_DIR;
})();

// wallet path
export const WALLET_DIR = `${KADENA_DIR}/wallets`;

// plain key path
export const PLAIN_KEY_DIR = `${KADENA_DIR}/keys`;

// transactions
export const TRANSACTION_FOLDER_NAME = 'transactions';
export const TRANSACTION_PATH = `${KADENA_DIR}/${TRANSACTION_FOLDER_NAME}`;

// templates
export const TX_TEMPLATE_FOLDER = `${KADENA_DIR}/transaction-templates`;

// account path
export const ACCOUNT_DIR: string = `${KADENA_DIR}/accounts`;

// key extensions
export const WALLET_EXT = '.wallet';
export const WALLET_LEGACY_EXT = '.legacy.wallet';
export const KEY_EXT = '.key';
export const KEY_LEGACY_EXT = '.legacy.key';
export const PLAIN_KEY_EXT = '.key';
export const PLAIN_KEY_LEGACY_EXT = '.legacy.key';

export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
export const MAX_CHARACTERS_LENGTH = 80;
