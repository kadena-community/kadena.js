import { homedir } from 'node:os';
import { join } from 'node:path';

export const ENV_KADENA_DIR = process.env.KADENA_DIR;

// app executable (for development run `npm link` or use the dev command)
export const CLINAME = 'kadena';
export const IS_TEST = process.env.VITEST === 'true';

// root folders
export const WORKING_DIRECTORY = process.cwd();
const HOME_DIRECTORY = homedir();
export const CWD_KADENA_DIR = join(WORKING_DIRECTORY, '.kadena');
export const HOME_KADENA_DIR = join(HOME_DIRECTORY, '.kadena');

// wallet path
export const WALLET_DIR = 'wallets';

// network path
export const NETWORKS_DIR = 'networks';

// templates
export const TX_TEMPLATE_FOLDER = 'transaction-templates';

// account path
export const ACCOUNT_DIR = 'accounts';

// Default settings path
export const DEFAULT_SETTINGS_PATH = 'defaults';

// key extensions
export const WALLET_EXT = '.wallet';
export const WALLET_LEGACY_EXT = '.legacy.wallet';
export const KEY_EXT = '.key';
export const YAML_EXT = '.yaml';
export const KEY_LEGACY_EXT = '.legacy.key';
export const PLAIN_KEY_EXT = '.key';
export const PLAIN_KEY_LEGACY_EXT = '.legacy.key';

export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
export const MAX_CHARACTERS_LENGTH = 80;

export const MAX_CHAIN_IDS: number = 20;
export const MAX_CHAIN_VALUE: number = MAX_CHAIN_IDS - 1;

export const INVALID_FILE_NAME_ERROR_MSG =
  'Do not use these characters: \\ / : * ? " < > |. Please choose a different name without these characters';
