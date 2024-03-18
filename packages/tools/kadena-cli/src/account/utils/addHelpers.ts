import type { IKeyPair } from '@kadena/types';
import yaml from 'js-yaml';
import path from 'path';

import { ACCOUNT_DIR, WALLET_DIR } from '../../constants/config.js';
import type { IWallet } from '../../keys/utils/keysHelpers.js';
import { services } from '../../services/index.js';
import { sanitizeFilename } from '../../utils/helpers.js';
import { log } from '../../utils/logger.js';
import { relativeToCwd } from '../../utils/path.util.js';
import type { IAccountDetailsResult, IAddAccountConfig } from '../types.js';

export const isEmpty = (value?: string | null): boolean =>
  value === undefined || value === '' || value === null;

export const getUpdatedConfig = (
  config: IAddAccountConfig,
  accountDetails: IAccountDetailsResult,
  accountOverwriteFromChain: boolean,
): IAddAccountConfig => {
  if (
    accountOverwriteFromChain === false ||
    accountDetails === undefined ||
    accountDetails.guard.keys.length === 0
  ) {
    return config;
  } else {
    const updatedConfig = {
      ...config,
      publicKeys: accountDetails.guard.keys.join(','),
      publicKeysConfig: accountDetails.guard.keys,
      predicate: accountDetails.guard.pred,
    };
    return updatedConfig;
  }
};

export const getAccountFilePath = (fileName: string): string => {
  const sanitizedAlias = sanitizeFilename(fileName);
  return path.join(ACCOUNT_DIR, `${sanitizedAlias}.yaml`);
};

export const displayAddAccountSuccess = (
  accountAlias: string,
  path: string,
): void => {
  log.info(
    log.color.green(
      `\nThe account configuration "${accountAlias}" has been saved in ${relativeToCwd(
        path,
      )}\n`,
    ),
  );
};

export async function getAllPublicKeysFromWalletConfig(
  walletNameConfig: IWallet,
): Promise<Array<string>> {
  const publicKeysList: Array<string> = [];
  for (const key of walletNameConfig.keys) {
    const content = await services.filesystem.readFile(
      path.join(WALLET_DIR, walletNameConfig?.folder, key),
    );
    const parsed = content !== null ? (yaml.load(content) as IKeyPair) : null;
    publicKeysList.push(parsed?.publicKey ?? '');
  }
  return publicKeysList.filter((key) => !isEmpty(key));
}
