import type { createClient } from '@kadena/client';

type HostGeneratorFn = Parameters<typeof createClient>[0];

export interface IUtilityFunctionOptions {
  networkId: string;
  senderAccount: string;
  chainId: string;
}

export interface IUtilityFunction<T> {
  (options: IUtilityFunctionOptions, apiHostGenerator?: HostGeneratorFn): T;
}
