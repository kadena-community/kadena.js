import { createExp } from '@kadena/pactjs';

import { parseType } from './utils/parseType';

/**
 * @alpha
 */
export interface IPactModules {}

/**
 * @alpha
 */
export interface IPact {
  modules: IPactModules;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getModule = (name: string): any => {
  let code = name;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pr: any = new Proxy<any>(function () {} as any, {
    get(target, path: string) {
      code = `${code}.${path}`;
      return pr;
    },
    apply(target, thisArg, args) {
      const exp = createExp(code, ...args.map(parseType));
      code = name;
      return exp;
    },
  });
  return pr;
};

const pactCreator = (): IPact => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Proxy<any>(
    {},
    {
      get(target, path: string) {
        return getModule(path);
      },
    },
  );
};

/**
 * @alpha
 */
export const Pact: IPact = {
  get modules() {
    return pactCreator();
  },
  // "any" just for now, we can remove it after updated the deceleration generator
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;
