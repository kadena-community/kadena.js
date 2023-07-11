import slugify from 'slugify';

slugify.extend({
  '!': 'isNot',
  '&': 'bitwiseAnd',
  '<=': 'lessThanOrEqual',
  '>=': 'greaterThanOrEqual',
  '==': 'equal',
  '!=': 'notEqual',
  '===': 'strictEqual',
  '=': 'equal',
  '+': 'add',
  '-': 'subtract',
  '*': 'multiply',
  '/': 'divide',
  '^': 'power',
  '~': 'reverse',
  '|': 'bitwiseOr',
  '?': 'logical',
});

export const createSlug = (str?: string): string => {
  if (str === undefined) return '';

  return slugify(str, {
    lower: true,
    replacement: '-', // replace spaces with replacement character, defaults to `-`
    remove: /[^\w\s]+/g, // remove characters that match regex, defaults to `undefined`
  });
};
