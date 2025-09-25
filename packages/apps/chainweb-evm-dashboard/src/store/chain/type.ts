import { storeChainHandlers } from "./handlers";

export type ResolvedTypes = CounterStatsResponse | ChainStatsResponse | ChainMainResponse | ChainStatsLinesResponse;

export type Resolution = "YEAR" | "MONTH" | "WEEK" | "DAY";

export type ServiceId =
  | "accountsGrowth"
  | "activeAccounts"
  | "newAccounts"
  | "averageTxnFee"
  | "newTxns"
  | "txnsFee"
  | "txnsGrowth"
  | "txnsSuccessRate"
  | "averageBlockRewards"
  | "averageBlockSize"
  | "newBlocks"
  | "newNativeCoinTransfers"
  | "averageGasLimit"
  | "averageGasPrice"
  | "gasUsedGrowth"
  | "networkUtilization"
  | "averageGasUsed"
  | "contractsGrowth"
  | "newContracts"
  | "newVerifiedContracts"
  | "verifiedContractsGrowth"
  | "userOpsGrowth"
  | "newUserOps"
  | "newAccountAbstractionWallets"
  | "accountAbstractionWalletsGrowth"
  | "activeAccountAbstractionWallets"
  | "activeBundlers"
  | "activePaymasters";

type StatsData<T = string> = {
  id: string;
  value: T;
  title: string;
  units: string;
  description: string;
}

export type ChartMetaData = {
  id: ServiceId;
  title: string;
  description: string;
  units: string | null;
  resolutions: Resolution[];
};

export type CounterStatsResponse = {
  counters: Array<StatsData>;
}

export type ChainLineResponse = {
  sections: Array<{
    id: string;
    title: string;
    charts: ChartMetaData[];
  }>;
};

export type GraphChartData = {
  date: string;
  date_to: string;
  value: string | number;
  is_approximate?: boolean;
}

export type AccumulatedGraphChartData = GraphChartData & {
  dataPoints: {
    chainId: number;
    value: number;
  }[];
}

export type ChainStatsResponse = {
  average_block_time: number;
  coin_image: string | null;
  coin_price: number | null;
  coin_price_change_percentage: number | null;
  gas_price_updated_at: "2025-09-09T13:30:33.943688Z";
  gas_prices: {
    slow: number;
    average: number;
    fast: number
  };
  gas_prices_update_in: number;
  gas_used_today: string;
  market_cap: string;
  network_utilization_percentage: number;
  secondary_coin_image: string | null;
  secondary_coin_price: number | null;
  static_gas_price: number | null;
  total_addresses: string;
  total_blocks: string;
  total_gas_used: string;
  total_transactions: string;
  transactions_today: string;
  tvl: string | null;
}

export type ChainMainResponse = {
  average_block_time: StatsData<string>;
  total_addresses: StatsData<string>;
  total_blocks: StatsData<string>;
  total_transactions: StatsData<string>;
  yesterday_transactions: StatsData<string>;
  total_operational_transactions: null;
  yesterday_operational_transactions: null;
  op_stack_total_operational_transactions: null;
  op_stack_yesterday_operational_transactions: null;
  daily_new_transactions: {
    chart: Array<GraphChartData>;
    info: ChartMetaData;
  };
  daily_new_operational_transactions: null;
  op_stack_daily_new_operational_transactions: null;
};

export type ChainStatsLinesResponse = {
  chart: Array<GraphChartData>;
  info: ChartMetaData;
}

type TransactionFee = {
  type: "actual";
  value: string;
}

type AddressInfo = {
  ens_domain_name: string | null;
  hash: string;
  implementations: Array<{
    address_hash: string;
    name: string | null;
  }>;
  is_contract: boolean;
  is_scam: boolean;
  is_verified: boolean;
  metadata: any | null;
  name: string | null;
  private_tags: string[];
  proxy_type: string | null;
  public_tags: string[];
  watchlist_names: string[];
}

