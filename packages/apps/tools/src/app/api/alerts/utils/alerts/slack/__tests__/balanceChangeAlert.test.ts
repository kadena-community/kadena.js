import type { ChainId } from '@kadena/types';
import type { IAlert } from '../../../constants';
import {
  ALERTCODES,
  channelId,
  getTestNet,
  INTERVALGROUPS,
  MESSAGETYPES,
} from '../../../constants';

const mocks = vi.hoisted(() => {
  return {
    getLastRecord: vi.fn(),
    sendBalanceChangeErrorMessages: vi.fn(),
    sendBalanceChangeMessages: vi.fn(),
  };
});

vi.mock('./../../../elasticClient', () => ({
  getClient: () => ({
    getLastRecord: mocks.getLastRecord,
  }),
}));

vi.mock(
  './../../../messages/balanceChange/sendBalanceChangeErrorMessages',
  () => ({
    sendBalanceChangeErrorMessages: mocks.sendBalanceChangeErrorMessages,
  }),
);

vi.mock('./../../../messages/balanceChange/sendBalanceChangeMessages', () => ({
  sendBalanceChangeMessages: mocks.sendBalanceChangeMessages,
}));

const alert: IAlert = {
  title: `Kinesis Bridge Balance Change Alert! 🚨`,
  description: 'test',
  code: ALERTCODES.KINESISBRIDGEBALANCECHANGE,
  networks: [getTestNet()],
  options: {
    account: 'test-kinesis-account',
    gif: 'https://media.giphy.com/media/ZNnnp4wa17dZrDQKKI/giphy.gif?cid=790b7611li34xwh3ghrh6h6xwketcjop0mjayanqbp0n1enh&ep=v1_gifs_search&rid=giphy.gif&ct=g',
  },
  chainIds: ['1'],
  slackChannelIds: [channelId],
  messageType: {
    slack: MESSAGETYPES.slack.BALANCECHANGEALERT,
  },
  intervalGroup: INTERVALGROUPS['15minutes'],
};

describe('balance change alert Utils', () => {
  beforeEach(() => {
    // Setup mocks fresh for each test
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should send error messages when latest record timestamp is more than 20 minutes old', async () => {
    const oldTimestamp = new Date(Date.now() - 25 * 60 * 1000).toISOString(); // 25 minutes ago

    mocks.getLastRecord.mockResolvedValue([
      {
        _source: {
          '@timestamp': oldTimestamp,
          balance: '100',
        },
      },
      {
        _source: {
          '@timestamp': new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          balance: '90',
        },
      },
    ]);

    mocks.sendBalanceChangeErrorMessages.mockResolvedValue(
      'Error message sent',
    );

    await alert.messageType.slack!(alert);

    expect(mocks.getLastRecord).toBeCalledTimes(1);
    expect(mocks.sendBalanceChangeErrorMessages).toBeCalledTimes(1);
    expect(mocks.sendBalanceChangeMessages).toBeCalledTimes(0);
    expect(mocks.sendBalanceChangeErrorMessages).toBeCalledWith(
      alert,
      getTestNet(),
      '1',
    );
  });

  it('should send balance change messages when balances are different and timestamp is recent', async () => {
    const recentTimestamp = new Date(Date.now() - 10 * 60 * 1000).toISOString(); // 10 minutes ago
    const olderTimestamp = new Date(Date.now() - 15 * 60 * 1000).toISOString(); // 15 minutes ago

    const latestRecord = {
      _source: {
        '@timestamp': recentTimestamp,
        balance: '150',
      },
    };

    const previousRecord = {
      _source: {
        '@timestamp': olderTimestamp,
        balance: '100',
      },
    };

    mocks.getLastRecord.mockResolvedValue([latestRecord, previousRecord]);
    mocks.sendBalanceChangeMessages.mockResolvedValue(
      'Balance change message sent',
    );

    if (alert.messageType.slack) {
      await alert.messageType.slack(alert);
    }

    expect(mocks.getLastRecord).toBeCalledTimes(1);
    expect(mocks.sendBalanceChangeErrorMessages).toBeCalledTimes(0);
    expect(mocks.sendBalanceChangeMessages).toBeCalledTimes(1);
    expect(mocks.sendBalanceChangeMessages).toBeCalledWith(
      alert,
      ['150', '100'],
      getTestNet(),
      '1',
    );

    expect(
      new Date(previousRecord._source['@timestamp']).getTime(),
    ).toBeLessThan(new Date(latestRecord._source['@timestamp']).getTime());
  });

  it('should return no message when balances are the same and timestamp is recent', async () => {
    const recentTimestamp = new Date(Date.now() - 10 * 60 * 1000).toISOString(); // 10 minutes ago
    const olderTimestamp = new Date(Date.now() - 15 * 60 * 1000).toISOString(); // 15 minutes ago

    mocks.getLastRecord.mockResolvedValue([
      {
        _source: {
          '@timestamp': recentTimestamp,
          balance: '100',
        },
      },
      {
        _source: {
          '@timestamp': olderTimestamp,
          balance: '100',
        },
      },
    ]);

    const result = await alert.messageType.slack!(alert);
    expect(result).toEqual([
      `◻️ no need for a message KINESISBRIDGEBALANCECHANGE (testnet04) chainId:1`,
    ]);

    expect(mocks.getLastRecord).toBeCalledTimes(1);
    expect(mocks.sendBalanceChangeErrorMessages).toBeCalledTimes(0);
    expect(mocks.sendBalanceChangeMessages).toBeCalledTimes(0);
  });

  describe('multiple chains', () => {
    it('should return error for chain 1, success for chain 2', async () => {
      alert.chainIds = ['1', '2'];

      mocks.getLastRecord.mockImplementation(
        (alert, network, chainId: ChainId) => {
          if (chainId === '1') {
            return [
              {
                _source: {
                  '@timestamp': new Date(
                    Date.now() - 25 * 60 * 1000,
                  ).toISOString(),
                  balance: '100',
                },
              },
              {
                _source: {
                  '@timestamp': new Date(
                    Date.now() - 30 * 60 * 1000,
                  ).toISOString(),
                  balance: '90',
                },
              },
            ];
          }

          //chain 2
          return [
            {
              _source: {
                '@timestamp': new Date(
                  Date.now() - 15 * 60 * 1000,
                ).toISOString(),
                balance: '100',
              },
            },
            {
              _source: {
                '@timestamp': new Date(
                  Date.now() - 30 * 60 * 1000,
                ).toISOString(),
                balance: '90',
              },
            },
          ];
        },
      );

      mocks.sendBalanceChangeErrorMessages.mockResolvedValue(
        'Error message sent',
      );

      await alert.messageType.slack!(alert);

      expect(mocks.getLastRecord).toBeCalledTimes(2);
      expect(mocks.sendBalanceChangeErrorMessages).toBeCalledTimes(1);
      expect(mocks.sendBalanceChangeMessages).toBeCalledTimes(1);
      expect(mocks.sendBalanceChangeErrorMessages).toBeCalledWith(
        alert,
        getTestNet(),
        '1',
      );
      expect(mocks.sendBalanceChangeMessages).toBeCalledWith(
        alert,
        ['100', '90'],
        getTestNet(),
        '2',
      );
    });
  });
});
