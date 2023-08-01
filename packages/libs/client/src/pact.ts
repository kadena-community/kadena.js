import { createExp } from '@kadena/pactjs';

import {
  createTransactionBuilder,
  ICommandBuilder,
} from './createTransactionBuilder/createTransactionBuilder';
import { parseAsPactValue } from './utils/parseAsPactValue';

/**
 * @alpha
 */
export interface IPactModules {}

/**
 * @alpha
 */
export interface IPact {
  modules: IPactModules;
  builder: ICommandBuilder;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getModule = (name: string): any => {
  let code = name;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pr: any = new Proxy<any>(function () {} as any, {
    get(target, path: string) {
      // dont add depact to the code
      if (path === 'defpact') return pr;
      code = `${code}.${path}`;
      return pr;
    },
    apply(target, thisArg, args) {
      const exp = createExp(code, ...args.map(parseAsPactValue));
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
  get builder() {
    return createTransactionBuilder();
  },
};
