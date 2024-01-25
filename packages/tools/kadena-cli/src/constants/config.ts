// appN name
export const CLINAME: string = 'bin/kadena-cli.js';

// root folders
export const PROJECT_ROOT_PATH = process.cwd();
export const PROJECT_ROOT_FOLDER = '/.kadena';
export const WORK_PATH: string = `${PROJECT_ROOT_PATH}${PROJECT_ROOT_FOLDER}`;

// wallet path
export const WALLET_DIR: string = `${PROJECT_ROOT_PATH}${PROJECT_ROOT_FOLDER}/wallets`;

// plain key path
export const PLAIN_KEY_DIR: string = `${PROJECT_ROOT_PATH}${PROJECT_ROOT_FOLDER}/keys`;

// transactions
export const TRANSACTION_FOLDER_NAME = 'transactions';
export const TRANSACTION_PATH = `${PROJECT_ROOT_PATH}/${TRANSACTION_FOLDER_NAME}`;

// key extensions
export const WALLET_EXT: string = '.wallet';
export const WALLET_LEGACY_EXT: string = '.legacy.wallet';
export const KEY_EXT: string = '.key';
export const KEY_LEGACY_EXT: string = '.legacy.key';
export const PLAIN_KEY_EXT: string = '.key';
export const PLAIN_KEY_LEGACY_EXT: string = '.legacy.key';
