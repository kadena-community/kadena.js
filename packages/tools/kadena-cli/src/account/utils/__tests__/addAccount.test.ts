/// <reference lib="dom" />

import { HttpResponse, http } from 'msw';
import { afterEach, assert, describe, expect, it, vi } from 'vitest';
import { server } from '../../../mocks/server.js';

import { services } from '../../../services/index.js';
import { addAccount } from '../addAccount.js';
import { getFilePath } from '../addHelpers.js';
import { defaultConfigMock } from './mocks.js';

describe('addAccount', () => {
  afterEach(async () => {
    const filePath = getFilePath(defaultConfigMock.accountAlias);
    const fs = services.filesystem;
    if (await fs.fileExists(filePath)) {
      await fs.deleteFile(filePath);
    }
    server.resetHandlers();
  });

  it('should write user config to file alias account details are equal', async () => {
    const config = {
      ...defaultConfigMock,
      publicKeys: 'publicKey1,publicKey2',
      publicKeysConfig: ['publicKey1', 'publicKey2'],
    };
    const filePath = getFilePath(defaultConfigMock.accountAlias);
    const overrideConfigPromptCb = vi.fn();
    const result = await addAccount(config, overrideConfigPromptCb);

    assert(result.success);
    expect(overrideConfigPromptCb).not.toHaveBeenCalled();
    expect(result.data).toEqual(filePath);
  });

  it('should return error when any chain api calls fails', async () => {
    server.use(
      http.post(
        'https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact/api/v1/local',
        () => {
          return new HttpResponse(null, { status: 500 });
        },
        {
          once: true,
        },
      ),
    );

    const config = {
      ...defaultConfigMock,
      publicKeys: 'publicKey1',
      publicKeysConfig: ['publicKey1'],
    };
    const overrideConfigPromptCb = vi.fn().mockResolvedValue(false);
    const result = await addAccount(config, overrideConfigPromptCb);

    assert(!result.success);

    expect(result.errors).toEqual(['There was an error creating the account.']);
  });

  it('should call override prompt when userInput and account details are not equal', async () => {
    const config = {
      ...defaultConfigMock,
      publicKeys: 'publicKey1',
      publicKeysConfig: ['publicKey1'],
    };
    const filePath = getFilePath(config.accountAlias);
    const overrideConfigPromptCb = vi.fn().mockResolvedValue(false);
    const result = await addAccount(config, overrideConfigPromptCb);

    assert(result.success);
    expect(overrideConfigPromptCb).toHaveBeenCalledOnce();
    expect(result.data).toEqual(filePath);
  });
});
