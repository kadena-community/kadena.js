import type {
  ClientRequestInit,
  ICommandResult,
} from '@kadena/chainweb-node-client';
import type { ChainId } from '@kadena/types';

/**
 * @public
 */
export interface INetworkOptions {
  networkId: string;
  chainId: ChainId;
  type: 'local' | 'send' | 'poll' | 'listen' | 'spv';
}

/**
 * @alpha
 */
export type Milliseconds = number & { _brand?: 'milliseconds' };

/**
 * Options for any polling action on {@link IClient}
 * @public
 */
export interface IPollOptions extends ClientRequestInit {
  onPoll?: (id: string | undefined, error: any) => void;
  onResult?: (requestKey: string, result: ICommandResult) => void;
  timeout?: Milliseconds;
  interval?: Milliseconds;
  confirmationDepth?: number;
}

/**
 * @public
 */
export type IPollRequestPromise<T> = Promise<Record<string, T>>
