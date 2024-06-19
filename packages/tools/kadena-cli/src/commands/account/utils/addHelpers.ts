import path from 'path';

import { KadenaError } from '../../../services/service-error.js';
import { sanitizeFilename } from '../../../utils/globalHelpers.js';
import { log } from '../../../utils/logger.js';
import { relativeToCwd } from '../../../utils/path.util.js';
import { getAccountDirectory } from './accountHelpers.js';

export const isEmpty = (value?: string | null): boolean =>
  value === undefined || value === '' || value === null;

export const getAccountFilePath = (fileName: string): string => {
  const accountDir = getAccountDirectory();
  if (accountDir === null) {
    throw new KadenaError('no_kadena_directory');
  }
  const sanitizedAlias = sanitizeFilename(fileName);
  return path.join(accountDir, `${sanitizedAlias}.yaml`);
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
