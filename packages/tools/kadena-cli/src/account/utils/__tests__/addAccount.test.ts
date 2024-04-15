/// <reference lib="dom" />
import yaml from 'js-yaml';
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
      accountDetailsFromChain: {
        guard: {
          keys: ['publicKey1', 'publicKey2'],
          pred: 'keys-all',
        },
        account: 'accountName',
        balance: 0,
      },
    };
    const filePath = getAccountFilePath(defaultConfigMock.accountAlias);
    const result = await addAccount(config);

    assert(result.status === 'success');
    expect(result.data).toEqual(filePath);
    expect(result.warnings).toEqual([]);
  });

  it('should write user config to file when account details are undefined', async () => {
    const config = {
      ...defaultConfigMock,
      accountName: 'k:3645365457567ghghdghf6534673',
      publicKeys: 'publicKey1,publicKey2',
      publicKeysConfig: ['publicKey1', 'publicKey2'],
      accountDetailsFromChain: undefined,
    };
    const filePath = getAccountFilePath(defaultConfigMock.accountAlias);
    const result = await addAccount(config);

    assert(result.status === 'success');
    expect(result.data).toEqual(filePath);
    expect(result.warnings).toEqual([
      'The account "k:3645365457567ghghdghf6534673" is not on chain yet. To create it on-chain, transfer funds to it from testnet and use "kadena account fund" command.',
    ]);
  });

  it('should write config with account details from chain when accountOverwrite is true', async () => {
    const config = {
      ...defaultConfigMock,
      accountName: 'accountName',
      publicKeys: 'publicKey1,publicKey2',
      publicKeysConfig: ['publicKey1', 'publicKey2'],
      accountDetailsFromChain: {
        guard: {
          keys: ['publicKey1'],
          pred: 'keys-any',
        },
        account: 'accountName',
        balance: 0,
      },
      accountOverwrite: true,
    };
    const filePath = getAccountFilePath(defaultConfigMock.accountAlias);
    const result = await addAccount(config);

    const fileContent = await services.filesystem.readFile(filePath);

    assert(result.status === 'success');
    expect(result.data).toEqual(filePath);
    expect(fileContent).toBe(
      yaml.dump({
        name: 'accountName',
        fungible: 'coin',
        publicKeys: ['publicKey1'],
        predicate: 'keys-any',
      }),
    );
    expect(result.warnings).toEqual([]);
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
