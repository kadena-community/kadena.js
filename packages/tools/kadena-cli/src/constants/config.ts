import { vol } from 'memfs';
import { statSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { log } from '../utils/logger.js';

const ENV_KADENA_DIR = process.env.KADENA_DIR;

// app executable (for development run `npm link` or use the dev command)
export const CLINAME = 'kadena';
export const IS_TEST = process.env.VITEST === 'true';

// using services root causes a circular dependency
// use native methods instead
const directoryExists = (path?: string): boolean => {
  if (path === undefined) return false;
  try {
    const stat = IS_TEST ? vol.statSync.bind(vol) : statSync;
    return stat(path).isDirectory();
  } catch (e) {
    return false;
  }
};

// root folders
export const WORKING_DIRECTORY = process.cwd();
const HOME_DIRECTORY = homedir();
export const CWD_KADENA_DIR = join(WORKING_DIRECTORY, '.kadena');
export const HOME_KADENA_DIR = join(HOME_DIRECTORY, '.kadena');

export const KADENA_DIR = (() => {
  // Priority 1: ENV KADENA_DIR
  if (directoryExists(ENV_KADENA_DIR)) {
    return ENV_KADENA_DIR!;
  } else if (ENV_KADENA_DIR !== undefined) {
    log.warning(
      `Warning: 'KADENA_DIR' environment variable is set to a non-existent directory: ${ENV_KADENA_DIR}`,
    );
    log.warning();
  }
  // Priority 2: CWD .kadena dir
  if (directoryExists(CWD_KADENA_DIR)) {
    return CWD_KADENA_DIR;
  }
  // Priority 3: HOME .kadena dir
  if (directoryExists(HOME_KADENA_DIR)) {
    return HOME_KADENA_DIR;
  }
  // No directory found, instruct the user to run `kadena config init`
  return null;
})();

// wallet path
// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
export const WALLET_DIR = KADENA_DIR && `${KADENA_DIR}/wallets`;

// wallet path
// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
export const NETWORKS_DIR = KADENA_DIR && `${KADENA_DIR}/networks`;

// templates
export const TX_TEMPLATE_FOLDER =
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  KADENA_DIR && `${KADENA_DIR}/transaction-templates`;

// account path
// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
export const ACCOUNT_DIR = KADENA_DIR && `${KADENA_DIR}/accounts`;

// Default settings path
// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
export const DEFAULT_SETTINGS_PATH = KADENA_DIR && `${KADENA_DIR}/defaults`;

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
