import type { IPactDecimal, IPactInt } from '@kadena/types';

export const isObject = (obj: unknown): obj is Record<string, unknown> => {
  return typeof obj === 'object' && obj !== null;
};

export const hasField = <T extends string>(
  obj: Record<string, unknown>,
  field: T,
): obj is Record<T, unknown> => {
  return field in obj;
};

/**
 *
 * @param arg - the argument to check
 * @returns boolean
 * @public
 */
export const isIPactDecimal = (arg: unknown): arg is IPactDecimal =>
  isObject(arg) && hasField(arg, 'decimal') && typeof arg.decimal === 'string';

/**
 *
 * @param arg - the argument to check
 * @returns boolean
 * @public
 */
export const isIPactInt = (arg: unknown): arg is IPactInt =>
  isObject(arg) && hasField(arg, 'int') && typeof arg.int === 'string';
