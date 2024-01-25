import yaml from 'js-yaml';
import path from 'path';
import { describe, expect, it } from 'vitest';

import { defaultAccountPath } from '../../../constants/account.js';
import { services } from '../../../services/index.js';
import { writeConfigInFile } from '../writeConfigInFile.js';
import { defaultConfigMock } from './mocks.js';

describe('writeInConfigFile', () => {
  const root = path.join(__dirname, '../../../../');
  it('should write "config" in config file', async () => {
    const config = {
      ...defaultConfigMock,
      accountAlias: 'unit-test-alias',
      accountName: 'accountName',
    };
    const filePath = path.join(
      root,
      defaultAccountPath,
      `${config.accountAlias}.yaml`,
    );
    const fs = services.filesystem;
    // To start fresh delete the file if it already exists
    if (await fs.fileExists(filePath)) {
      await fs.deleteFile(filePath);
    }
    expect(await fs.fileExists(filePath)).toBe(false);
    await writeConfigInFile(filePath, config);
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

  it('should throw an error when file already exists', async () => {
    const config = {
      ...defaultConfigMock,
      accountAlias: 'unit-test-alias',
      accountName: 'accountName',
    };
    const filePath = path.join(
      root,
      defaultAccountPath,
      `${config.accountAlias}.yaml`,
    );
    const fs = services.filesystem;
    // Create a file before writing
    await fs.writeFile(filePath, 'test');
    expect(await fs.fileExists(filePath)).toBe(true);
    await expect(async () => {
      await writeConfigInFile(filePath, config);
    }).rejects.toThrow(
      `The account configuration "${filePath}" already exists.`,
    );
    // Cleanup the file after test
    await fs.deleteFile(filePath);
  });
});
