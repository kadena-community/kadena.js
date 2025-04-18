import { lowBalanceChains } from '@/scripts/utils/lowBalanceChains';
import type { IAccount } from '../../constants';
import { MINXCHAINGASSTATIONBALANCE, NETWORKS } from '../../constants';
import { sendErrorMessage, sendMessage } from '../messages';

const mocks = vi.hoisted(() => {
  return {
    fetch: vi.fn(),
  };
});

describe('messages', () => {
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
            chainAccounts: [
              { chainId: '0', balance: 0.9 },
              { chainId: '2', balance: 0.8 },
            ],
          },
        },
      } as IAccount;

      await sendMessage(
        account,
        lowBalanceChains(
          account.data?.fungibleAccount.chainAccounts,
          MINXCHAINGASSTATIONBALANCE,
        ),
        NETWORKS[0],
      );
      const body = JSON.parse(mocks.fetch.mock.calls[0][1].body) as any;
      expect(mocks.fetch).toBeCalledTimes(1);

      expect(body.blocks).toEqual(
        '[{"type":"header","text":{"type":"plain_text","text":"Low XCHAIN GASSTATION alert! ⛽️"}},{"type":"section","accessory":{"type":"image","image_url":"https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzdmOHF0dmw2a3VvMTFicjRxd2lrYm84NHBuZGkzYWN1OHBvaHBzZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Q533vkOYUF5LSyprvd/giphy.gif","alt_text":"0.1"},"text":{"type":"mrkdwn","text":"The XChain GasStation (`kadena-xchain-gas`) seems to be running low on funds (Hackachain MAINNET):\\n *chain 0:* (0.9 KDA)\\n*chain 2:* (0.8 KDA)"}}]',
      );
    });
  });
});
