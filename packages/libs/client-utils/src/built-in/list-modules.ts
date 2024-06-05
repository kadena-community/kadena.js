import { execution } from '@kadena/client/fp';
import { pipe } from 'ramda';
import { dirtyReadClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

/**
 * @alpha
 */
export type ListModulesOutput = string[];

/**
 * @alpha
 */
export const listModules = async (
  config: Omit<IClientConfig, 'sign'>,
): Promise<ListModulesOutput> => {
  const command = pipe(
    () => `(list-modules)`,
    execution,
    dirtyReadClient(config),
  );

  return command().execute() as unknown as ListModulesOutput;
};
