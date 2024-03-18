import type { ChainId } from '@kadena/types';

/**
 * @public
 */
export interface INetworkOptions {
  networkId: string;
  chainId: ChainId;
}

/**
 * @alpha
 */
export type Milliseconds = number & { _brand?: 'milliseconds' };

/**
 * Options for any polling action on {@link IClient}
 * @public
 */
export interface IPollOptions {
  onPoll?: (id: string) => void;
  timeout?: Milliseconds;
  interval?: Milliseconds;
  confirmationDepth?: number;
}

/**
 * @public
 */
export type IPollRequestPromise<T> = Promise<Record<string, T>> & {
  requests: Record<string, Promise<T>>;
};
