/* eslint-disable @kadena-dev/no-eslint-disable */
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IWrappedData<
  T extends any = any,
  N extends string | undefined = string | undefined,
> {
  name: N;
  inspect: true;
  data: T;
}

export type ExWrappedData<
  T extends any,
  N extends string | undefined,
> = T extends IWrappedData
  ? IWrappedData<UnwrappedData<T>, N>
  : IWrappedData<T, N>;

export type IsWrappedData<T> = T extends IWrappedData ? T : never;

export type UnwrappedData<T> =
  T extends IWrappedData<infer D, infer N>
    ? N extends string
      ? { [Key in N]: D }
      : D
    : T;

export type UnwrappedObjects<T> =
  T extends IWrappedData<infer D, infer N>
    ? N extends string
      ? { [Key in N]: D }
      : D extends {}
        ? D
        : never
    : never;

export interface IWrapData {
  <T, N extends string | undefined = undefined>(
    value: T,
    name?: N,
  ): ExWrappedData<T, N>;
}

export const isWrappedData = (result: any): result is IWrappedData =>
  Boolean(result) && typeof result === 'object' && Boolean(result.inspect);

export const unwrapData = <T>(value: T): UnwrappedData<T> => {
  if (!isWrappedData(value)) return value as any;

  const { data, name } = value;

  if (name !== undefined) {
    return { [name]: data } as any;
  }
  return data;
};

export const wrapData: IWrapData = (value: any, name?: string): any => {
  if (isWrappedData(value)) {
    return {
      inspect: true,
      data: unwrapData(value),
      name,
    };
  }

  return {
    inspect: true,
    data: value,
    name,
  };
};
