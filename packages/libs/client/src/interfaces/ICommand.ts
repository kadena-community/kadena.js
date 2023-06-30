import { ICap } from '@kadena/types';

/**
 * @alpha
 */
export interface IExecPayload {
  // executable pact code
  code: string;
  data?: Record<string, string | number>;
}
/**
 * @alpha
 */
export interface IContinuationPayload {
  pactId?: string;
  step?: string;
  rollback?: boolean;
  data?: Record<string, string | number>;
  proof?: string;
}
/**
 * @alpha
 */
export type ICapabilityItem = ICap;

// TODO: update filed types based on @Kadena/types
/**
 * @alpha
 */
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
