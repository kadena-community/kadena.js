import {toNumber} from "../../utils/number";
import { Chain, ChainStatsLinesResponse, ChainUpdate, ServiceId } from "./type";

export function processStats(data: ChainUpdate['stats']): Chain['stats'] {
  if (!data) {
    return undefined;
  }

  return {
    transactions: {
      averageTxnFee24h: {
        ...data.averageTxnFee24h,
        value: toNumber(data.averageTxnFee24h.value) ?? 0,
      },
      completedTxns: {
        ...data.completedTxns,
        value: toNumber(data.completedTxns.value) ?? 0,
      },
      newTxns24h: {
        ...data.newTxns24h,
        value: toNumber(data.newTxns24h.value) ?? 0,
      },
      pendingTxns30m: {
        ...data.pendingTxns30m,
        value: toNumber(data.pendingTxns30m.value) ?? 0,
      },
      totalNativeCoinTransfers: {
        ...data.totalNativeCoinTransfers,
        value: toNumber(data.totalNativeCoinTransfers.value) ?? 0,
      },
      totalTxns: {
        ...data.totalTxns,
        value: toNumber(data.totalTxns.value) ?? 0,
      },
      totalUserOps: {
        ...data.totalUserOps,
        value: toNumber(data.totalUserOps.value) ?? 0,
      },
      txnsFee24h: {
        ...data.txnsFee24h,
        value: toNumber(data.txnsFee24h.value) ?? 0,
      },
    },
    blocks: {
      averageBlockTime: {
        ...data.averageBlockTime,
        value: toNumber(data.averageBlockTime.value) ?? 0,
      },
      totalBlocks: {
        ...data.totalBlocks,
        value: toNumber(data.totalBlocks.value) ?? 0,
      },
    },
    accounts: {
      totalAccounts: {
        ...data.totalAccounts,
        value: toNumber(data.totalAccounts.value) ?? 0,
      },
      totalAccountAbstractionWallets: {
        ...data.totalAccountAbstractionWallets,
        value: toNumber(data.totalAccountAbstractionWallets.value) ?? 0,
      },
    },
    contracts: {
      lastNewContracts: {
        ...data.lastNewContracts,
        value: toNumber(data.lastNewContracts.value) ?? 0,
      },
      lastNewVerifiedContracts: {
        ...data.lastNewVerifiedContracts,
        value: toNumber(data.lastNewVerifiedContracts.value) ?? 0,
      },
      totalContracts: {
        ...data.totalContracts,
        value: toNumber(data.totalContracts.value) ?? 0,
      },
      totalVerifiedContracts: {
        ...data.totalVerifiedContracts,
        value: toNumber(data.totalVerifiedContracts.value) ?? 0,
      },
    },
    addresses: {
      totalAddresses: {
        ...data.totalAddresses,
        value: toNumber(data.totalAddresses.value) ?? 0,
      },
    },
    tokens: {
      totalTokens: {
        ...data.totalTokens,
        value: toNumber(data.totalTokens.value) ?? 0,
      },
    },
  };
}

export function processStatsLine(data: ChainUpdate['graphs']): Chain['graphs'] {
  if (!data) {
    return undefined;
  }

  return Object.keys(data).reduce((acc, key) => {
    const parsedData = data[key as ServiceId];

    acc[key as ServiceId] = {
      ...parsedData,
      chart: parsedData.chart.map(point => {
        point.value = toNumber(point.value) ?? 0;

        return point;
      }),
    };

    return acc;
  }, {} as Record<ServiceId, ChainStatsLinesResponse>);
}
