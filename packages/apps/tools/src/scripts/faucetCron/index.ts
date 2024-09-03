import dotenv from 'dotenv';
dotenv.config();

const channelId = process.env.SLACK_CHANNELID;
const tokenId = process.env.SLACK_TOKEN;
const faucetAccount = 'c:Ecwy85aCW3eogZUnIQxknH8tG8uXHM5QiC__jeI0nWA';
const minBalance = 1000;

interface IChainAccount {
  balance: number;
  chainId: string;
}

interface IAccount {
  data?: {
    fungibleAccount: {
      chainAccounts: IChainAccount[];
    };
  };
  errors?: { message: string }[];
}

export const lowFaucetChains = (
  chainAccounts?: IChainAccount[],
): IChainAccount[] => {
  if (!chainAccounts?.length) return [];
  const lowChains = chainAccounts.filter(
    (chainAccount) => chainAccount.balance < minBalance,
  );

  return lowChains;
};

const creatLowChainsString = (chains: IChainAccount[]) => {
  return chains
    .map((chain) => {
      return `*chain ${chain.chainId}:* (${chain.balance} KDA)`;
    })
    .join('\n');
};

const sendMessage = async (data: IAccount): Promise<void> => {
  const lowChains = lowFaucetChains(data.data?.fungibleAccount.chainAccounts);
  const result = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${tokenId}`,
    },
    body: JSON.stringify({
      channel: `${channelId}`,
      blocks: JSON.stringify([
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: 'Low Faucet alert! 🚨',
          },
        },
        {
          type: 'section',
          accessory: {
            type: 'image',
            image_url:
              'https://media.giphy.com/media/ZNnnp4wa17dZrDQKKI/giphy.gif?cid=790b7611li34xwh3ghrh6h6xwketcjop0mjayanqbp0n1enh&ep=v1_gifs_search&rid=giphy.gif&ct=g',
            alt_text: '',
          },
          text: {
            type: 'mrkdwn',
            text: `The faucet seems to be running low on funds (TESTNET):\n ${creatLowChainsString(lowChains)}`,
          },
        },

        // {
        //   type: 'actions',
        //   elements: [
        //     {
        //       type: 'button',
        //       text: {
        //         type: 'plain_text',
        //         text: 'Click Me',
        //       },
        //       url: 'https://google.com',
        //     },
        //   ],
        // },
      ]),
    }),
  });

  await result.json();
};
const sendErrorMessage = async (): Promise<void> => {
  const result = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${tokenId}`,
    },
    body: JSON.stringify({
      channel: `${channelId}`,
      blocks: JSON.stringify([
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'We were unable to retrieve the faucet account balance. \n There seems to be an issue with the Graph',
          },
        },
      ]),
    }),
  });

  await result.json();
};

const getFaucetAccount = async (): Promise<IAccount> => {
  const result = await fetch('https://graph.testnet.kadena.network/graphql', {
    method: 'POST',
    headers: {
      accept:
        'application/graphql-response+json, application/json, multipart/mixed',
      'cache-control': 'no-cache',
      'content-type': 'application/json',
      pragma: 'no-cache',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'cross-site',
    },
    body: JSON.stringify({
      query: `query faucet {
  fungibleAccount(accountName: "${faucetAccount}"){
    chainAccounts {
      balance
      chainId
    }
  }
}`,
      variables: {},
      operationName: 'faucet',
      extensions: {},
    }),
  });

  const data = (await result.json()) as IAccount;
  return data;
};

const runJob = async () => {
  const accountResult = await getFaucetAccount();

  if (accountResult?.errors?.length) {
    await sendErrorMessage();
    return;
  }

  if (
    !lowFaucetChains(accountResult.data?.fungibleAccount.chainAccounts).length
  )
    return;

  await sendMessage(accountResult);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
runJob();
