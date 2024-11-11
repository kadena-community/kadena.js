export const parsePactNumber = (value: number | string | object): number => {
  if (typeof value === 'number') return value;
  if (
    typeof value === 'object' &&
    'decimal' in value &&
    typeof value.decimal === 'string'
  ) {
    return parseFloat(value.decimal);
  }
  if (
    typeof value === 'object' &&
    'int' in value &&
    typeof value.int === 'string'
  ) {
    return parseInt(value.int, 10);
  }
  throw Error(`Failed to parse Pact number: "${value}"`);
};
