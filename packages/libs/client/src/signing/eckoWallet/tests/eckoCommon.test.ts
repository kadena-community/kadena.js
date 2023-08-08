/** @jest-environment jsdom */

import { connect, isConnected, isInstalled } from '../eckoCommon';

import { TextDecoder, TextEncoder } from 'util';

Object.assign(global, { TextDecoder, TextEncoder });

const mockEckoRequest = jest.fn();

Object.defineProperty(window, 'kadena', {
  value: {
    isKadena: true,
    request: mockEckoRequest,
  },
  writable: true,
});

describe('eckoCommon', () => {
  beforeEach(() => {
    mockEckoRequest.mockReset();

    window.kadena = {
      request: mockEckoRequest,
      isKadena: true,
    };
  });

  describe('isInstalled()', () => {
    it('returns true when Ecko Wallet is installed', () => {
      const result = isInstalled();

      expect(result).toBeTruthy();
    });

    it('returns false when Ecko Wallet is NOT installed', () => {
      window.kadena = {
        request: mockEckoRequest,
        isKadena: false,
      };

      const result = isInstalled();

      expect(result).toBeFalsy();
    });
  });

  describe('isConnected()', () => {
    it('returns false when Ecko Wallet is not installed', async () => {
      window.kadena = {
        request: mockEckoRequest,
        isKadena: false,
      };

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
      window.kadena = {
        request: mockEckoRequest,
        isKadena: false,
      };

      try {
        await connect('testnet04');
        // Fail test if connect() doesn't throw. Next line shouldn't be reached.
        expect(true).toBe(false);
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
      window.kadena = {
        request: mockEckoRequest,
        isKadena: true,
      };
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
        // Fail test if connect() doesn't throw. Next line shouldn't be reached.
        expect(true).toBe(false);
      } catch (e) {
        expect(e.message).toContain('User declined connection');
      }
    });
  });
});
