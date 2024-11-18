import type { IAccount, IChainAccount } from './constants';
import { MINBALANCE, faucetAccount } from './constants';
import { sendErrorMessage, sendMessage } from './messages';

export const lowFaucetChains = (
  chainAccounts: IChainAccount[] | undefined,
  minBalance: number,
): IChainAccount[] => {
  if (!chainAccounts?.length) return [];
  const lowChains = chainAccounts.filter(
    (chainAccount) => chainAccount.balance < minBalance,
  );

  return lowChains;
};

export const creatLowChainsString = (chains: IChainAccount[]) => {
  return chains
    .map((chain) => {
      return `*chain ${chain.chainId}:* (${chain.balance.toLocaleString()} KDA)`;
    })
    .join('\n');
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

export const runJob = async () => {
  try {
    const accountResult = await getFaucetAccount();

    if (accountResult?.errors?.length) {
      await sendErrorMessage();
      return;
    }

    if (
      !lowFaucetChains(
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
