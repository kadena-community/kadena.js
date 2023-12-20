import { execution } from '@kadena/client/fp';
import { pipe } from 'ramda';
import { dirtyReadClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

/**
 * @alpha
 */
export interface IDescribeModuleOutput {
  hash: string;
  blessed: string[];
  keyset: string;
  interfaces: string[];
  name: string;
  code: string;
}

/**
 * @alpha
 */
export const describeModule = async (
  module: string,
  config: Omit<IClientConfig, 'sign'>,
): Promise<IDescribeModuleOutput> => {
  const command = pipe(
    () => `(describe-module "${module}")`,
    execution,
    dirtyReadClient(config),
  );
  return command().execute() as unknown as IDescribeModuleOutput;
};
