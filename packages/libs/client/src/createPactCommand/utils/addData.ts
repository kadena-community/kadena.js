type ReadKeyset = <T extends string>(name: T) => `(read-keyset "${T}")`;

/**
 *
 * @alpha
 */
export const readKeyset: ReadKeyset = (name) => `(read-keyset "${name}")`;

/**
 *
 * @alpha
 */
export const addData = <
  T extends string,
  D extends object | string | number | boolean,
>(
  name: T,
  data: D,
): {
  payload: {
    exec: {
      data: {
        [key in T]: D;
      };
    };
  };
} => {
  return {
    payload: {
      exec: {
        data: {
          [name as string]: data,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      },
    },
  };
};

interface IAddKeyset {
  <NAME extends string, PRED extends 'keys-all' | 'keys-one' | 'keys-two'>(
    name: NAME,
    pred: PRED,
    ...publicKeys: string[]
  ): {
    payload: {
      exec: {
        data: {
          [key in NAME]: {
            publicKeys: string[];
            pred: PRED;
          };
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
      exec: {
        data: {
          [key in NAME]: {
            publicKeys: string[];
            pred: PRED;
          };
        };
      };
    };
  };
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
