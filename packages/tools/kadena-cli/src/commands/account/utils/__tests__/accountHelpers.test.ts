import jsYaml from 'js-yaml';
import path from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  ACCOUNT_DIR,
  WORKING_DIRECTORY,
} from '../../../../constants/config.js';
import { services } from '../../../../services/index.js';
import { readAccountFromFile } from '../accountHelpers.js';

describe('readAccountFromFile', () => {
  const configPath = path.join(WORKING_DIRECTORY, '.kadena');
  const accountPath = path.join(configPath, ACCOUNT_DIR);
  const accountAliasFile = path.join(accountPath, 'account-add-test.yaml');
  const accountData = {
    name: 'w:yCvUbeS6RqdKsY3WBDB3cgK-6q790xkj4Hb-ABpu3gg:keys-all',
    fungible: 'coin',
    publicKeys: [
      '39710afef15243ba36007ae7aa210ab0e09682b2d963928be350e3424b5a420b',
      '0f745a7773cbaffedcc7303b0638ffb34516aa3af98605f39dda3aeb730318c9',
    ],
    predicate: 'keys-all',
  };

  beforeEach(async () => {
    await services.filesystem.ensureDirectoryExists(accountPath);
    await services.filesystem.writeFile(
      accountAliasFile,
      jsYaml.dump({
        ...accountData,
      }),
    );
  });

  it('should read account data from file and return data with alias', async () => {
    const account = await readAccountFromFile('account-add-test');
    expect(account).toEqual({
      ...accountData,
      alias: 'account-add-test.yaml',
    });
  });

  it('should throw an error when account alias file does not exist', async () => {
    await expect(
      async () => await readAccountFromFile('account-add-test-2'),
    ).rejects.toThrowError('Account alias "account-add-test-2" file not exist');
  });

  it('should return file is empty error when file contains no content', async () => {
    await services.filesystem.writeFile(accountAliasFile, '');
    await expect(
      async () => await readAccountFromFile('account-add-test'),
    ).rejects.toThrowError(
      'Error parsing alias file: account-add-test, file is empty',
    );
  });

  it('should throw zod errors when file content is invalid format ', async () => {
    await services.filesystem.writeFile(
      accountAliasFile,
      jsYaml.dump({
        name: 'w:yCvUbeS6RqdKsY3WBDB3cgK-6q790xkj4Hb-ABpu3gg:keys-all',
        fungible: 'coin',
      }),
    );
    await expect(
      async () => await readAccountFromFile('account-add-test'),
    ).rejects.toThrowError(
      'Error parsing alias file: account-add-test "publicKeys": expected array, received undefined\n"predicate": expected string, received undefined',
    );
  });
});
