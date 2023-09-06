import { builder } from '../builder';
import type { Debugger } from 'debug';
import _debug from 'debug';

const log: Debugger = _debug('graph:Query:hello');

export default builder.queryField('hello', (t) =>
  t.string({
    args: {
      name: t.arg.string(),
    },
    resolve: (__parent, { name = 'World' }) => `hello, ${name}`,
  }),
);
