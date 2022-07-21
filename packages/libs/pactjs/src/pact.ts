import fetch from 'node-fetch';

import { Pact } from './pact-typing';

let expression: string = '';

const ThePact: Pact = new Proxy(function () {} as unknown as Pact, {
  get(_target, p, _receiver) {
    if (typeof p === 'string')
      if (expression.length !== 0) {
        expression += '.' + p;
      } else {
        expression += p;
      }
    return ThePact;
  },
  apply(target, that, args) {
    const final = `(${expression} ${args.map(parseTypes).join(' ')})`;
    expression = '';
    return {
      generate: () => final,
      call: () => fetch('https://ifconfig.co/ip'),
    };
  },
});

function parseTypes(arg) {
  switch (typeof arg) {
    case 'string':
      return `"${arg}"`;
    case 'number':
    case 'boolean':
      return arg;
  }
}

export { ThePact as Pact };
