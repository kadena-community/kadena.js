import { ChainId } from '@kadena/types';

/**
 * @alpha
 */
export interface INetworkOptions {
  networkId: string;
  chainId: ChainId;
}

/**
 * @alpha
 */
export interface IPollOptions {
  onPoll?: (id: string) => void;
  timeout?: number;
  interval?: number;
}

/**
 * @alpha
 */
export interface ILocalOptions {
  preflight?: boolean;
  signatureValidation?: boolean;
}

/**
 * @alpha
 */
export type IPollRequestPromise<T> = Promise<Record<string, T>> & {
  requests: Record<string, Promise<T>>;
};
