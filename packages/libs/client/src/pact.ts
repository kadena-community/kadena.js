import { createExp } from '@kadena/pactjs';

import {
  createTransactionBuilder,
  ITransactionBuilder,
} from './createTransactionBuilder/createTransactionBuilder';
import { parseAsPactValue } from './utils/parseAsPactValue';

/**
 * Interface that represents the generated Pact modules
 * @public
 */
export interface IPactModules {}

/**
 * Interface that represents the Pact object
 * @public
 */
export interface IPact {
  modules: IPactModules;
  builder: ITransactionBuilder;
}

/**
 * @internal
 */
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
 * The wrapper object that provides the Transaction builder and Contract interface
 * @public
 */
export const Pact: IPact = {
  /**
   * Generated modules
   */
  get modules() {
    return pactCreator();
  },
  /**
   * Transaction builder
   */
  get builder() {
    return createTransactionBuilder();
  },
};
