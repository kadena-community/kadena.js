export interface PactToolboxNetworkApi {
  stop(): Promise<void>;
  start(): Promise<void>;
  restart(): Promise<void>;
  isOk(): Promise<boolean>;
  getServicePort(): number | string;
  isOnDemandMining(): boolean;
  getOnDemandUrl(): string;
  getServiceUrl(): string;
  id: number | string;
}
