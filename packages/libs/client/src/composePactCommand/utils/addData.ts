import type { IPactCommand } from '../../interfaces/IPactCommand';
import { patchCommand } from './patchCommand';

export type ValidDataTypes =
  | Record<string, unknown>
  | string
  | number
  | boolean
  | Array<ValidDataTypes>;

const getData = (cmd: Partial<IPactCommand>, key: string): unknown => {
  if (
    cmd.payload &&
    'exec' in cmd.payload &&
    cmd.payload.exec.data !== undefined
  ) {
    return cmd.payload.exec.data[key];
  }

  if (
    cmd.payload &&
    'cont' in cmd.payload &&
    cmd.payload.cont.data !== undefined
  ) {
    return cmd.payload.cont.data[key];
  }

  return undefined;
};

/**
 * Reducer to add `data` to the {@link IPactCommand.payload}
 * @throws DUPLICATED_KEY: "$\{key\}" is already available in the data
 *
 * @public
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
    if (getData(cmd, key) !== undefined) {
      throw new Error(
        `DUPLICATED_KEY: "${key}" is already available in the data`,
      );
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

export interface IAddKeyset {
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
