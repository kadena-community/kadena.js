import yaml from 'js-yaml';
import path from 'path';
import { describe, expect, it } from 'vitest';

import { ACCOUNT_DIR } from '../../../constants/config.js';
import { services } from '../../../services/index.js';
import { createAccountConfigFile } from '../createAccountConfigFile.js';
import { defaultConfigMock } from './mocks.js';

describe('createAccountConfigFile', () => {
  const root = path.join(__dirname, '../../../../');
  it('should write "config" in config file', async () => {
    const config = {
      ...defaultConfigMock,
      accountAlias: 'unit-test-alias',
      accountName: 'accountName',
    };

    const filePath = path.join(
      root,
      ACCOUNT_DIR!,
      `${config.accountAlias}.yaml`,
    );
    const fs = services.filesystem;
    // To start fresh delete the file if it already exists
    if (await fs.fileExists(filePath)) {
      await fs.deleteFile(filePath);
    }
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
      accountAlias: 'unit-test-alias',
      accountName: 'accountName',
    };
    const filePath = path.join(
      root,
      ACCOUNT_DIR!,
      `${config.accountAlias}.yaml`,
    );
    const fs = services.filesystem;
    // Create a file before writing
    await fs.writeFile(filePath, 'test');
    expect(await fs.fileExists(filePath)).toBe(true);

    await expect(async () => {
      await createAccountConfigFile(filePath, config);
    }).rejects.toThrow(
      `The account configuration "${filePath}" already exists.`,
    );
    // Cleanup the file after test
    await fs.deleteFile(filePath);
  });
});
