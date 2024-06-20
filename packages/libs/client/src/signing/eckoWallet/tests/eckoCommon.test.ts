import { beforeEach, describe, expect, it, vi } from 'vitest';
/** @vitest-environment jsdom */

import { checkStatus, connect, isConnected, isInstalled } from '../eckoCommon';

import { TextDecoder, TextEncoder } from 'util';

Object.assign(global, { TextDecoder, TextEncoder });

describe('eckoCommon', () => {
  const mockEckoRequest = vi.fn();

  Object.defineProperty(window, 'kadena', {
    value: {
      isKadena: true,
      request: mockEckoRequest,
    },
    writable: true,
  });

  beforeEach(() => {
    if (window.kadena) window.kadena.isKadena = true;
    mockEckoRequest.mockReset();
  });

  describe('isInstalled()', () => {
    it('returns true when Ecko Wallet is installed', () => {
      const result = isInstalled();

      expect(result).toBeTruthy();
    });

    it('returns false when Ecko Wallet is NOT installed', () => {
      if (window.kadena) window.kadena.isKadena = false;

      const result = isInstalled();

      expect(result).toBeFalsy();
    });
  });

  describe('isConnected()', () => {
    it('returns false when Ecko Wallet is not installed', async () => {
      if (window.kadena) window.kadena.isKadena = false;

      const result = await isConnected('testnet04');

      expect(result).toBeFalsy();
    });

    it('returns true when already connected', async () => {
      // mock kda_checkStatus
      mockEckoRequest.mockResolvedValueOnce({
        status: 'success',
      });

      const result = await isConnected('testnet04');

      expect(result).toBeTruthy();
    });
  });

  describe('connect()', () => {
    it('throws when Ecko Wallet is not installed', async () => {
      if (window.kadena) window.kadena.isKadena = false;

      try {
        await connect('testnet04');
      } catch (e) {
        expect(e.message).toContain('Ecko Wallet is not installed');
      }
    });

    it('returns true when already connected', async () => {
      // mock kda_checkStatus
      mockEckoRequest.mockResolvedValueOnce({
        status: 'success',
      });

      const result = await connect('testnet04');

      expect(result).toBeTruthy();
    });

    it('connects when not connected yet', async () => {
      // mock kda_checkStatus
      mockEckoRequest.mockResolvedValueOnce({
        status: 'fail',
      });

      // mock kda_connect
      mockEckoRequest.mockResolvedValueOnce({
        status: 'success',
      });

      const result = await connect('testnet04');

      expect(mockEckoRequest).toHaveBeenCalledWith({
        method: 'kda_checkStatus',
        networkId: 'testnet04',
      });

      expect(mockEckoRequest).toHaveBeenCalledWith({
        method: 'kda_connect',
        networkId: 'testnet04',
      });

      expect(result).toBeTruthy();
    });

    it('throws when the user declines the connection', async () => {
      // mock kda_checkStatus
      mockEckoRequest.mockResolvedValueOnce({
        status: 'fail',
      });

      // mock kda_connect
      mockEckoRequest.mockResolvedValueOnce({
        status: 'fail',
      });

      try {
        await connect('testnet04');
      } catch (e) {
        expect(e.message).toContain('User declined connection');
      }
    });
  });

  describe('checkStatus()', () => {
    it('throws when Ecko Wallet is not installed', async () => {
      if (window.kadena) window.kadena.isKadena = false;

      try {
        await checkStatus('testnet04');
      } catch (e) {
        expect(e.message).toContain('Ecko Wallet is not installed');
      }
    });

    it('returns the current account when connected', async () => {
      // mock kda_connect
      mockEckoRequest.mockResolvedValueOnce({
        status: 'success',
      });

      // mock kda_checkStatus
      mockEckoRequest.mockResolvedValueOnce({
        status: 'success',
        account: {
          account: 'k:abcd',
          publicKey: 'abcd',
          connectedSites: ['kadena.io'],
        },
      });

      const result = await checkStatus('testnet04');

      expect(result).toEqual({
        status: 'success',
        account: {
          account: 'k:abcd',
          publicKey: 'abcd',
          connectedSites: ['kadena.io'],
        },
      });
    });

    it('connects when not connected yet, then returns the checkStatus response', async () => {
      // mock kda_connect
      mockEckoRequest.mockResolvedValueOnce({
        status: 'fail',
      });

      // mock kda_checkStatus for connect()
      mockEckoRequest.mockResolvedValueOnce({
        status: 'success',
      });

      // mock kda_checkStatus for checkStatus()
      mockEckoRequest.mockResolvedValueOnce({
        status: 'success',
        account: {
          account: 'k:abcd',
          publicKey: 'abcd',
          connectedSites: ['kadena.io'],
        },
        publicKey: 'abcd',
      });

      const result = await checkStatus('testnet04');

      expect(mockEckoRequest).toHaveBeenCalledWith({
        method: 'kda_checkStatus',
        networkId: 'testnet04',
      });

      expect(result).toEqual({
        status: 'success',
        account: {
          account: 'k:abcd',
          publicKey: 'abcd',
          connectedSites: ['kadena.io'],
        },
        publicKey: 'abcd',
      });
    });

    it('throws when the user declines the connection', async () => {
      // mock kda_checkStatus
      mockEckoRequest.mockResolvedValueOnce({
        status: 'fail',
      });

      // mock kda_connect
      mockEckoRequest.mockResolvedValueOnce({
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
