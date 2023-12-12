import type { TPredicate } from '@kadena/types';
import type { IPartialPactCommand } from '../../interfaces/IPactCommand';
import { patchCommand } from './patchCommand';

export type ValidDataTypes =
  | Record<string, unknown>
  | string
  | number
  | boolean
  | Array<ValidDataTypes>;

const getData = (cmd: IPartialPactCommand, key: string): unknown => {
  if (
    cmd.payload &&
    'exec' in cmd.payload &&
    cmd.payload.exec?.data !== undefined
  ) {
    return cmd.payload.exec.data[key];
  }

  if (
    cmd.payload &&
    'cont' in cmd.payload &&
    cmd.payload.cont?.data !== undefined
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
) => (cmd: IPartialPactCommand) => IPartialPactCommand =
  (key: string, value: ValidDataTypes) =>
  (cmd: IPartialPactCommand): IPartialPactCommand => {
    let target: 'exec' | 'cont' = 'exec';
    if (cmd.payload && 'cont' in cmd.payload) {
      target = 'cont';
    }
    if (getData(cmd, key) !== undefined) {
      throw new Error(
        `DUPLICATED_KEY: "${key}" is already available in the data`,
      );
    }
    const patch = {
      payload: {
        [target]: {
          data: {
            [key as string]: value,
          },
        },
      },
    } as IPartialPactCommand;
    return patchCommand(cmd, patch);
  };

export interface IAddKeyset {
  <TKey extends string, PRED extends TPredicate>(
    key: TKey,
    pred: PRED,
    ...publicKeys: string[]
  ): (cmd: IPartialPactCommand) => IPartialPactCommand;
}
