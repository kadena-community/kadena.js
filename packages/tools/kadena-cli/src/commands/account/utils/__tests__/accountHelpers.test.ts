import jsYaml from 'js-yaml';
import path from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  ACCOUNT_DIR,
  WORKING_DIRECTORY,
} from '../../../../constants/config.js';
import { services } from '../../../../services/index.js';

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
    const account = await services.account.getByAlias('account-add-test');
    expect(account).toEqual({
      ...accountData,
      filepath: accountAliasFile,
      alias: 'account-add-test',
    });
  });

  it('should throw an error when account alias file does not exist', async () => {
    await expect(
      async () =>
        await services.account.get(
          path.join(accountPath, 'account-add-test2.yaml'),
        ),
    ).rejects.toThrowError(
      'Account file ".kadena/accounts/account-add-test2.yaml" not found',
    );
  });

  it('should return file is empty error when file contains no content', async () => {
    await services.filesystem.writeFile(accountAliasFile, '');
    await expect(
      async () => await services.account.get(accountAliasFile),
    ).rejects.toThrowError('Error parsing account file: Can not be empty');
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
      async () => await services.account.get(accountAliasFile),
    ).rejects.toThrowError(
      'Error parsing account file: publicKeys: Required\npredicate: Required',
    );
  });
});
