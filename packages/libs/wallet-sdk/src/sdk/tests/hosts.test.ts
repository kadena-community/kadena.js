import type { MockInstance } from 'vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  defaultChainwebHostGenerator,
  defaultGraphqlHostGenerator,
} from '../host.js';

import type { GraphType } from '../host.js';

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

    /**
     * Tests for Kadena GraphType
     */
    describe('Kadena GraphType', () => {
      it('should generate the correct Kadena GraphQL URL for mainnet01', () => {
        const networkId = 'mainnet01';
        const graphType = 'kadena';
        const expectedUrl = 'https://graph.kadena.network/graphql';

        const result = defaultGraphqlHostGenerator({ networkId, graphType });

        expect(result).toBe(expectedUrl);
        expect(consoleWarnSpy).not.toHaveBeenCalled();
      });

      it('should generate the correct Kadena GraphQL URL for testnet04', () => {
        const networkId = 'testnet04';
        const graphType = 'kadena';
        const expectedUrl = 'https://graph.testnet.kadena.network/graphql';

        const result = defaultGraphqlHostGenerator({ networkId, graphType });

        expect(result).toBe(expectedUrl);
        expect(consoleWarnSpy).not.toHaveBeenCalled();
      });

      it('should return undefined and log a warning for an unsupported networkId with Kadena graph', () => {
        const networkId = 'unsupportedNet';
        const graphType = 'kadena';
        const expectedUrl = undefined;
        const expectedWarning = `[defaultGraphqlHostGenerator] Network ${networkId} not supported for Kadena graph`;

        const result = defaultGraphqlHostGenerator({ networkId, graphType });

        expect(result).toBe(expectedUrl);
        expect(consoleWarnSpy).toHaveBeenCalledWith(expectedWarning);
      });
    });

    /**
     * Tests for Hackachain GraphType
     */
    describe('Hackachain GraphType', () => {
      it('should generate the correct Hackachain GraphQL URL for mainnet01', () => {
        const networkId = 'mainnet01';
        const graphType = 'hackachain';
        const expectedUrl = 'https://www.kadindexer.io/graphql';

        const result = defaultGraphqlHostGenerator({ networkId, graphType });

        expect(result).toBe(expectedUrl);
        expect(consoleWarnSpy).not.toHaveBeenCalled();
      });

      it('should generate the correct Hackachain GraphQL URL for testnet04', () => {
        const networkId = 'testnet04';
        const graphType = 'hackachain';
        const expectedUrl = 'https://www.kadindexer.io/graphql';

        const result = defaultGraphqlHostGenerator({ networkId, graphType });

        expect(result).toBe(expectedUrl);
        expect(consoleWarnSpy).not.toHaveBeenCalled();
      });

      it('should return undefined and log a warning for an unsupported networkId with Hackachain graph', () => {
        const networkId = 'unsupportedNet';
        const graphType = 'hackachain';
        const expectedUrl = undefined;
        const expectedWarning = `[defaultGraphqlHostGenerator] Network ${networkId} not supported for Hackachain graph`;

        const result = defaultGraphqlHostGenerator({ networkId, graphType });

        expect(result).toBe(expectedUrl);
        expect(consoleWarnSpy).toHaveBeenCalledWith(expectedWarning);
      });
    });

    /**
     * Tests for Default Behavior
     */
    describe('Default Behavior', () => {
      it('should default to Kadena GraphType when graphType is not provided for mainnet01', () => {
        const networkId = 'mainnet01';
        const expectedUrl = 'https://graph.kadena.network/graphql';

        const result = defaultGraphqlHostGenerator({ networkId });

        expect(result).toBe(expectedUrl);
        expect(consoleWarnSpy).not.toHaveBeenCalled();
      });

      it('should default to Kadena GraphType when graphType is not provided for testnet04', () => {
        const networkId = 'testnet04';
        const expectedUrl = 'https://graph.testnet.kadena.network/graphql';

        const result = defaultGraphqlHostGenerator({ networkId });

        expect(result).toBe(expectedUrl);
        expect(consoleWarnSpy).not.toHaveBeenCalled();
      });

      it('should fall back to Kadena GraphType and not log a warning when graphType is unrecognized', () => {
        const networkId = 'mainnet01';
        const graphType = 'unknownGraph' as GraphType; // Type assertion to bypass TypeScript
        const expectedUrl = 'https://graph.kadena.network/graphql';

        const result = defaultGraphqlHostGenerator({ networkId, graphType });

        expect(result).toBe(expectedUrl);
        expect(consoleWarnSpy).not.toHaveBeenCalled(); // No warning is logged in the default case
      });

      it('should return undefined and log a warning when graphType is not provided for unsupported networkId', () => {
        const networkId = 'unsupportedNet';
        const expectedUrl = undefined;
        const expectedWarning = `[defaultGraphqlHostGenerator] Network ${networkId} not supported for Kadena graph`;

        const result = defaultGraphqlHostGenerator({ networkId });

        expect(result).toBe(expectedUrl);
        expect(consoleWarnSpy).toHaveBeenCalledWith(expectedWarning);
      });
    });
  });
});
