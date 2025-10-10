import { SWRConfiguration } from "swr/_internal";
import {ServiceItem} from "./types";

export const composeEndpoint = (baseUrl: string, chainId: number): string => {
  return baseUrl.replace('${chainId}', chainId.toString());
};

export const fetcher = async (url: string) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw error;
  }
};

const fullDayInMs = 24 * 60 * 60 * 1000;

export const enabledChainIds = [20, 21, 22, 23, 24];
export const enabledServices: Array<ServiceItem> = [
  { id: 'accountsGrowth', url: `/api/v1/lines/accountsGrowth`, isStatsLine: true },
  { id: 'activeAccounts', url: `/api/v1/lines/activeAccounts`, isStatsLine: true },
  { id: 'newAccounts', url: `/api/v1/lines/newAccounts`, isStatsLine: true },
  { id: 'averageTxnFee', url: `/api/v1/lines/averageTxnFee`, isStatsLine: true },
  { id: 'newTxns', url: `/api/v1/lines/newTxns`, isStatsLine: true },
  { id: 'txnsFee', url: `/api/v1/lines/txnsFee`, isStatsLine: true },
  { id: 'txnsGrowth', url: `/api/v1/lines/txnsGrowth`, isStatsLine: true },
  { id: 'txnsSuccessRate', url: `/api/v1/lines/txnsSuccessRate`, isStatsLine: true },
  { id: 'averageBlockRewards', url: `/api/v1/lines/averageBlockRewards`, isStatsLine: true },
  { id: 'averageBlockSize', url: `/api/v1/lines/averageBlockSize`, isStatsLine: true },
  { id: 'newBlocks', url: `/api/v1/lines/newBlocks`, isStatsLine: true },
  { id: 'newNativeCoinTransfers', url: `/api/v1/lines/newNativeCoinTransfers`, isStatsLine: true },
  { id: 'averageGasLimit', url: `/api/v1/lines/averageGasLimit`, isStatsLine: true },
  { id: 'averageGasPrice', url: `/api/v1/lines/averageGasPrice`, isStatsLine: true },
  { id: 'gasUsedGrowth', url: `/api/v1/lines/gasUsedGrowth`, isStatsLine: true },
  { id: 'networkUtilization', url: `/api/v1/lines/networkUtilization`, isStatsLine: true },
  { id: 'averageGasUsed', url: `/api/v1/lines/averageGasUsed`, isStatsLine: true },
  { id: 'contractsGrowth', url: `/api/v1/lines/contractsGrowth`, isStatsLine: true },
  { id: 'newContracts', url: `/api/v1/lines/newContracts`, isStatsLine: true },
  { id: 'newVerifiedContracts', url: `/api/v1/lines/newVerifiedContracts`, isStatsLine: true },
  { id: 'verifiedContractsGrowth', url: `/api/v1/lines/verifiedContractsGrowth`, isStatsLine: true },
  { id: 'userOpsGrowth', url: `/api/v1/lines/userOpsGrowth`, isStatsLine: true },
  { id: 'newUserOps', url: `/api/v1/lines/newUserOps`, isStatsLine: true },
  { id: 'newAccountAbstractionWallets', url: `/api/v1/lines/newAccountAbstractionWallets`, isStatsLine: true },
  { id: 'accountAbstractionWalletsGrowth', url: `/api/v1/lines/accountAbstractionWalletsGrowth`, isStatsLine: true },
  { id: 'activeAccountAbstractionWallets', url: `/api/v1/lines/activeAccountAbstractionWallets`, isStatsLine: true },
  { id: 'activeBundlers', url: `/api/v1/lines/activeBundlers`, isStatsLine: true },
  { id: 'activePaymasters', url: `/api/v1/lines/activePaymasters`, isStatsLine: true },
];

export const chainOptions: Partial<SWRConfiguration> = {
  refreshInterval: fullDayInMs,
  focusThrottleInterval: fullDayInMs,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  dedupingInterval: fullDayInMs,
  errorRetryCount: 3,
  errorRetryInterval: 30000,
  revalidateOnMount: true,
};
