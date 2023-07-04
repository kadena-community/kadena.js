import { payload } from './payload';

type ReadKeyset = <T extends string>(name: T) => `(read-keyset "${T}")`;

export const readKeyset: ReadKeyset = (name) => `(read-keyset "${name}")`;

interface IAddKeyset {
  <NAME extends string, PRED extends 'keys-all' | 'keys-one' | 'keys-two'>(
    name: NAME,
    pred: PRED,
    ...publicKeys: string[]
  ): {
    payload: {
      data: {
        [key in NAME]: {
          publicKeys: string[];
          pred: PRED;
        };
      };
    };
  };

  <NAME extends string, PRED extends string>(
    name: NAME,
    pred: PRED,
    ...publicKeys: string[]
  ): {
    payload: {
      data: {
        [key in NAME]: {
          publicKeys: string[];
          pred: PRED;
        };
      };
    };
  };
}

export const addKeyset: IAddKeyset = (
  name: string,
  pred: 'keys-all' | 'keys-one' | 'keys-two' | string,
  ...publicKeys: string[]
) => {
  return {
    payload: {
      data: {
        [name]: {
          publicKeys,
          pred,
        },
      },
    },
  };
};

export const addData = <T extends string, D extends any>(
  name: T,
  data: D,
): {
  payload: {
    data: {
      [key in T]: D;
    };
  };
} => ({
  payload: {
    data: {
      [name as string]: data,
    } as any,
  },
});
