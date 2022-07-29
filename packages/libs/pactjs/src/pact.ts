import { IPact } from './pact-typing';

import fetch from 'node-fetch';

let expression: string = '';

const ThePact: IPact = new Proxy(function () {} as unknown as IPact, {
  get(target: unknown, p: string): IPact {
    if (typeof p === 'string')
      if (expression.length !== 0) {
        expression += '.' + p;
      } else {
        expression += p;
      }
    return ThePact;
  },
  apply(target: unknown, that: unknown, args: Array<string | number | boolean>) {
    const final: string = `(${expression} ${args.map(parseType).join(' ')})`;
    expression = '';
    return {
      generate: () => final,
      call: () => fetch('https://ifconfig.co/ip'),
    };
  },
}) as IPact;

function parseType(arg: string | number | boolean): string | number | boolean {
  switch (typeof arg) {
    case 'string':
      return `"${arg}"`;
    case 'number':
    case 'boolean':
      return arg;
  }
}

export { ThePact as Pact };
