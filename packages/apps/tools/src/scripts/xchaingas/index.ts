import { fetchAccount } from '@/utils/fetchAccount';
import { lowBalanceChains } from '../utils/lowBalanceChains';
import type { INETWORK } from './../constants';
import {
  MINXCHAINGASSTATIONBALANCE,
  NETWORKS,
  xchainGasStationAccount,
} from './../constants';
import { sendErrorMessage, sendMessage } from './messages';

const checkMessages = async (network: INETWORK) => {
  const accountResult = await fetchAccount(network, xchainGasStationAccount);

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
