import { execution } from '@kadena/client/fp';
import { pipe } from 'ramda';
import { z } from 'zod';
import { dirtyReadClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

/**
 * @alpha
 */
export const describeModuleSchema = z.object({
  hash: z.string().optional(),
  blessed: z.array(z.string()).optional(),
  keyset: z.string().optional(),
  interfaces: z.array(z.string()).optional(),
  name: z.string(),
  code: z.string(),
});

/**
 * @alpha
 */
export type DescribeModuleOutput = z.infer<typeof describeModuleSchema>;

/**
 * @alpha
 */
export const describeModule = async (
  module: string,
  config: Omit<IClientConfig, 'sign'>,
): Promise<DescribeModuleOutput> => {
  const command = pipe(
    () => `(describe-module "${module}")`,
    execution,
    dirtyReadClient(config),
  );

  const executed = await command().execute();

  const parsed = describeModuleSchema.parse(executed);

  return parsed;
};
