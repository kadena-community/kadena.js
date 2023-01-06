import { builder } from '../builder';

export default builder.queryField('hello', (t) =>
  t.string({
    args: {
      name: t.arg.string(),
    },
    resolve: (parent, { name }) => `hello, ${name || 'World'}`,
  }),
);
