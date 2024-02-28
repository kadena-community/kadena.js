import { addKeyset, execution } from '@kadena/client/fp';
import { pipe } from 'ramda';
import { dirtyReadClient } from '../core/client-helpers.js';
import type { IClientConfig } from '../core/utils/helpers.js';

/**
 * @alpha
 */
export interface ICreatePrincipalInput {
  keyset: {
    keys: string[];
    pred?: 'keys-all' | 'keys-2' | 'keys-any';
  };
}

/**
 * @alpha
 */
export const createPrincipal = async (
  inputs: ICreatePrincipalInput,
  config: Omit<IClientConfig, 'sign'>,
): Promise<string> => {
  const command = pipe(
    () => '(create-principal (read-keyset "ks"))',
    execution,
    addKeyset('ks', inputs.keyset.pred || 'keys-all', ...inputs.keyset.keys),
    dirtyReadClient(config),
  );
  return command().execute() as unknown as string;
};
