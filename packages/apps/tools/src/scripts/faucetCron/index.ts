import { lowBalanceChains } from '../utils/lowBalanceChains';
import type { IAccount, INETWORK } from './../constants';
import { MINBALANCE, NETWORKS, faucetAccount } from './../constants';
import { sendErrorMessage, sendMessage } from './messages';

const getHackachainTestnet = (): INETWORK => {
  return NETWORKS.find((network) => network.key === 'TESTNET') ?? NETWORKS[1];
};

const getFaucetAccount = async (): Promise<IAccount> => {
  const result = await fetch(getHackachainTestnet().url, {
    method: 'POST',
    headers: {
      accept:
        'application/graphql-response+json, application/json, multipart/mixed',
      'cache-control': 'no-cache',
      'content-type': 'application/json',
      'x-api-key': process.env.HACKACHAIN_APIKEY ?? '',
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

export const runJob = async () => {
  try {
    const accountResult = await getFaucetAccount();

    if (accountResult?.errors?.length) {
      await sendErrorMessage();
      return;
    }

    if (
      !lowBalanceChains(
        accountResult.data?.fungibleAccount.chainAccounts,
        MINBALANCE,
      ).length
    ) {
      // atm we dont want a ping
      // await sendPingMessage();
      return;
    }

    await sendMessage(accountResult);
  } catch (e) {
    await sendErrorMessage();
  }
};
