import { CHAINS } from '@kadena/chainweb-node-client';
import type { IAlert } from '../../../constants';
import {
  ALERTCODES,
  channelId,
  getMainNet,
  INTERVALGROUPS,
  MESSAGETYPES,
} from '../../../constants';
import { checkIfBalanceChangeAlert } from '../kinesisBalanceChangeAlert';

const alert: IAlert = {
  title: `Kinesis Bridge Balance Change Alert! 🚨`,
  description: 'test',
  code: ALERTCODES.KINESISBRIDGEBALANCECHANGE,
  networks: [getMainNet()],
  options: {
    account: 'test-kinesis-account',
  },
  chainIds: CHAINS,
  slackChannelIds: [channelId],
  messageType: {
    slack: MESSAGETYPES.slack.KINESISBALANCECHANGEALERT,
  },
  intervalGroup: INTERVALGROUPS['1hour'],
};

const mocks = vi.hoisted(() => {
  return {
    getRecordsOfLastHour: vi.fn(),
    sendKinesisBalanceChangeErrorMessages: vi.fn(),
    sendKinesisBalanceChangeMessages: vi.fn(),
  };
});

vi.mock('./../../../elasticClient', () => ({
  getClient: () => ({
    getRecordsOfLastHour: mocks.getRecordsOfLastHour,
  }),
}));

vi.mock(
  './../../../messages/kinesisBalanceChange/sendKinesisBalanceChangeErrorMessages',
  () => ({
    sendKinesisBalanceChangeErrorMessages:
      mocks.sendKinesisBalanceChangeErrorMessages,
  }),
);

vi.mock(
  './../../../messages/kinesisBalanceChange/sendKinesisBalanceChangeMessages',
  () => ({
    sendKinesisBalanceChangeMessages: mocks.sendKinesisBalanceChangeMessages,
  }),
);

