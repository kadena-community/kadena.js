export interface PactToolboxNetworkApiLike {
  getServiceUrl(): string;
  getOnDemandUrl(): string;
  isOnDemandMining(): boolean;
  restart(): Promise<void>;
}
