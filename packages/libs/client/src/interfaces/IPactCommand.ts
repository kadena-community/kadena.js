import { type ChainId, type ICap } from '@kadena/types';

/**
 * The payload of a Execution transaction
 * @public
 */
export interface IExecutionPayloadObject {
  // executable pact code
  exec: {
    code?: string;
    data?: Record<string, unknown>;
  };
}

/**
 * The payload of a Continuation transaction
 * @public
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
 * @beta
 * @deprecated Use {@link @kadena/types#ICap} instead
 */
export type ICapabilityItem = ICap;

// TODO: update filed types based on @Kadena/types
/**
 * The non-serialized transaction payload
 * @public
 */
export interface IPactCommand {
  payload: IExecutionPayloadObject | IContinuationPayloadObject;
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
    clist?: ICap[];
  }>;
  networkId: string;
  nonce: string;
}
