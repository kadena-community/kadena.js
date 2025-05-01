import { lowBalanceChains } from '@/scripts/utils/lowBalanceChains';
import type { IAccount } from '../../constants';
import { MINXCHAINGASSTATIONBALANCE, NETWORKS } from '../../constants';
import { sendErrorMessage, sendMessage } from '../messages';

const mocks = vi.hoisted(() => {
  return {
    fetch: vi.fn(),
  };
});

describe('galxe messages', () => {
  describe('sendErrorMessage', () => {
    beforeEach(() => {
      vi.stubGlobal('fetch', mocks.fetch);
    });

    afterEach(() => {
      vi.resetAllMocks();
    });

    it('should send the correct message', async () => {
      await sendErrorMessage(NETWORKS[1]);
      expect(mocks.fetch).toBeCalledTimes(1);
      expect(mocks.fetch.mock.calls[0][0]).toEqual(
        'https://slack.com/api/chat.postMessage',
      );
    });
  });
  describe('sendMessages', () => {
    beforeEach(() => {
      const mocked = vi.fn(() => 0.1);
      Math.random = mocked;
    });
    it('should send the correct message with the correct chains', async () => {
      const account = {
        data: {
          fungibleAccount: {
            chainAccounts: [{ chainId: '6', balance: 0.8 }],
          },
        },
      } as IAccount;

      await sendMessage(
        account,
        lowBalanceChains(
          [{ chainId: '6', balance: 0.8 }],
          MINXCHAINGASSTATIONBALANCE,
        ),
        NETWORKS[0],
      );
      const body = JSON.parse(mocks.fetch.mock.calls[0][1].body) as any;
      expect(mocks.fetch).toBeCalledTimes(1);

      expect(body.blocks).toEqual(
        '[{"type":"header","text":{"type":"plain_text","text":"Low GALXE account alert! ⛽️"}},{"type":"section","text":{"type":"mrkdwn","text":"The GalXe account (`k:c5bf4a3d7ca268ee359ae64b58ff87dd027a5e98e7e06b899fb91b8c44616339`) seems to be running low on funds (Hackachain MAINNET):\\n *chain 6:* (0.8 KDA)"}}]',
      );
    });
  });
});
