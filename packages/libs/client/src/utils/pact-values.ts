import { PactNumber } from '@kadena/pactjs';
import { IPactDecimal, IPactInt } from '@kadena/types';

type ReadKeyset = <TKey extends string>(
  key: TKey,
) => () => `(read-keyset "${TKey}")`;

/**
 *
 * @alpha
 */
export const readKeyset: ReadKeyset = (key) => () => `(read-keyset "${key}")`;

/**
 *
 * @alpha
 */
export const reference: <T extends string>(value: T) => () => T =
  (value) => () =>
    value;

/**
 *
 * @alpha
 */
export const decimal = (value: string): IPactDecimal => {
  return new PactNumber(value).toPactDecimal();
};

/**
 *
 * @alpha
 */
export const integer = (value: string): IPactInt => {
  return new PactNumber(value).toPactInteger();
};
