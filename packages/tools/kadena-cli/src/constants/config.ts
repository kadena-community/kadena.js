// appN name
export const CLIName: string = 'bin/kadena-cli.js';

// root folder
export const rootFolder = '/.kadena';

export const workPath: string = `${process.cwd()}${rootFolder}`;
export const projectRootPath: string = `${process.cwd()}`;

// wallet path
export const WALLET_DIR: string = `${process.cwd()}${rootFolder}/wallets`;

// plain key path
export const PLAIN_KEY_DIR: string = `${process.cwd()}${rootFolder}/keys`;

// transactions
export const TRANSACTION_DIR = `${process.cwd()}/transactions`;

// key extensions
export const WALLET_EXT: string = '.wallet';
export const WALLET_LEGACY_EXT: string = '.legacy.wallet';
export const KEY_EXT: string = '.key';
export const KEY_LEGACY_EXT: string = '.legacy.key';
export const PLAIN_KEY_EXT: string = '.key';
export const PLAIN_KEY_LEGACY_EXT: string = '.legacy.key';
