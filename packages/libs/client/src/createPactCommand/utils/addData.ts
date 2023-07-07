import { IPactCommand } from '../../interfaces/IPactCommand';

type ReadKeyset = <T extends string>(name: T) => `(read-keyset "${T}")`;

/**
 *
 * @alpha
 */
export const readKeyset: ReadKeyset = (name) => `(read-keyset "${name}")`;

type AddDataReturnValue<TCmd, TKey extends string, TValue> = TCmd extends {
  payload: { cont: unknown };
}
  ? {
      payload: {
        cont: {
          data: {
            [key in TKey]: TValue;
          };
        };
      };
    }
  : {
      payload: {
        exec: {
          data: {
            [key in TKey]: TValue;
          };
        };
      };
    };

/**
 *
 * @alpha
 */
export const addData =
  <
    TKey extends string,
    TValue extends Record<string, unknown> | string | number | boolean,
  >(
    key: TKey,
    value: TValue,
  ): (<TCmd extends Partial<IPactCommand>>(
    cmd: TCmd,
  ) => AddDataReturnValue<TCmd, TKey, TValue>) =>
  <TCmd extends Partial<IPactCommand>>(
    cmd: TCmd,
  ): AddDataReturnValue<TCmd, TKey, TValue> => {
    let target = 'exec';
    if (cmd.payload && 'cont' in cmd.payload) {
      target = 'cont';
    }
    return {
      payload: {
        [target]: {
          data: {
            [key as string]: value,
          },
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
  };

interface IAddKeyset {
  <TKey extends string, PRED extends 'keys-all' | 'keys-one' | 'keys-two'>(
    key: TKey,
    pred: PRED,
    ...publicKeys: string[]
  ): <TCmd extends Partial<IPactCommand>>(
    cmd: TCmd,
  ) => AddDataReturnValue<TCmd, TKey, { publicKeys: string[]; pred: PRED }>;

  <TKey extends string, PRED extends string>(
    key: TKey,
    pred: PRED,
    ...publicKeys: string[]
  ): <TCmd extends Partial<IPactCommand>>(
    cmd: TCmd,
  ) => AddDataReturnValue<TCmd, TKey, { publicKeys: string[]; pred: PRED }>;
}

/**
 *
 * @alpha
 */
export const addKeyset: IAddKeyset = (
  name: string,
  pred: 'keys-all' | 'keys-one' | 'keys-two' | string,
  ...publicKeys: string[]
) => addData(name, { publicKeys, pred });
