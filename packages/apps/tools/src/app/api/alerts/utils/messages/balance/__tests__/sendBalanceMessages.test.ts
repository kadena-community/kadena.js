import { CHAINS } from '@kadena/chainweb-node-client';
import type { IAlert } from '../../../constants';
import {
  ALERTCODES,
  channelId,
  faucetAccount,
  getTestNet,
  MESSAGETYPES,
  MINBALANCE,
} from '../../../constants';
import { sendBalanceMessages } from '../sendBalanceMessages';

const mocks = vi.hoisted(() => {
  return {
    fetch: vi.fn(),
  };
});

const network = getTestNet();
const alert: IAlert = {
  title: `Low Faucet alert! 🚨`,
  description: 'test',
  code: ALERTCODES.LOWFAUCETBALANCE,
  networks: [network],
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

describe('messages', () => {
  describe('sendBalanceMessages', () => {
    beforeEach(() => {
      vi.stubGlobal('fetch', mocks.fetch);
      const mocked = vi.fn(() => 0.1);
      Math.random = mocked;
    });

    afterEach(() => {
      vi.resetAllMocks();
    });

    it('should send the correct message with the correct chains', async () => {
      const chainAccounts = [
        { chainId: '0', balance: 500 },
        { chainId: '3', balance: 909 },
      ];

      await sendBalanceMessages(alert, chainAccounts, network);
      const body = JSON.parse(mocks.fetch.mock.calls[0][1].body) as any;
      expect(mocks.fetch).toBeCalledTimes(1);

      expect(body.blocks).toEqual(
        '[{"type":"header","text":{"type":"plain_text","text":"Low Faucet alert! 🚨"}},{"type":"section","accessory":{"type":"image","image_url":"https://media.giphy.com/media/ZNnnp4wa17dZrDQKKI/giphy.gif?cid=790b7611li34xwh3ghrh6h6xwketcjop0mjayanqbp0n1enh&ep=v1_gifs_search&rid=giphy.gif&ct=g","alt_text":"0.1"},"text":{"type":"mrkdwn","text":"The faucet (`c:Ecwy85aCW3eogZUnIQxknH8tG8uXHM5QiC__jeI0nWA`) seems to be running low on funds (testnet04):\\n *chain 0:* (500 KDA)\\n*chain 3:* (909 KDA)"}}]',
      );
    });
  });
});
