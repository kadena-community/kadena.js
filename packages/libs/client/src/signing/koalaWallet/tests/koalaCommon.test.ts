import { beforeEach, describe, expect, it, vi } from 'vitest';
/** @vitest-environment jsdom */

import { connect, isConnected, isInstalled } from '../koalaCommon';

import { TextDecoder, TextEncoder } from 'util';

Object.assign(global, { TextDecoder, TextEncoder });

describe('koalaCommon', () => {
  const mockKoalaRequest = vi.fn();

  Object.defineProperty(window, 'koala', {
    value: {
      isKoala: true,
      isKadena: true,
      request: mockKoalaRequest,
    },
    writable: true,
  });

  beforeEach(() => {
    if (window.koala) window.koala.isKoala = true;
    mockKoalaRequest.mockReset();
  });

  describe('isInstalled()', () => {
    it('returns true when Koala Wallet is installed', () => {
      const result = isInstalled();

      expect(result).toBeTruthy();
    });

    it('returns false when Koala Wallet is NOT installed', () => {
      if (window.koala) window.koala.isKoala = false;

      const result = isInstalled();

      expect(result).toBeFalsy();
    });
  });

  describe('isConnected()', () => {
    it('returns false when Koala Wallet is not installed', async () => {
      if (window.koala) window.koala.isKoala = false;

      const result = await isConnected('testnet04');

      expect(result).toBeFalsy();
    });

    it('returns true when already connected', async () => {
      // mock kda_checkStatus
      mockKoalaRequest.mockResolvedValueOnce({
        status: 'success',
      });

      const result = await isConnected('testnet04');

      expect(result).toBeTruthy();
    });
  });

  describe('connect()', () => {
    it('throws when Koala Wallet is not installed', async () => {
      if (window.koala) window.koala.isKoala = false;

      try {
        await connect('testnet04');
      } catch (e) {
        expect(e.message).toContain('Koala Wallet is not installed');
      }
    });

    it('returns true when already connected', async () => {
      // mock kda_checkStatus
      mockKoalaRequest.mockResolvedValueOnce({
        status: 'success',
      });

      const result = await connect('testnet04');

      expect(result).toBeTruthy();
    });

    it('connects when not connected yet', async () => {
      // mock kda_checkStatus
      mockKoalaRequest.mockResolvedValueOnce({
        status: 'fail',
      });

      // mock kda_connect
      mockKoalaRequest.mockResolvedValueOnce({
        status: 'success',
      });

      const result = await connect('testnet04');

      expect(mockKoalaRequest).toHaveBeenCalledWith({
        method: 'kda_checkStatus',
        networkId: 'testnet04',
      });

      expect(mockKoalaRequest).toHaveBeenCalledWith({
        method: 'kda_connect',
        networkId: 'testnet04',
      });

      expect(result).toBeTruthy();
    });

    it('throws when the user declines the connection', async () => {
      // mock kda_checkStatus
      mockKoalaRequest.mockResolvedValueOnce({
        status: 'fail',
      });

      // mock kda_connect
      mockKoalaRequest.mockResolvedValueOnce({
        status: 'fail',
      });

      try {
        await connect('testnet04');
      } catch (e) {
        expect(e.message).toContain('User declined connection');
      }
    });
  });
});
