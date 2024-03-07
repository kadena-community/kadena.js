import type { ChainId } from '@kadena/types';

/**
 * @public
 */
export interface INetworkOptions {
  networkId: string;
  chainId: ChainId;
}

/**
 * Options for any polling action on {@link IClient}
 * @public
 */
export interface IPollOptions {
  onPoll?: (id: string) => void;
  timeout?: number;
  interval?: number;
  confirmationDepth?: number;
}

/**
 * @public
 */
export type IPollRequestPromise<T> = Promise<Record<string, T>> & {
  requests: Record<string, Promise<T>>;
};
