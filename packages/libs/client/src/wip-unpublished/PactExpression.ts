import { createExp } from '@kadena/pactjs';

import { parseAsPactValue } from '../utils/parseAsPactValue';

export interface IPactModules {}
export type IPactBuilder = {
  generate(): string;
} & IPactModules;

export function PactExpression(): IPactBuilder {
  let expression: string = '';
  const path: string[] = [];
  const args: (string | number)[] = [];
  const builder: IPactBuilder = new Proxy(
    function () {} as unknown as IPactBuilder,
    {
      get(target: unknown, prop: string, receiver: unknown) {
        if (prop === 'generate') {
          expression = createExp(path.join('.'), ...args.map(parseAsPactValue));
          return () => expression;
        }
        path.push(prop);
        return builder;
      },
      apply(target: unknown, thisArg: unknown, argArray: (string | number)[]) {
        args.push(...argArray);
        return builder;
      },
    },
  ) as IPactBuilder;

  return builder;
}