describe('Kinesis balance change alert Utils', () => {
  describe('checkIfBalanceChangeAlert', () => {
    it('should return true if balance has decreased by more than 10%', () => {
      const result = checkIfBalanceChangeAlert(100, 85);
      expect(result).toBe(true);
    });
    it('should return false if balance has not decreased by more than 10%', () => {
      const result = checkIfBalanceChangeAlert(100, 95);
      expect(result).toBe(false);
    });
  });

  describe('kinesisBalanceChangeAlert', () => {
    beforeEach(() => {
      // Setup mocks fresh for each test
    });

    afterEach(() => {
      vi.resetAllMocks();
    });
    it('should send messages when balance change alert is triggered', async () => {
      const previousTimestamp3 = new Date(
        Date.now() - 60 * 60 * 1000,
      ).toISOString(); // 60 minutes ago
      const previousTimestamp2 = new Date(
        Date.now() - 45 * 60 * 1000,
      ).toISOString(); // 45 minutes ago
      const previousTimestamp1 = new Date(
        Date.now() - 30 * 60 * 1000,
      ).toISOString(); // 30 minutes ago

      const hourAgoRecord = {
        _source: {
          '@timestamp': previousTimestamp3,
          balance: '100',
        },
      };

      const nowRecord = {
        _source: {
          '@timestamp': new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          balance: '85',
        },
      };

      mocks.getRecordsOfLastHour.mockResolvedValue([
        hourAgoRecord,
        {
          _source: {
            '@timestamp': previousTimestamp2,
            balance: '100',
          },
        },
        {
          _source: {
            '@timestamp': previousTimestamp1,
            balance: '90',
          },
        },
        nowRecord,
      ]);

      mocks.sendKinesisBalanceChangeMessages.mockResolvedValue('Messages sent');

      if (alert.messageType.slack) {
        await alert.messageType.slack(alert);
      }

      expect(mocks.getRecordsOfLastHour).toBeCalledTimes(1);
      expect(mocks.sendKinesisBalanceChangeErrorMessages).toBeCalledTimes(0);
      expect(mocks.sendKinesisBalanceChangeMessages).toBeCalledTimes(1);
      expect(mocks.sendKinesisBalanceChangeMessages).toBeCalledWith(
        alert,
        getMainNet(),
        [nowRecord, hourAgoRecord],
      );
    });
    it('should send error messages when there are less than 4 records', async () => {
      const previousTimestamp3 = new Date(
        Date.now() - 60 * 60 * 1000,
      ).toISOString(); // 60 minutes ago
      const previousTimestamp2 = new Date(
        Date.now() - 45 * 60 * 1000,
      ).toISOString(); // 45 minutes ago

      mocks.getRecordsOfLastHour.mockResolvedValue([
        {
          _source: {
            '@timestamp': previousTimestamp3,
            balance: '100',
          },
        },
        {
          _source: {
            '@timestamp': previousTimestamp2,
            balance: '100',
          },
        },
      ]);

      mocks.sendKinesisBalanceChangeErrorMessages.mockResolvedValue(
        'Error message sent',
      );

      if (alert.messageType.slack) {
        await alert.messageType.slack(alert);
      }

      expect(mocks.getRecordsOfLastHour).toBeCalledTimes(1);
      expect(mocks.sendKinesisBalanceChangeErrorMessages).toBeCalledTimes(1);
      expect(mocks.sendKinesisBalanceChangeMessages).toBeCalledTimes(0);
      expect(mocks.sendKinesisBalanceChangeErrorMessages).toBeCalledWith(
        alert,
        getMainNet(),
      );
    });

    it('should not send any messages when balance has not changed', async () => {
      const previousTimestamp3 = new Date(
        Date.now() - 60 * 60 * 1000,
      ).toISOString(); // 60 minutes ago
      const previousTimestamp2 = new Date(
        Date.now() - 45 * 60 * 1000,
      ).toISOString(); // 45 minutes ago
      const previousTimestamp1 = new Date(
        Date.now() - 30 * 60 * 1000,
      ).toISOString(); // 30 minutes ago

      const hourAgoRecord = {
        _source: {
          '@timestamp': previousTimestamp3,
          balance: '100',
        },
      };

      const nowRecord = {
        _source: {
          '@timestamp': new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          balance: '100',
        },
      };

      mocks.getRecordsOfLastHour.mockResolvedValue([
        hourAgoRecord,
        {
          _source: {
            '@timestamp': previousTimestamp2,
            balance: '100',
          },
        },
        {
          _source: {
            '@timestamp': previousTimestamp1,
            balance: '100',
          },
        },
        nowRecord,
      ]);

      if (alert.messageType.slack) {
        await alert.messageType.slack(alert);
      }

      expect(mocks.getRecordsOfLastHour).toBeCalledTimes(1);
      expect(mocks.sendKinesisBalanceChangeErrorMessages).toBeCalledTimes(0);
      expect(mocks.sendKinesisBalanceChangeMessages).toBeCalledTimes(0);
    });
    it('should not send any messages when balane changed less than 10 %', async () => {
      const previousTimestamp3 = new Date(
        Date.now() - 60 * 60 * 1000,
      ).toISOString(); // 60 minutes ago
      const previousTimestamp2 = new Date(
        Date.now() - 45 * 60 * 1000,
      ).toISOString(); // 45 minutes ago
      const previousTimestamp1 = new Date(
        Date.now() - 30 * 60 * 1000,
      ).toISOString(); // 30 minutes ago

      const hourAgoRecord = {
        _source: {
          '@timestamp': previousTimestamp3,
          balance: 100,
        },
      };

      const nowRecord = {
        _source: {
          '@timestamp': new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          balance: 91,
        },
      };

      mocks.getRecordsOfLastHour.mockResolvedValue([
        hourAgoRecord,
        {
          _source: {
            '@timestamp': previousTimestamp2,
            balance: 100,
          },
        },
        {
          _source: {
            '@timestamp': previousTimestamp1,
            balance: 100,
          },
        },
        nowRecord,
      ]);

      if (alert.messageType.slack) {
        await alert.messageType.slack(alert);
      }

      expect(mocks.getRecordsOfLastHour).toBeCalledTimes(1);
      expect(mocks.sendKinesisBalanceChangeErrorMessages).toBeCalledTimes(0);
      expect(mocks.sendKinesisBalanceChangeMessages).toBeCalledTimes(0);
      expect(
        checkIfBalanceChangeAlert(
          hourAgoRecord._source.balance,
          nowRecord._source.balance,
        ),
      ).toBe(false);
    });

    it('should send error messages when now record timestamp is more than 20 minutes old', async () => {
      const previousTimestamp3 = new Date(
        Date.now() - 60 * 60 * 1000,
      ).toISOString(); // 60 minutes ago
      const previousTimestamp2 = new Date(
        Date.now() - 45 * 60 * 1000,
      ).toISOString(); // 45 minutes ago
      const previousTimestamp1 = new Date(
        Date.now() - 30 * 60 * 1000,
      ).toISOString(); // 30 minutes ago

      mocks.getRecordsOfLastHour.mockResolvedValue([
        {
          _source: {
            '@timestamp': previousTimestamp3,
            balance: '100',
          },
        },
        {
          _source: {
            '@timestamp': previousTimestamp2,
            balance: '100',
          },
        },
        {
          _source: {
            '@timestamp': previousTimestamp1,
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

      mocks.sendKinesisBalanceChangeErrorMessages.mockResolvedValue(
        'Error message sent',
      );

      if (alert.messageType.slack) {
        await alert.messageType.slack(alert);
      }

      expect(mocks.getRecordsOfLastHour).toBeCalledTimes(1);
      expect(mocks.sendKinesisBalanceChangeErrorMessages).toBeCalledTimes(1);
      expect(mocks.sendKinesisBalanceChangeMessages).toBeCalledTimes(0);
      expect(mocks.sendKinesisBalanceChangeErrorMessages).toBeCalledWith(
        alert,
        getMainNet(),
      );
    });
  });
});
