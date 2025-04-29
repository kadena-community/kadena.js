import { runJob } from '..';
import type { IAccount } from '../../constants';

describe('xchaingas Utils', () => {
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
      expect(mocks.fetch).toBeCalledTimes(2);
      expect(mocks.sendErrorMessage).toBeCalledTimes(2);
      expect(mocks.sendMessage).toBeCalledTimes(0);
      expect(mocks.fetch.mock.calls[0][0]).toEqual(
        'https://api.mainnet.kadindexer.io/v0',
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
      expect(mocks.fetch).toBeCalledTimes(2);
      expect(mocks.sendErrorMessage).toBeCalledTimes(0);
      expect(mocks.sendMessage).toBeCalledTimes(0);
      expect(mocks.fetch.mock.calls[0][0]).toEqual(
        'https://api.mainnet.kadindexer.io/v0',
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
                    balance: '0.8',
                  },
                ],
              },
            },
          } as unknown as IAccount;
        },
      });

      await runJob();
      expect(mocks.fetch).toBeCalledTimes(2);
      expect(mocks.sendErrorMessage).toBeCalledTimes(0);
      expect(mocks.sendMessage).toBeCalledTimes(2);
      expect(mocks.fetch.mock.calls[0][0]).toEqual(
        'https://api.mainnet.kadindexer.io/v0',
      );
      expect(mocks.fetch.mock.calls[1][0]).toEqual(
        'https://api.testnet.kadindexer.io/v0',
      );
    });
  });
});
