import { lowBalanceChains } from '../utils/lowBalanceChains';
import type { IAccount, INETWORK } from './../constants';
import {
  MINXCHAINGASSTATIONBALANCE,
  NETWORKS,
  xchainGasStationAccount,
} from './../constants';
import { sendErrorMessage, sendMessage } from './messages';

const getXchainGasStationAccount = async (
  network: INETWORK,
): Promise<IAccount> => {
  const result = await fetch(network.url, {
    method: 'POST',
    headers: {
      accept:
        'application/graphql-response+json, application/json, multipart/mixed',
      'cache-control': 'no-cache',
      'content-type': 'application/json',
      pragma: 'no-cache',
      'x-api-key': process.env.HACKACHAIN_APIKEY ?? '',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'cross-site',
    },
    body: JSON.stringify({
      query: `query xchain {
  fungibleAccount(accountName: "${xchainGasStationAccount}"){
    chainAccounts {
      balance
      chainId
    }
  }
}`,
      variables: {},
      operationName: 'xchain',
      extensions: {},
    }),
  });

  const data = (await result.json()) as IAccount;
  return data;
};

const checkMessages = async (network: INETWORK) => {
  const accountResult = await getXchainGasStationAccount(network);

  if (accountResult?.errors?.length) {
    await sendErrorMessage(network);
    return;
  }

  const lowBalanceChainsResult = lowBalanceChains(
    accountResult.data?.fungibleAccount.chainAccounts,
    MINXCHAINGASSTATIONBALANCE,
  );

  if (!lowBalanceChainsResult.length) {
    return;
  }

  await sendMessage(accountResult, lowBalanceChainsResult, network);
};

export const runJob = async () => {
  const promises = NETWORKS.map((network) => checkMessages(network));

  await Promise.allSettled(promises);
};
