import { execution } from '@kadena/client/fp';
import { pipe } from 'ramda';
import { z } from 'zod';
import { dirtyReadClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

/**
 * @alpha
 */
export const listModulesSchema = z.array(z.string());

/**
 * @alpha
 */
export type ListModulesOutput = z.infer<typeof listModulesSchema>;

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

  const executed = await command().execute();

  const parsed = listModulesSchema.parse(executed);

  return parsed;
};
