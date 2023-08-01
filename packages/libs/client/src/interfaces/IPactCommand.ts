import { ChainId, ICap } from '@kadena/types';

/**
 * @alpha
 */
export interface IExecPayloadObject {
  // executable pact code
  exec: {
    code?: string;
    data?: Record<string, unknown>;
  };
}
/**
 * @alpha
 */
export interface IContinuationPayloadObject {
  cont: {
    pactId?: string;
    step?: number;
    rollback?: boolean;
    data?: Record<string, unknown>;
    proof?: string;
  };
}
/**
 * @alpha
 */
export type ICapabilityItem = ICap;

// TODO: update filed types based on @Kadena/types
/**
 * @alpha
 */
export interface IPactCommand {
  payload: IExecPayloadObject | IContinuationPayloadObject;
  // the builder will add all default values
  meta: {
    chainId: ChainId;
    sender?: string;
    gasLimit?: number;
    gasPrice?: number;
    ttl?: number;
    creationTime?: number;
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
