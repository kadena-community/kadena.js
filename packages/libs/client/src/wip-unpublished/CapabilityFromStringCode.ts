interface IPact {
  modules: {
    coin: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transfer: () => string & { capability: (name: 'coin.TRANSFER') => any };
    };
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ModuleName<T> = T extends `(${infer MOD}.${infer FUNC} ${infer REST})`
  ? [MOD, FUNC]
  : never;

// @ts-ignore
type FunctionType<T> = IPact['modules'][ModuleName<T>[0]][ModuleName<T>[1]];

export type Transfer = FunctionType<'(coin.transfer )'>;
