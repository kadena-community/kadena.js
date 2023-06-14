import { createExp } from '@kadena/pactjs';

import { parseType } from './utils/parseType';
import { ContCommand } from './contPact';
import { IPact, PactCommand } from './pact';

import { log } from 'debug';

const pactCreator = (): IPact => {
  let code = '';
  const ThePact: IPact = new Proxy(function () {} as unknown as IPact, {
    get(target: unknown, p: string): IPact {
      log('get', p);
      if (typeof p === 'string')
        if (code.length !== 0) {
          code += '.' + p;
        } else {
          code += p;
        }
      return ThePact;
    },
    apply(
      target: unknown,
      that: unknown,
      args: Array<string | number | boolean>,
    ) {
      if (code.endsWith('.cont')) {
        const transaction: ContCommand = new ContCommand(
          ...(args as [string, number, string, boolean]),
        );
        return transaction;
      }
      // when the expression is called, finalize the call
      // e.g.: `Pact.modules.coin.transfer(...someArgs)`
      const transaction: PactCommand = new PactCommand();
      code = code.replace('.exec', '');
      log('apply', args);
      transaction.code = createExp(code, ...args.map(parseType));
      return transaction;
    },
  }) as IPact;
  return ThePact;
};

/**
 * @alpha
 */
export const Pact: IPact = {
  get modules() {
    return pactCreator();
  },
};
