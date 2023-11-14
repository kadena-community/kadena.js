import type { ChainId } from '@kadena/client';
import {
  addData,
  execution,
} from '@kadena/client/fp';
import { pipe } from 'ramda';
import { dirtyReadClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

interface ICreatePrincipalCommandInput {
  keyset: {
    keys: string[];
    pred: 'keys-all' | 'keys-two' | 'keys-one';
  };
  gasPayer: { account: string; publicKeys: string[] };
  chainId: ChainId;
}
/**
 * @alpha
 */
export const createPrincipalCommand = async (
  inputs: ICreatePrincipalCommandInput,
  config: Omit<IClientConfig, 'sign'>,
) =>
  pipe(
    () => '(create-principal (read-keyset "ks"))',
    execution,
    addData('ks', inputs.keyset),
    dirtyReadClient(config),
  );
