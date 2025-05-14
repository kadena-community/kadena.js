import { fetchAccount } from '@/utils/fetchAccount';
import { getTestNet } from '@/utils/network';
import { lowBalanceChains } from '../utils/lowBalanceChains';
import { MINBALANCE, faucetAccount } from './../constants';
import { sendErrorMessage, sendMessage } from './messages';

export const runJob = async () => {
  try {
    const accountResult = await fetchAccount(getTestNet(), faucetAccount);

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
