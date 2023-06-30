export interface IExecPayload {
  // executable pact code
  code: string;
  data?: Record<string, string | number>;
}

export interface IContinuationPayload {
  pactId?: string;
  step?: string;
  rollback?: boolean;
  data?: Record<string, string | number>;
  proof?: string;
}

export interface ICapabilityItem {
  name: string;
  // we need to add all options
  args: Array<any>;
}

// TODO: update filed types based on @Kadena/types
export interface ICommand {
  payload: IExecPayload | IContinuationPayload;
  meta: {
    chainId: string;
    sender: string;
    gasLimit: number;
    gasPrice: number;
    ttl: number;
    creationTime: number;
  };
  signers: Array<{
    pubKey: string;
    address?: string;
    scheme?: 'ED25519' | 'ETH';
    clist?: ICapabilityItem[];
  }>;
  networkId: string;
  nonce: string;
}
