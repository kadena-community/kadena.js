import { fetchAccount } from '@/utils/fetchAccount';
import { getMainNet } from '@/utils/network';
import { lowBalanceChains } from '../utils/lowBalanceChains';
import type { INETWORK } from './../constants';
import { GalxeAccount, MINXGALXEBALANCE } from './../constants';
import { sendErrorMessage, sendMessage } from './messages';

const checkMessages = async (network: INETWORK) => {
  const accountResult = await fetchAccount(network, GalxeAccount);

  console.log({ accountResult });
  if (accountResult?.errors?.length) {
    await sendErrorMessage(network);
    return;
  }

  const chain6 = accountResult.data?.fungibleAccount.chainAccounts.find(
    (chain: any) => chain.chainId === '6',
  );

  console.log({ chain6 });
  if (!chain6) {
    return;
  }

  const lowBalanceChainsResult = lowBalanceChains([chain6], MINXGALXEBALANCE);

  console.log({ lowBalanceChainsResult });
  if (!lowBalanceChainsResult.length) {
    return;
  }

  await sendMessage(accountResult, lowBalanceChainsResult, network);
};

export const runJob = async () => {
  console.log({ GalxeAccount, MINXGALXEBALANCE });

  const mainnet = getMainNet();
  console.log({ mainnet });
  if (!mainnet) return;

  await checkMessages(mainnet);
};
