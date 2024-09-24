import type { IAccount, IChainAccount } from '..';
import { creatLowChainsString, lowFaucetChains, runJob } from '..';

describe('faucetCron Utils', () => {
  describe('creatLowChainsString', () => {
    it('should return an empty string if array is empty', () => {
      const chains: IChainAccount[] = [];
      const result = creatLowChainsString(chains);
      expect(result).toEqual('');
    });

    it('should return the correct string if array is not empty', () => {
      const chains: IChainAccount[] = [
        {
          balance: 1000,
          chainId: '1',
        },
      ];
      const result = creatLowChainsString(chains);
      expect(result).toEqual('*chain 1:* (1,000 KDA)');

      const chains2: IChainAccount[] = [
        {
          balance: 1000,
          chainId: '1',
        },
        {
          balance: 1977,
          chainId: '9',
        },
      ];
      const result2 = creatLowChainsString(chains2);
      expect(result2).toEqual('*chain 1:* (1,000 KDA)\n*chain 9:* (1,977 KDA)');
    });
  });

  describe('lowFaucetChains', () => {
    it('should return an empty array when chainAccounts is empty', () => {
      const result = lowFaucetChains(undefined, 1500);
      expect(result).toEqual([]);
    });
    it('should return an empty array when chainAccounts is empty array', () => {
      const result = lowFaucetChains([], 1500);
      expect(result).toEqual([]);
    });
    it('should return an empty array when chainAccounts balances are all high enough', () => {
      const chains = [
        {
          balance: 1000,
          chainId: '0',
        },
        {
          balance: 3000,
          chainId: '1',
        },
        {
          balance: 2000,
          chainId: '2',
        },
        {
          balance: 1500,
          chainId: '3',
        },
      ];

      const result = lowFaucetChains(chains, 50);
      expect(result).toEqual([]);
    });

    it('should return an array of 2 found chains that have balance lower than mininmum', () => {
      const chains = [
        {
          balance: 1000,
          chainId: '0',
        },
        {
          balance: 3000,
          chainId: '1',
        },
        {
          balance: 2000,
          chainId: '2',
        },
        {
          balance: 1500,
          chainId: '3',
        },
      ];

      const result = lowFaucetChains(chains, 2000);
      expect(result.length).toEqual(2);
      expect(result).toEqual([
        {
          balance: 1000,
          chainId: '0',
        },
        {
          balance: 1500,
          chainId: '3',
        },
      ]);
    });
  });

  const mocks = vi.hoisted(() => {
    return {
      fetch: vi.fn(),
      sendErrorMessage: vi.fn(),
      sendMessage: vi.fn(),
    };
  });

  describe('runJob', () => {
    beforeEach(() => {
      vi.stubGlobal('fetch', mocks.fetch);

      vi.mock('./../messages', async (importOriginal) => {
        const actual = (await importOriginal()) as {};
        return {
          ...actual,
          sendErrorMessage: mocks.sendErrorMessage,
          sendMessage: mocks.sendMessage,
        };
      });
    });

    afterEach(() => {
      vi.resetAllMocks();
    });

    it('should run the correct functions when the data gives an error', async () => {
      mocks.fetch.mockResolvedValue({
        json: async () => {
          return { errors: [{ message: 'I have the Powerrr' }] } as IAccount;
        },
      });

      await runJob();
      expect(mocks.fetch).toBeCalledTimes(1);
      expect(mocks.sendErrorMessage).toBeCalledTimes(1);
      expect(mocks.sendMessage).toBeCalledTimes(0);
      expect(mocks.fetch.mock.calls[0][0]).toEqual(
        'https://graph.testnet.kadena.network/graphql',
      );
    });

    it('should run the correct functions when the data gives correct result but no lowchain balances', async () => {
      mocks.fetch.mockResolvedValue({
        json: async () => {
          return {
            data: {
              fungibleAccount: {
                chainAccounts: [],
              },
            },
          } as IAccount;
        },
      });

      await runJob();
      expect(mocks.fetch).toBeCalledTimes(1);
      expect(mocks.sendErrorMessage).toBeCalledTimes(0);
      expect(mocks.sendMessage).toBeCalledTimes(0);
      expect(mocks.fetch.mock.calls[0][0]).toEqual(
        'https://graph.testnet.kadena.network/graphql',
      );
    });

    it('should run the correct functions when the data gives correct result WITH low chain balances', async () => {
      mocks.fetch.mockResolvedValue({
        json: async () => {
          return {
            data: {
              fungibleAccount: {
                chainAccounts: [
                  {
                    chainId: '0',
                    balance: '1',
                  },
                ],
              },
            },
          } as IAccount;
        },
      });

      await runJob();
      expect(mocks.fetch).toBeCalledTimes(1);
      expect(mocks.sendErrorMessage).toBeCalledTimes(0);
      expect(mocks.sendMessage).toBeCalledTimes(1);
      expect(mocks.fetch.mock.calls[0][0]).toEqual(
        'https://graph.testnet.kadena.network/graphql',
      );
    });
  });
});
