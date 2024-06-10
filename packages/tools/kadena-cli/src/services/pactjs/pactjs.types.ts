export interface INetworks {
  mainnet: { network: 'mainnet01'; api: 'api.chainweb.com' };
  testnet: {
    network: 'testnet04';
    api: 'api.testnet.chainweb.com';
  };
}

export interface IContractRetrievalParams {
  module: string;
  apiHost: string;
  chain: number | string;
  network: string;
}

export interface IContractRetrievalResult {
  code: string;
  error?: string;
}

export interface IContractGenerateOptions {
  clean?: boolean;
  capsInterface?: string;
  file?: string[];
  contract?: string[];
  namespace?: string;
  api?: string;
  chain?: number | string;
  network?: string;
  parseTreePath?: string;
}
