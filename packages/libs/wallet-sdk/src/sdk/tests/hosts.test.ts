import type { MockInstance } from 'vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  defaultChainwebHostGenerator,
  defaultGraphqlHostGenerator,
} from '../host.js';

describe('Host Generators', () => {
  describe('defaultChainwebHostGenerator', () => {
    it('should generate the correct Chainweb URL for a supported networkId and chainId', () => {
      const networkId = 'mainnet01';
      const chainId = '2';
      const expectedUrl =
        'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/2/pact';

      const result = defaultChainwebHostGenerator({ networkId, chainId });

      expect(result).toBe(expectedUrl);
    });

    it('should generate the correct Chainweb URL for testnet04 and chainId 1', () => {
      const networkId = 'testnet04';
      const chainId = '1';
      const expectedUrl =
        'https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact';

      const result = defaultChainwebHostGenerator({ networkId, chainId });

      expect(result).toBe(expectedUrl);
    });

    it('should generate the correct Chainweb URL for testnet05 and chainId 3', () => {
      const networkId = 'testnet05';
      const chainId = '3';
      const expectedUrl =
        'https://api.testnet.chainweb.com/chainweb/0.0/testnet05/chain/3/pact';

      const result = defaultChainwebHostGenerator({ networkId, chainId });

      expect(result).toBe(expectedUrl);
    });

    it('should generate a URL with "undefined" for unsupported networkId', () => {
      const networkId = 'unknownNetwork';
      const chainId = '1';
      const expectedUrl = 'undefined/chainweb/0.0/unknownNetwork/chain/1/pact';

      const result = defaultChainwebHostGenerator({ networkId, chainId });

      expect(result).toBe(expectedUrl);
    });
  });

  describe('defaultGraphqlHostGenerator', () => {
    let consoleWarnSpy: MockInstance<
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [message?: any, ...optionalParams: any[]],
      void
    >;

    beforeEach(() => {
      consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleWarnSpy.mockRestore();
    });

    it('should generate the correct GraphQL URL for a supported networkId', () => {
      const networkId = 'mainnet01';
      const expectedUrl = 'https://graph.kadena.network/graphql';

      const result = defaultGraphqlHostGenerator({ networkId });

      expect(result).toBe(expectedUrl);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should generate the correct GraphQL URL for testnet04', () => {
      const networkId = 'testnet04';
      const expectedUrl = 'https://graph.testnet.kadena.network/graphql';

      const result = defaultGraphqlHostGenerator({ networkId });

      expect(result).toBe(expectedUrl);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should generate the correct GraphQL URL for testnet05', () => {
      const networkId = 'testnet05';
      const expectedUrl = 'https://graph.testnet.kadena.network/graphql';

      const result = defaultGraphqlHostGenerator({ networkId });

      expect(result).toBe(expectedUrl);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should return undefined and log a warning for an unsupported networkId', () => {
      const networkId = 'unknownNetwork';
      const expectedUrl = undefined;
      const expectedWarning = `[defaultGraphqlHostGenerator] Network ${networkId} not supported`;

      const result = defaultGraphqlHostGenerator({ networkId });

      expect(result).toBe(expectedUrl);
      expect(consoleWarnSpy).toHaveBeenCalledWith(expectedWarning);
    });
  });
});