type TransactionItem = {
  priority_fee: string | null;
  raw_input: string;
  result: "success" | "out of gas";
  hash: string;
  max_fee_per_gas: string | null;
  revert_reason: string | null;
  confirmation_duration: [number, number];
  transaction_burnt_fee: string | null;
  type: number;
  token_transfers_overflow: any | null;
  confirmations: number;
  position: number;
  max_priority_fee_per_gas: string | null;
  transaction_tag: string | null;
  created_contract: any | null;
  value: string;
  from: AddressInfo;
  gas_used: string;
  status: "ok" | "error";
  to: AddressInfo;
  authorization_list: any[];
  method: string | null;
  fee: TransactionFee;
  actions: any[];
  gas_limit: string;
  gas_price: string;
  decoded_input: any | null;
  token_transfers: any | null;
  base_fee_per_gas: string;
  timestamp: string;
  nonce: number;
  historic_exchange_rate: any | null;
  transaction_types: string[];
  exchange_rate: any | null;
  block_number: number;
  has_error_in_internal_transactions: boolean;
}

type TransactionsNextPageParams = {
  block_number: number;
  index: number;
  items_count: number;
}

export type TransactionsResponse = {
  items: TransactionItem[];
  next_page_params: TransactionsNextPageParams;
}

type Miner = {
  ens_domain_name: string | null;
  hash: string;
  implementations: any[];
  is_contract: boolean;
  is_scam: boolean;
  is_verified: boolean;
  metadata: any | null;
  name: string | null;
  private_tags: any[];
  proxy_type: string | null;
  public_tags: any[];
  watchlist_names: any[];
}

type Reward = {
  reward: string;
  type: string;
}

type BlockItem = {
  base_fee_per_gas: string;
  burnt_fees: string;
  burnt_fees_percentage: number | null;
  difficulty: string;
  gas_limit: string;
  gas_target_percentage: number;
  gas_used: string;
  gas_used_percentage: number;
  hash: string;
  height: number;
  internal_transactions_count: number | null;
  miner: Miner;
  nonce: string;
  parent_hash: string;
  priority_fee: string;
  rewards: Reward[];
  size: number;
  timestamp: string;
  total_difficulty: any | null;
  transaction_fees: string;
  transactions_count: number;
  type: string;
  uncles_hashes: any[];
  withdrawals_count: number | null;
}

type BlocksNextPageParams = {
  block_number: number;
  items_count: number;
}

export type BlocksResponse = {
  items: BlockItem[];
  next_page_params: BlocksNextPageParams;
}

export type Chain = {
  id: number;
  metaData: {
    name: string;
    color: string;
    endpoint: {
      base: string;
      stats: string;
    };
    lastUpdated?: string;
    status?: 'online' | 'offline' | 'syncing';
  };
  stats?: {
    transactions?: {
      completedTxns: StatsData<number>;
      totalTxns: StatsData<number>;
      newTxns24h: StatsData<number>;
      pendingTxns30m: StatsData<number>;
      txnsFee24h: StatsData<number>;
      averageTxnFee24h: StatsData<number>;
      totalNativeCoinTransfers: StatsData<number>;
      totalUserOps: StatsData<number>;
    };
    blocks?: {
      averageBlockTime: StatsData<number>;
      totalBlocks: StatsData<number>;
    };
    accounts?: {
      totalAccounts: StatsData<number>;
      totalAccountAbstractionWallets: StatsData<number>;
    };
    contracts?: {
      lastNewContracts: StatsData<number>;
      lastNewVerifiedContracts: StatsData<number>;
      totalContracts: StatsData<number>;
      totalVerifiedContracts: StatsData<number>;
    };
    addresses?: {
      totalAddresses: StatsData<number>;
    };
    tokens?: {
      totalTokens: StatsData<number>;
    };
  };
  graphs?: {
    [key in ServiceId]: ChainStatsLinesResponse;
  }
}

export type Chains = {
  chains: Chain[];
}

export enum ActionType {
  LOAD_CHAIN_DATA = 'LOAD_CHAIN_DATA',
  SET_CHAIN_DATA = 'SET_CHAIN_DATA',
  RESET_CHAINS_DATA = 'RESET_CHAINS_DATA',
  RESET_CHAIN_DATA = 'RESET_CHAIN_DATA',
}

export type ChainUpdate = {
  id: number;
  metaData?: Partial<Chain['metaData']>;
  stats?: Record<string, StatsData>;
  graphs?: Record<ServiceId, ChainStatsLinesResponse>;
};

export type ChainActions = {
  entity: 'chain';
} & (
  | { type: ActionType.LOAD_CHAIN_DATA; }
  | { type: ActionType.SET_CHAIN_DATA; payload: ChainUpdate }
  | { type: ActionType.RESET_CHAINS_DATA; }
  | { type: ActionType.RESET_CHAIN_DATA; payload: { chainId: number } }
);

export type StoreHandlers = ReturnType<typeof storeChainHandlers>;
