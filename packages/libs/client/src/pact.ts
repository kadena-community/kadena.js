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

export const getModule = (name: string) => {
  let code = name;
  const pr: any = new Proxy<any>(function () {} as unknown, {
    get(_, path: string) {
      code += '.' + path;
      return pr;
    },
    apply(_, thisArg, args) {
      const exp = createExp(code, ...args.map(parseType));
      code = name;
      return exp;
    },
  });
  return pr;
};

const pactCreator = (): IPact => {
  return new Proxy<any>({} as unknown, {
    get(_, path: string) {
      return getModule(path);
    },
  });
};

/**
 * @alpha
 */
export const Pact: IPact = {
  get modules() {
    return pactCreator();
  },
  // "any" just for now, we can remove it after updated the deceleration generator
} as any;
