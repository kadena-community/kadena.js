import yaml from 'js-yaml';
import path from 'path';
import { beforeEach, describe, expect, it } from 'vitest';

import { ACCOUNT_DIR, CWD_KADENA_DIR } from '../../../../constants/config.js';
import { services } from '../../../../services/index.js';
import { IAccountAliasFileConfig } from '../../types.js';
import { createAccountConfigFile } from '../createAccountConfigFile.js';
import { defaultConfigMock } from './mocks.js';

describe('createAccountConfigFile', () => {
  const accountDir = path.join(CWD_KADENA_DIR, ACCOUNT_DIR);
  const accountAlias = 'unit-test-alias';
  const filePath = path.join(accountDir, `${accountAlias}.yaml`);
  const fs = services.filesystem;
  beforeEach(async () => {
    // To start fresh delete the file if it already exists
    if (await fs.fileExists(filePath)) {
      await fs.deleteFile(filePath);
    }
  });
  it('should write "config" in config file', async () => {
    const config = {
      ...defaultConfigMock,
      publicKeysConfig: ['key1', 'key2'],
      accountName: 'accountName',
      accountAlias,
    };

    expect(await fs.fileExists(filePath)).toBe(false);

    await createAccountConfigFile(filePath, config);

    const fileContent = await fs.readFile(filePath);
    expect(fileContent).toBe(
      yaml.dump({
        name: config.accountName,
        fungible: config.fungible,
        publicKeys: config.publicKeysConfig.filter((key: string) => !!key),
        predicate: config.predicate,
      }),
    );
    expect(await fs.fileExists(filePath)).toBe(true);
  });

  it('should return false with errors message', async () => {
    const config = {
      ...defaultConfigMock,
      publicKeysConfig: ['key1', 'key2'],
      accountName: 'accountName',
      accountAlias,
    };
    const filePath = path.join(accountDir, `${config.accountAlias}.yaml`);
    const fs = services.filesystem;
    // Create a file before writing
    await fs.writeFile(filePath, 'test');
    expect(await fs.fileExists(filePath)).toBe(true);

    await expect(async () => {
      await createAccountConfigFile(filePath, config);
    }).rejects.toThrow(
      `The account configuration "${filePath}" already exists.`,
    );
  });

  it('should thrown an error when zod validation account alias schema fails', async () => {
    const config = {
      accountAlias: 'unit-test-alias',
      accountName: 'accountName',
      predicate: 'keys-all',
      publicKeysConfig: [],
    };
    const filePath = path.join(accountDir, `${config.accountAlias}.yaml`);
    const fs = services.filesystem;
    expect(await fs.fileExists(filePath)).toBe(false);

    await expect(async () => {
      await createAccountConfigFile(
        filePath,
        config as unknown as IAccountAliasFileConfig,
      );
    }).rejects.toThrow(
      `Error writing alias file: ${filePath}\n "fungible": expected string, received undefined\n"publicKeys": Array must contain at least 1 element(s)`,
    );
  });
});
