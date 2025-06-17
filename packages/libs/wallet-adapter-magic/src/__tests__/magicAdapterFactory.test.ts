import type { IProvider } from '@kadena/wallet-adapter-core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { createMagicAdapter } from '../magicAdapterFactory';
import { MagicAdapter } from '../magicAdapterFactory';
import { MockProvider } from './mock';

let adapter: MagicAdapter;
let creator: typeof createMagicAdapter;

describe('magicAdapter factory', () => {
  beforeEach(() => {
    adapter = new MagicAdapter({
      provider: new MockProvider(),
      networkId: 'testnet04',
      chainId: '0',
      magicApiKey: '123',
      chainwebApiUrl: 'http://example.com',
    });
    creator = () => ({
      name: 'Magic',
      adapter: async () => adapter,
      detect: vi.fn(async () => new MockProvider()),
    });
  });
  it('has name "Magic"', () => {
    expect(creator({}).name).toBe('Magic');
  });

  it('detect() delegates to detectMagicProvider', async () => {
    const factory = creator({});
    const detected = await factory.detect();
    expect(factory.detect).toHaveBeenCalledWith();
    expect(detected).haveOwnProperty('request');
    expect(detected).haveOwnProperty('on');
    expect(detected).haveOwnProperty('off');
  });

  it('adapter() returns an MagicAdapter instance', async () => {
    const fakeProvider: IProvider = {
      request: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
    };
    const factory = creator({});
    const adapter = await factory.adapter(fakeProvider);
    expect(adapter).toBeInstanceOf(MagicAdapter);
  });
});
