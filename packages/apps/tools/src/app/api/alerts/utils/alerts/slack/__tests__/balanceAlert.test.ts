import { CHAINS } from '@kadena/chainweb-node-client';
import type { IAccount, IAlert } from '../../../constants';
import {
  ALERTCODES,
  channelId,
  faucetAccount,
  getTestNet,
  MESSAGETYPES,
  MINBALANCE,
  slackAlerts,
} from '../../../constants';

const alert: IAlert = {
  title: `Low Faucet alert! 🚨`,
  description: 'test',
  code: ALERTCODES.LOWFAUCETBALANCE,
  networks: [getTestNet()],
  options: {
    account: faucetAccount,
    minBalance: MINBALANCE,
    gif: 'https://media.giphy.com/media/ZNnnp4wa17dZrDQKKI/giphy.gif?cid=790b7611li34xwh3ghrh6h6xwketcjop0mjayanqbp0n1enh&ep=v1_gifs_search&rid=giphy.gif&ct=g',
  },
  chainIds: CHAINS,
  slackChannelIds: [channelId],
  messageType: MESSAGETYPES.BALANCEALERT,
  cronType: '12hours',
};

describe('balance alert Utils', () => {
  const mocks = vi.hoisted(() => {
    return {
      fetch: vi.fn(),
      sendBalanceErrorMessages: vi.fn(),
      sendBalanceMessages: vi.fn(),
    };
  });

  beforeEach(() => {
    vi.stubGlobal('fetch', mocks.fetch);

    vi.mock(
      './../../../messages/balance/sendBalanceErrorMessages',
      async (importOriginal) => {
        const actual = (await importOriginal()) as {};
        return {
          ...actual,
          sendBalanceErrorMessages: mocks.sendBalanceErrorMessages,
        };
      },
    );

    vi.mock(
      './../../../messages/balance/sendBalanceMessages',
      async (importOriginal) => {
        const actual = (await importOriginal()) as {};
        return {
          ...actual,
          sendBalanceMessages: mocks.sendBalanceMessages,
        };
      },
    );
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

    await slackAlerts[alert.messageType](alert);

    expect(mocks.fetch).toBeCalledTimes(1);
    expect(mocks.sendBalanceErrorMessages).toBeCalledTimes(1);
    expect(mocks.sendBalanceMessages).toBeCalledTimes(0);
    expect(mocks.fetch.mock.calls[0][0]).toEqual(
      'https://api.testnet.kadindexer.io/v0',
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

    await slackAlerts[alert.messageType](alert);

    expect(mocks.fetch).toBeCalledTimes(1);
    expect(mocks.sendBalanceErrorMessages).toBeCalledTimes(0);
    expect(mocks.sendBalanceMessages).toBeCalledTimes(0);
    expect(mocks.fetch.mock.calls[0][0]).toEqual(
      'https://api.testnet.kadindexer.io/v0',
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
        } as unknown as IAccount;
      },
    });

    await slackAlerts[alert.messageType](alert);
    expect(mocks.fetch).toBeCalledTimes(1);
    expect(mocks.sendBalanceErrorMessages).toBeCalledTimes(0);
    expect(mocks.sendBalanceMessages).toBeCalledTimes(1);
    expect(mocks.fetch.mock.calls[0][0]).toEqual(
      'https://api.testnet.kadindexer.io/v0',
    );
  });
});
