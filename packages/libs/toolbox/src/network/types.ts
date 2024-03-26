export type ConflictStrategy = 'error' | 'replace' | 'ignore';

export interface ToolboxNetworkStartOptions {
  silent?: boolean;
  isStateless?: boolean;
  conflict?: ConflictStrategy;
}
export interface ToolboxNetworkApi {
  stop: () => Promise<void>;
  start: (options?: ToolboxNetworkStartOptions) => Promise<void>;
  restart: (options?: ToolboxNetworkStartOptions) => Promise<void>;
  isOk: () => Promise<boolean>;
  getServicePort: () => number | string;
  isOnDemandMining: () => boolean;
  getOnDemandUrl: () => string;
  getServiceUrl: () => string;
  id: number | string;
}
