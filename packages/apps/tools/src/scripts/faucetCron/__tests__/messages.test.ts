import type { IAccount } from '../constants';
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
      await sendErrorMessage();
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
              { chainId: '0', balance: 500 },
              { chainId: '2', balance: 1000 },
              { chainId: '3', balance: 909 },
              { chainId: '19', balance: 112000 },
            ],
          },
        },
      } as IAccount;

      await sendMessage(account);
      const body = JSON.parse(mocks.fetch.mock.calls[0][1].body);
      expect(mocks.fetch).toBeCalledTimes(1);
      expect(body).toEqual({
        blocks:
          '[{"type":"header","text":{"type":"plain_text","text":"Low Faucet alert! 🚨"}},{"type":"section","accessory":{"type":"image","image_url":"https://media.giphy.com/media/ZNnnp4wa17dZrDQKKI/giphy.gif?cid=790b7611li34xwh3ghrh6h6xwketcjop0mjayanqbp0n1enh&ep=v1_gifs_search&rid=giphy.gif&ct=g","alt_text":"0.1"},"text":{"type":"mrkdwn","text":"The faucet seems to be running low on funds (TESTNET):\\n *chain 0:* (500 KDA)\\n*chain 2:* (1000 KDA)\\n*chain 3:* (909 KDA)"}}]',
        channel: 'C07KYLJ92E4',
      });
    });
  });
});
