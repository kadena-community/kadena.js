import { CHAINS } from '@kadena/chainweb-node-client';
import {
  ALERTCODES,
  channelId,
  faucetAccount,
  getTestNet,
  MESSAGETYPES,
  MINBALANCE,
} from '../../../constants';
import { sendBalanceErrorMessages } from '../sendBalanceErrorMessages';

const mocks = vi.hoisted(() => {
  return {
    fetch: vi.fn(),
  };
});

const network = getTestNet();
const alert = {
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
};

describe('messages', () => {
  describe('sendErrorMessage', () => {
    beforeEach(() => {
      vi.stubGlobal('fetch', mocks.fetch);
    });

    afterEach(() => {
      vi.resetAllMocks();
    });

    it('should send the correct message', async () => {
      await sendBalanceErrorMessages(alert, network);
      expect(mocks.fetch).toBeCalledTimes(1);
      expect(mocks.fetch.mock.calls[0][0]).toEqual(
        'https://slack.com/api/chat.postMessage',
      );
    });
  });
});
