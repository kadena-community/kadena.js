/// <reference lib="dom" />
import { afterEach, assert, describe, expect, it } from 'vitest';

import { server } from '../../../mocks/server.js';
import { services } from '../../../services/index.js';
import { addAccount } from '../addAccount.js';
import { getAccountFilePath } from '../addHelpers.js';
import { defaultConfigMock } from './mocks.js';

describe('addAccount', () => {
  afterEach(async () => {
    const filePath = getAccountFilePath(defaultConfigMock.accountAlias);
    const fs = services.filesystem;
    if (await fs.fileExists(filePath)) {
      await fs.deleteFile(filePath);
    }
    server.resetHandlers();
  });

  it('should write user config to file alias when account details are equal', async () => {
    const config = {
      ...defaultConfigMock,
      publicKeys: 'publicKey1,publicKey2',
      publicKeysConfig: ['publicKey1', 'publicKey2'],
    };
    const filePath = getAccountFilePath(defaultConfigMock.accountAlias);
    const result = await addAccount(config);

    assert(result.status === 'success');
    expect(result.data).toEqual(filePath);
  });

  it('should return error when file already exists', async () => {
    const config = {
      ...defaultConfigMock,
      accountAlias: 'unit-test-alias',
      accountName: 'accountName',
    };
    const filePath = getAccountFilePath(config.accountAlias);
    const fs = services.filesystem;
    await fs.writeFile(filePath, 'test');
    expect(await fs.fileExists(filePath)).toBe(true);

    const result = await addAccount(config);

    assert(result.status === 'error');
    expect(result.errors).toEqual([
      `The account configuration "${filePath}" already exists.`,
    ]);

    await fs.deleteFile(filePath);
  });
});
