import { IPactCommand } from '../../interfaces/IPactCommand';

import { patchCommand } from './patchCommand';

export type ValidDataTypes =
  | Record<string, unknown>
  | string
  | number
  | boolean
  | Array<ValidDataTypes>;

/**
 *
 * @alpha
 */
export const addData: (
  key: string,
  value: ValidDataTypes,
) => (cmd: Partial<IPactCommand>) => Partial<IPactCommand> =
  (key: string, value: ValidDataTypes) =>
  (cmd: Partial<IPactCommand>): Partial<IPactCommand> => {
    let target: 'exec' | 'cont' = 'exec';
    if (cmd.payload && 'cont' in cmd.payload) {
      target = 'cont';
    }
    const patch: unknown = {
      payload: {
        [target]: {
          data: {
            [key as string]: value,
          },
        },
      },
    };
    return patchCommand(cmd, patch as Partial<IPactCommand>);
  };

interface IAddKeyset {
  <TKey extends string, PRED extends 'keys-all' | 'keys-one' | 'keys-two'>(
    key: TKey,
    pred: PRED,
    ...publicKeys: string[]
  ): (cmd: Partial<IPactCommand>) => Partial<IPactCommand>;

  <TKey extends string, PRED extends string>(
    key: TKey,
    pred: PRED,
    ...publicKeys: string[]
  ): (cmd: Partial<IPactCommand>) => Partial<IPactCommand>;
}

/**
 *
 * @alpha
 */
export const addKeyset: IAddKeyset = (
  name: string,
  pred: string,
  ...publicKeys: string[]
) => addData(name, { keys: publicKeys, pred });
